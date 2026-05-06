# OAR2 — Educational Diagnostic Passage + Codex Publication Surface
**System:** measures_registry
**Status:** approved_for_execution
**Scope:** left_path_threshold_refactor_only
**Intent:** Move the explainer video into a dedicated passage encounter, refactor the evaluation page into a diagnostic/education/intake chamber, and add a Codex-seated Measures Registry publication surface.

---

# Objective

Separate recognition media from operational evaluation.

The explainer video should function as a passage, not dominate the evaluation page.

The evaluation page should become a stabilized educational diagnostic surface with Codex-seated publication support and visible evaluation entry.

---

# Required Flow

Current:

`landing_split_hero`
? `educate_eval_encounter`

Replace with:

`landing_split_hero`
? `educational_diagnostic_passage`
? `educate_eval_encounter`

---

# 1. Create Educational Diagnostic Passage

Create encounter:

`educational_diagnostic_passage`

Purpose:
- recognition threshold
- explainer transition state
- passage into evaluation chamber

Seat existing 45-second explainer video as passage media only.

Behavior:
- autoplay with sound enabled where browser allows
- inline playback
- minimal chrome
- auto-advance to `educate_eval_encounter` after playback completion
- provide subtle fallback CTA: `Continue to Evaluation`

---

# 2. Refactor educate_eval_encounter

Remove the explainer video entirely from `educate_eval_encounter`.

The page should prioritize:
- diagnostic recognition text
- featured Codex publication/resource
- educational links/resources
- publication subscription entry
- evaluation CTA/intake entry

The surface must not behave as a passive video page.

---

# 3. Featured Codex Publication Resource

Seat “Agents of Chaos” as the featured Measures Registry publication/resource.

Use media:

`paragraph_agents_of_chaos.webp`

Do not treat Paragraph as a generic embedded blog feed.

Seat as Codex/Measures Registry publication context with support for:
- title
- subtitle/description
- featured image
- publication URL
- source: Paragraph
- publication handle/context
- registry relevance
- subscription availability

---

# 4. Measures Registry Publication Subscription

Add subscription CTA surface to `educate_eval_encounter`.

Acceptable CTA language:
- `Subscribe to Measures Registry`
- `Receive Registry Dispatches`

This should support future registry-only publication flow.

This may also be considered later for right-path conversion surfaces, but do not modify right-path in this pass.

---

# 5. Educational Resources

Retain bounded educational resources.

They should support diagnostic understanding and credibility.

Do not render as:
- blog wall
- endless feed
- generic content list

---

# 6. Evaluation Entry

Evaluation remains primary operational action.

CTA:
`Begin Evaluation`

The page must make evaluation access obvious after diagnostic framing and publication context.

---

# 7. Path Hero Finalization

Apply minor calibration only to `landing_split_hero`:
- tighten text placement slightly inward toward center divide
- improve CTA hierarchy
- preserve divide visibility
- preserve motion-to-still behavior
- no structural redesign

---

# Scope Lock

Do NOT modify:
- epigraph
- right-path conversion flow
- Phase Map
- Measures of Inanna runtime
- DB schema unless strictly required
- institutional conversion systems
- unrelated routing contracts

This OAR applies only to:
- left-path passage introduction
- educate_eval_encounter refactor
- Codex publication/resource seating
- publication subscription CTA
- minor path hero calibration

---

# Validation

Confirm:
- left path routes through `educational_diagnostic_passage`
- passage video autoplays where allowed
- passage auto-advances after completion
- fallback `Continue to Evaluation` works
- explainer video no longer appears on `educate_eval_encounter`
- Agents of Chaos publication block renders
- subscription CTA renders
- educational resources remain bounded
- evaluation CTA remains obvious
- hero calibration renders correctly
- no unrelated surface drift occurs
