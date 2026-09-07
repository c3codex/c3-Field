---
document_type: evidence_index
authority_level: working
document_scope: map_environment_audit_authority_release_reconciliation
title: Measures of Inanna — Authority and Release Evidence Index (Reconciled)
status: filed
version: v2
supersedes_for_reference: measures_of_inanna_authority_release_evidence_index_v1.meta.md
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_reconcile_audit01_measures_of_inanna_authority_release_v1.meta.md
executor: claude
observation_time: 2026-07-15
---

# Measures of Inanna — Authority and Release Evidence Index (Reconciled)

Executor throughout: **Claude**, 2026-07-15. This index enumerates the complete governed file set for the Audit 01 line, its roles, and predecessor/successor relationships. No new evidence type was introduced beyond the cadence-denominator queries added by this reconciliation.

| File | Role | Predecessor | Authoritative standing after reconciliation |
|---|---|---|---|
| `oar2_audit_measures_of_inanna_authority_and_release_v1.meta.md` | Original Audit 01 request | — | historical, unchanged |
| `baseline_audit_measures_of_inanna_authority_and_release_v1.meta.md` | Preflight + authority-surface + schema evidence | — | **authoritative, unchanged** — not superseded |
| `measures_of_inanna_release_authority_precedence_map_v1.meta.md` | Runtime precedence trace + 12-question map | — | **authoritative, unchanged** — not superseded |
| `measures_of_inanna_phase_cadence_audit_v1.meta.md` | Original cadence audit | — | historical; denominator claim retired |
| `measures_of_inanna_phase_cadence_audit_v2.meta.md` | Reconciled cadence audit | v1 | **authoritative** for cadence population counts |
| `measures_of_inanna_release_discrepancy_audit_v1.meta.md` | Original Gate 4 / missing-row audit | — | historical; classification language superseded |
| `measures_of_inanna_release_discrepancy_audit_v2.meta.md` | Reconciled discrepancy audit | v1 | **authoritative** for Gate 4 / `return_antechamber` / `phase_map` / anon-exposure classification |
| `measures_of_inanna_access_semantics_audit_v1.meta.md` | Original access-semantics audit | — | historical; one finding's classification superseded |
| `measures_of_inanna_access_semantics_audit_v2.meta.md` | Reconciled access-semantics audit | v1 | **authoritative** for the `resolve_measures_next_step` finding's classification |
| `measures_of_inanna_authority_release_evidence_index_v1.meta.md` | Original evidence index | — | historical |
| `measures_of_inanna_authority_release_evidence_index_v2.meta.md` (this file) | Reconciled evidence index | v1 | **authoritative** |
| `measures_of_inanna_authority_release_findings_register_v1.meta.md` | Original findings register | — | historical; superseded by v2's one-primary-classification structure |
| `measures_of_inanna_authority_release_findings_register_v2.meta.md` | Reconciled findings register | v1 | **authoritative** |
| `oar1_audit_measures_of_inanna_authority_and_release_v1.meta.md` | Original Audit 01 closeout | — | historical |
| `audit01_measures_of_inanna_authority_release_closeout_manifest_v1.meta.md` | Original 10-file manifest | — | historical |
| `oar2_reconcile_audit01_measures_of_inanna_authority_release_v1.meta.md` | This reconciliation's request | — | current |
| `reconciliation_evidence_audit01_measures_of_inanna_authority_release_v1.meta.md` | Claim-by-claim reconciliation trace | — | **authoritative** |
| `oar1_reconcile_audit01_measures_of_inanna_authority_release_v1.meta.md` | This reconciliation's closeout | — | **authoritative** |
| `audit01_measures_of_inanna_authority_release_closeout_manifest_v2.meta.md` | Reconciled 19-file manifest | v1 | **authoritative** |

## New evidence gathered in this reconciliation pass (all live, 2026-07-15, all read-only)

| # | Evidence type | Method | Location | Verification standing |
|---|---|---|---|---|
| 1 | file_check | SHA-256/size/line-count re-verification of all 9 pre-existing Audit 01 files + this reconciliation OAR2 | reconciliation evidence file §1 | verified live, byte-identical to originals |
| 2 | db_query | `count(*)` and `group by phase_family` / `group by standing_type` on `measures_phase_calendar` | cadence audit v2 | verified live |
| 3 | db_query | `count(*)` of passed-anchor rows (`is_active=true and anchor_date <= current_date`) | cadence audit v2 | verified live |
| 4 | db_query | `count(*)` of `gate`/`epithet`/`me` registry rows (29), and of those with an explicit `measures_release_state` row (29) | cadence audit v2 | verified live |
| 5 | db_query | full row listing of held/sealed gate/epithet/me units with `phase_label` (21 rows) | cadence audit v2 | verified live |
| 6 | db_query | `count(*)` of rows whose `phase_label` exactly equals a `phase_key` (1) | cadence audit v2 | verified live |
| 7 | db_query | read-only re-execution of `reconcile_due_releases`'s own `due_units` predicate as a `SELECT` (0 rows) | cadence audit v2 | verified live, no mutation |

No evidence in this index was inferred from thread memory.
