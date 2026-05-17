-- Seed Concordance Completeness Audit v1
-- Source OAR2: docs/oar/c3_field/oar2_seed_concordance_completeness_audit_v1.meta.md
-- Verification-only. No schema, term, relation, runtime, or frontend mutation.

-- 1. Active term count.
select count(*) as active_term_count
from public.concordance_term
where version_key = 'seed_concordance_v1'
  and term_standing = 'active';

-- 2. Duplicate active label scan.
select term_label, count(*) as duplicate_count
from public.concordance_term
where version_key = 'seed_concordance_v1'
  and term_standing = 'active'
group by term_label
having count(*) > 1;

-- 3. Orphan relation scan by version.
select r.relation_key, r.version_key
from public.concordance_relation r
left join public.concordance_version v
  on v.version_key = r.version_key
where v.version_key is null;

-- 4. Inactive version scan.
select version_key, version_standing, visibility_standing
from public.concordance_version
where document_key = 'seed_concordance'
  and version_standing <> 'active';

-- 5. Visibility standing audit.
select visibility_standing, count(*) as term_count
from public.concordance_term
where version_key = 'seed_concordance_v1'
group by visibility_standing
order by visibility_standing;

-- 6. Unresolved reference scan: term-scoped refs that look like seated term keys but do not exist.
select r.relation_key, r.source_ref, r.target_ref
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

-- 7. Protected exposure boundary scan.
select term_key, term_label, visibility_standing
from public.concordance_term
where version_key = 'seed_concordance_v1'
  and (
    metadata ->> 'protected' = 'true'
    or term_label in ('Protected Systems Intelligence', 'NotChazz', 'Chazz_roles')
  )
  and visibility_standing = 'public';

-- 8 and 12. Relation consistency/count by semantic stratum.
select coalesce(metadata ->> 'expansion', 'initial_authority_anchor') as semantic_stratum,
       relation_type,
       count(*) as relation_count
from public.concordance_relation
where version_key = 'seed_concordance_v1'
group by semantic_stratum, relation_type
order by semantic_stratum, relation_type;

-- 9. Missing Seed Concordance term scan is computed by the audit helper from source headings.

-- 10. Append-only posture verification.
select tgrelid::regclass::text as table_name, tgname as trigger_name
from pg_trigger
where not tgisinternal
  and tgname in (
    'concordance_version_no_delete',
    'concordance_term_no_delete',
    'concordance_relation_no_update',
    'concordance_relation_no_delete',
    'seeded_source_snapshot_no_update',
    'seeded_source_snapshot_no_delete'
  )
order by table_name, trigger_name;

-- 11. Authority-boundary verification.
select document_key, authority_standing, visibility_standing, native_order
from public.concordance_document
where document_key = 'seed_concordance';
