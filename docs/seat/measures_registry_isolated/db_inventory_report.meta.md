---
document_type: db_inventory_report
system: measures_registry
status: partial_read_only_anon_inventory_recovered
source_oar1: docs/seat/measures_registry/09_oar/oar1_recover_and_isolate_current_measures_registry_db_and_docs_standing_v1.meta.md
---

# DB Inventory Report

## DB Access Standing

partial_read_only_anon

## Live Read Scope

The configured anonymous project key allowed live read-only inventory.

## Unavailable Privileged Scope

No service-role credential was present in the inspected repo environment.

Unavailable:

- admin schema inspection
- policy inspection
- hidden-row completeness
- privileged metadata verification
- RLS-restricted completeness

## Tables / Areas Read

- measures_registry
- measures_encounter_def
- measures_media_map
- measures_design_token
- measures_publication_registry
- measures_publication_dispatch
- map_commerce_contracts
- measures_publication_subscription_capture

## No-Mutation Confirmation

No RPC operation was executed.

No write operation was executed.

No DB mutation is authorized by this report.
