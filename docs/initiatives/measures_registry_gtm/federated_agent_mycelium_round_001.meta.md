# Federated Agent Mycelium — Research Round 001

status: research_only
branch: gtm-ledger-v1
registry_mutation: prohibited
operator: op044
assistant: Chazz

## Purpose
Identify the connective infrastructure forming beneath the visible AI stack: protocols, identity systems, delegation standards, exchange layers, marketplaces, and cloud procurement rails that allow agents, models, tools, data, and institutions to interoperate across otherwise independent systems.

## Core finding
The emerging connective tissue is not one vendor or one platform. It is a federated layer composed of:

1. agent-to-agent communication standards;
2. agent-to-tool/data protocols;
3. portable workload and agent identity;
4. cross-trust-domain authentication;
5. delegated authority and recursive delegation mechanisms;
6. cross-platform AI asset/data exchange;
7. cloud marketplaces and committed-spend procurement rails;
8. hyperscaler control planes that bind frontier models to existing enterprise identity, billing, security, and governance workflows.

This layer is best treated as a research observation, not canonical terminology.

## Evidence

### A2A: communication across independently built agents
The Linux Foundation reports A2A has surpassed 150 supporting organizations, with deep integration across Google, Microsoft, and AWS and production deployments in financial services, insurance, supply chain, and IT operations. The explicit purpose is agent interoperability across tools, vendors, and environments.
Source: Linux Foundation, 2026-04-09.

### MCP + A2A + AGNTCY: communication, discovery, identity, observability
AGNTCY is intended to reduce agent silos by providing secure agent identity, reliable messaging, discoverability, and end-to-end observability. It is designed to interoperate with both A2A and Anthropic's MCP.
Source: Linux Foundation.

### Agent Name Service: federated agent identity without centralized registry control
The Linux Foundation announced intent to launch Agent Name Service (ANS) as a federated identity, verification, and discovery layer using DNS. ANS is explicitly designed so operators can verify who an agent represents, what permissions it has, and whether code and operational history remain authentic, while avoiding a centralized proprietary registry.
Source: Linux Foundation, 2026-06-23.

### SPIFFE: independent trust domains with cross-domain authentication
SPIFFE Federation explicitly models administratively isolated trust domains, each operating under its own authority, while allowing workloads in one domain to authenticate workloads in another through exchange of trust bundles. Bundles must be refreshed over time as trust state changes.
Source: SPIFFE Federation specification.

### Cross-organizational agent delegation remains unsolved
A July 2026 IETF Internet-Draft from the WIMSE working group states that existing workload and token-based authorization mechanisms were designed primarily for a single trust domain and limited delegation depth. The draft says these mechanisms do not adequately express, constrain, or verify recursively delegated authority when agents cross boundaries between independently administered organizations.
Source: IETF draft-reece-wimse-cross-org-delegation-01, 2026-07-30.

Important evidence quality note: this is an Internet-Draft/problem statement, not a final standard. It nevertheless documents an active standards-level recognition of the exact cross-organizational delegation gap.

### Delegated agent authority is becoming a formal standards object
Recent IETF drafts such as PEDIGREE and KAIF propose cryptographically bounded delegated authority, operator-controlled ceilings, delegation-depth tracking, revocation, audit accountability, and bridges to SPIFFE. These remain drafts and should not be treated as established standards.
Sources: IETF PEDIGREE draft, 2026-04-25; KAIF draft, 2026-07-19.

### OpenSharing: portable AI assets and data across organizations and clouds
The Linux Foundation's OpenSharing project, contributed by Databricks, is explicitly intended to standardize sharing of agent skills, AI models, and data across organizations and platforms while avoiding proprietary marketplaces and point-to-point integrations.
Source: Linux Foundation, 2026-06-10.

### Marketplace/procurement rails form a commercial connective layer
Anthropic's Claude Marketplace allows enterprise customers to apply existing Anthropic spend commitments toward partner solutions, consolidating procurement and invoicing. AWS Marketplace similarly allows Claude products to use AWS IAM, AWS billing, existing AWS procurement, and AWS spend commitments. Google Cloud Marketplace lets approved AI agents and software draw down cloud commitments and provides private-marketplace governance.
Sources: Anthropic Claude Marketplace; AWS Marketplace; Google Cloud Marketplace.

### Frontier models are being inserted into pre-existing control planes
OpenAI states that its frontier models and Codex on AWS are designed to enter production through customers' existing AWS security, compliance, procurement, billing, and governance workflows. Anthropic similarly markets Claude on AWS as operating inside the customer's trusted AWS environment with AWS account, procurement, billing, and control structures.
Sources: OpenAI on AWS, 2026-06-01; Anthropic Claude on AWS.

### Commercial interdependence is substantial
Snowflake committed $6B of AWS compute and AI spend over five years while reporting more than $7B in lifetime AWS Marketplace sales. This demonstrates that the connective layer is not merely technical; large contractual and procurement commitments reinforce it economically.
Source: Amazon/Snowflake, 2026-05-27.

## Research interpretation
The emerging agent ecosystem increasingly resembles a federated network rather than a single vertically controlled stack. Individual systems may retain separate administrative authority while relying on shared protocols and trust mechanisms to exchange identity, requests, assets, evidence, and delegated authority.

The market is actively solving:
- communication across systems;
- model/tool interoperability;
- portable workload identity;
- federated authentication;
- agent discovery;
- asset/data exchange;
- procurement portability.

The market is not yet shown to have solved, as one coherent layer:
- portable institutional standing;
- persistent delegated authority across autonomous organizations;
- complete provenance of authorization and disposition;
- continuity of review standing across system/environment change;
- accountable return and disposition after consequential cross-boundary action.

## Measures Registry read — held research interpretation
This evidence materially strengthens the external relevance of the Measures Registry mission boundary without proving product-market demand.

The most significant convergence is that external standards are independently moving toward:
- federated identity rather than centralized ownership;
- independent trust domains that retain their own authority;
- explicit delegated permissions;
- verifiable cross-domain relationships;
- portable trust artifacts;
- observable cross-system activity.

This is closely aligned with the MR premise that participants and institutions remain autonomous while consequential relationships require coherent shared conditions.

The strongest remaining MR research question is therefore no longer whether cross-system interoperability will exist. It plainly is being built.

The question is:

> When identity, communication, models, tools, and data can cross autonomous domains, what governance state must travel with the relationship so that authority, evidence, review, standing, and accountable return remain coherent without transferring institutional authority to a platform intermediary?

That is a narrower and more defensible differentiation target than generic AI governance.

## Falsification test
MR differentiation weakens if emerging open standards and hyperscaler control planes converge on a durable, low-cost mechanism that already carries sufficient cross-organizational identity, authority, standing, evidence, lifecycle state, review, exception handling, and disposition while preserving participant autonomy.

MR differentiation strengthens if the technical interoperability layer matures while institutional governance state remains reconstructed or locally interpreted at every boundary.

## Next excavation
Trace one complete cross-boundary passage across:

institution A → agent A → MCP/A2A/tool → cloud/model provider → institution B → regulator/auditor

For each hop, identify:
- identity artifact;
- authority artifact;
- trust root;
- permission scope;
- evidence/provenance artifact;
- runtime state;
- review standing;
- change/revocation mechanism;
- exception path;
- return/disposition artifact;
- which artifact survives the hop and which is reconstructed.

## Disposition
Research only. No canonical terminology, Registry registration, publication, pricing, or product claim authorized by this artifact.
