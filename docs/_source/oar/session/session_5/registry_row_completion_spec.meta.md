---
document_type: registry_spec
authority_level: working
document_scope: measures
title: Registry Row Completion Specification
status: working
version: v1
operator: op044
date: 2026-03-31
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
source_alignment:
  - Session 5 — Recovered Session 4 Intelligence
  - Seed Pattern Constraints — Chazz
  - Seed Concordance
  - MEASURES Installation Role
tags:
  - registry
  - row-completion
  - measures
  - structural-validation
  - notchazz
  - session-5
---

# Registry Row Completion Specification

## Purpose

Define the minimum structural conditions required for a registry row to be considered valid, complete, and executable within Measures.

This specification exists to prevent drift at row level.

A row is not complete because it exists.
A row is complete only when its required structural seats are resolved.

## Native Order

All registry rows must remain subordinate to native order:

Codex → Field → Measures → Chazz

This means:

- Codex provides authority-bearing reality
- Field structures relation and addressability
- Measures registers sequence, access, and reveal
- Chazz executes only what has already been seated

No row may bypass this order.

## Definition of a Registry Row

A registry row is a single registered unit of reveal logic within Measures.

A row may represent:

- gate
- epithet
- me
- encounter unit
- phase-linked unit
- material-seated unit
- directional unit
- relation-bearing unit

A row is not merely a label.
A row is a structural registration surface.

## Row Completion Rule

A registry row is complete only when all required seating surfaces are resolved.

Minimum required seating:

- native seating
- material seating
- circuit seating
- directional seating
- relational seating

If any required seating is absent, the row is incomplete.

## Completion States

### 1. draft

Row exists as working formation only.

Not valid for execution.
Not valid for reveal.
Not valid for dependency resolution.

### 2. incomplete

Row has partial structure but lacks one or more required seats.

May be reviewed.
May not execute.
May not anchor downstream dependency.

### 3. blocked

Row has structural contradiction, invalid dependency, or protected-rule failure.

Must not be patched in UI.
Must be corrected at source layer.

### 4. valid

Row satisfies all required seating and may participate in registry logic.

### 5. executable

Row is valid and all dependency conditions are met for active system execution.

### 6. released

Row is executable and reveal-permitted under current Measures state.

## I. Native Seating

Native seating confirms that the row resolves correctly within the native stack.

A row must declare or resolve:

- authority source
- structural source
- registry function
- execution boundary

### Required native checks

A valid row must be answerable to:

- what Codex-held truth it depends on
- what Field relation makes it addressable
- what Measures function it performs
- what Chazz may execute from it

### Native failure conditions

A row fails native seating if:

- authority is implied rather than sourced
- routing surfaces are used as identity authority
- execution behavior is required but not registered
- frontend fallback is standing in for missing structure

## II. Material Seating

Material is row-assigned, not family-default.

A row must explicitly resolve its material seat.

Allowed materials must use native system seating only.

Current material family includes:

- lapis
- obsidian
- crystal
- marble

### Material seating rules

- material may not be assumed by neighboring row
- material may not be inherited by visual grouping alone
- material must be explicit or deterministically resolvable from registered rule
- one row has one active material seat at a time unless multi-material logic is explicitly registered

### Material failure conditions

A row fails material seating if:

- material is missing
- material is guessed from label or family
- material differs between registry and encounter rendering
- material is assigned in UI rather than registry logic

## III. Circuit Seating

A row must resolve to its correct circuit position.

Allowed circuit logic must be native to the c3 model and registered Measures behavior.

Examples include:

- c1
- c2
- c3
- cross-circuit only when structurally required and explicitly defined

### Circuit seating rules

- row circuit must align to function
- row circuit must not conflict with dependency chain
- cross-circuit standing must be intentional, not ambiguous
- circuit must be stable enough to support reveal order and relation

### Circuit failure conditions

A row fails circuit seating if:

- no circuit is assigned
- assigned circuit conflicts with row function
- circuit changes across contexts without registered basis
- downstream logic requires circuit clarity but row remains ambiguous

## IV. Directional Seating

A row must resolve its directional standing where directional logic is part of execution, reveal, or relation.

Directional seating may include:

- entry vector
- return vector
- upstream relation
- downstream relation
- threshold direction
- passage direction
- chamber transition direction

### Directional seating rules

- direction must be structurally meaningful, not decorative
- direction must support progression, correction, or reveal
- direction may not be invented by UI behavior
- direction must remain consistent with relation and dependency

### Directional failure conditions

A row fails directional seating if:

- direction is needed but absent
- direction conflicts with passage order
- direction exists only in encounter copy, not registry
- correction path cannot be inferred because directional standing is missing

## V. Relational Seating

A row must be structurally related to the units it depends on and the units that depend on it.

Relational seating includes:

- adjacency
- dependency
- sequence position
- family relation
- chamber relation
- phase relation
- encounter relation
- release relation

### Relational seating rules

- no orphan rows
- no implied dependency without structure
- no reveal relation without registered basis
- relation must be addressable through Field, not only readable in prose

### Relational failure conditions

A row fails relational seating if:

- row has no addressable relation
- dependency is narrative only
- sequence is positional guesswork
- row can render but not be structurally traced

## Minimum Required Row Fields

The exact column names may vary by registry surface, but a row must be able to resolve the following minimum structural fields:

### Identity and standing

- stable row key
- display title
- row type
- current status

### Native seating

- codex source reference
- field relation reference
- measures role or registration type
- execution allowance boundary

### Structural seating

- material
- circuit
- directional standing
- relational standing

### Ordering and access

- registry order
- dependency state
- release state
- sealed/open condition where relevant

### Traceability

- source reference
- correction visibility
- OAR-addressable failure path where relevant

## Row Validity Test

A row is valid only if all questions below can be answered without invention:

1. What is this row?
2. What native function does it serve?
3. What material is it seated in?
4. What circuit does it belong to?
5. What directional standing does it carry?
6. What relations define its place?
7. What dependencies affect it?
8. What reveal state governs it?
9. What may Chazz execute from it?
10. What source layer must be corrected if it fails?

If any answer requires guesswork, the row is not complete.

## NotChazz Halt Conditions

NotChazz should halt execution rather than permit patching when:

- row lacks required seating
- row identity depends on slug or label alone
- material is visually assigned without registry basis
- circuit is ambiguous
- directional standing is required but missing
- relation is narrative but not structural
- row is used as dependency anchor while incomplete
- frontend behavior compensates for missing registry logic
- count integrity is broken

## Count Integrity Rule

Count integrity now functions as implementation guard, not symbolic background.

This means:

- expected row counts matter
- family counts matter
- release counts matter
- sequence counts matter
- missing or duplicated rows are structural errors

Count mismatch is not cosmetic.
Count mismatch indicates registry formation failure or drift introduction.

## One-Surface Change Rule

When correcting a row:

- correct the source layer
- do not patch the encounter layer first
- do not distribute one logical change across multiple uncontrolled surfaces
- do not let UI become emergency authority

Correction order must follow native order.

## Success Condition

A registry row is complete when:

- it resolves cleanly in native order
- its material is explicitly seated
- its circuit is explicitly seated
- its directional standing is explicit where required
- its relational structure is addressable
- its dependencies are clear
- its release standing is coherent
- it can be executed by Chazz without invention
- it can be halted by NotChazz when invalid
- it preserves count integrity

## Closing

Registry validity happens row by row.

No family-default assumptions.
No decorative counts.
No positional guessing.
No UI rescue magic.

A complete row can be measured.
An incomplete row must be corrected.
A blocked row must not pass.
