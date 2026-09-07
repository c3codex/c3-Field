-- Measures Registry Sitewide Style Contract — Validation SQL v1
-- Source OAR2: docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md

select
  (select count(*) from public.concordance_document
    where document_key = 'measures_registry_sitewide_style_contract'
    and authority_standing = 'active'
    and visibility_standing = 'internal'
    and document_scope = 'sitewide_style_contract'
    and metadata->>'document_type' = 'style_contract'
    and metadata->>'status' = 'seeded'
    and metadata->>'system_key' = 'measures_registry'
  ) as document_count,
  (select count(*) from public.concordance_version
    where version_key = 'measures_registry_sitewide_style_contract_v1'
    and document_key = 'measures_registry_sitewide_style_contract'
    and version_standing = 'active'
    and visibility_standing = 'internal'
    and metadata->>'status' = 'seeded'
    and metadata->>'system_key' = 'measures_registry'
  ) as version_count,
  (select count(*) from public.concordance_relation
    where version_key = 'measures_registry_sitewide_style_contract_v1'
    and relation_standing = 'active'
    and visibility_standing = 'internal'
    and metadata->>'seating' = 'sitewide_style_contract_seating'
  ) as relation_count,
  (select count(*) from public.seeded_source_snapshot
    where snapshot_key = 'mrssc_v1_local_source_78d1a538'
    and version_key = 'measures_registry_sitewide_style_contract_v1'
    and verification_standing = 'verified'
    and source_sha256 = '78d1a5383c98cc77098d74dc4ec35a8084bfc5efd33cce5b78bb2053c6a3b644'
    and byte_size = 4744
  ) as snapshot_count;
