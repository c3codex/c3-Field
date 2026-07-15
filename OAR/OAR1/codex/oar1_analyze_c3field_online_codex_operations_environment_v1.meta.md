---
document_type: oar1
authority_level: architecture
document_scope: c3field_online_codex_operations_environment_analysis
title: OAR1 - Analyze c3field.online as Codex Operations Environment
closes: OAR/OAR2/codex/oar2_analyze_c3field_online_codex_operations_environment_v1.meta.md
operator: op044
system: codex
executor: Claude
date: 2026-07-11
status: advisory_complete
disposition: PHASED_IMPLEMENTATION_REQUIRED
---

# OAR1: Analyze c3field.online as Codex Operations Environment

## Summary

Read-only architecture advisory, per OAR2 constraints. **No application, route, table, migration,
authentication, deployment, or authority change was performed.** Evidence was drawn fresh from `src/app/App.tsx`,
`src/c3_field_convergence/` (11 files), `supabase/migrations/202605140001_c3_field_oar_spine_persistence.sql`
and `202605180001_process_registry_and_oar_queue_foundation.sql`, `docs/oar/c3_field_convergence/`, and a
repo-wide search for "Field Findings" / "unDrifted Response" / "weekly cycle."

**Headline finding, more consequential than either prior codex advisory this session:** `c3field.online` is
genuinely live in production (Cloudflare Pages, confirmed by commit evidence and a prior verified Supabase-backed
read), not a hypothetical target — so this proposal touches real public infrastructure, not architecture on
paper. Two problems follow directly from that:

1. **A real, unresolved competing proposal already exists for the same domain.**
   `OAR/OAR2/c3_field/oar2_define_seat_to_c3field_operational_transition_v1.meta.md` (status `proposed`, no OAR1,
   never closed) proposes c3field.online as a post-SEAT "verified institution operations hub" with
   envelopes/roles/optics/DAO surfaces — a materially different purpose than this OAR2's unDrifted-publication-
   cycle framing. This is not a naming collision to reword (like Seat/SEAT); it is two different institutional
   directions aimed at the same domain, neither executed. Only Codex/operator can resolve which one governs, and
   this advisory should not quietly pick one.
2. **Two parallel, unreconciled OAR-tracking schemas already exist**, and this OAR2 asks which is reusable.
   Neither is simply "the" answer — see §1–§2.

This is why the disposition is **PHASED IMPLEMENTATION REQUIRED** with a non-negotiable Phase 0, rather than
READY or a minor-clarification tier like the two prior codex advisories.

---

## 1. Current Codex Authority Inventory

| Source | Canonical path | Status | Recommendation |
|---|---|---|---|
| DAO/Codex declaration | `docs/_source/codex/dao_codex_declaration.meta.md` | `seeded_candidate` | Read directly (filesystem) |
| Codex Initiative Governance Architecture | `OAR/OAR1/codex/oar1_register_codex_initiative_governance_architecture_v1.meta.md` | **Registered** | Read directly |
| c3 Ledger (registry + 2 entries) | `docs/_source/codex/ledger/` | **Registered**, 2 entries, 0 relational points of contact yet | Read directly |
| Codex Clarification (Relational Points of Contact) | `OAR/OAR1/codex/codex_clarification_relational_points_of_contact_v1.meta.md` | Accepted, not yet folded into a registration | Read directly |
| Role Governance analysis | `OAR/OAR1/codex/oar1_analyze_minimum_codex_role_governance_architecture_v1.meta.md` | **Advisory only** — not registered | Read directly; do not treat as authority yet |
| Ledger Maturation analysis | `OAR/OAR1/codex/oar1_analyze_c3_ledger_relational_maturation_and_standing_readiness_v1.meta.md` | **Advisory only** — not registered | Read directly; do not treat as authority yet |
| `native_role_registry` / `role_call_standing` | `measures_registry.metadata` (JSONB) | Seated, Measures-Registry-scoped, **not Codex-scoped** | Out of scope for this environment |
| `c3_oar_process_instance` / `_transition_event` / `_seeded_reference` | Supabase, `202605140001_c3_field_oar_spine_persistence.sql` | Live, UI-wired, **frozen demo data since 2026-05-14** | Do not treat as live operational authority — see §2 |
| `system_process_registry` / `system_oar_queue` / `system_oar_execution_evidence` | Supabase, `202605180001_...foundation.sql` | Actively written through 2026-07-08, **no UI, no RLS** | Do not build on until RLS is closed — see §2 |

**Two of four Codex-authority documents produced this session are advisory-only, not registered.** Any
operations environment must render this distinction visibly (e.g., "Proposed" vs "Registered" badges) — showing
an advisory next to a registration with equal visual weight would itself create the exact "operational interface
becoming authority" drift the OAR2 warns against.

## 2. Current c3 Field Architecture Inventory

`c3field.online` renders `OarOperationsConsole.tsx` via host-based routing in `src/app/App.tsx`
(`isC3FieldHost(hostname)`) — the same pattern `measuresregistry.com` uses for its orchestrator. Confirmed live
via Cloudflare Pages (`docs/oar/c3_field_convergence/oar1_c3field_online_infrastructure_activation_v1.meta.md`:
production domain + alias seated, build command `npm run build:c3field`, env vars confirmed present in actual
build logs).

The console (11 files: `OarOperationsConsole.tsx`, `oarSpineRegistry.ts`, `operationsSpine.ts`,
`transitionGovernanceEngine.ts`, `operatorGatedAutomationBridge.ts`, `branchEncounterReadiness.ts`,
`RuntimeCoherenceOptics.tsx`, `LapisRelationMappingSurface.tsx`, plus three static registries) is **entirely
read-only** — zero `.insert`/`.update`/`.upsert` calls, zero forms, anywhere in the directory. It reads exactly
three tables (`c3_oar_process_instance`/`_transition_event`/`_seeded_reference`), all seeded once
(2026-05-14) with static example lifecycle data, never touched since. RLS on those three tables is enabled and
correctly locks out anon/authenticated writes (select-only policies) — this part of the existing architecture is
sound and should be preserved as-is if the console continues to exist.

The **`transitionGovernanceEngine.ts` derivation engine is confirmed wired** into the console's "Runtime
Transition Governance" section — this corrects the prior c3 Field assessment advisory's "not confirmed wired"
finding; it is wired, just still operating read-only over frozen data.

**Preserving the "c3 Field is held, not operational" determination**: this advisory does not treat the
console's liveness as evidence that c3 Field itself is operational — it is a status/demo dashboard, not
institutional operating authority, and any new module must carry the same disclaimer this repo already applies
elsewhere (e.g., MAP's `documentation_seated_activation_held`).

## 3. Existing Reusable Tables, Routes, Files, Scripts, Services

Reusable as-is: the host-based routing pattern (`isC3FieldHost`), the derivation-engine-over-static-fetch
architecture (a good template for read-only projections of Codex/Ledger data), `scripts/check-pages-env.cjs` +
`build:c3field` deploy pipeline. **Not reusable without reconciliation first**: either OAR-tracking schema
(§4). **Not reusable at all for this purpose**: `c3_key_permission_map`/`c3_key_temp` (dormant, out of scope per
constraints), `native_role_registry` (Measures-Registry-scoped, not Codex-scoped, per §1).

## 4. Stale, Conflicting, or Held Architecture

- **`c3_oar_process_instance`/`_transition_event`/`_seeded_reference`** — stale: frozen since 2026-05-14,
  demo/example data only, not live operational tracking despite being UI-wired and publicly rendered as if
  current.
- **`system_process_registry`/`_oar_queue`/`_execution_evidence`** — actively growing (last write 2026-07-08)
  but has **no RLS at all** (not "restricted," genuinely absent — `alter table ... enable row level security`
  was never run on any of the three tables). This is a live security gap that exists today, independent of this
  OAR2, and would become materially worse if any new write-capable environment is built on or near it without
  fixing this first.
- **`oar2_define_seat_to_c3field_operational_transition_v1.meta.md`** — conflicting: proposed, unexecuted,
  targets the same domain with a different purpose (institution-verification hub vs. this OAR2's
  publication-operations environment). This is the single most important finding in this advisory — see
  Summary and §12.
- **"Field Findings" / "unDrifted Response" / "Weekly Context Sweep" / the July 4–10, 2026 cycle** — confirmed
  brand-new: these terms appear nowhere in the repo except this OAR2 and its companion Ledger Maturation OAR2
  (both dated 2026-07-10/11). **The weekly cycle is a proposed first proof case, not an already-underway
  operational process** — any implementation must treat July 4–10 data as something to be manually backfilled,
  not something already being captured live somewhere.

## 5. Recommended Canonical Source Strategy

Two different kinds of state, two different rules:

- **Governance/authority content** (Codex declarations, OAR pairs, Ledger entries, clarifications) — stays
  filesystem-canonical, exactly as already established. The operations environment reads and projects these
  files; it never becomes their source of truth. A one-way filesystem → DB-cache projection is acceptable for
  render performance; a DB row must never be treated as authoritative over its source file.
- **Fast-changing operational state** (publication-cycle stage, institutional delivery status, response
  received) — genuinely warrants its own DB representation, because unlike governance documents this changes
  weekly and isn't naturally a file-per-fact. Recommend a **new, narrowly-scoped operational schema**, not a
  repurposing of either existing OAR-tracking schema (§4) — both carry baggage (frozen demo semantics on one,
  no RLS on the other) that would contaminate a fresh operational concept if reused directly.

## 6. Recommended Minimum Object Model

Confirm the OAR2's candidate five objects are reasonable, but recommend **starting with exactly one** —
`publication_cycle` — as the Phase 2 proof case (§12), not all five at once. `codex_authority` and
`ledger_entry` should be read-projections of existing files, not new writable objects. `relational_point_of_contact`
should not be instantiated at all until the companion Ledger Maturation registration (still pending, per its own
advisory) actually happens — writing to a not-yet-registered object from an operations console would invert the
governance order this whole session has maintained (advise → clarify → register → then operationalize).
`institutional_relation` can wait until `publication_cycle` has proven the pattern once.

## 7. Recommended Application Boundary

Extend the existing pattern, do not invent a new one: same monorepo, same host-based routing, new modules added
alongside (not replacing) `OarOperationsConsole.tsx`. This is lower-risk than a new app/bundle because it reuses
a boundary already proven live in production, and it keeps Measures Registry and unDrifted autonomy intact by
construction — the existing host-routing already treats `measuresregistry.com` and `c3field.online` as separate,
non-coupled orchestrators sharing one Supabase project.

## 8. Recommended Authentication and Write Model

**Today there is zero authentication anywhere in this repo** — confirmed by a fresh search, not just the prior
advisory's finding. This is the single largest concrete gap standing between "read-only public demo" (today's
acceptable state) and "operations environment holding real institutional data" (materially different risk).
Recommend: a minimal operator-only access gate (e.g., Cloudflare Access on the relevant routes, or a simple
shared-secret gate) must exist **before** any new module ships — not before the existing read-only console
continues to exist as-is. Do not activate c3 Key/wallet/NFT/DAO infrastructure for this, per constraints; a
simple gate is sufficient at this scale. Once gated: routine status updates (marking a pipeline stage complete)
should not require a fresh OAR each time, mirroring how Ledger entries don't need a new OAR per entry once the
Ledger itself was registered — but writing a `relational_point_of_contact` should remain a deliberate, not
casual-form, action even after gating, to avoid undermining the diversity-over-volume principle the companion
Ledger Maturation advisory just established.

## 9. Recommended Operational Measures

Stage-completion counts, delivery/response counts, follow-ups due, Ledger contact-type diversity (once that
object exists) — all as observations of process health, never as a score of institutional worth. This should
explicitly stay consistent with `c3_ledger_0002`'s own argument against reducing contribution to
hours/task-counts — a dashboard that quietly re-introduces exactly what that Ledger entry warns against would be
an internal contradiction worth avoiding on principle, not just architecture.

## 10. July 4–10 Publication-Cycle Proof-Case Model

Since the cycle is proposed, not already captured, recommend the proof case be **one flat record**, manually
backfilled, not the full five-module system: `observation_window, sources[], field_findings_status,
undrifted_response_status, editorial_review_status, publication_status, planned_publication_date,
institutions[], delivery_evidence[], correspondence[], ledger_implications[], registry_implications[]`. This
tests whether the sequence (Weekly Context Sweep → ... → Measures Registry Review) is coherent as lived process
before any UI or schema is built around it — the same "prove with one real case first" discipline used in both
prior codex advisories this session.

## 11. Structural Drift Risks

Beyond the two headline findings (Summary), three risks from the OAR2's list are already live, not hypothetical:

- **"Duplicate Ledger or OAR records" / reusing stale infrastructure without reconciling it first** — this is
  now the *third* instance of exactly this drift pattern found in this session (native_role_registry vs.
  c3_key_permission_map in the Role Governance advisory; now `c3_oar_*` vs. `system_*` here). Worth naming to
  Codex as a repeating pattern, not a one-off: **this repo tends to seat a second, more elaborate schema instead
  of reconciling the first one, and the reconciliation step keeps getting deferred to "a future OAR."** At some
  point that future OAR needs to actually happen.
- **"Domain branding implying authority that has not been granted"** — concretely present today, independent of
  this proposal: the domain is literally named `c3field.online` while multiple prior OAR1s (including this
  session's own Codex registration) hold that c3 Field itself is not yet operational. Adding real operational
  modules under the same brand without an explicit "held" disclaimer would deepen an ambiguity that already
  exists, not create a new one from nothing.
- **"AI actors receiving unbounded write access"** — relevant because I (the executor) would likely be the one
  implementing any of this. Recommend any write action, at least through the pilot phase, require explicit
  operator-invoked confirmation rather than autonomous AI-initiated writes to institutional-relation or
  publication-cycle records.

## 12. Minimum Safe Implementation Sequence

**Phase 0 (blocking, non-negotiable):**
(a) Codex/operator resolves the relationship between this proposal and `oar2_define_seat_to_c3field_operational_transition_v1.meta.md`
— same domain, different purpose, neither executed. This advisory does not pick a winner.
(b) Close the RLS gap on `system_process_registry`/`system_oar_queue`/`system_oar_execution_evidence` — security
hygiene independent of which vision for c3field.online proceeds.

**Phase 1:** Add a minimal operator-only access gate before any new module ships. The existing read-only console
may remain public as-is.

**Phase 2:** Build exactly one proof-case record (§10) — the July 4–10 cycle, manually backfilled — as a single
flat record, not the five-module system.

**Phase 3:** If the proof case validates the workflow, build remaining modules incrementally, each reading (not
owning) canonical filesystem governance records.

**Phase 4:** Only after Phases 1–3 are proven, consider write-capable Relational Points of Contact recording —
gated on the companion Ledger Maturation registration actually happening first.

## 13. Approximate Readiness Assessment

**~35%.** Lower than either prior codex advisory this session (Role Governance, Ledger Maturation both landed
around the "minor clarification" tier) because this proposal touches live production infrastructure and public
exposure, not just repository documents — the stakes of getting Phase 0 wrong are materially higher than a
naming choice. What's working in its favor: a proven, reusable application-boundary pattern already live in
production, and analysis questions 3–10 all have clear, evidence-backed answers (§5–§10). What's holding it back:
an unresolved competing proposal for the same domain, and a live security gap unrelated to but adjacent to this
proposal's likely infrastructure.

## 14. Final Disposition

**PHASED IMPLEMENTATION REQUIRED.**

Not **READY FOR BOUNDED IMPLEMENTATION** or **READY AFTER MINOR ARCHITECTURE CLARIFICATION** — Phase 0 is a real
precondition, not a wording fix: a genuine unresolved fork exists between this proposal and an already-proposed,
never-closed alternative vision for the same live domain, and only Codex/operator can resolve which one governs.
Not **FURTHER CODEX DEVELOPMENT REQUIRED** or **HOLD WITH REASON** either — everything past Phase 0 has a clear,
specified path (§5–§10, §12), so this isn't a case of needing more conceptual development before an answer is
possible; the answer is "resolve the fork and close the RLS gap, then proceed in the sequence given."

---

## Constraints Confirmed

No application, route, table, migration, authentication configuration, c3 Key/DAO activation, contributor role,
Role Workbench, authority transfer, Codex file modification, Ledger entry modification, Relational Point of
Contact registration, publication, institutional outreach, public claim, runtime code, or deployment was created
or performed by this OAR. This document and its filed OAR2 companion are the only artifacts produced.
