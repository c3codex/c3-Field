alter table public.codex_media_asset
  drop constraint if exists codex_media_asset_storage_provider_check;

alter table public.codex_media_asset
  add constraint codex_media_asset_storage_provider_check
  check (storage_provider in ('cloudflare_r2', 'supabase'));
