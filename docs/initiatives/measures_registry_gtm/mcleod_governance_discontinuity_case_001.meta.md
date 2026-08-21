---
document_type: gtm_case_evidence
title: McLeod Health Governance Discontinuity Case 001
status: working_research_evidence
version: v1
timestamp: 2026-08-21
operator: op044
author: chazz
system: measures_registry
parent_ledger: measures_registry_gtm_research_ledger_v1.meta.md
parent_round: healthcare_governance_failure_cost_round_002.meta.md
case_id: healthcare_discontinuity_001_mcleod
registry_standing: unregistered
---

# McLeod Health Governance Discontinuity Case 001

## Purpose
Trace one regional health-system AI adoption from market scan through vendor selection, EHR integration, pilot, rollout, monitoring, and commercial restructuring to identify where technical interoperability was insufficient to carry governance coherently.

## Organization
McLeod Health is a nonprofit, nonacademic regional health system with 7 hospitals and more than 1,200 providers serving 18 counties across North and South Carolina. The published study describes McLeod as a useful analogue for mid-sized community-based systems without major academic research infrastructure.

Primary source: Frost BK et al., JMIR Medical Informatics 2026;14:e87450. https://medinform.jmir.org/2026/1/e87450

## Timeline
- Feb 2024: evaluation design / market scan begins.
- Mar–Jun 2024: simulation and workflow evaluation phases.
- Oct–Dec 2024: 90-day pilot across multiple ambulatory specialties.
- Jan 2025: system-wide rollout begins.
- Mar 2025: self-onboarding introduced.
- 2025–2026: continued expansion, financial-model renegotiation, additional licenses, monitoring and ROI validation.

## Boundary Chain
`market/vendor boundary → clinical evidence boundary → Epic workflow boundary → security/informatics boundary → pilot authorization boundary → commercial contract boundary → system-wide operational boundary → ongoing vendor/data/measurement boundary`

## B1 — Market / Vendor Boundary
### Observed condition
McLeod's CMIO spent roughly a year examining the ambient-AI vendor field before purchase. The organization screened about 20 vendors down to 4. Published methodology excluded vendors for data-security, financial-stability, scalability, pricing, or contractual feasibility concerns.

### Governance work reconstructed
- market intelligence;
- vendor exclusion criteria;
- security/financial/scalability review;
- product-roadmap judgment;
- contractual feasibility assessment.

### Missing coherence property candidate
`shared evidence + vendor standing + persistent system identity/context`

### Interpretation
The organization could not rely on vendor category membership or reputation as sufficient evidence of fitness. It had to construct its own evidence environment before allowing vendors to advance.

## B2 — Clinical Evidence Boundary
### Observed condition
Four vendors underwent live patient simulations. AI-generated notes were reviewed by 25 blinded evaluators spanning clinical practice, operations, revenue cycle, and patient satisfaction.

### Governance work reconstructed
- standardized test cases;
- independent/blinded review;
- multi-role evidence gathering;
- scoring and comparative disposition.

### Missing coherence property candidate
`evidence comparability + review standing + cross-role interpretation`

### Interpretation
A vendor claim or technical certification did not answer whether the system performed acceptably in McLeod's actual clinical environment. McLeod had to create a local, multidisciplinary review process.

## B3 — Epic Workflow / Technical Interoperability Boundary
### Observed condition
The top 2 vendors were required to demonstrate workflow integration with Epic. Roughly 30 physicians observed; clinical informatics and IT security independently reviewed technology stack, implementation roadmap, data safety, and capabilities beyond documentation.

### Key discontinuity
Technical integration with Epic was necessary but not sufficient for selection. The health system separately required physician workflow judgment, informatics review, IT-security assessment, strategic functionality review, and leadership disposition.

### Missing coherence property candidate
`technical interoperability does not carry authority, acceptability, risk standing, workflow fit, or institutional approval`

### MR relevance
`native_condition_candidate`

## B4 — Pilot Authorization Boundary
### Observed condition
A 90-day pilot followed. McLeod initially purchased 500 licenses but restricted the evaluated cohort to selected clinicians to control cost and create a reliable baseline. The system tracked adoption, documentation burden, coding, financial effect, provider satisfaction, and patient satisfaction.

No usage fees were charged during the pilot.

### Governance work reconstructed
- bounded participant eligibility;
- explicit pilot purpose;
- success criteria;
- evidence capture from Epic and financial data;
- independent verification of vendor-supplied data;
- leadership go/no-go disposition.

### Missing coherence property candidate
`bounded authorization + evidence provenance + return path + disposition`

### Important evidence
Vendor-supplied coding/financial extracts were independently verified against McLeod's own Epic Signal, charge, RVU, scheduling, and revenue data. The need for independent verification indicates that vendor evidence was useful but not institutionally sufficient by itself.

## B5 — Commercial Contract Boundary
### Observed condition
As demand expanded, subscription/license cost became an operational constraint. McLeod renegotiated the commercial model to usage-based pricing with a capped monthly rate, reducing risk from unused licenses and aligning system/vendor incentives.

### Governance/economic consequence
The operational environment changed the contract structure. Governance did not end at vendor approval; use patterns, financial risk, and institutional objectives had to be carried back into the commercial relationship.

### Missing coherence property candidate
`usage evidence + economic accountability + contract-state alignment`

### Cost evidence
The paper does not disclose contract value and explicitly states that it did not perform a total cost of ownership analysis. Therefore no claim of avoidable contract savings is supported.

## B6 — System-Wide Operational Boundary
### Observed condition
Expansion across decentralized clinics created communication and adoption challenges. McLeod responded with phased onboarding, a system-wide communication campaign, physician testimonial videos, self-onboarding, and additional inpatient licenses.

### Governance work reconstructed
- organizational communication;
- role onboarding;
- distributed workflow adaptation;
- adoption monitoring;
- additional access/licensing decisions.

### Missing coherence property candidate
`shared operational language + role-bound passage + distributed visibility`

## B7 — Ongoing Vendor / Evidence Boundary
### Observed condition
McLeod continued to compare vendor-generated metrics with internal EHR and financial data and later participated in external ROI validation. Expansion also moved toward inpatient/acute-care use and broader functionality.

### Governance implication
Approval of one product/use did not create permanent standing for every future use. As scope, users, functionality, and settings changed, the institution continued to generate and verify evidence.

### Missing coherence property candidate
`persistent provenance + version/change standing + lifecycle review`

## Governance Discontinuity Finding
**Working finding:** `supported_case_evidence`

McLeod demonstrates a clear instance of **technical interoperability with governance discontinuity**:

> The selected AI could integrate into Epic, but the governance required to establish vendor fitness, clinical acceptability, security standing, workflow authority, financial justification, deployment scope, continuing evidence, and expansion conditions was separately assembled by the institution.

The process itself was successful and should not be characterized as governance failure. The discontinuity lies in the fact that the technical connection did not carry the governance relationships required to make the interaction institutionally trustworthy.

## Compensatory Governance Burden
Evidence-supported burden includes:
- approximately one year of vendor investigation before selection;
- multi-phase market scan, simulation, workflow demonstration, and pilot;
- 25 blinded evaluators in clinical-note review;
- about 30 physician observers in workflow demonstrations;
- separate clinical-informatics and IT-security review;
- broad executive/clinical/operational/financial leadership participation;
- 90-day pilot;
- independent verification of vendor performance/financial data;
- commercial pricing renegotiation;
- phased onboarding and educational campaign;
- continued monitoring and expansion review.

These facts establish substantial institutional coordination and evidence work. They do **not** establish that all or most of this burden is avoidable, nor that Measures Registry would remove it.

## Economic Evidence
The pilot reported meaningful operational and financial gains, including estimated revenue improvement of $2,629 per provider per month in the study's analysis. McLeod later shifted from subscription pricing to usage-based capped pricing to control unused-license risk.

The study expressly states that it did not perform a total-cost-of-ownership analysis. Therefore the economic cost of the governance/evaluation process itself remains **HELD / unquantified**.

## Registry-Relevance Test
Current standing: `OPEN — supported structural relevance, no Registry necessity claim`

Questions to test:
1. Could stable system/vendor identity have reduced repeated re-description across market scan, security review, contracting, pilot, and rollout?
2. Could role-bound authority and review standing have made the multi-role evaluation more coherent without reducing legitimate local judgment?
3. Could evidence provenance have persisted from simulation → Epic demonstration → pilot → rollout → contract renegotiation rather than being reconstructed in separate artifacts/processes?
4. Could lifecycle/change standing distinguish approved use from new specialty, inpatient, or expanded functionality without treating each change as an unrelated event?
5. Could portal interoperability allow McLeod, Suki, Epic, clinicians, and institutional reviewers to remain autonomous while carrying shared identity, authority, evidence, and disposition across boundaries?
6. Which parts of McLeod's process are intrinsically necessary local governance and therefore should remain local even in a coherent Registry environment?

## Strongest Current Implication
McLeod does not prove that hospitals need Measures Registry. It does support the more fundamental thesis that:

> Technical interoperability and successful AI integration do not themselves establish coherent governance across the institutional relationship. The organization must separately establish and preserve identity, evidence, review, authority, financial standing, and lifecycle accountability.

## Sources
- JMIR Medical Informatics, 2026, e87450: https://medinform.jmir.org/2026/1/e87450
- PubMed PMID 42361272: https://pubmed.ncbi.nlm.nih.gov/42361272/
- Healthcare Innovation interview with McLeod CMIO, 2026: https://www.hcinnovationgroup.com/analytics-ai/generative-ai/article/55355613/mcleod-health-cmio-on-choosing-measuring-roi-of-ambient-ai-solution
- Suki/KLAS ROI materials, used as secondary vendor-side context only: https://www.suki.ai/whitepapers/klas-report-suki-roi-validations-2026/

## Standing
`case_001_formed_working_evidence`

No Registry mutation, healthcare Registry candidacy disposition, cost-savings claim, product fit claim, pricing change, or publication is established by this case.