---
document_type: oar1
authority_level: working
title: OAR1 — Seed IntroHookSeat Metadata Alignment
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_seed_introhookseat_metadata_alignment_v1.meta.md
commit: c016c3d
---

# OAR1 — Seed IntroHookSeat Metadata Alignment

## OBJECTIVE

Seed `intro_copy` into `ai_isnt_broken_intro` encounter_def metadata.
Align with `IntroHookSeat` renderer contract. Preserve all existing metadata keys.

---

## FILE CHANGED

| File | Change |
|---|---|
| `supabase/migrations/202606260002_seed_introhookseat_intro_copy.sql` | Created — `jsonb ||` merge adds `intro_copy` to `measures_encounter_def.metadata` |

---

## VALIDATION

### 1. ai_isnt_broken_intro remains active

`is_active: true` — PASS

### 2. ai_isnt_broken_intro remains released

`release_state: released` — PASS

### 3–7. intro_copy fields present

| Field | Value |
|---|---|
| `headline` | AI Isn't Broken. Systems Are. |
| `subheadline` | Optimization cannot occur in environments that lack Governed System Integrity. |
| `body` | Measures Registry helps organizations identify structural drift, understand system integrity, and prepare for optimized AI deployment. |
| `cta` | Assess the Environment |
| `supporting_copy` | The goal is not more tools. The goal is governable environments. |

All 5 fields present — PASS

### 8. Existing metadata keys preserved

Pre-mutation key count: 29. Post-mutation key count: 30.
All 29 original keys confirmed present via `jsonb_object_keys` validation query after push.

`||` merge operator: adds `intro_copy` at top level, does not overwrite any existing key. PASS

### 9. No renderer code changed

No TypeScript files modified. PASS

### 10. No routes changed

No migration rows touched in `measures_transition_rule` or `measures_registry`. PASS

### 11. FREE can render IntroHookSeat without frontend inference

`IntroHookSeat` reads `encounterDef.metadata.intro_copy.headline`, `.subheadline`, `.cta`.

These are now seated. Renderer will resolve from DB state. No inference path added. PASS

---

## NOTCHAZZ FLAGS

None raised.

- Content matches approved copy from OAR2 exactly — nothing invented
- Existing metadata merged, not overwritten
- Registry standing unchanged
- No route behavior changes
- No renderer logic changes
- No FREE inference added
- No unrelated content seeded
- Operator not governed

---

## CLOSE

`intro_copy` is seated.

`IntroHookSeat` can now resolve headline, subheadline, body, cta, and supporting_copy from DB without fallback.

Nothing is invented.

Commit: c016c3d
