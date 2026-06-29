---
document_type: oar1
authority_level: architecture
title: OAR1 — Register Passage Modes for role_call Standing
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_register_passage_modes_for_role_call_standing_v1.meta.md
migrations:
  - 202606290002_register_passage_modes_under_role_call_standing.sql
  - 202606290003_register_passage_mode_authorities_and_update_encounter_order.sql
---

# OAR1 — Register Passage Modes for role_call Standing

## FINAL DISPOSITION

**PASSAGE_MODES_REGISTERED**

Three passage modes registered under role_call standing. Typical authorities seated per mode. Encounter order updated to include Passage mode carries. No frontend mutation. No FREE repair.

---

## VALIDATION CHECKLIST

| Item | Status | Evidence |
|---|---|---|
| passage_modes registered under role_call_standing | PASS | `measures_registry_root.metadata.role_call_standing.passage_modes.rule = "passage_modes_are_not_roles"` — migration 002 |
| Exactly three passage modes registered | PASS | `human_touch`, `AI_touch`, `secure_passage` — count confirmed in migration DO $$ blocks |
| No additional passage modes created | PASS | Exactly three keys under `passage_modes.modes` |
| Passage modes not classified as roles | PASS | `passage_modes.rule = "passage_modes_are_not_roles"` explicit |
| Passage modes require role_call | PASS | `authorization_rule` seated: "passage modes must be authorized by role_call — a passage mode may not authorize itself — a renderer may not infer a passage mode without role_call" |
| Typical authorities per mode | PASS | `typical_authorities` arrays seated on all three modes — migration 003 |
| Updated encounter order registered | PASS | `required_order` updated to 8 steps including "Passage mode carries" — migration 003 |
| No FREE renderer mutation | PASS | No src changes — migrations only |
| No styling mutation | PASS | No src changes — migrations only |
| Migration validation passes | PASS | `supabase db push` — both migrations applied without error, DO $$ blocks executed |
| role_call_standing.rule preserved | PASS | `chambers_assemble_roles_authorize` preserved across both migrations |

---

## CHANGES — EVIDENCE

### `supabase/migrations/202606290002_register_passage_modes_under_role_call_standing.sql`

Seated `role_call_standing.passage_modes` via `jsonb_set` on `measures_registry_root`:
- `rule`: `passage_modes_are_not_roles`
- `authorization_rule`: passage modes require role_call, may not self-authorize, renderer may not infer without role_call
- Three modes: `human_touch`, `AI_touch`, `secure_passage` — each with `mode_key` and `description`

### `supabase/migrations/202606290003_register_passage_mode_authorities_and_update_encounter_order.sql`

Added `typical_authorities` to each mode and updated `required_order`:

| Mode | Typical Authorities |
|---|---|
| `human_touch` | lapis_guide, lapis_steward, marble_sealkeeper |
| `AI_touch` | obsidian_examiner, marble_resolver, marble_cartographer |
| `secure_passage` | obsidian_gatekeeper, lapis_steward, marble_sealkeeper |

Updated `required_order` from 7 steps to 8:
```
EncounterBoundary
  → role_call
  → Chamber assembles
  → Role authorizes
  → Passage mode carries     ← added
  → Passage moves
  → Renderer manifests
  → Optics proves
```

---

## NOTCHAZZ FLAGS

None raised.

- Passage modes not classified as roles — `passage_modes_are_not_roles` rule explicit
- No self-authorization — `authorization_rule` seated
- Exactly three passage modes — no additional modes invented
- FREE renderer not mutated
- No contract terminology reintroduced
- Operator not governed

---

## WHAT THIS DOES NOT FIX

Same state as prior OAR. This OAR registers passage mode carrying authority. It does not wire it.

FREE does not read `passage_modes`. Chamber renderers do not resolve passage modes before manifesting. Typical authority lists are registered as architectural record — no enforcement exists in the renderer yet.

FREE repair OAR defines that wiring.
