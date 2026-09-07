---
document_type: architecture_contract
authority_level: working
document_scope: measures_interoperability
title: Measures Registry — Media Passage Contract v1
status: seated
version: v1
operator: op044
date: 2026-05-27
source_oar2: docs/oar/measures_interoperability/oar2_governed_measures_registry_isomorphic_architecture_contract_seating_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - architecture-contract
  - measures-registry
  - media-passage
  - right-path
  - isomorphic
  - codexstone
material: lapis
chamber_position: right-path-entry
path_position: post-temple-right
---

# Measures Registry — Media Passage Contract v1

## Contract Purpose

The Media Passage is the first surface of the Right Path — Structure the Environment.

It receives the visitor from the Temple and orients them toward the Marble Governance Chamber.

The Media Passage uses media presence to establish the build/structure signal before the visitor enters a governed contract surface.

## Runtime Anchor

| Field | Value |
|---|---|
| DB encounter_key | `structure_passage` |
| Surface state | `structure_passage` |
| Primary media role | `structured_environment_passage_video` / `measures_structured_enviroments` (aliased) |
| Material | Obsidian material family (`data-material-family="obsidian"` in current runtime) |
| Audio | `passageMuted` state — visitor-controlled |
| Auto-advance | On video end → `structured_eval` |
| Skip | Continue button → `structured_eval` |

## Media Passage Function

The Media Passage is a transitional surface.

It does not contain a chamber. It bridges the Temple's path choice to the Marble Governance Chamber.

Its function is orientation through presence:
- Media content establishes the build/structure register
- The visitor is moved from selection to readiness
- The passage clears the transition from assessment posture to governance posture

## Media Roles

| Role | Purpose |
|---|---|
| `structured_environment_passage_video` | Primary passage video |
| `measures_structured_enviroments` | Alias fallback |

The passage video communicates structure, environment, and governed form — not assessment, diagnosis, or commerce.

## What the Media Passage Does Not Do

- Author runtime truth — media is renderer, not authority
- Replace a chamber contract — the Marble Governance Chamber is a separate surface with separate authority
- Carry intake forms or assessment questions
- Present pricing or seat holds
- Own the structure signal — it transmits it

## Continuation

From the Media Passage, the visitor proceeds to `structured_eval` (the Marble Governance Chamber entry point).

Auto-advance on video end is supported (`onEnded` → `navigateSurface("structured_eval")`).

The Continue button is always present as a skip path.

## Content Governance

The Media Passage content is approved through `approved_copy_pending_contract` in the `structure_passage` encounter metadata.

Content fields:
- `eyebrow`
- `title` — defaults to "How does a structured environment optimize AI performance?"
- `subtitle`

These fields are approved through the DB-driven encounter contract. Frontend does not author them.

## Boundary

This contract governs Media Passage positioning, media role assignments, and continuation routing.

The passage does not govern chamber contracts or commerce.

Runtime media implementation is governed by the Measures Registry media authority governance process.

No CSS, DB, or runtime behavior changes are authorized by this contract.

## Close

The Media Passage transmits the structure signal.

Media is renderer.

The Marble Governance Chamber holds authority.
