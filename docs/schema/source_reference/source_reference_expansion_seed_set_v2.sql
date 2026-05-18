-- Source Reference Expansion Seed Set v2
-- Authorized by docs/oar/source_reference/oar2_source_reference_expansion_seed_set_v2.meta.md
-- Boundary: seed only the approved v2 source references, bounded terms, logs, and relations.

with source_rows as (
  select *
  from (
    values
      (
        'thread_to_transfer_validation_rule',
        'Thread-to-Transfer Validation Rule',
        'process_rule',
        'working',
        'thread validation and transfer discipline',
        'v1',
        'docs/_source/process/thread_to_transfer_validation_rule.meta.md',
        '2e13bb03b5f13607214620b2de207099d65b43d137317f459de88f47b8c24081',
        '{"seed_oar_key":"oar2_source_reference_expansion_seed_set_v2","expansion_seed_set":"v2"}'::jsonb
      ),
      (
        'doc_set_closeout_rule',
        'Doc-Set Closeout Rule',
        'process_rule',
        'working',
        'doc set closeout discipline',
        'v1',
        'docs/_source/process/doc_set_closeout_rule.meta.md',
        '43a23899efb3bd275ed891b84c312b381d79abcdc98c96d4214f00bd7e2b5871',
        '{"seed_oar_key":"oar2_source_reference_expansion_seed_set_v2","expansion_seed_set":"v2"}'::jsonb
      ),
      (
        'doc_stack_constraints',
        'Doc Stack Constraints',
        'process_constraints',
        'working',
        'document stack constraints',
        'v1',
        'docs/_source/process/doc_stack_constraints.meta.md',
        '81b6d91ec1efeb36b8b4ac64d32748316644d7253237d2b4504cea13d7895569',
        '{"seed_oar_key":"oar2_source_reference_expansion_seed_set_v2","expansion_seed_set":"v2"}'::jsonb
      ),
      (
        'database_src_manifest',
        'DB to src Manifest - Measures of Inanna Exhibition',
        'implementation_manifest',
        'working',
        'database to frontend implementation boundary',
        'v1',
        'docs/_source/session_24/database_src_manifest.meta.md',
        '232a9b08909df4aa74d85c41b66528441ee031268bbda063e21e7a886bb50cb3',
        '{"seed_oar_key":"oar2_source_reference_expansion_seed_set_v2","expansion_seed_set":"v2"}'::jsonb
      ),
      (
        'session_13_db_preflight_verification_checklist',
        'Session 13 - DB Preflight Verification Checklist',
        'verification_checklist',
        'working',
        'database preflight verification checklist',
        'v1',
        'docs/_source/working/session_13/session_13_db_preflight_verification_checklist_v1.meta.md',
        'd04566f7300739d42e7b6eaa0c5939511d849f720f572aac6254728b9f62d129',
        '{"seed_oar_key":"oar2_source_reference_expansion_seed_set_v2","expansion_seed_set":"v2"}'::jsonb
      ),
      (
        'chazz_cody_development_role_contract',
        'Chazz x Cody Development Role Contract',
        'role_contract',
        'working',
        'development role boundary',
        'v1',
        'docs/_source/working/Chazz_sources/chazz_cody_development_role_contract.meta.md',
        '6bcec894af09c39e711bafc4d58b4e94dd536f233c2d8e4335328f51bebe5b07',
        '{"seed_oar_key":"oar2_source_reference_expansion_seed_set_v2","expansion_seed_set":"v2"}'::jsonb
      ),
      (
        'oar2_update_powershell_transfer_surface_rule',
        'OAR2 - Update PowerShell Transfer Surface Rule',
        'oar',
        'working',
        'PowerShell transfer surface correction',
        'v1',
        'docs/oar/process/oar2_update_powershell_transfer_surface_rule_v1.meta.md',
        '5cf7250e57b05d3b61fdffa97314d5c36ecce2c7a1d4362256bc4020287fb612',
        '{"seed_oar_key":"oar2_source_reference_expansion_seed_set_v2","expansion_seed_set":"v2"}'::jsonb
      )
  ) as rows(
    source_key,
    source_title,
    source_type,
    authority_level,
    source_scope,
    version_label,
    source_path,
    source_hash,
    metadata
  )
)
insert into public.codex_source_reference (
  source_key,
  source_title,
  source_type,
  authority_level,
  source_scope,
  version_label,
  source_status,
  readonly,
  seeded_at,
  source_path,
  source_hash,
  metadata,
  created_by
)
select
  source_key,
  source_title,
  source_type,
  authority_level,
  source_scope,
  version_label,
  'seeded',
  true,
  now(),
  source_path,
  source_hash,
  metadata,
  'op044'
from source_rows
on conflict (source_key) do nothing;

with source_keys as (
  select *
  from (
    values
      ('thread_to_transfer_validation_rule'),
      ('doc_set_closeout_rule'),
      ('doc_stack_constraints'),
      ('database_src_manifest'),
      ('session_13_db_preflight_verification_checklist'),
      ('chazz_cody_development_role_contract'),
      ('oar2_update_powershell_transfer_surface_rule')
  ) as rows(source_key)
)
insert into public.codex_source_seed_log (
  source_reference_id,
  seed_event,
  oar_key,
  operator_key,
  event_note,
  metadata
)
select
  csr.id,
  'seeded',
  'oar2_source_reference_expansion_seed_set_v2',
  'op044',
  'Expansion seed set v2 source-reference seeding',
  jsonb_build_object('expansion_seed_set', 'v2', 'source_key', sk.source_key)
from source_keys sk
join public.codex_source_reference csr on csr.source_key = sk.source_key
where not exists (
  select 1
  from public.codex_source_seed_log log
  where log.source_reference_id = csr.id
    and log.seed_event = 'seeded'
    and log.oar_key = 'oar2_source_reference_expansion_seed_set_v2'
);

with term_rows as (
  select *
  from (
    values
      ('thread_validation', 'Thread Validation', 'thread_to_transfer_validation_rule', 'process_validation', 'Thread validation precedes transfer into file form.'),
      ('transfer_surface', 'Transfer Surface', 'thread_to_transfer_validation_rule', 'transfer_boundary', 'Transfer surface carries reviewed content into durable file form.'),
      ('file_check', 'File Check', 'thread_to_transfer_validation_rule', 'verification_step', 'File check verifies written transfer output before downstream use.'),
      ('closeout', 'Closeout', 'doc_set_closeout_rule', 'process_closeout', 'Closeout records final standing before continuance.'),
      ('db_preflight', 'DB Preflight', 'session_13_db_preflight_verification_checklist', 'database_preflight', 'DB preflight verifies seeded references and execution readiness before mutation.'),
      ('role_contract', 'Role Contract', 'chazz_cody_development_role_contract', 'role_boundary', 'Role contract preserves bounded execution roles.'),
      ('runtime_boundary', 'Runtime Boundary', 'database_src_manifest', 'runtime_boundary', 'Runtime boundary separates seated DB state from rendering behavior.'),
      ('frontend_non_authority', 'Frontend Non-Authority', 'database_src_manifest', 'frontend_boundary', 'Frontend renders seated state and does not author authority.')
  ) as rows(term_key, term_label, source_key, role, definition)
)
insert into public.codex_source_term (
  source_reference_id,
  term_key,
  term_label,
  role,
  definition,
  term_status,
  metadata
)
select
  csr.id,
  tr.term_key,
  tr.term_label,
  tr.role,
  tr.definition,
  'active',
  jsonb_build_object(
    'seed_oar_key', 'oar2_source_reference_expansion_seed_set_v2',
    'expansion_seed_set', 'v2',
    'bounded_term_seed', true
  )
from term_rows tr
join public.codex_source_reference csr on csr.source_key = tr.source_key
on conflict (term_key) do nothing;

with relation_rows as (
  select *
  from (
    values
      ('thread_to_transfer_validation_rule', 'protects', 'oar_lifecycle', 'thread_to_transfer_validation_rule protects oar_lifecycle'),
      ('doc_set_closeout_rule', 'protects', 'oar_lifecycle', 'doc_set_closeout_rule protects oar_lifecycle'),
      ('doc_stack_constraints', 'clarifies', 'seeded_reference_control', 'doc_stack_constraints clarifies seeded_reference_control'),
      ('database_src_manifest', 'aligns_to', 'seed_concordance', 'database_src_manifest aligns_to seed_concordance'),
      ('session_13_db_preflight_verification_checklist', 'verifies', 'database_src_manifest', 'session_13_db_preflight_verification_checklist verifies database_src_manifest'),
      ('chazz_cody_development_role_contract', 'routes', 'database_src_manifest', 'chazz_cody_development_role_contract routes database_src_manifest'),
      ('oar2_update_powershell_transfer_surface_rule', 'clarifies', 'thread_to_transfer_validation_rule', 'oar2_update_powershell_transfer_surface_rule clarifies thread_to_transfer_validation_rule')
  ) as rows(from_source_key, relation_type, to_source_key, relation_note)
)
insert into public.codex_source_relation (
  from_source_reference_id,
  to_source_reference_id,
  relation_type,
  relation_note,
  metadata
)
select
  from_ref.id,
  to_ref.id,
  rr.relation_type,
  rr.relation_note,
  jsonb_build_object('seed_oar_key', 'oar2_source_reference_expansion_seed_set_v2', 'expansion_seed_set', 'v2')
from relation_rows rr
join public.codex_source_reference from_ref on from_ref.source_key = rr.from_source_key
join public.codex_source_reference to_ref on to_ref.source_key = rr.to_source_key
where not exists (
  select 1
  from public.codex_source_relation existing
  where existing.from_source_reference_id = from_ref.id
    and existing.to_source_reference_id = to_ref.id
    and existing.relation_type = rr.relation_type
);
