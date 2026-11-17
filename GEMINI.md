# GEMINI.md — Flaberry Shopify Project Instructions

## 1. Project Overview

You are working on **Flaberry**, an India-focused Shopify storefront and multi-vendor marketplace.

The project aims to convert the supplied, fully functional HTML prototype into a production-ready Shopify storefront while supporting both centrally managed products and vendor-listed products.

The supplied HTML prototype is the primary source of truth for the storefront's visual design, layout, content presentation, navigation, and interactions.

Your role is to inspect, understand, plan, implement, test, and document the project carefully.

Do not make assumptions when the source files can be inspected.

---

## 2. Mandatory Working Rules

Follow these rules throughout the project:

1. Read the relevant files in the `documentation/` folder before starting any task.
2. Treat `DECISIONS.md` as the decision register. Follow approved decisions.
3. Treat the supplied HTML prototype as the primary design and interaction reference.
4. Inspect the actual HTML, CSS, JavaScript, images, links, tabs, and interactive states before implementation.
5. Do not redesign, simplify, or reinterpret the approved prototype without explicit permission.
6. Do not remove working interactions simply because a Shopify implementation requires a different technical approach.
7. Do not invent missing business rules, API credentials, provider configurations, or integration behaviour.
8. Clearly identify assumptions, technical limitations, dependencies, and unresolved decisions.
9. Prefer small, controlled, testable implementation steps over large rewrites.
10. Do not overwrite or delete existing project files without checking their contents and explaining the impact.
11. Do not install additional packages, apps, or dependencies without explaining why they are needed.
12. Never expose API keys, passwords, access tokens, private credentials, or customer data in source code or Git commits.

If a required decision is missing, document the question and ask for approval rather than silently choosing an approach.

---

## 3. Source-of-Truth Priority

When information conflicts, follow this priority:

1. Explicit instructions and decisions confirmed by the project owner.
2. Approved entries in `documentation/DECISIONS.md`.
3. Existing HTML prototype and its actual working behaviour for design and interactions.
4. Other project documentation.
5. Official Shopify documentation and verified integration documentation.
6. Your own technical recommendations, clearly labelled as recommendations.

Do not treat a proposed technology, app, provider, or architecture as approved unless the decision register says so.

If two sources conflict, report the conflict before making a change.

---

## 4. Business Requirements

The following requirements are approved:

- Target market: India only.
- Platform: Shopify.
- Product model: central Flaberry products and vendor-listed products.
- Customer payments: customers pay Flaberry.
- Vendor payments: Flaberry settles vendors separately.
- Order routing: automatic.
- Routing must consider product availability and delivery distance, along with relevant delivery eligibility and fulfilment constraints.
- Multi-vendor orders must support appropriate order splitting and fulfilment.
- The original prototype's design and intended user experience must be preserved.

### Important business constraints

Do not assume:

- Vendor commission percentages.
- Vendor settlement frequency or payment schedule.
- Vendor onboarding and approval rules.
- Inventory reservation expiry.
- Order cancellation and refund responsibility.
- Delivery fees and shipping rules.
- Vendor serviceability or delivery radius.
- Routing fallback rules.
- Priority rules when multiple vendors can fulfil an order.

These details must be confirmed before implementing the relevant production workflows.

Distance alone must never be treated as sufficient to select a vendor. Availability and delivery eligibility must also be validated.

---

## 5. Design and Prototype Instructions

The supplied HTML prototype is the primary design reference.

Before writing storefront code:

1. Locate the actual prototype file.
2. Read the complete HTML structure.
3. Inspect all CSS and JavaScript.
4. Identify all external assets and image URLs.
5. Identify all pages, tabs, navigation links, buttons, forms, menus, and interactive elements.
6. Test or trace the interaction behaviour wherever possible.
7. Inspect desktop and mobile screenshots.
8. Record the design system, layouts, responsive behaviour, and interaction requirements.
9. Create `documentation/PROTOTYPE_ANALYSIS.md` with the findings.

### Preserve the existing design

Pay attention to:

- Page structure and section order.
- Header and navigation.
- Typography and font weights.
- Colours and backgrounds.
- Spacing and alignment.
- Container widths.
- Borders, shadows, and radii.
- Product cards and image proportions.
- Buttons and hover states.
- Icons and other visual assets.
- Mobile layouts and responsive breakpoints.
- Tabs, links, menus, and other interactive states.

Do not replace actual prototype assets with generated placeholders unless explicitly instructed.

Do not assume that an element is decorative just because it looks like a static element. Inspect its behaviour.

### Asset handling

Preserve the existing asset URLs initially.

If an asset needs to be downloaded, relocated, optimised, or uploaded to Shopify, document the reason and verify that the replacement preserves its appearance.

Do not change image URLs or asset references without checking their impact.

---

## 6. Shopify Theme Development

The selected theme foundation is **Shopify Horizon**.

Horizon has been selected but must not be considered integrated until its source files are actually present in the project's `theme/` directory and verified.

Use Shopify's native theme architecture wherever practical:

- Liquid
- HTML
- CSS
- JavaScript
- Shopify JSON templates
- Shopify sections and blocks
- Shopify snippets
- Shopify configuration and schema

Follow the existing Horizon architecture and conventions after inspecting its source code.

Do not blindly copy code from Dawn or another theme into Horizon.

Do not introduce a separate frontend framework unless the project owner approves the architectural change.

### Theme implementation rules

- Build reusable sections and snippets.
- Keep CSS organised and avoid unnecessary duplication.
- Keep JavaScript modular and scoped.
- Use Shopify-native objects and features where suitable.
- Preserve accessibility and responsive behaviour.
- Avoid unnecessary dependencies.
- Do not hardcode product data that should come from Shopify.
- Do not put secrets or private API credentials in theme code.
- Test changes in the development environment before treating them as complete.

---

## 7. Multi-Vendor Marketplace Architecture

The project requires both central and vendor-listed products.

Do not assume that a Shopify theme alone can implement the marketplace backend.

Evaluate and document the appropriate responsibilities of:

- Shopify.
- Marketplace/vendor management application.
- Custom backend services, if required.
- Database and order-routing services.
- Inventory and availability management.
- Vendor fulfilment.
- Payment and settlement integrations.
- Delivery and serviceability integrations.

The selected marketplace app and backend architecture are not yet approved.

Before implementation, validate the proposed architecture through a proof of concept.

### Automatic order routing

The routing system must be designed to consider:

1. Product availability.
2. Vendor inventory.
3. Delivery serviceability.
4. Vendor fulfilment capability.
5. Distance and delivery feasibility.
6. Multi-item and multi-vendor order requirements.
7. Fallback behaviour when the preferred vendor cannot fulfil the order.

Do not implement a simplistic nearest-vendor-only algorithm.

Document the routing logic, failure cases, and order lifecycle before building the production workflow.

### Payments and vendor settlements

The approved payment model is:

- Customer pays Flaberry.
- Flaberry settles vendors separately.

Do not assume that a marketplace app or payment gateway automatically supports the required settlement model.

Verify the actual capabilities, limitations, fees, and India-specific compatibility before recommending or integrating a provider.

---

## 8. API and Integration Rules

Use official documentation wherever possible.

Potential integrations are not automatically approved.

Before integrating any provider:

1. Identify the exact requirement.
2. Verify the provider's current capabilities.
3. Check Shopify compatibility.
4. Check India-specific availability and restrictions.
5. Check pricing and transaction fees where relevant.
6. Identify API permissions and required credentials.
7. Document limitations and fallback options.
8. Obtain approval for the selected provider.

Never fabricate API endpoints, webhook payloads, app capabilities, or configuration values.

Keep credentials in secure environment variables or the provider's recommended secret-management system.

Never commit `.env` files, API tokens, private keys, or production credentials.

---

## 9. Documentation Rules

Keep project documentation updated as implementation progresses.

Important documents:

- `README.md` — project overview and setup.
- `GEMINI.md` — AI working instructions.
- `documentation/PROJECT_BRIEF.md` — business and project scope.
- `documentation/DESIGN_REFERENCE.md` — visual reference requirements.
- `documentation/ARCHITECTURE.md` — system architecture.
- `documentation/IMPLEMENTATION_PLAN.md` — implementation phases.
- `documentation/INTEGRATIONS.md` — integration research and status.
- `documentation/TECH_STACK.md` — technologies and tools.
- `documentation/DECISIONS.md` — approved and pending decisions.
- `documentation/PROTOTYPE_ANALYSIS.md` — actual prototype findings.

When a decision changes, update `DECISIONS.md` and the affected documentation.

Clearly distinguish:

- Approved
- Proposed
- Under evaluation
- Pending confirmation
- Implemented
- Tested
- Blocked

Do not mark a feature as complete merely because code has been written. It must be tested against its requirements.

---

## 10. Git and Project Safety

The project uses Git and an existing GitHub repository.

Before making substantial changes:

1. Inspect the current Git status.
2. Check the current branch.
3. Review relevant existing files.
4. Avoid overwriting unrelated work.
5. Keep changes focused and easy to review.

Never run destructive Git commands without explicit permission.

Do not force-push, reset, clean, delete branches, or rewrite Git history without approval.

Never commit secrets or sensitive customer/vendor information.

Use meaningful commit messages that describe the actual changes.

---

## 11. How to Work on Each Task

For every significant task, follow this workflow:

### Step 1 — Inspect

Read the relevant documentation and source files.

### Step 2 — Understand

Explain what currently exists and what needs to change.

### Step 3 — Plan

List the files that need to be created or modified and describe the intended changes.

### Step 4 — Identify risks

Mention dependencies, unresolved decisions, compatibility issues, and possible regressions.

### Step 5 — Implement

Make the smallest complete change that achieves the approved requirement.

### Step 6 — Verify

Run appropriate checks and test the relevant desktop, mobile, and interactive behaviour.

### Step 7 — Report

Summarise:

- What changed.
- Which files changed.
- What was tested.
- What passed.
- What failed or remains incomplete.
- What requires project-owner approval.
- The recommended next step.

Do not claim that something was tested if it was not actually tested.

---

## 12. Communication Style

Communicate with the project owner in clear, straightforward language.

Prefer concise explanations and practical steps.

For technical decisions:

- Explain what the decision means.
- Explain why it matters.
- Identify the available options.
- Recommend an option only when sufficient evidence exists.
- Clearly state what still needs approval.

Do not overwhelm the project owner with unrelated technical details.

Ask one focused question at a time when clarification is necessary.

---

## 13. Current Project Boundary

The immediate priority is to complete and verify the project documentation.

Until the project owner explicitly approves moving to theme setup:

- Do not integrate Horizon.
- Do not modify the `theme/` directory.
- Do not start storefront implementation.
- Do not install marketplace applications.
- Do not create production backend services.
- Do not configure live payment or delivery integrations.

The next approved stage is to audit the documentation, inspect the actual prototype, and prepare the implementation foundation.

---

## Final Instruction

**Understand first. Document second. Implement third. Verify everything.**

The objective is not merely to make the Shopify store look similar to the prototype. The objective is to reproduce its intended user experience faithfully while building a reliable, maintainable Shopify storefront and multi-vendor marketplace for Flaberry.