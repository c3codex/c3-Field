-- Seed Concordance Geometry Expansion Validation v1
-- Source OAR2: docs/oar/c3_field/oar2_seed_concordance_geometry_expansion_seating_v1.meta.md

with expected(term_label) as (
  values
    ('Orthogonal'),
    ('Orthocenter'),
    ('Relational Nodes'),
    ('Relational Vectors'),
    ('Isomorphism'),
    ('Isomorphic Appearance')
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
    'Orthogonal',
    'Orthocenter',
    'Relational Nodes',
    'Relational Vectors',
    'Isomorphism',
    'Isomorphic Appearance'
  )
  and visibility_standing <> 'internal';

select relation_scope, relation_type, count(*) as relation_count
from public.concordance_relation
where version_key = 'seed_concordance_v1'
  and metadata ->> 'expansion' = 'seed_concordance_geometry_expansion_seating_v1'
group by relation_scope, relation_type
order by relation_scope, relation_type;

select relation_key
from public.concordance_relation
where version_key = 'seed_concordance_v1'
  and metadata ->> 'expansion' = 'seed_concordance_geometry_expansion_seating_v1'
  and (source_ref is null or target_ref is null);

select relation_key
from public.concordance_relation
where version_key = 'seed_concordance_v1'
  and metadata ->> 'expansion' = 'seed_concordance_geometry_expansion_seating_v1'
  and metadata ? 'relation_semantic'
  and relation_type <> 'related_to';
