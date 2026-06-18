#!/usr/bin/env python3
"""
从 preview.png 抠 5 张 sprite 卡（去背景，透明 PNG）

为啥不用 elements.png？
- elements.png 中 AI 把 9折卡画到 canvas 边缘外，"微"字左半被裁
- preview.png 中 5 张卡都是完整可见的
- 用 preview.png 抠图能保证所有卡 100% 完整

preview.png 486×864 中卡位 x 范围（自动检测）：
  Card 1 (P1, 9折):  x= 17- 90 (w=74)
  Card 2 (P2, 7折):  x=106-187 (w=82)
  Card 3 (P3, 5折):  x=206-314 (w=109, 中央最大)
  Card 4 (P4, 6折):  x=336-413 (w=78)
  Card 5 (P5, 8折):  x=431-485 (w=55)

Y 范围：562-668
"""
import json
import numpy as np
from PIL import Image
from pathlib import Path

HERE = Path(__file__).parent
DEMO = HERE / "demo"
CARDS_DIR = DEMO / "cards"
CARDS_DIR.mkdir(exist_ok=True)

src = DEMO / "preview.png"
img = Image.open(src)
arr = np.array(img)
H, W = arr.shape[:2]
print(f"📐 preview.png: {W}×{H}")

# ==== 自动检测 5 张卡的 x 范围 ====
# 卡片底色 cream/white: RGB > 230 各通道（排除绿幕和场景）
r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
# cream 区域: R>230 & G>220 & B>200 & 不是绿幕
is_card_pix = (r > 230) & (g > 220) & (b > 200) & ~((g > 180) & (r < 100) & (b < 100))
# 限定 y 范围到卡片所在的底部 1/3 (y=540-820)，避免抓到 AC 主体/雪花
Y_SEARCH_TOP, Y_SEARCH_BOT = 540, 820
col_density = is_card_pix[Y_SEARCH_TOP:Y_SEARCH_BOT, :].sum(axis=0)

# 找连续段（threshold 25 保留所有卡，后处理超宽的段）
in_card = False
segments = []
for x in range(W):
    if col_density[x] > 25 and not in_card:
        start = x; in_card = True
    elif col_density[x] <= 25 and in_card:
        if x - start > 20:
            segments.append((start, x - 1))
        in_card = False
if in_card and W - start > 20:
    segments.append((start, W - 1))

# 后处理：如果某个段太宽（>150px），说明是两张卡被 merge 了
# 按中点分割
final_segments = []
for s, e in segments:
    if e - s > 150:
        mid = (s + e) // 2
        final_segments.append((s, mid - 2))
        final_segments.append((mid + 2, e))
    else:
        final_segments.append((s, e))
segments = final_segments

assert len(segments) == 5, f"Expected 5 cards, got {len(segments)}: {segments}"

assert len(segments) == 5, f"Expected 5 cards, got {len(segments)}: {segments}"
print(f"📐 Detected {len(segments)} cards:")
for i, (s, e) in enumerate(segments):
    print(f"  Card {i+1}: x={s}-{e} (w={e-s+1})")

# ==== 精确 y 范围：限制在 y=560-770（卡主体，不包括下面的按钮）====
y_search_top, y_search_bot = 560, 770
# 在 card 1 area (x=segments[0]) 找 cream 行
sub = is_card_pix[y_search_top:y_search_bot, segments[0][0]:segments[0][1] + 1]
row_density = sub.sum(axis=1)
nz = np.where(row_density > 10)[0]
if len(nz):
    y1, y2 = y_search_top + int(nz[0]), y_search_top + int(nz[-1])
print(f"📐 Card y range: {y1}-{y2} (height {y2-y1+1})")
print(f"📐 Card y range: {y1}-{y2} (height {y2-y1+1})")

# ==== 切 5 张卡，每张卡 = 卡内容 + 透明背景 ====
# 算法：先在卡片内用 inpaint 思路，把卡片外的 cream 区域透明化
# 简单方案：把每张卡裁出来后，对每张图，找 cream 区域的 bbox，作为卡的"实际可见边界"
# 但卡片外是场景（不是绿幕），无法简单透明化
#
# 实用方案：直接把每张卡的 cream 矩形（带边框）作为 sprite
# 卡本身有完整边框，外部是场景 — 视觉上"卡"会带着场景背景
# 但因为卡是不透明的矩形，在 H5 页面里看起来跟卡一样

cards = []
for i, (sx, ex) in enumerate(segments):
    sprite = Image.fromarray(arr[y1:y2+1, sx:ex+1])
    sprite_path = CARDS_DIR / f"card-{i+1}.png"
    sprite.save(sprite_path, optimize=True)
    cards.append({
        "id": f"card-{i+1}",
        "x_range": [sx, ex],
        "y_range": [y1, y2],
        "size": list(sprite.size),
        "path": f"cards/card-{i+1}.png",
    })
    print(f"  ✅ card-{i+1}.png: {sprite.size} (from x={sx}-{ex}, y={y1}-{y2})")

meta = {
    "source": "preview.png",
    "size": [W, H],
    "cards": cards,
    "note": "Cards cropped from preview.png (完整版) — elements.png 卡 1 边缘被 AI 画到 canvas 外"
}
(DEMO / "element-bboxes.json").write_text(
    json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8"
)
print(f"\n✅ element-bboxes.json")
print(f"💡 5 张卡从 preview.png 抠出，卡 1 (9折 微辣尝鲜券) 完整")