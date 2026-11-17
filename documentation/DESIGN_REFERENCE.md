# FLABERRY — DESIGN & INTERACTION REFERENCE

**Document Type:** Frontend Design and Functional Specification  
**Project:** Flaberry Shopify  
**Primary Reference:** `reference/Flaberry_Design1_Classic.html`  
**Visual References:** `screenshots/desktop/` and `screenshots/mobile/`  
**Status:** Existing interactive prototype reviewed  
**Purpose:** Reproduce the existing prototype as a Shopify storefront without redesigning its customer experience.

---

# 1. PURPOSE OF THIS DOCUMENT

This document defines the existing Flaberry prototype's design, page structure, navigation, visual behaviour and interactive functionality.

The supplied HTML is a complete, single-file interactive prototype.

It contains:
- HTML structure.
- Embedded CSS.
- JavaScript functionality.
- Product and category data.
- Image and asset references.
- Navigation and routing.
- Interactive UI components.
- Demonstration customer, vendor and admin workflows.

The HTML file must be treated as the primary source of truth.

This is a conversion project, not a redesign project.

The objective is to reproduce the existing storefront in Shopify while replacing prototype-only functionality with actual Shopify data, services and integrations.

## Source priority

When implementing the storefront, follow this priority:

1. Original HTML, CSS and JavaScript.
2. Desktop screenshots.
3. Mobile screenshots.
4. This document.
5. Shopify implementation decisions documented in other project files.

If a visual detail in this document differs from the original HTML, inspect the original source before making changes.

---

# 2. REFERENCE FILES

## 2.1 Master HTML

Location:

`reference/Flaberry_Design1_Classic.html`

This is one complete HTML file.

Do not split, modify, overwrite or replace this reference file.

The original prototype uses hash-based routing to display different storefront views inside a common HTML document.

Important source functions include:

- `home()`
- `collection(key)`
- `product(key)`
- `cartPage()`
- `checkout()`
- `track(id)`
- `account()`
- `searchPage(query)`
- `vendorPanel()`
- `adminPanel()`
- `pageBase(id)`
- `cityPageBase(city)`
- `routeBase()`

These functions are useful starting points for understanding the existing page structure and behaviour.

## 2.2 Desktop references

Location:

`screenshots/desktop/`

Use these references to inspect:
- Desktop header.
- Navigation.
- Homepage sections.
- Product grids.
- Collection filters.
- Product detail layouts.
- Footer.
- Overall spacing and proportions.

## 2.3 Mobile references

Location:

`screenshots/mobile/`

Use these references to inspect:
- Mobile header.
- Navigation.
- Mobile hero.
- Product cards.
- Responsive grids.
- Product detail layouts.
- Sticky actions.
- Mobile footer and navigation dock.

Do not assume desktop and mobile use identical layouts.

---

# 3. VISUAL DESIGN SYSTEM

The existing prototype uses a clean, modern gifting-commerce design.

Its visual language includes:
- White backgrounds.
- Dark navy headings.
- Red/pink brand accents.
- Light grey and lavender surfaces.
- Rounded product cards.
- Soft borders.
- Compact product information.
- Large product photography.
- Clear delivery and availability messaging.

## 3.1 CSS colour references

The original stylesheet contains base tokens and later brand overrides.

The final effective brand values in the supplied stylesheet include:

| Token | Value | Purpose |
|---|---|---|
| `--ink` | `#22235c` | Primary text and navy identity |
| `--flora` | `#d42f3c` | Primary red brand accent |
| `--flora-deep` | `#ad1f2b` | Darker red accent |
| `--blush` | `#fdeced` | Light pink surfaces |
| `--muted` | `#5f6178` | Secondary text |
| `--mist` | `#f3f3f8` | Light backgrounds |
| `--line` | `#e3e3ee` | Borders and dividers |
| `--leaf` | `#1f7a4d` | Success/positive states |
| `--gold` | `#f0a722` | Highlight accents |

Other original tokens include:
- `--paper`
- `--warn`
- `--bad`
- `--display`
- `--body`
- `--r-lg`
- `--r-md`
- `--r-sm`

The final rendered CSS and screenshots should be used to verify actual styling.

Do not introduce a new colour system.

## 3.2 Typography

The prototype references:
- Inter Tight for display typography.
- Inter for body typography.

Maintain the original typography hierarchy:
- Strong, prominent page headings.
- Compact section headings.
- Readable product names.
- Smaller product metadata.
- Clearly differentiated prices and ratings.

## 3.3 Component styling

Preserve:
- Rounded product images.
- Rounded promotional banners.
- Soft card borders.
- Compact pill labels.
- Rounded buttons.
- Navy primary actions.
- Light secondary buttons.
- Clear success and error notices.
- Consistent spacing between sections.

Do not independently redesign these components.

---

# 4. GLOBAL STOREFRONT STRUCTURE

The prototype contains a shared storefront shell.

## 4.1 Announcement bar

The top announcement area displays promotional or delivery-related messages.

Preserve its position, styling and rotating message behaviour.

## 4.2 Header

The desktop header includes:

- Flaberry logo.
- Search field.
- Delivery location/pincode.
- Market and currency selector.
- Track order.
- Support.
- Account.
- Cart with item count.

The header must remain consistent across the storefront.

The header should adapt to the mobile layout without losing essential functionality.

## 4.3 Search

The search interface includes:
- Search input.
- Suggestions.
- Search submission.
- Product result navigation.

The prototype's search results are displayed using hash-based routes such as:

`#search-roses`

Shopify implementation should use actual Shopify product search and predictive search functionality.

## 4.4 Desktop navigation

The navigation contains category and occasion menus.

The original navigation uses:
- Hover interactions.
- Click-to-open menu behaviour.
- Multi-column mega menus.
- Category links.
- Promotional imagery.
- Promotional destination links.

Preserve the menu structure and its behaviour.

## 4.5 Mobile navigation

The prototype includes:
- Mobile menu drawer.
- Expandable navigation groups.
- Quick access to account and cart.
- Search access.
- Bottom navigation dock.

Preserve the mobile interaction patterns.

## 4.6 Global overlays

The HTML includes:
- Cart drawer.
- Mobile menu drawer.
- Modal.
- Scrim/background overlay.
- Toast notifications.

These are shared UI components and should not be independently recreated in every page.

---

# 5. HOMEPAGE DESIGN REFERENCE

Source function: `home()`

The homepage is composed of multiple content sections.

Maintain the original section order.

## 5.1 Hero banner / slider

The homepage starts with a large promotional hero slider.

Features:
- Large promotional headline.
- Supporting text.
- CTA button.
- Product or lifestyle image.
- Previous/next controls.
- Slider indicators.
- Automatic slide rotation.

The prototype contains multiple promotional slides covering flowers, cakes, combos and gifting.

The slide CTA should navigate to its intended category.

Preserve the original image-to-text proportions and banner background colours.

## 5.2 Pincode-first delivery section

Immediately below the hero is a delivery location section.

It includes:
- Pincode-first messaging.
- Delivery destination.
- Serviceability context.
- Available gift count.
- Change pincode action.

The pincode selection affects the available product catalogue.

## 5.3 Shop by category

Displays image-based category tiles.

The prototype includes category destinations for products such as:
- Roses.
- Bouquets.
- Orchids.
- Vase arrangements.
- Heart-shaped gifts.
- Flowers with cake.
- Designer cakes.
- Photo cakes.
- Eggless cakes.
- Birthday and anniversary products.
- Occasion-based combos.

Each tile is clickable.

Maintain the image presentation and horizontal category navigation.

## 5.4 Delivering smiles across India

An informational brand section.

It combines:
- Large heading.
- Brand introduction.
- Story/about CTA.
- Business statistics.

The screenshot shows statistics such as:
- 500+ cities.
- 2,500+ partner merchants.
- 2–3 days for flower sourcing.
- Same-day delivery availability.

Preserve the original layout and hierarchy.

## 5.5 Product category cards

The homepage presents major shopping categories:
- All gifts.
- Flowers.
- Cakes.
- Combos.
- Gifts.

Each card includes an image, heading, product count and supporting text.

Cards navigate to their respective collections.

## 5.6 Premium flowers

A product showcase containing:
- Section heading.
- Supporting description.
- Product cards.
- Horizontal product rail.
- Navigation controls.
- View-all destination.

## 5.7 Promotional service banners

The prototype includes visual promotional tiles for services and product categories, such as:
- Same-day delivery.
- Freshly baked cakes.
- Hand-picked flowers.
- Midnight delivery.
- Serving multiple cities.

Each banner has a destination link.

## 5.8 Cakes for every celebration

A dedicated cake section.

It includes:
- Section heading.
- Supporting text.
- Category tabs.
- Product grid.
- Product cards.

The original tabs include cake categories such as chocolate, truffle and photo cakes.

Tab selection changes the displayed product collection.

This must remain functional.

## 5.9 Flowers and cake promotional section

A large promotional banner encourages customers to shop flower-and-cake combinations.

It is followed by combination product cards.

## 5.10 Christmas / upcoming occasion section

Displays a time-sensitive occasion heading and products.

The prototype calculates the remaining days to Christmas.

It also includes occasion-based delivery messaging and date-dependent pricing concepts.

Preserve the time-sensitive content behaviour, but connect actual pricing and availability to production rules.

## 5.11 Customer reviews

The homepage includes a customer stories section.

It contains:
- Review heading.
- Star ratings.
- Review text.
- Customer identity/avatar.
- Review CTA.

## 5.12 Trust indicators

The prototype displays four trust/service indicators:
- India's leading brand.
- No hidden charges.
- Customer support.
- Secure payments.

Preserve the icon-and-text presentation.

## 5.13 SEO content section

An informational section about sending flowers to India.

It contains:
- Main heading.
- Descriptive paragraphs.
- Delivery-related content.
- Read more interaction.

Preserve the expandable content behaviour.

## 5.14 Homepage FAQs

Expandable FAQ items.

The first item is open by default in the prototype FAQ component.

## 5.15 Footer

The footer contains:
- Flaberry logo.
- Brand description.
- Newsletter subscription.
- Customer service details.
- Shop links.
- Help links.
- Company links.
- Policy links.
- Payment method artwork.
- Copyright information.
- External website credit.
- WhatsApp contact shortcut.

The footer must remain consistent across standard storefront pages.

---

# 6. COLLECTION / CATEGORY LISTING PAGE

Source function: `collection(key)`

The collection page displays products belonging to a selected category.

The shared collection layout contains:

## 6.1 Breadcrumbs

Displays the navigation hierarchy.

## 6.2 Collection heading

Includes:
- Collection title.
- Description.
- Product count.

## 6.3 Filter sidebar

The desktop screenshot shows filters including:

**Price**
- Under ₹999.
- ₹999–₹1,999.
- ₹2,000–₹3,999.
- ₹4,000 and above.

**Delivery**
- Same day.
- Midnight.
- Fixed time.

**Rating**
- 4.5 and above.

The source also contains filtering logic for price ranges, subcategories, rating and eggless/cake-related products.

Reproduce the actual filter behaviour after inspecting the complete collection rendering code.

On mobile, use a responsive filter presentation rather than forcing the desktop sidebar layout.

## 6.4 Sorting

The prototype supports sorting options based on:
- Popularity.
- Price low to high.
- Price high to low.
- Newest.
- Rating.

## 6.5 Product grid

The desktop reference shows a four-column product grid.

The mobile reference shows a two-column product layout.

Product cards contain:
- Product image.
- Bestseller or promotional badge where applicable.
- Product name.
- Price.
- Rating.
- Earliest delivery information.
- Review count.
- Product navigation.

The source paginates collection products at 24 products per page.

Preserve pagination behaviour.

## 6.6 Collection SEO content

Below the product grid:
- Collection-specific informational content.
- Delivery messaging.
- Read more interaction.
- FAQs.

Do not omit these sections when implementing collection templates.

---

# 7. PRODUCT DETAIL PAGE

Source function: `product(key)`

The product detail page is one of the most important pages in the project.

The original screenshot shows a two-column desktop layout.

## 7.1 Breadcrumbs

Displays:
- Home.
- Product category.
- Parent category.
- Product name.

## 7.2 Product image gallery

Includes:
- Thumbnail images.
- Main product image.
- Image selection.
- Image crop/position behaviour.
- Video thumbnail/control in the prototype.

Preserve gallery interactions.

Use original product image assets.

## 7.3 Product information

Displays:
- Item code.
- Product name.
- Rating.
- Review count.
- Price.
- Applicable pricing context.

## 7.4 Pincode availability

The customer can enter a six-digit pincode and check serviceability.

The prototype uses pincode-based availability to determine whether a product can be delivered.

Production implementation must use real serviceability and vendor eligibility data.

## 7.5 Delivery date selection

The product page includes:
- Available delivery dates.
- Date selection.
- Advance delivery date input.
- Delivery cut-off information.

The prototype generates a 14-day date range and supports advance dates.

Production availability must be validated against actual delivery rules and capacity.

## 7.6 Delivery slot selection

The prototype supports delivery windows and time slots.

Examples include:
- Standard delivery.
- Morning.
- Afternoon.
- Evening.
- Fixed time.
- Midnight.

The actual available choices must depend on product, pincode, selected date and service rules.

## 7.7 Product customization

The page supports product-specific customization.

For cakes:
- Weight selection.
- Eggless / with-egg selection.
- Cake message.

For gifts:
- Occasion selection.
- Message card.
- Custom message.
- Sender/from name.

Preserve product-specific fields.

## 7.8 Add-on products

The product detail page includes an add-on section.

Customers can select complementary products such as:
- Cakes.
- Chocolates.
- Teddy bears.
- Gift hampers.
- Other recommended products.

Add-on selection must be reflected correctly in the cart.

## 7.9 Quantity and purchase actions

The page includes:
- Quantity selector.
- Add to cart.
- Buy now.

The prototype also displays secure-payment and help messaging near the purchase controls.

The Shopify implementation must use the real Shopify cart and checkout.

## 7.10 Product information tabs

The prototype has tabs for:
- Description.
- Specifications.
- Delivery information.
- Care instructions.

Tab changes must display the correct content.

## 7.11 Product reviews

The product page includes:
- Overall rating.
- Rating distribution.
- Review count.
- Customer review cards.
- Write a review action.

Connect to a suitable production reviews solution.

## 7.12 Related product sections

The product page includes:
- Similar gifts.
- Bestsellers.
- Recently viewed products.

These sections use horizontal product rails.

Preserve their navigation and product-card interactions.

---

# 8. CART AND CART DRAWER

Source functions:
- `cartPage()`
- `renderDrawer()`
- `openCart()`
- `cartTotals()`
- `cartCheck()`

The prototype supports both a cart drawer and a dedicated cart page.

## Cart drawer

Includes:
- Added product image.
- Product name.
- Customization details.
- Delivery information.
- Quantity controls.
- Remove item.
- Cart subtotal.
- Checkout action.

## Cart page

Includes:
- Cart product list.
- Product details.
- Quantity controls.
- Remove action.
- Coupon functionality.
- Price summary.
- Delivery information.
- Serviceability recheck.
- Checkout CTA.

The prototype checks pincode compatibility and warns when products have conflicting delivery destinations.

Production implementation must validate:
- Product availability.
- Inventory.
- Selected date.
- Delivery slot.
- Product restrictions.
- Vendor eligibility.
- Price.
- Cart consistency.

Do not use browser-only cart state as the final commerce system.

---

# 9. CHECKOUT AND ORDER CONFIRMATION

Source functions:
- `checkout()`
- `placeOrder()`
- `thanksBase()`

The prototype checkout includes:

## Contact information
- Email.
- Mobile number.
- WhatsApp order updates option.

## Sender details
- Sender information.

## Receiver details
- Receiver name.
- Receiver phone.
- Address.
- Location information.

## Delivery information
- Pincode.
- Delivery date.
- Delivery slot.
- Delivery window.

## Gift information
- Message card.
- Sender name.
- Product customization.

## Payment
- Express payment options.
- Payment selection.
- Order total.
- Payment processing UI.

## Confirmation

The thank-you page displays:
- Order number.
- Customer confirmation.
- Delivery details.
- Message card details.
- Order status information.

IMPORTANT:

The current HTML checkout contains simulated payment/order processing behaviour.

Do not mistake the demonstration checkout for a real payment gateway.

Replace it with Shopify checkout and approved payment integrations.

---

# 10. CUSTOMER ACCOUNT AND ORDER TRACKING

The original routing includes:

- Login.
- Signup.
- Password reset.
- Customer account.
- Order history.
- Order tracking.
- Reorder-related functionality.

The account and tracking views should preserve the original customer experience.

Use actual Shopify customer accounts and real order information.

Do not reproduce prototype authentication using insecure frontend-only logic.

---

# 11. ADDITIONAL INFORMATIONAL PAGES

The prototype includes multiple informational and support pages.

The original routing and page definitions include:

| Page | Purpose |
|---|---|
| About | Brand information |
| Contact | Customer support |
| FAQ | Frequently asked questions |
| Reviews | Customer reviews |
| Careers | Career enquiries |
| Corporate | Corporate gifting |
| Partner | Vendor/partner applications |
| Care tips | Product care information |
| Blog | Blog listing |
| Blog detail | Individual blog content |
| Serviceable pincodes | Delivery serviceability information |
| Delivery cities | City listing |
| Advance orders | Advance delivery information |
| Terms | Terms of service |
| Delivery policy | Delivery information |
| Substitution | Substitution policy |
| Refund | Refund and cancellation policy |
| Privacy | Privacy policy |

These pages are part of the original prototype's routing structure.

Do not silently remove them.

---

# 12. CITY AND SEARCH PAGES

## City pages

The prototype contains city-specific delivery pages.

These include:
- City-specific heading.
- Delivery messaging.
- Serviceable pincode information.
- Available product cards.
- City-specific SEO content.

## Search results

The search results view includes:
- Search query.
- Result count.
- Product grid.
- Empty state when no products match.
- Suggested alternative search terms.

Production search must use Shopify product data.

---

# 13. VENDOR PANEL

Source function: `vendorPanel()`

The prototype includes a vendor-facing panel.

Its navigation contains:

- Dashboard.
- New orders.
- Today.
- Upcoming.
- Completed.
- Order statement.
- Profile.

The prototype displays vendor-related order information and workflow controls.

Features include:
- Vendor login demonstration.
- Order lists.
- Order details.
- Delivery dates.
- Order status.
- Message slips/receipts.
- Statements.
- Vendor profile information.

IMPORTANT:

This panel is a demonstration of the intended workflow.

It is not proof of secure vendor authentication, actual vendor permissions or real settlement processing.

Production vendor management must use an approved marketplace application or secure backend.

Vendor users must never be able to access another vendor's private orders or customer information.

---

# 14. FLABERRY ADMIN PANEL

Source function: `adminPanel()`

The prototype includes an internal administrative interface.

It covers areas such as:
- Orders.
- Vendors.
- Delivery/pincode configuration.
- Pricing rules.
- Payment information.
- Order assignment.
- Order details.
- Status management.
- Administrative operations.

The prototype also contains vendor assignment and payment-related demonstration data.

Production implementation must use secure server-side permissions and real data.

Do not expose privileged admin operations in the storefront theme.

The final admin architecture must be determined separately.

---

# 15. INTERACTION INVENTORY

The following interactions must be analysed and mapped before implementation.

| Component | Expected behaviour |
|---|---|
| Announcement bar | Rotating promotional messages |
| Hero slider | Next, previous and automatic slide change |
| Desktop mega menu | Hover and click to open |
| Mobile menu | Drawer and expandable categories |
| Search | Suggestions and results |
| Pincode selector | Validate and update location |
| Currency selector | Change displayed market/currency |
| Category tile | Navigate to collection |
| Product card | Open product detail |
| Product rail | Horizontal navigation |
| Cake category tabs | Change displayed product collection |
| Collection filters | Filter products |
| Collection sorting | Reorder products |
| Pagination | Navigate product pages |
| Product gallery | Change selected image |
| Product options | Update selected product configuration |
| Delivery date | Select delivery date |
| Delivery slot | Select available slot |
| Message card | Enter occasion/message/sender details |
| Add-ons | Select complementary products |
| Quantity selector | Update quantity |
| Add to cart | Add configured product |
| Buy now | Proceed toward purchase |
| Cart drawer | Open and update cart |
| Cart page | Edit and remove items |
| Coupon | Apply and validate discount |
| Checkout | Collect customer/order information |
| Payment | Process actual payment through Shopify |
| FAQ | Expand and collapse answers |
| Read more | Expand informational content |
| Reviews | View review content |
| Account | Access customer account |
| Order tracking | Retrieve order status |
| Vendor panel | Vendor workflow |
| Admin panel | Administrative workflow |
| Toast | Display temporary feedback |
| Modal | Open and close overlays |

This is the initial interaction inventory, not a claim that every interaction has been fully tested against production services.

---

# 16. RESPONSIVE DESIGN REQUIREMENTS

Desktop and mobile must be treated as separate layout references.

## Desktop

Preserve:
- Full header.
- Horizontal navigation.
- Mega menus.
- Multi-column product grids.
- Filter sidebar.
- Two-column product details.
- Full footer columns.
- Product carousels.

## Mobile

Preserve:
- Compact header.
- Mobile menu.
- Search access.
- Responsive hero.
- Two-column product grids where shown.
- Stacked product detail layout.
- Touch-friendly controls.
- Mobile navigation dock.
- Sticky product purchase controls where present.
- Responsive footer.

Do not simply shrink the desktop design.

Do not allow horizontal overflow.

Do not hide essential interactions to make the layout fit.

Use the screenshots and actual responsive CSS as references.

---

# 17. ASSET HANDLING RULES

The original HTML contains product data and image references.

Inspect the source before sourcing replacement images.

Rules:

1. Reuse existing hosted image URLs wherever appropriate.
2. Preserve original product imagery.
3. Preserve the logo.
4. Preserve promotional banners.
5. Preserve icons and trust artwork where available.
6. Do not substitute unrelated stock images.
7. Do not generate replacement product photography without approval.
8. Identify inaccessible or broken image URLs.
9. Avoid unnecessarily duplicating large image assets.
10. Use Shopify-compatible image delivery for production where required.

Create a separate asset inventory during prototype analysis if needed.

---

# 18. PROTOTYPE LIMITATIONS AND PRODUCTION CONVERSION

The prototype demonstrates the intended user experience but does not establish production backend functionality.

The source includes:
- Browser-side state.
- Local storage persistence.
- Seeded demonstration products and orders.
- Demonstration vendor data.
- Simulated order processing.
- Simulated payment behaviour.
- Demonstration routing and vendor assignment logic.

These must not be copied blindly into production.

The following require actual production systems:

| Feature | Production requirement |
|---|---|
| Product catalogue | Shopify products and collections |
| Inventory | Shopify inventory and vendor inventory integration |
| Pincode serviceability | Real serviceability data |
| Vendor eligibility | Marketplace/backend records |
| Distance-based routing | Secure routing service |
| Order assignment | Server-side order processing |
| Payments | Shopify-supported payment gateway |
| Vendor settlements | Finance/settlement integration |
| Customer authentication | Shopify customer accounts |
| Order tracking | Real order and fulfilment data |
| Notifications | Approved email/WhatsApp integration |
| Reviews | Actual reviews solution |
| Admin permissions | Secure admin/backend permissions |

The visual and functional experience should remain consistent, even when the underlying technology changes.

---

# 19. IMPLEMENTATION AND VISUAL QA RULES

Before implementing any page:

1. Locate the corresponding function in the original HTML.
2. Inspect its markup.
3. Inspect related CSS.
4. Inspect JavaScript interactions.
5. Identify required assets.
6. Identify data dependencies.
7. Identify the Shopify equivalent.
8. Document any missing backend dependency.

After implementation:

1. Open the Shopify theme preview.
2. Compare it with the original desktop reference.
3. Compare it with the original mobile reference.
4. Check spacing and typography.
5. Check image dimensions and cropping.
6. Check product card proportions.
7. Test all visible interactions.
8. Test navigation.
9. Test responsive behaviour.
10. Record any differences.

Do not claim a page is complete simply because it renders without errors.

Visual accuracy and functional correctness must both be verified.

---

# 20. RECOMMENDED IMPLEMENTATION SEQUENCE

The following is a proposed development order, not permission to skip discovery or architecture validation.

**Phase 1 — Prototype analysis**
- Complete HTML inspection.
- Page and route inventory.
- Component inventory.
- Interaction inventory.
- Asset inventory.
- Responsive behaviour analysis.

**Phase 2 — Shopify foundation**
- Theme architecture.
- Global design tokens.
- Header.
- Navigation.
- Footer.
- Shared drawers and modals.

**Phase 3 — Core storefront**
- Homepage.
- Collection template.
- Product detail template.
- Search.
- Informational pages.

**Phase 4 — Shopping functionality**
- Product options.
- Add-ons.
- Delivery selection.
- Cart.
- Checkout integration.
- Customer accounts.

**Phase 5 — Marketplace**
- Vendor application.
- Vendor product assignments.
- Inventory.
- Pincode serviceability.
- Automatic routing.
- Fulfilment.
- Settlements.

**Phase 6 — Testing**
- Desktop QA.
- Mobile QA.
- Interaction QA.
- Checkout testing.
- Integration testing.
- Performance and error handling.

Each phase must be reviewed before moving into major dependent implementation work.

---

# 21. FIRST TASK FOR ANTIGRAVITY

Before writing storefront code, perform a complete analysis of:

`reference/Flaberry_Design1_Classic.html`

Also inspect:

- `screenshots/desktop/`
- `screenshots/mobile/`
- `GEMINI.md`
- `documentation/PROJECT_BRIEF.md`
- `documentation/IMPLEMENTATION_PLAN.md`
- `documentation/ARCHITECTURE.md`

Prepare an analysis report containing:

1. Complete route/page inventory.
2. Homepage section inventory in exact order.
3. Collection page structure.
4. Product detail page structure.
5. Cart and checkout interactions.
6. Account and order tracking behaviour.
7. Vendor panel functionality.
8. Admin panel functionality.
9. All JavaScript interactions.
10. All responsive behaviours.
11. Asset and image URL inventory.
12. Existing prototype-only/demo behaviours.
13. Required Shopify equivalents.
14. Missing technical requirements.
15. Proposed implementation sequence.

Do not start large-scale theme development during this initial analysis.

Present the findings for review.

---

# FINAL DESIGN REFERENCE RULE

**The existing Flaberry HTML prototype defines how the storefront should look and how its customer-facing experience should behave.**

Shopify defines how the production commerce functionality should work.

The implementation must connect both without unnecessarily changing the original customer experience.

Preserve the original design, interactions, responsive behaviour, content hierarchy and business intent.

When the original source is unclear, inspect it before making assumptions.