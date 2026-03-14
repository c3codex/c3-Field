---
title: Measures Gates Conversion Record
slug: measures-gates-conversion-record
document_type: architecture
document_scope: kernel
document_status: draft
canonical: true
authority_level: structural
related_pillar: measures
version: 0.1
tags:
  - measures
  - gates
  - conversion
  - architecture
summary: Records the conversion of the Obsidian Gates from mixed hardcoded logic to canonical installation rendering.
---

# Measures Gates Conversion Record

## Purpose

This document records the conversion of the Obsidian Gates from a mixed model of hardcoded media, inline text, and legacy slugs into a canonical installation path.

## Prior State

The Gates previously depended on a mixed system that included:

- hardcoded asset references
- inline plaque text in TSX files
- gate-specific fallback logic
- legacy slug conventions
- local canon scaffolding in code

This created drift between code, storage, and database state.

## Conversion Goal

Convert the Gates into a canonical installation path where:

- media comes from grouped media views
- text comes from `measures_text_content`
- structured extras come from dedicated records
- navigation follows canonical gate slugs
- a shared plate renderer can render multiple gates

## Structural Outcomes

### Established

- canonical gate slug model
- text sync pipeline from markdown to database
- `text_slot` support for multi-plaque encounters
- shared encounter hooks and helpers
- route shell preserved while content authority moved to DB state
- gate navigation updated toward canonical slugs

### Replaced

- old Roman/numeric gate slug assumptions
- hardcoded plaque prose
- local canon records used as active content source
- direct asset mapping through `MEASURES_ASSETS` for canonical content

## Installation Path

The active Measures Gates installation path is:

- Temple Home
- Antechamber
- Obsidian Epigraph
- Kumurrah Passage
- Obsidian Gateboard
- Gate Plate sequence

This path is now being rendered as installation state rather than page-specific content.

## Remaining Work

- complete shared `ObsidianGatePlate` conversion
- remove obsolete gate-specific hooks
- retire old local canon files used as active state
- finalize canonical routing for all gates
- finish content and media alignment for Gates II–VII
- finalize audio bus canonical sourcing

## Result

The Gates are no longer treated as isolated pages. They are being converted into a coherent reduction sequence within the Measures installation model.

This establishes the structural precedent for future installations across the wider c3 system.