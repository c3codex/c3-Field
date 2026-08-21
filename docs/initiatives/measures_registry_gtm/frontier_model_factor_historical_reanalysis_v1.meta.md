---
document_type: research_analysis
title: Frontier Model Factor Layer and Historical Reanalysis
status: working_research
version: v1
timestamp: 2026-08-21
operator: op044
author: chazz
system: measures_registry
scope: frontier_model_factors_and_historical_attribution
authoritative_custody: git
repository: c3codex/c3-Field
branch: gtm-ledger-v1
registry_standing: unregistered
historical_cutoff: 2024-12-31
---

# Frontier Model Factor Layer and Historical Reanalysis

## Purpose
Add a model-capability factor layer to the AI Governance Research baseline and use it to re-examine historical cases that may have been publicly or operationally framed primarily as model/AI failures when the documented causal chain was broader.

This artifact does not establish that any historical event was definitively misdiagnosed. It records whether a model-only diagnosis is supported, incomplete, or contradicted by available evidence.

## Analytical Boundary
The frontier-model factor set is intended for current and future frontier systems. Historical systems that predate frontier models are analyzed using the same factor dimensions where applicable. `not_applicable` and `unknown` are valid values; historical systems are not relabeled as frontier models.

## Frontier / Computational Model Factors
Preserve for each case where evidence allows:

- `model_provider`
- `model_family_or_system`
- `capability_class`
- `agency_level`: advises / predicts / recommends / executes_under_review / executes_autonomously / delegates_or_invokes
- `tool_or_system_access`
- `identity_mode`
- `permission_scope`
- `context_or_memory_state`
- `model_mutability`
- `observability`
- `human_control_mode`
- `system_reach`
- `deployment_scale`
- `consequence_class`
- `environmental_authority_granted`
- `cross_boundary_reach`

## Attribution Test
For any event described publicly as an AI/model/algorithm failure, test:

1. Was there a genuine model or algorithm defect?
2. What consequential authority did the surrounding institution give the output?
3. What validation existed before deployment?
4. What human review or fallback role existed in operation?
5. What evidence and observability were available after deployment?
6. Did the failure depend on local workflow, institutional policy, permissions, or downstream action?
7. Did the same model/system behave differently across environments?
8. Did remediation change only the model, or also the surrounding governance environment?

Attribution standings:
- `model_only_supported`
- `model_primary_but_environment_material`
- `mixed_model_and_environment`
- `environment_primary_with_model_component`
- `model_only_diagnosis_incomplete`
- `insufficient_evidence`

Misdiagnosis confidence:
- `supported`
- `plausible`
- `not_supported`
- `insufficient_evidence`

"Misdiagnosed" means only that treating the computational actor as the entire causal object would omit documented material system/environment conditions. It does not imply that prior investigators, courts, regulators, or researchers made an error where they themselves identified those broader conditions.

# Historical Reanalysis

## H-001 — Epic Sepsis Model
### Factor profile
- system: Epic Sepsis Model v1
- capability_class: clinical risk prediction
- agency_level: predicts / triggers alerts
- tool_or_system_access: embedded in EHR clinical workflow
- human_control_mode: clinician review and response
- system_reach: hospital-wide EHR alerting
- deployment_scale: hundreds of hospitals
- consequence_class: clinical
- model_mutability: vendor-updated; later replaced by v2
- environmental_authority_granted: alert could influence clinical attention and intervention

### Evidence
A 2021 external validation found poor discrimination/calibration, missed 67% of sepsis cases at a commonly evaluated threshold, and generated substantial alert burden. Later multicenter work on the revised model found materially improved model performance but high institutional variability, low positive predictive value, and continuing need for local validation, workflow integration, and alert-silencing strategies.

### Reanalysis
A genuine model defect existed in v1. However, a model-only diagnosis is incomplete because:
- the model was broadly deployed before adequate independent external validation;
- performance varied materially by institution;
- alert burden and clinical usefulness depended on local workflow and response design;
- later model improvement did not remove the need for institution-specific validation and implementation controls.

**Attribution:** `model_primary_but_environment_material`
**Potential model-only misdiagnosis:** `supported`

Interpretation: "bad model" explains part of the event; it does not explain why a weakly validated proprietary model became consequential across heterogeneous clinical environments or why post-model improvement still required local governance reconstruction.

Sources:
- https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2781307
- https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2845595

## F-001 — Transamerica Quantitative Investment Models
### Factor profile
- system: quantitative asset-allocation models
- capability_class: investment decision support / portfolio allocation
- agency_level: recommends / drives modeled investment decisions
- human_control_mode: institutional investment-management oversight
- deployment_scale: billions of dollars in strategies/funds
- consequence_class: financial
- environmental_authority_granted: model outputs were represented as core decision mechanisms in investment products

### Evidence
SEC found numerous model errors, development by an inexperienced junior analyst, failures by responsible executives to ensure models worked as intended, and use of models before validation had been completed. Approximately $97.6 million was ordered returned through disgorgement, interest, and penalties.

### Reanalysis
The computational models were faulty, but the documented causal chain includes explicit governance conditions around:
- who was authorized to develop the models;
- whether validation was completed before launch;
- executive responsibility for controls;
- disclosure when errors were discovered;
- the institutional representation of how the products operated.

**Attribution:** `mixed_model_and_environment`
**Potential model-only misdiagnosis:** `supported`

Interpretation: the SEC record itself shows this was never merely a numerical-model defect. Treating it as "the model failed" omits development authority, validation, oversight, disclosure, and deployment-control failures.

Sources:
- https://www.sec.gov/newsroom/press-releases/2018-167
- https://www.sec.gov/litigation/admin/2018/ia-4997.pdf

## I-001 — nH Predict / Medicare Advantage Coverage Workflows
### Factor profile
- system: predictive post-acute care / utilization tooling
- capability_class: prediction / utilization decision support
- agency_level: predicts / recommends; disputed extent of effective decision authority
- human_control_mode: required individualized clinical assessment
- consequence_class: coverage / clinical / financial
- cross_boundary_reach: insurer, vendor, clinician, beneficiary

### Evidence
CMS's 2024 Medicare Advantage rule reinforced evidence-based coverage criteria and individualized medical-necessity decision requirements. Litigation beginning in 2023 alleged that algorithmic predictions displaced or constrained individualized review; merits remained unresolved at the historical cutoff.

### Reanalysis
The unresolved factual question is not simply whether the prediction was accurate. It is whether institutional decision authority migrated from required individualized clinical judgment to an algorithmic prediction in practice.

**Attribution:** `insufficient_evidence`
**Potential model-only misdiagnosis:** `plausible`

Interpretation: this is a high-value authority/position case, but the historical record through 2024 is not strong enough to resolve the merits.

Sources:
- https://www.cms.gov/newsroom/fact-sheets/2024-medicare-advantage-and-part-d-final-rule-cms-4201-f

## G-001 — Michigan MiDAS
### Factor profile
- system: Michigan Integrated Data Automated System
- capability_class: automated fraud detection / adjudication
- agency_level: executes or materially effectuates adjudicative decisions
- human_control_mode: historically inadequate before consequential action in challenged cases
- system_reach: benefits adjudication and collection
- consequence_class: legal / financial / public-benefits
- environmental_authority_granted: automated output acquired state adjudicative and collection force

### Evidence
Court records describe allegations that MiDAS automatically detected and adjudicated suspected fraud, with property seizure or collection occurring without adequate notice, evidentiary access, or opportunity to be heard before penalties in challenged cases.

### Reanalysis
Calling MiDAS a bad algorithm would miss the strongest feature of the case: the state environment allowed computational output to become consequential administrative authority before adequate notice, contestability, evidence access, and response mechanisms were available.

**Attribution:** `environment_primary_with_model_component`
**Potential model-only misdiagnosis:** `supported`

Interpretation: this is not primarily a frontier-model lesson. It is a computational-authority lesson. The critical variable was not intelligence level but the authority attached to automated output.

Source:
- https://law.justia.com/cases/michigan/court-of-appeals-unpublished/2017/333181.html

## P-001 — Uber ATG Tempe Fatality
### Factor profile
- system: developmental automated driving system
- capability_class: perception / planning / physical control
- agency_level: executes physical vehicle control
- human_control_mode: safety operator expected to supervise/fallback
- system_reach: public-road physical operation
- consequence_class: safety-critical / physical
- environmental_authority_granted: direct physical control of vehicle subject to operator fallback

### Evidence
NTSB found driver distraction contributed, but also found Uber ATG failed to adequately address automation complacency and had inadequate operator oversight. The report documented safety-culture and risk-management deficiencies and insufficient oversight conditions.

### Reanalysis
A model/system-performance explanation is materially incomplete. The NTSB causal chain explicitly includes:
- human fallback role design;
- automation complacency;
- ineffective operator supervision;
- inadequate safety-risk assessment;
- organizational safety culture;
- external oversight.

**Attribution:** `mixed_model_and_environment`
**Potential model-only misdiagnosis:** `supported`

Interpretation: this is a clear example where physical AI capability became consequential through the surrounding assignment of role, authority, fallback responsibility, monitoring, and safety governance.

Source:
- https://www.ntsb.gov/investigations/AccidentReports/Reports/HAR1903.pdf

## E-001 — Higher-Education Predictive Advising / Student-Risk Analytics
### Factor profile
- system: predictive student-risk and early-alert tools
- capability_class: classification / risk prediction
- agency_level: advises / prioritizes / triggers intervention
- human_control_mode: adviser / instructor / institutional intervention
- consequence_class: educational / resource allocation
- environmental_authority_granted: risk scores may influence who receives attention or intervention

### Evidence
Pre-2025 college advising research documented predictive data that advisers sometimes found flawed, out of date, inaccurate, or not actionable; at one institution strong-performing students were mistakenly identified as at risk. Some advisers declined to use the risk scores. K-12 evidence similarly found machine-learning and simple prior-performance systems had comparable accuracy for several outcomes and both were less accurate for Black students.

### Reanalysis
The model is only one factor. Consequence depends on:
- cutoff selection;
- available intervention resources;
- adviser/instructor judgment;
- explanation to students;
- whether institutions treat risk scores as signals or determinations;
- differential error across student groups.

**Attribution:** `mixed_model_and_environment`
**Potential model-only misdiagnosis:** `plausible`

Interpretation: education demonstrates that a classification can be technically imperfect yet only becomes materially consequential through institutional choices about intervention, allocation, explanation, and review.

Sources:
- https://ccrc.tc.columbia.edu/wp-content/uploads/2020/12/using-technology-redesign-college-advising-ipass.pdf
- https://ies.ed.gov/use-work/resource-library/report/descriptive-study/identifying-students-risk-using-prior-performance-versus-machine-learning-algorithm

# Cross-Case Result

## Cases where a model-only diagnosis is materially incomplete
Strongest support:
1. Michigan MiDAS — environment/authority primary.
2. Uber ATG Tempe — mixed physical automation + organizational environment.
3. Transamerica — mixed model defect + validation/authority/oversight/control failure.
4. Epic Sepsis Model — genuine model defect + strong institutional/environment dependence.

Plausible but unresolved or more context-dependent:
5. Education predictive analytics — consequence is strongly mediated by institutional use; no single catastrophic reference case.
6. nH Predict / Medicare Advantage — authority displacement is the core hypothesis, but merits were unresolved by the historical cutoff.

## Preliminary historical attribution signal
The historical record supports the proposition that many events commonly summarized as failures of algorithms, models, or automation are better represented as **mixed computational-system failures** in which the actor's defect becomes consequential through institutional assignment of authority, system reach, weak validation, poor observability, ineffective human fallback, or inadequate review and response.

This does **not** establish that all model failures are governance failures or that model performance is secondary. It establishes a research requirement: future failure analysis must factor the computational actor together with the environment that authorizes and operationalizes it.

# Current / Frontier Watch Application
For 2025-present and future cases, add the factor set to every named watchlist record before any failure occurs. Preserve the baseline values where public evidence exists so later attribution can compare:

`capability → agency → access → identity → permissions → memory/context → mutability → observability → human control → system reach → consequence → environmental authority`

The highest-priority present-day combinations for prospective observation are:
- frontier model + tool invocation + write/transaction authority;
- agent + delegated identity/credentials;
- agent + cross-system/vendor boundary;
- persistent agent + mutable model/provider behavior;
- AI participating in governance itself;
- physical autonomy + human fallback;
- high-consequence decisions + weak contestability/return path.

# Holds
- Historical systems are not retroactively labeled frontier models.
- Do not infer environmental causation merely because a model operates inside an institution.
- Do not downgrade genuine model defects to protect the Measures Registry thesis.
- Do not call a case misdiagnosed when the original authoritative investigation already identified the broader system/environment causes; in those cases the narrower public shorthand is the object being corrected.
- Allegations remain distinct from adjudicated findings.
- No Registry mutation, canonical terminology change, publication, pricing, outreach, or activation is authorized by this artifact.
