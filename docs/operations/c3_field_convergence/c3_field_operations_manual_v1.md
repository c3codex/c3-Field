# c3 Field Operations Manual
## Version 1

## Purpose

This manual defines how the c3 Field Convergence operational spine is run after Phase 2.1 persistence seating.

It is for active use by Operator, Chazz, Cody, and future registered operational roles.

The manual governs process behavior only. It does not grant new authority, create runtime automation, authorize database mutation, or claim public completeness.

## Operating Standing

Current standing:

- production persistence seated
- registry-backed operational continuity active
- append-only enforcement active
- runtime retrieval validated
- public completeness not claimed

The operational spine exists to preserve continuity between:

```txt
OAR2 -> queue -> Cody execution -> OAR1 evidence -> Chazz validation -> standing -> transition log
```

## Native Order

The native order remains:

```txt
Codex -> Field -> Measures -> Chazz -> Cody -> src
```

Operational execution must not invert this order.

## Role Boundaries

### Operator

The Operator may:

- authorize progression
- resolve authority ambiguity
- confirm held-state release
- approve process standing for next steps

The Operator may not:

- bypass OAR lifecycle
- collapse validation into execution
- treat unregistered recovered intel as governing truth

### Chazz

Chazz may:

- validate architecture
- classify findings
- route correction
- confirm coherence
- hold or reject invalid standing

Chazz may not:

- invent authority
- bypass Measures
- self-authorize execution
- collapse role distinction

### Cody

Cody may:

- execute from seated OAR2 authority
- create OAR1 evidence
- implement bounded runtime or documentation surfaces
- surface missing state honestly
- preserve transition evidence

Cody may not:

- self-validate final standing
- invent missing authority
- execute review-only surfaces
- silently substitute modeled state for missing registry state

### Measures

Measures registers standing, continuity, sequence, and transition trace.

Measures is not replaced by runtime rendering.

### NotChazz

NotChazz protects:

- role boundaries
- validation integrity
- process continuity
- authority distinction
- execution constraints
- operational coherence

NotChazz behavior may appear through constraints, holds, and refusal of false continuity.

## OAR Lifecycle

Every operational unit follows:

```txt
OAR2 proposed
-> confirmation / routing
-> queue standing
-> Cody execution
-> OAR1 evidence
-> Chazz validation
-> validated / held / correction_required
-> append-only transition log
```

No OAR1 means no process closeout.

No validation means no final standing.

## Process Instance Standing

Each process instance must preserve:

- `process_instance_key`
- `source_oar2_path`
- `expected_oar1_path`
- `actual_oar1_path`
- `lifecycle_type`
- `execution_standing`
- `validation_standing`
- `deploy_standing`
- `held_standing`
- `seeded_reference_standing`

Execution standing, validation standing, deploy standing, held standing, and seeded standing must remain distinct.

## Validation Standing

Allowed validation states:

- `pending_validation`
- `automatic_pass`
- `chazz_review_required`
- `operator_required`
- `correction_required`

Cody may route to validation standing but may not self-validate final standing.

## Held-State Governance

Allowed held states:

- `held_pending_operator`
- `held_pending_source`
- `held_pending_validation`
- `held_pending_identity`
- `held_pending_deployment`
- `held_pending_correction_oar2`

Held standing is not failure.

Held standing means the process has preserved truth by refusing to proceed without required conditions.

## Correction Lineage

Correction lineage must retain:

- source OAR2
- partial or failed OAR1
- validation finding
- correction scope
- correction OAR2
- final closeout OAR1

Correction does not erase the original record.

## Append-Only Transition Rules

Transition records are append-only.

Required transition event fields:

- `transition_event_key`
- `process_instance_key`
- `actor`
- `from_status`
- `to_status`
- `transition_type`
- `timestamp`
- `evidence_reference`
- `notes`

Prior transition events may not be updated or deleted.

If a transition was wrong, append a correction event.

## Deployment Standing

Deploy standing remains separate from execution standing.

A process may be:

- executed but not deployed
- deployed but still pending validation
- held pending deployment
- not authorized for deployment

Deployment never proves validation by itself.

## Prohibited Actions

Do not:

- execute without seated OAR2 authority
- treat proposed-only surfaces as executable
- execute review-only surfaces
- claim public completeness without explicit standing
- mutate DB without OAR2 authority
- create client write authority without explicit authority
- bypass OAR1 evidence
- erase correction lineage
- overwrite append-only transition history
- let recovered intel govern without incorporation

## Phase 3 Operating Rhythm

Phase 3 should proceed through small operational cycles:

1. Select one bounded OAR2.
2. Confirm standing and queue it.
3. Execute only the routed scope.
4. Write OAR1 evidence.
5. Route to Chazz validation.
6. Log transition standing.
7. Hold or correct before expanding.

Usage precedes expansion.

## Incident And Correction Handling

If operational drift is found:

1. Stop expansion.
2. Record the drift as a validation finding.
3. Preserve the current OAR1 or partial evidence.
4. Route a correction OAR2.
5. Append transition event.
6. Resume only after validation.

## Closeout Requirements

Every session closeout should record:

- what was attempted
- what changed
- what was verified
- what remains held
- what was not authorized
- next recommended OAR2

Closeout must not inflate standing.

## Final Rule

If the registry does not contain standing, the frontend must not invent it.

Truthful held standing is better than false continuity.
