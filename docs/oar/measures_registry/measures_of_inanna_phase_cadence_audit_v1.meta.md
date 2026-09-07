---
document_type: cadence_audit
authority_level: working
document_scope: map_environment_audit_authority_release
title: Measures of Inanna — Phase Calendar and Cadence Audit
status: filed
version: v1
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_audit_measures_of_inanna_authority_and_release_v1.meta.md
executor: claude
observation_time: 2026-07-15
---

# Measures of Inanna — Phase Calendar and Cadence Audit

Governed audit evidence for OAR2 ROUTED section 9. This is the single most consequential finding of Audit 01.

## Automation mechanism (confirmed)

A pg_cron job (`jobid: 1`, schedule `5 0 * * *`, i.e. 00:05 daily, `active: true`) runs `select * from public.reconcile_due_releases(current_date);`. This **is** the "automatic release authority" the Measure phase asked about — confirmed to exist and be active.

`reconcile_due_releases`'s logic (read from its live function definition):

```
due_phase_keys := phase_key FROM measures_phase_calendar WHERE is_active = true AND anchor_date <= run_date
due_units := registry rows JOIN measures_release_state rs JOIN due_phase_keys
             ON due_phase_keys.phase_key = rs.phase_label
             WHERE registry_family IN ('gate','epithet','me')
               AND rs.release_state IN ('held','sealed')
               AND rs.access_state = 'gated'
-- then UPDATEs those rows to release_state='released', access_state='visible'
```

## Confirmed active defect: the join key never matches for held units

`measures_release_state.phase_label` (human-readable labels, e.g. `"June Solstice"`, `"Lions Gate"`) and `measures_phase_calendar.phase_key` (machine keys, e.g. `"epithet_next_3_june_solstice"`, `"gate_5_anchor"`) are **different vocabularies with no shared format** — there is no foreign key between them, and the join in `reconcile_due_releases` is a bare string-equality comparison.

Live comparison, 2026-07-15, of every currently-held Gate/Epithet/ME row's `phase_label` against every `measures_phase_calendar.phase_key`:

| Registry key | `measures_release_state.phase_label` | Matches a `phase_key`? |
|---|---|---|
| `chamber_epithets_04_lady_of_the_largest_heart`, `_05_spiritus_stellaris`, `_06_concursus_cubicali` | `"June Solstice"` | **No.** Nearest calendar rows are `epithet_next_3_june_solstice` and `epithet_first_3_phased_ritual_release` (both anchored `june_solstice`, 2026-06-21, already passed) — neither string equals `"June Solstice"`. |
| `chamber_epithets_07_aphrodite`, `_08_the_last_oracle`, `_09_she_who_rises_with_the_dog_star` | `"Lions Gate"` | **No.** Nearest calendar row is `epithet_last_3_lions_gate` (anchored `lions_gate`, 2026-08-08, not yet passed at observation time). |
| `gate_5_measuring_rod`, `gate_6_golden_bracelet`, `gate_7_robe` | `null` | **No — cannot match anything, `NULL` never equals a string.** |
| `me_02` through `me_13` (all 12) | `null` | **No — same as above.** |

**The only row anywhere in the Inanna-scoped set whose `phase_label` exactly equals a `phase_key` is `gate_3_lapis_necklace`, with `phase_label = "gate_3_anchor"`, which equals `measures_phase_calendar.phase_key = "gate_3_anchor"` exactly.** This is confirmed by Gate 3's own `release_reason: "automated_due_release"` (recorded when it actually was released this way) and by the fact that no other Inanna-scoped row carries a machine-format `phase_key`-style `phase_label`.

**Conclusion: `reconcile_due_releases` has functioned exactly once for the entire Measures of Inanna environment (Gate 3), by coincidence of matching string format, and cannot currently release any other held Gate, Epithet, or ME — not because their anchors haven't arrived, but because the join key that would surface them to the automation never matches.** Several of the relevant calendar anchors have already passed (`gate_5_anchor` 2026-06-14, `gate_6_anchor` 2026-07-14, `epithet_next_3_june_solstice`/`epithet_first_3_phased_ritual_release` 2026-06-21, four of five `me_group_*` anchors) while the daily job continues to run and silently find nothing to do for them.

**Classification: `active_defect`, evidence qualifiers `database_confirmed` (function body + live data comparison). This is a schema/data-format defect (label vocabularies never aligned), not a business-logic bug in the release conditions themselves** — the conditions (`release_state IN ('held','sealed')`, `access_state = 'gated'`) are reasonable; only the join key is broken.

## Full phase inventory (17 rows, `measures_phase_calendar`, all `is_active: true`)

| phase_key | phase_family | anchor_name | anchor_date | passed as of 2026-07-15? | governed unit(s) | current registry/release-state standing | discrepancy |
|---|---|---|---|---|---|---|---|
| `gate_1_phased_ritual_release` | gate | new_moon | 2026-01-01 | yes | Gate 1 | released | none — Gate 1 was released manually/by seed, not traced to this specific anchor row via a matching phase_label |
| `gate_2_phased_ritual_release` | gate | new_moon | 2026-02-01 | yes | Gate 2 | released | same as above |
| `gate_3_anchor` | gate | new_moon | 2026-04-17 | yes | Gate 3 | released, `release_reason: automated_due_release` | **the one working match** |
| `gate_4_anchor` | gate | new_moon | 2026-05-16 | yes | Gate 4 | released_state conflict (see discrepancy audit); `phase_label: null` on its release-state row — not linked to this anchor via the automation at all |
| `gate_5_anchor` | gate | new_moon | 2026-06-14 | yes | Gate 5 | held; `phase_label: null` | **automation cannot see this row — anchor passed 31 days ago as of observation** |
| `gate_6_anchor` | gate | new_moon | 2026-07-14 | yes (1 day) | Gate 6 | held; `phase_label: null` | **automation cannot see this row** |
| `gate_7_anchor` | gate | new_moon | 2026-08-12 | no | Gate 7 | held; `phase_label: null` | not yet due regardless |
| `epithet_first_3_phased_ritual_release` | epithet | june_solstice | 2026-06-21 | yes | Epithets 1–3 | released (Spring Equinox reasons, unrelated phase_label) | Epithets 1-3 were already released under a different `phase_label` ("Spring Equinox") before this anchor; not caused by this anchor |
| `epithet_next_3_june_solstice` | epithet | june_solstice | 2026-06-21 | yes | Epithets 4–6 | held; `phase_label: "June Solstice"` | **string-format mismatch, automation cannot see these rows — anchor passed 24 days ago** |
| `epithet_last_3_lions_gate` | epithet | lions_gate | 2026-08-08 | no | Epithets 7–9 | held; `phase_label: "Lions Gate"` | not yet due; would still mismatch even if due |
| `me_group_1_phased_ritual_release` | me | full_moon | 2026-04-01 | yes | (unclear which MEs) | ME 01 released, ME 02+ held | ME 01's release_reason is `session_19_me_01_live_alignment`, not tied to this anchor's phase_label either |
| `me_group_2_phased_ritual_release` | me | full_moon | 2026-05-01 | yes | — | MEs 02+ held; `phase_label: null` | **automation cannot see these rows** |
| `me_group_3_phased_ritual_release` | me | full_moon | 2026-05-31 | yes | — | held; `phase_label: null` | same |
| `me_group_4_phased_ritual_release` | me | full_moon | 2026-06-29 | yes | — | held; `phase_label: null` | same |
| `me_group_5_phased_ritual_release` | me | full_moon | 2026-07-29 | no | — | held; `phase_label: null` | not yet due regardless |
| `september_equinox_anchor` | calendar_anchor | september_equinox | 2026-09-22 | no | none (anchor-only) | n/a | n/a |
| `winter_solstice_confirmation` | calendar_anchor | winter_solstice | 2026-12-21 | no | none (confirmation-seal) | n/a | n/a |

**Answer to the Measure phase's open question ("does a passed anchor imply required action"):** the seated cadence law (as implemented in `reconcile_due_releases`) *does* intend automatic release for `gate`/`epithet`/`me` rows once their anchor passes — that is the function's entire purpose, and it is actively scheduled. But **the join it depends on is broken for every row except Gate 3**, so passed anchors are not currently producing the release action the automation was built to perform. This is a `prepare_requirement`-adjacent `active_defect`: fixing the join (not the release logic) would let the existing, already-scheduled automation begin working as designed — a decision squarely for the operator, not performed here.

Anchor classification (per OAR2 instruction to classify, not assume): `informational schedule` — no; the automation function's existence and active cron schedule prove intent beyond informational. `eligibility threshold` — yes, this is exactly what the (broken) join is meant to test. `automatic release authority` — yes, by design, though not functioning for 21 of 22 governed anchors. `operator-review trigger` — no separate review-trigger mechanism was found.
