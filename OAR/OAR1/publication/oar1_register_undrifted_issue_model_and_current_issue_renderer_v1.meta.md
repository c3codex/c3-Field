# OAR1: Register unDrifted Issue Model and Current Issue Renderer
**Closes:** OAR/OAR2/publication/oar2_register_undrifted_issue_model_and_current_issue_renderer_v1.meta.md
**Depends on:** oar1_establish_registered_asset_file_structure_v1.meta.md, oar1_add_asset_registry_and_sidecar_metadata_convention_v1.meta.md, oar1_register_undrifted_issue01_launch_assets_v1.meta.md
**Branch:** measures
**Date:** 2026-07-07

---

## Status by Item

| # | Acceptance Criterion | Status |
|---|-----------------------|--------|
| 1 | Issue registry structure exists | SEATED |
| 2 | Issue 01 metadata file exists | SEATED |
| 3 | Issue 01 is registered as active | SEATED |
| 4 | Issue 01 binds the two existing article assets | SEATED |
| 5 | Issue 01 binds the two existing banner assets | SEATED |
| 6 | /undrifted active issue rendering inspected and updated or blocker returned | INSPECTED — BLOCKER RETURNED (see below) |
| 7 | /undrifted/library route created, prepared, or blocker returned | BLOCKER RETURNED |
| 8 | /undrifted/issue-01 route created, prepared, or blocker returned | BLOCKER RETURNED |
| 9 | CTA routing to /ai-operations-assessment verified or blocker returned | VERIFIED (live in DB and in code) |
| 10 | No article bodies embedded in this OAR2 | CONFIRMED |
| 11 | OAR1 returns proof | SEATED (this document) |

---

## Issue Folders / Files Created

```
Assets/Issues/unDrifted/README.md
Assets/Issues/unDrifted/issue_registry.md
Assets/Issues/unDrifted/Issue01/issue01.meta.md
```

`Assets/Issues/unDrifted/Issue01/issue01.meta.md` registers Issue 01 as `status: active`, `is_active: true`, `close_date: pending`, and binds:
- article_assets: `undrifted_issue01_measures_registry_launch_article_v1`, `undrifted_issue01_computational_systems_governance_nsf_project_pitch_article_v1`
- banner_assets: `undrifted_issue01_measures_registry_launch_banner_v1`, `undrifted_issue01_computational_systems_governance_nsf_pitch_banner_v1`

## Asset Registry Update

`Assets/Registry/asset_registry.md` — added an `issue_id` column; all four Issue 01 assets now carry `issue_id: undrifted_issue01`.

---

## /undrifted Implementation Inspection

**Architecture: fully DB-driven, not file-driven, not hardcoded, not hybrid with the new file-based asset registry.**

Route resolution and rendering chain:
1. `src/measures_registry/encounter_renderer/resolver/registryResolver.ts` queries five Supabase tables client-side on load — `measures_registry`, `measures_encounter_def`, `measures_media_map`, `measures_design_token`, `measures_encounter_surface_assignment` — filtered against **hardcoded TypeScript allowlist constants** (`ENCOUNTER_REGISTRY_KEYS`, `ENCOUNTER_DEF_KEYS`, `MEDIA_ROLES`, etc.). `"undrifted"` is one allowlisted key.
2. `measures_encounter_surface_assignment` rows carry a `public_routes` array that maps URL paths to a `surface_key`. Confirmed via direct query (project `zfihrspxvennjzazxcbj`, Measures Codex):

   | surface_key | public_routes |
   |---|---|
   | `lapis_chamber_encounter` | `/undrifted` |
   | `publication_dispatch` | `/publication/structural_drift` |

   No other `undrifted`-related routes exist in this table.
3. `src/measures_registry/encounter_renderer/chambers/LapisChamberRenderer.tsx` dispatches on `surface`: `lapis_chamber_encounter` → `UnDriftedIndex` (the actual `/undrifted` page), `publication_dispatch` → `PublicationDispatch` (a stub — its own code comment says article body content is "not yet piped through the encounter data model; honest gap for article body").
4. `UnDriftedIndex` reads **all** copy — masthead, issue rail (`issue_record`), cover story, assessment feature, featured articles (`featured_article_set`), role call, next-issue teaser, footer — from `encounter.encounterDef.metadata`, a single JSON blob on the `measures_encounter_def` row for `encounter_key = 'undrifted'`. This metadata is seeded exclusively through SQL migrations (e.g. `supabase/migrations/202606240001_seat_canonical_undrifted_issue_001_publication_record.sql`, `202606230002_featured_article_set_article_url_and_teasers.sql`) — there is no code path that reads `Assets/Issues/**` or `Assets/Articles/**` at runtime.

**Conclusion:** the file-based Issue/Asset registry established across this OAR2 chain and the live `/undrifted` runtime are two separate, currently-disconnected systems. The file registry is (per its own design intent, stated in the prior OAR2) a "registered content reservoir" — authoritative source content awaiting transcription into the DB, not a live data source the renderer consumes.

### Live DB Content Discrepancy (important finding)

Queried the current `measures_encounter_def` row for `encounter_key = 'undrifted'` directly. The live `issue_record` is:
```json
{"edition":"Launch Edition","publisher":"Published by Measures Registry","issue_date":"JULY 2026","issue_number":"001","branch_standing":"A Registered Branch of the c3 Field"}
```
This is the same Issue 01 (July 2026, launch edition) as the one just registered in `issue01.meta.md` — **but the live `featured_article_set` currently contains two different articles than the ones this OAR2 chain registered**:

| Live in DB (published, external Paragraph links) | Registered this session (local file assets) |
|---|---|
| "Agents With Keys" — `paragraph.com/@undrifted/agents-with-keys` | "Measures Registry Is Now Live" |
| "Fables & Myths" — `paragraph.com/@undrifted/fables-and-myths` | "From Measures Registry to Computational Systems Governance" |

**I did not modify the database or overwrite `featured_article_set`.** Replacing live, already-published article links with the newly-registered (not-yet-published) articles is a content decision with real consequences for the live site and was not explicitly instructed by this OAR2 — it only asked to bind assets to the issue object and update the renderer "if within current architecture." Given the live/registered content mismatch, silently swapping it would risk removing already-published work. This is returned as a blocker for explicit operator direction rather than acted on unilaterally.

---

## /undrifted/library Status

**Blocker returned — not created.** Would require, at minimum:
1. A new row in `measures_encounter_surface_assignment` with `public_routes: ["/undrifted/library"]` and a new or reused `surface_key`.
2. Extending the hardcoded `ENCOUNTER_REGISTRY_KEYS`/`ENCOUNTER_DEF_KEYS` allowlists in `registryResolver.ts` if a distinct encounter definition is needed for the library view.
3. A new renderer branch in `LapisChamberRenderer.tsx` (a library/archive list component), analogous to how `publication_dispatch` was added.
4. A defined data source for "archived issues" — currently only Issue 01 exists and it is `active`, so the library would be empty on launch. Not a blocker to build, but worth noting it has no content yet.

This is a real feature addition to the DB-driven runtime, not a file/config toggle — recommended as its own follow-up OAR2 rather than built inline here.

## /undrifted/issue-01 Status

**Blocker returned — not created.** Same mechanism as above (new surface assignment row + route), but additionally: since `/undrifted` currently **is** Issue 01 (there is only one issue and it's active), a dedicated `/undrifted/issue-01` route would today render identical content to `/undrifted` unless the renderer is parameterized to always show a specific issue regardless of which is "active." That parameterization is straightforward once the surface/routing exists, but doesn't yet exist. Recommended alongside the library route in the same follow-up OAR2.

---

## CTA Routing Verification

**Verified — no blocker.** Confirmed in two places:
- Live DB: `measures_encounter_def.metadata->'assessment_feature'` has `"route_path": "/ai-operations-assessment"`, `"cta_label": "ASSESS THE ENVIRONMENT"`.
- Code: `LapisChamberRenderer.tsx` cover headline links hard-code `href="/ai-operations-assessment"` regardless of DB state (line ~265).
- The newly registered article assets also carry `cta_route: /ai-operations-assessment` in frontmatter, consistent with the live site.

## Article Quality Checks (Routed steps 15–16)

Re-reviewed both registered article bodies:
- The NSF/research article ("From Measures Registry to Computational Systems Governance") does not collapse into product marketing — it stays in research-proposition register throughout and only invokes the shared CTA once, at the very end, matching the required pattern for both launch articles.
- The launch article does not overstate NSF/research status — it makes no NSF claims at all; NSF submission language is confined to the second article, and there it is correctly hedged ("has submitted," "if invited to submit a full proposal") rather than claiming acceptance or funding.

## Magazine Layout Feasibility

- **Cover + article-card grid:** already implemented natively in `UnDriftedIndex` (`undrifted-cover`, `undrifted-insights-grid`) using plain CSS grid/flex — no new library needed for "issue cover," "article cards," or "ordered pages."
- **Current/previous/next issue navigation:** partially present (`undrifted-next-issue` teaser section exists); true previous/next paging has no content to page through yet since only one issue is registered. Mechanically simple to add once a second issue exists and `/undrifted/issue-NN` routes are seated.
- **Archive state:** not yet implemented; depends on the `/undrifted/library` route above.
- **Page-turn / flip-book animation:** `embla-carousel-react@8.3.0` is already an installed dependency (used elsewhere for carousels) and could support a swipeable/paged browsing interaction without a new install. A literal book-style page-flip effect (e.g. `react-pageflip`) is **not** installed. Per this OAR2's explicit instruction, I am **not** installing a new library — flagging this as a recommendation only: if true page-flip animation is wanted, that's a distinct follow-up decision requiring approval, not a default build.

---

## Unresolved Blockers (summary)

1. **Content discrepancy:** live `/undrifted` DB content (Agents With Keys / Fables & Myths) differs from the file-registered Issue 01 assets (Measures Registry launch / NSF pitch articles). Needs an explicit operator decision: replace, append, or treat as a separate future issue.
2. **`/undrifted/library` and `/undrifted/issue-01` do not exist** — both require new DB surface-assignment rows, possible allowlist/code changes in `registryResolver.ts`, and new renderer branches in `LapisChamberRenderer.tsx`.
3. **File registry ↔ DB sync has no pipeline.** Nothing currently transcribes `Assets/Issues/**`/`Assets/Articles/**` into `measures_encounter_def.metadata`. This has been true since the prior OAR2 in this chain and remains true here — establishing that pipeline (manual migration authoring, or an automated sync script) is its own scope of work.

## Next Recommended OAR2

Resolve the content discrepancy first (operator decision on which article set represents live Issue 01), then author a migration to seat the agreed `featured_article_set`/`issue_record` and add the `/undrifted/library` and `/undrifted/issue-01` surface assignments plus corresponding renderer branches — at that point the file-based issue registry and the live runtime become one source of truth.
