---
document_type: registry_definition
authority_level: working
document_scope: registry
title: Registry Constraints
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
  - constraints
  - validity
  - governance
  - working
source_alignment:
  - Session 6 Carryover — Registry Source Stack Review
  - Seed Pattern Constraints — Chazz
  - Seed Concordance
  - MEASURES Installation Role
  - Field Definition — Antechamber Intake Surface
---

# Registry Constraints

## Purpose

Define the structural validity conditions for the rewritten registry source stack.

Registry constraints preserve:

- category integrity
- row validity
- family separation
- native distinction
- non-collapse across identity, geometry, access, conversion, and encounter surfaces

This doc defines what must be true for registry rows and registry docs to remain structurally valid.

It does not define:

- freeze points
- row identity shape
- release state
- asset mapping
- directory content in full
- planted family content in full

## Scope

This doc applies across the rewritten stack:

- `registry_identity_shape_v1.meta.md`
- `registry_geometry_v1.meta.md`
- `registry_locks_v1.meta.md`
- `registry_rows_spine_v1.meta.md`
- `registry_rows_chamber_directories_v1.meta.md`
- `registry_rows_gates_v1.meta.md`
- `registry_rows_epithets_v1.meta.md`
- `registry_rows_mes_v1.meta.md`

It governs both:

- system-known, non-planted rows
- planted Measures rows

This doc is constraint-bound.

It is not the row-family content surface itself.

## Native Distinction

Codex holds.
Field structures.
Measures registers.
Chazz executes.

Registry constraints remain subordinate to that order.

Nothing in this doc defines truth outside Codex, structure outside Field, or reveal outside Measures.

## Constraint Distinction

Constraints are not locks.

- **Locks** freeze approved distinctions after review
- **Constraints** define the structural conditions that must be true for a row or doc to be valid

A lock may hold an invalid structure steady.
A constraint may reject it.

That is why `registry_constraints_v1.meta.md` must remain distinct from `registry_locks_v1.meta.md`.

## Constraint Set

### 1. Native-Order Constraint

Every registry surface must remain readable in native order:

Codex → Field → Measures → Chazz

No registry doc may:

- invent authority outside Codex
- invent structure outside Field
- invent reveal logic outside Measures
- invent execution logic in place of Chazz

### 2. Identity Integrity Constraint

A row must preserve without collapse:

- stable `internal_key`
- row family
- planted vs non-planted distinction
- native resolution
- front-readable institutional term
- functional use

Identity may not be inferred from:

- asset naming
- display naming
- route strings
- access keys

### 3. Key-Boundary Constraint

Registry identity fields may not take on access-key behavior.

These must remain distinct:

- `internal_key` = registry row handle
- `envKey` = Envelope continuity handle
- `c3_key` = origin access standing handle

### 4. Family-Boundary Constraint

Row families may not collapse into one another.

At minimum, the stack must preserve distinction between:

- spine
- chamber_directory
- gate
- epithet
- me

A row may not impersonate another family for convenience.

### 5. Planted-Boundary Constraint

System-known rows may not impersonate planted Measures units.

Planted Measures units may not be treated as mere reference surfaces.

This preserves the boundary between:

- structural / access / directory rows
- planted registry rows

### 6. Circuit Integrity Constraint

c1, c2, and c3 resolve to circuit only.

Circuit may not be used as a substitute for:

- chamber
- material
- directory
- release state

Circuit may relate to those layers.
It may not collapse into them.

### 7. Material Integrity Constraint

Material remains a correspondence layer.

Material may not replace:

- circuit
- family
- conversion standing

Family may not force material.
Material may not force family.

Original oracle-card alignment remains:

- obsidian
- crystal
- marble

Lapis Lazuli remains the 4th native material in the wider system and may be structurally seated where valid without rewriting the original oracle-card alignment.

### 8. Null-Material Constraint

A row may retain `material = null` only when:

- its function is structurally valid without embodied material seating
- material assignment would introduce premature inference
- the row is directional, transitional, or relational in function

This applies in the current pass to:

- Harrumuk Passage
- Phase Map

It should also apply to Kumurrah when later seated.

### 9. Access / Conversion Distinction Constraint

Conversion standing may not be inferred from:

- access path
- phase visibility
- chamber directory presence
- chamberplate reachability

Access and conversion may relate.
They may not collapse.

This preserves the difference between:

- completion standing
- exhibition access
- release visibility
- chamber-local encounter

### 10. Exhibition-Access Constraint

Exhibition access may not be falsely reduced to one exclusive obsidian-only bottleneck.

Where release standing permits, chamber access may occur through:

- TempleHome
- continued gateplate pass-through

Unlock visibility may be shown through phase state / calendar.

This does not erase conversion standing.
It prevents access architecture from being misdescribed.

### 11. Antechamber Constraint

Antechamber may:

- hold incomplete signal
- structure intake
- originate OAR1
- communicate systems standing
- orient passage readiness

Antechamber may not:

- pass incomplete signal
- fake passage resolution
- collapse intake into completed encounter

### 12. Chamber-Directory Constraint

Each chamber directory may:

- communicate chamber-relevant information
- show release-relevant viewability
- route toward chamberplate
- preserve chamber-local context

A chamber directory may not:

- redefine conversion
- replace planted unit seating
- replace native resolution
- stand in for chamberplate itself

### 13. Passage / Positioning Constraint

Passage and positioning surfaces should resolve primarily through:

- circuit relation
- directional standing
- relational standing
- functional use

They should not be force-seated materially without structural need.

### 14. Protected-Logic Constraint

Registry docs may declare readable structure and relation.
They may not expose reconstructible protected execution bodies.

Protected systems intelligence, routing bodies, and protected geometric logic remain non-public even where their outcomes are declared.

## Current Bounded Compatibility Note

The current spine-family source pass remains bounded from arrival through Phase Map.

That bounded review is valid as long as:

- Kumurrah remains explicitly downstream and deferred
- the current pass does not pretend bounded scope is full-system completion

## Validation Rule

This doc is valid for the rewritten stack if it can reject all of the following:

- identity collapse
- family collapse
- planted / non-planted confusion
- circuit / chamber / material collapse
- access / conversion collapse
- directory / encounter collapse
- forced material seating on relational rows
- public exposure of protected logic

## Current Standing

Registry constraints currently provide:

- stack-wide validity conditions
- separation from locks
- category integrity rules
- access / conversion distinction rules
- chamber-directory validity boundaries
- antechamber and passage validity boundaries

It does not yet provide:

- family-specific validation tables
- row-by-row acceptance matrices
- release-state logic
- asset mapping logic

## Next Relation

This doc must remain paired with:

- `registry_identity_shape_v1.meta.md`
- `registry_geometry_v1.meta.md`
- `registry_locks_v1.meta.md`
- `registry_rows_spine_v1.meta.md`
- `registry_rows_chamber_directories_v1.meta.md`
- `registry_rows_gates_v1.meta.md`
- `registry_rows_epithets_v1.meta.md`
- `registry_rows_mes_v1.meta.md`

## Closing

Registry constraints do not freeze drift after the fact.

They define the structural conditions under which drift is rejected before acceptance.

Codex holds.
Field structures.
Measures registers.
Chazz executes.
