# GEMINI.md — Flaberry Shopify Project Instructions

## 1. Project Identity

**Project:** Flaberry Shopify Storefront + Multi-Vendor Marketplace  
**Market:** India only  
**Platform:** Shopify  
**Base Theme:** Shopify Horizon (selected, not yet integrated)  
**Primary Design Reference:** `reference/Flaberry_Design1_Classic.html`

The objective is to build a production-ready Shopify storefront and multi-vendor marketplace that faithfully reproduces the existing Flaberry prototype's design, layout, user experience and intended interactions.

This is an implementation project, not a redesign project.

## 2. Read Before Making Changes

Before starting any development task, inspect the relevant project documentation.

Priority order:

1. `DECISIONS.md` — approved business and technical decisions.
2. `README.md` — project overview, setup and current status.
3. `documentation/PROJECT_BRIEF.md` — project scope and objectives.
4. `documentation/PROTOTYPE_ANALYSIS.md` — master technical analysis of the original prototype.
5. `documentation/DESIGN_REFERENCE.md` — visual design requirements.
6. `documentation/ARCHITECTURE.md` — planned application architecture.
7. `documentation/IMPLEMENTATION_PLAN.md` — development phases and sequence.
8. `documentation/INTEGRATIONS.md` — integration options and their approval status.
9. `documentation/TECH_STACK.md` — selected and proposed technologies.
10. `interaction-reference/` — detailed navigation, interaction and responsive behaviour.

If a document is missing, do not invent its contents. Report the missing file.

## 3. Source of Truth

Use these references according to their purpose:

- **Original HTML prototype:** Primary source for design, layout, content, product presentation, navigation and frontend interaction behaviour.
- **Screenshots:** Visual reference for desktop and mobile appearance.
- **Approved documentation:** Source of truth for project requirements, business rules and technical decisions.
- **Horizon theme:** Selected Shopify theme foundation once integration is explicitly authorised.

Do not treat the prototype's simulated backend behaviour as an approved production architecture.

If the prototype, screenshots and approved documentation appear inconsistent, identify the difference and ask for clarification rather than silently choosing one.

## 4. Design Preservation Rules

The existing Flaberry design must be reproduced faithfully.

- Do not redesign the storefront.
- Do not introduce a different visual identity.
- Do not arbitrarily change colours, typography, spacing, layouts, card styles, imagery or section order.
- Preserve the original desktop and mobile design behaviour.
- Preserve navigation labels, menu hierarchy and relevant content.
- Reproduce the original interactions wherever technically feasible.
- Use the supplied screenshots to compare visual output.
- Do not replace original assets with unrelated stock images or generated alternatives.
- Do not remove sections simply because they seem unnecessary.

If Shopify requires a structural adjustment, make the smallest practical change while preserving the original appearance and experience.

## 5. Prototype Analysis Rules

The prototype is a functional client-side SPA, but it is not a production-ready Shopify application.

Keep these distinctions clear:

- Frontend interactions in the prototype are references for intended user experience.
- `localStorage`, static credentials, hardcoded data and simulated payment actions are demonstrations only.
- Vendor and Admin interfaces are prototype demonstrations, not secure production systems.
- Real authentication, payments, order management, inventory, vendor access and notifications require appropriate production services.
- Never copy prototype-only security or payment logic into production.

The prototype analysis is source-verified through static code and screenshot inspection. It has not been confirmed through live browser testing. Do not describe its behaviour as browser-tested unless actual testing has been performed.

## 6. Approved Business Rules

The following decisions are approved:

### Market
- India only.

### Product Model
- Support both centrally managed Flaberry products and vendor-listed products.

### Order Routing
- Automatic vendor allocation is the primary production workflow.
- Check product availability, vendor inventory and delivery eligibility before considering distance.
- Distance alone must never determine vendor selection.
- Manual allocation is an exception/fallback workflow, not the normal process.
- Do not invent tie-breaker rules.

### Payments and Vendor Settlements
- Customers pay Flaberry.
- Flaberry settles vendor payments separately.
- Commission percentages, settlement schedules and related financial rules remain pending approval.

### Order Fulfilment
- Support orders involving multiple vendors.
- Preserve the customer's overall order experience while handling vendor-level fulfilment appropriately.

Refer to `DECISIONS.md` for the latest approval status. If a decision changes, update the relevant documentation only after approval.

## 7. Pending Decisions — Do Not Assume

Do not independently finalise or invent:

- Vendor commission percentages.
- Vendor settlement frequency or payout conditions.
- Automatic routing tie-breakers.
- Inventory reservation and expiry rules.
- Vendor rejection and reassignment rules.
- Delivery capacity and slot allocation rules.
- Currency selector behaviour.
- Payment gateway selection.
- Marketplace application selection.
- Backend framework and hosting provider.
- Database selection.
- Maps, pincode and distance calculation providers.
- Delivery partner integrations.
- WhatsApp, SMS and email providers.
- Analytics and monitoring services.

A technology mentioned as a candidate in the documentation is not automatically approved.

Clearly distinguish between **Approved**, **Selected**, **Proposed** and **Pending**.

## 8. Shopify Theme Development Rules

Horizon is the selected starting theme, but it must not be integrated until the project owner authorises that phase after the documentation has been committed.

When authorised:

- Inspect the complete Horizon structure before editing.
- Follow the existing theme architecture and coding conventions.
- Use Shopify Liquid, JSON templates, sections, snippets, CSS, JavaScript and theme assets appropriately.
- Prefer reusable sections and snippets over duplicated code.
- Use section schema settings where useful.
- Preserve Shopify's native theme functionality unless a documented requirement needs a change.
- Do not blindly overwrite Horizon files.
- Do not introduce a second nested Git repository into the project.
- Keep the original prototype and documentation separate from the production theme.

Do not modify the `theme/` folder before explicit approval.

## 9. Shopify Platform and API Rules

Prefer official Shopify capabilities wherever they satisfy the requirement.

Use appropriate Shopify services and APIs for products, collections, customers, cart, checkout, orders, inventory and webhooks.

Security requirements:

- Never expose Shopify Admin API access tokens in frontend code.
- Never hardcode private API credentials in Liquid, JavaScript, HTML or public repositories.
- Keep privileged operations and secrets on a secure backend.
- Validate incoming webhook requests.
- Apply appropriate authentication and authorisation to vendor and admin operations.
- Do not assume a frontend-only implementation is sufficient for marketplace security.

Do not select or implement a third-party integration without checking its actual capabilities, compatibility, costs and approval status.

## 10. India-First Storefront Requirements

Keep the implementation aligned with the India-only business scope.

Consider Indian pincodes, delivery locations, address formats, phone numbers, payment methods and INR pricing where relevant.

However, do not assume that every international or multi-currency feature in the prototype must be removed. Currency selector behaviour is a pending business decision and must be resolved before implementation.

Do not invent delivery coverage, serviceability data, vendor locations or delivery guarantees.

## 11. Development Workflow

Work in small, controlled steps.

For every task:

1. Understand the requirement.
2. Inspect the relevant documentation and existing code.
3. Identify the exact files that need changes.
4. Explain the intended approach when the change is substantial.
5. Make only the changes required for the current task.
6. Preserve existing working functionality.
7. Verify the changes using appropriate tools.
8. Report the exact files created, modified or removed.
9. Clearly mention anything that remains untested or unresolved.

Do not make unrelated improvements during a focused task.

Do not create duplicate files or alternative implementations without a clear reason.

## 12. Testing and Verification

Use appropriate checks for the type of work being performed.

Examples include:

- Shopify theme checks.
- JavaScript and CSS validation.
- Liquid syntax checks.
- Responsive viewport inspection.
- Navigation and interaction testing.
- Cart and checkout flow testing.
- Product and collection rendering checks.
- Accessibility checks.
- API and webhook validation.
- Security and permission checks.

Never claim that something has been tested unless the test was actually performed.

Report separately:
- Passed checks.
- Failed checks.
- Not tested.
- Blocked or pending verification.

## 13. Git and File Safety

- Inspect Git status before making changes.
- Review diffs before committing.
- Do not overwrite user work without permission.
- Do not delete files unless explicitly authorised or clearly required and approved.
- Never force-push.
- Never commit credentials, API keys, tokens, passwords or private environment files.
- Keep commits focused and meaningful.
- Do not commit unfinished or unrelated work.
- Preserve the existing Git repository and project history.

## 14. Documentation Maintenance

When an approved project decision changes, update the relevant documentation.

Keep these files consistent:

- `README.md`
- `DECISIONS.md`
- `documentation/ARCHITECTURE.md`
- `documentation/IMPLEMENTATION_PLAN.md`
- `documentation/INTEGRATIONS.md`
- `documentation/TECH_STACK.md`

Do not mark a proposed integration, technology or business rule as approved without confirmation.

Document important implementation changes so future development work can follow them.

## 15. Communication Style

The project owner prefers clear, practical, step-by-step guidance.

- Communicate in Hinglish by default unless English is requested.
- Explain technical decisions in simple language.
- Avoid unnecessary technical jargon.
- Do not overwhelm the project owner with too many unrelated tasks.
- Give precise file paths and commands.
- When a decision is needed, ask a direct question.
- Do not assume the project owner has approved an action just because it was discussed.

## 16. Current Project Boundary

The immediate priority is to complete, review and commit the project documentation.

**Do not begin Horizon integration or modify the Shopify theme until the project owner explicitly authorises it after the documentation commit.**

Until then, focus only on documentation review, consistency, project setup instructions and preparation for the next approved phase.

---

**Core principle:** Preserve the Flaberry experience, follow approved decisions, build securely for production, and never invent missing requirements.