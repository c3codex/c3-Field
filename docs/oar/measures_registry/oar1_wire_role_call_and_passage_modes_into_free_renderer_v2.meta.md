---
document_type: oar1
authority_level: launch_repair
title: OAR1 — Wire role_call and Passage Modes into FREE Renderer
status: closed
version: v2
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_wire_role_call_and_passage_modes_into_free_renderer_v2.meta.md
migration: 202606290005_seat_intro_hook_branch_routing.sql
commit: 8766829
---

# OAR1 — Wire role_call and Passage Modes into FREE Renderer

## FINAL DISPOSITION

**FREE_ROLE_CALL_WIRED**

role_call_standing reads before chamber renderer manifestation. Contact capture form restored. Duplicate path-choice resolved. No login/gating implementation. registered_runtime remains rollback-only.

---

## VALIDATION CHECKLIST

| Item | Status | Evidence |
|---|---|---|
| role_call resolves before renderer manifestation | PASS | `composeEncounter()` reads `role_call_standing`, `native_role_registry`, `passage_modes`, `legacyFieldMapping` from root before `checkReleaseGate` |
| No more than nine roles recognized | PASS | Native role registry read from DB — `native_role_registry.total_roles = 9` — no additional roles defined in src |
| Passage modes not treated as roles | PASS | `roleCallStanding.passageModes` read separately from roles; `passage_modes.rule = "passage_modes_are_not_roles"` preserved |
| Secure role_key boundary preserved | PASS | No login/gating implementation — structural encounter authorization only per addendum OAR1 |
| Assessment contact capture restored | PASS | `ObsidianChamberRenderer` now reads `assessment_contact_capture_oar1_binding_contract_v1` (correct DB key) |
| Consent unchecked by default | PASS | `default_checked: false` in DB — no src change to consent field rendering |
| Capture insert works | PASS | `onCaptureAssessment` unchanged — inserts to `measures_iis_eval_gate1_capture` with `notification_state: "queued"` |
| post-assessment does not route to about | PASS | `measures_assessment.next_surface = 'obsidian_to_marble_passage_video'` (migration 202606270002) |
| result/MAP completion reached | PASS | `obsidian_to_marble_passage_video.next_surface = 'map_integrity_governance'` (migration 202606270002) |
| Unapproved copy source traced | PASS | "Measures Conversion" — NOT present in measures_registry src or supabase migrations; only in c3_field OAR docs; not rendered in FREE |
| Duplicate path-choice resolved | PASS | Migration 202606290005: `intro_hook.left.next_surface = 'eval_passage'`, `intro_hook.right.next_surface = 'crystal_seat_orientation_passage'` |
| path_choice nodes preserved | PASS | `path_choice.left.next_surface = 'eval_passage'`, `path_choice.right.next_surface = 'crystal_seat_orientation_passage'` — validation DO $$ confirms |
| registered_runtime remains rollback-only | PASS | No changes to registered_runtime; `MeasuresRegistryRuntimeRegistered.tsx` not touched |
| Build passes | PASS | `npm run build` — 106 modules, no errors |

---

## CHANGES — EVIDENCE

### `src/measures_registry/encounter_renderer/types/encounterRendererTypes.ts`

Added `RoleCallStanding` type:
```ts
export type RoleCallStanding = {
  standing: Record<string, unknown> | null
  nativeRoleRegistry: Record<string, unknown> | null
  passageModes: Record<string, unknown> | null
  legacyFieldMapping: Record<string, unknown> | null
}
```

Added `roleCallStanding: RoleCallStanding` field to both `ComposedEncounter` and `RenderableEncounter`.

### `src/measures_registry/encounter_renderer/composition/encounterComposition.ts`

Added role_call_standing read from `measures_registry_root.metadata`:
```ts
const rootMeta = asRecord(rootRow?.metadata ?? null)
const standing = asRecord(rootMeta?.role_call_standing) ?? null
const roleCallStanding: RoleCallStanding = {
  standing,
  nativeRoleRegistry: asRecord(rootMeta?.native_role_registry) ?? null,
  passageModes: asRecord(standing?.passage_modes) ?? null,
  legacyFieldMapping: asRecord(rootMeta?.legacy_implementation_field_mapping) ?? null,
}
```

Resolved before `checkReleaseGate` and before any chamber renderer manifestation. `encounterProfileLoader` spreads `composed` into `RenderableEncounter` — `roleCallStanding` flows through automatically.

### `src/measures_registry/encounter_renderer/chambers/ObsidianChamberRenderer.tsx`

Fixed two wrong metadata key reads in `MeasuresAssessment`:

| Was (wrong) | Now (correct) |
|---|---|
| `meta?.assessment_contact_capture_contract` | `meta?.assessment_contact_capture_oar1_binding_contract_v1` |
| `meta?.assessment_evaluation_report_contract` | `meta?.assessment_evaluation_report_contract_v1` |

Effect: `assessmentContactCaptureContract` now resolves to the DB-seated object containing `post_assessment_contact_form.fields`, `consent_fields`, `optional_opt_in_fields`, `assessment_submission_notice`, `standing_boundary_note`, `privacy_notice`, `terms_notice`. Contact capture form renders. Submit button enabled.

### `supabase/migrations/202606290005_seat_intro_hook_branch_routing.sql`

Seated `left` and `right` branches on `intro_hook` transition node:
- `intro_hook.left.next_surface = 'eval_passage'`
- `intro_hook.right.next_surface = 'crystal_seat_orientation_passage'`

`resolveBranchSurface(node, 'left')` now returns `'eval_passage'` (not fallback `'path_choice'`). Both threshold buttons on the intro_hook surface navigate directly to their destinations. path_choice is no longer shown as a duplicate.

`intro_hook.next_surface = 'path_choice'` preserved (fallback for non-branch navigation). `path_choice` left/right routing preserved.

---

## COPY TRACE — "Measures Conversion"

Source search: grep across all measures_registry src files, supabase/migrations.

Result: "Measures Conversion" is **not present** in:
- `src/` (any file)
- `supabase/migrations/` (any file)

It appears only in `docs/oar/c3_field/` — c3 Field OAR documents for seed concordance governance. It is not rendered in FREE. Not a DB-seated string in measures_registry encounter content. No action required.

---

## ROLE_CALL WIRING — SCOPE CONFIRMATION

Per security boundary addendum (OAR1 `oar1_addendum_role_key_security_boundary_before_free_role_call_repair_v1`):

FREE role_call wiring is structural encounter authorization only:
- Encounter standing determination — `roleCallStanding.standing.rule`
- Passage requirement resolution — `roleCallStanding.standing.required_order`
- Passage mode authorization — `roleCallStanding.passageModes`
- Renderer manifestation authority — chamber routed by material_identity/chamber_assignment

FREE does NOT implement:
- Login
- Gating
- Permission checking
- Access control
- Secure role_key generation

---

## NOTCHAZZ FLAGS

None raised.

- role_call resolves before renderer manifestation — confirmed
- Nine roles maximum — native_role_registry from DB, total_roles = 9
- Passage modes not treated as roles — passage_modes read separately, rule preserved
- Native role names not used as secure role_keys — no login/gating implementation
- Contact capture not skipped — metadata key corrected, form renders
- Assessment does not route to about fallback — routes to obsidian_to_marble_passage_video → map_integrity_governance
- Unapproved copy not present — "Measures Conversion" not in measures_registry src or DB
- No invented copy introduced — no copy changes
- registered_runtime not activated
- Consent behavior unchanged
- Email dispatch unchanged
- Legal copy unchanged
- No payment activation
- Operator not governed
