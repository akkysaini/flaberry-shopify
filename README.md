# FLABERRY

**Shopify Storefront + Multi-Vendor Marketplace**

Flaberry is a global gifting and e-commerce platform built on Shopify, with a multi-vendor fulfilment architecture and automatic vendor allocation.

The project aims to transform an existing fully interactive HTML prototype into a production-ready Shopify storefront while preserving its original visual design and customer experience.

---

## 1. PROJECT OVERVIEW

### Business Model

Flaberry operates through a hybrid marketplace model.

The platform supports:

- Flaberry-owned central products.
- Vendor-listed products.
- Multiple approved vendors.
- Vendor-specific inventory.
- Multiple fulfilment locations.
- Automatic order allocation.
- Pincode-based serviceability.
- Delivery eligibility and distance-based vendor selection.
- Scheduled and time-sensitive delivery.
- Central customer payment collection.
- Separate vendor settlements.

### Core Business Rules

| Requirement | Decision |
|---|---|
| Target market | Global (Shopify Markets architecture) |
| Commerce platform | Shopify |
| Vendor model | Central + vendor-listed products |
| Product catalogue | Central and vendor-listed products |
| Order allocation | Automatic |
| Routing criteria | Product availability + vendor inventory + delivery eligibility + distance |
| Customer payment | Collected by Flaberry |
| Vendor settlement | Managed separately by Flaberry |
| Storefront design | Existing HTML prototype |

**Important routing principle:** Vendor availability, inventory and delivery eligibility must be checked before distance is considered. Distance alone must never determine vendor selection. Manual allocation is reserved for exception or fallback situations. Specific routing tie-breakers remain pending approval.

---

## 2. TECHNOLOGY STACK

### Development Environment

| Technology | Purpose |
|---|---|
| Windows | Development environment |
| Visual Studio Code | Code editor |
| Google Antigravity | AI development environment |
| Antigravity CLI | Agent CLI |
| Shopify AI Toolkit | Shopify development assistance |
| Node.js | JavaScript runtime |
| npm | Package management |
| Shopify CLI | Shopify development |
| Git | Version control |
| GitHub | Remote repository |

### Storefront

- Shopify Horizon — selected base theme.
- Shopify Liquid — theme templating.
- HTML5 — markup.
- CSS3 — styling.
- Vanilla JavaScript — frontend interactions.

**Important:** Shopify Horizon is the selected starting theme. Dawn is not the project foundation.

Horizon has been selected but has not yet been integrated into the project.

### Backend

Backend framework, database and hosting are pending technical approval.

Refer to `documentation/TECH_STACK.md` for the current technology decisions.

---

## 3. PROJECT STRUCTURE

```text
Flaberry-Shopify/
│
├── documentation/
│   ├── PROJECT_BRIEF.md
│   ├── DESIGN_REFERENCE.md
│   ├── ARCHITECTURE.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── INTEGRATIONS.md
│   ├── TECH_STACK.md
│   ├── DECISIONS.md
│   └── PROTOTYPE_ANALYSIS.md
│
├── interaction-reference/
│   ├── homepage-interactions.md
│   ├── navigation.md
│   └── responsive-behaviour.md
│
├── reference/
│   └── Flaberry_Design1_Classic.html
│
├── screenshots/
│   ├── desktop/
│   └── mobile/
│
├── theme/
│   └── Shopify Horizon theme files (after integration)
│
├── GEMINI.md
├── README.md
└── .gitignore
```

**Structure notes:**

- `PROTOTYPE_ANALYSIS.md` contains the completed source-based technical analysis of the original HTML prototype.
- `interaction-reference/` contains detailed interaction, navigation and responsive behaviour documentation.
- `reference/` preserves the original HTML design and interaction reference.
- `screenshots/` contains desktop and mobile visual references.
- `theme/` is reserved for the Shopify Horizon-based theme after authorised integration.
- A backend directory will be introduced after backend architecture approval.

---

## 4. DOCUMENTATION GUIDE

All major project requirements and decisions are documented in the `documentation/` directory.

| Document | Purpose |
|---|---|
| PROJECT_BRIEF.md | Business requirements and project overview |
| DESIGN_REFERENCE.md | Original visual design and UI specifications |
| ARCHITECTURE.md | Technical architecture and system components |
| IMPLEMENTATION_PLAN.md | Development phases and milestones |
| INTEGRATIONS.md | External services, APIs and applications |
| TECH_STACK.md | Development technologies and tools |
| DECISIONS.md | Approved and pending decisions |
| PROTOTYPE_ANALYSIS.md | Detailed HTML prototype analysis |

### Interaction Reference Documents

| Document | Purpose |
|---|---|
| homepage-interactions.md | Homepage components and interaction behaviour |
| navigation.md | Navigation, menus, drawers and routing |
| responsive-behaviour.md | Desktop, tablet and mobile layout behaviour |

### AI Instructions

`GEMINI.md` contains project-wide instructions for AI development agents.

All AI agents must read and follow the relevant documentation before modifying project files.

---

## 5. ORIGINAL DESIGN REFERENCE

The original HTML prototype is the primary visual and interaction reference.

Location:

```text
reference/Flaberry_Design1_Classic.html
```

The prototype includes interactive navigation, links, tabs, screen changes and other customer-facing interactions.

The implementation must follow the complete source analysis rather than relying exclusively on screenshots.

### Design Preservation Requirements

- Preserve the existing visual identity.
- Preserve the original section order.
- Preserve navigation and interactions.
- Preserve desktop and mobile behaviour.
- Use the existing product images and visual assets.
- Avoid unnecessary redesign.
- Convert demonstration functionality into actual Shopify functionality.

The objective is accurate Shopify implementation, not visual reinterpretation.

### Prototype Verification Status

The prototype has been inspected through static source-code and screenshot analysis.

The analysis is source-verified, but live browser execution and runtime testing have not been performed as part of that analysis.

Refer to `documentation/PROTOTYPE_ANALYSIS.md` for detailed findings and verification limitations.

---

## 6. DEVELOPMENT SETUP

### Prerequisites

The development environment includes:

- Node.js.
- npm.
- Git.
- Visual Studio Code.
- Google Antigravity.
- Shopify CLI.
- Shopify AI Toolkit.

### Shopify AI Toolkit

Official repository:

https://github.com/Shopify/shopify-ai-toolkit

The toolkit is installed in the development environment.

### Shopify Horizon

Official repository:

https://github.com/Shopify/horizon

Horizon is the selected theme foundation.

It must be integrated into the existing `theme/` directory without replacing the project root, existing documentation or Git history.

### Development Workflow

The immediate priority is to complete and commit project documentation before starting theme integration.

After the documentation-only commit:

1. Open the Flaberry project in Antigravity.
2. Read `GEMINI.md`.
3. Review the approved project documentation.
4. Review the completed prototype analysis.
5. Validate the technical architecture and pending integrations.
6. Obtain approval to begin Shopify theme integration.
7. Integrate Shopify Horizon into the existing `theme/` directory.
8. Configure the Shopify development store.
9. Begin incremental theme implementation.

Do not begin full theme development before prototype analysis, architecture review and the documentation commit are complete.

---

## 7. DEVELOPMENT PRINCIPLES

All contributors and AI agents must follow these rules.

1. Preserve the approved Flaberry design.
2. Use Shopify Horizon as the theme foundation.
3. Do not substitute Dawn.
4. Use Shopify-native functionality wherever practical.
5. Avoid unnecessary dependencies.
6. Do not invent Shopify APIs.
7. Keep storefront and backend responsibilities separate.
8. Keep sensitive credentials out of frontend code.
9. Do not change approved business rules without permission.
10. Do not treat pending technical decisions as approved.
11. Test each significant implementation.
12. Maintain documentation alongside code changes.
13. Never overwrite the original HTML reference.
14. Preserve existing Git history.
15. Do not treat prototype simulations as production-ready functionality.
16. Do not integrate the Shopify theme before the documentation-only commit and explicit approval.

---

## 8. GIT AND GITHUB WORKFLOW

GitHub is the main remote repository.

Repository:

https://github.com/akkysaini/flaberry-shopify

### Recommended Workflow

1. Review current project status.
2. Make a focused change.
3. Test the change where applicable.
4. Review modified files.
5. Commit the completed work.
6. Push to GitHub.
7. Continue with the next milestone.

### Example Commands

Check project status:

```powershell
git status
```

Stage approved documentation:

```powershell
git add README.md GEMINI.md documentation/ interaction-reference/
```

Review staged changes:

```powershell
git diff --cached --stat
git diff --cached
```

Commit:

```powershell
git commit -m "docs: complete project documentation"
```

Push:

```powershell
git push origin main
```

Always inspect staged changes before committing.

The commands above are examples for the documentation commit. Confirm the actual branch and repository status before executing them.

Never commit API keys, passwords, private access tokens or sensitive customer information.

---

## 9. IMPLEMENTATION ROADMAP

The project will be implemented in the following sequence:

| Phase | Description |
|---|---|
| 0 | Project foundation |
| 1 | Complete prototype analysis |
| 2 | Technical and integration validation |
| 3 | Shopify development environment |
| 4 | Design system and global components |
| 5 | Storefront development |
| 6 | Shopping functionality |
| 7 | Marketplace foundation |
| 8 | Inventory and delivery engine |
| 9 | Automatic order routing |
| 10 | Payments and vendor settlements |
| 11 | Notifications and automation |
| 12 | Quality assurance |
| 13 | Pilot and production launch |

Refer to `documentation/IMPLEMENTATION_PLAN.md` for detailed execution requirements.

---

## 10. CURRENT PROJECT STATUS

### Completed / Prepared

- [x] Initial project folder.
- [x] Original HTML prototype.
- [x] Desktop and mobile reference screenshots.
- [x] Git configuration.
- [x] GitHub repository connection.
- [x] Shopify CLI installation.
- [x] Node.js installation.
- [x] Antigravity CLI installation.
- [x] Shopify AI Toolkit installation.
- [x] Initial project documentation drafts.
- [x] Static source analysis of the original HTML prototype.
- [x] Prototype page and route inventory.
- [x] Homepage interaction documentation.
- [x] Navigation and routing documentation.
- [x] Responsive behaviour documentation.
- [x] Route-counting and Cart Drawer classification correction.

### Pending

- [ ] Save and verify the final root-level GEMINI.md.
- [ ] Final documentation consistency audit.
- [ ] Documentation-only GitHub commit.
- [ ] Technical and integration validation.
- [ ] Marketplace application selection.
- [ ] Backend architecture approval.
- [ ] Shopify Horizon integration.
- [ ] Shopify storefront implementation.
- [ ] Marketplace and routing implementation.
- [ ] End-to-end testing.

**Current milestone:** Documentation finalisation and GitHub commit.

**Theme integration status:** Not started. Horizon is selected but has not been integrated.

---

## 11. IMPORTANT PROJECT REFERENCES

| Resource | Location |
|---|---|
| Project repository | https://github.com/akkysaini/flaberry-shopify |
| Shopify Horizon | https://github.com/Shopify/horizon |
| Shopify AI Toolkit | https://github.com/Shopify/shopify-ai-toolkit |
| Shopify Developer Documentation | https://shopify.dev/ |
| Shopify CLI | https://shopify.dev/docs/api/shopify-cli |

---

## FINAL PROJECT OBJECTIVE

Build Flaberry as a fully functional, scalable Shopify-based multi-vendor gifting marketplace.

Preserve the original interactive HTML prototype's customer experience while implementing real Shopify commerce, vendor operations, automatic fulfilment routing, delivery management and financial settlement workflows.

**Analyse first. Validate architecture. Build incrementally. Test continuously. Launch only after verification.**