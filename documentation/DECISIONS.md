# FLABERRY — PROJECT DECISIONS

**Project:** Flaberry Shopify Storefront + Multi-Vendor Marketplace  
**Document Type:** Business and Technical Decision Register  
**Version:** 1.0  
**Status:** Active  
**Market:** India

---

# 1. PURPOSE

This document records the confirmed business requirements, approved technical decisions, pending decisions and implementation constraints for Flaberry.

It serves as the central decision reference for:

- Project owner.
- AI development agents.
- Developers.
- Technical architects.
- Marketplace application providers.
- Integration partners.

Every major development decision must align with this document.

Antigravity must not silently change an approved decision or treat an unconfirmed recommendation as an approved requirement.

---

# 2. DECISION STATUS DEFINITIONS

Use the following statuses consistently.

| Status | Meaning |
|---|---|
| APPROVED | Confirmed by the project owner |
| SELECTED | Chosen as the preferred technology or approach; implementation may be pending |
| PENDING | Requires further investigation or owner approval |
| UNDER REVIEW | Currently being evaluated |
| REJECTED | Explicitly rejected |
| IMPLEMENTED | Successfully implemented and verified |

A selected technology is not necessarily production-ready.

An implemented decision must have evidence of successful testing.

---

# 3. CONFIRMED BUSINESS DECISIONS

## D-001 — Target Market

**Status:** APPROVED

Flaberry will initially operate in India.

Implementation implications:

- Indian pincodes.
- Indian delivery locations.
- INR currency.
- India-supported payment methods.
- India-specific delivery operations.
- Appropriate Indian business and tax requirements.

Do not introduce international storefront functionality unless separately approved.

## D-002 — Commerce Platform

**Status:** APPROVED

Shopify will be the primary commerce platform.

Shopify will handle the core commerce capabilities:

- Products.
- Collections.
- Variants.
- Customer shopping cart.
- Checkout.
- Customer orders.
- Payment integration.
- Commerce administration.

Custom backend services will extend Shopify functionality where necessary.

## D-003 — Vendor Model

**Status:** APPROVED

Flaberry will support a hybrid product model.

Two product categories must be supported:

1. Central products managed by Flaberry.
2. Vendor-listed products managed by approved vendors.

The architecture must support both product ownership models.

## D-004 — Automatic Order Routing

**Status:** APPROVED

Order allocation must happen automatically according to vendor eligibility, availability and distance.

The system must consider:

- Product availability.
- Vendor inventory.
- Vendor location.
- Customer delivery destination.
- Distance.
- Estimated delivery time.
- Preparation time.
- Delivery capacity.
- Other approved fulfilment constraints.

Distance alone must never determine vendor selection.

The routing engine must reject vendors that cannot fulfil the order.

## D-005 — Customer Payment Collection

**Status:** APPROVED

Customers pay Flaberry.

Vendors must not independently collect customer checkout payments.

Shopify and the approved payment gateway will handle customer payment processing.

## D-006 — Vendor Payment Model

**Status:** APPROVED

Flaberry will manage vendor payments separately.

The customer payment and vendor settlement processes must remain distinct.

Vendor earnings will be calculated and settled according to the approved financial and operational rules.

The system must support:

- Vendor earnings.
- Commission.
- Settlement eligibility.
- Refund adjustments.
- Settlement records.
- Payout history.

Exact settlement timing and financial policies require further approval.

## D-007 — Multi-Vendor Fulfilment

**Status:** APPROVED

The platform must support fulfilment involving multiple vendors.

The architecture must account for:

- Vendor-specific order assignments.
- Product-level fulfilment.
- Multiple fulfilment locations.
- Partial fulfilment.
- Order tracking.
- Vendor rejection.
- Reassignment.

The exact customer-facing split-order experience remains subject to implementation design.

## D-008 — Original Design Preservation

**Status:** APPROVED

The supplied interactive HTML prototype is the primary storefront design reference.

The project is not a website redesign.

The implementation must preserve:

- Visual identity.
- Layout.
- Typography.
- Colours.
- Navigation.
- Product presentation.
- Responsive behaviour.
- Existing interactions.
- Customer experience.

Any intentional design deviation requires project owner approval.

## D-009 — Functional Prototype as Reference

**Status:** APPROVED

The original HTML prototype includes functional interactions, navigation and screen changes.

It must be analysed beyond its visual appearance.

Antigravity must inspect the actual HTML, CSS and JavaScript rather than relying exclusively on screenshots.

Prototype functionality must be mapped to its corresponding production implementation.

Prototype-only demonstration data must not be mistaken for live Shopify functionality.

---

# 4. APPROVED TECHNICAL DECISIONS

## D-010 — Theme Foundation

**Status:** SELECTED

Shopify Horizon will be the starting theme.

Official repository:

https://github.com/Shopify/horizon

Dawn is not the selected starting theme.

Implementation requirements:

- Use the official Horizon repository.
- Integrate Horizon into the existing `theme/` directory.
- Preserve the existing Flaberry project structure.
- Adapt Horizon to the Flaberry design.
- Preserve the original reference files.
- Review upstream compatibility.
- Record the selected Horizon commit.

Do not redesign Flaberry to match Horizon's demo storefront.

## D-011 — Development Environment

**Status:** APPROVED

The project owner will use:

- Windows.
- Visual Studio Code.
- Google Antigravity.
- Antigravity CLI.
- Shopify CLI.
- Node.js.
- npm.
- Git.
- GitHub.

Current observed versions:

| Tool | Version |
|---|---|
| Node.js | v24.21.0 |
| npm | 12.2.0 |
| Git | 2.41.0.windows.3 |
| Shopify CLI | 5.0.1 |
| Antigravity CLI | 1.5.9 |

These are observed setup versions, not permanent version-lock decisions.

## D-012 — Shopify AI Toolkit

**Status:** APPROVED — INSTALLED

Official repository:

https://github.com/Shopify/shopify-ai-toolkit

The toolkit will assist Antigravity with Shopify development.

It must be used where relevant for:

- Shopify documentation.
- Liquid validation.
- GraphQL validation.
- Shopify API schemas.
- Shopify development guidance.

It is a development tool, not a production application dependency.

## D-013 — Native Shopify Theme Architecture

**Status:** APPROVED

The initial storefront will use Shopify's native theme architecture.

Use:

- Shopify Liquid.
- Sections.
- Snippets.
- Templates.
- Theme blocks.
- Theme settings.
- Assets.

Do not introduce a headless storefront architecture without explicit approval.

## D-014 — Frontend Technologies

**Status:** APPROVED

The default storefront technology approach is:

- HTML5.
- CSS3.
- Vanilla JavaScript.
- Shopify Liquid.

Additional frontend frameworks or libraries must have a documented justification and require approval.

## D-015 — GitHub Repository

**Status:** APPROVED

Existing repository:

https://github.com/akkysaini/flaberry-shopify

The existing GitHub repository will remain the main project repository.

The Shopify theme must not become an unnecessary nested Git repository.

Documentation, reference materials, theme code and approved backend code will be maintained within the project structure.

---

# 5. PENDING TECHNICAL DECISIONS

These decisions must be researched and approved before their corresponding implementation phases.

## D-016 — Marketplace Application

**Status:** PENDING

Candidate:

- Webkul MultiVendor Marketplace.
- Other compatible Shopify marketplace applications.

Selection criteria:

- Hybrid central and vendor product model.
- Multiple vendors.
- Vendor-specific inventory.
- Vendor order management.
- Order-line allocation.
- API availability.
- Webhooks.
- Vendor permissions.
- Commission.
- Delayed settlements.
- Split fulfilment.

A working proof of concept is required before final selection.

## D-017 — Backend Framework

**Status:** PENDING

Candidates:

- Node.js with TypeScript.
- NestJS.
- Express.js.
- Other suitable frameworks.

Selection must consider:

- Shopify integration.
- Webhook processing.
- Order routing.
- Background jobs.
- Concurrency.
- Maintainability.
- Security.
- Hosting requirements.

## D-018 — Database

**Status:** PENDING

PostgreSQL is the initial recommended candidate.

Final selection must consider:

- Transaction safety.
- Inventory reservation.
- Relational data.
- Financial records.
- Concurrent order processing.
- Backup and recovery.
- Hosting cost.

## D-019 — Backend Hosting

**Status:** PENDING

Evaluate hosting options after the backend framework and architecture have been selected.

The solution must support:

- Reliable webhooks.
- Background processing.
- Database connections.
- Scheduled tasks.
- Monitoring.
- Scaling.

## D-020 — Mapping Provider

**Status:** PENDING

Candidates:

- Google Maps Platform.
- Mapbox.
- Other suitable providers.

Selection must consider Indian coverage, road distance, ETA accuracy, pricing and API reliability.

## D-021 — Pincode Data Provider

**Status:** PENDING

A reliable source is required for:

- Indian pincode validation.
- City identification.
- State identification.
- Location mapping.

Pincode validity must not automatically imply delivery serviceability.

## D-022 — Payment Gateway

**Status:** PENDING

Candidates:

- Razorpay.
- Cashfree Payments.
- Other Shopify-supported providers.

Final selection must verify compatibility with the Shopify checkout configuration and Indian payment requirements.

## D-023 — Delivery Provider

**Status:** PENDING

Candidates:

- Shiprocket.
- Local delivery partners.
- Direct vendor fulfilment.
- Flaberry-managed delivery.

The selected approach must support different fulfilment requirements for flowers, cakes and gifts.

## D-024 — WhatsApp Provider

**Status:** PENDING

Candidates:

- Meta WhatsApp Business Platform.
- Interakt.
- Other approved providers.

The provider must support the required transactional notifications and applicable consent requirements.

## D-025 — Email Provider

**Status:** PENDING

Evaluate Shopify notifications and suitable transactional email services.

## D-026 — Analytics and Monitoring

**Status:** PENDING

Select suitable tools for:

- Storefront analytics.
- Conversion tracking.
- Backend errors.
- Webhook monitoring.
- Routing failures.
- Operational reporting.

---

# 6. BUSINESS RULES REQUIRING FURTHER APPROVAL

The following are important operational policies that must not be invented by the AI.

1. Vendor commission percentages.
2. Vendor settlement frequency.
3. Vendor settlement eligibility period.
4. Refund and cancellation deductions.
5. Vendor order acceptance timeout.
6. Vendor rejection policy.
7. Routing tie-breaker rules.
8. Inventory reservation expiry.
9. Delivery slot capacity rules.
10. Product preparation time rules.
11. Customer compensation policies.
12. No-vendor-available order handling.
13. Partial fulfilment and cancellation policy.
14. Vendor performance thresholds.

The routing engine must be configurable where appropriate.

Hardcoded business policies should be avoided.

---

# 7. AI DEVELOPMENT CONSTRAINTS

Antigravity must follow these rules.

## Approved decisions

- Never replace Horizon with Dawn.
- Never convert the project to headless Shopify without approval.
- Never redesign the supplied Flaberry prototype independently.
- Never change the approved vendor model.
- Never replace automatic routing with manual allocation as the default.
- Never change the central customer payment model.
- Never assume a candidate marketplace app has been approved.

## Pending decisions

- Never treat a recommendation as an approved decision.
- Never silently choose a payment gateway.
- Never select a database or backend framework without approval.
- Never hardcode unapproved commission or settlement rules.
- Never invent delivery policies.
- Never purchase or subscribe to third-party services without authorisation.

## Documentation

Whenever an important decision changes:

1. Identify the existing decision ID.
2. Explain the reason for the proposed change.
3. Present the impact.
4. Obtain project owner approval.
5. Update this document.
6. Update affected technical documentation.
7. Record the date and decision history.

---

# 8. DECISION HISTORY

| Decision ID | Subject | Status |
|---|---|---|
| D-001 | India-only target market | APPROVED |
| D-002 | Shopify commerce platform | APPROVED |
| D-003 | Hybrid vendor model | APPROVED |
| D-004 | Automatic order routing | APPROVED |
| D-005 | Customer pays Flaberry | APPROVED |
| D-006 | Separate vendor settlements | APPROVED |
| D-007 | Multi-vendor fulfilment | APPROVED |
| D-008 | Preserve original design | APPROVED |
| D-009 | Analyse functional prototype | APPROVED |
| D-010 | Shopify Horizon | SELECTED |
| D-011 | Development environment | APPROVED |
| D-012 | Shopify AI Toolkit | APPROVED |
| D-013 | Native Shopify theme architecture | APPROVED |
| D-014 | HTML, CSS, Liquid and JavaScript | APPROVED |
| D-015 | Existing GitHub repository | APPROVED |
| D-016–D-026 | Additional technical integrations | PENDING |

---

# 9. CHANGE MANAGEMENT

This document must be maintained throughout the project.

A decision must never be changed silently.

Every modification must include:

- Decision ID.
- Previous decision.
- New decision.
- Reason.
- Approval status.
- Date of approval.
- Impacted documents or components.

The project owner has final authority over business requirements and major architectural decisions.

Antigravity can recommend changes but cannot independently approve them.

---

# FINAL PROJECT PRINCIPLE

**Approved decisions are constraints. Pending decisions are open questions. Recommendations are not approvals.**

All implementation must respect this distinction.