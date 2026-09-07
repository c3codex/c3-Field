---
document_type: oar1
authority_level: closeout
document_scope: measures_registry_deprecated_surface_key_residue
title: OAR1 - Audit Deprecated Surface Key Residue in Measures Registry Landing Runtime v1
status: complete
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_audit_deprecated_surface_key_residue_in_measures_registry_landing_runtime_v1.meta.md
completed_at: 2026-06-05
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: frontend_executor
  src: renderer
tags:
  - oar1
  - measures-registry
  - deprecated-residue
  - landing-runtime
  - eval-passage
  - encounter-metadata
  - route-alias
  - codex-first
---

# OAR1 - Audit Deprecated Surface Key Residue in Measures Registry Landing Runtime v1

## EXECUTED

Deprecated surface-key residue was audited across active Measures Registry runtime code, built route heads, and live Measures Registry DB records.

Active public route authority remains governed by Measures Registry records.

No frontend-owned route truth was introduced.

## RESIDUE SEARCH SUMMARY

Searched active source/runtime surfaces for:

- `educational_diagnostic_passage`
- `educational diagnostic`
- `Educational Diagnostic`
- `education_diagnostic`
- `diagnostic_explainer_passage`
- `public_eval_passage`

Active code findings before correction:

- `src/measures_registry/registered_runtime/renderers/RegisteredPassage.tsx` emitted `data-surface="educational_diagnostic_passage"` for the eval passage variant.
- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` retained `educational_diagnostic_passage: "eval_passage"` as an inbound alias.

Active code findings after correction:

- `RegisteredPassage.tsx` now emits `data-surface="eval_passage"` for the eval passage variant.
- `MeasuresRegistryRuntimeRegistered.tsx` retains `educational_diagnostic_passage: "eval_passage"` only as explicitly marked deprecated internal compatibility.

Historical OAR references remain historical trace only.

## DB OCCURRENCES FOUND

Live `public.measures_encounter_def` row `eval_passage` contained deprecated active metadata:

- `display_title`: `Educational Diagnostic Passage`
- `metadata.function_layer`: `education_diagnostic`
- `metadata.state_expression`: `public_eval_passage`
- `metadata.renderer`: `diagnostic_explainer_passage`
- `metadata.reconciled_from`: `educational_diagnostic_passage`
- `metadata.source_educational_diagnostic_passage`: `educational_diagnostic_passage_codex_publication_surface_v1`
- `metadata.styling_contract.passage_mode`: `educational_diagnostic`
- `metadata.media_behavior_contract.surface_role`: `educational_passage_media`
- `metadata.encounter_isolation_contract.renderer`: `diagnostic_explainer_passage`

Protected landing units were inspected and did not require mutation:

- `ai_operations_assessment_landing`
- `structural_drift_landing`

## DB RECORD UPDATED

SQL artifact:

- `docs/oar/measures_registry/correct-deprecated-surface-key-residue-v1.sql`

Live execution surface:

- Supabase `exec_sql` RPC

Updated record:

- `public.measures_encounter_def`
- `encounter_key = 'eval_passage'`

Corrected active standing:

- `display_title`: `Evaluation Passage`
- `metadata.function_layer`: `assessment_passage`
- `metadata.state_expression`: `assessment_passage_public`
- `metadata.renderer`: `eval_passage`
- `metadata.reconciled_from`: removed from active metadata
- `metadata.source_educational_diagnostic_passage`: removed from active metadata
- `metadata.styling_contract.passage_mode`: `assessment_passage`
- `metadata.media_behavior_contract.surface_role`: `assessment_passage_media`
- `metadata.encounter_isolation_contract.renderer`: `eval_passage`

Historical values were moved under non-active `metadata.deprecated_trace`.

No schema was created.

No assessment, scoring, contact gate, result gate, payment, wallet, c3 Key, SRC, certification, conversion, DAO, permission, recognition, distribution, or Marble readiness state was mutated.

## LANDING AUTHORITY PRESERVED

Live governed landing records remained intact:

`ai_operations_assessment_landing`:

- `route_path`: `/ai-operations-assessment`
- `runtime_surface`: `eval_passage`
- `cta_surface`: `measures_assessment`
- `claims_boundary`: `assessment_only`

`structural_drift_landing`:

- `route_path`: `/structural-drift`
- `runtime_surface`: `structural_drift_dispatches`
- `cta_surface`: `measures_assessment`
- `claims_boundary`: `education_only`

## ROUTE-HEAD VALIDATION

Registry build regenerated crawler-visible route heads:

- `dist-registry/ai-operations-assessment/index.html`
- `dist-registry/structural-drift/index.html`

Validated preserved tags:

- `title`
- `description`
- `canonical`
- `og:title`
- `og:description`
- `og:type`
- `og:url`
- `og:image`
- `twitter:card`
- `twitter:title`
- `twitter:description`
- `twitter:image`

Built route-head search found no deprecated terms in either route head.

Crawler-visible static head values remained present:

- `/ai-operations-assessment`: `AI Operations Assessment | Measures Registry`
- `/structural-drift`: `Structural Drift | Measures Registry`

Runtime app hydration may set the browser title/head back to the registry shell during local preview. Crawler-visible built route HTML remains route-specific before hydration, satisfying the governed SEO output requirement.

## RUNTIME VALIDATION

Local preview:

- `http://127.0.0.1:4176`
- artifact: `dist-registry`

`/ai-operations-assessment` validation:

- route loaded successfully
- existing epigraph and intro continuity preserved
- eval passage resolved with `main[data-surface="eval_passage"]`
- public copy contained no deprecated residue terms
- head contained no deprecated residue terms
- `Continue to Evaluation` routed to `?surface=measures_assessment`
- CTA target resolved `main[data-surface="measures_ai_operational_evaluation"]`

`/structural-drift` validation:

- route loaded successfully
- existing intro, structure, and chamber continuity preserved
- direct governed dispatch surface resolved `main[data-surface="structural_drift_dispatches"]`
- public copy contained no deprecated residue terms
- head contained no deprecated residue terms
- `Begin Structural Evaluation` routed to `?surface=measures_assessment`
- CTA target resolved `main[data-surface="measures_ai_operational_evaluation"]`

Local direct dispatch preview reported `Structural Drift publication state missing` while still resolving the governed dispatch surface. This was recorded as unrelated local runtime-state absence, not deprecated eval-key residue.

## NO-CLAIMS CONFIRMATION

No public route output introduced:

- pricing
- payment
- wallet
- c3 Key issuance
- temp c3 Key issuance
- SRC claim
- certification claim
- conversion claim
- DAO claim
- permission claim
- recognition claim
- distribution claim
- Marble readiness claim

No independent assessment logic was created.

No contact gate or result gate was bypassed.

## VALIDATION COMMANDS

TypeScript:

```powershell
npx.cmd tsc --noEmit
```

Result: passed.

Registry build:

```powershell
npm.cmd run build:registry
```

Result: passed.

Build output included the existing bundle-size warning for the registry chunk.

## FILES CHANGED

- `src/measures_registry/registered_runtime/renderers/RegisteredPassage.tsx`
- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`
- `docs/oar/measures_registry/correct-deprecated-surface-key-residue-v1.sql`
- `docs/oar/measures_registry/oar1_audit_deprecated_surface_key_residue_in_measures_registry_landing_runtime_v1.meta.md`
- regenerated `dist-registry` route artifacts

## GIT STATUS STANDING

This closeout was written in a worktree that already contained the governed landing-page OAR package and generated build artifacts.

The deprecated-residue OAR1/OAR2 package is not committed in this closeout step.

## CLOSE

`educational_diagnostic_passage` remains only as a marked deprecated internal compatibility alias.

It is not public route authority.

It is not crawler-visible metadata.

It is not public copy.

It is not CTA authority.

It is not active encounter metadata standing.

OAR2 executed.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
Chazz validates.
Cody executes.
src renders.
