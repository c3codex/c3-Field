# Experiment 001 — Healthcare Matched-Pair Test

status: research_only
operator: op044
branch: gtm-ledger-v1
purpose: Test whether governance coverage explains reconstruction burden better than model capability in comparable ambient-AI clinical deployments.

## Hypothesis
For materially similar ambient-AI clinical use, deployments with stronger current governance coverage across consequential relationships will show lower reconstruction burden, fewer unresolved exceptions, and better return/disposition completeness than deployments with weaker governance coverage.

## Null / falsifier
If comparable deployments with materially different governance coverage show no meaningful difference in reconstruction burden, exception closure, evidence completeness, or return/disposition; or if outcomes track model capability more strongly than governance coverage, the relational-governance hypothesis weakens.

## Observation unit
One deployed ambient-AI clinical workflow for outpatient documentation.

## Pair-selection criteria
- materially similar clinical act (outpatient documentation / ambient capture)
- similar deployment maturity window
- similar model capability class where observable
- evidence available for review/change control, consent, vendor chain, monitoring, exception handling, and return to clinician/institution
- at least one measurable burden or outcome variable

## Primary explanatory variables
- consequential_relationship_count
- authority_domain_crossings
- governed_relationship_coverage
- relationships_with_current_authority_state
- relationships_with_current_evidence_state
- relationships_with_current_change_state
- relationships_with_return_state
- relationships_with_disposition_state

## Outcome variables
- exception_count / unresolved exception state
- reconstruction_hours or reconstruction proxy
- manual review burden
- regulatory / safety findings
- documented harm or loss
- decision reversal / correction burden
- evidence completeness
- return/disposition completeness

## Controls / confounders
- encounter volume
- clinician count
- implementation maturity
- vendor/model differences
- specialty mix
- EHR platform
- documentation burden before deployment
- deployment scope

## Evidence classes
Each populated field must be tagged as observed, source-backed inferred, modeled, or unknown.

## Decision rule
Support increases if the higher-governance deployment shows better evidence completeness and lower reconstruction/exception burden under comparable model capability and clinical purpose. No conclusion from one pair alone; Experiment 001 is feasibility + directionality, not final proof.

## Candidate Pair A
Cleveland Clinic ambient AI deployment vs another large U.S. health system with comparable outpatient ambient-AI deployment and weaker or less complete public evidence of post-deployment review/change-control/return mechanics.

## Required next actions
1. Identify at least two candidate comparator systems.
2. Populate the fixed observation schema for each.
3. Score perimeter reproducibility independently.
4. Compare governance coverage and outcome proxies.
5. Record counterevidence and ambiguity explicitly.
6. Repeat with at least two additional healthcare pairs before cross-sector inference.
