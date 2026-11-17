# Flaberry — Horizon Component Mapping

**Document Version:** 1.0.0  
**Primary Reference:** `reference/Flaberry_Design1_Classic.html`  
**Base Theme:** Shopify Horizon v4.5.0  
**Document Purpose:** Detailed component-by-component engineering specification mapping Flaberry's HTML prototype elements to Shopify Horizon sections, blocks, snippets, and custom components.

---

## 1. Component Reusability Classification

Every component in the Flaberry storefront is categorized under one of four implementation classifications:

1. **Direct Reuse (`[DIRECT]`):** The Horizon section, block, or snippet satisfies the requirement natively. Requires only theme editor settings configuration.
2. **Reuse with Styling (`[STYLE]`):** The underlying Horizon Liquid structure, markup semantics, and accessibility features are retained. Custom CSS is applied to match Flaberry's typography, spacing, border radiuses, color palette, and micro-interactions.
3. **Heavily Modified (`[MODIFIED]`):** The Horizon Liquid file is substantially adapted by injecting custom markup, schema settings, or child blocks to support Flaberry-specific features.
4. **Net-New Custom Development (`[CUSTOM]`):** No adequate component exists in Horizon. A custom Liquid section, block, or snippet must be developed from scratch following Horizon's Theme Blocks standards.

---

## 2. Storefront Chrome & Global Navigation Components

```
+---------------------------------------------------------------------------------------------------------+
|                                    GLOBAL STOREFRONT CHROME ARCHITECTURE                                |
+---------------------------------------------------------------------------------------------------------+
| [Top Ticker Bar] .ubar / .tk  -> sections/header-announcements.liquid [STYLE]                           |
+---------------------------------------------------------------------------------------------------------+
| [Header] .hdr / .fbhdr        -> sections/header.liquid [MODIFIED]                                      |
|  - Brand Logo                 -> blocks/_header-logo.liquid [STYLE]                                     |
|  - Pincode Delivery Trigger   -> snippets/flaberry-pincode-trigger.liquid [CUSTOM]                      |
|  - Search Bar Trigger         -> snippets/search-modal.liquid [STYLE]                                   |
|  - Currency Selector (11 cur) -> snippets/flaberry-currency-dropdown.liquid [CUSTOM / PENDING]          |
|  - Account & Cart Actions     -> snippets/cart-drawer.liquid [STYLE]                                    |
+---------------------------------------------------------------------------------------------------------+
| [Desktop Mega Menu] #nav      -> blocks/_header-menu.liquid [MODIFIED]                                  |
|  - 10 Navigation Categories   -> Shopify Navigation (Menu: main-menu)                                   |
|  - 5-Col Subcategory Grid     -> Custom mega dropdown Liquid snippet [CUSTOM]                          |
|  - Promotional Banner Card    -> Custom schema-backed visual card block [CUSTOM]                        |
+---------------------------------------------------------------------------------------------------------+
| [Mobile Navigation] #mobmenu  -> snippets/flaberry-mobile-drawer.liquid [CUSTOM]                        |
|  - Level 1 Master Categories  -> Dynamic 1-click drilldown trigger                                      |
|  - Level 2 Subcategory Menu   -> Accordion group with ‹ Back button                                     |
+---------------------------------------------------------------------------------------------------------+
| [Mobile Bottom Dock] .dock    -> snippets/flaberry-bottom-dock.liquid [CUSTOM]                          |
|  - Home | Menu | Search | Cart (Badge) | Account                                                        |
+---------------------------------------------------------------------------------------------------------+
| [Cart Drawer] #cartdrawer     -> snippets/cart-drawer.liquid & cart-drawer-section.liquid [MODIFIED]    |
|  - Custom Line Attributes     -> Delivery Date, Slot Window, Printed Message Card                       |
+---------------------------------------------------------------------------------------------------------+
| [Floating WhatsApp] .wa       -> snippets/flaberry-whatsapp-button.liquid [CUSTOM]                      |
+---------------------------------------------------------------------------------------------------------+
```

### Detailed Component Specifications

| Component | Prototype Selector / Function | Horizon Equivalent | Classification | Implementation Details & Customization Scope |
|---|---|---|---|---|
| **Announcement Ticker** | `.ubar`, `.tk` (`rotateTicker()`) | `sections/header-announcements.liquid` + `blocks/_announcement.liquid` | `[STYLE]` | Configure speed to 5s, font size to 0.75rem (`12px`), background `#faf5ee`, text `#8c1d40`. Retain Horizon's marquee/announcement slider. |
| **Main Header** | `.hdr.fbhdr` | `sections/header.liquid` | `[MODIFIED]` | Reconfigure header grid to accommodate Flaberry's 4-column layout: Logo (Left), Pincode Selector (Center-Left), Search (Center), Currency/Account/Cart (Right). Add sticky border listener. |
| **Pincode Delivery Trigger** | `#pinbtn`, `#locdisplay` | *None* | `[CUSTOM]` | Create `snippets/flaberry-pincode-trigger.liquid`. Renders pin icon, location label (`"Deliver to: New Delhi 110001"`), and click event to open `#modal`. |
| **Pincode Selection Modal** | `#modal`, `#pininput`, `.chips` | *None* | `[CUSTOM]` | Create `snippets/flaberry-pincode-modal.liquid`. Houses 6-digit Indian pincode input, auto-detect trigger, 8 popular city quick chips, deliverability check feedback, and `localStorage` persistence. |
| **Currency Selector** | `#curbtn`, `#curpop` | `snippets/localization-country-selector.liquid` | `[CUSTOM / PENDING]` | Prototype features 11 currencies (INR, USD, EUR, GBP, CAD, AUD, AED, SGD, MYR, NZD, QAR). If multi-currency is approved (pending Decision D-001 review), map to Shopify Markets localization. |
| **Desktop Mega Menu** | `#nav`, `.nl`, `.mega` | `blocks/_header-menu.liquid` | `[MODIFIED]` | Extend Horizon's menu block to render Flaberry's 5-column subcategory matrix, top-level hover trigger with 120ms dismiss debounce, and right-hand promotional card (`t_redrose`, `t_bday`, etc.). |
| **Mobile Drawer Navigation** | `#mobmenu`, `mobMenu()` | `sections/header.liquid` (mobile drawer) | `[CUSTOM]` | Build `snippets/flaberry-mobile-drawer.liquid`. Replaces standard Horizon nested accordions with Flaberry's 2-level sliding screen drilldown (Level 1 master list -> Level 2 subcategories with back button). |
| **Mobile Bottom Navigation Dock**| `.dock` (`$$('.dock a')`) | *None* | `[CUSTOM]` | Build `snippets/flaberry-bottom-dock.liquid`. Fixed 5-action bottom bar on viewports `<=960px`: Home (`#home`), Menu (`#dockmenu`), Search (`#docksearch`), Cart with badge (`#dockcart`), Account (`#dockaccount`). |
| **Slide-in Cart Drawer** | `#cartdrawer`, `openCart()` | `snippets/cart-drawer.liquid` + `sections/cart-drawer-section.liquid` | `[MODIFIED]` | Adapt Horizon's cart drawer to display custom line-item properties (`_delivery_date`, `_delivery_slot_time`, `_message_text`, `_cake_weight`), delivery slot surcharge line, and checkout redirect. |
| **Floating WhatsApp Button** | `.wa` (`href*="api.whatsapp.com"`) | *None* | `[CUSTOM]` | Build `snippets/flaberry-whatsapp-button.liquid`. Fixed button at bottom-right with green circle (`#25D366`), phone icon, pulse animation, and direct chat link. |
| **Backdrop Scrim Overlay** | `#scrim.scrim` | `theme.liquid` overlay elements | `[STYLE]` | Leverage Horizon's native modal/drawer scrim or style Flaberry's `.scrim` (`background: rgba(18, 18, 18, 0.45); backdrop-filter: blur(2px)`). |

---

## 3. Homepage Sections (`index.json`)

The Flaberry homepage consists of 14 sequential sections from top to bottom. Here is the exact mapping to Horizon sections and blocks:

| # | Section Name | Prototype Markup / Function | Horizon Equivalent Section | Classification | Implementation Details |
|---|---|---|---|---|---|
| 1 | **Hero Slider Carousel** | `.hero`, `.slider`, 5 slides (`heroSlide()`) | `sections/slideshow.liquid` or `sections/carousel.liquid` | `[STYLE]` | 5 luxury slides with headline, subheadline, CTA button, dot pagination, autoplay (6s), and touch swipe gestures. Style overlay to match Flaberry dark gradient. |
| 2 | **Pincode Delivery Band** | `.pinband` (`setDeliveryPincode()`) | *None* (New Section) | `[CUSTOM]` | Build `sections/flaberry-pincode-band.liquid`. Prominent gold/cream bar with pincode checker, instant delivery guarantee badge, and city shortcuts. |
| 3 | **Circular Category Rail** | `.rail.tilerail`, 16 round tiles | `sections/collection-links.liquid` or custom section | `[MODIFIED]` | Reconfigure Horizon's collection links into 16 circular tiles (84px diameter) with subtle border hover, centered labels, and horizontal snap-scrolling. |
| 4 | **Brand Authority Stats Bar** | `.intro`, 4 authority metric cards | `sections/section.liquid` + `blocks/group.liquid` | `[STYLE]` | 4-column metric bar: `20+ Yrs Crafting Memories`, `400+ Indian Cities`, `1.2M+ Happy Deliveries`, `4.8★ Customer Rating`. |
| 5 | **Category Showcase Cards** | `.ccards`, 5 luxury category cards | `sections/collection-list.liquid` | `[STYLE]` | 5 large visual banners (Flowers, Cakes, Combos, Plants, Gourmet Gifts) with hover zoom effect and floating white label badges. |
| 6 | **Curated Product Rails** | `.rail.prodrail` ("Premium Flowers", etc.) | `sections/product-list.liquid` / `sections/carousel.liquid` | `[MODIFIED]` | Product carousel with custom card snippet (`snippets/flaberry-product-card.liquid`): image aspect ratio `1:1`, delivery tag (`"Earliest: Today"`), star rating, price with MRP strike-through, and quick add button. |
| 7 | **Service USP Highlights** | `.usp5`, 5 icon cards | `sections/media-with-content.liquid` / custom section | `[CUSTOM]` | Build `sections/flaberry-usp-highlights.liquid`. 5 service commitments: Farm-Fresh Stems, 100% Eggless Option, Midnight Delivery, Same-Day 2-Hour Delivery, Free Delivery. |
| 8 | **Celebration Cakes Tabbed Section** | `.cblock` / `.filter-tabs` (Flavours, Designer, Photo) | *None* (New Section) | `[CUSTOM]` | Build `sections/flaberry-cake-tabs.liquid`. Dynamic tab switcher filtering cake collections (Chocolate Truffle, Red Velvet, Black Forest, Photo Cakes, Designer Cakes) without full page reload. |
| 9 | **Split Promotional Combo Banner** | `.split-combo` (Large visual banner + 4-card grid) | `sections/media-with-content.liquid` | `[MODIFIED]` | 50/50 split section: Left column has promotional lifestyle image banner; right column has 2x2 grid of bestselling gift combos. |
| 10 | **Christmas / Seasonal Occasion Rail** | `.rail.seasonal` with countdown timer | `sections/product-list.liquid` + countdown block | `[CUSTOM]` | Build `sections/flaberry-seasonal-rail.liquid`. Seasonal visual banner with live countdown clock (`days : hours : mins : secs`) and curated occasion products. |
| 11 | **Customer Reviews Grid** | `.reviews-home` (Verified customer testimonials) | `sections/section.liquid` + custom review blocks | `[STYLE]` | 3-column card grid with star rating, customer name, verified city tag (Delhi, Mumbai, Bengaluru), and gifting review text. |
| 12 | **Trust Reassurance Pillars** | `.trust-pillars` (Secure Payment, Freshness, Support) | `sections/section.liquid` + `blocks/group.liquid` | `[STYLE]` | 4 trust icons: 100% Freshness Guarantee, Secure UPI & Card Payments, Dedicated WhatsApp Support, Contactless Delivery. |
| 13 | **Expandable SEO Content Accordion**| `.seo-accordion`, `<details>` blocks | `sections/section.liquid` + `blocks/accordion.liquid` | `[DIRECT]` | Horizon's native `accordion.liquid` block directly satisfies this requirement. Collapsible rich text sections for search engine indexation. |
| 14 | **Newsletter Subscription Box** | `.newsletter-box` | `sections/footer.liquid` or `blocks/email-signup.liquid` | `[DIRECT]` | Horizon's native `email-signup.liquid` block satisfies customer email capture. Style button and input border to match Flaberry palette. |

---

## 4. Product Detail Page Components (`product.json`)

The Product Detail Page is Flaberry's most complex interactive screen, requiring custom gifting parameter selectors:

```
+---------------------------------------------------------------------------------------------------------+
|                                  FLABERRY PRODUCT DETAIL PAGE (PDP) LAYOUT                              |
+-----------------------------------------------------+---------------------------------------------------+
| LEFT COLUMN: Visual Media                           | RIGHT COLUMN: Gifting Details & Options           |
+-----------------------------------------------------+---------------------------------------------------+
| - Breadcrumbs Navigation                            | - Product Title, SKU & Rating (with reviews link) |
| - Vertical / Horizontal Thumbnail Strip             | - Dynamic Price Display with MRP & Strike-through |
| - Main Image (4-Angle Zoom & Video Trigger)         | - Delivery Pincode Checker (with city validation) |
| - Description & Specifications Tabs                 | - Cake Options: Weight chips & Eggless selector   |
| - Care Instructions Tab                             | - 14-Day Delivery Date Picker & Advance Picker    |
| - Verified Customer Reviews                         | - Delivery Time Slot Selector (Standard/Midnight) |
|                                                     | - Gift Message Card Builder (Occasion + Text)     |
|                                                     | - Addon Upsell Carousel (Teddy, Chocolates)       |
|                                                     | - Quantity Stepper, Add to Cart & Buy Now CTAs   |
+-----------------------------------------------------+---------------------------------------------------+
| BOTTOM (Mobile <=960px): Persistent Sticky Buy Bar (Thumbnail, Title, Price, Buy Now Button)           |
+---------------------------------------------------------------------------------------------------------+
```

### PDP Component Breakdown

| Component | Prototype Implementation | Horizon Base Equivalent | Classification | Implementation Details |
|---|---|---|---|---|
| **Media Gallery** | `.pdp-gallery`, zoom, thumbnails | `_product-media-gallery.liquid` | `[STYLE]` | Horizon's native gallery supports thumbnails, zoom, and videos. Style thumbnail strip (vertical on desktop, horizontal scroll on mobile). |
| **Product Information & Price**| Title, SKU, star rating, price, strike-through | `product-title.liquid`, `price.liquid`, `review.liquid` | `[STYLE]` | Reconfigure font styles to Playfair Display for title; style MRP strike-through price and occasion discount badge. |
| **Delivery Pincode Checker** | `#pdp-pincode`, deliverability feedback | *None* | `[CUSTOM]` | Build `blocks/flaberry-pdp-pincode.liquid`. Checks entered pincode against serviceable database; validates whether selected item can be delivered. |
| **14-Day Delivery Date Picker**| Horizontal 14-day date chips + advance picker | *None* | `[CUSTOM]` | Build `blocks/flaberry-delivery-date.liquid`. Interactive day chips showing Day of week, Date, and Month; highlights blackout dates; includes date picker for up to 90 days. |
| **Delivery Time Slot Selector**| Standard (Free), Fixed Time, Midnight, Early AM | *None* | `[CUSTOM]` | Build `blocks/flaberry-delivery-slots.liquid`. Slot category pills with sub-slot radio chips (e.g. 15:00–16:00) and live surcharge fee addition. |
| **Cake Weight & Eggless Options**| Weight chips (0.5kg–4kg), Eggless toggle | `variant-picker.liquid` | `[MODIFIED]` | Extend Horizon's variant picker into horizontal pill chips with weight badges. Support photo upload for custom photo cakes. |
| **Gift Message Card Builder** | Occasion dropdown, chips, 250-char textarea | *None* | `[CUSTOM]` | Build `blocks/flaberry-gift-message.liquid`. Interactive greeting card form storing data into line-item properties (`_message_text`, `_message_occasion`, `_message_sender`). |
| **Addon Upsell Carousel** | Mini cards (Teddy, Chocolates, Card) | `product-recommendations.liquid` | `[MODIFIED]` | Modify Horizon product recommendations into an inline horizontal checklist with instant checkbox addition to line-item payload. |
| **Buy Row & Action Buttons** | Quantity stepper, "Add to Cart", "Buy Now" | `buy-buttons.liquid`, `quantity.liquid` | `[STYLE]` | Retain Horizon's native Add to Cart and accelerated checkout; restyle buttons to Flaberry maroon (`#8c1d40`) and gold (`#d4af37`). |
| **Mobile Sticky Buy Bar** | `.sticky-buy` (fixed bottom bar on mobile) | *None* | `[CUSTOM]` | Build `snippets/flaberry-mobile-sticky-buy.liquid`. Appears on scroll; contains product thumbnail, price, and instant "Buy Now" CTA. |
| **Information Tabs** | Description, Specs, Delivery, Care | `blocks/accordion.liquid` / tabs | `[MODIFIED]` | Style tab bar across 4 content panels backed by product description and product metafields. |

---

## 5. Collection & Catalogue Components (`collection.json`)

| Component | Prototype Selector | Horizon Base Equivalent | Classification | Implementation Details |
|---|---|---|---|---|
| **Category Header & Banner** | `.cbanner`, category title, SEO description | `_collection-info.liquid`, `collection-title.liquid` | `[STYLE]` | Style hero banner with category background visual, title, and descriptive intro. |
| **Filters Sidebar** | Price filters, subcategories, rating, eggless | `blocks/filters.liquid` | `[MODIFIED]` | Extend Horizon's faceted filters to support gifting-specific metafield filters (Eggless, 4.5+ Rating, Delivery Time, Price range). |
| **Sorting Toolbar** | Sort select (Popularity, Price, Rating, Newest) | `sections/main-collection.liquid` | `[STYLE]` | Native Shopify sorting options mapped to Flaberry sort labels. |
| **Product Grid** | 4 columns on desktop, 2 columns on mobile | `sections/main-collection.liquid` | `[STYLE]` | 24 products per page. Replaces card layout with Flaberry gifting card structure. |
| **Pagination Controls** | `.pg` (Numbered buttons, Prev/Next) | `snippets/pagination.liquid` | `[STYLE]` | Horizon's native pagination styled with Flaberry maroon pill highlights. |

---

## 6. Shopping Cart & Checkout Components (`cart.json` & Checkout)

| Component | Prototype Implementation | Horizon Base Equivalent | Classification | Implementation Details |
|---|---|---|---|---|
| **Full Cart Page** | `cartPage()` (`#cart`) | `sections/main-cart.liquid` | `[MODIFIED]` | Custom line-item table rendering: image, title, selected delivery date, time slot, message preview, cake weight, quantity stepper, and remove button. |
| **Multi-Pincode Warning Banner**| Alert banner if items have differing pincodes | *None* | `[CUSTOM]` | Script check: if line-item property `_delivery_pincode` differs across items, display notification explaining split shipments. |
| **Cart Order Summary Sidebar** | Subtotal, Slot delivery fees, coupon input | `blocks/_cart-summary.liquid` | `[MODIFIED]` | Calculates subtotal, aggregates delivery slot surcharges, and renders checkout CTA. |
| **Multi-Step Checkout** | `#checkout` (Simulated form in prototype) | Shopify Native Checkout | `[DIRECT / EXTENSIBILITY]` | Customer checkout is handed off to Shopify's secure native checkout engine. Custom line attributes display natively in order summaries. |

---

## 7. Informational, Policy, City & Blog Templates

| Prototype Screen | Shopify URL | Horizon Template | Classification | Implementation Details |
|---|---|---|---|---|
| **Static Policy Pages (10)** | `/pages/<handle>` | `templates/page.json` | `[DIRECT]` | Native Shopify pages rendered via `sections/main-page.liquid`. Covers About, Contact, FAQ, Terms, Privacy, Refund, Shipping, Pincodes, Corporate, Partner. |
| **Contact Page** | `/pages/contact` | `templates/page.contact.json` | `[STYLE]` | Horizon's native contact form styled to Flaberry field guidelines. |
| **City Landing Pages** | `/pages/city-<city>` | `templates/page.city.json` | `[CUSTOM]` | Metaobject-backed page template rendering localized city messaging, local florist reassurance, and city bestsellers rail. |
| **Blog Articles** | `/blogs/<blog>/<article>` | `templates/article.json` | `[STYLE]` | Horizon's native article template styled to match Flaberry gifting editorial design. |
| **404 Error Page** | Unmatched URLs | `templates/404.json` | `[STYLE]` | Large 404 graphic, *"Page not found"* messaging, and *"Back to store"* CTA button. |

---

## 8. Summary Reusability Matrix

| Classification | Count of Components | Percentage | Primary Areas |
|---|---|---|---|
| **Direct Reuse (`[DIRECT]`)** | 6 | 14% | Policy pages, Contact form, SEO accordions, Email newsletter signup, Native checkout engine, 404 error template |
| **Reuse with Styling (`[STYLE]`)** | 16 | 37% | Announcement ticker, Header logo, Media gallery, Price display, Buy buttons, Pagination, Authority stats, Customer reviews |
| **Heavily Modified (`[MODIFIED]`)** | 9 | 21% | Header layout, Desktop mega menu, Product recommendations / addons, Main cart line-items, Cart drawer metadata, Faceted filters |
| **Net-New Custom (`[CUSTOM]`)** | 12 | 28% | Pincode modal, Pincode trigger, Mobile 2-level drawer, Mobile bottom dock, 14-day date picker, Time slot selector, Gift message builder, Sticky buy bar, Cake filter tabs, Pincode delivery band, Seasonal countdown rail, WhatsApp widget |
| **Total Components Analyzed** | **43** | **100%** | Comprehensive storefront inventory |
