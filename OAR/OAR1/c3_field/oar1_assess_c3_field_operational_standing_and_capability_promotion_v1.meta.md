---
document_type: oar1
authority_level: architecture
document_scope: c3_field_assessment
title: OAR1 - Assess c3 Field Operational Standing and Capability Promotion
closes: OAR/OAR2/c3_field/oar2_assess_c3_field_operational_standing_and_capability_promotion_v1.meta.md
operator: op044
system: c3_field
executor: Claude
date: 2026-07-09
---

# OAR1: Assess c3 Field Operational Standing and Capability Promotion

## Summary

Read-only architecture assessment. **No code, schema, migration, or runtime changes were made.** Evidence
was gathered from: all 26 closed OAR1 files under `OAR/OAR1/{commerce,infrastructure,launch,publication}/`;
the `src/` tree (`src/measures_registry/`, `src/c3_field_convergence/`, `src/measures_of_inanna/`,
`src/c1/`, `src/shared/c3/`); 131 Supabase migrations; and the full `c3 Field` documentation corpus under
`docs/c3_field/`, `docs/oar/c3_field/`, `docs/oar/c3_field_convergence/`, `docs/oar/c3field/`.

Headline finding: **no capability in this repo has actually been proven across two institutions.** Measures
Registry is the only live tenant; no `tenant_id`/`institution_id` column exists anywhere in the schema.
"Promotion to c3 Field" is therefore evaluated here on the strict 5-criterion test in the OAR2
(operationally demonstrated + institution-independent + reusable + authority-preserving + suitable for
multiple institutions) — and **almost nothing clears all five today**, including capabilities that already
live under c3-Field-prefixed tables. Most candidates land at **HOLD**, several land at **INSTITUTION ONLY**,
and one lands at genuine **PROMOTE**. This is the assessment's central, load-bearing conclusion, not a
formality — see §3.

---

## 1. c3 Field Capability Inventory (ROUTED §1)

| Capability | Purpose | Current implementation | Maturity | Dependencies | Owner | Evidence |
|---|---|---|---|---|---|---|
| OAR Operations Spine (Phase 1–2.1) | Durable, append-only audit trail of OAR process instances/transitions | `src/c3_field_convergence/operationsSpine.ts`, `oarSpineRegistry.ts`; tables `c3_oar_process_instance`, `c3_oar_transition_event`, `c3_oar_seeded_reference`; live console at `c3field.online` | **Operational** — RLS + append-only triggers verified live, anon-read confirmed, `c3field.online` renders `registry_backed` | Supabase project `zfihrspxvennjzazxcbj`, Cloudflare Pages | c3 Field | `docs/oar/c3_field_convergence/oar1_phase_2_1_production_persistence_seating_v1.meta.md`, `oar1_session_closeout_phase_2_1...v1.meta.md` |
| OAR Ops Spine Phase 3 (training/intel-recovery process) | Operator/training runbooks, closed-loop intel recovery template | `docs/operations/c3_field_convergence/*` | Conceptual/architectural — process docs only, explicitly "no runtime mutation" | Phase 2.1 spine | c3 Field | `oar1_phase_3_operations_training_and_intel_recovery_loop_v1.meta.md` |
| Transition Governance Engine | Derives branch pressure/correction/passage/release-cadence signals from spine data | `src/c3_field_convergence/transitionGovernanceEngine.ts` (209 lines, `read_only: true`) | Architectural/implemented, reusable — no confirmed UI wiring found | Ops Spine | c3 Field | code inspection |
| Concordance Authority | Governed semantic/authority substrate distinguishing DB-seated authority from markdown/frontend/snapshot state | Postgres schema `concordance_document/_version/_relation/_term`, `seeded_source_snapshot`; 58+ terms, 288+ relations live, append-only + RLS verified | **Operational/scalable** — most mature Field subsystem found | None (foundational) | c3 Field | `oar1_concordance_authority_migration_execution_authorization_v1.meta.md`, `oar1_session_close_concordance_authority_seating_expansion_v1.meta.md` |
| Runtime Audit / System Intelligence | Elevates institution runtime audits into DB-queryable, hash-verified governance intelligence | Concordance-seated rows (e.g. `measures_registry_runtime_audit_intelligence`: 1 doc / 1 version / 19 relations / 1 verified snapshot) | Operational/reusable | Concordance Authority | c3 Field | `docs/oar/c3field/oar1_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md` |
| Chamber Directory System | Requirement-state matrix + per-material-family contract taxonomy (`public_encounter`, `media`, `seo`, `buffer`, `webhook`, `secret_boundary`, `evidence` contracts) | `docs/oar/c3_field/chamber_directories/*` (crystal/lapis/obsidian/marble indices); confirmed `system_process_registry.metadata` can host a directory row without migration | Architectural, **explicitly not operational** — `registration_authorized: false` stated verbatim in every governing doc | Concordance Authority (referenced), `system_process_registry` | c3 Field | `chamber_directory_requirements_matrix_v1.meta.md`, `oar1_seat_chamber_directory_system_process_surface_and_run_db_schema_review_v1.meta.md` |
| TREE / Codex–Field–Branch Spine | Rooted-spine metaphor: Roots=Codex, Branches=institutions, non-collapse rule | `docs/c3_field/tree_operational_definition_review_surface_v1.md`, `docs/oar/c3_field/oar1_tree_ecology_systems_codability_review_v1.meta.md` | Conceptual — naming itself unresolved (two different acronym expansions across docs); every governing doc states "observation packet only, no execution authority granted" | None | c3 Field | above files |
| Codex Entity Registry | Seats legal/governance entities and their relationships to product branches | `codex_entity`/`_artifact`/`_relationship`; one row proven: `c3_community_partners_dao` (active, TN-registered), relationship `operates → measures_registry` | Implemented — one entity proven, pattern not exercised at scale | Loosely TREE; mechanically independent of Concordance | c3 Field | `oar1_codex_entity_seed_c3_community_partners_v1.meta.md` |
| Governed-participation / permission model | `c3_key_temp`, `_permission_map`, `_communication_trace`, `_system_function_audit`, `_source_oar_binding`, `_payment_standing` | Supabase tables exist (`c3_key_*` prefix) | Schema present; **actual enforcement/usage not verified in this read-only pass** — flagged as an open item, not assessed as operational | Unconfirmed | c3 Field (by naming convention) | migration scan only — see Blockers |
| Unified Environment Map | Defines c3 Field's four sub-environments (System Backend+Governance→c3 DAO, Public Encounter→Priceless Gallery/Measures of Inanna, Institutional Conversion→Measures Registry, Access+Payment→Acquire) | `docs/oar/c3_field/c3_field_unified_environment_map_v1.meta.md` | Conceptual — frontmatter `status: draft`, `deploy: do_not_deploy` | None | c3 Field | that doc |

## 2. Measures Registry Capability Inventory (ROUTED §2)

| Capability | Purpose | Current implementation | Maturity | Dependencies | Evidence |
|---|---|---|---|---|---|
| Publication Registry & Encounter Projection | Canonical publication identity (brand/style/issue metadata) vs. its render-ready projection | `measures_publication_registry` → regenerated via `scripts/regenerate-undrifted-encounter-projection.cjs` → `measures_encounter_def.metadata`, read by `registryResolver.ts` | Operational — live for DB-driven fields, drift-corrected repeatedly | Asset Registry, `measures_publication_release` approval gate | `oar1_seat_undrifted_publication_synchronization...v1`, `oar1_finalize_undrifted_launch_projection...v1` |
| Issue/Page Model & Editorial Rendering | Models Issue 001 as a governed page sequence (cover, editor's letter, contents, cover story, dispatches) | `measures_publication_issue_page` (6 rows, `page_role`/`release_state` enums), consumed by `LapisChamberRenderer.tsx` | Implemented, live-rendered; internal issue-page routing still hardcoded (`ROUTE_SURFACE_MAP`) | Publication Registry sync | `oar1_seat_undrifted_issue_page_model...v1`, `oar1_render_issue001_through_issue_page_model_v1` |
| Asset Registry & Sidecar Metadata Convention | File-based governance layer tracking every registered content asset independent of DB state | `Assets/Registry/asset_registry.md`; sidecar `file.ext`+`file.meta.md` convention; lifecycle `draft→registered→published→observed→revised→versioned` | Reusable/operational — used as backbone for every subsequent asset registration in the corpus | None (foundational) | `oar1_add_asset_registry_and_sidecar_metadata_convention_v1` |
| Campaign / Derivative / Distribution Pipeline | Governs transformation of a Publication Asset into platform-specific promotional content | Chain `measures_publication_campaign → _campaign_asset → _derivative_asset → _distribution_asset`, pointer-only, Human/AI actor attribution, `optics` scaffolding | Implemented, content-complete for Issue 001 (18 derivatives, 12 distribution assets) | Asset Registry, Publication Release gate | `oar1_register_issue001_launch_campaign_and_distribution_assets_v1` + 6 more |
| Buffer / Native Distribution Execution | Executes/publishes campaign content to social platforms with true-status evidence | `measures_distribution_executor/_channel/_execution` (newest architecture, 2026-07-09) | **Operationally proven at small scale** — 5 live Buffer drafts, 4 actually published, 1 real platform failure captured honestly | Campaign/Derivative pipeline, live Buffer credential (inconsistent across sessions) | `oar1_export_issue001_campaign_to_buffer_drafts_v1`, `oar1_publish_approved_issue001_buffer_drafts_v1`, `oar1_establish_native_distribution_execution_registry_v1` |
| Commerce / Stripe (MAP) | Paid checkout + webhook processing for MAP assessment pathway | `functions/api/map/create-checkout-session.ts`, `functions/api/stripe/webhook.ts`; `map_c2_circuit`, `map_payment_events`, `stripe_webhook_events` | Code fully implemented, **confirmed live in production** for the webhook leg (2026-07-09); one stuck order and an unresolved edge-layer 502 remain | Cloudflare Pages production secrets (recurring failure point) | `oar1_resolve_stripe_webhook_400_502_failures_v1`, `oar1_discover_stripe_checkout_blocker_and_verification_path_v1` |
| Chamber Architecture (renderer layer) | Four material-family React renderers (Crystal/Obsidian/Lapis/Marble) routed by `ChamberRouter.tsx` off a DB-seated `chamberAssignment` | `src/measures_registry/encounter_renderer/chambers/*.tsx`, `router/ChamberRouter.tsx` (explicitly "no DB access, no authority logic") | Operational | `registryResolver.ts`, encounter registry tables | code inspection (both agents independently found this) |
| Evidence Recording / OAR Discipline (as practiced inside Measures Registry) | Verify-live-state-before-writing, never fabricate missing content, disclose mismatches, gate irreversible actions | The OAR2→OAR1 template itself, applied identically across all 26 Measures Registry OAR1 files | Highly mature *pattern* — but see §4: this is not a Measures Registry capability at all; it already governs c3 Field's own work identically | None | present in every OAR1 file reviewed |

## 3. Capability Promotion Assessment (ROUTED §3)

Promotion requires **all five** of: operationally demonstrated · institution-independent · reusable ·
authority-preserving · suitable for multiple institutions. Applied strictly — architectural elegance alone
does not clear the bar.

| Capability | Decision | Rationale |
|---|---|---|
| OAR Discipline (OAR2→OAR1 lifecycle, verify-before-write, no-fabrication norm) | **PROMOTE** | Already operates identically across Measures Registry (commerce/publication/launch) **and** c3 Field's own Concordance/Spine/Codex work — the only capability in this repo with actual evidence of use across more than one domain, by the same mechanism, without modification. It was never institution-specific; it should be formally declared Field-owned rather than "migrated." |
| Asset Registry & Sidecar Metadata Convention | HOLD (ready) | Institution-independent by design, repeatedly demonstrated, authority-preserving (explicit lifecycle gate). Missing only a second live institution to prove portability — architecturally it has none of Measures Registry's brand/content baked in. |
| Distribution Execution Registry (`measures_distribution_executor/_channel/_execution`) | HOLD (ready) | The cleanest schema found: generic executor/channel/execution model, Human/AI actor attribution, evidence-jsonb, no Measures-Registry-specific columns. Real, honest execution evidence exists (published + failed states both captured truthfully). Not yet proven with a second tenant. |
| Campaign/Derivative/Distribution content pipeline (`measures_publication_campaign` chain) | INSTITUTION ONLY | Table names, FKs, and content model are bound to `measures_publication_*`; the pointer-only chain-of-custody *pattern* is promising but has not been abstracted from Measures Registry's schema. |
| Publication Registry & Encounter Projection | INSTITUTION ONLY | Deeply specific to the `undrifted` brand/style contract; single hardcoded `publication_key`. |
| Issue/Page Model | INSTITUTION ONLY | Issue 001 content-specific; the `page_role`/`release_state` sequencing idea is a future HOLD candidate at the pattern level only. |
| Commerce/Stripe (MAP) | HOLD (emerging) | Functional and live-verified, but implementation is raw fetch + manual HMAC tied to MAP-specific tables (`map_c2_circuit`). No institution-agnostic checkout/webhook abstraction exists yet — the *pattern* (multi-secret HMAC rotation handling) is reusable; the schema is not. |
| Chamber Architecture (renderer layer: Crystal/Obsidian/Lapis/Marble components) | INSTITUTION ONLY, with a flagged naming collision | See §4 — this is Measures-Registry-specific rendering code that happens to share a name and material taxonomy with c3 Field's still-unregistered "Chamber Directory" concept. They are not currently the same thing and should not be assumed to be. |
| Concordance Authority | Already Field-owned (not a promotion candidate — it never was Measures Registry's) | Operational/scalable, foundational; correctly positioned already. |
| Runtime Audit / System Intelligence | Already Field-owned | Operational/reusable; correctly positioned already. |
| Codex Entity Registry | Already Field-owned | One entity proven; correctly positioned; pattern needs more reps before it can itself be called "reusable." |
| Chamber Directory System (Field's contract-bundle concept) | HOLD (explicitly self-gated) | The system's own governing docs already say `registration_authorized: false` — this assessment defers to that existing gate rather than overriding it. |
| Governed-participation / permission model (`c3_key_*`) | HOLD — insufficient evidence to decide | Schema exists; this read-only pass could not confirm actual enforcement or call sites. Needs its own investigation before any promotion decision, not a default HOLD-as-placeholder. |
| TREE / Codex–Field–Branch Spine | HOLD (conceptual) | Explicitly non-executable by its own governing docs; nothing to promote yet. |
| Unified Environment Map | HOLD (conceptual, draft) | `deploy: do_not_deploy`; not authoritative by its own frontmatter. |

## 4. Architecture Boundary Review (ROUTED §4)

```
                        c3 FIELD (governance / shared substrate)
  ┌───────────────────────────────────────────────────────────────────────┐
  │  OAR Discipline (lifecycle norm — proposed PROMOTE, already shared)   │
  │  Concordance Authority  ── operational, foundational                  │
  │  OAR Operations Spine   ── operational (Phase 2.1) + conceptual (Ph3) │
  │  Codex Entity Registry  ── implemented (1 entity: c3 Community        │
  │                            Partners DAO --operates--> Measures Reg.)  │
  │  Chamber Directory (contract taxonomy) ── architectural, self-gated   │
  │  TREE spine / Unified Environment Map  ── conceptual, draft           │
  │  c3_key_* permission model ── schema exists, standing unverified      │
  └───────────────────────────────────────────────────────────────────────┘
                     ▲ operates-on / referenced-by (no formal binding)
                     │
  ┌───────────────────────────────────────────────────────────────────────┐
  │  MEASURES REGISTRY (institution — single live tenant)                 │
  │  Publication Registry & Encounter Projection  (institution only)      │
  │  Issue/Page Model & Editorial Rendering       (institution only)      │
  │  Chamber Architecture (Crystal/Obsidian/Lapis/Marble renderers)       │
  │  Campaign → Derivative → Distribution content pipeline                │
  │  Asset Registry & Sidecar convention  (HOLD/ready for Field)          │
  │  Distribution Execution Registry     (HOLD/ready for Field)           │
  │  Commerce/Stripe (MAP)                (institution only, pattern HOLD)│
  └───────────────────────────────────────────────────────────────────────┘
                     ▲
                     │  (no evidence found of onboarding to any Field-level
                     │   registry: Concordance, OAR Spine, or Distribution
                     │   Execution Registry)
  ┌───────────────────────────────────────────────────────────────────────┐
  │  FUTURE INSTITUTIONS (sibling code exists, not Field-integrated)      │
  │  src/measures_of_inanna/  — separate exhibition branch, no evidence   │
  │                              of Concordance/Spine/Distribution usage  │
  │  Priceless Gallery / c3 DAO / Acquire — named in Unified Environment  │
  │                              Map only; no code or schema found        │
  └───────────────────────────────────────────────────────────────────────┘
```

**Drift identified (recommend correction only — none implemented here):**

1. **Chamber naming collision.** Measures Registry's rendering layer uses "chamber" for four React
   components (`CrystalSeatRenderer`, `ObsidianChamberRenderer`, `LapisChamberRenderer`,
   `MarbleChamberRenderer`) selected via a DB-seated `chamberAssignment` field. c3 Field's own docs use the
   identical four material names for a *different* concept — "Chamber Directory" contract bundles
   (`docs/oar/c3_field/chamber_directories/{crystal,lapis,obsidian,marble}/`). No document declares a formal
   relationship between the two, and the Chamber Directory system remains `registration_authorized: false`.
   If Chamber Directory registration proceeds before this relationship is made explicit, there is real risk
   of the two "chamber" concepts being silently conflated.
2. **No tenant boundary exists to receive a promotion.** The Unified Environment Map names four
   sub-environments/institutions, but zero `tenant_id`/`institution_id` columns exist anywhere across 131
   migrations. Every "reusable" claim in this repo today is architectural, not reuse-tested — there is
   no second live tenant to promote *into*.
3. **Identity/permission duplication risk.** Measures Registry expresses role/authority informally via
   `role_call`/`role_key`-style fields inside its own tables; c3 Field has a parallel, more formal
   `c3_key_permission_map` model. Which is authoritative for identity was not resolved in the material
   reviewed — flagged as an open question for a future OAR2, not adjudicated here.
4. **TREE terminology is internally inconsistent.** Two governing c3 Field documents expand "TREE"
   differently ("Traced Rooted Encounter Environment" vs. "Thread Rooted Encounter Environment"). Minor, but
   worth resolving before TREE is cited as settled vocabulary in future OAR2s.

## 5. Operational Standing of c3 Field (ROUTED §5)

c3 Field, taken as a whole, stands at **architectural**, with two subsystems that have individually crossed
into **operational/scalable** (Concordance Authority; OAR Operations Spine Phase 2.1) and one into
**operational/reusable** (Runtime Audit / System Intelligence). It has not reached **reusable** or
**scalable** as a whole, because the defining test of those labels — a second institution actually
consuming a Field-owned registry — has not happened yet. Everything currently described as "reusable" in
Field documentation is reusable *by design*, not reusable *by demonstration*.

| Maturity level | What qualifies |
|---|---|
| Conceptual | TREE spine, Unified Environment Map, Chamber Directory registration, OAR Ops Spine Phase 3 |
| Architectural | Transition Governance Engine, Chamber Directory requirement matrix, `c3_key_*` schema |
| Implemented | Codex Entity Registry (1 entity), OAR Ops Spine Phase 1–2 (pre-2.1) |
| **Operational** | OAR Ops Spine (Phase 2.1, live+verified), Runtime Audit/System Intelligence |
| **Reusable** | Asset Registry convention (Registry-side, HOLD for Field), Distribution Execution Registry (Registry-side, HOLD for Field) |
| **Scalable** | Concordance Authority only (58+ terms, 288+ relations, proven append-only at volume) |

## 6. Future Capability Candidates (ROUTED §6)

| Candidate | Call | Rationale |
|---|---|---|
| Distribution Execution Registry | **Ready** | Cleanest, most institution-agnostic schema found; real (including failure) evidence already recorded honestly. |
| Asset Registry (sidecar convention) | **Ready** | File-based, zero schema coupling, proven repeatedly; trivially portable to any institution. |
| Publication Surface (generalized issue/page model) | Emerging | `page_role`/`release_state` pattern is sound but tightly coupled to Registry-specific style tokens/brand; needs real decoupling work before it is field-portable. |
| Metadata Renderer (`registryResolver.ts` / `encounterComposition.ts` / `ChamberRouter.tsx` pattern) | Emerging | Architecturally clean (`ChamberRouter` is explicitly "no DB access, no authority logic"), but the chamber *implementations* it routes to are Registry-styled; the router pattern itself is closer to ready than the renderers it wraps. |
| Identity | Held | No dedicated identity/auth module exists in `src` at all; `c3_key_*` tables exist but enforcement/usage was not verifiable in this read-only pass — needs its own investigation before any promotion conversation. |
| Commerce | Held | Stripe/webhook pattern is functional and live-verified, but implementation is raw fetch/manual HMAC tied to MAP-specific tables; no institution-agnostic checkout abstraction exists. |
| c3 Ledger | Held | No ledger concept found implemented anywhere; `c3_payment_standing` exists but was independently described elsewhere in this corpus as "synthetic only" — not yet started. |

## 7. Deliverables (ROUTED §7)

1. c3 Field capability inventory — §1
2. Measures Registry capability inventory — §2
3. Promotion matrix — §3
4. Architecture boundary map — §4
5. Maturity assessment — §5
6. Recommended promotion roadmap — below
7. Held concepts — §3/§6 (all rows marked HOLD)
8. Identified drift — §4
9. Recommended next architectural sequence — below

**Recommended promotion roadmap:**
1. Formally declare OAR Discipline as Field-owned governance (documentation-only change — no code moves).
2. Resolve the Chamber naming collision (§4.1) before any Chamber Directory registration proceeds.
3. Stand up a second real institution consumer (even a minimal one) against the Distribution Execution
   Registry or Asset Registry convention — this is the only way to convert "ready" HOLDs into genuine
   PROMOTEs, since no promotion criteria can be satisfied by architecture alone.
4. Investigate `c3_key_*` actual usage before making any identity-related promotion decision.
5. Resolve TREE terminology inconsistency and clarify its relationship (if any) to the Unified Environment
   Map, which remains an unauthoritative draft.

**Recommended next architectural sequence:** identity/permission investigation (`c3_key_*` standing) →
Chamber naming resolution → first second-institution pilot against Distribution Execution Registry.

---

## Validation

| Item | Result |
|---|---|
| Complete c3 Field inventory | §1 — 10 subsystems, each with maturity + evidence |
| Complete Measures Registry inventory | §2 — 8 capability clusters, each with maturity + evidence |
| Promotion decisions with rationale | §3 — every capability assigned PROMOTE/HOLD/INSTITUTION ONLY |
| Architecture boundary map | §4 — ASCII diagram + 4 drift findings |
| Maturity assessment | §5 — per-subsystem table + top-line Field standing |
| Future capability roadmap | §6/§7 |
| No implementation changes | Confirmed — zero files under `src/`, `functions/`, `supabase/migrations/` touched |
| No migrations | Confirmed — no new migration file created |
| No schema modifications | Confirmed |
| No runtime modifications | Confirmed |

## Blockers

None to this OAR2's own scope. Two items were explicitly **not** resolved because doing so exceeds a
read-only assessment and belongs in a future, narrower OAR2:
- `c3_key_*` governed-participation model's actual enforcement/usage could not be verified from schema
  inspection alone (needs code-level tracing of call sites).
- Whether `src/measures_of_inanna/` (the sibling exhibition branch) has any relationship to Field-level
  registries (Concordance, OAR Spine, Distribution Execution) was not found in the material reviewed —
  flagged as a gap, not resolved.

## Files Changed

```
OAR/OAR1/c3_field/oar1_assess_c3_field_operational_standing_and_capability_promotion_v1.meta.md   (this file)
```

No source, schema, migration, or runtime files were created, modified, or deleted.

## Deploy Note

Documentation-only deliverable. Nothing to deploy.
