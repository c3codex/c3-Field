---
document_type: registry_rows
authority_level: working
document_scope: registry
title: Registry Rows Chamber Directories
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
  - rows
  - chamber-directories
  - non-planted
  - working
source_alignment:
  - Session 6 Carryover — Registry Source Stack Review
  - Registry Identity Shape
  - Registry Geometry
  - Registry Constraints
  - Registry Locks
  - Registry Rows Spine
---

# Registry Rows Chamber Directories

## Purpose

Define the chamber-directory row family for the rewritten registry source stack.

This doc preserves the repeatable chamber-local directory pattern.

A chamber directory exists to communicate chamber-relevant information and route toward chamberplate without collapsing into:

- conversion standing
- planted unit seating
- chamberplate itself
- the spine family

This doc defines the chamber-directory family content surface.

It does not define:

- row identity shape in general
- geometry rules in general
- structural validity conditions in general
- planted family content
- chamberplate row content
- release-state logic in full

## Scope

This doc applies to chamber-local directory rows.

For the current rewritten stack, chamber-directory rows are system-known and non-planted.

They are repeatable chamber-local information surfaces.

They are distinct from:

- spine rows
- gate rows
- epithet rows
- ME rows

## Native Distinction

Codex holds.
Field structures.
Measures registers.
Chazz executes.

Chamber directories remain subordinate to that order.

Nothing in this doc defines authority outside Codex or structure outside Field.

## Chamber-Directory Rule

Each chamber directory may:

- communicate chamber-relevant information
- show release-relevant viewability
- preserve chamber-local context
- route toward chamberplate
- reflect unlock visibility through phase-calendar or phase-state standing where relevant

A chamber directory may not:

- redefine conversion standing
- replace chamberplate
- replace planted unit seating
- replace native resolution
- stand in for the spine family

## Access Note

Chamber directories support exhibition readability.

They do not reduce exhibition access to one exclusive obsidian-only bottleneck.

Legacy exhibition access may still include:

- TempleHome entry
- continued gateplate pass-through

Chamber directories participate in readable access and routing.
They do not replace conversion standing.

## Spine Distinction

Chamber directories are not spine rows.

The current spine remains bounded as:

1. Temple
2. Antechamber
3. Harrumuk Passage
4. Obsidian Chamber
5. Phase Map

Chamber directories are chamber-local information surfaces that sit alongside chamber access and chamberplate routing, not inside the bounded spine-family pass.

## Antechamber Distinction

Antechamber remains in the spine family for the current rewritten pass.

Its intake, OAR1, systems communication, and passage-readiness role is already seated there.

For that reason, chamber-directory rows in this doc do not include Antechamber.

## Chamber-Directory Family

For the current rewritten pass, the chamber-directory family is seated as:

- obsidian_directory
- crystal_directory
- marble_directory

These are system-known, non-planted, chamber-local directory rows.

## Material Note

Material remains row-seated where applicable.

For the current chamber-directory pass:

- Obsidian Directory = obsidian
- Crystal Directory = crystal
- Marble Directory = marble

Lapis remains a valid native material in the wider system, but it is not being seated here as a chamber-directory row because its current active structural place is already held through Antechamber in the spine family.

## Circuit Note

c1, c2, and c3 remain circuit only.

Chamber directories are not circuits.

For the current chamber-directory pass, the clean operational read is:

- chamber directories are primarily c2 / c3-facing readability and routing surfaces
- they support chamber-local visibility and onward relation
- they do not replace circuit language

So this doc may preserve circuit relation per row, but chamber directory remains a family distinction, not a circuit category.

## Current Chamber-Directory Rows

| internal_key | institutional_term | functional_use | resolves_to_native | resolves_to_circuit | planted_unit | material | family_order | notes |
|---|---|---|---|---|---|---|---:|---|
| obsidian_directory | chamber_directory | chamber_information_routing | Obsidian Directory | c2 | false | obsidian | 1 | chamber-local directory for obsidian surfaces and chamberplate routing |
| crystal_directory | chamber_directory | chamber_information_routing | Crystal Directory | c2 | false | crystal | 2 | chamber-local directory for crystal surfaces and chamberplate routing |
| marble_directory | chamber_directory | chamber_information_routing | Marble Directory | c3 | false | marble | 3 | chamber-local directory for marble surfaces and chamberplate routing |

## Chamber-Directory Row Rules

### Obsidian Directory Rule

Obsidian Directory communicates chamber-relevant information for Obsidian and routes toward chamberplate.

It does not replace:

- gate logic
- planted obsidian units
- chamberplate itself

### Crystal Directory Rule

Crystal Directory communicates chamber-relevant information for Crystal and routes toward chamberplate.

It does not replace:

- epithet seating
- planted role units
- chamberplate itself

### Marble Directory Rule

Marble Directory communicates chamber-relevant information for Marble and routes toward chamberplate.

It does not replace:

- ME seating
- planted function units
- chamberplate itself

## Release Visibility Rule

A chamber directory may show what is:

- released
- viewable
- presently reachable
- routed onward

That visibility may reflect phase-calendar or phase-state standing.

It does not by itself prove conversion standing.

## Directory / Chamberplate Distinction

A chamber directory communicates and routes.

A chamberplate is the chamber-local encounter destination.

Directory does not equal chamberplate.

## Exclusion Rule

This doc does not seat:

- Antechamber as a chamber-directory row
- chamberplate rows
- gate rows
- epithet rows
- ME rows
- release-state tables in full

Those belong to other docs.

## Validation Rule

This doc is valid for the rewritten stack if it preserves all of the following:

- chamber-directory family remains distinct from spine
- chamber-directory family remains non-planted
- directories communicate and route without redefining conversion
- directories do not replace chamberplate
- obsidian, crystal, and marble directory rows remain distinct
- exhibition readability remains broader than one exclusive access lane
- Antechamber remains excluded from this family because its active role is already seated in spine

## Current Standing

Registry rows chamber directories currently provide:

- a repeatable chamber-local information pattern
- non-planted chamber-local routing surfaces
- separation of directory from chamberplate
- separation of access readability from conversion standing
- clean distinction from spine and planted families

It does not yet provide:

- chamberplate row content
- family-specific release-state tables
- planted family content
- downstream routing detail in full

## Next Relation

This doc must remain paired with:

- `registry_identity_shape_v1.meta.md`
- `registry_geometry_v1.meta.md`
- `registry_constraints_v1.meta.md`
- `registry_locks_v1.meta.md`
- `registry_rows_spine_v1.meta.md`
- `registry_rows_gates_v1.meta.md`
- `registry_rows_epithets_v1.meta.md`
- `registry_rows_mes_v1.meta.md`

## Closing

Chamber directories do not invent the chambers.

They make chamber-local information readable and routeable without collapsing conversion, encounter, and family distinctions.

Codex holds.
Field structures.
Measures registers.
Chazz executes.
