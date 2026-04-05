---
document_type: working_doc
authority_level: working
document_scope: registry
title: Session 4 Registry Identity Working
session: 4
operator: op044
date: 2026-03-30
status: drafting
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - session-4
  - registry
  - identity
  - field-spine
  - working
---

# Session 4 Registry Identity Working

## Purpose

Define registrable unit classes before asset seating.

Registry identity must be seated from unit relation and Envelope logic, not from assets, names, or presentation surfaces.

## Governing Distinction

- Envelope identifies what is being carried
- registry identifies what may be planted
- asset presence does not establish registry truth
- structural surface does not equal registrable unit

## Unit Type Set

- structural_surface
- passage
- encounter_surface
- gate
- epithet
- me

## Proposed Columns

| internal_key | display_title | unit_type | registry_order | material | is_registrable | requires_envelope | notes |
|---|---|---|---:|---|---|---|---|

## First Classification Pass

| internal_key | display_title | unit_type | registry_order | material | is_registrable | requires_envelope | notes |
|---|---|---|---:|---|---|---|---|
| temple | Temple | structural_surface | 0 | lapis | false | false | pre-gate holding container |
| antechamber | Antechamber | structural_surface | 1 | lapis | false | true | intake surface, OAR1 origin surface |
| harrumuk_passage | Harrumuk Passage | passage | 2 | obsidian | false | true | threshold crossing from antechamber |
| obsidian_chamber | Obsidian Chamber | structural_surface | 3 | obsidian | false | false | first material chamber after intake |
| epigraph | Epigraph | encounter_surface | 4 | obsidian | false | false | first encounter surface within obsidian |
| phase_map | Phase Map | encounter_surface | 5 | lapis | false | false | relational positioning surface |

## Working Notes

### Structural Reading

These six rows are currently treated as Field-spine surfaces, not planted Measures units.

They structure passage, encounter availability, and relational positioning.

They do not yet resolve as gates, epithets, or MEs.

### Current Constraint

Do not let structural surfaces impersonate registrable units.

Do not let encounter visibility impersonate registry truth.

Do not let asset naming enter before class and key stability are defined.

## Pending Questions

1. Should Temple and Obsidian Chamber remain pure structural surfaces in registry reference only?
2. Does Epigraph belong as encounter_surface only, or as a registered encounter dependency?
3. Does Phase Map belong as encounter_surface only, or as a registry-facing positioning surface?
4. Should passage surfaces be tracked in registry identity, even when not registrable?

## Provisional Rule

A row may appear in registry identity reference without being a registrable unit.

## Next Pass

Freeze whether the following are true registry units or structural reference rows only:

- gate_i
- gate_ii
- epithet_i through epithet_ix
- me_01 through me_13

## First Classification Lock

| name | system_known | planted_unit | notes |
|---|---|---|---|
| Temple | yes | no | pre-gate holding container |
| Antechamber | yes | no | intake surface, OAR1 origin surface |
| Harrumuk Passage | yes | no | threshold crossing from Antechamber |
| Obsidian Chamber | yes | no | first material chamber after intake |
| Epigraph | yes | no | first encounter surface within Obsidian |
| Phase Map | yes | no | relational positioning surface |
| Gate I | yes | yes | native gate row |
| Gate II | yes | yes | native gate row |
| Epithet I | yes | yes | oracle card role seat |
| ME 01 | yes | yes | Sumerian functional unit |

### Lock Rule

A unit may be system-known without being a planted Measures unit.

Field-spine surfaces are system-known.
Gates, Epithets, and MEs are planted Measures units.
## Planted Unit Expansion

| internal_key | display_title | unit_family | system_known | planted_unit | material | notes |
|---|---|---|---|---|---|---|
| gate_i | Gate I | gate | yes | yes | obsidian | native gate row |
| gate_ii | Gate II | gate | yes | yes | obsidian | native gate row |
| epithet_i | Epithet I | epithet | yes | yes | crystal | oracle card role seat |
| epithet_ii | Epithet II | epithet | yes | yes | crystal | oracle card role seat |
| epithet_iii | Epithet III | epithet | yes | yes | crystal | oracle card role seat |
| epithet_iv | Epithet IV | epithet | yes | yes | crystal | oracle card role seat |
| epithet_v | Epithet V | epithet | yes | yes | crystal | oracle card role seat |
| epithet_vi | Epithet VI | epithet | yes | yes | crystal | oracle card role seat |
| epithet_vii | Epithet VII | epithet | yes | yes | crystal | oracle card role seat |
| epithet_viii | Epithet VIII | epithet | yes | yes | crystal | oracle card role seat |
| epithet_ix | Epithet IX | epithet | yes | yes | crystal | oracle card role seat |
| me_01 | ME 01 | me | yes | yes | marble | Sumerian functional unit |
| me_02 | ME 02 | me | yes | yes | marble | Sumerian functional unit |
| me_03 | ME 03 | me | yes | yes | marble | Sumerian functional unit |
| me_04 | ME 04 | me | yes | yes | marble | Sumerian functional unit |
| me_05 | ME 05 | me | yes | yes | marble | Sumerian functional unit |
| me_06 | ME 06 | me | yes | yes | marble | Sumerian functional unit |
| me_07 | ME 07 | me | yes | yes | marble | Sumerian functional unit |
| me_08 | ME 08 | me | yes | yes | marble | Sumerian functional unit |
| me_09 | ME 09 | me | yes | yes | marble | Sumerian functional unit |
| me_10 | ME 10 | me | yes | yes | marble | Sumerian functional unit |
| me_11 | ME 11 | me | yes | yes | marble | Sumerian functional unit |
| me_12 | ME 12 | me | yes | yes | marble | Sumerian functional unit |
| me_13 | ME 13 | me | yes | yes | marble | Sumerian functional unit |
## Planted Unit Constraints

- Gate 0 is not native
- 9 Oracle Cards of the Knew resolve to Epithets
- 13 Sumerian translation units resolve to MEs
- display_title is not authority
- asset naming is not authority
- internal_key must freeze before title refinement
## Naming Freeze Rule

At this stage:

- internal_key is the working identity handle
- display_title remains placeholder only
- native_name is deferred until class stability is confirmed
- no asset-derived naming enters planted unit identity at this stage

This preserves registry clarity while preventing naming drift from assets, routes, or presentation surfaces.
## Current Identity Rule

Identity freeze order:

1. unit class
2. internal_key
3. planted vs non-planted distinction
4. native_name
5. display_title refinement
6. asset attachment

## First Institutional Layer

| internal_key | institutional_term | resolves_to_native | planted_unit | notes |
|---|---|---|---|---|
| temple | entry_surface | Temple | no | pre-gate holding container |
| antechamber | entry_surface | Antechamber | no | intake surface |
| harrumuk_passage | threshold_passage | Harrumuk Passage | no | threshold crossing |
| obsidian_chamber | chamber_surface | Obsidian Chamber | no | first bounded chamber context |
| epigraph | inscription_surface | Epigraph | no | first readable encounter surface |
| phase_map | positioning_surface | Phase Map | no | relational positioning surface |
| gate_i | progression_unit | Gate I | yes | native gate row |
| gate_ii | progression_unit | Gate II | yes | native gate row |
| epithet_i | role_unit | Epithet I | yes | oracle card role seat |
| me_01 | function_unit | ME 01 | yes | Sumerian functional unit |
## First-Layer Institutional Terms Lock

| institutional_term | use |
|---|---|
| entry_surface | initial arrival and intake standing |
| threshold_passage | transition from intake toward bounded encounter |
| chamber_surface | bounded encounter context |
| inscription_surface | first readable encounter surface |
| positioning_surface | relational visibility and placement surface |
| progression_unit | thresholded registered unit |
| role_unit | stabilized functional role |
| function_unit | registered functional unit |

## Term Constraint

These terms normalize first-layer institutional readability.

They do not replace native resolution.
They do not define authority.
They do not collapse native distinctions.
## Resolution Rule

Institutional term describes access layer function.
Native resolution identifies what the unit actually is.
 ## First-Layer Institutional Terms Lock

| institutional_term | use |
|---|---|
| entry_surface | initial arrival and intake standing |
| threshold_passage | transition from intake toward bounded encounter |
| chamber_surface | bounded encounter context |
| inscription_surface | first readable encounter surface |
| positioning_surface | relational visibility and placement surface |
| progression_unit | thresholded registered unit |
| role_unit | stabilized functional role |
| function_unit | registered functional unit |

## Resolution Rule

Institutional term describes access-layer function.
Native resolution identifies what the unit actually is.

These terms do not replace native resolution.
They do not define authority.
They do not collapse native distinctions.
## First Institutional Layer Mapping

| internal_key | institutional_term | resolves_to_native | planted_unit | notes |
|---|---|---|---|---|
| temple | entry_surface | Temple | no | pre-gate holding container |
| antechamber | entry_surface | Antechamber | no | intake surface |
| harrumuk_passage | threshold_passage | Harrumuk Passage | no | threshold crossing |
| obsidian_chamber | chamber_surface | Obsidian Chamber | no | first bounded chamber context |
| epigraph | inscription_surface | Epigraph | no | first readable encounter surface |
| phase_map | positioning_surface | Phase Map | no | relational positioning surface |
| gate_i | progression_unit | Gate I | yes | native gate row |
| gate_ii | progression_unit | Gate II | yes | native gate row |
| epithet_i | role_unit | Epithet I | yes | oracle card role seat |
| me_01 | function_unit | ME 01 | yes | Sumerian functional unit |
## Expanded First Institutional Layer Mapping

| internal_key | institutional_term | resolves_to_native | planted_unit | material | notes |
|---|---|---|---|---|---|
| temple | entry_surface | Temple | no | lapis | pre-gate holding container |
| antechamber | entry_surface | Antechamber | no | lapis | intake surface |
| harrumuk_passage | threshold_passage | Harrumuk Passage | no | obsidian | threshold crossing |
| obsidian_chamber | chamber_surface | Obsidian Chamber | no | obsidian | first bounded chamber context |
| epigraph | inscription_surface | Epigraph | no | obsidian | first readable encounter surface |
| phase_map | positioning_surface | Phase Map | no | lapis | relational positioning surface |
| gate_i | progression_unit | Gate I | yes | obsidian | native gate row |
| gate_ii | progression_unit | Gate II | yes | obsidian | native gate row |
| epithet_i | role_unit | Epithet I | yes | crystal | oracle card role seat |
| epithet_ii | role_unit | Epithet II | yes | crystal | oracle card role seat |
| epithet_iii | role_unit | Epithet III | yes | crystal | oracle card role seat |
| epithet_iv | role_unit | Epithet IV | yes | crystal | oracle card role seat |
| epithet_v | role_unit | Epithet V | yes | crystal | oracle card role seat |
| epithet_vi | role_unit | Epithet VI | yes | crystal | oracle card role seat |
| epithet_vii | role_unit | Epithet VII | yes | crystal | oracle card role seat |
| epithet_viii | role_unit | Epithet VIII | yes | crystal | oracle card role seat |
| epithet_ix | role_unit | Epithet IX | yes | crystal | oracle card role seat |
| me_01 | function_unit | ME 01 | yes | marble | Sumerian functional unit |
| me_02 | function_unit | ME 02 | yes | marble | Sumerian functional unit |
| me_03 | function_unit | ME 03 | yes | marble | Sumerian functional unit |
| me_04 | function_unit | ME 04 | yes | marble | Sumerian functional unit |
| me_05 | function_unit | ME 05 | yes | marble | Sumerian functional unit |
| me_06 | function_unit | ME 06 | yes | marble | Sumerian functional unit |
| me_07 | function_unit | ME 07 | yes | marble | Sumerian functional unit |
| me_08 | function_unit | ME 08 | yes | marble | Sumerian functional unit |
| me_09 | function_unit | ME 09 | yes | marble | Sumerian functional unit |
| me_10 | function_unit | ME 10 | yes | marble | Sumerian functional unit |
| me_11 | function_unit | ME 11 | yes | marble | Sumerian functional unit |
| me_12 | function_unit | ME 12 | yes | marble | Sumerian functional unit |
| me_13 | function_unit | ME 13 | yes | marble | Sumerian functional unit |
## Expansion Lock

- first-layer institutional terms remain fixed
- resolves_to_native remains placeholder where needed
- planted_unit remains the key distinction
- materials remain native
- Gate 0 remains dissolved
- role_unit count = 9
- function_unit count = 13
## Family Order Columns

| internal_key | institutional_term | resolves_to_native | planted_unit | material | surface_order | gate_order | role_order | function_order | notes |
|---|---|---|---|---|---:|---:|---:|---:|---|

## Ordered First Institutional Layer Mapping

| internal_key | institutional_term | resolves_to_native | planted_unit | material | surface_order | gate_order | role_order | function_order | notes |
|---|---|---|---|---|---:|---:|---:|---:|---|
| temple | entry_surface | Temple | no | lapis | 0 | null | null | null | pre-gate holding container |
| antechamber | entry_surface | Antechamber | no | lapis | 1 | null | null | null | intake surface |
| harrumuk_passage | threshold_passage | Harrumuk Passage | no | obsidian | 2 | null | null | null | threshold crossing |
| obsidian_chamber | chamber_surface | Obsidian Chamber | no | obsidian | 3 | null | null | null | first bounded chamber context |
| epigraph | inscription_surface | Epigraph | no | obsidian | 4 | null | null | null | first readable encounter surface |
| phase_map | positioning_surface | Phase Map | no | lapis | 5 | null | null | null | relational positioning surface |
| gate_i | progression_unit | Gate I | yes | obsidian | null | 1 | null | null | native gate row |
| gate_ii | progression_unit | Gate II | yes | obsidian | null | 2 | null | null | native gate row |
| epithet_i | role_unit | Epithet I | yes | crystal | null | null | 1 | null | oracle card role seat |
| epithet_ii | role_unit | Epithet II | yes | crystal | null | null | 2 | null | oracle card role seat |
| epithet_iii | role_unit | Epithet III | yes | crystal | null | null | 3 | null | oracle card role seat |
| epithet_iv | role_unit | Epithet IV | yes | crystal | null | null | 4 | null | oracle card role seat |
| epithet_v | role_unit | Epithet V | yes | crystal | null | null | 5 | null | oracle card role seat |
| epithet_vi | role_unit | Epithet VI | yes | crystal | null | null | 6 | null | oracle card role seat |
| epithet_vii | role_unit | Epithet VII | yes | crystal | null | null | 7 | null | oracle card role seat |
| epithet_viii | role_unit | Epithet VIII | yes | crystal | null | null | 8 | null | oracle card role seat |
| epithet_ix | role_unit | Epithet IX | yes | crystal | null | null | 9 | null | oracle card role seat |
| me_01 | function_unit | ME 01 | yes | marble | null | null | null | 1 | Sumerian functional unit |
| me_02 | function_unit | ME 02 | yes | marble | null | null | null | 2 | Sumerian functional unit |
| me_03 | function_unit | ME 03 | yes | marble | null | null | null | 3 | Sumerian functional unit |
| me_04 | function_unit | ME 04 | yes | marble | null | null | null | 4 | Sumerian functional unit |
| me_05 | function_unit | ME 05 | yes | marble | null | null | null | 5 | Sumerian functional unit |
| me_06 | function_unit | ME 06 | yes | marble | null | null | null | 6 | Sumerian functional unit |
| me_07 | function_unit | ME 07 | yes | marble | null | null | null | 7 | Sumerian functional unit |
| me_08 | function_unit | ME 08 | yes | marble | null | null | null | 8 | Sumerian functional unit |
| me_09 | function_unit | ME 09 | yes | marble | null | null | null | 9 | Sumerian functional unit |
| me_10 | function_unit | ME 10 | yes | marble | null | null | null | 10 | Sumerian functional unit |
| me_11 | function_unit | ME 11 | yes | marble | null | null | null | 11 | Sumerian functional unit |
| me_12 | function_unit | ME 12 | yes | marble | null | null | null | 12 | Sumerian functional unit |
| me_13 | function_unit | ME 13 | yes | marble | null | null | null | 13 | Sumerian functional unit |
## Family Order Rule

Order is family-bound before it is installation-bound.

- surface_order governs field-spine sequence
- gate_order governs progression units
- role_order governs role units
- function_order governs function units

No single shared registry order is seated at this stage.
Cross-family sequencing remains unresolved until installation relation is defined.
## Current Resolution

This working structure establishes:

- system-known surfaces
- planted measures units
- first-layer institutional term set
- family-bound order columns

It does not yet establish:

- cross-family installation order
- release logic
- envelope attachment logic
- asset mapping
- native name freeze
## Institutional Term Refinement

Temple and Antechamber do not share the same first-layer institutional term.

They resolve as distinct first-layer surfaces:

- Temple = entry_surface
- Antechamber = intake_surface

This preserves the distinction between arrival and intake.

## Refined First-Layer Institutional Terms Lock

| institutional_term | use |
|---|---|
| entry_surface | initial arrival surface prior to intake |
| intake_surface | structured intake standing and first-touch formation |
| threshold_passage | transition from intake toward bounded encounter |
| chamber_surface | bounded encounter context |
| inscription_surface | first readable encounter surface |
| positioning_surface | relational visibility and placement surface |
| progression_unit | thresholded registered unit |
| role_unit | stabilized functional role |
| function_unit | registered functional unit |

## Resolution Rule

Institutional term describes access-layer function.
Native resolution identifies what the unit actually is.

These terms do not replace native resolution.
They do not define authority.
They do not collapse native distinctions.
## Refined Ordered First Institutional Layer Mapping

| internal_key | institutional_term | resolves_to_native | planted_unit | material | surface_order | gate_order | role_order | function_order | notes |
|---|---|---|---|---|---:|---:|---:|---:|---|
| temple | entry_surface | Temple | no | lapis | 0 | null | null | null | pre-gate holding container |
| antechamber | intake_surface | Antechamber | no | lapis | 1 | null | null | null | intake surface, OAR1 origin surface |
| harrumuk_passage | threshold_passage | Harrumuk Passage | no | obsidian | 2 | null | null | null | threshold crossing |
| obsidian_chamber | chamber_surface | Obsidian Chamber | no | obsidian | 3 | null | null | null | first bounded chamber context |
| epigraph | inscription_surface | Epigraph | no | obsidian | 4 | null | null | null | first readable encounter surface |
| phase_map | positioning_surface | Phase Map | no | lapis | 5 | null | null | null | relational positioning surface |
| gate_i | progression_unit | Gate I | yes | obsidian | null | 1 | null | null | native gate row |
| gate_ii | progression_unit | Gate II | yes | obsidian | null | 2 | null | null | native gate row |
| epithet_i | role_unit | Epithet I | yes | crystal | null | null | 1 | null | oracle card role seat |
| epithet_ii | role_unit | Epithet II | yes | crystal | null | null | 2 | null | oracle card role seat |
| epithet_iii | role_unit | Epithet III | yes | crystal | null | null | 3 | null | oracle card role seat |
| epithet_iv | role_unit | Epithet IV | yes | crystal | null | null | 4 | null | oracle card role seat |
| epithet_v | role_unit | Epithet V | yes | crystal | null | null | 5 | null | oracle card role seat |
| epithet_vi | role_unit | Epithet VI | yes | crystal | null | null | 6 | null | oracle card role seat |
| epithet_vii | role_unit | Epithet VII | yes | crystal | null | null | 7 | null | oracle card role seat |
| epithet_viii | role_unit | Epithet VIII | yes | crystal | null | null | 8 | null | oracle card role seat |
| epithet_ix | role_unit | Epithet IX | yes | crystal | null | null | 9 | null | oracle card role seat |
| me_01 | function_unit | ME 01 | yes | marble | null | null | null | 1 | Sumerian functional unit |
| me_02 | function_unit | ME 02 | yes | marble | null | null | null | 2 | Sumerian functional unit |
| me_03 | function_unit | ME 03 | yes | marble | null | null | null | 3 | Sumerian functional unit |
| me_04 | function_unit | ME 04 | yes | marble | null | null | null | 4 | Sumerian functional unit |
| me_05 | function_unit | ME 05 | yes | marble | null | null | null | 5 | Sumerian functional unit |
| me_06 | function_unit | ME 06 | yes | marble | null | null | null | 6 | Sumerian functional unit |
| me_07 | function_unit | ME 07 | yes | marble | null | null | null | 7 | Sumerian functional unit |
| me_08 | function_unit | ME 08 | yes | marble | null | null | null | 8 | Sumerian functional unit |
| me_09 | function_unit | ME 09 | yes | marble | null | null | null | 9 | Sumerian functional unit |
| me_10 | function_unit | ME 10 | yes | marble | null | null | null | 10 | Sumerian functional unit |
| me_11 | function_unit | ME 11 | yes | marble | null | null | null | 11 | Sumerian functional unit |
| me_12 | function_unit | ME 12 | yes | marble | null | null | null | 12 | Sumerian functional unit |
| me_13 | function_unit | ME 13 | yes | marble | null | null | null | 13 | Sumerian functional unit |
## Distinction Lock

Temple is arrival.
Antechamber is intake.

Arrival does not equal intake.
Intake does not equal passage.

## Functional Use Layer

Institutional term names the access-layer form.
Functional use names the operational job performed by that surface or unit.

Functional use does not replace institutional term or native resolution.
It clarifies what the surface is doing within the first layer.
| internal_key | institutional_term | functional_use | resolves_to_native | planted_unit | material | surface_order | gate_order | role_order | function_order | notes |
|---|---|---|---|---|---|---:|---:|---:|---:|---|
| temple | entry_surface | arrival_holding | Temple | no | lapis | 0 | null | null | null | pre-gate holding container |
| antechamber | intake_surface | intake_formation | Antechamber | no | lapis | 1 | null | null | null | intake surface, OAR1
 origin surface |
| harrumuk_passage | threshold_passage | passage_transition | Harrumuk Passage | no | obsidian | 2 | null | null | null | threshold crossing |
| obsidian_chamber | chamber_surface | bounded_context | Obsidian Chamber | no | obsidian | 3 | null | null | null | first bounded chamber context |
| epigraph | inscription_surface | system_communication | Epigraph | no | obsidian | 4 | null | null | null | first readable encounter surface |
| phase_map | positioning_surface | relational_positioning | Phase Map | no | lapis | 5 | null | null | null | relational positioning surface |
| temple | entry_surface | arrival_holding | Temple | no | lapis | 0 | null | null | null | pre-gate holding container |
| antechamber | intake_surface | intake_formation | Antechamber | no | lapis | 1 | null | null | null | intake surface, OAR1 origin surface |
| harrumuk_passage | threshold_passage | passage_transition | Harrumuk Passage | no | obsidian | 2 | null | null | null | threshold crossing |
| obsidian_chamber | chamber_surface | bounded_context | Obsidian Chamber | no | obsidian | 3 | null | null | null | first bounded chamber context |
| epigraph | inscription_surface | system_communication | Epigraph | no | obsidian | 4 | null | null | null | first readable encounter surface |
| phase_map | positioning_surface | relational_positioning | Phase Map | no | lapis | 5 | null | null | null | relational positioning surface |

## Functional Use Layer

Institutional term names the access-layer form.
Functional use names the operational job performed by that surface or unit.

Functional use does not replace institutional term or native resolution.
It clarifies what the surface or unit is doing within the first layer.

## Functional Use Rule

Each surface or unit may retain one institutional term and one functional use.

- institutional_term = what kind of surface or unit it is
- functional_use = what job it performs

Do not create multiple institutional terms for a single row unless structural necessity is proven.

## Functional Use Set

| functional_use | use |
|---|---|
| arrival_holding | holds initial arrival prior to intake |
| intake_formation | structures intake and first-touch standing |
| passage_transition | carries movement across threshold |
| bounded_context | establishes bounded chamber context |
| system_communication | provides first bounded system-readable communication |
| relational_positioning | positions encounter relation and visibility |
| progression_control | governs thresholded progression unit standing |
| role_stabilization | governs stabilized functional role standing |
| function_registration | governs registered functional unit standing |

## Functional First Institutional Layer Mapping

| internal_key | institutional_term | functional_use | resolves_to_native | planted_unit | material | surface_order | gate_order | role_order | function_order | notes |
|---|---|---|---|---|---|---:|---:|---:|---:|---|
| temple | entry_surface | arrival_holding | Temple | no | lapis | 0 | null | null | null | pre-gate holding container |
| antechamber | intake_surface | intake_formation | Antechamber | no | lapis | 1 | null | null | null | intake surface, OAR1 origin surface |
| harrumuk_passage | threshold_passage | passage_transition | Harrumuk Passage | no | obsidian | 2 | null | null | null | threshold crossing |
| obsidian_chamber | chamber_surface | bounded_context | Obsidian Chamber | no | obsidian | 3 | null | null | null | first bounded chamber context |
| epigraph | inscription_surface | system_communication | Epigraph | no | obsidian | 4 | null | null | null | first readable encounter surface |
| phase_map | positioning_surface | relational_positioning | Phase Map | no | lapis | 5 | null | null | null | relational positioning surface |
| gate_i | progression_unit | progression_control | Gate I | yes | obsidian | null | 1 | null | null | native gate row |
| gate_ii | progression_unit | progression_control | Gate II | yes | obsidian | null | 2 | null | null | native gate row |
| epithet_i | role_unit | role_stabilization | Epithet I | yes | crystal | null | null | 1 | null | oracle card role seat |
| epithet_ii | role_unit | role_stabilization | Epithet II | yes | crystal | null | null | 2 | null | oracle card role seat |
| epithet_iii | role_unit | role_stabilization | Epithet III | yes | crystal | null | null | 3 | null | oracle card role seat |
| epithet_iv | role_unit | role_stabilization | Epithet IV | yes | crystal | null | null | 4 | null | oracle card role seat |
| epithet_v | role_unit | role_stabilization | Epithet V | yes | crystal | null | null | 5 | null | oracle card role seat |
| epithet_vi | role_unit | role_stabilization | Epithet VI | yes | crystal | null | null | 6 | null | oracle card role seat |
| epithet_vii | role_unit | role_stabilization | Epithet VII | yes | crystal | null | null | 7 | null | oracle card role seat |
| epithet_viii | role_unit | role_stabilization | Epithet VIII | yes | crystal | null | null | 8 | null | oracle card role seat |
| epithet_ix | role_unit | role_stabilization | Epithet IX | yes | crystal | null | null | 9 | null | oracle card role seat |
| me_01 | function_unit | function_registration | ME 01 | yes | marble | null | null | null | 1 | Sumerian functional unit |
| me_02 | function_unit | function_registration | ME 02 | yes | marble | null | null | null | 2 | Sumerian functional unit |
| me_03 | function_unit | function_registration | ME 03 | yes | marble | null | null | null | 3 | Sumerian functional unit |
| me_04 | function_unit | function_registration | ME 04 | yes | marble | null | null | null | 4 | Sumerian functional unit |
| me_05 | function_unit | function_registration | ME 05 | yes | marble | null | null | null | 5 | Sumerian functional unit |
| me_06 | function_unit | function_registration | ME 06 | yes | marble | null | null | null | 6 | Sumerian functional unit |
| me_07 | function_unit | function_registration | ME 07 | yes | marble | null | null | null | 7 | Sumerian functional unit |
| me_08 | function_unit | function_registration | ME 08 | yes | marble | null | null | null | 8 | Sumerian functional unit |
| me_09 | function_unit | function_registration | ME 09 | yes | marble | null | null | null | 9 | Sumerian functional unit |
| me_10 | function_unit | function_registration | ME 10 | yes | marble | null | null | null | 10 | Sumerian functional unit |
| me_11 | function_unit | function_registration | ME 11 | yes | marble | null | null | null | 11 | Sumerian functional unit |
| me_12 | function_unit | function_registration | ME 12 | yes | marble | null | null | null | 12 | Sumerian functional unit |
| me_13 | function_unit | function_registration | ME 13 | yes | marble | null | null | null | 13 | Sumerian functional unit |

## Functional Lock

First-layer readability is now carried by three aligned surfaces:

- institutional_term
- functional_use
- resolves_to_native

This layer remains non-authoritative.
Codex remains authority.
Field remains structure.
Measures remains registry.
Chazz remains execution.

## Three-Key Distinction

The system currently preserves three distinct keys:

- internal_key = structural row or unit handle
- envKey = Envelope continuity and retrieval handle
- c3_key = origin access standing handle

These keys do not replace one another.

They resolve to different scopes:

- internal_key resolves to registry identity
- envKey resolves to Envelope continuity
- c3_key resolves to origin participation standing

## First Registry Identity Shape

| column_name | purpose | required |
|---|---|---|
| internal_key | stable structural row handle | yes |
| institutional_term | first-layer readable type label | yes |
| functional_use | first-layer operational job | yes |
| resolves_to_native | native surface or unit this row points to | yes |
| planted_unit | whether this row is a planted Measures unit | yes |
| material | native material family | yes |
| surface_order | sequence within field-spine surfaces | no |
| gate_order | sequence within progression units | no |
| role_order | sequence within role units | no |
| function_order | sequence within function units | no |
| notes | human-readable structural clarification | no |
## Shape Rule

Every registry identity row must answer:

- what kind of thing is this
- what job does it do
- what does it resolve to natively
- is it planted
- what family does it belong to
- what order does it hold within its family

## First Registry Identity Shape

The first registry identity table exists to preserve structural distinction before release logic, asset mapping, or Envelope instance logic is introduced.

This table holds identity, first-layer institutional readability, native resolution, planted distinction, material family, and family-bound order.

## Registry Shape Purpose

This shape must allow every row to answer:

- what kind of thing is this
- what job does it perform
- what does it resolve to natively
- is it planted
- what material family does it belong to
- what order does it hold within its family

## Proposed Identity Columns

| column_name | purpose | required | value_type | notes |
|---|---|---|---|---|
| internal_key | stable structural row handle | yes | text | not a slug, not an access key |
| institutional_term | first-layer readable type label | yes | text | normalized institutional layer |
| functional_use | first-layer operational job | yes | text | describes row function |
| resolves_to_native | native surface or unit this row points to | yes | text | readable native resolution |
| planted_unit | identifies whether row is a planted Measures unit | yes | boolean | true for gates, role units, function units |
| material | native material family | yes | text | lapis, obsidian, crystal, marble |
| surface_order | order within field-spine surfaces | no | integer | nullable for non-surface rows |
| gate_order | order within progression units | no | integer | nullable for non-gate rows |
| role_order | order within role units | no | integer | nullable for non-role rows |
| function_order | order within function units | no | integer | nullable for non-function rows |
| notes | human-readable structural clarification | no | text | working clarification field |

## Shape Rule

This first table is identity-bound.

It does not yet hold:

- release state
- asset mapping
- Envelope instance logic
- envKey
- c3_key
- reveal conditions
- progression events
- route logic

## Shape Constraint

Family order is separated before installation order.

- surface_order governs system-known field-spine surfaces
- gate_order governs progression units
- role_order governs role units
- function_order governs function units

No shared installation-wide registry order is seated in this shape.

## First Table Scope

This first identity shape may include both:

- system-known non-planted surfaces
- planted Measures units

This is permitted because planted distinction is explicitly preserved by `planted_unit`.

## Table Scope Rule

A row may exist in registry identity without being a planted Measures unit.

System-known rows preserve structural sequence.
Planted rows preserve Measures unit seating.

## Current Families in Scope

### System-known, non-planted

- Temple
- Antechamber
- Harrumuk Passage
- Obsidian Chamber
- Epigraph
- Phase Map

### Planted

- progression_unit
- role_unit
- function_unit

## Three-Key Compatibility

This table uses `internal_key` only.

It does not replace:

- envKey
- c3_key

Key roles remain distinct:

- internal_key = registry row handle
- envKey = Envelope continuity handle
- c3_key = origin access standing handle

## First Registry Shape Validation

This shape is valid if it can distinguish:

- arrival from intake
- intake from passage
- passage from chamber
- chamber from inscription
- inscription from positioning
- system-known surfaces from planted units
- progression units from role units
- role units from function units

If any of these collapse, the shape is not yet ready.

## SQL-Oriented Draft Table Spec

Working table name:

`registry_identity`

Purpose:

Hold first-layer registry identity for both:

- system-known, non-planted surfaces
- planted Measures units

This table preserves:

- structural row identity
- first-layer institutional readability
- functional use
- native resolution
- planted distinction
- material family
- family-bound order

## Draft Column Spec

| column_name | sql_type | null | purpose |
|---|---|---|---|
| internal_key | text | no | stable structural row handle |
| institutional_term | text | no | first-layer readable type label |
| functional_use | text | no | first-layer operational job |
| resolves_to_native | text | no | native surface or unit this row points to |
| planted_unit | boolean | no | planted Measures distinction |
| material | text | no | native material family |
| surface_order | integer | yes | field-spine order |
| gate_order | integer | yes | progression unit order |
| role_order | integer | yes | role unit order |
| function_order | integer | yes | function unit order |
| notes | text | yes | human-readable structural clarification |

## Draft Structural Constraints

- `internal_key` must be unique
- `planted_unit` must be explicitly true or false
- `material` must resolve to a seated material family
- family order fields remain nullable outside their own family
- no row may claim more than one family order at once without explicit future justification

## Draft Family Order Rule

Expected pattern:

- surface rows use `surface_order` only
- progression units use `gate_order` only
- role units use `role_order` only
- function units use `function_order` only

All other family order fields remain null.

## Draft Example Rows

| internal_key | institutional_term | functional_use | resolves_to_native | planted_unit | material | surface_order | gate_order | role_order | function_order | notes |
|---|---|---|---|---|---|---:|---:|---:|---:|---|
| temple | entry_surface | arrival_holding | Temple | false | lapis | 0 | null | null | null | pre-gate holding container |
| antechamber | intake_surface | intake_formation | Antechamber | false | lapis | 1 | null | null | null | intake surface, OAR1 origin surface |
| gate_i | progression_unit | progression_control | Gate I | true | obsidian | null | 1 | null | null | native gate row |
| epithet_i | role_unit | role_stabilization | Epithet I | true | crystal | null | null | 1 | null | oracle card role seat |
| me_01 | function_unit | function_registration | ME 01 | true | marble | null | null | null | 1 | Sumerian functional unit |
## SQL Shape Validation Rule

This draft is valid for first implementation if:

- one row can represent one structural unit cleanly
- planted and non-planted rows remain distinguishable
- family-bound ordering remains non-collapsed
- internal_key remains stable and non-public-facing
- no access-key behavior is assigned to registry identity fields

## Value Constraint Strategy

For first seating:

- `material` is constrained now
- `institutional_term` remains open during validation
- `functional_use` remains open during validation

This allows structural firmness where the family is already known, while preserving flexibility in the first-layer institutional language until validation is complete.

## Material Constraint

Approved material values in current scope:

- lapis
- obsidian
- crystal
- marble

No other material values are seated in this first registry identity shape.

## Open-Term Rule

`institutional_term` and `functional_use` remain editable until:

- first-layer rows are fully validated
- system-known and planted distinctions hold cleanly
- no term drift is detected across families

After validation, approved value sets may be seated for both columns.

## Draft Constraint Direction

### Constrain Now

- `material` should be constrained to approved values

### Constrain Later

- `institutional_term` should remain unconstrained during first validation pass
- `functional_use` should remain unconstrained during first validation pass

## Rationale

`material` already resolves from stable native family structure.

`institutional_term` and `functional_use` belong to the institutional access layer and may still require refinement before being frozen into approved sets.

## Material Evidence Note

Observed role seats already indicate distributed material assignment.

Examples in current role logic include:

- Primus Artus → obsidian-leaning
- Gemynd Corpus → lapis-leaning
- Percipari → crystal-leaning

This confirms that role units should not be flattened into a single material family.

## Material Seating Rule

Role family and material assignment remain distinct.

- role_unit defines the structural family
- material defines the specific embodied seat of that row

Material must therefore be validated per row. 

## Governance Count Resolution

The full governance structure resolves as:

- 6 before Codex
- Codex
- 6 after Codex

This forms:

6 + 1 + 6 = 13

## Governance Rule

Codex is the central authority seat within the governance structure.

It is not outside the count.
It is the axis that completes it.

The before-six and after-six remain distinct,
but together with Codex they form the full thirteen.

## Governing Count Set

The current structural count set is:

- 7 = guardrail structure
- 9 = role field structure
- 13 = governance structure

These counts relate, but they do not collapse.

- 7 protects validity
- 9 distributes role expression
- 13 completes governance

## c3 Minimal Operating Expression

c3 is the minimal operating expression.

It is the smallest valid circuit through which coherence becomes active in lived structure.

c3 does not replace:

- axis
- full body
- guardrail protection
- role distribution
- governance structure

It is the minimum operational circuit through which these may begin to function in relation.

## Count Spine

- 1 = axis
- 2 = isomorphism
- 3 = minimal operating expression
- 4 = structure
- 5 = full body proof
- 7 = protection
- 8 = Inanna / the pattern
- 9 = distribution
- 13 = governance

## Count Distinction Rule

These count bodies relate, but they do not collapse.

- 1 anchors
- 2 preserves valid twoness
- 3 operates
- 4 structures
- 5 proves body
- 7 protects
- 8 patterns
- 9 distributes
- 13 governs

## Count Lock

1 anchors.
2 isomorphs.
3 operates.
4 structures.
5 proves.
7 protects.
8 patterns.
9 distributes.
13 governs.

## Geometric Mapping

| count | geometric function | system function | note |
|---|---|---|---|
| 1 | axis | quantum-entangled singular continuity | not duplicated |
| 2 | isomorphic relation | valid twoness / preserved structural correspondence | right-angle stabilization begins here |
| 3 | circuit | minimal operating expression | c1 c2 c3 |
| 4 | structure | bounded structural body | chamber / material / stable form |
| 5 | full body proof | embodied completeness | proves the body is present |
| 6 | touch-point body | one side of Codex adjacency | before or after Codex |
| 7 | guardrail geometry | protection / validity constraint | threshold integrity |
| 8 | pattern body | Inanna | her number |
| 9 | distributed field | role distribution / 3x3 field expression | seat structure |
| 13 | full governance body | 6 before + Codex + 6 after | governance completion |

## Relational Form

1 → axis  
2 → relation  
3 → circuit  
4 → structure  
5 → body  
6 → touch-point side  
7 → protection  
8 → Inanna  
9 → distribution field  
13 → governance completion

## Count Behaviors

- 3 + 3 = paired triads
- 3 x 3 = distributed field of 9
- 4 + 3 = structure plus operating triad
- 3 x 4 = triadic expression across structural layers
- 6 + 1 + 6 = 13 governance

## Structural Chain

family → material → circuit → participatory expression → distribution

## Codex Governance Mapping

6 before → Codex → 6 after = 13

- before six = forward touch points
- Codex = authority axis seat
- after six = return touch points

## Field Expression

3 = minimal circuit  
9 = distributed role field  
13 = governed whole

So:

- c3 activates
- 9 distributes
- 13 governs

| column_name | purpose | required | value_type | notes |
|---|---|---|---|---|
| right_angle_directional | directional alignment of the row | yes | text | preserves vector/orientation relation |
| orthocentric_relational | convergent relational standing of the row | yes | text | preserves resolved geometric relation |

## Geometric Resolution Rule

A row is not fully seated by native resolution, material, and circuit alone.

A row must also preserve:

- right-angle directional standing
- orthocentric relational standing

These do not replace circuit.
They complete the geometric reading of the row.

## Geometric Mapping Addition

The first registry identity shape must also preserve geometric standing.

New geometric columns:

- right_angle_directional
- orthocentric_relational

These preserve:

- directional orientation
- relational convergence

## Geometric Layer Rule

A row is fully described only when it preserves:

- native resolution
- material seat
- circuit relation
- right-angle directional standing
- orthocentric relational standing 

## Geometric Lock

Circuit tells where a row operates.
Right-angle directional tells how it is oriented.
Orthocentric relational tells how it resolves.

## Resolution Principle

When structure is correctly seated, it resolves.

Resolution is not simplification.
Resolution is the right relation of distinct layers without collapse.

## Isomorphism Lock

The entangled remains singular.
The isomorphic may appear across separate materials.

## First Registry Row Formation

A row is considered minimally formed when it preserves all of the following without collapse:

- internal_key
- institutional_term
- functional_use
- resolves_to_native
- resolves_to_circuit
- planted_unit
- material
- right_angle_directional
- orthocentric_relational

A row may also carry one family order field where applicable:

- surface_order
- gate_order
- role_order
- function_order

## First Registry Row Formation

A row is considered minimally formed when it preserves all of the following without collapse:

- internal_key
- institutional_term
- functional_use
- resolves_to_native
- resolves_to_circuit
- planted_unit
- material
- right_angle_directional
- orthocentric_relational

A row may also carry one family order field where applicable:

- surface_order
- gate_order
- role_order
- function_order

## Row Formation Rule

A row is not fully formed by name and family alone.

A row must preserve:

- identity
- first-layer readability
- function
- native resolution
- circuit resolution
- planted distinction
- material seat
- directional standing
- relational standing

## First Row Spec

| column_name | purpose |
|---|---|
| internal_key | stable structural row handle |
| institutional_term | first-layer readable type label |
| functional_use | operational job performed by the row |
| resolves_to_native | native unit or surface the row points to |
| resolves_to_circuit | c1, c2, or c3 operational relation |
| planted_unit | whether the row is planted in Measures |
| material | row-assigned material seat |
| right_angle_directional | directional alignment of the row |
| orthocentric_relational | convergent relational standing of the row |
| surface_order | order within field-spine surfaces |
| gate_order | order within progression units |
| role_order | order within role units |
| function_order | order within function units |
| notes | structural clarification |

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

## Phase Map Material Lock

Phase Map remains `material = null` in the first formed pass.

Reason:

Phase Map currently resolves as a relational positioning surface, not as a materially seated unit.

Its function is to position relation and visibility, not to declare an embodied material family at this stage.

## Null Material Rule

A row may retain `material = null` when:

- it is system-known and non-planted
- its structural function is valid without embodied material seating
- assigning material would introduce premature inference or drift

## Phase Map Rule

Phase Map positions.
It does not require material seating in the first pass.

## Gate Functional Revision

Gate rows should be read through the paired logic of:

- constraint
- action

A gate does not merely indicate progression.
It conditions and permits action through bounded threshold logic.

## Gate Rule

For gate rows:

- institutional_term remains `progression_unit`
- functional_use refines to `constraint_action`

| gate_i | progression_unit | constraint_action | Gate I | c2 | true | obsidian | progressive | advancing | null | 1 | null | null | native gate row governed by threshold constraint and permitted action |
| gate_ii | progression_unit | constraint_action | Gate II | c2 | true | obsidian | progressive | advancing | null | 2 | null | null | native gate row governed by threshold constraint and permitted action |

## Gate Lock

Gates relate to constraint and action.

They do not merely mark progression.
They govern thresholded action.

## Gate Lock

Gates relate to constraint and action.

They do not merely mark progression.
They govern thresholded action.

## Gate Rows — First Formed Pass

| internal_key | institutional_term | functional_use | resolves_to_native | resolves_to_circuit | planted_unit | material | right_angle_directional | orthocentric_relational | surface_order | gate_order | role_order | function_order | notes |
|---|---|---|---|---|---|---|---|---|---:|---:|---:|---:|---|
| gate_i | progression_unit | constraint_action | Gate I | c2 | true | obsidian | progressive | advancing | null | 1 | null | null | native gate row governed by threshold constraint and permitted action |
| gate_ii | progression_unit | constraint_action | Gate II | c2 | true | obsidian | progressive | advancing | null | 2 | null | null | native gate row governed by threshold constraint and permitted action |

## Gate Formation Rule

Gate rows are planted progression units.

They preserve:

- threshold constraint
- permitted action
- bounded progression
- obsidian material seating
- c2 circuit relation

They do not collapse into spine surfaces, role units, or function units.

## Gate Validation

The gate rows are valid if:

- both remain planted units
- both remain gate_order bound
- both remain obsidian-seated unless row correction is later validated
- both preserve constraint and action together
- neither is mistaken for a surface row
- neither is prematurely extended into c3 without explicit reason

## Gate Lock

Gates govern thresholded action through constraint.