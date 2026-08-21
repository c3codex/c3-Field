---
document_type: research_measurement_frame
initiative: measures_registry_gtm
status: research_only
version: v1
operator: op044
assistant: chazz
branch: gtm-ledger-v1
date: 2026-08-21
registry_mutation: false
canonical_term_change: false
---

# Lapis Measuring Rod — Resource Provenance Round 001

## Purpose
Apply a provenance-first measurement frame to the physical substrate of ambient compute. This artifact uses “Lapis measuring rod” as a research metaphor only. It does not establish a canonical material definition or alter Source/Registry authority.

The measurement question is not merely “how much compute?” It is:

> What physical resource, energy, water, capital, authority, dependency, and consequence are carried through each unit of computational capacity, and can that history later be reconstructed?

## Baseline unit
Use **1 MW of continuously loaded data-center capacity** as the first physical measuring unit.

At continuous full-year load:
- electricity: 8.76 GWh/year

This is a mathematical upper-style operating benchmark for a continuously loaded 1 MW unit, not an assertion that every MW of installed capacity operates at 100% utilization or that facility/IT load definitions are interchangeable.

## Copper rod
S&P Global 2026 reports:
- non-crypto data centers commonly require about 30–40 metric tons of copper per MW installed;
- one AI training archetype is estimated at 47 metric tons/MW;
- rack-interconnect substitution toward fiber may reduce copper intensity by roughly 4–5 metric tons/MW;
- a 230 MW greenfield AI training data center in its worked example requires nearly 10,000 metric tons of copper at about 44 metric tons/MW;
- data-center copper demand is projected to increase from about 1.1 million metric tons in 2025 to 2.5 million metric tons in 2040.

Research use:
For each facility/capacity addition, record copper intensity as a range rather than a single universal constant and distinguish direct data-center copper from associated grid/power infrastructure copper.

## Electricity rod
IEA projects global data-center electricity use to more than double to around 945 TWh by 2030. AI is identified as the most important driver of growth alongside other digital services. In the United States, data centers account for nearly half of projected electricity-demand growth through 2030 in IEA’s base case.

LBNL’s June 2026 update estimates U.S. data centers could account for 11.8% of total U.S. electricity use by 2030, with a scenario range of 9.5%–15.3%.

For each measured unit record:
- IT load vs facility load definition;
- utilization;
- PUE where known;
- annual kWh;
- grid region / balancing authority;
- contracted vs physically supplied generation;
- on-site generation;
- storage/backup requirements.

## Water rod
LBNL 2024 estimated U.S. data centers consumed about 176 TWh in 2023. The corresponding national-average indirect water footprint from electricity supply was nearly 800 billion liters, or about 4.52 L/kWh, with approximately 0.34 kg CO2e/kWh for the associated grid mix.

Using those 2023 national-average factors only as a benchmarking exercise, 1 MW continuously loaded for a year (8.76 GWh) corresponds to approximately:
- 39.6 million liters of indirect water consumption;
- 2.98 million kg CO2e (~2,978 metric tons CO2e).

These are not universal facility factors.

LBNL’s 2025 workload-level water study found more than 10,000-fold variation in workload water use, driven by more than 1,000-fold variation in water consumed per kWh of server electricity plus roughly 10-fold variation in workload efficiency. Major determinants include server efficiency, grid water intensity, utilization, cooling type, infrastructure efficiency, climate, inactive-server share, and refresh cycle.

Therefore **location and operating state are part of the measurement**, not metadata.

## Mineral provenance rod
For every capacity unit, trace materials where evidence permits through:
1. material/mineral;
2. mine/source jurisdiction;
3. refining/processing jurisdiction;
4. component manufacturer;
5. equipment integrator;
6. data-center operator;
7. power/grid relationship;
8. computational workload served;
9. downstream consequential activity.

Priority materials already identified in prior research include copper, aluminum, silicon, gallium, germanium, indium, tantalum, rare earths, silver, tin, palladium and platinum.

The record should preserve both material quantity and **authority-domain transitions**.

## Lapis provenance questions
For each measured resource relationship ask:
- What entered the system?
- Where did it come from?
- Who held custody at each material transformation?
- Which jurisdiction governed extraction, processing, transport, manufacture, deployment, and use?
- What authority permitted the transition?
- What dependency was created?
- What consequential computational relation did it enable?
- What changed after deployment?
- What environmental/economic/social consequence was externalized or retained?
- Can the chain be reconstructed after supplier, model, operator, or policy change?

## Candidate research measures
### 1. Resource Intensity per Compute Capacity
physical resource quantity / installed or utilized MW

Examples:
- metric tons copper / MW installed
- liters water / kWh or workload
- kg CO2e / kWh or workload

### 2. Resource Intensity per Economic Act
physical resource attributable to computational workload / underlying business act

This is the hard target. It requires allocation methodology and should not be estimated casually.

Examples under future population:
- compute kWh / mortgage originated
- compute kWh / clinical encounter
- allocated copper-capacity share / million mortgage transactions
- water consumption / million AI-assisted encounters

### 3. Provenance Coverage
resource/dependency links with reconstructable origin, custody, authority, and current standing / all consequential resource/dependency links inside the measured perimeter

### 4. Jurisdictional Depth
number of independently governed jurisdictions traversed between material origin and consequential computational act

### 5. Dependency Concentration
share of a critical resource or processing stage controlled by the top producing/refining jurisdictions or suppliers

### 6. Consequence-to-Value Distribution
observed burden borne by each actor/jurisdiction / observed economic value captured by each actor/jurisdiction

Do not infer moral judgment from unequal distribution alone; measure before interpreting.

### 7. Temporal Correspondence
percentage of resource/dependency records whose provenance and governing state remain valid for the period in which the consequential act occurred

This joins physical provenance to governance memory.

## Measuring rod state model
For each link, record at minimum:
- `present`
- `absent`
- `stale`
- `not_portable`
- `not_verifiable`
- `unknown`

Where state changes:
- retain prior state;
- timestamp the transition;
- identify evidence for the new state;
- do not overwrite historical truth.

## Core finding from Round 001
The resource question cannot be reduced to an average “AI footprint.” The same nominal workload can have radically different water, energy, emissions, mineral, and jurisdictional consequences depending on hardware, utilization, cooling, grid mix, location, model behavior, and deployment architecture.

Therefore the meaningful unit of measurement is not merely a token, query, GPU, or MW.

It is:

> **a consequential computational workload bound to its actual physical and relational environment.**

That preserves the central systems-governance thesis: material consequence emerges through environment and relationship, not from the computational actor alone.

## Falsifiers / holds
Hold or narrow this frame if:
- resource attribution to business acts proves too indeterminate for defensible measurement;
- facility-average factors obscure more than they reveal;
- modern reporting standards already provide complete portable provenance across material → compute → institutional consequence;
- resource intensity falls rapidly enough that relational/governance overhead, rather than physical substrate, becomes the dominant measurable burden.

## Evidence anchors
- S&P Global, *Copper in the Age of AI: Challenges of Electrification* (2026): copper intensity and demand estimates for data centers/AI infrastructure.
- IEA, *Energy and AI* (current): global data-center electricity projections and AI-driven demand growth.
- LBNL, *2024 United States Data Center Energy Usage Report*: 2023 U.S. data-center electricity use and indirect water/CO2e factors.
- LBNL, *The water use of data center workloads* (2025): >10,000-fold workload-level water-use variation and determinant analysis.
- LBNL, *United States Data Center Energy Usage Report: 2025 Update* (June 2026): 2030 U.S. data-center electricity share projection.

## Status
Research measurement frame formed. No Registry mutation. No canonicalization of Lapis. Candidate measures remain held pending empirical population and Operator disposition.
