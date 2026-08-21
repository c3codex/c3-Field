# Missing Governance Substrate — Round 001

status: research_only
branch: gtm-ledger-v1
registry_mutation: prohibited
operator: op044

## Research question

Do existing neutral standards already carry sufficient governance state across independently authoritative systems to make a Measures Registry-like substrate unnecessary?

## Current answer

Not yet demonstrated. The closest mature and emerging standards decompose the problem into distinct layers—identity, federation, credentials, signed evidence, delegation, human authorization, policy expression, transparency—but repeatedly stop short of establishing a single portable governance state for a consequential relationship across independently administered organizations.

## Evidence

### 1. Cross-organizational delegated authority remains an open problem

IETF WIMSE draft `draft-reece-wimse-cross-org-delegation-01` states that existing workload and token authorization mechanisms were largely designed for a single trust domain and limited delegation depth, and do not adequately express, constrain, or verify recursively delegated authority across independently administered organizations.

Source: https://www.ietf.org/ietf-ftp/internet-drafts/draft-reece-wimse-cross-org-delegation-01.html

Research implication: identity/federation protocols do not by themselves solve authority continuity across autonomous domains.

### 2. Candidate solutions themselves split authority into separate evidence layers

IETF draft `draft-rampalli-cross-org-delegation-mapping-05` maps two candidate layers: (a) per-hop delegated authority and (b) named-human authorization evidence. It explicitly states that neither layer claims the other's property and that joining them by digest equality is a join key, not a claim of sufficiency.

Source: https://www.ietf.org/archive/id/draft-rampalli-cross-org-delegation-mapping-05.html

Research implication: even advanced candidate designs recognize that key possession, delegated authority, and accountable human authorization are diagnostically separate properties.

### 3. Agent authorization frameworks are still emerging, not settled infrastructure

`draft-fane-opena2a-aap-00` proposes identity assertion, scoped capability grants, cross-agent delegation, behavioral attestation, cross-organizational federation, and revocation propagation for AI agents.

Source: https://www.ietf.org/archive/id/draft-fane-opena2a-aap-00.html

`draft-liu-ai-agent-authorization-integration-00` combines OAuth extensions for cross-domain identity, policy-based authorization, user consent evidence, and multi-hop delegation.

Source: https://www.ietf.org/archive/id/draft-liu-ai-agent-authorization-integration-00.html

Research implication: the market is actively constructing missing cross-domain authorization infrastructure in 2026. This is convergence with the problem class, not evidence that it is already solved.

### 4. OpenID Federation carries federation membership, trust chains, and metadata policy

OpenID Federation 1.0 provides signed Entity Statements, federation trust chains, Trust Anchors, and metadata policies so independently administered entities can establish that participants belong to a federation and conform to federation policy.

Source: https://openid.net/specs/openid-federation-1_0.html

Research implication: this is a strong neutral federation primitive, but it governs entity metadata/trust participation rather than the full consequential relationship state: current authority, runtime condition, evidence history, exception path, review standing, and return/disposition.

### 5. W3C Verifiable Credentials carry machine-verifiable claims and status

W3C Verifiable Credentials 2.0 provides cryptographically verifiable claims, schemas, evidence fields, and status mechanisms such as suspension/revocation.

Sources:
- https://www.w3.org/TR/vc-overview/
- https://www.w3.org/2025/credentials/

Research implication: credentials can carry claims about identity, qualifications, status, or other assertions, but a credential does not itself establish that a live consequential relationship remains authorized, current, reviewed, and dispositionable through system change.

### 6. SCITT carries signed statements, policy-gated registration, receipts, and immutable history

IETF RFC 9943 defines a standards-track architecture for signed statements about artifacts, registration through a Transparency Service, policy checks before registration, receipts, and an irrevocable history suitable for independent audit.

Source: https://www.ietf.org/ietf-ftp/rfc/rfc9943.html

The architecture explicitly leaves the relying party's ultimate decision about which issuers to trust outside the scope of the transparency mechanism.

Research implication: SCITT is an important evidentiary/provenance layer and potentially complementary substrate. It can prove that a statement was made and registered under policy; it does not by itself determine the full authority/standing of a cross-organizational consequential relationship.

### 7. Gaia-X is a serious partial analogue

Gaia-X Trust Framework defines common governance and interoperability rules across federated ecosystems while preserving participant choice and control. It uses machine-readable trusted statements and verifiable credentials and seeks re-assessment of claim validity.

Source: https://docs.gaia-x.eu/policy-rules-committee/trust-framework/22.10/

Research implication: Gaia-X is one of the closest external analogues to the autonomy + federation problem. It narrows MR differentiation toward the runtime and relationship-governance layer rather than generic federated trust.

## Emerging decomposition

Current standards collectively cover substantial portions of the stack:

- identity
- federation membership
- trust chains
- machine-verifiable credentials
- credential status/revocation
- policy expression
- signed statements
- transparency receipts
- immutable provenance/history
- delegated authorization
- human authorization evidence
- agent communication and tool access

The remaining question is whether any deployed neutral substrate carries, as one coherently evaluable relationship state:

- originating principal / institution
- active actor identity
- delegated authority and limits
- current standing
- current runtime/system binding
- current evidence basis
- review/validation state
- change/version history
- exceptions and overrides
- revocation/hold
- accountable return/disposition

while preserving independent institutional authority and avoiding a shared dominant operator.

## Current disposition

problem_class: supported
neutral_identity_federation: substantially_available
portable_signed_evidence: substantially_available
cross_org_recursive_authority: active_open_problem
human_authorization_binding: emerging
full_relationship_governance_state: not_found
mr_specific_necessity: not_proven_but_materially_strengthened

## Falsification condition

Measures Registry differentiation materially shrinks if an existing or emerging neutral standard stack can cheaply and durably carry the complete consequential relationship state above across independently authoritative organizations, including runtime correspondence, review standing, exception handling, and accountable disposition, without requiring one platform or institution to become the authority holder.
