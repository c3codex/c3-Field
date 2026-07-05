---
document_type: oar1
authority_level: working
title: OAR1 — Seat Institutional Metadata Authority
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_seat_institutional_metadata_authority_v1.meta.md
migration: seat_institutional_metadata_authority (project zfihrspxvennjzazxcbj)
commit: f3c3359
---

# OAR1 — Seat Institutional Metadata Authority

## FINAL DISPOSITION

**METADATA_SEATED_AND_WIRED — ONE GAP DOCUMENTED (PARAGRAPH SAMEAS)**

All eight ROUTED items are seated and rendered from real DB state — founder identity, sameAs links, article authorship, publication dates, the new article, and the two About-page standings. One incidental drift fix: Organization's `sameAs` previously hardcoded a Paragraph/unDrifted link that was never actually seated with `standing: "active"` — it's now removed rather than left inconsistent with the newly-strict founder-sameAs rule.

---

## VALIDATION CHECKLIST

| Item | Status | Evidence |
|---|---|---|
| Founder public metadata is seated | PASS | Migration inserted `measures_registry.founder_authority` (verified via direct query): `founder_name`, `founder_title`, `founder_description` |
| Founder public title is Systems Designer | PASS | `founder_title: "Systems Designer"`; verified in built `dist-registry/index.html` Person JSON-LD `jobTitle` |
| "Measures Registry Instructor" removed from public founder JSON-LD | PASS | `buildRootJsonLdGraph()` now derives `jobTitle`/`description` entirely from the seated `founder_authority` row — the old hardcoded "Measures Registry Instructor" string no longer exists anywhere in the script |
| Founder sameAs links are seated | PARTIAL (documented) | LinkedIn, X, Instagram are seated with `standing: "active"` in `undrifted_publication_landing.metadata.social_links` and now render on both Organization and Person. **Paragraph/unDrifted is not seated as a social link at all** (queried directly — only X/Instagram/LinkedIn/Facebook rows exist, Facebook is `held_not_in_launch_scope`) — so per the OAR2's own rule ("must be DB-seeded... before being rendered"), it is correctly omitted, not assumed |
| unDrifted Editorial author authority is seated | PASS | All 3 `featured_article_set` entries carry `author_name: "unDrifted Editorial"`, `author_slug: "undrifted-editorial"` |
| Publication dates present for the three listed articles | PASS | `date_published` seeded exactly as specified: Fables & Myths `2026-06-13`, Agents With Keys `2026-06-23`, new article `2026-06-30` |
| New Paragraph article registered | PASS | "The New AI Bottleneck Isn't Compute, It's Governance" appended to `featured_article_set` with the exact given `article_url`/`date_published`/author fields. No teaser/description invented — none were provided, so those keys are simply absent on that entry (reported here, not silently guessed) |
| Article/BlogPosting schema generated without invented dates/authors | PASS | `buildUndriftedArticleJsonLd()` filters to entries with both `date_published` and `author_name` present before emitting anything — all 3 now qualify; verified 3 `BlogPosting` entries in built `dist-registry/undrifted/index.html` |
| About legal identity statement standing is public | PASS | `content_standing.legal_identity_statement = "public"` seeded on `about_measures_registry`; `AboutMeasuresRegistry` renders it only when that flag reads exactly `"public"` |
| About Our Story standing is public_as_our_story | PASS | `content_standing.c3field_links_section = "public_as_our_story"` seeded; component renders the new `our_story_section` copy only when that flag matches, and does **not** render the old `c3field_links_section.links` (c3field.online URLs), preserving the prior removal decision |
| No unseated public authority introduced | PASS | No pricing/certification/DAO-standing/c3-Key/conversion/MAP/SEAT claims added anywhere in this pass |

---

## CHANGES — EVIDENCE

### Database (migration `seat_institutional_metadata_authority`, applied directly — no separate Field/Measures hand-off needed since this OAR2 provided concrete, operator-approved values rather than open vocabulary)

- `measures_registry`: inserted `founder_authority` row (`registry_family: "spine"`, `release_state: "released"`, `access_state: "visible"`, matching the convention of other public rows — confirmed readable under the existing `measures_registry_public_released_active_read` RLS policy).
- `measures_registry.undrifted_publication_landing.metadata.featured_article_set`: replaced with the same 2 existing entries (content otherwise unchanged) plus the 3 new fields each, plus the 3rd new article.
- `measures_encounter_def` (`encounter_key = 'about_measures_registry'`): merged `legal_identity_statement` (OAR2-approved casing), `content_standing`, and `our_story_section` into the existing `approved_content_contract` object via `jsonb_set(... || jsonb_build_object(...))`, leaving all other existing fields (`orientation_sections`, `connect_section`, `codexstone_seal_section`, `undrifted_bridge_section`, `c3field_links_section`) untouched.

### `scripts/generate-registry-route-heads.cjs`

- `main()` now fetches `founder_authority` alongside the existing route units in one query, before patching the root head (previously the Supabase fetch happened *after* the root head was already written with hardcoded values).
- `activeSameAsUrls()` — filters `social_links` to `standing === "active"` entries only.
- `buildRootJsonLdGraph({ founder, sameAs })` — Person entity is only emitted if `founder_name` is seated (no invented name fallback); `jobTitle`/`description` keys are only included if seated (no empty-string placeholders).
- `buildUndriftedArticleJsonLd(articles)` — new function, filters to fully-qualified entries (`title`, `article_url`, `date_published`, `author_name` all present) before emitting `BlogPosting` schema; `dateModified`/`description` are included only if present on that specific article.
- `/undrifted` route generation now injects this article `@graph` after its normal SEO head.

### `src/measures_registry/encounter_renderer/chambers/CrystalSeatRenderer.tsx`

`AboutMeasuresRegistry` reads `approved.content_standing`, `approved.legal_identity_statement`, `approved.our_story_section`. Both new sections are gated on their exact standing string match (`"public"` / `"public_as_our_story"`) — absent or any other value renders nothing, consistent with "no invented fallback truth."

### `src/measures_registry/encounter_renderer/styles/encounters/about.css`

Added `.registry-about-our-story` (+ `-title`, `-body`) and `.registry-about-legal-identity`, matching the existing section-shell and typography conventions already used by `.registry-about-orientation`/`.registry-about-bridge`.

### `dist-registry/`

Rebuilt via `npm run build:registry`; verified directly in the output: sameAs now `[X, Instagram, LinkedIn]` (no Paragraph) on both Organization and Person, Person `jobTitle` is now "Systems Designer", 3 `BlogPosting` entries on `/undrifted`, and the two new About page CSS classes are present in the compiled bundle.

---

## GAP — NOT INVENTED

**Paragraph/unDrifted is not seated as an active social link.** OAR2 §2 asks to seat it "where already publicly active," but a direct query of `social_links` shows no Paragraph entry exists at all (only X, Instagram, LinkedIn as `active`, Facebook as `held_not_in_launch_scope`). Adding it here would have meant inventing a `standing: "active"` claim that isn't backed by a seated record — exactly what this OAR2 forbids. **Unblocks when**: Field/Measures add a Paragraph row to `undrifted_publication_landing.metadata.social_links` with `standing: "active"`; no frontend change will then be needed since both Organization and Person already resolve `sameAs` from that same list.

This also means the Organization JSON-LD `sameAs` list from the prior "Restore AI Visibility" OAR (which had hardcoded Paragraph) is now corrected — that was drift from before this stricter DB-first rule existed, not something newly introduced here.

---

## NOTCHAZZ FLAGS

None raised.

- No metadata invented — every seeded value in this OAR1 traces to an explicit "Required records" value given in the OAR2 document itself, not a Cody guess.
- No teaser/description invented for the new article — reported as absent, not filled in.
- No pricing, certification, DAO-standing, c3 Key, permission, or Measures Conversion claims introduced.
- Outbound c3field.online links were not restored — Our Story renders as new conceptual copy only, consistent with the prior removal decision.
- Paragraph sameAs gap reported rather than assumed.
