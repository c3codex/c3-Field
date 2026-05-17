-- Concordance Authority Validation Queries Draft v1
-- Source OAR2: docs/oar/c3_field/oar2_concordance_authority_sql_migration_draft_v1.meta.md
-- DRAFT ONLY. Run only under a separately routed execution/validation OAR2.

-- Schema existence.
select to_regclass('public.concordance_document') as concordance_document;
select to_regclass('public.concordance_version') as concordance_version;
select to_regclass('public.concordance_term') as concordance_term;
select to_regclass('public.concordance_relation') as concordance_relation;
select to_regclass('public.seeded_source_snapshot') as seeded_source_snapshot;

-- Constraint/index posture.
select
  conrelid::regclass as table_name,
  conname as constraint_name,
  contype as constraint_type
from pg_constraint
where conrelid in (
  'public.concordance_document'::regclass,
  'public.concordance_version'::regclass,
  'public.concordance_term'::regclass,
  'public.concordance_relation'::regclass,
  'public.seeded_source_snapshot'::regclass
)
order by table_name::text, constraint_name;

select
  schemaname,
  tablename,
  indexname,
  indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in (
    'concordance_document',
    'concordance_version',
    'concordance_term',
    'concordance_relation',
    'seeded_source_snapshot'
  )
order by tablename, indexname;

-- RLS posture.
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'concordance_document',
    'concordance_version',
    'concordance_term',
    'concordance_relation',
    'seeded_source_snapshot'
  )
order by tablename;

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
  and tablename in (
    'concordance_document',
    'concordance_version',
    'concordance_term',
    'concordance_relation',
    'seeded_source_snapshot'
  )
order by tablename, policyname;

-- Append protection triggers.
select
  event_object_table,
  trigger_name,
  action_timing,
  event_manipulation
from information_schema.triggers
where event_object_schema = 'public'
  and event_object_table in (
    'concordance_version',
    'concordance_term',
    'concordance_relation',
    'seeded_source_snapshot'
  )
order by event_object_table, trigger_name, event_manipulation;

-- Active version uniqueness.
select
  indexname,
  indexdef
from pg_indexes
where schemaname = 'public'
  and tablename = 'concordance_version'
  and indexname = 'concordance_version_one_active_per_document_idx';

select document_key, count(*) as active_version_count
from public.concordance_version
where version_standing = 'active'
group by document_key
having count(*) > 1;

-- Relation scope support.
select column_name, data_type, column_default, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'concordance_relation'
  and column_name = 'relation_scope';

select relation_scope, count(*)
from public.concordance_relation
group by relation_scope
order by relation_scope;

-- Visibility/access standing support.
select table_name, column_name, data_type, column_default, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name in (
    'concordance_document',
    'concordance_version',
    'concordance_term',
    'concordance_relation',
    'seeded_source_snapshot'
  )
  and column_name = 'visibility_standing'
order by table_name;

select 'concordance_document' as table_name, visibility_standing, count(*)
from public.concordance_document
group by visibility_standing
union all
select 'concordance_version' as table_name, visibility_standing, count(*)
from public.concordance_version
group by visibility_standing
union all
select 'concordance_term' as table_name, visibility_standing, count(*)
from public.concordance_term
group by visibility_standing
union all
select 'concordance_relation' as table_name, visibility_standing, count(*)
from public.concordance_relation
group by visibility_standing
union all
select 'seeded_source_snapshot' as table_name, visibility_standing, count(*)
from public.seeded_source_snapshot
group by visibility_standing
order by table_name, visibility_standing;

-- updated_at and timestamp immutability trigger presence.
select
  event_object_table,
  trigger_name,
  action_timing,
  event_manipulation
from information_schema.triggers
where event_object_schema = 'public'
  and trigger_name in (
    'concordance_document_updated_at',
    'concordance_version_updated_at',
    'concordance_term_updated_at',
    'concordance_version_recognized_at_immutable',
    'seeded_source_snapshot_verified_at_immutable'
  )
order by event_object_table, trigger_name, event_manipulation;

-- Seed Concordance v1 authority seating checks.
select *
from public.concordance_document
where document_key = 'seed_concordance';

select *
from public.concordance_version
where version_key = 'seed_concordance_v1'
   or (document_key = 'seed_concordance' and version_label = 'v1');

select term_label, count(*)
from public.concordance_term
where version_key = 'seed_concordance_v1'
group by term_label
having count(*) > 1;

select term_key, term_label, term_standing
from public.concordance_term
where version_key = 'seed_concordance_v1'
  and term_label in ('TREE', 'c3 Boundary');

select relation_type, count(*)
from public.concordance_relation
where version_key = 'seed_concordance_v1'
group by relation_type
order by relation_type;

select *
from public.seeded_source_snapshot
where version_key = 'seed_concordance_v1'
  and source_sha256 = '9c47e162a7b72eb32b09c78f3838a0198f996178cd49b5e20ae9c0685d42fc3a';

-- Public exposure guards.
select count(*) as non_public_or_non_active_documents
from public.concordance_document
where authority_standing <> 'active'
   or visibility_standing <> 'public';

select count(*) as non_public_or_non_active_terms
from public.concordance_term
where term_standing <> 'active'
   or visibility_standing <> 'public';

select count(*) as protected_terms_with_public_visibility
from public.concordance_term
where visibility_standing = 'public'
  and coalesce((metadata ->> 'protected')::boolean, false) = true;
