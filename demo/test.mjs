// test.mjs - 金手勺 5 张锅包肉券抽奖逻辑测试
// 测试内容：5 张券数据 + 加权随机 + 保底 + 老虎机布局 + 每日限次
// 用 Node 22+ 的 assert / node:test 跑
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  COUPONS, ARC_ORDER, TIER_SCALE, POSITION_TIER, ARC_POSITIONS, TRACK_POSITIONS,
  SLOT_TOTAL_CARDS, SLOT_WINNER_INDEX, RARE_WEIGHT_THRESHOLD,
  DAILY_FREE_DRAWS, PITY_THRESHOLD,
  weightedPick, PityCounter, DailyLimit, SlotLayout,
} from './game.js';

// ===== 1. 数据完整性 =====
test('COUPONS: 5 张锅包肉券', () => {
  assert.equal(COUPONS.length, 5);
  const ids = COUPONS.map(c => c.id);
  assert.deepEqual(ids.sort(), ['C1', 'C2', 'C3', 'C4', 'C5']);
});

test('COUPONS: 每张都有 name/discount/prob/weight/rare', () => {
  for (const c of COUPONS) {
    assert.ok(c.name, `${c.id} 缺 name`);
    assert.ok(c.discount, `${c.id} 缺 discount`);
    assert.ok(c.prob > 0, `${c.id} 缺 prob`);
    assert.ok(c.weight > 0, `${c.id} 缺 weight`);
    assert.ok(typeof c.rare === 'boolean', `${c.id} 缺 rare`);
  }
});

test('COUPONS: 5 折必须是 C5（最高优惠在中央）', () => {
  const c5 = COUPONS.find(c => c.id === 'C5');
  assert.equal(c5.discount, '5折', '5 折必须是 C5');
  assert.equal(c5.rare, true, 'C5 必须是 rare');
});

test('COUPONS: 概率总和 = 100%', () => {
  const total = COUPONS.reduce((s, c) => s + c.prob, 0);
  assert.equal(total, 100, `概率总和 ${total} ≠ 100`);
});

// ===== 2. ARC_ORDER + POSITION_TIER 一致性 =====
test('ARC_ORDER: C1-C3-C5-C4-C2（5 折居中）', () => {
  assert.deepEqual(ARC_ORDER, ['C1', 'C3', 'C5', 'C4', 'C2']);
});

test('POSITION_TIER: P3(center) = C5 所在的中央位置', () => {
  assert.equal(POSITION_TIER.P3, 'center');
});

test('TIER_SCALE: outer < inner < center', () => {
  assert.ok(TIER_SCALE.outer < TIER_SCALE.inner);
  assert.ok(TIER_SCALE.inner < TIER_SCALE.center);
});

// ===== 3. 加权随机抽 =====
test('weightedPick: 10000 次抽样 → 5 折 C5 命中率 ≈ 8%', () => {
  let c5 = 0;
  for (let i = 0; i < 10000; i++) {
    if (weightedPick().id === 'C5') c5++;
  }
  const rate = c5 / 10000;
  assert.ok(rate > 0.06 && rate < 0.10, `C5 命中率 ${rate.toFixed(4)} 应在 [0.06, 0.10]`);
});

test('weightedPick: 10000 次抽样 → 5 张券总命中率 = 100%', () => {
  const counts = {};
  for (let i = 0; i < 10000; i++) {
    const c = weightedPick();
    counts[c.id] = (counts[c.id] || 0) + 1;
  }
  // 5 张都应该有命中
  for (const id of ['C1', 'C2', 'C3', 'C4', 'C5']) {
    assert.ok(counts[id] > 0, `${id} 应该被抽到`);
  }
});

test('weightedPick: 注入固定随机源可预测', () => {
  const c = weightedPick(COUPONS, () => 0);
  assert.equal(c.id, 'C1');  // 第一个 weight 段
});

// ===== 4. 保底逻辑 =====
test('PityCounter: 10 次未出稀有 → 第 10 次强制出稀有', () => {
  const pity = new PityCounter(10);
  let nonRare = true;
  for (let i = 0; i < 9; i++) {
    const r = pity.apply({ id: 'C1', rare: false });
    if (r.rare) { nonRare = false; break; }
  }
  assert.ok(nonRare, '前 9 次不应该触发保底');
  // 第 10 次：输入 C1（common），应该被强制改成 rare
  const forced = pity.apply({ id: 'C1', rare: false });
  assert.equal(forced.rare, true, '第 10 次必须强制出稀有');
});

test('PityCounter: 出了稀有 → 计数器归零', () => {
  const pity = new PityCounter(10);
  pity.apply({ id: 'C5', rare: true });
  assert.equal(pity.state.sinceRare, 0);
});

// ===== 5. 每日次数限制 =====
test('DailyLimit: 初始剩余 3 次', () => {
  const state = {};
  assert.equal(DailyLimit.remaining(state), 3);
});

test('DailyLimit: 用 1 次后剩 2 次', () => {
  const state = {};
  DailyLimit.consume(state, '2026-06-15', 'free');
  assert.equal(DailyLimit.remaining(state, '2026-06-15'), 2);
});

test('DailyLimit: 用 3 次后剩 0 次', () => {
  const state = {};
  DailyLimit.consume(state, '2026-06-15', 'free');
  DailyLimit.consume(state, '2026-06-15', 'free');
  DailyLimit.consume(state, '2026-06-15', 'free');
  assert.equal(DailyLimit.remaining(state, '2026-06-15'), 0);
});

test('DailyLimit: 不消耗负数', () => {
  const state = {};
  for (let i = 0; i < 5; i++) DailyLimit.consume(state, '2026-06-15', 'free');
  assert.equal(DailyLimit.remaining(state, '2026-06-15'), 0);
});

// ===== 6. 老虎机 reel 布局 =====
test('SlotLayout: build() 返回 40 张卡', () => {
  const cards = SlotLayout.build('C5');
  assert.equal(cards.length, SLOT_TOTAL_CARDS);
});

test('SlotLayout: winner=C5 → 第 36 张（index 35）是 C5', () => {
  const cards = SlotLayout.build('C5');
  assert.equal(cards[SLOT_WINNER_INDEX].id, 'C5');
});

test('SlotLayout: winner=C1 → 第 36 张是 C1', () => {
  const cards = SlotLayout.build('C1');
  assert.equal(cards[SLOT_WINNER_INDEX].id, 'C1');
});

test('SlotLayout: 所有卡有 position + tier', () => {
  const cards = SlotLayout.build('C5');
  for (const c of cards) {
    assert.ok(c.position.match(/^P[1-5]$/));
    assert.ok(['outer', 'inner', 'center'].includes(c.tier));
  }
});

test('SlotLayout: P3 位置对应 center tier', () => {
  const cards = SlotLayout.build('C5');
  const p3 = cards.filter(c => c.position === 'P3');
  assert.ok(p3.length > 0);
  for (const c of p3) assert.equal(c.tier, 'center');
});

test('SlotLayout: finalOffset 让 winner 卡中心对齐 reel 中轴', () => {
  // 新公式：reelWidth/2 - winnerIndex*step - cardWidth/2
  // 验证：offset + reelWidth/2 - winnerIndex*step - cardWidth/2 = 0
  const cardWidth = 78;
  const cardMargin = 8;
  const step = cardWidth + cardMargin;  // 86
  const total = 40;
  const reelWidth = total * step;  // 3440
  const offset = SlotLayout.finalOffset(cardWidth, cardMargin, 35, total);
  // card 35 中心相对 reel 起点 = 35*86 + 39 = 3049
  // reel 起点 = 父容器 50% - reelWidth/2 + offset = 50% - 1720 + offset
  // card 35 中心 = reel 起点 + 35*86 + 39 = 父容器 50% - 1720 + offset + 3049
  //             = 父容器 50% + 1329 + offset
  // 要 card 35 中心 = 父容器 50% (中轴): offset = -1329
  assert.equal(offset, -1329);
});

test('SlotLayout: finalOffset winnerIndex=0 → offset = reelWidth/2 - cardWidth/2', () => {
  // 第 1 张卡中心 = reel 中心
  const offset = SlotLayout.finalOffset(78, 8, 0, 40);
  // = 40*86/2 - 0*86 - 39 = 1720 - 39 = 1681
  assert.equal(offset, 1681);
});

// ===== 7. Snap-to 动画 =====
test('snap-to 流程: ARC_POSITIONS → TRACK_POSITIONS → reel', () => {
  // 验证 ARC 和 TRACK 都是 5 个位置
  assert.equal(Object.keys(ARC_POSITIONS).length, 5);
  assert.equal(Object.keys(TRACK_POSITIONS).length, 5);
  // 所有 track 位置 Y 统一
  for (const k of Object.keys(TRACK_POSITIONS)) {
    assert.equal(TRACK_POSITIONS[k].y, 50, `${k} Y 应为 50`);
  }
  // P3 是中央
  assert.equal(TRACK_POSITIONS.P3.x, 50, 'P3 应在中轴 50%');
});
