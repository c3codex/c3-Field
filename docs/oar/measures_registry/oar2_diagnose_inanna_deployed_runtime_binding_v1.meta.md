---
document_type: oar2
authority_level: working
document_scope: deployed_runtime_diagnostic
title: OAR2 — Diagnose Inanna Deployed Runtime Binding
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - oar1_enable_non_chamberplate_governed_media_resolution_v1
  - oar1_seat_epigraph_governed_animated_media_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# OAR2 — Diagnose Inanna Deployed Runtime Binding

## OBSERVED

Measures Registry deployed runtime is loading media correctly.

Measures of Inanna deployed runtime is loading no media.

Governed Inanna media authority has already been seated and validated:

- non-chamberplate governed media resolution enabled
- epigraph governed animated media seated
- epigraph still fallback seated
- temple_antechamber still image seated
- no hardcoded media paths introduced

Therefore the active failure is likely deployment/runtime binding drift, not missing media authority.

## ALIGNED

Codex remains authority.

Field structures runtime relation.

Measures registers governed media.

Chazz diagnoses deployment/runtime binding.

Cody executes only from this OAR2.

This OAR2 authorizes diagnostic inspection only.

This OAR2 does not authorize:

- DB mutation
- media mutation
- bucket copy
- resolver rewrite
- fallback deletion
- frontend hardcoding
- deploy mutation unless separately authorized

## ROUTED

### 1. Confirm deployed Inanna bundle identity

Cody must inspect deployed Inanna runtime and confirm whether it includes the latest resolver change.

Verify deployed bundle contains behavior equivalent to:

    governed media lookup applies to chamberplate, aspect, threshold

Report:

- deployed asset hash
- local build asset hash
- whether deployed bundle matches latest build
- whether deployed route is serving stale JS

### 2. Confirm deployed environment binding

Cody must verify deployed Inanna bundle has required environment markers:

- Supabase URL marker
- Supabase publishable key marker
- R2 public base URL marker

Do not expose full secret or key values.

Report marker presence only.

### 3. Inspect live route media behavior

For deployed Inanna routes, inspect:

- epigraph
- temple_antechamber
- one chamberplate surface if route resolves

Report for each:

- route URL tested
- registry key resolved
- encounter key resolved
- surface_type
- governed media rows returned
- fallback rows returned
- final selected media
- final resolved URL
- HTTP retrieval status

### 4. Compare local validation to deployed runtime

Cody must compare:

- local validation result from OAR1
- deployed runtime result
- difference in bundle, env, query, or routing behavior

### 5. Identify exact seam

Classify failure as one of:

- stale deployment bundle
- wrong Cloudflare Pages project/output directory
- missing deployed env var
- route rewrite issue
- deployed runtime still using temp fallback
- governed query returns zero in deployed context
- RLS/policy difference
- registry-key route resolution failure
- asset URL retrieval failure

### 6. No mutation boundary

No DB mutation.

No code mutation.

No bucket mutation.

No deploy mutation.

This OAR produces diagnostic evidence only.

Any fix must be routed through follow-up OAR2.

## VALIDATION

OAR1 must report:

1. deployed bundle identity
2. local-vs-deployed bundle comparison
3. deployed env marker presence
4. deployed route media behavior
5. exact failure seam
6. recommended next OAR2
7. mutation count 0

## CODY ROLE

Cody may:

- inspect deployed runtime output
- inspect local build output
- run read-only validation scripts
- compare bundle markers
- test public media URLs
- write OAR1 closeout

Cody may not:

- mutate DB rows
- change code
- redeploy
- hardcode media paths
- alter resolver behavior
- delete fallback rows

## EXPECTED OAR1

    docs/oar/measures_registry/oar1_diagnose_inanna_deployed_runtime_binding_v1.meta.md

## CLOSE

Measures Registry works.

Inanna binding is the seam.

Diagnose before mutation.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
