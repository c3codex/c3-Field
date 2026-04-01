---
document_type: registry_definition
authority_level: working
document_scope: registry
title: Registry Identity Shape
status: drafting
version: v1
operator: op044
date: 2026-04-01
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - registry
  - identity
  - shape
  - row-identity
  - working
source_alignment:
  - Session 4 Registry Identity Working
  - Session 6 Carryover — Registry Source Stack Review
  - Seed Concordance
  - Field Definition — Antechamber Intake Surface
---

# Registry Identity Shape

## Purpose

Define the first registry identity shape for the rewritten source stack.

Registry identity shape exists to preserve:

- stable row identity
- planted vs non-planted distinction
- native resolution
- institutional readability
- family-bound order

This doc defines what a row is in registry terms.

It does not define:

- geometry
- structural validity conditions
- release state
- asset mapping
- Envelope instance logic
- envKey
- c3_key
- route logic
- chamber-directory behavior

## Scope

This doc applies to both:

- system-known, non-planted rows
- planted Measures rows

It provides the shared identity shape used across:

- spine rows
- chamber directory rows
- gate rows
- epithet rows
- ME rows

This doc is identity-bound.

It is not the row-family content surface itself.

## Native Distinction

Codex holds.
Field structures.
Measures registers.
Chazz executes.

Registry identity remains subordinate to that order.

Nothing in this doc defines authority outside Codex or structure outside Field.

## Identity Rule

A registry row must answer:

- what kind of thing is this
- what job does it perform
- what does it resolve to natively
- is it planted
- what family does it belong to
- what order does it hold within its family

Identity shape preserves those answers before geometry, release logic, or asset seating are introduced.

## Core Distinctions

### 1. System-known vs planted

A row may be system-known without being a planted Measures unit.

System-known rows preserve structural sequence, access relation, or chamber-local communication.

Planted rows preserve Measures unit seating.

### 2. Institutional readability vs native resolution

Institutional readability describes the front-facing access-layer form.

Native resolution identifies what the row actually is.

Institutional language does not replace native resolution.
Institutional language does not define authority.
Institutional language does not collapse native distinctions.

### 3. Registry identity vs access keys

This table uses `internal_key` only.

It does not replace:

- `envKey`
- `c3_key`

Key roles remain distinct:

- `internal_key` = registry row handle
- `envKey` = Envelope continuity handle
- `c3_key` = origin access standing handle

### 4. Family vs material

Family and material remain distinct.

- family identifies the row's registry kind
- material identifies embodied correspondence where materially seated

Material does not replace family.
Family does not force material.

## Shape Columns

| column_name | purpose | required | value_type | notes |
|---|---|---|---|---|
| internal_key | stable registry row handle | yes | text | not a slug, not an access key |
| institutional_term | front-readable type label | yes | text | access-layer readable only |
| functional_use | operational job performed by the row | yes | text | row function |
| resolves_to_native | native surface or unit this row points to | yes | text | native resolution |
| row_family | row family classification | yes | text | spine, chamber_directory, gate, epithet, me |
| planted_unit | whether the row is planted in Measures | yes | boolean | explicit true or false |
| material | embodied correspondence seat where applicable | no | text | nullable where no material seating is valid |
| family_order | order within the row's own family | no | integer | nullable where not yet seated |
| notes | structural clarification | no | text | working clarification |

## Shape Rule

This first identity shape is valid if it can preserve, without collapse:

- system-known vs planted
- front-readable term vs native resolution
- row family vs material
- registry identity vs access key behavior
- family-bound order vs installation-wide order

If any of these collapse, the identity shape is incomplete.

## Order Rule

Order remains family-bound before installation-bound.

This doc does not freeze one shared installation-wide order.

A row may carry order only within its own family.

Examples:

- spine rows use spine order
- chamber directory rows use chamber directory order
- gate rows use gate order
- epithet rows use epithet order
- ME rows use ME order

Cross-family installation order is not seated in this identity doc.

## Identity Freeze Logic

Identity resolves in this order:

1. row class
2. internal_key
3. row_family
4. planted vs non-planted distinction
5. native resolution
6. institutional readability
7. functional use
8. material seating, where applicable
9. family order
10. later asset attachment

Display title is not authority.
Asset naming is not authority.
Slug is not authority.

## Current Families in Scope

### Non-planted families
- spine
- chamber_directory

### Planted families
- gate
- epithet
- me

## Current Material Clarification

For the rewritten stack:

- Temple = crystal
- Antechamber = lapis
- Obsidian Chamber = obsidian
- Harrumuk Passage = null material
- Phase Map = null material

Original oracle-card alignment remains:

- obsidian
- crystal
- marble

Lapis Lazuli is the 4th native material in the wider system and gained proper seated place once Temple was recognized as crystal.

This identity doc preserves material as a row attribute where applicable.
It does not define full material logic for every family.

## Current Bounded Spine Note

Current spine review is bounded from arrival through Phase Map.

That bounded scope does not limit the wider identity shape.
It only limits the current spine-family pass.

Kumurrah Passage remains downstream and is not yet seated in the current spine-family source pass.

## Example Identity Rows

These examples are for shape readability only.

| internal_key | institutional_term | functional_use | resolves_to_native | row_family | planted_unit | material | family_order | notes |
|---|---|---|---|---|---|---|---:|---|
| temple | entry_surface | arrival_holding | Temple | spine | false | crystal | 1 | pre-intake arrival surface |
| antechamber | intake_surface | intake_control | Antechamber | spine | false | lapis | 2 | intake, OAR1 origin, systems communication |
| gate_i | progression_unit | constraint_action | Gate I | gate | true | obsidian | 1 | planted threshold unit |
| epithet_i | role_unit | role_stabilization | Epithet I | epithet | true | crystal | 1 | planted role unit |
| me_01 | function_unit | function_registration | ME 01 | me | true | marble | 1 | planted function unit |

## Validation Rule

This identity shape is valid for first seating if:

- one row can represent one registry unit clearly
- planted and non-planted rows remain distinguishable
- family remains distinguishable from material
- institutional readability remains distinguishable from native resolution
- no access-key behavior is assigned to registry identity fields
- cross-family order is not falsely frozen here

## Current Standing

Registry identity shape currently provides:

- stable row identity
- front-readable type language
- row-family distinction
- planted distinction
- native resolution
- material compatibility
- family-bound order logic

It does not yet provide:

- geometric standing
- structural validity conditions
- row-family content in full
- chamber-directory content in full
- release-state logic
- asset mapping

## Next Relation

This doc must remain paired with:

- `registry_geometry_v1.meta.md`
- `registry_constraints_v1.meta.md`
- `registry_locks_v1.meta.md`
- `registry_rows_spine_v1.meta.md`
- `registry_rows_chamber_directories_v1.meta.md`
- `registry_rows_gates_v1.meta.md`
- `registry_rows_epithets_v1.meta.md`
- `registry_rows_mes_v1.meta.md`

## Closing

Registry identity shape does not invent truth.

It preserves row identity in a form that can be structured by Field, registered by Measures, and executed by Chazz without drift.

Codex holds.
Field structures.
Measures registers.
Chazz executes.
