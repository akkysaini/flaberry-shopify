# Flaberry — Responsive Behaviour Reference

**Primary Reference:** `reference/Flaberry_Design1_Classic.html`  
**Screenshot References:** `screenshots/desktop/` and `screenshots/mobile/`  
**Document Type:** Technical Responsive & Multi-Device Specification  
**Status:** Source-verified (Static Code & Screenshot Inspection); Not tested in a live browser  

---

## 1. Responsive Design Philosophy & Layout Architecture

The Flaberry prototype implements a responsive concept-style page structure designed to maintain visual consistency across all modern devices (desktops, laptops, tablets, and smartphones).

Key structural design parameters:
- **Max Page Width:** The main wrapper (`.wrap`) enforces a maximum width of `1440px` (`max-width: 1440px; margin: 0 auto;`).
- **Safe Area Insets:** Margins and sticky dock elements incorporate iOS and Android safe-area environment variables:
  - `--gutter: max(16px, env(safe-area-inset-left, 0px));`
  - `--gutter-r: max(16px, env(safe-area-inset-right, 0px));`
  - Bottom docks and sticky action bars account for `env(safe-area-inset-bottom, 0px)`.
- **Light Theme Integrity:** Governed by `color-scheme: light;` and explicit brand tokens, ensuring the storefront retains its white-surface, dark-navy, and brand-red color palette regardless of operating system dark mode settings.
- **Root Border Radii Tokens:**
  - `--r-lg: 24px` (Main page card top, hero slider shell, large promotional split banners)
  - `--r-md: 16px` (Product cards, mega menu promo cards, modals, drawers)
  - `--r-sm: 10px` (Buttons, inputs, dropdown items, option chips)

---

## 2. Breakpoints Identified in Code

The prototype defines five specific responsive media query breakpoints within `<style>` (lines 478 to 721):

```
+-----------------------------------------------------------------------------------------------------+
|  Desktop (>1180px)  |  Small Desktop (961px-1180px)  |  Tablet (641px-960px)  |  Mobile (<=640px)   |
+-----------------------------------------------------------------------------------------------------+
```

| Breakpoint Query | Classification | Primary Purpose & Major Layout Changes |
|---|---|---|
| `@media (max-width: 1180px)` | Small Desktop / Large Tablet | Collapses 4-column product grids to 3 columns; hides mega menu promotional images; hides utility bar secondary links; adjusts category cards. |
| `@media (max-width: 960px)` | Tablet & Mobile Shell | **Major Layout Shift:** Hides desktop navigation bar; switches header to 3-item layout (Burger, Logo, Market); enables mobile bottom dock; stacks hero and PDP to single column; displays PDP sticky buy bar; collapses sidebars. |
| `@media (max-width: 640px)` | Mobile Smartphone | Collapses grids to 2 columns; switches product rails to 72% peek cards; collapses PDP options to 2 columns; hides desktop footer and activates compact mobile footer (`.fm`). |
| `@media (max-width: 600px)` | Small Mobile Viewport | Collapses vendor and admin KPI metrics to 3-column compact grids (`gap: 8px`). |
| `@media (prefers-reduced-motion: reduce)` | Accessibility | Disables all CSS transitions, animations, and smooth scrolling for motion-sensitive users. |

---

## 3. Detailed Breakpoint-by-Breakpoint Transformations

### 3.1 Small Desktop / Large Tablet: `max-width: 1180px`

```css
@media (max-width: 1180px) {
  .ccards { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .ccards .ccard:nth-child(n+4) { display: none; }
  .rail { grid-auto-columns: calc((100% - 3*16px)/4); }
  .mega .wrap { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .mega .promo { display: none; }
  .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .rv-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .rv-list .rv:nth-child(n+5) { display: none; }
  .ubar .links { display: none; }
  .mega .wrap.wp, .mega .wrap.np { grid-template-columns: repeat(var(--n), minmax(0, 1fr)); column-gap: 24px; }
  .nav .nl { padding: 8px 8px; font-size: 14px; }
}
```

- **Utility Bar:** Secondary navigation links (`.ubar .links`) are hidden to preserve space for the central announcement ticker and right-aligned currency selector.
- **Header Navigation:** Link padding reduces from `8px 14px` to `8px 8px` and font size drops to `14px` to fit all 10 menu categories without wrapping.
- **Mega Menus:** The 300px promotional image box (`.mega .promo`) is hidden. Subcategory columns span available width across 3 columns.
- **Product Grids:** Main catalogue grids (`.grid`) reduce from 4 columns to 3 columns.
- **Category Cards:** `.ccards` collapses from 5 columns to 3 columns; cards 4 and 5 are hidden.
- **Customer Reviews:** Review cards grid (`.rv-list`) collapses from 3 columns to 2 columns; 5th and 6th reviews are hidden.

---

### 3.2 Tablet & Mobile Breakpoint: `max-width: 960px` (Major Transformation)

```css
@media (max-width: 960px) {
  .nav { display: none; }
  .fbhdr .hdr-main { display: grid; grid-template-columns: 44px minmax(0, 1fr) auto; align-items: center; gap: 8px; padding-block: 10px; }
  .fbhdr .burger { display: block; padding: 6px 0; }
  .fbhdr .logo { justify-self: center; }
  .fbhdr .search, .fbhdr .pinchip, .fbhdr .hicons { display: none; }
  .mk .cur-sel { padding: 7px 8px; font-size: 12px; max-width: 128px; }
  
  /* Fixed Mobile Bottom Dock */
  .dock { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); position: fixed; left: 0; right: 0; bottom: 0; z-index: 60; background: #fff; border-top: 1px solid var(--line); }
  body[data-mode="store"] { padding-bottom: calc(62px + env(safe-area-inset-bottom, 0px)); }
  body[data-mode="store"].has-sticky { padding-bottom: calc(138px + env(safe-area-inset-bottom, 0px)); }

  /* Hero Slider Stacking */
  .slide { grid-template-columns: 1fr; min-height: 0; flex-basis: calc(100% - 24px); display: flex; flex-direction: column; }
  .slide .pic { order: -1; aspect-ratio: 4/3; position: relative; }
  .slide .pic img { object-position: 94% center; }
  .slide .txt { padding: 22px 22px 80px; max-width: none; min-height: 0; }
  .hero-ctrl { left: 22px; right: 22px; bottom: 18px; }

  /* Multi-column layout flattening */
  .pinband, .intro, .split, .reviews, .two, .pdp, .ck-wrap { grid-template-columns: 1fr; }
  .clayout, .acct, .panel-body { grid-template-columns: 1fr; }
  
  /* Filters Sidebar */
  .filters { display: none; }
  .filters.show { display: grid; position: static; }
  .fbtn { display: inline-flex; }

  /* PDP Sticky Bar */
  .sticky-buy { display: flex; position: fixed; left: 0; right: 0; bottom: calc(60px + env(safe-area-inset-bottom, 0px)); z-index: 65; background: #fff; border-top: 1px solid var(--line); padding: 10px var(--gutter-r) 10px var(--gutter); gap: 10px; align-items: center; }
  .has-sticky .wa { bottom: calc(150px + env(safe-area-inset-bottom, 0px)); }
}
```

- **Header Structure:** Complete architectural switch:
  - Desktop `#nav` hidden entirely.
  - Header changes to a 3-column CSS Grid: Burger icon (left 44px), Centered Logo, Currency dropdown (right).
  - Search field, pincode chip, and header quick icons (`.hicons`) are hidden from the top bar.
- **Mobile Bottom Navigation Dock (`.dock`):** Fixed persistent bottom bar providing 5 core actions (Home, Menu, Search, Cart, Account).
- **Search Overlay Mode (`body.msearch`):** Tapping Search on the bottom dock dynamically triggers an overlay search input at the top of the viewport with a frosted/darkened scrim backdrop.
- **Hero Slider:** Changes from a side-by-side split layout to a stacked layout: Product imagery sits on top (`order: -1`, 4:3 ratio), editorial text and CTA button sit underneath.
- **Product Detail Page (PDP):**
  - Gallery and Product Info stack vertically (Gallery on top, Info underneath).
  - Sticky Buy Bar (`.sticky-buy`) activates at the bottom of the screen immediately above the dock, displaying current item price, delivery slot summary, and a *"Buy now"* button.
- **Collection Page:**
  - Sidebar filter column (`.filters`) is hidden by default. A dedicated filter button (`.fbtn`) appears at the top of the collection grid to toggle filter visibility.
- **Checkout & Cart:**
  - Multi-column checkout (`.ck-wrap`) collapses to a single column, ordering order summary underneath or in collapsible drawer format.

---

### 3.3 Mobile Smartphone Breakpoint: `max-width: 640px`

```css
@media (max-width: 640px) {
  body { font-size: 14.5px; }
  .ubar .ticker { justify-content: flex-start; }
  .ubar .ticker button { display: none; }
  .logo img { height: 32px; }
  .pinchip { padding: 6px 10px 6px 8px; }
  .rail { grid-auto-columns: 72%; }
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 12px; }
  .split .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .split .grid .pcard:nth-child(n+5) { display: none; }
  .ccards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ccards .ccard:nth-child(3) { display: none; }
  .ccard h3 { font-size: 18px; }
  .rv-list { grid-template-columns: 1fr; }
  .rv-list .rv:nth-child(n+3) { display: none; }
  .trust { grid-template-columns: 1fr; }
  .pinform { flex-direction: column; }
  .row2, .addons { grid-template-columns: 1fr 1fr; }
  .slots { grid-template-columns: 1fr; }
  .gallery { grid-template-columns: 1fr; }
  .thumbs { grid-template-columns: repeat(6, minmax(0, 1fr)); order: 2; }
  .kpis { grid-template-columns: 1fr 1fr; }
  .sec { padding-block: 32px; }

  /* Compact Mobile Footer */
  .foot { padding-block: 20px 18px; }
  .foot .fd { display: none; }
  .fm { display: block; }
  .fm-in { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 14px; align-items: start; }
  .fm-links { display: grid; gap: 7px; font-size: 11.5px; line-height: 1.6; color: #cfd1ea; }
}
```

- **Product Rails (`.rail`):** Changes to `grid-auto-columns: 72%`. This creates an intentional "peek carousel" where 1 full card and a 28% preview of the adjacent card are visible, signaling horizontal swipeability.
- **Product Grids (`.grid`):** Two-column product grid (`repeat(2, minmax(0, 1fr))`) with compact `18px 12px` gutters.
- **PDP Gallery:** Thumbnail row moves underneath the main product image (`order: 2`), displaying 6 miniature square thumbnails (`repeat(6, minmax(0, 1fr))`).
- **PDP Delivery Slots (`.slots`):** Time slot buttons stack vertically into a single column.
- **PDP Options & Addons:** Weight/egg buttons and addon upsell cards adjust to 2 columns (`1fr 1fr`).
- **Footer Architecture Switch:**
  - Complex 5-column desktop footer (`.foot .fd`) is completely hidden.
  - Replaced by `.fm` (compact mobile footer), featuring the Flaberry logo alongside inline text paragraphs with pipe separators (`|`) linking to terms, privacy, refunds, and social icons.

---

### 3.4 Small Mobile Viewport Breakpoint: `max-width: 600px`

```css
@media (max-width: 600px) {
  .two .stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
}
```
- In Vendor and Admin portal views, dashboard metric counters collapse to 3 equal-width columns with 8px compact gaps.

---

## 4. Screenshot Verification & Visual Inspection

> **Methodology & Verification Distinction:**
> - **Source CSS Rules:** Extracted directly from `<style>` in `reference/Flaberry_Design1_Classic.html` (lines 478–721). These represent the definitive programmatic breakpoint rules.
> - **Screenshot Observations:** Evaluated against the static PNG captures in `screenshots/desktop/` and `screenshots/mobile/`. These verify the visual rendering at specific desktop (1366px) and mobile viewport widths.
> - **Dynamic Runtime State:** Interactive transitions (e.g. touch swipe gestures on rails, smooth drawer animations, viewport resize reflows) are derived from the source CSS/JS logic but have **not been executed or verified in a live browser**.

| Screen / Feature | Desktop Screenshot Reference (`screenshots/desktop/`) | Mobile Screenshot Reference (`screenshots/mobile/`) | Source Code Verification & CSS Rules | Verification Status |
|---|---|---|---|---|
| **Homepage Layout** | `home-desktop.png` (1366 x 7023 px): Full desktop layout, announcement ticker, 10-item mega menu, side-by-side hero slider with text on left and visual on right, 4-column product grids, 5 category showcase cards, 4-column footer. | `home-mobile.png` (245 x 5243 px): Stacked mobile layout, 3-item header, 5-button bottom dock (`.dock`), stacked hero with visual on top and text below, 2-column product grid, 72% peek rails, compact mobile footer. | Corresponds to `@media (max-width:960px)` (dock activation, header collapse) and `@media (max-width:640px)` (peek rails, 2-col grids). | Source-verified & Screenshot-observed (Not tested in live browser) |
| **Menu System** | `desktop-menu.png` (1355 x 390 px): Full-width mega menu dropdown expanded under Flowers, displaying 5 subcategory columns + promotional card. | `mobile-menu.png` (247 x 554 px): Slide-out drawer from left edge, level-1 category list with chevrons `›`, dark scrim backdrop. | Corresponds to `megaHTML()` for desktop and `mobMenu()` / `#mobmenu.drawer.left` for mobile. | Source-verified & Screenshot-observed (Not tested in live browser) |
| **Collection Page** | `collection-desktop.png` (1366 x 4050 px): Left sidebar filter panel (`.filters`), sorting dropdown on right, 4-column product grid. | `collection-mobile.png` (245 x 3236 px): No sidebar; filter toggle button (`.fbtn`) above grid, 2-column product cards. | Corresponds to `.filters { display: none }` and `.fbtn { display: inline-flex }` at `<=960px`. | Source-verified & Screenshot-observed (Not tested in live browser) |
| **Product Detail Page**| `PDP-desktop.png` (1366 x 4835 px): Left-hand sticky gallery with vertical thumbnail rail, right-hand product options, date/slot picker, addons, reviews below. | `PDP-mobile.png` (245 x 3728 px): Vertically stacked layout (main image -> horizontal thumbs -> title -> options -> slot picker -> addons), fixed sticky buy bar at bottom above dock. | Corresponds to `.pdp { grid-template-columns: 1fr }`, `.sticky-buy`, and `.has-sticky` at `<=960px`. | Source-verified & Screenshot-observed (Not tested in live browser) |

---

## 5. Responsive Component Behaviour Matrix

| UI Component | Desktop (>1180px) | Small Desktop (961px–1180px) | Tablet (641px–960px) | Mobile Smartphone (<=640px) |
|---|---|---|---|---|
| **Header Layout** | Full flexbar: Burger hidden, Logo, Search bar (max 560px), Pincode chip, Currency, 4 Quick Icons | Full flexbar: Link labels visible, tighter padding | 3-item grid: Burger (left), Logo (center), Currency (right). Search & icons hidden | Compact 3-item grid; Logo height reduced to 32px |
| **Navigation** | 10 mega menu items in horizontal flexbar | 10 items; tight padding (8px), no promo images in dropdown | Hidden (`display: none`); replaced by `#mobmenu` drawer | Hidden (`display: none`); replaced by `#mobmenu` drawer |
| **Bottom Dock** | Hidden (`display: none`) | Hidden (`display: none`) | Fixed bottom 5-action dock (`.dock`) | Fixed bottom 5-action dock with safe-area padding |
| **Hero Slider** | 2-column split (Text left, Image right, 600px min-height) | 2-column split; container padding adjusted | Single column stacked (Image top 4:3, Text below) | Single column stacked; text padding `22px 22px 80px` |
| **Category Cards** | 5 cards in single row | 3 cards visible; cards 4 & 5 hidden | 2 or 3 cards stacked | 2 columns (`repeat(2, 1fr)`); card 3 hidden |
| **Product Rails** | Horizontal rail showing 4 cards simultaneously | 4 cards visible (`calc((100% - 48px)/4)`) | Horizontal scroll rail with swipe | 72% peek card width (1.3 cards visible) |
| **Product Grids** | 4 columns (`repeat(4, minmax(0, 1fr))`) | 3 columns (`repeat(3, minmax(0, 1fr))`) | 3 or 2 columns | 2 columns (`repeat(2, minmax(0, 1fr))`), 12px gap |
| **PDP Gallery** | 2 columns (Thumbs left, Main image right, sticky) | Sticky gallery, 2 columns | Static single column (Main image top) | Main image top, 6 square thumbs below (`order: 2`) |
| **PDP Sticky Buy** | Hidden (`display: none`) | Hidden (`display: none`) | Fixed bottom bar above dock with price & Buy button | Fixed bottom bar above dock with safe-area offset |
| **Delivery Slots** | 2-column grid (`repeat(2, minmax(0, 1fr))`) | 2-column grid | 2-column grid | Single column stacked (`1fr`) |
| **Cart & Checkout** | 2-column layout (Main flow 1.5fr, Order summary 1fr) | 2-column layout | Single column stacked (`.ck-side` orders underneath) | Single column stacked, full width forms |
| **Storefront Footer**| 5-column comprehensive footer (`.foot .fd`) | 5 columns, condensed | 2 columns (`.cols { grid-template-columns: repeat(2, 1fr) }`) | Compact mobile footer (`.fm`): logo + inline pipe links |
| **WhatsApp Button** | Fixed bottom right: `24px` from bottom | Fixed bottom right: `24px` from bottom | Lifted above dock: `calc(76px + safe-area)` | Lifted above dock or sticky-buy: `calc(150px + safe-area)` |
