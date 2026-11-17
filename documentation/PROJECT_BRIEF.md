# FLABERRY — PROJECT BRIEF

**Project:** Flaberry Shopify Storefront + Multi-Vendor Marketplace  
**Document Type:** Business and Product Requirements Overview  
**Market:** India Only  
**Platform:** Shopify  
**Project Status:** Planning and foundation setup  
**Primary Design Reference:** `reference/Flaberry_Design1_Classic.html`  
**Implementation Reference:** `documentation/IMPLEMENTATION_PLAN.md`

---

# 1. BUSINESS OVERVIEW

Flaberry is an online gifting and flower delivery platform offering a wide range of products for personal celebrations, special occasions and everyday gifting.

The platform brings together Flaberry-owned inventory and products fulfilled by local partner vendors through one unified customer-facing storefront.

Customers should experience Flaberry as a single, consistent brand regardless of which vendor ultimately fulfils their order.

The platform will operate in India and use Shopify as its primary commerce platform.

## Main product categories

- Flowers and bouquets.
- Cakes.
- Flower and cake combinations.
- Gift hampers.
- Chocolates.
- Plants.
- Personalised gifts.
- Occasion-based gifts.
- Other approved gifting products.

## Main occasions

- Birthdays.
- Anniversaries.
- Valentine's Day.
- Mother's Day.
- Father's Day.
- Weddings.
- Festivals.
- Christmas.
- Corporate gifting.
- Other celebrations and special occasions.

---

# 2. PROJECT VISION

Build a scalable, reliable and highly automated gifting marketplace with a central Shopify storefront and a distributed network of local vendors.

The customer should be able to:

1. Discover products from one unified catalogue.
2. Enter a delivery pincode.
3. Check product and delivery availability.
4. Select a product and customise it.
5. Choose an eligible delivery date and time.
6. Add complementary products.
7. Place an order and pay Flaberry.
8. Receive order and delivery updates.
9. Track the order.
10. Contact support when required.

Behind the storefront, Flaberry should manage:

- Central products.
- Vendor-listed products.
- Vendor inventory.
- Product/vendor assignments.
- Pincode serviceability.
- Delivery capacity.
- Automatic order allocation.
- Vendor fulfilment.
- Payments and reconciliation.
- Vendor commissions.
- Vendor settlements.
- Customer communication.

The ultimate objective is to operate one unified marketplace without requiring customers to manage the vendor-selection or fulfilment process.

---

# 3. CONFIRMED BUSINESS DECISIONS

The following decisions have already been confirmed by the project owner.

| Business area | Confirmed decision |
|---|---|
| Target market | India only |
| Platform | Shopify |
| Marketplace model | Central products + vendor-listed products |
| Catalogue | One central product catalogue |
| Vendor participation | Local vendors can list/fulfil approved products |
| Order allocation | Always automatic |
| Routing factors | Product availability and distance |
| Customer payment | Customer pays Flaberry |
| Vendor payment | Flaberry settles vendor earnings later |
| Customer-facing brand | Flaberry |
| Delivery | All required delivery options, subject to serviceability and operational rules |
| Automation | AI-assisted and workflow automation across operations |

These are established project requirements.

Do not change them without explicit approval.

---

# 4. MARKETPLACE BUSINESS MODEL

Flaberry will operate a hybrid inventory and fulfilment model.

There are two product supply sources.

## 4.1 Central products

These are products managed directly by Flaberry.

Flaberry controls:

- Product identity.
- Product title.
- Description.
- Images.
- SKU.
- Pricing.
- Offers.
- SEO.
- Product categorisation.
- Customer-facing presentation.

These products may be fulfilled through Flaberry's own inventory or assigned to eligible partner vendors.

## 4.2 Vendor-listed products

Partner vendors can submit their own products for consideration.

The vendor may provide:

- Product information.
- Product images.
- Vendor SKU.
- Product cost.
- Stock availability.
- Preparation time.
- Serviceable locations.
- Fulfilment details.

However, vendor-submitted products must go through Flaberry's approval process before appearing in the customer-facing catalogue.

Flaberry maintains control over the canonical product catalogue and customer-facing pricing policies.

## 4.3 Unified catalogue

Both central and approved vendor-listed products should appear in the same customer-facing storefront.

Customers should not need to distinguish between central and vendor-listed products to complete a purchase.

### Important catalogue principle

Create a product once as the master catalogue record wherever the selected architecture permits.

Vendor-specific information should be maintained through vendor-product assignment records rather than unnecessary duplicate product records.

---

# 5. VENDOR OPERATING MODEL

Flaberry will work with multiple local vendors across eligible Indian delivery locations.

Each vendor may have one or more fulfilment locations.

## Vendor information

The system should support:

- Vendor identity.
- Legal/business information.
- Contact information.
- Fulfilment addresses.
- Pincodes served.
- Geographic coordinates.
- Product assignments.
- Inventory.
- Operating hours.
- Preparation lead time.
- Daily order capacity.
- Delivery-slot capacity.
- Commission agreements.
- Fulfilment performance.
- Settlement information.

## Vendor onboarding

Proposed onboarding workflow:

1. Vendor submits an application.
2. Flaberry reviews business information.
3. Vendor documentation is collected.
4. Fulfilment locations are verified.
5. Serviceable areas are configured.
6. Vendor products are submitted or assigned.
7. Product and pricing information is reviewed.
8. Inventory and capacity information is configured.
9. Flaberry approves the vendor.
10. Vendor becomes eligible for order allocation.

## Vendor permissions

Vendors should only access:

- Their assigned orders.
- Their assigned products.
- Their own inventory.
- Their own fulfilment tasks.
- Their own statements.
- Their own profile.

Vendors must not be able to access another vendor's private information or orders.

---

# 6. CENTRAL ORDER ROUTING SYSTEM

**This is one of the most important business requirements.**

All customer orders requiring vendor fulfilment must be allocated automatically.

The system must not rely on customers manually selecting vendors.

The routing engine should evaluate eligible fulfilment options using product availability and distance.

## 6.1 Routing inputs

The routing system needs:

- Customer delivery address.
- Six-digit Indian pincode.
- Product and variant.
- Requested delivery date.
- Requested delivery slot.
- Vendor location.
- Vendor serviceability.
- Available inventory.
- Inventory reservations.
- Vendor operating hours.
- Preparation lead time.
- Delivery capacity.
- Delivery mode.

## 6.2 Expected routing process

1. Customer provides the delivery location.
2. System validates the destination.
3. System identifies vendors serving that destination.
4. System checks whether each vendor can supply the requested product.
5. System checks real inventory and reservations.
6. System checks preparation time and operating capacity.
7. System calculates distance or estimated delivery time.
8. System ranks eligible vendors.
9. System reserves inventory and capacity.
10. System automatically assigns the order.
11. Vendor receives an order notification.
12. Vendor acknowledges and fulfils the order.

## 6.3 Routing fallback

If the selected vendor:
- Rejects the order.
- Does not respond within the configured SLA.
- Reports unavailable inventory.
- Cannot meet the delivery promise.

The system should release the relevant reservation and attempt the next eligible vendor.

If no eligible vendor remains, the order should move into an operations exception queue.

Do not silently confirm an impossible delivery promise.

## 6.4 Distance-based allocation

Distance must be considered alongside actual fulfilment eligibility.

A geographically closest vendor should not automatically receive an order if they cannot meet the required date, slot or product requirements.

The exact tie-breaking and ranking rules remain subject to operational approval.

---

# 7. DELIVERY BUSINESS MODEL

Flaberry intends to support the required delivery options through a configurable serviceability and delivery-capacity system.

The delivery experience should be determined by:

- Customer pincode.
- Delivery address.
- Product type.
- Vendor availability.
- Preparation time.
- Local cut-off time.
- Delivery partner availability.
- Delivery slot capacity.
- Requested delivery date.

## Delivery options

The implementation workflow identifies the following delivery modes for consideration:

| Delivery mode | Purpose |
|---|---|
| Standard delivery | Regular delivery within configured lead time |
| Scheduled delivery | Customer selects a future date |
| Same-day delivery | Delivery on the day of ordering where eligible |
| Midnight delivery | Special midnight delivery window |
| Fixed-time delivery | Configured time slot |
| Express delivery | Priority delivery where available |
| Local hand delivery | Local vendor/runner fulfilment |
| Courier delivery | Parcel-based fulfilment |

The exact launch availability of each mode must be validated with vendors and delivery partners.

## Delivery rules

- Never show unavailable delivery slots.
- Never overbook slot capacity.
- Revalidate delivery eligibility at cart and order creation.
- Respect vendor preparation time.
- Respect local cut-off times.
- Apply product-specific delivery restrictions.
- Consider holidays and blackout dates.
- Validate destination serviceability.
- Display clear delivery promises to customers.

A same-day or midnight collection label alone must not be treated as proof of actual delivery availability.

---

# 8. PAYMENT AND REVENUE MODEL

**Confirmed payment model: Customer pays Flaberry. Flaberry settles vendor earnings later.**

Vendors do not collect the customer's checkout payment.

## Customer payment flow

1. Customer selects products.
2. Customer proceeds to checkout.
3. Customer pays Flaberry through the configured Shopify-supported payment gateway.
4. Shopify records the order and payment transaction.
5. Backend verifies the payment status.
6. Order fulfilment is released according to business rules.

## Vendor earnings

Flaberry records the financial details associated with each vendor-fulfilled order line.

Potential ledger components include:

- Gross product amount.
- Discounts.
- Applicable taxes.
- Delivery charges.
- Refunds.
- Vendor fulfilment cost.
- Commission.
- Approved adjustments.
- Net vendor payable.

## Vendor settlement

Proposed settlement lifecycle:

1. Order is placed and paid.
2. Vendor fulfils the assigned order.
3. Delivery is completed.
4. Required checks and dispute conditions are evaluated.
5. Vendor earnings become eligible.
6. Finance reviews the statement.
7. Settlement is approved.
8. Flaberry pays the vendor.
9. Payment reference/UTR is recorded.
10. Vendor statement is updated.

The settlement cadence, commission percentage, deductions and tax treatment are not yet finalised.

Do not hard-code commission percentages or payout schedules.

These require commercial and finance approval.

---

# 9. CUSTOMER EXPERIENCE REQUIREMENTS

The storefront should offer one unified Flaberry shopping experience.

## Customer-facing principles

- Flaberry remains the primary visible brand.
- Product discovery should be simple.
- Delivery availability should be transparent.
- Product customisation should be easy.
- Pricing should be clear.
- Add-ons should be easy to select.
- Cart and checkout should be reliable.
- Order tracking should be accessible.
- Customer communication should be timely.
- Support should be available for delivery issues.

## Product customisation

Depending on product type, customers may need to select:

- Product variants.
- Cake weight.
- Eggless or with-egg preference.
- Cake message.
- Gift message.
- Occasion.
- Sender name.
- Add-on products.
- Delivery date.
- Delivery time slot.

Only applicable options should appear for each product.

## Customer data protection

Recipient and sender information must be handled securely.

Only the minimum necessary customer information should be shared with the assigned vendor.

---

# 10. SHOPIFY PLATFORM RESPONSIBILITIES

Shopify will serve as the primary commerce platform.

## Shopify storefront

Responsible for:

- Homepage.
- Navigation.
- Search.
- Collections.
- Product detail pages.
- Product variants.
- Cart.
- Checkout entry points.
- Customer-facing content.
- Customer accounts.
- Order records.
- Discounts.
- Commerce data.

## Shopify theme

The custom theme must reproduce the supplied interactive HTML prototype.

The theme is responsible for presentation and customer-facing interactions.

It must not become the source of truth for:

- Vendor eligibility.
- Inventory reservation.
- Automatic routing.
- Vendor permissions.
- Financial ledger.
- Vendor settlements.

## Marketplace layer

The marketplace application or custom marketplace integration should handle:

- Vendor onboarding.
- Vendor profiles.
- Vendor-product mapping.
- Vendor inventory.
- Vendor order access.
- Vendor fulfilment.
- Commission information.
- Vendor statements.

## Custom backend

A custom application or middleware service may be required for:

- Distance-based routing.
- Availability checks.
- Inventory reservation.
- Delivery-slot capacity.
- Order splitting.
- Automatic reassignment.
- Routing audit logs.
- Settlement ledger.
- Operational reporting.

The final technology and app choices must be validated before production implementation.

---

# 11. AUTOMATION AND AI OBJECTIVES

Flaberry intends to automate repetitive business operations wherever appropriate.

## Product automation

- Bulk product import.
- Product data validation.
- Duplicate detection.
- Bulk product editing.
- Product categorisation.
- SEO title and description drafting.
- Image alt-text suggestions.
- Collection recommendations.

## Vendor automation

- Vendor application workflows.
- Vendor onboarding reminders.
- Inventory updates.
- Vendor notifications.
- Order assignment alerts.
- Vendor performance reporting.

## Order automation

- Automatic vendor allocation.
- Allocation retry.
- Order status synchronization.
- Delivery updates.
- Exception alerts.
- Order reconciliation.

## Finance automation

- Vendor commission calculations.
- Vendor statements.
- Settlement reports.
- Payment reconciliation.
- Refund adjustments.

## Customer communication

- Order confirmation.
- Preparation updates.
- Dispatch notifications.
- Out-for-delivery updates.
- Delivery confirmation.
- Exception notifications.

## AI safety rules

AI may assist with drafting, analysis, recommendations and repetitive data processing.

However:

- Stock reservation must use deterministic logic.
- Distance ranking must use deterministic logic.
- Financial calculations must use deterministic logic.
- Vendor permissions must use secure application logic.
- Payout execution must use controlled financial workflows.
- Product publishing requires approval.
- Commission changes require authorised approval.
- Refund decisions must follow approved business rules.

AI must not independently change sensitive financial or operational policies.

---

# 12. BUSINESS SUCCESS CRITERIA

The project should ultimately achieve:

### Customer experience
- A consistent Flaberry storefront.
- Accurate product information.
- Reliable pincode-based serviceability.
- Clear delivery promises.
- Functional product customisation.
- Reliable checkout and order tracking.

### Marketplace operations
- One central catalogue.
- Multiple eligible fulfilment vendors.
- Automatic product/vendor allocation.
- Accurate vendor inventory.
- Reliable fulfilment updates.
- Secure vendor access.

### Delivery operations
- Accurate delivery eligibility.
- Configurable delivery modes.
- Slot capacity management.
- Reduced failed allocations.
- Safe fallback handling.

### Financial operations
- Customer payments collected by Flaberry.
- Auditable vendor earnings.
- Accurate commission calculations.
- Controlled vendor settlement.
- Payment and refund reconciliation.

### Automation
- Reduced manual product operations.
- Faster vendor notifications.
- Automated order allocation.
- Better inventory visibility.
- Automated reporting.
- AI-assisted content workflows.

---

# 13. SCOPE BOUNDARIES

## Included in the intended project

- Shopify storefront.
- Interactive prototype reproduction.
- Product catalogue.
- Collection management.
- Product detail functionality.
- Customer accounts.
- Cart and checkout.
- Delivery serviceability.
- Multi-vendor operations.
- Automatic order allocation.
- Vendor fulfilment.
- Vendor settlements.
- Customer notifications.
- Operational automation.

## Requires separate technical validation

- Marketplace application selection.
- Custom routing infrastructure.
- Mapping and distance API.
- Inventory synchronization.
- Delivery partner integrations.
- WhatsApp provider.
- Indian payment gateway configuration.
- GST and accounting workflows.
- Vendor settlement integrations.
- Checkout customization limitations.

## Not yet confirmed

The following must not be treated as final business decisions:

- Vendor commission percentages.
- Settlement frequency.
- Vendor acceptance SLA.
- Exact routing tie-break rules.
- Split-order customer experience.
- Final delivery-mode launch matrix.
- Cancellation and refund cost allocation.
- GST/invoicing responsibility.
- Vendor stock synchronization frequency.
- Final marketplace application.

---

# 14. OPEN BUSINESS DECISIONS

The following decisions must be resolved before final architecture and operational scope are frozen.

| Topic | Required decision |
|---|---|
| Delivery modes | Which delivery modes launch initially? |
| Vendor selection | How should eligible vendors be ranked when candidates are similar? |
| Split orders | Can one order be fulfilled by multiple vendors? |
| Combos | Must flower-and-cake combos be fulfilled by one vendor? |
| Vendor response SLA | How long can a vendor take to accept an order? |
| Inventory | How frequently must vendor inventory be updated? |
| Settlement | Weekly, fortnightly or monthly? |
| Commission | Percentage, flat fee or product-specific? |
| Refunds | Who bears product/preparation costs after cancellation? |
| GST | What is the approved invoicing and tax treatment? |
| Customer data | Which customer details can vendors access? |
| Launch coverage | Which pincodes and cities are included in the initial pilot? |

Do not invent answers to these questions.

Record decisions once approved and update the relevant project documents.

---

# 15. PROJECT EXECUTION PHILOSOPHY

The implementation must follow a controlled sequence.

1. Understand the complete prototype.
2. Finalise business requirements.
3. Validate Shopify and marketplace architecture.
4. Establish the Shopify development environment.
5. Reproduce the storefront design.
6. Connect actual Shopify products and collections.
7. Implement real cart and checkout functionality.
8. Integrate marketplace operations.
9. Implement automatic routing.
10. Implement delivery and serviceability.
11. Implement payments and settlements.
12. Implement notifications and automation.
13. Test the complete customer and vendor journey.
14. Run a controlled pilot.
15. Prepare for production launch.

Do not begin by building AI automation before the underlying catalogue, inventory and order lifecycle are reliable.

---

# 16. DEFINITION OF DONE

Flaberry's platform should be considered production-ready only when:

- The storefront accurately reproduces the approved prototype.
- Desktop and mobile experiences are tested.
- Customers can browse actual Shopify products.
- Customers can place real paid orders.
- Delivery availability is validated using real operational data.
- Every paid order is automatically assigned or explicitly escalated.
- Vendors can securely access and fulfil their assigned orders.
- Inventory and capacity cannot be oversold.
- Customers receive valid order updates.
- Flaberry can reconcile payments and refunds.
- Vendor earnings are correctly calculated.
- Flaberry can approve and complete vendor settlements.
- Routing and financial decisions are auditable.
- Operational exceptions can be handled safely.
- The complete workflow passes real-world pilot testing.

---

# FINAL BUSINESS PRINCIPLE

Flaberry is a single-brand gifting marketplace powered by a central product catalogue and a distributed vendor fulfilment network.

**Customers pay Flaberry. Flaberry manages the customer relationship, automatically allocates fulfilment and settles vendor earnings later.**

The technology must support this business model without compromising the existing customer experience or the confirmed business decisions.