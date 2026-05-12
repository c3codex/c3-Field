---
document_type: oar1
authority_level: execution_closeout
document_scope: deployed_runtime_diagnostic
title: OAR1 - Diagnose Inanna Deployed Runtime Binding
status: completed_pending_chazz_review
version: v1
operator: op044
executor: Cody
system: measures_registry
source_oar2:
  - oar2_diagnose_inanna_deployed_runtime_binding_v1
evidence:
  - diagnose_inanna_deployed_runtime_binding_v1.json
executor_artifacts:
  - execute-diagnose-inanna-deployed-runtime-binding.cjs
mutation_performed: false
mutation_count: 0
---

# OAR1 - Diagnose Inanna Deployed Runtime Binding

## Result

Read-only deployed runtime diagnosis completed.

The active seam is `stale deployment bundle`.

Measures Registry deployed runtime is serving current media behavior.

Measures of Inanna deployed runtime is serving an older JS bundle that still limits governed media lookup to `surface_type = chamberplate`.

## Bundle Identity

Deployed Inanna hosts tested:

- `https://www.measuresofinanna.com/`
- `https://measuresofinanna.com/`

Both hosts returned the same deployed JS asset:

- `assets/index-qPbY_Yxd.js`

Current local Inanna build asset:

- `assets/index-DNR-DxGl.js`

Comparison:

- deployed asset hash matches local build: `false`
- deployed resolver mode matches local build: `false`
- deployed env marker presence matches local build: `true`

## Resolver Comparison

Local built resolver standing:

- governed media applies to `chamberplate`
- governed media applies to `aspect`
- governed media applies to `threshold`

Local evidence source:

- `dist-inanna/assets/index-DNR-DxGl.js`
- resolver contract marker: `new Set(["chamberplate","aspect","threshold"])`

Deployed resolver standing:

- bundle snippet shows `if (t.surface_type==="chamberplate")`
- no deployed marker for the expanded governed surface set was found

Deployed resolver classification:

- `governed_media_for_chamberplate_only`

## Deployed Environment Marker Presence

The deployed Inanna bundle does include public runtime markers for:

1. Supabase URL marker: present
2. Supabase publishable key marker: present
3. R2 public base URL marker: present

No full secret or key value is reported in this OAR1.

This eliminates missing deployed env marker standing as the primary seam for the tested bundle.

## Live Route Media Behavior

### Epigraph

Route tested:

- `https://www.measuresofinanna.com/?registry_key=epigraph`

Resolution:

- registry key resolved: `epigraph`
- encounter key resolved: `epigraph_view`
- surface type: `aspect`

Deployed bundle behavior:

- governed media read: `false`
- fallback media read: `true`

Rows returned in deployed public context:

- governed media rows returned: `0`
- fallback media rows returned: `1`

Final media selected by deployed runtime behavior:

- source: `temp_exhibition_media`
- role: `video`
- bucket: `pre-codex-exhibition`
- path: `inanna_encounter_intro.mp4`

Final resolved URL:

- `https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/pre-codex-exhibition/inanna_encounter_intro.mp4`

HTTP retrieval:

- status: `400`

Expected local/OAR1 standing instead:

- governed primary should be `epigraph_governed_animated_media_v1`
- governed runtime URL should be `https://media.c3field.online/inanna_epigraph.MP4`

### Temple Antechamber

Route tested:

- `https://www.measuresofinanna.com/?registry_key=temple_antechamber`

Resolution:

- registry key resolved: `temple_antechamber`
- encounter key resolved: `temple_antechamber_view`
- surface type: `threshold`

Deployed bundle behavior:

- governed media read: `false`
- fallback media read: `true`

Rows returned in deployed public context:

- governed media rows returned: `0`
- fallback media rows returned: `1`

Final media selected by deployed runtime behavior:

- source: `temp_exhibition_media`
- role: `image`
- bucket: `pre-codex-exhibition`
- path: `antechamber.png`

Final resolved URL:

- `https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/pre-codex-exhibition/antechamber.png`

HTTP retrieval:

- status: `400`

### Chamberplate Probe

Route tested:

- `https://www.measuresofinanna.com/?registry_key=chamber_epithets_01_primus_artus`

Standing:

- no encounter resolved from the tested registry key in deployed public context

This probe did not alter the primary classification because the epigraph and threshold failures were already fully attributable to the stale deployed bundle behavior.

## Local Vs Deployed Difference

Local validation already proved:

- non-chamberplate governed resolution enabled
- governed epigraph animated media seated
- governed epigraph still support seated
- governed temple_antechamber still support seated
- R2 governed epigraph media object returns `200`

Deployed runtime instead shows:

- older asset hash
- chamberplate-only governed resolver
- epigraph forced to legacy fallback video URL
- temple_antechamber forced to legacy fallback image URL
- both fallback URLs return `400`

## Exact Seam

Primary classification:

- `stale deployment bundle`

Supporting reasons:

1. live asset hash differs from current local build
2. live bundle still contains chamberplate-only governed read logic
3. live bundle still selects stale fallback rows for `aspect` and `threshold`
4. deployed env markers are present, so the issue is not primarily missing public env binding

## Recommended Next OAR2

Recommended follow-up:

- seat a deployment/runtime binding correction OAR that promotes the current Inanna build artifact and verifies the Cloudflare Pages project/output binding serves the latest bundle with governed media for `aspect` and `threshold`

Suggested verification targets for that follow-up:

1. production bundle asset hash changes from `index-qPbY_Yxd.js`
2. deployed bundle contains governed surface expansion for `chamberplate`, `aspect`, and `threshold`
3. `epigraph` selects governed video instead of legacy fallback
4. `temple_antechamber` selects governed still instead of legacy fallback
5. live retrieval for selected media returns `200`

## Boundary

No DB mutation.

No media mutation.

No bucket mutation.

No code mutation outside diagnostic artifacts.

No deploy mutation.

Mutation count:

- `0`
