---
document_type: gtm_case_frame_mapping
title: McLeod Health × Pre-existing Structural Drift Frame
status: working_falsification_mapping
version: v1
timestamp: 2026-08-21
operator: op044
author: chazz
system: measures_registry
case_source: mcleod_governance_discontinuity_case_001.meta.md
analytical_frame: preexisting_structural_drift_frame_2026_w28_reference.meta.md
registry_standing: unregistered
---

# McLeod Health × Structural Drift Mapping

## Purpose
Test McLeod Health Governance Discontinuity Case 001 against the seven Structural Drift Indicators defined before the healthcare GTM research.

This is a falsification exercise. McLeod is not presumed to exhibit structural drift merely because it required substantial governance work.

## Mapping Rule
Allowed dispositions:
- `direct_fit`
- `partial_fit`
- `no_fit`
- `insufficient_evidence`

A successful compensating control is not itself evidence that drift occurred. Where McLeod's process appears to have prevented a drift condition, that is recorded separately.

## 1. Ownership Drift
**Frame:** Agents operate without a clearly accountable owner or with ownership fragmented among IT, security, engineering, vendors, and business units.

**McLeod evidence:** The case involved CMIO leadership plus clinical, operational, revenue-cycle, informatics, security, physician, and executive participation. The published case demonstrates distributed review roles but does not establish that ownership of the deployed system was unclear or unaccountable.

**Disposition:** `no_fit`

**Interpretation:** Multi-role governance is not equivalent to ownership drift. McLeod appears to have constructed accountable participation rather than suffered demonstrated ownership failure.

## 2. Authority Drift
**Frame:** Technical capability or inherited access is mistaken for legitimate authority.

**McLeod evidence:** The case documents staged evaluation, security review, bounded pilot participation, go/no-go decisions, and phased rollout. It does not show Suki's technical capability or Epic integration being treated as sufficient authority to operate.

**Disposition:** `no_fit`

**Interpretation:** McLeod's process is better read as evidence that the institution did *not* equate capability with authority.

## 3. Position Drift
**Frame:** AI is assigned an objective or operational function without evaluating whether that function should exist, how it contributes to the institution, or what harm may result if executed as assigned.

**McLeod evidence:** McLeod explicitly evaluated ambient documentation against clinical workflow, provider burden, coding/revenue effects, patient/provider experience, data safety, operational scalability, and financial objectives before broad rollout.

**Disposition:** `no_fit`

**Interpretation:** The case functions as a counterexample to Position Drift: the institution performed significant work to determine whether the operational position should exist and under what conditions.

## 4. Identity Drift
**Frame:** Human accounts, service identities, shared credentials, workload identities, and agent identities are used inconsistently.

**McLeod evidence:** The published case does not provide sufficient technical identity/account detail to determine how clinicians, Suki services, Epic identities, workload identities, or access credentials were represented.

**Disposition:** `insufficient_evidence`

## 5. Runtime Drift
**Frame:** Governance exists in policies and meetings but is not represented in the environment where the agent acts.

**McLeod evidence:** McLeod required live simulations, Epic workflow demonstrations, a 90-day bounded pilot, staged onboarding, internal data verification, and continued operational measurement before and after rollout.

**Disposition:** `no_fit`

**Interpretation:** The case demonstrates governance being carried into observed runtime/workflow evaluation rather than remaining only in policy or committee discussion.

**Open question:** The case does not establish whether authorization and governance conditions were technically encoded into the runtime environment or maintained through separate institutional processes. That is a governance-discontinuity question, not proof of Runtime Drift.

## 6. Evidence Drift
**Frame:** Organizations cannot reconstruct what the agent did, what information influenced it, why it acted, or which authority permitted the action.

**McLeod evidence:** McLeod did not simply accept vendor-reported financial/coding evidence; it independently verified results against Epic Signal, charge, RVU, scheduling, and revenue data. Continued ROI validation and operational measurement persisted after rollout.

**Disposition:** `partial_fit`

**Why only partial:** The evidence supports a boundary condition in which vendor evidence was not institutionally sufficient and had to be reconstructed/corroborated locally. The case does *not* establish that McLeod was unable to reconstruct the AI's actions, inputs, rationale, or authorizing authority.

**Implication:** This may be better classified as **evidence discontinuity across organizational boundaries** than Evidence Drift in the strict July definition.

## 7. Response Drift
**Frame:** Human review and incident response remain slower than the computational systems they are expected to govern.

**McLeod evidence:** The published case does not document a machine-speed incident, delayed human response, or inability to interrupt problematic operation.

**Disposition:** `insufficient_evidence`

## Result Summary
| Indicator | Disposition |
| --- | --- |
| Ownership Drift | `no_fit` |
| Authority Drift | `no_fit` |
| Position Drift | `no_fit` |
| Identity Drift | `insufficient_evidence` |
| Runtime Drift | `no_fit` |
| Evidence Drift | `partial_fit` |
| Response Drift | `insufficient_evidence` |

## Critical Finding
McLeod does **not** strongly validate the seven-drift frame as a case of realized structural drift.

That is useful.

McLeod is primarily a case of **successful compensatory governance around a governance discontinuity**. The institution performed substantial work that appears to have prevented or bounded several drift conditions before broad deployment.

The strongest overlap is evidence-related, where vendor-supplied evidence required independent institutional verification. Even there, the strict Evidence Drift definition is only a partial fit.

## Mismatch Candidate — Governance Discontinuity
The McLeod case exposes a condition not cleanly represented by the seven July drift indicators:

> Technical interoperability can be achieved while governance identity, authority, evidence, review standing, commercial standing, and lifecycle obligations remain separately constructed and carried by institutional processes.

Working disposition: `mismatch_candidate_requires_repetition`

This should **not** be added to the Structural Drift frame from one case. It becomes a candidate distinction only if independent cases show the same pattern.

## Implication for the Research Program
The July frame and the healthcare discontinuity study should remain separate analytical objects:

- Structural Drift asks whether governance conditions are failing or drifting.
- Governance Discontinuity asks whether those conditions travel coherently across system/institution boundaries or must be reconstructed.

A coherent operating environment may need to address both, but current evidence does not authorize collapsing them into one taxonomy.

## Next Falsification Test
Choose Case 002 from a different healthcare AI function (diagnostic, predictive, utilization, decision support, or patient-facing agent) and repeat the same seven-indicator mapping without revising the frame.

If Governance Discontinuity recurs while the seven drift indicators remain weak fits, treat discontinuity as a distinct candidate relation rather than expanding Structural Drift to absorb it.

## Standing
`case_001_mapping_complete_mismatch_candidate_held`

No Registry mutation, model revision, MAP change, SEAT change, product claim, or publication is established by this mapping.
