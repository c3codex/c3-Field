-- Source Reference Initial Seed v1
-- Authorized by docs/oar/source_reference/oar2_source_reference_initial_seeding_v1.meta.md
-- Boundary: seed only the approved first readonly foundational source references.

with source_rows as (
  select *
  from (
    values
      (
        'seed_concordance',
        'Seed Concordance',
        'concordance',
        'system',
        'seed semantic authority reference',
        'v1',
        'docs/_source/seed/seed_concordance.meta.md',
        '9c47e162a7b72eb32b09c78f3838a0198f996178cd49b5e20ae9c0685d42fc3a',
        '{"seed_oar_key":"oar2_source_reference_initial_seeding_v1","initial_seed":true,"source_alignment":"Seed Concordance"}'::jsonb
      ),
      (
        'system_concordance',
        'System Concordance',
        'concordance',
        'system',
        'system semantic reference',
        'v1',
        'docs/_source/seed/system_concordance.meta.md',
        'dfd21e6c991e016830a98d3d80827cfab218710af46d7738b24a808bffa82701',
        '{"seed_oar_key":"oar2_source_reference_initial_seeding_v1","initial_seed":true,"source_alignment":"system_concordance"}'::jsonb
      ),
      (
        'the_21_of_coherence',
        'The 21 of Coherence',
        'foundational_source',
        'system',
        'coherence foundational source set',
        'v1',
        'docs/_source/seed/source_21_of_coherence_v1.meta.md',
        '3248205591e47b3330a4e73a40372ac455575f50f8ef19bbc95877b21e0cd2e2',
        '{"seed_oar_key":"oar2_source_reference_initial_seeding_v1","initial_seed":true,"source_alignment":"The 21 of Coherence"}'::jsonb
      ),
      (
        'seeded_reference_control',
        'Source Set Rule Summary - Seeded Reference Control',
        'process_constraints',
        'readonly',
        'seeded reference control rule',
        'v1',
        'docs/_source/working/Chazz_sources/seeded_reference_control.md',
        '53ff7617094fb82833ae334e1c4c6c316211ca00515db0d96c9570ccd6baa7a4',
        '{"seed_oar_key":"oar2_source_reference_initial_seeding_v1","initial_seed":true,"source_alignment":"Source Set Rule Summary - Seeded Reference Control"}'::jsonb
      ),
      (
        'oar_lifecycle',
        'OAR Lifecycle - Execution and Handoff',
        'oar',
        'working',
        'OAR execution and handoff process',
        'v1',
        'docs/process/oar_lifecycle.meta.md',
        '49695b1300c6bd08792fd83f857481668f03772b2860483c5025f9ed1c818dac',
        '{"seed_oar_key":"oar2_source_reference_initial_seeding_v1","initial_seed":true,"source_alignment":"OAR Lifecycle - Execution and Handoff"}'::jsonb
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
),
inserted_sources as (
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
  on conflict (source_key) do nothing
  returning id, source_key
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
  'oar2_source_reference_initial_seeding_v1',
  'op044',
  'Initial source-reference seeding',
  jsonb_build_object('initial_seed', true, 'source_key', sr.source_key)
from source_rows sr
join public.codex_source_reference csr on csr.source_key = sr.source_key
where not exists (
  select 1
  from public.codex_source_seed_log log
  where log.source_reference_id = csr.id
    and log.seed_event = 'seeded'
    and log.oar_key = 'oar2_source_reference_initial_seeding_v1'
);

with seeded_source_keys as (
  select *
  from (
    values
      ('seed_concordance'),
      ('system_concordance'),
      ('the_21_of_coherence'),
      ('seeded_reference_control'),
      ('oar_lifecycle')
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
  'oar2_source_reference_initial_seeding_v1',
  'op044',
  'Initial source-reference seeding',
  jsonb_build_object('initial_seed', true, 'source_key', sk.source_key)
from seeded_source_keys sk
join public.codex_source_reference csr on csr.source_key = sk.source_key
where not exists (
  select 1
  from public.codex_source_seed_log log
  where log.source_reference_id = csr.id
    and log.seed_event = 'seeded'
    and log.oar_key = 'oar2_source_reference_initial_seeding_v1'
);

with term_rows as (
  select *
  from (
    values
      ('codex', 'Codex', 'seed_concordance', 'system_authority', 'Codex holds database authority.'),
      ('field', 'Field', 'seed_concordance', 'schema_relation', 'Field structures relation.'),
      ('measures', 'Measures', 'seed_concordance', 'registry_standing', 'Measures registers sequence, access, and reveal.'),
      ('chazz', 'Chazz', 'seed_concordance', 'system_routing', 'Chazz routes, validates, and executes within role.'),
      ('notchazz', 'NotChazz', 'seed_concordance', 'system_boundary', 'NotChazz is system, not actor.'),
      ('operator', 'Operator', 'seed_concordance', 'bounded_role', 'Operator is a bounded role carried by a named individual.'),
      ('oar1', 'OAR1', 'oar_lifecycle', 'execution_log', 'OAR1 records execution result and validation.'),
      ('oar2', 'OAR2', 'oar_lifecycle', 'instruction_surface', 'OAR2 is the execution instruction surface.'),
      ('source', 'Source', 'seed_concordance', 'source_reference', 'Source is an upstream reference surface.'),
      ('coherence', 'Coherence', 'the_21_of_coherence', 'foundational_condition', 'Coherence is maintained through right relation.'),
      ('seeded_reference', 'Seeded Reference', 'seeded_reference_control', 'standing_distinction', 'Seeded reference is active implementation or process standing.'),
      ('immutable_living_memory', 'Immutable Living Memory', 'the_21_of_coherence', 'coherence_principle', 'Immutable living memory preserves ordered recognition.'),
      ('verification_before_recognition', 'Verification Before Recognition', 'the_21_of_coherence', 'coherence_principle', 'Recognition follows verification.'),
      ('native_distinction', 'Native Distinction', 'the_21_of_coherence', 'coherence_principle', 'Native distinction prevents semantic collapse.'),
      ('role_integrity', 'Role Integrity', 'the_21_of_coherence', 'coherence_principle', 'Role integrity preserves bounded function.')
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
    'seed_oar_key', 'oar2_source_reference_initial_seeding_v1',
    'initial_seed', true,
    'bounded_term_seed', true
  )
from term_rows tr
join public.codex_source_reference csr on csr.source_key = tr.source_key
on conflict (term_key) do nothing;

with binding_rows as (
  select *
  from (
    values
      ('codex_database_authority', 'codex', 'Codex -> database authority', 'codex'),
      ('field_schema_relation', 'field', 'Field -> schema relation', 'field'),
      ('measures_registry_standing', 'measures', 'Measures -> registry standing', 'measures'),
      ('chazz_system_routing', 'chazz', 'Chazz -> system routing', 'chazz'),
      ('oar2_execution_instruction_surface', 'oar2', 'OAR2 -> execution instruction surface', 'oar'),
      ('seeded_reference_control_db_preflight_rule', 'seeded_reference', 'seeded_reference_control -> DB preflight rule', 'oar')
  ) as rows(binding_key, term_key, binding_context, system_surface)
)
insert into public.codex_source_operative_binding (
  source_term_id,
  binding_key,
  binding_context,
  system_surface,
  active_state,
  oar_key,
  metadata
)
select
  cst.id,
  br.binding_key,
  br.binding_context,
  br.system_surface,
  'active',
  'oar2_source_reference_initial_seeding_v1',
  jsonb_build_object('initial_seed', true)
from binding_rows br
join public.codex_source_term cst on cst.term_key = br.term_key
on conflict (binding_key) do nothing;

with relation_rows as (
  select *
  from (
    values
      (
        'system_concordance',
        'aligns_to',
        'seed_concordance',
        null,
        'system_concordance aligns_to seed_concordance',
        '{"initial_seed":true}'::jsonb
      ),
      (
        'the_21_of_coherence',
        'aligns_to',
        'seed_concordance',
        null,
        'the_21_of_coherence aligns_to seed_concordance',
        '{"initial_seed":true}'::jsonb
      ),
      (
        'seeded_reference_control',
        'protects',
        null,
        'source',
        'seeded_reference_control protects source_reference_initial_seeding',
        '{"initial_seed":true,"target_key":"source_reference_initial_seeding"}'::jsonb
      ),
      (
        'oar_lifecycle',
        'routes',
        null,
        'oar2',
        'oar_lifecycle routes source_reference_initial_seeding',
        '{"initial_seed":true,"target_key":"source_reference_initial_seeding"}'::jsonb
      )
  ) as rows(
    from_source_key,
    relation_type,
    to_source_key,
    to_term_key,
    relation_note,
    metadata
  )
)
insert into public.codex_source_relation (
  from_source_reference_id,
  to_source_reference_id,
  to_source_term_id,
  relation_type,
  relation_note,
  metadata
)
select
  from_ref.id,
  to_ref.id,
  to_term.id,
  rr.relation_type,
  rr.relation_note,
  rr.metadata || jsonb_build_object('seed_oar_key', 'oar2_source_reference_initial_seeding_v1')
from relation_rows rr
join public.codex_source_reference from_ref on from_ref.source_key = rr.from_source_key
left join public.codex_source_reference to_ref on to_ref.source_key = rr.to_source_key
left join public.codex_source_term to_term on to_term.term_key = rr.to_term_key
where not exists (
  select 1
  from public.codex_source_relation existing
  where existing.from_source_reference_id = from_ref.id
    and existing.relation_type = rr.relation_type
    and coalesce(existing.to_source_reference_id, '00000000-0000-0000-0000-000000000000'::uuid) =
      coalesce(to_ref.id, '00000000-0000-0000-0000-000000000000'::uuid)
    and coalesce(existing.to_source_term_id, '00000000-0000-0000-0000-000000000000'::uuid) =
      coalesce(to_term.id, '00000000-0000-0000-0000-000000000000'::uuid)
);
