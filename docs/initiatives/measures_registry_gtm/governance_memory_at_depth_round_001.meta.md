# Governance Memory at Depth — Research Round 001

status: research_only
registry_mutation: none
operator: op044
assistant: Chazz

## Research question
What mechanisms currently preserve governance memory across autonomous systems and organizations, and where does complete consequential governance state still fail to persist?

## Current external evidence

### Cross-organizational delegation and composable audit
An August 2026 IETF Internet-Draft on cross-organizational delegation for workload and agent identity states that no single organization observes the entire delegation chain in a cross-organizational interaction. It therefore requires that records held by each participant be composable into a coherent end-to-end account and resistant to undetectable alteration. The draft identifies a cumulative gap: no widely deployed mechanism today lets a relying party verify a recursively attenuated, principal-bound delegation chain from another organization while also supporting cross-domain revocation and composable audit.

Source: draft-reece-wimse-cross-org-delegation-01.

### Authorization-state lifecycle memory
A 2026 IETF draft for distributed authorization-policy sharing separates policy governance from runtime decision-making and proposes lifecycle recording across creation, update, activation, rollback, and decommissioning, with historical policy revisions retained for rollback, audit, and recovery.

Source: draft-cabanillas-nmop-authz-policy-sharing-model.

### Consequential-action correlation
The August 2026 Canonical Action Identifier (CAID) draft addresses the problem that authorization, delegation, execution, and audit artifacts may all refer to the same action using incompatible encodings or digests. It proposes a canonical action identifier and mapping profile so independently verified artifacts can be evaluated as referring to the same consequential action.

Source: draft-schrock-canonical-action-identifier-02.

### Portable evidence architecture
The July/August 2026 EMILIA Protocol drafts describe a delayed-review and cross-domain case in which an auditor, counterparty, insurer, or regulator may later need to reconstruct which identity, delegation, policy, approval, consumption, invocation, and outcome facts held for an exact action. The draft explicitly notes that an operator-controlled log is not, by itself, portable evidence against a dishonest or unavailable operator.

Source: draft-schrock-ep-architecture-02.

### Cross-domain trust framework
Another 2026 IETF draft for cross-domain agent-to-agent communications proposes verifiable agent identity, credentialing, cross-domain authorization, delegation, revocation, and auditability. It still leaves delegation-chain representation, workflow state, and some semantics deployment-specific.

Source: draft-kiliram-agent-trust-auth-framework-00.

## Interpretation
The standards ecosystem is moving from simple authentication and policy toward preservation of governance memory across actions and domains:

- who acted;
- on whose behalf;
- through which delegation chain;
- under what policy;
- with what human authorization;
- against which resource/action;
- with what revocation state;
- what occurred at execution;
- and what evidence remains available later.

This materially overlaps the problem space Measures Registry was designed around.

However, the evidence still shows the work split into separate technical artifacts and protocols. Current standards efforts are attempting to make those artifacts composable, correlatable, revocable, and reconstructable after the fact. They do not yet establish a mature, widely deployed neutral mechanism that preserves complete governance state across independent authority domains.

## Strongest current proposition
The emerging technical problem is no longer only cross-domain identity or policy. It is whether independently produced governance artifacts can retain enough shared memory to reconstruct the authority, conditions, execution, change, and accountable history of a consequential relationship across autonomous systems.

## MR-specific implication
A possible Measures Registry differentiation is not storage or logging. It is the governed persistence of consequential relationship state across independent authority domains while those domains retain autonomy.

Candidate state dimensions to continue testing:

- identity;
- authority provenance;
- delegated role;
- standing;
- policy/version;
- environment/runtime correspondence;
- evidence;
- human authorization where required;
- change history;
- revocation/hold state;
- exception handling;
- return path;
- disposition authority;
- closure and retained history.

## Falsifier
Measures Registry differentiation weakens materially if a mature, widely deployed standards stack already provides portable, neutral, end-to-end preservation of the above governance state across independently administered organizations without requiring a shared administrative authority or platform owner.

## Current disposition
canary_status: perched
kimberlite_status: found
memory_layer_status: active_research
mr_specific_necessity: not_yet_proven

No Registry, Supabase, deployment, publication, or canonical terminology mutation performed.
