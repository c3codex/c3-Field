---
document_type: recovery_working
authority_level: working
document_scope: chamber_registry_seating
title: Pass 3 — Explicit Chamber Row Replacement
status: draft
version: v1
operator: op044
date: 2026-04-06
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - recovery
  - pass3
  - chamber
  - epithets
  - registry
  - seating
---

# Pass 3 — Explicit Chamber Row Replacement

## Purpose

Replace grouped placeholder chamber / epithet logic with explicit named seating so Measures reflects the already-resolved Chamber of Epithets role circuit.

## What is being replaced

Current standing from recovery:

- Chamber of Epithets resolved as an explicit 9-seat role circuit
- grouped placeholder rows are now an abstraction that no longer matches seated truth
- Measures must stop speaking in bundles where Field has already spoken in names

## Resolved chamber seating

### Spring Equinox
1. Primus Artus
2. Gemynd Corpus
3. Percipari

### Summer Solstice
4. Lady of the Largest Heart
5. Spiritus Stellaris
6. Concursus Cubicali

### Lions Gate
7. Aphrodite
8. The Last Oracle
9. She Who Rises with the Dog Star

## Proposed replacement standing

### Replace
- grouped placeholder chamber / epithet phase rows

### With
- 9 explicit named chamber rows
- each row should carry enough standing to resolve:
  - seat identity
  - chamber relation
  - phase grouping
  - material seating
  - release standing
  - order within chamber circuit

## Proposed required fields at registry logic level

For each explicit row, Measures should be able to read:

- epithet identity
- chamber identity = Chamber of Epithets
- phase family
  - Spring Equinox
  - Summer Solstice
  - Lions Gate
- chamber order
  - 1 through 9
- triad order
  - 1 through 3 within phase family
- material
  - obsidian
  - lapis
  - crystal
  - marble
- release_state
  - held / sealed / released / dependent as later implemented
- visibility standing only if needed separately from release
- relation to Temple as accessible from chamber system, not as substitute identity

## Proposed explicit row set

### Spring Equinox

Row 1
- epithet: Primus Artus
- phase family: Spring Equinox
- chamber order: 1
- triad order: 1
- material: obsidian

Row 2
- epithet: Gemynd Corpus
- phase family: Spring Equinox
- chamber order: 2
- triad order: 2
- material: lapis

Row 3
- epithet: Percipari
- phase family: Spring Equinox
- chamber order: 3
- triad order: 3
- material: crystal

### Summer Solstice

Row 4
- epithet: Lady of the Largest Heart
- phase family: Summer Solstice
- chamber order: 4
- triad order: 1
- material: crystal

Row 5
- epithet: Spiritus Stellaris
- phase family: Summer Solstice
- chamber order: 5
- triad order: 2
- material: crystal

Row 6
- epithet: Concursus Cubicali
- phase family: Summer Solstice
- chamber order: 6
- triad order: 3
- material: marble

### Lions Gate

Row 7
- epithet: Aphrodite
- phase family: Lions Gate
- chamber order: 7
- triad order: 1
- material: lapis

Row 8
- epithet: The Last Oracle
- phase family: Lions Gate
- chamber order: 8
- triad order: 2
- material: marble

Row 9
- epithet: She Who Rises with the Dog Star
- phase family: Lions Gate
- chamber order: 9
- triad order: 3
- material: obsidian

## Structural rule

These rows are:

- explicit seating rows
- not grouped shorthand
- not generic phase placeholders
- not art-set bundles

Each row must resolve as a real chamber seat.

## Distinctions preserved

- Temple remains distinct and above as registered crystal source-surface
- Chamber of Epithets remains a distinct chamber
- these rows do not replace Temple
- these rows do not replace epithet identity elsewhere if broader registry identity exists
- these rows are specifically explicit chamber seating rows

## Carryforward implication

Later SQL / registry patch will need to do one of two things:

A. Replace existing grouped rows in place
or

B. Deprecate grouped rows and insert explicit named rows

Structural read:
B is safer unless the current grouped rows can be cleanly transformed without ambiguity.

