---
document_type: oar1
authority_level: launch_repair
title: OAR1 — Repair FREE Route Transitions and Assessment Completion Flow
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_repair_free_route_transitions_and_assessment_completion_flow_v1.meta.md
commit: b87e854
---

# OAR1 — Repair FREE Route Transitions and Assessment Completion Flow

## FINAL DISPOSITION

**FREE_TRANSITION_REPAIR_COMPLETE**

All three reported issues resolved. Crystal path, obsidian orientation, and assessment completion flow repaired. Build passes. Migration applied. Commit pushed.

---

## VALIDATION CHECKLIST

| Item | Status | Evidence |
|---|---|---|
| Crystal/right path no longer shows encounter unavailable | PASS | `path_choice.right.next_surface` updated to `crystal_seat_orientation_passage` (released, active) — migration `202606270002` validated by DO $$ block |
| Crystal orientation Continue navigates to about | PASS | `crystal_seat_orientation_passage.next_surface = "about_measures_registry"` seated in encounter_structure |
| Crystal orientation does not expose raw title | PASS | `StructurePassageSeat` status_note guard — "Measures Registry" neutral fallback when `status_note` includes "Seated without final public copy" |
| Left path reaches assessment through obsidian orientation | PASS | `eval_passage` surface → bridged to `obsidian_chamber_orientation_passage` registry row (migration 260006) → gate passes → `EvalPassage` renders → `transitionNodes["eval_passage"].next_surface = "measures_assessment"` ✓ |
| Obsidian orientation does not expose raw title | PASS | `EvalPassage` status_note guard — "Before evaluation, recognize the environment." fallback when unseeded |
| Assessment completion no longer redirects immediately | PASS | `if (next) onNavigate(next)` removed from `handleSubmitEvaluation` — result UI shows, user navigates via Begin Pathway Review |
| Begin Pathway Review navigates to obsidian_to_marble_passage_video | PASS | `measures_assessment.next_surface = "obsidian_to_marble_passage_video"` — `onBeginPathwayReview` calls `onNavigate(next)` after result |
| Passage Continue navigates to map_integrity_governance | PASS | `obsidian_to_marble_passage_video.next_surface = "map_integrity_governance"` seated |
| obsidian_to_marble_passage_video renders (not "encounter not available") | PASS | Registry row seated with `is_active=true, release_state="released"` — surface assignment existed (migration 009), registry row was missing, now created |
| Assessment capture still inserts | PASS | `handleSubmitEvaluation` still calls `onCaptureAssessment(payload)` — DB insert path unchanged |
| Consent not preselected | PASS | No change to evalFields defaults — consent fields default `""` → `=== "true"` → false |
| notification_state queued | PASS | Orchestrator `onCaptureAssessment` unchanged — `notification_state: "queued"` preserved |
| Email dispatch compatibility preserved | PASS | `AssessmentCapturePayload` and orchestrator insert unchanged — `structured_email_artifact` in metadata preserved |
| Build passes | PASS | `vite build` — 106 modules, 0 errors |
| No raw encounter keys rendered as public copy | PASS | Title guards in EvalPassage and StructurePassageSeat use status_note to detect and suppress unseeded display_title |
| registered_runtime not reinstated as active route authority | PASS | App.tsx import unchanged — still points to MeasuresRegistryOrchestrator |
| DB transition authority not invented in frontend | PASS | All transition nodes read from `measures_registry_root.metadata.encounter_structure` — no hardcoded fallback routing added |
| No secret values exposed | PASS | No change to env var or secret handling |
| No consent behavior changes | PASS | evalFields state initialization unchanged |
| Operator not governed | PASS | No operator action required for this OAR |

---

## CHANGES — EVIDENCE

### `supabase/migrations/202606270002_repair_free_route_transitions_and_assessment_flow.sql` (created)

**Route 1** — `path_choice.right.next_surface`: `"structure_passage"` → `"crystal_seat_orientation_passage"`

`structure_passage` has `is_active=false, release_state="held"` (deactivated in migration 260005). Release gate was failing on right path → "encounter not available." `crystal_seat_orientation_passage` is released and active.

**Route 2** — `crystal_seat_orientation_passage.next_surface = "about_measures_registry"` (new node)

Required for `StructurePassageSeat` Continue to navigate to about after crystal orientation.

**Route 3** — `measures_assessment.next_surface = "obsidian_to_marble_passage_video"` (new node)

Required for "Begin Pathway Review" to trigger MAP-ready passage. Previously null → button did nothing.

**Route 4** — `obsidian_to_marble_passage_video.next_surface = "map_integrity_governance"` (new node)

Completes passage → MAP route.

**Registry row** — `obsidian_to_marble_passage_video` inserted with `is_active=true, release_state="released"`

Surface assignment existed (migration 009, `chamber_assignment` corrected to `"obsidian"` in migration 250001). Registry row was missing → `loadEncounterProfile` returned `renderable: false, reason: "missing_registry_record"`. Existing row handled with `ON CONFLICT (registry_key) DO UPDATE SET is_active = true, release_state = 'released'`.

**Encounter def row** — `obsidian_to_marble_passage_video` inserted with `display_title = "Before the Pathway"`

Seeded conditionally (WHERE NOT EXISTS) to avoid duplicate insertion if row already exists.

---

### `src/measures_registry/encounter_renderer/chambers/ObsidianChamberRenderer.tsx` (modified)

**Fix 1 — EvalPassage title (lines 112–114):**
```typescript
// BEFORE:
const title = encounter.encounterDef?.display_title ?? "Before evaluation, recognize the environment."

// AFTER:
const meta = asRecord(encounter.encounterDef?.metadata)
const unseeded = asString(meta?.status_note)?.includes("Seated without final public copy") ?? false
const title = (unseeded ? null : encounter.encounterDef?.display_title)
  ?? "Before evaluation, recognize the environment."
```

`obsidian_chamber_orientation_passage` encounter def carries `status_note: "Seated without final public copy. Renderer will present passage gap state until content is seeded."` When unseeded, `display_title = "Obsidian Chamber Orientation Passage"` (technical name) is suppressed in favor of the branded fallback. `asRecord` and `asString` were already imported.

**Fix 2 — handleSubmitEvaluation immediate navigation (line 342):**
```typescript
// REMOVED:
if (next) onNavigate(next as EncounterSurface)
```

After submission, `setEvalSubmitted(true)` shows the assessment result. `onBeginPathwayReview` (already present) handles user-initiated navigation to `obsidian_to_marble_passage_video`.

---

### `src/measures_registry/encounter_renderer/chambers/CrystalSeatRenderer.tsx` (modified)

**Fix 3 — StructurePassageSeat title (lines 439–442):**
```typescript
// BEFORE:
const meta = asRecord(encounter.encounterDef?.metadata)
const title = asString(meta?.title) ?? encounter.encounterDef?.display_title ?? "Measures Registry"

// AFTER:
const meta = asRecord(encounter.encounterDef?.metadata)
const unseeded = asString(meta?.status_note)?.includes("Seated without final public copy") ?? false
const title = asString(meta?.title)
  ?? (unseeded ? null : encounter.encounterDef?.display_title)
  ?? "Measures Registry"
```

`crystal_seat_orientation_passage` encounter def carries the same `status_note`. Without the guard, `display_title = "Crystal Seat Orientation Passage"` (technical name) would render. Guard suppresses it; `"Measures Registry"` neutral fallback used until final public copy is seeded.

---

## ROUTE TRACE — POST-REPAIR

### Crystal path (right)
```
path_choice (right click)
  → crystal_seat_orientation_passage   [released, active — StructurePassageSeat renders, title = "Measures Registry"]
  → about_measures_registry            [released, active — AboutMeasuresRegistry renders]
```

### Obsidian path (left)
```
path_choice (left click)
  → eval_passage surface               [surface_key; bridged to obsidian_chamber_orientation_passage registry row]
    → EvalPassage renders              [title = "Before evaluation, recognize the environment."]
    → Continue (transitionNodes["eval_passage"].next_surface)
  → measures_assessment                [released, active — MeasuresAssessment renders]
    → assessment result shown          [evalSubmitted = true]
    → Begin Pathway Review             [onBeginPathwayReview → onNavigate("obsidian_to_marble_passage_video")]
  → obsidian_to_marble_passage_video   [released, active — ObsidianToMarblePassage renders, title = "Before the Pathway"]
    → Continue
  → map_integrity_governance           [released, active — MarbleChamberRenderer renders]
```

---

## ROOT CAUSES — DOCUMENTED

| Issue | Root Cause |
|---|---|
| Crystal "encounter not available" | `path_choice.right.next_surface = "structure_passage"` (migration 240004); `structure_passage` deactivated (migration 260005); release gate failed |
| Obsidian raw title | `eval_passage` surface_key bridged to `obsidian_chamber_orientation_passage` registry (migration 260006); encounter def `display_title` = technical name; no content guard in `EvalPassage` |
| Assessment completion broken | `measures_assessment` had no `next_surface` node in encounter_structure; `onBeginPathwayReview` resolved null → navigation silent no-op; `obsidian_to_marble_passage_video` registry row missing → surface would have been ungated regardless |

---

## NOTCHAZZ FLAGS

None raised.

- Raw encounter keys suppressed via status_note guard — not exposed as public copy
- Fallback routing not treated as success — transition nodes properly seated in DB
- Assessment completion does not route to about — immediate navigation removed, Begin Pathway Review routes to obsidian_to_marble_passage_video
- DB capture unchanged — insert path preserved
- Consent behavior unchanged
- Registered runtime not reinstated
- Frontend did not invent transition authority — all routes from encounter_structure in DB
- Operator not governed

---

## ROLLBACK

If transition behavior is wrong, revert encounter_structure by running:

```sql
UPDATE measures_registry
SET metadata = jsonb_set(
  metadata,
  '{encounter_structure,path_choice,right,next_surface}',
  '"structure_passage"'
)
WHERE registry_key = 'measures_registry_root';
```

Code rollback: revert commit `b87e854`.
