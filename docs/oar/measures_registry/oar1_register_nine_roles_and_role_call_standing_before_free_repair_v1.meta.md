---
document_type: oar1
authority_level: architecture
title: OAR1 — Register Nine Roles and role_call Standing Before FREE Repair
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_register_nine_roles_and_role_call_standing_before_free_repair_v1.meta.md
migration: 202606290001_register_nine_roles_and_role_call_standing.sql
---

# OAR1 — Register Nine Roles and role_call Standing Before FREE Repair

## FINAL DISPOSITION

**ROLE_CALL_STANDING_REGISTERED**

Nine roles registered across three material families. role_call standing seated. Contract term reserved. Legacy implementation fields classified. No frontend mutation. No FREE repair. Build not affected.

---

## VALIDATION CHECKLIST

| Item | Status | Evidence |
|---|---|---|
| role_call_standing seated | PASS | `measures_registry_root.metadata.role_call_standing.rule = "chambers_assemble_roles_authorize"` — DO $$ block validated |
| Nine roles registered | PASS | `native_role_registry.total_roles = 9` — validated in migration |
| No more than nine roles | PASS | obsidian=3, lapis=3, marble=3 — count validated per family |
| Material role families registered | PASS | `native_role_registry.material_families = ["obsidian","lapis","marble"]` |
| Chamber assemble / role authorize rule | PASS | `role_call_standing.chamber_rule` and `role_call_standing.role_call_rule` seated |
| Chamber may call Obsidian, Lapis, Marble | PASS | `role_call_standing.chamber_callable_families = ["obsidian","lapis","marble"]` |
| Contract term reserved for smart_contract | PASS | `contract_term_restriction.reserved_for = "smart_contract"`, `reserved_term = "contract"` |
| Legacy contract-named fields classified | PASS | All five fields: `legacy_implementation_field` status, native_standing mapped |
| No FREE renderer mutation | PASS | No src changes — migration only |
| No styling mutation | PASS | No src changes — migration only |
| No new role names invented | PASS | Exactly the nine names from the OAR2, no others |
| Migration validation passes | PASS | `supabase db push` — applied without error, DO $$ block executed |
| Prior encounter_structure not disturbed | PASS | `intro_hook → path_choice → eval_passage / crystal_seat_orientation_passage` preserved |

---

## CHANGES — EVIDENCE

### `supabase/migrations/202606290001_register_nine_roles_and_role_call_standing.sql` (created)

Single UPDATE on `measures_registry_root` using `metadata || jsonb_build_object(...)` to merge four new top-level keys without disturbing existing keys (encounter_structure, role_call_feature, etc.).

**`role_call_standing`** — system-level authorization rule:
- `rule`: `chambers_assemble_roles_authorize`
- `chamber_rule`: chambers assemble, do not own roles, may not invent roles, may not bypass role_call
- `role_call_rule`: defines what role_call governs (passages, agreements, resolutions, media, transitions, copy, submission, completion state)
- `absence_consequence`: documents what drifts when role_call is absent
- `required_order`: `EncounterBoundary → role_call → Chamber assembles → Role authorizes → Passage moves → Renderer manifests → Optics proves`
- `chamber_callable_families`: `["obsidian","lapis","marble"]`

**`native_role_registry`** — the nine roles:

| # | role_key | material_family | Function |
|---|---|---|---|
| 1 | obsidian_gatekeeper | obsidian | Authorizes whether an encounter may enter, continue, or remain held. |
| 2 | obsidian_examiner | obsidian | Authorizes assessment mechanics and evaluation passage. |
| 3 | obsidian_witness | obsidian | Authorizes what is recorded as encounter evidence. |
| 4 | lapis_guide | lapis | Authorizes guided movement between encounter states. |
| 5 | lapis_scribe | lapis | Authorizes copy, text, publication surfaces, and dispatch language. |
| 6 | lapis_steward | lapis | Authorizes secure participant handoff and contact passage. |
| 7 | marble_resolver | marble | Authorizes result state and what may be carried forward. |
| 8 | marble_cartographer | marble | Authorizes mapped pathway and next encounter direction. |
| 9 | marble_sealkeeper | marble | Authorizes whether standing is held, active, registered, or sealed. |

**`contract_term_restriction`**:
- `reserved_term`: `contract`
- `reserved_for`: `smart_contract`
- `permitted_alternatives`: `["agreement","resolution","boundary","requirement","role_call","passage"]`

**`legacy_implementation_field_mapping`** — five legacy fields classified, not renamed:

| Legacy Field | Native Standing | Status |
|---|---|---|
| `src_intake_contract` | secure passage intake requirement | legacy_implementation_field |
| `assessment_contact_capture_oar1_binding_contract_v1` | Lapis Steward contact passage requirement | legacy_implementation_field |
| `assessment_evaluation_report_contract_v1` | Marble Resolver result requirement | legacy_implementation_field |
| `active_contract_key_reconciliation` | active agreement reconciliation | legacy_implementation_field |
| `measures_registry_public_runtime_boundary_v1` | public encounter boundary | legacy_implementation_field |

---

## NOTCHAZZ FLAGS

None raised.

- Exactly nine roles registered, none invented
- Chamber ownership not asserted — `chamber_rule` explicitly states chambers do not own roles
- Contract term reserved only for smart_contract — `contract_term_restriction` seated
- FREE renderer not mutated — no src changes
- Legacy implementation field names preserved in DB (not renamed) — only classified
- Operator not governed

---

## NEXT

FREE repair may now proceed from native role authority.

Required order registered:
`EncounterBoundary → role_call → Chamber assembles → Role authorizes → Passage moves → Renderer manifests → Optics proves`

FREE currently renders by chamber assignment (steps 1 + 3 + 6). role_call (step 2) and role authorization (step 4) are not yet wired. FREE repair OAR defines that repair.

---

## WHAT THIS DOES NOT FIX

This OAR registers authority. It does not wire it.

FREE does not read `native_role_registry` or `role_call_standing`. No reader exists in the renderer. Chamber assignment alone still governs dispatch.

Unresolved gaps in FREE role resolution:

| Gap | Current FREE behavior | Required |
|---|---|---|
| `sectionCopy()` equivalent absent | Required field lists, consent field binding, contract reconciliation gate not DB-driven | Parse from encounter def metadata via native field names |
| Metadata key mismatch | `assessment_contact_capture_contract` (FREE) vs `assessment_contact_capture_oar1_binding_contract_v1` (DB) | Align key names or migrate DB fields to native keys |
| `activeContractKeyReconciliation` gate absent | FREE uses `mechanics.length > 0` as the only readiness check | Resolve active agreement reconciliation before rendering assessment |
| `publicRuntimeBoundary` not passed | `PublicAssessmentSurface` does not receive public encounter boundary | Pass resolved boundary from encounter def metadata |
| `routeCtaSurface` absent | No per-route CTA surface override | Evaluate whether DB-governed CTA override is required in FREE or transition nodes are sufficient |

These gaps are not raised as NotChazz. They are carry-forward items for the FREE repair OAR.
