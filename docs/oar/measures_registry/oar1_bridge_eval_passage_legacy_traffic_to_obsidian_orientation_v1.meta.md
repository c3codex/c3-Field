---
document_type: oar1
authority_level: working
title: OAR1 — Bridge eval_passage Legacy Traffic to Obsidian Orientation
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_bridge_eval_passage_legacy_traffic_to_obsidian_orientation_v1.meta.md
commit: 34bbddd
---

# OAR1 — Bridge eval_passage Legacy Traffic to Obsidian Orientation

## OBJECTIVE

Deactivate legacy eval_passage transition rules.
Redirect surface assignments to native obsidian orientation key.
Archive eval_passage registry entry.
Native obsidian route becomes authoritative.

---

## FILE CHANGED

| File | Change |
|---|---|
| `supabase/migrations/202606260006_bridge_eval_passage_legacy_traffic_to_obsidian_orientation.sql` | Created — 2 transition deactivations, 2 surface assignment redirects, 1 registry archive |

---

## TRANSITION MUTATIONS

| Transition | Pre-state | Post-state | Result |
|---|---|---|---|
| `evaluate_structure_path` → `eval_passage` | active | **inactive** | PASS |
| `eval_passage` → `connect_src` | active | **inactive** | PASS |
| `evaluate_structure_path` → `obsidian_chamber_orientation_passage` | active | active (untouched) | PASS |
| `obsidian_chamber_orientation_passage` → `measures_assessment` | active | active (untouched) | PASS |

No orphaned destinations. `measures_assessment` reachable via native route.

---

## SURFACE ASSIGNMENT REDIRECTS

`surface_key` values preserved. `registry_key` and `encounter_key` redirected to native key.

| surface_key | Pre registry_key | Post registry_key | Pre encounter_key | Post encounter_key | chamber_assignment |
|---|---|---|---|---|---|
| `eval_passage` | eval_passage | **obsidian_chamber_orientation_passage** | eval_passage | **obsidian_chamber_orientation_passage** | obsidian |
| `structural_coherence_explainer` | eval_passage | **obsidian_chamber_orientation_passage** | eval_passage | **obsidian_chamber_orientation_passage** | obsidian |

Historical surface keys preserved. Any residual traffic arriving via these surface keys now resolves through the native key. Chamber assignment (`obsidian`) unchanged.

---

## REGISTRY MUTATION

| Field | Pre-state | Post-state |
|---|---|---|
| is_active | true | **false** |
| release_state | released | **held** |
| access_state | callable | **archived** |
| disposition | — | legacy_deactivated |
| replacement_encounter_key | — | obsidian_chamber_orientation_passage |
| deactivated_after_native_route_validation | — | true |
| source_oar1 | — | oar1_validate_native_encounter_routes_before_legacy_deactivation_v1 |
| audit_trace_preserved | — | true |

Existing metadata preserved via `||` merge.

---

## NOTCHAZZ FLAGS

None raised.

- Native obsidian route (`evaluate_structure_path → obsidian_chamber_orientation_passage → measures_assessment`) remains fully active
- No rows deleted
- No renderer code changed
- No frontend inference added
- `measures_assessment` remains reachable
- Operator not governed

---

## CLOSE

`eval_passage` is archived. Legacy transitions are inactive.

Surface traffic arriving via `eval_passage` or `structural_coherence_explainer` surface keys now resolves through `obsidian_chamber_orientation_passage`.

`evaluate_structure_path → obsidian_chamber_orientation_passage → measures_assessment` is the authoritative obsidian route.

One bridge-required key remains: `structural_drift_publication` (lapis bridge OAR pending).

Nothing is invented.

Commit: 34bbddd
