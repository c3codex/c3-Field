-- Seed Concordance Governance and Change Control Validation v1
-- Source OAR2: docs/oar/c3_field/oar2_seed_concordance_governance_and_change_control_seating_v1.meta.md
-- Returns rows only for validation failures.

select 'missing_governance_document' as validation_issue,
       'seed_concordance_governance_usage_change_control' as subject,
       'expected one seated governance document' as detail
where (
  select count(*)
  from public.concordance_document
  where document_key = 'seed_concordance_governance_usage_change_control'
    and authority_standing = 'active'
    and visibility_standing = 'internal'
    and document_scope = 'semantic_governance'
    and metadata ->> 'document_type' = 'concordance_governance'
    and metadata ->> 'authority_level' = 'system'
    and metadata ->> 'status' = 'readonly_candidate'
) <> 1;

select 'missing_governance_version' as validation_issue,
       'seed_concordance_governance_usage_change_control_v1' as subject,
       'expected one active governance version' as detail
where (
  select count(*)
  from public.concordance_version
  where version_key = 'seed_concordance_governance_usage_change_control_v1'
    and document_key = 'seed_concordance_governance_usage_change_control'
    and version_standing = 'active'
    and visibility_standing = 'internal'
    and metadata ->> 'status' = 'readonly_candidate'
    and metadata ->> 'seating_type' = 'governance_posture'
) <> 1;

select 'duplicate_semantic_term_created' as validation_issue,
       term_label as subject,
       count(*)::text as detail
from public.concordance_term
where version_key = 'seed_concordance_governance_usage_change_control_v1'
group by term_label
having count(*) > 0;

select 'missing_governance_relations' as validation_issue,
       'seed_concordance_governance_usage_change_control_v1' as subject,
       'expected 8 active governance posture relations' as detail
where (
  select count(*)
  from public.concordance_relation
  where version_key = 'seed_concordance_governance_usage_change_control_v1'
    and relation_standing = 'active'
    and visibility_standing = 'internal'
    and metadata ->> 'seating' = 'governance_posture'
) <> 8;

select 'missing_governance_snapshot' as validation_issue,
       'seed_concordance_governance_usage_change_control_v1_local_source_f0d0e2e0' as subject,
       'expected verified local source snapshot' as detail
where (
  select count(*)
  from public.seeded_source_snapshot
  where snapshot_key = 'seed_concordance_governance_usage_change_control_v1_local_source_f0d0e2e0'
    and version_key = 'seed_concordance_governance_usage_change_control_v1'
    and verification_standing = 'verified'
    and visibility_standing = 'internal'
    and source_sha256 = 'f0d0e2e003220d297abe281e5c82be42c9c10877e1d6278000662b3b119e0a61'
    and byte_size = 4986
) <> 1;

select 'native_order_redefined' as validation_issue,
       document_key as subject,
       native_order as detail
from public.concordance_document
where document_key = 'seed_concordance_governance_usage_change_control'
  and native_order <> 'Codex -> Field -> Measures -> Chazz';
