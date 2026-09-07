---
document_type: oar2
authority_level: architecture
document_scope: role_call_passage_modes
title: OAR2 - Register Passage Modes for role_call Standing
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Register Passage Modes for role_call Standing

## PURPOSE

Register passage modes for role_call standing.

Chambers assemble.

Roles authorize.

Passage modes carry.

Passages move.

Renderers manifest.

Optics proves.

## PASSAGE MODES

Passage modes are not roles.

Passage modes describe how an authorized passage is carried.

A passage mode may only occur after role_call.

A passage mode may not authorize itself.

A renderer may not infer a passage mode without role authorization.

Allowed passage modes:

- human_touch
- AI_touch
- secure_passage

## human_touch

A passage requiring human participation, affirmation, care, review, guidance, or relational handling.

Typical authorities:

- Lapis Guide
- Lapis Steward
- Marble Sealkeeper

## AI_touch

A passage using AI assistance, synthesis, transformation, classification, evaluation, or generated support.

Typical authorities:

- Obsidian Examiner
- Marble Resolver
- Marble Cartographer

## secure_passage

A passage requiring explicit authorization, eligibility, consent, boundary confirmation, protected handoff, or standing verification before movement.

Typical authorities:

- Obsidian Gatekeeper
- Lapis Steward
- Marble Sealkeeper

## UPDATED ENCOUNTER ORDER

EncounterBoundary
  -> role_call
  -> Chamber assembles
  -> Role authorizes
  -> Passage mode carries
  -> Passage moves
  -> Renderer manifests
  -> Optics proves

## REQUIRED ACTIONS

1. Register passage_modes under role_call standing if schema supports it.
2. Register the three allowed passage modes:
   - human_touch
   - AI_touch
   - secure_passage
3. Confirm passage modes are not roles.
4. Confirm passage modes cannot authorize themselves.
5. Confirm renderers may not infer passage modes without role authorization.
6. Do not mutate FREE renderer behavior in this OAR.
7. Do not create additional passage modes.

## VALIDATION

Return OAR1 evidence showing:

- passage_modes registered
- exactly three passage modes registered
- no additional passage modes created
- passage modes are not classified as roles
- passage modes require role_call
- updated encounter order registered
- no FREE renderer mutation
- no styling mutation
- migration validation passes if applicable

## NOTCHAZZ FLAGS

Raise NotChazz if:

- passage modes are treated as roles
- passage modes authorize themselves
- additional passage modes are invented
- FREE repair is performed in this OAR
- contract terminology is reintroduced
- operator is governed instead of the work body

## CLOSE

Register passage modes.

Then repair FREE from role authority and carried passage.

The system aligns.
