---
title: Measures Data Contract
slug: measures-data-contract
document_type: architecture
document_scope: kernel
document_status: draft
canonical: true
authority_level: structural
related_pillar: measures
version: 0.1
tags:
  - measures
  - data-contract
  - architecture
  - supabase
summary: Defines the canonical data contract between Measures state, storage, hooks, helpers, and renderers.
---

# Measures Data Contract

## Purpose

This document defines the canonical contract between Measures data sources and the site renderer.

Measures must render from declared state, not embedded assumptions.

## Canonical Sources

### `measures_media_grouped_v`
Provides grouped media units by `manifest_slug`.

Typical fields include:

- `hero_video_url`
- `hero_image_url`
- `epigraph_video_url`
- `epigraph_image_url`
- `animated_video_url`
- `still_image_url`
- `original_image_url`
- `original_video_url`
- `passage_video_url`
- `audio_url`
- `document_url`

This view is the canonical media source for rendering.

### `measures_text_content`
Provides canonical text records.

Key fields include:

- `slug`
- `manifest_slug`
- `text_kind`
- `text_slot`
- `title`
- `display_label`
- `artifact_type`
- `artifact_number`
- `body_md`
- `storage_path`
- `public_url`
- `is_active`

#### `text_kind`
Allowed values:

- epigraph
- plaque
- context
- scroll
- aspect
- statement
- structure
- passage

#### `text_slot`
Used to distinguish multiple records of the same `text_kind` for a single slug.

Examples:
- primary
- secondary

### `measures_cuneiform_aspect`
Provides structured cuneiform edge records and similar plate-specific structured extras.

## Rendering Contract

### Hooks
Hooks retrieve canonical state.

Examples:
- `useMeasuresMediaUnit`
- `useMeasuresTextContent`
- `useMeasuresCuneiformAspects`
- `useMeasuresEncounterBundle`
- `useGateNavigation`

### Helpers
Helpers interpret canonical state for components.

Examples:
- `selectEncounterMedia`
- `selectMeasuresText`
- `selectMeasuresTexts`
- `nextGate`
- `measuresStageSlugs`

### Components
Components render encounter units from already-declared state.

Components should not become authorities over:
- media choice
- content text
- release state
- canonical slug identity

## Slug Rule

Canonical slugs define identity.

Media, text, structured extras, encounter behavior, and release state must resolve through stable slug relationships.

## Multi-Plaque Rule

If a single encounter requires multiple plaques, they must be distinguished through `text_slot`, not by collapsing multiple plaques into a single ambiguous record.

## Storage Rule

Markdown source files are authored in-project, synced to DB and storage, and then rendered from DB truth.

The storage layer holds files.  
The DB declares what exists.  
The site renders from that declaration.

## Final Rule

If a renderer needs to know something about Measures content, that knowledge should already exist in canonical state or a helper derived from canonical state.