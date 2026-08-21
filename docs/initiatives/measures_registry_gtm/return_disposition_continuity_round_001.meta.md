---
title: Return and Disposition Continuity — Research Round 001
status: research_only
branch: gtm-ledger-v1
operator: op044
date: 2026-08-21
---

# Question

What must return to the originating authority after a consequential computational act so the relationship can be closed, changed, held, reviewed, or dispositioned?

# Evidence basis

This round builds only on already surfaced 2026 standards evidence from the prior cross-domain authority continuity research:

- agent delegation receipt work distinguishing user intent, operator, agent, and downstream services;
- authorization-evidence work creating signed evidence tied to the dispatched request;
- cross-organization delegation work distinguishing key possession, delegated authority, and human authorization across independent organizations;
- existing project evidence that authentication, authorization, delegation lineage, and execution evidence are separate layers.

A fresh web re-check was attempted on 2026-08-21 but the web index returned repeated 503 errors, so this round does not add unsupported new external claims.

# Finding

Existing standards work is increasingly capable of proving who acted, what request was authorized, and how authority was delegated. That is necessary but not sufficient for governed completion.

A consequential relationship remains open unless enough state returns to the originating authority to determine the standing of the relationship after execution.

# Return is not a callback

A technical response can confirm that an API call completed, an agent returned output, or a workflow reached a terminal state. A governed return must preserve enough state for the originating authority to answer:

1. What action actually occurred?
2. Under whose authority did it occur?
3. Did execution remain within the delegated bounds?
4. What evidence was used or produced?
5. What changed in the environment or governed object?
6. Were any exceptions, failures, substitutions, holds, or unresolved conditions encountered?
7. What downstream dependencies participated materially?
8. What result came back to the originating authority?
9. What standing now attaches to the relationship: complete, held, disputed, failed, revoked, superseded, expired, or unresolved?
10. Who has authority to disposition that standing?

# Proposed research distinction

- authentication proves acting identity;
- authorization proves local permission;
- delegation lineage proves where authority came from and how it was bounded;
- execution evidence proves what happened;
- return reconstructs the resulting state for the originating authority;
- disposition determines what that authority does with the returned state.

# Minimum governed return bundle — research candidate

A return should preserve, at minimum:

- originating authority reference;
- delegated authority reference;
- acting identity and environment;
- bounded capability exercised;
- executed action identifier;
- result/output reference;
- evidence/provenance reference;
- material downstream dependencies used;
- change/version state;
- exception/hold/failure state;
- validation result;
- resulting standing;
- return timestamp;
- receiving authority;
- disposition status or explicit pending-disposition state.

# Critical boundary

The return must not create new outbound authority.

Execution can report what happened. Return can establish evidence and resulting state. Only the originating or otherwise duly constituted authority can disposition the returned state.

This prevents a downstream executor from converting successful execution into self-generated standing.

# Why this matters

Without governed return, authority can travel outward while accountability does not reliably travel back.

That produces a one-way system:

originating authority -> delegation -> execution -> local logs

The governed form must close the loop:

originating authority -> delegation -> execution -> evidence/result/change/exception -> return -> disposition

# Computational succession implication

A successor computational environment may lawfully exercise delegated authority without inheriting the right to determine final standing.

Operational control therefore does not imply disposition authority.

This is the computational analogue worth testing against legal succession/reserved-rights mechanics, but it is not asserted here as law.

# Falsifier

If a broadly deployed standards stack already carries end-to-end authority, execution, resulting state, exception state, accountable return, and disposition across autonomous organizations, then this MR differentiation narrows materially.

# MR relevance — held as hypothesis

Measures Registry may matter if it can preserve the full governed loop across autonomous environments:

originating authority -> bounded relation -> execution -> accountable return -> authoritative disposition

MR must not become the sovereign or final decision-maker. Its potential value is preserving relationship integrity through the crossing and return.

# Standing

Supported as a systems requirement: consequential cross-domain execution needs more than authentication and local execution logs to establish accountable completion.

Not yet externally proven as a unique MR capability.

Research only. No Source, Concordance, Registry, Supabase, deployment, or terminology mutation authorized or performed.
