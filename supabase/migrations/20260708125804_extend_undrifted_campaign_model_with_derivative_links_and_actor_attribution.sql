-- OAR2: oar2_add_campaign_derivative_assets_and_human_ai_role_attribution_v1
-- ROUTED §2: every governed action (campaign / campaign_asset / distribution_asset row) supports
-- Human/AI actor attribution. ROUTED §3: Campaign Assets now reference publication_asset_id,
-- derivative_asset_id, campaign_id — renaming campaign_asset.campaign_key to campaign_id for literal
-- field-name parity with distribution_asset.campaign_id (values unchanged, same FK target).
-- ROUTED §4: Distribution Assets continue referencing Campaign Assets only — no derivative link added
-- here, to avoid duplicating the derivative reference already held by the Campaign Asset.

alter table public.measures_publication_campaign_asset rename column campaign_key to campaign_id;

alter table public.measures_publication_campaign_asset
  add column derivative_asset_id text references public.measures_publication_derivative_asset(derivative_key);

alter table public.measures_publication_campaign
  add column created_by_actor_class text check (created_by_actor_class is null or created_by_actor_class in ('Human', 'AI')),
  add column created_by_actor_key text,
  add column approved_by_actor_class text check (approved_by_actor_class is null or approved_by_actor_class in ('Human', 'AI')),
  add column approved_by_actor_key text,
  add column review_status text;

alter table public.measures_publication_campaign_asset
  add column created_by_actor_class text check (created_by_actor_class is null or created_by_actor_class in ('Human', 'AI')),
  add column created_by_actor_key text,
  add column approved_by_actor_class text check (approved_by_actor_class is null or approved_by_actor_class in ('Human', 'AI')),
  add column approved_by_actor_key text,
  add column review_status text;

alter table public.measures_publication_distribution_asset
  add column created_by_actor_class text check (created_by_actor_class is null or created_by_actor_class in ('Human', 'AI')),
  add column created_by_actor_key text,
  add column approved_by_actor_class text check (approved_by_actor_class is null or approved_by_actor_class in ('Human', 'AI')),
  add column approved_by_actor_key text,
  add column review_status text;

comment on column public.measures_publication_campaign_asset.derivative_asset_id is 'References measures_publication_derivative_asset.derivative_key. Campaign Assets orchestrate approved derivatives — they do not own generated content.';
