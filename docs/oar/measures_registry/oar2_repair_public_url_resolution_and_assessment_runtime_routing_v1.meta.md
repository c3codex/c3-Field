---
document_type: oar2
authority_level: working
document_scope: measures_registry
title: OAR2 — Repair Measures Registry Public URL Resolution and Assessment Runtime Routing
status: confirmed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
executor: cody-compatible
tags:
  - oar2
  - measures-registry
  - qa
  - public-url-resolution
  - assessment-routing
  - route-alias
  - undrifted
  - runtime-surface
  - no-commerce
  - launch-blocker
---

# OAR2 — Repair Measures Registry Public URL Resolution and Assessment Runtime Routing v1

## OBSERVED

QA confirms the Measures Registry public URLs are not resolving correctly.

The assessment does not resolve from the expected public URL surface.

This is consistent with the executed Measures Registry audit, which found that active runtime surfaces are handled through internal surface keys and aliases, while public routes are not fully hardened into a route-to-surface contract.

Confirmed audit standing:

- `/ai-operations-assessment` exists as a public/SEO route, but the active assessment surface still resolves through `?surface=measures_assessment`.
- `ai_operations_assessment_landing` exists and is classified as valid.
- `eval_passage` exists and is active.
- `measures_assessment` exists and is active.
- `obsidian_to_marble_passage_video` exists and is active.
- `marble_pathway_reveal` exists and is active but has no route alias.
- `/map-integrity-governance` is not ready and is missing required encounter, registry entry, title, route alias, directory binding, and redirect standing.
- Runtime aliases are mismatched:
  - `intro` consumes `ai_isnt_broken_intro`
  - `path_choice` consumes `evaluate_structure_path`
  - `structural_drift_dispatches` consumes `structural_drift_publication`
- Obsidian carry-forward is not ready: assessment result is component/session state only, with no durable write to `src_intake_request` and no active contact-capture surface between assessment result and Marble entry.

This is now a launch blocker.

This OAR2 does not address SEO/social distribution, payment, pricing, c3 Key, wallet, certification, conversion, DAO standing, or MAP deliverable completion.

## ALIGNED

The current issue is route-resolution failure, not new architecture.

The correction must bind public URLs to already-active registry/runtime surfaces without making frontend-owned truth.

Public URLs must not expose raw internal surface mechanics as the primary user pathway.

Renderer must continue to consume seated state.

No chamber directory, file name, registry key, SRC label, C1/C2/C3 circuit code, payment, conversion, certification, or internal contract language may appear publicly.

Authority order remains:

Codex → Field → Measures → OAR2 → Chazz → Cody-compatible Executor → src

Launch correction must favor:

- stable public URLs
- deterministic route resolution
- assessment path completion
- no public seam leakage
- no backend invention beyond required route/alias binding
- no payment or conversion activation
- no admission broadening beyond the route repair required for QA

## ROUTED

### 1. Repair `/ai-operations-assessment`

Bind `/ai-operations-assessment` to the active assessment entry flow.

Expected route behavior:

/ai-operations-assessment
→ ai_operations_assessment_landing
→ eval_passage
→ measures_assessment

If current runtime expects direct surface routing, add or correct the route alias so `/ai-operations-assessment` resolves without requiring manual `?surface=` entry.

Public title:

AI Operations Assessment | Measures Registry

Public CTA:

Assess the Environment

Do not expose:

- `measures_assessment`
- `eval_passage`
- `src`
- `SRC`
- chamber names
- C1 / C2 / C3
- pricing
- payment
- c3 Key
- conversion
- certification

### 2. Harden assessment surface resolution

Confirm these active surfaces resolve correctly through the assessment path:

- `ai_operations_assessment_landing`
- `eval_passage`
- `measures_assessment`
- `obsidian_to_marble_passage_video`
- `marble_pathway_reveal`

If any surface handler exists but route binding is missing, bind the route alias to the existing seated surface.

Do not create duplicate assessment surfaces.

Do not replace the registry surface with frontend-only routing.

### 3. Preserve raw `?surface=` support as fallback only

Raw query-surface access may remain for internal QA/debug continuity.

It may not be the primary public route contract.

The public path must be stable:

/ai-operations-assessment

### 4. Bind known runtime aliases explicitly

Formalize or repair the following alias bindings:

- `intro` → `ai_isnt_broken_intro`
- `path_choice` → `evaluate_structure_path`
- `structural_drift_dispatches` → `structural_drift_publication` / unDrifted active publication surface

Because public naming has changed, Structural Drift must not be treated as the active public brand.

Use:

unDrifted

as the active public-facing publication/education name.

Structural Drift may remain only as:

- legacy_reference
- audit_trace
- deprecated_route_alias
- historical source label

### 5. Repair unDrifted route standing

If `/structural-drift` currently exists, it must resolve as a legacy alias or redirect to the active unDrifted public surface.

Preferred public route:

/unDrifted

Allowed fallback if route normalization requires lowercase:

/undrifted

Cody must report which route form is supported by the current router and registry.

Do not leave `/structural-drift` as the primary active public-facing route label.

### 6. Do not activate `/map-integrity-governance` yet unless required records are seated

The audit confirms `/map-integrity-governance` is not ready.

Do not fake this route.

Do not point it to an invented page.

Do not hardcode a frontend-only route.

If `/map-integrity-governance` is requested during QA and the required registry/encounter records are missing, return a governed held state or missing-state report.

Missing required standing includes:

- `map_integrity_governance` encounter
- `map_integrity_governance` registry entry
- public title
- route alias
- directory binding
- redirect from `marble_pathway_reveal`

### 7. Confirm `marble_pathway_reveal` remains reachable only after valid assessment state

`marble_pathway_reveal` may continue to resolve as the active governed pathway reveal handler.

Do not expose it as a public standalone URL unless assessment state exists or the route intentionally renders a held/entry-required state from seated copy.

No pricing or payment activation may be introduced.

### 8. Contact/carry-forward boundary

Do not invent durable SRC carry-forward in this OAR unless a seated table and source handler already exist and are explicitly wired by current contract.

This OAR may report the existing blocker:

Assessment result is session-state only.
No durable write to src_intake_request exists.
No active contact-capture surface is seated between assessment result and Marble entry.

If the assessment cannot complete because carry-forward is required, Cody must return that as the blocker and not fake completion.

### 9. Public boundary cleanup within touched route surfaces

During this route repair, correct or block any touched public labels that expose internal standing, including:

- c3 Field
- SRC1 Connect
- Crystal Chamber
- Marble Chamber
- Codexstone
- Measures Evaluation Email Contract
- FOUNDATION SEAT
- SYSTEMS SEAT

Do not perform broad deprecation outside the touched route path unless required to stop the assessment route from resolving incorrectly.

### 10. Validation required

Cody must validate these URLs and return observed result for each:

- `/`
  - expected: public intro / entry surface

- `/ai-operations-assessment`
  - expected: AI Operations Assessment landing or assessment entry flow

- `?surface=eval_passage`
  - expected: assessment passage video

- `?surface=measures_assessment`
  - expected: 7-question assessment

- `?surface=obsidian_to_marble_passage_video`
  - expected: Before the Pathway passage

- `?surface=marble_pathway_reveal`
  - expected: governed pathway reveal or governed held state if no assessment state

- `/undrifted` or `/unDrifted`
  - expected: unDrifted public education/publication surface if seated

- `/structural-drift`
  - expected: legacy alias/redirect/held state, not primary active route

- `/map-integrity-governance`
  - expected: held or missing-state report unless records are seated

Cody must also validate:

npm run build

or the project’s current Measures Registry build command if different.

## CODY ROLE

Cody may:

- inspect current router and registry route alias logic
- bind public routes to existing seated runtime surfaces
- correct route aliases
- repair `/ai-operations-assessment` resolution
- preserve fallback `?surface=` QA access
- report missing registry/encounter state
- correct public labels only where touched by route repair
- return exact changed files and validation output

Cody may not:

- create payment, wallet, c3 Key, SEAT, certification, conversion, DAO, or distribution standing
- expose internal chamber or file names as public meaning
- hardcode public truth in frontend when registry binding is required
- invent missing `/map-integrity-governance` records
- treat Structural Drift as the active public-facing publication name
- execute SEO/social distribution work
- execute broad backend expansion
- mutate unrelated Inanna chamberplate narrative records
- proceed from thread instruction outside this OAR2

## VALIDATION

This OAR2 resolves successfully when:

1. `/ai-operations-assessment` resolves in QA.
2. The assessment flow reaches the 7-question assessment.
3. Raw `?surface=measures_assessment` remains valid for QA fallback.
4. Public route aliases are explicit and not accidental.
5. unDrifted is treated as active public naming.
6. Structural Drift is legacy/audit only.
7. `/map-integrity-governance` is not falsely activated.
8. No public route exposes c3 Field, SRC, chamber, codexstone, SEAT, payment, c3 Key, conversion, certification, DAO, or C1/C2/C3 language.
9. Build passes.
10. Cody writes OAR1 beside this OAR2.

## EXPECTED PATH

docs/oar/measures_registry/oar2_repair_public_url_resolution_and_assessment_runtime_routing_v1.meta.md

## EXPECTED OAR1

docs/oar/measures_registry/oar1_repair_public_url_resolution_and_assessment_runtime_routing_v1.meta.md

## CLOSE

This is a QA route-resolution repair.

It does not change the architecture.

It makes the public launch surface resolve through the seated runtime.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
Chazz protects launch coherence.
Cody executes.
src renders seated state only.
