# FLABERRY — TECH STACK

**Project:** Flaberry Shopify Storefront + Multi-Vendor Marketplace  
**Document Type:** Technology Stack and Development Environment  
**Market:** India  
**Platform:** Shopify  
**Theme Foundation:** Shopify Horizon  
**Development Environment:** Google Antigravity + VS Code  
**Version:** 1.0

---

# 1. TECHNOLOGY STRATEGY

Flaberry will be developed using Shopify's native theme architecture, supported by a custom backend for marketplace operations and business-critical automation.

The technology stack must prioritise:

- Shopify compatibility.
- Maintainability.
- Scalability.
- Security.
- Performance.
- Reliable order processing.
- Vendor management.
- Inventory accuracy.
- Automatic order routing.
- Integration flexibility.

Avoid unnecessary frameworks, libraries and infrastructure.

Use official Shopify capabilities wherever practical.

Custom development should be introduced when native Shopify functionality or the selected marketplace application cannot adequately support the requirements.

---

# 2. DEVELOPMENT ENVIRONMENT

## 2.1 Operating System

**Platform:** Windows

The project owner is developing locally using Windows and VS Code.

Development commands should be compatible with Windows PowerShell unless otherwise specified.

## 2.2 Code Editor

**Editor:** Visual Studio Code

Purpose:

- Source code editing.
- Project management.
- Integrated terminal.
- Git integration.
- Antigravity agent workflow.
- Debugging.
- Extension management.

## 2.3 AI Development Environment

**Tool:** Google Antigravity

**CLI version observed:** 1.5.9

Purpose:

- Analyse the existing HTML prototype.
- Read project documentation.
- Develop Shopify Liquid components.
- Write CSS and JavaScript.
- Work with Shopify CLI.
- Assist with testing.
- Debug implementation issues.

Antigravity must follow `GEMINI.md` and all relevant project documentation.

## 2.4 Shopify AI Toolkit

**Repository:** https://github.com/Shopify/shopify-ai-toolkit

**Status:** Successfully installed.

Installation confirmed:

- Shopify plugin.
- Shopify UCP skill.

Purpose:

- Shopify documentation search.
- API schema access.
- Liquid validation.
- GraphQL validation.
- Shopify development assistance.

Refer to `INTEGRATIONS.md` for installation details and telemetry considerations.

## 2.5 Node.js

**Installed version observed:** v24.21.0

Node.js will support:

- Shopify CLI.
- JavaScript tooling.
- Backend development if selected.
- Build processes.
- Development dependencies.

Verify compatibility before selecting packages or frameworks.

## 2.6 npm

**Installed version observed:** 12.2.0

Use npm for dependency management unless the approved project architecture specifies another package manager.

Avoid introducing multiple package managers unnecessarily.

## 2.7 Git

**Installed version observed:** 2.41.0.windows.3

Purpose:

- Source control.
- Version history.
- Feature development.
- Rollbacks.
- Collaboration.
- GitHub synchronisation.

## 2.8 GitHub

**Repository:**

https://github.com/akkysaini/flaberry-shopify

Purpose:

- Remote source control.
- Backup.
- Change tracking.
- Project history.
- Development branch management.

The existing repository is the main project repository.

Do not create an unnecessary second repository for the Shopify theme.

## 2.9 Shopify CLI

**Installed version observed:** 5.0.1

Purpose:

- Shopify theme initialisation.
- Local theme development.
- Theme preview.
- Theme validation.
- Development store integration.
- Theme deployment.

Use the official Shopify CLI.

Official documentation:

https://shopify.dev/docs/api/shopify-cli

---

# 3. STOREFRONT TECHNOLOGY

## 3.1 Shopify Horizon

**Official repository:**

https://github.com/Shopify/horizon

**Status:** Selected as the base theme. Integration pending.

Horizon replaces Dawn as the planned starting theme.

It will provide the initial Shopify theme architecture.

The Flaberry design will be implemented by adapting Horizon rather than changing the original design to match Horizon's demo appearance.

## 3.2 Shopify Liquid

**Technology:** Shopify Liquid

Purpose:

- Render Shopify products.
- Render collections.
- Build reusable sections.
- Build snippets.
- Render theme settings.
- Display product information.
- Generate dynamic storefront content.

Use Liquid for Shopify-native storefront rendering.

Do not recreate Shopify's native capabilities unnecessarily with custom JavaScript.

## 3.3 HTML5

Purpose:

- Semantic page structure.
- Accessible markup.
- Storefront components.
- Forms.
- Content organisation.

Preserve semantic and maintainable HTML.

## 3.4 CSS3

Purpose:

- Visual implementation.
- Responsive layouts.
- Product grids.
- Navigation.
- Animations.
- Interactive states.
- Mobile layouts.

Extract and reuse design tokens from the original prototype.

Avoid unnecessary CSS frameworks.

The final styling must preserve Flaberry's approved design reference.

## 3.5 JavaScript

**Technology:** Vanilla JavaScript as the default.

Purpose:

- Navigation interactions.
- Mega menus.
- Search interactions.
- Product galleries.
- Product customisation.
- Cart drawer.
- Delivery selectors.
- Filters.
- Sliders.
- Modals.
- Dynamic storefront behaviour.

Use additional libraries only when a clear requirement justifies them.

Do not introduce a frontend framework merely for convenience.

---

# 4. SHOPIFY PLATFORM TECHNOLOGIES

The storefront should use Shopify-native capabilities wherever practical.

## APIs

### Shopify Admin GraphQL API

Purpose:

- Product management.
- Inventory.
- Orders.
- Fulfilment.
- Administrative operations.

### Shopify Storefront API

Purpose:

- Customer-facing commerce data.
- Product discovery.
- Collections.
- Cart functionality where appropriate.

### Shopify Cart API

Purpose:

- Cart creation.
- Adding products.
- Updating quantities.
- Removing products.
- Cart attributes.
- Line item properties.

### Shopify Webhooks

Purpose:

- Order events.
- Payment events.
- Inventory updates.
- Product updates.
- Fulfilment events.

### Shopify Checkout

Purpose:

- Customer checkout.
- Payment processing.
- Address collection.
- Order creation.

All API implementations must use supported Shopify interfaces and appropriate permissions.

---

# 5. BACKEND TECHNOLOGY

**Status: Not yet selected.**

Flaberry requires a custom backend for operations that extend beyond the standard storefront and marketplace application.

Expected responsibilities:

- Automatic vendor allocation.
- Inventory reservation.
- Delivery eligibility.
- Vendor capacity.
- Distance calculations.
- Order orchestration.
- Vendor settlement ledger.
- Webhook processing.
- Notification orchestration.

## Candidate backend technologies

Evaluate:

- Node.js.
- TypeScript.
- NestJS.
- Express.js.
- Other suitable backend frameworks.

### Initial recommendation

Node.js with TypeScript is a strong candidate because it aligns with the existing JavaScript development environment and can support Shopify integrations.

NestJS and Express.js should be evaluated against the actual architecture requirements.

No framework is finally approved.

Do not initialise a backend project until the architecture has been reviewed and approved.

---

# 6. DATABASE TECHNOLOGY

**Status: Not yet selected.**

The backend will require persistent storage for:

- Vendor profiles.
- Vendor locations.
- Vendor inventory.
- Inventory reservations.
- Delivery zones.
- Routing decisions.
- Order allocation records.
- Delivery capacity.
- Financial ledger entries.
- Settlement history.
- Integration logs.

## Candidate databases

Evaluate:

- PostgreSQL.
- Other relational database solutions where justified.

### Initial recommendation

PostgreSQL is a strong candidate because Flaberry requires relational business records, transactional operations and consistent inventory management.

The final database and hosting architecture must be approved before implementation.

Shopify remains the primary commerce system.

Do not unnecessarily duplicate the complete Shopify product and customer databases.

---

# 7. MARKETPLACE TECHNOLOGY

**Status: Application selection pending.**

Candidate:

- Webkul MultiVendor Marketplace.
- Other suitable Shopify marketplace applications.

The selected solution must support the required vendor workflows and provide sufficient integration capabilities.

The custom backend should integrate with the selected marketplace application through supported APIs and webhooks.

Do not build a duplicate vendor management system unless the selected application cannot satisfy a critical requirement.

---

# 8. ROUTING AND LOCATION TECHNOLOGY

## Mapping provider

**Status: Not selected.**

Candidates:

- Google Maps Platform.
- Mapbox.
- Other suitable mapping providers.

Required capabilities:

- Geocoding.
- Vendor-to-customer distance.
- Route duration.
- ETA.
- Location coordinates.

## Routing engine

The custom routing engine will be implemented within the approved backend architecture.

It must consider:

- Vendor eligibility.
- Inventory.
- Product preparation time.
- Delivery capacity.
- Distance.
- ETA.
- Business priority rules.

Do not make routing decisions using distance alone.

---

# 9. PAYMENT AND DELIVERY TECHNOLOGY

## Payment

**Status: Provider selection pending.**

Candidates:

- Razorpay.
- Cashfree Payments.
- Other Shopify-compatible Indian payment providers.

Customer payments must be collected by Flaberry through the approved Shopify payment setup.

Vendor settlements will be managed separately.

## Delivery

**Status: Provider selection pending.**

Candidates:

- Shiprocket.
- Local delivery providers.
- Direct vendor fulfilment.
- Flaberry-managed delivery.

Support product-specific delivery requirements, particularly for flowers, cakes and time-sensitive gifts.

---

# 10. COMMUNICATION TECHNOLOGY

**Status: Provider selection pending.**

## WhatsApp

Candidates:

- Meta WhatsApp Business Platform.
- Interakt.
- Other approved providers.

## Email

Candidates:

- Shopify transactional email.
- Suitable transactional email services.

Required notifications:

- Order confirmation.
- Payment confirmation.
- Vendor assignment.
- Order preparation.
- Dispatch.
- Delivery.
- Cancellation.
- Refund.
- Vendor settlement.

---

# 11. TESTING AND QUALITY ASSURANCE

The following tools and approaches should be used where applicable.

## Shopify Theme Check

Purpose:

- Liquid validation.
- Theme code quality.
- Shopify theme best practices.

## Shopify AI Toolkit validation

Purpose:

- Liquid validation.
- GraphQL validation.
- Supported Shopify schema validation.

## Browser testing

Use browser-based testing to verify:

- Desktop layouts.
- Mobile layouts.
- Navigation.
- Product interactions.
- Cart functionality.
- Checkout transitions.

## Functional testing

Verify:

- Product availability.
- Inventory.
- Vendor allocation.
- Order processing.
- Delivery slots.
- Payments.
- Settlements.

## Regression testing

Every major change must be checked against previously approved functionality.

---

# 12. DEPLOYMENT AND INFRASTRUCTURE

**Status: Hosting architecture pending.**

The Shopify storefront will be deployed through Shopify theme management and Shopify CLI.

The custom backend will require a separately approved hosting environment.

Hosting evaluation must consider:

- Availability.
- Scalability.
- Database connectivity.
- Webhook reliability.
- Background jobs.
- Scheduled tasks.
- Monitoring.
- Security.
- Operational cost.

Do not deploy custom backend services to an unsuitable hosting environment simply because it is convenient during development.

---

# 13. VERSION CONTROL AND PROJECT STRUCTURE

GitHub is the primary project repository.

Expected structure:

```text
Flaberry-Shopify/
│
├── documentation/
├── interaction-reference/
├── reference/
├── screenshots/
├── theme/
│
├── GEMINI.md
├── README.md
└── .gitignore
```

Backend directories will be introduced only after the backend architecture is approved.

Do not place backend code inside the Shopify theme directory.

Do not commit:

- API keys.
- Access tokens.
- Passwords.
- Private credentials.
- Environment files containing secrets.
- Customer personal information.

---

# 14. CONFIRMED TECHNOLOGY STACK

| Technology | Purpose | Status |
|---|---|---|
| Windows | Development OS | Installed |
| VS Code | Code editor | Installed |
| Google Antigravity | AI development | Installed |
| Antigravity CLI | Agent CLI | Installed |
| Shopify AI Toolkit | Shopify AI assistance | Installed |
| Node.js | JavaScript runtime | Installed |
| npm | Package manager | Installed |
| Git | Version control | Installed |
| GitHub | Remote repository | Configured |
| Shopify CLI | Shopify development | Installed |
| Shopify Horizon | Base theme | Selected |
| Shopify Liquid | Theme templating | Required |
| HTML5 | Markup | Required |
| CSS3 | Styling | Required |
| JavaScript | Interactions | Required |

---

# 15. PENDING TECHNOLOGY DECISIONS

The following must be evaluated before implementation:

1. Backend framework.
2. Database.
3. Backend hosting.
4. Marketplace application.
5. Mapping provider.
6. Pincode data provider.
7. Payment gateway.
8. Delivery integration.
9. WhatsApp provider.
10. Email provider.
11. Monitoring and error tracking.
12. Automated testing framework.

Do not silently convert recommendations into approved technology choices.

All significant selections must be recorded in `DECISIONS.md`.

---

# 16. RULES FOR ANTIGRAVITY

1. Read this document before proposing technology changes.
2. Respect the selected Horizon foundation.
3. Do not introduce Dawn as the default theme.
4. Use Shopify Liquid for native storefront rendering.
5. Prefer vanilla JavaScript for straightforward interactions.
6. Avoid unnecessary frontend frameworks.
7. Do not select backend infrastructure without approval.
8. Do not install dependencies without identifying their purpose.
9. Verify Shopify API compatibility.
10. Keep backend and storefront responsibilities separate.
11. Never expose credentials in frontend code.
12. Maintain compatibility with the approved Node.js and Shopify CLI environment.
13. Document significant technology changes.
14. Update this file when an approved stack decision changes.

---

# FINAL TECHNOLOGY PRINCIPLE

Use Shopify-native technology for commerce and storefront functionality.

Use Horizon as the storefront foundation.

Use custom backend services only for business-critical marketplace operations that require additional control.

Choose every additional technology based on actual functional requirements, reliability, security, maintainability and cost.

The goal is not to build the largest technology stack.

The goal is to build a reliable, scalable and maintainable Flaberry marketplace.