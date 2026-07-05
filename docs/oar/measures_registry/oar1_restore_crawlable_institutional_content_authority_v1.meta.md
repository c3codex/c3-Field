---
document_type: oar1
authority_level: working
title: OAR1 — Restore Crawlable Institutional Content Authority
status: partially_closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_restore_crawlable_institutional_content_authority_v1.meta.md
commit: 9fdccee
---

# OAR1 — Restore Crawlable Institutional Content Authority

## FINAL DISPOSITION

**HOMEPAGE_INSTITUTIONAL_AUTHORITY_EXPANDED — ARTICLE_SCHEMA_AND_ABOUT_PAGE_CONTENT_DEFERRED (DB GAP)**

Homepage crawlable copy now covers all four OAR2 topic clusters in citation-ready Q&A form, plus a public-safe founder authority statement, without inventing new routes or exposing pricing/certification/DAO-standing claims. Article schema and deeper About-page content are explicitly deferred — both require DB-seeded facts (publication dates, authors, founder bio fields) that do not currently exist, and inventing them is exactly what this OAR2 forbids.

---

## VALIDATION CHECKLIST

| Item | Status | Evidence |
|---|---|---|
| Homepage contains substantial crawlable institutional text | PASS | `CrystalSeatRenderer.tsx` `CrystalIntroSeat` sr-only block expanded to ~430 words (within the 300–700 target) |
| Public authority pages form a semantic map | PARTIAL | Existing routes (`/`, `/about`, `/ai-operations-assessment`, `/undrifted`) already cross-link (header nav + homepage body + About's unDrifted bridge). Priority-list concepts without a seated route (Governable Environments, MAP, Our Story, Foundational Leadership) were folded into homepage copy as H2 sections rather than invented as new pages, per the OAR2 rule "if routes do not exist, do not invent them unless approved and seated" |
| Internal linking graph expands | PASS | No new links needed beyond OAR2 #1's — header/homepage nav already reaches About, Assess the Environment, and unDrifted from every surface; this pass added prose-embedded links reinforcing the same targets inside the new topic-cluster paragraphs |
| Article schema exists where appropriate | GAP (documented, not invented) | Queried `measures_registry.metadata.featured_article_set` for `undrifted_publication_landing` directly — both published unDrifted articles ("Agents With Keys", "Fables & Myths") have `title`/`teaser`/`article_url`/`description` but **no `datePublished` or author field at all**, and `issue_record` is `null` (issue_number/issue_date unseeded despite the frontend already reading those fields). OAR2 explicitly forbids invented dates/authors, so no Article/BlogPosting schema was added |
| Founder authority visible | PASS | Public-safe founder paragraph added to homepage: "Stephanie Joanne Gaffney, an artist and Measures Registry Instructor, and founder of c3 Community Partners DAO, LLC" (verbatim per OAR2 §6). Person JSON-LD `description` field updated to match |
| No pricing/certification/DAO-standing/conversion claims added | PASS | MAP paragraph explicitly states standing/scope are established directly with Measures Registry and are "not detailed on this page" — no pricing or certification language anywhere in the new copy |
| AI systems can understand Measures Registry without JS/video | PASS | All new copy lives in real crawlable HTML text (the same `.c3-visually-hidden` sr-only technique used in OAR2 #1 — accessible, not `display:none`), answering "What is Measures Registry / Structural Drift / a Governable Environment / MAP" directly in prose |
| Encounter architecture preserved | PASS | No new routes, no new components, no visual change to the full-bleed video hero — copy added inside the existing sr-only block only |
| Build passes | PASS | `npx tsc --noEmit` clean; `npm run build:registry` succeeds; `dist-registry` rebuilt |

---

## CHANGES — EVIDENCE

### `src/measures_registry/encounter_renderer/chambers/CrystalSeatRenderer.tsx`

`CrystalIntroSeat`'s sr-only block expanded from 4 short paragraphs to 8 H2 sections: "AI isn't broken. Systems are." (expanded), "Institutional Accountability for AI Deployment" (expanded), new — "What is Structural Drift?", new — "What is a Governable Environment?", "Assess the Environment" (expanded), new — "The Measures Alignment Protocol", "Understand the Environment" (expanded), new — "Foundational Leadership". ~430 words total.

### `scripts/generate-registry-route-heads.cjs`

Person (founder) JSON-LD `description` field added: "Artist and Measures Registry Instructor; founder of c3 Community Partners DAO, LLC." — matches OAR2 §6 verbatim, no private information.

### `dist-registry/`

Rebuilt via `npm run build:registry`.

---

## NOT DONE / DEFERRED — AND WHY

- **Article/NewsArticle/BlogPosting schema for unDrifted dispatches**: not added. Direct query against `measures_registry.metadata->'featured_article_set'` for `undrifted_publication_landing` shows both published articles have no `datePublished`, `dateModified`, or author field seeded. `issue_record` (which the frontend already reads for `issue_date`/`issue_number`) is `null`. Adding Article schema without a real date would mean inventing one — explicitly forbidden by this OAR2 ("No invented publication dates. No invented authors."). **Unblocks when**: Field/Measures seed `date_published` (and optionally an author/byline field) on the `featured_article_set` entries or `issue_record`.
- **Deeper About-page content (Our Story / founder bio on `/about` itself, beyond the homepage)**: not added. `AboutMeasuresRegistry`'s content is entirely DB-driven from `measures_encounter_def.metadata.approved_content_contract` (`encounter_key = about_measures_registry`) — Cody cannot add static fallback copy there without violating the "no invented authority / no fallback truth" pattern already established across this codebase's other OARs. Notably, that same DB record already contains two fields the component does **not** render: `c3field_links_section` (a "Our Story" link pointing to `https://c3field.online`) and `legal_identity_statement` ("Measures Registry operates under the authority and governance framework of C3 COMMUNITY PARTNERS DAO LLC and is not a separate legal entity."). Both are orphaned data, not currently wired to any renderer. **This was deliberately left untouched**: recent repo history (commit "fix: remove c3field.online media links from About page") shows an explicit, recent decision to remove c3field.online cross-links from this page — re-wiring `c3field_links_section` now would directly contradict that decision without knowing why it was made. `legal_identity_statement` is a plausible, low-risk add (the same DAO LLC name is already public on `/terms`), but wiring either field is a content decision for Measures/Field, not a unilateral Cody call in this pass.
- **New pages for "Governable Environments," "Measures Alignment Protocol," "Our Story," "Foundational Leadership"**: not created, per the OAR2 rule against inventing unapproved routes. Folded into homepage copy as H2 sections instead.

## RECOMMENDED NEXT OAR2

1. Field/Measures: seed `date_published` (and author/byline if one exists) on unDrifted `featured_article_set` entries, then a follow-up Cody pass can add real Article/BlogPosting schema per the existing `generate-registry-route-heads.cjs` pattern used for AboutPage.
2. Measures/Field: decide whether `legal_identity_statement` and/or a redesigned (non-c3field.online) "Our Story" section should be wired into `AboutMeasuresRegistry`, given the recent removal of c3field.online links from that page.

---

## NOTCHAZZ FLAGS

None raised.

- No authority invented — MAP, DAO, and certification language stops at exactly what OAR2 approved; nothing beyond it.
- No pricing, payment, certification, DAO-standing, or conversion claims added.
- No new routes invented.
- No fabricated publication dates or authors — verified via direct DB query before deciding, not assumed.
- Missing-state honesty preserved — Article schema gap and About-page content gap are reported, not silently skipped.
