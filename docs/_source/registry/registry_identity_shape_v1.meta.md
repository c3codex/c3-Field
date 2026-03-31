---
document_type: registry_shape
authority_level: working
document_scope: registry
title: Registry Identity Shape v1
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
  - shape
  - identity
  - session-4
---

# Registry Identity Shape v1

## Purpose

The first registry identity table preserves structural distinction before release logic, asset mapping, or Envelope instance logic is introduced.

This table holds identity, first-layer institutional readability, functional use, native resolution, circuit resolution, planted distinction, material seating, geometric standing, and family-bound order.

## Shape Rule

Every registry identity row must answer:

- what kind of thing is this
- what job does it perform
- what does it resolve to natively
- what circuit does it resolve to
- is it planted
- what material seat does it carry
- how is it directionally aligned
- how does it resolve relationally
- what order does it hold within its family

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

## SQL-Oriented Draft Table Spec

Working table name:

`registry_identity`

## Draft Column Spec

| column_name | sql_type | null | purpose |
|---|---|---|---|
| internal_key | text | no | stable structural row handle |
| institutional_term | text | no | first-layer readable type label |
| functional_use | text | no | first-layer operational job |
| resolves_to_native | text | no | native surface or unit this row points to |
| resolves_to_circuit | text | no | circuit location of the row |
| planted_unit | boolean | no | planted Measures distinction |
| material | text | yes | row-assigned material seat |
| right_angle_directional | text | no | directional alignment of the row |
| orthocentric_relational | text | no | convergent relational standing |
| surface_order | integer | yes | field-spine order |
| gate_order | integer | yes | progression unit order |
| role_order | integer | yes | role unit order |
| function_order | integer | yes | function unit order |
| notes | text | yes | human-readable structural clarification |

## Draft Structural Constraints

- `internal_key` must be unique
- `planted_unit` must be explicitly true or false
- family order fields remain nullable outside their own family
- no row may claim more than one family order at once without explicit future justification

## Family Order Rule

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

## Value Constraint Strategy

For first seating:

- `material` is constrained to approved values when present
- `institutional_term` remains open during validation
- `functional_use` remains open during validation

## Approved Material Values

- lapis
- obsidian
- crystal
- marble

## Material Constraint Rule

Allowed material values are constrained.
Family-to-material mapping is not globally inferred.
Material is row-assigned and may remain null where seating is not yet validated.

## Circuit Resolution Addition

A row is not fully seated by family and material alone.
It must also resolve to circuit.

## Geometric Layer Rule

A row is fully described only when it preserves:

- native resolution
- material seat
- circuit relation
- right-angle directional standing
- orthocentric relational standing

## Shape Validation

This draft is valid for first implementation if:

- one row can represent one structural unit cleanly
- planted and non-planted rows remain distinguishable
- family-bound ordering remains non-collapsed
- internal_key remains stable and non-public-facing
- no access-key behavior is assigned to registry identity fields
