---
document_type: oar1
authority_level: working
document_scope: map_environment_measure_reconciliation
title: OAR1 — Reconcile Measures of Inanna Measure Evidence
status: closed
version: v1
operator: op044
system: measures_registry
target_environment: measures_of_inanna
initiative_key: new_moon_to_lions_gate_2026
map_phase: measure
executor: claude
source_oar2: docs/oar/measures_registry/oar2_reconcile_measures_of_inanna_measure_evidence_v1.meta.md
observation_time: 2026-07-15
completion_decision: measure_complete_with_held_audit_findings
---

# OAR1 — Reconcile Measures of Inanna Measure Evidence

## Execution standing

Executed in full, read-only, single session, 2026-07-15. All four original conflicts named in the reconciliation OAR2's OBSERVED section were investigated and resolved (corrected, not merely re-asserted). All 13 ROUTED steps addressed. No original evidence file was altered. Six new successor files were written.

## Exact registry-family counts

`chamber_directory: 6`, `epithet: 9`, `gate: 7`, `me: 13`, `spine: 103`. Sum = 138 = total row count. Validation equation resolves exactly. (v1 had claimed `spine: 114`, which was wrong; no query in this reconciliation reproduces that figure.)

## Unique pairing total

**64**, proven by recursive graph-reachability from `crystal_temple_home` over active-only `measures_transition_rule` edges — an entirely different derivation from v1's category-additive method, which was unsound (it double-counted `kumurrah_passage` and `phase_map`, omitted `antechamber` and `return_antechamber`, and landed on 64 by coincidence rather than proof). The number is unchanged; the proof is not the same proof, and v1's proof is retracted.

## Passage-family totals

28 total: 3 foundational (`harrumuk_passage`, `kumurrah_passage`, `temple_harrumuk_passage`), 4 Gate-family, 8 Epithet-family, 12 ME-family, 1 return passage (`return_antechamber`). `phase_map` is classified as router, not passage, and is accounted separately. v1's implicit 26 omitted `temple_harrumuk_passage` and `return_antechamber`.

## Phase Map target totals

30 outbound rules, all active, all `return`-kind: 7 Gates + 9 Epithets + 13 MEs (all 29, zero missing, zero duplicate) + 1 foundational (`temple_harrumuk_passage`). v1's claimed 24 is corrected to 30.

## Temple semantic standing

The legacy `temple` registry row and its `temple_inanna_view` encounter def are proven retired (inactive, and their one transition rule is `rule_state: inactive`). The architectural claim that "Temple" as a native container role is itself retired is **not** proven by this evidence and is classified source-defined / DB-reconciliation-pending, correcting v1's conflation of the two claims.

## Corrected runtime/public claim standing

"Foundational loop confirmed live" is replaced with "confirmed in live database standing" — no browser/runtime traversal was independently verified in this or the original pass. Held public-semantic-pairing standing is restated to distinguish DB authority (held) from deployed public use (not traced).

## Preserved Audit findings

All 11 v1 risks preserved unless disproven (none were). One v1 finding was corrected as misattributed (`temple_antechamber_return` vs. `return_antechamber` release-state confusion — see risk report v2). Six new findings were added: the v1 arithmetic error itself, the v1 drafting-residue artifact, the v1 unproven-pairing-method finding, `phase_map`'s missing release-state row, five registry rows orphaned from the transition graph, and the Phase Map/passage undercounts (see `measures_of_inanna_environment_risk_report_v2.meta.md` for the full table).

## Generated reconciliation files

1. `docs/oar/measures_registry/measures_of_inanna_operational_map_v2.meta.md`
2. `docs/oar/measures_registry/measures_of_inanna_measure_evidence_index_v2.meta.md`
3. `docs/oar/measures_registry/measures_of_inanna_environment_risk_report_v2.meta.md`
4. `docs/oar/measures_registry/reconciliation_evidence_measure_measures_of_inanna_v1.meta.md`
5. `docs/oar/measures_registry/measure_measures_of_inanna_closeout_manifest_v1.meta.md`
6. `docs/oar/measures_registry/oar1_reconcile_measures_of_inanna_measure_evidence_v1.meta.md` (this file)

This file's own hash (computed after write, for the record): bytes and SHA-256 are not self-referential at write time; per the closeout manifest's own note, a file cannot contain its own post-write hash. This file's size/line-count/hash can be computed by the operator or a future pass exactly as every other file in this set was (`sha256sum`, `wc -c`, `wc -l`), and it is expected to match whatever is recorded in `git log`/`git show` for this commit going forward.

## Fourteen-file closeout-manifest result

**Complete.** 14 expected, 14 found, 0 missing, 0 unexpected. See `measure_measures_of_inanna_closeout_manifest_v1.meta.md` for the full per-file table (bytes/lines/SHA-256 for 13 of 14 files; this OAR1 and the manifest itself are the two files that cannot list their own hash for the structural reason above).

## Reconciliation OAR1 path

`docs/oar/measures_registry/oar1_reconcile_measures_of_inanna_measure_evidence_v1.meta.md` — matches the source reconciliation OAR2's `EXPECTED OAR1` path exactly.

## No-mutation confirmation

No database row was inserted, updated, or deleted. No migration was applied. No RLS policy was changed. No original Measure evidence file (the 7 files plus the source Measure OAR2) was overwritten or altered. Only the 6 reconciliation files listed above were written.

## Measure completion decision

**`measure_complete_with_held_audit_findings`.**

Justification against the reconciliation OAR2's own criteria for this standing:
- Inventory arithmetic is exact (138 = 6+9+7+13+103).
- Unique pairing derivation is proven (64, via reproducible graph reachability, not category addition).
- Phase Map transition description is exact (30 rules, target breakdown listed with zero missing/duplicate against the 29-unit Gate/Epithet/ME set).
- Temple semantics are corrected (legacy row vs. architectural role now distinguished).
- DB and browser evidence remain distinct (explicit wording correction applied).
- Semantic DB standing and deployed public use remain distinct (explicit wording correction applied).
- All 14 files are verified present per the closeout manifest.
- No operational mutation occurred.

Held Audit findings (the `gate_4_breastplate` conflict, the five transition-graph-orphaned rows, `phase_map`'s and prior missing release-state rows, and the remaining items in the risk report) are accurately recorded and no longer distort the inventory — they are held for the Audit phase, not blockers to declaring Measure complete.

## Limitations

- Reachability was computed from `measures_transition_rule` only; this does not rule out an unmodeled resolver-level route to any of the five orphaned rows.
- Browser/runtime verification remains out of scope for both Measure passes.
- The architectural Temple-role question is explicitly left open, per instruction, rather than resolved from an inactive legacy key.
