-- Concordance Authority Execution Package Post-Seat Validation v1
-- REVIEW ARTIFACT ONLY. Run only under a separate confirmed execution OAR2.

select to_regclass('public.concordance_document') as concordance_document;
select to_regclass('public.concordance_version') as concordance_version;
select to_regclass('public.concordance_term') as concordance_term;
select to_regclass('public.concordance_relation') as concordance_relation;
select to_regclass('public.seeded_source_snapshot') as seeded_source_snapshot;

select *
from public.concordance_document
where document_key = 'seed_concordance';

select *
from public.concordance_version
where version_key = 'seed_concordance_v1';

select document_key, count(*) as active_version_count
from public.concordance_version
where version_standing = 'active'
group by document_key
having count(*) > 1;

select term_label, count(*) as duplicate_count
from public.concordance_term
where version_key = 'seed_concordance_v1'
group by term_label
having count(*) > 1;

select term_key, term_label, term_standing, visibility_standing
from public.concordance_term
where version_key = 'seed_concordance_v1'
order by term_label;

select relation_type, relation_scope, count(*) as relation_count
from public.concordance_relation
where version_key = 'seed_concordance_v1'
group by relation_type, relation_scope
order by relation_type, relation_scope;

select *
from public.seeded_source_snapshot
where version_key = 'seed_concordance_v1';

select count(*) as public_visible_internal_terms
from public.concordance_term
where visibility_standing <> 'public';
