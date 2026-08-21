# Value Capture / Burden Distribution Measurement — Round 001

status: research_only
operator: op044
branch: gtm-ledger-v1
purpose: Measure where value, authority, dependency, burden, and retained memory sit across the expanding compute chain.

## Measurement frame
Common rod:
1. value captured
2. burden borne
3. authority held
4. dependency incurred
5. memory retained

## Observed public-policy signals

### Hyperscaler / capital layer
- Reuters (2026-08-17): Microsoft and Amazon earnings eased investor concern about AI infrastructure profitability; cloud growth remained strong; investors continued favoring hyperscalers and semiconductor firms because scale positioned them to benefit from the AI boom.
- Reuters (2026-08-19): hyperscale AI providers Google, Microsoft, and Meta expected to spend about $725B in 2026; AI workloads could consume about half of global data-center capacity by 2030.
- Reuters (2026-07-22): U.S. hyperscalers expected at then-current trajectory to spend more combined on capex than they generate in free cash flow by 2027, showing both large value expectations and large capital exposure.

### Grid / ratepayer layer
- Reuters (2026-08-21): PJM transmission-constraint costs reached about $6B in H1 2026, up 43%, while real-time wholesale electricity costs rose from $20.4B to $29.4B year-over-year. Northern Virginia, Baltimore, and Delaware were among hardest-hit regions.
- Observed ratio: congestion costs alone were ~20.4% of H1 2026 real-time wholesale electricity costs ($6B / $29.4B).
- Public policy responses increasingly seek to prevent data-center infrastructure costs from being shifted onto households and other ratepayers.

### State/local fiscal layer
- Washington JLARC (2026): urban data-center beneficiaries saved an estimated $42.4M in sales/use taxes from 2023-26 and reported 53 family-wage jobs plus ~300 temporary construction jobs.
- Simple descriptive ratio: ~$800K in tax preference per reported permanent family-wage job ($42.4M / 53). This is not a cost-benefit result because the preference also affected property tax values, utility taxes, construction activity, and tenant attraction.
- JLARC explicitly noted missing electricity/water reporting and recommended stronger reporting for future evaluation.
- Massachusetts (2026-06-25) paused new data-center tax-exemption applications pending stronger protections for ratepayers, environment, public health, energy, water, air, noise, jobs, and community impacts.
- Federal H.R. 9419 proposal (2026-06-25) would require large data centers and other large-load facilities to bear the full cost of new power/water infrastructure; proposal status only, not enacted law.

### Land / siting layer
- Reuters (2026-08-19): new European hyperscale sites projected to be an average 175 km from urban hubs in 2026-28 vs 46 km in 2022-25, driven by cheaper power, land, and faster grid connections.
- Powered-land prices reported from ~€2.7M/MW in Amsterdam to ~€0.2M/MW in Bordeaux, a ~13.5x difference.
- Interpretation: value-seeking siting behavior shifts physical burdens and infrastructure requirements geographically.

### Mineral layer
- Reuters/S&P (2026-01-08): global copper demand projected from 28 Mt in 2025 to 42 Mt in 2040 (+50%), with AI, defense, and robotics among major demand drivers; supply shortfall >10 Mt/year possible without more mining/recycling.
- Value is captured downstream in chips/cloud/platform services while extraction/refining burden occurs in different jurisdictions.

## Preliminary measurement table

| Layer | Value capture | Burden borne | Authority held | Dependency | Memory visibility |
|---|---|---|---|---|---|
| Hyperscaler/platform | cloud/model revenue, strategic positioning, infrastructure rents | capex, debt, utilization risk | high inside owned platform/control plane | chips, power, customers, capital | high internally; limited externally |
| Utility/grid | electricity revenue, transmission investment | congestion, reliability stress, capital upgrades | grid interconnection / dispatch / tariff authority | large-load growth, generation, transmission | fragmented across ISO/RTO, utility, regulators |
| State/local government | tax base, construction, development | incentives, infrastructure, water, land-use conflict | permitting, taxation, local approval | projects/jobs/revenue | often incomplete; reporting gaps explicit |
| Community/ratepayer | possible jobs/local investment | power cost, water pressure, noise, land-use, reliability exposure | limited / political / regulatory | utility and local infrastructure | weak unless reporting mandated |
| Mining/refining jurisdiction | commodity revenue, jobs, royalties | extraction, land/water/environmental burden | sovereign/regulatory/mineral rights | global compute demand | weakly connected to downstream computational act |
| Institution/user | productivity / service gains | vendor dependency, governance overhead, lock-in | authority over institutional act | model/cloud/vendor stack | partial; often cannot see full chain |

## First distribution finding
The system is not merely resource intensive; it is distributively asymmetric.

Observed pattern:
- financial upside is concentrated where capital, chips, cloud, and platform control sit;
- physical and fiscal burdens often materialize in different jurisdictions;
- ratepayer/community exposure can arise even where local authority over the broader computational demand chain is limited;
- institutions consuming AI services may capture local productivity gains while remaining dependent on upstream infrastructure and vendor chains they do not fully observe;
- public policy is increasingly attempting to force cost internalization and improve reporting, which is evidence that burden/value alignment is not automatic.

## Candidate measures

### Value-Burden Alignment Ratio (research candidate)
Value retained by the actor/jurisdiction / burdens directly borne by that same actor/jurisdiction.
Use comparatively, not as a universal scalar until categories are normalized.

### Authority-Burden Mismatch
Burden borne by actor or jurisdiction without corresponding authority to control the upstream cause.

### Dependency-Visibility Gap
Critical dependencies required for operation minus dependencies for which current, verifiable state is available to the institution.

### Memory Distribution Gap
Number of independent systems/jurisdictions that hold necessary fragments of the consequential history before a full reconstruction is possible.

### Externalized Infrastructure Share
Incremental grid/water/public-infrastructure cost not directly borne by the load-causing project divided by total incremental infrastructure cost. Requires project-level data; not yet measured here.

## Held conclusions
Do not claim:
- that all public costs are caused by AI;
- that tax incentives are necessarily uneconomic;
- that communities receive no benefit;
- that hyperscalers externalize all infrastructure cost;
- that burden shifting is intentionally designed;
- that MR can yet resolve these asymmetries.

## Working proposition
As computational intensity rises, value capture, physical burden, governing authority, dependency, and retained memory increasingly occupy different actors and jurisdictions. The greater the separation, the harder it becomes to determine whether the whole consequential system remains in ordered relation to its originating purpose.

## Sources
Reuters 2026-08-21 PJM congestion costs.
Reuters 2026-08-17 AI infrastructure investor outlook.
Reuters 2026-08-19 European AI data-center siting.
Reuters 2026-07-22 hyperscaler capex/free cash flow analysis.
Washington JLARC 2026 urban data-center tax preference review.
Massachusetts Governor 2026-06-25 data-center incentive pause/framework.
H.R. 9419 sponsor release 2026-06-25.
Reuters/S&P 2026-01-08 copper demand outlook.
