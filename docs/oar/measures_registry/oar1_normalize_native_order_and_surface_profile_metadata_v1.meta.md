---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Normalize Native Order and Surface Profile Metadata
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_normalize_native_order_and_surface_profile_metadata_v1
---

# OAR1 - Normalize Native Order and Surface Profile Metadata

## EXECUTION METHOD

Two-part execution:

1. **Native order normalization** — documentation only. No migration. No source change.
2. **Profile metadata assignments** — already applied by migration `202606300009_seat_surface_profile_metadata_assignments.sql` in the concurrent OAR2 execution (`oar2_seat_surface_profile_metadata_assignments_v1`). No new migration created to avoid duplication.

---

## PART 1 — NATIVE ORDER NORMALIZATION

### Prior shorthand (stale)

```
Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src
```

This shorthand mixed native order layers with systems-layer execution bodies.

### Seated native order (normalized)

```
Codex    -Holds->
Systems  -Aligns->
Measures -Allows->
Field    -Arranges->
Roles    -Authorize->
Optics   -Prove->
FREE     -Renders
```

**Top-down:**

- Codex holds truth.
- Systems align execution.
- Measures allows valid operation.
- Field arranges relation.
- Roles authorize bounded action.
- Optics prove what occurred.
- FREE renders seated state.

**Bottom-up:**

- FREE renders only what is seated.
- Optics prove action.
- Roles authorize action.
- Field arranges relation.
- Measures allows passage.
- Systems align operation.
- Codex holds standing.

### Systems boundary seated

OAR2, Chazz, and Cody are **systems-layer execution bodies contained inside Systems**.

They are not separate authority layers beside native order.

Systems aligns execution to Codex-held standing, Measures-allowed operation, Field-arranged relation, role-authorized action, Optics-proven trace, and FREE-rendered output.

Systems does not invent truth.

### Collapse condition documented

Collapse occurs when relation breaks, standing drifts, roles exceed boundary, or proof is absent.

When the order holds, the system does not collapse to move.

---

## PART 2 — PROFILE METADATA ASSIGNMENTS

### Status

**Already applied.** Migration `202606300009_seat_surface_profile_metadata_assignments.sql` executed via `npx supabase db push` (exit code 0) in the concurrent OAR1 (`oar1_seat_surface_profile_metadata_assignments_v1`).

The UPDATE SQL in this OAR2's SAFE PROFILE METADATA ASSIGNMENTS section is identical to what was applied in 202606300009. No duplicate migration created.

### Confirmed seated profile state

| surface_key | profile | status |
|---|---|---|
| `path_choice` | `crystal_split_path_choice` | ✓ applied by 202606300009 |
| `about_measures_registry` | `crystal_about_surface` | ✓ applied by 202606300009 |
| `eval_passage` | `obsidian_full_bleed_video` | ✓ applied by 202606300009 |
| `structural_coherence_explainer` | `obsidian_full_bleed_video` | ✓ applied by 202606300009 |
| `measures_assessment` | `obsidian_assessment_surface` | ✓ applied by 202606300009 |
| `obsidian_to_marble_passage_video` | `obsidian_to_marble_passage` | ✓ applied by 202606300009 |
| `map_integrity_governance` | `marble_map_cards` | ✓ applied by 202606300009 |
| `structural_drift_dispatches` | `lapis_publication_surface` | ✓ applied by 202606300009 |
| `publication_dispatch` | `lapis_publication_surface` | ✓ applied by 202606300009 |

### Gap profiles — not assigned

Per OAR2 DO NOT TOUCH list, the following remain unseated:

- `assessment_scrollable_form`
- `report_result_gate`
- `legal_reading_surface`
- `governed_footer`
- `intro_hook`
- `intro`

These require future surface/profile seating decisions.

---

## VALIDATION CHECKLIST

| Item | Status |
|---|---|
| OAR2 file seated | ✓ |
| Native order normalized | ✓ (Part 1) |
| Systems contains OAR2, Chazz, Cody | ✓ (Part 1) |
| Stale shorthand retired | ✓ |
| FREE named as active render authority | ✓ |
| src treated as implementation location only | ✓ |
| Profile metadata assignments seated | ✓ (via 202606300009 — no duplicate migration) |
| No new tables created | ✓ |
| No CSS refactor | ✓ |
| No visual redesign | ✓ |
| No report copy changes | ✓ |
| No scoring changes | ✓ |
| No payment / Stripe changes | ✓ |
| registered_runtime remains retired | ✓ |
| OAR1 written beside OAR2 | ✓ |

---

## FINAL DISPOSITION

**SEATED** — Native order normalized. Systems boundary documented. Profile metadata assignments confirmed as seated by prior concurrent migration.

No visual, scoring, payment, report, or route mutations occurred.

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.
