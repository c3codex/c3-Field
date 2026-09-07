---
document_type: oar1
authority_level: working
title: OAR1 — Restore AI Visibility Structured Authority
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_restore_ai_visibility_structured_authority_v1.meta.md
commit: 2c7a136
---

# OAR1 — Restore AI Visibility Structured Authority

## FINAL DISPOSITION

**AI_VISIBILITY_STRUCTURED_AUTHORITY_RESTORED**

JSON-LD, llms.txt, crawlable nav, crawlable homepage semantic structure, internal links, and seated social links are implemented within the existing "encounter" architecture. No new authority created. No local-business, pricing, certification, or DAO-standing claims added.

---

## ROUTING NOTE — ROUTES AS FOUND

This is a Vite/React SPA with host-based, string-matched routing (`ROUTE_SURFACE_MAP` in `MeasuresRegistryOrchestrator.tsx`) — not a conventional router. The OAR2-proposed routes `/our-story`, `/ai-isnt-broken`, and `/understand-the-environment` do not exist as distinct routes and were not invented (OAR2 explicitly scopes nav/links to "where routes exist"). Public copy for those H2 labels was seated on the existing homepage (`/`) instead, and "Assess the Environment" / "Understand the Environment" link to the existing `/ai-operations-assessment` and `/undrifted` routes respectively.

`index.html` is a single template shared by three build targets (`dist`, `dist-registry`, `dist-inanna`). JSON-LD was added inside `scripts/generate-registry-route-heads.cjs`, which only runs for `build:registry`, so Organization/WebSite/Person/AboutPage schema is scoped to the `measuresregistry.com` deploy and does not leak into `c3field.online` or `measuresofinanna.com` builds.

---

## VALIDATION CHECKLIST

| Item | Status | Evidence |
|---|---|---|
| Valid JSON-LD added | PASS | `scripts/generate-registry-route-heads.cjs` — `buildRootJsonLdGraph()` injects `@graph` of Organization, WebSite, Person into `dist-registry/index.html` root template; `buildAboutPageJsonLd()` adds a second `AboutPage` block to `/about` and `/about-measures-registry` |
| No LocalBusiness/aggregateRating/address/phone/review schema | PASS | Only Organization, WebSite, Person, AboutPage types used; no address/phone/rating fields present |
| No unseated pricing/certification/DAO claims in schema or llms.txt | PASS | Organization description limited to governance/structural-drift/governable-environments language per OAR2 spec; llms.txt explicitly states MAP pricing/certification/DAO standing are not public claims |
| /llms.txt created | PASS | `public/llms.txt` — copied verbatim into `dist-registry/llms.txt` by Vite's public-dir copy, confirmed present after `npm run build:registry` |
| Homepage has exactly one H1 | PASS | `crystal_seat_intro` retains its single existing `<h1>{headline}</h1>` (unchanged) |
| H2 sections added | PASS | New `.c3-visually-hidden` block in `CrystalIntroSeat` (`CrystalSeatRenderer.tsx`) adds 4 crawlable `<h2>`: "AI isn't broken. Systems are.", "Institutional Accountability for AI Deployment", "Assess the Environment", "Understand the Environment" — each with real paragraph copy |
| Nav uses anchor tags | PASS | `registry-public-nav` in `MeasuresRegistryOrchestrator.tsx` (previously empty) now renders 4 real `<a href>` links; homepage additionally carries its own crawlable `<nav>` since `crystal_seat_intro` does not call `renderHeader` |
| Internal links from homepage are crawlable | PASS | Homepage `<a href="/ai-operations-assessment">` / `<a href="/undrifted">` links use real hrefs with `onNavigate` client-side interception (`e.preventDefault()` + `stopPropagation()` so they don't trigger the video's click-to-advance handler); links still resolve on full reload since `initialSurface()` reads `window.location.pathname` |
| Seated public social/profile links added | PASS | Footer `registry-footer-social-links` nav added with X (`twitter.com/measures_c3`), Instagram (`instagram.com/measures_registry`), LinkedIn (`linkedin.com/in/measures-registry`), Paragraph/unDrifted (`paragraph.com/@undrifted`) — all previously seated/verified in `oar1_seat_social_urls_fables_dispatch_and_authorize_buffer_batch_001_v1` and `oar1_verify_social_campaign_activation_standing_v1`; same three (minus LinkedIn) used as JSON-LD Organization `sameAs`, LinkedIn used as Person (founder) `sameAs` per its confirmed personal display name |
| Encounter design preserved | PASS | Crawlable homepage copy uses existing `.c3-visually-hidden` (sr-only, non-`display:none`) utility class already present in `src/index.css` — full-bleed video hero, click-to-advance, and headline are visually unchanged |
| Build passes | PASS | `npx tsc --noEmit` clean; `npm run build:registry` succeeds; `dist-registry` rebuilt and verified to contain JSON-LD, nav copy, and llms.txt |

---

## CHANGES — EVIDENCE

### `scripts/generate-registry-route-heads.cjs`

Added `buildRootJsonLdGraph()` (Organization + WebSite + Person, keyed by `@id` so AboutPage can reference them) and `buildAboutPageJsonLd()`. `patchRootHead()` now calls `injectJsonLd()` so every stamped route (root, `/about`, `/about-measures-registry`, `/privacy`, `/terms`, `/c3field`, `/ai-operations-assessment`, `/structural-drift`, `/undrifted`) inherits the Organization/WebSite/Person graph; `/about` and `/about-measures-registry` additionally get a page-specific `AboutPage` block.

### `src/measures_registry/encounter_renderer/MeasuresRegistryOrchestrator.tsx`

`renderHeader()`: `registry-public-nav` filled with real `<a href>` links (Home, About, Assess the Environment, Understand the Environment), each intercepted via `navigate()` for SPA transitions, matching the existing footer-legal-links pattern.

`renderSystemFooter()`: added `registry-footer-social-links` nav with the four seated public profile links.

### `src/measures_registry/encounter_renderer/chambers/CrystalSeatRenderer.tsx`

`CrystalIntroSeat`: added an `.c3-visually-hidden` block containing a real `<nav>` (Home/About/Assess/Understand) and the four OAR2-specified H2 sections with supporting copy and inline links to `/ai-operations-assessment` and `/undrifted`. All link `onClick` handlers call `stopPropagation()` first so they don't trigger the section's click-to-advance `handleAdvance`.

### `src/index.css` / `registry.footer.css`

Added `.registry-public-nav a` styling mirroring the pre-existing `.registry-public-nav button` rule, and `.registry-footer-social-links` styling mirroring `.registry-footer-legal-links`. No new utility class was needed for the sr-only block — reused the existing `.c3-visually-hidden`.

### `public/llms.txt`

New file. Identifies Measures Registry, structural drift, governable environments, and the Measures Alignment Protocol (named, not priced). Explicitly instructs AI systems not to attribute pricing/DAO-standing/certification claims beyond the listed public pages.

### `dist-registry/`

Rebuilt via `npm run build:registry` (`vite build --mode registry --outDir dist-registry && node scripts/generate-registry-route-heads.cjs dist-registry`) so the tracked deploy artifact reflects all of the above.

---

## VALIDATION OUTPUT

- **Changed files:** `scripts/generate-registry-route-heads.cjs`, `src/measures_registry/encounter_renderer/MeasuresRegistryOrchestrator.tsx`, `src/measures_registry/encounter_renderer/chambers/CrystalSeatRenderer.tsx`, `src/index.css`, `src/measures_registry/encounter_renderer/styles/registry.footer.css`, `public/llms.txt` (new), `dist-registry/**` (rebuilt)
- **JSON-LD types added:** `Organization`, `WebSite`, `Person` (all routes); `AboutPage` (`/about`, `/about-measures-registry` only)
- **llms.txt path:** `/llms.txt` — static file, expected 200 on deploy (same mechanism as existing `/robots.txt`, `/sitemap.xml`)
- **H1/H2 confirmation:** 1 H1 (`crystal_seat_intro`, unchanged) + 4 new crawlable H2s on homepage
- **Nav anchor confirmation:** `registry-public-header` nav (sitewide) + homepage-local nav — both real `<a href>`, no div-only navigation
- **Internal links added:** homepage → `/`, `/about`, `/ai-operations-assessment`, `/undrifted` (x2, header nav + homepage body)
- **Missing seated public profile links:** none — X, Instagram, LinkedIn, Paragraph all seated per prior OAR1 verification docs and now rendered

---

## NOT DONE / OUT OF SCOPE

- `FAQPage` schema — not added; no public FAQ content is currently seated in the registry.
- `BreadcrumbList` schema — not added; route structure is flat (no multi-level hierarchy to represent).
- `/our-story`, `/ai-isnt-broken`, `/understand-the-environment` as literal new routes — not created. Creating new pages/routes was judged out of scope for a "restore visibility on top-down" repair and risked "replacing encounter architecture with generic SaaS layout," which OAR2 forbids Cody from doing.
- No migration or DB change — this OAR is frontend/build-script only.

---

## NOTCHAZZ FLAGS

None raised.

- Codex authority unchanged — no new claims of standing, certification, or pricing introduced.
- Field/route structure unchanged — no new routes invented.
- Measures registration unchanged — no registry_key rows added or altered.
- Cody implementation confined to frontend semantic HTML, static public file, JSON-LD generation script, and CSS.
- Public metadata boundary preserved: no C1/C2/C3, pricing, payment, c3 Key, SRC, certification, conversion, or DAO standing language added to JSON-LD, llms.txt, or homepage copy.
