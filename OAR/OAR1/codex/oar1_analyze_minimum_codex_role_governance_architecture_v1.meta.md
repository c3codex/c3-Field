---
document_type: oar1
authority_level: governance
document_scope: codex_role_governance_architecture_analysis
title: OAR1 - Analyze Minimum Codex Role Governance Architecture
closes: OAR/OAR2/codex/oar2_analyze_minimum_codex_role_governance_architecture_v1.meta.md
operator: op044
system: codex
executor: Claude
date: 2026-07-10
status: advisory_complete
disposition: REGISTER_AFTER_MINOR_ARCHITECTURE_CLARIFICATION
---

# OAR1: Analyze Minimum Codex Role Governance Architecture

## Summary

Read-only architecture advisory, per OAR2 constraints. **No role, seat, occupancy, permission, schema,
runtime, or authority change was created or performed.** Evidence was gathered from `supabase/migrations/*.sql`
(the `native_role_registry`/`role_call_standing` migrations, `c3_key_permission_map` and sibling `c3_key_*`
tables, `measures_publication_derivative_asset`-family attribution columns), `docs/seat/`, `OAR/OAR2/c3_field/`,
`docs/_source/seed/measures_installation_role.meta.md`, `Assets/Registry/asset_registry.md`, and the prior
`OAR/OAR1/c3_field/oar1_assess_c3_field_operational_standing_and_capability_promotion_v1.meta.md`.

**Headline finding:** this is not a green-field question. Two unreconciled "role" schemas already exist in
this repo, and a prior OAR1 already flagged their non-reconciliation as unresolved drift. There is also a live
naming collision: the OAR2's candidate noun **"Seat"** (a participant's occupiable capacity within a Role)
collides with the existing, already-scoped, product-facing institutional-verification gate **"SEAT"**
(`OAR/OAR2/c3_field/oar2_define_seat_to_c3field_operational_transition_v1.meta.md`, "SEAT review," "Crystal
Seat"). Both issues have clear, evidence-backed resolutions — hence a **REGISTER AFTER MINOR ARCHITECTURE
CLARIFICATION** disposition rather than READY or HOLD.

---

## 1. Current Role-Related Architecture Inventory

Three independent, non-unified conventions for "role" already exist:

| Convention | Location | Shape | Status |
|---|---|---|---|
| Nine native roles / role_call | `supabase/migrations/202606290001_register_nine_roles_and_role_call_standing.sql`, `...202606290002_...passage_modes...`, `...202606290004_...role_key_security_boundary...` | JSONB `native_role_registry` in `measures_registry.metadata`: 9 roles across 3 material families (obsidian: gatekeeper/examiner/witness; lapis: guide/scribe/steward; marble: resolver/cartographer/sealkeeper), each with `role_key, role_name, material_family, authority[], function` | Seated. **Explicitly declared not to be login roles, permission groups, or credentials** — a separate `role_key_security_boundary` rule forbids any future secure/login role_key from deriving from these names |
| `c3_key_permission_map` | `supabase/migrations/202606010002_c3_key_permission_map_storage_contract.sql` | `role_key, role_nft_contract, role_nft_token_id`, `permission_class` (19-value enum incl. `role_based_access`), `permission_status` (`pending/active/held/expired/revoked/rejected/migrated`), `origin_type` (`named_individual \| institution_in_service`), FK to `c3_key_temp` / `c3_key_system_function_audit` | Seated schema, **enforcement/usage not verifiable** (per prior OAR1 §6, "Identity: Held") |
| `role_contract` documents | `docs/_source/seed/measures_installation_role.meta.md` | One file per role: `document_type: role_contract`, `role_family`, `role_name`, `access_condition: {c3_access_only, operator_gated, active_operator}` | One instance seated (MEASURES Installation Architect) |

Plus informal, non-normalized attribution: `created_by_actor_class`/`approved_by_actor_class` (CHECK
`'Human'|'AI'`) and free-text `*_actor_key` columns across the publication/campaign/derivative-asset tables —
identity without a role, seat, or occupancy record behind it.

**Already flagged as unresolved**: `OAR/OAR1/c3_field/oar1_assess_c3_field_operational_standing_and_capability_promotion_v1.meta.md`
§4.3: *"Identity/permission duplication risk. Measures Registry expresses role/authority informally via
`role_call`/`role_key`-style fields inside its own tables; c3 Field has a parallel, more formal
`c3_key_permission_map` model. Which is authoritative for identity was not resolved."* This OAR2's inquiry is
the direct continuation of that open item, not a new one.

## 2. Existing Role, Actor, Identity, Seat, Permission, and Contributor Patterns

Covered in §1 above, plus: `src/` contains **no** auth/role code at all — no `supabase.auth` usage, no
`useAuth`/`useRole`/`usePermission` hook, no session or RBAC logic anywhere in the runtime. Every existing
"role" pattern is data-layer only; nothing in the running application currently reads or enforces any of them.
`c3 key` (the most-developed identity substrate — `c3_key_temp`, `c3_key_permission_map`,
`c3_key_system_function_audit`, `c3_key_source_oar_binding`, plus ~180 `docs/oar/measures_interoperability/`
design documents) is explicitly held per the DAO/Codex declaration's Activation Boundary: *"Until [wallet
infrastructure, smart contract deployment, on-chain disbursement, c3 key issuance] are seated: no c3 keys may
be issued."*

## 3. Minimum Proposed Definition of a Codex Role Object

Minimum canonical fields (deliberately smaller than the OAR2's full candidate list in its §1 — several of the
listed fields belong to Occupancy or Standing, not Role itself, per §4 below):

`role_id, title, originating_institutional_need, purpose, responsibilities[], authority_boundary,
constraints[], required_capabilities[], related_system (nullable — Codex-universal roles omit this),
related_initiative (nullable), max_concurrent_occupants, standing, lifecycle_state`

Deliberately **excluded** from the Role object itself: evidence records, occupant identity, delegation state,
review history — these belong to Occupancy (§4, §6) or to the evidence layer, not to the Role definition. A
Role should be definable and hold standing with zero of those fields populated, which is the point of §4's
proposition.

## 4. Recommended Distinction: Responsibility, Role, Seat, Occupant, Contribution, Evidence

- **Responsibility** and **Role** are distinct: Responsibility is the institutional need itself (why); Role is
  the governed object that formally recognizes and bounds it (what/who-may). This distinction is sound and
  should be preserved.
- **Seat as a separate canonical object is not recommended at minimum scope, and its name should not be
  reused.** See §11 (naming collision) and §8 below for the full reasoning. Capacity and multiplicity
  (one/many/shared/rotating occupancy) can be modeled with a single `max_concurrent_occupants` field on Role
  plus multiple concurrent **Occupancy** rows against the same `role_id` — no intermediate object is required
  to express "how many people can hold this role right now." Introducing Seat as a distinct object before any
  role has needed more than `max_concurrent_occupants` would violate the OAR2's own instruction to "recommend
  only the minimum canonical structure necessary."
- **Occupant** is not itself a new object — it is a reference (`actor_class` + `actor_key`, matching the
  already-seated Human/AI attribution pattern) inside an **Occupancy** record.
- **Contribution** and **Evidence** are correctly kept separate from both Role and Occupancy: they are records
  *produced by* an occupancy, not properties *of* the role or the occupancy state itself. Recommend a light
  evidence-of-fulfillment record modeled on the existing `system_oar_execution_evidence` pattern (append-only,
  linked by a foreign key, not embedded).

**Net recommendation: two canonical objects at minimum scope — Role and Occupancy — not five.** Responsibility
is captured as a field on Role, not a separate object; Seat is capacity-on-Role plus cardinality-of-Occupancy,
not a separate object; Contribution/Evidence are a downstream evidence record referencing Occupancy.

## 5. Recommended Role Lifecycle

`need_identified → proposed → modeled → under_review → standing_granted → active (occupied or vacant) →
suspended → retired`

`dormant` is not a distinct lifecycle state — it is `active` with zero current Occupancy rows (a vacant but
standing role), directly satisfying the OAR2's Responsibility-Before-Occupancy proposition (§2 below). `shared`
and `delegated` are not Role states — they are Occupancy states (§6). Collapsing the OAR2's longer candidate
list this way keeps one unambiguous lifecycle on Role and pushes occupancy-specific states onto Occupancy,
resolving the OAR2's own §5 concern about "whether one lifecycle would create ambiguity" — yes, it would, if
Role and Occupancy shared one state machine; keeping them separate removes the ambiguity.

## 6. Recommended Occupancy Lifecycle

`proposed → accepted → active → delegated (nullable, references delegate occupancy) → ended (voluntary |
responsibility_concluded | capacity_changed | superseded)`

Minimum Occupancy record fields: `occupancy_id, role_id, actor_class (Human|AI — reuse existing CHECK
convention), actor_key, authority_accepted_at, constraints_acknowledged, start_condition, end_condition,
status`. This is deliberately close to the OAR2's own §6 list, minus fields (specialization evidence, review
authority, contribution evidence) that belong to the evidence layer, not the occupancy record itself — keeping
Occupancy a state record, not a mixed state+audit-log object.

## 7. Recommended Authority and Constraint Model

Bind `authority_boundary` and `constraints[]` directly to the Role object (§3), not to the Occupant. This
preserves the OAR2's explicit instruction: *"Do not allow a role definition to silently expand the authority
of an occupant, executor, system, or initiative."* An occupant's authority is exactly the Role's declared
authority for the duration of an `active` Occupancy — never more, never system-inherited. This is consistent
with, and should explicitly reference, the already-seated `role_key_security_boundary` rule (native role
authority ≠ login/credential authority) so the two boundaries are read as one continuous rule, not two
competing ones.

## 8. Recommended Codex Placement

- **Universal Codex layer** (`docs/_source/codex/` or a new `OAR/OAR1|OAR2/codex/` filing, consistent with
  precedent set by this OAR and the Ledger's establishment): the Role/Occupancy **schema and lifecycle
  definition** itself — this is Codex governance architecture, same tier as the c3 Model and Standing lifecycle
  already registered.
- **System-specific layer**: individual Role instances (e.g., "MEASURES Installation Architect") stay where
  they already live — `docs/_source/seed/`-style `role_contract` files, or eventually DB rows once a registry
  exists — scoped to the owning system, not centralized under Codex. This matches the existing
  `measures_installation_role.meta.md` convention and requires no new placement invention.
- **Do not** create a role registry, one-file-per-role structure, responsibility registry, role-standing
  record, or new OAR categories under this OAR — those are the "register" phase's job, not this advisory's.

## 9. Relationship to Modeled Initiatives

A Role's `related_initiative` field should reference a Codex-modeled initiative once one exists (per the
already-registered Codex Initiative Governance Architecture), but should remain nullable — persistent
institutional roles (e.g., "Executor") are not scoped to any single initiative and must be definable before or
independent of initiative modeling.

## 10. Relationship to Autonomous Systems

The Role/Occupancy **schema** (object shape, lifecycle states, authority-binding rule) must be universal Codex
architecture — if each autonomous system invented its own Role shape, the exact duplication problem already
flagged in §1 (`native_role_registry` vs. `c3_key_permission_map`) would recur a third time. The **content** of
individual roles (which roles exist, what responsibilities they carry) is correctly system-specific, per the
OAR2's own boundary: Measures Registry and unDrifted remain autonomous, and a role referencing an autonomous
system does not subordinate that system to another operational authority. This mirrors the existing OAR
taxonomy split already in place: the OAR *process* is Codex-universal; OAR *categories/content* are
system-scoped.

## 11. Structural Drift Risks (Required Drift Analysis)

Two risks from the OAR2's list are not hypothetical — they are already present in the repo today:

- **Duplicated role definitions across systems — already occurred.** `native_role_registry` and
  `c3_key_permission_map.role_key` are two live, unreconciled role schemas (§1). Any Role Governance
  registration must explicitly state how these relate (superseded-by, reconciled-with, or declared
  out-of-scope) rather than adding a third parallel scheme. Recommend: `native_role_registry`'s nine roles stay
  explicitly out of scope (they are already self-declared non-login/non-permission structural encounter
  authorities per `role_key_security_boundary`); `c3_key_permission_map.role_key` should be evaluated as the
  candidate backing store for the new Occupancy's `actor_key` once c3 key issuance activates, not replaced by a
  fourth scheme.
- **Naming collision — live, not hypothetical.** The OAR2's candidate noun "Seat" collides with the existing,
  already-scoped institutional-verification gate "SEAT" (`OAR/OAR2/c3_field/oar2_define_seat_to_c3field_operational_transition_v1.meta.md`,
  product-facing "SEAT review" / "Crystal Seat" terminology in `docs/seat/measures_registry_isolated/`). These
  are unrelated concepts (participant capacity vs. institution-level verification) sharing one word, and SEAT
  already has its own live, if unexecuted, OAR2. This advisory's §4 recommendation (drop "Seat" as a separate
  object; use `max_concurrent_occupants` + multiple `Occupancy` rows instead) resolves this by not needing the
  word at all. If a future registration still wants a "Seat" noun for some reason, it must not proceed without
  explicit disambiguation from institutional SEAT.
- **Person-role conflation — already latent.** The existing `*_actor_key` attribution columns already store
  bare identity strings (`'claude_sonnet_5'`, `'op044'`) with no role reference at all — i.e., current practice
  already looks like "contribution attributed to a person," not "contribution attributed to a role." Recommend
  any future registration require `actor_key` to be paired with a `role_id`/Occupancy reference going forward,
  rather than retrofitting the historical rows.
- **Role Workbench implementation preceding role architecture** — correctly identified as a risk by the OAR2
  itself; confirmed no Role Workbench design exists beyond the single placeholder mention in
  `Assets/Registry/asset_registry.md`. This advisory does not remove that gate; Role Governance registration
  (Role + Occupancy schema) should precede Role Workbench (the UI/workflow for humans to act on roles) by at
  least one full registration cycle.
- Remaining risks from the OAR2's list (title inflation, permanent roles without persistent responsibility,
  capability-vs-authority conflation, indefinite occupancy, unbounded contribution expectations) have no
  present-tense evidence of occurring — they are legitimate forward risks to constrain in the lifecycle design
  (§5–§7 above already address most of them structurally) rather than findings against current state.

## 12. Minimum Safe Sequence for Future Registration and Implementation

1. Register the Role + Occupancy schema (two objects, per §4) as Codex governance architecture — analysis
   only, no rows.
2. In that same registration, explicitly reconcile `native_role_registry` (declared out-of-scope, structural
   only) and `c3_key_permission_map.role_key` (declared candidate future backing store, not yet active) — do
   not leave the duplication unresolved a second time.
3. Resolve the Seat/SEAT naming question explicitly in the registration text, even if the resolution is simply
   "Seat is not introduced as an object; see Occupancy."
4. Model exactly one real role (a persistent institutional one, e.g. "Executor" or "Operator") end-to-end as a
   proof case before building tooling — this mirrors how the c3 Ledger was proven with one real entry before
   being treated as a going structure.
5. Only after step 4 is confirmed working should Role Workbench (human-facing tooling) be scoped, per the
   OAR2's own drift-risk ordering.

## 13. Final Disposition

**REGISTER AFTER MINOR ARCHITECTURE CLARIFICATION.**

The core proposition — "a role is not defined by its occupant" — is coherent with existing architecture and is
in fact already implicitly supported by evidence (roles like the seated `role_call_standing` roles persist
independent of any occupant; the `measures_installation_role.meta.md` role_contract exists with no occupant
record attached). The c3 Model route proposed in the OAR2's §12 (c1 Connect → c2 Contribute → Standing Review →
c3 Create) is coherent and requires no modification — it matches the shape this very advisory-then-registration
sequence has already followed twice (executor advisory → Codex registration; advisory → Ledger registration).

It is not **READY TO REGISTER** as-is because two specific, resolvable issues must be folded into the
registration text first: (a) the Seat/SEAT naming collision (§11) and (b) explicit reconciliation of the two
existing unreconciled role schemas (§1, §11) rather than registering a third parallel one. Neither requires
further Codex development or new inquiry — both have concrete resolutions identified in this advisory (§4, §12
steps 2–3) — hence not **HOLD** or **FURTHER CODEX DEVELOPMENT REQUIRED**, just incorporation of these two
clarifications into whatever OAR2 next proposes to register Role Governance.

---

## Constraints Confirmed

No role, occupant, seat, occupancy, contributor permission, Role Workbench, database schema, migration,
runtime code, public surface, RLS change, system-authority change, c3 Model modification, Ledger elevation,
compensation definition, c3 Field activation, or labor/employment inference was created or performed by this
OAR. This document and its filed OAR2 companion are the only artifacts produced.
