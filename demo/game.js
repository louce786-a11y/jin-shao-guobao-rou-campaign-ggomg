// game.js - 金手勺 / 5 张锅包肉券老虎机抽奖
// 纯逻辑层, 浏览器和 node 通用 (ES module)

// ===== 5 张锅包肉券（按优惠力度从低到高: C1 < C2 < C3 < C4 < C5）=====
// 视觉顺序（左→右 沿弧线）: C1 → C3 → C5 → C4 → C2
export const COUPONS = [
  { id: 'C1', name: '招牌尝鲜券',   discount: '9折', prob: 35, weight: 35, rare: false, flavor: '🍖' },
  { id: 'C3', name: '酸甜双拼券',   discount: '7折', prob: 20, weight: 20, rare: false, flavor: '🥢' },
  { id: 'C5', name: '金手半价券',   discount: '5折', prob:  8, weight:  8, rare: true,  flavor: '👑' },
  { id: 'C4', name: '老味传承券',   discount: '6折', prob: 12, weight: 12, rare: true,  flavor: '🏮' },
  { id: 'C2', name: '金黄畅享券',   discount: '8折', prob: 25, weight: 25, rare: false, flavor: '🍚' },
];

// 卡位视觉位置顺序（左→右 沿弧线）
export const ARC_ORDER = ['C1', 'C3', 'C5', 'C4', 'C2'];

// 卡位 tier 映射
export const POSITION_TIER = {
  P1: 'outer',  // C1
  P2: 'inner',  // C3
  P3: 'center', // C5
  P4: 'inner',  // C4
  P5: 'outer',  // C2
};

export const TIER_SCALE = { outer: 0.86, inner: 1.00, center: 1.18 };

// ===== 弧形布局：5 张卡在 default 状态的位置（phone canvas 360×640，百分比）=====
// 视觉上：中间大、两边小，弧形排列
export const ARC_POSITIONS = {
  P1: { x: 16, y: 78, tier: 'outer'  },
  P2: { x: 33, y: 73, tier: 'inner'  },
  P3: { x: 50, y: 68, tier: 'center' },
  P4: { x: 67, y: 73, tier: 'inner'  },
  P5: { x: 84, y: 78, tier: 'outer'  },
};

// ===== 滚动轨道：snap-to 后的统一布局（参考 godot spec 4.2）=====
// 5 张卡均匀分布，Y 统一，scale 1.0
export const TRACK_POSITIONS = {
  P1: { x:  8, y: 50, tier: 'inner' },
  P2: { x: 28, y: 50, tier: 'inner' },
  P3: { x: 50, y: 50, tier: 'inner' },  // 中央
  P4: { x: 72, y: 50, tier: 'inner' },
  P5: { x: 92, y: 50, tier: 'inner' },
};

export const RARE_WEIGHT_THRESHOLD = 15;
export const DAILY_FREE_DRAWS = 3;
export const PITY_THRESHOLD = 10;

// ===== 动画常量（参考 godot spec 4.x）=====
export const ANIM = {
  SNAP_DURATION: 400,        // 拉齐动画 (spec 4.2: 0.4s)
  SNAP_EASING: 'cubic-bezier(0.33, 1, 0.68, 1)',  // EASE_OUT
  SNAP_HOLD: 200,            // 拉齐后停顿 (spec 4.2: 0.2s)
  SPIN_DURATION: 6000,       // 滚动 (spec 4.3: 6000ms)
  SPIN_EASING: 'cubic-bezier(0.22, 1, 0.36, 1)',  // QUINT/EASE_OUT
  REVEAL_DURATION: 700,      // 中奖揭示
};

// ===== 老虎机常量 =====
export const SLOT_TOTAL_CARDS = 40;
export const SLOT_WINNER_INDEX = 35;
export const REEL_CARD_WIDTH = 78;       // 滚动轨道上卡宽
export const REEL_CARD_MARGIN = 8;       // 卡间距
export const REEL_STEP = REEL_CARD_WIDTH + REEL_CARD_MARGIN;  // 86

// ===== 加权随机抽 =====
export function weightedPick(coupons = COUPONS, rand = Math.random) {
  const total = coupons.reduce((s, c) => s + c.weight, 0);
  let r = rand() * total;
  for (const c of coupons) {
    r -= c.weight;
    if (r <= 0) return c;
  }
  return coupons[coupons.length - 1];
}

// ===== 保底逻辑 =====
export class PityCounter {
  constructor(threshold = PITY_THRESHOLD) {
    this.threshold = threshold;
    this.sinceRare = 0;
  }
  apply(expected, rand = Math.random) {
    this.sinceRare += 1;
    if (expected.rare) {
      this.sinceRare = 0;
      return expected;
    }
    if (this.sinceRare >= this.threshold) {
      const rares = COUPONS.filter(c => c.rare);
      const forced = rares[Math.floor(rand() * rares.length)];
      this.sinceRare = 0;
      return forced;
    }
    return expected;
  }
  reset() { this.sinceRare = 0; }
  get state() { return { sinceRare: this.sinceRare, threshold: this.threshold }; }
}

// ===== 每日次数限制 =====
export class DailyLimit {
  static key = 'jsrDrawLimit_v1';
  static today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  static load(store) {
    try { return JSON.parse(store.getItem(DailyLimit.key) || '{}'); }
    catch { return {}; }
  }
  static remaining(state, dateStr = DailyLimit.today()) {
    const used = (state[dateStr]?.free || 0) + (state[dateStr]?.bonus || 0);
    return Math.max(0, DAILY_FREE_DRAWS - used);
  }
  static consume(state, dateStr = DailyLimit.today(), kind = 'free') {
    const cur = state[dateStr] || { free: 0, bonus: 0 };
    cur[kind] = (cur[kind] || 0) + 1;
    state[dateStr] = cur;
    return state;
  }
}

// ===== 老虎机 reel 布局（参考 godot spec 4.3）====
//
// 关键设计：reel 是一个 flex 容器，所有卡排列在水平轨道上
// 整个 reel 通过 translateX 滚动
// winner 卡的中心要对齐 viewport 中心（reel 中轴）
//
export class SlotLayout {
  static build(winnerId, total = SLOT_TOTAL_CARDS) {
    const ordered = ARC_ORDER.map(id => COUPONS.find(c => c.id === id));
    const cards = [];
    for (let i = 0; i < total; i++) {
      const idx = i % ordered.length;
      const c = ordered[idx];
      const posKey = `P${idx + 1}`;
      cards.push({
        id: c.id,
        position: posKey,
        tier: POSITION_TIER[posKey],
      });
    }
    // 重排最后 5 张, 让 winner 落在 SLOT_WINNER_INDEX
    const winnerInOrder = ARC_ORDER.indexOf(winnerId);
    if (winnerInOrder > 0) {
      const last5 = cards.slice(-5);
      const rotated = new Array(5);
      for (let k = 0; k < 5; k++) {
        rotated[k] = last5[(k + winnerInOrder) % 5];
      }
      cards.splice(-5, 5, ...rotated);
    }
    return cards;
  }

  /**
   * 修正后的 finalOffset：让 winner 卡中心精确对齐 reel 中轴
   * @param cardWidth 单卡显示宽度
   * @param cardMargin 卡间距
   * @param winnerIndex 中奖卡在 reel 上的索引
   * @param total reel 总卡数
   * @returns translateX 偏移量（负数 = 向左）
   */
  static finalOffset(cardWidth, cardMargin, winnerIndex, total) {
    const step = cardWidth + cardMargin;
    const reelWidth = total * step;
    return reelWidth / 2 - winnerIndex * step - cardWidth / 2;
  }
}