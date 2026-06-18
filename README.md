# 🥟 金手勺 · 东北老味·金黄酥脆

> Campaign Agent Kit v1.0 demo — 锅包肉主题 5 折老虎机抽奖 H5

**品牌：** 金手勺 · 东北老味·金黄酥脆
**风格：** 东北复古喜庆风 / kawaii / 老味传承
**配色：** 金黄 #F4C95D + 东北红 #C73E1D + 奶白 #FFF8E7 + 亮金 #FFD700

---

## 🎯 5 张券

| ID | 折扣 | 券名 | 概率 | 稀有度 |
|---|---|---|---|---|
| C1 | 9折 | 招牌尝鲜券 | 35% | common |
| C3 | 7折 | 酸甜双拼券 | 20% | common |
| **C5** | **5折** | **金手半价券** | **8%** | **rare** ⭐ |
| C4 | 6折 | 老味传承券 | 12% | rare ⭐ |
| C2 | 8折 | 金黄畅享券 | 25% | common |

**视觉排序（沿弧线左→右）：**
```
P1(outer) ──→ P2(inner) ──→ P3(CENTER, 5折最大) ──→ P4(inner) ──→ P5(outer)
  C1 9折        C3 7折           C5 5折                  C4 6折          C2 8折
```

---

## 📂 项目结构

```
jin-shao-guobao-rou/
├── campaign_brief.json         # Campaign Brief（brand spec + 5 coupons）
├── brief.json                  # air-conditioner 风格 brief（参考用）
├── triptych-prompt.md          # 编译后的三联图 prompt（喂给 opencli）
├── meta-prompt.md              # Meta-Prompt v2.9（triptych prompt 生成器）
├── compile_prompt.py           # brief → triptych-prompt.md 编译器
├── cut_assets.py               # 三联图 → preview/background/elements 切图
├── cut_elements.py             # elements → 5 张 sprite 卡（去绿幕）
├── triptych.png                # 1672×941 三联图原始图
├── demo/
│   ├── index.html              # H5 主页面（手机 9:16 框）
│   ├── game.js                 # 抽奖逻辑（ES module，可单测）
│   ├── test.mjs                # Node 测试（24 tests）
│   ├── screenshot-default.png  # 默认状态截图
│   ├── background-hires.png    # 2× 高分辨率背景
│   └── cards/                  # 5 张 sprite 卡
│       ├── card-1.png          # P1: 9折 招牌尝鲜券
│       ├── card-2.png          # P2: 7折 酸甜双拼券
│       ├── card-3.png          # P3: 5折 金手半价券（中央最大）
│       ├── card-4.png          # P4: 6折 老味传承券
│       └── card-5.png          # P5: 8折 金黄畅享券
└── README.md
```

---

## 🚀 运行流程

### 1. 编译三联图 prompt

```bash
cd jin-shao-guobao-rou
python3 compile_prompt.py   # 读取 brief.json → 输出 triptych-prompt.md
```

### 2. 生成三联图（人工确认）

```bash
opencli chatgpt image "$(cat triptych-prompt.md)" \
  --op /Users/omg/.openclaw/workspace/campaign-test/jin-shao-guobao-rou/assets \
  --window background
# → 输出 chatgpt_*.png，重命名为 triptych.png
```

**🛑 视觉验收（QA Gate 1）：人工确认三联图后再继续。**

### 3. 切图

```bash
python3 cut_assets.py    # 三联图 → preview/background/elements
python3 cut_elements.py  # elements → 5 张 sprite 卡（去绿幕）
```

### 4. 跑测试

```bash
cd demo && node test.mjs
# 24/24 测试通过 ✅
```

### 5. 启动 sandbox

```bash
cd demo && python3 -m http.server 7787
# 浏览器打开 http://127.0.0.1:7787/index.html
```

### 6. 截图验证

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-sandbox \
  --window-size=420,720 --virtual-time-budget=8000 \
  --screenshot=screenshot-default.png \
  --hide-scrollbars http://127.0.0.1:7787/index.html
```

---

## 🎰 玩法

1. **默认状态：** 5 张卡沿弧线排列，5折(中央最大)/6折/7折/8折/9折
2. **点击屏幕 → 触发抽奖：**
   - 5 张卡从弧线**收拢**到水平等大（400ms 爱奇艺缓动）
   - 切换到**老虎机**模式，reel 从右向左滚动（6000ms 急速减速）
   - 中奖卡精准停在中央（中线高亮）
3. **弹窗：** 显示中奖卡 + 券名 + 折扣
4. **保底：** 连抽 10 次未出稀有 → 第 10 次强制出稀有（C4 6折 / C5 5折）
5. **每日限次：** 3 次免费抽奖（localStorage 持久化）

---

## ✅ QA Gates 通过情况

| Gate | 项 | 状态 |
|---|---|---|
| **Gate 1** | Triptych 视觉验收（人工确认） | ✅ 通过 |
| **Gate 2** | Implementation Pack 数据完整 | ✅ 5/5 卡 + preview + background + elements |
| **Gate 3** | Sandbox 渲染 + 测试 | ✅ 24/24 测试 + 默认状态截图通过 |

---

## 🥟 主题特点

- **吉祥物：** Q版锅包肉戴主厨帽，手持锅铲，竖大拇指，嘴馋流口水
- **场景：** 东北餐厅内景，红灯笼高挂，木桌蒸汽，锅包肉成盘，油锅泼溅
- **配色氛围：** 金黄 + 东北红，传达喜庆热情 + 老味传承
- **目标受众：** 喜欢东北菜 / 锅包肉 / 餐厅代金券的年轻消费者

---

## 📜 协议

- **play_type:** `five_coupon_arc_draw`（v1.0 锁定）
- **runtime_type:** `image_h5`（image-first / 老虎机玩法）
- **template:** `Campaign Agent Kit v1.0`（见 `campaign-spec-v1.0.md`）
- **风格版本:** s1
- **资源包版本:** a1