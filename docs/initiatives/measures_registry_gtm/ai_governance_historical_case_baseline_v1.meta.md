---
document_type: research_baseline
title: AI Governance Historical Case Baseline
status: working_research
version: v2
timestamp: 2026-08-21
operator: op044
author: chazz
system: measures_registry
scope: cross_industry_historical_case_baseline_through_2024
authoritative_custody: git
repository: c3codex/c3-Field
branch: gtm-ledger-v1
registry_standing: unregistered
historical_cutoff: 2024-12-31
---

# AI Governance Historical Case Baseline — Through 2024

## Purpose
Establish a pre-current-market comparison baseline across six observation cohorts before evaluating 2025–present activity. The baseline is designed to distinguish AI/model defects from specialized governance failures and computational-system/environment failures. It does not establish Registry standing or prove the Measures Registry thesis by itself.

## Historical Cutoff
Only events, deployments, findings, regulatory responses, studies, litigation, and institutional actions occurring on or before **2024-12-31** are part of this baseline.

Later reporting may be used only to verify or clarify an earlier event and must not be treated as part of the pre-2025 baseline condition.

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

---

## Cohort 001 — Healthcare
### Case H-001 — Epic Sepsis Model, 2018–2024
**Baseline event:** broad deployment of Epic's proprietary machine-learning sepsis prediction capability inside hospital EHR environments.

**Documented crack:** independent 2021 validation at Michigan Medicine found hospitalization-level AUC 0.63, sensitivity 33%, positive predictive value 12%, and poor calibration. The model generated alerts on a substantial share of hospitalizations while missing many sepsis cases. By 2024, external validation at two county emergency departments again found weak v1 performance in a different operating environment, with sensitivity 14.7% and positive predictive value 7.6% at the evaluated threshold.

**Consequence:** clinically consequential false negatives, false-positive alert burden, and substantial local-validation and workflow burden.

**Response through 2024:** independent validation, local threshold/workflow evaluation, and growing recognition that deployment performance could not be inferred safely from vendor-reported performance alone.

**Classification:** `mixed`
- model performance defect: strongly supported for v1;
- environment dependence: strongly supported by materially different performance across institutions and care settings;
- specialized governance failure: not established as a universal claim.

**Integrity relevance:** Runtime, Evidence, Response; possible Position depending local workflow role.

**Standing:** strong historical healthcare case showing that consequential model performance is inseparable from local operational environment and validation.

Primary historical evidence:
- Wong et al., JAMA Internal Medicine, 2021.
- Ostermayer et al., JAMIA Open, 2024.

---

## Cohort 002 — Financial Services
### Case F-001 — Transamerica Quantitative Investment Models, 2018
**Baseline event:** billions of dollars invested through strategies represented as relying on quantitative models.

**Documented crack:** SEC found model errors and compliance/control failures. The models were developed by an inexperienced junior analyst, contained numerous errors, and did not operate as represented. Senior personnel failed to take reasonable steps to ensure the models worked as intended; the firms stopped using the models after learning of errors without promptly disclosing those errors to investors.

**Consequence:** approximately $97.6 million ordered returned to affected investors through disgorgement, interest, and penalties.

**Response:** enforcement, refunds, penalties, and compliance remediation.

**Classification:** `mixed`
- model defect: strongly supported;
- system/environment failure: supported where development authority, validation, review, disclosure, and oversight controls were inadequate;
- AI-specific classification: limited because this was quantitative-model governance rather than modern generative AI.

**Integrity relevance:** Ownership, Authority, Evidence, Response.

**Standing:** strong computational-governance precursor and useful pre-generative-AI baseline.

Primary historical evidence:
- U.S. Securities and Exchange Commission, Release 2018-167, 2018.

---

## Cohort 003 — Insurance
### Case I-001 — Predictive Coverage Decisioning / Medicare Advantage, 2023–2024
**Baseline event:** major Medicare Advantage organizations used predictive algorithmic tools in post-acute-care utilization and coverage workflows.

**Documented crack:** litigation filed in 2023 alleged that predictive tools such as nH Predict were used in ways that constrained or displaced individualized clinical review in coverage decisions. These allegations were not finally adjudicated by the end of 2024 and must remain allegations. Independently, CMS clarified for 2024 that Medicare Advantage organizations may use algorithms and other technology to assist coverage decisions but must base decisions on individual patient circumstances and applicable coverage criteria rather than using algorithms as substitutes for required individualized assessment.

**Consequence through 2024:** alleged premature coverage termination, patient out-of-pocket exposure, litigation, and heightened regulatory scrutiny.

**Response through 2024:** litigation, regulatory clarification, and stronger insurer governance expectations. NAIC's 2023 Model Bulletin established governance, documentation, validation, consumer-impact, third-party, and examination expectations for insurer AI systems.

**Classification:** `held_mixed_pending_merits`
- authority-displacement concern: materially supported as a regulatory/governance issue;
- alleged case-specific misuse: unresolved on merits as of cutoff;
- system/environment relevance: supported around who retains decision authority, what evidence governs the decision, and whether review remains valid.

**Integrity relevance:** Authority, Position, Evidence, Response, potentially Ownership.

**Standing:** high-value historical insurance baseline, but allegations and adjudicated facts must remain separate.

Primary historical evidence:
- NAIC Model Bulletin on Use of Artificial Intelligence Systems by Insurers, adopted 2023.
- CMS Medicare Advantage policy/rulemaking effective for 2024.
- 2023 litigation filings concerning algorithm-assisted post-acute-care coverage decisions.

---

## Cohort 004 — Government / Public Sector
### Case G-001 — Michigan MiDAS Unemployment Fraud Adjudication, 2013–2015; legal record through 2024
**Baseline event:** Michigan automated unemployment-benefit fraud detection, adjudication, and collection through MiDAS.

**Documented crack:** court records describe an automated chain from discrepancy flagging through questionnaires, fraud determinations, notices, and collection activity. Claimants often lacked meaningful access to the evidence used against them or an effective opportunity to contest determinations before wage garnishment or tax interception. Records repeatedly describe a very high false-positive problem; later appellate records note that the widely cited 93% figure from a 22,427-case review was subsequently disputed in precision, so it must not be treated as uncontested fact.

**Consequence:** wrongful fraud findings, large penalties, wage garnishment, tax intercepts, benefit disruption, litigation, and alleged severe household harms.

**Response:** auto-adjudication was curtailed, human review increased, legal challenges proceeded, and Michigan adopted reforms around unemployment-fraud adjudication and collection.

**Classification:** `computational_system_environment_failure_with_model_component`

**Why:** the consequential defect was not merely prediction accuracy. Automated output acquired adjudicative and collection force inside weak notice, evidence-access, review, and return conditions.

**Integrity relevance:** Authority, Evidence, Response, Position, Ownership.

**Standing:** one of the strongest pre-2025 public-sector examples of computational authority becoming consequential inside an incoherent review environment.

Primary historical evidence:
- Cahoo v. SAS Analytics / SAS Institute litigation record, 2018–2023.
- Bauserman v. Unemployment Insurance Agency, Michigan Supreme Court, 2022.

---

## Cohort 005 — Industrial / Critical Infrastructure / Physical Autonomy
### Case P-001 — Uber ATG Tempe Automated Vehicle Fatality, 2018; NTSB findings 2019
**Baseline event:** developmental automated-driving system operated on public roads with a human safety operator.

**Documented crack:** NTSB found the probable cause included the vehicle operator's failure to monitor the driving environment, but also identified major organizational/system conditions: inadequate safety-risk assessment procedures, ineffective oversight of vehicle operators, inadequate mechanisms for addressing automation complacency, inadequate safety culture, and insufficient state oversight of automated-vehicle testing.

**Consequence:** pedestrian fatality, testing suspension/restructuring, external investigation, and regulatory/safety recommendations.

**Response:** revised safety-management and operating controls plus recommendations for stronger state/federal automated-vehicle testing oversight.

**Classification:** `mixed_with_strong_system_environment_component`

**Integrity relevance:** Ownership, Authority, Position, Runtime, Response, Evidence.

**Standing:** strongest physical-world historical demonstration in the baseline that automated capability becomes consequential through the environment assigning role, oversight, fallback responsibility, and operational authority.

Primary historical evidence:
- National Transportation Safety Board, HWY18MH010 / HAR-19/03, 2019.

---

## Cohort 006 — Education
Education is split into higher education and K–12 because authority, student rights, procurement, professional judgment, and institutional structure differ materially.

### Case E-001A — Higher Education Predictive Analytics / Student-Success Decisioning, 2018–2024
**Baseline event:** colleges and universities increasingly adopted predictive analytics to identify students at risk, target advising, allocate interventions, and inform admissions, budgeting, scholarships, or student-success activity.

**Documented crack:** by 2018, practitioners at public colleges already reported concerns about validity, interpretation, ethics, and how predictive tools fit professional advising judgment. A 2019 study found advisors at one public higher-education institution rejected predictive/prescriptive eAdvising tools because of usability concerns, moral discomfort, and conflict with their professional obligation to understand students holistically. By 2024, peer-reviewed research found common college-success prediction approaches could produce systematically different error patterns across racial groups, including lower accuracy for Black and Hispanic students in studied settings.

**Consequence:** risk of misclassification affecting advising intensity, resource allocation, admissions-related judgments, student-support targeting, and institutional treatment of students.

**Response through 2024:** fairness research, calls for transparency/interpretability, human-professional review, and closer examination of model validity and ethical use.

**Classification:** `mixed`
- model/fairness defect: supported in studied prediction settings;
- system/environment component: supported where predictive scores influence consequential institutional treatment without coherent professional interpretation, review, or contextual authority;
- universal harm claim: not supported.

**Integrity relevance:** Position, Authority, Evidence, Response; potentially Identity where demographic or historical data shape prediction.

**Standing:** strong historical education pattern case rather than a single catastrophic incident.

Primary historical evidence:
- Community College Research Center, Practitioner Perspectives on Predictive Analytics in Targeted Advising, 2018.
- Jones, Education and Information Technologies, 2019.
- Gándara et al., AERA Open, 2024.
- Bird et al., Journal of Policy Analysis and Management, first published 2024.

### Case E-001B — K–12 Early-Warning / Risk Prediction, 2020–2024
**Baseline event:** school systems and public education researchers explored machine-learning early-warning systems using academic, behavioral, attendance, and in some cases human-services data to predict near-term academic problems and target intervention.

**Documented crack:** federal education research published in 2020–2021 found that algorithmic early-warning systems created meaningful tradeoffs rather than straightforward superiority. In one comparative study, simple prior-performance flags and a machine-learning system were similarly accurate for several outcomes; both approaches were less accurate when predicting outcomes for Black students. The algorithm could improve targeting for some rare outcomes, but its usefulness depended on cutoff choices, prevalence, intervention capacity, and the relative harms of over- versus under-identification.

**Consequence:** risk of students being over- or under-identified for intervention, support, suspension-risk attention, or other resource allocation based on imperfect predictions.

**Response through 2024:** explicit guidance to treat prediction thresholds, intervention capacity, accuracy, fairness, and human use as governance decisions rather than simply adopting the algorithmically highest-scoring approach.

**Classification:** `mixed`
- model limitations: supported;
- system/environment component: strongly supported because consequence depends on how schools convert risk scores into intervention, resource allocation, and professional action;
- catastrophic failure: not established.

**Integrity relevance:** Position, Evidence, Response, Authority.

**Standing:** useful K–12 baseline showing that even comparatively modest predictive systems become consequential through institutional interpretation and action.

Primary historical evidence:
- Institute of Education Sciences / REL Mid-Atlantic, Using Data from Schools and Child Welfare Agencies to Predict Near-Term Academic Risks, 2020.
- Institute of Education Sciences / REL Mid-Atlantic, Identifying Students at Risk Using Prior Performance Versus a Machine Learning Algorithm, 2021.

### Education 2024 Boundary Observation
By 2024, predictive analytics were already described as pervasive in higher education, and research estimated substantial institutional use. This means the 2025–present generative/agentic-AI expansion enters an education environment that already had a decade-plus history of computational student classification, advising analytics, early-warning systems, and unresolved questions about professional judgment, fairness, transparency, and resource allocation.

---

## Cross-Case Historical Pattern — Through 2024
The six cohorts do **not** support a claim that all AI failures are system/environment failures. They support a narrower and more durable observation:

> Consequential computational capability repeatedly becomes materially risky when model limitations intersect with unresolved institutional conditions involving authority, validation, oversight, evidence, role/position, review, and response.

Observed recurrence by condition through 2024:
- **Authority:** strong in government, insurance, physical autonomy, education; present in finance and clinical deployment depending workflow.
- **Evidence/validation:** present across all six cohorts.
- **Response/review:** present across all six, with different institutional mechanisms.
- **Position/role ambiguity:** visible in insurance, government, education, and physical autonomy.
- **Ownership/oversight:** especially strong in finance, government, physical autonomy, and institutional education deployment.
- **Runtime/environment dependence:** especially strong in healthcare, education, and physical autonomy.

## Historical Baseline Significance
The key pre-2025 finding is not that organizations failed to govern computational systems. Many successfully compensated through human review, local validation, professional judgment, committees, litigation, regulation, and safety-management structures.

The historical record instead establishes that **before the current AI-governance spending boom**, institutions were already repeatedly reconstructing governance around computational systems at the point where those systems became consequential.

That gives the 2025–present study a clean comparative question:

> As institutions invest heavily in formal AI governance, do the pre-2025 structural conditions diminish, migrate, or recur?

## Next Layer — Held for Separate Research
`2025-01-01 → present`

The next research layer should preserve separately:
- scaled generative and agentic AI adoption;
- governance purchases and contract values;
- named buyers and vendors;
- governance scope and stated promises;
- incidents/failures after governance implementation;
- remediation and additional spend;
- recurrence against the pre-2025 baseline.

Do not merge 2025–present events backward into this artifact.

## Holds
- Do not infer that any current organization will fail because historical patterns resemble it.
- Do not convert allegations into adjudicated facts.
- Do not claim AI governance investment is ineffective without case-specific evidence.
- Do not resolve Governance Discontinuity as canonical from these cases alone.
- Do not infer Measures Registry savings or prevention values without economic evidence.
- Do not equate predictive analytics, quantitative models, automation, and modern generative AI as identical technologies; they are retained here because they are consequential computational-system precedents.
- No Registry mutation, publication, outreach, pricing, or activation is authorized by this artifact.
