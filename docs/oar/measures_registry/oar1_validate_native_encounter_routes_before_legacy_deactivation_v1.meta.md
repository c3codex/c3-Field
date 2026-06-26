---
document_type: oar1
authority_level: working
title: OAR1 — Validate Native Encounter Routes Before Legacy Deactivation
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_validate_native_encounter_routes_before_legacy_deactivation_v1.meta.md
---

# OAR1 — Validate Native Encounter Routes Before Legacy Deactivation

## OBJECTIVE

Read-only route validation. No mutations. No code changes. No content seeding.

Prove native routes resolve completely. Determine legacy deactivation disposition for each key.

---

## ROUTE VALIDATION

### Crystal Seat Route

Path: `evaluate_structure_path` → `crystal_seat_orientation_passage` → `about_measures_registry`

| Check | Evidence | Result |
|---|---|---|
| Registry resolution | `crystal_seat_orientation_passage`: is_active=true, release_state=released, access_state=encounterable | PASS |
| Encounter_def resolution | `crystal_seat_orientation_passage`: is_active=true, material_family=crystal | PASS |
| Surface assignment | surface_key=`crystal_seat_orientation_passage`, chamber_assignment=`crystal_seat`, material_identity=`crystal` | PASS |
| ChamberRouter dispatch | `crystal_seat` → `CrystalSeatRenderer` | PASS |
| Renderer dispatch | `crystal_seat_orientation_passage` → `StructurePassageSeat` (TypeScript dispatch added OAR: seat_native_orientation_passages) | PASS |
| Transition rule | `evaluate_structure_path` → `crystal_seat_orientation_passage`: active, progression | PASS |
| Transition rule | `crystal_seat_orientation_passage` → `about_measures_registry`: active, progression | PASS |
| `about_measures_registry` registry | is_active=true, release_state=released, access_state=encounterable | PASS |
| `about_measures_registry` surface assignment | chamber_assignment=`crystal_seat` | PASS |
| `about_measures_registry` content contract | `approved_content_contract` present in encounter_def | PASS |
| No inference | Registry determines release. Surface assignment determines chamber. Renderer dispatches by surface key. | PASS |
| Content gap | `crystal_seat_orientation_passage` encounter_def has architectural metadata only — no passage video or copy. `StructurePassageSeat` renders without video; Continue button functional. | GAP — not a failure |

**Route result: PASS**

---

### Obsidian Route

Path: `evaluate_structure_path` → `obsidian_chamber_orientation_passage` → `measures_assessment`

| Check | Evidence | Result |
|---|---|---|
| Registry resolution | `obsidian_chamber_orientation_passage`: is_active=true, release_state=released, access_state=encounterable | PASS |
| Encounter_def resolution | `obsidian_chamber_orientation_passage`: is_active=true, material_family=obsidian | PASS |
| Surface assignment | surface_key=`obsidian_chamber_orientation_passage`, chamber_assignment=`obsidian`, material_identity=`obsidian` | PASS |
| ChamberRouter dispatch | `obsidian` → `ObsidianChamberRenderer` | PASS |
| Renderer dispatch | `obsidian_chamber_orientation_passage` → `EvalPassage` (TypeScript dispatch added OAR: seat_native_orientation_passages) | PASS |
| Transition rule | `evaluate_structure_path` → `obsidian_chamber_orientation_passage`: active, progression | PASS |
| Transition rule | `obsidian_chamber_orientation_passage` → `measures_assessment`: active, progression | PASS |
| `measures_assessment` registry | is_active=true, release_state=released, access_state=callable | PASS |
| `measures_assessment` surface assignment | chamber_assignment=`obsidian` | PASS |
| No inference | PASS |
| Content gap | `obsidian_chamber_orientation_passage` encounter_def has architectural metadata only — no passage copy or video. `EvalPassage` will render partial/gap state. | GAP — not a failure |

**Route result: PASS**

---

### Marble Route

Path: `marble_chamber_orientation_passage` → `map_integrity_governance`

| Check | Evidence | Result |
|---|---|---|
| Registry resolution | `marble_chamber_orientation_passage`: is_active=true, release_state=released, access_state=encounterable | PASS |
| Encounter_def resolution | `marble_chamber_orientation_passage`: is_active=true, material_family=marble | PASS |
| Surface assignment | surface_key=`marble_chamber_orientation_passage`, chamber_assignment=`marble`, material_identity=`marble` | PASS |
| ChamberRouter dispatch | `marble` → `MarbleChamberRenderer` | PASS |
| Renderer dispatch | `marble_chamber_orientation_passage` → `MapIntegrityGovernance` (TypeScript dispatch added OAR: seat_native_orientation_passages) | PASS |
| Transition rule | `marble_chamber_orientation_passage` → `map_integrity_governance`: active, progression | PASS |
| `map_integrity_governance` registry | is_active=true, release_state=released, access_state=callable | PASS |
| `map_integrity_governance` surface assignment | chamber_assignment=`marble` | PASS |
| `governance_header` renders | Seeded (OAR: seed_map_integrity_governance_encounter_content) — present in `map_integrity_governance` encounter_def | PASS |
| `pathway_cards` render | 3 cards seeded: pre_deployment, optimization, remediation | PASS |
| `action_readiness` renders | Seeded — present | PASS |
| `seat_hold` renders | Seeded — present | PASS |
| No inference | PASS |
| Content gap | `marble_chamber_orientation_passage` encounter_def has architectural metadata only. `MapIntegrityGovernance` renderer will find no governance content at orientation passage surface — gap state. Governance content is seated at `map_integrity_governance` destination. | GAP — not a failure |

**Route result: PASS**

---

### Lapis Route

Path: `/undrifted` → `measures_publication_registry` → `structural_drift_dispatch_v1`

| Check | Evidence | Result |
|---|---|---|
| Route resolves | `/undrifted` present in `App.tsx`, route_unit=`undrifted_publication_landing` | PASS |
| Publication registry resolves | `measures_publication_registry`: publication_key=`undrifted`, status=published, title="unDrifted" | PASS |
| Dispatch resolves | `measures_publication_dispatch`: dispatch_key=`structural_drift_dispatch_v1`, publication_key=`undrifted`, status=published | PASS |
| Paragraph URL correct | `external_url: https://paragraph.com/@undrifted/structural-drift` | PASS |
| Article standing | `structural_drift_dispatch_v1`: external_platform=paragraph, status=published | PASS |
| No publication identity confusion | `structural_drift_publication` encounter_def now has stale_publication_identity=true, replacement_publication_key=undrifted | PASS |
| `undrifted` in measures_registry | is_active=true, release_state=released, material_family=lapis, current_function=landing_page_publication | PASS |
| No inference | PASS |

**Route result: PASS**

---

## TRANSITION VALIDATION

| Transition | Rule state | Kind | Orphaned destination | Result |
|---|---|---|---|---|
| `evaluate_structure_path` → `obsidian_chamber_orientation_passage` | active | progression | No — destination active, released | PASS |
| `evaluate_structure_path` → `crystal_seat_orientation_passage` | active | progression | No — destination active, released | PASS |
| `obsidian_chamber_orientation_passage` → `measures_assessment` | active | progression | No — destination active, released | PASS |
| `crystal_seat_orientation_passage` → `about_measures_registry` | active | progression | No — destination active, released | PASS |
| `marble_chamber_orientation_passage` → `map_integrity_governance` | active | progression | No — destination active, released | PASS |

Legacy parallel transitions (preserved, not duplicate loops):

| Transition | Rule state | Status |
|---|---|---|
| `evaluate_structure_path` → `eval_passage` | active | Legacy parallel — still serves existing surface assignment traffic |
| `evaluate_structure_path` → `structure_passage` | active | Legacy parallel — structure_passage is is_active=false, gate will reject |

No duplicate dispatch loops detected. No orphaned destinations in native route set.

---

## LEGACY IMPACT ANALYSIS

### eval_passage

| Field | Value |
|---|---|
| is_active | true |
| release_state | released |
| Inbound transitions | `evaluate_structure_path` → `eval_passage` (active) |
| Outbound transitions | `eval_passage` → `connect_src` (active) |
| Surface assignments | `eval_passage` → obsidian, `structural_coherence_explainer` → obsidian |
| Native replacement | `obsidian_chamber_orientation_passage` — proven PASS |

**Disposition: `bridge_required`**

Before deactivating:
- Deactivate transition rule `evaluate_structure_path → eval_passage`
- Reassign or redirect surface keys `eval_passage` and `structural_coherence_explainer` to `obsidian_chamber_orientation_passage`
- Deactivate transition rule `eval_passage → connect_src`

---

### structure_passage

| Field | Value |
|---|---|
| is_active | **false** |
| release_state | held |
| Inbound transitions | `evaluate_structure_path` → `structure_passage` (active) |
| Outbound transitions | `structure_passage` → `crystal_chamber` (active), `structure_passage` → `connect_src` (active) |
| Surface assignments | `structure_passage` → crystal_seat, `measures_structured_environments` → crystal_seat |
| Native replacement | `crystal_seat_orientation_passage` — proven PASS |

**Disposition: `safe_to_deactivate`**

Already `is_active=false`. FREE release gate rejects requests. No live new traffic possible.
Transition cleanup (deactivate inbound/outbound rules) and surface assignment cleanup optional for hygiene — not required for safety.

---

### structural_drift_publication

| Field | Value |
|---|---|
| is_active | true |
| release_state | released |
| Inbound transitions | `about_measures_registry` → `structural_drift_publication` (active) |
| Outbound transitions | `structural_drift_publication` → `measures_eval_email_contract` (active) |
| Surface assignments | `structural_drift_dispatches` → lapis, `publication_dispatch` → lapis |
| Native replacement | `/undrifted` + `structural_drift_dispatch_v1` — proven PASS |

**Disposition: `bridge_required`**

Before deactivating:
- Update or deactivate transition rule `about_measures_registry → structural_drift_publication`
- Reassign or redirect surface keys `structural_drift_dispatches` and `publication_dispatch` to `undrifted`
- Deactivate outbound transition `structural_drift_publication → measures_eval_email_contract`

---

### marble_pathway_reveal

| Field | Value |
|---|---|
| is_active | true |
| release_state | released |
| Inbound transitions | **none** |
| Outbound transitions | not confirmed — no active inbound means no active path to it |
| Surface assignments | **none found** |
| Native replacement | `marble_chamber_orientation_passage` — proven PASS |
| Self-acknowledged | legacy_alias_for=true, prohibited_public_rendering=true in encounter_def metadata |

**Disposition: `safe_to_deactivate`**

No inbound transitions. No surface assignments. Self-acknowledged deprecated. Native replacement proven.

---

### iis_eval_gate1

| Field | Value |
|---|---|
| is_active | true |
| release_state | released |
| Inbound transitions | **none** |
| Surface assignments | **none found** |
| Native replacement | `measures_assessment` — proven PASS |
| Self-acknowledged | deprecated=true, deprecated_by, replacement_encounter_key in encounter_def metadata |
| Capture table | `measures_iis_eval_gate1_capture` — preserved separately, must not be dropped |

**Disposition: `safe_to_deactivate`**

No inbound transitions. No surface assignments. Self-acknowledged deprecated. Capture table is separate and not affected by registry deactivation.

---

### crystal_chamber

| Field | Value |
|---|---|
| is_active | true |
| release_state | **held** |
| Inbound transitions | `structure_passage` → `crystal_chamber` (from inactive key) |
| Outbound transitions | `crystal_chamber` → `eval_passage` (active) |
| Surface assignments | **none found** |
| Status | Already held — cannot serve live traffic |

**Disposition: `safe_to_deactivate`**

Already held. No live traffic possible via release gate. Inbound transition originates from `structure_passage` which is already `is_active=false`. Cleanup of orphaned transition rules is optional hygiene.

---

## DEACTIVATION PLAN SUMMARY

| Key | Disposition | Blocker |
|---|---|---|
| `eval_passage` | `bridge_required` | Must deactivate `evaluate_structure_path→eval_passage` transition + reassign surface keys first |
| `structure_passage` | `safe_to_deactivate` | None — already inactive |
| `structural_drift_publication` | `bridge_required` | Must update `about_measures_registry→structural_drift_publication` transition + reassign lapis surface keys first |
| `marble_pathway_reveal` | `safe_to_deactivate` | None — no inbound traffic |
| `iis_eval_gate1` | `safe_to_deactivate` | None — no inbound traffic; preserve capture table |
| `crystal_chamber` | `safe_to_deactivate` | None — already held |

**Recommended deactivation sequence:**

1. OAR — Deactivate `structure_passage`, `marble_pathway_reveal`, `iis_eval_gate1`, `crystal_chamber` (4 safe keys, 1 migration)
2. OAR — Bridge `eval_passage` → redirect surface assignments and deactivate legacy transitions
3. OAR — Bridge `structural_drift_publication` → redirect lapis surface assignments and transition from `about_measures_registry`

---

## NOTCHAZZ FLAGS

None raised.

- No legacy keys deactivated
- No routes removed
- No content seeded
- No renderer logic changed
- No frontend inference added
- Fallback/gap states for orientation passage content clearly distinguished from route failures
- All route failures explicitly absent — all routes proved PASS
- Operator not governed

---

## CLOSE

All four native route paths resolve through DB. All five bridge transitions are active. No orphaned destinations. No duplicate dispatch loops.

Three legacy keys are safe to deactivate now. Two require bridge work before deactivation.

Native routes are proven. Legacy deactivation may proceed per recommended sequence.

Nothing is invented.
