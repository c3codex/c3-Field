---
document_type: access_semantics_audit
authority_level: working
document_scope: audit01_literal_validation_correction
title: Measures of Inanna — Access Semantics Audit (Literal Validation Correction)
status: filed
version: v4
supersedes_for_reference: measures_of_inanna_access_semantics_audit_v3.meta.md
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_finalize_audit01_literal_validation_correction_v1.meta.md
executor: claude
observation_time: 2026-07-15
correction_reason: v3's closing sentence stated that the prohibited legacy classification token does not appear in that document, but the act of naming that token to disclaim it reproduced the token itself — a self-referential literal-validation failure. This file removes that closing sentence entirely; the token appears nowhere below. v1, v2, and v3 remain preserved historical evidence. No evidence, classification, count, or operational standing changed.
---

# Measures of Inanna — Access Semantics Audit (Literal Validation Correction)

`v1`, `v2`, and `v3` remain preserved historical evidence, unchanged. This file is authoritative for the foundational access-state finding's classification wording. The `resolve_measures_next_step` finding and the full term-by-term vocabulary table are unchanged from earlier versions and not repeated here.

## Restored foundational access-state difference — corrected classification structure

- **Primary classification: `semantic_drift`.**
- **Evidence:** `measures_registry.access_state` and `measures_release_state.access_state` carry different values (`visible` vs. `callable`) for the same three restored foundational rows (`crystal_temple_home`, `temple_antechamber`, `temple_harrumuk_passage`).
- **Missing authority:** no schema comment, view logic, function, or migration establishes that this difference is intentional. Intent was not established either way.
- **Operator dependency:** determining whether this difference is deliberate (two genuinely distinct axes) or accidental (a copy/paste or dual-seeding artifact) requires an operator decision — no evidence gathered in Audit 01 or its reconciliations resolves it.

The missing-authority and operator-dependency statements above are **not additional primary classifications** — this finding carries exactly one primary classification (`semantic_drift`).
