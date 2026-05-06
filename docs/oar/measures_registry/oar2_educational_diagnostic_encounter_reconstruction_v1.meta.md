# OAR2 — Educational Diagnostic Encounter Reconstruction
**System:** measures_registry
**Surface:** educate_eval_encounter
**Status:** approved_for_execution
**Scope:** diagnostic_surface_only
**Intent:** Reconstruct the left-path educational diagnostic surface into a functional institutional recognition and evaluation threshold.

---

# Objective

Transform `educate_eval_encounter` from a passive media page into an operational diagnostic intake surface.

The surface must guide institutions through:
- recognition
- contextual understanding
- educational grounding
- evaluation entry

This is not a browsing surface.

It is a structured diagnostic threshold for institutions already experiencing instability, ambiguity, or unverifiable AI system behavior.

---

# Existing Surface Problem

Current implementation behaves as:
- passive video playback
- weak directional structure
- buried evaluation action
- insufficient contextual framing
- no meaningful progression from education ? evaluation

The surface currently lacks operational sequencing.

---

# Required Surface Structure

The surface must resolve into four functional sections in this order:

---

# 1. Explainer Threshold

## Primary Asset

Seat and render:
- 45-second explainer video

Requirements:
- autoplay with sound enabled
- inline playback
- lightweight chrome
- maintain cinematic presentation quality
- preserve responsive scaling

The video is the opening recognition layer.

It should immediately frame:
- instability
- ambiguity
- environmental failure
- unresolved AI propagation conditions

---

# 2. Diagnostic Recognition Block

Immediately following the explainer video:

## Purpose

Provide institutional recognition framing.

The paragraph must:
- stabilize interpretation
- explain environmental consequence
- avoid marketing language
- avoid exaggerated futurism
- direct toward evaluation

Tone:
- measured
- institutional
- diagnostic
- grounded

---

# 3. Educational Link Surface

Provide structured educational resource access.

## Supported Resource Types

- Paragraph essays
- institutional writeups
- diagnostic explainers
- governance primers
- conversion context resources

These should function as:
- supporting context
- optional depth
- credibility reinforcement

NOT:
- content feed
- blog wall
- endless scroll

---

# 4. Evaluation Entry

## Primary CTA

The evaluation action must become visually primary and operationally obvious.

Move away from:
- nav-level CTA placement
- passive link treatment

The evaluation entry should clearly indicate:
- structured institutional assessment
- AI environment review
- operational diagnostic intake

---

# Evaluation Contract

Evaluation flow must support institutional intake fields including:

Institution:
- organization name
- organization address
- organization phone

Contact:
- name
- role/title
- email

Evaluation framing should identify:
- AI usage scope
- deployment duration
- website/system structure condition
- witnessed instability or ambiguity
- implementation gaps
- governance absence indicators

Evaluation is diagnostic and non-exhaustive.

---

# Layout Contract

The surface should feel:
- structured
- operational
- guided
- institutional

Avoid:
- generic SaaS layouts
- blog aesthetics
- oversized padding voids
- floating marketing cards
- decorative sections

---

# Typography + Visual Tone

Typography should:
- stabilize interpretation
- reinforce seriousness
- maintain readability against media surfaces

Visual treatment should:
- continue the Measures Registry environmental language
- preserve coherence/failure semantics
- remain restrained and institutional

---

# Responsive Contract

Desktop and mobile must preserve:
- sequence clarity
- CTA visibility
- evaluation access
- readable educational structure

Mobile must NOT collapse into:
- stacked clutter
- oversized media dominance
- hidden evaluation entry

---

# Technical Contract

Support DB/runtime seating for:
- explainer video
- educational article links
- diagnostic text
- evaluation entry state

Prefer DB-driven rendering contracts over frontend hardcoding where existing architecture supports it.

---

# Scope Lock

Do NOT modify:
- epigraph surface
- landing threshold hero
- right-path conversion surface
- Phase Map
- Measures of Inanna runtime
- DB schema unless strictly required
- institutional conversion systems
- routing contracts outside evaluation flow

This OAR applies only to:
`educate_eval_encounter`

---

# Files Expected

Likely affected:

- `src/measures_registry/MeasuresRegistryRuntime.tsx`
- diagnostic/evaluation encounter rendering
- educational resource rendering
- evaluation CTA layout/styling
- responsive encounter styling

---

# Validation

Confirm:
- explainer video renders correctly
- autoplay with sound functions correctly
- diagnostic text stabilizes immediately after media
- educational resources render correctly
- evaluation CTA becomes primary and obvious
- mobile preserves sequence integrity
- no passive-video-only behavior remains
- evaluation routing remains functional
- no unrelated surface drift occurs
