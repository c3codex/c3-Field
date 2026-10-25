-- Concordance Authority Execution Package Preflight v1
-- REVIEW ARTIFACT ONLY. Run only under a separate confirmed execution OAR2.

select to_regclass('public.concordance_document') as existing_concordance_document;
select to_regclass('public.concordance_version') as existing_concordance_version;
select to_regclass('public.concordance_term') as existing_concordance_term;
select to_regclass('public.concordance_relation') as existing_concordance_relation;
select to_regclass('public.seeded_source_snapshot') as existing_seeded_source_snapshot;

-- Existing c3/OAR reference check.
select *
from public.c3_oar_seeded_reference
where seeded_reference_key = 'seed_concordance'
   or seeded_reference_path ilike '%seed_concordance%';

-- Measures metadata should not be treated as authority; this only detects references.
select id, registry_key, display_title, metadata
from public.measures_registry
where metadata::text ilike '%seed_concordance%'
limit 50;

-- Abort condition for execution operator:
-- If any concordance_* table already exists with incompatible columns, stop and route correction OAR2.
