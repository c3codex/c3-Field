---
document_type: baseline
authority_level: working
document_scope: map_environment_measure
title: Baseline — Measure Measures of Inanna Operational Environment
status: filed
version: v1
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_measure_measures_of_inanna_operational_environment_v1.meta.md
executor: claude
observation_time: 2026-07-15
---

# Baseline — Measure Measures of Inanna Operational Environment

Governed discovery evidence for OAR2 ROUTED sections 1 and 2. Read-only. No operational mutation performed.

## 1. Seeded-reference preflight

Executor: Claude. Method: direct query against `c3_oar_seeded_reference`, `concordance_document`, `concordance_version`, `system_process_registry`. Observation time: 2026-07-15.

### 1.1 `c3_oar_seeded_reference` (5 rows — full table)

| seeded_reference_key | type | seeded_status | path |
|---|---|---|---|
| c3field_online_infrastructure_activation_v1 | infrastructure | active_infrastructure_reference | docs/oar/c3_field_convergence/oar1_c3field_online_infrastructure_activation_v1.meta.md |
| executor_routing_new_moon_to_lions_gate_2026_v1 | role | seeded | docs/oar/c3_field/oar1_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.meta.md |
| foundational_role_registration_v1 | role | active_process_reference | docs/oar/c3_field_convergence/oar1_foundational_role_registration_v1.meta.md |
| phase_1_oar_operations_spine_v1 | process | seeded | docs/oar/c3_field_convergence/oar1_phase_1_oar_operations_spine_v1.meta.md |
| phase_1_operational_spine_validation_refinement_v1 | validation | seeded | docs/oar/c3_field_convergence/oar1_phase_1_operational_spine_validation_refinement_v1.meta.md |

**Finding:** none of this OAR2's own `source_alignment` list (Seed Concordance, The 21 of Coherence, Thread-to-Transfer Validation Rule, Seeded Reference Control, Doc-Set Closeout Rule, OAR Lifecycle — Execution and Handoff, DB to src Manifest — Measures of Inanna Exhibition, Measures Registry Operative Concordance Update, Chazz Systems Launch and Research Advisor Role Profile, OAR1 Restore Inanna Foundational Public Encounter Standing, OAR1 Register New Moon to Lion's Gate Inanna SEAT Initiative) has a matching row in `c3_oar_seeded_reference`. This table's registered scope is infrastructure/role/process seeding for c3 Field Convergence and the New Moon initiative, not Measures-of-Inanna structural or MAP-function seeding. Per OAR2 instruction, committed is not treated as equivalent to seeded.

### 1.2 `concordance_document` / `concordance_version` (5 documents, 5 versions — full tables)

| document_key | authority_standing | visibility_standing | version_standing |
|---|---|---|---|
| seed_concordance | active | internal | active |
| seed_concordance_governance_usage_change_control | active | internal | active |
| concordance_authority_seating_system_intelligence | active | internal | active |
| measures_registry_runtime_audit_intelligence | active | internal | active |
| measures_registry_sitewide_style_contract | active | internal | active |

`seed_concordance` v1 is DB-seated and active — this satisfies "Seed Concordance" from the source_alignment list. Classification: **working** (DB-active governance content; not present in the `c3_oar_seeded_reference` seeded registry, so cannot be called "seeded" under this OAR2's stricter definition).

`concordance_term` rows sampled for "The 7 Agreements" and "The 7 Resolutions of Coherence" (both `active`, axis `Coherence`) exist under `seed_concordance_v1`. **No term matching "The 21 of Coherence" was found** by label search — only two 7-item sets (14 total) are DB-seated under the Coherence axis. Classification: **unresolved** for "The 21 of Coherence" as a distinct seeded object; the two 7-sets that are DB-seated are **working**.

### 1.3 File-existence check for remaining source_alignment titles (repo grep, 2026-07-15)

| Referenced title | Disposition |
|---|---|
| OAR1 — Restore Inanna Foundational Public Encounter Standing | **found**: `docs/oar/measures_of_inanna/oar1_restore_inanna_foundational_public_encounter_standing_v1.meta.md` (+ paired OAR2). Working. |
| OAR1 — Register New Moon to Lion's Gate Inanna SEAT Initiative | **found**: `docs/oar/c3_field/oar1_register_new_moon_to_lions_gate_inanna_seat_initiative_v1.meta.md`. Working. |
| Thread-to-Transfer Validation Rule / Seeded Reference Control / Doc-Set Closeout Rule / OAR Lifecycle — Execution and Handoff | **referenced only** inside `docs/oar/c3_field/oar1_concordance_authority_migration_execution_authorization_v1.meta.md` and sibling phase-three-tree-seating OARs as concepts — no standalone titled document confirmed under those exact names. Classification: **proposed** (named and used, not independently seated as their own document).
| DB to src Manifest — Measures of Inanna Exhibition | **not found** as an exact title; closest repo hits are unrelated OAR2s (media migration, structure/environment audit) that use similar phrasing. Classification: **unresolved**. |
| Measures Registry Operative Concordance Update | **not found** as an exact title; grep hits are unrelated `oar2_correct_*` docs. Classification: **unresolved**. |
| Chazz Systems, Launch, and Research Advisor Role Profile | **not found** anywhere except inside this OAR2's own metadata. Classification: **unresolved** — no independently locatable source. |

**Limitation:** this is a title/keyword grep across `docs/`, not a semantic reconciliation. A document could exist under a materially different filename. Recorded as a limitation per OAR2 evidence discipline, not resolved further under this bounded discovery pass.

## 2. Repository and branch preflight

Executor: Claude. Method: `git rev-parse`, `git status --porcelain=v1 -uall`, `git worktree list`. Observation time: 2026-07-15.

- Repository root: `c:\Users\c3DAO\OneDrive\Apps\c3Field`
- Active branch: `measures`
- Current commit: `e0baca7fb7271f8369ed2fde83f733c69199c6e4` ("Close multi-pass workspace filing")
- Worktree standing: one modified tracked file (`.mcp.json`), one untracked file (this OAR2 itself). No other uncommitted changes.
- `.mcp.json` change (observed via `git diff`, no secret values present): the Supabase MCP server entry was switched from a local `npx @supabase/mcp-server-supabase` stdio command (expecting a `%CLAUDE_ACCESS%` token) to the hosted `https://mcp.supabase.com/mcp?project_ref=zfihrspxvennjzazxcbj...` HTTP endpoint. This is why Supabase MCP tool calls succeeded in this session — [[project_supabase_migration_ledger_drift]] recorded MCP as unauthorized as of 2026-07-14 under the prior stdio configuration; that limitation no longer holds under the new hosted-MCP config.
- Second worktree present (unrelated to this OAR2, not touched): `c3Field-deploy-assessment-fixes` at `eb837d7` on branch `codex/deploy-assessment-seating-fixes`.
- Relevant application directories: `src/measures_of_inanna/`, `src/measures_registry/` (`encounter_renderer/`, `governance/`, `optics/`, `registered_runtime/`), `src/c1/antechamber/`, `src/shared/`, `src/surfaces/encounter/`, `src/c3_field_convergence/`.
- Relevant build commands (`package.json` scripts): `build:inanna` → `vite build --mode inanna --outDir dist-inanna`; `build:registry` → `vite build --mode registry --outDir dist-registry` (+ route-head generation); `build:c3field` → `vite build --mode c3field --outDir dist`. No `dist-inanna` build output present in the working tree at observation time (nothing built locally to inspect).
- Relevant deployment configuration: none found at repo root (no `vercel.json`, `netlify.toml`, `wrangler.toml`) and no `.github/workflows/` directory. Deployment automation for Measures of Inanna is **not verifiable from this repository checkout** — recorded as a limitation, not an absence of deployment (an external/manual deploy path is plausible but unconfirmed).
- Environment configuration names: not enumerated by value (no secret values read); `scripts/check-pages-env.cjs` referenced by the `inanna`/`registry`/`c3field` build scripts implies a Pages-style env-check gate exists in the build pipeline.
- `supabase/migrations/`: 158 local migration files present.

No secrets were read or exposed in the course of this preflight.
