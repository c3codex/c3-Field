---
document_type: oar2
authority_level: working
document_scope: measures_registry_deprecated_surface_key_residue
title: OAR2 — Audit Deprecated Surface Key Residue in Measures Registry Landing Runtime v1
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: docs/oar/measures_registry/oar1_seat_measures_registry_landing_pages_as_governed_registry_units_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: frontend_executor
  src: renderer
tags:
  - oar2
  - measures-registry
  - deprecated-residue
  - landing-runtime
  - eval-passage
  - encounter-metadata
  - route-alias
  - codex-first
source_alignment:
  - Seed Concordance
  - The 21 of Coherence
  - Chazz x Cody Development Role Contract
  - OAR Lifecycle — Execution and Handoff
  - Measures Registry Operative Concordance Update
  - OAR1 — Seat Measures Registry Landing Pages as Governed Registry Units v1
---

# OAR2 — Audit Deprecated Surface Key Residue in Measures Registry Landing Runtime v1

## OBSERVED

The governed landing page OAR1 remains valid.

Landing-page authority is clean.

Public SEO standing is clean.

CTA routing is clean.

The OAR1 addendum confirmed:

- governed landing unit authority does not use `educational_diagnostic_passage`
- `ai_operations_assessment_landing.metadata.runtime_surface` is `eval_passage`
- `ai_operations_assessment_landing.metadata.cta_surface` is `measures_assessment`
- crawler-visible built route HTML contains no deprecated route language
- public metadata contains no deprecated route language
- public browser text probe did not expose `Educational Diagnostic` or `educational diagnostic`

Residue remains in internal runtime and encounter metadata:

- `src/measures_registry/registered_runtime/renderers/RegisteredPassage.tsx` emits internal `data-surface="educational_diagnostic_passage"` for the eval passage renderer variant
- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` keeps `educational_diagnostic_passage: "eval_passage"` as a route alias
- live `public.measures_encounter_def` row `eval_passage` retains legacy metadata labels, including:
  - `display_title: Educational Diagnostic Passage`
  - `function_layer: education_diagnostic`
  - `reconciled_from: educational_diagnostic_passage`

The OAR1 determination was that this residue is not current public landing route authority, not crawler-visible metadata, not public CTA target authority, and not frontend-owned landing truth.

This OAR2 now audits and corrects that deprecated residue so internal implementation and DB metadata no longer carry deprecated route semantics.

## ALIGNED

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Frontend does not author truth.

Route aliases do not define authority.

Data attributes do not define public meaning.

Encounter metadata must not preserve deprecated public route semantics where active runtime still depends on it.

Correction must preserve:

- `/ai-operations-assessment`
- `/structural-drift`
- governed landing-page records
- crawler-visible SEO metadata
- Open Graph metadata
- Twitter metadata
- CTA routing into `measures_assessment`
- assessment-first runtime
- contact gate
- result gate
- publication support
- no-claims boundary

Deprecated language must not remain active in:

- public route identity
- crawler-visible metadata
- CTA labels
- route authority
- active encounter metadata labels
- data-surface markers where they imply current active route meaning

## ROUTED

### 1. Audit current residue

Cody must search and report all active occurrences of these strings:

    educational_diagnostic_passage
    educational diagnostic
    Educational Diagnostic
    education_diagnostic
    diagnostic_explainer_passage
    public_eval_passage

Search locations must include:

- `src/`
- `docs/oar/measures_registry/`
- route-head generation scripts
- registry runtime files
- renderer files
- DB rows relevant to:
  - `measures_registry`
  - `measures_encounter_def`
  - `measures_release_state`
  - `measures_transition_rule`
  - landing-page metadata
  - route aliases
  - publication support

Documentation/OAR historical references may remain as historical trace.

Active runtime, active DB metadata, active route alias, public metadata, and active renderer markers must be corrected where they carry deprecated meaning.

### 2. Correct renderer data-surface residue

If `RegisteredPassage.tsx` emits:

    data-surface="educational_diagnostic_passage"

for the eval passage renderer variant, update it to emit active governed standing.

Preferred correction:

    data-surface="eval_passage"

or another existing governed key if current DB/runtime standing requires it.

Do not create a new frontend-owned key.

Do not rename the rendered surface unless DB standing supports the key.

### 3. Correct route alias residue

If `MeasuresRegistryRuntimeRegistered.tsx` contains:

    educational_diagnostic_passage: "eval_passage"

Cody must determine whether that alias is still required for backward compatibility.

If not required:

- remove the alias

If still required for legacy inbound links:

- preserve only as a deprecated legacy alias
- mark it explicitly as deprecated internal compatibility
- ensure it does not appear in public metadata, CTA authority, crawler-visible route heads, or active route meaning

No deprecated alias may be the primary active route surface.

### 4. Correct DB encounter metadata residue

Cody must inspect live `public.measures_encounter_def` row for `eval_passage`.

If metadata includes deprecated active labels such as:

    display_title: Educational Diagnostic Passage
    function_layer: education_diagnostic
    reconciled_from: educational_diagnostic_passage

Cody may update only those metadata fields needed to remove deprecated active route semantics.

Preferred replacement standing:

    display_title: Evaluation Passage
    function_layer: assessment_passage
    reconciled_from: null or deprecated_trace only if schema supports a non-active trace field

If historical trace is needed, it must be moved to a clearly non-active metadata field such as:

    deprecated_trace
    migration_note
    historical_alias

Only use fields compatible with existing JSON/metadata structure.

No new schema is authorized.

### 5. Preserve governed landing page authority

Do not mutate governed landing units except if validation proves they still reference deprecated residue.

Protected units:

    ai_operations_assessment_landing
    structural_drift_landing

Their standing must remain:

    ai_operations_assessment_landing:
      route_path: /ai-operations-assessment
      runtime_surface: eval_passage
      cta_surface: measures_assessment
      claims_boundary: assessment_only

    structural_drift_landing:
      route_path: /structural-drift
      runtime_surface: structural_drift_dispatches
      cta_surface: measures_assessment
      claims_boundary: education_only

### 6. Preserve SEO and crawler-visible route heads

After correction, route-head generation must still produce crawler-visible static metadata for:

    dist-registry/ai-operations-assessment/index.html
    dist-registry/structural-drift/index.html

Required preserved tags:

- title
- description
- canonical
- og:title
- og:description
- og:type
- og:url
- og:image
- twitter:card
- twitter:title
- twitter:description
- twitter:image

No deprecated term may appear in these built route heads.

### 7. Preserve runtime routing

After correction:

`/ai-operations-assessment` must still:

- load successfully
- resolve title: `AI Operations Assessment | Measures Registry`
- resolve canonical: `https://measuresregistry.com/ai-operations-assessment`
- route CTA to `?surface=measures_assessment`
- resolve CTA target surface to `measures_ai_operational_evaluation`

`/structural-drift` must still:

- load successfully
- resolve title: `Structural Drift | Measures Registry`
- resolve canonical: `https://measuresregistry.com/structural-drift`
- render published Structural Drift dispatch content if DB rows remain published
- route CTA to `?surface=measures_assessment`
- resolve CTA target surface to `measures_ai_operational_evaluation`

### 8. DB mutation authorization

This OAR2 authorizes DB mutation only for correcting deprecated active metadata residue in existing Measures Registry records.

Authorized DB mutation scope:

- `public.measures_encounter_def` metadata for `eval_passage`
- route alias metadata only if stored in DB and directly tied to deprecated residue
- non-active trace relocation inside existing metadata JSON where supported

No DB mutation is authorized for:

- assessment questions
- scoring logic
- contact gate
- result gate
- landing-page release standing unless residue is found there
- payment
- wallet
- c3 Key
- temp c3 Key
- SRC
- certification
- conversion
- DAO
- permission
- recognition
- distribution
- Marble readiness

### 9. Deprecated language boundary

Deprecated terms may remain only in:

- historical OAR files
- migration notes
- deprecated trace fields
- audit output

Deprecated terms may not remain as active:

- route authority
- public copy
- public metadata
- CTA label
- primary runtime surface marker
- active function layer
- active display title
- active alias target

## CODY ROLE

Cody may:

- search code and DB for deprecated residue
- report all occurrences
- correct active renderer data-surface residue
- remove or mark deprecated route aliases
- update active DB metadata labels for `eval_passage`
- preserve historical trace in non-active metadata where supported
- rebuild registry output
- regenerate crawler-visible route heads
- validate public route behavior
- write OAR1 closeout

Cody may not:

- invent new route authority
- create new schema
- mutate unrelated DB state
- alter assessment questions
- alter scoring
- alter contact/result gate
- alter payment, wallet, c3 Key, SRC, certification, conversion, DAO, permission, recognition, distribution, or Marble standing
- route around governed landing records
- silently patch public behavior outside scope
- treat deprecated alias as active route meaning

## VALIDATION

Execution is valid only when:

1. all active code occurrences of deprecated surface-key residue are reported
2. all relevant DB occurrences of deprecated metadata residue are reported
3. renderer no longer emits `data-surface="educational_diagnostic_passage"` as active eval passage marker
4. `educational_diagnostic_passage` is removed as active route alias or explicitly marked deprecated internal compatibility
5. `eval_passage` encounter metadata no longer uses `Educational Diagnostic Passage` as active display title
6. `eval_passage` encounter metadata no longer uses `education_diagnostic` as active function layer
7. deprecated historical trace is absent from active fields or moved to non-active trace fields
8. governed landing units remain intact
9. crawler-visible built route heads remain present
10. crawler-visible built route heads contain no deprecated route language
11. public browser text contains no deprecated route language
12. `/ai-operations-assessment` still loads
13. `/structural-drift` still loads
14. `/ai-operations-assessment` CTA still routes to `measures_assessment`
15. `/structural-drift` CTA still routes to `measures_assessment`
16. no independent assessment logic is created
17. no contact/result gate is bypassed
18. no pricing appears
19. no payment appears
20. no c3 Key issuance appears
21. no certification claim appears
22. no conversion claim appears
23. no DAO claim appears
24. no permission, recognition, or distribution claim appears
25. no Marble readiness claim appears
26. TypeScript validation passes
27. registry build passes
28. OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_registry/oar1_audit_deprecated_surface_key_residue_in_measures_registry_landing_runtime_v1.meta.md

OAR1 must include:

- residue search output summary
- code occurrences found
- DB occurrences found
- files changed
- DB records updated
- exact metadata fields corrected
- deprecated alias standing
- route-head validation
- runtime validation
- no-claims confirmation
- build result
- TypeScript result
- git status standing

## CLOSE

Deprecated residue is trace.

It is not route authority.

Landing pages remain governed.

Frontend renders clean standing.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
Chazz validates.
Cody executes.
src renders.
