---
document_type: oar1
authority_level: closeout
document_scope: measures_registry_evaluation_encounter_contract_v2
title: OAR1 - Measures Registry Evaluation Encounter Contract v2
status: completed_git_deploy_ready
version: v2
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_measures_registry_evaluation_encounter_contract_v2.meta.md
tags:
  - measures-registry
  - evaluation-encounter
  - db-contract
  - measures-branch
  - git-connected-deploy
---

# OAR1 - Measures Registry Evaluation Encounter Contract v2

## CLOSED SCOPE

Seated the Measures Registry evaluation encounter contract v2 as DB authority before runtime deployment.

This closeout is for the Measures branch path only. It does not deploy or promote `c3field.online` production.

## DB CONTRACT SEATED

Execution:

```powershell
node docs/oar/measures_registry/execute-measures-registry-evaluation-encounter-contract.cjs
```

Evidence:

```text
docs/oar/measures_registry/measures_registry_evaluation_encounter_contract_v2_evidence.json
```

Live readback confirmed:

- `measures_registry.registry_key = measures_ai_operational_evaluation`
- `release_state = released`
- `access_state = callable`
- `is_active = true`
- `measures_encounter_def.encounter_key = measures_ai_operational_evaluation`
- `renderer_key = measures_registry_evaluation_chamber`
- `theme_key = evaluation_chamber_lapis_obsidian_v1`
- `encounter_contract.version = v2`
- `question_count = 5`
- `answer_count = 15`
- `returned_standing = Structural Drift Detected`
- `returned_assessment_title = Structural Drift Detected`

## SEATED MEDIA

All required media roles resolved to existing `measures-registry` bucket assets.

| media_role | storage_path | provider | status |
| --- | --- | --- | --- |
| `lapis_background` | `lapis_background.webp` | `supabase` | public HEAD 200 |
| `registry_watermark` | `measures_registry_emblem_watermark_preview_lapis.webp` | `supabase` | public HEAD 200 |
| `registry_mark` | `measures_registry_mark.webp` | `supabase` | public HEAD 200 |
| `evaluation_reference_image` | `evaluation_chamber_reference.webp` | `supabase` | public HEAD 200 |

## SEATED V2 CONTRACT

The DB contract now includes:

- returned assessment title/body
- operational risk standing
- important clarification
- continue prompt
- styling contract fields
- icon contract fields

Icon roles seated:

- `assessment_icon = clipboard_check`
- `warning_icon = triangle_alert`
- `relation_icon = network`
- `governance_icon = shield`
- `continuation_icon = arrow_right`
- `visibility_icon = scan_search`

## SRC RENDERER ALIGNMENT

Renderer updates remain bounded to consuming seated state:

- `MeasuresRegistryRuntime.tsx`
- `MeasuresAssessmentChamber.tsx`
- `MeasuresAssessmentBrandLayer.tsx`
- `src/index.css`

The chamber now passes DB-seated process title/support copy into the renderer for the evaluation encounter. Media rendering uses `measures_media_map` role resolution.

## VALIDATION

TypeScript:

```powershell
npx.cmd tsc --noEmit
```

Result:

- passed

Measures build:

```powershell
npm.cmd run build:registry
```

Result:

- passed
- output: `dist-registry`
- generated asset pair: `index-BpDQyypn.js`, `index-C7MNH3kK.css`

## DEPLOY PATH

Target:

- Git-connected Cloudflare Pages Measures branch: `measures`
- artifact directory: `dist-registry`

Build artifact:

- `dist-registry/assets/index-BpDQyypn.js`
- `dist-registry/assets/index-C7MNH3kK.css`

Deployment is performed by committing and pushing the `measures` branch. Wrangler is not part of this deployment path.

## CLOSEOUT ASSESSMENT

OAR2 v2 is resolved at the DB contract and Measures build layers.

The deploy artifact is ready for the Git-connected Measures branch. No `c3field.online` production deploy was performed.

Next routing:

Push the local `measures` branch to `origin/measures` to trigger the Cloudflare Pages Measures deployment.
