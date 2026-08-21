# Denominator Rot — Round 003

Status: research only; not Registry instruction; no canonical terminology mutation.
Branch: gtm-ledger-v1
Operator: op044

## Purpose
Continue the operational-denominator excavation by testing where declared AI governance artifacts stop corresponding to the live system, especially at vendor, classification, jurisdictional, and lifecycle boundaries.

## Findings

### 1. IRS — inventory lag plus contracted-AI boundary failure
GAO reported 126 active IRS AI use cases in the June 2025 inventory. GAO found substantial latency between initiation and inventory capture: 43 use cases initiated before August 2022 did not appear until 2023 or later; 27 were added several months after initiation; 11 took 1–2 years or longer. One insider-threat use case begun in November 2022 did not appear until June 2025.

GAO also found 62 inventory entries with at least one information-quality issue; over 25% lacked an expected-benefit statement; nearly 10% lacked status or lifecycle-stage information; at least 10% did not list all involved business units.

More materially for cross-boundary governance, the IRS inventory omitted contracted AI, including ID.me biometric identity-proofing uses and several contracted AI-enabled Criminal Investigation tools. Officials responsible for some missing tools knew the governance process existed but did not understand that it applied to contracted AI.

Research read: an inventory can exist, satisfy a formal governance function, and still be temporally stale, incomplete, and blind at vendor boundaries. This is stronger than simple artifact absence.

Source: GAO-26-107522, March 24 2026.

### 2. VHA — classification boundary creates asymmetric safeguards
VA OIG found that VA GPT and Microsoft 365 Copilot Chat were authorized for work involving patient information and could support clinical decision-making or be copied into the EHR. VA did not classify these general-purpose tools as high-impact, while Ambient AI Scribe was classified high-impact and therefore triggered stronger safeguards such as pre-deployment testing and human oversight.

OIG found limited coordination with the National Center for Patient Safety and no AI-specific mechanism to report, track, and respond to safety events related to AI-generated clinical documentation.

Research read: safeguards can be present in the institution yet fail to attach to a consequential use because governance follows a category/classification boundary rather than the effective operating relationship.

Source: VA OIG 26-00182-140, June 11 2026.

### 3. USDA — explicit regulator finding that inventory must become continuous
USDA OIG reviewed all 82 operational USDA AI use cases for FY2025 and determined that cybersecurity and governance controls were not fully implemented. Recommendations included: continually review and update the AI inventory; conduct high-impact assessments; update policies; and require risk assessment, ATO determination, and overall system-impact analysis before AI is permitted on the network.

Research read: the oversight remedy itself moves from static documentation toward continuous correspondence between the artifact and the live environment.

Source: USDA OIG 50801-0018-12, May 12 2026.

### 4. Federal government control/counterexample — inventories can be repaired
GAO's earlier cross-agency inventory review found only 5 of 20 reviewed civilian-agency inventories had comprehensive information at the time, while 15 had incomplete/inaccurate data. By 2026, several agencies including Interior, Labor, State, VA, EPA and GSA had subsequently closed their inventory-quality recommendations after GAO determined required information was present.

Research read: inventory incoherence is not inevitable. Governance artifacts can be repaired and maintained. The relevant MR question is cost, durability, boundary portability, and whether operational correspondence persists after the audit/remediation cycle.

Source: GAO-24-105980 recommendation status updates through 2026.

### 5. Financial-services regulatory boundary — third-party provider visibility gap
GAO reported that the National Credit Union Administration lacks authority to directly examine technology service providers even as credit unions increasingly rely on those providers for AI-driven services. GAO also found NCUA model-risk guidance insufficiently detailed for broader AI model oversight.

Research read: even when an institution and its regulator possess governance duties, effective oversight can stop at a third-party jurisdictional boundary.

Source: GAO-25-107197, May 19 2025.

### 6. SBA — institutional-memory failure
GAO reported SBA had not consistently published required AI-use inventories and officials could not determine why prior inventories had not been published because key decisions/procedures were undocumented and responsible staff had left. As of April 2026 the agency still lacked policies/procedures ensuring reporting requirements were met.

Research read: governance can fail through loss of institutional memory even without a model/runtime failure. Artifact custody and decision-history retention are independent governance conditions.

Source: GAO-26-107828, May 4 2026.

## Emerging boundary failure classes
- temporal_boundary: artifact captures the system after consequential operation has begun;
- vendor_boundary: contracted capability falls outside or is misunderstood as outside the internal governance surface;
- classification_boundary: materially similar consequential use receives different safeguards because of formal categorization;
- jurisdiction_boundary: oversight authority stops before the provider/system boundary;
- custody_boundary: governance history cannot be reconstructed after personnel turnover;
- lifecycle_boundary: artifact exists but continuous update/review is missing.

## Denominator candidates strengthened by this round
- timely_inventoried_use_cases / actually_live_use_cases
- contracted_AI_in_governance_inventory / contracted_AI_in_operation
- high_impact_safeguard_coverage / consequential_clinical_AI_use
- inventory_entries_with_complete_lifecycle_state / inventory_entries
- governance_decisions_with_retained_history / governance_decisions_requiring_reconstruction
- third_party_AI_under_direct_oversight / third_party_AI_relied_upon
- current_inventory_entries / operational_AI_relationships

## Falsification condition
If repeated audit cycles show that institutions can keep these ratios near-complete, current, portable, and inexpensive across vendor, jurisdictional, and lifecycle boundaries, the need for a separate shared governance environment weakens. Current evidence does not establish that outcome.
