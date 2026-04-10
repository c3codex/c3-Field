---
document_type: structural_resolution
authority_level: working
document_scope: session
title: Session 13 — Temple Chamber Seating
status: complete
version: v1
operator: op044
date: 2026-04-09
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - session13
  - temple
  - chambers
  - chamber-seating
  - encounter
  - holder
---

# Session 13 — Temple Chamber Seating

## Purpose

Seat chambers as pure holders of encounter units without chamber override of encounter authority.

## Chamber Set

- chamber_crystal
- chamber_lapis
- chamber_obsidian
- chamber_marble
- chamber_epithets

## Standing

Chambers hold encounters.  
Chambers do not govern encounters.

They may:
- contain
- contextualize
- group

They may not:
- release
- order
- route
- progress
- override encounter authority

## Encounter Primacy

Phase Calendar releases encounter.  
Phase Map routes encounter.  
Encounter governs progression.  
Chamber holds encounter.

## Parent Structure

Encounter rows resolve through chamber parentage:

encounter.parent_registry_id = chamber

This preserves:
- clean Field relation
- no orphaned encounters
- no chamber-level behavior inheritance

## Passage Separation

Passages remain separate relational units:

- Harramuk = entry / return
- Kumurrah = inter-chamber progression

They are not chamber children.  
They are not ordering mechanisms.  
They are not visibility surfaces.

## Exposure Rule

Phase Map exposes encounters only.

User continuance resolves:

Encounter → implicitly within chamber

Not:

Chamber → Encounter

## Marble Chamber Clarification

Marble holds:
- codexstone as axis
- ME encounters

Codexstone is:
- axis
- spine-aligned
- not ME
- not progression authority

## Chamber of Epithets Clarification

The Chamber of Epithets does not resolve to a specific material.

It is:
- non-material
- relational
- encounter-bearing

It is not:
- crystal
- marble
- obsidian
- lapis

## Final Lock

Chambers are holders of chamberplates.  
The chamber does not override the encounter.

## Status

Resolved in thread.  
Not yet verified against live database standing.
