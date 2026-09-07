---
document_type: access_semantics_audit
authority_level: working
document_scope: map_environment_audit_authority_release
title: Measures of Inanna — Access Semantics Audit
status: filed
version: v1
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_audit_measures_of_inanna_authority_and_release_v1.meta.md
executor: claude
observation_time: 2026-07-15
---

# Measures of Inanna — Access Semantics Audit

Governed audit evidence for OAR2 ROUTED section 10. No term is normalized in this pass.

## Term-by-term standing

| Term | Table/column | Allowed-value source | Consumers observed | Distinction from neighbors |
|---|---|---|---|---|
| `visible` | `measures_registry.access_state`, `measures_release_state.access_state` | check constraint (both tables, same 5-value set) | `reconcile_due_releases` **sets** this value on automated release; `resolve_measures_next_step` **requires** this exact value; `v_measures_registry_public_released_active_read` RLS policy does not reference it; `v_measures_phase_map_nodes_v1`/`v_phase_map_nodes` treat it as a distinct "visible" node_state, separate from "open" (`encounterable`/`callable`) | Treated by the phase-map node views as **less-interactive than `encounterable`/`callable`** (`is_interactive` is true for `encounterable`/`callable`/`visible` together, but `node_state` maps `visible` to its own bucket, `encounterable`/`callable` to `'open'`) — i.e. these two views **do** encode `visible` as semantically distinct from `encounterable`/`callable`, contradicting a simpler "all non-held states are equivalent" reading |
| `callable` | same two columns | same constraint | `resolve_phase_map_outbound` accepts `callable` as enterable; phase-map node views group it with `encounterable` as `'open'` | See above |
| `encounterable` | same two columns | same constraint | `resolve_phase_map_outbound` accepts as enterable; `v_measures_release_surface_v1` treats it as one of three access values that make a surface renderable | Functionally near-identical to `callable` in every consumer observed except the phase-map node views' `is_interactive` grouping (which includes both) |
| `gated` | same two columns | same constraint; is the column **default** on `measures_registry.access_state` | `v_measures_release_surface_v1` explicitly excludes this from renderable; `reconcile_due_releases` requires this as the *starting* value before automated release | Clear, consistently-enforced "blocked" state across every consumer examined |
| `held` | `measures_registry.release_state`, `measures_release_state.release_state` (NOT an access_state value — confirmed by the check constraint: `release_state` allows `{sealed, held, released, open, closed}`, `access_state` allows `{gated, visible, callable, encounterable, archived}` — these are two **disjoint** vocabularies, never overlapping) | check constraint | `reconcile_due_releases` requires this (or `sealed`) to consider a row due; `v_measures_release_surface_v1` treats `held`/`sealed` as non-renderable regardless of access_state | This confirms release and access are **schema-enforced separate axes** — no value is shared between the two columns' constraints, so "held" can never be mistaken for an access_state value at the database level |
| `restricted` | not a column value anywhere in the five audited tables; appears only in `c3_runtime_admission_contract.access_state` (system-level, different table/scope entirely) | not constrained in this audit's scope | system-level runtime admission only | Distinct scope from per-encounter access_state — should not be conflated with the per-row vocabulary |
| `released` | `release_state` columns | check constraint; is a valid target of automated release | `v_measures_release_surface_v1`, `resolve_phase_map_outbound` (`released`/`open` both accepted) | Distinct from `open`, which is schema-legal but was not observed in any live Inanna-scoped row in this or the Measure pass |
| `active` | referenced only inside the RLS policy `measures_registry_public_released_active_read` (`release_state = ANY('released','active')`) | **not** in the check constraint's allowed set | none — dead branch, see baseline audit | Confirmed unreachable; likely pre-dates the current check constraint |

## The restored foundational access-state difference

`measures_registry.access_state = 'visible'` vs. `measures_release_state.access_state = 'callable'` for `crystal_temple_home`, `temple_antechamber`, `temple_harrumuk_passage` (flagged in the Measure phase as "semantic drift, confirmed"):

Evidence gathered in this Audit **does not resolve this as intentional** — no schema comment, view logic, or function treats "the registry parent says visible while the explicit row says callable" as a designed pattern for these specific rows. It is not, however, unique to these three rows as an isolated glitch: it reflects the same general two-tier structure (registry-parent value vs. explicit-row value) that exists for every row in the system, and the two values here are simply *different but both non-held* — which every consumer examined (the `v_measures_release_surface_v1`/`is_renderable` logic, and `resolve_phase_map_outbound`'s enterable check) treats as equivalent for practical purposes (`visible`, `callable`, and `encounterable` are grouped together in the `is_renderable` `CASE`, and `callable`/`encounterable` are grouped together as enterable in `resolve_phase_map_outbound`).

**Classification: `semantic_drift`, evidence qualifier `database_confirmed` + `conflicting_evidence`.** The distinction is *seated* at the vocabulary level (5 distinct allowed values, and the phase-map node views do encode a 3-way grouping: `visible` alone vs. `encounterable`/`callable` as `'open'` vs. everything else as `'sealed'`) but **not consistently seated at the consumption level** — `v_measures_release_surface_v1` and `resolve_phase_map_outbound` both treat `visible`/`callable`/`encounterable` as interchangeably "good enough," while the phase-map node views alone draw a line between `visible` and the other two. Whether `crystal_temple_home`'s specific `visible`-vs-`callable` split across the two tables is an intentional distinction or accidental copy/paste from two different seeding passes is **unresolved_pending_operator_decision** — no seeding migration was found (per the discrepancy audit's grep results) to confirm intent either way.

## `resolve_measures_next_step`'s hard-coded `access_state = 'visible'` requirement

This function (see precedence map) requires **exactly** `measures_release_state.access_state = 'visible'` for a row to be considered part of the "released cadence" sequence it computes. Per the phase-cadence audit and the live data reviewed across both this and the Measure phase, **the only Inanna-scoped rows currently carrying `access_state = 'visible'` in `measures_release_state` are `phase_map` and `measures_registry_root`-class general-site rows — no Gate, Epithet, or ME row currently has `access_state = 'visible'`** (all released ones show `encounterable`; held ones show `gated`). **This means `resolve_measures_next_step`, as currently written, would find zero eligible "released_cadence" rows among the entire Gate/Epithet/ME/spine-chamberplate set** — a confirmed, evidence-based `active_defect`, distinct from (but related to) the cadence-automation defect: even where automation succeeds (Gate 3), it sets `access_state = 'visible'`... but Gate 3's actual live row shows `access_state = 'encounterable'`, not `'visible'`, **contradicting what `reconcile_due_releases`'s own UPDATE statement would have set.** This is either evidence that Gate 3's value was manually changed after automated release, or evidence that the function's current definition differs from whatever version actually executed historically. Not resolved further in this bounded Audit — flagged for Audit_02 or operator decision.
