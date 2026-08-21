---
document_type: research_artifact_matrix
title: Governance Artifact Continuity Matrix — Round 001
status: working_research
version: v1
timestamp: 2026-08-21
operator: op044
author: chazz
system: measures_registry
scope: governance_artifact_existence_validity_continuity_runtime_correspondence
authoritative_custody: git
repository: c3codex/c3-Field
branch: gtm-ledger-v1
registry_standing: unregistered
---

# Governance Artifact Continuity Matrix — Round 001

## Purpose
Test the artifact-layer hypothesis against named 2025–2026 systems: governance artifacts either exist, do not exist, are stale, fail to travel across boundaries, cannot be verified, or remain unknown. The research distinguishes public evidence from inference and does not establish Registry standing.

## Artifact States
`present | absent | present_but_stale | present_but_not_portable | present_but_not_verifiable | unknown`

## Artifact Classes
- accountable identity / actor
- ownership
- authority / delegated permission
- position / role
- evidence basis
- validation / testing
- review standing
- change / version history
- vendor / contract conditions
- runtime / monitoring evidence
- exception handling
- response / return path

## Case A — U.S. Federal AI Acquisition Environment (DOD / DHS / GSA / VA)
### Publicly evidenced artifacts
- Cross-functional acquisition teams: `present` in selected mature programs.
- Contract clauses for data ownership, IP rights, testing, privacy, vendor lock-in, and accountability: `present` in later guidance and some follow-on contracts.
- Authorization to operate before deployment: `required_present` in 2025 OMB acquisition guidance.
- Early testing and continuous evaluation: `required_or_recommended_present`.
- Lessons-learned artifacts: `present_but_not_portable` / sometimes effectively `absent` at agency-policy level.
- Reusable contract terms: `present_locally_but_not_portable`.
- Data rights: `mixed`; FEMA example shows missing rights materially blocked sharing of model outputs with partners.
- Standard AI security contract language: `present_but_stale` in VA Automated Decision Support example.

### Structural finding
This is the cleanest current artifact-continuity case. Governance artifacts exist, but several are not reliably preserved or carried into the next acquisition. GAO found selected agencies were not systematically collecting lessons learned, even where prior acquisitions had generated useful contract terms, testing practices, and data-rights knowledge.

### Preliminary standing
`governance_discontinuity_candidate_strong`

## Case B — UnitedHealth Group Responsible AI Environment
### Publicly evidenced artifacts
- Governance owner: `present` — Chief Legal Officer / Legal and Compliance.
- AI inventory: `present` — Responsible AI Program Office maintains AI-solution inventory.
- Review authority: `present` — AI Review Board can approve or require removal of AI models from production.
- Multidisciplinary role structure: `present`.
- Policy/guidance materials: `present`.
- Board oversight: `present`.
- Separation of first-line development from compliance/risk management: `present`.
- Lifecycle review: `present` at policy/program level.
- Runtime correspondence of every inventory record to every live deployment: `unknown`.
- Artifact portability across Optum / UnitedHealthcare / vendor boundaries: `unknown`.
- Exception/override artifact continuity: `unknown`.

### Structural finding
This is a high-value control case because the governance artifact set is unusually explicit. It should not be treated as evidence of failure. The research question is whether the artifact set remains current, complete, and continuous across business units, vendors, model updates, and consequential coverage/clinical workflows.

### Preliminary standing
`strong_control_case_artifacts_present`

## Case C — Deutsche Bank TPRM AI
### Publicly evidenced artifacts
- Human final decision authority: `present`.
- Internal control questions: `present`.
- Vendor documentary evidence: `present`.
- Source citations for AI recommendations: `present`.
- Human validation step: `present`.
- Accuracy benchmark against human validation: `present` (~90% reported).
- Sequential agent roles: `present` and explicit.
- Regular vendor reviews: `present`.
- Full exception-handling artifact: `unknown`.
- Agent/version change history tied to each recommendation: `unknown` publicly.
- Delegated identity/permission artifacts for each agent: `unknown` publicly.

### Structural finding
This is a strong control case showing that consequential agentic AI can be inserted into a governed workflow while preserving human decision authority and evidence traceability. It is useful precisely because it can falsify overbroad MR claims if durable coherence persists without broader reconstruction burden.

### Preliminary standing
`strong_control_case`

## Case D — Ford BlueCruise / Partial Automation
### Publicly evidenced artifacts
- Driver role / fallback responsibility: `present` in product design and user framing.
- Driver-monitoring system: `present`.
- Crash/event data artifacts: `present_but_not_sufficiently_portable_or_accessible` at industry/regulatory level according to NTSB.
- Federal performance standards for Level 2 systems: `absent` / inadequate in the NTSB finding.
- Monitoring evidence sufficient to detect all forms of disengagement: `present_but_not_sufficient`.
- System configuration constraints preventing unsafe combinations: `present_but_not_sufficient`; drivers could disable automatic emergency braking while using BlueCruise and set speed assists above limits.
- Regulator-ready automatic crash notification / standardized data: `absent` according to NTSB recommendations.

### Structural finding
This case demonstrates that artifact presence is not enough. A driver-monitoring artifact existed; the failure question concerned adequacy, correspondence to actual human attention, and availability of crash evidence to outside investigators and regulators.

### Preliminary standing
`artifact_validity_and_runtime_correspondence_failure_supported`

## Case E — University of Maine System AI Environment
### Publicly evidenced artifacts
- Systemwide governance framework: `present`.
- Acceptable-use policy: `present`.
- Data-classification policy: `present`.
- Explicit FERPA / protected-data restrictions: `present`.
- Approved-tool inventory: `present`.
- Tool status and user counts: `present` publicly.
- Procurement history / enterprise contract: `present`.
- AI Task Force: `present`.
- Updated AI acceptable-use policy: `present`.
- Systemwide ChatGPT Edu contract: `present`, $1.4M / 2 years.
- Runtime correspondence between approved inventory and actual individual use: `unknown`.
- Local campus/course implementation consistency: `unknown`.
- Re-review after vendor capability changes: `unknown` for UMS specifically.

### Structural finding
UMS is another useful control case: explicit artifacts are being built before and alongside systemwide expansion, and the enterprise contract replaces a patchwork of individual subscriptions. The research question is whether central artifacts remain coherent across seven universities, faculty autonomy, teaching, research, operations, and changing vendor capabilities.

### Preliminary standing
`control_case_with_future_continuity_test`

## Case F — SUNY Systemwide AI Policy
### Publicly evidenced artifacts
- Human accountability requirement: `present`.
- Roles/responsibilities requirement: `present`.
- Procurement protections: `present`.
- Domain-specific governance: `present`.
- Risk-based oversight: `present`.
- Review / re-evaluation requirement: `present`.
- Decision-making authority preservation: `present`.
- Actual campus-level execution artifacts: `unknown` at systemwide public-policy layer.
- Runtime correspondence across campuses and domains: `unknown`.

### Structural finding
SUNY strongly supports the proposition that governance must be embedded across the institutional environment rather than collapsed into one AI policy. It also creates a future test of continuity: whether distributed campus/domain artifacts correspond to the systemwide policy as technology and local practice change.

### Preliminary standing
`policy_artifacts_present_execution_continuity_unknown`

## Cross-Case Finding
The first artifact-layer pass suggests four distinct structural states:

1. **Artifact absence** — a required governance condition was never formally established.
2. **Artifact insufficiency** — the artifact exists but does not adequately govern the consequential condition.
3. **Artifact discontinuity** — the artifact exists locally but does not travel across acquisitions, vendors, departments, institutions, or regulatory boundaries.
4. **Artifact drift** — the artifact may exist historically but no longer corresponds to live runtime conditions, current permissions, model versions, workflows, or roles.

This is more precise than a generic governance-maturity score.

## Working Research Proposition
> The economically and operationally consequential question is not whether an institution “has AI governance,” but whether the governance artifacts required to establish identity, authority, ownership, evidence, review, change, and response are present, valid, portable where necessary, and correspondent to the live operating environment.

## Falsification Conditions
The artifact-continuity hypothesis weakens if mature institutions can demonstrate that:
- governance artifacts remain current with low maintenance burden;
- artifacts travel cleanly across system and vendor boundaries;
- revalidation is inexpensive and infrequent;
- local governance reconstruction is trivial;
- runtime correspondence is reliably established by existing enterprise systems;
- consequential failures do not cluster around missing, stale, non-portable, or non-verifiable artifacts.

## Next Research Pass
For each named watchlist organization, seek evidence of:
`artifact origin → custodian → version → validation date → runtime/system binding → portability → re-review trigger → exception path → return/disposition evidence`.

Priority targets:
1. UnitedHealth: completeness and cross-business continuity of AI inventory/review artifacts.
2. Deutsche Bank: agent identity, permission, version and exception artifacts behind TPRM AI.
3. Federal agencies: whether GAO recommendations produce portable acquisition artifacts.
4. UMS / SUNY: whether systemwide policy artifacts remain coherent at campus/domain execution level.
5. Ford / Level 2 automation: whether crash-data, monitoring and fallback artifacts become standardized and regulator-accessible.

## Holds
- Public absence is not proof that an internal artifact does not exist; mark `unknown` where evidence is unavailable.
- Policy existence is not proof of operational execution.
- Artifact presence is not proof of artifact adequacy.
- Artifact continuity is not assumed from common ownership or platform use.
- No Registry mutation, MAP/SEAT standing, pricing, publication, or sales activation is authorized by this research artifact.
