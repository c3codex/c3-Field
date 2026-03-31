---
document_type: registry_rows
authority_level: working
document_scope: registry
title: Registry Rows — Spine v1
status: validated
version: v1
session: 4
operator: op044
date: 2026-03-30
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - registry
  - rows
  - spine
  - session-4
---

# Registry Rows — Spine v1

## Six Spine Rows — First Formed Pass

| internal_key | institutional_term | functional_use | resolves_to_native | resolves_to_circuit | planted_unit | material | right_angle_directional | orthocentric_relational | surface_order | gate_order | role_order | function_order | notes |
|---|---|---|---|---|---|---|---|---|---:|---:|---:|---:|---|
| temple | entry_surface | arrival_holding | Temple | c1 | false | crystal | entry | holding | 0 | null | null | null | pre-intake arrival surface |
| antechamber | intake_surface | intake_formation | Antechamber | c1 | false | lapis | intake | forming | 1 | null | null | null | OAR1 origin surface and intake standing |
| harrumuk_passage | threshold_passage | passage_transition | Harrumuk Passage | c1 | false | obsidian | threshold | crossing | 2 | null | null | null | threshold crossing from intake toward bounded encounter |
| obsidian_chamber | chamber_surface | bounded_context | Obsidian Chamber | c2 | false | obsidian | bounded | containing | 3 | null | null | null | first bounded chamber context after passage |
| epigraph | inscription_surface | system_communication | Epigraph | c2 | false | obsidian | inscriptive | communicating | 4 | null | null | null | first bounded readable communication surface |
| phase_map | positioning_surface | relational_positioning | Phase Map | c2 | false | null | positional | positioning | 5 | null | null | null | relational positioning surface |

## Six Spine Formation Rule

These six rows form the first field spine.

They are system-known and non-planted.

They preserve:

- arrival
- intake
- threshold
- bounded chamber context
- communication
- positioning

They do not yet resolve as planted Measures units.

## Six Spine Validation

The six spine rows are valid if:

- Temple remains distinct from Antechamber
- Antechamber remains distinct from passage
- passage remains distinct from chamber
- chamber remains distinct from inscription
- inscription remains distinct from positioning
- all six remain system-known and non-planted
- circuit and geometric standing remain readable per row
