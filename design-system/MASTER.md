# RIO GIFT SHOP DESIGN SYSTEM (MASTER)

## 1. Visual Style: Minimalist Elegant
- **Vibe:** Clean, spacious, high-end, sophisticated.
- **Key Characteristics:** 
  - Generous white space.
  - Subtle borders (1px) and soft shadows.
  - Backdrop filters (glassmorphism) for overlays.
  - Smooth transitions (200-400ms).

## 2. Color Palette: Luxury Obsidian & Crimson
- **Primary (Obsidian):** #1C1C1E (Text, Header, Dark UI)
- **Secondary (Crimson):** #8B1428 (Accents, Buttons, Urgent UI)
- **Accent (Gold):** #C9924A (Badges, Highlights, Icons)
- **Background:** #FAF8F5 (Warm White)
- **Surface:** #FFFFFF (Cards, Modals)
- **Muted:** #6B6460 (Subtext)
- **Border:** #EDE9E4 (Soft Stone)

## 3. Typography: Serif Luxury
- **Headings:** 'Cormorant', serif (Elegant, high-contrast)
- **Body:** 'Montserrat', sans-serif (Clean, readable)
- **Monospace:** 'DM Mono', monospace (Numbers, SKUs)

## 4. UI Components Pattern
- **Buttons:** 
  - Primary: Crimson background, white text, rounded-full.
  - Secondary: Gold border, gold text, rounded-full.
  - Ghost: Obsidian text, transparent background, rounded-full.
- **Cards:** 
  - White background, 1px Stone border, subtle shadow.
  - Hover effect: Scale 1.02, deeper shadow.
- **Navbar:** 
  - Floating top, backdrop-blur-md, border-b stone.

## 5. Interaction Rules
- **Cursor:** `cursor-pointer` on all interactive cards and buttons.
- **Hover:** Smooth color/opacity transitions. No layout shifts.
- **Icons:** Use Lucide React (consistent sizing 20x20 or 24x24).

## 6. Anti-Patterns to Avoid
- NO emojis as icons.
- NO vibrant/blocky primary colors (like pure red/blue).
- NO instant state changes (always use transitions).
