---
document_type: oar1
authority_level: execution_record
document_scope: measures_registry_runtime
title: OAR1 - Correct Crystal Chamber Passage and Sparse Orientation Contract
status: completed_with_deployed_validation_held
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures-registry/oar2_correct_crystal_chamber_passage_and_sparse_orientation_contract_v1.meta.md
execution_date: 2026-06-04
---

# OAR1 - Correct Crystal Chamber Passage and Sparse Orientation Contract v1

## EXECUTION SUMMARY

OAR2 was executed.

`structure_passage` was rebound as the right-path talking-head passage.

`crystal_chamber` was seated as its own sparse orientation chamber.

The prior displaced About / Structural Drift / Foundational Leadership hub rendering was removed from `structure_passage`.

The Questions Explainer video was moved to the top of `crystal_chamber`.

Local runtime validation passed.

Deployed runtime validation is held pending source deployment.

## FILES CHANGED

- `src/measures_registry/registered_runtime/registeredRuntimeTypes.ts`
- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`
- `src/measures_registry/registered_runtime/renderers/RegisteredPublicUnderstand.tsx`
- `src/measures_registry/registered_runtime/renderers/RegisteredCrystalChamber.tsx`
- `src/measures_registry/registered_runtime/styles/encounters/public_understand.css`
- `docs/oar/measures-registry/execute-correct-crystal-chamber-passage-and-sparse-orientation-contract-v1.cjs`
- `docs/oar/measures-registry/oar2_correct_crystal_chamber_passage_and_sparse_orientation_contract_v1.meta.md`
- `docs/oar/measures-registry/oar1_correct_crystal_chamber_passage_and_sparse_orientation_contract_v1.meta.md`

## DB MUTATION SUMMARY

Execution script:

`docs/oar/measures-registry/execute-correct-crystal-chamber-passage-and-sparse-orientation-contract-v1.cjs`

Live DB actions:

- updated `measures_encounter_def` row `structure_passage`
- seated `structure_passage_contract_v1`
- seated `crystal_chamber_sparse_orientation_contract_v1`
- created or updated `measures_registry` row `crystal_chamber`
- created or updated `measures_encounter_def` row `crystal_chamber`
- inserted transition `structure_passage -> crystal_chamber`
- inserted transition `crystal_chamber -> eval_passage`
- seated exact public URL on active talking-head media roles:
  - `structured_environment_passage_video`
  - `measures_structured_enviroments`

DB readback:

```json
{
  "structure_passage": "talking_head_passage_bound",
  "crystal_chamber": "sparse_orientation_chamber_bound",
  "talking_head_media_roles_updated": [
    "structured_environment_passage_video",
    "measures_structured_enviroments"
  ],
  "structure_to_crystal_transition": "already_exists",
  "crystal_to_assessment_transition": "already_exists",
  "auto_advance_target": "crystal_chamber",
  "assessment_cta_target": "eval_passage",
  "validation": "PASS"
}
```

## SURFACE KEYS CORRECTED

Registered surface added:

- `crystal_chamber`

Route mapping added:

- `?surface=crystal_chamber`

Route behavior:

- `structure_passage` Continue routes to `crystal_chamber`
- `structure_passage` Skip routes to `crystal_chamber`
- `structure_passage` video `onEnded` routes to `crystal_chamber`
- `crystal_chamber` Assess CTA routes to `eval_passage`

## STRUCTURE PASSAGE STANDING

`structure_passage` now renders:

- talking-head passage video
- Measures Registry position paragraph
- Audio / Mute control
- Skip control
- Continue control

`structure_passage` no longer renders:

- Questions Explainer video
- About Measures Registry hub
- Structural Drift card-grid
- Foundational Leadership hub/card layout
- Assess CTA

Local validation:

```json
{
  "dataSurface": "structure_passage",
  "h1": "Understand the Environment",
  "hasPositionParagraph": true,
  "hasAudioOrMute": true,
  "hasSkip": true,
  "hasContinue": true,
  "videos": [
    {
      "aria": "Understand the Environment passage",
      "controls": true,
      "src": "https://media.c3field.online/measures_structured_enviroments.mp4"
    }
  ]
}
```

## CRYSTAL CHAMBER STANDING

`crystal_chamber` now renders:

1. Questions Explainer video
2. Structural Drift section
3. Foundational Leadership CTA
4. Assess the Environment CTA

Local validation:

```json
{
  "dataSurface": "crystal_chamber",
  "h1": "What the Questions Reveal",
  "hasStructuralDrift": true,
  "hasFoundationalLeadership": true,
  "hasAssessEnvironment": true,
  "videos": [
    {
      "aria": "Questions Explainer",
      "controls": true,
      "src": "https://media.c3field.online/questions_ungoverned_systems_cannot_answer.mp4"
    }
  ]
}
```

## ROUTE VALIDATION

Local route behavior:

```json
{
  "continueCount": 1,
  "skipCount": 1,
  "afterContinue": "http://127.0.0.1:4189/?surface=crystal_chamber",
  "assessCount": 1,
  "afterAssess": "http://127.0.0.1:4189/?surface=eval_passage",
  "afterSkip": "http://127.0.0.1:4189/?surface=crystal_chamber"
}
```

Auto-advance standing:

- DB contract target: `crystal_chamber`
- source wiring: `RegisteredPublicUnderstand` video `onEnded={onContinueToCrystal}`
- local synthetic event validation was blocked by the browser read-only evaluation scope
- source and DB authority both confirm the video-ended route

## BUILD VALIDATION

Command:

```powershell
npm.cmd run build:registry
```

Result:

- build passed
- 102 modules transformed
- only warning: existing Vite chunk-size warning over 500 kB

No deployment artifact was retained in this OAR1 route.

## DEPLOYED RUNTIME VALIDATION

Checked deployed routes:

- `https://measuresregistry.com/?surface=structure_passage`
- `https://measuresregistry.com/?surface=crystal_chamber`

Observed deployed standing:

- `structure_passage` still renders the pre-deployment hub behavior
- `structure_passage` still includes both the talking-head passage video and Questions Explainer video
- `crystal_chamber` is not yet recognized by deployed runtime and resolves back to intro

Conclusion:

Deployed runtime validation is held pending deployment of the source split.

This is not a DB seating failure. The live DB contract is seated and local runtime resolves it. The deployed bundle has not yet received the source change.

## BOUNDARY VALIDATION

No pricing, payment, c3 Key, temp c3 Key, C1/C2/C3, commerce circuit, permission standing, conversion standing, certification standing, DAO standing, or distribution standing was seated or rendered in the corrected local surfaces.

Foundational Leadership remains a CTA/conversation invitation only.

Assessment CTA routes to `eval_passage`.

## UNRESOLVED DEPENDENCY

Deployment is required before `https://measuresregistry.com/?surface=crystal_chamber` can pass live deployed validation.

The current worktree has pre-existing staged Measures Registry changes in runtime files. Those changes were preserved and were not force-committed into this OAR1 closeout.

## RECOMMENDED NEXT ROUTE

Deploy or commit/push the scoped source split only after resolving the existing staged Measures Registry batch boundary.

Then rerun deployed validation:

- `https://measuresregistry.com/?surface=structure_passage`
- `https://measuresregistry.com/?surface=crystal_chamber`

## CLOSE

structure_passage carries the passage.

crystal_chamber holds the sparse orientation.

Questions explain from the chamber.

Assessment begins from the chamber.

No standing is granted.

Measures registers.

src renders seated runtime state only.
