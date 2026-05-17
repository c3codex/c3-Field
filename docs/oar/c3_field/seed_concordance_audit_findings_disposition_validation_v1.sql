-- Seed Concordance Audit Findings Disposition Validation v1
-- Source OAR2: docs/oar/c3_field/oar2_seed_concordance_audit_findings_disposition_v1.meta.md
-- Returns rows only for validation failures.

select 'missing_conversion_engine_distinction_term' as validation_issue,
       'Conversion Engine Distinction' as subject,
       'expected exactly one active seated term' as detail
where (
  select count(*)
  from public.concordance_term
  where version_key = 'seed_concordance_v1'
    and term_label = 'Conversion Engine Distinction'
    and term_standing = 'active'
) <> 1;

select 'duplicate_current_seed_scope_term' as validation_issue,
       'Current Seed Scope' as subject,
       'must remain classified as non-term' as detail
where exists (
  select 1
  from public.concordance_term
  where version_key = 'seed_concordance_v1'
    and term_label = 'Current Seed Scope'
    and term_standing = 'active'
);

select 'tree_layer_terms_seated_without_route' as validation_issue,
       'TREE Layer Terms' as subject,
       'must remain deferred by this disposition' as detail
where exists (
  select 1
  from public.concordance_term
  where version_key = 'seed_concordance_v1'
    and term_label = 'TREE Layer Terms'
    and term_standing = 'active'
);

select 'conversion_distinction_public_visibility' as validation_issue,
       term_key as subject,
       visibility_standing as detail
from public.concordance_term
where version_key = 'seed_concordance_v1'
  and term_label = 'Conversion Engine Distinction'
  and visibility_standing <> 'internal';

select 'missing_conversion_distinction_relations' as validation_issue,
       'seed_concordance_audit_findings_disposition_v1' as subject,
       'expected 9 active relations for seated distinction' as detail
where (
  select count(*)
  from public.concordance_relation
  where version_key = 'seed_concordance_v1'
    and relation_standing = 'active'
    and metadata ->> 'expansion' = 'seed_concordance_audit_findings_disposition_v1'
) <> 9;

select 'unresolved_conversion_distinction_term_ref' as validation_issue,
       r.relation_key as subject,
       coalesce(r.source_ref, '') || ' -> ' || coalesce(r.target_ref, '') as detail
from public.concordance_relation r
where r.version_key = 'seed_concordance_v1'
  and r.metadata ->> 'expansion' = 'seed_concordance_audit_findings_disposition_v1'
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
