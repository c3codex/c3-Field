---
document_type: oar2
authority_level: working
document_scope: measures_registry_assessment_7_question_contract_body
title: OAR2 — Seat Measures Assessment 7-Question Contract Body
status: proposed
version: v1
operator: op044
system: measures_registry
session_scope: measures_interoperability
working_folder: docs/oar/measures_interoperability/
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar2
  - measures-interoperability
  - measures-registry
  - assessment
  - seven-question-contract
  - environmental-standing-report
  - recommended-actions
  - governed-pathway
  - assess-environment
  - obsidian-assessment-gate
  - public-runtime
  - no-deployment
source_alignment:
  - OAR1 Measures Registry Public Runtime Pass
  - OAR1 Audit Measures Registry Public Encounter Chamber Holding and Style Contracts
  - OAR1 Seat Measures Registry Public Encounter Missing Contract Bodies and Style Contract Aliases
  - OAR1 Seat Chamber-Held Render Readiness Rule
  - OAR1 Seat Measures Registry Public Position
  - Measures Registry Obsidian Assessment Gate Contract
  - Measures Registry Operative Concordance Update
  - Seed Concordance
  - The 21 of Coherence
  - Chazz x Cody Development Role Contract
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Seat Measures Assessment 7-Question Contract Body v1

## OBSERVED

The public runtime pass exposed that the assessment encounter is correctly held but incomplete.

The live `measures_assessment` row has the active `measures_assessment_contract` key, but the only live question carrier is:

metadata.assessment_mechanics.questions

and it currently contains 5 questions, while the active contract expects 7 scored questions. The renderer now refuses malformed assessment metadata and displays a public-safe held state instead of rendering legacy body state.

The chamber/style audit confirmed the assessment standing remains:

incomplete_contract

because the active contract expects seven questions and the live carrier still contains five. No assessment body was seated or patched during that audit.

The missing Understand contract bodies and style aliases were seated in the next route, but assessment questions were explicitly not touched. The assessment question count remains 5, fallback scoring was not restored, and renderer hold remains the correct behavior until the complete assessment body is seated.

The Obsidian Assessment Gate Contract confirms the gate presents 7 questions and that each question must carry:

- question_key
- question
- context_label
- options with condition_tags

It also confirms the mechanics source is `assessment_mechanics` JSONB in `measures_encounter_def.metadata`.

The same contract defines the returned evaluation object as an `EnvironmentalStandingReport` containing environmental standing, standing key, assessment title, assessment result, detected conditions, findings, operational exposure summary, recommended structured action, continuation pathway, and explainability.

The Measures Registry Public Position now preserves the assessment as an environment evaluation surface with this chain:

7 questions -> assessment evaluation result -> detected conditions -> findings -> operational exposure summary -> recommended actions -> recommended governed pathway -> internal route mapping

and public runtime must not expose internal route mapping.

## ALIGNED

This OAR2 seats the complete 7-question `measures_assessment_contract` body and the associated assessment evaluation contract.

The assessment is not generic funnel copy.

The questions are the assessment instrument.

The returned result is the evaluation of that assessment.

Recommended actions determine the governed pathway.

The internal commerce circuit remains hidden.

Correct model:

questions assess
results evaluate
recommended actions route
commerce circuit remains internal

This OAR2 authorizes DB mutation only for:

- measures_assessment.metadata.assessment_mechanics
- measures_assessment.metadata.assessment_interpretation

as required to seat:

- the 7-question assessment instrument
- EnvironmentalStandingReport result set
- recommended action sets
- public-safe governed pathway labels
- hidden internal route mapping

It does not authorize deployment.

It does not activate MAP execution, guided asset creation, findings delivery, governed commerce, payment, c3 Key, temp c3 Key, wallet connect, temp payment provider, SRC binding, permission, recognition, conversion, certification, DAO standing, or distribution standing.

It does not expose public C1 / C2 / C3 language.

Public pathway labels remain:

- AI Environment Review
- MAP the Environment
- Governed System Integrity Implementation

Internal mapping remains:

- C1 = AI Environment Review
- C2 = MAP the Environment
- C3 = Governed System Integrity Implementation

The operative concordance confirms Assess recommends C1 / C2 / C3 internally but does not activate circuit standing, and it is not c3 MAP, runtime audit, payment trigger, c3 Key issuance, SRC binding, Measures Conversion, or Registry Certification.

## ROUTED

### 1. Seat complete 7-question assessment instrument

Update only:

public.measures_encounter_def
row: measures_assessment
metadata.assessment_mechanics.questions

Replace the current 5-question array with the complete 7-question body.

Each question must include:

question_key: string
question: string
context_label: string
options:
  - label: string
    value: string
    condition_tags: string[]

Required count:

7

If the question count does not equal 7 after write, the route fails.

## 2. Required 7-question body

### Question 1

question_key: ai_output_review_pathway
question: How are AI-generated outputs currently reviewed before they influence operational decisions?
context_label: Review Pathway
options:
  - label: A persistent review pathway exists and is followed before AI output influences decisions.
    value: governed_review_pathway
    condition_tags:
      - review_pathway_present
      - governed_review_condition
  - label: Review depends on individual judgment, team habit, or availability.
    value: informal_review_pathway
    condition_tags:
      - informal_review_dependency
      - emerging_ai_drift_condition
  - label: AI outputs can influence decisions without a documented review pathway.
    value: no_documented_review_pathway
    condition_tags:
      - review_pathway_absent
      - critical_ai_drift_condition

### Question 2

question_key: active_ai_system_visibility
question: Can your organization identify every AI tool, automation, agent, or external runtime surface currently influencing work?
context_label: Runtime Visibility
options:
  - label: Yes. Active AI systems and runtime surfaces are documented and reviewable.
    value: ai_surface_inventory_present
    condition_tags:
      - runtime_surface_visibility
      - governed_review_condition
  - label: Partially. Known tools are visible, but informal or team-level AI use may not be fully registered.
    value: partial_ai_surface_inventory
    condition_tags:
      - partial_runtime_visibility
      - probable_ai_drift_condition
  - label: No. AI use has expanded faster than system visibility.
    value: ai_surface_inventory_absent
    condition_tags:
      - runtime_surface_unregistered
      - critical_ai_drift_condition

### Question 3

question_key: failure_traceability
question: If an AI-generated action caused operational failure today, could your organization trace who approved it, what system produced it, and what runtime dependencies enabled it?
context_label: Failure Traceability
options:
  - label: Yes. Approval, system origin, and runtime dependencies are traceable.
    value: failure_traceability_present
    condition_tags:
      - traceability_present
      - governed_review_condition
  - label: Partially. Some approval or system history could be reconstructed, but not reliably.
    value: partial_failure_traceability
    condition_tags:
      - partial_traceability
      - emerging_ai_drift_condition
  - label: No. The organization could not reliably trace approval, source, and runtime dependencies.
    value: failure_traceability_absent
    condition_tags:
      - traceability_absent
      - critical_ai_drift_condition

### Question 4

question_key: persistent_review_standard
question: Are AI-generated outputs reviewed through a persistent operational standard, or does review depend on individual judgment and availability?
context_label: Review Standard
options:
  - label: A persistent operational standard governs review.
    value: persistent_review_standard_present
    condition_tags:
      - persistent_review_standard
      - governed_review_condition
  - label: Review standards exist in some areas, but are inconsistent across teams or systems.
    value: inconsistent_review_standard
    condition_tags:
      - inconsistent_review_standard
      - emerging_ai_drift_condition
  - label: Review depends mostly on individual judgment, availability, or informal escalation.
    value: individual_review_dependency
    condition_tags:
      - individual_review_dependency
      - probable_ai_drift_condition

### Question 5

question_key: safe_ai_acceleration_capacity
question: Could your current operational environment safely support increased AI acceleration without adding instability?
context_label: Acceleration Capacity
options:
  - label: Yes. The environment has defined governance, review, and traceability conditions that can scale.
    value: safe_acceleration_capacity_present
    condition_tags:
      - scalable_governance_condition
      - governed_review_condition
  - label: Not yet. Some structure exists, but increased AI acceleration would expose unresolved gaps.
    value: limited_acceleration_capacity
    condition_tags:
      - acceleration_risk_present
      - emerging_ai_drift_condition
  - label: No. Additional AI acceleration would likely amplify instability, ambiguity, or untraceable decisions.
    value: unsafe_acceleration_capacity
    condition_tags:
      - acceleration_instability
      - critical_ai_drift_condition

### Question 6

question_key: role_authority_boundary
question: Are roles and authority boundaries clearly defined for people, systems, and AI-assisted workflows?
context_label: Role Authority
options:
  - label: Yes. Human roles, system roles, and AI-assisted workflow boundaries are clearly defined.
    value: role_authority_defined
    condition_tags:
      - role_integrity_present
      - governed_review_condition
  - label: Partially. Some roles are clear, but AI-assisted work has introduced ambiguous ownership or approval boundaries.
    value: partial_role_authority
    condition_tags:
      - role_boundary_ambiguity
      - probable_ai_drift_condition
  - label: No. AI use is creating unclear accountability between people, systems, and automated outputs.
    value: role_authority_undefined
    condition_tags:
      - role_boundary_failure
      - critical_ai_drift_condition

### Question 7

question_key: implementation_boundary
question: When AI is introduced into a workflow, is there a defined boundary between experimentation, operational use, and governed implementation?
context_label: Implementation Boundary
options:
  - label: Yes. Experimentation, operational use, and governed implementation are clearly separated.
    value: implementation_boundary_defined
    condition_tags:
      - implementation_boundary_present
      - governed_review_condition
  - label: Partially. Some boundaries exist, but pilots and operational usage can blur.
    value: partial_implementation_boundary
    condition_tags:
      - implementation_boundary_blur
      - emerging_ai_drift_condition
  - label: No. AI tools can move from experimentation into operational influence without a clear governance boundary.
    value: implementation_boundary_absent
    condition_tags:
      - implementation_boundary_absent
      - critical_ai_drift_condition

## 3. Seat assessment evaluation contract

Update or preserve:

metadata.assessment_interpretation

to return an `EnvironmentalStandingReport`.

Required return model:

return_object: EnvironmentalStandingReport
result_family: Structural Drift
returns_exactly_one_result: true
public_circuit_visible: false
internal_route_visible: false

The evaluation must contain:

- environmental_standing
- standing_key
- assessment_title
- assessment_result
- detected_conditions
- findings
- operational_exposure_summary
- recommended_actions
- recommended_structured_action
- continuation_pathway
- internal_commerce_circuit
- explainability

Public runtime may display:

- assessment_result
- environmental_standing
- detected_conditions
- findings
- operational_exposure_summary
- recommended_actions
- recommended_structured_action
- continuation_pathway

Public runtime may not display:

- internal_commerce_circuit
- raw condition tags
- C1
- C2
- C3
- commerce circuit

## 4. Seat evaluation result set

Seat three possible public assessment evaluation results.

Only one result may return per completed assessment.

### Result 1

standing_key: early_structural_drift
assessment_title: Measures AI Environment Assessment
assessment_result: Early Structural Drift Detected
environmental_standing: Early Governance Gap
result_family: Structural Drift
detected_conditions:
  - Informal or inconsistent review pathways may be present.
  - AI usage visibility may be partial.
  - Accountability and traceability practices may need clarification.
findings:
  - The environment shows early governance gaps that may amplify under AI acceleration.
  - The current structure may support limited AI usage, but requires clearer review and accountability conditions before expansion.
operational_exposure_summary: The institution may be ready for an initial AI environment review to clarify usage, review pathways, and governance gaps before additional AI acceleration.
recommended_actions:
  - Review current AI usage and decision-influence points.
  - Identify missing or informal review pathways.
  - Establish initial accountability and traceability practices.
  - Prepare for an AI Environment Review.
recommended_structured_action: Begin with AI Environment Review.
continuation_pathway: AI Environment Review
internal_commerce_circuit: C1
public_circuit_visible: false

### Result 2

standing_key: active_structural_drift
assessment_title: Measures AI Environment Assessment
assessment_result: Active Structural Drift Detected
environmental_standing: Active Runtime Exposure
result_family: Structural Drift
detected_conditions:
  - AI-facing runtime visibility may be incomplete.
  - Review, approval, or traceability pathways may be inconsistent.
  - AI outputs may already be influencing operational decisions.
findings:
  - The environment shows active runtime, review, or traceability exposure requiring deeper evaluation.
  - AI acceleration may amplify existing structural ambiguity unless runtime surfaces and approval pathways are mapped.
operational_exposure_summary: The institution should evaluate the AI-facing environment through MAP the Environment to identify critical, emerging, and probable AI drift conditions.
recommended_actions:
  - Map AI-facing runtime surfaces.
  - Review approval and traceability pathways.
  - Identify critical, emerging, and probable AI drift conditions.
  - Prepare for MAP the Environment.
recommended_structured_action: Proceed to MAP the Environment.
continuation_pathway: MAP the Environment
internal_commerce_circuit: C2
public_circuit_visible: false

### Result 3

standing_key: system_integrity_risk
assessment_title: Measures AI Environment Assessment
assessment_result: System Integrity Risk Detected
environmental_standing: System Integrity Risk
result_family: Structural Drift
detected_conditions:
  - Role, authority, runtime, or implementation boundaries may be unclear.
  - AI acceleration may be interacting with operational decisions without sufficient traceability.
  - Structured assets may be required before governed implementation can hold.
findings:
  - The environment shows compounded governance, runtime, role, or implementation-boundary risk.
  - Optimized AI deployment requires structured preparation before governed system integrity can be established.
operational_exposure_summary: The institution should enter a governed implementation preparation pathway to define structured assets, workflow conversion requirements, and system integrity conditions.
recommended_actions:
  - Enter a governed implementation preparation pathway.
  - Define structured assets for roles, review, traceability, runtime surfaces, and implementation boundaries.
  - Prepare workflow conversion requirements.
  - Begin Governed System Integrity Implementation.
recommended_structured_action: Begin Governed System Integrity Implementation.
continuation_pathway: Governed System Integrity Implementation
internal_commerce_circuit: C3
public_circuit_visible: false

## 5. Seat scoring / standing rule mapping

Use condition tags and severity to determine one returned result.

Condition severity:

critical_ai_drift_condition: 3
emerging_ai_drift_condition: 2
probable_ai_drift_condition: 1
governed_review_condition: 0

Recommended scoring logic:

standing_rules:
  - standing_key: system_integrity_risk
    priority: 3
    match:
      any_tags:
        - role_boundary_failure
        - traceability_absent
        - review_pathway_absent
        - runtime_surface_unregistered
        - implementation_boundary_absent
      min_critical_count: 2

  - standing_key: active_structural_drift
    priority: 2
    match:
      min_emerging_count: 2
      min_total_drift_score: 5

  - standing_key: early_structural_drift
    priority: 1
    match:
      min_total_drift_score: 1

Fallback rule:

fallback_standing_key: early_structural_drift
fallback_allowed_only_when_contract_valid: true

Important:

Do not restore legacy fallback scoring.
Do not allow malformed or non-7-question contracts to resolve.
Fallback only applies after a valid 7-question assessment is completed.

## 6. Preserve required condition classes

Ensure the following condition tags remain valid and resolvable:

- critical_ai_drift_condition
- emerging_ai_drift_condition
- probable_ai_drift_condition
- governed_review_condition

Do not expose raw condition tags to the visitor.

## 7. Preserve public pathway labels

Public pathway labels:

- AI Environment Review
- MAP the Environment
- Governed System Integrity Implementation

Do not render:

Foundational Measures Registry Cohort

as the public C3 pathway label.

That label is deprecated from the active public pathway language.

## 8. Preserve renderer hold behavior

Do not remove the renderer requirement that assessment must have exactly seven validated questions.

Do not restore malformed fallback scoring.

Do not allow the 5-question body to render.

If the 7-question body write fails, the renderer must continue showing:

Assessment question contract is incomplete.
Expected 7 seated questions; found 5.

## 9. Preserve assessment flow boundary

Public assessment may render:

- assessment passage
- scoped public assessment intake
- 7-question scored assessment
- assessment evaluation result
- detected conditions
- findings
- operational exposure summary
- recommended actions
- recommended governed pathway

Public assessment may not render:

- structured/private continuation bridge
- pricing
- payment route
- wallet route
- c3 Key issuance
- SRC binding mechanics
- conversion claim
- certification claim
- MAP findings delivery
- internal commerce circuit
- C1
- C2
- C3

## 10. Validation requirements

After DB seating, Cody must validate:

- live measures_assessment question count = 7
- each question has question_key
- each question has question text
- each question has context_label
- each question has options
- each option has condition_tags
- assessment_interpretation exists
- EnvironmentalStandingReport result set exists
- recommended_actions exist for each possible result
- continuation_pathway exists for each possible result
- internal C1/C2/C3 mapping exists but is not public-visible
- old 5-question body is no longer active carrier
- renderer route /?surface=measures_assessment shows 1 OF 7
- renderer route does not show held incomplete contract message
- renderer route does not show connect_src
- result boundary remains public-safe
- no public C1/C2/C3 exposure
- no public commerce circuit exposure

Browser validation is required.

Deployment is not authorized by this OAR2.

## 11. Produce OAR1

OAR1 must include:

- execution summary
- DB mutation summary
- question count readback
- question key readback
- assessment interpretation standing
- EnvironmentalStandingReport result set readback
- recommended actions readback
- internal route mapping hidden-state confirmation
- browser validation result
- public boundary verification
- held/private route verification
- deployment standing
- recommended next route

Expected next route after successful validation:

OAR2 — Validate Measures Registry Public Runtime and Deploy Boundary v1

## CODY ROLE

Cody may:

- seat the 7-question assessment contract body
- seat or update assessment interpretation result set
- seat recommended action sets
- map public pathway labels to hidden internal C1/C2/C3 routes
- preserve active contract keys
- preserve public-safe result boundary
- validate question count and shape
- validate browser route
- produce OAR1 after execution

Cody may not:

- deploy
- change pricing
- expose C1 / C2 / C3 publicly
- expose commerce circuit publicly
- expose governed commerce publicly
- activate MAP execution
- activate guided asset creation
- activate findings delivery
- activate payment/c3 Key/SRC/permission/recognition/conversion/certification
- restore malformed fallback scoring
- render the old 5-question body
- mutate Seed Concordance
- mutate The 21 of Coherence
- skip OAR1

## VALIDATION

This OAR2 resolves successfully when:

1. measures_assessment question body contains exactly 7 questions.
2. All seven questions include required fields.
3. Options include condition_tags.
4. Old 5-question body is no longer the active carrier.
5. Active contract keys are preserved.
6. EnvironmentalStandingReport result set is seated.
7. Each possible result includes recommended_actions.
8. Each possible result includes continuation_pathway.
9. Recommended actions route to one public pathway.
10. Internal C1/C2/C3 mapping exists but is hidden.
11. Raw condition tags are not user-visible.
12. Renderer hold behavior remains available for malformed contracts.
13. Browser route shows 1 OF 7.
14. Browser route does not show incomplete-contract held message.
15. Browser route does not show connect_src.
16. No public C1/C2/C3, commerce circuit, pricing, payment, key, SRC, conversion, or certification exposure occurs.
17. No deployment occurs.
18. OAR1 is produced after execution.

## EXPECTED OAR1

docs/oar/measures_interoperability/oar1_seat_measures_assessment_7_question_contract_body_v1.meta.md

## CLOSE

Questions assess.

Results evaluate.

Recommended actions route.

Commerce circuit remains internal.

No fallback.

No deploy.

Assessment becomes renderable only when the seven and the evaluation contract are truly seated.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
Chazz validates.
Cody executes from OAR2 only.
src renders seated state only.
