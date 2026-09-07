---
document_type: oar1
authority_level: working
title: OAR1 — Create Public Legal Routes and Footer Links
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_create_public_legal_routes_and_footer_links_v1.meta.md
commit: 25f35b7
---

# OAR1 — Create Public Legal Routes and Footer Links

## OBJECTIVE

Create /privacy and /terms as SPA-native static routes.
Add Privacy · Terms · Contact legal links to system footer.
Preserve existing legal identity statement and branch link.
All language sourced verbatim from oar2_compile_legal_identity_and_launch_disclosures_v1.
Nothing invented.

---

## FILES CHANGED

| File | Change |
|---|---|
| `src/measures_registry/registered_runtime/registeredRuntimeTypes.ts` | Added `"privacy"` and `"terms"` to `RegisteredSurface` type |
| `src/measures_registry/registered_runtime/renderers/RegisteredPrivacy.tsx` | Created — static privacy page component |
| `src/measures_registry/registered_runtime/renderers/RegisteredTerms.tsx` | Created — static terms page component |
| `src/measures_registry/registered_runtime/styles/encounters/legal.css` | Created — legal document layout styles |
| `src/measures_registry/registered_runtime/styles/registry.runtime.css` | Added `@import "./encounters/legal.css"` |
| `src/measures_registry/registered_runtime/styles/registry.footer.css` | Added `.registry-footer-legal-links` nav styles |
| `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` | Route aliases, public routes, footer nav, dispatcher branches, imports |
| `src/app/App.tsx` | Added `/privacy` and `/terms` to `REGISTRY_ROUTE_METADATA` for SEO |

No migration. No DB mutation. All changes are source-only.

---

## ROUTE IMPLEMENTATION

### Architecture

Dedicated static React routes. DB surface dispatch architecture not expanded.
Legal routes are SPA-native: added to `ROUTE_SURFACE_ALIASES` and `PUBLIC_ROUTE_BY_SURFACE`.
`initialSurface()` resolves `/privacy` → `"privacy"` and `/terms` → `"terms"` on direct load.
Footer legal links call `navigate()` directly — no full page reload for in-SPA navigation.
Browser popstate handled via existing `writeHistory` mechanism.

| Route | Surface | Component |
|---|---|---|
| `/privacy` | `privacy` | `RegisteredPrivacy.tsx` |
| `/terms` | `terms` | `RegisteredTerms.tsx` |

### SURFACE_QUERY additions

```
privacy: "privacy"
terms: "terms"
```

These keys have no encounter_def entry in DB — `footerCopy` returns empty array for legal surfaces. Root branch link and legal links nav still render.

---

## VALIDATION

| Check | Result |
|---|---|
| /privacy route exists | YES — `ROUTE_SURFACE_ALIASES["/privacy"] = "privacy"` |
| /privacy renders | YES — `RegisteredPrivacy` component dispatched |
| /terms route exists | YES — `ROUTE_SURFACE_ALIASES["/terms"] = "terms"` |
| /terms renders | YES — `RegisteredTerms` component dispatched |
| Footer links include Privacy and Terms | YES — `registry-footer-legal-links` nav added to `renderSystemFooter()` |
| Contact link resolves to /about | YES — Contact → `navigate("about_measures_registry")` |
| Existing legal identity footer statement preserved | YES — `footerCopy` and `branchPrefix/branchLabel` paths untouched |
| Federal tax-exempt status implied | NO |
| Tax deductibility implied | NO |
| Charitable solicitation activated | NO |
| Native encounter routes changed | NO |
| Payment behavior changed | NO |
| Publication routes changed | NO |
| Build passes | YES — `✓ built in 9.19s`, TypeScript clean |

---

## CONTENT SOURCING

All language sourced verbatim from `oar2_compile_legal_identity_and_launch_disclosures_v1`.

### /privacy sections

- Who We Are — legal identity statement (verbatim)
- Information We Collect — assessment inputs, contact form, consent preferences
- How We Use Assessment Information
- How We Use Contact Form Information
- Email Communications — consent-gated; unsubscribe via connect@measuresregistry.com
- Third-Party Services — Supabase (US), Paragraph, Buffer
- Analytics and Cookies — none at this time
- Data Retention
- Your Rights — access, correction, deletion via connect@measuresregistry.com
- Legal Standing — `federal_tax_status_disclosure` + `contributions_disclosure` (verbatim from seated blocks)
- Changes to This Policy
- Contact — connect@measuresregistry.com

### /terms sections

- Legal Identity — legal identity statement (verbatim)
- Informational Purpose
- Assessment Results — no certification by default
- No Professional Advice
- Payment Boundaries — MAP payments not investments or contributions
- Contribution and DAO Participation — `contributions_disclosure` + `dao_participation_disclosure` + `mission_support_language` (verbatim)
- Intellectual Property
- Prohibited Use
- Limitation of Liability
- Changes to These Terms
- Contact — connect@measuresregistry.com

Effective date: June 26, 2026

---

## FOOTER CHANGES

### Added: `registry-footer-legal-links` nav

Rendered at the end of every `renderSystemFooter()` call — present on all surfaces that render a footer.

```
Privacy · Terms · Contact
```

- Privacy → `navigate("privacy")` with `href="/privacy"`
- Terms → `navigate("terms")` with `href="/terms"`
- Contact → `navigate("about_measures_registry")` with `href="/about"`

### Preserved

- `footerCopy` lines (copy_lines from active encounter_def — legal identity statement on /about)
- `branchPrefix` / `branchLabel` / `branchUrl` (c3 Field branch link)

---

## SEO

| Route | Title |
|---|---|
| `/privacy` | Privacy Policy \| Measures Registry |
| `/terms` | Terms of Use \| Measures Registry |

Both added to `REGISTRY_ROUTE_METADATA` in App.tsx. `applyPageMetadata()` sets canonical URL, og:title, og:description, and twitter metadata on load.

---

## CONFLICT CHECK

| Check | Result |
|---|---|
| Measures Registry represented as separate entity | NO — branch relationship explicit in both pages |
| Federal tax-exempt status implied | NO — disclosure explicitly negates implication |
| Tax deductibility implied | NO — disclosure explicitly negates implication |
| Contributions represented as investments | NO — prohibited by mission_support_language (verbatim) |
| Charitable solicitation activated | NO |
| Donation language added | NO |
| Legal routes alter encounter routing | NO — existing surfaces unchanged |
| Privacy/terms contradict seated disclosure blocks | NO — content sourced verbatim from seated blocks |
| Operator governed | NO |

**No conflicts.**

---

## NOTCHAZZ FLAGS

None raised.

- Measures Registry not represented as separate entity
- Federal tax-exempt status not implied
- Tax deductibility not implied
- Charitable solicitation not activated
- No donation language
- Encounter routing unchanged
- Content sourced verbatim from operator-verified disclosure blocks
- Operator not governed

---

## REMAINING WORK FOR LAUNCH

| Item | Status |
|---|---|
| `/privacy` route | **COMPLETE** |
| `/terms` route | **COMPLETE** |
| Legal footer links (Privacy · Terms · Contact) | **COMPLETE** |
| `/data-rights` route | Still absent — deferred per OAR2 (P1) |
| Standalone `/contact` route | Still absent — contact via /about (P2) |
| Global footer legal statement | `footer_contract.legal_identity_statement` seated but renderer not yet extended globally |
| `assessment_contact_capture_contract` | Still null — consent label governance gap |

**P0 launch blockers: CLEARED.**

---

## CLOSE

/privacy and /terms routes created and rendering.

Legal footer links (Privacy · Terms · Contact) present on all surfaces.

All language sourced verbatim from operator-verified disclosure blocks.

Existing legal identity footer statement preserved on /about.

Build clean. No conflicts.

Commit: 25f35b7
