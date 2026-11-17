# Flaberry — Homepage Interaction Reference

**Primary Reference:** `reference/Flaberry_Design1_Classic.html`  
**Document Type:** Technical Interaction Specification — Homepage  
**Status:** Source-verified (Static Code & Screenshot Inspection); Not tested in a live browser  
**Associated Views:** `#home`

---

## 1. Overview of the Homepage Architecture

The Flaberry homepage in `Flaberry_Design1_Classic.html` operates as a Single-Page Application (SPA) view rendered into `<main id="app"></main>` via the JavaScript function `home()`. When the hash route is `#home` (or empty), `routeBase()` invokes `home()`, renders the section hierarchy, initializes the hero slider timer, resets scroll position, and attaches event listeners.

The storefront wrapper uses a "concept-style page card" structure:
- A dark utility announcement bar (`.ubar`, background `#22235c` / `#151312`) across the full top width.
- A white rounded main card container (`.page`, `background: #ffffff`, `border-radius: 24px 24px 0 0`) housing the sticky header, main content, and footer.
- A floating WhatsApp action button (`.wa`) at the bottom right.
- On mobile viewports (<=960px), a fixed bottom navigation dock (`.dock`) with 5 actions.

---

## 2. Global Header & Utility Bar Interactions (Homepage Context)

### 2.1 Utility Announcement Ticker (`.ubar .ticker`)
- **Location:** Top utility bar, centered.
- **Initial State:** Displays the first announcement message from `TICK` array (e.g., *"Festive sale · Flat 15% off flowers & cakes with code FESTIVE15"*).
- **Interactive Controls:**
  - Prev button (`#tickprev`): Taps/clicks call `tick(-1)` to display previous announcement.
  - Next button (`#ticknext`): Taps/clicks call `tick(1)` to advance announcement.
  - Auto-advance: Runs via `setInterval(() => tick(1), 5000)` every 5 seconds.
- **Mobile Behaviour (<=640px):** Prev/next buttons hidden (`display: none`), ticker text left-aligned, auto-rotates.

### 2.2 Currency & Market Selector (`#cursel`)
- **Location:** Utility bar (right side on desktop) / Header top right on mobile (<=960px).
- **Initial State:** Displays selected currency (default `INR` - `India · ₹ INR`).
- **Supported Currencies (from `CUR` object):**
  - `INR`: India (`₹`, factor 1)
  - `USD`: United States (`$`, factor 0.01192)
  - `GBP`: United Kingdom (`£`, factor 0.00905)
  - `AUD`: Australia (`A$`, factor 0.01818)
  - `CAD`: Canada (`C$`, factor 0.01664)
  - `EUR`: Europe (`€`, factor 0.01027)
  - `NZD`: New Zealand (`NZ$`, factor 0.01985)
  - `SGD`: Singapore (`S$`, factor 0.01545)
  - `AED`: UAE (`AED `, factor 0.04378)
  - `SAR`: Saudi Arabia (`SAR `, factor 0.04471)
  - `RUB`: Russia (`₽`, factor 0.9516)
- **User Action:** Select change triggers `change` event listener (`t.id === "cursel"` or `t.id === "ckcur"`).
- **Result:** Updates `S.cur = t.value`, saves to local state (`save()`), displays toast (*"Shopping from <Market> · <Cur>"*), and rerenders current view via `rerender()`. All prices across the page update to the converted currency.

> [!NOTE]
> **Pending Business Decision (Currency Selector vs. India-Only Market):** The prototype implements an 11-currency selector (`#cursel`) and client-side conversion engine (`CUR` object). However, confirmed Decision D-001 specifies that Flaberry operates in the India market only. Whether the production storefront should retain this currency selector (e.g., to accommodate the international Indian diaspora sending gifts to recipients in India using foreign cards), restrict the storefront strictly to INR, or adopt another approved configuration is flagged as a pending business decision requiring project owner approval. The prototype's current selector must not be removed or altered without explicit instruction.

### 2.3 Search Input & Live Suggestion Dropdown (`#searchf`, `#q`, `#suggest`)
- **Location:** Header center.
- **Initial State:** Empty input with placeholder *"Search flowers, cakes, gifts…"*, dropdown `#suggest` hidden.
- **Input Event (`input` on `#q`):**
  - When query length >= 1: Queries `CAT.prods` for matching product names, SKUs, and category tags.
  - Populates `#suggest` with matching categories, products (with thumbnail `IMGS[p]`, title, and formatted price), and a *"View all results"* link.
  - Unhides `#suggest`.
- **Keyboard & Submit Event:**
  - Submitting form `#searchf` (Enter key) sets `location.hash = "#search-" + encodeURIComponent(q)`.
  - ESC key or click outside dismisses `#suggest`.
- **Mobile Search Trigger (<=960px):**
  - Header search input hidden on mobile default.
  - Tapping Search icon in bottom dock (`#docksearch`) adds class `msearch` to `document.body`, displays fixed full-width search input at top of viewport with scrim overlay, and auto-focuses `#q`.

### 2.4 Delivery Pincode Chip (`#pinchip`)
- **Location:** Header between search bar and currency selector (desktop); hero section pinband (mobile & desktop).
- **Initial State:**
  - If `S.pin` is null/empty: Displays map pin icon with text *"Select delivery location"* and *"Check serviceability"*.
  - If `S.pin` is set (e.g., `110001`): Displays map pin icon with bold pincode, city/area name (e.g., *"110001 · Connaught Place, New Delhi"*), and green delivery dot.
- **User Action:** Click triggers `pinModal()`.
- **Result:** Opens the Pincode Selector Modal with scrim overlay.

### 2.5 Header Quick Actions (`.hicons`)
- **Track Order (`a[href="#track"]`):** Direct navigation to order lookup view.
- **Support (`a[href="#page-contact"]`):** Direct navigation to customer care page.
- **Account / Sign In (`a[href="#account"]`, `#acctlbl`):**
  - If logged out: Label says *"Sign in"*, navigates to `#login` (or `#account` which delegates to `login()`).
  - If logged in: Label says user first name or *"Account"*, navigates to `#account` dashboard.
- **Cart Button (`#cartbtn`, `#cartbadge`):**
  - Displays cart icon and badge count (`#cartbadge`). Hidden if `qty === 0`.
  - Click triggers `openCart()` which slides in the Cart Drawer (`#cartdrawer.on`) with backdrop scrim (`#scrim.on`).

---

## 3. Section-by-Section Homepage Interactions

### Section 1: Hero Carousel (`<section class="hero">`)

```
+---------------------------------------------------------------------------------------+
|  Slide Track (#herotrack)                                                            |
|  [ Text: Heading + Blurb + CTA Button ]    [ Product Visual (IMGS.bv1_x) ]           |
|                                                                                       |
|  < [Prev]               [Dot 0] [Dot 1] [Dot 2] [Dot 3] [Dot 4]               [Next] >  |
+---------------------------------------------------------------------------------------+
```

- **Data Source:** `HERO` array in lines 1802-1807:
  1. Slide 0: `bv1_1` (bg `#d6e6ec`) — *"Fresh flowers, delivered today"* -> CTA: *"Shop flowers"* (`#c-flowers`)
  2. Slide 1: `bv1_5` (bg `#9ee2f0`) — *"Cakes baked fresh on order"* -> CTA: *"Order a cake"* (`#c-cakes`)
  3. Slide 2: `bv1_3` (bg `#e2eef3`) — *"Flowers & chocolates, together"* -> CTA: *"Shop combos"* (`#c-flowers-and-chocolates`)
  4. Slide 3: `bv1_4` (bg `#d5e2e9`) — *"Brighten someone's day"* -> CTA: *"Shop gerberas"* (`#c-gerberas`)
  5. Slide 4: `bv1_2` (bg `#cde1ed`) — *"Fresh fruit baskets"* -> CTA: *"Shop fruit baskets"* (`#c-fruits`)
- **Carousel Controls:**
  - Prev button (`[data-hero="-1"]`): Shifts track left by calling `heroGo(heroI - 1)`.
  - Next button (`[data-hero="1"]`): Shifts track right by calling `heroGo(heroI + 1)`.
  - Dot pagination (`[data-dot="i"]`): Clicking a dot navigates directly to slide `i`.
  - Auto-play: `heroT = setInterval(() => heroGo(heroI + 1), 6000)` advances every 6 seconds. Automatically paused if document is hidden (`document.hidden`) or `#herotrack` is detached.
  - Touch / Swipe: Native CSS scroll-snap on mobile track.

### Section 2: Pincode-First Ordering Band (`<div class="pinband">`)
- **Location:** Immediately beneath the hero slider card.
- **Initial State:**
  - Left copy: Eyebrow *"Pincode-first ordering"*. If `S.pin` is set, displays *"Showing gifts deliverable to <pin> · <city>"*. If unset, displays *"Enter delivery pincode for accurate availability & delivery times"*.
  - Right: Quick pincode pills (`.quickpins`):
    - `110001` (Delhi)
    - `400001` (Mumbai)
    - `560001` (Bengaluru)
    - `700001` (Kolkata)
    - `600001` (Chennai)
    - `500001` (Hyderabad)
    - `411001` (Pune)
    - `122001` (Gurgaon)
- **User Action:**
  - Clicking any quick pincode chip (`[data-qp="<pincode>"]`) invokes `setPin(pincode)`.
  - Clicking *"Change pincode"* or *"Enter pincode"* invokes `pinModal()`.
- **Result:**
  - Validates pincode against `PINS` database.
  - Updates `S.pin`, stores in `localStorage`, displays confirmation toast (e.g., *"Showing gifts deliverable to 110001 · New Delhi"*), updates `#pinchip` text, and calls `route()` to refresh catalog availability badges and delivery estimates across the entire page.

### Section 3: "Shop by Category" Tile Rail (`<div class="rail">`)
- **Header:** Rail header (`railHead("Shop by category", "", "tilerail")`) with section title and prev/next rail scroll buttons (`button[data-rail="tilerail"][data-dir="-1|1"]`).
- **Content:** 16 circular category tiles (`tiles` array):
  1. `t_roses` -> `#c-roses` (Roses)
  2. `t_bouquets` -> `#c-bouquets` (Flower Bouquets)
  3. `t_orchids` -> `#c-orchids` (Orchids)
  4. `t_vase` -> `#c-vase` (Vase Arrangements)
  5. `t_heart` -> `#c-heart-shape` (Heart Shaped Flowers)
  6. `t_cakeflowers` -> `#c-cake-and-flowers` (Flowers with Cake)
  7. `t_premiumcake` -> `#c-designer-cakes` (Designer & Tier Cakes)
  8. `t_photocake` -> `#c-photo-cakes` (Photo Cakes)
  9. `t_eggless` -> `#c-eggless` (Eggless Cakes)
  10. `t_heartcake` -> `#c-red-velvet` (Red Velvet / Heart Cakes)
  11. `t_kidscake` -> `#c-kids-cakes` (Kids Cakes)
  12. `t_birthday` -> `#c-birthday` (Birthday)
  13. `t_anniv` -> `#c-anniversary` (Anniversary)
  14. `t_congrats` -> `#c-congratulations` (Congratulations)
  15. `t_thankyou` -> `#c-thank-you` (Thank You)
  16. `t_cakeflower2` -> `#c-combos` (All Combos)
- **User Interaction:**
  - Clicking rail scroll buttons smoothly scrolls rail by `rail.clientWidth * 0.8`.
  - Clicking any category tile routes immediately to `#c-<categoryKey>`.

### Section 4: Brand Authority & Performance Stats (`<div class="wrap intro">`)
- **Content:**
  - Headline: *"Delivering flowers & celebrations across India for 20+ years"*
  - Editorial description highlighting same-day, midnight delivery, fresh procurement, and verified bakery network.
  - 4 KPI metric cards:
    - **20+ Years** of gifting celebrations
    - **400+ Cities** covered with local florist partners
    - **1.2M+ Deliveries** completed
    - **4.8 ★** Google & customer rating

### Section 5: Category Showcase Banners (`<div class="ccards">`)
- **Layout:** 5 high-impact visual category banner cards:
  1. *"All Gifts"* (`#c-all`) — Dark card with luxury image `hx_velvet`
  2. *"Flowers"* (`#c-flowers`) — Bouquet imagery
  3. *"Cakes"* (`#c-cakes`) — Fresh bakery imagery
  4. *"Combos"* (`#c-combos`) — Flowers & chocolates/cakes combo imagery
  5. *"Gifts & Hampers"* (`#c-gifts`) — Sweets & hamper imagery
- **Interactions:**
  - Hover triggers scale zoom on background image (`transform: scale(1.04)`, `transition: transform 0.4s ease`).
  - Clicking navigates to `#c-<groupKey>`.
  - Responsive behavior: 4 columns on large desktop, 3 columns at <=1180px, 2 columns at <=640px.

### Section 6: Curated Product Rail — "Premium Flowers"
- **Header:** Title *"Premium flowers"*, subtitle *"Exotic stems and luxury arrangements"*, *"View all"* link to `#c-premium-flowers`, and left/right rail scroll arrows.
- **Content:** Displays 8 product cards rendered via `rail(collectionItems("premium-flowers"), {limit: 8})`.
- **Card Elements (`.pcard`):**
  - Image container (`.pthumb`) with 1:1 aspect ratio, rounded corners (`border-radius: 16px`).
  - Badges: *"Premium"* pill, *"Same day"* pill, or occasion tag.
  - Product title (`.pname`).
  - Pricing: Formatted current price (`.pprice b`), strikethrough original price (`.pprice s`) if discounted.
  - Star rating & review count (`.prate`, e.g., `4.8 ★ (120)`).
  - Earliest delivery badge (`.pdel`, e.g., *"Earliest: Today"* or *"Earliest: Tomorrow"* based on current time cutoff and pincode).
- **Card Click:** Routes to product detail page `#p-<productKey>`.

### Section 7: Key Service & USP Highlights (`<div class="feat">`)
- **Grid:** 5 service assurance pills/cards:
  1. `f_sameday`: *"Same Day Delivery"* — Order by 4 PM for guaranteed delivery today (`#c-same-day`).
  2. `f_midnight`: *"Midnight Delivery"* — Delivery between 11:00 PM – 11:59 PM (`#c-midnight`).
  3. `f_handcrafted`: *"Handcrafted by Florists"* — Arranged fresh by certified local florists (`#c-handcrafted`).
  4. `f_fresh`: *"Farm Fresh Stems"* — Direct cold-chain procurement (`#c-fresh`).
  5. `f_support`: *"24/7 Gifting Support"* — WhatsApp, call, and ticket assistance (`#page-contact`).
- **Responsive Behavior:** 5 items horizontal grid; collapses to 3 at <=960px (4th and 5th hidden); collapses to 2 or 1 on small screens.

### Section 8: Interactive Celebration Cakes Section with Subcategory Filter Tabs
- **Header:** Title *"Cakes for every celebration"*, subtitle *"Baked fresh on order by certified bakeries"*.
- **Filter Tabs Bar (`.optrow`):**
  - Buttons:
    1. *"All cakes"* (`data-cake-tab="all"`)
    2. *"Chocolate"* (`data-cake-tab="chocolate-cakes"`)
    3. *"Truffle"* (`data-cake-tab="truffle"`)
    4. *"Black forest"* (`data-cake-tab="black-forest"`)
    5. *"Red velvet"* (`data-cake-tab="red-velvet"`)
    6. *"Photo cakes"* (`data-cake-tab="photo-cakes"`)
    7. *"Eggless"* (`data-cake-tab="eggless"`)
- **User Action:** Tapping any tab button highlights the button and dynamically updates the 8-card cake product grid below without full page refresh.

### Section 9: Split Promotional Combo Feature (`<div class="wrap split">`)
- **Layout:**
  - Left side (Big Banner): Full-height promotional card featuring *"Flowers with Cake Combos"* (`IMGS.hx_mixbox`, `#c-cake-and-flowers`) with overlay text, badge, and CTA button.
  - Right side (2x2 Grid): 4 featured combo product cards with direct click to `#p-<id>`.
- **Responsive Behavior:** Side-by-side on desktop; collapses to single column stacked at <=960px (banner on top, grid below).

### Section 10: Seasonal & Event Countdown Rail ("Christmas is X days away")
- **Header:** Dynamically calculates days remaining until Christmas (`2026-12-25`) using local date math:
  `Math.ceil((fromIso("2026-12-25") - today0()) / DAY)`
  Headline reads: *"Christmas is X days away"* with subtitle *"Book now, choose delivery date at checkout"*.
- **Content:** Product rail showcasing holiday gifting items, plum cakes, dry fruit hampers, and seasonal arrangements.

### Section 11: Customer Reviews & Ratings Block (`reviewsBlock()`)
- **Overall Score Summary:**
  - Large rating score: `4.8` out of 5.
  - Star visualization: 5 gold stars (`ic.star`).
  - Total reviews badge: Based on 14,800+ verified customer reviews across India.
- **Review Cards Carousel / Grid (`.rv-list`):**
  - 6 verified customer testimonials:
    - Customer name & city (e.g., *"Pooja S., New Delhi"*, *"Rohan M., Mumbai"*)
    - Verified Buyer badge
    - 5-star rating
    - Review comment (praising freshness, punctuality of midnight delivery, flower fragrance)
    - Associated product badge (e.g., *"Red Rose Gift Luxe"*)

### Section 12: Trust Reassurance & Guarantees (`trustBlock()`)
- **Grid:** 4 trust pillars with iconography:
  1. `i_secure` — **100% Secure Checkout** (UPI, Credit/Debit cards, NetBanking, Razorpay, Cashfree).
  2. `i_20yrs` — **20+ Years of Freshness** (100% farm-fresh flower guarantee or free replacement).
  3. `i_pricing` — **On-Time or Refunded** (Committed delivery window or slot fee refunded).
  4. `i_support` — **Dedicated Customer Care** (8 AM to midnight support over WhatsApp and call).

### Section 13: SEO Educational Content Accordion (`seoBlock()`)
- **Content:** Expandable collapsible `<details class="faq">` blocks providing structured text on:
  - Online Flower Delivery in India
  - Midnight & Same Day Cake Delivery network
  - Occasion Gifting Guide (Birthdays, Anniversaries, Valentine's Day, Mother's Day)
  - Pincode serviceability across Tier 1, 2, and 3 Indian cities.

### Section 14: Global Footer Newsletter Form (`#newsf`)
- **Input:** `#newsin` (type `email`, placeholder *"Enter your email"*).
- **Submission:** On submit, prevents default and replaces form innerHTML with *"Subscribed. Watch your inbox for offers."*

### Section 15: Floating WhatsApp Contact Button (`.wa`)
- **Location:** Fixed at bottom-right corner (`bottom: 24px; right: 24px; z-index: 50`).
- **Action:** Opens `https://wa.me/917668523752` in a new tab with pre-filled support intent.
- **Mobile Offset (<=960px):** Automatically offsets above the mobile dock to `calc(76px + env(safe-area-inset-bottom, 0px))`.

---

## 4. Modal Dialog Interactions (Homepage)

### 4.1 Pincode Selection Modal (`pinModal()`)
- **Trigger:**
  - Automatic prompt: Triggered on first visit after 700ms if no pincode is saved in `localStorage` (`seenpin` flag).
  - Manual prompt: Click on `#pinchip`, click on *"Change"* in `.pinband`, or click on *"Check serviceability"* anywhere on the page.
- **Modal DOM Content:**
  - Heading: *"Enter delivery pincode"*
  - Subtitle: *"See gifts deliverable to your receiver's area, with exact delivery dates and cutoff times."*
  - Form `#pinmodalform`:
    - 6-digit numeric input `#pinmodalin` (`inputmode="numeric"`, `maxlength="6"`).
    - *"Check & apply"* primary button.
  - Quick City Selector pills (Delhi, Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad, Pune, Gurgaon).
  - Clear Pincode link (if pincode currently set).
- **Validation & Handling:**
  - Validates 6 numeric digits against `PINS` dataset.
  - If valid: Stores `S.pin = val`, updates `#pinchip`, closes modal, shows success toast, and refreshes storefront availability.
  - If invalid / unserviceable: Displays error notice (*"Sorry, we currently don't deliver to <pincode>. Browse gifts available for courier delivery or try another pincode."*) with link to `#not-serviceable`.
- **Dismissal:** Clicking modal close button (`button.x`), clicking backdrop scrim (`#scrim`), or pressing `Escape` key.

---

## 5. Mobile Dock Navigation Interactions (Homepage)

On screens <=960px, the fixed bottom dock (`.dock`) is displayed:

| Dock Item | Selector | Initial State | Tap Action | Resulting Behaviour |
|---|---|---|---|---|
| **Home** | `a[href="#home"][data-dk="home"]` | Active (`.on` in red `--flora`) | Tap | Navigates/scrolls to top of `#home` |
| **Menu** | `button#dockmenu` | Inactive | Tap | Opens mobile drawer (`#mobmenu.on`) with scrim |
| **Search** | `button#docksearch` | Inactive | Tap | Toggles `body.msearch`, opens top search overlay, focuses input `#q` |
| **Cart** | `a#dockcart[href="#cart"]` | Badge count (`#dockbadge`) | Tap (`e.preventDefault()`) | Opens sliding cart drawer (`#cartdrawer.on`) |
| **Account** | `a[href="#account"][data-dk="account"]` | Inactive | Tap | Navigates to `#account` (or `#login` if unauthenticated) |

---

## 6. Homepage Interaction Matrix

> **Verification Criteria:**
> - `Source-verified`: The DOM selector, event listener, and JavaScript implementation were confirmed in the source code.
> - `Browser-tested`: Runtime execution and visual state changes were directly exercised and observed in a live browser session. *(Note: Full live browser execution has not been conducted; all items below are source-verified).*
> - `Not tested`: Runtime behaviour has not been exercised.

| UI Component | DOM Element / Selector | Event | Trigger Condition | Handler / Function | State Change / Navigation Result | Verification Status |
|---|---|---|---|---|---|---|
| **Ticker Prev** | `#tickprev` | Click | None | `tick(-1)` | Rotates to previous ticker announcement | Source-verified (Not tested in live browser) |
| **Ticker Next** | `#ticknext` | Click | None | `tick(1)` | Rotates to next ticker announcement | Source-verified (Not tested in live browser) |
| **Currency Select** | `#cursel` | Change | Value changes | `change` event | Updates `S.cur`, recalculates money, rerenders view | Source-verified (Not tested in live browser) |
| **Search Input** | `#q` | Input | Length >= 1 | `suggest(val)` | Shows live dropdown `#suggest` with prods & cats | Source-verified (Not tested in live browser) |
| **Search Form** | `#searchf` | Submit | Enter key | Form submit | Sets `location.hash = "#search-" + q` | Source-verified (Not tested in live browser) |
| **Pincode Chip** | `#pinchip` | Click | None | `pinModal()` | Opens `#modal` with pincode input and quick cities | Source-verified (Not tested in live browser) |
| **Quick Pin Chip** | `[data-qp]` | Click | None | `setPin(val)` | Sets `S.pin`, toasts confirmation, rerenders | Source-verified (Not tested in live browser) |
| **Hero Prev** | `[data-hero="-1"]` | Click | None | `heroGo(heroI - 1)` | Shifts slide track left | Source-verified (Not tested in live browser) |
| **Hero Next** | `[data-hero="1"]` | Click | None | `heroGo(heroI + 1)` | Shifts slide track right | Source-verified (Not tested in live browser) |
| **Hero Dots** | `[data-dot]` | Click | Dot index | `heroGo(i)` | Shifts directly to slide index `i` | Source-verified (Not tested in live browser) |
| **Hero CTA** | `.hero .btn` | Click | None | `href="#c-..."` | Routes to collection page | Source-verified (Not tested in live browser) |
| **Tile Rail Prev** | `[data-rail][data-dir="-1"]`| Click | None | Scroll element | Scrolls tile rail left | Source-verified (Not tested in live browser) |
| **Tile Rail Next** | `[data-rail][data-dir="1"]` | Click | None | Scroll element | Scrolls tile rail right | Source-verified (Not tested in live browser) |
| **Category Tile** | `.tilerail a` | Click | None | `href="#c-..."` | Routes to specific category | Source-verified (Not tested in live browser) |
| **Category Card** | `.ccard` | Click | None | `href="#c-..."` | Routes to category group | Source-verified (Not tested in live browser) |
| **Product Rail Card**| `.pcard` | Click | None | `href="#p-..."` | Routes to PDP `#p-<sku>` | Source-verified (Not tested in live browser) |
| **Cake Filter Tab**| `[data-cake-tab]` | Click | Tab clicked | Filter grid | Filters cake products by category tag | Source-verified (Not tested in live browser) |
| **Cart Button** | `#cartbtn` | Click | None | `openCart()` | Slides open `#cartdrawer`, darkens `#scrim` | Source-verified (Not tested in live browser) |
| **Mobile Burger** | `#burger` | Click | None | `mobMenu()` | Opens `#mobmenu`, darkens `#scrim` | Source-verified (Not tested in live browser) |
| **Mobile Search** | `#docksearch` | Click | None | `body.msearch` | Pops open top search bar, focuses input | Source-verified (Not tested in live browser) |
| **Scrim Overlay** | `#scrim` | Click | Drawer/modal open | `closeAll()` | Closes all drawers, modals, search overlays | Source-verified (Not tested in live browser) |
| **WhatsApp Button**| `.wa` | Click | None | External link | Opens `wa.me/917668523752` | Source-verified (Not tested in live browser) |
