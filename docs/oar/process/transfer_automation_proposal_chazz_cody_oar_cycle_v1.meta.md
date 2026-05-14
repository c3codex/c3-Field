---
document_type: proposal
authority_level: working
document_scope: chazz_cody_oar_transfer_automation
title: Transfer Automation Proposal - Chazz / Cody OAR Cycle
status: proposed
version: v1
operator: op044
system: process
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# Transfer Automation Proposal - Chazz / Cody OAR Cycle

## Purpose

Automate the institutional handoff between Operator, Chazz, Cody, Measures, and NotChazz without collapsing role authority.

The goal is to remove manual transfer friction while preserving:

- Operator authorization
- Chazz routing and validation
- Cody execution
- Measures proof registration
- NotChazz/system enforcement

## Current Manual Pattern

1. Operator confirms intent in thread.
2. Chazz produces OAR2.
3. Operator commits OAR2.
4. Operator delivers OAR2 path to Cody.
5. Cody executes.
6. Cody writes OAR1 and evidence.
7. Operator/Chazz reviews after the fact.

This works, but it creates manual delay and makes status tracking dependent on thread memory.

## Proposed Automated Pattern

1. Operator confirms intent.
2. Chazz produces OAR2 with status `confirmed`.
3. System commits or seats the confirmed OAR2.
4. Automation notifies Cody with the OAR2 path.
5. Cody executes strictly from the confirmed OAR2.
6. Cody writes OAR1 and any evidence artifacts.
7. Automation notifies Chazz with the OAR1 path.
8. Chazz validates OAR1.
9. Measures records final standing.

## Status Model

Recommended statuses:

```text
proposed
confirmed
queued_for_cody
executing
oar1_submitted
chazz_validating
validated
correction_required
held
```

## Role Boundaries

Operator:

- confirms intent
- authorizes mutation/deploy level
- resolves held decisions

Chazz:

- produces OAR2
- routes scope
- validates OAR1
- issues correction route when needed

Cody:

- executes only confirmed OAR2
- mutates only inside authorized scope
- writes OAR1/evidence
- reports validation status

Measures:

- registers OAR standing
- stores evidence references
- preserves process trace

NotChazz/system behavior:

- detects status transitions
- sends notifications
- blocks execution of unconfirmed OAR2
- routes failed OAR1 validation into correction state

## Automation Triggers

### Trigger 1 - Confirmed OAR2

Condition:

- OAR2 exists
- `status: confirmed`
- expected Cody role exists
- expected OAR1 path exists

Action:

- notify Cody with OAR2 path
- set status `queued_for_cody`

### Trigger 2 - Cody Execution Start

Condition:

- Cody acknowledges OAR2 path

Action:

- set status `executing`
- record execution thread/session reference if available

### Trigger 3 - OAR1 Submitted

Condition:

- expected OAR1 file exists
- OAR1 references source OAR2
- OAR1 reports mutation/deploy standing

Action:

- notify Chazz with OAR1 path
- set status `oar1_submitted`

### Trigger 4 - Chazz Validation

Condition:

- Chazz review records validation result

Action:

- if valid: set status `validated`
- if correction needed: set status `correction_required`
- if source/authority unresolved: set status `held`

## Execution Guardrails

- Cody must not execute OAR2 with `status: proposed`.
- Cody must not self-validate final institutional standing.
- Chazz must not mutate implementation directly through this automation.
- Correction requires a new or updated OAR2; no silent patching.
- Deploy requires explicit OAR2 permission.
- DB mutation requires explicit OAR2 permission.
- Any failed validation must preserve evidence, not overwrite it.

## Minimum OAR2 Fields For Automation

```yaml
document_type: oar2
status: confirmed
operator: op044
system: <system>
document_scope: <scope>
expected_oar1: <path>
permissions:
  inspect: true
  mutate_db: true|false
  mutate_src: true|false
  deploy: true|false
```

## Minimum OAR1 Fields For Automation

```yaml
document_type: oar1
source_oar2: <path>
execution_status: complete|partial|failed|held
mutation_count: <number>
deploy_status: deployed|not_required|failed|held
validation_summary: <text>
evidence:
  - <path>
```

## Recommended NotChazz Behavior

NotChazz can become the process guard that says:

- unconfirmed OAR2 cannot execute
- missing OAR1 cannot validate
- failed OAR1 cannot disappear
- correction requires routing
- deploy standing must be explicit
- authority roles must remain separate

## Close

Operator authorizes.
Chazz routes.
Cody executes.
Measures records.
NotChazz enforces the cycle.
