---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Normalize Measures Registry Terms Across DB FREE CSS
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_normalize_measures_registry_terms_across_db_free_css_v1
---

# OAR1 - Normalize Measures Registry Terms Across DB FREE CSS

## EXECUTION METHOD

Full DB/source audit performed first (live PostgREST query + direct read of every
resolver/renderer/CSS source file + a parallel Explore agent pass over FREE resolver,
encounter_renderer, and CSS selectors). Controlled mutation applied only where
confirmed dependency-safe. Migration applied via `npx supabase db push` (exit code 0).
Live state re-verified via PostgREST after migration.

---

## KEY ARCHITECTURAL FINDING

`metadata.profile` (and the new `metadata.standing`) on
`measures_encounter_surface_assignment` has **zero runtime consumers**. Confirmed by
reading `registryResolver.ts` (its `select()` on this table does not even include the
`metadata` column) and every chamber renderer (`CrystalSeatRenderer.tsx`,
`ObsidianChamberRenderer.tsx`, `MarbleChamberRenderer.tsx`, `LapisChamberRenderer.tsx`,
`ChamberRouter.tsx`). Actual presentation dispatch is 100% literal `surface_key` string
matching in source, and actual public routing is the `ROUTE_SURFACE_MAP` constant in
`MeasuresRegistryOrchestrator.tsx`.

This means: metadata-only normalization carries **zero behavior risk** (nothing reads
it, nothing can break) — fully dependency-safe per ROUTED step 3. It also means it is
**documentation/standing authority only** — it does not yet change what the system
renders. True SEAT enforcement requires a future renderer/route code change, called out
below as a reported gap, not executed here (no DO-NOT-TOUCH item authorizes a
multi-file frontend refactor without dedicated review).

---

## BEFORE-STATE TABLE (13 SEAT terms)

| # | Required SEAT term | Surface_key anchor | Route | Prior profile (before) | Action |
|---|---|---|---|---|---|
| 1 | `crystal_seat_threshold` | `intro_hook` | (entry, no direct route) | `crystal_threshold_hook` (drift) | mutated |
| 2 | `crystal_seat_split_path` | `path_choice` | (transition) | `crystal_split_path_choice` (drift) | mutated |
| 3 | `crystal_orientation_surface` | `intro` | (transition) | `crystal_orientation_surface` | already correct, no change |
| 4 | `crystal_seat_encounter` | `about_measures_registry` | `/about`, `/about-measures-registry` | `crystal_about_surface` (drift) | mutated |
| 5 | `lapis_chamber_encounter` | `structural_drift_dispatches` | `/undrifted`, `/structural-drift` (legacy alias) | `lapis_publication_surface` (generic, shared with #12 below — drift) | mutated |
| 6 | `obsidian_chamber_orientation` | `structural_coherence_explainer` | (transition) | `obsidian_full_bleed_video` (drift) | mutated |
| 7 | `obsidian_chamber_encounter_assessment` | `measures_assessment` | `/ai-operations-assessment` | `obsidian_assessment_surface` (drift) | mutated |
| 8 | `obsidian_chamber_C1` (contact_capture) | **none** — embedded inside `measures_assessment`/`PublicAssessmentSurface.tsx` flow | n/a | n/a | **GAP — reported, no row exists, no mutation** |
| 9 | `marble_chamber_orientation` (before-the-paths explainer) | **none distinct** — `marble_chamber_orientation_passage` duplicates `map_integrity_governance`'s `MapIntegrityGovernance` component verbatim (`MarbleChamberRenderer.tsx:51`) | n/a | null | **GAP — reported, isolated as `standing: gap`, no SEAT term assigned (would misrepresent code reality)** |
| 10 | `marble_chamber_encounter_assessment_findings` (report_findings) | **none** — embedded inside `measures_assessment`/`PublicAssessmentResult.tsx` flow | n/a | n/a | **GAP — reported, no row exists, no mutation** |
| 11 | `marble_chamber_C2_encounter` (MAP_the_environment) | `map_integrity_governance` | `/map-integrity-governance` | `marble_map_cards` (drift) | mutated |
| 12 | `marble_chamber_C2_agreement` (Stripe payment) | **none** — embedded inside `MapIntegrityGovernance` payment flow (`MarbleChamberRenderer.tsx`, `onInitiateMapPayment`) | n/a | n/a | **GAP — reported, no row exists, no mutation** |
| 13 | `marble_chamber_encounter_resolution` (confirmation page) | **none** — embedded inside `MapIntegrityGovernance` flow | n/a | n/a | **GAP — reported, no row exists, no mutation** |

7 of 13 SEAT terms had a clean 1:1 surface_key anchor and were normalized. 6 of 13 have
no standalone DB row (folded into the assessment or MAP payment flow components) or no
distinct renderer (`marble_chamber_orientation`) — these are reported gaps, not
mutated, per ROUTED step 2 ("if either row is missing... report missing row in OAR1,
stop execution").

---

## DRIFT ISOLATION APPLIED (outside the 13-term SEAT structure)

| surface_key | Reason | standing tag |
|---|---|---|
| `eval_passage` | duplicates `structural_coherence_explainer`'s `EvalPassage` component verbatim (`ObsidianChamberRenderer.tsx:73`) | `legacy_alias` |
| `obsidian_chamber_orientation_passage` | duplicates same `EvalPassage` component | `legacy_alias` |
| `structure_passage` | passage term, not in 13-term SEAT structure — PASSAGE/ANTECHAMBER HOLD RULE applies | `held` |
| `crystal_seat_orientation_passage` | duplicates `structure_passage`'s `StructurePassageSeat` component (`CrystalSeatRenderer.tsx:64`) | `held` |
| `measures_structured_environments` | code already returns explicit `renderer_gap` state (`CrystalSeatRenderer.tsx:70-88`) | `held` |
| `marble_chamber_orientation_passage` | duplicates `map_integrity_governance` component, no distinct renderer | `gap` |
| `publication_dispatch` | distinct sub-dispatch surface (separate `PublicationDispatch` component), explicitly noted in source as "not yet in encounter model" — previously shared the generic `lapis_publication_surface` term with the real `/undrifted` encounter, which OAR2 flagged by name as hiding standing | `audit_trace` |

Existing `profile` values on `eval_passage` and `publication_dispatch` were preserved
(not overwritten) — only a `standing` tag was added, per "preserve legacy alias only
when needed for route continuity" / prefer isolation over deletion.

---

## CONFIRMED CODE-LEVEL DUPLICATE-FUNCTION DRIFT (not mutated — reported)

Source audit confirmed three places where multiple `surface_key` values dispatch to
the **identical** rendering component, which OAR2's "Not Allowed" list forbids
("duplicate active terms for same function") but which cannot be resolved by metadata
alone:

1. `eval_passage`, `structural_coherence_explainer`, `obsidian_chamber_orientation_passage`
   → all three render `EvalPassage` (`ObsidianChamberRenderer.tsx:73`).
2. `structure_passage`, `crystal_seat_orientation_passage`
   → both render `StructurePassageSeat` (`CrystalSeatRenderer.tsx:64`).
3. `map_integrity_governance`, `marble_chamber_orientation_passage`
   → both render `MapIntegrityGovernance` (`MarbleChamberRenderer.tsx:51`).

Resolving these at the code level (removing duplicate `surface_key` branches, updating
the `EncounterSurface` union, `ROUTE_SURFACE_MAP`, and the affected chamber renderer
files together) is a multi-file frontend change that was not specifically authorized
by this OAR2's mutation scope and was not validated in a dev server per this session's
standing rule for UI changes. It is reported here as the required follow-up, not
executed.

---

## CONTRACT USE BAN — FINDING, NO ACTION

`data-layout-contract` is used as a CSS/JSX data-attribute hook in 6 renderer files
(`CrystalSeatRenderer.tsx`, `LapisChamberRenderer.tsx`, `MarbleChamberRenderer.tsx`,
`ObsidianChamberRenderer.tsx`, `EncounterBoundary.tsx`, `EncounterEntry.tsx`) and the
matching CSS selectors. This is internal structural/CSS infrastructure only — not
user-facing copy, not a route name, not a public identity term. No active
user-facing or architectural "contract" language was found. No mutation applied;
renaming this attribute across 6+ files is a CSS-selector-coupled refactor outside
this OAR's metadata-mutation scope and is noted only as a possible future cleanup.

---

## VALIDATION CHECKLIST

| Item | Status |
|---|---|
| Live DB inspected before mutation | ✓ |
| Full source audit (resolver, renderer, CSS, routes) completed before mutation | ✓ |
| 7 of 13 SEAT terms normalized in `metadata.profile` | ✓ verified live |
| 6 of 13 SEAT terms reported as gaps (no standalone row / no distinct renderer) | ✓ reported above, not invented |
| Drift terms isolated with `standing` tag, not deleted | ✓ verified live |
| `/undrifted` resolves to `structural_drift_dispatches` → `lapis_chamber_encounter` | ✓ |
| `/about-measures-registry` resolves to `about_measures_registry` → `crystal_seat_encounter` | ✓ |
| `/ai-operations-assessment` resolves to `measures_assessment` → `obsidian_chamber_encounter_assessment` | ✓ |
| MAP the Environment resolves to `map_integrity_governance` → `marble_chamber_C2_encounter` | ✓ |
| No new rows created | ✓ |
| No new tables created | ✓ |
| No CSS/source mutation (confirmed zero-risk metadata-only change) | ✓ |
| No report/scoring/payment changes | ✓ |
| No route breakage (metadata has zero runtime consumers) | ✓ |
| Passages/antechambers remain held, not activated | ✓ |
| `contract` terminology audited — only internal CSS data-attribute, no action needed | ✓ |
| FREE remains active render authority | ✓ |
| registered_runtime remains retired | ✓ |
| OAR1 records before/after evidence | ✓ |

---

## FINAL DISPOSITION

**PARTIAL SEAT — metadata layer normalized, code layer reported as gap.**

7 of 13 SEAT terms now carry the exact canonical name in live DB metadata
(non-breaking, zero runtime consumers). 6 of 13 have no DB row to anchor to and are
reported as gaps rather than invented. 7 drift/duplicate surfaces are isolated with a
`standing` tag rather than deleted, per the PASSAGE/ANTECHAMBER HOLD RULE and the
preserve-over-delete instruction.

The deeper instruction — "normalize to those terms across... FREE resolver logic,
encounter_renderer references, CSS/profile selectors" — is **not fully executed**.
Source code dispatch remains on literal `surface_key` strings, confirmed to have three
duplicate-function clusters. This is reported as the required next OAR (a dedicated
encounter_renderer/route consolidation pass with dev-server verification), not
attempted blind in this metadata-scoped OAR.

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.

Normalize the system, not just metadata — metadata is normalized; system-level
(code) normalization remains a reported gap.

Collapse is not the default.
