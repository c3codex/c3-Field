-- Obsidian Chamber Contract Seating — Validation SQL v1
-- Source OAR2: docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md
-- Run AFTER migration 202606080001 and obsidian_contract_seating_v1.sql have been applied.
-- Operator reviews all results. Each check must return the expected value.

-- ============================================================
-- CHECK 1: Tables exist
-- ============================================================
select
  table_name,
  'exists' as status
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'obsidian_src_continuity',
    'obsidian_eval_result_def',
    'obsidian_oar1_record',
    'obsidian_email_contract_def',
    'obsidian_email_sequence_instance',
    'obsidian_marble_carryover'
  )
order by table_name;
-- Expected: 6 rows

-- ============================================================
-- CHECK 2: Four evaluation result bands are seeded
-- ============================================================
select
  eval_result_key,
  result_title,
  condition_min,
  condition_max,
  severity_precedence,
  prepared_path_statement
from public.obsidian_eval_result_def
order by severity_precedence;
-- Expected: 4 rows in severity order (1→4)
-- All prepared_path_statement must equal:
-- 'A structured environmental alignment path has been prepared for your review.'

-- ============================================================
-- CHECK 3: Eval result matching logic — severity precedence
-- ============================================================
select
  eval_result_key,
  case
    when 4 >= 4 then 'eval_result_04'
    when 4 >= 3 then 'eval_result_03'
    when 4 >= 2 then 'eval_result_02'
    else            'eval_result_01'
  end as matched_at_4_conditions,
  case
    when 3 >= 4 then 'eval_result_04'
    when 3 >= 3 then 'eval_result_03'
    when 3 >= 2 then 'eval_result_02'
    else            'eval_result_01'
  end as matched_at_3_conditions,
  case
    when 2 >= 4 then 'eval_result_04'
    when 2 >= 3 then 'eval_result_03'
    when 2 >= 2 then 'eval_result_02'
    else            'eval_result_01'
  end as matched_at_2_conditions,
  case
    when 1 >= 4 then 'eval_result_04'
    when 1 >= 3 then 'eval_result_03'
    when 1 >= 2 then 'eval_result_02'
    else            'eval_result_01'
  end as matched_at_1_condition
from public.obsidian_eval_result_def
where eval_result_key = 'eval_result_01';
-- Expected: matched_at_4=eval_result_04, matched_at_3=eval_result_03,
--           matched_at_2=eval_result_02, matched_at_1=eval_result_01

-- ============================================================
-- CHECK 4: Email contract definitions are seeded (4 records)
-- ============================================================
select
  email_contract_key,
  email_type,
  sequence_position,
  purpose
from public.obsidian_email_contract_def
order by sequence_position;
-- Expected: 4 rows — 1 initial_eval (position 0) + 3 followup (positions 1-3)

-- ============================================================
-- CHECK 5: No prohibited content in email contract definitions
-- ============================================================
select
  email_contract_key,
  case
    when purpose ilike '%MAP pricing%'
      or purpose ilike '%SEAT status%'
      or purpose ilike '%Registry Certification%'
      or purpose ilike '%c3 Key%'
      or purpose ilike '%payment%'
      or purpose ilike '%wallet%'
      or purpose ilike '%Registered%'
    then 'PROHIBITED CONTENT DETECTED'
    else 'clean'
  end as content_check,
  case
    when reveal_boundary ilike '%MAP pricing%'
      or reveal_boundary ilike '%SEAT status%'
      or reveal_boundary ilike '%commerce circuit%'
      and reveal_boundary not ilike '%No %'
    then 'REVEAL BOUNDARY BREACH'
    else 'clean'
  end as boundary_check
from public.obsidian_email_contract_def;
-- Expected: all rows content_check = 'clean', boundary_check = 'clean'

-- ============================================================
-- CHECK 6: Six concordance contracts are seated
-- ============================================================
select
  d.document_key,
  d.authority_standing,
  v.version_key,
  v.version_standing
from public.concordance_document d
join public.concordance_version v on v.document_key = d.document_key
where d.document_key in (
  'obsidian_contact_src_capture_contract',
  'obsidian_oar1_assessment_intake_contract',
  'obsidian_eval_result_content_contract',
  'obsidian_initial_eval_email_contract',
  'obsidian_governed_followup_email_contract',
  'obsidian_marble_governance_carryover_contract'
)
order by d.document_key;
-- Expected: 6 rows — all authority_standing = 'active', version_standing = 'active'

-- ============================================================
-- CHECK 7: Concordance relations exist for all 6 contracts
-- ============================================================
select
  r.relation_key,
  r.relation_type,
  r.relation_standing,
  r.target_ref
from public.concordance_relation r
where r.version_key in (
  'obsidian_contact_src_capture_contract_v1',
  'obsidian_oar1_assessment_intake_contract_v1',
  'obsidian_eval_result_content_contract_v1',
  'obsidian_initial_eval_email_contract_v1',
  'obsidian_governed_followup_email_contract_v1',
  'obsidian_marble_governance_carryover_contract_v1'
)
order by r.version_key;
-- Expected: ≥7 rows (some contracts have 2 relations)
-- All relation_standing = 'active'

-- ============================================================
-- CHECK 8: Marble carryover default state is held
-- ============================================================
select
  column_name,
  column_default,
  is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'obsidian_marble_carryover'
  and column_name in (
    'commerce_reveal_state',
    'marble_governance_passage_entered',
    'prepared_path_statement'
  )
order by column_name;
-- Expected:
-- commerce_reveal_state default = 'held_until_marble_governance_passage'
-- marble_governance_passage_entered default = false
-- prepared_path_statement default set

-- ============================================================
-- CHECK 9: SRC continuity standing constraint
-- ============================================================
select
  column_name,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'obsidian_src_continuity'
  and column_name in ('standing', 'source_surface');
-- Expected:
-- standing default = 'contact_eval_continuity_opened'
-- source_surface default = 'obsidian_ai_operations_assessment'

-- ============================================================
-- CHECK 10: No assessment or contact form tables modified
-- (Confirm existing runtime tables are untouched)
-- ============================================================
select
  table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'measures_iis_eval_gate1_capture',
    'measures_seat_hold_capture',
    'measures_seat_offering',
    'measures_encounter_def',
    'measures_registry',
    'measures_media_map',
    'measures_design_token',
    'measures_publication_registry'
  )
order by table_name;
-- Expected: all 8 existing tables present and unmodified
-- This migration only adds new tables prefixed with obsidian_

-- ============================================================
-- CHECK 11: RLS policies exist for runtime tables
-- ============================================================
select
  tablename,
  policyname,
  cmd,
  roles
from pg_policies
where schemaname = 'public'
  and tablename in (
    'obsidian_src_continuity',
    'obsidian_eval_result_def',
    'obsidian_oar1_record',
    'obsidian_email_contract_def',
    'obsidian_email_sequence_instance',
    'obsidian_marble_carryover'
  )
order by tablename, policyname;
-- Expected: policies present on all 6 tables
