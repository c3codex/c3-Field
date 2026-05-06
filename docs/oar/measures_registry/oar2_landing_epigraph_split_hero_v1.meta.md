---
document_type: oar2
title: OAR2 — Landing Epigraph + Split Hero (Measures Registry)
version: v1
status: ready_for_cody
system: measures_registry

execution_type:
  - frontend_runtime
  - media_map
  - capture_flow

execution_mode:
  - full

canonical_keys:
  surface: landing_root
  encounter_key: landing_root

  child_encounters:
    - educate_eval_encounter
    - cohort_conversion_encounter
    - iis_eval_gate1

  media_roles:  located in bucket measures_registry
    - epigraph_video registry_epigraph_fracture_to_alignment_15s
    - hero image hero_fracture_measuire.webp
           - explainer_video structural_coherence_explainer_45s.webp

  action_keys:
    - route_educate_eval
    - route_course_review
    - route_cohort_conversion

deploy: requires_confirmation

fallback_policy: report_only_no_invention

do_not_touch:
  - measures_of_inanna
  - seat_capture_flow
  - production_env_vars

validation:
  requires_db_connection: true
  requires_build: true
  requires_storage_check: true
  requires_deploy: false
---

# OAR2 — Landing Epigraph + Split Hero

## Observed

- Landing requires epigraph autoplay encounter.
- Landing requires split hero routing structure.
- Left hero must route into educational diagnostic evaluation.
- Right hero must route into cohort conversion encounter.
- Evaluation must identify implementation absence and structural drift.
- Evaluation must remain distinct from SRC and c3 key assignment.
- Frontend must not invent missing media, routing, scoring, or authority.

## Aligned

### Landing Flow

epigraph
→ split hero
→ left = educate/evaluate path
→ right = cohort conversion path

### Epigraph

- 15s autoplay video
- audio unmuted by default
- subtle controls:
  - mute
  - skip
- transition on:
  - video completion
  - skip

### Left Hero

- fracture visual
- title: System Evaluation
- routes to: educate_eval_encounter

### Right Hero

- measured corridor visual
- title: Measures Conversion
- subtitle: Structured Foundational Cohort
- routes to: cohort_conversion_encounter

## Routed

# EDUCATE / EVALUATE PATH

## educate_eval_encounter

Layout order:

1. 45s explainer
2. structural explanation copy
3. Begin Evaluation CTA
4. iis_eval_gate1 capture

Purpose:

Educational + diagnostic encounter prior to conversion consideration.

---

# iis_eval_gate1

Purpose:

Institutional structural evaluation intake.

This is:

- not SRC
- not c3 key assignment
- not wallet connected
- not conversion binding

Used to identify:

- structural drift
- missing implementation layers
- governance absence
- frontend invention risk
- uncontrolled AI deployment
- traceability gaps

---

# DB MUST SEAT

## Capture Fields

institution:
  - institution_name
  - institution_address
  - institution_phone

contact:
  - contact_name
  - contact_position
  - contact_email

---

## Evaluation Sections

1. AI usage scope
2. deployment maturity
3. system / website structure
4. witnessed AI behavior
5. governance + validation

Questions are intentionally non-exhaustive.

Purpose:
- identify implementation absence
- reveal structural gaps
- expose drift patterns

No scoring system permitted.

---

## Evaluation Resolution Text

Structural drift indicators were identified.

Your evaluation has been seated for educational review eligibility.

Qualified organizations may enroll in the Measures foundational course sequence at reduced institutional entry standing prior to full conversion assessment.

---

## Capture Metadata

```json
{
  "capture_context": "iis_eval_gate1",
  "intent": "system_evaluation_request",
  "eligibility": {
    "foundational_courses": true,
    "conversion_assessment": "pending_review"
  }
}EMAIL FLOW
Submission flow:
DB insert
→ internal notification
→ evaluation confirmation email
→ campaign tag: iis_eval_gate1
Subject:
Evaluation Received — Educational Review Pending
Tone:


institutional


diagnostic


non-promotional


No marketing language.

FRONTEND MUST


render epigraph before hero


transition hero after skip or completion


route hero selections into distinct encounters


render explainer from DB media role


bind CTA actions from registered action_keys


keep evaluation DB-bound


report missing state honestly



FRONTEND MUST NOT


hardcode media paths


invent fallback copy


invent routing


score organizations


imply conversion approval


simulate authority


bypass DB state


modify Measures of Inanna


touch production env vars



IF MISSING
Cody must report:


missing encounter_key


missing media_role


missing storage path


unresolved public URL


missing action_key


missing capture structure


No invented replacement behavior.

VALIDATION
Cody must run:
select encounter_key, metadatafrom public.measures_encounter_defwhere encounter_key in (  'landing_root',  'educate_eval_encounter',  'cohort_conversion_encounter',  'iis_eval_gate1');
Cody must confirm:


DB connection active


required encounters exist or exact absence reported


media roles resolve or exact missing paths reported


no hardcoded media in src


no scoring logic introduced


build succeeds


no deploy unless separately confirmed



Cody Role
Cody may:


implement frontend runtime from OAR2


wire landing encounters to DB metadata


map media roles to storage resolution


implement epigraph → hero transition


implement evaluation encounter routing


implement DB-bound capture flow


report missing state


Cody may not:


invent DB state


invent scoring


hardcode media as shortcut


override OAR2


deploy without confirmation



Success Condition


epigraph loads first


hero routes into distinct encounter paths


left path operates as educational diagnostic flow


evaluation exposes structural implementation gaps


completed evaluations seat educational eligibility


evaluation remains distinct from SRC


all capture remains DB-bound and traceable


email flow attaches to iis_eval_gate1


no frontend-owned truth introduced



Close
Codex defines.
Field structures.
Measures registers.
Chazz routes.
Cody executes.
Frontend renders.
