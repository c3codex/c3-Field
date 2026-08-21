---
document_type: research_test
title: Governance Artifact Substrate Test Round 001
status: working_research
version: v1
timestamp: 2026-08-21
operator: op044
author: chazz
system: measures_registry
scope: artifact_runtime_binding_portability_revalidation_exception_disposition
authoritative_custody: git
repository: c3codex/c3-Field
branch: gtm-ledger-v1
registry_standing: unregistered
---

# Governance Artifact Substrate Test Round 001

## Purpose
Test whether governance artifacts in consequential AI environments are durable enough to remain bound to live systems after change. This round asks whether artifacts are merely present or whether they remain operationally valid across runtime, version, organizational, vendor, acquisition, and review boundaries.

## Test Dimensions
For each observed environment classify evidence for:
- `runtime_binding`
- `version_or_change_trigger`
- `portability_across_boundaries`
- `exception_or_disposition_path`
- `artifact_custodian`
- `artifact_verifiability`

Primary artifact standings:
- `present_and_operationally_bound`
- `present_but_local`
- `present_but_not_portable`
- `present_but_stale_or_update_sensitive`
- `present_but_not_verifiable`
- `absent`
- `unknown`

## Case A — Federal AI Acquisition (DOD / DHS / GSA / VA)
### Observed artifacts
- contract clauses addressing AI requirements, testing, privacy, accountability, data/IP rights;
- acquisition policies and OMB-directed review processes;
- lessons learned from later acquisition actions;
- technical-evaluation and continuous-testing practices in some programs.

### Runtime / change binding
`partial`
GAO reports that AI acquisitions require ongoing assessment because systems and services change, and selected agencies identified early testing and continuous evaluation as recurring challenges.

### Portability
`present_but_not_portable`
Later Maven contracts incorporated stronger AI-related requirements and GSA reused effective contract terms for USAi, showing portability is possible. However DOD, DHS, GSA, and VA were not systematically collecting and sharing lessons learned, including effective clauses, data-rights practices, and testing requirements.

### Exception / disposition
`partial`
Discontinued systems and failed approaches were not consistently documented as reusable lessons. VA's SoKAT retirement was specifically identified as a missed opportunity because lessons were not documented for related future acquisitions.

### Structural interpretation
Strong evidence of `Governance Discontinuity`: governance artifacts can exist and improve locally while failing to persist as reusable institutional memory across acquisitions and agencies.

## Case B — VHA Generative AI Clinical Use
### Observed artifacts
- VHA quality and patient-safety oversight structures;
- OMB high-impact AI requirements;
- pre-deployment safeguards for Ambient AI Scribe;
- general-purpose VA GPT and Microsoft 365 Copilot Chat authorized for clinical work involving patient information.

### Runtime binding
`present_but_incomplete`
Clinical outputs could be copied into the EHR and influence medical decision-making, yet VA did not classify the general-purpose tools as high-impact and did not apply the same safeguards used for Ambient AI Scribe.

### Portability
`present_but_local`
Patient-safety governance artifacts existed institutionally but did not automatically bind to deployment of the general-purpose generative AI tools. OIG found deployment occurred with limited coordination with the National Center for Patient Safety.

### Exception / disposition
`absent_at_observation`
OIG found no AI-specific process to report, track, and respond to safety events involving generated clinical documentation. This removed a feedback loop for identifying patterns and dispositioning incidents.

### Structural interpretation
Strong evidence of artifact discontinuity between existing patient-safety governance and the live generative-AI clinical environment. The problem was not simply missing policy; governance artifacts existed but did not attach to the newly consequential tool class.

## Case C — Deutsche Bank Third-Party Risk Management AI
### Observed artifacts
- versioned Third Party Control Obligations;
- supplier evidence and documentation requirements;
- independent model-validation requirements;
- supplier SME lifecycle contact;
- human decision authority retained by trained assessors;
- exact source citations in AI-proposed outcomes;
- AI incorporated into broader control framework and oversight structures.

### Runtime binding
`present_and_operationally_bound`
TPRM AI retrieves current control questions, evaluates submitted evidence, proposes outcomes, and preserves exact citations. Final decisions remain with human assessors.

### Version / change trigger
`present`
Third Party Control Obligations are versioned and explicitly require ongoing lifecycle support and validation evidence from suppliers. Deutsche Bank publicly states agentic-AI risk remains subject to ongoing monitoring and evolving controls.

### Portability
`partial_but_strong`
Supplier evidence obligations are explicitly designed to cross the vendor-bank boundary. Evidence must be sufficient for Deutsche Bank validation and ongoing lifecycle management.

### Exception / disposition
`present`
Human assessors can review, edit, override, and make final decisions. The AI is advisory within a defined authority boundary.

### Structural interpretation
Strong counterexample/control case. This demonstrates that artifact continuity can be intentionally engineered. It weakens any claim that reconstruction is unavoidable. It strengthens the narrower thesis that durable governance depends on explicit, operationally bound artifacts rather than general policy alone.

## Case D — SUNY Systemwide AI Governance
### Observed artifacts
- explicit roles and responsibilities;
- procurement requirements protecting data and decision authority;
- domain-specific governance;
- risk-based oversight;
- recurring policy review requirement;
- heightened scrutiny for systems influencing safety, rights, or wellbeing.

### Runtime binding
`partial/unknown`
The policy establishes the required governance architecture, but public evidence in this round does not establish whether every campus implementation is bound to live model versions, tools, permissions, and workflow states.

### Version / change trigger
`present`
Policy explicitly requires regular re-evaluation to account for changes in AI technology, regulation, and campus operations.

### Portability
`designed_for_systemwide_portability; implementation_unknown`
The policy applies across contract colleges, health science centers, state-operated campuses, statutory colleges, system administration, and university hospitals. Whether artifacts remain consistent at the campus/runtime level requires observation.

### Exception / disposition
`partial`
Heightened approval and review are required for higher-risk uses, but public evidence reviewed here does not yet establish a detailed cross-campus exception/disposition artifact path.

### Structural interpretation
Promising control case. If SUNY can maintain runtime correspondence across diverse campuses and domains, it is evidence that institutional-scale coherence can be constructed without a shared external registry.

## Comparative Result
The substrate test does not collapse the Measures Registry thesis. It narrows it.

Observed pattern:
1. Artifacts can exist and still fail to attach to a newly consequential deployment (VHA).
2. Artifacts can improve locally but fail to travel as institutional memory across later acquisitions (federal procurement).
3. Artifacts can be engineered to cross organizational/vendor boundaries with explicit validation, source evidence, versioning, and retained human authority (Deutsche Bank).
4. Systemwide governance can explicitly design for recurring review and multi-domain applicability, though implementation/runtime binding still needs observation (SUNY).

## Falsification Signal
The strongest counterevidence is Deutsche Bank. If comparable organizations consistently show durable, portable, low-cost governance artifacts with reliable runtime binding and exception/disposition paths, the economic necessity for a shared governance environment weakens.

## Strengthened Research Question
The decisive question is not whether governance artifacts exist.

> Do governance artifacts remain operationally bound, current, portable, verifiable, and dispositionable as consequential computational systems cross model, vendor, organizational, and runtime boundaries?

## Next Test Layer
For each Tier A watchlist organization, seek evidence for:
`artifact_origin → custodian → version → validation_date → live_runtime_binding → portability → change_trigger → exception_path → disposition → retained_history`

Quantify only after artifact continuity state is established.

## Holds
- Do not infer absence from lack of public evidence.
- Do not treat policy presence as proof of runtime binding.
- Do not treat versioning as proof of portability.
- Do not infer Measures Registry necessity from discontinuity alone.
- No Registry mutation, public publication, pricing, outreach, or activation is authorized by this artifact.
