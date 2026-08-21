# Hyperscaler Stack-Governance Convergence — Research Round 001

status: research_only
branch: gtm-ledger-v1
registry_mutation: prohibited_without_separate_operator_confirmation

## Research question

Do the same firms materially occupy multiple layers of the AI value stack—compute/infrastructure, frontier-model financing/hosting, enterprise deployment, and governance/security controls—and if so, how do those governance products frame the governing object?

## Method

Bias-control rule: distinguish confirmed structural convergence from motive claims. Counterexamples and narrowing evidence are retained. No inference of coordination, prior knowledge, suppression, or intent unless an artifact explicitly supports it.

## Findings

### Microsoft

Confirmed layers:
- cloud/infrastructure: Azure and Microsoft Cloud;
- frontier-model relationship: large OpenAI investment and ongoing model integration;
- enterprise deployment: Microsoft Foundry / Copilot ecosystem;
- governance/security: Foundry Control Plane, Purview, Entra, Defender, content-safety and monitoring controls.

Current evidence indicates Microsoft explicitly markets a unified platform for building, optimizing, and governing AI at scale. The governance surface includes model/content safety, identity, data governance, security posture, monitoring, and documentation. This is broader than model-only governance and extends into surrounding enterprise infrastructure.

Interpretation: Microsoft is not merely selling model evaluation. It is integrating AI governance into the same cloud, identity, data, and security substrate used for enterprise deployment.

### Amazon Web Services

Confirmed layers:
- cloud/infrastructure: AWS;
- frontier-model relationship: major Anthropic investor and primary cloud/compute partner;
- frontier compute: Trainium; Anthropic's Project Rainier uses almost one million Trainium2 chips for Claude training/serving;
- enterprise deployment: Bedrock and Claude Platform on AWS;
- governance/security: Bedrock Guardrails, IAM, CloudTrail, cross-account safeguards, organization policies, data-retention controls.

Notable current artifacts:
- cross-account safeguards permit centralized enforcement across organizational units and AWS accounts;
- Claude Platform on AWS uses existing AWS identity, authorization, billing, and CloudTrail audit trails;
- AWS explicitly says centralized gateway/control-plane tooling is needed because independent team-level credential, policy, and spend controls do not scale;
- Bedrock guidance requires continued testing and validation because underlying safeguard models can be updated automatically.

Interpretation: AWS governance increasingly concerns the conditions under which models and agents act—identity, credentials, accounts, policies, logging, data retention, organization-level enforcement—not merely model behavior.

### Google / Alphabet

Confirmed layers:
- infrastructure: Google Cloud, TPUs, large-scale technical infrastructure investment;
- frontier models: Gemini and Anthropic relationship;
- enterprise deployment: Gemini Enterprise Agent Platform, Vertex AI;
- governance/security: IAM, organization-policy constraints, Model Armor, Security Command Center, semantic governance policies.

Google currently describes its offering as a full enterprise AI stack: infrastructure, platform, Workspace, security, models, and agents. Organization-policy constraints can restrict which models and advanced partner-model features may be used. Model Armor can enforce prompt/response controls at organization/folder/project levels; IAM can control principals, tools, services, and OAuth clients.

Interpretation: Google explicitly frames the challenge as managing thousands of agents and provides environmental controls across infrastructure, data, models, identities, tools, and agents.

## FTC control evidence

The FTC's Section 6(b) study of Microsoft–OpenAI, Amazon–Anthropic, and Google–Anthropic documents structural ties between major cloud providers and frontier developers, including billions in investment plus cloud commitments and non-monetary exchanges. The study exists because public disclosures did not fully reveal the commercial and strategic structure of these relationships.

Confirmed public investment amounts summarized by FTC for the period studied:
- Microsoft–OpenAI: approximately $13.75B;
- Amazon–Anthropic: $8B;
- Google–Anthropic: approximately $2.55B.

The FTC study is evidence of concentration and vertical relationship, not proof of anti-competitive intent or suppression.

## Monetization evidence

Accenture provides a useful downstream monetization comparator. Its FY2025 annual report says it made a $3B multi-year generative-AI investment beginning in FY2023, then generated $2.7B in FY2025 generative/agentic-AI revenue and $5.9B in bookings. This demonstrates large monetizable enterprise demand around AI readiness, deployment, transformation, and related services. It does not isolate governance revenue.

## Falsification / narrowing evidence

The research does not support a simple claim that mainstream AI governance is exclusively model-centric. Hyperscaler governance offerings increasingly include:
- identity and authorization;
- organization/account policy;
- data custody and retention;
- logging and audit trails;
- tool and agent permissions;
- centralized enforcement;
- model/content safeguards;
- runtime security and monitoring.

Therefore, the strongest MR differentiation cannot be "everyone else governs only the model." That proposition is too broad.

A more defensible distinction under test is:

> Hyperscalers increasingly govern AI behavior through the infrastructure and control plane they own. Measures Registry asks whether equivalent coherent governance conditions can persist across independent institutions and systems without requiring one infrastructure provider to become the authority holder.

This preserves the MR object-of-governance distinction while acknowledging that major cloud providers are already converging toward environment-level controls inside their own administrative domains.

## Emerging structural finding

The clearest same-actor convergence is not yet the banks; it is the hyperscalers:

compute/infrastructure -> frontier-model investment/hosting -> enterprise deployment -> identity/data/security controls -> AI governance tooling

This creates a vertically integrated governance surface where the provider can make AI governable precisely because it controls substantial portions of the surrounding environment.

The unresolved MR question is cross-boundary portability and autonomy:
- What happens when the consequential relationship crosses AWS/Azure/GCP boundaries?
- Who carries identity, authority, evidence, standing, review, and disposition across institutions?
- Can governance continuity persist without forcing participants into one provider's control plane?

That is a stronger and more falsifiable market question than claiming existing AI governance ignores systems entirely.

## Current disposition

- structural convergence: supported
- vertical integration across AI stack: supported
- governance increasingly environment-aware inside hyperscaler domains: supported
- deliberate market misdirection: not established
- coordinated suppression: not established
- MR cross-boundary/autonomy differentiation: plausible; requires evidence

