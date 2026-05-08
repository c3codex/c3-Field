---
document_type: oar2
authority_level: working
document_scope: process_seed_transfer_wave
title: OAR2 - Recommended Process Seed Transfer Wave
status: ready_for_transfer
version: v1
operator: op044
native_stack:
  codex: authority
  field: relation
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems_validation
  notchazz: seeded_reference_control
tags:
  - oar2
  - process-seeding
  - seed-transfer
  - governing-seeded
  - reference-seeded
  - measures-seed
source_alignment:
  - seed_qualification_rules
  - process_seeding_reaudit
---

# OAR2 - Recommended Process Seed Transfer Wave

## Objective

Transfer the recommended active process surfaces into measures-seed so they can proceed toward seeded qualification.

This OAR2 performs transfer preparation only.

Seeded standing is not granted until separate verification confirms byte parity, hash parity, private bucket standing, and operational relation.

## Observed

The re-audit classified all 7 candidate process surfaces as:

requires_bucket_transfer

No candidate currently qualifies for seeded standing because private bucket objects are absent.

The recommended wave separates governing process surfaces from reference process surfaces.

## Aligned

This action aligns with Seed Qualification Rules because bucket transfer is required before hash verification, but bucket transfer alone does not create seeded standing.

This wave avoids bulk uncontrolled seeding by limiting scope to selected active process references.

## Routed

Transfer the following surfaces to measures-seed.

### Governing candidates

docs/process/oar_lifecycle.meta.md
docs/process/oar/oar2_generation_and_handoff_process.meta.md

Target object paths:

process/oar_lifecycle.meta.md
process/oar/oar2_generation_and_handoff_process.meta.md

### Reference candidates

docs/process/oar/templates/oar1_template.meta.md
docs/process/oar/templates/oar2_template.meta.md
docs/process/oar/db_role_contract_supabase.meta.md

Target object paths:

process/oar/templates/oar1_template.meta.md
process/oar/templates/oar2_template.meta.md
process/oar/db_role_contract_supabase.meta.md

## Held Candidates

Do not transfer in this wave:

docs/process/publication/new-publication-dispatch.ps1
docs/process/oar/new-oar.ps1

Reason:

Scripts/tools should not receive seeded standing unless downstream governance explicitly depends on them.

## NotChazz Role

NotChazz must prevent:

- bucket transfer being treated as seeded
- reference surfaces being promoted to governing surfaces
- scripts/tools being seeded by accumulation
- uncontrolled bulk seeding

Flags:

- BUCKET_TRANSFER_NOT_SEEDED
- REFERENCE_PROMOTED_WITHOUT_QUALIFICATION
- TOOL_SEEDED_WITHOUT_DEPENDENCY
- BULK_SEEDING_ATTEMPT

## Validation

Valid result:

- 5 target files exist locally
- 5 objects transferred to private measures-seed
- object paths are exact
- no held candidates transferred
- no seeded standing claimed yet
- OAR1 records transfer result

Invalid result:

- missing source file
- wrong object path
- public bucket exposure
- held candidate transferred
- seeded standing claimed before verification
- hash verification skipped but seeded status claimed

## Closeout

This OAR2 closes only the recommended seed transfer wave.

It does not:

- grant seeded standing
- perform hash qualification
- implement runtime enforcement
- seed held scripts/tools

A separate OAR2 must verify this wave before any surface becomes governing_seeded or reference_seeded.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
Chazz validates.
NotChazz preserves seeded authority distinction.
