# OAR2 — Evaluation Chamber SRC Intake + Media Role Mapping Completion v1

## OBSERVED

Evaluation chamber refinement advanced before two required passage conditions were fully closed:

1. SRC-held institutional intake fields were not fully represented or explicitly routed from the evaluation identity form.

2. Evaluation chamber media role mapping remains incomplete in runtime registry state.

Live runtime now exposes:

Evaluation chamber media role mapping is incomplete in the runtime registry.

This warning is valid.

It indicates the renderer is correctly refusing to invent missing media-role authority.

The issue is not a frontend styling problem.

The issue is incomplete seated runtime state and incomplete SRC intake binding.

Additionally, prior OAR2 work emphasized:

- single-question chamber pacing
- public label cleanup
- branded evaluation surface
- visual refinement
- protocol reveal semantics

but did not fully bind:

- SRC field requirements
- Gate 1 completion requirements
- evaluation chamber media role mappings
- runtime registry completeness

This created a seam between encounter design and passage validity.

## NOTCHAZZ FLAG

Evaluation chamber refinement advanced without confirming complete SRC-held intake requirements and media role mapping.

This must be corrected before further visual expansion.

## ALIGNED

The evaluation chamber is not only a visual surface.

It is a Gate 1 Assessment Passage.

Gate 1 may only be considered complete when:

assessment returned
+
SRC requirements satisfied

The identity form must therefore function as SRC-held institutional intake, not a generic pre-form.

The renderer must continue to avoid frontend-owned fallback truth.

If media role mapping is incomplete, the correct solution is to complete registry state, not suppress the warning visually.

Authority order remains:

Codex ? Field ? Measures ? Chazz ? Cody ? src

Frontend renders seated state only.

## ROUTED

### 1. Complete SRC-held identity intake fields

The evaluation identity form must capture or explicitly route all required held SRC fields for Gate 1 institutional assessment standing.

Required visible fields:

- institution_name
- institution_type
- institution_address
- institution_phone
- contact_name
- contact_position
- contact_email
- intent

Optional/context field:

- capture_context

Current table fields already include:

- institution_name
- institution_address
- institution_phone
- contact_name
- contact_position
- contact_email
- evaluation_answers
- capture_context
- intent
- eligibility
- campaign_tag
- notification_state
- confirmation_email_state
- metadata
- created_at
- updated_at

### 2. Route institution_type explicitly

Because no current column named institution_type is confirmed, route:

institution_type ? metadata.institution_type

Do not silently discard this field.

Do not overload unrelated fields unless explicitly documented.

### 3. Preserve existing capture table unless migration is required

Preferred path:

Use existing table:

public.measures_iis_eval_gate1_capture

Do not add schema unless Cody determines the existing table cannot support required SRC intake data.

If schema change is required, Cody must report it rather than invent migration silently.

### 4. Gate 1 completion rule

Gate 1 completion requires:

- identity/SRC fields completed
- assessment answers completed
- assessment returned
- eligibility updated

Gate 1 must not be treated as complete from assessment answers alone.

Required eligibility marker:

{
  "gate_1": "complete",
  "assessment_returned": true,
  "src_requirements_satisfied": true
}

If SRC requirements are incomplete:

{
  "gate_1": "held",
  "src_requirements_satisfied": false
}

### 5. Complete evaluation chamber media role mappings

Resolve the runtime warning by seating or repairing the evaluation chamber media role map.

Required media roles:

- background
- watermark
- ambient_audio
- question_chamber_background
- assessment_background
- transition_or_pause

If existing media keys are already present in the Measures Registry bucket, map them.

If missing, Cody must report missing media keys and expected storage paths.

No frontend fallback media authority.

No hardcoded media arrays.

### 6. Evaluation chamber visual contract should depend on seated media roles

The chamber may visually render:

- obsidian/lapis environmental background
- visible watermark over blue/lapis chamber surface
- material texture behind question chamber
- ambient/audio control only where audio role exists
- pause/transition surface only where role exists

If a media role is absent, renderer may show a bounded missing-state notice during development, but not invent replacement media.

### 7. Preserve design refinement direction

After SRC and media mapping are corrected, evaluation chamber design should continue toward:

- 5 questions total
- 3 tailored answer options per question
- no rectangular question-box feeling
- stronger Measures Registry brand presence
- visible watermark on blue background
- no overlap between answer tabs and question text
- improved mobile/iPad spacing
- premium institutional chamber atmosphere

This OAR2 does not finalize the 5-question content set.
It creates the required SRC/media foundation so the next refinement can be valid.

### 8. Preserve deterministic assessment mechanics

Do not break:

- answer persistence
- findings generation
- returned assessment logic
- email/report routing
- protocol reveal
- implementation eligibility framing

### 9. Remove warning only by resolving cause

The warning:

Evaluation chamber media role mapping is incomplete in the runtime registry.

must disappear only because the runtime registry mapping is complete.

Do not suppress the warning through CSS or conditional hiding unless registry state is valid.

## CODY ROLE

Cody may:

- add missing SRC-held fields to the evaluation identity form
- route institution_type into metadata
- validate insert/update payloads
- complete media role mapping from seated registry/media records
- report missing media records
- preserve no-fallback rendering discipline
- update Gate 1 eligibility logic
- write OAR1 closeout

Cody may not:

- hardcode media fallbacks
- discard SRC fields
- treat assessment-only submission as Gate 1 completion
- suppress registry warning without resolving registry state
- invent schema migration without reporting need
- create frontend-owned truth

## VALIDATION

This OAR2 resolves successfully when:

- identity form captures required SRC-held institutional fields
- institution_type is preserved in metadata or seated schema
- Gate 1 completion requires SRC requirements + assessment return
- incomplete SRC intake produces held standing
- media role mapping warning no longer appears due to completed registry mapping
- evaluation chamber still renders from seated runtime state
- deterministic assessment behavior remains intact
- no frontend-owned fallback media is introduced

## EXPECTED OAR1

docs/oar/measures_registry/oar1_evaluation_chamber_src_intake_media_role_mapping_completion_v1.meta.md

## PROCESS REFERENCE

Implementation branch:

measures

Downstream process alignment target:

c3field

## CLOSE

Correct the seam before expanding.

Gate 1 is not complete until SRC passage and assessment standing both resolve.
