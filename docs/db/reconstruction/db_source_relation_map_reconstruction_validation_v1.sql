-- DB Source Relation Map + Reconstruction Passage Validation v1
-- Source OAR2: docs/oar/process/oar2_db_source_relation_map_reconstruction_passage_v1.meta.md
-- Read-only validation passage. Returns rows only for continuity findings.

with required_tables(table_name, reconstruction_order, relation_surface) as (
  values
    ('concordance_document', 2, 'Concordance document authority'),
    ('concordance_version', 2, 'Concordance version authority'),
    ('concordance_term', 3, 'Concordance semantic terms'),
    ('concordance_relation', 4, 'Concordance relations'),
    ('seeded_source_snapshot', 8, 'Concordance source snapshots'),
    ('c3_oar_process_instance', 6, 'OAR process instance lineage'),
    ('c3_oar_transition_event', 7, 'OAR transition continuity'),
    ('c3_oar_seeded_reference', 8, 'OAR seeded references'),
    ('system_process_registry', 9, 'Process registry'),
    ('system_oar_queue', 9, 'OAR execution queue'),
    ('system_oar_execution_evidence', 9, 'OAR execution evidence'),
    ('measures_registry', 3, 'Measures registry standing'),
    ('measures_release_state', 5, 'Measures release/access standing'),
    ('measures_transition_rule', 7, 'Measures transition rules')
)
select 'missing_required_table' as validation_issue,
       table_name as subject,
       relation_surface || ' / order ' || reconstruction_order::text as detail
from required_tables required
where not exists (
  select 1
  from information_schema.tables tables
  where tables.table_schema = 'public'
    and tables.table_name = required.table_name
);

with required_columns(table_name, column_name) as (
  values
    ('concordance_document', 'document_key'),
    ('concordance_document', 'native_order'),
    ('concordance_version', 'version_key'),
    ('concordance_version', 'document_key'),
    ('concordance_term', 'term_key'),
    ('concordance_term', 'version_key'),
    ('concordance_relation', 'relation_key'),
    ('concordance_relation', 'version_key'),
    ('seeded_source_snapshot', 'snapshot_key'),
    ('seeded_source_snapshot', 'version_key'),
    ('c3_oar_process_instance', 'process_instance_key'),
    ('c3_oar_process_instance', 'source_oar2_path'),
    ('c3_oar_process_instance', 'expected_oar1_path'),
    ('c3_oar_transition_event', 'transition_event_key'),
    ('c3_oar_transition_event', 'process_instance_key'),
    ('c3_oar_transition_event', 'evidence_reference'),
    ('c3_oar_seeded_reference', 'seeded_reference_key'),
    ('c3_oar_seeded_reference', 'seeded_reference_path'),
    ('system_process_registry', 'process_key'),
    ('system_oar_queue', 'queue_key'),
    ('system_oar_queue', 'process_key'),
    ('system_oar_execution_evidence', 'evidence_key'),
    ('system_oar_execution_evidence', 'queue_key')
)
select 'missing_required_column' as validation_issue,
       table_name as subject,
       column_name as detail
from required_columns required
where not exists (
  select 1
  from information_schema.columns columns
  where columns.table_schema = 'public'
    and columns.table_name = required.table_name
    and columns.column_name = required.column_name
);

with required_foreign_keys(table_name, foreign_table_name) as (
  values
    ('concordance_version', 'concordance_document'),
    ('concordance_term', 'concordance_version'),
    ('concordance_relation', 'concordance_version'),
    ('seeded_source_snapshot', 'concordance_version'),
    ('c3_oar_transition_event', 'c3_oar_process_instance'),
    ('system_oar_queue', 'system_process_registry'),
    ('system_oar_execution_evidence', 'system_oar_queue')
)
select 'missing_parent_relation' as validation_issue,
       table_name as subject,
       foreign_table_name as detail
from required_foreign_keys required
where not exists (
  select 1
  from information_schema.table_constraints constraints
  join information_schema.key_column_usage key_usage
    on key_usage.constraint_schema = constraints.constraint_schema
   and key_usage.constraint_name = constraints.constraint_name
  join information_schema.constraint_column_usage column_usage
    on column_usage.constraint_schema = constraints.constraint_schema
   and column_usage.constraint_name = constraints.constraint_name
  where constraints.table_schema = 'public'
    and constraints.constraint_type = 'FOREIGN KEY'
    and constraints.table_name = required.table_name
    and column_usage.table_name = required.foreign_table_name
);

with required_triggers(table_name, trigger_name) as (
  values
    ('concordance_version', 'concordance_version_no_delete'),
    ('concordance_term', 'concordance_term_no_delete'),
    ('concordance_relation', 'concordance_relation_no_update'),
    ('concordance_relation', 'concordance_relation_no_delete'),
    ('seeded_source_snapshot', 'seeded_source_snapshot_no_update'),
    ('seeded_source_snapshot', 'seeded_source_snapshot_no_delete'),
    ('c3_oar_transition_event', 'c3_oar_transition_event_no_update'),
    ('c3_oar_transition_event', 'c3_oar_transition_event_no_delete'),
    ('system_oar_queue', 'system_oar_queue_no_queued_to_executing'),
    ('system_oar_queue', 'system_oar_queue_closed_requires_evidence')
)
select 'missing_continuity_trigger' as validation_issue,
       table_name as subject,
       trigger_name as detail
from required_triggers required
where to_regclass('public.' || required.table_name) is not null
  and not exists (
    select 1
    from pg_trigger trigger
    where not trigger.tgisinternal
      and trigger.tgrelid = to_regclass('public.' || required.table_name)
      and trigger.tgname = required.trigger_name
  );

select 'frontend_fallback_authority_boundary' as validation_issue,
       'runtime reconstruction passage' as subject,
       'manual check: frontend, markdown, and snapshots must remain evidence, not authority' as detail
where false;
