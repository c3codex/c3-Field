---
document_type: oar1
authority_level: observation_closeout
document_scope: measures_registry_runtime_language
title: OAR1 - Public Encounter Language Audit + Runtime Terminology Alignment v1
status: recorded
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_public_encounter_language_audit_runtime_terminology_alignment_v1.meta.md
---

# OAR1 - Public Encounter Language Audit + Runtime Terminology Alignment v1

## OBJECTIVE

Record a public encounter language audit for Measures Registry runtime terminology.

This OAR1 does not authorize runtime copy mutation, DB mutation, route rewrite, authority rename, or encounter structure rewrite.

The purpose is to make the terminology drift reviewable before any follow-on public-language seating OAR2.

## AUDIT METHOD

Inspected public/runtime language surfaces in:

- `src/measures_registry/MeasuresRegistryRuntime.tsx`
- `docs/oar/measures_registry/seat_measures_ai_assessment_content_structured_environment_media_v1.json`
- live `public.measures_encounter_def` rows for the active Measures Registry surfaces

Live read scope:

- `landing_root`
- `educational_diagnostic_passage`
- `educate_eval_encounter`
- `iis_eval_gate1`
- `cohort_conversion_encounter`
- `structural_drift_dispatches`
- `registered_process_log`
- `seat_hold_notification_review`

No DB writes were performed.

No frontend runtime copy was changed.

## OBSERVED STANDING

The architecture remains coherent.

The drift is translation-layer drift: native/internal governance language is appearing in public-facing encounter surfaces where institutional language would read more clearly.

Highest public-language drift zones:

- assessment chamber and pre-assessment intake language
- educate/evaluate path language
- cohort conversion language
- dispatch/archive publication language
- process log visibility language
- operator-only notification review language
- missing-state diagnostics shown by the renderer

The public runtime currently mixes:

- institutional language
- diagnostic language
- internal registry language
- DB/process language
- OAR execution language
- Cody/Chazz/Operator role language
- raw route or table-state terms

## TERMINOLOGY REVIEW SET

### CURRENT TERM

`Soft SRC Intake`

### LOCATION

`iis_eval_gate1` assessment chamber pre-diagnostic intake; renderer legend and seated `assessment_chamber.soft_src_intro` / `soft_src_continuation`.

### INTERNAL SOURCE

SRC / seat-readiness / structural readiness capture lineage.

### RECOMMENDED PUBLIC TERM

`Institution Profile` or `Assessment Profile`

### NOTES

`SRC` is meaningful internally but acronym-heavy publicly. Replace the visible label while preserving internal capture context and DB fields.

---

### CURRENT TERM

`IIS Evaluation Gate 1`

### LOCATION

`iis_eval_gate1.metadata.eyebrow`

### INTERNAL SOURCE

Internal evaluation gate identifier / route key.

### RECOMMENDED PUBLIC TERM

`Assessment Chamber` or `Initial AI Environment Review`

### NOTES

`IIS` and `Gate 1` expose internal sequencing. Public language should name the encounter by what the institution is doing.

---

### CURRENT TERM

`Evaluation`, `Assessment`, `Diagnostic`, `Review`

### LOCATION

Landing path, diagnostic passage, educate/evaluate encounter, assessment chamber, dispatch CTA, completion state.

### INTERNAL SOURCE

Multiple seated encounter phases and historical route names.

### RECOMMENDED PUBLIC TERM

Use a stable progression:

- `Recognition`
- `Assessment`
- `Structured Review`
- `Structured Environment`

### NOTES

The current language is understandable but inconsistent. `Assessment` should be the main user-facing action; `diagnostic` can remain as supporting language; `evaluation` should be reduced unless naming an internal evaluation record.

---

### CURRENT TERM

`Operational Diagnostic Intake`

### LOCATION

Educate/evaluate encounter entry surface.

### INTERNAL SOURCE

Process capture and intake framing.

### RECOMMENDED PUBLIC TERM

`Institution Assessment Entry`

### NOTES

`Operational` and `intake` read administrative. The replacement keeps purpose without exposing process machinery.

---

### CURRENT TERM

`Implementation gaps`, `implementation structure`, `missing implementation layers`

### LOCATION

Diagnostic recognition, education resources, evaluation signals, cohort live structural review.

### INTERNAL SOURCE

Implementation-facing systems review language.

### RECOMMENDED PUBLIC TERM

`system structure gaps`, `operational structure gaps`, or `missing system supports`

### NOTES

Implementation language is accurate for internal review, but public-facing copy should orient the institution toward system condition rather than build execution.

---

### CURRENT TERM

`Governance absence indicators`, `governance gaps`, `governance capacity`

### LOCATION

Educate/evaluate encounter, evaluation signals, cohort conversion.

### INTERNAL SOURCE

Measures governance assessment vocabulary.

### RECOMMENDED PUBLIC TERM

`oversight gaps`, `decision boundaries`, or `governance readiness`

### NOTES

Governance can remain, but should be paired with plain institutional terms when surfaced publicly.

---

### CURRENT TERM

`Structured Environment`

### LOCATION

Assessment completion and post-assessment passage.

### INTERNAL SOURCE

TREE / Measures structured-environment runtime and media role.

### RECOMMENDED PUBLIC TERM

Keep `Structured Environment`.

### NOTES

This term is public-capable and should remain stable. It functions as a named destination rather than leaked system process.

---

### CURRENT TERM

`Dispatch`, `Dispatches`, `Dispatch Index`, `Read Dispatch`

### LOCATION

Structural Drift publication preview, field guide, dispatch archive, subscription CTA.

### INTERNAL SOURCE

Publication dispatch model.

### RECOMMENDED PUBLIC TERM

Keep `Dispatch` for publication identity, but use:

- `Read Analysis`
- `View Registry Analysis`
- `Receive Registry Updates`

where a general public action is intended.

### NOTES

`Dispatches` has a coherent editorial tone. It weakens when used for every action, archive, subscription, and internal notification event.

---

### CURRENT TERM

`Registered Process Log`

### LOCATION

Process visibility surface.

### INTERNAL SOURCE

`public.registered_process_log` and OAR execution tracking.

### RECOMMENDED PUBLIC TERM

`Registry Activity Record` or `Governed Activity Record`

### NOTES

The existing surface is operational rather than general public. If visible publicly, it exposes process machinery and should be translated. If operator/internal only, current language can remain.

---

### CURRENT TERM

`Execution Governance`, `Cody`, `Chazz`, `Operator`, `OAR1`, `OAR2`, `Deploy`, `Seeded`

### LOCATION

Registered process log surface and legend.

### INTERNAL SOURCE

Native execution spine and OAR lifecycle.

### RECOMMENDED PUBLIC TERM

For public surfaces:

- `Activity`
- `Review`
- `Authorization`
- `Publication status`
- `Recorded evidence`

For internal/operator surfaces, preserve native terms.

### NOTES

These terms are native and should not be erased. They should be gated to internal/operator context or translated when appearing in public institutional pathways.

---

### CURRENT TERM

`Missing DB Records`, `measures_encounter_def.encounter_key`, `measures_media_map.media_role`, `measures_design_token.token_key`

### LOCATION

Renderer correction report when diagnostics are visible.

### INTERNAL SOURCE

DB/runtime diagnostic report.

### RECOMMENDED PUBLIC TERM

`Registry configuration incomplete`

### NOTES

The diagnostic report should remain available for implementation review, but public presentation should not expose table and column names.

---

### CURRENT TERM

`Article route not seated`, `Publication dispatch is not seated`, `state missing`, `records are seated`

### LOCATION

Structural Drift dispatch surface and process log empty states.

### INTERNAL SOURCE

Registry seating and route-state language.

### RECOMMENDED PUBLIC TERM

`This analysis is not yet available.` or `This record is not yet published.`

### NOTES

`Seated` is native c3 language. It should remain in OAR/DB/process documentation, but public empty states should use availability language.

---

### CURRENT TERM

`Operator only`, `Operator dispatch key`, `server-side Resend provider`, lifecycle states

### LOCATION

Seat hold notification review surface.

### INTERNAL SOURCE

Operator notification review system.

### RECOMMENDED PUBLIC TERM

Do not expose as public encounter language. Keep as `Operator Review` in an operator-only surface.

### NOTES

This surface is explicitly operator-facing. The issue is access and routing boundary, not copy alone.

---

### CURRENT TERM

`DB-first rendering`, `Verification before deployment`, `frontend copy`, `unregistered truth`

### LOCATION

Cohort conversion metadata and public educational passages.

### INTERNAL SOURCE

Native implementation and governance contract language.

### RECOMMENDED PUBLIC TERM

`registered source of record`, `review before release`, `unverified public behavior`

### NOTES

The ideas are valid, but the current phrasing can sound implementation-facing.

## CTA CONSISTENCY FINDINGS

Current CTA families:

- `Enter`
- `Continue`
- `Continue to Assessment`
- `Begin Evaluation`
- `Begin Structural Evaluation`
- `Begin Assessment`
- `Complete Assessment`
- `Enter Structured Environment`
- `Read Dispatch`
- `Read Dispatches`
- `Receive Registry Dispatches`
- `Request Cohort Consideration`

Recommended CTA pattern:

- Use `Enter` for first threshold entry only.
- Use `Continue` only for non-semantic progression inside the same encounter.
- Use `Begin Assessment` for the main assessment start.
- Use `Complete Assessment` for the final assessment submission.
- Use `Enter Structured Environment` for the post-assessment destination.
- Use `Read Analysis` or `View Registry Analysis` for publication content.
- Use `Receive Registry Updates` for subscription.
- Use `Request Review` or `Request Cohort Review` for cohort interest.

Avoid mixing `evaluation`, `diagnostic`, and `assessment` in the same CTA cluster unless the distinction is intentional and visible.

## RECOMMENDED PUBLIC ENCOUNTER VOCABULARY

### Progression

- `Enter`
- `Continue`
- `Begin Assessment`
- `Complete Assessment`
- `Enter Structured Environment`

### Assessment

- `Assessment Chamber`
- `Institution Profile`
- `AI Environment Review`
- `Assessment Complete`
- `Structured Review`

### Structured Pathways

- `Recognition Passage`
- `Structured Environment`
- `Foundational Cohort`
- `Cohort Review`
- `Conversion Review`

### Governance Concepts

- `authority`
- `validation`
- `oversight`
- `traceability`
- `decision boundaries`
- `governance readiness`

### Publication And Archive

- `Registry Analysis`
- `Structural Drift`
- `Field Notes`
- `Registry Updates`
- `Read Analysis`

### Intake And Completion

- `Institution Profile`
- `Contact Information`
- `System Context`
- `Observed Instability`
- `Review Submitted`
- `Assessment Received`

### Audio

- `Audio`
- `Mute`
- `Enable sound`

## BOUNDARIES PRESERVED

Internal/native terms should remain preserved in:

- DB keys
- route keys
- OAR files
- implementation docs
- media roles
- runtime contracts
- process records
- operator-only review surfaces

Public encounter language should not rename or redefine internal authority.

Recommended replacements are translation-layer recommendations only.

## NON-MUTATION CONFIRMATION

No implementation rewrite was performed.

No runtime copy mutation was performed.

No DB mutation was performed.

No schema, media map, release state, or route authority was changed.

No alternate public authority was introduced.

## RECOMMENDED NEXT OAR2

Open a bounded OAR2 for public-language seating only after operator review.

Suggested scope:

- replace visible `Soft SRC Intake` label
- translate `IIS Evaluation Gate 1`
- normalize assessment/evaluation/diagnostic CTA sequence
- translate public empty states away from DB/table language
- separate operator-only process language from public encounter language
- preserve all DB keys, route keys, and internal OAR terminology

## CLOSE

Native language governs the system.

Public language governs the encounter.

The required correction is translation alignment, not architecture replacement.
