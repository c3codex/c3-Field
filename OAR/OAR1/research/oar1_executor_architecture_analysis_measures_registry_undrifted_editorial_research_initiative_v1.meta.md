---
document_type: oar1
authority_level: architecture
document_scope: undrifted_editorial_research_initiative_advisory
title: OAR1 - Executor Architecture Analysis, Measures Registry / unDrifted Editorial & Research Initiative
closes: oar2_executor_architecture_analysis_measures_registry_undrifted_editorial_research_initiative_v1.md
operator: op044
system: measures_registry
executor: Claude
date: 2026-07-10
status: advisory_complete
disposition: no_implementation_performed
---

# OAR1: Executor Architecture Analysis — unDrifted Editorial & Research Initiative

## Summary

Read-only architecture advisory, per OAR2 constraints. **No code, schema, migration, folder, or authority
changes were made.** Evidence was gathered from: `src/measures_registry/` runtime (orchestrator, resolver,
lapis chamber renderer), Supabase migrations under `supabase/migrations/*.sql`, the `OAR/OAR1/`, `OAR/OAR2/`,
and `docs/oar/` governance trees, `docs/oar/c3_field/chamber_directories/lapis/`, `docs/seat/measures_registry/`
integration contracts, and `Assets/Registry/asset_registry.md`. Live Supabase MCP query access was unavailable
(`Unauthorized — no access token`); schema claims below are sourced from migration SQL files, which is
sufficient for a structural advisory and does not affect the conclusions.

**Headline finding:** the initiative decomposes into two very different readiness profiles. *Editorial
publication* and *evidence-of-execution* already have a proven, live, registry-driven substrate (Issue 01 is
running on it today). *Research coordination, source monitoring, research proposition support, and
institutional learning* have **zero existing architecture** — no tables, no folders in active use, no
patterns to extend. Layering both halves onto the current system at once would be uneven: one half is a
natural extension, the other is green-field schema design wearing the same name. There is also one live
naming collision risk (`MAP`) that must be resolved before any "MAP the Environment" surface work begins.

---

## 1. Current Architectural Readiness (ROUTED §1)

| Requested capability | Readiness | Basis |
|---|---|---|
| Editorial publication workflow | **Strong** | `/undrifted` is fully registry-driven, not static. `measures_publication_registry` → `regenerate-undrifted-encounter-projection.cjs` → `measures_encounter_def.metadata` → `LapisChamberRenderer.tsx` is a proven, live pipeline (Issue 01, four registered articles). A newer, more granular `measures_publication_issue_page` table (one row per page: cover/editors_letter/contents/cover_story/dispatches/launch_encounter, with `release_state`/`visibility_state`) is already seated and fetched by `registryResolver.ts`, though the renderer doesn't consume it yet — real headroom already built and waiting. |
| Publication registry | **Strong** | Same substrate as above, plus `Assets/Registry/asset_registry.md` as the file-based registry-of-record with a defined lifecycle: `draft → registered → published → observed → revised → versioned`, and a declared object chain `Publication Asset → Derivative Asset → Campaign Asset → Distribution Asset → Evidence`. |
| Evidence registration | **Partial — depends which "evidence"** | If "evidence" means *proof an OAR executed correctly*: strong and DB-enforced (`system_oar_execution_evidence`, with a trigger that blocks closing an OAR queue entry without at least one evidence row). If "evidence" means *research/source substantiation for an editorial claim*: **no architecture exists at all.** These are different concepts sharing a word — see Gap Assessment. |
| Source registry / source monitoring | **None** | No table, folder, or code pattern found anywhere in the repo (`source_registry`, `source_monitoring` search returned no genuine hits). Pure green-field. |
| Editorial review | **None** | No author/reviewer role, no review-state machine beyond the generic `approval_status`/`review_status` columns on `measures_publication_derivative_asset` (which model campaign-derivative approval, not editorial peer review of article content). |
| Research proposition mapping | **None** | No table, doc pattern, or code found. `OAR/OAR1/research/` and `OAR/OAR2/research/` exist as folders but contain only `.gitkeep` — the category was anticipated in the governance taxonomy but never used. |
| Institutional learning records | **None**, but adjacent proof-of-concept exists | No dedicated table. However `system_oar_execution_evidence` + `system_oar_queue`/`system_process_registry` demonstrate the repo already knows how to build an append-only, DB-enforced record-of-what-happened — the same pattern this capability would need, just not pointed at research/editorial subject matter. |

**Can the current architecture support these without major restructuring?** Editorial publication, publication
registry, and execution-evidence: **yes** — extend existing tables/patterns. Source registry, research
proposition mapping, editorial review, and institutional-learning-as-a-first-class-concept: **no** — these
require new schema design, not restructuring of what's there. This is not a weakness in the existing
architecture; it simply never had a reason to model research/editorial-review concerns before now.

---

## 2. Existing Assets (ROUTED §2)

- **Database**: `measures_publication_registry`, `measures_encounter_def`, `measures_media_map`,
  `measures_encounter_surface_assignment`, `measures_publication_release`, `measures_publication_issue_page`,
  `measures_publication_campaign`, `measures_publication_campaign_asset`, `measures_publication_derivative_asset`,
  `measures_publication_distribution_asset`, `measures_distribution_executor/channel/execution`,
  `system_process_registry`, `system_oar_queue`, `system_oar_execution_evidence`.
- **`/undrifted` runtime**: `src/measures_registry/encounter_renderer/MeasuresRegistryOrchestrator.tsx` (routing),
  `resolver/registryResolver.ts` (data fetch), `chambers/LapisChamberRenderer.tsx` (presentation, explicitly
  built to read from registry metadata rather than hardcode content — "future Publication Registry edits flow
  through without a renderer change," per its own code comments).
- **Article structures**: `Assets/Articles/unDrifted/Issue01/{drafts,published,registered}/` three-stage
  lifecycle folders (drafts/published currently empty, four articles live in `registered/`), each with required
  frontmatter (`asset_id, issue, status, registered_by_oar2, published_by_oar1`).
- **Paragraph integration**: live, working, one-way distribution channel (`paragraph.com/@undrifted`), governed
  as *distribution, not authority* — canonical route stays `/undrifted/...`; Paragraph URL is stored as
  `metadata.external_url`, never as `route_path`. This is a reusable pattern for any future external
  distribution channel the initiative needs (e.g. a research-notes mirror).
- **MAP content**: a *different, narrower, already-named* thing exists — `map_the_environment_contract.meta.md`
  describes a post-assessment "Measure → Audit → Prepare" commerce product with live Stripe checkout, its own
  DB tables (`map_c2_circuit`, `map_commerce_contracts`, `map_payment_events`), and status
  `documentation_seated_activation_held`. Not blank slate — see §5.
- **OAR governance**: mature, consistent, two-tree convention (`OAR/OAR1|OAR2/{category}/` and
  `docs/oar/{system}/`), with a `chamber_directories/lapis/` layer that *already scopes* "Paragraph relation,
  Buffer relation, social distribution relation, public encounter adjacency" as lapis-chamber concerns —
  directly overlapping this initiative's "editorial publication" and "source monitoring" surface.
- **Existing metadata pattern**: Human/AI actor attribution (`created_by_actor_class/key`,
  `approved_by_actor_class/key`, CHECK-constrained to `Human`/`AI`) already exists on the campaign/derivative
  layer — a real, working precedent for attributing research/editorial contributions once that layer is built.

---

## 3. Gap Assessment (ROUTED §3)

| Missing component | Severity | Notes |
|---|---|---|
| Evidence registry (research/source sense) | **High** | Must not be conflated with `system_oar_execution_evidence`, which proves OAR *execution*, not article *claims*. Needs its own object: claim ↔ source ↔ confidence ↔ reviewer. |
| Editorial registry / review workflow | **High** | No author, reviewer, or editorial-state model exists beyond binary Human/AI attribution and binary RLS (public-read-if-visible vs. service-role-only). |
| Source registry | **High** | Zero existing architecture. |
| Research graph / proposition mapping | **High** | Zero existing architecture; `OAR/*/research/` folders scaffolded but unused. |
| Contributor governance ("Role Workbench") | **High, and explicitly acknowledged already** | `Assets/Registry/asset_registry.md` states, on record: *"Conversation Threads are an operational collaboration surface with authority: none — the Registry remains sole authority until a governed Role Workbench exists."* This is a named, known, not-yet-built gap — not a new finding, a confirmation. |
| Editorial metadata | **Medium** | Article frontmatter today covers publication lifecycle (`status, registered_by_oar2, published_by_oar1`), not editorial/research metadata (topic taxonomy, source citations, fact-check state, research linkage). |
| Automation opportunities | **Low-Medium** | The existing `regenerate-undrifted-encounter-projection.cjs` / `sync-undrifted-publication-release.cjs` script pattern (registry → projection → runtime) is a good template to replicate for research-side automation once the underlying tables exist — not a gap so much as a reusable recipe. |

---

## 4. Integration Strategy (ROUTED §4)

**Incremental integration is viable, but not as a single uniform pass** — the two readiness profiles from §1
argue for sequencing by what's an extension versus what's new construction, not by feature name:

- **Phase 1 — Extend proven substrate (editorial publication, publication registry, execution evidence).**
  Formalize an "editorial registry" as a natural sibling to `measures_publication_registry` /
  `measures_publication_issue_page`, reusing the existing asset lifecycle and Human/AI attribution pattern.
  This is low-risk because it rides rails already carrying Issue 01 in production.
- **Phase 2 — Contributor governance (Role Workbench).** Nearly every other capability (editorial review,
  research proposition submission, source vetting) needs to know *who* is acting and *what they're allowed to
  do*. Today's binary Human/AI + binary public/service-role RLS cannot express "an editor may approve a draft"
  or "a researcher may submit a proposition." This was already flagged as a known gap before this advisory;
  building it early avoids every later phase working around its absence.
- **Phase 3 — Net-new research schema (source registry, research proposition mapping, evidence-of-claims,
  institutional learning records).** These have no existing table to extend, so this is genuine schema design,
  informed by (but not built on top of) two existing proven patterns: the DB-enforced evidence-gate trigger
  model from `system_oar_execution_evidence`, and the actor-attribution CHECK-constraint model.
- **Phase 4 — Resolve the MAP naming collision explicitly (see §5)** before any "MAP the Environment" surface
  is built, since the name is already claimed by a live, held commerce product with its own Stripe/DB footprint.

**If treated as one undifferentiated integration instead of phased**, the blocker is not technical capacity —
it's that Phase 2 and Phase 3 would be designed under time pressure from Phase 1's momentum, which is exactly
how the repo's own history describes prior drift (see `docs/oar/publication/oar2_audit_undrifted_editorial_design_authority_and_drift_origin_v1.meta.md` naming convention — drift audits are already a recognized, named concern in this codebase).

---

## 5. Structural Drift Assessment (ROUTED §5)

- **Naming collision (real, active risk): "MAP."** The initiative's background section lists "MAP the
  Environment" as a future capability. The repo already has a live, named, partially-built product called MAP
  (`map_the_environment_contract.meta.md`, status `documentation_seated_activation_held`), with its own Stripe
  checkout flow, DB tables, and a runtime route (`/map-integrity-governance`, `marble_chamber_C2_compact`
  surface). Whether the initiative's MAP is *the same* concept being reactivated, or a *different* research/
  environmental-scan concept that happens to share a name, is not resolvable from code alone. Recommend this be
  the first thing settled — by name if nothing else — before any MAP-labeled work proceeds, to avoid "released
  or active MAP-labelled DB rows are disposition conflicts, not activation authority" (the contract's own
  words) recurring in a new form.
- **Chamber/governance-layer drift risk.** The `lapis` chamber directory — the governance layer that would most
  naturally own this initiative's editorial/distribution contracts — is itself `registration_authorized: false`
  per its own requirements matrix. Building substantial new capability under a governance layer that is not yet
  fully activated risks the same "architecture ahead of activation" pattern already visible elsewhere in this
  repo (e.g. `measures_publication_issue_page` seated but not yet consumed by its renderer). Not a blocker, but
  worth sequencing: activate/register the lapis chamber contracts before or alongside Phase 1, not after.
- **Ownership drift.** None observed. Measures Registry and unDrifted's autonomy are consistently preserved
  throughout the reviewed governance history (Paragraph is repeatedly reaffirmed as *distribution, not
  authority*; canonical routes never point externally). No evidence this initiative would change that pattern
  if it follows the same convention.
- **Metadata drift.** Low risk if Phase 1 reuses the existing asset/actor-attribution schema rather than
  inventing parallel fields. Would become a real risk only if research-side tables are designed without
  referencing the existing `Human`/`AI` CHECK-constraint convention already established.
- **Authority drift.** None found or implied. The initiative background explicitly reaffirms Codex as
  governance authority for modeled initiatives and c3 Field as held, not operational — consistent with current
  repo state; this advisory found nothing in the existing architecture that would erode that if respected.
- **Registry drift / duplication.** The main duplication risk is the "two evidence systems sharing a word"
  issue from §3 — if a new research-evidence table is casually named `evidence` or wired near
  `system_oar_execution_evidence` without a clear boundary, the two will get conflated in practice, not just in
  name. Recommend distinct naming (e.g. `editorial_source_evidence` vs. the existing
  `system_oar_execution_evidence`) from the start.

---

## 6. Long-Term Sustainability (ROUTED §6)

- **Daily research / weekly coordination / monthly publication cadence**: the existing registry → projection →
  renderer pipeline already operates on an issue/release cadence (`release_state`, `visibility_state` fields)
  and has proven itself across a real release (Issue 01). Extending publication cadence to monthly is not a
  new capability, it's continued use of an existing one.
- **Issue archive**: explicitly named as a `held_future_renderer` (`issue_archive_library`) — anticipated but
  not built. Low risk to add later since it's additive to the existing issue-page model, not a redesign of it.
- **Evidence accumulation**: the OAR-execution evidence gate demonstrates the repo can sustain
  append-only, DB-enforced evidence at governance scale already (it's been running across every closed OAR).
  A research-evidence table modeled the same way should scale similarly — this is a pattern the repo has
  already proven works over time, not a hypothesis.
- **Research proposition growth / institutional memory**: no existing data to extrapolate from — these are
  the genuinely unproven parts of the initiative. Sustainability here depends entirely on Phase 3 design
  quality, not on anything already demonstrated.
- **Overall**: the parts of the architecture already carrying production weight (registry-driven publication,
  DB-enforced evidence-of-execution, asset lifecycle) show no sign of strain and would likely absorb the
  editorial half of this initiative without new sustainability risk. The research half introduces genuinely new
  long-running state (propositions, sources, institutional learning) whose sustainability can't be assessed
  from existing evidence because nothing comparable exists yet to observe.

---

## 7. Overall Assessment (ROUTED §7)

**Current readiness: ~55%.**

- **Primary strengths**: a proven, live, registry-driven publication pipeline already running Issue 01; a
  DB-enforced evidence-of-execution mechanism with a hard closeout gate; a working asset lifecycle with
  Human/AI attribution; a governance-layer precedent (`lapis` chamber) that already scopes exactly this
  initiative's editorial/distribution concerns; a reusable external-distribution pattern (Paragraph) proven
  safe against authority drift.
- **Primary weaknesses**: no contributor/reviewer governance ("Role Workbench" gap, self-acknowledged in the
  repo before this advisory); zero existing architecture for source registry, research proposition mapping, or
  institutional learning; the owning governance layer (lapis chamber) is itself not yet `registration_authorized`.
- **Immediate opportunities**: `measures_publication_issue_page` is seated but not yet renderer-consumed —
  low-cost, high-leverage first step that advances editorial readiness without new schema. The
  `system_oar_execution_evidence` trigger-gate pattern is directly reusable as a design template for a future
  research-evidence table.
- **Primary risks**: the MAP naming collision, if not resolved before naming any new surface; designing Phase 3
  research schema without contributor governance in place first (forces later rework); conflating
  execution-evidence with research-evidence under one name.

---

## 8. Recommendation (ROUTED §8)

**PHASED IMPLEMENTATION.**

The editorial-publication and evidence-of-execution portions of this initiative are close to READY —
they extend a substrate already proven in production. The research-coordination portions (source registry,
research proposition mapping, institutional learning) are closer to HOLD — no existing architecture to extend,
and they depend on contributor governance that doesn't exist yet. Treating the initiative as one undifferentiated
unit would either stall the editorial half waiting on research-schema design, or rush the research half without
the governance layer it needs. Phased sequencing (§4: extend → govern contributors → design new research schema
→ resolve MAP naming) lets each phase build on solid ground rather than assumption.

---

## Deliverables (per OAR2 Expected Deliverable)

1. Architecture Advisory Report — this document, §1–§7.
2. Gap Assessment — §3.
3. Integration Recommendation — §4.
4. Readiness Assessment — §1, §7.
5. Recommended implementation sequence — §4 (Phase 1–4).
6. Structural Drift Review — §5.
7. Final recommendation — §8: **PHASED IMPLEMENTATION.**

No implementation, migration, schema change, folder creation, runtime change, or authority change was
performed in the course of this analysis, per OAR2 constraints.
