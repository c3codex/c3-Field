---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Retire Passage Renderer Dispatches for Secured/Scale
status: closed
version: v1
system: measures_registry
commit: 60a24df
branch: measures
date: 2026-07-01
---

# OAR1 - Retire Passage Renderer Dispatches for Secured/Scale

## Authority

Passage and antechamber surfaces are held for the secured/scale tier. They are not part of the 13 registered SEAT surfaces. This OAR retires all renderer dispatch branches and functions that served passage/antechamber surfaces from the FREE encounter flow source code.

DB-side registry gate hold documented in: `oar1_hold_passage_and_antechamber_surfaces_for_secured_scale_v1.meta.md`

---

## DISPATCH BRANCHES REMOVED

| Surface Key | Renderer File | Function Dispatched |
|---|---|---|
| `structure_passage` | CrystalSeatRenderer.tsx | `StructurePassageSeat` |
| `crystal_seat_orientation_passage` | CrystalSeatRenderer.tsx | `StructurePassageSeat` |
| `obsidian_chamber_orientation_passage` | ObsidianChamberRenderer.tsx | `EvalPassage` |
| `obsidian_to_marble_passage_video` | ObsidianChamberRenderer.tsx | `ObsidianToMarblePassage` |
| `marble_chamber_orientation_passage` | MarbleChamberRenderer.tsx | `MapIntegrityGovernance` (shared branch with C2_compact) |

---

## FUNCTIONS DELETED

**CrystalSeatRenderer.tsx — `StructurePassageSeat` (~60 lines)**
- Consumed `structured_environment_passage_video` media role
- Rendered `registry-diagnostic-passage` CSS layout with passage gate
- Shared dispatch for `structure_passage` and `crystal_seat_orientation_passage`

**ObsidianChamberRenderer.tsx — `EvalPassage`**
- Stale terminology; served `obsidian_chamber_orientation_passage`
- Retired from dispatch in prior session; function body removed this OAR

**ObsidianChamberRenderer.tsx — `ObsidianToMarblePassage` (~116 lines)**
- Read `__mreg_pending_report` from sessionStorage
- Rendered `PublicAssessmentResult` after passage video complete
- Consumed `before_the_pathway_obsidian_to_marble_passage_video` media role

**ObsidianChamberRenderer.tsx — `PendingReport` type**
- Used only by `ObsidianToMarblePassage`; removed with it

---

## RESOLVER CLEANUP

**ENCOUNTER_REGISTRY_KEYS removed:**
- `obsidian_to_marble_passage_video`

**ENCOUNTER_DEF_KEYS removed:**
- `obsidian_to_marble_passage_video`
- `structure_passage`

**MEDIA_ROLES removed:**
- `measures_structured_enviroments` (typo variant; passage-only)
- `before_the_pathway_obsidian_to_marble_passage_video` (passage-only)

**MEDIA_ROLES retained (active use):**
- `structured_environment_passage_video` — still consumed by `MeasuresAssessment` (obsidian_chamber_encounter_surface) for structured environment visual during active assessment

---

## 13 ACTIVE SEAT SURFACES — CONFIRMED INTACT

| # | Surface Key | Renderer | Function |
|---|---|---|---|
| 1 | crystal_seat_intro | CrystalSeat | IntroHookSeat |
| 2 | crystal_seat_threshold | CrystalSeat | IntroHookSeat |
| 3 | crystal_seat_orientation | CrystalSeat | IntroHookSeat (measures_position video) |
| 4 | crystal_seat_encounter | CrystalSeat | CrystalEncounterSeat |
| 5 | lapis_chamber_encounter | LapisChamber | LapisChamberEncounter |
| 6 | obsidian_chamber_orientation | ObsidianChamber | ObsidianOrientationThreshold |
| 7 | obsidian_chamber_encounter_surface | ObsidianChamber | MeasuresAssessment |
| 8 | obsidian_chamber_C1_compact | ObsidianChamber | ObsidianC1Compact |
| 9 | marble_chamber_orientation | MarbleChamber | MarbleOrientationSeat |
| 10 | marble_chamber_encounter | MarbleChamber | MarbleChamberEncounter |
| 11 | marble_chamber_C2_compact | MarbleChamber | MapIntegrityGovernance |
| 12 | marble_chamber_C2_agreement | MarbleChamber | MarbleC2Agreement |
| 13 | marble_chamber_C2_resolution | MarbleChamber | MarbleC2Resolution |

All 13 confirmed dispatching via grep across chamber renderer files. TypeScript: 0 errors.

---

## OPEN ITEM: Transition Node After Assessment

`MeasuresAssessment` (obsidian_chamber_encounter_surface) has a `next_surface` transition node in DB currently pointing to `obsidian_to_marble_passage_video` (now held). Post-assessment navigation will land in a renderer gap until this is updated.

**Required:** Migration to update the transition node to `marble_chamber_orientation`.

---

## VALIDATION

| Check | Status |
|---|---|
| TypeScript: 0 errors after all deletions | ✓ |
| PublicAssessmentResult import still valid (used by MeasuresAssessment) | ✓ |
| No passage surface key remains in ENCOUNTER_REGISTRY_KEYS | ✓ |
| No passage surface key remains in ENCOUNTER_DEF_KEYS | ✓ |
| No passage media role remains in MEDIA_ROLES (except active structured_environment_passage_video) | ✓ |
| All 13 SEAT surfaces dispatch confirmed via grep | ✓ |
| No active SEAT surface removed from dispatch | ✓ |
| No DB rows deleted | ✓ |
| Commit applied and pushed | ✓ 60a24df |

---

## FINAL DISPOSITION

**CLOSED** — Passage renderer dispatches retired from FREE encounter flow source.

All passage surface branches fall through to renderer gap state if ever reached (which they cannot be — DB gate holds them at the registry level per the companion OAR). Source and DB are now aligned: no passage surface will render in the active 13-surface FREE flow.

Codex holds.
Systems align.
Measures allows.
