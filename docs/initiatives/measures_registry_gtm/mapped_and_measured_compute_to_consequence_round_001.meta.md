---
document_type: research_map
initiative: measures_registry_gtm
status: research_only
version: v1
operator: op044
assistant: chazz
branch: gtm-ledger-v1
date: 2026-08-21
registry_mutation: false
---

# Mapped and Measured — Compute-to-Consequence Round 001

## Purpose
Map the physical, financial, computational, institutional, and governance chain created when largely unchanged business activity is surrounded by rapidly increasing AI-driven computational intensity.

## Core proposition under test
The AI infrastructure boom is increasing computational intensity around existing economic activity. That increase creates more physical infrastructure, external dependencies, cross-domain relationships, and governance state that must be established, maintained, verified, reconciled, or reconstructed.

This proposition is not treated as proven in full. Each layer below is separated into observed evidence, measurement target, and unresolved question.

## Chain
capital → compute → power → materials → institutional dependency → authority → consequence

## Layer 1 — Capital
Observed:
- Reuters reported $220B of U.S. corporate AI-related debt issuance in 2026, up from $12.5B in 2025.
- Nvidia announced partnerships with Apollo, BlackRock, Blackstone, Brookfield, Goldman Sachs, and KKR targeting more than $500B in third-party AI infrastructure financing.
- Broadcom was reported to be exploring more than $60B in additional AI-related debt after a prior $35B financing platform intended to support up to 20 GW of compute capacity.

Measure:
- AI infrastructure capital committed ($)
- debt / equity / lease / SPV composition
- financing cost and spread
- off-balance-sheet commitments where evidenced
- capacity financed per $1B

Key denominator:
AI infrastructure capital / incremental demonstrated economic output attributable to AI

Hold:
Do not assume announced or committed capital equals deployed productive capacity.

## Layer 2 — Compute
Observed:
- AI-focused accelerated server electricity consumption is projected by IEA to grow about 30% annually through 2030 in its base case.
- AI workloads are a principal driver of new data-center growth.

Measure:
- accelerator capacity (MW/GW)
- inference/training utilization
- tokens or workload units where available
- compute per unit of underlying business activity
- agent/tool calls per business transaction

Key denominator:
computational operations / underlying business transaction

Research target:
Determine whether compute intensity is rising faster than underlying business volume.

## Layer 3 — Power
Observed:
- IEA: global data-center electricity consumption was about 415 TWh in 2024 and is projected to reach about 945 TWh by 2030.
- U.S. data centers account for nearly half of projected U.S. electricity-demand growth to 2030 in IEA’s base case.
- IEA estimates around 20% of planned data-center projects could face delay risk from grid constraints if bottlenecks are not resolved.

Measure:
- TWh consumed
- MW/GW contracted
- grid interconnection queue time
- generation type
- grid upgrade spending
- power cost allocated to compute

Key denominator:
AI/data-center electricity growth / growth in underlying serviced economic activity

## Layer 4 — Materials
Observed:
USGS lists data-center dependency on copper, silver, tin, tantalum, palladium, platinum, aluminum, arsenic, gallium, germanium, indium, silicon, rare earths and others. U.S. import dependence in the 2025 USGS snapshot includes:
- arsenic 100%
- gallium 100%
- germanium 100%
- indium 100%
- tantalum 100%
- rare earth elements 80%
- copper 45%

IEA estimates data-center gallium demand in 2030 could exceed 10% of today’s global supply, while China accounts for roughly 95–99% of refined gallium supply depending on measure/source framing.

Measure:
- mineral intensity per MW/GW
- import dependence by material
- refining concentration by jurisdiction
- transformer/cable/mineral lead times
- material cost per unit of compute capacity

Key denominator:
critical-material requirement / deployed compute capacity

## Layer 5 — Institutional dependency
Observed:
Enterprise AI increasingly depends on external cloud, model, identity, networking, power, and infrastructure providers even when the institution’s underlying business remains unchanged.

Measure:
- number of external providers per consequential workflow
- number of independent authority domains per workflow
- percentage of consequential workflows dependent on third-party model/cloud/identity/runtime
- substitution difficulty / switching cost

Key denominator:
external consequential dependencies / underlying business relationship

Research target:
Quantify how many new computational relationships are created around one unchanged business transaction.

## Layer 6 — Authority
Observed from prior research:
Governance artifacts routinely lose correspondence across time, vendor, classification, jurisdiction, custody, lifecycle, delegation, and runtime boundaries.

Measure:
For each consequential relationship:
- identifiable authority source: yes/no
- delegated authority bounded: yes/no
- current standing verifiable: yes/no
- runtime/environment binding verifiable: yes/no
- change history retained: yes/no
- hold/revocation state available: yes/no
- evidence portable: yes/no
- accountable return/disposition identified: yes/no

Primary metric:
Governed Relationship Coverage = relationships with current verifiable sufficient governance state / all consequential relationships

This is a candidate research metric, not a registered measure.

## Layer 7 — Consequence
Measure consequence where evidenced:
- incremental operating cost
- governance reconstruction cost
- delay
- remediation
- legal/regulatory exposure
- breach/fraud loss
- grid/community burden
- water/land/emissions burden
- stranded or underutilized capital
- switching/lock-in cost

Key denominator:
consequence borne / value captured

## Cross-layer measurement frame
For every system examined, map four positions:
1. Value capture — who receives revenue, rent, interest, appreciation, or productivity gain?
2. Authority — who can authorize, constrain, change, suspend, or terminate the relation?
3. Dependency — who cannot continue without another actor, resource, or jurisdiction?
4. Consequence — who absorbs cost, failure, delay, environmental burden, legal exposure, or remediation?

The four positions must not be assumed to coincide.

## Current quantitative anchors
- $220B: reported U.S. corporate AI-related debt issuance in 2026 versus $12.5B in 2025 (Reuters, 2026-08-21).
- >$500B: target third-party capital in Nvidia/financial-institution AI infrastructure financing platforms (Reuters, 2026-08-10).
- >$60B: additional Broadcom AI debt financing under discussion after prior $35B platform (Reuters, 2026-08-20).
- 415 TWh: global data-center electricity use in 2024 (IEA).
- ~945 TWh: IEA base-case global data-center electricity use in 2030.
- ~30%/yr: projected accelerated-server electricity-consumption growth through 2030 in IEA base case.
- ~20%: planned data-center projects potentially at delay risk from grid bottlenecks absent mitigation (IEA).
- >10%: possible 2030 data-center gallium demand as share of today’s global supply (IEA).
- 95–99%: China share of refined gallium supply depending on IEA framing.
- 100%: U.S. import dependence for arsenic, gallium, germanium, indium, tantalum in USGS 2025 data-center mineral snapshot.

## What the map presently supports
Supported:
- AI infrastructure is materially and financially intensive.
- data-center power demand is growing much faster than total electricity demand.
- critical-mineral and refining dependencies are geographically concentrated.
- capital financing for AI infrastructure is moving beyond ordinary corporate balance sheets.
- more computational infrastructure creates additional cross-domain dependencies.

Not yet proven:
- that extra compute produces less value than it costs economy-wide.
- that any named financial actor controls the whole chain.
- that concentrated mineral/refining capacity implies coordinated political or economic intent.
- that Measures Registry would reduce infrastructure cost.
- that Measures Registry is commercially necessary.

## MR relevance test
Measures Registry becomes economically relevant to this map only if increasing computational intensity measurably increases consequential cross-domain relationships whose governance state must otherwise be repeatedly reconstructed.

Candidate test:
Reconstruction Burden = number of consequential relationships requiring repeated establishment/verification of identity + authority + standing + evidence + change + return state × observed cost/time per reconstruction cycle.

A strong MR case requires evidence that:
1. this burden is material;
2. it recurs across organizations/industries;
3. existing standards/control planes do not cheaply preserve sufficient governance state across independent authority domains;
4. MR can materially reduce reconstruction without centralizing authority.

## Falsifiers
- compute intensity stabilizes while business value rises proportionally;
- interoperability standards eliminate most cross-domain governance reconstruction;
- third-party dependencies remain few and stable per workflow;
- governance reconstruction cost is economically trivial;
- enterprises can achieve equivalent continuity through existing platform/control-plane tools without surrendering autonomy.

## Next measurement work
1. Select 3–5 concrete business transactions (mortgage, insurance claim, clinical encounter, government benefit decision, enterprise procurement).
2. Build pre-AI vs AI-assisted dependency topology for each.
3. Count consequential actors, external systems, authority domains, model/tool calls, and required governance artifacts.
4. Measure which relationships have current verifiable governance state.
5. Assign observed or bounded reconstruction cost/time.
6. Compare incremental computational/relational load with incremental economic value where public evidence permits.

## Status
Research map formed. No Registry mutation. No canonical measure registration. Candidate metrics remain held pending empirical population and Operator disposition.
