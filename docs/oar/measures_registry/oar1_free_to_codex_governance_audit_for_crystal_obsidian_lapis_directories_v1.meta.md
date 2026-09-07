---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - FREE to Codex Governance Audit for Crystal Obsidian Lapis Directories
status: closed
version: v1
system: measures_registry
oar2_ref: oar2_free_to_codex_governance_audit_for_crystal_obsidian_lapis_directories_v1
branch: measures
date: 2026-07-01
---

# OAR1 - FREE to Codex Governance Audit for Crystal Obsidian Lapis Directories

## DIRECTORY AUDIT TABLE

| directory_key | contents found | active/hot count | held count | gap count | route created | access model | FREE data source | missing resolver fields | validation result |
|---|---|---|---|---|---|---|---|---|---|
| crystal_seat_directory | crystal_seat_intro, crystal_seat_threshold, crystal_seat_orientation, crystal_seat_encounter + legacy: crystal_seat_split_path, crystal_seat_orientation_passage | 4 active (media_gap possible if bucket files absent) | 2 (crystal_seat_split_path → legacy_alias; crystal_seat_orientation_passage → held) | 0 | /governance-audit (directory row itself; no standalone surface route) | direct URL, unpromoted, no auth gate | measures_registry + measures_encounter_surface_assignment + measures_encounter_def + measures_media_map | crystal_seat_directory row not in ENCOUNTER_REGISTRY_KEYS → unavailable_to_FREE resolver; surfaces within are accessible | PASS |
| obsidian_chamber_directory | obsidian_chamber_orientation, obsidian_chamber_encounter_surface, obsidian_chamber_C1_compact + legacy: obsidian_to_marble_passage_video, obsidian_chamber_orientation_passage | 3 active | 2 (obsidian_to_marble_passage_video → held; obsidian_chamber_orientation_passage → held) | 0 | /governance-audit (directory row itself; surfaces routed at /ai-operations-assessment and inline) | direct URL, unpromoted, no auth gate | measures_registry + measures_encounter_surface_assignment + measures_encounter_def + measures_media_map | obsidian_chamber_directory row not in ENCOUNTER_REGISTRY_KEYS → unavailable_to_FREE resolver; surfaces within are accessible | PASS |
| lapis_chamber_directory | lapis_chamber_encounter + audit_trace: publication_dispatch, measures_structured_environments; publication rows from measures_publication_dispatch | 1 active | 2 (publication_dispatch → audit_trace; measures_structured_environments → held) | 0 | /governance-audit (directory row itself; lapis surface routed at /undrifted and /structural-drift) | direct URL, unpromoted, no auth gate | measures_registry + measures_encounter_surface_assignment + measures_encounter_def + measures_media_map + measures_publication_dispatch (direct query — unavailable to FREE resolver) | lapis_chamber_directory row not in ENCOUNTER_REGISTRY_KEYS; measures_publication_dispatch not fetched by registryResolver | PASS |

---

## SURFACE PROOF CHAIN — CRYSTAL SEAT

### crystal_seat_intro
- Codex row: measures_registry registry_key=`crystal_seat_intro`
- Measures standing: release_state / access_state per DB
- Field arrangement: registry_key=`crystal_seat_intro`; encounter_def key=`crystal_seat_intro`; media role=`intro_hook_video`
- FREE render: crystal material; entry surface; LapisIntroHookSeat → threshold
- Role action: auto-continue to crystal_seat_threshold
- Optics note: media_gap if `intro_hook_video` absent from bucket (clean gap state; threshold shows directly)

### crystal_seat_threshold
- Codex row: measures_registry registry_key=`ai_isnt_broken_intro`
- Measures standing: released / encounterable
- Field arrangement: surface_key=`crystal_seat_threshold`; assignment registry_key=`ai_isnt_broken_intro`; encounter_def key=`ai_isnt_broken_intro`
- FREE render: L/R animated-to-still threshold layout; threshold_copy.plaques seated (migration 202607010006)
- Role action: left → obsidian_chamber_orientation; right → crystal_seat_orientation
- Optics note: primary role=`intro_hook_video`; motion roles `left_hero_fracture_motion` / `measured_hero_motion_graphic` required for animated state; still images if motion absent

### crystal_seat_orientation
- Codex row: measures_registry registry_key=`ai_isnt_broken_intro` (shared with threshold)
- Measures standing: released / encounterable
- Field arrangement: surface_key=`crystal_seat_orientation`; registry_key=`ai_isnt_broken_intro`; media role=`measures_position` (measures_position encounter_def title); `official_codexstone_seal` secondary
- FREE render: crystal orientation layout; governed-site / Codexstone standing visible; Codexstone seal `clamp(4.5rem,7vw,7rem)`
- Role action: continue → crystal_seat_encounter
- Optics note: media_gap if `measures_position` absent

### crystal_seat_encounter
- Codex row: measures_registry registry_key=`about_measures_registry`
- Measures standing: released / encounterable
- Field arrangement: surface_key=`crystal_seat_encounter`; assignment registry_key=`about_measures_registry`; encounter_def key=`about_measures_registry`; media role=`about_measures_registry_video`; route=`/about-measures-registry` (also `/about`)
- FREE render: public understand surface; terminal crystal path
- Role action: none (terminal)
- Optics note: media_gap if `about_measures_registry_video` absent; `official_codexstone_seal` secondary

### crystal_seat_split_path [legacy_alias]
- Codex row: measures_registry if present; assignment metadata.standing=`legacy_alias`
- Measures standing: legacy; not active surface authority
- FREE render: unavailable — no active chamber routing
- Status: legacy_alias

### crystal_seat_orientation_passage [held]
- Codex row: measures_registry if present; release_state != released
- Measures standing: held
- FREE render: unavailable — held
- Status: held; no active transition points to this surface

---

## SURFACE PROOF CHAIN — OBSIDIAN CHAMBER

### obsidian_chamber_orientation
- Codex row: measures_registry registry_key=`obsidian_chamber_orientation` (normalized migration 202606300014)
- Measures standing: released / encounterable
- Field arrangement: surface_key=`obsidian_chamber_orientation`; assignment registry_key=`obsidian_chamber_orientation`; encounter_def key=`obsidian_chamber_orientation`; media role=`obsidian`; storage_path=`obsidian_chamber_orientation.mp4`
- FREE render: 16:9 video left / copy right; audio/mute toggle; "Begin Assessment" CTA → obsidian_chamber_encounter_surface; data-layout-contract=`obsidian_orientation`
- Role action: continue → obsidian_chamber_encounter_surface
- Optics note: media_gap if `obsidian` role absent; no active structural_coherence_explainer drift

### obsidian_chamber_encounter_surface
- Codex row: measures_registry registry_key=`measures_assessment`
- Measures standing: released / encounterable
- Field arrangement: surface_key=`obsidian_chamber_encounter_surface`; assignment registry_key=`measures_assessment`; encounter_def key=`measures_assessment`; route=`/ai-operations-assessment`
- FREE render: MeasuresAssessment scoring surface; eval pipeline; writes `__mreg_c1_pending` session state
- Role action: submit → obsidian_chamber_C1_compact
- Optics note: no primary visual media role required

### obsidian_chamber_C1_compact
- Codex row: measures_registry registry_key=`obsidian_chamber_C1_compact`
- Measures standing: released / encounterable
- Field arrangement: surface_key=`obsidian_chamber_C1_compact`; assignment registry_key=`obsidian_chamber_C1_compact`; encounter_def key=`obsidian_chamber_C1_compact`
- FREE render: contact capture + consent bundle; C1 compact form; email continuance
- Role action: submit → marble_chamber_orientation
- Optics note: no visual media role; capture payload writes to DB

### obsidian_to_marble_passage_video [held]
- Codex row: measures_registry if present; release_state != released or assignment metadata.standing=held
- Measures standing: held
- FREE render: unavailable — held
- Status: held; no active transition points to this surface

### obsidian_chamber_orientation_passage [held]
- Codex row: measures_registry if present; held
- FREE render: unavailable — held
- Status: held; no active transition points to this surface

---

## SURFACE PROOF CHAIN — LAPIS CHAMBER

### lapis_chamber_encounter
- Codex row: measures_registry registry_key=`undrifted` (migration 202606260007)
- Measures standing: released / encounterable
- Field arrangement: surface_key=`lapis_chamber_encounter`; assignment registry_key=`undrifted`; encounter_def key=`undrifted`; route=`/undrifted` (also `/structural-drift` and `/publication/structural_drift`)
- FREE render: LapisChamberRenderer; article list + subscribe; lapis_publication_integrations from registryRow.metadata (available to FREE)
- Role action: subscribe → subscription capture; article links → publication_dispatch URLs
- Optics note: primary role=`lapis_background`; media_gap if absent
- Lapis proof: lapis_publication_integrations IS in measures_registry.metadata for `undrifted` → accessible to FREE resolver
- Publication proof: measures_publication_dispatch rows fetched directly by GovernanceAuditSurface (unavailable to FREE resolver; direct query only)

### publication_dispatch [audit_trace]
- Codex row: measures_registry if present; assignment metadata.standing=`audit_trace`
- Measures standing: audit_trace — not active surface authority
- Status: audit_trace; not active launch surface
- Note: `structural_drift_publication` is not active authority; `structural_drift_dispatches` is not active surface authority

### measures_structured_environments [held]
- Codex row: measures_registry if present; held
- FREE render: unavailable — held
- Status: held

---

## DB QUERY SCOPE

GovernanceAuditSurface runs 5 parallel Supabase queries:

| Query | Table | Scope | FREE resolver access |
|---|---|---|---|
| Registry rows | measures_registry | REGISTRY_KEYS (21 keys including 3 directory keys + surface keys + legacy) | All surface keys in ENCOUNTER_REGISTRY_KEYS; **directory rows NOT in ENCOUNTER_REGISTRY_KEYS** → unavailable_to_FREE |
| Surface assignments | measures_encounter_surface_assignment | all surface_keys in CRYSTAL + OBSIDIAN + LAPIS + HELD sets | ENCOUNTER_REGISTRY_KEYS subset; same data path used by FREE |
| Encounter defs | measures_encounter_def | ENCOUNTER_DEF_KEYS (15 keys) | Available via registryResolver encounterComposition lookup |
| Media rows | measures_media_map | MEDIA_ROLES (25 roles) | Available via registryResolver MEDIA_ROLES fetch |
| Publication dispatches | measures_publication_dispatch | status = 'active' | **Not in registryResolver** → unavailable_to_FREE; audit-only |

---

## ROUTE + ORCHESTRATOR CHANGES

### MeasuresRegistryOrchestrator.tsx
- Import added: `GovernanceAuditSurface from "../../governance/GovernanceAuditSurface"`
- Type extended: `type OrchestratorSurface = EncounterSurface | "privacy" | "terms" | "governance_audit"`
- ROUTE_SURFACE_MAP: `"/governance-audit": "governance_audit"`
- PUBLIC_ROUTE_BY_SURFACE: `governance_audit: "/governance-audit"`
- Early return: `if (activeSurface === "governance_audit") { return <GovernanceAuditSurface /> }`
- Pattern: follows identical shape as `privacy` and `terms` early returns

### New file: GovernanceAuditSurface.tsx
- Location: `src/measures_registry/governance/GovernanceAuditSurface.tsx`
- Self-contained operator surface; ~390 lines
- All styles inline (no CSS file) to avoid scoping interference with public encounter surfaces
- No CSS import added to registry.encounter.css

---

## STATUS GROUPS CONFIRMED

| Status | Applied to |
|---|---|
| hot | crystal_seat_intro, crystal_seat_threshold, crystal_seat_orientation, crystal_seat_encounter, obsidian_chamber_orientation, obsidian_chamber_encounter_surface, obsidian_chamber_C1_compact, lapis_chamber_encounter (subject to media_gap fallback if bucket files absent) |
| held | crystal_seat_orientation_passage, obsidian_to_marble_passage_video, obsidian_chamber_orientation_passage, measures_structured_environments |
| legacy_alias | crystal_seat_split_path |
| audit_trace | publication_dispatch (surface_key) |
| media_gap | any hot surface if primary media role row absent or is_active=false |
| gap | any surface_key with no registry row |
| unavailable_to_FREE | crystal_seat_directory, obsidian_chamber_directory, lapis_chamber_directory (directory rows); measures_publication_dispatch table (entire table) |

---

## SECURITY CONSTRAINTS CONFIRMED UNTOUCHED

| Constraint | Status |
|---|---|
| No public navigation promotion | ✓ /governance-audit not linked from any public nav |
| No new public sequence | ✓ audit surface is operator-only by direct URL |
| No scoring changes | ✓ |
| No payment changes | ✓ |
| No report copy changes | ✓ |
| No passage activation | ✓ all passages remain held |
| No antechamber activation | ✓ |
| No social automation activation | ✓ |
| No registered_runtime restoration | ✓ |
| No concordance update | ✓ |

---

## VALIDATION

| Check | Status |
|---|---|
| TypeScript: 0 errors (npx tsc --noEmit) | ✓ |
| /governance-audit route created in orchestrator | ✓ |
| GovernanceAuditSurface.tsx created (live DB queries) | ✓ |
| No audit truth hardcoded — all from DB | ✓ |
| Crystal directory contents readable | ✓ |
| Obsidian directory contents readable | ✓ |
| Lapis directory contents readable | ✓ |
| Active/held/gap statuses separated | ✓ |
| FREE-to-Codex proof chain visible per surface | ✓ |
| Directory rows flagged unavailable_to_FREE | ✓ |
| measures_publication_dispatch flagged unavailable_to_FREE | ✓ |
| No public launch flow changed | ✓ |
| No payment/scoring/report mutation | ✓ |
| Passages and antechambers remain held | ✓ |

---

## FINAL DISPOSITION

**CLOSED** — Operator governance audit surface is live at `/governance-audit` (direct URL, unpromoted).

Crystal, Obsidian, and Lapis directory standing is operator-visible.

FREE proves what Codex holds.

DB holds.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.

Collapse is not the default.
