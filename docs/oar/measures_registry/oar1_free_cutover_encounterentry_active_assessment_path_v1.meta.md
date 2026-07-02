---
document_type: oar1
authority_level: closeout
document_scope: measures_registry_launch_repair
title: OAR1 - FREE Cutover: EncounterEntry Active Assessment Path
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: oar2_free_cutover_encounterentry_active_assessment_path_v1
---

# OAR1 - FREE Cutover: EncounterEntry Active Assessment Path

## FINDING

The FREE pipeline cutover was already functionally complete before this OAR2 was executed.

`MeasuresRegistryRuntimeRegistered` was not imported in `App.tsx` or any active component. `MeasuresRegistryOrchestrator` (FREE encounter renderer) was the sole active renderer for the registry host and the default fallback.

This OAR2 execution confirmed the state, applied the formal registry decommission, and produced this evidence record.

## ROUTE EVIDENCE

| route | active renderer | source |
|---|---|---|
| /ai-operations-assessment | MeasuresRegistryOrchestrator → EncounterEntry → EncounterBoundary → ObsidianChamberRenderer | App.tsx line 233, 248 |
| / (registry host) | MeasuresRegistryOrchestrator | App.tsx line 233 |
| / (default) | MeasuresRegistryOrchestrator | App.tsx line 248 |

`MeasuresRegistryRuntimeRegistered` — not imported in any active file. Not reachable from any route.

## INSERT TARGET EVIDENCE

Table: `public.measures_iis_eval_gate1_capture`

| source_runtime | campaign_tag | count |
|---|---|---|
| free_encounter_renderer_v1 | measures_assessment_contact_gated_delivery | 18 |
| registered_runtime_v1 | iis_eval_gate1 | 15 (historical) |
| registered_runtime_v1 | measures_assessment_contact_gated_delivery | 7 (historical) |
| null | mixed | 15 (pre-tag historical) |

55 total captures. Most recent capture: 2026-07-02 02:32:58 UTC. Active inserts sourced from `free_encounter_renderer_v1`.

RLS policy `assessment_capture_insert_public` confirmed applied (migration 202606270001).

## WIRING DIFF

No App.tsx changes required — `MeasuresRegistryOrchestrator` was already the active renderer.

`onCaptureAssessment` path (already in place):

```
MeasuresRegistryOrchestrator.onCaptureAssessment (line 300)
  → supabase.from("measures_iis_eval_gate1_capture").insert(...)
  → passed to EncounterEntry → EncounterBoundary → ChamberRouter → ObsidianChamberRenderer
```

## REGISTERED RUNTIME DECOMMISSION

Migration applied: `202607020002_decommission_registered_runtime_active_standing`

```sql
UPDATE public.measures_registry
SET is_active = false, release_state = 'held', access_state = 'archived', ...
WHERE registry_key = 'measures_registry_runtime';
```

File: `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`
Header: `// ROLLBACK_ONLY — not_active_route_authority` (already present, confirmed correct)

## VALIDATION RESULTS

| check | result |
|---|---|
| /ai-operations-assessment loads through EncounterEntry | PASS — via MeasuresRegistryOrchestrator |
| Assessment questions load from DB | PASS — via registryResolver / measures_encounter_def |
| Insert target = measures_iis_eval_gate1_capture | PASS — 55 total rows, 18 from free_encounter_renderer_v1 |
| RLS policy applied | PASS — migration 202606270001 confirmed |
| Registered runtime not callable | PASS — not imported in any active file |
| measures_registry_runtime marked held in registry | PASS — migration 202607020002 applied |
| Duplicate assessment routes | NONE — single active path |

Items requiring live browser verification (cannot be confirmed from code):
- "Evaluation could not be seated" error no longer shown
- Result/evaluation renders after submission
- Email dispatch follows approved consent behavior
- Browser console clean
- Network POST returns 2xx

## REMAINING

None from this OAR2.

The full marble flow (`assessment → marble_chamber_orientation → marble_chamber_results → marble_chamber_C2_compact`) is now structurally complete and pending live walkthrough verification.
