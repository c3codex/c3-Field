---
document_type: ai_deployment_inventory
authority_level: working
document_scope: map_environment_measure
title: Measures of Inanna — AI Deployment Inventory
status: filed
version: v1
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_measure_measures_of_inanna_operational_environment_v1.meta.md
executor: claude
observation_time: 2026-07-15
---

# Measures of Inanna — AI Deployment Inventory

Governed discovery evidence for OAR2 ROUTED sections 10, 11, 12, 15. Read-only. No automation, deployment, or FREE admission activation performed.

## 10. AI Deployment Inventory

Source tables: `c3_role_contract` (5 rows, full table), `c3_evidence_contract` (5 rows, full table), `c3_ai_action_boundary` (2 rows, full table), `system_oar_log` (2 rows), `system_oar_queue` (4 rows), `system_oar_execution_evidence` (9 rows).

| Surface | Role | Authority boundary | Input | Output | Control point | Review req. | Evidence location | Current standing | Known failure mode | Human decision boundary |
|---|---|---|---|---|---|---|---|---|---|---|
| Chazz Systems Advisement (New Moon 2026) | `chazz_systems_advisement_new_moon_to_lions_gate_2026`, scope `c3_field` | review-only (`runtime_authority_allowed: false`, `mutation_authority_allowed: false`, `review_authority_allowed: true`) | OAR2 instruction + prior evidence | advisory review output | pre-execution review | `operator_confirmation_required: true` | `chazz_systems_evidence_new_moon_to_lions_gate_2026` (`evidence_state: ready`) | active | none observed in this pass | operator confirms before any Chazz-reviewed action proceeds |
| Claude Codex Database Advisement (New Moon 2026) | `claude_codex_database_advisement_new_moon_to_lions_gate_2026`, scope `c3_field` | review-only, same boundary shape as Chazz | DB read queries | advisory findings | pre-execution review | `operator_confirmation_required: true` | `claude_codex_database_evidence_new_moon_to_lions_gate_2026` (`ready`) | active | none observed | operator confirms |
| Cody Source/FREE Advisement (New Moon 2026) | `cody_source_free_advisement_new_moon_to_lions_gate_2026`, scope `c3_field` | review-only | source/FREE rendering review | advisory findings | pre-execution review | `operator_confirmation_required: true` | `cody_source_free_evidence_new_moon_to_lions_gate_2026` (`ready`) | active | none observed | operator confirms |
| Measures of Inanna Role Contract | `measures_of_inanna_role_contract`, scope `measures_of_inanna` | **no runtime, mutation, or review authority granted** (`role_state: held`) | — | — | — | `operator_confirmation_required: true` | `measures_of_inanna_evidence_contract` (`evidence_state: held`) | held | role contract itself is held — no AI executor currently holds standing authority to act inside Measures of Inanna proper | operator must seat the role before any AI-driven action inside this branch |
| Measures Registry Role Contract | `measures_registry_role_contract`, scope `measures_registry` | no runtime/mutation authority; `role_state: ready` (one step short of active) | — | — | — | `operator_confirmation_required: true` | `measures_registry_evidence_contract` (`ready`) | ready, not yet active | — | operator activates |
| `c3_ai_action_boundary` — measures_of_inanna | `assistant_executor_support` | `authority_allowed: false`, `mutation_allowed: false`, `proposal_allowed: true`, `execution_allowed: false` | operator-issued OAR | proposals only | `requires_oar: true`, `requires_operator_confirmation: true` | required | boundary row itself | active | — | operator confirmation gates every action |
| `c3_ai_action_boundary` — measures_registry | same shape as above | same | same | same | same | required | boundary row itself | active | — | operator confirmation gates every action |

**Key finding:** no AI role or action boundary anywhere in this inventory grants `mutation_allowed`, `execution_allowed`, or `authority_allowed`. Every AI surface found (Chazz, Cody, Claude, the two `c3_ai_action_boundary` rows) is proposal/review-only with mandatory operator confirmation. This matches the OAR2's own EXECUTOR ROLE section and was independently confirmed from live DB rows, not assumed.

**OAR/queue lifecycle evidence** (`system_oar_log`, `system_oar_queue`, `system_oar_execution_evidence` — full tables, all rows):
- Two closed `system_oar_log` rows: OAR-process DB seating (closed) and OAR2-execution-model validation (validated — "slower at initial definition, safer during execution, cleaner at closeout, effective at reducing frontend-authority leakage").
- Four `system_oar_queue` rows, all `closed` or `completed`. Three of four record `db_mutation_standing: not_authorized` / `src_mutation_standing: not_authorized` / `deploy_standing: not_authorized` (health/failure-state validation cycles, and the executor-routing addendum). One (`new_moon_to_lions_gate_2026_registration_queue`) records `db_mutation_standing: mutated` — the only queue in this table that performed a DB write, and its `execution_boundary` explicitly excludes "FREE cutover, public release, legacy retirement, Phase Calendar mutation, held encounter activation, Priceless Gallery launch."
- Nine `system_oar_execution_evidence` rows trace each queue to a concrete artifact path (`docs/oar/...meta.md` or `supabase/migrations/...sql`). One evidence row explicitly records a known gap left unpatched by design: `c3_oar_transition_event.actor` check constraint does not include `claude` — recorded as an exact gap in that prior OAR2's evidence, not remediated here (out of this OAR2's scope; carried forward to the missing/held register).

## 11. Runtime and deployment inventory

- **Database read path:** `measures_registry` (registry identity/sequence/release/access) → `measures_encounter_def` (encounter surface shape) → `measures_release_state` (explicit current release/access, joined by `registry_id`) → `measures_transition_rule` (progression/return edges).
- **Resolver path (repo, `src/`):** `src/measures_of_inanna/resolve_encounter.ts` and `src/measures_registry/encounter_renderer/resolver/registryResolver.ts` are the two resolver entry points found; `src/measures_registry/encounter_renderer/MeasuresRegistryOrchestrator.tsx` composes them with `src/measures_registry/encounter_renderer/composition/encounterComposition.ts`.
- **Renderer path:** chamber renderers exist per material at `src/measures_registry/encounter_renderer/chambers/{CrystalSeatRenderer,LapisChamberRenderer,MarbleChamberRenderer}.tsx`; no dedicated `ObsidianChamberRenderer.tsx` was found by name in this pass (obsidian-family encounters may route through a shared/generic renderer — not confirmed either way; recorded as a limitation, not a defect).
- **Build targets** (`package.json`, verified by reading the file): `build:inanna` → `vite build --mode inanna --outDir dist-inanna`; `build:registry` → `vite build --mode registry --outDir dist-registry` (+ `generate-registry-route-heads.cjs`); `build:c3field` → `vite build --mode c3field --outDir dist`. All three gate on `scripts/check-pages-env.cjs` first.
- **Generated bundle standing:** no `dist-inanna/`, `dist-registry/`, or `dist/` directory exists in the current working tree — nothing was built locally in this pass, and no stale bundle was found to be stale (there is simply none present to inspect).
- **Deployment target / domain routing:** not found in-repo — no `vercel.json`, `netlify.toml`, `wrangler.toml`, or `.github/workflows/`. Cloudflare R2 is used for media storage (confirmed via `codex_media_asset.storage_provider`) but that is a storage dependency, not confirmed evidence of the deploy target itself. **Deployment automation for Measures of Inanna could not be verified from this repository checkout** — recorded as a limitation.
- **Cache/stale-bundle exposure, fallback behavior, browser-visible failure states:** not independently verified in this pass (no browser QA was performed under this OAR2's read-only, non-runtime-mutating scope). Distinguished from the OBSERVED section's prior repaired failure (foundational traversal restoration), which is historical and already recorded in the source OAR2's OBSERVED section, not re-verified here.

## 12. FREE admission discovery

Source: `c3_runtime_admission_contract` (2 rows, full table), `c3_runtime_admission_binding` (3 rows, full table), `c3_chamber_directory_binding` (7 rows, full table).

- **Measures of Inanna admission:** `admission_state: not_seated`, `release_state: held`, `access_state: held`, `public_runtime_allowed: false`, `runtime_activation_allowed: false`. Blocker reason (verbatim): "Spine standing is registered and held; runtime admission requires optics, evidence, trace, correction, AI action boundary, and role contracts."
- **Measures Registry admission:** `admission_state: admitted`, `release_state: released`, but `access_state: restricted` and `public_runtime_allowed: false` — admitted structurally but still not public. Same blocker class cited: optics/evidence/trace/correction/AI-action-boundary/role contracts.
- **Required registry standing:** all Measures-of-Inanna-scoped registry rows for the released tier (foundational + Gates 1–3 + Epithets 1–3 + ME 01 + Codexstone) are already `release_state: released` at the row level — the blocker is at the **system-level admission contract**, not at individual encounter rows.
- **Required branch/resolver/renderer standing:** resolver and renderer code paths exist (section 11) but their live wiring to a seated runtime-admission contract was not independently traced end-to-end in this pass.
- **Required evidence:** the six named contract types (optics, evidence, trace, correction, AI action boundary, role) — `c3_optics_contract` (3 rows), `c3_evidence_contract` (5 rows, includes `measures_of_inanna_evidence_contract: held`), `c3_trace_contract` (2 rows), `c3_correction_contract` (2 rows), `c3_ai_action_boundary` (2 rows, both active), `c3_role_contract` (includes `measures_of_inanna_role_contract: held`). Role and evidence contracts for `measures_of_inanna` are confirmed `held`; optics/trace/correction contract standing for `measures_of_inanna` specifically was not individually re-verified row-by-row in this pass (recorded as a limitation).
- **Unresolved blockers:** the `measures_of_inanna_role_contract` and `measures_of_inanna_evidence_contract` being `held` is sufficient by itself to block admission per the stated blocker reason.
- **Prohibited premature actions (confirmed not taken):** no admission state was changed, no binding was created or altered, no FREE cutover was performed, no public route was activated. This is discovery only.

## 15. Dashboard read-model discovery

- `measures_registry_policy_scope_isolation` (32 rows; sampled the `measures_*`-prefixed subset — 10 rows shown) records per-table anon-read/anon-write/protection scope, but is a **policy scope registry**, not a rendered dashboard.
- No view, materialized view, or function was found in `information_schema` that joins branch standing + encounter completeness + release/access + asset completeness + evidence completeness + FREE readiness + risk into a single read surface. `src/measures_registry/governance/GovernanceAuditSurface.tsx` exists in-repo and is a plausible dashboard-shaped component, but its data source was not traced against the tables above in this pass.
- **No coherent existing read model was found.** Per OAR2 instruction, this is recorded as a requirement gap only — no dashboard, view, table, or function was created here.
