-- Source Reference Precedence Classification v1
-- Authorized by docs/oar/source_reference/oar2_source_reference_precedence_expansion_classification_v1.meta.md
-- Boundary: draft only. Do not execute without separate OAR2 execution authorization.

create or replace view public.v_codex_source_seeded_precedence as
select
  sr.id as source_reference_id,
  sr.source_key,
  sr.source_title,
  sr.source_type,
  sr.authority_level,
  sr.source_status,
  sr.readonly,
  sr.seeded_at,
  case
    when sr.source_key = 'seed_concordance' then 1
    when sr.source_key = 'system_concordance' then 1
    when sr.source_type = 'concordance' and sr.authority_level = 'system' then 1
    when sr.source_type = 'foundational_source' then 2
    when sr.source_type = 'process_constraints' then 3
    when sr.source_key in ('seeded_reference_control', 'oar_lifecycle') then 4
    when sr.source_key like 'oar1_%' then 5
    when sr.source_key like 'oar2_%' then 6
    when sr.source_type = 'oar' then 6
    when sr.source_type = 'process_rule' then 7
    when sr.source_type = 'implementation_manifest' then 8
    when sr.source_type = 'role_contract' then 9
    when sr.source_type = 'verification_checklist' then 10
    when sr.source_type in ('schema_draft', 'migration_candidate') then 99
    else 90
  end as precedence_rank,
  case
    when sr.source_key = 'seed_concordance' then 'Seed Concordance'
    when sr.source_key = 'system_concordance' then 'System Concordance'
    when sr.source_type = 'concordance' and sr.authority_level = 'system' then 'System authority concordance'
    when sr.source_type = 'foundational_source' then 'Foundational source'
    when sr.source_type = 'process_constraints' then 'Process constraints'
    when sr.source_key in ('seeded_reference_control', 'oar_lifecycle') then 'Seeded lifecycle and source-control rules'
    when sr.source_key like 'oar1_%' then 'Completed OAR1 records'
    when sr.source_key like 'oar2_%' then 'Working OAR2 records'
    when sr.source_type = 'oar' then 'Working OAR records'
    when sr.source_type = 'process_rule' then 'Process rules'
    when sr.source_type = 'implementation_manifest' then 'Implementation manifests'
    when sr.source_type = 'role_contract' then 'Role contracts'
    when sr.source_type = 'verification_checklist' then 'Verification checklists'
    when sr.source_type in ('schema_draft', 'migration_candidate') then 'Schema drafts and migration candidates'
    else 'Unranked seeded source'
  end as precedence_label
from public.codex_source_reference sr
where sr.source_status = 'seeded';
