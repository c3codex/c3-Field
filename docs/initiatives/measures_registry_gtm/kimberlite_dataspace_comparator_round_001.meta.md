# Kimberlite Dataspace Comparator — Round 001

status: research_only
branch: gtm-ledger-v1
registry_mutation: false
operator: op044

## Research question
Do Gaia-X, IDS, Eclipse Dataspace Protocol, and adjacent federated trust architectures already provide the neutral cross-organizational governance substrate that would make a Measures Registry unnecessary?

## Findings

### 1. Gaia-X is the closest serious comparator
Gaia-X provides a common trust framework across autonomous participants using verifiable credentials, linked-data claims, identity/federation, catalogues, data agreements, logging, policy expression, onboarding/compliance, and continuous automated monitoring.

Current Gaia-X architecture states that Digital Clearing House instances assert compliance without becoming a single central host. Instances are non-exclusive and interchangeable, while Gaia-X retains governance over compulsory compliance elements.

Gaia-X preserves participant control and federated trust rather than requiring one global identity authority.

### 2. Gaia-X still separates trust/compliance from full institutional governance state
Gaia-X can establish participant/service claims, trust anchors, compliance status, policies, data-exchange agreements, and monitoring evidence. However, the architecture does not appear to carry a complete consequential relationship state containing all of: institutional authority provenance, current standing, bounded delegated role, runtime correspondence, exception/hold state, review history, accountable return path, and disposition authority across autonomous institutions.

This is not evidence of deficiency relative to Gaia-X's intended scope; it is a scope distinction.

### 3. IDS / Eclipse Dataspace Protocol go further into negotiated relationship state
Eclipse Dataspace Protocol supports publication of assets, machine-readable usage policies, electronic contract negotiation, and transfer-process state machines across autonomous entities.

IDSA describes the dataspace as both multi-organizational agreement and supporting technical infrastructure. Policies can establish access and contract conditions and can be reconciled across participants.

This is closer to MR than ordinary identity federation because the transaction/relationship itself becomes machine-addressable.

### 4. But the dataspace governance authority is explicitly not runtime enforcement
IDSA defines a Dataspace Governance Authority as the collective governance function that defines trust frameworks, policies, semantics, and processes. IDSA explicitly states that the DSGA is not itself a runtime-enforcement entity; enforcement must occur through the participating system architecture.

This creates a structural split between governance definition and runtime execution.

### 5. Legal and institutional meaning still exceeds machine-readable usage contracts
IDS explicitly states that it cannot replace legal contracts or licensing agreements and that many details of a business relationship cannot be modeled in machine-readable form. Usage Contracts are technical extensions of existing legal agreements and can be overruled by the parties.

This is important evidence against the claim that technical policy federation already carries complete governance state.

### 6. Autonomy is treated as a first-class requirement, but comes with reconstruction cost
IDSA defines autonomy/agency as the participant's ability to control data, conditions, and technical participation without mandatory external dependencies. It also states that full autonomy and agency come at a price because each participant must be able to control the technical, business, and legal elements of participation.

This is directly relevant to the MR economic hypothesis: autonomy is preserved, but the burden of maintaining coherent governance remains distributed across participants.

### 7. Failure handling exists conceptually but remains locally instantiated
IDSA Trust Framework guidance recognizes failure modes including irreconcilable policy conflicts, unverifiable claims, and material deviation from declared behavior. It calls for escalation and termination procedures.

However, those procedures are defined within the dataspace's governance framework and participant implementations; no evidence found in this round shows a neutral cross-domain layer preserving a universal relationship lifecycle including hold, review, return, and disposition across independently authoritative institutions.

## Comparator disposition

### What these systems already solve well
- federated participant identity
- trust anchors
- machine-verifiable claims
- revocation of credentials/attributes
- service discovery
- policy expression
- policy reconciliation
- usage-control agreements
- electronic contract negotiation
- data transfer state
- compliance checking
- technical evidence retrieval
- continuous monitoring
- decentralized/autonomous participation

### What remains unproven as a shared neutral substrate
- complete institutional authority provenance across domains
- bounded delegated role/standing carried with the relationship
- runtime state bound to current governance state across providers
- exception/hold state carried across participants
- cross-domain review history
- accountable return path
- disposition authority and closure state
- continuity of the whole relationship when legal, technical, institutional, and runtime states change together

## Strongest current interpretation
The federated data-space ecosystem demonstrates that industry is already moving toward decentralized, policy-bearing, trust-aware cross-organizational infrastructure. This substantially validates the architecture class while narrowing Measures Registry's possible differentiation.

The remaining candidate gap is not identity federation, policy federation, data sovereignty, or verifiable credentials. It is persistence of complete consequential governance state across autonomous institutions without replacing either institution's authority.

## Falsification condition
If Gaia-X, IDS, Eclipse Dataspace Protocol, or another mature dataspace implementation can be shown to carry and maintain the full relationship state above—including authority, standing, runtime correspondence, exception/hold, review, accountable return, and disposition—across autonomous participants at low operational cost, the differentiation claimed for Measures Registry materially shrinks.

## Current disposition
canary_status: perched
kimberlite_status: found
mr_specific_necessity: not_yet_proven
missing_infrastructure_signal: materially_strengthened

## Sources reviewed
- Gaia-X Architecture / Trust Framework (latest and prior releases)
- Gaia-X Digital Clearing House architecture
- Eclipse Dataspace Protocol
- Eclipse Dataspace Components
- IDSA Rulebook / Dataspace Governance Authority / Dataspace Trust Frameworks
- IDS Reference Architecture Model usage contracts and policy enforcement
