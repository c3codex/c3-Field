---
document_type: research_baseline
title: AI Governance Historical Case Baseline
status: working_research
version: v1
timestamp: 2026-08-21
operator: op044
author: chazz
system: measures_registry
scope: cross_industry_historical_case_baseline
authoritative_custody: git
repository: c3codex/c3-Field
branch: gtm-ledger-v1
registry_standing: unregistered
---

# AI Governance Historical Case Baseline

## Purpose
Establish pre-current-market comparison cases across the five observation cohorts. The baseline is designed to distinguish AI/model defects from specialized governance failures and computational-system/environment failures. It does not establish Registry standing or prove the Measures Registry thesis by itself.

## Comparative Method
For each case preserve:
`deployment → consequential role → governance/control context → documented crack/failure → consequence → remediation/response → failure classification → Measures relevance → confidence`.

Primary classification values:
- `AI_or_model_defect`
- `specialized_governance_failure`
- `computational_system_environment_failure`
- `mixed`
- `insufficient_evidence`

Seven integrity conditions remain unchanged for mapping:
`Ownership → Authority → Position → Identity → Runtime → Evidence → Response`.

Governance Discontinuity remains a held candidate and is not canonicalized by this baseline.

## Cohort 001 — Healthcare
### Case H-001 — Epic Sepsis Model, 2018–2026
**Baseline event:** broad deployment of Epic's machine-learning sepsis prediction capability inside hospital EHR environments.

**Documented crack:** independent 2021 validation at University of Michigan found hospitalization-level AUC 0.63, sensitivity 33%, positive predictive value 12%, and poor calibration. A 2023 study across nine networked hospitals found substantial performance variation across institutions, with C-statistics ranging from approximately 0.55 to 0.73 and associations with institutional/patient-population differences. The 2026 multicenter validation of ESM v2 found substantially improved discrimination but persistent cross-institution variability and continuing need for local validation, alert silencing, and workflow design.

**Consequence:** risk of missed sepsis cases, false-positive alert burden, and local implementation burden in clinically consequential workflows.

**Response:** model redesign/local training plus institution-specific validation and workflow controls.

**Classification:** `mixed`
- model performance defect: supported for v1;
- environment dependence: strongly supported by cross-hospital variability and continued local-validation requirements;
- specialized governance failure: not established as a universal claim.

**Integrity relevance:** Runtime, Evidence, Response; possible Position depending local workflow role.

**Standing:** strong historical healthcare control/failure comparison.

## Cohort 002 — Financial Services
### Case F-001 — Transamerica Quantitative Investment Models, 2018 enforcement
**Baseline event:** billions of dollars invested through strategies represented as relying on quantitative models.

**Documented crack:** SEC found model errors and control failures; models were developed by an inexperienced junior analyst, contained numerous errors, and did not operate as represented.

**Consequence:** SEC ordered approximately $97 million returned to harmed retail investors.

**Response:** enforcement, refunds, and remediation.

**Classification:** `mixed`
- model defect: strongly supported;
- system/environment failure: supported where model-development authority, validation, review, and representation controls were inadequate;
- AI-specific classification: limited because this was quantitative-model governance rather than modern generative AI.

**Integrity relevance:** Ownership, Authority, Evidence, Review/Response via existing frame.

**Standing:** strong computational-governance precursor; use carefully as pre-generative-AI baseline rather than an AI-only case.

## Cohort 003 — Insurance
### Case I-001 — nH Predict / Medicare Advantage, 2023–2026 litigation
**Baseline event:** use of predictive algorithmic tooling in post-acute-care utilization/coverage workflows across major Medicare Advantage insurers.

**Documented crack:** plaintiffs in UnitedHealth and Humana litigation allege algorithmic predictions displaced or constrained individualized clinical review and contributed to premature coverage denials. A 2026 federal court order in the UnitedHealth litigation allowed discovery into nH Predict's development, approval, implementation, oversight, investigations, and the identity of employees issuing non-coverage notices. CMS separately clarified in 2024 that algorithms may assist but cannot alone terminate post-acute care or replace individualized assessment required by Medicare Advantage rules.

**Consequence:** alleged premature loss of coverage, out-of-pocket care costs, litigation exposure, and regulatory scrutiny.

**Response:** ongoing litigation, discovery, CMS clarification, and broader insurer AI-governance requirements.

**Classification:** `held_mixed_pending_merits`
- allegations of actor misuse and authority displacement: substantial but not finally adjudicated;
- system/environment issue: supported as a governance question around who retained decision authority, what evidence controlled the decision, and whether review/return paths remained valid;
- legal liability on merits: unresolved.

**Integrity relevance:** Authority, Position, Evidence, Response; potentially Ownership.

**Standing:** high-value longitudinal insurance case; preserve allegations and adjudicated findings separately.

## Cohort 004 — Government / Public Sector
### Case G-001 — Michigan MiDAS Unemployment Fraud Adjudication, 2013–2015
**Baseline event:** Michigan automated unemployment-benefit fraud determinations through MiDAS.

**Documented crack:** appellate records describe automated fraud adjudication, collection through wage garnishment and tax interception, weak notice and contestability, and severe error. A reviewed set of more than 22,000 fraud auto-adjudications was reported as 93% non-fraud; later records note the precise percentage was contested but still preserve evidence of very high invalidity. Plaintiffs alleged individual consequences including eviction and bankruptcy following erroneous fraud determinations.

**Consequence:** wrongful fraud findings, financial collection, loss of benefits, housing and bankruptcy harms, litigation, and statutory reform.

**Response:** discontinuation of auto-adjudication, federal/state scrutiny, legal challenges, reforms requiring human examination before fraud determinations, and later compensation/reform efforts.

**Classification:** `computational_system_environment_failure_with_model_component`

**Integrity relevance:** Authority, Evidence, Response, Position, Ownership.

**Standing:** very strong historical public-sector case because the defect was not merely predictive accuracy; automated output acquired adjudicative force inside a broken review and return environment.

## Cohort 005 — Industrial / Critical Infrastructure / Physical Autonomy
### Case P-001 — Uber ATG Tempe Automated Vehicle Fatality, 2018
**Baseline event:** developmental automated driving system operated on public roads with a human safety operator.

**Documented crack:** NTSB found the probable cause included the operator's failure to monitor, but identified contributing organizational/system conditions: inadequate safety-risk assessment, ineffective oversight of vehicle operators, inadequate mechanisms addressing automation complacency, inadequate safety culture, and insufficient state oversight. NTSB also documented that ATG lacked a corporate safety plan and dedicated safety management structure at the time of the crash.

**Consequence:** pedestrian fatality, suspension/restructuring of testing, external review, and regulatory/safety recommendations.

**Response:** safety-management-system implementation, revised operating controls, and state/federal recommendations for stronger testing oversight and risk-management requirements.

**Classification:** `mixed_with_strong_system_environment_component`

**Integrity relevance:** Ownership, Authority, Position, Runtime, Response, Evidence.

**Standing:** strongest physical-world demonstration in the baseline that automated capability becomes consequential through the environment assigning role, oversight, fallback responsibility, and operational authority.

## Cross-Case Early Pattern
The five cases do not support a claim that all AI failures are system/environment failures. They support a narrower and more useful observation:

> Consequential computational capability repeatedly becomes materially risky when model limitations intersect with unresolved institutional conditions involving authority, validation, oversight, evidence, review, and response.

Observed recurrence by condition:
- Authority: present in government, insurance, physical autonomy; partial in finance/healthcare.
- Evidence/validation: present across all five cohorts.
- Response/review: present across all five, with different mechanisms.
- Position/role ambiguity: visible in insurance, government, physical autonomy; context-dependent elsewhere.
- Ownership/oversight: especially strong in finance, government, physical autonomy.
- Runtime/environment dependence: especially strong in healthcare and physical autonomy.

## Research Implication
This historical baseline should be frozen before evaluating new 2026 events. New evidence should be compared against these pre-boom cases to test whether current AI-governance investment reduces recurrence, merely relocates it, or leaves the same environmental conditions unresolved.

## Holds
- Do not infer that any current organization will fail because historical patterns resemble it.
- Do not convert allegations into adjudicated facts.
- Do not claim AI governance investment is ineffective without case-specific evidence.
- Do not resolve Governance Discontinuity as canonical from these cases alone.
- Do not infer Measures Registry savings or prevention values without economic evidence.
- No Registry mutation, publication, outreach, pricing, or activation is authorized by this artifact.
