---
document_type: architecture_contract
authority_level: working
document_scope: measures_interoperability
title: Measures Registry — Chamber Surface Style Contract v1
status: seated
version: v1
operator: op044
date: 2026-05-28
source_oar2: docs/oar/measures_interoperability/oar2_measures_registry_material_styling_contract_seating_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - architecture-contract
  - measures-registry
  - chamber-surface-style
  - material-styling
  - codexstone
layer: second
---

# Measures Registry — Chamber Surface Style Contract v1

## Contract Purpose

The Chamber Surface Style Contract defines the surface-level style for each DB-anchored encounter surface in the Measures Registry installation: header/eyebrow treatment, body layout, CTA and navigation style, state indicators, and surface transitions.

This contract governs what each surface looks like at the layout and element level. It does not implement CSS.

CSS implementation is not authorized by this contract.

## Surface Style Definitions

### Epigraph Surface (`landing_root` / `ai_isnt_broken_intro`)

**Surface type:** Opening encounter — pre-material

**Header / Eyebrow:**
- No eyebrow — Epigraph opens without category label
- Title: display scale, restrained weight, full-field centered or left-aligned
- No subtitle at opening — title holds the field alone

**Body layout:**
- Minimal text field — one or two declarative sentences
- Dark institutional field — content floats in space
- No grid complexity at opening

**CTA / Navigation:**
- Single entry gesture — forward to Temple
- No multiple CTAs
- No intake form

**State indicators:** None — Epigraph has no state

**Transition:**
- Forward to Temple Path surface on visitor action
- Entry: fade in — under 400ms
- Exit: restrained directional transition

---

### Temple Path Surface (`landing_path_choice` / `evaluate_structure_path`)

**Surface type:** Branching — path choice

**Header / Eyebrow:**
- Eyebrow: "MEASURES REGISTRY" or "CHOOSE YOUR PATH" — tracked small caps
- Title: formal, balanced — neither path is the headline

**Body layout:**
- Two-panel or side-by-side card treatment — equal visual weight
- Left card: Assess the Environment
- Right card: Structure the Environment
- Each card: title, brief description, entry CTA
- No visual hierarchy favoring one card

**CTA / Navigation:**
- Left: "Assess the Environment" → Lapis Relational surface
- Right: "Structure the Environment" → Media Passage surface
- CTAs are equal in visual treatment — same scale, same weight

**State indicators:** None at branching — visitor has not yet been assessed

**Transition:**
- Left selection → Lapis Relational fade-in
- Right selection → Media Passage cinematic entry

---

### Lapis Relational Surface (`educational_diagnostic_passage` / `eval_passage`)

**Surface type:** Relational orientation — Left Path entry

**Header / Eyebrow:**
- Eyebrow: "MEASURES REGISTRY" or section identifier
- Title: orienting statement — relational, not diagnostic
- Subtitle: connector line to c3 MAP explanation

**Body layout:**
- Editorial multi-column — layered content panels
- c3 MAP explanation section
- About Measures Registry lateral link
- Structural Drift / Paragraph lateral link
- Contact / Connect surface entry
- Subscription invitation — understated, not conversion-pressure
- c3 Field support adjacency — understated

**CTA / Navigation:**
- Primary: forward to c3 MAP / connect_src
- Secondary: lateral — About, Structural Drift, Contact, Subscription, Support
- No urgency on primary CTA

**State indicators:** None at orientation

**Transition:**
- Forward to Crystal/Lapis c3 MAP surface
- Lateral surfaces transition to their own surface context
- Return transitions return visitor to Lapis Relational without forced re-entry to assessment

---

### Crystal/Lapis c3 MAP Surface (`connect_src`)

**Surface type:** Recognition and SRC intake — pre-gate

**Header / Eyebrow:**
- Eyebrow: "C3 MAP" or "MEASURES ASSESSMENT PROTOCOL"
- Title: Measures Assessment Protocol explanation
- Subtitle: pattern visibility statement

**Body layout:**
- Explanation section: c3 MAP defined — not priced
- Pattern diagram: geometric, audit-dashboard clarity
- SRC intake form below explanation:
  - institution_name
  - institution_type
  - contact_name
  - contact_email
- No pricing indicators near intake form

**CTA / Navigation:**
- Submit SRC intake → Obsidian Assessment Gate
- No secondary path that bypasses intake

**State indicators:**
- Form validation states — governed (required field, format)
- No standing display before assessment

**Transition:**
- On SRC submission → Obsidian Assessment Gate entry
- Entry to assessment is visually distinct — obsidian field replaces crystal-lapis overlay

---

### Obsidian Assessment Gate Surfaces (`measures_ai_operational_evaluation` / `iis_eval_gate1` / `measures_assessment`)

**Surface type:** 7-question diagnostic gate

**Header / Eyebrow:**
- Eyebrow: "AI ENVIRONMENT READINESS ASSESSMENT" or governed label
- Title: question statement for current question
- Progress indicator: "Question N of 7" — restrained, numbered

**Body layout:**
- Focused single-column layout — question-forward
- Answer options: clear selection treatment — no gaming conventions (no highlighting correct answer)
- No side panels — assessment holds focus

**CTA / Navigation:**
- Next question / Submit answer — single forward action per question
- No back-editing unless governed by assessment contract
- No visible route ahead of current question

**State indicators:**
- Progress: "N of 7" — numerical only, no trophy or completion styling
- Standing indicator after completion only — governed by `EnvironmentalStandingReport`
- No interim standing display during assessment

**Transition:**
- Question-to-question: restrained slide or fade — state-driven
- On assessment completion → `measures_phases_reveal` (Marble surface)
- No celebration on completion — standing display is informational

---

### Marble Commerced Circuit Surfaces (`measures_phases_reveal` / `about_measures_registry` / `reserve_seat` / `phase_payment`)

**`measures_phases_reveal` — Standing Result Display**

**Header / Eyebrow:**
- Eyebrow: "ENVIRONMENTAL STANDING" or governed label
- Title: `EnvironmentalStandingReport` standing label
- Subtitle: recommended structured action

**Body layout:**
- Standing result panel — marble surface, formal weight
- Phases/circuit reveal sections — DB-driven from encounter metadata
- No activation state until delivery contract

**CTA:** Forward to `about_measures_registry`

---

**`about_measures_registry` — Marble Authority Surface**

**Header / Eyebrow:**
- Eyebrow: "ABOUT MEASURES REGISTRY"
- Title: "A registered environment for governing AI behavior."
- Subtitle: operator-seated

**Body layout:**
- Primary statement panel — approved_content_contract.primary_statement
- Support points list — approved_content_contract.support_points
- No pricing, no circuit activation

**CTA:**
- Primary: structural_drift_dispatches
- Secondary: continue in circuit

---

**`reserve_seat` — Seat Offering Intake**

**Header / Eyebrow:**
- Eyebrow: "RESERVE YOUR SEAT" or governed label
- Title: offering context

**Body layout:**
- SeatOfferingRow cards — one per offering
- Enrollment state displayed: open / coming_soon / held / closed
- No activation styling for held or closed offerings

**CTA:**
- Open offerings: proceed to hold surface
- Coming soon / held / closed: no active CTA

**State indicators:** Enrollment state label — precise, not urgent

---

**`phase_payment` — Delivery Contract Payment**

**Header / Eyebrow:**
- Eyebrow: "PAYMENT" or governed label
- Title: delivery contract context

**Body layout:**
- Payment surface — activated only after confirmed seat hold
- No payment UI rendered without delivery contract condition
- Placeholder styling applies until payment OAR2

**CTA:** Governed by delivery contract (placeholder until payment OAR2)

---

### Right Path Media Passage Surface (`structure_passage`)

**Surface type:** Structure-path media carrier

**Header / Eyebrow:**
- Eyebrow: "HOW DOES A STRUCTURED ENVIRONMENT OPTIMIZE AI PERFORMANCE?" or governed title
- Title: DB-driven from encounter metadata

**Body layout:**
- Cinematic media frame — full or near-full field video
- Institutional captioning — below or overlay, restrained
- Mute control — visitor-controlled
- Continue button — always present as skip path

**CTA / Navigation:**
- Auto-advance on video end → `structured_eval`
- Continue button → `structured_eval`
- No inline assessment or pricing

**State indicators:** Video progress indicator — restrained

**Transition:**
- On video end or continue → Marble Governance surface entry

---

### Marble Governance Surfaces (`structured_eval` / `cohort_conversion_encounter` / `c3_field`)

**`structured_eval` — Marble Governance Entry**

**Header / Eyebrow:**
- Eyebrow: "STRUCTURE THE ENVIRONMENT" or governed label
- Title: architecture pathway statement

**Body layout:**
- Contract-forward card layout — marble-lapis governance surface
- Architecture pathway modules — structured, buildable
- Cohort/conversion readiness indicators — no implementation implied
- No circuit activation styling

**CTA:** Governs routing to Lapis Interoperability

---

**`cohort_conversion_encounter` — Cohort Routing Surface**

**Body layout:**
- Cohort group information — pending delivery contract
- Placeholder styling until cohort delivery contract is seated
- No active enrollment display without delivery contract

**CTA:** Held pending delivery contract and operator confirmation

---

**`c3_field` — c3 Field Connection Surface**

**Body layout:**
- c3 Field system connection information
- Outward connection — Lapis Interoperability route
- Support adjacency

**CTA:** c3 Field route — governed

---

### Lapis Interoperability Surfaces (`cohort_conversion_encounter` / `c3_field` / `reserve_seat`)

**Surface type:** Continuation and connection

**Header / Eyebrow:**
- Eyebrow: "CONTINUE" or route-context label
- Title: continuity context

**Body layout:**
- Connective lapis route map — nodes and relation lines
- Continuity cards: Email (future), Subscription (future), Social (future), Support, c3 Field
- Future surfaces rendered as placeholder cards — no active styling

**CTA / Navigation:**
- Active routes: c3 Field, Support, reserve_seat convergence
- Placeholder routes: Email, Subscription, Social — no active CTA before future OAR2

**State indicators:**
- Placeholder label on future surfaces — "coming soon" or equivalent governed label
- No automation-active indicators before future OAR2

**Transition:**
- Forward routes governed by relation and contract
- No forced terminal styling — Lapis Interoperability connects, not closes

---

## Surface Style Boundary

This contract governs surface-level style definitions.

It does not authorize:
- CSS component implementation
- Runtime file modification
- Design file production
- DB mutation

CSS implementation waits for its implementation OAR2.

## Close

Chamber surfaces express material state.
Style follows contract.
CSS waits.
Codex holds.
