-- Measures Registry Runtime Audit Intelligence — Validation SQL v1
-- Source OAR2: docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md

select
  (select count(*) from public.concordance_document
    where document_key = 'measures_registry_runtime_audit_intelligence'
    and authority_standing = 'active'
    and visibility_standing = 'internal'
    and document_scope = 'runtime_governance'
    and metadata->>'document_type' = 'system_intelligence'
    and metadata->>'status' = 'seeded'
    and metadata->>'system_key' = 'c3field'
    and metadata->>'intelligence_class' = 'implementation_intelligence'
  ) as document_count,
  (select count(*) from public.concordance_version
    where version_key = 'measures_registry_runtime_audit_intelligence_v1'
    and document_key = 'measures_registry_runtime_audit_intelligence'
    and version_standing = 'active'
    and visibility_standing = 'internal'
    and metadata->>'status' = 'seeded'
    and metadata->>'system_key' = 'c3field'
  ) as version_count,
  (select count(*) from public.concordance_relation
    where version_key = 'measures_registry_runtime_audit_intelligence_v1'
    and relation_standing = 'active'
    and visibility_standing = 'internal'
    and metadata->>'seating' = 'runtime_governance_intelligence_capture'
  ) as relation_count,
  (select count(*) from public.seeded_source_snapshot
    where snapshot_key = 'mrs_runtime_audit_intelligence_v1_local_source_2e2daffb'
    and version_key = 'measures_registry_runtime_audit_intelligence_v1'
    and verification_standing = 'verified'
    and source_sha256 = '2e2daffbac14bbe25ffc59cf8d01efbb03c811384b626eb6182a1fed781be333'
    and byte_size = 30318
  ) as snapshot_count;
