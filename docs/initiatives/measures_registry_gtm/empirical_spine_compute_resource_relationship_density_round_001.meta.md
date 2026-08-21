---
title: Empirical Spine — Compute, Resource, and Relationship Density Round 001
status: research
operator: op044
branch: gtm-ledger-v1
purpose: Test whether computational intensity, physical-resource intensity, and consequential-relationship density are increasing faster than the underlying human/economic act they serve.
registration_status: not_registered
---

# Research question

Do compute intensity, physical-resource intensity, and consequential-relationship density rise faster than the underlying economic or institutional act itself?

# Test bed A — U.S. tax administration

## Underlying act
Annual individual tax-return processing remains roughly stable in scale.

- IRS individual returns received in 2022: 165,774,000.
- IRS individual returns received in 2025: 165,824,000.
- Change is effectively flat at the annual-return-volume level.

## Computational layer
GAO reported IRS AI inventory growth from 10 use cases in August 2022 to 126 active use cases by June 2025, a 12.6x increase.

GAO further found:
- 77 of 126 June 2025 use cases were still in development;
- inventory entries often lagged operational initiation;
- 43 use cases begun before August 2022 appeared only in 2023 or later;
- 11 use cases took 1–2 years or more to enter the inventory;
- contracted AI was omitted, including ID.me identity-proofing uses and AI-enabled Criminal Investigation tools;
- IRS had not reviewed thousands of contracts to determine whether they contained AI.

## Finding
Mission/transaction volume did not rise remotely in proportion to AI-use-case count. Computational and relational layers expanded around a largely stable underlying public act.

# Test bed B — outpatient clinical care

## Underlying act
Cleveland Clinic patient activity changed modestly from 2024 to 2025:
- worldwide patient encounters: +2%;
- outpatient encounters: +2%;
- outpatient E&M visits: +4%.

## Computational layer
Cleveland Clinic rolled out an ambient AI scribe in spring 2025. More than 4,000 of roughly 6,000 eligible physicians and advanced-practice providers were actively using it within 15 weeks.

The governed encounter now can include:
- patient verbal consent;
- ambient capture of patient-clinician conversation;
- AI-generated structured documentation;
- clinician review and approval before EHR insertion;
- potential expansion toward clinical orders and billing-code recommendations;
- downstream reliance on AI-shaped documentation.

## Finding
Clinical encounter volume rose only a few percent while a new computational/documentary relationship layer spread to thousands of clinicians in one rollout cycle. The human clinical act persisted; the computational relationships around it multiplied.

# Test bed C — federal enterprise AI broadly

GAO found that across 11 selected federal agencies, reported AI use cases nearly doubled from 571 in 2023 to 1,110 in 2024. Generative-AI use increased ninefold over that period.

OMB's 2025 consolidated federal inventory, published in 2026, reports hundreds of use cases in agencies whose underlying statutory missions remain substantially continuous, including HHS, VA, DOJ, DOE, Agriculture, Interior, and others.

## Finding
The rapid increase is in computational treatment of existing institutional missions, not an equivalent multiplication of the missions themselves.

# Physical substrate

## Electricity
IEA 2026 data:
- data-centre electricity consumption: about 485 TWh in 2025;
- projected roughly 950 TWh in 2030;
- AI-focused data-centre electricity consumption grew about 50% in 2025;
- accelerated-server electricity demand is projected to grow around 30% annually in the base case;
- data centres are expected to account for around half of U.S. electricity-demand growth through 2030.

IEA also reports that per-task AI energy efficiency is improving rapidly, while uptake and more energy-intensive reasoning/agentic uses overwhelm part of the efficiency gain.

## Copper
S&P Global 2026 estimates:
- non-crypto data centres: roughly 30–40 metric tons copper per MW installed;
- AI training archetype example: roughly 44–47 metric tons per MW;
- data-centre copper demand: about 1.1 million metric tons in 2025 to 2.5 million metric tons by 2040;
- AI/data-centre demand contributes a new copper-demand vector of roughly 2 million metric tons between 2025 and 2040;
- a modeled 230 MW AI training data centre approaches 10,000 metric tons of copper.

## Water
Lawrence Berkeley National Laboratory found workload-level data-centre water consumption varying by more than 10,000x depending on server efficiency, grid water intensity, utilization, cooling, climate, infrastructure efficiency, inactive-server share, and refresh cycle.

## Grid equipment
2026 reporting documents U.S. power/substation transformer lead times exceeding 160 weeks in some cases as data-centre demand strains supply chains.

# Relationship-density signal

The computational layer is not only more compute. It introduces additional consequential relationships among existing actors:

human/institution -> AI interface/agent -> model/provider -> cloud/compute -> identity/access -> data source -> workflow system -> monitor/evaluator -> human reviewer -> exception path -> evidence store -> downstream institution.

Not every act contains every edge. The empirical question is the number of consequential edges required for a particular act and the proportion whose current governance state can be proven.

# Platform control-plane evidence

FTC's 2025 6(b) report found large cloud/model partnerships containing:
- significant equity and revenue-sharing rights;
- billions of dollars of cloud-spend commitments;
- consultation, control, and exclusivity rights to varying degrees;
- discounted compute;
- exchange of sensitive technical/business information;
- integration opportunities across model and cloud products.

AWS 2026 agent-governance documentation explicitly requires agent identities, tool permissions, user authorization propagation, agent-to-agent authorization, execution-chain logging, centralized policy enforcement, and audit trails.

## Finding
The platform market itself now treats identity, delegated access, tool authority, lineage, policy enforcement, and audit as necessary infrastructure for agentic computation. This supports the claim that computational relationship density is increasing; it does not establish that cross-domain governance is solved.

# Current empirical standing

SUPPORTED:
1. Computational use around stable institutional acts is increasing far faster than the act volume in at least tax administration and outpatient clinical care.
2. Total AI-focused infrastructure demand can rise while per-task efficiency improves.
3. Physical resource demand rises with installed computational capacity.
4. Computational expansion creates additional identity, authorization, vendor, data, monitoring, and evidence relationships.
5. Existing inventories can materially lag or omit contracted computational relationships.

NOT YET PROVEN:
1. A universal quantitative ratio of consequential relationships per economic act.
2. That AI is the sole cause of rising infrastructure/resource demand.
3. That every additional computational relationship is governance-significant.
4. That Measures Registry reduces this burden or improves outcomes.
5. That fragmentation is intentionally designed to erase institutional memory.

# Candidate measurements

- Computational Intensity per Act
- Consequential Relationship Density per Act
- Governed Relationship Coverage
- Latent-to-Consequential Discovery Lag
- Resource Intensity per Act
- Authority-Domain Crossings per Act
- Provenance Reconstruction Completeness
- Historical/Temporal Correspondence
- Perimeter Drift

# Primary falsifier

If growth in AI use, compute infrastructure, and vendor/agent relationships can be shown to remain proportional to underlying act volume while existing controls reliably preserve authority, standing, evidence, change, and return across domains, the proposed MR problem space narrows materially.

# Research disposition

The empirical spine now supports continued testing. The strongest observed pattern is not simply 'more AI.' It is expansion of computational and physical intermediation around comparatively stable human and institutional acts.

Research only. No Source Authority, Registry, terminology, or product-standing mutation.
