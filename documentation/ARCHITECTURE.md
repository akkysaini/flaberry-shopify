# FLABERRY — TECHNICAL ARCHITECTURE

**Project:** Flaberry Shopify + Multi-Vendor Marketplace  
**Document Type:** System Architecture and Technical Specification  
**Target Market:** India  
**Commerce Platform:** Shopify  
**Development Environment:** Google Antigravity  
**Status:** Proposed architecture — pending technical validation

---

# 1. ARCHITECTURE OVERVIEW

## 1.1 Objective

Flaberry will operate as a single-brand Shopify storefront backed by a multi-vendor fulfilment network.

The system must support:

- One central product catalogue.
- Flaberry-owned products.
- Vendor-submitted products.
- Multiple vendors and fulfilment locations.
- Vendor-specific inventory.
- Pincode-based serviceability.
- Automatic order allocation using availability and distance.
- Delivery date and time-slot management.
- Customer payment collection by Flaberry.
- Delayed vendor settlements.
- Customer and vendor notifications.
- Administrative control over marketplace operations.

The architecture must separate the customer-facing storefront from sensitive marketplace operations.

## 1.2 Proposed high-level architecture

<escape>```text
                    CUSTOMER
                       |
                       v
             FLABERRY SHOPIFY STORE
                       |
        +--------------+--------------+
        |              |              |
        v              v              v
    Homepage       Catalogue       Product Pages
        |              |              |
        +--------------+--------------+
                       |
                       v
                 SHOPIFY CART
                       |
                       v
              SHOPIFY CHECKOUT
                       |
                       v
              CUSTOMER PAYMENT
                       |
                       v
               SHOPIFY ORDERS
                       |
                  WEBHOOKS
                       |
                       v
             FLABERRY BACKEND
                       |
        +--------------+--------------+
        |              |              |
        v              v              v
   Marketplace     Routing Engine   Delivery Engine
   Integration         |              |
        |              |              |
        v              v              v
     Vendors       Vendor Ranking   Slots / Pincodes
        |              |              |
        +--------------+--------------+
                       |
                       v
               ORDER ALLOCATION
                       |
                       v
                VENDOR FULFILMENT
                       |
                       v
               DELIVERY COMPLETION
                       |
                       v
                FINANCIAL LEDGER
                       |
                       v
              FLABERRY SETTLEMENT
</escape>```

This is a proposed logical architecture. The actual application boundaries and integrations will depend on the selected marketplace app and Shopify capabilities.

---

# 2. SYSTEM COMPONENTS

The platform should be divided into the following major components.

| Component | Primary responsibility |
|---|---|
| Shopify Storefront | Customer-facing website |
| Shopify Commerce | Products, customers, carts and orders |
| Marketplace Application | Vendor management and vendor operations |
| Custom Backend | Business logic and system orchestration |
| Routing Engine | Automatic vendor allocation |
| Inventory Service | Vendor stock and reservations |
| Delivery Engine | Pincode, date and slot validation |
| Financial Ledger | Commission and vendor payable records |
| Notification Service | Email and WhatsApp notifications |
| Admin Interface | Central operational control |
| Database | Operational data and audit records |
| Background Queue | Asynchronous processing and retries |

## 2.1 Shopify Storefront

The storefront will be built using a custom Shopify Online Store 2.0 theme.

Responsibilities:

- Homepage.
- Navigation.
- Search.
- Collections.
- Product detail pages.
- Product variants.
- Product customisation.
- Add-ons.
- Cart.
- Customer accounts.
- Order tracking entry points.
- Customer-facing delivery information.

The storefront should use actual Shopify product and collection data.

Do not hardcode the entire catalogue inside Liquid or JavaScript.

## 2.2 Shopify Commerce

Shopify will remain the primary commerce platform.

Responsibilities:

- Product records.
- Variants.
- Prices.
- Discounts.
- Customers.
- Orders.
- Payment records.
- Cart.
- Checkout.
- Refund records.
- Fulfilment records.

Shopify should remain the authoritative source for customer-facing commerce records.

## 2.3 Marketplace Application

The marketplace application will provide the vendor-management foundation.

Expected capabilities:

- Vendor registration.
- Vendor profiles.
- Vendor dashboard.
- Vendor-product assignments.
- Vendor inventory.
- Vendor order management.
- Commission configuration.
- Vendor statements.
- Vendor permissions.
- Bulk product onboarding.

The selected application must be tested against Flaberry's requirements.

Do not assume that a marketplace app automatically supports the complete custom routing and delayed-settlement requirements.

## 2.4 Custom Backend

A custom application or middleware service is proposed for business-critical operations that cannot be reliably handled by the theme.

Responsibilities:

- Vendor eligibility.
- Inventory validation.
- Distance calculations.
- Automatic order allocation.
- Reservation management.
- Delivery-slot validation.
- Order splitting.
- Vendor reassignment.
- Webhook processing.
- Commission ledger.
- Settlement orchestration.
- Notifications.
- Operational reporting.

The backend must operate independently of the customer's browser session.

## 2.5 Database

A persistent database is required for marketplace operational records.

It should store:

- Vendor profiles.
- Vendor locations.
- Product assignments.
- Inventory snapshots.
- Service zones.
- Delivery capacity.
- Routing decisions.
- Reservations.
- Fulfilment tasks.
- Commission records.
- Settlement batches.
- Audit history.

Shopify should not be treated as the only storage location for all marketplace-specific operational data.

---

# 3. CENTRAL PRODUCT CATALOGUE ARCHITECTURE

## 3.1 Confirmed requirement

Flaberry will maintain one central catalogue containing both:

1. Central products.
2. Approved vendor-listed products.

The same customer-facing catalogue should serve both product sources.

## 3.2 Proposed product data structure

A product should have one master Shopify product record wherever possible.

Recommended fields:

| Field | Purpose |
|---|---|
| Shopify Product ID | Master product reference |
| Variant ID | Specific product variant |
| Master SKU | Flaberry product identifier |
| Product title | Customer-facing name |
| Product type | Flowers, cakes, combos, etc. |
| Product images | Product media |
| Price | Customer-facing price |
| Product status | Draft, active, archived |
| Fulfilment class | Operational product classification |
| Preparation time | Required preparation duration |
| Delivery restrictions | Applicable delivery rules |
| Allowed delivery modes | Eligible delivery services |
| SEO data | Search optimisation information |

## 3.3 Vendor-product assignment

A separate assignment record should connect a Shopify product or variant to an eligible vendor.

Suggested structure:

<escape>```json
{
  "assignment_id": "ASSIGN-001",
  "shopify_product_id": "PRODUCT_ID",
  "variant_id": "VARIANT_ID",
  "vendor_id": "VENDOR-001",
  "vendor_sku": "VENDOR-SKU-01",
  "vendor_cost": 1200,
  "available_quantity": 15,
  "reserved_quantity": 2,
  "preparation_minutes": 90,
  "priority": 1,
  "is_active": true
}
```</escape>

The structure is illustrative, not a final database schema.

Vendor-specific information should not unnecessarily overwrite master product information.

## 3.4 Central versus vendor-listed products

**Central products:**

- Created by Flaberry.
- Managed by Flaberry.
- Assigned to one or more eligible vendors.
- Customer-facing price controlled centrally.

**Vendor-listed products:**

- Submitted by a vendor.
- Reviewed by Flaberry.
- Approved before publication.
- Added to the central catalogue.
- Assigned to the submitting or other eligible vendors as permitted.

## 3.5 Catalogue synchronization

When a product changes:

1. Shopify product data is updated.
2. Relevant product-change events are processed.
3. Marketplace assignments are checked.
4. Vendor eligibility is recalculated where necessary.
5. Search and collection availability are updated.

Do not allow vendor inventory updates to unintentionally change the central product price or description.

---

# 4. VENDOR ARCHITECTURE

## 4.1 Vendor structure

A vendor may have multiple fulfilment locations.

Recommended relationship:

<escape>```text
Vendor
  |
  +---- Vendor Location 1
  |        |
  |        +---- Service Zones
  |        +---- Inventory
  |        +---- Delivery Capacity
  |
  +---- Vendor Location 2
           |
           +---- Service Zones
           +---- Inventory
           +---- Delivery Capacity
```</escape>

This is important because distance calculations must use the actual fulfilment location, not just the vendor's registered office.

## 4.2 Vendor record

Recommended fields:

- Vendor ID.
- Legal/business name.
- Display name.
- Contact information.
- Vendor status.
- PAN/GSTIN references where applicable.
- Bank verification status.
- Commission agreement.
- Created date.
- Approved date.

## 4.3 Vendor location record

Recommended fields:

- Location ID.
- Vendor ID.
- Fulfilment address.
- Pincode.
- City.
- State.
- Latitude.
- Longitude.
- Operating hours.
- Active status.

## 4.4 Vendor access

Vendor authentication and permissions must be managed through a secure marketplace application or backend.

The public Shopify theme must never provide unrestricted access to vendor records.

Each vendor should only access their assigned operational information.

---

# 5. AUTOMATIC ORDER ROUTING ENGINE

**Priority: Critical**

This is a custom business-critical subsystem.

## 5.1 Confirmed routing requirement

Every order requiring vendor fulfilment must be allocated automatically using:

- Product availability.
- Distance.

The system should not depend on customers selecting vendors.

## 5.2 Routing engine inputs

| Input | Source |
|---|---|
| Order ID | Shopify |
| Order line ID | Shopify |
| Product ID | Shopify |
| Variant ID | Shopify |
| Destination address | Checkout/order |
| Destination pincode | Checkout/order |
| Requested date | Delivery selection |
| Requested slot | Delivery selection |
| Vendor ID | Marketplace |
| Vendor location | Vendor database |
| Inventory | Inventory service |
| Preparation time | Vendor/product assignment |
| Capacity | Delivery engine |
| Distance | Mapping provider |

## 5.3 Proposed routing workflow

<escape>```text
SHOPIFY ORDER PAID
        |
        v
RECEIVE ORDER EVENT
        |
        v
VALIDATE ORDER DETAILS
        |
        v
IDENTIFY ORDER LINES
        |
        v
FIND ELIGIBLE VENDORS
        |
        v
CHECK SERVICEABILITY
        |
        v
CHECK STOCK AND CAPACITY
        |
        v
CALCULATE DISTANCE / ETA
        |
        v
RANK ELIGIBLE VENDORS
        |
        v
RESERVE STOCK AND SLOT
        |
        v
ASSIGN ORDER TO VENDOR
        |
        v
SEND VENDOR NOTIFICATION
        |
        v
MONITOR ACCEPTANCE
        |
        +------------------+
        |                  |
        v                  v
    ACCEPTED             REJECTED /
        |                TIMEOUT
        v                  |
    FULFILMENT             v
                     TRY NEXT VENDOR
```</escape>

## 5.4 Eligibility rules

A vendor must pass all applicable hard constraints before ranking.

Examples:

- Vendor is active.
- Vendor is approved for the product.
- Product assignment is active.
- Destination is serviceable.
- Product is available.
- Vendor has sufficient capacity.
- Preparation time fits the requested delivery promise.
- Requested delivery mode is supported.

A vendor failing a hard constraint must not receive the order merely because it is nearby.

## 5.5 Ranking rules

Proposed ranking order:

1. Fulfilment eligibility.
2. Stock availability.
3. Delivery promise feasibility.
4. Estimated delivery time.
5. Road distance.
6. Vendor reliability.
7. Vendor capacity/load.
8. Approved business priority.

The exact ranking weights and tie-breaking policy require approval.

## 5.6 Distance calculation

A mapping/distance provider is proposed.

Inputs:

- Vendor fulfilment coordinates.
- Customer destination coordinates.
- Route information.

Outputs:

- Estimated road distance.
- Estimated travel time.
- Route availability.

Straight-line distance may be used only as a clearly defined fallback estimate.

Do not treat city-level proximity as an accurate routing calculation.

## 5.7 Inventory reservation

Before assignment, the system must reserve the selected vendor's inventory.

Suggested logic:

<escape>```text
Available Stock = Sellable Stock - Reserved Stock

If Available Stock >= Required Quantity:
    Attempt reservation
Else:
    Reject vendor candidate
```</escape>

Reservation must be atomic or otherwise concurrency-safe.

A short-lived reservation should expire if the assignment fails or is not completed within the configured period.

## 5.8 Vendor acknowledgement

After assignment:

1. Vendor receives an order notification.
2. Vendor acknowledges the order.
3. Vendor starts preparation.
4. Vendor updates fulfilment status.
5. Delivery is completed.

If the vendor rejects or does not respond within the approved SLA:

- Release the reservation.
- Record the failure.
- Attempt the next eligible vendor.
- Escalate if no eligible vendor remains.

The acknowledgement SLA remains pending.

## 5.9 Routing audit

Every allocation should retain:

- Order ID.
- Order line ID.
- Candidate vendors.
- Rejection reasons.
- Inventory snapshot.
- Distance/ETA.
- Selected vendor.
- Routing rule version.
- Assignment timestamp.
- Reassignment history.

This is necessary for troubleshooting and operational accountability.

---

# 6. MULTI-ITEM ORDER AND SPLIT FULFILMENT

A customer order may contain multiple products.

The system should distinguish between:

- Customer order.
- Order lines.
- Internal vendor fulfilment tasks.

## 6.1 Proposed model

<escape>```text
CUSTOMER ORDER #1001
        |
        +---- Line 1: Flower Bouquet
        |          |
        |          +---- Vendor A
        |
        +---- Line 2: Chocolate Cake
        |          |
        |          +---- Vendor B
        |
        +---- Line 3: Gift Hamper
                   |
                   +---- Vendor A
```</escape>

The customer may see one consolidated Flaberry order while internal fulfilment is split across vendors.

## 6.2 Pending decisions

The following must be approved:

- Whether split fulfilment is permitted for all product types.
- Whether different delivery dates can exist in one customer order.
- Whether separate delivery charges apply.
- Whether combos must be fulfilled by one vendor.
- How partial cancellations and refunds work.

Proposed default for a combo that must arrive together: treat it as one fulfilment unit and require one eligible vendor capable of supplying all components.

Do not silently split a combo between vendors.

---

# 7. PINCODE AND DELIVERY SERVICEABILITY ENGINE

## 7.1 Purpose

The delivery engine determines whether a product can be delivered to the customer's destination.

It should evaluate:

- Destination pincode.
- Vendor service zones.
- Product eligibility.
- Delivery mode.
- Delivery date.
- Delivery slot.
- Vendor operating hours.
- Preparation time.
- Available delivery capacity.

## 7.2 Proposed data structure

### Service zone

- Zone ID.
- Vendor ID.
- Pincode.
- City.
- State.
- Delivery mode.
- Active status.
- Start date.
- End date.

### Delivery slot

- Slot ID.
- Vendor/location ID.
- Delivery date.
- Start time.
- End time.
- Maximum orders.
- Reserved orders.
- Remaining capacity.
- Delivery mode.

## 7.3 Delivery modes

The architecture should support configurable modes:

- Standard.
- Scheduled.
- Same-day.
- Midnight.
- Fixed-time.
- Express.
- Local hand delivery.
- Courier delivery.

Actual modes shown to customers must be based on verified operational availability.

## 7.4 Delivery validation sequence

1. Validate the pincode.
2. Identify eligible vendors.
3. Check product-specific restrictions.
4. Check preparation time.
5. Check delivery mode.
6. Check available date.
7. Check slot capacity.
8. Return eligible delivery options.
9. Revalidate at cart/order creation.
10. Reserve the chosen capacity.

Do not treat frontend date selection as a confirmed delivery reservation.

---

# 8. CART AND CHECKOUT ARCHITECTURE

## 8.1 Cart

Shopify Cart API should be used for actual cart operations.

The cart must preserve relevant customer selections.

Examples:

- Product variant.
- Quantity.
- Cake message.
- Occasion.
- Sender name.
- Recipient details where appropriate.
- Selected add-ons.
- Delivery date.
- Delivery slot.
- Delivery preferences.

Use line item properties and cart attributes where appropriate.

Sensitive information should not be exposed unnecessarily.

## 8.2 Cart validation

Before checkout, validate:

- Product availability.
- Quantity.
- Product price.
- Pincode.
- Delivery eligibility.
- Requested delivery date.
- Delivery slot.
- Product compatibility.
- Vendor fulfilment feasibility.

If an item becomes unavailable, present an understandable alternative.

## 8.3 Checkout

Shopify checkout is responsible for customer payment and order creation.

The final implementation must respect the checkout customization capabilities of the selected Shopify plan and approved extensions.

Do not assume that arbitrary custom backend code can run directly inside checkout.

## 8.4 Payment confirmation

The backend should process trusted Shopify payment/order events.

It must not release fulfilment merely because a browser displays a payment-success message.

Verify actual payment status using the appropriate Shopify transaction information and trusted event processing.

---

# 9. PAYMENT AND FINANCIAL LEDGER ARCHITECTURE

## 9.1 Confirmed payment model

- Customer pays Flaberry.
- Flaberry collects customer payments.
- Vendor payments happen later.
- Vendor settlement is managed by Flaberry.

## 9.2 Proposed financial flow

<escape>```text
CUSTOMER
   |
   v
SHOPIFY CHECKOUT
   |
   v
PAYMENT GATEWAY
   |
   v
FLABERRY PAYMENT COLLECTION
   |
   v
SHOPIFY ORDER / TRANSACTION
   |
   v
VENDOR FULFILMENT
   |
   v
FINANCIAL LEDGER
   |
   v
COMMISSION CALCULATION
   |
   v
SETTLEMENT ELIGIBILITY
   |
   v
FINANCE APPROVAL
   |
   v
VENDOR PAYOUT
```</escape>

## 9.3 Proposed ledger records

Each financial entry should be traceable to the relevant order and order line.

Recommended fields:

- Ledger entry ID.
- Order ID.
- Order line ID.
- Vendor ID.
- Gross amount.
- Discount amount.
- Tax amount.
- Delivery charge.
- Refund amount.
- Commission basis.
- Commission rate.
- Commission amount.
- Vendor payable.
- Adjustment amount.
- Settlement status.
- Created timestamp.

## 9.4 Commission calculation

Illustrative formula:

Vendor payable = Eligible vendor fulfilment amount - Agreed deductions +/- Approved adjustments.

Flaberry commission = Approved commission basis × Applicable commission rate.

The exact commission basis is pending finance approval.

Do not hardcode rates or tax treatment.

## 9.5 Settlement lifecycle

Proposed states:

1. Pending.
2. Eligible.
3. On hold.
4. Approved.
5. Paid.
6. Failed/reversed.

## 9.6 Financial controls

- Verify vendor bank information.
- Prevent duplicate payouts.
- Maintain transaction references.
- Reconcile Shopify transactions.
- Record refunds.
- Record chargebacks and disputes.
- Maintain payout references/UTR.
- Maintain settlement history.
- Require authorised approval.

Financial calculations must use deterministic application logic.

---

# 10. MARKETPLACE APPLICATION INTEGRATION

A multi-vendor marketplace app is expected to provide the vendor-management foundation.

Webkul MultiVendor Marketplace is a candidate for evaluation, not a confirmed selection.

## Required proof-of-concept capabilities

| Requirement | Validation |
|---|---|
| Vendor registration | Can vendors register securely? |
| Central products | Can existing Flaberry products be assigned to vendors? |
| Vendor products | Can vendors submit products for approval? |
| Vendor inventory | Can inventory be managed separately? |
| Vendor portal | Can vendors manage their own orders? |
| Permissions | Are vendor records isolated? |
| Order assignment | Can order lines be assigned appropriately? |
| Partial fulfilment | Can multiple vendors fulfil one order? |
| Commission | Can commissions be recorded correctly? |
| Delayed payout | Can Flaberry collect first and settle later? |
| APIs | Are required APIs available? |
| Webhooks | Can backend events be triggered? |
| Data export | Can operational data be retrieved? |

## Integration principle

Do not duplicate all marketplace functionality inside a custom application if the selected app already provides reliable capabilities.

Build custom functionality only where the marketplace app cannot meet Flaberry's requirements.

---

# 11. INTEGRATION ARCHITECTURE

The platform may require the following integrations.

| Integration | Purpose | Status |
|---|---|---|
| Shopify APIs | Commerce operations | Required |
| Shopify webhooks | Order and product events | Required |
| Marketplace app | Vendor management | Selection pending |
| Mapping API | Distance/ETA | Proposed |
| Pincode data/service | Destination validation | Selection pending |
| Indian payment gateway | Customer payments | Selection pending |
| Courier aggregator | Parcel fulfilment | Selection pending |
| Local delivery partners | Same-day/midnight delivery | Selection pending |
| WhatsApp Business provider | Customer/vendor messaging | Selection pending |
| Email service | Transactional notifications | Selection pending |
| Database | Marketplace operational records | Required |
| Background job queue | Retries and asynchronous tasks | Proposed |

Do not purchase or install overlapping apps without evaluating their responsibilities.

---

# 12. WEBHOOK AND EVENT ARCHITECTURE

Shopify webhooks will be used to notify the backend about relevant commerce events.

Potential events:

- Order created.
- Order paid.
- Order updated.
- Order cancelled.
- Refund created.
- Product updated.
- Inventory updated.
- Fulfilment created.
- Fulfilment updated.

The exact subscription list should be finalised during backend implementation.

## Webhook processing rules

Every webhook handler must:

1. Verify the webhook signature.
2. Validate the event.
3. Identify the source event.
4. Check for duplicate processing.
5. Persist the event or processing record.
6. Execute the required business workflow.
7. Retry temporary failures safely.
8. Log processing outcomes.

Use idempotency so duplicate webhook deliveries cannot allocate the same order twice or generate duplicate financial entries.

## Proposed event flow

<escape>```text
SHOPIFY EVENT
     |
     v
WEBHOOK ENDPOINT
     |
     v
SIGNATURE VERIFICATION
     |
     v
EVENT DEDUPLICATION
     |
     v
PERSIST EVENT
     |
     v
BACKGROUND JOB QUEUE
     |
     v
BUSINESS PROCESSING
     |
     +---- Routing
     +---- Inventory
     +---- Vendor notification
     +---- Financial records
     |
     v
AUDIT LOG
```</escape>

---

# 13. NOTIFICATION ARCHITECTURE

Notifications should be event-driven.

## Customer notifications

Potential events:

- Order confirmation.
- Payment confirmation.
- Order accepted.
- Preparation started.
- Dispatched.
- Out for delivery.
- Delivered.
- Delivery exception.
- Cancellation/refund update.

## Vendor notifications

Potential events:

- New order assigned.
- Order acceptance reminder.
- Delivery deadline reminder.
- Order reassigned.
- Cancellation.
- Settlement statement available.

## Notification controls

- Use approved WhatsApp templates.
- Maintain customer communication consent.
- Avoid duplicate messages.
- Retry temporary failures.
- Log delivery status.
- Provide escalation for failed critical messages.

---

# 14. SECURITY AND ACCESS CONTROL

Security is essential because the platform handles customer addresses, payments and vendor financial information.

## 14.1 Public storefront

Public theme code must not contain:

- API secrets.
- Private access tokens.
- Vendor bank information.
- Internal commission calculations.
- Privileged administrative operations.
- Unrestricted database credentials.

## 14.2 Backend security

The backend must use:

- Authenticated API access.
- Role-based permissions.
- Webhook signature verification.
- Input validation.
- Secure secret management.
- Rate limiting where appropriate.
- Audit logs.

## 14.3 Vendor permissions

A vendor must only access:

- Their own profile.
- Their assigned products.
- Their assigned orders.
- Relevant customer fulfilment information.
- Their own inventory.
- Their own financial statements.

## 14.4 Customer privacy

Only necessary customer information should be shared with the assigned vendor.

Access should be limited to the fulfilment period and business purpose.

---

# 15. ADMIN AND OPERATIONS ARCHITECTURE

Flaberry administrators need central operational control.

The proposed admin capabilities include:

### Catalogue management
- Product approval.
- Product editing.
- Product/vendor assignments.
- Product pricing.
- Collection management.
- Bulk imports.

### Vendor management
- Vendor approval.
- Vendor suspension.
- Vendor location management.
- Serviceability.
- Inventory monitoring.
- Vendor performance.

### Order management
- Order allocation visibility.
- Routing decision history.
- Vendor assignment.
- Manual reassignment.
- Order exceptions.
- Delivery status.

### Delivery management
- Pincode configuration.
- Delivery zones.
- Delivery modes.
- Slot capacity.
- Cut-off times.
- Blackout dates.

### Finance
- Commission rules.
- Vendor ledger.
- Refund adjustments.
- Settlement batches.
- Payout approvals.
- Reconciliation.

These capabilities should be implemented through the marketplace application and/or secure internal admin application.

Do not build privileged admin functionality into public storefront templates.

---

# 16. PROPOSED DATABASE STRUCTURE

The following is a conceptual data model.

It is not yet a final SQL schema.

| Entity | Purpose |
|---|---|
| Vendors | Vendor master records |
| Vendor Locations | Fulfilment addresses and coordinates |
| Products | Shopify product references |
| Product Assignments | Product-to-vendor mapping |
| Inventory Snapshots | Vendor stock information |
| Service Zones | Vendor serviceable locations |
| Delivery Slots | Delivery capacity and reservations |
| Reservations | Inventory and slot reservations |
| Orders | Shopify order references |
| Order Lines | Shopify line item references |
| Routing Decisions | Candidate selection and allocation history |
| Fulfilment Tasks | Vendor fulfilment workflow |
| Commission Rules | Approved commission policies |
| Financial Ledger | Order-level financial entries |
| Settlement Batches | Vendor payout batches |
| Notification Logs | Message delivery history |
| Webhook Events | Event processing records |
| Audit Logs | Operational change history |

## Entity relationships

<escape>```text
VENDOR
  |
  +---- VENDOR LOCATIONS
  |
  +---- PRODUCT ASSIGNMENTS
  |           |
  |           +---- SHOPIFY PRODUCTS
  |
  +---- INVENTORY
  |
  +---- SERVICE ZONES
  |
  +---- DELIVERY CAPACITY
  |
  +---- FULFILMENT TASKS
  |
  +---- FINANCIAL LEDGER
              |
              +---- SETTLEMENT BATCHES

SHOPIFY ORDER
  |
  +---- ORDER LINES
           |
           +---- ROUTING DECISIONS
           |
           +---- FULFILMENT TASKS
```</escape>

---

# 17. ERROR HANDLING AND FALLBACK ARCHITECTURE

The system must handle operational failures without losing orders or making false delivery promises.

## Routing failures

Possible reasons:
- No eligible vendor.
- Insufficient stock.
- Slot capacity exhausted.
- Vendor rejection.
- Vendor timeout.
- Mapping service failure.

Expected response:
- Record the failure.
- Retry where safe.
- Attempt next eligible vendor.
- Escalate to operations if no candidate remains.

## Inventory failures

Possible reasons:
- Stale inventory.
- Concurrent reservations.
- Vendor stock mismatch.
- Failed inventory synchronization.

Expected response:
- Mark availability uncertain.
- Prevent unsafe assignment.
- Refresh inventory.
- Alert operations.

## Payment failures

Possible reasons:
- Payment pending.
- Payment failed.
- Duplicate webhook.
- Refund failure.

Expected response:
- Verify authoritative transaction state.
- Prevent duplicate processing.
- Keep order/payment status consistent.
- Notify customer where appropriate.

## Notification failures

Expected response:
- Retry according to policy.
- Record delivery failures.
- Escalate critical notifications.
- Provide an alternative communication channel where configured.

---

# 18. DEVELOPMENT AND DEPLOYMENT ARCHITECTURE

## Development environment

The current project uses:

- Visual Studio Code.
- Google Antigravity.
- Shopify CLI.
- Git.
- GitHub.
- HTML reference prototype.

## Proposed repository structure

<escape>```text
Flaberry-Shopify/
│
├── documentation/
│   ├── PROJECT_BRIEF.md
│   ├── DESIGN_REFERENCE.md
│   ├── ARCHITECTURE.md
│   ├── IMPLEMENTATION_PLAN.md
│   └── INTEGRATIONS.md
│
├── reference/
│   └── Flaberry_Design1_Classic.html
│
├── screenshots/
│   ├── desktop/
│   └── mobile/
│
├── theme/
│   ├── assets/
│   ├── config/
│   ├── layout/
│   ├── locales/
│   ├── sections/
│   ├── snippets/
│   └── templates/
│
├── backend/
│   └── To be created after architecture approval
│
├── GEMINI.md
├── README.md
└── .gitignore
```</escape>

The backend folder is a future structural proposal. Do not create an empty backend project or install backend dependencies until the technology choice is approved.

## Git workflow

Use GitHub for version control.

Recommended process:

1. Make a small development change.
2. Test locally.
3. Review the change.
4. Commit the completed milestone.
5. Push to GitHub.
6. Validate the Shopify preview.
7. Continue to the next milestone.

Never force-push or discard existing work without explicit approval.

---

# 19. ARCHITECTURE VALIDATION REQUIREMENTS

Before finalising the technology stack, validate the following.

| Area | Required proof |
|---|---|
| Marketplace app | Vendor onboarding and permissions |
| Central catalogue | Existing product assignment to multiple vendors |
| Vendor catalogue | Product submission and approval |
| Inventory | Vendor-specific stock handling |
| Order assignment | Line-level assignment capabilities |
| Split fulfilment | Multiple vendors in one customer order |
| Routing | Availability + distance-based allocation |
| Reassignment | Vendor rejection and timeout fallback |
| Delivery | Pincode, date and slot capacity |
| Payment | Flaberry collects customer payment |
| Settlement | Delayed vendor payout workflow |
| APIs | Required read/write access |
| Webhooks | Reliable event integration |
| Security | Vendor data isolation |

Do not commit to an application purchase until the critical requirements have been demonstrated in a proof-of-concept.

---

# 20. CONFIRMED, PROPOSED AND PENDING DECISIONS

## Confirmed

- Shopify is the primary commerce platform.
- India is the launch market.
- Central and vendor-listed products will coexist.
- One central product catalogue will be maintained.
- Order allocation will always be automatic.
- Allocation must consider availability and distance.
- Customers pay Flaberry.
- Flaberry settles vendor earnings later.

## Proposed

- Shopify OS 2.0 storefront.
- Separate custom backend for business-critical orchestration.
- Persistent operational database.
- Background job queue.
- Dedicated routing engine.
- Dedicated inventory reservation logic.
- Mapping API for distance/ETA.
- Event-driven webhook architecture.
- Line-level financial ledger.
- Secure vendor portal integration.

## Pending

- Final marketplace application.
- Backend framework and hosting.
- Database technology.
- Mapping provider.
- Delivery partners.
- Payment gateway.
- Commission calculation policy.
- Settlement schedule.
- Vendor acceptance SLA.
- Split-order policy.
- Exact delivery-mode launch matrix.
- Tax and invoicing treatment.

---

# 21. IMPLEMENTATION PRINCIPLES

The following principles must guide all future development.

1. Shopify should remain the primary commerce system.
2. The theme must not control privileged marketplace operations.
3. Product master data must remain centrally controlled.
4. Vendor-specific inventory must be independently traceable.
5. Automatic routing must use real operational data.
6. Inventory and capacity reservations must be concurrency-safe.
7. Every order allocation must be auditable.
8. Payment collection and vendor settlement must remain separate.
9. Vendor permissions must be isolated.
10. Integrations must be tested before production use.
11. Frontend demonstration behaviour must never be mistaken for backend functionality.
12. Confirmed business decisions must not be changed without approval.

---

# FINAL ARCHITECTURE PRINCIPLE

**Shopify manages commerce. The marketplace layer manages vendors. The custom backend manages business-critical orchestration. The routing engine decides fulfilment. The financial ledger manages vendor earnings and settlements.**

All components must work together while maintaining Flaberry as one unified customer-facing brand.

The architecture must be scalable, secure, maintainable and capable of supporting the confirmed business model without unnecessary duplication of functionality.