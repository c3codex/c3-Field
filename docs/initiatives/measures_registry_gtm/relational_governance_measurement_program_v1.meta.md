---
title: Relational Governance Measurement Program v1
status: research_active
authority: research_only
operator: op044
branch: gtm-ledger-v1
purpose: Test whether consequential system risk and reconstruction burden rise when relational complexity grows faster than governance coverage.
---

# Core hypothesis

Consequential system risk rises when relational complexity grows faster than the governance state capable of preserving authority, evidence, standing, change, and return across those relationships.

# Primary falsifier

If model capability explains observed failures better than relational density, authority crossings, stale evidence, or incomplete return after controlling for sector and task, the systems-governance thesis weakens.

# Secondary falsifiers

- High relational density repeatedly operates safely with little formal governance.
- Existing standards stacks cheaply preserve identity + authority + standing + evidence + change + hold + return + disposition across autonomous domains.
- Increased AI deployment does not materially increase consequential relationship density or reconstruction burden.
- Strong governance coverage does not reduce incidents, exceptions, audit reconstruction time, or remediation burden.
- Independent reviewers cannot reproduce the same consequential perimeter with acceptable agreement.

# Observation unit

One consequential institutional act, not one model call and not one vendor.

Examples:
- residential mortgage decision
- outpatient clinical encounter
- taxpayer service / tax administration interaction
- insurance claim decision
- education admissions / advising / aid decision
- industrial / critical-infrastructure operational decision

# Required variables

## Act identity
- case_id
- sector
- institution
- act_type
- observation_date
- source_date
- pre_ai_baseline_available

## Computational intensity
- computational_components_count
- ai_components_count
- agentic_components_count
- computational_steps_observed
- compute_intensity_proxy
- compute_intensity_basis

## Relational density
- consequential_relationship_count
- authority_domain_crossings
- external_vendor_depth
- model_provider_depth
- cloud_provider_depth
- data_provider_depth
- human_review_edges
- monitoring_edges
- exception_edges

## Governance coverage
- relationships_with_current_identity_state
- relationships_with_current_authority_state
- relationships_with_current_evidence_state
- relationships_with_current_change_state
- relationships_with_return_state
- relationships_with_disposition_state
- governed_relationship_coverage

## Temporal continuity
- material_change_count
- ungoverned_change_count
- inventory_lag_days
- discovery_lag_days
- stale_artifact_count
- superseded_artifact_count

## Outcome / burden
- incident_count
- exception_count
- decision_reversal_count
- manual_review_hours
- reconstruction_hours
- remediation_cost
- delay_days
- regulatory_findings
- documented_harm_or_loss

## Physical / resource layer
- electricity_proxy
- water_proxy
- critical_material_dependency_count
- grid_dependency_count
- jurisdiction_count
- physical_resource_notes

## Return / disposition
- result_returned
- execution_evidence_returned
- exception_state_returned
- change_state_returned
- final_standing_returned
- originating_authority_disposition_present

# Derived measures

## Governed Relationship Coverage
consequential relationships with current, sufficient governance state / all consequential relationships

## Relational Governance Gap
all consequential relationships - relationships with current, sufficient governance state

## Authority Crossing Density
authority-domain crossings / consequential act

## Reconstruction Burden
observed time + cost required to re-establish identity, authority, standing, evidence, change, and return state after drift or crossing

## Return Completeness
returned required state fields / required return state fields

## Perimeter Stability
reviewer agreement on consequential edges and inner perimeter

## Resource Intensity per Act
observed or defensibly allocated physical-resource load / underlying consequential act

# Matched-pair design

Compare cases with similar task and model capability but different governance coverage.

Pair A: high capability + low relational density
Pair B: high capability + high relational density
Pair C: lower capability + low relational density
Pair D: lower capability + high relational density

Primary comparison: whether incident/reconstruction burden tracks relational-governance gap more strongly than model capability.

# Longitudinal design

Observe the same institution or process before and after one or more of:
- new model/provider
- new agent permissions
- new vendor/subprocessor
- new data source
- new regulatory requirement
- new monitoring layer
- new return/disposition control

Test whether relational density rises before burden, and whether improved governance coverage later reduces burden.

# Perimeter reproducibility test

Three independent reviewers receive the same source packet.
Each marks:
- consequential edges
- authority crossings
- relationships entering the inner perimeter
- relationships remaining outside

Record pairwise agreement and unresolved conflicts.

Target is not perfect identity; target is stable enough agreement that MAP-style environmental measurement is reproducible rather than purely interpretive.

# Research cohorts v1

1. Residential mortgage origination
2. Outpatient clinical encounter
3. IRS / tax administration
4. Insurance claim / underwriting
5. Education decision system
6. Industrial / critical-infrastructure operational decision

# Evidence rule

Each populated field must be one of:
- observed
- source-backed inferred
- modeled
- unknown

Modeled values may never be silently presented as observed.

# Standing

Research only. No Registry mutation, terminology registration, certification claim, or MR product-performance claim is authorized by this artifact.
