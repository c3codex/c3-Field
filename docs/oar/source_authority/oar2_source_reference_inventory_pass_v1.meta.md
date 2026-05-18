---
document_type: oar2
authority_level: working
document_scope: source_authority
title: OAR2 — Source Reference Inventory Pass
status: proposed
version: v1
operator: op044
date: 2026-05-17
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - source-authority
  - inventory
  - semantic-governance
  - reference-visibility
  - codex-normalization
source_alignment:
  - Seed Concordance
  - The 21 of Coherence
  - Seeded Reference Control
  - OAR2 Source Reference Codex Seating Architecture
---

# OAR2 — Source Reference Inventory Pass

## OBSERVED

Current source references exist across mixed operational standing.

Some references are:

- thread-carried
- markdown-only
- process-governing
- implementation-governing
- seeded
- partially runtime-referenced
- partially DB-aligned

There is no unified inventory explicitly identifying:

- what references currently govern behavior
- what authority standing they hold
- whether they are seeded or merely committed
- whether they are candidates for Codex seating
- what runtime or process surfaces depend on them

This creates a visibility problem:

the system cannot reliably distinguish reference existence from authority standing.

Without inventory, semantic governance cannot normalize into Codex authority.

## ALIGNED

The inventory pass is c1 Connect work.

Purpose:

- identify what currently exists
- before classification
- before Codex seating

This OAR2 does not:

- mutate DB
- declare authority
- perform Codex seating
- rewrite references
- validate runtime behavior

This OAR2 establishes observable source-reference inventory only.

Inventory remains distinct from authority determination.

Verification precedes recognition.

## ROUTED

### 1. Inventory scope

Inventory all active source references currently governing or influencing:

- process
- runtime
- registry behavior
- semantic meaning
- encounter structure
- implementation logic
- validation behavior
- migration planning

### 2. Included reference families

Initial inventory families:

- semantic_concordance
- source_set
- process_rule
- role_contract
- implementation_manifest
- verification_checklist
- runtime_validation
- oar_lifecycle
- migration_architecture
- encounter_contract
- frontend_contract
- seed_constraints
- system_intelligence

### 3. Inventory output fields

Each inventory row should minimally include:

- reference_key
- title
- document_type
- current_location
- source_family
- current_standing
- authority_claim
- governs_scope
- runtime_dependency
- db_dependency
- source_alignment
- seeded_status
- codex_candidate
- notes

### 4. Current standing definitions

Allowed standing values:

- draft
- validated
- written
- committed
- seeded
- codex_candidate
- codex_seated
- deprecated
- superseded

### 5. Inventory boundary

Inventory does not equal authority.

Rules:

- listed ? seated
- committed ? seeded
- seeded ? codex authority
- runtime-used ? authority

### 6. Dependency visibility

Inventory should expose where references are actively influencing:

- DB behavior
- runtime behavior
- process governance
- frontend rendering
- migration logic
- validation logic

This allows later semantic validation against actual dependency surfaces.

### 7. Future passes excluded

This inventory pass excludes:

- DB mutation
- Codex seating
- runtime role governance
- permission systems
- callable execution registry
- semantic enforcement logic

Those belong to later architecture passes.

## CODY ROLE

Cody may later assist by:

- scanning existing docs
- identifying runtime references
- checking implementation dependency surfaces
- reporting unresolved authority ambiguity

Cody may not:

- declare authority
- perform Codex seating
- collapse standing distinctions
- infer missing governance state

## VALIDATION

This OAR2 resolves successfully when:

- the system gains a visible inventory of active source references
- without collapsing inventory into authority

Success means:

- references become identifiable
- standing becomes reviewable
- dependency surfaces become visible
- Codex seating may later proceed from inventory instead of memory

## EXPECTED NEXT OAR

OAR2 — Source Reference Classification Pass v1

## CLOSE

Before authority:
visibility.

Before seating:
inventory.

Before runtime governance:
source-reference clarity.
