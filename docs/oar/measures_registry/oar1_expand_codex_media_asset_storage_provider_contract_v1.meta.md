---
document_type: oar1
authority_level: execution_closeout
document_scope: storage_provider_contract
title: OAR1 - Expand Codex Media Asset Storage Provider Contract
status: completed
version: v1
operator: op044
system: measures_registry
source_oar2: oar2_expand_codex_media_asset_storage_provider_contract_v1
---

# OAR1 - Expand Codex Media Asset Storage Provider Contract

## SUMMARY

The live `public.codex_media_asset.storage_provider` contract was expanded to allow Supabase-backed media rows.

The CHECK constraint now allows:

- `cloudflare_r2`
- `supabase`

No Pre-Codex media rows were remapped in this OAR.

## CONTRACT BEFORE

Source definition and live probe showed:

`codex_media_asset_storage_provider_check check (storage_provider in ('cloudflare_r2'))`

Validation:

- `supabase` probe before expansion: rejected
- error code: `23514`
- error: `violates check constraint "codex_media_asset_storage_provider_check"`

Current provider counts before:

- `measures-media / cloudflare_r2`: `9`
- `pre-codex-exhibition / cloudflare_r2`: `19`
- total rows: `28`

## CONTRACT CHANGE

Migration file:

`supabase/migrations/202605120001_expand_codex_media_asset_storage_provider.sql`

Applied live change:

```sql
alter table public.codex_media_asset
  drop constraint if exists codex_media_asset_storage_provider_check;

alter table public.codex_media_asset
  add constraint codex_media_asset_storage_provider_check
  check (storage_provider in ('cloudflare_r2', 'supabase'));
```

## CONTRACT AFTER

Validation:

- `supabase` probe after expansion: accepted, then deleted
- `cloudflare_r2` probe after expansion: accepted, then deleted
- probe rows remaining: `0`
- existing `cloudflare_r2` rows remain valid: `true`

Provider counts after:

- `measures-media / cloudflare_r2`: `9`
- `pre-codex-exhibition / cloudflare_r2`: `19`
- total rows: `28`

## RUNTIME RESOLVER VERIFICATION

Runtime remains DB-driven through seated fields:

- `storage_provider`
- `bucket`
- `storage_path`

Verified resolver behavior:

- `cloudflare_r2 + measures-media + primus_artus.mp3`
  - resolves through `VITE_R2_PUBLIC_BASE_URL`
  - output: `https://media.c3field.online/primus_artus.mp3`
- `supabase + measures-registry + measures_registry/pre_codex_exhibition/images/inanna_epigraph.webp`
  - resolves through Supabase storage public URL
  - output: `https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/measures_registry/pre_codex_exhibition/images/inanna_epigraph.webp`

No frontend component hardcoding was introduced.

## VALIDATION

- provider contract before recorded: `true`
- provider contract after recorded: `true`
- `supabase` accepted after change: `true`
- existing `cloudflare_r2` rows remain valid: `true`
- media rows remapped: `false`
- media rows remapped count: `0`
- frontend mutation performed: `false`
- source objects deleted: `false`

Evidence:

`docs/oar/measures_registry/expand_codex_media_asset_storage_provider_contract_v1.json`

Executor:

`docs/oar/measures_registry/execute-expand-codex-media-asset-storage-provider-contract.cjs`

## FINAL STANDING

The provider contract can now represent Supabase-backed `codex_media_asset` rows safely.

The prior provider/bucket mismatch risk is resolved at the schema contract layer.

Pre-Codex media remap remains intentionally unexecuted and awaits a follow-up OAR2.
