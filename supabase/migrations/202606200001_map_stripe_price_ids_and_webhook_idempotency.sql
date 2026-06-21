-- MAP Stripe price seating and webhook idempotency.
-- Public payment remains MAP-only and does not create SEAT or c3 standing.

-- The live database may contain the historical map_commerce_contracts surface
-- without the corrected MAP C2 circuit. Create only the corrected payment-schema
-- surface here; runtime and public payment activation remain separately held.
create table if not exists public.map_c2_circuit (
  map_circuit_key           text primary key
    check (map_circuit_key in ('pre_deployment', 'optimization', 'remediation')),
  evaluation_standing       text not null,
  applicable_standing_keys  jsonb not null default '[]'::jsonb,
  product_name              text not null,
  amount_usd                integer not null,
  currency                  text not null default 'usd',
  stripe_product_id         text,
  stripe_price_id           text,
  release_state             text not null default 'held',
  payment_processor         text not null default 'stripe'
    check (payment_processor = 'stripe'),
  payment_scope             text not null default 'map_the_environment'
    check (payment_scope = 'map_the_environment'),
  c3_key_required           boolean not null default false,
  wallet_required           boolean not null default false,
  map_boundary              text not null,
  access_boundary           text not null,
  deliverables              jsonb not null default '[]'::jsonb,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

insert into public.map_c2_circuit (
  map_circuit_key,
  evaluation_standing,
  applicable_standing_keys,
  product_name,
  amount_usd,
  currency,
  stripe_product_id,
  stripe_price_id,
  release_state,
  payment_processor,
  payment_scope,
  c3_key_required,
  wallet_required,
  map_boundary,
  access_boundary
) values
  (
    'pre_deployment',
    'eval_result_01',
    '["eval_result_01"]'::jsonb,
    'MAP Foundational Review',
    333,
    'usd',
    'prod_UfT3Fg1cmsBvE5',
    'price_1Tg87rP9heJD6LYqW8JkxRJw',
    'held',
    'stripe',
    'map_the_environment',
    false,
    false,
    'MAP reviews, identifies, and recommends. It does not implement system changes or create authority.',
    'Sensitive material and credentials require separate authorization.'
  ),
  (
    'optimization',
    'eval_result_02',
    '["eval_result_02"]'::jsonb,
    'MAP Optimization Review',
    777,
    'usd',
    'prod_UfT8GJn8S6tusF',
    'price_1Tg8CgP9heJD6LYqZoVQmH7H',
    'held',
    'stripe',
    'map_the_environment',
    false,
    false,
    'MAP reviews, identifies, and recommends. It does not implement system changes or create authority.',
    'Sensitive material and credentials require separate authorization.'
  ),
  (
    'remediation',
    'eval_result_03',
    '["eval_result_03","eval_result_04"]'::jsonb,
    'MAP Remediation Review',
    999,
    'usd',
    'prod_UfTFCWo6OPmbbt',
    'price_1Tg8IaP9heJD6LYq3y6CQHX5',
    'held',
    'stripe',
    'map_the_environment',
    false,
    false,
    'MAP reviews, identifies, and recommends. It does not implement system changes or create authority.',
    'Sensitive material and credentials require separate authorization.'
  )
on conflict (map_circuit_key) do nothing;

alter table public.map_c2_circuit
  add column if not exists map_pathway text,
  add column if not exists stripe_price_env_key text,
  add column if not exists public_map_boundary text,
  add column if not exists public_access_boundary text,
  add column if not exists public_payment_boundary text;

update public.map_c2_circuit
set
  map_pathway = 'foundational',
  stripe_price_env_key = 'STRIPE_PRICE_PREDEPLOY_MAP',
  product_name = 'MAP Foundational Review',
  amount_usd = 333,
  stripe_product_id = 'prod_UfT3Fg1cmsBvE5',
  stripe_price_id = 'price_1Tg87rP9heJD6LYqW8JkxRJw'
where map_circuit_key = 'pre_deployment';

update public.map_c2_circuit
set
  map_pathway = 'optimization',
  stripe_price_env_key = 'STRIPE_PRICE_OPTIMIZATION_MAP',
  product_name = 'MAP Optimization Review',
  amount_usd = 777,
  stripe_product_id = 'prod_UfT8GJn8S6tusF',
  stripe_price_id = 'price_1Tg8CgP9heJD6LYqZoVQmH7H'
where map_circuit_key = 'optimization';

update public.map_c2_circuit
set
  map_pathway = 'remediation',
  stripe_price_env_key = 'STRIPE_PRICE_REMEDIATION_MAP',
  product_name = 'MAP Remediation Review',
  amount_usd = 999,
  stripe_product_id = 'prod_UfTFCWo6OPmbbt',
  stripe_price_id = 'price_1Tg8IaP9heJD6LYq3y6CQHX5'
where map_circuit_key = 'remediation';

update public.map_c2_circuit
set
  public_map_boundary = 'MAP measures current operational standing, audits visible AI-influenced behavior, and prepares structured review recommendations.',
  public_access_boundary = 'Review access may be read-only, guided, screen-shared, exported, documented, or AI-assisted. Sensitive material requires separate authorization.',
  public_payment_boundary = 'MAP purchase opens the selected review pathway only. It creates no additional system standing or access.'
where map_circuit_key in (
  'pre_deployment',
  'optimization',
  'remediation'
);

alter table public.map_c2_circuit
  alter column map_pathway set not null,
  alter column stripe_price_env_key set not null,
  alter column public_map_boundary set not null,
  alter column public_access_boundary set not null,
  alter column public_payment_boundary set not null;

alter table public.map_c2_circuit
  drop constraint if exists map_c2_circuit_map_pathway_check;

alter table public.map_c2_circuit
  add constraint map_c2_circuit_map_pathway_check
  check (map_pathway in ('foundational', 'optimization', 'remediation'));

create unique index if not exists map_c2_circuit_map_pathway_uidx
  on public.map_c2_circuit(map_pathway)
  where release_state = 'active';

alter table public.map_c2_circuit enable row level security;
revoke all on table public.map_c2_circuit from anon, authenticated;
grant select on table public.map_c2_circuit to service_role;

create table if not exists public.stripe_webhook_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text unique not null,
  event_type text not null,
  checkout_session_id text,
  payment_intent_id text,
  status text not null default 'processing'
    check (status in ('processing', 'processed', 'failed')),
  processing_started_at timestamptz not null default now(),
  processed_at timestamptz,
  attempt_count integer not null default 1,
  error text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists stripe_webhook_events_status_idx
  on public.stripe_webhook_events(status);

alter table public.stripe_webhook_events enable row level security;

drop policy if exists "stripe_webhook_events_service_role" on public.stripe_webhook_events;
create policy "stripe_webhook_events_service_role"
on public.stripe_webhook_events for all
to service_role
using (true)
with check (true);

revoke all on table public.stripe_webhook_events from anon, authenticated;
grant select, insert, update on table public.stripe_webhook_events to service_role;

create or replace function public.claim_stripe_webhook_event(
  p_stripe_event_id text,
  p_event_type text,
  p_checkout_session_id text default null,
  p_payment_intent_id text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns table (
  should_process boolean,
  duplicate_event boolean,
  prior_status text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_count integer;
  existing_status text;
  existing_started_at timestamptz;
begin
  insert into public.stripe_webhook_events (
    stripe_event_id,
    event_type,
    checkout_session_id,
    payment_intent_id,
    status,
    processing_started_at,
    metadata
  ) values (
    p_stripe_event_id,
    p_event_type,
    p_checkout_session_id,
    p_payment_intent_id,
    'processing',
    now(),
    coalesce(p_metadata, '{}'::jsonb)
  )
  on conflict (stripe_event_id) do nothing;

  get diagnostics inserted_count = row_count;

  if inserted_count = 1 then
    return query select true, false, 'new'::text;
    return;
  end if;

  select status, processing_started_at
  into existing_status, existing_started_at
  from public.stripe_webhook_events
  where stripe_event_id = p_stripe_event_id
  for update;

  if existing_status = 'processed' then
    return query select false, true, existing_status;
    return;
  end if;

  if existing_status = 'processing'
     and existing_started_at > now() - interval '5 minutes' then
    return query select false, true, existing_status;
    return;
  end if;

  update public.stripe_webhook_events
  set
    status = 'processing',
    processing_started_at = now(),
    attempt_count = attempt_count + 1,
    error = null,
    updated_at = now()
  where stripe_event_id = p_stripe_event_id;

  return query select true, true, existing_status;
end;
$$;

revoke all on function public.claim_stripe_webhook_event(text, text, text, text, jsonb) from public;
revoke all on function public.claim_stripe_webhook_event(text, text, text, text, jsonb) from anon;
revoke all on function public.claim_stripe_webhook_event(text, text, text, text, jsonb) from authenticated;
grant execute on function public.claim_stripe_webhook_event(text, text, text, text, jsonb) to service_role;

create or replace function public.map_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists stripe_webhook_events_updated_at on public.stripe_webhook_events;
create trigger stripe_webhook_events_updated_at
before update on public.stripe_webhook_events
for each row execute function public.map_set_updated_at();
