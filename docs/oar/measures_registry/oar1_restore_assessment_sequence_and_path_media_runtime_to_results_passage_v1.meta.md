---
document_type: oar1
authority_level: closeout
document_scope: frontend_runtime_correction
title: OAR1 — Restore Assessment Sequence + Path Media Runtime to Results Passage
status: browser_qa_pending
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_restore_assessment_sequence_and_path_media_runtime_to_results_passage_v1.meta.md
final_seat_standing: held_browser_qa
---

# OAR1 — Restore Assessment Sequence + Path Media Runtime to Results Passage v1

## Closeout

```yaml
closeout:
  status: browser_qa_pending
  db_migration_applied: true
  renderer_updated: true
  css_updated: true
  cloudflare_build: triggered
  commit: ad99eec
  branch: measures
  final_seat_standing: held_browser_qa
```

---

## DB State Before Execution

Queried from `measures_encounter_def` (encounter_key = `measures_assessment`) and `measures_media_map` per db_first_runtime_execution_rule_v1.

```yaml
assessment_mechanics.questions: 7 operational questions (no AI Deployment Status)
assessment_mechanics.required_question_count: 7
post_assessment_contact_form.fields: 8 fields (institution_name, contact_name, contact_email,
  organization_type, role_title, website, ai_deployment_status, next_support_question)
path_choice_media:
  left_hero_fracture: seated (measures-registry/left_hero_fracture.webp)
  left_hero_fracture_motion: seated (measures-media/left_hero_fracture_motion.mp4)
  right_measured_hero: seated (measures-registry/right_measured_hero.webp)
  measured_hero_motion_graphic: seated (measures-media/right_measured_hero_motion_graphic.mp4)
  path_choice_background: held (asset absent from bucket)
renderer_gap: confirmed in media_contract — RegisteredPathChoice had no video slots
src_capture_step: present in PublicAssessmentSurface.tsx but never reachable (dead code)
results_navigation: immediate navigate("obsidian_to_marble_passage_video") after contact submit
```

---

## Route 1 — Path Choice Media

### Findings

Motion assets confirmed seated. Renderer gap was explicit in `evaluate_structure_path.media_contract.renderer_gap`:
> "renderPathChoiceSurface() consumes only path_choice_background (CSS variable). No left/right video or still slots exist in the renderer."

The runtime already resolved `thresholdLeftMotionUrl` and `thresholdRightMotionUrl` from DB but did not pass them to `RegisteredPathChoice`.

### Fix

`RegisteredPathChoice.tsx`:
- Added `leftMotionUrl: string | null` and `rightMotionUrl: string | null` props
- Added internal `leftSettled` / `rightSettled` state
- Each route plate renders `<video autoPlay muted playsInline>` from the seated motion URL
- On `onEnded`: `settled` flag set to true → plate renders still image (`<img>`) from seated still URL
- Motion-to-still transition complete from seated DB records only

`MeasuresRegistryRuntimeRegistered.tsx`:
- `thresholdLeftMotionUrl` and `thresholdRightMotionUrl` now passed to `RegisteredPathChoice`

```yaml
left_motion_role: left_hero_fracture_motion
left_still_role: left_hero_fracture
right_motion_role: measured_hero_motion_graphic
right_still_role: right_measured_hero
hardcoded_media: false
```

---

## Route 2 — Assessment Contract Restoration

### Findings

AI Deployment Status was seated in `post_assessment_contact_form.fields` as a `select` type field — wrong location per approved contract.

7 operational questions existed in `assessment_mechanics.questions`. Approved contract: Q1 = AI Deployment Status, Q2–Q8 = 7 operational questions. Total = 8.

### Fix — Migration

`202606230005_restore_assessment_sequence_and_correct_contact_capture.sql`:

- Prepended AI Deployment Status as Q1 with 4 options and contextual condition_tags (`ai_active_deployment`, `ai_deployment_preparing`, `ai_deployment_exploring`, `ai_deployment_unknown`)
- These tags do not appear in `condition_severity` map — scoring logic unaffected
- Updated `required_question_count` from 7 to 8
- Updated `oar1_payload_schema.action.question_count` from 7 to 8

### Fix — Frontend

`MeasuresRegistryRuntimeRegistered.tsx`:
- `PUBLIC_ASSESSMENT_EXPECTED_QUESTION_COUNT` updated from 7 to 8

### DB State After

```yaml
assessment_mechanics.questions: 8 (Q1 ai_deployment_status + Q2-Q8 operational)
assessment_mechanics.required_question_count: 8
Q1: ai_deployment_status — "What is your organization's current AI deployment status?"
Q2: ai_output_review_pathway
Q3: active_ai_system_visibility
Q4: failure_traceability
Q5: persistent_review_standard
Q6: safe_ai_acceleration_capacity
Q7: role_authority_boundary
Q8: implementation_boundary
```

---

## Route 3 — Stale Assessment Removal

### Findings

`evalStep === "src_capture"` branch was present in `PublicAssessmentSurface.tsx` but unreachable — `evalStep` starts at `"diagnostic"` and only transitions to `"contact_capture"` after scoring. No path set `evalStep = "src_capture"` in the registered runtime.

### Fix

Removed `evalStep === "src_capture"` rendering block from `PublicAssessmentSurface.tsx`.
Removed associated `visibleSrcFields`, `srcFieldLabels`, `srcFieldTypes` variables.
Removed `srcIntakeContract` prop from `PublicAssessmentSurfaceProps` and `RegisteredPublicAssessment` pass-through.

---

## Route 4 — Contact Capture Correction

### Findings

`post_assessment_contact_form.fields` contained 8 fields. OAR2 approved list:
name, email, organization, role/title, consent only.

Fields removed: `ai_deployment_status` (moved to Q1), `website`, `next_support_question`, `organization_type`.

### Fix — Migration

Same migration as Route 2 (`202606230005`):

```sql
WHERE field->>'field_key' NOT IN (
  'ai_deployment_status', 'website', 'next_support_question', 'organization_type'
)
```

### DB State After

```yaml
post_assessment_contact_form.fields: 4 fields
  - institution_name (Institution / Organization Name, required)
  - contact_name (Contact Name, required)
  - contact_email (Email, required)
  - role_title (Your Role / Title, required)
consent_fields: unchanged (assessment_result_email_consent, assessment_boundary_acknowledgment)
```

---

## Route 5 — Viewport Containment

Added to `assessment.css`:

```css
/* contact_contract: scrollable form container with max-height bound */
[data-layout-contract="contact_contract"] .registry-iis-eval-form.registry-contact-capture {
  max-height: calc(100svh - header - padding);
  overflow-y: auto;
}

/* passage video: bounded to viewport height */
.registry-diagnostic-passage > video {
  max-height: calc(100svh - header - 6rem);
  object-fit: contain;
}
```

Preserves existing assessment containment. Footer visible on all surfaces.

---

## Route 6 — Results Orientation Boundary

### Findings

After contact capture submission, `setEvalSubmitted(true)` and `navigate("obsidian_to_marble_passage_video")` were called together in the same handler. React batched the updates and rendered the passage video — `PublicAssessmentResult` was never shown.

### Fix

`MeasuresRegistryRuntimeRegistered.tsx`:
- Removed `navigate("obsidian_to_marble_passage_video")` from the contact submission handler
- `setEvalSubmitted(true)` now renders `PublicAssessmentResult` within the assessment surface
- `onBeginPathwayReview` (CTA button in results screen) remains wired to `navigate("obsidian_to_marble_passage_video")`

### Corrected Sequence

```yaml
before: assessment → contact_capture → [navigate immediately] → obsidian_to_marble_passage → MAP
after:  assessment → contact_capture → assessment_results_orientation → [user clicks CTA] → obsidian_to_marble_passage → MAP
```

---

## Files Changed

```yaml
commit: ad99eec
branch: measures
new_files:
  - supabase/migrations/202606230005_restore_assessment_sequence_and_correct_contact_capture.sql
modified_files:
  - src/measures_registry/registered_runtime/renderers/RegisteredPathChoice.tsx
  - src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
  - src/measures_registry/PublicAssessmentSurface.tsx
  - src/measures_registry/registered_runtime/renderers/RegisteredPublicAssessment.tsx
  - src/measures_registry/registered_runtime/styles/encounters/assessment.css
```

---

## Browser QA

```yaml
status: pending
trigger: Cloudflare Pages build from commit ad99eec
verify:
  route_1_path_choice:
    - left plate: motion video plays (left_hero_fracture_motion.mp4)
    - left plate: transitions to still (left_hero_fracture.webp) on video end
    - right plate: motion video plays (right_measured_hero_motion_graphic.mp4)
    - right plate: transitions to still (right_measured_hero.webp) on video end
    - balanced threshold presentation maintained
  route_2_assessment:
    - Q1 renders: "What is your organization's current AI deployment status?"
    - Q1 has 4 options (already using, preparing, exploring, not sure)
    - Q2-Q8 are the 7 operational environment questions
    - progress bar shows 1 of 8 on Q1
    - assessment completes after Q8
  route_3_stale_removal:
    - src_capture step never appears
    - no identity pre-form before questions
  route_4_contact_capture:
    - contact form shows 4 fields only: institution name, contact name, email, role/title
    - no AI deployment status field in contact form
    - no website or next_support_question fields
    - consent checkboxes present
  route_5_containment:
    - passage media fits laptop viewport (no scroll to reach continue)
    - contact form fits laptop viewport (scrolls internally if needed)
    - footer visible on all surfaces
  route_6_results_orientation:
    - after contact submission: assessment results screen renders (not immediate passage video)
    - results show: assessment title, findings, recommended actions
    - "Begin Pathway Review" CTA navigates to obsidian_to_marble_passage_video
    - passage then routes to MAP
```

---

## Final Standing

```yaml
repair_standing: browser_qa_pending
db_migration_applied: true
renderer_deployed: true
assessment_boundary_preserved: true
map_unchanged: true
payment_unchanged: true
final_seat_standing: held_browser_qa

seat_advancement:
  current: held_browser_qa
  requires:
    - Cloudflare Pages build completes (commit ad99eec)
    - browser QA passes on Routes 1-6
```
