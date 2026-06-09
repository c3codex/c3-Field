-- MAP Commerce Contracts, Payment Events, and Obsidian Media Bindings — Migration v1
-- Source OAR2: docs/oar/measures_registry/oar2_complete_obsidian_marble_launch_chambers_governed_map_payment_boundary_v1.meta.md
-- Routes: 1 (Obsidian media bindings), 5 (MAP commerce contracts), 6 (MAP payment event logging)

-- ============================================================
-- TABLE: map_commerce_contracts
-- MAP the Environment product contracts — server-side authority.
-- Frontend must not hardcode prices, product IDs, or descriptions.
-- stripe_price_id: populate from Stripe dashboard after products confirmed.
-- ============================================================
create table if not exists public.map_commerce_contracts (
  contract_key              text primary key,
  map_circuit_key           text not null
    check (map_circuit_key in ('pre_deployment', 'optimization', 'remediation')),
  evaluation_standing       text not null,
  applicable_standing_keys  jsonb not null default '[]'::jsonb,
  product_name              text not null,
  amount_usd                integer not null,
  currency                  text not null default 'usd',
  stripe_product_id         text,
  stripe_price_id           text,
  release_state             text not null default 'active',
  payment_processor         text not null default 'stripe'
    check (payment_processor = 'stripe'),
  payment_scope             text not null default 'map_the_environment'
    check (payment_scope = 'map_the_environment'),
  c3_key_required           boolean not null default false,
  wallet_required           boolean not null default false,
  seat_contract_generated   boolean not null default false,
  seat_contract_state       text not null default 'held_until_map_complete',
  map_boundary              text not null,
  access_boundary           text not null,
  deliverables              jsonb not null default '[]'::jsonb,
  seat_hold_notice          text not null default 'A full SEAT Contract may be generated only after MAP the Environment is complete.',
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

-- Seed MAP commerce contracts
insert into public.map_commerce_contracts (
  contract_key,
  map_circuit_key,
  evaluation_standing,
  applicable_standing_keys,
  product_name,
  amount_usd,
  currency,
  stripe_product_id,
  stripe_price_id,
  payment_processor,
  payment_scope,
  c3_key_required,
  wallet_required,
  seat_contract_generated,
  seat_contract_state,
  map_boundary,
  access_boundary,
  deliverables,
  seat_hold_notice
) values
(
  'map_contract_pre_deployment',
  'pre_deployment',
  'eval_result_01',
  '["eval_result_01"]'::jsonb,
  'Pre-Deployment MAP the Environment',
  3333,
  'usd',
  'prod_UfT3Fg1cmsBvE5',
  null,
  'stripe',
  'map_the_environment',
  false,
  false,
  false,
  'held_until_map_complete',
  'MAP the Environment reviews, identifies, and recommends. MAP does not implement system changes, issue Registry Certification, establish SEAT standing, activate c3 Field Optics, or determine the final SEAT Contract before the audit is complete. A full SEAT Contract may be generated only after MAP the Environment is complete.',
  'Full MAP evaluation requires sufficient access to the runtime and AI-influenced surfaces being reviewed. Access may be read-only, guided, screen-shared, exported, documented, or AI-assisted. Sensitive credentials, confidential contents, regulated records, or private client data are not transferred unless separately authorized and governed.',
  '["Environmental inventory and authority surface review","AI deployment readiness assessment","Structural alignment recommendations","Governed pre-deployment pathway definition"]'::jsonb,
  'A full SEAT Contract may be generated only after MAP the Environment is complete.'
),
(
  'map_contract_optimization',
  'optimization',
  'eval_result_02',
  '["eval_result_02"]'::jsonb,
  'Optimization MAP the Environment',
  7777,
  'usd',
  'prod_UfT8GJn8S6tusF',
  null,
  'stripe',
  'map_the_environment',
  false,
  false,
  false,
  'held_until_map_complete',
  'MAP the Environment reviews, identifies, and recommends. MAP does not implement system changes, issue Registry Certification, establish SEAT standing, activate c3 Field Optics, or determine the final SEAT Contract before the audit is complete. A full SEAT Contract may be generated only after MAP the Environment is complete.',
  'Full MAP evaluation requires sufficient access to the runtime and AI-influenced surfaces being reviewed. Access may be read-only, guided, screen-shared, exported, documented, or AI-assisted. Sensitive credentials, confidential contents, regulated records, or private client data are not transferred unless separately authorized and governed.',
  '["Operational fragmentation analysis","Role and process clarity review","AI governance gap identification","Structured optimization pathway recommendations"]'::jsonb,
  'A full SEAT Contract may be generated only after MAP the Environment is complete.'
),
(
  'map_contract_remediation',
  'remediation',
  'eval_result_03',
  '["eval_result_03","eval_result_04"]'::jsonb,
  'Remediation MAP the Environment',
  9999,
  'usd',
  'prod_UfTFCWo6OPmbbt',
  null,
  'stripe',
  'map_the_environment',
  false,
  false,
  false,
  'held_until_map_complete',
  'MAP the Environment reviews, identifies, and recommends. MAP does not implement system changes, issue Registry Certification, establish SEAT standing, activate c3 Field Optics, or determine the final SEAT Contract before the audit is complete. A full SEAT Contract may be generated only after MAP the Environment is complete.',
  'Full MAP evaluation requires sufficient access to the runtime and AI-influenced surfaces being reviewed. Access may be read-only, guided, screen-shared, exported, documented, or AI-assisted. Sensitive credentials, confidential contents, regulated records, or private client data are not transferred unless separately authorized and governed.',
  '["Multi-condition structural drift analysis","Authority map reconstruction","Runtime governance boundary review","Remediation pathway definition and prioritization","Post-audit SEAT Contract preparation scope"]'::jsonb,
  'A full SEAT Contract may be generated only after MAP the Environment is complete.'
)
on conflict (contract_key) do nothing;

-- ============================================================
-- TABLE: map_payment_events
-- Payment event log — webhook-confirmed authority only.
-- payment_status = 'paid' only after Stripe webhook verifies.
-- scheduling_state = 'released' only after payment_status = 'paid'.
-- ============================================================
create table if not exists public.map_payment_events (
  map_order_id                uuid primary key default gen_random_uuid(),
  evaluation_result_id        text,
  map_standing                text not null,
  map_circuit_key             text not null,
  contract_key                text references public.map_commerce_contracts(contract_key),
  contact_email               text not null,
  stripe_checkout_session_id  text,
  stripe_payment_intent_id    text,
  payment_status              text not null default 'pending'
    check (payment_status in ('pending', 'checkout_created', 'paid', 'failed', 'expired')),
  amount_paid                 integer,
  currency                    text,
  paid_at                     timestamptz,
  webhook_event_id            text,
  oar_state                   text not null default 'pending',
  scheduling_state            text not null default 'held'
    check (scheduling_state in ('held', 'released')),
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index if not exists map_payment_events_email_idx
  on public.map_payment_events(contact_email);

create index if not exists map_payment_events_session_idx
  on public.map_payment_events(stripe_checkout_session_id);

create index if not exists map_payment_events_status_idx
  on public.map_payment_events(payment_status);

-- ============================================================
-- updated_at triggers
-- ============================================================
create or replace function public.map_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists map_commerce_contracts_updated_at on public.map_commerce_contracts;
create trigger map_commerce_contracts_updated_at
before update on public.map_commerce_contracts
for each row execute function public.map_set_updated_at();

drop trigger if exists map_payment_events_updated_at on public.map_payment_events;
create trigger map_payment_events_updated_at
before update on public.map_payment_events
for each row execute function public.map_set_updated_at();

-- ============================================================
-- RLS
-- ============================================================
alter table public.map_commerce_contracts enable row level security;
alter table public.map_payment_events     enable row level security;

drop policy if exists "map_commerce_contracts_public_read" on public.map_commerce_contracts;
create policy "map_commerce_contracts_public_read"
on public.map_commerce_contracts for select
to anon, authenticated
using (release_state = 'active');

drop policy if exists "map_payment_events_service_write" on public.map_payment_events;
create policy "map_payment_events_service_write"
on public.map_payment_events for all
to service_role
using (true)
with check (true);

drop policy if exists "map_payment_events_owner_read" on public.map_payment_events;
create policy "map_payment_events_owner_read"
on public.map_payment_events for select
to anon, authenticated
using (payment_status = 'paid' and scheduling_state = 'released');

-- ============================================================
-- Obsidian surface media map entries
-- Route 1: Bind registered media map entries to Obsidian surfaces.
-- Bucket: measures-registry
-- campaign_key: agents_of_chaos_integrity_governance
-- Rules: no media-owned copy, no CTA, no routing authority.
-- ============================================================
insert into public.measures_media_map (
  id,
  registry_key,
  encounter_key,
  campaign_key,
  media_role,
  storage_bucket,
  storage_path,
  mime_type,
  sort_order,
  is_active,
  metadata,
  created_at,
  updated_at
) values
(
  gen_random_uuid(),
  'measures_registry_landing',
  'obsidian_contact_capture',
  'agents_of_chaos_integrity_governance',
  'obsidian_contact_surface_visual',
  'measures-registry',
  'obsidian_contact_surface_visual_v1.webp',
  'image/webp',
  10,
  true,
  '{"surface_role":"obsidian_contact_capture","media_boundary":"no_copy_no_cta_no_routing"}'::jsonb,
  now(),
  now()
),
(
  gen_random_uuid(),
  'measures_registry_landing',
  'obsidian_ai_operations_assessment',
  'agents_of_chaos_integrity_governance',
  'obsidian_assessment_surface_visual',
  'measures-registry',
  'obsidian_assessment_surface_visual_v1.webp',
  'image/webp',
  11,
  true,
  '{"surface_role":"obsidian_ai_operations_assessment","media_boundary":"no_copy_no_cta_no_routing"}'::jsonb,
  now(),
  now()
),
(
  gen_random_uuid(),
  'measures_registry_landing',
  'obsidian_eval_result',
  'agents_of_chaos_integrity_governance',
  'obsidian_eval_result_surface_visual',
  'measures-registry',
  'obsidian_eval_result_surface_visual_v1.webp',
  'image/webp',
  12,
  true,
  '{"surface_role":"obsidian_eval_result","media_boundary":"no_copy_no_cta_no_routing"}'::jsonb,
  now(),
  now()
);
