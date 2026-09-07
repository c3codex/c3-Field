---
document_type: oar2
authority_level: architecture
document_scope: seat_to_field_transition
title: OAR2 - Define SEAT to c3 Field Operational Transition
status: proposed
version: v1
operator: op044
system: c3_field
executor: Claude
target_branch: c3Field
branch_guard:
  required_branch: c3Field
  stop_if_not_branch: c3Field
---

# OBJECTIVE

Define the operational transition from SEAT verification into c3 Field access.

This OAR clarifies c3 Field as the operations hub and optics dashboard for verified institutions.

Do not implement runtime changes unless explicitly scoped in a follow-up OAR.

Do not apply changes to the measures branch.

---

# BRANCH GUARD

Before any file, schema, or documentation change:

1. Verify current git branch.
2. If branch is not `c3Field`, stop.
3. Report branch mismatch.
4. Do not modify files.

---

# OBSERVED

Measures Registry Phase I is operational.

Several processes originated institutionally but may need to become Field-accessible after SEAT verification.

These include:

- role-defined access
- institution envelope maintenance
- optics visibility
- evidence review
- OAR standing
- future Web3 functions
- future DAO functions

c3 Field should not become a monolithic application.

c3 Field should operate as the verified institution operations hub.

---

# ALIGNED

Measures Registry executes institutional workflows.

c3 Field provides operational visibility, role standing, optics, ledger, and maintenance access after SEAT.

Institutions own their envelopes.

c3 Field governs access and visibility.

Executors act only through role-bound authority.

---

# FIELD SCOPE STATEMENT

c3 Field is the operational environment entered after SEAT verification.

It provides:

- operations hub
- optics dashboard
- role-defined access
- institutional envelope visibility
- maintenance routing
- evidence review
- c3 Ledger standing
- future Web3 / DAO access surfaces

It does not replace institutional systems.

It coordinates, observes, and records them.

---

# ROUTED

## 1. Inspect c3 Field branch and current structure

Verify branch:

`c3Field`

Inspect:

- c3 Field docs
- c3 Field source directories
- current operations spine
- concordance authority
- c3_key / permission structures
- existing optics surfaces
- any ledger-like records

Return existing structures before proposing changes.

## 2. Define SEAT transition model

Document the transition:

Public

↓

Measures Registry Assessment

↓

MAP

↓

SEAT

↓

SEAT Verified Institution

↓

c3 Field Operational Access

Define what is granted at each stage.

Do not grant access in code.

## 3. Define institutional envelope

Create a conceptual definition of an institution envelope.

An envelope should include:

- institution identity
- SEAT standing
- role assignments
- authorized operators
- active OARs
- assets
- evidence
- optics
- maintenance queue
- commerce / payment standing where relevant
- future Web3 / DAO standing

No implementation yet unless already existing structures support documentation only.

## 4. Define Field-accessible institutional processes

Classify processes as:

Institution-executed / Field-observed

Field-managed / Institution-accessible

Future Field-native

Examples:

- Publication distribution
- Commerce evidence
- Assessment history
- MAP standing
- OAR queue
- Optics
- Ledger
- Role permissions
- DAO eligibility

## 5. Define role access model

Keep actor class limited to:

Human

AI

Define role access through:

- operator
- profile
- c3_key
- institution envelope
- permissions

Do not conflate actor class with role.

Do not invent unsupported permission enforcement.

## 6. Define optics dashboard scope

Optics should show:

- institution standing
- active gates
- completed OARs
- pending OARs
- distribution state
- commerce state
- assessment state
- evidence health
- drift / unresolved mismatches

Optics must not model individuals as primary objects.

## 7. Define c3 Ledger standing

Clarify c3 Ledger as append-only institutional history.

It records:

- SEAT verification
- Field access granted
- major standing changes
- first assessment
- first MAP completion
- first institutional adoption
- DAO eligibility milestones

It does not replace OARs.

OAR records work.

Ledger records institutional standing.

## 8. Recommend build sequence

Return a staged build plan.

Suggested stages:

1. Documentation / standing definitions
2. Envelope registry schema
3. Role access review
4. Optics dashboard MVP
5. Ledger MVP
6. Institution maintenance surfaces
7. Web3 / DAO surfaces held

Do not implement these stages here.

## 9. Preserve Measures Registry boundary

Do not move Measures Registry code.

Do not rewrite Measures Registry launch records.

Do not alter publication, campaign, Stripe, Buffer, or assessment state.

This is c3 Field scope work only.

---

# VALIDATION

Return OAR1 with:

- branch verification
- existing structure inventory
- SEAT transition model
- institution envelope definition
- process classification
- role access model
- optics dashboard scope
- c3 Ledger definition
- build sequence
- Measures Registry boundary preserved
- no runtime changes unless explicitly documented

---

# EXPECTED OAR1

OAR/OAR1/c3_field/oar1_define_seat_to_c3field_operational_transition_v1.meta.md

---

# STOP CONDITION

c3 Field has a clear operational scope:

SEAT-verified institutions enter c3 Field for role-bound operations, optics, maintenance, evidence, ledger, and future DAO/Web3 functions.

Measures Registry remains the entry institution and first operational reference implementation.

No branch drift.

No scope drift.
