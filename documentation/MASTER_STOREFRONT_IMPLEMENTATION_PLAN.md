# Flaberry Shopify Storefront — Master Implementation Plan & Architecture Matrix

**Version:** 2.1.0 (Refined Coordinated Full Storefront Execution)  
**Date:** November 2026  
**Primary Design Reference:** `reference/Flaberry_Design1_Classic.html`  
**Base Theme:** Shopify Horizon v4.5.0 (`theme/`)  
**Store URL:** `flaberry-pps4i03n.myshopify.com`  
**Target Market:** Global (Shopify Markets native architecture)

---

## 1. Executive Summary & Core Engineering Principles

We are executing the development of the Flaberry Shopify storefront as a **coordinated full storefront engineering program** divided into 5 logical batches.

The following non-negotiable principles govern this execution:

1. **Design & UX Preservation:** Visual design, typography, spacing, colors, card elevations, and user interactions from `reference/Flaberry_Design1_Classic.html` must be reproduced faithfully.
2. **Admin-First Architecture:** Every section and component must be dynamic and manageable by a store administrator through Shopify Admin and Theme Editor. No hardcoded menus, products, collections, promotional messages, or URLs.
3. **Shopify Markets & Native Localization:** Supported Shopify Liquid properties (`localization.available_countries`, `localization.country`, `country.currency`) and native `{% form 'localization' %}` must drive country and currency availability. Never treat `cart.currency` as a list of available currencies (it is merely the active cart's currency). Never hardcode countries, currencies, or exchange rates.
4. **Pincode & Serviceability Integrity:** Do NOT provide default serviceable cities or pincodes. Do NOT invent delivery coverage, guarantees, or cutoff times. The location UI and serviceability adapter (`flaberry-pincode.js`) must be built as an extensible frontend shell that reports serviceability as **unverified** until an approved API or client-verified dataset is connected.
5. **Production Checkout Reality:** Prototype checkout steps (`#delivery-details`, `#sender-details`, `#payment`) were simulated SPA demonstrations. In production Shopify, checkout is handled by Shopify's hosted secure checkout engine. Storefront gifting attributes (`_delivery_date`, `_delivery_slot`, `_message_text`, `_eggless`) are passed as line-item properties. Any deeper checkout field injections require Shopify-supported Checkout Extensibility or certified apps. Never simulate payment or fake order placement as production functionality.
6. **Configurable Tracking & WhatsApp:** Build configurable frontend components. Do NOT invent tracking statuses, mock couriers, or live phone numbers. WhatsApp phone number and messages must be Theme Editor settings. Order tracking templates must render a configurable status shell awaiting real carrier integration.
7. **Autonomous Theme Execution with Strict Safety Gates:** Theme coding (Liquid, CSS, JS, JSON templates, Theme Check) proceeds autonomously within the approved theme scope. Stop gates apply strictly to paid apps, external APIs, credentials, destructive actions, Git commits, and theme publishing.

---

## 2. Complete Prototype Page & Feature Inventory

The original prototype contains **21 distinct view branches** (20 defined routes + 1 404 fallback) and **6 persistent global UI components**:

```
+--------------------------------------------------------------------------------------------------------------------+
|                                    FLABERRY PROTOTYPE COMPONENT & FEATURE INVENTORY                                |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| #  | VIEW / ROUTE                   | KEY PROTOTYPE ELEMENTS               | INTENDED SHOPIFY ARCHITECTURE         |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 1  | Homepage (#home / root)        | Hero slider, circular rails, product | templates/index.json                  |
|    |                                | tabs, trust badges, reviews, story   | 7 modular dynamic sections            |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 2  | Catalog / PLP (#plp,           | Breadcrumbs, facets bar, sorting,    | templates/collection.json             |
|    | #collection, #category/:slug)  | 4-col grid, gifting badges, quick-add| main-collection-product-grid.liquid   |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 3  | Product Detail Page (#pdp,     | Gallery, date picker, slot chips,    | templates/product.json                |
|    | #product/:id)                  | cake weight, eggless, card msg, addon| main-product.liquid + gifting snippets|
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 4  | Cart Drawer (#cartdrawer)      | Right slide-in drawer, date/slot info| snippets/cart-drawer.liquid           |
|    |                                | spend progress bar, addon upsell     | sections/cart-drawer.liquid           |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 5  | Shopping Cart Page (#cart)     | Full-page cart table, order notes    | templates/cart.json                   |
|    |                                | line item properties, checkout CTA   | main-cart-items.liquid                |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 6  | Delivery Details (Checkout 1)  | Recipient address, landmark, pincode | Shopify Hosted Checkout               |
|    |                                | (Prototype simulated demonstration)  | Line-item properties pass-through     |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 7  | Sender Details (Checkout 2)    | Sender name, email, phone, anonymous | Shopify Hosted Checkout               |
|    |                                | (Prototype simulated demonstration)  | Customer account & checkout contact   |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 8  | Payment & Review (Checkout 3)  | UPI, Cards, NetBanking, Wallets      | Shopify Payment Gateways              |
|    |                                | (Prototype simulated demonstration)  | (Standard compliant payment methods)  |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 9  | Order Confirmation (#thank-you)| Order ID, status banner, delivery eta| Shopify Order Status Page             |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 10 | Customer Account (#account)    | Profile, addresses, default pincode  | templates/customers/account.json      |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 11 | Order History (#orders)        | Past orders, reorder CTA, invoices   | templates/customers/order.json        |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 12 | Live Order Tracking (#track)   | Step-by-step progress timeline       | templates/page.track-order.json       |
|    |                                | (Configurable UI awaiting carrier)   | (Configurable carrier adapter)        |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 13 | Vendor Registration            | Business info, pincodes served, KYC  | templates/page.vendor-register.json   |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 14 | Vendor Portal (Simulated)      | Prototype mock dashboard (Not store) | External Vendor App / Backend System  |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 15 | Admin Operations (Simulated)   | Prototype mock routing (Not store)   | External Admin App / Shopify Admin    |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 16 | Franchise Page (#franchise)    | Brand model, benefits, inquiry form  | templates/page.franchise.json         |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 17 | Corporate Gifts (#corporate)   | Bulk order catalog, corporate inquiry| templates/page.corporate.json         |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 18 | About Us (#about)              | Brand legacy, mission, team story    | templates/page.about.json             |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 19 | Contact Us (#contact)          | Customer care form, phone, WhatsApp  | templates/page.contact.json           |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 20 | FAQ / Help Center (#faq)       | Categorized accordion question/answer| templates/page.faq.json               |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| 21 | 404 Fallback (#404)            | Clean 404 page with return search/CTA| templates/404.json                    |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| G1 | Top Utility Bar (.ubar, .tk)   | Announcement ticker, links, currency | sections/header-announcements.liquid  |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| G2 | Main Sticky Header (.fbhdr)    | Logo, Pincode chip, Search, Cart     | sections/header.liquid                |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| G3 | Mega Menu (.fbnav)             | 10-category multi-column dropdown    | snippets/flaberry-mega-menu.liquid    |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| G4 | Delivery Pincode Modal         | Postal code checker & location UI    | snippets/pincode-modal.liquid         |
|    |                                | (Unverified status until API ready)  | assets/flaberry-pincode.js            |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| G5 | Mobile Bottom Nav Dock (.dock) | Home, Categories, Search, Cart, User | snippets/mobile-bottom-dock.liquid    |
+----+--------------------------------+--------------------------------------+---------------------------------------+
| G6 | Floating WhatsApp Button       | Configurable support chat trigger    | snippets/whatsapp-widget.liquid       |
+----+--------------------------------+--------------------------------------+---------------------------------------+
```

---

## 3. Prototype-to-Shopify Implementation Matrix

```
+-------------------------------------------------------------------------------------------------------------------------+
|                                  SHOPIFY COMPONENT ARCHITECTURE & ADMIN MAPPING MATRIX                                  |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| PROTOTYPE COMPONENT                | SHOPIFY TARGET FILE                   | REUSE / CUSTOM     | ADMIN CONTROL DATA    |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Top Utility Bar & Announcement Ticker| sections/header-announcements.liquid| Extend Horizon     | link_list, color,     |
|                                    | assets/announcement-bar.js            | (DONE & VERIFIED)  | _announcement blocks  |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Main Storefront Header             | sections/header.liquid                | Extend Horizon     | settings.logo,        |
|                                    | snippets/header-logo.liquid           |                    | link_list (main menu) |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Delivery Location / Pincode Chip   | snippets/pincode-modal.liquid         | Custom Component   | Section settings,     |
|                                    | assets/flaberry-pincode.js            |                    | unverified status UI  |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Desktop Mega Menu & Flyouts        | snippets/flaberry-mega-menu.liquid    | Custom Component   | Multi-level link_list,|
|                                    | assets/flaberry-nav.css               |                    | promo banner blocks   |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Mobile 2-Level Nav Drawer          | snippets/mobile-drawer.liquid         | Extend Horizon     | Same link_list menu   |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Mobile Sticky Bottom Dock          | snippets/mobile-bottom-dock.liquid    | Custom Component   | Section toggle & links|
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Hero Banner Carousel               | sections/flaberry-hero.liquid         | Custom Section     | Blocks: image, link,  |
|                                    | assets/flaberry-hero.css              |                    | heading, subtext, CTA |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Circular Occasion Rail             | sections/flaberry-category-rail.liquid| Custom Section     | Blocks: collection,   |
|                                    | assets/flaberry-category-rail.css     |                    | custom image & label  |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Best Sellers / Occasion Tabs       | sections/flaberry-product-tabs.liquid | Custom Section     | Blocks: tab title,    |
|                                    | assets/flaberry-product-tabs.css      |                    | collection picker     |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Featured Product Rail / Grid       | sections/flaberry-product-rail.liquid | Custom Section     | Collection picker,    |
|                                    | snippets/flaberry-product-card.liquid |                    | limit, show badges    |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Why Choose Flaberry (Trust Badges) | sections/flaberry-trust-badges.liquid | Custom Section     | Blocks: icon, title,  |
|                                    | assets/flaberry-trust-badges.css      |                    | description           |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Customer Testimonials              | sections/flaberry-testimonials.liquid | Custom Section     | Blocks: quote, rating,|
|                                    | assets/flaberry-testimonials.css      |                    | author, city, badge   |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Brand Story & SEO Accordion        | sections/flaberry-brand-story.liquid  | Custom Section     | Rich text settings,   |
|                                    | assets/flaberry-brand-story.css       |                    | collapsible blocks    |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Global Storefront Footer           | sections/footer.liquid                | Extend Horizon     | 4 link_list menus,    |
|                                    | assets/footer.css                     |                    | social, newsletter    |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Product Card Component             | snippets/flaberry-product-card.liquid | Custom Snippet     | Product object, price,|
|                                    | assets/flaberry-product-card.css      |                    | badges, quick add     |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Collection Catalog & Filters       | templates/collection.json             | Extend Horizon     | collection object,    |
|                                    | sections/main-collection-product-grid |                    | native faceted filters|
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| PDP Main Product Section           | templates/product.json                | Extend Horizon     | product object,       |
|                                    | sections/main-product.liquid          |                    | variant selectors     |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Gifting Date & Time Slot Selector  | snippets/flaberry-delivery-picker.liquid| Custom Snippet   | Line item properties: |
|                                    | assets/flaberry-gifting.js            |                    | _delivery_date, _slot |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Cake Options (Weight & Eggless)    | snippets/flaberry-cake-options.liquid | Custom Snippet     | Variant options &     |
|                                    | assets/flaberry-gifting.js            |                    | _eggless property     |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Message on Cake & Greeting Card    | snippets/flaberry-gift-message.liquid | Custom Snippet     | Line item property:   |
|                                    | assets/flaberry-gifting.js            |                    | _message_text         |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Add-on Gifting Upsell Rail         | snippets/flaberry-product-addons.liquid| Custom Snippet   | Collection picker for |
|                                    | assets/flaberry-addons.css            |                    | addon accessories     |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Slide-out Cart Drawer              | sections/cart-drawer.liquid           | Extend Horizon     | cart object,          |
|                                    | snippets/cart-drawer.liquid           |                    | line.properties display|
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| Full Cart Page                     | templates/cart.json                   | Extend Horizon     | cart object           |
|                                    | sections/main-cart-items.liquid       |                    |                       |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
| WhatsApp Floating Trigger          | snippets/whatsapp-widget.liquid       | Custom Snippet     | Theme setting for     |
|                                    | assets/whatsapp-widget.css            |                    | phone & default msg   |
+------------------------------------+---------------------------------------+--------------------+-----------------------+
```

---

## 4. Current Audit & Completed Work

### Completed Deliverables (Verified & Intact)
1. **Horizon Integration:** Official Shopify Horizon v4.5.0 integrated into `theme/` with clean Git history.
2. **Design Tokens (`theme/assets/flaberry-tokens.css`):**
   - Exact brand colors: `--fl-color-flora: #e2522c`, `--fl-color-ink: #151312`, `--fl-color-paper: #ffffff`, `--fl-color-mist: #f5f2f0`, etc.
   - Verified typography metrics: Display font `Inter Tight`, Body font `Inter`.
   - Reusable spacing scale: 4px to 48px.
   - Elevation shadows, pill radii (`999px`), card radii (`16px`).
3. **Typography Ingestion (`theme/layout/theme.liquid`):** Preconnect and stylesheet links for `Inter Tight`.
4. **Task 4B.1 (Top Utility Bar & Announcement Ticker):**
   - 3-zone layout: dynamic utility `link_list`, center rotating ticker, right native currency dropdown.
   - Accessible keyboard suspension (`focusin` / `focusout`) and `prefers-reduced-motion` compliance.
   - High-contrast fix verified (`#f3efec` text on `#151312` background, 15.3:1 contrast ratio).
   - Zero Theme Check errors or warnings introduced.

---

## 5. Development Roadmap & Execution Batches

We will execute the remaining storefront implementation in **5 sequential batches**, breaking down each batch internally into smaller, focused, and testable tasks:

### Batch 1: Global Storefront Shell & Navigation
- **Task 1.1 — Main Storefront Header (`sections/header.liquid`):**
  - Implement Flaberry header layout with Admin-controlled logo (`settings.logo` / `snippets/header-logo.liquid`).
  - Add Delivery Location Chip trigger (`#pinchip`).
  - Add predictive search input trigger (`#q`).
  - Add customer account link (`#acctlbl`).
  - Add cart trigger button with live badge counter (`#cartbtn`, `#cartbadge`).
- **Task 1.2 — Mega Menu & Mobile Drawer (`snippets/flaberry-mega-menu.liquid`, `assets/flaberry-nav.css`):**
  - Desktop multi-column category dropdown powered by Shopify Admin navigation menu.
  - Mobile slide-out drawer preserving two-level category navigation.
- **Task 1.3 — Delivery Location Pincode Modal (`snippets/pincode-modal.liquid`, `assets/flaberry-pincode.js`):**
  - Pincode/postal code input modal triggered from `#pinchip`.
  - Extensible serviceability adapter: displays entered location as "Serviceability unverified" until an approved backend API is connected.
  - No invented cities, pincodes, or fake guarantees.
- **Task 1.4 — Mobile Sticky Bottom Dock (`snippets/mobile-bottom-dock.liquid`):**
  - 5-button touch dock (Home, Categories, Search, Cart, Account).
  - Cleanly hidden on desktop viewports (`>768px`).
- **Task 1.5 — Global Storefront Footer (`sections/footer.liquid`):**
  - 4-column menu directory using Admin `link_list` pickers.
  - Newsletter signup form, copyright, payment badges, and social media links.
- **Task 1.6 — Floating WhatsApp Support Widget (`snippets/whatsapp-widget.liquid`):**
  - Configurable floating chat pill using Theme Editor settings for phone number and initial greeting text.
  - Safely dormant if phone number is blank.

### Batch 2: Homepage Dynamic Sections (`templates/index.json`)
- **Task 2.1 — Hero Banner Slider (`sections/flaberry-hero.liquid`):** Admin-configurable banner slides with heading, subtext, link, and button.
- **Task 2.2 — Circular Occasion Category Rail (`sections/flaberry-category-rail.liquid`):** Horizontal scrollable occasion avatars with collection pickers.
- **Task 2.3 — Best Sellers / Occasion Tabbed Product Rail (`sections/flaberry-product-tabs.liquid`):** Multi-tab product rails (Flowers, Cakes, Combos, Plants).
- **Task 2.4 — Featured Product Grid / Rail (`sections/flaberry-product-rail.liquid`):** Collection product rails with gifting badge overlays.
- **Task 2.5 — Why Choose Flaberry Trust Badges (`sections/flaberry-trust-badges.liquid`):** Value proposition grid (Freshness, Timely Delivery, 500+ Cities, Secure Payments).
- **Task 2.6 — Customer Testimonials Slider (`sections/flaberry-testimonials.liquid`):** Verified customer reviews carousel.
- **Task 2.7 — Brand Story & SEO Accordion (`sections/flaberry-brand-story.liquid`):** Collapsible brand narrative and SEO text.
- **Task 2.8 — Homepage Assembly (`templates/index.json`):** Wire all sections in exact prototype order.

### Batch 3: Product Detail Page (PDP) & Gifting Selectors
- **Task 3.1 — PDP Layout & Media Gallery (`sections/main-product.liquid`):** Image gallery, thumbnails, product title, ratings, and price display.
- **Task 3.2 — Gifting Date & Slot Selector (`snippets/flaberry-delivery-picker.liquid`, `assets/flaberry-gifting.js`):** Date chips + time slot radio cards submitting `_delivery_date` and `_delivery_slot` line-item properties.
- **Task 3.3 — Cake Weight & Eggless Option (`snippets/flaberry-cake-options.liquid`):** Variant picker with eggless toggle property (`_eggless`).
- **Task 3.4 — Message on Cake / Card (`snippets/flaberry-gift-message.liquid`):** Custom message input submitting `_message_text`.
- **Task 3.5 — Add-on Accessories Upsell Rail (`snippets/flaberry-product-addons.liquid`):** Quick-add gifting add-ons.
- **Task 3.6 — PDP Pincode Checker Snippet:** Extensible location check on the product page.

### Batch 4: Collection Catalog, Filters & Predictive Search
- **Task 4.1 — Reusable Flaberry Product Card (`snippets/flaberry-product-card.liquid`):** Card with hover zoom, discount tags, delivery speed badge, price, and quick-add modal.
- **Task 4.2 — Collection Template & Grid (`templates/collection.json`, `sections/main-collection-product-grid.liquid`):** Responsive 4-col desktop / 2-col mobile grid.
- **Task 4.3 — Faceted Filters & Sorting (`snippets/facets.liquid`):** Native Shopify Search & Discovery filters styled to prototype.
- **Task 4.4 — Predictive Search (`sections/predictive-search.liquid`):** Live auto-suggest dropdown with product thumbnails.

### Batch 5: Cart Drawer, Cart Page, & Informational Templates
- **Task 5.1 — Cart Drawer Gifting Integration (`sections/cart-drawer.liquid`, `snippets/cart-drawer.liquid`):** Slide-out drawer displaying attached delivery date, slot, and cake message properties. Spend threshold free shipping bar.
- **Task 5.2 — Full Shopping Cart Page (`templates/cart.json`):** Dedicated cart page matching drawer styling.
- **Task 5.3 — Inquiry Page Templates (`templates/page.franchise.json`, `templates/page.corporate.json`):** Franchise and Corporate inquiry forms.
- **Task 5.4 — Order Tracking Template (`templates/page.track-order.json`):** Configurable tracking status UI.
- **Task 5.5 — Content Templates (`templates/page.faq.json`, `templates/page.about.json`, `templates/page.contact.json`, `templates/404.json`):** Informational pages.

---

## 6. Dependencies & Permissions Matrix

### Handled Autonomously Under Granted Permissions:
- Inspecting codebase, prototype files, and screenshots.
- Creating and modifying Liquid sections, snippets, templates, and config files in `theme/`.
- Creating and modifying CSS stylesheets and JavaScript custom elements in `theme/assets/`.
- Running `shopify theme check` and local validation scripts.
- Testing responsive layouts and edge cases.

### Mandatory Stop Gates (Require Explicit User Approval):
1. **Paid Apps & Subscriptions:** Installing any paid Shopify app or external paid service.
2. **Paid APIs & Secrets:** Generating or modifying API keys (Google Maps, WhatsApp Cloud API, payment gateway credentials).
3. **Destructive Changes:** Deleting important files or overwriting base theme logic outside approved scope.
4. **Git Commits & Pushes:** Running `git commit` or `git push` to remote GitHub repository.
5. **Theme Deployment:** Running `shopify theme push --live` or publishing themes to production.

---

## 7. Risks & Unresolved Business Decisions

| Risk / Unresolved Decision | Impact | Storefront Mitigation Strategy |
| :--- | :--- | :--- |
| **Global Market Carrier & Pricing Rules** | Shipping rates, duties, international currency rules await client document. | Storefront uses Shopify Markets native localization and multi-currency objects (`localization.available_countries`, `localization.country`). No country codes or currencies are hardcoded. |
| **Delivery Pincode & City Coverage Data** | Real-world database of serviceable pincodes and cutoff times is pending. | Storefront implements an extensible JS adapter (`flaberry-pincode.js`) that displays location as unverified. No fake cities or pincodes are invented. |
| **Multi-Vendor Order Routing & Settlements** | Prototype simulates vendor allocation in JS/localStorage; real routing requires backend microservice. | Storefront captures structured line-item properties (`_delivery_date`, `_delivery_slot`, `_message_text`, `_pincode`) into Shopify Order attributes for downstream backend consumption. |
| **Review & Social Proof Engine** | Native Shopify product reviews vs third-party app (Judge.me/Yotpo). | Storefront implements a clean, native review card snippet with standard app block injection (`{% content_for 'blocks' %}`) so third-party apps can plug in seamlessly. |
