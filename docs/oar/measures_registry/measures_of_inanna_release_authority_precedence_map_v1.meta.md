---
document_type: precedence_map
authority_level: working
document_scope: map_environment_audit_authority_release
title: Measures of Inanna — Release Authority Precedence Map
status: filed
version: v1
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_audit_measures_of_inanna_authority_and_release_v1.meta.md
executor: claude
observation_time: 2026-07-15
---

# Measures of Inanna — Release Authority Precedence Map

Governed audit evidence for OAR2 ROUTED sections 4, 5, and 8. This is not a single hierarchy — the evidence shows separate axes with different consumers, and they are kept separate below.

## Runtime precedence trace (source-confirmed)

`src/measures_of_inanna/resolve_encounter.ts` — the encounter resolver actually used by the live app (per `src/app/App.tsx`'s active import of `MeasuresRegistryOrchestrator`, not any `registered_runtime` path):

- `resolveEncounterRow` first queries `measures_registry` by `registry_key`, selecting only `id, registry_key, metadata` — **it never reads `release_state` or `access_state` in application code.**
- If that query returns a row, it looks up `measures_encounter_def` by `registry_id` + a set of derived candidate `encounter_key`s.
- **If the registry query returns no row** (which happens for anon whenever RLS filters it out — i.e. whenever `release_state` is not `released`/`active`), the code falls through to a "legacy" path: it queries `measures_encounter_def` directly by exact `encounter_key = inputKey` string match, with **no registry join and no release/access condition at all** — gated only by that table's own RLS policy (`is_active = true`, nothing else).
- Transitions are read from **`v_measures_transition_runtime`** (a view), filtered by `rule_state = 'active'` — not from raw `measures_transition_rule`.
- Media is read from `measures_surface_media_map` / `codex_media_asset` / `temp_exhibition_media` — no release/access condition on media either.

**Finding:** release/access gating for this resolver is entirely implicit, delegated to `measures_registry`'s RLS policy. There is no explicit `if (release_state === 'released')` check anywhere in this file. The "legacy" fallback path is a confirmed, source-level gap: it queries `measures_encounter_def` by exact string match with no release/access condition. Whether this path is ever reached with a *held* unit's actual `encounter_key` (as opposed to its `registry_key`, which is what `resolveEncounterRow`'s own candidate-key derivation and typical callers appear to pass) was **not traced to every caller in this Audit** — classified `unresolved_pending_operator_decision` / evidence qualifier `source_confirmed` + `runtime_unverified`, recommended for Audit_02 caller tracing before being called either a live bypass or a dead code path.

`resolve_phase_map_outbound(p_registry_key)` (database function, the actual Phase Map click resolver):
- Reads the target's standing from **`measures_release_state` only** (`LEFT JOIN measures_release_state rs on rs.registry_id = te.target_registry_id`) — never falls back to the registry parent's own `release_state`/`access_state`.
- Resolution logic (verbatim from the function body): `NO_ACTIVE_OUTBOUND_RULE` if no active transition rule exists; `TARGET_NOT_RELEASED` if `release_state NOT IN ('released','open')`; `TARGET_NOT_ENTERABLE` if `access_state NOT IN ('encounterable','callable')`; otherwise routes.
- **In SQL, `NULL NOT IN (...)` evaluates to `NULL`, not `TRUE`.** Since a `CASE WHEN` only branches on `TRUE`, a missing `measures_release_state` row (`release_state`/`access_state` both `NULL`) causes **both gating conditions to be skipped**, falling through to `ROUTE_DIRECT_TO_TARGET` — i.e., **this function fails open, not closed, when the explicit release-state row is absent.** Confirmed by direct inspection of the function body (source/database-confirmed), not executed against a live held target in this Audit (no Inanna Phase Map target currently lacks a release-state row — `phase_map` is the *source*, never a target, of these rules, so this specific fail-open path is not currently exercised, but is a latent behavior for any future target added without a release-state row).
- `phase_map`'s own release/access standing is **never checked** by this function — it is located purely by `surface_type = 'phase_map'`. This means `phase_map`'s own missing `measures_release_state` row has **no behavioral consequence** in this function, consistent with Phase Map's confirmed role as receiver/router only.

`resolve_measures_next_step` / cadence resolver: requires `measures_release_state.release_state = 'released' AND access_state = 'visible'` (exact string `'visible'`, not `'encounterable'` or `'callable'`) joined through `measures_phase_calendar` via `phase_label = phase_key`. See the access-semantics and cadence audits for why this currently matches zero live rows.

`v_measures_release_surface_v1` (the most complete DB-side read-surface view): computes `release_state` / `access_state` as **`COALESCE(explicit measures_release_state value, registry parent value)`** — i.e. **explicit row wins when present; registry parent is the fallback when absent.** This same `COALESCE(rs.x, r.x)` pattern also appears in `v_phase_map_nodes` and `v_measures_phase_map_nodes_v1`, independently, three times — a **consistent, source-confirmed design pattern** across the view layer, distinct from `resolve_phase_map_outbound`'s different (fail-open, no-fallback) behavior. **Two different precedence behaviors coexist in the database for the same "missing row" case, depending on which surface is asked** — this is itself a finding (see findings register: `precedence_inconsistency_across_consumers`).

## Registered-runtime residue (source-confirmed)

`src/measures_registry/registered_runtime/` exists on disk (`chambers/`, `renderers/`, `styles/` subdirectories) but a full-`src` grep for the literal strings `registered_runtime`, `RegisteredRuntime`, and `registeredRuntimeUtils` in any `.ts`/`.tsx` file returns **zero matches** — nothing in the active source tree imports from this path by name. `src/app/App.tsx` imports its live runtime from `../measures_registry/encounter_renderer/MeasuresRegistryOrchestrator` (aliased `MeasuresRegistryRuntime`), not from `registered_runtime`. **Classification: `historical_deprecated_residue`, source_confirmed. `registered_runtime` cannot currently affect production — it is unreachable dead code, not a live rollback path.** No recent About-route work was found touching this directory (the unrelated About-route OAR1 was not opened for content per this OAR2's exclusion, but its referenced source paths were not found inside `registered_runtime/` during this grep).

## Public-runtime observation

A public domain is documented in-repo (`docs/_source/codex/publications/launch_cycle_001_endpoint_copy_package_v1.meta.md` and SEO-contract OARs under `docs/oar/c3_field/chamber_directories/lapis/`): `https://www.measuresregistry.com`. A read-only fetch of this URL was attempted, 2026-07-15: **HTTP 403 Forbidden**, most likely bot/WAF-layer blocking rather than an application-level failure (no response body was returned to distinguish the two). No further browser observation was attempted, per this OAR2's read-only boundary and the tool's inability to proceed past a 403. **Classified `runtime_unverified` for all public-runtime questions** (foundational traversal, Phase Map, Gate 4, `return_antechamber` behavior) — evidence qualifier `runtime_unverified`.

## Release-authority precedence — answers to the twelve questions

1. **What seats identity?** `measures_registry.registry_key` (primary natural key) plus `measures_registry.id` (uuid PK). Schema-enforced.
2. **What seats base release standing?** `measures_registry.release_state` / `.access_state` — `NOT NULL` with defaults (`sealed`/`gated`), schema-enforced, always present for every row.
3. **What seats explicit release standing?** `measures_release_state.release_state` / `.access_state`, keyed by `registry_id` — present for 62 of the 64 proven Inanna members (missing: `phase_map`, `return_antechamber`). Not schema-required to exist.
4. **What seats access standing?** Same two columns as (2)/(3), depending on which is being consulted — this is the crux of the "separate axes" finding: release and access are stored as sibling columns on both tables, not as independent tables, but multiple consumers treat "release" and "access" as logically separate gates (see `v_measures_release_surface_v1`'s two independent `CASE` conditions).
5. **What controls cadence?** `measures_phase_calendar` (anchor dates) joined to `measures_release_state.phase_label` by **exact string equality to `phase_key`** — intended-authority. Schema-enforced only insofar as `phase_calendar`'s own vocabulary is constrained; the *join* itself is not schema-enforced (no FK from `phase_label` to `phase_key`), which is exactly why it is silently broken for all but one row (see cadence audit).
6. **What controls transition eligibility?** `measures_transition_rule.rule_state = 'active'` plus (where set) `requires_release` / `requires_dependency_satisfied` / `requires_passage_ready` / `requires_connect_prompt` flags on the rule itself.
7. **What controls system-level runtime admission?** `c3_runtime_admission_contract` (per-system: `measures_of_inanna` = `not_seated`/held; `measures_registry` = `admitted` but `access_state: restricted`) — unchanged from Measure-phase findings, not re-queried in this Audit.
8. **What controls anonymous database visibility?** RLS policies, per table, independently: `measures_registry` gates on its **own** `release_state` (not the explicit table); `measures_encounter_def` gates on `is_active` only (no release/access condition); `measures_transition_rule` gates on `rule_state = 'active'`; `measures_release_state` has **no anon-facing policy at all** (confirmed by live anon-role readback: 0 rows visible directly) but is nonetheless exposed indirectly through views that do not set `security_invoker` (confirmed: `v_measures_release_surface_v1` returned real explicit-table-derived data to an anon-role session in this Audit).
9. **What controls public semantic use?** `c3_public_semantic_pairing` (unchanged from Measure phase: 6/8 rows held, `public_use_allowed: false`).
10. **What does the active resolver actually evaluate?** `resolve_encounter.ts` evaluates **nothing explicitly** — it relies entirely on `measures_registry` RLS as an implicit gate, with a legacy fallback that has no gate at all. `resolve_phase_map_outbound` evaluates `measures_release_state` only, fail-open on absence. `resolve_measures_next_step` evaluates `measures_release_state` with an exact-string `access_state='visible'` requirement.
11. **What happens when two surfaces disagree?** (Gate 4 case): `v_measures_release_surface_v1` prefers the **explicit** `measures_release_state` value (`released`) over the registry parent (`held`) via `COALESCE(effective, registry)` — so the *release* axis resolves toward "released," but the *access* axis (`gated`, agreeing across both tables) still blocks rendering. The conflict is therefore currently **contained by access_state, not resolved** — if access_state were ever corrected to a non-gated value without also correcting the release_state conflict, the row would become renderable under this view's logic while `measures_registry` itself still says `held`.
12. **What happens when an explicit row is absent?** Two different, independently confirmed behaviors coexist: the view layer (`v_measures_release_surface_v1`, `v_phase_map_nodes`, `v_measures_phase_map_nodes_v1`) falls back to the registry parent's own values (fail-safe-ish, using whatever the parent says); `resolve_phase_map_outbound` fails open (treats absence as "no gate applies," defaulting toward routing through). **No single fallback rule governs the whole system — it differs by which surface is consulted.**

Intended vs. schema-enforced vs. source-consumed vs. deployed-observed, summarized: intended design (per the `COALESCE` pattern repeated three times in views, and per `ensure_measures_release_state`'s backfill-from-parent logic) is "explicit row wins, registry parent is the source of truth for fallback." Schema does not enforce this (no constraint requires an explicit row, no trigger auto-creates one). Source code inconsistently implements it (`resolve_phase_map_outbound` does not follow the fallback pattern; `resolve_encounter.ts` does not evaluate release/access explicitly at all). Deployed-observed standing is `runtime_unverified` (403 on the one public-domain check attempted).
