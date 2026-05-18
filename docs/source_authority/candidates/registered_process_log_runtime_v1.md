---
document_type: validation_evidence
title: Registered Process Log Runtime Evidence
version: v1
source_oar2: oar2_registered_process_log_runtime_v1.meta.md
status: complete_no_deploy
---

# Registered Process Log Runtime Evidence

## DB Seating

`public.system_oar_log` was inspected and found insufficient for the required runtime fields.

Missing fields:

- `process_type`
- `oar2_reference`
- `oar1_reference`
- `execution_status`
- `validation_status`
- `deploy_status`
- `seeded_status`
- `executor`
- `validator`
- `operator`
- `validated_at`
- `deployed_at`
- `closeout_state`

Created bounded process visibility table:

`public.registered_process_log`

## Runtime Surface

- registry key: `registered_process_log`
- encounter key: `registered_process_log`
- renderer: `registered_process_log`
- data source: `public.registered_process_log`

The frontend reads seated process records from `public.registered_process_log`.

## Record Count

Inserted/read process records: 4

## Status Values Present

- standing: `executed`, `governing_seeded`, `transferred`
- execution_status: `executed`
- validation_status: `hash_verified`, `pending`, `transfer_validated`, `validated`
- deploy_status: `deployed`, `not_required`, `requires_confirmation`
- seeded_status: `governing_seeded`, `not_seeded`, `transferred`

## Validation

- DB connection active: true
- process standing distinctions preserved: true
- role distinctions preserved: true
- transferred is not seeded: true
- executed is not deployed: true
- protected surfaces modified: false
- build command passed: `npm.cmd run build:registry`
- deploy performed: false
