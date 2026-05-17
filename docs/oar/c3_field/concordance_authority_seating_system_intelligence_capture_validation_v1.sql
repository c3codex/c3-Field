-- Concordance Authority Seating System Intelligence Capture Validation v1
-- Source OAR2: docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md
-- Returns rows only for validation failures.

select 'missing_system_intelligence_document' as validation_issue,
       'concordance_authority_seating_system_intelligence' as subject,
       'expected one seated system intelligence document' as detail
where (
  select count(*)
  from public.concordance_document
  where document_key = 'concordance_authority_seating_system_intelligence'
    and authority_standing = 'active'
    and visibility_standing = 'internal'
    and document_scope = 'semantic_infrastructure'
    and metadata ->> 'document_type' = 'system_intelligence'
    and metadata ->> 'authority_level' = 'system'
    and metadata ->> 'status' = 'seeded_candidate'
) <> 1;

select 'missing_system_intelligence_version' as validation_issue,
       'concordance_authority_seating_system_intelligence_v1' as subject,
       'expected one active system intelligence version' as detail
where (
  select count(*)
  from public.concordance_version
  where version_key = 'concordance_authority_seating_system_intelligence_v1'
    and document_key = 'concordance_authority_seating_system_intelligence'
    and version_standing = 'active'
    and visibility_standing = 'internal'
    and metadata ->> 'status' = 'seeded_candidate'
    and metadata ->> 'seating_type' = 'system_intelligence_capture'
) <> 1;

select 'semantic_term_created' as validation_issue,
       term_label as subject,
       count(*)::text as detail
from public.concordance_term
where version_key = 'concordance_authority_seating_system_intelligence_v1'
group by term_label
having count(*) > 0;

select 'missing_system_intelligence_relations' as validation_issue,
       'concordance_authority_seating_system_intelligence_v1' as subject,
       'expected 16 active system intelligence capture relations' as detail
where (
  select count(*)
  from public.concordance_relation
  where version_key = 'concordance_authority_seating_system_intelligence_v1'
    and relation_standing = 'active'
    and visibility_standing = 'internal'
    and metadata ->> 'seating' = 'system_intelligence_capture'
) <> 16;

select 'missing_system_intelligence_snapshot' as validation_issue,
       'concordance_authority_system_intelligence_v1_local_source_20560e6a' as subject,
       'expected verified local source snapshot' as detail
where (
  select count(*)
  from public.seeded_source_snapshot
  where snapshot_key = 'concordance_authority_system_intelligence_v1_local_source_20560e6a'
    and version_key = 'concordance_authority_seating_system_intelligence_v1'
    and verification_standing = 'verified'
    and visibility_standing = 'internal'
    and source_sha256 = '20560e6ade019def30585732f76d1af4a20b3951df878ae3a61b7c3aafe21efb'
    and byte_size = 2647
) <> 1;

select 'native_order_redefined' as validation_issue,
       document_key as subject,
       native_order as detail
from public.concordance_document
where document_key = 'concordance_authority_seating_system_intelligence'
  and native_order <> 'Codex -> Field -> Measures -> Chazz';
