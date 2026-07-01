---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Seat All 13 Registered Surfaces Hot Through Payment Resolution
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1
---

# OAR1 - Seat All 13 Registered Surfaces Hot Through Payment Resolution

## EXECUTION METHOD

Live DB queried: measures_encounter_surface_assignment and measures_registry for all 13 surface keys
and their mapped registry/encounter_def keys. EncounterSurface type union audited. Chamber
renderer dispatch audited. Migration 202606300018 written and applied via `npx supabase db push`
(exit code 0). EncounterSurface union updated, registryResolver ENCOUNTER_REGISTRY_KEYS and
ENCOUNTER_DEF_KEYS updated, CrystalSeatRenderer dispatch updated. TypeScript `npx tsc --noEmit`
zero errors. Post-migration DB verified via PostgREST anon queries.

---

## PRE-MUTATION STATE

### 7 surfaces already HOT before this OAR

| surface_key | registry_key | encounter_key | union | renderer | gate |
|---|---|---|---|---|---|
| crystal_seat_threshold | ai_isnt_broken_intro | ai_isnt_broken_intro | ✓ | IntroHookSeat | ✓ |
| crystal_seat_orientation | ai_isnt_broken_intro | ai_isnt_broken_intro | ✓ | IntroHookSeat | ✓ |
| crystal_seat_encounter | about_measures_registry | about_measures_registry | ✓ | AboutMeasuresRegistry | ✓ |
| lapis_chamber_encounter | undrifted | undrifted | ✓ | UnDriftedIndex | ✓ |
| obsidian_chamber_orientation | obsidian_chamber_orientation | obsidian_chamber_orientation | ✓ | EvalPassage | ✓ |
| obsidian_chamber_encounter_surface | measures_assessment | measures_assessment | ✓ | MeasuresAssessment | ✓ |
| marble_chamber_C2_compact | map_integrity_governance | map_integrity_governance | ✓ | MapIntegrityGovernance | ✓ |

### 6 surfaces ABSENT before this OAR

| surface_key | surface_assignment | registry row | encounter_def | union | renderer |
|---|---|---|---|---|---|
| crystal_seat_intro | ABSENT | ABSENT | ABSENT | NOT IN | NOT dispatched |
| obsidian_chamber_C1_compact | ABSENT | ABSENT | ABSENT | NOT IN | NOT dispatched |
| marble_chamber_orientation | ABSENT | ABSENT | ABSENT | NOT IN | NOT dispatched |
| marble_chamber_encounter | ABSENT | ABSENT | ABSENT | NOT IN | NOT dispatched |
| marble_chamber_C2_agreement | ABSENT | ABSENT | ABSENT | NOT IN | NOT dispatched |
| marble_chamber_C2_resolution | ABSENT | ABSENT | ABSENT | NOT IN | NOT dispatched |

### crystal_seat_split_path (NOT in 13; legacy_alias)

- In EncounterSurface union: YES (incorrect — legacy_alias surface, seated 2 OARs ago)
- Renderer dispatch: crystal_seat_split_path → PathChoiceSeat (incorrect — no active routing leads to it)
- Action: remove from union, remove dispatch

---

## POST-MUTATION STATE

### Migration 202606300018: 6 surfaces created

For each surface: measures_registry row (is_active=true, release_state=released, access_state=encounterable),
measures_encounter_def row, measures_encounter_surface_assignment row created.

### EncounterSurface union (encounterRendererTypes.ts)

Added: `crystal_seat_intro`, `obsidian_chamber_C1_compact`, `marble_chamber_orientation`,
`marble_chamber_encounter`, `marble_chamber_C2_agreement`, `marble_chamber_C2_resolution`

Removed: `crystal_seat_split_path` (legacy_alias — no active routing leads to it)

### CrystalSeatRenderer.tsx dispatch

Added: `crystal_seat_intro` → IntroHookSeat (alongside crystal_seat_threshold and crystal_seat_orientation)
Removed: `crystal_seat_split_path` → PathChoiceSeat (no longer in EncounterSurface type)

### registryResolver.ts

ENCOUNTER_REGISTRY_KEYS: Added 6 new canonical registry_keys
ENCOUNTER_DEF_KEYS: Added 6 new encounter_keys

---

## 13-SURFACE AUDIT TABLE

| # | Registered Surface | Source Anchor | registry_key | encounter_key | surface_key | Material | Chamber | release_state | is_active | Renderer | Style Profile | Action | Final Standing |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | crystal_seat_intro | measures_registry (new) | crystal_seat_intro | crystal_seat_intro | crystal_seat_intro | crystal | crystal_seat | released | true | IntroHookSeat ✓ | pending (next OAR) | CREATED DB rows + union + dispatch | **hot** |
| 2 | crystal_seat_threshold | ai_isnt_broken_intro | ai_isnt_broken_intro | ai_isnt_broken_intro | crystal_seat_threshold | crystal | crystal_seat | released | true | IntroHookSeat ✓ | existing | pre-existing | **hot** |
| 3 | crystal_seat_orientation | ai_isnt_broken_intro | ai_isnt_broken_intro | ai_isnt_broken_intro | crystal_seat_orientation | crystal | crystal_seat | released | true | IntroHookSeat ✓ | existing | pre-existing | **hot** |
| 4 | crystal_seat_encounter | about_measures_registry | about_measures_registry | about_measures_registry | crystal_seat_encounter | crystal | crystal_seat | released | true | AboutMeasuresRegistry ✓ | existing | pre-existing | **hot** |
| 5 | lapis_chamber_encounter | undrifted | undrifted | undrifted | lapis_chamber_encounter | lapis | lapis | released | true | UnDriftedIndex ✓ | existing | encounterDef seeded this session | **hot** |
| 6 | obsidian_chamber_orientation | obsidian_chamber_orientation | obsidian_chamber_orientation | obsidian_chamber_orientation | obsidian_chamber_orientation | obsidian | obsidian | released | true | EvalPassage ✓ | existing | canonical key seated earlier this session | **hot** |
| 7 | obsidian_chamber_encounter_surface | measures_assessment | measures_assessment | measures_assessment | obsidian_chamber_encounter_surface | obsidian | obsidian | released | true | MeasuresAssessment ✓ | existing | pre-existing | **hot** |
| 8 | obsidian_chamber_C1_compact | measures_registry (new) | obsidian_chamber_C1_compact | obsidian_chamber_C1_compact | obsidian_chamber_C1_compact | obsidian | obsidian | released | true | renderer_gap (obsidian gap handler) | pending (next OAR) | CREATED DB rows + union | **blocked_with_reason** |
| 9 | marble_chamber_orientation | measures_registry (new) | marble_chamber_orientation | marble_chamber_orientation | marble_chamber_orientation | marble | marble | released | true | renderer_gap (marble gap handler) | pending (next OAR) | CREATED DB rows + union | **blocked_with_reason** |
| 10 | marble_chamber_encounter | measures_registry (new) | marble_chamber_encounter | marble_chamber_encounter | marble_chamber_encounter | marble | marble | released | true | renderer_gap (marble gap handler) | pending (next OAR) | CREATED DB rows + union | **blocked_with_reason** |
| 11 | marble_chamber_C2_compact | map_integrity_governance | map_integrity_governance | map_integrity_governance | marble_chamber_C2_compact | marble | marble | released | true | MapIntegrityGovernance ✓ | existing | pre-existing | **hot** |
| 12 | marble_chamber_C2_agreement | measures_registry (new) | marble_chamber_C2_agreement | marble_chamber_C2_agreement | marble_chamber_C2_agreement | marble | marble | released | true | renderer_gap (marble gap handler) | pending (next OAR) | CREATED DB rows + union | **blocked_with_reason** |
| 13 | marble_chamber_C2_resolution | measures_registry (new) | marble_chamber_C2_resolution | marble_chamber_C2_resolution | marble_chamber_C2_resolution | marble | marble | released | true | renderer_gap (marble gap handler) | pending (next OAR) | CREATED DB rows + union | **blocked_with_reason** |

---

## BLOCKED SURFACE REASONS

### obsidian_chamber_C1_compact
**Blocker**: Contact capture currently embedded inline within `MeasuresAssessment`
(`obsidian_chamber_encounter_surface`) as the `src_capture` eval step. Promoting to a standalone
surface requires: (1) MeasuresAssessment component refactor to navigate out instead of managing
inline state transition, (2) new renderer component for compact form UI, (3) encounter_structure
update (obsidian_chamber_encounter_surface.next_surface → obsidian_chamber_C1_compact), (4)
obsidian_chamber_C1_compact assessment capture callback chain update. All dependency-unsafe
for this OAR scope.

**Registered standing**: ✓ (DB rows created, not embedded_only)
**Renderer**: Falls to ObsidianChamberRenderer generic gap handler

### marble_chamber_orientation
**Blocker**: No MarbleChamberRenderer dispatch exists for this surface. No renderer component.
Media `assessment_report_orientation` not confirmed in measures_media_map for marble campaign key.
Requires: (1) new renderer component, (2) media seating via media_map row, (3) MarbleChamberRenderer
dispatch addition, (4) encounter_structure transition node. Not within this OAR scope.

**Registered standing**: ✓ (DB rows created, not embedded_only)
**Renderer**: Falls to MarbleChamberRenderer generic gap handler

### marble_chamber_encounter
**Blocker**: Assessment findings (PublicAssessmentResult) currently rendered within
`obsidian_to_marble_passage_video` surface after video completes (`passageComplete && pendingReport`
branch in ObsidianToMarblePassage). Promoting to a standalone surface requires splitting the
passage from the result display. Not dependency-safe without flow refactor and new marble
encounter renderer.

**Registered standing**: ✓ (DB rows created, not embedded_only)
**Renderer**: Falls to MarbleChamberRenderer generic gap handler

### marble_chamber_C2_agreement
**Blocker**: Stripe payment agreement currently embedded in `MapIntegrityGovernance`
(`marble_chamber_C2_compact`). `handlePayment()` is called inline. OAR2 explicitly states
"Stripe logic changes beyond registering payment surface standing" NOT authorized. A standalone
`marble_chamber_C2_agreement` surface would require Stripe Checkout session routing to a
dedicated surface, which is unauthorized. Registered surface standing created; renderer deferred.

**Registered standing**: ✓ (DB rows created, not embedded_only)
**Renderer**: Falls to MarbleChamberRenderer generic gap handler

### marble_chamber_C2_resolution
**Blocker**: Post-payment confirmation page requires Stripe redirect/webhook handling to route
back into the encounter model at marble_chamber_C2_resolution. No existing component. No Stripe
redirect handling in the encounter orchestrator. Requires: (1) Stripe webhook or success URL
routing, (2) new confirmation renderer, (3) session data handoff from Stripe. Not within this
OAR scope.

**Registered standing**: ✓ (DB rows created, not embedded_only)
**Renderer**: Falls to MarbleChamberRenderer generic gap handler

---

## crystal_seat_split_path REMOVAL

Removed from EncounterSurface type union (was: present; now: removed).
Removed from CrystalSeatRenderer dispatch (was: if surface === "crystal_seat_split_path" → PathChoiceSeat).
DB surface_assignment row retained (standing: legacy_alias, set in prior OAR).
No active routing leads to this surface. PathChoiceSeat component retained as dead code (no TypeScript error).

---

## WHAT IS NOT CHANGED

- All 13 registry rows: is_active and release_state UNCHANGED for 7 pre-existing hot surfaces
- measures_publication_registry: unchanged
- measures_publication_dispatch: unchanged
- Stripe logic: unchanged
- Scoring logic: unchanged
- Report copy: unchanged
- Public routes: unchanged
- Passage standing: all held (unchanged)
- registered_runtime: unchanged (retired)

---

## VALIDATION CHECKLIST

| Item | Status |
|---|---|
| All 13 surfaces have DB row in measures_encounter_surface_assignment | ✓ |
| All 13 surfaces have DB row in measures_registry | ✓ |
| All 13 surfaces have DB row in measures_encounter_def | ✓ |
| All 13 surfaces have is_active=true, release_state=released | ✓ |
| 8 surfaces are fully hot (DB + union + renderer dispatch) | ✓ (7 pre-existing + crystal_seat_intro) |
| 5 surfaces are registered but blocked_with_reason (renderer gap) | ✓ (exact blockers documented) |
| No surface remains embedded_only without registered standing | ✓ |
| crystal_seat_split_path removed from union and dispatch | ✓ |
| Passages remain held | ✓ |
| Antechambers remain held | ✓ |
| Public routes unchanged | ✓ |
| Stripe logic unchanged | ✓ |
| TypeScript tsc --noEmit zero errors | ✓ |
| Post-migration surface_assignment and registry rows confirmed via PostgREST | ✓ |

---

## FINAL DISPOSITION

**SEATED** — All 13 registered surfaces have first-class DB standing.

8 are fully hot with working renderer dispatch. 5 are registered and released but blocked
for renderer implementation (contact capture split, marble result split, marble orientation
component, Stripe payment agreement standalone, Stripe resolution confirmation).

crystal_seat_split_path removed from EncounterSurface type union and CrystalSeatRenderer dispatch.
No active routing led to it. DB row retained with legacy_alias standing.

The 13 are registered.
DB holds the authority.
8 render.
5 wait for their renderer.

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.

Collapse is not the default.
