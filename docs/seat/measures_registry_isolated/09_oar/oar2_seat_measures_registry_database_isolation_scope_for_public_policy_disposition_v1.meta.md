---
document_type: oar2
authority_level: proposed
system_scope: measures_codex
title: OAR2 - Seat Measures Registry Database Isolation Scope for Public Policy Disposition v1
status: proposed
version: v1
operator: op044
priority: critical_security_preflight
source_oar1:
  - docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md
mutation_scope:
  runtime: false
  database: true
  policies: false
  rls_for_new_isolation_table: true
  rows: true
  routes: false
  renderer: false
  public_copy: false
  docs_created: true
  docs_updated: false
  docs_deleted: false
---

# OAR2 - Seat Measures Registry Database Isolation Scope for Public Policy Disposition v1

## OBSERVED

The Measures Registry policy scope has been isolated in documentation only.

The prior OAR1 produced a current policy-scope map:

- current_measures_registry_runtime: 7
- current_measures_registry_public_write: 2
- protected_c3_system: 19
- protected_measures_of_inanna: 3
- held_future_scope: 1
- unknown_requires_operator_review: 0

The same OAR1 confirmed no database mutation occurred:

- database_mutation: false
- policy_mutation: false
- RLS_mutation: false
- row_mutation: false
- DB_contents_registered: false

Therefore, database isolation has not yet occurred.

Current need:

Seat the Measures Registry public policy isolation scope in Codex / database so future policy disposition can read DB-held scope instead of relying on documentation-only classification.

## ALIGNED

This OAR2 authorizes database isolation scope seating only.

It may:

- create a dedicated database table for policy scope isolation if no suitable table exists
- enable RLS on that new isolation table
- insert or upsert the current isolation scope rows as a grouped set
- perform DB readback
- write OAR1 evidence

It may not:

- drop existing policies
- alter existing policies
- create public access policies
- mutate existing renderer tables
- mutate runtime
- mutate routes
- mutate renderer
- mutate public copy
- activate launch
- activate payment
- claim SEAT completion
- claim SEAL standing
- claim Registry Standing
- assign c3 Key
- activate DAO participation

Authority remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

## ROUTED

## 1. Preflight

Before database mutation, confirm the source OAR1 exists:

docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md

Confirm it contains:

- current Measures Registry runtime table list
- current public write candidate table list
- protected c3 system table list
- protected Measures of Inanna / exhibition table list
- safe_for_policy_mutation: false

If source OAR1 is missing, stop and write blocker OAR1.

## 2. Create database isolation table if missing

Create table only if it does not already exist.

SQL:

    create table if not exists public.measures_registry_policy_scope_isolation (
      id uuid primary key default gen_random_uuid(),
      table_schema text not null default 'public',
      table_name text not null,
      isolation_scope text not null,
      renderer_required boolean not null default false,
      current_launch_required boolean not null default false,
      anon_read_required boolean not null default false,
      anon_write_required boolean not null default false,
      direct_anon_write_safe_now boolean not null default false,
      edge_function_preferred boolean not null default false,
      policy_mutation_scope_allowed boolean not null default false,
      protected_scope boolean not null default false,
      held_scope boolean not null default false,
      requires_separate_review boolean not null default false,
      source_oar1 text not null,
      notes text,
      active boolean not null default true,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      unique (table_schema, table_name)
    );

Enable RLS on the isolation table:

    alter table public.measures_registry_policy_scope_isolation enable row level security;

Do not create anon/public read policy.

Do not create anon/public write policy.

This isolation table is Codex-side governance evidence, not public renderer content.

## 3. Insert grouped isolation scope rows

Insert or upsert all rows as one grouped isolation set.

Use source_oar1:

docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md

SQL:

    insert into public.measures_registry_policy_scope_isolation (
      table_schema,
      table_name,
      isolation_scope,
      renderer_required,
      current_launch_required,
      anon_read_required,
      anon_write_required,
      direct_anon_write_safe_now,
      edge_function_preferred,
      policy_mutation_scope_allowed,
      protected_scope,
      held_scope,
      requires_separate_review,
      source_oar1,
      notes,
      active
    )
    values
      ('public','measures_registry','current_measures_registry_runtime',true,true,true,false,false,false,true,false,false,false,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Renderer-required Measures Registry runtime table. Public read policy may be narrowed after exact catalog readback.',true),
      ('public','measures_encounter_def','current_measures_registry_runtime',true,true,true,false,false,false,true,false,false,false,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Renderer-required encounter definition table. Public read policy may be narrowed after exact catalog readback.',true),
      ('public','measures_media_map','current_measures_registry_runtime',true,true,true,false,false,false,true,false,false,false,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Renderer-required media map table. Public read policy may be narrowed after exact catalog readback.',true),
      ('public','measures_design_token','current_measures_registry_runtime',true,true,true,false,false,false,true,false,false,false,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Renderer-required design token table. Public read policy may be narrowed after exact catalog readback.',true),
      ('public','measures_publication_registry','current_measures_registry_runtime',true,true,true,false,false,false,true,false,false,false,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Renderer-required publication registry table. Keep only if already narrow or narrow after catalog readback.',true),
      ('public','measures_publication_dispatch','current_measures_registry_runtime',true,true,true,false,false,false,true,false,false,false,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Renderer-required publication dispatch table. Keep only if already narrow or narrow after catalog readback.',true),
      ('public','map_commerce_contracts','current_measures_registry_runtime',true,true,true,false,false,false,true,false,false,false,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Renderer-required MAP commerce contract table. Public read policy must not imply payment, SEAT, SEAL, c3 Key, DAO, Branch, or Registry Standing.',true),

      ('public','measures_iis_eval_gate1_capture','current_measures_registry_public_write',false,true,false,true,false,true,true,false,false,false,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','AI Operations Assessment public capture candidate. Direct anon write not safe now. Edge/function boundary preferred.',true),
      ('public','measures_publication_subscription_capture','current_measures_registry_public_write',false,true,false,true,false,true,true,false,false,false,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Publication subscription capture candidate. Direct anon write not safe now. Edge/function boundary preferred.',true),

      ('public','codex_connect_capture','protected_measures_of_inanna',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Measures of Inanna connect capture. Not current Measures Registry launch scope.',true),
      ('public','measures_seat_hold_capture','held_future_scope',false,false,false,false,false,false,false,false,true,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Seat hold capture remains held until future payment or seat-hold authority is seated.',true),

      ('public','c3_ai_action_boundary','protected_c3_system',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Protected c3 system table. Requires separate seeded reference review.',true),
      ('public','c3_attachment_law','protected_c3_system',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Protected c3 system table. Requires separate seeded reference review.',true),
      ('public','c3_canopy_law','protected_c3_system',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Protected c3 system table. Requires separate seeded reference review.',true),
      ('public','c3_chamber_directory_binding','protected_c3_system',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Protected c3 system table. Requires separate seeded reference review.',true),
      ('public','c3_correction_contract','protected_c3_system',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Protected c3 system table. Requires separate seeded reference review.',true),
      ('public','c3_evidence_contract','protected_c3_system',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Protected c3 system table. Requires separate seeded reference review.',true),
      ('public','c3_oar_process_instance','protected_c3_system',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Protected c3 OAR process table. Requires separate seeded reference review.',true),
      ('public','c3_oar_seeded_reference','protected_c3_system',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Protected c3 seeded reference table. Requires separate seeded reference review.',true),
      ('public','c3_oar_transition_event','protected_c3_system',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Protected c3 OAR transition table. Requires separate seeded reference review.',true),
      ('public','c3_optics_contract','protected_c3_system',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Protected c3 optics table. Requires separate seeded reference review.',true),
      ('public','c3_orphaned_surface_registry','protected_c3_system',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Protected c3 system table. Requires separate seeded reference review.',true),
      ('public','c3_passage_law','protected_c3_system',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Protected c3 passage law table. Requires separate seeded reference review.',true),
      ('public','c3_public_semantic_pairing','protected_c3_system',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Protected c3 semantic pairing table. Requires separate seeded reference review.',true),
      ('public','c3_registered_system','protected_c3_system',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Protected c3 registered system table. Requires separate seeded reference review.',true),
      ('public','c3_role_contract','protected_c3_system',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Protected c3 role contract table. Requires separate seeded reference review.',true),
      ('public','c3_runtime_admission_binding','protected_c3_system',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Protected c3 runtime admission binding table. Requires separate seeded reference review.',true),
      ('public','c3_runtime_admission_contract','protected_c3_system',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Protected c3 runtime admission contract table. Requires separate seeded reference review.',true),
      ('public','c3_signal_law','protected_c3_system',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Protected c3 signal law table. Requires separate seeded reference review.',true),
      ('public','c3_trace_contract','protected_c3_system',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Protected c3 trace contract table. Requires separate seeded reference review.',true),

      ('public','measures_encounter_view_history','protected_measures_of_inanna',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Measures of Inanna / exhibition table. Not current Measures Registry launch scope.',true),
      ('public','temp_exhibition_media','protected_measures_of_inanna',false,false,false,false,false,false,false,true,false,true,'docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md','Temporary exhibition media table. Not current Measures Registry launch scope.',true)
    on conflict (table_schema, table_name)
    do update set
      isolation_scope = excluded.isolation_scope,
      renderer_required = excluded.renderer_required,
      current_launch_required = excluded.current_launch_required,
      anon_read_required = excluded.anon_read_required,
      anon_write_required = excluded.anon_write_required,
      direct_anon_write_safe_now = excluded.direct_anon_write_safe_now,
      edge_function_preferred = excluded.edge_function_preferred,
      policy_mutation_scope_allowed = excluded.policy_mutation_scope_allowed,
      protected_scope = excluded.protected_scope,
      held_scope = excluded.held_scope,
      requires_separate_review = excluded.requires_separate_review,
      source_oar1 = excluded.source_oar1,
      notes = excluded.notes,
      active = excluded.active,
      updated_at = now();

## 4. Required readback

Run:

    select
      table_schema,
      table_name,
      isolation_scope,
      renderer_required,
      current_launch_required,
      anon_read_required,
      anon_write_required,
      direct_anon_write_safe_now,
      edge_function_preferred,
      policy_mutation_scope_allowed,
      protected_scope,
      held_scope,
      requires_separate_review,
      active
    from public.measures_registry_policy_scope_isolation
    where active = true
    order by isolation_scope, table_name;

Run summary:

    select
      isolation_scope,
      count(*) as table_count
    from public.measures_registry_policy_scope_isolation
    where active = true
    group by isolation_scope
    order by isolation_scope;

Run public policy check for the isolation table:

    select
      schemaname,
      tablename,
      policyname,
      roles,
      cmd,
      qual,
      with_check
    from pg_policies
    where schemaname = 'public'
      and tablename = 'measures_registry_policy_scope_isolation'
    order by policyname;

Expected:

- RLS enabled on isolation table
- no anon/public policies created
- grouped rows inserted/upserted
- readback count matches expected scope

## 5. Create evidence document

Create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_database_policy_scope_isolation_readback_v1.meta.md

Include:

standing:
  status: database_isolation_scope_seated
  mutation_authorized: true
  policy_mutation_authorized: false
  db_row_mutation_authorized: true
  runtime_activation_authorized: false

required_sections:
  - source_oar1_check
  - table_create_or_exists_result
  - RLS_enabled_result
  - inserted_or_upserted_rows
  - readback_rows
  - summary_counts
  - isolation_table_policy_readback
  - anon_public_policy_created_false
  - protected_scope_confirmation
  - current_scope_confirmation
  - next_safe_oar2

## 6. No policy mutation boundary

Do not:

- drop existing policies
- create public policies
- alter existing policies
- change RLS on existing application tables
- insert rows into renderer tables
- update rows in renderer tables
- delete rows from renderer tables
- mutate runtime
- mutate routes
- mutate renderer
- mutate public copy
- activate launch
- activate payment
- claim standing
- register launch contents

## VALIDATION RETURN

Return:

- OAR2 path
- database isolation evidence path
- isolation table name
- table created or existed
- RLS enabled on isolation table
- rows inserted or upserted
- readback row count
- summary counts by isolation scope
- isolation table public policy count
- no existing policy mutation confirmation
- no renderer table row mutation confirmation
- no runtime mutation confirmation
- no route mutation confirmation
- no renderer mutation confirmation
- no public copy mutation confirmation
- OAR1 path

## OAR1 CLOSEOUT

Create OAR1:

docs/seat/measures_registry_isolated/09_oar/oar1_seat_measures_registry_database_isolation_scope_for_public_policy_disposition_v1.meta.md

OAR1 must report:

- OAR2 path
- database isolation evidence path
- isolation table name
- source OAR1 verified
- table created or existed
- RLS enabled on isolation table
- rows inserted or upserted
- readback row count
- summary counts by isolation scope
- isolation table policy readback
- no anon/public policy created confirmation
- no existing policy mutation confirmation
- no renderer table row mutation confirmation
- no runtime mutation confirmation
- no route mutation confirmation
- no renderer mutation confirmation
- no public copy mutation confirmation
- recommended next OAR2 title

Recommended next OAR2:

OAR2 - Resolve Exact Live Catalog Row Return for Supabase Policy Disposition Review v1

## CLOSE

This OAR2 seats the Measures Registry policy scope isolation map in the database.

It does not mutate application policies.

It does not activate runtime.

It does not insert launch contents.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody seats isolation and writes evidence.
