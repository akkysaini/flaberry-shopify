# FLABERRY

**Shopify Storefront + Multi-Vendor Marketplace**

Flaberry is an India-focused gifting and e-commerce platform built on Shopify, with a multi-vendor fulfilment architecture and automatic vendor allocation.

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
- Distance-based vendor selection.
- Scheduled and time-sensitive delivery.
- Central customer payment collection.
- Separate vendor settlements.

### Core Business Rules

| Requirement | Decision |
|---|---|
| Target market | India |
| Commerce platform | Shopify |
| Vendor model | Central + vendor-listed products |
| Product catalogue | One central catalogue |
| Order allocation | Automatic |
| Routing criteria | Availability + distance |
| Customer payment | Collected by Flaberry |
| Vendor settlement | Managed separately by Flaberry |
| Storefront design | Existing HTML prototype |

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
│
├── reference/
│   └── Flaberry_Design1_Classic.html
│
├── screenshots/
│   ├── desktop/
│   └── mobile/
│
├── theme/
│   └── Shopify Horizon theme files
│
├── GEMINI.md
├── README.md
└── .gitignore
```

The `PROTOTYPE_ANALYSIS.md` file will be generated after the original HTML prototype has been thoroughly inspected.

The `theme/` directory will contain the Shopify Horizon-based theme after integration.

A backend directory will be introduced after backend architecture approval.

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

The implementation must analyse the complete source code rather than relying exclusively on screenshots.

### Design preservation requirements

- Preserve the existing visual identity.
- Preserve the original section order.
- Preserve navigation and interactions.
- Preserve desktop and mobile behaviour.
- Use the existing product images and visual assets.
- Avoid unnecessary redesign.
- Convert demonstration functionality into actual Shopify functionality.

The objective is accurate Shopify implementation, not visual reinterpretation.

---

## 6. DEVELOPMENT SETUP

### Prerequisites

Install and configure:

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

It must be integrated into the existing `theme/` directory without replacing the project root or existing documentation.

### Initial development workflow

After project documentation and technical architecture have been approved:

1. Open the Flaberry project in Antigravity.
2. Read `GEMINI.md`.
3. Review all project documentation.
4. Analyse the original HTML prototype.
5. Generate `PROTOTYPE_ANALYSIS.md`.
6. Review the analysis.
7. Integrate Shopify Horizon.
8. Configure the development store.
9. Begin incremental theme implementation.

Do not begin full theme development before prototype analysis and architecture review.

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

---

## 8. GIT AND GITHUB WORKFLOW

GitHub is the main remote repository.

Repository:

https://github.com/akkysaini/flaberry-shopify

### Recommended workflow

1. Review current project status.
2. Make a focused change.
3. Test the change.
4. Review modified files.
5. Commit the completed work.
6. Push to GitHub.
7. Continue with the next milestone.

### Example commands

Check project status:

```powershell
git status
```

Stage approved documentation:

```powershell
git add README.md GEMINI.md documentation/ interaction-reference/
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

### Pending

- [ ] Final documentation review.
- [ ] Documentation-only GitHub commit.
- [ ] Complete prototype analysis.
- [ ] Marketplace application selection.
- [ ] Backend architecture approval.
- [ ] Shopify Horizon integration.
- [ ] Shopify storefront implementation.
- [ ] Marketplace and routing implementation.
- [ ] End-to-end testing.

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