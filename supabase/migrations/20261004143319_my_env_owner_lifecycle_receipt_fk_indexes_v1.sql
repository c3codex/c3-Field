
create index if not exists c3_my_env_owner_lifecycle_receipt_env_idx
  on public.c3_my_env_owner_lifecycle_receipt(env_key);
create index if not exists c3_my_env_owner_lifecycle_receipt_envpac_idx
  on public.c3_my_env_owner_lifecycle_receipt(envpac_key);
