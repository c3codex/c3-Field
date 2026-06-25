---
document_type: oar2
authority_level: working
document_scope: runtime_authority_isolation
title: OAR2 — Audit Runtime Authority and SEAT Source Isolation
status: proposed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  claude: implementation_executor
---

# OAR2 — Audit Runtime Authority and SEAT Source Isolation

## OBSERVED

Recent runtime audits indicate Measures Registry is functionally improving, however execution continues to reference terminology and structures originating from historical working development.

Operator does not permit working terminology to become executable authority.

Working documents exist for exploration.

SEAT-approved standing exists for implementation.

Those boundaries must remain isolated.

The previous runtime audit should have revealed the true standing of the live database rather than normalize historical residue.

This OAR audits authority, not functionality.

## ALIGNED

Authority order remains:

Codex
→ Field
→ Measures
→ SEAT Approved Standing
→ Runtime
→ Renderer

Working folders are never execution authority.

Historical OARs are never execution authority.

Draft migrations are never execution authority.

Unapproved terminology is never execution authority.

DB-first does NOT mean every value currently stored in the database is authoritative.

Runtime authority exists only when BOTH are true:

• seated in live DB
• approved through SEAT standing

Any other state is residue.

Residue must never silently become runtime authority.

## ROUTED

Claude shall perform an authority audit.

This is NOT a terminology audit.

This is NOT a naming audit.

This is an execution authority audit.

### 1. Authority Source Audit

For every runtime surface determine authority source.

Classify as exactly one:

SEAT Approved

Working Residue

Legacy Runtime

Migration Artifact

Deprecated Alias

Unknown Authority

Component-owned

DB-only residue

Return every finding.

### 2. Runtime Authority Audit

Inspect:

routes

encounter keys

registry keys

surface keys

media roles

release states

renderer contracts

metadata

transition nodes

Only report what is actually executable.

### 3. DB Authority Audit

Audit live DB.

Determine whether records are:

Approved Standing

Working Carry-over

Migration Residue

Duplicate Standing

Deprecated

Alias

Unsafe Runtime Authority

Do not assume DB equals authority.

DB contents must be classified.

### 4. Source Isolation Audit

Determine whether runtime can reference:

working folders

historical development

non-SEAT folders

deprecated migrations

temporary OAR content

draft terminology

If yes:

identify exact source.

### 5. Authority Drift Audit

Locate every executable reference whose authority originates outside approved SEAT standing.

Examples include but are not limited to:

legacy encounter keys

legacy registry keys

working metadata

temporary routing

historical aliases

development terminology

old assessment contracts

temporary runtime labels

Return:

file

DB record

runtime reference

reason it remains executable

### 6. Safe Repair Authority

Claude may:

remove runtime references to residue

replace residue with approved standing

remove deprecated aliases

remove obsolete runtime references

remove dead registry references

repair authority mapping

Claude may NOT:

invent replacement authority

rename approved standing

change public terminology

change Measures Registry architecture

promote working terminology

### 7. Deliverable

Return:

Approved Runtime Authority Inventory

Working Residue Inventory

Migration Residue Inventory

Deprecated Runtime Inventory

Unsafe Runtime Authority Inventory

Required SEAT Migrations

Required Runtime Repairs

Required DB Repairs

Required OAR2 Follow-ups

Every finding must include its authority source.

"Assumed seated"

is prohibited language.

If authority cannot be verified:

state

Authority Unknown

never

Assumed Seated.

## CLAUDE ROLE

Claude acts as Measures Registry implementation executor.

Native Order:

Codex
→ Field
→ Measures
→ SEAT Approved Standing
→ OAR2
→ Chazz
→ Claude
→ Runtime

Claude executes only from approved authority.

Working development is reference only.

## NOTCHAZZ FLAGS

Raise NotChazz flag if:

working terminology reaches runtime

historical OAR language reaches runtime

DB residue is treated as authority

migration artifacts remain executable

aliases replace approved standing

authority source cannot be identified

runtime normalizes residue instead of reporting it

"assumed seated" appears anywhere in OAR1

## VALIDATION

Success is achieved when:

every executable runtime authority is classified

every DB authority source is classified

working residue is isolated

migration residue is isolated

unsafe runtime authority is identified

approved standing is distinguished from DB residue

no "assumed seated" language appears

OAR1 returns a complete authority inventory before further implementation proceeds.

Expected OAR1:

docs/oar/measures_registry/oar1_audit_runtime_authority_and_seat_source_isolation_v1.meta.md
