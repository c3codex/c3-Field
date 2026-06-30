---
document_type: oar2
authority_level: launch_repair
document_scope: free_role_call_repair
title: OAR2 - Wire role_call and Passage Modes into FREE Renderer
status: proposed
version: v2
operator: op044
system: measures_registry
---

# OAR2 - Wire role_call and Passage Modes into FREE Renderer

## PURPOSE

Wire native role_call and passage mode resolution into FREE as structural encounter authorization only.

Do not implement login, permissions, access control, or secure role_key generation.

## REGISTERED STANDING

Use registered standing from:

- nine native roles
- role_call standing
- passage modes
- role_key security boundary

Native order:

EncounterBoundary
  -> role_call
  -> Chamber assembles
  -> Role authorizes
  -> Passage mode carries
  -> Passage moves
  -> Renderer manifests
  -> Optics proves

## SECURITY BOUNDARY

Native roles are not:

- AI role profiles
- login roles
- permission groups
- credentials
- secure role_keys

role_call may determine encounter standing, passage requirements, passage modes, and renderer authorization only.

## REQUIRED REPAIR

1. FREE reads:
   - role_call_standing
   - native_role_registry
   - passage_modes
   - legacy_implementation_field_mapping

2. FREE resolves role_call before chamber renderer manifestation.

3. measures_assessment must call:
   - obsidian_examiner
   - obsidian_witness
   - lapis_steward
   - marble_resolver
   - marble_cartographer

4. Restore assessment behavior:
   - 7 questions render
   - contact capture renders after questions
   - DB-driven required/contact/consent fields honored
   - consent unchecked by default
   - capture inserts into measures_iis_eval_gate1_capture
   - notification_state remains queued
   - structured_email_artifact remains compatible

5. Resolve copy through lapis_scribe.
   Trace and remove/hold unapproved copy, including "Measures Conversion."

6. Resolve post-assessment route through:
   - marble_resolver
   - marble_cartographer

Do not route to /about-measures-registry as fallback.

7. Apply passage modes only after role_call:
   - human_touch
   - AI_touch
   - secure_passage

8. Repair presentation only after authority:
   - duplicate path-choice removed
   - media fills frame
   - Crystal/About no longer raw stacked metadata
   - result/MAP completion reached

## PRESERVE

Do not change:

- legal copy
- consent copy
- scoring logic
- email dispatch functions
- Stripe behavior
- publication routes
- Paragraph/Buffer standing

Do not activate:

- SEAT checkout
- certification
- c3 Key issuance
- social registry
- charitable solicitation
- tax-deductible claims

## VALIDATION

Return OAR1 evidence showing:

- role_call resolves before renderer manifestation
- no more than nine roles recognized
- passage modes not treated as roles
- secure role_key boundary preserved
- assessment contact capture restored
- consent unchecked by default
- capture insert works
- post-assessment does not route to about
- result/MAP completion reached
- unapproved copy source traced
- duplicate path-choice resolved
- registered_runtime remains rollback-only
- build passes
- mobile and desktop browser QA pass

## NOTCHAZZ FLAGS

Raise NotChazz if:

- native role names are used as secure role_keys
- role_call is bypassed
- chamber renderer manifests before role authorization
- contact capture is skipped
- assessment routes to about fallback
- unapproved copy remains public
- invented copy is introduced
- registered_runtime becomes active
- consent behavior changes
- email dispatch breaks
- operator is governed instead of the work body

## CLOSE

Wire role_call.

Carry passage modes.

Then manifest.

The system aligns.
