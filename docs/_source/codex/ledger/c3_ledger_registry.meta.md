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
| Function | Preserve inquiry, relational discovery, provenance, and emerging knowledge before standing determination |
| Operational Status | Registered record structure only |
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

## Governing Distinction

- **Ledger Entry** — records a discovery, observation, relation, or emerging proposition. Does not itself
  grant standing.
- **Standing Proposition** — a proposition separately reviewed and granted standing through Codex governance.
- **Codex Principle** — a governing principle established only after sufficient review, relation, and
  validation.
- **OAR** — the governed transfer mechanism through which authority, instruction, execution, and confirmation
  move between participants and environments.

The Ledger records discovery. The OAR transfers governed work. The Codex determines standing. An entry existing
in this ledger is never, by itself, evidence of standing, principle status, or operational authority.

## Required Entry Shape

Every c3 Ledger entry file shall include, at minimum, these fields (as frontmatter and/or body sections):

`ledger_entry_id, title, entry_type, date, operator, originating_inquiry, context, observed_relations,
discovery, implications, current_standing, disposition, related_authorities, related_oars, executor,
confirmation_status`

Optional fields: `related_systems, related_initiatives, related_domains, candidate_proposition, evidence_refs,
future_review_conditions, supersedes, superseded_by`.

No additional authority semantics may be inferred from an entry beyond what it explicitly records.

## Index

| ID | Title | Date | Current Standing | File |
|---|---|---|---|---|
| c3_ledger_0001 | Knowledge Becomes Operational Through Governed Relation | 2026-07-10 | Ledger entry only — no standing, principle, or operational authority granted | `c3_ledger_0001_knowledge_becomes_operational_through_governed_relation.meta.md` |
| c3_ledger_0002 | Labor as Contribution to Shared Living Environments | 2026-07-10 | Ledger entry only — no labor model, compensation structure, participant obligation, or operational authority granted; held for future participant-based review | `c3_ledger_0002_labor_as_contribution_to_shared_living_environments.meta.md` |
| c3_ledger_0003 | Governance Enables Regeneration | 2026-07-12 | Candidate observation — no Codex standing, principle, or operational authority granted; recommended for continued observation | `c3_ledger_0003_governance_enables_regeneration.meta.md` |
| c3_ledger_0004 | The System Refused to "Just Make It Work" | 2026-07-14 | confirmed_open — provenance investigation closed (see `oar1_investigate_migration_ledger_provenance_drift_v1`); 18 versions remain held, none repaired | `c3_ledger_0004_the_system_refused_to_just_make_it_work.meta.md` |

## Established By

`OAR/OAR2/codex/oar2_establish_c3_ledger_and_record_first_entry_v1.meta.md`, closed by
`OAR/OAR1/codex/oar1_establish_c3_ledger_and_record_first_entry_v1.meta.md`.
