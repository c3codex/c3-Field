# OAR2 — Measures Registry Evaluation Encounter Contract v2

## OBSERVED

The evaluation chamber requires fully seated encounter authority prior to runtime implementation.

Assessment content, styling direction, media roles, interaction behavior, and returned assessment structure must resolve from DB-seated state rather than frontend interpretation.

Previous runtime direction did not sufficiently define the seated encounter contract required for deterministic rendering.

---

## ALIGNED

Authority order remains:

Codex → Field → Measures → OAR2 → Chazz → Cody → src

Frontend renders seated encounter state only.

Cody executes from OAR2 only.

Runtime coding may not begin until:

- assessment encounter contract is seated
- styling contract is seated
- media role mappings are resolved
- content records are verified

This OAR2 stops at:

- encounter seating
- styling contract seating
- returned assessment seating

Not included:

- email delivery
- protocol continuation
- reserve seat
- payment surface

---

## ROUTED

### 1. Seat Evaluation Encounter Contract

Encounter key:

measures_ai_operational_evaluation

Renderer:

measures_registry_evaluation_chamber

Theme:

evaluation_chamber_lapis_obsidian_v1

Required seated surfaces:

- encounter identity
- renderer key
- theme key
- content blocks
- media roles
- interaction contract
- returned assessment contract
- styling contract

---

### 2. Seat Media Role Mappings

Bucket:

measures-registry

Required media roles:

- lapis_background
- registry_watermark
- registry_mark
- evaluation_reference_image

Cody must bind media roles to existing uploaded bucket assets and record resolved paths in OAR1.

Do not require filename changes.

---

### 3. Seat Evaluation Content

Seat the approved 5-question / 3-answer evaluation structure.

#### Q1

How frequently do operational decisions inside your organization involve AI-generated output without a documented review pathway?

1. Rarely, and only in isolated experimentation
2. Regularly, but review practices vary by team or individual
3. Frequently, and AI-generated output already influences operational decisions

#### Q2

Can your organization currently identify every AI system, automation, and external runtime surface actively influencing operational output?

1. Yes, active systems and dependencies are documented
2. Partially, but some tools, automations, or dependencies are informal
3. No, visibility is fragmented across teams, tools, or vendors

#### Q3

If an AI-generated action caused operational failure today, could your organization trace who approved it, what system produced it, and what runtime dependencies enabled it?

1. Yes, approval, system source, and dependencies are traceable
2. Partially, but traceability depends on who handled the action
3. No, the approval path, system source, or dependencies would be unclear

#### Q4

Are AI-generated outputs reviewed through a persistent operational standard, or does review currently depend on individual judgment and availability?

1. A persistent review standard is documented and used
2. Review exists, but it depends on team habits or availability
3. Review is inconsistent, informal, or not operationally enforced

#### Q5

Do you believe your current operational environment could safely support increased AI acceleration without introducing additional instability?

1. Yes, current structures can support acceleration safely
2. Possibly, but structural gaps would need to be resolved first
3. No, increased acceleration would likely amplify instability

---

### 4. Seat Interaction Contract

Evaluation behavior:

- render one question at a time
- user selects one answer
- selected answer visually seals
- Continue activates only after selection
- next question appears only after Continue
- transition uses restrained dissolve/fade

Disallowed:

- stacked survey
- scrolling form
- auto-advance
- multiple visible questions
- generic radio-list UI

---

### 5. Seat Returned Assessment Contract

Returned standing:

Structural Drift Detected

Returned assessment body:

Observed findings indicate the current operational environment is fragmented across systems, responsibilities, review pathways, and runtime dependencies.

Current standing suggests AI optimization efforts are occurring within an unstable operational environment.

Findings beneath standing:

- Fragmented Operational Procedures
- Undefined Role Assignments
- System Environment Inconsistency
- Unbounded Automation Exposure

Required seated content:

returned_assessment_title:
Structural Drift Detected

returned_assessment_body:
Observed findings indicate the current operational environment is fragmented across systems, responsibilities, review pathways, and runtime dependencies.

operational_risk_standing:
Without structured alignment:
- ambiguity compounds over time
- AI output reliability degrades
- undocumented automation expands
- review continuity weakens
- fragmented authority increases execution instability
- operational fracture risk rises as AI dependency grows

important_clarification:
There is no immediate or overnight correction for structurally fragmented environments.

continue_prompt:
Continue to Recommended Operating Protocol

---

### 6. Seat Styling Contract

Theme:

evaluation_chamber_lapis_obsidian_v1

Required seated styling content:

foundation_material:
obsidian

atmospheric_material:
lapis

geometry_tone:
silver

accent_tone:
restrained_gold

spacing_style:
architectural_negative_space

pacing_style:
chamber_progression

---

Typography:

heading_style:
institutional_serif

body_style:
operational_sans

heading_tone:
measured_authoritative

body_tone:
operational_clarity

---

Motion:

transition_style:
dissolve

atmospheric_motion:
restrained

interaction_motion:
minimal

---

Disallowed styling patterns:

- dashboard_cards
- startup_saas_ui
- neon_glow
- gamified_progress
- playful_iconography
- ecommerce_pricing_grid
- floating_widget_ui

---

### 7. Seat Icon Contract

Required seated icon roles:

assessment_icon:
clipboard_check

warning_icon:
triangle_alert

relation_icon:
network

governance_icon:
shield

continuation_icon:
arrow_right

visibility_icon:
scan_search

Recommended implementation may use Lucide icons mapped to seated icon roles.

Cody may not freestyle icon selection.

---

## CODY ROLE

Cody may:

- seat encounter contract
- seat styling contract
- bind media roles
- implement one-question pacing
- render seated assessment content
- map seated icon roles
- record resolved media paths in OAR1

Cody may not:

- invent missing copy
- alter styling contract
- create email delivery
- create reserve seat
- alter protocol pricing
- replace seated assets
- infer unseated route logic

---

## VALIDATION

Resolved when:

- assessment encounter contract is seated
- styling contract is seated
- media roles resolve to bucket assets
- 5 questions and 15 answers are seated
- icon roles are mapped
- returned assessment content is seated
- evaluation renders from seated state only
- Cody records resolved media mappings in OAR1

## EXPECTED OAR1

docs/oar/measures_registry/oar1_measures_registry_evaluation_encounter_contract_v2.meta.md
