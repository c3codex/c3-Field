# OAR2 — Measures Registry Evaluation Encounter Contract v1

## OBSERVED

The evaluation chamber cannot proceed as a page-level frontend refinement.

It requires encounter seating so evaluation content, media, styling, interaction, and returned assessment structure resolve from registered state.

Prior runtime direction was incomplete because it did not fully define the encounter contract.

---

## ALIGNED

Authority order remains:

Codex → Field → Measures → OAR2 → Chazz → Cody → src

Frontend renders seated encounter state only. Cody executes from OAR2 only.

This OAR2 stops at returned assessment and styling contract.

Not included:

- email delivery
- protocol continuation
- reserve seat
- payment surface

---

## ROUTED

### 1. Seat Evaluation Encounter Contract

Encounter key:

`measures_ai_operational_evaluation`

Renderer:

`measures_registry_evaluation_chamber`

Theme:

`evaluation_chamber_lapis_obsidian_v1`

Required contract surfaces:

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

`measures-registry`

Required media roles:

- `lapis_background`
- `registry_watermark`
- `registry_mark`
- `evaluation_reference_image`

Cody must bind each media role to the existing uploaded bucket asset path and record resolved paths in OAR1.

Do not require filename changes.

---

### 3. Seat Evaluation Content

Seat the approved 5-question / 3-answer evaluation content.

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

`Structural Drift Detected`

Returned assessment copy:

Observed findings indicate the current operational environment is fragmented across systems, responsibilities, review pathways, and runtime dependencies.

Current standing suggests AI optimization efforts are occurring within an unstable operational environment.

Findings beneath standing:

- Fragmented Operational Procedures
- Undefined Role Assignments
- System Environment Inconsistency
- Unbounded Automation Exposure

Include:

- Operational Risk Standing
- Important Clarification
- Continue to Recommended Operating Protocol prompt placeholder

Do not implement email, protocol, reserve seat, or pricing in this OAR2.

---

### 6. Seat Styling Contract

Theme:

`evaluation_chamber_lapis_obsidian_v1`

Atmosphere:

- obsidian foundation
- lapis atmospheric field
- silver registry geometry
- restrained gold accents
- architectural spacing
- chamber pacing

Typography:

- institutional serif headings
- clean operational sans body

Icon contract:

Use a restrained operational icon subset only.

Allowed icon functions:

- assessment
- warning
- system relation
- governance
- continuation
- visibility

Recommended implementation may use Lucide icons mapped to seated icon roles.

Cody may not freestyle icon selection.

Disallowed styling:

- dashboard cards
- SaaS pricing grids
- neon glow
- playful icons
- emoji behavior
- startup UI patterns
- gamified progress behavior

---

## CODY ROLE

Cody may:

- seat encounter contract
- bind existing bucket assets to media roles
- seat questions and answers
- implement one-question pacing
- render returned assessment
- apply styling contract
- record resolved media paths in OAR1

Cody may not:

- invent missing copy
- rename bucket files unnecessarily
- create email delivery
- create protocol continuation
- create reserve seat
- alter pricing
- replace seated assets
- infer unseated route logic

---

## VALIDATION

Resolved when:

- encounter contract exists
- media roles resolve to bucket paths
- 5 questions and 15 answers are seated
- evaluation renders one question at a time
- Continue progression works
- returned assessment renders distinctly
- styling matches lapis/obsidian/silver direction
- Cody records resolved media mappings in OAR1

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_measures_registry_evaluation_encounter_contract_v1.meta.md`
