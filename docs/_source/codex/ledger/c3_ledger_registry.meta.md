---
document_type: registry
authority_level: governance
document_scope: c3_ledger
title: c3 Ledger — Registry of Record
status: registered
operator: op044
system: codex
executor: Claude
established_by: OAR/OAR2/codex/oar2_establish_c3_ledger_and_record_first_entry_v1.meta.md
date: 2026-07-10
---

# c3 Ledger — Registry of Record

This file is the registry of record for the c3 Ledger. It does not hold ledger entry content — each entry is
its own file under `docs/_source/codex/ledger/`, named `c3_ledger_NNNN_<slug>.meta.md`, in ascending
`ledger_entry_id` order.

## Standing

| Field | Value |
|---|---|
| Name | c3 Ledger |
| Classification | Codex relational discovery ledger |
| Authority | Codex |
| Function | Preserve inquiry, relational discovery, provenance, emerging knowledge, and implementation elevation before or alongside formal standing determination |
| Operational Status | Registered record structure; may record implementation elevation but does not itself authorize implementation mutation |
| Public Status | Not public |
| Runtime Status | No runtime authorized |
| Database Status | No database schema authorized |
| Contributor Status | Operator and executor registration only, until contributor governance is separately seated |

## Purpose

The c3 Ledger preserves the emergence of relationships that become visible through inquiry. Its purpose is not
to declare governing truth — it is to record the inquiry that gave rise to a discovery, the relationships
observed, the context in which they became visible, the provisional interpretation, the implications
identified, the disposition or next governance route, and the lineage through which the discovery may later be
reviewed. The Ledger preserves how an idea became encounterable.

The Ledger may also preserve when an Operator confirms that a discovery has crossed from exploratory or
provisional architecture into an implementation dependency. This implementation elevation changes the entry's
standing and disposition, but it does not itself authorize repository, database, chain, wallet, deployment, or
other consequential mutation.

## Governing Distinction

- **Ledger Entry** — records a discovery, observation, relation, emerging proposition, or confirmed implementation dependency. Does not itself grant implementation mutation authority.
- **Standing Proposition** — a proposition separately reviewed and granted standing through Codex governance.
- **Implementation Elevation** — an Operator-confirmed determination that a ledger discovery must now be preserved as a required implementation target or dependency. Elevation changes ledger standing and routes bounded implementation work, but does not itself perform or authorize the mutation.
- **Codex Principle** — a governing principle established only after sufficient review, relation, and validation.
- **OAR** — the governed transfer mechanism through which authority, instruction, execution, and confirmation move between participants and environments.

The Ledger records discovery and implementation elevation. The OAR transfers governed work. The Codex determines
standing. An entry existing in this ledger is never, by itself, evidence of principle status or unrestricted
operational authority.

## Implementation Elevation Process

When an emerging discovery becomes necessary to avoid architectural drift, destructive backtracking, or
competing implementation models, the Operator may elevate the ledger entry to implementation standing.

The repeatable process is:

1. **Discover** — record the relation, inquiry, evidence, implications, and provisional standing in the Ledger.
2. **Elevate** — Operator confirms that the minimal function or relation is now an implementation dependency.
3. **Update Standing** — the Ledger entry records the exact elevated standing and the bounded implementation target; expansion beyond that target remains explicitly held unless separately confirmed.
4. **Route** — a separate bounded OAR2 carries the authority for any consequential repository, database, chain, wallet, deployment, or other implementation mutation.
5. **Return** — the Registrar returns execution evidence through OAR1/CanCom for review and Operator disposition.
6. **Reconcile Standing** — after disposition, the Ledger entry is updated to reflect the implemented, held, superseded, expanded, or otherwise resolved state, with evidence/OAR references preserved.

Implementation elevation therefore preserves priority and architectural intent early without allowing the
Ledger itself to become an execution surface.

## Execution Identity Collision Rule

One `execution_instance_id` may resolve to only one operative OAR authority.

If two materially different OARs, migrations, or model branches claim the same execution instance before
execution:

1. do not choose one by recency, path proximity, filename similarity, or executor preference;
2. hold that execution identity from mutation;
3. preserve both conflicting sources as provenance;
4. reconcile the model/authority outside the execution environment;
5. supersede the collided execution identity; and
6. route the reconciled authority under a new execution instance.

If a collision is discovered after possible mutation, the next action is read-only collision/reconciliation
evidence. No repair, overwrite, or normalization is implied by the collision itself.

This rule prevents concurrent model work from silently becoming competing execution authority.

## Required Entry Shape

Every c3 Ledger entry file shall include, at minimum, these fields (as frontmatter and/or body sections):

`ledger_entry_id, title, entry_type, date, operator, originating_inquiry, context, observed_relations,
discovery, implications, current_standing, disposition, related_authorities, related_oars, executor,
confirmation_status`

Optional fields: `related_systems, related_initiatives, related_domains, candidate_proposition, evidence_refs,
future_review_conditions, supersedes, superseded_by`.

For implementation-elevated entries, the entry should additionally make explicit:

- the minimal function or relation being preserved;
- what expansion remains deferred or unauthorized;
- the current implementation standing;
- the bounded next governance route;
- and the evidence or returned OAR required before standing may advance again.

No additional authority semantics may be inferred from an entry beyond what it explicitly records.

## Index

| ID | Title | Date | Current Standing | File |
|---|---|---|---|---|
| c3_ledger_0001 | Knowledge Becomes Operational Through Governed Relation | 2026-07-10 | Ledger entry only — no standing, principle, or operational authority granted | `c3_ledger_0001_knowledge_becomes_operational_through_governed_relation.meta.md` |
| c3_ledger_0002 | Labor as Contribution to Shared Living Environments | 2026-07-10 | Ledger entry only — no labor model, compensation structure, participant obligation, or operational authority granted; held for future participant-based review | `c3_ledger_0002_labor_as_contribution_to_shared_living_environments.meta.md` |
| c3_ledger_0003 | Governance Enables Regeneration | 2026-07-12 | Candidate observation — no Codex standing, principle, or operational authority granted; recommended for continued observation | `c3_ledger_0003_governance_enables_regeneration.meta.md` |
| c3_ledger_0004 | The System Refused to "Just Make It Work" | 2026-07-14 | confirmed_open — provenance investigation closed (see `oar1_investigate_migration_ledger_provenance_drift_v1`); 18 versions remain held, none repaired | `c3_ledger_0004_the_system_refused_to_just_make_it_work.meta.md` |
| c3_ledger_0005 | c3 Current as the Governed Present-State Relation | 2026-08-08 | operator_confirmed_implementation_elevated_exact_execution_routed_pending_return | `c3_ledger_0005_c3_current_as_governed_present_state.meta.md` |

## Established By

`OAR/OAR2/codex/oar2_establish_c3_ledger_and_record_first_entry_v1.meta.md`, closed by
`OAR/OAR1/codex/oar1_establish_c3_ledger_and_record_first_entry_v1.meta.md`.
