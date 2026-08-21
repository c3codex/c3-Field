# Denominator Rot — Round 002

status: research_only
branch: gtm-ledger-v1
registry_mutation: none
operator: op044

## Purpose
Test the gap between declared governance and operational coverage using numerical evidence only where possible.

## Findings

### AAA / large-enterprise governance effectiveness
Source: American Arbitration Association, 2026 benchmark survey of 500 senior legal/executive leaders at large U.S. and Canadian organizations; 70% represented organizations with $1B+ revenue.

- 87% reported having AI governance.
- 22% said governance worked effectively.
- 33% had defined escalation pathways.
- 22% were very confident they could produce governance-decision evidence for an auditor or regulator.
- Governance coverage fell across lifecycle stages: 72% development/testing, 37% deployment readiness, 44% post-deployment monitoring, 4% retirement/decommissioning.
- 42% handled incidents informally case-by-case.
- 28% systematically fed lessons learned back into governance frameworks.

Interpretation: declared governance is common; lifecycle continuity and evidence closure are much weaker.

### IRS / inventory lag and artifact staleness
Source: U.S. GAO, GAO-26-107522, Mar. 24, 2026.

- IRS inventory contained 126 active AI use cases as of June 2025.
- 43 AI use cases initiated before Aug. 2022 were not added until 2023 or later.
- 27 additional use cases were added several months after initiation.
- 11 use cases took 1–2 years or longer to be reported.
- One insider-threat use case began Nov. 2022 and did not appear in the inventory until June 2025.
- Nearly 10% of entries lacked status/lifecycle-stage information.
- At least 10% omitted all business units involved.
- More than 25% lacked information on expected agency benefit.

Interpretation: the governance artifact can exist while materially lagging the live environment. This is evidence of inventory latency and incomplete relationship/context capture.

### Federal cross-agency inventory quality
Source: U.S. GAO, GAO-24-105980 with 2025–2026 recommendation updates.

- Of 20 agencies reviewed, 5 provided comprehensive information for each reported use case; 15 had incomplete or inaccurate data.
- Some inventories lacked lifecycle stage and releasability indicators.
- As of Feb.–Mar. 2026, Energy, HHS, NASA and others still had missing required elements in 2025 inventories.

Interpretation: inventory existence does not establish inventory completeness, timeliness, or operational correspondence.

### ISACA / operational uncertainty
Source: ISACA 2026 AI Pulse Poll, 3,400+ digital-trust professionals.

- 43% were confident they could investigate and explain a serious AI incident.
- 39% were confident in AI data governance.
- 36% said humans approve most AI-generated actions before execution.
- 20% did not know how humans oversee AI decision-making in their organization.
- 18% said AI-use disclosure was required and enforced; 20% required but inconsistently enforced; 32% had no disclosure requirement.

Interpretation: declared principles and practical operating visibility diverge.

### KPMG / visibility into operating economics
Source: KPMG U.S. Q2 2026 AI Pulse.

- 66% reported monitoring dashboards.
- 61% reported approval processes.
- 26% reported full real-time visibility into AI operating costs.

Interpretation: control artifacts can exist while real-time operating-state visibility remains weak.

### CSA / unknown agents and lifecycle closure
Source: Cloud Security Alliance 2026 survey, commissioned by Token Security; vendor-sponsored and therefore directional.

- 82% reported unknown AI agents in their environments.
- 65% reported AI-agent-related incidents in the prior year.
- 21% had formal decommissioning processes.

Interpretation: identity/inventory/lifecycle continuity remain weak in many surveyed environments. Sponsor conflict noted.

## Emerging denominator set
- discovered live AI / inventoried AI
- current artifacts / total active consequential systems
- deployment reviews / material deployments
- post-deployment reviews / material changes
- monitored runtime / consequential runtime
- incidents with formal escalation / total incidents
- resolved incidents with lessons retained / total incidents
- decommissioned identities or agents / retired identities or agents
- auditable governance decisions / consequential governance decisions

## Narrow proposition supported
Declared governance is widespread, but evidence repeatedly shows incomplete coverage, lagging inventories, weak lifecycle closure, uncertain human oversight, and poor operational visibility. The relevant defect is not necessarily artifact absence; it is the failure of artifacts to remain complete, current, and bound to the live environment.

## Falsifier
If high-quality regulator/audit evidence begins to show that most institutions maintain near-complete, low-latency, continuously current inventories and governance artifacts across deployment, monitoring, change, incident, and retirement stages, this line of MR differentiation weakens materially.
