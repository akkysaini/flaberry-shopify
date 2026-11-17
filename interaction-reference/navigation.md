# Flaberry — Navigation & Routing Reference

**Primary Reference:** `reference/Flaberry_Design1_Classic.html`  
**Document Type:** Technical Specification — Navigation, Menus, Drawers & Routing  
**Status:** Source-verified (Static Code & Screenshot Inspection); Not tested in a live browser  

---

## 1. Global Navigation Architecture

The Flaberry prototype implements a client-side Single-Page Application (SPA) architecture controlled by hash-based routing (`window.location.hash`). Navigation events do not trigger full browser reloads; instead, a central router captures URL hash changes, updates global state, dynamically modifies the Document Object Model (DOM) inside `<main id="app"></main>`, manages viewport scroll positions, and updates application chrome (header, utility bar, footer, dock, and WhatsApp button).

### 1.1 Core Router Implementation (`route()`, `routeBase()`, `go()`)

```javascript
function go(h) {
  if (location.hash === "#" + h) route();
  else location.hash = h;
}

function route() {
  const h = decodeURIComponent(location.hash.slice(1)) || "home";
  // 1. Automatic post-expiry redirect for seasonal occasions
  if (h.startsWith("c-")) {
    const ex = UPCOMING.find(u => u.dest === h && upState(u) === "Expired");
    if (ex) {
      location.replace("#" + ex.after);
      toast(`${ex.name} has passed — showing ${collectionTitle(ex.after.slice(2))}`);
      return;
    }
  }
  // 2. Intent reset when leaving commerce flows
  if (!/^(c-|p-|cart|checkout|thanks-)/.test(h)) INTENT = {};
  // 3. Render page base
  routeBase();
  // 4. Update mobile bottom dock active states
  $$(".dock a[data-dk]").forEach(a =>
    a.classList.toggle("on", a.dataset.dk === (h === "home" ? "home" : h === "account" || h === "login" ? "account" : h === "cart" ? "cart" : ""))
  );
}
```

### 1.2 Viewport & Scroll Position Management
- **Default Route Change:** `window.scrollTo(0, 0)` executes upon every route change to ensure standard page transitions.
- **Stateful In-Page Operations:** When changing collection filters, sorting options, pagination, or modifying cart quantities, the prototype sets `route._keep = true`. The `rerender()` function captures `const y = window.scrollY`, re-executes `route()`, and restores `window.scrollTo(0, y)` seamlessly without jumping to the page top.
- **Sticky Header Border:** A window scroll listener (`window.addEventListener("scroll")`) adds the `.scrolled` CSS class to `.hdr` when `window.scrollY > 40`, rendering a hairline bottom border (`border-bottom-color: var(--line)`) and removing the top card border radius.

### 1.3 Chrome Mode Switching (`document.body.dataset.mode`)
The router dynamically sets `document.body.dataset.mode` to isolate specific application contexts:

| Mode | Triggering Routes | Chrome Top (`#chrome-top`) | Utility Bar (`.ubar`) | Footer (`#footer`) | WhatsApp (`.wa`) | Mobile Dock (`.dock`) |
|---|---|---|---|---|---|---|
| `"store"` | `#home`, `#c-*`, `#p-*`, `#cart`, `#track*`, `#account`, `#page-*`, `#city-*`, `#search-*` | **Visible** | **Visible** | **Visible** | **Visible** | **Visible** (on mobile) |
| `"checkout"` | `#checkout`, `#thanks-*` | **Hidden** | **Hidden** | **Hidden** | **Hidden** | **Hidden** |
| `"panel"` | `#vendor`, `#admin` | **Hidden** | **Hidden** | **Hidden** | **Hidden** | **Hidden** |

> [!IMPORTANT]
> **Prototype Simulation Notice (Vendor & Admin Panels):** The `#vendor` (Vendor Portal) and `#admin` (Marketplace Admin) modes in the prototype are client-side demonstration interfaces using mock credentials (`••••••••`), local state (`localStorage`), and simulated data. They must NOT be treated as production-ready marketplace software. In production, core store operations reside in Shopify Admin, vendor onboarding/portal functionality belongs to an approved Marketplace Application (e.g., Webkul), and automated allocation belongs to a secure custom backend routing service.

---

## 2. Desktop Navigation & Mega Menus

Desktop navigation is rendered into `#nav` inside `.hdr.fbhdr` by `buildNav()`. The final active navigation definition is governed by `MENU_FB` (lines 1861–1961), containing 10 primary navigation items:

```
+-------------------------------------------------------------------------------------------------------------------------------+
|  Upcoming (HOT) | Birthday | Anniversary | Flowers | Cakes | Combos | Gifts | Fresh Fruits | Same Day | Occasions             |
+-------------------------------------------------------------------------------------------------------------------------------+
```

### 2.1 Complete Navigation Structure (`MENU_FB`)

#### 1. Upcoming (`#c-upcoming` — Hot Seasonal Item)
- **Badge:** Marked with `.hot` (`color: var(--flora-deep)` / `#ad1f2b`).
- **Dynamic Content:** Governed by `UPCOMING` schedule (Christmas, New Year, Valentine's Week, Diwali).
- **Mega Menu Layout:** Displays occasion cards with date badges, occasion image (`hx_xmascake`, `hx_truffle`, `hx_heartbox`), sub-links, and a *"Plan ahead"* column (Book advance delivery, Midnight delivery, Serviceable pincodes, View all upcoming).
- **Post-Expiry Redirection:** If an occasion date has passed (`today > to`), clicking its destination route automatically redirects to the designated fallback (`after`, e.g., `#c-christmas` redirects to `#c-new-year`).

#### 2. Birthday (`#c-birthday`)
- **Column 1 — Signature Gifts:** Birthday Flowers (`#c-birthday`), Birthday Cakes (`#c-chocolate-cakes`), Photo Cakes (`#c-photo-cakes`), Flowers with Cake (`#c-cake-and-flowers`), Plants (`#c-plants`).
- **Column 2 — By Relationship:** For Her (`#c-for-her`), For Him (`#c-for-him`), For Mother (`#c-for-mother`), For Father (`#c-for-father`), For Friends (`#c-for-friends`), For Kids (`#c-for-kids`).
- **Column 3 — Delivery Options:** Midnight Delivery (`#c-midnight`), Same Day Delivery (`#c-same-day`).
- **Promo Card:** Thumbnail `t_birthday`, caption *"Birthday gifting stop"*, destination `#c-birthday`.

#### 3. Anniversary (`#c-anniversary`)
- **Column 1 — Anniversary:** Anniversary Flowers (`#c-anniversary`), Red Roses (`#c-red-flowers`), Heart Shaped (`#c-heart-shape`), Anniversary Cakes (`#c-red-velvet`), Love & Romance (`#c-romance`).
- **Column 2 — By Relationship:** For Wife (`#c-for-wife`), For Husband (`#c-for-husband`), For Parents (`#c-for-parents`).
- **Column 3 — Milestones:** 1st Anniversary (`#c-first-anniv`), 25th Silver Jubilee (`#c-anniv-cakes`), 50th Golden Jubilee (`#c-premium-flowers`).
- **Promo Card:** Thumbnail `t_anniv`, caption *"Celebrate milestones"*, destination `#c-anniversary`.

#### 4. Flowers (`#c-flowers`)
- **Column 1 — Types of Flowers:** Roses (`#c-roses`), Orchids (`#c-orchids`), Lilies (`#c-lilies`), Carnations (`#c-carnations`), Gerberas (`#c-gerberas`), Sunflowers (`#c-sunflowers`), Premium Flowers (`#c-premium-flowers`), Mixed (`#c-mixed-flowers`), All Roses (`#c-roses`), All Flowers (`#c-flowers`).
- **Column 2 — Floral Collection:** Bouquets (`#c-bouquets`), Vase Arrangements (`#c-vase`), Box Arrangements (`#c-box`), Heart Shaped (`#c-heart-shape`), Wreaths (`#c-sympathy`), Baskets (`#c-baskets`), Floral Arrangements (`#c-arrangements`), Chocolate Bouquets (`#c-choco-bouquet`), Romantic Flowers (`#c-romantic-flowers`).
- **Column 3 — By Occasion:** Birthday (`#c-bday-flowers`), Anniversary (`#c-anniv-flowers`), Congratulations (`#c-congrats-flowers`), Wedding (`#c-wedding-flowers`), Sorry (`#c-sorry-flowers`), Miss You (`#c-missyou-flowers`), Get Well Soon (`#c-getwell-flowers`), Sympathy (`#c-sympathy`), Thank You (`#c-thanks-flowers`), Midnight (`#c-midnight-flowers`), Same Day (`#c-sameday-flowers`).
- **Column 4 — By Relation:** For Her, Him, Girlfriend, Wife, Husband, Boyfriend, Mother, Father, Parents.
- **Column 5 — By Colour:** Red (`#c-red-flowers`), Pink (`#c-pink-flowers`), Yellow (`#c-yellow-flowers`), White (`#c-white-flowers`), Mixed (`#c-mixed-flowers`).

#### 5. Cakes (`#c-cakes`)
- **Column 1 — Flavours:** Chocolate (`#c-chocolate-cakes`), Black Forest (`#c-black-forest`), Red Velvet (`#c-red-velvet`), Chocolate Truffle (`#c-truffle`), Fresh Fruit (`#c-fruit-cakes`), Butterscotch (`#c-butterscotch`), Pineapple (`#c-pineapple`), Vanilla (`#c-vanilla-cakes`), Strawberry (`#c-strawberry-cakes`), Cheese Cakes (`#c-cheese-cakes`).
- **Column 2 — Cake Types:** Heart Shaped (`#c-heart-cakes`), Eggless (`#c-eggless`), Premium (`#c-premium-cakes`), Photo (`#c-photo-cakes`), Jungle Theme (`#c-jungle-cakes`), Barbie Doll (`#c-barbie-cakes`), Spiderman (`#c-spiderman-cakes`), Doraemon (`#c-doraemon-cakes`), Tier (`#c-tier-cakes`), Designer (`#c-designer-cakes`).
- **Column 3 — By Occasion / Delivery:** Birthday (`#c-bday-cakes`), Anniversary (`#c-anniv-cakes`), Wedding (`#c-wedding-cakes`), Kids (`#c-kids-cakes`), First Birthday (`#c-first-bday-cakes`), First Anniversary (`#c-first-anniv-cakes`), Same Day (`#c-sameday-cakes`), Midnight (`#c-midnight-cakes`), Fixed Time (`#c-fixedtime-cakes`).
- **Promo Card:** Thumbnail `t_photocake`, caption *"Photo cakes, personalised"*, destination `#c-photo-cakes`.

#### 6. Combos (`#c-combos`)
- **Column 1 — Popular Combos:** Flowers with Cake (`#c-cake-and-flowers`), Flowers with Chocolates (`#c-flowers-and-chocolates`), Flowers with Teddy (`#c-flowers-and-teddies`), Cake with Chocolates (`#c-combos`), Cake with Flowers & Teddy (`#c-combos`).
- **Column 2 — By Occasion:** Birthday Combos (`#c-birthday`), Anniversary Combos (`#c-anniversary`), Romantic Combos (`#c-romance`).
- **Promo Card:** Thumbnail `t_cakeflowers`, caption *"Best of both worlds"*, destination `#c-cake-and-flowers`.

#### 7. Gifts (`#c-gifts`)
- **Column 1 — Sweets & Gourmet:** Sweets & Mithai (`#c-sweets`), Dry Fruits (`#c-dry-fruits`), Fresh Fruit Baskets (`#c-fruits`), Gift Hampers (`#c-hampers`), Chocolates (`#c-flowers-and-chocolates`).
- **Column 2 — Green Living & Decor:** Plants (`#c-plants`), Lucky Bamboo (`#c-plants`), Indoor Flowering Plants (`#c-plants`), Bonsai (`#c-plants`).
- **Column 3 — Personalised Gifts:** Personalised Photo Frames, Mugs, Cushions, Engraved Keepsakes.
- **Promo Card:** Thumbnail `t_congrats`, caption *"Curated gift hampers"*, destination `#c-hampers`.

#### 8. Fresh Fruits (`#c-fresh-fruits`)
- Direct collection route featuring seasonal fruit baskets and fruit bouquets with morning packing assurance.

#### 9. Same Day (`#c-same-day`)
- Direct collection route filtering items eligible for same-day delivery under active pincode cutoff rules.

#### 10. Occasions (`#c-occasions`)
- **Column 1 — Celebrate:** Birthday (`#c-birthday`), Anniversary (`#c-anniversary`), Congratulations (`#c-congratulations`), Wedding (`#c-wedding-gifts`), New Born (`#c-newborn-gifts`), House Warming (`#c-housewarming-gifts`).
- **Column 2 — Express:** Thank You (`#c-thank-you`), Sorry (`#c-sorry-gifts`), Love & Romance (`#c-romance`), Get Well Soon (`#c-get-well-soon`), Sympathy (`#c-sympathy`).
- **Promo Card:** Thumbnail `t_thankyou`, caption *"Say thank you with flowers"*, destination `#c-thank-you`.

### 2.2 Mega Menu Interaction Mechanics
- **Trigger:** Hovering on any navigation link (`mouseenter` on `#nav>div`) clears any pending closing timer and adds class `.open`, revealing `.mega`.
- **Close Delay:** Leaving the link/dropdown (`mouseleave`) invokes a 120ms debounce timeout before removing `.open`. This prevents accidental dismissal when moving the cursor between the navigation bar and the mega dropdown.
- **Click Toggle:** Clicking the navigation link button (`.nl`) toggles `.open` directly.
- **Link Click:** Clicking any anchor (`<a>`) inside `.mega` immediately removes `.open` from all menu items to clear the screen during page transition.

---

## 3. Mobile Navigation System (`mobMenu()`, `#mobmenu`)

On mobile viewports (<=960px), desktop `#nav` is hidden (`display: none`). Mobile navigation is handled by the dedicated slide-out drawer `#mobmenu.drawer.left`, which slides in from the left edge over a darkened backdrop scrim (`#scrim.on`).

```
+-------------------------------------------------------------+
|  [Header: Menu]                                         [X] |
+-------------------------------------------------------------+
|  [ Shop all gifts ] (Primary Action Button)                 |
|                                                             |
|  Upcoming (HOT)                                           > |
|  Birthday                                                 > |
|  Anniversary                                              > |
|  Flowers                                                  > |
|  Cakes                                                    > |
|  Combos                                                   > |
|  Gifts                                                    > |
|  Fresh Fruits                                             > |
|  Same Day                                                 > |
|  Occasions                                                > |
|                                                             |
|  ---------------------------------------------------------  |
|  Quick Support & Utility Links                              |
|  - Track order                                              |
|  - My account                                               |
|  - Support / Contact us                                     |
|  - Serviceable pincodes                                     |
|  - Corporate gifting                                        |
|  - Become a partner                                         |
|  - Blog                                                     |
+-------------------------------------------------------------+
```

### 3.1 Two-Level Hierarchical Drilldown

The mobile menu implements an interactive 2-level drilldown pattern without reloading or opening separate pages:

#### Level 1: Master Category View (`mobMenu()`)
- Triggered by clicking burger icon `#burger` in header or Menu button `#dockmenu` in bottom dock.
- Displays full-width primary button: *"Shop all gifts"* (`#c-all`).
- Renders category rows (`.mm-row`) with title and right chevron indicator `›`.
- Renders utility footer links: Track order, My account, Support, Serviceable pincodes, Corporate, Become a partner, Blog.

#### Level 2: Subcategory Drilldown (`mobMenu(index)`)
- Triggered by tapping any category button carrying attribute `data-mm="<index>"`.
- Replaces drawer body content with:
  - Top back button: `‹ All categories` (`button[data-mmback]`). Tapping returns to Level 1.
  - Category header: Eyebrow *"Shop"*, large category title, and *"Shop all <Category>"* button (`#c-<href>`).
  - Subcategory Column Accordions (`<details class="faq mm-grp">`):
    - Subcategory group name as summary title.
    - First accordion is open by default (`open="true"`).
    - Tapping accordion expands/collapses sub-links.
- Automatically resets drawer scroll position to top (`body.scrollTop = 0`).

---

## 4. Mobile Bottom Navigation Dock (`.dock`)

On screens <=960px, a persistent 5-action dock is fixed to the bottom of the viewport:

```
+-------------------------------------------------------------------------+
|   [Home]     [Menu]       [Search]       [Cart (3)]       [Account]     |
+-------------------------------------------------------------------------+
```

1. **Home (`a[data-dk="home"][href="#home"]`):** Direct navigation to `#home`. Active when route is `#home`.
2. **Menu (`button#dockmenu`):** Invokes `mobMenu()`, opens `#mobmenu`, and activates `#scrim`.
3. **Search (`button#docksearch`):** Adds class `msearch` to `document.body`, displays full-width search input at the top of the screen with scrim backdrop, and auto-focuses `#q`.
4. **Cart (`a#dockcart[data-dk="cart"][href="#cart"]`):** Intercepted via `e.preventDefault()`, opens `#cartdrawer` with scrim. Features live badge counter `#dockbadge`.
5. **Account (`a[data-dk="account"][href="#account"]`):** Navigates to `#account` dashboard (or `#login` if unauthenticated).

---

## 5. Comprehensive Hash Route Directory (20 Defined Patterns + 1 Catch-All Fallback)

The client-side router (`routeBase()`, lines 1640–1667) evaluates incoming URL hash strings using an `if / else if / else` branching architecture. 

To maintain strict technical precision, the routing implementation is categorized as follows:
- **Defined Route Patterns (20 patterns):** Comprising **12 exact static route matches** (`#home`, `#tour`, `#cart`, `#checkout`, `#track`, `#login`, `#signup`, `#reset`, `#account`, `#not-serviceable`, `#vendor`, `#admin`) and **8 parameterized prefix patterns** (`#c-<key>`, `#p-<key>`, `#thanks-<id>`, `#track-<id>`, `#page-<id>`, `#blog-<id>`, `#city-<city>`, `#search-<query>`).
- **Catch-All Fallback (1 handler):** The final `else` branch calls `notFound()`, rendering an error 404 view for any unmapped hash.
- **Total Routed View Handlers:** **21 branches** inside the `routeBase()` conditional chain.
- **Individual Page Instances:** The 20 defined patterns dynamically render hundreds of unique page instances across the application (39 physical category pages + virtual collections, 372 individual product detail pages, 10 static informational policy pages, multiple city landing pages, and blog posts).
- **Global UI Shell Components (Not Routes):** Interactive containers such as the slide-in cart drawer (`#cartdrawer`), mobile drawer (`#mobmenu`), and modal dialog (`#modal`) are persistent DOM elements manipulated via class toggles rather than independent hash routes.

| # | Hash Route Pattern | Function Call | Page Classification | Description & Primary View Components |
|---|---|---|---|---|
| 1 | `#home` | `home()` | Defined Static Route | Master Storefront Homepage: Hero carousel, pinband, category rail, intro stats, ccards, product rails, cake tabs, reviews, trust, SEO blocks |
| 2 | `#tour` | `home()` + `guide()` | Defined Static Route | Homepage with Interactive Tour: Renders homepage layout and launches animated guided walkthrough overlay |
| 3 | `#c-<key>` | `collection(key)` | Defined Parameterized Pattern | Collection Catalogue: Breadcrumbs, category banner, sidebar filters, sorting toolbar, 24-product grid, pagination, FAQs (39 physical + virtual collections) |
| 4 | `#p-<key>` | `product(key)` | Defined Parameterized Pattern | Product Detail Page (PDP): Image gallery, pricing, date/slot picker, cake options, message card, addons, buy row, sticky bar, reviews (372 products) |
| 5 | `#cart` | `cartPage()` | Defined Static Route | Full-Page Shopping Cart: Cart item list, slot metadata, pincode serviceability check, price summary, checkout CTA |
| 6 | `#checkout` | `checkout()` | Defined Static Route | Dedicated Multi-Step Checkout: Isolated checkout layout: express payment buttons, contact form, address form, slot review, payment options |
| 7 | `#thanks-<id>` | `thanks(id)` | Defined Parameterized Pattern | Order Confirmation / Thank You: Order number, delivery details summary, tracking link, WhatsApp notification confirmation |
| 8 | `#track` | `track()` | Defined Static Route | Order Lookup Search Screen: Order ID and phone/email self-service lookup form |
| 9 | `#track-<id>` | `track(id)` | Defined Parameterized Pattern | Order Live Status Stepper: Visual 6-stage stepper progression (Received -> Confirmed -> Assigned -> Preparing -> Out for Delivery -> Delivered) |
| 10 | `#login` | `login("login")` | Defined Static Route | Customer Sign-In Screen: Email and password login form, links to signup and password reset |
| 11 | `#signup` | `login("signup")` | Defined Static Route | Customer Registration Screen: Full name, email, mobile number, and password creation form |
| 12 | `#reset` | `login("reset")` | Defined Static Route | Password Recovery Screen: Email input for password reset instructions |
| 13 | `#account` | `account()` | Defined Static Route | Customer Account Dashboard: 4 tabs: Overview (KPIs, active orders), Orders history, Saved addresses, Profile editor |
| 14 | `#page-<id>` | `page(id)` | Defined Parameterized Pattern | Static Information Pages: 10 editorial policy/info pages (`about`, `contact`, `faq`, `terms`, `privacy`, `refund`, `shipping`, `pincodes`, `corporate`, `partner`) |
| 15 | `#blog-<id>` | `blogPost(id)` | Defined Parameterized Pattern | Editorial Blog Articles: Full-width blog article view with hero visual, metadata, editorial body text, and related articles rail |
| 16 | `#city-<city>` | `cityPage(city)` | Defined Parameterized Pattern | City Gifting Landing Pages: Localized city landing pages (Delhi, Mumbai, Bengaluru, Kolkata, Chennai, etc.) with local florist reassurance |
| 17 | `#search-<query>`| `searchPage(query)`| Defined Parameterized Pattern | Search Results Page: Matching catalogue results grid for user search keyword with breadcrumbs and count |
| 18 | `#not-serviceable`| `notServiceable()` | Defined Static Route | Delivery Unserviceable Notice: Explanatory notification when pincode has no eligible delivery vendors, with alternate city/courier suggestions |
| 19 | `#vendor` | `vendorPanel()` | Defined Static Route (Prototype Demo) | Prototype Vendor Portal: Demonstration vendor authentication, dashboard order queues, status progression, packing slip generator |
| 20 | `#admin` | `adminPanel()` | Defined Static Route (Prototype Demo) | Prototype Marketplace Admin Console: On-hold order allocation demonstration, vendor mapping, slot fees, occasion pricing rules, payments ledger |
| 21 | `*` (Catch-all) | `notFound()` | Catch-All 404 Fallback | 404 Error Screen: Large 404 graphic, *"Page not found"* messaging, and *"Back to store"* navigation CTA (executes when hash matches no defined pattern) |

> [!IMPORTANT]
> **Automatic Order Routing (Decision D-004) vs. Prototype On-Hold Allocation:**
> In the prototype's `#admin` panel, an "On-Hold Orders Queue" allows manual selection of which florist fulfils an order when multiple florists are serviceable. However, confirmed **Decision D-004 establishes that automatic vendor allocation based on product availability, vendor inventory, delivery eligibility, and distance is the primary production workflow**. Manual review is strictly an operational exception / fallback workflow for edge cases where automated routing cannot resolve eligibility. The prototype's manual interface must not supersede or replace the approved automatic routing engine. Specific tie-breaker rules remain pending project owner approval.

> [!NOTE]
> **Pending Decision on Currency Scope (Decision D-001 vs. Currency Selector):**
> While the prototype incorporates an 11-currency dropdown in the header, confirmed Decision D-001 specifies that Flaberry's market is India only. Whether production retains multi-currency browsing (for diaspora gift-senders delivering in India) or restricts the storefront strictly to INR is flagged as a pending business decision.

### Global UI Components (Not Independent Routes)

The following components represent persistent, stateful interface elements declared in the static HTML document shell rather than independent URL hash routes evaluated by `routeBase()`:

- **Slide-in Cart Drawer (`#cartdrawer`):** A persistent structural component (`<aside class="drawer" id="cartdrawer" aria-label="Cart">`) declared in the root document shell. It slides in over a darkened backdrop scrim (`#scrim`) from the right edge when triggered by the header cart button (`#cartbtn`), mobile dock cart action (`#dockcart`), or upon adding any item to the cart via `openCart()`. It operates via DOM class toggling (`classList.add("on")`) and does not possess an independent URL hash route pattern.
- **Mobile Navigation Drawer (`#mobmenu`):** Slide-out drawer from the left edge (`<aside class="drawer left" id="mobmenu">`) handling responsive 2-level category drilldown navigation on mobile viewports (<=960px).
- **Pincode Selection Modal (`#modal`):** Dialog overlay (`<div class="modal" id="modal">`) for delivery pincode entry, serviceable area lookup, and city validation.
- **Screen Scrim Backdrop (`#scrim`):** Semi-transparent backdrop (`<div class="scrim" id="scrim">`) that darkens page content when drawers or modals are active.

---

## 6. Breadcrumb Navigation System

The prototype constructs structured breadcrumbs on every interior page to maintain hierarchical orientation:

| Page Type | Breadcrumb Pattern | Source Function |
|---|---|---|
| **Collection Page** | `Home / <Parent Group> / <Collection Title>` | `crumbFor(key, parent)` |
| **Product Detail Page** | `Home / <Group Title> / <Category Title> / <Product Name>` | `product(k)` |
| **Cart Page** | `Home / Cart` | `cartPage()` |
| **Checkout Page** | `Cart › Information & payment › Confirmation` | `checkout()` |
| **Track Order Page** | `Home / Track order` | `track()` |
| **Static Info Page** | `Home / <Page Title>` | `page(id)` |
| **City Landing Page** | `Home / City delivery / <City Name>` | `cityPage(city)` |
