-- Seed Concordance Foundational Coherence Set Validation v1
-- Source OAR2: docs/oar/c3_field/oar2_seed_concordance_foundational_coherence_set_seating_v1.meta.md

with expected(term_label) as (
  values
    ('The 21 of Coherence'),
    ('The 7 Constraints'),
    ('The 7 Agreements'),
    ('The 7 Resolutions of Coherence'),
    ('Immutable Living Memory'),
    ('Encounter Acknowledgment')
)
select e.term_label
from expected e
left join public.concordance_term t
  on t.version_key = 'seed_concordance_v1'
 and t.term_label = e.term_label
 and t.term_standing = 'active'
where t.term_key is null;

select term_label, count(*) as duplicate_count
from public.concordance_term
where version_key = 'seed_concordance_v1'
  and term_standing = 'active'
group by term_label
having count(*) > 1;

select term_key, term_label, visibility_standing
from public.concordance_term
where version_key = 'seed_concordance_v1'
  and term_label in (
    'The 21 of Coherence',
    'The 7 Constraints',
    'The 7 Agreements',
    'The 7 Resolutions of Coherence',
    'Immutable Living Memory',
    'Encounter Acknowledgment'
  )
  and visibility_standing <> 'internal';

select relation_scope, relation_type, count(*) as relation_count
from public.concordance_relation
where version_key = 'seed_concordance_v1'
  and metadata ->> 'expansion' = 'seed_concordance_foundational_coherence_set_seating_v1'
group by relation_scope, relation_type
order by relation_scope, relation_type;

select relation_key
from public.concordance_relation
where version_key = 'seed_concordance_v1'
  and metadata ->> 'expansion' = 'seed_concordance_foundational_coherence_set_seating_v1'
  and (source_ref is null or target_ref is null);

select relation_key
from public.concordance_relation
where version_key = 'seed_concordance_v1'
  and metadata ->> 'expansion' = 'seed_concordance_foundational_coherence_set_seating_v1'
  and source_ref = 'seed_concordance_v1_the_21_of_coherence'
  and target_ref = 'protected Seed Pattern Constraints for Chazz execution'
  and metadata ->> 'relation_semantic' = 'does_not_replace';
