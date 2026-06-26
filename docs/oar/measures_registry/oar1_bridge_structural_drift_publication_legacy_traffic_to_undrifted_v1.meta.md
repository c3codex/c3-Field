---
document_type: oar1
authority_level: working
title: OAR1 — Bridge structural_drift_publication Legacy Traffic to unDrifted
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_bridge_structural_drift_publication_legacy_traffic_to_undrifted_v1.meta.md
commit: bcfcb90
---

# OAR1 — Bridge structural_drift_publication Legacy Traffic to unDrifted

## OBJECTIVE

Deactivate legacy structural_drift_publication transition rules.
Create native transition: about_measures_registry → undrifted.
Redirect lapis surface assignments to undrifted.
Archive structural_drift_publication registry entry.
unDrifted becomes authoritative Lapis publication standing.

---

## FILE CHANGED

| File | Change |
|---|---|
| `supabase/migrations/202606260007_bridge_structural_drift_publication_legacy_traffic_to_undrifted.sql` | Created — 2 transition deactivations, 1 transition insert, 2 surface assignment redirects, 1 registry archive |

---

## TRANSITION MUTATIONS

| Transition | Pre-state | Post-state | Result |
|---|---|---|---|
| `about_measures_registry` → `structural_drift_publication` | active | **inactive** | PASS |
| `structural_drift_publication` → `measures_eval_email_contract` | active | **inactive** | PASS |
| `about_measures_registry` → `undrifted` | absent | **active** (created) | PASS |

No orphaned destinations. `undrifted` is active and released.

---

## SURFACE ASSIGNMENT REDIRECTS

`surface_key` values preserved. `registry_key` and `encounter_key` redirected to native key. `chamber_assignment` (`lapis`) unchanged.

| surface_key | Pre registry_key | Post registry_key | Pre encounter_key | Post encounter_key |
|---|---|---|---|---|
| `structural_drift_dispatches` | structural_drift_publication | **undrifted** | structural_drift_publication | **undrifted** |
| `publication_dispatch` | structural_drift_publication | **undrifted** | structural_drift_publication | **undrifted** |

Historical surface keys preserved for compatibility.

---

## REGISTRY MUTATION

| Field | Pre-state | Post-state |
|---|---|---|
| is_active | true | **false** |
| release_state | released | **held** |
| access_state | callable | **archived** |
| disposition | — | legacy_deactivated |
| replacement_publication_key | undrifted (existing metadata) | undrifted (confirmed) |
| replacement_article_key | structural_drift (existing metadata) | structural_drift (confirmed) |
| deactivated_after_native_route_validation | — | true |
| source_oar1 | — | oar1_validate_native_encounter_routes_before_legacy_deactivation_v1 |
| audit_trace_preserved | — | true |

Existing metadata preserved via `||` merge. Prior stale identity flags (from OAR: align_undrifted) retained.

---

## PUBLICATION RECORDS PRESERVED UNMODIFIED

| Record | Verified | Result |
|---|---|---|
| `measures_publication_dispatch.structural_drift_dispatch_v1` | status=published, external_url=https://paragraph.com/@undrifted/structural-drift, publication_key=undrifted | PASS |
| `undrifted` registry | is_active=true, release_state=released, access_state=encounterable | PASS |

No publication_registry or publication_dispatch rows mutated.

---

## NOTCHAZZ FLAGS

None raised.

- `/undrifted` route untouched — no TypeScript or route file changes
- article standing unchanged — `structural_drift_dispatch_v1` remains published
- Paragraph URL unchanged — `https://paragraph.com/@undrifted/structural-drift`
- no publication dispatch records mutated
- no rows deleted
- no renderer code changed
- no frontend inference added
- `structural_drift_publication` archived with complete audit metadata
- operator not governed

---

## CLOSE

All legacy deactivation phases complete.

`structural_drift_publication` is archived. Legacy Lapis publication transitions are inactive.

`about_measures_registry → undrifted` is the active native transition.

`unDrifted` is authoritative Lapis publication standing.

`Structural Drift` remains a registered published article (`structural_drift_dispatch_v1`, Paragraph).

Legacy deactivation sequence (3 phases) from OAR1 validation is fully executed:

| Phase | OAR | Keys | Status |
|---|---|---|---|
| 1 | oar1_deactivate_safe_legacy_keys_after_native_route_validation_v1 | structure_passage, marble_pathway_reveal, iis_eval_gate1, crystal_chamber | COMPLETE |
| 2 | oar1_bridge_eval_passage_legacy_traffic_to_obsidian_orientation_v1 | eval_passage | COMPLETE |
| 3 | oar1_bridge_structural_drift_publication_legacy_traffic_to_undrifted_v1 | structural_drift_publication | COMPLETE |

Nothing is invented.

Commit: bcfcb90
