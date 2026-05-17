-- Seed Concordance Completeness Validation v1
-- Source OAR2: docs/oar/c3_field/oar2_seed_concordance_completeness_audit_v1.meta.md
-- Verification-only. Returns rows only for conditions requiring attention.

-- Duplicate active labels.
select 'duplicate_active_label' as validation_issue, term_label as subject, count(*)::text as detail
from public.concordance_term
where version_key = 'seed_concordance_v1'
  and term_standing = 'active'
group by term_label
having count(*) > 1;

-- Orphan relations by version.
select 'orphan_relation_version' as validation_issue, r.relation_key as subject, r.version_key as detail
from public.concordance_relation r
left join public.concordance_version v
  on v.version_key = r.version_key
where v.version_key is null;

-- Public protected terms.
select 'protected_public_visibility' as validation_issue, term_key as subject, term_label as detail
from public.concordance_term
where version_key = 'seed_concordance_v1'
  and (
    metadata ->> 'protected' = 'true'
    or term_label in ('Protected Systems Intelligence', 'NotChazz', 'Chazz_roles')
  )
  and visibility_standing = 'public';

-- Unresolved seated term-key references.
select 'unresolved_seed_term_ref' as validation_issue, r.relation_key as subject, coalesce(r.source_ref, '') || ' -> ' || coalesce(r.target_ref, '') as detail
from public.concordance_relation r
where r.version_key = 'seed_concordance_v1'
  and r.relation_scope = 'term'
  and (
    (r.source_ref like 'seed_concordance_v1_%' and not exists (
      select 1 from public.concordance_term t where t.term_key = r.source_ref
    ))
    or
    (r.target_ref like 'seed_concordance_v1_%' and not exists (
      select 1 from public.concordance_term t where t.term_key = r.target_ref
    ))
  );

-- Missing append-protection triggers.
with expected(table_name, trigger_name) as (
  values
    ('public.concordance_version', 'concordance_version_no_delete'),
    ('public.concordance_term', 'concordance_term_no_delete'),
    ('public.concordance_relation', 'concordance_relation_no_update'),
    ('public.concordance_relation', 'concordance_relation_no_delete'),
    ('public.seeded_source_snapshot', 'seeded_source_snapshot_no_update'),
    ('public.seeded_source_snapshot', 'seeded_source_snapshot_no_delete')
)
select 'missing_append_trigger' as validation_issue, e.table_name as subject, e.trigger_name as detail
from expected e
where not exists (
  select 1
  from pg_trigger t
  where not t.tgisinternal
    and t.tgrelid = e.table_name::regclass
    and t.tgname = e.trigger_name
);

-- Authority boundary.
select 'authority_boundary_not_active' as validation_issue, document_key as subject, authority_standing as detail
from public.concordance_document
where document_key = 'seed_concordance'
  and authority_standing <> 'active';
