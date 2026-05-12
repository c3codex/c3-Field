---
document_type: oar2
authority_level: working
document_scope: storage_provider_contract
title: OAR2 — Expand Codex Media Asset Storage Provider Contract
status: proposed
version: v1
operator: op044
system: measures_registry
source_evidence:
  - copy_corrected_inanna_epigraph_asset_v1.json
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# OAR2 — Expand Codex Media Asset Storage Provider Contract

## OBSERVED

The Pre-Codex media transfer layer is now stabilized.

The corrected inanna_epigraph.webp asset was verified at source, copied to measures-registry, verified at target, and returned retrieval status 200.

No DB mutation, frontend mutation, media resolver mutation, or source deletion occurred.

The remaining blocker is not media availability.

The remaining blocker is the live codex_media_asset.storage_provider contract.

Prior execution showed that DB remap could not safely proceed because the intended target bucket is Supabase-backed while the current DB contract rejects Supabase provider values.

Writing:

    bucket = measures-registry
    storage_provider = cloudflare_r2

would create a provider/bucket mismatch and likely fracture runtime URL resolution.

## ALIGNED

Codex remains authority.

Field structures the storage contract.

Measures registers media mapping and reveal eligibility.

Chazz validates and routes.

Cody executes only from OAR2.

This OAR2 authorizes contract investigation and implementation for Supabase-backed codex_media_asset rows.

This OAR2 does not authorize:

- media remap execution
- frontend hardcoding
- fallback URL invention
- destructive bucket changes
- provider mismatch writes
- deletion of existing Cloudflare/R2 behavior

Existing cloudflare_r2 rows must remain valid.

Supabase-backed rows must become representable without corrupting runtime resolution.

## ROUTED

### 1. Inspect current DB contract

Cody must inspect:

- codex_media_asset.storage_provider allowed values
- related CHECK constraints or enum type
- current provider values in live rows
- bucket/path patterns currently used
- any runtime resolver logic that branches by provider

### 2. Define provider expansion

Cody may expand the provider contract to include:

    supabase

Only if the change preserves existing rows and runtime behavior.

Preferred outcome:

    storage_provider IN ('cloudflare_r2', 'supabase', existing_valid_values...)

If implemented through an enum, migration must add supabase safely.

If implemented through a CHECK constraint, migration must preserve all existing valid values and add supabase.

### 3. Runtime resolver verification

Cody must verify how media URLs are resolved for:

- cloudflare_r2 rows
- supabase rows

Supabase resolution must use seated DB fields, not hardcoded component paths.

Runtime must be able to resolve:

    storage_provider = supabase
    bucket = measures-registry
    storage_path = measures_registry/pre_codex_exhibition/images/<filename>.webp

No frontend component may construct truth independently.

### 4. No media remap yet

This OAR2 does not authorize updating Pre-Codex media rows.

After provider contract expansion is validated, a follow-up OAR2 may remap the verified media rows.

### 5. Validation query

Cody must return validation showing:

- provider contract before
- provider contract after
- current distinct provider values
- whether supabase is accepted
- whether existing cloudflare_r2 rows remain valid
- resolver behavior for both provider types
- no frontend hardcoded paths introduced

## CODY ROLE

Cody may:

- inspect schema constraints
- write a migration or schema patch
- update provider contract safely
- verify runtime resolver behavior
- write OAR1 closeout

Cody may not:

- remap media rows in this OAR
- hardcode storage URLs in frontend
- break existing cloudflare_r2 rows
- create fallback authority
- delete bucket objects
- infer media relations

## VALIDATION

This OAR2 resolves successfully when:

1. codex_media_asset.storage_provider can safely represent Supabase-backed media rows
2. existing provider rows remain valid
3. runtime URL resolution remains DB-driven
4. no media rows are remapped yet
5. no frontend hardcoding is introduced
6. OAR1 records schema/runtime validation evidence

## EXPECTED OAR1

    docs/oar/measures_registry/oar1_expand_codex_media_asset_storage_provider_contract_v1.meta.md

## CLOSE

Do not force media into the wrong provider.

Expand the contract.
Verify runtime resolution.
Then remap.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
