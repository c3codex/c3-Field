---
document_type: cadence_audit
authority_level: working
document_scope: map_environment_audit_authority_release_reconciliation
title: Measures of Inanna — Phase Calendar and Cadence Audit (Reconciled)
status: filed
version: v2
supersedes_for_reference: measures_of_inanna_phase_cadence_audit_v1.meta.md
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_reconcile_audit01_measures_of_inanna_authority_release_v1.meta.md
executor: claude
observation_time: 2026-07-15
correction_reason: v1's headline claim "21 of 22 governed phase anchors" used an unreconciled denominator, silently mixing anchor rows, governed units, held rows, and matching rows as if they were one population. This file replaces that single number with explicitly separated, reproducible populations. v1 remains preserved, unchanged.
---

# Measures of Inanna — Phase Calendar and Cadence Audit (Reconciled)

Every count below was produced by a fresh, read-only query, 2026-07-15, against the live database. No row is estimated or carried over from v1 without being independently reproduced here.

## Reconciled population table

| Population | Definition | Count |
|---|---|---|
| Total rows in `measures_phase_calendar` | all rows, any family | **17** |
| — grouped by `phase_family` | `calendar_anchor` / `epithet` / `gate` / `me` | **2 / 3 / 7 / 5** (sums to 17) |
| — grouped by `standing_type` | `anchor_only` / `confirmation_seal` / `phased_ritual_release` / `scheduled` | **1 / 1 / 8 / 7** (sums to 17) |
| Distinct Inanna-scoped registry units examined for cadence governance | `measures_registry` rows where `registry_family IN ('gate','epithet','me')` — this is the exact population `reconcile_due_releases` itself filters on | **29** (7 Gates + 9 Epithets + 13 MEs) |
| Distinct units (of the 29) with an explicit `measures_release_state` row | join on `registry_id` | **29** — all 29 have an explicit row (the two Measure-phase "missing release-state row" units, `phase_map` and `return_antechamber`, belong to the `spine` family, not `gate`/`epithet`/`me`, and are outside this population entirely) |
| Distinct cadence-governed units (of the 29) currently `held` or `sealed` in `measures_release_state` | `rs.release_state IN ('held','sealed')` | **21** — Epithets 4–9 (6), Gates 5–7 (3), MEs 02–13 (12) |
| Distinct rows (of the 29) whose live `phase_label` exactly equals a `measures_phase_calendar.phase_key` | string-equality join | **1** — `gate_3_lapis_necklace` only (`phase_label = "gate_3_anchor"`) |
| Distinct rows eligible under the full `reconcile_due_releases` predicate (`release_state IN ('held','sealed')` AND `access_state = 'gated'` AND `phase_label` joins to an active, passed `phase_key`) | live re-execution of the function's own `due_units` CTE logic as a read-only SELECT | **0** — the one row that could ever match (`gate_3_lapis_necklace`) is no longer `held`/`sealed` (it was already released), so the predicate currently returns an empty set |
| Passed-anchor rows in `measures_phase_calendar` (`is_active = true AND anchor_date <= 2026-07-15`) | calendar rows only, independent of any registry join | **12** of 17 |
| Passed-anchor rows that can actually join and become eligible for a currently-held unit | intersection of "passed" and "join succeeds for a held row" | **0** — confirmed by the same empty-set query above |
| Rows (of the 21 held/sealed units) that cannot be mapped to a calendar row **at all**, for lack of any candidate string | `phase_label IS NULL` | **15** — Gates 5–7 (3) + MEs 02–13 (12) |
| Rows (of the 21) that carry a human-readable `phase_label` with a **plausible but unproven** candidate calendar mapping | `phase_label IS NOT NULL` and does not exactly match any `phase_key` | **6** — Epithets 4–6 (`phase_label: "June Solstice"`, plausible candidates `epithet_next_3_june_solstice` or `epithet_first_3_phased_ritual_release`, both anchored `june_solstice` 2026-06-21 — genuinely ambiguous between the two without an authoritative decision) and Epithets 7–9 (`phase_label: "Lions Gate"`, plausible candidate `epithet_last_3_lions_gate`, anchored `lions_gate` 2026-08-08, not yet passed) |

**`21 of 22` is retired as an unsupported prior denominator.** It cannot be independently reproduced: 21 correctly identifies the held/sealed Gate/Epithet/ME count, but "22" does not correspond to any single population above — it does not equal the calendar row count (17), the governed-unit count (29), the passed-anchor count (12), or any other reproduced figure. v1's phrasing conflated at least two different populations into one ratio. No replacement ratio is asserted in its place; the table above stands on its own.

## Automation mechanism (unchanged from v1, re-confirmed)

`reconcile_due_releases` (active pg_cron job, `jobid 1`, `5 0 * * *`) joins `measures_release_state.phase_label = measures_phase_calendar.phase_key`. This audit independently re-executed the function's own `due_units` CTE as a read-only `SELECT` (not the mutating function itself) and reproduces the same result the function's logic would: **0 rows currently eligible**, because the only row whose `phase_label` ever matched a `phase_key` (`gate_3_lapis_necklace`) has already been released and is no longer in the held/sealed population.

## Classification (per reconciliation OAR2's required standing)

**Primary classification: `active_defect`.** The join-key format mismatch between `measures_release_state.phase_label` and `measures_phase_calendar.phase_key` is confirmed, reproducible, and independent of any denominator dispute — 15 of 21 held units have no `phase_label` at all, and the remaining 6 have labels that do not exactly match any calendar row. This holds regardless of how the overall population is counted or described.

**Evidence qualifiers:** `database_confirmed` (function body + live re-execution of its predicate as a read-only query).

**Recommended next phase:** `bounded_remediation_OAR2` (align the join-key format, or replace the bare string join with an explicit mapping/FK) — not performed here.

**Operator decision required:** whether to (a) rewrite the 21 held rows' `phase_label` values to match `phase_key` format, (b) change the join itself to a more robust mapping, or (c) decide the 6 ambiguous Epithet rows' intended calendar association before either fix is applied.

**Prohibited premature action:** no `phase_label` or `phase_key` value was changed. No row was released. No migration was applied.
