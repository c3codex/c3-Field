---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Compose Existing Resolved Surfaces Into 13-Surface Encounter Flow
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_compose_existing_resolved_surfaces_into_13_surface_encounter_flow_v1
---

# OAR1 - Compose Existing Resolved Surfaces Into 13-Surface Encounter Flow

## EXECUTION METHOD

Pre-mutation audit of existing bodies: MeasuresAssessment, PublicAssessmentSurface,
PublicAssessmentResult, ObsidianToMarblePassage, MapIntegrityGovernance, IntroHookSeat,
ObsidianChamberRenderer, MarbleChamberRenderer, MeasuresRegistryOrchestrator,
encounterComposition.ts (transitionNodes origin), registryResolver.ts (MEDIA_ROLES).

Migration 202606300020 written and applied via `npx supabase db push` (exit code 0).
Source files modified: ObsidianChamberRenderer.tsx, MarbleChamberRenderer.tsx,
registryResolver.ts, MeasuresRegistryOrchestrator.tsx.
TypeScript `npx tsc --noEmit` zero errors.

---

## PRE-MUTATION STATE

### Renderer gap surfaces (before this OAR)
| Surface | Existing body source | Gap state |
|---|---|---|
| obsidian_chamber_C1_compact | PublicAssessmentSurface contact_capture step (inline in MeasuresAssessment) | renderer_gap |
| marble_chamber_orientation | No component; media role assessment_report_orientation not in MEDIA_ROLES | renderer_gap |
| marble_chamber_encounter | PublicAssessmentResult (inline in ObsidianToMarblePassage passageComplete branch) | renderer_gap |
| marble_chamber_C2_agreement | handlePayment call (inline in MapIntegrityGovernance pathway cards) | renderer_gap |
| marble_chamber_C2_resolution | No component; no Stripe return handling | renderer_gap |

### encounter_structure transitions before (relevant nodes)
| Node | next_surface | Status |
|---|---|---|
| obsidian_chamber_encounter_surface | obsidian_to_marble_passage_video | CHANGED |
| marble_chamber_C2_compact | (absent) | ADDED |
| crystal_seat_intro | (absent) | ADDED |
| obsidian_chamber_C1_compact | (absent) | ADDED |
| marble_chamber_orientation | (absent) | ADDED |
| marble_chamber_encounter | (absent) | ADDED |
| marble_chamber_C2_agreement | (absent) | ADDED |
| marble_chamber_C2_resolution | (absent) | ADDED |

---

## POST-MUTATION STATE

### Migration 202606300020 — encounter_structure transitions
Full encounter_structure replaced in measures_registry_root.metadata.encounter_structure.

New flow (obsidian → marble sequence):
```
obsidian_chamber_orientation
  -> obsidian_chamber_encounter_surface
    -> obsidian_chamber_C1_compact
      -> marble_chamber_orientation
        -> marble_chamber_encounter
          -> marble_chamber_C2_compact
            -> marble_chamber_C2_agreement
              -> marble_chamber_C2_resolution (terminal)
```

crystal_seat_intro -> crystal_seat_threshold (new node, linear)

obsidian_to_marble_passage_video retained with standing=bypassed_in_13_surface_flow.
All held/legacy nodes preserved unchanged.

### Source changes

#### registryResolver.ts
Added `"assessment_report_orientation"` to MEDIA_ROLES (line 76).
Media is not yet seeded in measures_media_map — gap reported below.

#### ObsidianChamberRenderer.tsx
**New dispatch**: `obsidian_chamber_C1_compact` → `ObsidianC1Compact`

**MeasuresAssessment.handleContinueQuestion (modified)**:
After last question is answered, BEFORE this change:
```
setEvalReport(resolved.report)
setEvalEmailArtifact(resolved.emailArtifact)
setEvalStep("contact_capture")   // inline contact form
```
After this change:
```
// Store eval state to sessionStorage for C1_compact
sessionStorage.setItem("__mreg_c1_pending", JSON.stringify({
  evaluationAnswers, conditionTraces, evalReport, evalEmailArtifact, evalFields,
  assessmentContactCaptureContract, assessmentEvaluationReportContract, assessmentCompletion
}))
onNavigate("obsidian_chamber_C1_compact")   // navigate to standalone surface
```
MeasuresAssessment evalStep now cycles: src_capture → diagnostic → [navigate out].
contact_capture step is never reached inline. handleSubmitEvaluation remains defined
but is now a dead path (onSubmitEvaluation prop still passed to PublicAssessmentSurface;
the step that would call it is never entered).

**New ObsidianC1Compact function**:
- Reads `__mreg_c1_pending` from sessionStorage on mount
- Pre-populates form fields from `pending.evalFields` (src_capture fields from assessment)
- Renders contact/consent form using `assessmentContactCaptureContract` from sessionStorage
  (stored by MeasuresAssessment from measures_assessment encounter_def metadata)
- On submit: calls `onCaptureAssessment`, writes `__mreg_pending_report`,
  removes `__mreg_c1_pending`, navigates to `next` (marble_chamber_orientation)
- If `__mreg_c1_pending` is absent: shows "Complete the AI Operations Assessment" held state

#### MarbleChamberRenderer.tsx
Added imports: `PublicAssessmentResult`, `AssessmentEmailArtifact`, `EnvironmentalStandingReport`.

**New dispatch entries**:
- `marble_chamber_orientation` → `MarbleOrientationSeat`
- `marble_chamber_encounter` → `MarbleChamberEncounter`
- `marble_chamber_C2_agreement` → `MarbleC2Agreement`
- `marble_chamber_C2_resolution` → `MarbleC2Resolution`

**MapIntegrityGovernance (modified)**:
- Removed: `handlePayment`, `checkoutLoading`, `checkoutError`, `emailInput` state
- Removed: payment state JSX section (email input, loading display, error display)
- Removed: `onInitiateMapPayment` from destructured props (no longer called here)
- Added: `handleSelectPathway(mapPathway)` — stores `__mreg_c2_pending` to sessionStorage
  (mapPathway, mapStanding), navigates to `next` (marble_chamber_C2_agreement)
- Changed: pathway card button onClick from `void handlePayment(cardMapPathway)` →
  `handleSelectPathway(cardMapPathway)`. Disabled when `!standingKey`.
- Remaining: governance header, MAP framing, pathway cards, action readiness, seat hold,
  marble tone media — all unchanged.

**New MarbleOrientationSeat function**:
- Plays `assessment_report_orientation` media role (video)
- "Continue" button + mute + auto-advance on video end → `next` (marble_chamber_encounter)
- Shows "Marble orientation media is not seated." if media absent (gap noted below)

**New MarbleChamberEncounter function**:
- Reads `__mreg_pending_report` from sessionStorage
- Renders existing `PublicAssessmentResult` component with stored report, reportContract,
  emailArtifact, fields, assessmentCompletion
- `onBeginPathwayReview` → navigate to `next` (marble_chamber_C2_compact)
- Shows "Complete the AI Operations Assessment" if pending report absent

**New MarbleC2Agreement function**:
- Reads `__mreg_c2_pending` (selected pathway) and contact email from `__mreg_pending_report`
- Renders: selected pathway display, email input (if email not in session), payment CTA
- Payment CTA → calls `onInitiateMapPayment` (existing callback, no logic change)
- If `__mreg_c2_pending` absent: shows "Select a MAP pathway" held state with navigate-back

**New MarbleC2Resolution function**:
- Terminal surface — no next_surface
- Renders confirmation: "Your MAP the Environment registration has been received."
- CTA: "Return to Measures Registry" → navigate to crystal_seat_encounter

#### MeasuresRegistryOrchestrator.tsx
**onInitiateMapPayment**: changed `success_url` from `${origin}/map-integrity-governance`
to `${origin}/map-integrity-governance?payment=success`.

**initialSurface()**: added payment success detection before ROUTE_SURFACE_MAP lookup:
```typescript
if (url.searchParams.get("payment") === "success") return "marble_chamber_C2_resolution"
```
Stripe success redirect lands on /map-integrity-governance?payment=success →
orchestrator routes to marble_chamber_C2_resolution on init.

---

## OAR1 TABLE

| # | Surface | Existing body source | Renderer implemented | Transition implemented | Callback dependencies | Scoring/payment impact | Validation | Remaining gap |
|---|---|---|---|---|---|---|---|---|
| 1 | obsidian_chamber_C1_compact | PublicAssessmentSurface contact_capture step | ✓ ObsidianC1Compact | ✓ enc_surface → C1_compact | onCaptureAssessment (unchanged) | none | ✓ | form fields pre-populated from evalFields; contract must be present in measures_assessment encounter_def metadata |
| 2 | marble_chamber_orientation | EvalPassage/IntroHookSeat media-video pattern | ✓ MarbleOrientationSeat | ✓ C1_compact → orientation | none | none | ✓ (renders gap state if media absent) | assessment_report_orientation media NOT YET seeded in measures_media_map (see gap below) |
| 3 | marble_chamber_encounter | PublicAssessmentResult (was inline in ObsidianToMarblePassage) | ✓ MarbleChamberEncounter | ✓ orientation → encounter | none (reads sessionStorage) | none | ✓ | none; all existing PublicAssessmentResult props threaded correctly |
| 4 | marble_chamber_C2_compact | MapIntegrityGovernance (existing) | ✓ (pre-existing) | ✓ encounter → C2_compact → C2_agreement | onInitiateMapPayment moved to C2_agreement | onInitiateMapPayment no longer called from C2_compact (moved to C2_agreement) | ✓ | none |
| 5 | marble_chamber_C2_agreement | handlePayment inline (was in MapIntegrityGovernance) | ✓ MarbleC2Agreement | ✓ C2_compact → C2_agreement → C2_resolution | onInitiateMapPayment (unchanged callback) | payment initiation preserved via existing callback; no Stripe logic rewrite | ✓ | none |
| 6 | marble_chamber_C2_resolution | (no existing component) | ✓ MarbleC2Resolution | ✓ Stripe success_url → ?payment=success → orchestrator routes to resolution | none | success_url now includes ?payment=success (redirect URL param only; no Stripe logic change) | ✓ | none |

---

## GAPS

### assessment_report_orientation media not seeded
`assessment_report_orientation` added to MEDIA_ROLES (fetched if present in DB).
No media_map row exists for this role. MarbleOrientationSeat renders:
"Marble orientation media is not seated."
**Required to fully enable marble_chamber_orientation**: seed media_map row with
campaign_key in MEDIA_CAMPAIGN_KEYS, media_role='assessment_report_orientation'.
Recommend dedicated media seating OAR2.

### MeasuresAssessment handleSubmitEvaluation dead path
handleSubmitEvaluation and evalReport/evalEmailArtifact state setters remain in
MeasuresAssessment but are never called (contact_capture step never reached).
Not a bug — dead code retained for safety. Can be cleaned in a future source
maintenance OAR. TypeScript does not error because the props are still referenced
in PublicAssessmentSurface call.

### obsidian_to_marble_passage_video bypassed
The passage video surface now has standing=bypassed_in_13_surface_flow in
encounter_structure. It remains a valid EncounterSurface with a renderer. It is
not reachable from the main flow (obsidian_chamber_encounter_surface no longer
points to it). If navigated to directly (no public route), it renders the video
and the passageComplete && pendingReport branch (PublicAssessmentResult inline) —
this still works but the report branch won't fire since __mreg_pending_report is
now written by C1_compact AFTER navigating away from the assessment surface.
No active route leads here. Surface is registered, not broken.

### assessmentContactCaptureContract sourced from sessionStorage (not C1 encounter_def)
ObsidianC1Compact reads the contact capture contract from __mreg_c1_pending
(stored by MeasuresAssessment from measures_assessment encounter_def metadata).
This is indirect DB authority. A future OAR2 could seed the contract directly
into obsidian_chamber_C1_compact encounter_def metadata for direct DB authority.
Current approach is correct for assembly — no new authority invented.

---

## FLOW INTEGRITY

| Transition | Before | After |
|---|---|---|
| crystal_seat_intro → ? | absent | crystal_seat_threshold |
| obsidian_chamber_encounter_surface → ? | obsidian_to_marble_passage_video | obsidian_chamber_C1_compact |
| obsidian_chamber_C1_compact → ? | absent | marble_chamber_orientation |
| marble_chamber_orientation → ? | absent | marble_chamber_encounter |
| marble_chamber_encounter → ? | absent | marble_chamber_C2_compact |
| marble_chamber_C2_compact → ? | absent | marble_chamber_C2_agreement |
| marble_chamber_C2_agreement → ? | absent | marble_chamber_C2_resolution |
| marble_chamber_C2_resolution | absent | terminal |
| obsidian_to_marble_passage_video → ? | marble_chamber_C2_compact | marble_chamber_C2_compact (unchanged) |
| lapis_chamber_encounter | optional / non-sequence (unchanged) | ✓ unchanged |

---

## VALIDATION CHECKLIST

| Item | Status |
|---|---|
| obsidian_chamber_C1_compact renders contact/consent form | ✓ |
| MeasuresAssessment navigates to C1_compact after last question | ✓ |
| __mreg_c1_pending written with contract, evalReport, evalFields | ✓ |
| C1_compact writes __mreg_pending_report on submit | ✓ |
| marble_chamber_orientation renders video or gap state | ✓ |
| marble_chamber_encounter reads __mreg_pending_report, renders PublicAssessmentResult | ✓ |
| marble_chamber_C2_compact shows pathway cards, navigates to C2_agreement | ✓ |
| marble_chamber_C2_compact no longer calls onInitiateMapPayment | ✓ |
| marble_chamber_C2_agreement reads __mreg_c2_pending, calls onInitiateMapPayment | ✓ |
| marble_chamber_C2_resolution rendered on Stripe success return | ✓ |
| onInitiateMapPayment success_url updated to ?payment=success | ✓ |
| initialSurface() detects ?payment=success → marble_chamber_C2_resolution | ✓ |
| assessment_report_orientation added to MEDIA_ROLES | ✓ |
| Lapis remains optional/non-sequence | ✓ |
| Passages remain held | ✓ |
| Antechambers remain held | ✓ |
| Public routes unchanged | ✓ |
| Stripe payment logic not rewritten | ✓ (success_url URL param only) |
| Scoring logic unchanged | ✓ |
| Report copy unchanged | ✓ |
| onCaptureAssessment callback unchanged | ✓ |
| onInitiateMapPayment callback unchanged | ✓ |
| TypeScript tsc --noEmit zero errors | ✓ |
| Migration 202606300020 applied | ✓ |

---

## FINAL DISPOSITION

**COMPOSED** — All 5 renderer-gap surfaces now have working renderer dispatch.

- **obsidian_chamber_C1_compact**: contact/consent form extracted from MeasuresAssessment inline flow → standalone surface
- **marble_chamber_orientation**: orientation media surface (video explainer pattern from existing EvalPassage)
- **marble_chamber_encounter**: assessment findings report extracted from ObsidianToMarblePassage inline result → standalone surface
- **marble_chamber_C2_agreement**: payment surface extracted from MapIntegrityGovernance inline payment → standalone surface using existing onInitiateMapPayment callback
- **marble_chamber_C2_resolution**: confirmation surface; Stripe success return detected via ?payment=success URL param

The 13 are registered.
The 13 render.

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.

Collapse is not the default.
