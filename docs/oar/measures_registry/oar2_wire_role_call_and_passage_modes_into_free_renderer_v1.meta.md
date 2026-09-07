---
document_type: oar2
authority_level: launch_repair
document_scope: free_role_call_repair
title: OAR2 - Wire role_call and Passage Modes into FREE Renderer
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Wire role_call and Passage Modes into FREE Renderer

## PURPOSE

Repair FREE by wiring native role_call and passage mode resolution into the encounter renderer pipeline.

This is launch repair.

Nothing is invented.
Evidence precedes mutation.

## OBSERVED

FREE is active but incomplete.

Current failure pattern:

- duplicate or mismatched path-choice experience
- unapproved copy appears
- media framing is wrong
- Crystal/About renders raw stacked content
- assessment contact capture is skipped
- assessment completion routes to about
- result or MAP completion flow is not reached

Registered native standing now exists:

- nine roles
- role_call
- passage modes
- encounter order

FREE does not yet read or enforce this standing.

## NATIVE ORDER TO IMPLEMENT

EncounterBoundary
  -> role_call
  -> Chamber assembles
  -> Role authorizes
  -> Passage mode carries
  -> Passage moves
  -> Renderer manifests
  -> Optics proves

## REGISTERED ROLE STANDING

There are exactly nine roles.

Obsidian:
- obsidian_gatekeeper
- obsidian_examiner
- obsidian_witness

Lapis:
- lapis_guide
- lapis_scribe
- lapis_steward

Marble:
- marble_resolver
- marble_cartographer
- marble_sealkeeper

No additional roles may be invented.

## REGISTERED PASSAGE MODES

Allowed passage modes:

- human_touch
- AI_touch
- secure_passage

Passage modes are not roles.

Passage modes may not authorize themselves.

Renderer may not infer passage mode without role_call.

## REQUIRED ACTIONS

### 1. Add role_call resolution to FREE

FREE must resolve role_call before chamber renderer manifestation.

Add a role_call resolver using registry metadata already seated on measures_registry_root:

- role_call_standing
- native_role_registry
- passage_modes
- legacy_implementation_field_mapping

Do not invent new DB schema unless required and separately authorized.

### 2. Translate legacy implementation fields to native authority

Do not call them native contracts.

The term contract remains reserved for smart_contract only.

Map legacy fields as implementation legacy:

- src_intake_contract -> secure passage intake requirement
- assessment_contact_capture_oar1_binding_contract_v1 -> Lapis Steward contact passage requirement
- assessment_evaluation_report_contract_v1 -> Marble Resolver result requirement
- active_contract_key_reconciliation -> active agreement reconciliation
- measures_registry_public_runtime_boundary_v1 -> public encounter boundary

Implementation may still read legacy field names where they exist.

Public/native naming must not introduce non-smart-contract contract terminology.

### 3. Assessment role_call requirements

For measures_assessment, resolve and enforce:

- obsidian_examiner for assessment mechanics
- obsidian_witness for recorded encounter evidence
- lapis_steward for contact capture and secure passage
- marble_resolver for result standing
- marble_cartographer for MAP or next-path routing

Required outcomes:

- 7 questions render
- contact capture renders after questions
- DB-driven required fields are honored
- DB-driven consent fields are honored
- consent fields remain unchecked by default
- boundary notice remains governed
- assessment capture inserts into measures_iis_eval_gate1_capture
- notification_state remains queued
- structured_email_artifact remains in metadata
- email dispatch compatibility preserved

### 4. Copy role_call requirements

For public copy and path-choice wording, resolve:

- lapis_scribe

Trace all public path-choice copy.

Specifically identify source of any unapproved copy including:

- Measures Conversion

If source is hardcoded, remove it or replace only with approved DB-seated wording.

If source is stale DB content, report exact table, key, and field.

Do not invent replacement copy.

### 5. Passage mode requirements

Apply passage modes only when authorized:

- human_touch for guided participant-facing movement
- AI_touch for assessment synthesis or result support
- secure_passage for consent, contact capture, boundary confirmation, or protected handoff

Do not allow renderer to infer these modes without role_call.

### 6. Transition repair

Assessment completion must not route to /about-measures-registry as fallback.

Post-assessment route must follow governed authority:

- result standing
- MAP-ready completion
- map_integrity_governance if authorized by Marble Cartographer

Restore governed CTA or transition override behavior if present in seated DB state.

Do not hardcode route outcomes except as held-state fallback.

### 7. Presentation repair after authority

Only after role_call resolution is wired:

- remove duplicate path-choice experience
- restore approved path-choice visual framing
- make media fill intended frame
- repair Crystal/About presentation
- prevent raw stacked metadata rendering
- preserve legal/footer links

Do not solve authority problems with styling-only patches.

## PRESERVE

Do not change:

- DB schema unless separately authorized
- scoring logic
- legal copy
- consent copy
- email dispatch functions
- publication routes
- Stripe behavior
- Paragraph standing
- Buffer standing

Do not activate:

- SEAT checkout
- certification
- c3 Key issuance
- social registry
- charitable solicitation
- tax-deductible contribution claims

## VALIDATION

Return OAR1 evidence showing:

1. FREE reads role_call_standing.
2. FREE reads native_role_registry.
3. FREE reads passage_modes.
4. role_call resolves before chamber renderer manifestation.
5. No more than nine roles are recognized.
6. Passage modes are not treated as roles.
7. measures_assessment calls required roles.
8. Contact capture renders after assessment questions.
9. Consent fields remain unchecked by default.
10. Capture insert still works.
11. notification_state remains queued.
12. structured_email_artifact remains compatible with email dispatch.
13. Post-assessment no longer routes to about fallback.
14. Result or MAP completion flow is reached.
15. Source of Measures Conversion is identified.
16. Unapproved copy is removed or held with exact disposition.
17. Path-choice duplicate behavior is resolved.
18. Path-choice media fills intended frame.
19. Crystal/About no longer renders raw stacked metadata.
20. registered_runtime remains rollback-only.
21. Build passes.
22. Browser QA passes on mobile and desktop.

## NOTCHAZZ FLAGS

Raise NotChazz if:

- role_call is bypassed
- chamber renderer manifests before role authorization
- more than nine roles are introduced
- passage modes are treated as roles
- passage modes authorize themselves
- non-smart-contract contract terminology is introduced as native standing
- unapproved copy remains public
- replacement copy is invented
- contact capture is skipped
- assessment completion routes to about fallback
- registered_runtime becomes active route authority
- consent behavior changes
- email dispatch compatibility breaks
- legal copy changes
- payment activates unexpectedly
- operator is governed instead of the work body

## CLOSE

Wire role_call.

Carry passage modes.

Then manifest.

The system aligns.
