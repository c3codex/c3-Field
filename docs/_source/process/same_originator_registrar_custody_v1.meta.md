---
document_type: source_process
title: Same-Originator / Registrar Custody Rule v1
status: operative_pending_operator_closeout
version: v1
operator: op044
system: c3_ops
process_key: same_originator_registrar_custody_v1
execution_instance_id: harden_same_originator_registrar_custody_chazz_002
---

# Same-Originator / Registrar Custody Rule v1

## Purpose

Govern any operation in which one actor occupies more than one consequential role, including originator, executor, registrar, reviewer, or related custody roles.

## Core Rule

Identity may consolidate. Accountability may not.

An actor may occupy multiple authorized roles within one governed operation where the registered process permits it. Role consolidation does not consolidate custody, evidence, standing, or disposition. Each consequential act must remain independently attributable to the role under which it occurred and must be permanently evidenced on the operation's OAR1.

## Functional Independence

The following may be performed by the same actor where authorized:

- originator
- executor
- registrar

But the acts remain distinct:

OriginatingAct != ExecutionAct != RegistrationAct != EvidenceOfActs

Identity equality does not collapse functional accountability.

## Operator Return and Final Disposition

Evidence of consequential execution must return to the Operator before final disposition or closeout standing.

The executor/registrar may form and return the permanent OAR1 evidence record, but may not approve its own closeout when this rule applies.

The Operator is the final disposition authority for approve, hold, reject, or correction disposition unless another registered process explicitly establishes a different disposition authority.

## Permanent OAR1 Requirements

The permanent OAR1 must independently identify:

- originator
- executor
- registrar
- reviewer or disposition authority where applicable

For every mutation class, the OAR1 must explicitly record changed / unchanged / not applicable and supporting evidence:

- Source
- Registry/database
- Git
- storage/media
- deployment/runtime
- external configuration/API
- public state
- schedule/automation/process

Absence of mutation may not be inferred from silence.

## Independence Rule

Downstream success does not prove upstream mutation, custody, authorization, or evidence.

Examples:

- deployment success does not prove Git mutation evidence;
- Registry state does not prove Source mutation evidence;
- public verification does not prove deployment custody;
- actor identity does not prove role authority.

Each consequential claim requires its own attributable evidence.

## Git Evidence

If Git-tracked source changes, the permanent OAR1 must record at minimum:

- repository
- branch
- pre-change commit
- post-change commit
- changed paths
- mutation purpose
- commit SHA
- push standing
- deployment standing where applicable
- execution identity
- related Registry/process keys

## Standing Rule

This process may not receive final governed operational standing until:

1. the Source artifact exists in governed Source custody;
2. its integrity hash is recorded;
3. Registry resolves to that Source artifact and hash;
4. the execution evidence is returned to the Operator;
5. the Operator approves the returned evidence.

## Governing Principle

Minimum sufficient separation of function and evidence is required even when identity is consolidated.
