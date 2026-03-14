---
title: Interoperability Rules
slug: interoperability-rules
document_type: canon
document_class: create
canonical: true
authority_level: structural
pillar: c3

author: Syndros
organization: c3 Community Partners DAO, LLC
date: 2026

registry_class: canon
registry_section: create

related_systems:
  - supabase
  - postgres
  - codexstone
  - coherentai
  - measures
  - c3-community-partners

tags:
  - interoperability
  - system contract
  - oar
  - storage
  - slugs
  - governance
  - versioning

summary: |
  Defines the structural interoperability rules of the c3 field. Establishes
  the database as system contract, slugs as global identifiers, storage as
  addressable infrastructure, OAR as operational trace, the UI as renderer,
  executors as shared-kernel clients, governance as separated layers, and
  all external contracts as versioned.

data:
  purposes:
    - define interoperability rules
    - define system contract boundaries
    - define anti-drift architecture

encounter:
  surface: canon
  mode: document
  audience:
    - human
    - ai

state:
  status: verified
  oar:
    observed: interoperability architecture gathered into a single structural canon document.
    aligned: rules preserve registry-driven rendering, shared execution, governance separation, and system traceability.
    routed: awaiting review.
---

# Interoperability Rules

## Purpose

The Interoperability Rules define the structural conditions required for the c3 field to remain coherent across systems, interfaces, storage layers, governance surfaces, and AI-assisted execution.

Its purposes are:

1. define interoperability rules  
2. define system contract boundaries  
3. define anti-drift architecture  

No additional purposes are assumed unless introduced through the canon decision protocol.

---

## 1. Treat the Database as the System Contract

Supabase/Postgres is the canonical system contract.

The UI is not the contract.  
No LLM is the contract.

All systems must interoperate through stable database views and schemas.

### Pattern

- tables → internal logic
- views → public contract

### Core tables

- `canon_artifact`
- `oar_log`
- `concept_link`
- `measures_registry`

### Public views

- `v_canon_public_v1`
- `v_measures_state_v1`
- `v_oar_trace_v1`

### Rule

UI, workers, validators, and LLM roles must read from views rather than raw tables.

### Why it matters

- schemas can evolve
- clients do not break
- versioning becomes possible

---

## 2. Use Slugs as Global Identifiers

Database IDs must not be used as cross-system identifiers.

Canonical slugs must function as the shared identifier across systems.

### Examples

- `codexstone_geometric_logic`
- `c3_model`
- `gate_01`
- `epithet_03`
- `marble_me_12`

### Why it matters

Slugs unify:

- URLs
- APIs
- LLM references
- DAO governance
- storage objects

All systems can point to the same artifact without translation drift.

---

## 3. Storage Must Be Addressable

Supabase buckets must behave as addressable content storage.

### Examples

- `/Measures-open/gate01.mp4`
- `/Measures-open/gate01.webp`
- `/Measures-open/gate01_plaque.md`

The registry references the asset.  
The bucket stores the file.

### Media asset record

- `slug`
- `bucket`
- `path`
- `mime`
- `checksum`

### Rule

Any system must be able to retrieve a file through its registered storage reference.

---

## 4. Every Operation Must Be Loggable

System actions must produce traceable OAR records.

### OAR pattern

- Observed
- Aligned
- Routed

### Example

Observed: `gate01_render_failure`  
Aligned: `expected_asset_missing`  
Routed: `fallback_plaque_text`

### Why it matters

OAR logging enables:

- debugging
- governance transparency
- LLM traceability

---

## 5. Build the UI as a Renderer, Not a Logic Engine

The site must render structured data rather than invent rules.

### Bad pattern

`if gate === "gate01" do special logic`

### Better pattern

`registry → config → renderer`

### Example registry entry

- `slug: "gate01"`
- `title: "Crown Removed"`
- `intro_asset: "..."`
- `plaque_text: "..."`
- `next_gate: "gate02"`

### Rule

The UI renders declared state.  
It does not become the source of state.

---

## 6. Executors Must Share the Same Logic

All orchestrators must run the same validator logic.

### Examples

- local script
- edge function
- Cloudflare worker

### Shared kernel call

`validateMeasuresState()`

### Why it matters

Shared execution logic creates:

- redundancy
- consistency
- interoperability

---

## 7. Separate Governance Layers Early

Governance layers must remain structurally distinct.

### Keep separate tables for

- canon
- policy
- interpretation
- decision_log
- revision

### Rule

These layers must never be merged into one table or one logic surface.

### Why it matters

If governance layers collapse together, AI automation will introduce drift.

---

## 8. Version Everything That Leaves the System

Any public-facing view, contract, or exported structure must be versioned.

### Examples

- `v_measures_encounter_v1`
- `v_measures_state_v1`
- `canon_public_v1`

When updated:

- `v_measures_state_v2`

### Why it matters

Older systems continue to function while newer systems upgrade safely.

---

## Closing Principle

Interoperability in the c3 field is not achieved by convenience.

It is achieved by shared contracts, stable identifiers, addressable storage, traceable operations, renderer discipline, unified execution logic, governance separation, and explicit versioning.

When these conditions hold, systems can evolve without drift.