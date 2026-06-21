---
oar_id: oar2_create_measures_registry_site_working_folder_for_doc_set_chamber_contents_media_contracts_and_surface_review_v1
oar_type: OAR2
title: Create Measures Registry Site Working Folder for Doc Set, Chamber Contents, Media, Contracts, and Surface Review v1
system_scope: measures_registry
status: proposed
requires_oar1: true
mutation_scope:
  working_folder_created: true
  docs_copied_or_referenced: true
  runtime: false
  database: false
  routes: false
  renderer: false
  public_copy_rewrite: false
  public_metadata: false
  docs_deleted: false
  source_docs_moved: false
  payment_state: false
  map_delivery_state: false
  seat_state: false
  social_dispatch_state: false
  publication_state: false
  integration_state: false
  c3_backoffice_state: false
  launch_authority_created: false
---

# OAR2 — Create Measures Registry Site Working Folder for Doc Set, Chamber Contents, Media, Contracts, and Surface Review v1

## OBJECTIVE

Create a single Measures Registry working folder that gathers the full current site review package:

- doc set
- chamber contents
- encounter/surface contents
- public labels
- media mappings
- renderer/contracts
- canopy/circuit requirements
- integration traces
- deprecated/trace material
- isolation boundary references
- structured asset requirements

This is a working review package only.

It must allow the full Measures Registry site to be reviewed as one coherent assembly without mutating authority.

## WORKING ROOT

Create:

```text
docs/working/measures_registry_site_review_v1/
```

## SAVED OPERATOR CONTINUATION - DEV SHELL TRANSFER

Populate the working root with review copies of the dev-shell contents identified by the existing recovery and isolation records.

Use as classification authority:

```text
docs/oar/docs_measures_registry_dev_shell_carryout_recovery_matrix_v1.meta.md
docs/oar/docs_measures_registry_dev_shell_isolation_boundary_v1.meta.md
docs/oar/docs_measures_registry_launch_shell_recovery_audit_v1.meta.md
```

Create these review-package classes:

```text
current_dev_shell/
operator_review_conflicts/
boundary_records/
```

Copy the clean current dev-shell allowlist with source-relative paths:

```text
src/app/App.tsx
src/measures_registry/registered_runtime/registeredRuntimeTypes.ts
src/measures_registry/registered_runtime/registeredRuntimeUtils.ts
src/measures_registry/registered_runtime/renderers/RegisteredIntro.tsx
src/measures_registry/registered_runtime/renderers/RegisteredPathChoice.tsx
src/measures_registry/registered_runtime/renderers/RegisteredPassage.tsx
src/measures_registry/registered_runtime/renderers/RegisteredPublicUnderstand.tsx
src/measures_registry/registered_runtime/renderers/RegisteredGovernedStatus.tsx
src/measures_registry/registered_runtime/styles/
```

Copy `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` only under `operator_review_conflicts/`. It is current runtime evidence but is not a clean whole-file shell allowlist entry.

Copy the recovery, isolation, launch-shell, and paired OAR1 records under `boundary_records/`.

Create a transfer manifest that preserves source ownership, classification, and exclusions.

Do not admit dev-shell candidates, protected upstream trace, downstream-held authority, deprecated runtime, backoffice execution material, or conflict renderers into the clean current-shell class.

All transferred files are review copies. Do not move, delete, or rewrite source files. Do not mutate runtime, DB, routes, renderer, public copy, public metadata, payment, MAP, SEAT, social dispatch, publication, integrations, or launch authority.
