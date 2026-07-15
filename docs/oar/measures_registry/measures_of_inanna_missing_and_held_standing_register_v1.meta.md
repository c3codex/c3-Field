---
document_type: missing_and_held_register
authority_level: working
document_scope: map_environment_measure
title: Measures of Inanna — Missing and Held Standing Register
status: filed
version: v1
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_measure_measures_of_inanna_operational_environment_v1.meta.md
executor: claude
observation_time: 2026-07-15
---

# Measures of Inanna — Missing and Held Standing Register

Consolidated register of everything confirmed missing, held, or unresolved across this OAR2's discovery. No item below is released, activated, or authorized by its presence in this register.

## Held encounter standing (by design, DB-confirmed)

| Unit | Held reason | Phase gate |
|---|---|---|
| Gates 4–7 | `held_by_phase_map` | Gate 4: 2026-05-16 anchor; Gate 5: 2026-06-14; Gate 6: 2026-07-14 (already past at observation time — see note below); Gate 7: 2026-08-12 |
| Epithets 4–6 | scheduled June Solstice release reverted pending active phase standing | June Solstice, 2026-06-21 (past at observation time) |
| Epithets 7–9 | initial explicit chamber planting | Lions Gate, 2026-08-08 |
| MEs 02–13 | `baseline_backfill_from_registry` | ME group phase anchors, 2026-04-01 through 2026-07-29 (several past at observation time) |

**Note:** several phase anchors above (`gate_6_anchor` 2026-07-14, `epithet_first_3_phased_ritual_release`/`epithet_next_3_june_solstice` 2026-06-21, ME group anchors through 2026-07-29) have already passed as of this OAR2's observation time (2026-07-15) while their registry rows remain `held`. This is recorded as an **observation, not a defect** — phase anchors are scheduling targets in `measures_phase_calendar`; whether a passed anchor should have triggered release is an Audit-phase question, not resolved here, since automatic release-on-anchor was not confirmed as live behavior in this pass (`gate_3_lapis_necklace`'s release reason is `automated_due_release`, suggesting *some* automation exists, but it was not traced end-to-end).

## Confirmed data-integrity gaps (this pass)

- `gate_4_breastplate`: `measures_registry.release_state = held` conflicts with `measures_release_state.release_state = released` — see risk report.
- `temple_antechamber_return`: no `measures_release_state` row found.
- `crystal_temple_home`, `temple_antechamber`, `temple_harrumuk_passage`: `access_state` differs between `measures_registry` and `measures_release_state` (`visible` vs `callable`).

## Confirmed orphaned surfaces (`c3_orphaned_surface_registry`, full table, 3 rows)

| Surface | State | Reason | Recommended action | Blocked |
|---|---|---|---|---|
| `cohort_conversion_encounter` | held | active/callable registry row, but flow superseded by governed pathway/MAP; no chamber directory binding seated | review | runtime + public |
| `measures_phases_reveal` | confirmed | `is_active: false`, deprecated | deprecate | runtime + public |
| `phase_payment` | confirmed | `is_active: false`, payment integration not seated in its originating OAR | deprecate | runtime + public |

None of these three are Measures-of-Inanna encounters — all are Measures Registry general-site surfaces, carried here because they were surfaced by the same live query pass.

## Missing surfaces (confirmed absent, not invented)

- **Artwork intake manifest** — no table or file inventories original-artwork provenance/rights separately from the runtime media map.
- **Dashboard read model** — no view/function joins branch + encounter + release/access + asset + evidence + FREE-readiness standing into one surface.
- **CI/deployment configuration** — no `.github/workflows/`, `vercel.json`, `netlify.toml`, or `wrangler.toml` found in this checkout for `dist-inanna`/`dist-registry`/`dist`.
- **Dedicated initiative registry table** — confirmed still absent, consistent with the source OAR2's own OBSERVED section; `new_moon_to_lions_gate_2026` continues to resolve only through `system_process_registry` + role/evidence contracts + OAR surfaces, not a standalone table.

## Unresolved seeded-reference standing

- "The 21 of Coherence" — no matching `concordance_term` row (only two 7-item Coherence sets are seated).
- "Thread-to-Transfer Validation Rule", "Seeded Reference Control", "Doc-Set Closeout Rule", "OAR Lifecycle — Execution and Handoff" — referenced as concepts inside other OAR docs, no standalone titled document confirmed.
- "DB to src Manifest — Measures of Inanna Exhibition" and "Measures Registry Operative Concordance Update" — not found under those exact titles.
- "Chazz Systems, Launch, and Research Advisor Role Profile" — not found anywhere outside this OAR2's own metadata.

## FREE admission — held, by design

`measures_of_inanna` runtime admission: `not_seated`, blocked on optics/evidence/trace/correction/AI-action-boundary/role contracts. `measures_of_inanna_role_contract` and `measures_of_inanna_evidence_contract` both confirmed `held`. This is discovery only — no admission state was changed.

## Public semantic vocabulary — held, by design

6 of 8 `c3_public_semantic_pairing` rows are `held` with `public_use_allowed: false`, including the pairing that maps "MAP continuation" to the public label "Measures Assessment Protocol." The 2 remaining rows are `blocked` guard rows preventing internal circuit-code leakage (`c1_c2_c3`, `direct_mapped_federated`) — held by design, not a gap.

## Known gap carried forward, not remediated here

`c3_oar_transition_event.actor` check constraint does not include `claude` — recorded in a prior OAR2's own execution evidence (migration `20260714214628_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.sql`) as an intentional, unpatched gap. Not addressed under this OAR2's bounded discovery scope.

## Priceless

No row for Priceless exists in `c3_registered_system` or any table queried in this pass. Confirmed successor-only; no promotion occurred.
