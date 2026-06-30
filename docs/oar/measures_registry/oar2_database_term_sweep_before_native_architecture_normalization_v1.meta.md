---
document_type: oar2
authority_level: working
document_scope: database_term_sweep
title: OAR2 — Database Term Sweep Before Native Architecture Normalization
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 — Database Term Sweep Before Native Architecture Normalization

## OBSERVED

Encounter renderer architecture is structurally complete.

FREE has replaced inferred runtime.

Before content seeding or term normalization, the live database must be swept for stale, deprecated, missing, or misaligned encounter terms.

Content seeding must not proceed from memory or thread assumptions.

Codex/DB standing must be checked first.

## ALIGNED

Native order:

Codex holds.
Systems align.
Measures determine.
Field arranges.
Encounter Boundary allows.
Renderer manifests.
Optics prove.

Term normalization must begin from live database evidence.

No mutation is allowed in this OAR.

This is inventory only.

## ROUTED

Perform read-only database sweep across relevant Measures Registry tables.

Target terms to search:

- structure_passage
- evaluate_structure_path
- eval_passage
- structural_drift_publication
- crystal_chamber
- crystal chamber
- marble_pathway_reveal
- iis_eval_gate1
- crystal_seat_orientation_passage
- obsidian_chamber_orientation_passage
- marble_chamber_orientation_passage

Relevant active replacements:

- structure_passage -> crystal_seat_orientation_passage
- eval_passage -> obsidian_chamber_orientation_passage
- marble_pathway_reveal -> marble_chamber_orientation_passage
- evaluate_structure_path -> deprecated / replaced by Crystal Seat path-entry standing
- structural_drift_publication -> deprecated_reference / legacy_route_alias / migration_note / audit_trace only

## TABLES TO SWEEP

At minimum inspect:

- measures_registry
- measures_encounter_def
- measures_encounter_surface_assignment
- measures_release_state
- measures_transition_rule
- measures_media_map
- measures_registry_root

If schema supports broader text search safely, include any Measures Registry table containing:

- key
- slug
- surface
- route
- title
- display_title
- metadata
- encounter_structure
- release state
- media role
- transition target

## OUTPUT REQUIREMENTS

Return exact evidence for every match.

For each match include:

- table
- column
- row identifier
- current value
- relevant surrounding payload where useful
- recommended disposition

Recommended disposition must be one of:

- active_keep
- replace_now
- deprecate
- legacy_alias_only
- migration_required
- missing_required
- audit_trace_only
- hold_for_operator_review

## REQUIRED FINDINGS

OAR1 must answer:

1. Which stale terms exist in live DB?
2. Which deprecated terms are still active?
3. Which replacement terms already exist?
4. Which required replacement terms are missing?
5. Which tables/columns require migration later?
6. Which terms are only safe as legacy aliases or audit trace?
7. Whether content seeding can proceed after this sweep.

## CLAUDE ROLE

Claude may:

- run read-only DB queries
- inspect relevant table schemas
- search JSON/metadata fields
- return exact evidence
- recommend disposition
- write OAR1 evidence

Claude may not:

- mutate DB
- run migrations
- update rows
- delete rows
- seed content
- change code
- edit monolith
- infer missing DB state
- mark terms seeded without evidence

## NOTCHAZZ FLAGS

Raise NotChazz flag if:

- DB mutation is attempted
- content seeding begins
- stale terms are treated as active without evidence
- replacement terms are invented
- deprecated terms are silently reused
- thread memory overrides DB evidence
- live route behavior is changed
- monolith is edited

## VALIDATION

Success is achieved when:

- read-only sweep completes
- target terms are searched across required tables
- exact row evidence is returned
- each finding has recommended disposition
- missing replacement terms are identified
- no DB mutation occurs
- no code changes occur
- no content seeding occurs
- OAR1 documents findings and next recommended OAR

Expected OAR1:

docs/oar/measures_registry/oar1_database_term_sweep_before_native_architecture_normalization_v1.meta.md

---

## CLOSE

Do not normalize from assumption.

Sweep Codex standing first.

Then normalize.

Nothing is invented.
