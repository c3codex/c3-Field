---
document_type: oar1
authority_level: proof
document_scope: publication_registry_audit
title: OAR1 - Audit unDrifted Publication Registry and FREE Route Duplication
closes: OAR/OAR2/publication/oar2_audit_undrifted_publication_registry_and_free_route_duplication_v1.meta.md
operator: op044
system: measures_registry
date: 2026-07-07
---

# OAR1: Audit unDrifted Publication Registry and FREE Route Duplication

**This is an audit only.** No DB writes, migrations, routes, CSS, or renderer logic were changed. All findings below are from live, read-only queries against project `zfihrspxvennjzazxcbj` (Measures Codex) and source/git inspection.

## Headline Finding

**unDrifted Publication/Profile authority is real, rich, and does NOT equal `/undrifted`.** It lives in `measures_publication_registry` (one row, `publication_key = 'undrifted'`) and `measures_publication_dispatch` (six rows). `measures_encounter_def` — the only table the live `/undrifted` renderer actually reads — holds a **partial, already-diverged copy** of that authority, ported over by a prior OAR2 explicitly intended as "encounter copies for rendering only." The copy has drifted from its source (a concrete date mismatch, found below), and it dropped fields entirely (including a full, real design/style-token contract this audit did not know existed when the prior design-authority audit ran). Additionally, a fourth, independently-created representation of "Issue 01" now exists only in the file registry (`Assets/Issues/unDrifted/`, seated by this session's own prior OAR2 work), disjoint from all three DB representations.

**This corrects my own prior audit** (`oar1_audit_undrifted_editorial_design_authority_and_drift_origin_v1`), which concluded "no seated Publication Design Profile exists for unDrifted, and never has." That conclusion was checked only against `measures_design_token`, `measures_encounter_def`, and one migration file — it did not check `measures_publication_registry`, which this OAR2 required inspecting and which does hold a full, real style contract (CSS custom property values, material/texture/visual-posture rules, a forbidden-patterns list). The design authority exists; it simply never survived the port into the table the renderer reads. See §6.

---

## 1. DB Surfaces Inventoried

| Table | Rows (undrifted-scoped) | Purpose (inferred) | Standing |
|---|---|---|---|
| `measures_registry` | 1 (`registry_key = 'undrifted'`) | Registry gate: `is_active`, `release_state`, `access_state`, plus `current_function: landing_page_publication`, `planned_function: social_registry_surface` (not active), and Buffer/Paragraph integration disposition notes (`automation_status: missing_required` for both). | Active — this is the gate that permits `/undrifted` to resolve at all. |
| `measures_encounter_def` | 1 (`encounter_key = 'undrifted'`) | **What FREE actually renders.** Ported display copy: `brand_copy`, `cover_story`, `issue_record`, `featured_article_set`, `assessment_feature`, `role_call_feature`, `next_issue_teaser`, `footer_record`, `style_contract` (bare key only), `landing_design_contract`, `media_locator`, `content_source`, `content_profile`, `directory_key`, `source_oar2`. | Active, live-rendered. Confirmed the sole source `registryResolver.ts` queries for this surface. |
| `measures_encounter_surface_assignment` | 2 (`registry_key = 'undrifted'`) | Route → surface mapping + per-surface style-vocabulary metadata (see §2, §6). | One active (`lapis_chamber_encounter`), one self-documented deprecated (`publication_dispatch`). |
| `measures_publication_registry` | 1 (`publication_key = 'undrifted'`), plus 1 sibling (`structural_drift`) | **Richer, older publication-identity object.** `title`, `subtitle`, `publication_type: "digital magazine"`, `status: published`, plus metadata: `issue_record` (richer than encounter_def's copy), `cover_story`, `brand_copy`, `role_call_feature`, `next_issue_teaser`, `footer_record`, `brand_assets`, `logo_contract`, `media_profile`, `style_contract` (**full token set — see §6**), `style_profile`, `social_media_distribution_contract`, `paragraph_api_publishing_contract`, `buffer_scheduler_contract`, `api_credential_validation_contract`, `publication_architecture_contract`, `allowed_cta_labels`, `hierarchy`, `claim_boundary`, `cta_boundary`, `parent_authority`, `release_state`, `brand_title`. | Active (`status: published`), but **not read by the live renderer at all** — `registryResolver.ts` never queries this table. |
| `measures_publication_dispatch` | 6 (`publication_key = 'undrifted'`) | **Canonical article/dispatch registry**, each with real `dispatch_body` text, `article_url`, `status`, `published_at`. Two are content stubs (`measures_registry_dispatch_v1`, `undrifted_dispatch_v1` — no body, no `published_at`). Four are real published articles: `agents_with_keys_dispatch_v1`, `fables_and_myths_dispatch_v1`, `agents_of_chaos_dispatch_v1`, `structural_drift_dispatch_v1`. | Active table, but **also not read by the live renderer** — `registryResolver.ts` never queries it either. |
| `measures_publication_release` | 1 (`release_id = 'undrifted_issue01_release01'`) | **New table, seated by this session's own prior OAR2** (`oar2_establish_undrifted_publication_release_pipeline_v1`) as the governance seam between the file-based Issue registry and DB-rendered state. `publication_state: pending_content_authority_decision`. | New, not yet consumed by anything — by design, gated on an unresolved content decision. |
| `measures_release_state` | 68 (sitewide, none unDrifted-specific) | **Generic, sitewide launch/visibility gating mechanism** (`release_state`, `access_state`, `sealed_at`, `effective_at`, `ritual_release_at`) keyed by `registry_id`, part of the general c3 Field OAR-spine infrastructure. | Active, unrelated in function to `measures_publication_release` despite the name overlap — flagged in §6 as a terminology risk, not a functional duplication. |
| `measures_publication_subscription_capture` | not queried in detail | Backing store for the "View Field Notes" email/organization capture form rendered on `/undrifted`. | Out of scope for identity/route duplication — noted for completeness only. |
| `measures_media_map` | multiple (media_role scoped) | Banner/cover images (`undrifted_publication_masthead`, `ai_isnt_broken_landing`, `agents_with_keys_cover`, `fables_and_myths_cover`, `measures_registry_logo`), already inventoried in the prior design-authority audit. | Active, consumed by the renderer. Not a publication-identity duplication concern. |

File-registry surfaces (this session's own prior work, inventoried for comparison, not DB):
```
Assets/Issues/unDrifted/Issue01/issue01.meta.md        — file-based Issue 01 (July 2026), articles: launch + NSF pitch
Assets/Releases/unDrifted/Issue01/release01.meta.md    — file-based Release object, pending_content_authority_decision
Assets/Registry/asset_registry.md                       — 4 registered assets (2 articles, 2 banners)
Assets/Articles/unDrifted/Issue01/registered/*.md       — 2 registered article bodies, never published anywhere
```

## 2. Route Authority Map

| Route | Mapped by | surface_key | encounter_key | Renderer | Standing |
|---|---|---|---|---|---|
| `/undrifted` | `MeasuresRegistryOrchestrator.tsx` `ROUTE_SURFACE_MAP` (hardcoded) + `measures_encounter_surface_assignment` row | `lapis_chamber_encounter` | `undrifted` | `LapisChamberRenderer.tsx` → `UnDriftedIndex` | **Active.** Sole live publication landing route. |
| `/structural-drift` | `ROUTE_SURFACE_MAP` | `lapis_chamber_encounter` (same as `/undrifted`) | `undrifted` | `UnDriftedIndex` | **Active alias**, plus a hard `window.location.replace("/undrifted")` redirect effect for the exact path `/structural-drift`. Same render target as `/undrifted`, not a distinct surface. |
| `/publication/structural_drift` | `ROUTE_SURFACE_MAP` special-case fallback in `initialSurface()` + `measures_encounter_surface_assignment` row (`surface_key: publication_dispatch`) | `publication_dispatch` in DB, but **code routes it to `lapis_chamber_encounter` instead** | `undrifted` | `UnDriftedIndex` (not the `PublicationDispatch` component the DB row nominally maps to) | **Legacy, explicitly self-documented as deprecated** in its own `measures_encounter_surface_assignment.metadata`: `"standing": "audit_trace"`, `"deprecated_surface": true`, `"deprecated_by_oar": "oar2_deprecate_stale_publication_dispatch_surface_v1"`, `"replacement_route": "/undrifted"`. Code comment in `MeasuresRegistryOrchestrator.tsx` corroborates this exactly. |
| `/publication/structural_drift/<dispatch_key>` | Stored as `internal_route` values on 3 of 6 `measures_publication_dispatch` rows (e.g. `agents_of_chaos_dispatch_v1`, `fables_and_myths_dispatch_v1`, `structural_drift_dispatch_v1`) | none in `measures_encounter_surface_assignment` | n/a | none — `PublicationDispatch` component exists in `LapisChamberRenderer.tsx` but nothing routes to it | **Dead references.** These per-dispatch internal routes were never wired into `ROUTE_SURFACE_MAP` and cannot resolve to anything but the generic `/undrifted` catch-all today. |
| `/undrifted/*` (issue-01, library) | none | none | none | none | **Do not exist**, confirmed again this pass — consistent with the prior Publication Release audit's finding. |

**Answer to "route authority":** exactly one route (`/undrifted`, plus its `/structural-drift` alias) is genuinely active and DB-driven. `/publication/structural_drift` is alive only because deprecated code still catches it and redirects it to the same place — it does not represent independent authority. `PublicationDispatch` is dead code with no reachable path today.

## 3. Publication Identity Authority — Classification

**Classification: publication identity is seated and active, but split — the active/rendered copy is a stripped derivative, and the richer canonical copy is orphaned (unread by any live code path).**

- `measures_publication_registry.undrifted` is the fuller object: brand, CTA/claim governance boundaries, integration authorization flags (Buffer/Paragraph both `false`), a **complete style contract**, and a `publication_architecture_contract` that explicitly states `"only_publication_landing_authority": true` and demotes `structural_drift` to `"structural_drift_standing": "diagnostic_trace_tag_only"`.
- `measures_encounter_def.undrifted` is a **rendering-only subset**, per the explicit intent recorded in its own source OAR2 (`oar2_seed_undrifted_encounter_definition_from_registered_publication_records_v1`: *"This OAR ports display content into encounter_key = 'undrifted' without changing publication authority... The encounter receives encounter copies for rendering only."*). That intent has held for *authority* (nothing claims `measures_encounter_def` owns publication identity) but has **not held for *fidelity*** — see §6 for the concrete drift between the two copies.
- No table or file claims to be a merged, single source of truth. Two real DB objects currently answer "what is unDrifted, as a publication" differently in overlapping fields.

## 4. Issue Authority — Classification

**Four distinct "Issue 01" representations exist, none formally reconciled:**

| Source | Issue key/date | Article set |
|---|---|---|
| `measures_publication_registry.metadata.issue_record` | `undrifted_issue_001_launch_edition`, **June 2026**, `release_state: released`, `access_state: visible`, `section_sequence: [cover_story, assessment_feature, agents_with_keys, fables_and_myths, role_call, next_issue]` | Agents With Keys + Fables & Myths |
| `measures_encounter_def.metadata.issue_record` | (no issue_key field) **JULY 2026** — dated differently than the row above | Agents With Keys + Fables & Myths (via `featured_article_set`) |
| `measures_publication_dispatch` rows | `agents_of_chaos_dispatch_v1` tagged `issue_number: "ISSUE 001"`; `structural_drift_dispatch_v1` tagged `issue_number: "ISSUE 002"` | 4 real published articles total (2 shown on `/undrifted` today, 2 published but not currently featured) |
| `Assets/Issues/unDrifted/Issue01/issue01.meta.md` (file registry, seated by this session's own prior OAR2) | `undrifted_issue01`, **July 2026**, `is_active: true` | Measures Registry launch article + NSF Computational Systems Governance pitch — **entirely different, unpublished articles, absent from every DB table** |

**Issue state is currently route-bound in practice** (whatever `measures_encounter_def.featured_article_set` says is what `/undrifted` shows) **but publication-bound in intent** (`measures_publication_registry.issue_record` reads as the more authoritative, richer object, and its `section_sequence` and `release_state`/`access_state` fields look like they were designed to govern this, not `measures_encounter_def`). No single object is currently authoritative in both senses at once.

## 5. Article/Content Authority — Comparison

| Article | `measures_publication_dispatch` (canonical body) | `measures_encounter_def.featured_article_set` (live-rendered) | File registry (`Assets/Articles/...`) | Published externally? |
|---|---|---|---|---|
| Agents With Keys | Yes — full `dispatch_body` (4,754 chars), `status: published` | Yes — currently shown on `/undrifted` | No | Yes — `paragraph.com/@undrifted/agents-with-keys` |
| Fables & Myths | Yes — full `dispatch_body` (1,278 chars), `status: published` | Yes — currently shown | No | Yes — `paragraph.com/@undrifted/fables-and-myths` |
| Agents of Chaos | Yes — full `dispatch_body` (3,220 chars), `status: published`, tagged `ISSUE 001` | **No — not featured** | No | Yes — `paragraph.com/@undrifted/agents-of-chaos` |
| Structural Drift | Yes — `dispatch_body` present, `status: published`, tagged `ISSUE 002` | **No — not featured** | No | Yes — `paragraph.com/@undrifted/structural-drift` |
| Measures Registry launch | No | No | **Yes — registered, full body** | No |
| Computational Systems Governance (NSF pitch) | No | No | **Yes — registered, full body** | No |

**No duplication of article *content* was found** — each article's actual text exists in exactly one place. What's duplicated is the **selection/curation state**: `measures_publication_dispatch` has 4 published articles, only 2 of which `measures_encounter_def` currently surfaces, and the file registry has 2 more articles that exist nowhere in the DB at all. This is consistent with — and now sharpens — the open content-authority question already raised by `oar2_establish_undrifted_publication_release_pipeline_v1`.

## 6. Duplication, Collapse, and Correctly Distinct Findings

**Duplicated authority:**
- `issue_record` — present in both `measures_publication_registry` and `measures_encounter_def`, **with a diverged value** (June 2026 vs. July 2026 for the same nominal Issue 001/launch edition). This is concrete, provable drift between two copies of the same field, not a hypothetical risk.
- `style_contract` — present in both, but **not duplicated so much as gutted in transit**: `measures_publication_registry` carries the full token set (`--undrifted-bg`, `--undrifted-blue`, etc., `visual_posture`, `texture_contract`, `forbidden_visual_patterns`); `measures_encounter_def` carries only `{"key": "undrifted_publication_style_v1"}`. The renderer only ever sees the stripped copy.
- `cover_story`, `brand_copy`, `role_call_feature`, `next_issue_teaser`, `footer_record`, `brand_assets` all exist in both tables in some form — not diffed field-by-field in this pass, but the pattern (same field names, two independently-editable locations, only one of which the renderer reads) is now established and should be assumed to risk the same drift as `issue_record` until checked.

**Collapsed concepts:**
- `/structural-drift` and `/publication/structural_drift` have both been collapsed into `/undrifted` at the route level (one by direct map, one by deprecated-surface fallback) — this is a **correctly executed** collapse, self-documented via `oar2_deprecate_stale_publication_dispatch_surface_v1`, not an accidental one.
- "Structural Drift" as a publication concept has been deliberately collapsed from its own section/route into `"structural_drift_standing": "diagnostic_trace_tag_only"` inside `measures_publication_registry`, per `publication_architecture_contract` — again, intentional and recorded, not drift.

**Legacy / superseded state:**
- `publication_dispatch` surface + its `PublicationDispatch` renderer component: dead, self-documented as deprecated, unreachable by any live route.
- `internal_route` values on 3 `measures_publication_dispatch` rows (`/publication/structural_drift/<key>`): stale references to a per-article-page architecture that was never wired into the orchestrator's route map and is now further orphaned by the `publication_dispatch` surface's own deprecation.

**Correctly distinct surfaces (not duplication):**
- `measures_registry` (gate: is this visitable at all) vs. `measures_publication_registry` (what is this publication) vs. `measures_encounter_def` (what does FREE render) — three genuinely different concerns, correctly separated in principle. The problem is not that they're distinct; it's that #2 and #3 overlap in field names without a sync mechanism.
- `measures_release_state` (generic sitewide launch-gating, 68 rows, no unDrifted-specific ones) vs. `measures_publication_release` (this session's new, narrow, unDrifted-issue-specific content-authority object) — **functionally distinct**, confirmed by inspecting `measures_release_state`'s columns and row count. The shared word "release" is a naming-proximity risk worth a documentation note, not a functional collision.
- `resolveEncounterStyleProfile()` / `encounterStyleProfile.ts`'s `data-layout-profile`, `data-composition-profile`, etc. vocabulary is **explicitly self-documented as "TEMPORARY, NON-AUTHORITATIVE," not yet consumed by any CSS** (confirmed by grep — zero matches in any stylesheet). This is honest, declared scaffolding, not hidden drift, and is a *third*, separate "design descriptor" surface from both `style_contract_key` (measures_encounter_def) and the full `style_contract` (measures_publication_registry) — noted for the record, not flagged as a problem in itself.

**Missing canonical object:**
- There is no single object today that is simultaneously (a) the authoritative publication identity, (b) the authoritative issue/release state, and (c) what the renderer reads. Ownership is split exactly as OBSERVED suspected.

### Direct Answers to the OAR2's Six Questions

1. **Is `/undrifted` duplicating publication identity?** No — it renders a subset of it, sourced from a table (`measures_encounter_def`) that was only ever intended to hold a rendering copy.
2. **Is publication identity duplicating `/undrifted`?** No — `measures_publication_registry` predates and exceeds what `/undrifted` renders; it is not derived from the route.
3. **Is `/publication/structural_drift` a dispatch surface or a publication registry object?** Neither, functionally — it's a deprecated route alias that happens to still resolve (to `/undrifted`'s content) because of a fallback in orchestrator code. Its underlying `publication_dispatch` surface and `PublicationDispatch` component are dead.
4. **Is Issue 01 duplicated between DB metadata and file registry?** Yes, and additionally *within* DB metadata itself (`measures_publication_registry` vs. `measures_encounter_def` disagree on the issue date) — four representations total, per §4.
5. **Is article state duplicated between DB metadata and registered assets?** Article *content* is not duplicated (each article's text exists once). Article *selection/curation state* is fragmented across three surfaces with no reconciliation (§5).
6. **Which object should own publication profile? Which should own issue release? Which should own route rendering?** Not answered here by design (`Executor may not resolve content authority by assumption`) — but the evidence points toward `measures_publication_registry` as the natural publication-profile owner (it's richer, older, and self-describes as the landing authority), the new `measures_publication_release` as the natural issue-release owner (built for exactly this seam), and `measures_encounter_def` as the natural route-rendering owner (already the only table the live renderer queries) — provided a sync mechanism is built so the latter stops silently diverging from the former two. This is an observation for the next OAR2 to weigh, not a decision made here.

---

## Recommended Next Governing Sequence

**Publication Registry normalization**, before Publication Release or Publication Encounter Profile work proceeds further.

Reasoning: the Publication Release pipeline (already seated, still pending an operator content decision) and the Publication Design Profile restoration (already recommended by the prior audit) **both write toward `measures_encounter_def`**, and both would inherit the same silent-divergence risk just identified between it and `measures_publication_registry` unless the relationship between these two tables is normalized first — i.e., establish which one is authoritative for which fields, and whether `measures_encounter_def` should be regenerated *from* `measures_publication_registry` (matching the original OAR2 intent) rather than hand-maintained in parallel. Doing Publication Release or Design Profile work first risks writing correct data into the wrong (or a third, still-unreconciled) location.

Not recommended as *next*, but noted as still-pending and unaffected by this audit's findings: the Issue 01 content-authority decision (`Assets/Releases/unDrifted/Issue01/issue01_content_authority_decision.meta.md`) and the Publication Design Profile restoration (`oar2_seat_undrifted_publication_design_profile_v1`, recommended by the prior audit) — both remain valid next steps, just sequenced after registry normalization for the reason above.

## Blockers

None for completing this audit. The substantive blocker it surfaces is downstream: no normalization work should proceed without an explicit operator/OAR2 decision on which table (`measures_publication_registry` vs. `measures_encounter_def`) is authoritative going forward, and whether the divergence already found (issue date, stripped style contract) should be resolved by reconciling toward the richer source or treated as an intentional fork.

## Files / Surfaces Inspected (no changes made)

```
DB tables: measures_registry, measures_encounter_def, measures_encounter_surface_assignment,
           measures_publication_registry, measures_publication_dispatch, measures_publication_release,
           measures_release_state, measures_media_map (rows), measures_publication_subscription_capture (columns only)
src/measures_registry/encounter_renderer/resolver/registryResolver.ts
src/measures_registry/encounter_renderer/MeasuresRegistryOrchestrator.tsx
src/measures_registry/encounter_renderer/chambers/LapisChamberRenderer.tsx
src/measures_registry/encounter_renderer/styles/encounterStyleProfile.ts
Assets/Issues/unDrifted/Issue01/issue01.meta.md
Assets/Releases/unDrifted/Issue01/release01.meta.md
Assets/Registry/asset_registry.md
docs/oar/measures_registry/oar1_seat_undrifted_publication_brand_and_style_contract_v1.meta.md
docs/oar/measures_registry/oar2_seed_undrifted_encounter_definition_from_registered_publication_records_v1.meta.md
docs/oar/measures_registry/oar2_deprecate_stale_publication_dispatch_surface_v1.meta.md (referenced via DB metadata)
docs/oar/measures_registry/oar2_deprecate_structural_drift_section_and_seat_undrifted_only_publication_architecture_v1.meta.md (referenced via DB metadata)
```
