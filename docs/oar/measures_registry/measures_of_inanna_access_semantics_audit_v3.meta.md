---
document_type: access_semantics_audit
authority_level: working
document_scope: audit01_documentary_correction_and_canopy_process_communication
title: Measures of Inanna — Access Semantics Audit (Corrected Wording)
status: filed
version: v3
supersedes_for_reference: measures_of_inanna_access_semantics_audit_v2.meta.md
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_correct_audit01_reconciliation_wording_and_record_canopy_delivery_issue_v1.meta.md
executor: claude
observation_time: 2026-07-15
correction_reason: v2 closed the foundational access-state finding with "unresolved_pending_operator_decision in effect," a phrase that reads as a second classification alongside the finding's stated primary (semantic_drift), weakening the one-primary-classification discipline this lineage has otherwise enforced. This file restates the same finding with an unambiguous single-classification structure. v1 and v2 remain preserved historical evidence; no fact or count changes here.
---

# Measures of Inanna — Access Semantics Audit (Corrected Wording)

`v1` ([`measures_of_inanna_access_semantics_audit_v1.meta.md`](measures_of_inanna_access_semantics_audit_v1.meta.md)) and `v2` ([`measures_of_inanna_access_semantics_audit_v2.meta.md`](measures_of_inanna_access_semantics_audit_v2.meta.md)) remain preserved historical evidence, unchanged. This file is authoritative only for the corrected classification wording below; the `resolve_measures_next_step` finding and the full term-by-term vocabulary table are unchanged from v2 and not repeated here — see v1/v2 for that content.

## Restored foundational access-state difference — corrected classification structure

- **Primary classification: `semantic_drift`.**
- **Evidence:** `measures_registry.access_state` and `measures_release_state.access_state` carry different values (`visible` vs. `callable`) for the same three restored foundational rows (`crystal_temple_home`, `temple_antechamber`, `temple_harrumuk_passage`).
- **Missing authority:** no schema comment, view logic, function, or migration establishes that this difference is intentional. Intent was not established either way.
- **Operator dependency:** determining whether this difference is deliberate (two genuinely distinct axes) or accidental (a copy/paste or dual-seeding artifact) requires an operator decision — no evidence gathered in Audit 01 or its reconciliation resolves it.

The missing-authority and operator-dependency statements above are **not additional primary classifications** — this finding carries exactly one primary classification (`semantic_drift`), consistent with every other finding in this lineage. The phrase `unresolved_pending_operator_decision in effect` is not used in this document.
