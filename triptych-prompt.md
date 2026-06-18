A horizontal 16:9 triptych image (1536×864 landscape style) with three equal vertical panels, separated by pure #00FF00 green-screen color bands of ~5px width.

=== LAYER 1: GREENSCREEN ===
Solid #00FF00 chroma key background. Bands are ~5px wide between regions. NO decoration.

=== LAYER 2: REGIONS (3 equal panels) ===
3 vertical panels, each 1/3 of total width:
- LEFT panel: 5 cards in a straight horizontal row, side by side, no arc, no curve, no rotation, no perspective, position 3 = center largest - full visual preview
- MIDDLE panel: FULL background layer with: top logo (金手勺) + subtitle (东北老味·金黄酥脆) + focus character (Q版锅包肉戴主厨帽) + scene (restaurant counter, red lanterns, wood, steam, sauce sizzle) + decorations. This is the pure visual base layer. NO interactive elements: NO 5 coupon cards, NO top round help button, NO bottom CTA button, NO highlight glow ring.
- RIGHT panel: pure #00FF00 green-screen - UI element inventory

=== LAYER 3: 9:16 INNER CANVASES ===
Each panel has a vertical 9:16 portrait canvas of ~486px wide × ~864px tall, centered with ~13px greenscreen padding on left/right.

=== LAYER 4: CONTENT ===

--- LEFT PANEL (full visual preview) ---
On the Northeast China home-style restaurant counter, warm wood, red lanterns, golden fried pork slices with crispy sugar-vinegar glaze, sizzling steam, festive vibe, kawaii style with red and gold accents.
- Top: brand logo "金手勺" — layout is FLEXIBLE (round badge / horizontal banner / rectangle plaque / simple text), styled with #F4C95D text + #C73E1D border. Position: top center. Below logo: subtitle "东北老味·金黄酥脆" (smaller font, themed).
- Top-right: Single small round button "说明" (#C73E1D "?" 36x36).
- Center: Focus character Q版锅包肉吉祥物（金黄圆鼓鼓的酥肉片，戴主厨帽，手持锅铲，竖大拇指，嘴馋流口水，可爱喜庆） (character stands naturally on the store floor / scene ground, NO wooden pedestal, NO cartoon stage, NO display platform, NO podium), soft glow, NOT blocking Logo/cards/buttons.
- Middle-lower: 5 coupon cards in a STRAIGHT HORIZONTAL ROW, side by side, left to right:
  - Position 1 (leftmost, smallest, no highlight): 招牌尝鲜券 9折
  - Position 2 (inner left, mid, no highlight): 酸甜双拼券 7折
  - Position 3 (CENTER, LARGEST, gold border for visual distinction, NO highlight glow, NO star sparkles): 金手半价券 5折
  - Position 4 (inner right, mid, NO highlight glow, NO sparkles): 老味传承券 6折
  - Position 5 (rightmost, smallest, no highlight): 金黄畅享券 8折
  All cards: #FFF8E7 bg, #F4C95D bold text, #C73E1D border. Position 3 has gold border (#FFD700) instead of accent border, but NO glow, NO sparkles, NO halo, NO aura. Position 4 uses standard accent border like common cards.
  Cards MUST NOT overlap each other. Maintain at least 20px spacing.
  Each card shows ONLY: name + discount. NO probability text on cards. NO C1/C2/C3/C4/C5 labels.
- Bottom: Big rounded "立即抽奖" button (#C73E1D bg + #FFF8E7 text + soft glow).

--- MIDDLE PANEL (FULL background layer, NOT just character!) ---
FULL background layer with: top logo (金手勺) + subtitle (东北老味·金黄酥脆) + focus character (Q版锅包肉戴主厨帽) + scene (restaurant counter, red lanterns, wood, steam, sauce sizzle) + decorations. This is the pure visual base layer. NO interactive elements: NO 5 coupon cards, NO top round help button, NO bottom CTA button, NO highlight glow ring.
This panel MUST include:
- Top: brand logo "金手勺" in the SAME style/position/size as LEFT panel
- Below logo: subtitle "东北老味·金黄酥脆" in the SAME style/position as LEFT panel
- Center-top: focus character (Q版锅包肉吉祥物（金黄圆鼓鼓的酥肉片，戴主厨帽，手持锅铲，竖大拇指，嘴馋流口水，可爱喜庆）) in the SAME position as LEFT panel
- Background: Northeast China home-style restaurant counter, warm wood, red lanterns, golden fried pork slices with crispy sugar-vinegar glaze, sizzling steam, festive vibe, kawaii style with red and gold accents, in the EXACT SAME style/colors/composition as LEFT panel
This panel MUST NOT include:
- 5 coupon cards
- Top round help button ("?")
- Bottom CTA button ("立即抽奖")
- Highlight glow ring
This panel IS the base visual layer that LEFT panel composites the interactive elements on top of. Keep logo, subtitle, character, scene pixel-aligned with LEFT panel for clean compositing.

--- RIGHT PANEL (UI element inventory, MUST match LEFT panel EXACTLY in position) ---
9:16 phone canvas with pure #00FF00 green-screen INSIDE canvas. NO background, NO character, NO decorations.
This panel is the UI ELEMENT INVENTORY of LEFT panel. CRITICAL: every element in RIGHT panel MUST match LEFT panel EXACTLY in position and size:
- 5 coupon cards: SAME x, y, width, HEIGHT as LEFT panel (pixel-perfect, same height is mandatory)
- top_button (small round button): SAME size (e.g. 36x36), SAME position as LEFT panel
- cta_button (rounded CTA): SAME size, SAME position as LEFT panel
No offset, no gap, no re-arrangement. ONE-TO-ONE mirror.
CRITICAL — NO magenta cut guides: There is NO 2px #FF00FF magenta border around any element in this panel. NO cutting guide lines. NO purple/pink/violet lines anywhere. Just clean element shapes on green-screen.

Use the SAME 3-tier scale as LEFT panel:
- coupon_position_1 (OUTER, S1 ≈ 0.86x of BaseCard, smallest, no highlight, accent border) = matches LEFT panel position 1 EXACTLY
- coupon_position_2 (INNER, S2 ≈ 1.00x of BaseCard, mid, no highlight, accent border) = matches LEFT panel position 2 EXACTLY
- coupon_position_3 (CENTER, S3 ≈ 1.18x of BaseCard, LARGEST, gold border for visual distinction, NO highlight glow, NO star sparkles) = matches LEFT panel position 3 EXACTLY
- coupon_position_4 (INNER, S2 ≈ 1.00x of BaseCard, mid, NO highlight glow, NO sparkles, accent border) = matches LEFT panel position 4 EXACTLY
- coupon_position_5 (OUTER, S1 ≈ 0.86x of BaseCard, smallest, no highlight, accent border) = matches LEFT panel position 5 EXACTLY

Arrange these 7 elements (no #FF00FF cutting guide, no highlight_glow element), independent, non-overlapping. ALL elements MUST match LEFT panel in size and position:
1. top_button: #C73E1D ? round button (36x36, SAME size as LEFT panel) — labeled "说明"
2. coupon_position_1: 招牌尝鲜券 9折 (SAME height as LEFT panel position 1)
3. coupon_position_2: 酸甜双拼券 7折 (SAME height as LEFT panel position 2)
4. coupon_position_3: 金手半价券 5折 (largest, gold border, NO glow, NO sparkles, SAME height as LEFT panel position 3)
5. coupon_position_4: 老味传承券 6折 (NO glow, NO sparkles, SAME height as LEFT panel position 4)
6. coupon_position_5: 金黄畅享券 8折 (SAME height as LEFT panel position 5)
7. cta_button: #C73E1D rounded "立即抽奖" button, #FFF8E7 text (SAME size as LEFT panel cta_button)

=== ABSOLUTE CONSTRAINTS ===
- TOTAL IMAGE: horizontal 16:9 landscape (not square, not 4:3). Three panels equal width.
- INNER CANVAS: vertical 9:16 portrait (not square, not horizontal).
- NO 排行, 记录, 我的 UI elements.
- NO real QR codes, no real coupon codes.
- All Chinese text crisp: 金手勺, 东北老味·金黄酥脆, 9折, 8折, 7折, 6折, 5折, 立即抽奖.
- 金手半价券 5折 MUST be in CENTER (Position 3), MUST be the LARGEST card.
- All cards SAME border style (#FFF8E7 bg + #F4C95D text + #C73E1D border), EXCEPT Position 3 (center) which uses #FFD700 gold border for visual distinction. NO highlight glow, NO star sparkles, NO halo, NO aura on any card. NO highlight_glow element anywhere.
- NO C1/C2/C3/C4/C5 labels visible on cards. Only show: name + discount. NO probability text on cards.
- NO card icons inside coupon slots — only text.
- Cards MUST NOT overlap. Maintain 20px spacing minimum.
- No full-screen glow, no over-exposure, no UI overlap, no element overflow.
- 东北复古喜庆风, soft gradient, high quality, commercial-grade product design.