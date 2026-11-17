# FLABERRY — INTEGRATIONS & EXTERNAL SERVICES

**Project:** Flaberry Shopify Storefront + Multi-Vendor Marketplace  
**Document Type:** Integration Requirements and External Services  
**Market:** India  
**Commerce Platform:** Shopify  
**Theme Foundation:** Shopify Horizon  
**Development Environment:** Google Antigravity + VS Code  
**Status:** Partially configured — integrations pending validation

---

# 1. PURPOSE

This document defines the external tools, services, APIs, applications and integrations required to develop and operate Flaberry.

It distinguishes between:

1. Development tools used during implementation.
2. Shopify platform services.
3. Marketplace applications.
4. Custom backend integrations.
5. External operational services.

No external integration should be considered production-ready until it has been tested and approved.

---

# 2. DEVELOPMENT TOOLS

These tools support development and must not be confused with Flaberry's production business integrations.

## 2.1 Google Antigravity

**Purpose:** Primary AI-assisted development environment.

Responsibilities:

- Read project documentation.
- Analyse the HTML prototype.
- Understand Shopify Horizon.
- Generate Shopify Liquid code.
- Develop reusable sections and snippets.
- Assist with CSS and JavaScript.
- Inspect existing project files.
- Run development commands.
- Assist with debugging.
- Validate implementation against requirements.

Antigravity must work within the existing Flaberry-Shopify workspace.

It must not independently change approved architecture or business decisions.

## 2.2 Shopify AI Toolkit

**Official repository:**
https://github.com/Shopify/shopify-ai-toolkit

**Official documentation:**
https://shopify.dev/docs/apps/build/ai-toolkit

**Status:** Installed successfully.

Installation command used:

```powershell
agy plugin install https://github.com/Shopify/shopify-ai-toolkit
```

Installation location:

```text
C:\Users\akkys\.gemini\config\plugins\shopify-plugin
```

The installation output confirmed two skills:

- Shopify.
- UCP.

### Capabilities

The toolkit provides:

- Shopify documentation search.
- Shopify API schemas.
- Shopify development guidance.
- Liquid validation.
- GraphQL validation.
- UI extension validation.
- Shopify CLI-related store management capabilities.
- AI agent skills for Shopify development.

### Usage requirements

Antigravity should use Shopify AI Toolkit guidance when working on:

- Shopify theme development.
- Liquid.
- Shopify APIs.
- GraphQL.
- Shopify Functions.
- Storefront development.
- Shopify app development.
- Checkout extensions.
- Other relevant Shopify development tasks.

Do not invent Shopify APIs or Liquid objects.

Verify API availability and compatibility before implementation.

### Telemetry and privacy

Shopify AI Toolkit has telemetry enabled by default.

Its official documentation describes usage events that can include tool usage, documentation queries and validation information. Some validation and skill-logging paths can also capture the most recent user prompt.

Windows opt-out file:

```text
%APPDATA%\shopify-ai-toolkit\opt-out
```

Creating this empty file opts out of toolkit instrumentation.

Environment-variable alternative:

```powershell
$env:OPT_OUT_INSTRUMENTATION = "true"
```

The file-based method is recommended because GUI-launched processes may not inherit terminal environment variables.

**Privacy decision:** The project owner must decide whether to retain default telemetry or opt out. Do not change this setting without approval.

## 2.3 Shopify Horizon

**Official repository:**
https://github.com/Shopify/horizon

**Status:** Selected as the theme foundation. Not yet integrated.

### Purpose

Horizon will provide the initial Shopify theme architecture for Flaberry.

It replaces Dawn as the planned starting codebase.

Horizon provides:

- Shopify Liquid architecture.
- Sections.
- Snippets.
- Templates.
- Theme blocks.
- Theme configuration.
- Assets.
- Shopify-compatible storefront functionality.

### Integration rules

1. Use the official Shopify Horizon repository as the source.
2. Preserve the existing Flaberry project root.
3. Integrate Horizon inside the existing `theme/` directory.
4. Do not clone Horizon into the project root.
5. Do not introduce a nested Git repository unintentionally.
6. Preserve all existing project documentation.
7. Preserve the original HTML reference.
8. Maintain Flaberry's original visual design.
9. Adapt Horizon components to the Flaberry prototype.
10. Keep the original Horizon source attribution and licence information.

### Important compatibility warning

Shopify's Horizon `main` branch may contain features that are not yet released or publicly documented.

Before adopting the theme:

- Inspect the repository.
- Record the selected commit.
- Review Liquid compatibility.
- Run Shopify Theme Check.
- Test the development preview.

Do not automatically pull upstream changes into a working Flaberry theme.

### Upstream tracking

Official Horizon repository:

```text
https://github.com/Shopify/horizon.git
```

The upstream remote can be added after integration:

```powershell
git remote add upstream https://github.com/Shopify/horizon.git
```

Upstream updates must be reviewed and merged deliberately.

Horizon is the chosen internal development foundation, not a proposed Shopify Theme Store submission.

---

# 3. SHOPIFY PLATFORM INTEGRATIONS

Shopify is the primary commerce platform.

## 3.1 Shopify Admin GraphQL API

**Purpose:** Manage commerce and administrative data through the custom backend.

Expected use cases:

- Product management.
- Product variants.
- Inventory.
- Orders.
- Fulfilment.
- Customers where authorised.
- Refund information.
- Order status.
- Store configuration.

Use the supported GraphQL Admin API for new application development.

The REST Admin API is legacy and should not be selected for new integrations without a specific compatibility reason.

### Security requirements

- Use authorised access tokens.
- Request minimum necessary scopes.
- Keep tokens on the backend.
- Never expose private credentials in storefront JavaScript.
- Log sensitive operations.
- Respect Shopify API rate limits.

## 3.2 Shopify Storefront API

**Purpose:** Customer-facing commerce data and storefront interactions where required.

Potential applications:

- Product discovery.
- Collection data.
- Cart operations.
- Product availability presentation.
- Storefront commerce interactions.

For the initial Flaberry implementation, prefer native Shopify Liquid and theme capabilities wherever appropriate.

Do not introduce unnecessary headless architecture.

## 3.3 Shopify Liquid Theme Architecture

Horizon will use Shopify's native theme system.

Expected theme components:

- Layouts.
- Sections.
- Theme blocks.
- Snippets.
- Templates.
- Assets.
- Configuration.
- Locales.

The original Flaberry HTML will be translated into reusable Shopify sections and components.

The theme must use actual Shopify product and collection data instead of hardcoded demonstration records.

## 3.4 Shopify Cart API

**Purpose:** Real customer shopping cart functionality.

Required operations:

- Add items.
- Update quantities.
- Remove items.
- Read cart contents.
- Update cart attributes.
- Manage line item properties.

Product customisation information should be stored using suitable Shopify-supported cart and line-item mechanisms.

## 3.5 Shopify Checkout

**Purpose:** Complete customer purchases through Shopify checkout.

Requirements:

- Customer payment.
- Address collection.
- Applicable shipping/delivery information.
- Order creation.
- Payment status.
- Order confirmation.

Checkout functionality must respect the selected Shopify plan and available extension capabilities.

Do not assume arbitrary custom backend code can execute directly inside checkout.

## 3.6 Shopify Webhooks

**Purpose:** Notify the custom backend about commerce events.

Potential subscriptions:

- Orders/create.
- Orders/paid.
- Orders/updated.
- Orders/cancelled.
- Refunds/create.
- Products/update.
- Inventory-level updates.
- Fulfilment events.

The final webhook subscription list must be based on actual application requirements and supported Shopify topics.

### Webhook processing

Every webhook handler must:

1. Verify the Shopify webhook signature.
2. Validate the payload.
3. Identify the event.
4. Prevent duplicate processing.
5. Persist the event.
6. Process business logic asynchronously where appropriate.
7. Retry temporary failures safely.
8. Record the processing result.

Use idempotency to prevent duplicate order allocation and financial entries.

---

# 4. MARKETPLACE APPLICATION

**Purpose:** Provide vendor-management functionality.

The marketplace application is a critical operational dependency.

## 4.1 Candidate applications

Evaluate:

- Webkul MultiVendor Marketplace.
- Other Shopify-compatible marketplace solutions.
- Custom vendor portal where existing applications are insufficient.

No application has been finally approved.

## 4.2 Required capabilities

The selected solution must support or provide integration paths for:

- Vendor registration.
- Vendor approval.
- Vendor profiles.
- Multiple vendor locations.
- Vendor product submissions.
- Central product assignments.
- Vendor-specific inventory.
- Vendor order management.
- Order-line assignment.
- Commission records.
- Vendor statements.
- Delayed vendor settlements.
- Secure vendor permissions.
- APIs.
- Webhooks.

## 4.3 Critical proof of concept

Before purchasing or committing to an application, demonstrate:

1. One central product assigned to multiple vendors.
2. Vendor-specific inventory for the same product.
3. Vendor-submitted product approval.
4. Vendor-specific order access.
5. Assignment of individual order lines.
6. Multiple vendor fulfilment.
7. Vendor rejection and reassignment.
8. Commission calculation.
9. Flaberry collecting customer payment.
10. Vendor settlement after fulfilment.

## 4.4 Integration principle

Do not duplicate marketplace application capabilities unnecessarily.

Use the marketplace application for vendor-management functions it handles reliably.

Use custom backend services for business logic that requires additional control.

---

# 5. CUSTOM BACKEND INTEGRATIONS

The custom backend will orchestrate operations that cannot be handled reliably by the storefront or marketplace application alone.

## 5.1 Routing engine

Purpose:

Automatically assign orders to eligible vendors.

Required inputs:

- Shopify order.
- Product and variant.
- Quantity.
- Customer destination.
- Vendor locations.
- Inventory.
- Preparation time.
- Delivery capacity.
- Distance/ETA.

Required outputs:

- Eligible vendor candidates.
- Candidate rejection reasons.
- Ranked vendor list.
- Selected vendor.
- Reservation.
- Assignment history.

## 5.2 Inventory reservation

Purpose:

Prevent simultaneous orders from overselling vendor stock.

Requirements:

- Available stock.
- Reserved stock.
- Reservation expiry.
- Atomic/concurrency-safe reservation.
- Reservation release.
- Inventory reconciliation.

Inventory availability must be verified before assignment.

## 5.3 Delivery serviceability

Purpose:

Determine whether a product can be delivered to the requested destination.

Requirements:

- Pincode validation.
- Vendor service zones.
- Product-specific restrictions.
- Delivery mode eligibility.
- Delivery date eligibility.
- Delivery capacity.

## 5.4 Financial ledger

Purpose:

Maintain auditable vendor earnings and settlement records.

Requirements:

- Order-level financial entries.
- Vendor-level payable.
- Commission.
- Refund adjustments.
- Approved deductions.
- Settlement eligibility.
- Settlement history.

Shopify order records and the financial ledger must remain reconcilable.

---

# 6. MAPPING AND DISTANCE SERVICES

**Purpose:** Calculate vendor-to-customer distance and estimated travel time.

Potential providers:

- Google Maps Platform.
- Mapbox.
- Other suitable mapping services.

No provider has been selected.

## Required capabilities

- Address geocoding.
- Pincode/location resolution.
- Latitude and longitude.
- Road distance.
- Route duration.
- ETA.
- Route availability.

## Routing usage

The custom routing engine should use mapping information to rank eligible vendors.

Distance must not override hard fulfilment constraints.

A nearby vendor with unavailable stock or insufficient delivery capacity must be rejected.

## Validation requirements

Compare providers on:

- India coverage.
- Pincode accuracy.
- Address accuracy.
- Road routing.
- API pricing.
- Request limits.
- Reliability.
- Data retention.
- Commercial suitability.

---

# 7. PINCODE AND LOCATION SERVICES

**Purpose:** Validate Indian delivery destinations.

The selected provider or data source should support:

- Six-digit Indian pincodes.
- City identification.
- State identification.
- Location coordinates where available.
- Pincode validity.
- Address resolution.

Pincode validity alone must not imply Flaberry delivery availability.

Actual serviceability depends on vendor coverage and delivery operations.

## Business rule

A delivery option can be displayed only when the destination, product, vendor and delivery capacity satisfy the required rules.

---

# 8. PAYMENT GATEWAY

**Purpose:** Collect customer payments through Flaberry.

The final gateway is pending selection.

Potential providers for evaluation:

- Razorpay.
- Cashfree Payments.
- Other Shopify-supported Indian payment providers.

The provider must be compatible with the selected Shopify checkout configuration.

## Required payment methods

Subject to provider and Shopify availability:

- UPI.
- Credit cards.
- Debit cards.
- Net banking.
- Wallets.
- Other approved payment methods.

## Payment flow

1. Customer places an order.
2. Shopify checkout processes payment.
3. Payment status is verified.
4. Backend receives trusted order/payment events.
5. Fulfilment is released according to approved business rules.
6. Payment and order records are reconciled.

## Important rules

- Customers pay Flaberry.
- Vendors do not collect checkout payments.
- Vendor payouts happen separately.
- Do not confuse customer payment capture with vendor settlement.
- Payment failures must not trigger successful fulfilment.
- Duplicate events must not create duplicate financial entries.

---

# 9. DELIVERY AND COURIER INTEGRATIONS

**Purpose:** Support local vendor delivery and parcel-based fulfilment.

Potential providers to evaluate:

- Shiprocket.
- Other suitable courier aggregators.
- Local delivery partners.
- Direct vendor fulfilment.
- Flaberry-managed delivery operations.

No provider has been selected.

## Required capabilities

- Serviceability.
- Delivery rates.
- Shipment creation.
- Tracking.
- Delivery status.
- Cancellation.
- Return handling where applicable.
- Delivery confirmation.

## Important business distinction

Not every product should automatically use a courier aggregator.

Fresh flowers, cakes and time-sensitive gifts may require local fulfilment or specialised delivery handling.

The delivery engine must support product-specific fulfilment modes.

## Delivery modes

The architecture should support:

- Standard.
- Same-day.
- Scheduled.
- Midnight.
- Fixed-time.
- Express.
- Local hand delivery.
- Courier delivery.

The final launch matrix is pending operational approval.

---

# 10. WHATSAPP AND EMAIL INTEGRATIONS

**Purpose:** Customer and vendor communication.

Potential WhatsApp providers:

- Meta WhatsApp Business Platform.
- Interakt.
- Other approved WhatsApp Business Solution Providers.

Potential email providers:

- Shopify transactional notifications.
- Other suitable transactional email services.

No external messaging provider has been selected.

## Customer notifications

- Order confirmation.
- Payment confirmation.
- Order accepted.
- Preparation started.
- Dispatched.
- Out for delivery.
- Delivered.
- Cancellation.
- Refund update.

## Vendor notifications

- New order assignment.
- Order acceptance reminder.
- Preparation deadline.
- Delivery deadline.
- Order reassignment.
- Settlement statement.

## Messaging rules

- Use approved templates where required.
- Respect customer consent.
- Prevent duplicate messages.
- Log delivery results.
- Retry temporary failures.
- Avoid exposing unnecessary customer information.

---

# 11. ANALYTICS AND MONITORING

**Purpose:** Monitor storefront performance and marketplace operations.

Potential tools:

- Shopify Analytics.
- Google Analytics 4.
- Google Search Console.
- Suitable backend monitoring and error logging services.

Requirements:

- Storefront performance.
- Conversion tracking.
- Product performance.
- Order status.
- Vendor performance.
- Routing failures.
- Webhook failures.
- Inventory discrepancies.
- Settlement reconciliation.
- Integration health.

Do not send sensitive customer or payment information to analytics systems.

---

# 12. INTEGRATION SECURITY

All external integrations must follow security best practices.

## Credentials

- Store credentials on the backend or secure environment configuration.
- Never hardcode secrets in theme files.
- Never commit `.env` files.
- Never expose private access tokens.
- Rotate credentials when required.

## API security

- Use minimum required permissions.
- Validate incoming requests.
- Verify webhook signatures.
- Apply rate limiting where appropriate.
- Log critical operations.
- Protect administrative endpoints.

## Customer information

- Share only required fulfilment information with vendors.
- Avoid unnecessary personal data storage.
- Restrict access by role.
- Follow applicable privacy and data protection requirements.

---

# 13. INTEGRATION PRIORITY MATRIX

| Integration | Priority | Status |
|---|---|---|
| Shopify CLI | Critical | Installed |
| Shopify Horizon | Critical | Selected, not integrated |
| Shopify AI Toolkit | High | Installed |
| Shopify Admin GraphQL API | Critical | Planned |
| Shopify Storefront/Cart APIs | High | Planned |
| Shopify Webhooks | Critical | Planned |
| Marketplace application | Critical | Evaluation pending |
| Custom routing backend | Critical | Planned |
| Operational database | Critical | Selection pending |
| Mapping provider | High | Selection pending |
| Pincode service | High | Selection pending |
| Payment gateway | Critical | Selection pending |
| Delivery integration | High | Selection pending |
| WhatsApp provider | Medium | Selection pending |
| Email provider | Medium | Selection pending |
| Analytics | Medium | Planned |
| Monitoring | High | Planned |

---

# 14. INTEGRATION IMPLEMENTATION SEQUENCE

Recommended implementation order:

1. Configure Shopify development environment.
2. Integrate Horizon theme.
3. Validate Shopify theme functionality.
4. Establish Shopify API access.
5. Evaluate marketplace applications.
6. Complete marketplace proof of concept.
7. Establish custom backend.
8. Connect Shopify webhooks.
9. Integrate vendor and inventory data.
10. Integrate mapping and pincode services.
11. Implement routing.
12. Configure payment gateway.
13. Implement vendor financial ledger.
14. Integrate delivery providers.
15. Configure WhatsApp and email.
16. Implement monitoring.
17. Test end-to-end workflows.

Dependencies may require adjustments after the proof of concept.

---

# 15. CONFIRMED VS PENDING INTEGRATIONS

## Confirmed

- Shopify as commerce platform.
- Shopify Horizon as theme foundation.
- Shopify AI Toolkit as development plugin.
- Shopify CLI.
- GitHub.
- Google Antigravity.

## Pending selection or implementation

- Marketplace application.
- Backend framework.
- Database.
- Mapping provider.
- Pincode provider.
- Payment gateway.
- Courier aggregator.
- Local delivery providers.
- WhatsApp provider.
- Email provider.
- Analytics and monitoring tools.

Do not invent selected providers or assume that a candidate integration has been approved.

---

# 16. OFFICIAL REFERENCE LINKS

## Shopify

- Shopify Developer Documentation: https://shopify.dev/
- Shopify Admin GraphQL API: https://shopify.dev/docs/api/admin-graphql
- Shopify Storefront API: https://shopify.dev/docs/api/storefront
- Shopify Webhooks: https://shopify.dev/docs/apps/build/webhooks
- Shopify Theme Architecture: https://shopify.dev/docs/storefronts/themes/architecture
- Shopify Theme Sections: https://shopify.dev/docs/storefronts/themes/architecture/sections

## Shopify Horizon

- Official Repository: https://github.com/Shopify/horizon

## Shopify AI Toolkit

- Official Repository: https://github.com/Shopify/shopify-ai-toolkit
- Official Documentation: https://shopify.dev/docs/apps/build/ai-toolkit

## Other candidate providers

- Webkul: https://webkul.com/
- Razorpay: https://razorpay.com/
- Cashfree: https://www.cashfree.com/
- Google Maps Platform: https://developers.google.com/maps
- Mapbox: https://www.mapbox.com/
- Shiprocket: https://www.shiprocket.in/
- Meta WhatsApp Business Platform: https://developers.facebook.com/docs/whatsapp/

---

# FINAL INTEGRATION PRINCIPLE

Shopify manages commerce.

Horizon provides the storefront foundation.

Shopify AI Toolkit assists development.

The marketplace application manages vendor operations.

The custom backend manages business-critical orchestration.

External services provide payment, location, delivery and communication capabilities.

Every integration must be selected based on actual Flaberry requirements, verified capabilities, cost, reliability and security.

No integration should be purchased or treated as production-ready merely because it appears in this document.