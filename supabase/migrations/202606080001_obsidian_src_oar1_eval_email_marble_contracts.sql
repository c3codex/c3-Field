-- Obsidian Chamber: SRC/OAR1/Eval/Email/Marble Contracts — Migration v1
-- Source OAR2: docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md
-- Operator executes through Supabase SQL Editor, CLI, or psql.
-- Claude does not claim execution of this migration.

-- ============================================================
-- TABLE: obsidian_src_continuity
-- SRC/SRC1 continuity record opened after contact capture.
-- Standing: contact_eval_continuity_opened only.
-- Not SEAT. Not MAP enrollment. Not certification. Not payment.
-- ============================================================
create table if not exists public.obsidian_src_continuity (
  src_key           uuid primary key default gen_random_uuid(),
  assessment_completion_key text not null,
  evaluation_result_key     text,
  institution_name          text not null,
  contact_name              text not null,
  contact_email             text not null,
  business_type             text,
  env_key                   text,
  source_surface            text not null default 'obsidian_ai_operations_assessment',
  standing                  text not null default 'contact_eval_continuity_opened'
    check (standing in ('contact_eval_continuity_opened')),
  created_at                timestamptz not null default now()
);

create index if not exists obsidian_src_continuity_assessment_idx
  on public.obsidian_src_continuity(assessment_completion_key);

create index if not exists obsidian_src_continuity_email_idx
  on public.obsidian_src_continuity(contact_email);

-- ============================================================
-- TABLE: obsidian_eval_result_def
-- Seeded evaluation result definitions — 4 bands.
-- Governed by condition count and severity precedence.
-- ============================================================
create table if not exists public.obsidian_eval_result_def (
  eval_result_key           text primary key,
  result_title              text not null,
  condition_min             int not null,
  condition_max             int not null,
  severity_precedence       int not null,
  summary_finding           text not null,
  top_3_critical_gaps       jsonb not null default '[]'::jsonb,
  likely_ai_drift_behaviors jsonb not null default '[]'::jsonb,
  content_intent            text not null,
  prepared_path_statement   text not null
    default 'A structured environmental alignment path has been prepared for your review.',
  created_at                timestamptz not null default now()
);

insert into public.obsidian_eval_result_def (
  eval_result_key,
  result_title,
  condition_min,
  condition_max,
  severity_precedence,
  summary_finding,
  top_3_critical_gaps,
  likely_ai_drift_behaviors,
  content_intent,
  prepared_path_statement
) values
(
  'eval_result_01',
  'Foundational Leadership Invitation',
  1, 2, 1,
  'The institution shows fewer identified system conditions than expected. This may indicate early operational alignment, limited AI exposure, or leadership awareness before AI drift becomes embedded.',
  '["source-of-truth authority", "AI/runtime surface inventory", "evidence and trace logging"]'::jsonb,
  '["early informal AI use", "unregistered experimentation", "policy lag before operational scaling", "leadership awareness ahead of system formalization"]'::jsonb,
  'The institution shows fewer identified system conditions than expected. This may indicate early operational alignment, limited AI exposure, or leadership awareness before AI drift becomes embedded.',
  'A structured environmental alignment path has been prepared for your review.'
),
(
  'eval_result_02',
  'Environmental Fragmentation',
  2, 4, 2,
  'The institution has useful operational pieces, but they are not yet held in one governed environment. AI use may be moving faster than role clarity, review pathways, and source-of-truth authority.',
  '["defined role map", "process and review pathways", "data/content authority map"]'::jsonb,
  '["teams using AI differently across functions", "unclear approval or review responsibility", "content/data copied between tools without trace", "manual workarounds becoming normal process"]'::jsonb,
  'The institution has useful operational pieces, but they are not yet held in one governed environment. AI use may be moving faster than role clarity, review pathways, and source-of-truth authority.',
  'A structured environmental alignment path has been prepared for your review.'
),
(
  'eval_result_03',
  'Environmental Instability',
  3, 5, 3,
  'The institution shows multiple active conditions that may already be affecting AI behavior, decision quality, accountability, or evidence formation. The system may still function, but its AI-facing environment is unstable.',
  '["decision authority map", "runtime governance rules", "automation boundary register"]'::jsonb,
  '["AI outputs entering workflows without consistent review", "decision authority unclear across teams or tools", "runtime surfaces expanding without governance rules", "evidence scattered across platforms, people, or vendors"]'::jsonb,
  'The institution shows multiple active conditions that may already be affecting AI behavior, decision quality, accountability, or evidence formation. The system may still function, but its AI-facing environment is unstable.',
  'A structured environmental alignment path has been prepared for your review.'
),
(
  'eval_result_04',
  'Structural Drift',
  4, 7, 4,
  'The institution shows enough identified system conditions to indicate active structural drift. AI behavior is likely being shaped by gaps in authority, runtime boundaries, access, review, evidence, or operational stack alignment.',
  '["source-of-truth authority", "access and permission model", "registered operational stack alignment"]'::jsonb,
  '["AI tools operating across unregistered authority surfaces", "automation occurring without clear permission boundaries", "outputs influencing decisions without traceable review", "multiple systems producing conflicting operational truth", "governance responsibility diffused across vendors, teams, or agents"]'::jsonb,
  'The institution shows enough identified system conditions to indicate active structural drift. AI behavior is likely being shaped by gaps in authority, runtime boundaries, access, review, evidence, or operational stack alignment.',
  'A structured environmental alignment path has been prepared for your review.'
)
on conflict (eval_result_key) do nothing;

-- ============================================================
-- TABLE: obsidian_oar1_record
-- OAR1 intake record per contact/SRC continuity.
-- Records Objective / Action / Result per OAR2 Section 4.
-- ============================================================
create table if not exists public.obsidian_oar1_record (
  oar1_key                  uuid primary key default gen_random_uuid(),
  assessment_completion_key text not null,
  evaluation_result_key     text,
  src_key                   uuid references public.obsidian_src_continuity(src_key),
  env_key                   text,
  contact_email             text not null,
  email_sequence_key        uuid,
  marble_carryover_key      uuid,
  objective                 text not null,
  action                    text not null,
  result                    text not null,
  created_at                timestamptz not null default now()
);

create index if not exists obsidian_oar1_record_src_idx
  on public.obsidian_oar1_record(src_key);

create index if not exists obsidian_oar1_record_email_idx
  on public.obsidian_oar1_record(contact_email);

-- ============================================================
-- TABLE: obsidian_email_contract_def
-- Seeded email contract definitions — initial + 3 followups.
-- Non-reveal boundary enforced: no MAP/SEAT/payment/circuit.
-- ============================================================
create table if not exists public.obsidian_email_contract_def (
  email_contract_key  text primary key,
  email_type          text not null check (email_type in ('initial_eval', 'followup')),
  sequence_position   int not null,
  purpose             text not null,
  reveal_boundary     text not null,
  created_at          timestamptz not null default now()
);

insert into public.obsidian_email_contract_def (
  email_contract_key,
  email_type,
  sequence_position,
  purpose,
  reveal_boundary
) values
(
  'obsidian_initial_eval_email',
  'initial_eval',
  0,
  'Deliver evaluation result to contact. Includes result title, summary finding, top 3 critical gaps, likely AI drift behaviors, answer-derived explanation, and prepared path statement. Trigger: contact_captured + evaluation_result_key exists.',
  'No MAP pricing, SEAT status, Registry Certification, Registered, Redacted, payment, wallet, c3 Key, or permission standing. No commerce circuit reveal.'
),
(
  'obsidian_eval_followup_01_structural_risk',
  'followup',
  1,
  'Reinforce the delivered evaluation. Explain why the identified system conditions matter. No circuit reveal.',
  'No MAP pricing, SEAT status, certification, payment, wallet, c3 Key, permission standing, or commerce circuit reveal.'
),
(
  'obsidian_eval_followup_02_alignment_path',
  'followup',
  2,
  'Introduce structured environmental alignment without revealing circuit, pricing, certification, payment, or SEAT standing.',
  'No MAP pricing, SEAT status, certification, payment, wallet, c3 Key, permission standing, or commerce circuit reveal.'
),
(
  'obsidian_eval_followup_03_review_prepared_path',
  'followup',
  3,
  'Invite review of the prepared path through Marble Governance Chamber passage.',
  'No MAP pricing, SEAT status, certification, payment, wallet, c3 Key, permission standing, or commerce circuit reveal.'
)
on conflict (email_contract_key) do nothing;

-- ============================================================
-- TABLE: obsidian_email_sequence_instance
-- Per-contact email sequence tracking record.
-- ============================================================
create table if not exists public.obsidian_email_sequence_instance (
  email_sequence_key          uuid primary key default gen_random_uuid(),
  src_key                     uuid references public.obsidian_src_continuity(src_key),
  oar1_key                    uuid,
  contact_email               text not null,
  evaluation_result_key       text,
  sequence_state              text not null default 'initial_pending'
    check (sequence_state in (
      'initial_pending',
      'initial_triggered',
      'followup_01_registered',
      'followup_02_registered',
      'followup_03_registered',
      'sequence_complete'
    )),
  initial_email_triggered_at  timestamptz,
  followup_01_registered_at   timestamptz,
  followup_02_registered_at   timestamptz,
  followup_03_registered_at   timestamptz,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index if not exists obsidian_email_sequence_src_idx
  on public.obsidian_email_sequence_instance(src_key);

create index if not exists obsidian_email_sequence_email_idx
  on public.obsidian_email_sequence_instance(contact_email);

-- ============================================================
-- TABLE: obsidian_marble_carryover
-- Per-contact Marble Governance carryover payload.
-- Commerce held until marble_governance_passage_entered = true.
-- ============================================================
create table if not exists public.obsidian_marble_carryover (
  marble_carryover_key        uuid primary key default gen_random_uuid(),
  assessment_completion_key   text not null,
  evaluation_result_key       text,
  src_key                     uuid references public.obsidian_src_continuity(src_key),
  env_key                     text,
  oar1_key                    uuid,
  email_sequence_key          uuid,
  hidden_marble_payload_key   text,
  commerce_reveal_state       text not null default 'held_until_marble_governance_passage'
    check (commerce_reveal_state in (
      'held_until_marble_governance_passage',
      'marble_governance_passage_entered',
      'revealed'
    )),
  marble_governance_passage_entered boolean not null default false,
  prepared_path_statement     text not null
    default 'A structured environmental alignment path has been prepared for your review.',
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index if not exists obsidian_marble_carryover_src_idx
  on public.obsidian_marble_carryover(src_key);

create index if not exists obsidian_marble_carryover_eval_result_idx
  on public.obsidian_marble_carryover(evaluation_result_key);

-- ============================================================
-- TRIGGER: updated_at maintenance
-- ============================================================
create or replace function public.obsidian_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists obsidian_email_sequence_set_updated_at
  on public.obsidian_email_sequence_instance;
create trigger obsidian_email_sequence_set_updated_at
before update on public.obsidian_email_sequence_instance
for each row execute function public.obsidian_set_updated_at();

drop trigger if exists obsidian_marble_carryover_set_updated_at
  on public.obsidian_marble_carryover;
create trigger obsidian_marble_carryover_set_updated_at
before update on public.obsidian_marble_carryover
for each row execute function public.obsidian_set_updated_at();

-- ============================================================
-- RLS: Row Level Security
-- ============================================================
alter table public.obsidian_src_continuity          enable row level security;
alter table public.obsidian_eval_result_def         enable row level security;
alter table public.obsidian_oar1_record             enable row level security;
alter table public.obsidian_email_contract_def      enable row level security;
alter table public.obsidian_email_sequence_instance enable row level security;
alter table public.obsidian_marble_carryover        enable row level security;

-- obsidian_eval_result_def and obsidian_email_contract_def are seeded read-only lookups
drop policy if exists "obsidian_eval_result_def_public_read" on public.obsidian_eval_result_def;
create policy "obsidian_eval_result_def_public_read"
on public.obsidian_eval_result_def for select
to anon, authenticated
using (true);

drop policy if exists "obsidian_email_contract_def_public_read" on public.obsidian_email_contract_def;
create policy "obsidian_email_contract_def_public_read"
on public.obsidian_email_contract_def for select
to anon, authenticated
using (true);

-- Runtime tables are service-role write, anon read restricted
drop policy if exists "obsidian_src_continuity_service_insert" on public.obsidian_src_continuity;
create policy "obsidian_src_continuity_service_insert"
on public.obsidian_src_continuity for insert
to service_role
with check (true);

drop policy if exists "obsidian_oar1_record_service_insert" on public.obsidian_oar1_record;
create policy "obsidian_oar1_record_service_insert"
on public.obsidian_oar1_record for insert
to service_role
with check (true);

drop policy if exists "obsidian_email_sequence_service_write" on public.obsidian_email_sequence_instance;
create policy "obsidian_email_sequence_service_write"
on public.obsidian_email_sequence_instance for all
to service_role
using (true)
with check (true);

drop policy if exists "obsidian_marble_carryover_service_write" on public.obsidian_marble_carryover;
create policy "obsidian_marble_carryover_service_write"
on public.obsidian_marble_carryover for all
to service_role
using (true)
with check (true);
