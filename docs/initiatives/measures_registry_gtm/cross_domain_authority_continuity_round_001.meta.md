# Cross-Domain Authority Continuity — Round 001

status: research_only
branch: gtm-ledger-v1
operator: op044
scope: Measures Registry GTM / systems-governance research

## Question
When a consequential act crosses institution → vendor → model → cloud, what authority actually survives the crossing, and what evidence proves it?

## Findings

### 1. Cloud contracts preserve local rights and local control, not one complete cross-domain authority lineage
- AWS customer/service terms define customer content rights and service-specific provider controls. Amazon Bedrock introduces third-party model terms, model-provider relationships, abuse-detection retention, provider usage metadata, and provider-specific conditions.
- Google Cloud service terms distinguish Customer Data, Google Models, Customer Models, generated output, separate offerings, data location, training restrictions, provider suspension/termination powers, and model-specific restrictions.
- Microsoft Foundry documents that Azure can process prompts, outputs, embeddings and training data while restricting use/training and maintaining its own service-layer controls. Microsoft also added OpenAI as a subprocessor for certain Online Services in 2026.

Interpretation: contracts establish bounded local responsibilities and processing permissions, but do not by themselves create one persistent, end-to-end record proving who originally authorized a consequential act, how that authority was attenuated at each downstream hop, and what returned to the originating authority after execution.

### 2. Cross-organization delegated authority is an active standards gap, not a settled commodity
July 2026 IETF individual-draft work on cross-organization AI-agent delegation explicitly treats:
- key possession,
- delegated authority,
- and named-human pre-execution authorization
as diagnostically separate evidence layers.

The cross-organization mapping assumes no shared operator, no shared runtime, and no interaction-specific bilateral agreement. It requires authority conveyed by a root principal to be narrowed at every hop and re-verified end-to-end.

The work is explicitly draft-stage and does not define a completed universal protocol.

### 3. Current agentic deployments can lose fidelity to originating intent across intermediaries
A May 2026 delegation-receipt draft states the chain as User → Operator → Agent → Services and identifies a missing cryptographic anchor: fidelity to the user's original intent can depend on the honesty and competence of intermediate parties.

This is direct support for an authority-continuity problem without requiring any claim of malicious intent.

### 4. Authorization evidence is being separated from authentication and execution
A May 2026 WIMSE authorization-evidence draft defines signed authorization-evidence records that commit to the dispatched request and can identify a delegated principal. It treats authorization evidence as a distinct artifact that must be bound to the action.

This supports the proposition that possession of credentials or successful execution is not sufficient evidence of originating authority.

## Working distinction
Authentication answers: who/what is this actor?
Authorization answers: what may this actor do here?
Delegation lineage answers: from whom did that authority originate, through which bounded hops, under what constraints?
Execution evidence answers: what act actually occurred?
Return/disposition answers: what came back to the originating authority and how was the relationship closed or changed?

No single cloud contract or broadly deployed standard identified in this round was found to carry that entire state across independent authority domains.

## Strongest research proposition
A consequential computational relationship can cross multiple operational domains while its originating authority is preserved only in fragments unless the system explicitly carries authority lineage, bounded delegation, execution evidence, and accountable return across the crossings.

## MR relevance — hypothesis only
MR remains potentially differentiated if it can preserve the governed standing of the relationship across autonomous domains without becoming the sovereign authority over the parties.

Potential state bundle:
- originating authority
- delegated authority
- reserved authority
- environment/domain
- actor identity
- bounded capability
- current standing
- evidence-at-time
- executed action
- change/supersession
- hold/dispute/revocation
- return
- disposition

## Falsifier
If open standards and ordinary enterprise infrastructure converge into a cheap, widely deployed mechanism that reliably preserves this full bundle across autonomous institutions, MR's differentiated value as a cross-domain governance substrate narrows materially.

## Holds
- No claim that cloud/model providers deliberately erase authority lineage.
- No claim that any platform is legally sovereign.
- No claim that current IETF drafts have standards standing; they are evidence of an active problem space.
- No claim that MR implementation presently solves the problem end-to-end.

## Sources
- AWS Service Terms, last updated 2026-08-20.
- AWS Customer Agreement, last updated 2026-08-14.
- Google Cloud Service Specific Terms, 2026.
- Microsoft Foundry data/privacy/security documentation, 2026.
- Microsoft OpenAI subprocessor documentation, 2026.
- IETF Internet-Draft: A Layered Requirements Mapping for Cross-Organization Agent Delegation, July 2026.
- IETF Internet-Draft: Delegation Receipt Protocol for AI Agent Authorization, May 2026.
- IETF Internet-Draft: Signed Authorization-Evidence Records for WIMSE-Authorized AI Agent Actions, May 2026.
