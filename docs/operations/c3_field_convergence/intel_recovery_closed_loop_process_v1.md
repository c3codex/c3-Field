# Intel Recovery Closed Loop Process
## c3 Field Convergence — Version 1

## Purpose

This process creates a bounded closed loop for Operator/Cody to Chazz intel recovery.

It prevents recovered thread intelligence from becoming informal authority, while preserving useful operational memory for Chazz review and incorporation.

## Core Loop

```txt
Operator signal
-> Cody capture
-> recovery packet
-> Chazz review
-> Chazz classification
-> correction / incorporation / rejection
-> OAR1 closeout
-> transition log
```

## Roles

### Operator

The Operator may:

- signal that intel recovery is needed
- identify source thread or session context
- resolve ambiguity
- authorize incorporation route when authority is unclear

The Operator may not:

- bypass Chazz classification
- treat recovered intel as governing without seated standing

### Cody

Cody may:

- capture thread/session intel
- structure a recovery packet
- identify possible affected surfaces
- identify authority risks
- recommend a classification for Chazz review
- write OAR1 evidence after the loop closes

Cody may not:

- decide final standing
- incorporate recovered intel as authority
- silently mutate implementation from recovered intel
- bypass Chazz review

### Chazz

Chazz may:

- classify recovered intel
- approve incorporation
- route correction
- reject out-of-scope material
- require Operator decision
- define next OAR2 standing

Chazz may not:

- erase rejected or correction-required intel
- bypass OAR lifecycle
- collapse review into execution

## Process States

Allowed states:

- `capture_requested`
- `capture_in_progress`
- `packet_ready_for_chazz`
- `chazz_review_required`
- `incorporation_approved`
- `correction_required`
- `rejected_out_of_scope`
- `closed_logged`

## State Transitions

### capture_requested -> capture_in_progress

Allowed when:

- Operator identifies a source thread/session
- Cody has bounded capture scope

### capture_in_progress -> packet_ready_for_chazz

Allowed when Cody creates a recovery packet containing:

- source context
- recovered intel summary
- affected standing
- authority risk
- recommended classification

### packet_ready_for_chazz -> chazz_review_required

Allowed when the packet is complete but not yet classified.

### chazz_review_required -> incorporation_approved

Allowed only when Chazz confirms the intel may be incorporated through a seated route.

### chazz_review_required -> correction_required

Allowed when the intel reveals drift, contradiction, missing source standing, or implementation risk.

### chazz_review_required -> rejected_out_of_scope

Allowed when the intel is irrelevant, unsafe, ungrounded, or outside current authority.

### any terminal classification -> closed_logged

Allowed when OAR1 evidence and transition log capture the outcome.

## Classification Types

Chazz classification options:

- `incorporate_as_seeded_reference`
- `route_to_correction_oar2`
- `hold_pending_operator`
- `hold_pending_source`
- `reject_out_of_scope`
- `archive_as_non_governing_context`

## Incorporation Rules

Recovered intel may govern implementation only after:

1. Chazz classifies it.
2. Required authority is confirmed.
3. A seated OAR2 or seeded reference route exists.
4. OAR1 closeout records the incorporation.
5. Transition log records the outcome.

## Rejection Rules

Rejected intel must remain traceable.

Do not delete the packet.

Record:

- why it was rejected
- who classified it
- whether it may be reconsidered
- whether a correction route is required

## Correction Rules

If correction is required:

- preserve the original packet
- preserve the validation finding
- create or route to correction OAR2
- retain partial or affected OAR1 references
- append transition log event

## Packet Storage

Recovery packets should be stored under:

```txt
docs/operations/c3_field_convergence/intel_recovery_packets/
```

Naming pattern:

```txt
intel_recovery_packet_<short_key>_v1.md
```

## Minimum Packet Fields

Every packet must contain:

- packet key
- source thread/session
- operator signal
- Cody capture summary
- candidate recovered intel
- affected standing
- authority risk
- recommended Chazz classification
- Chazz classification
- required decision
- incorporation route
- correction route
- rejection reason
- OAR references
- closeout standing

## Closeout Requirement

Every intel recovery loop must close with OAR1 evidence.

Closeout must state:

- what was recovered
- what Chazz classified
- what was incorporated, held, corrected, or rejected
- what transition event was appended
- whether the recovered intel governs anything

## Boundary

No recovered intel may silently govern implementation.

Closed loop or no authority.
