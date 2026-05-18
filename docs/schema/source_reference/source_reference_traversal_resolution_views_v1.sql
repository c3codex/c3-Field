-- Source Reference Traversal and Resolution Views v1
-- Authorized design surface:
-- docs/oar/source_reference/oar2_source_reference_traversal_resolution_views_v1.meta.md
-- Boundary: draft only unless a later OAR explicitly authorizes execution.

create or replace view public.v_codex_source_seeded_precedence as
select
  sr.id as source_reference_id,
  sr.source_key,
  sr.source_title,
  sr.source_type,
  sr.authority_level,
  sr.source_status,
  sr.readonly,
  sr.seeded_at,
  case
    when sr.source_key = 'seed_concordance' then 1
    when sr.source_key = 'the_21_of_coherence' then 2
    when sr.source_key = 'seeded_reference_control' then 3
    when sr.source_key = 'oar_lifecycle' then 4
    when sr.source_key like 'oar1_%' then 5
    when sr.source_key like 'oar2_%' then 6
    when sr.source_type in ('process_rule', 'process_constraints') then 7
    when sr.source_type = 'implementation_manifest' then 8
    when sr.source_type in ('schema_draft', 'migration_candidate') then 9
    else 90
  end as precedence_rank,
  case
    when sr.source_key = 'seed_concordance' then 'Seed Concordance'
    when sr.source_key = 'the_21_of_coherence' then 'The 21 of Coherence'
    when sr.source_key = 'seeded_reference_control' then 'Seeded Reference Control'
    when sr.source_key = 'oar_lifecycle' then 'OAR Lifecycle'
    when sr.source_key like 'oar1_%' then 'Completed OAR1 records'
    when sr.source_key like 'oar2_%' then 'Working OAR2 records'
    when sr.source_type in ('process_rule', 'process_constraints') then 'Process rules'
    when sr.source_type = 'implementation_manifest' then 'Implementation manifests'
    when sr.source_type in ('schema_draft', 'migration_candidate') then 'Schema drafts'
    else 'Unranked seeded source'
  end as precedence_label
from public.codex_source_reference sr
where sr.source_status = 'seeded';

create or replace view public.v_codex_source_lineage as
select
  rel.id as relation_id,
  from_ref.source_key as from_source_key,
  to_ref.source_key as to_source_key,
  rel.relation_type,
  rel.relation_note,
  from_prec.precedence_rank as from_precedence_rank,
  to_prec.precedence_rank as to_precedence_rank
from public.codex_source_relation rel
left join public.codex_source_reference from_ref
  on from_ref.id = rel.from_source_reference_id
left join public.codex_source_reference to_ref
  on to_ref.id = rel.to_source_reference_id
left join public.v_codex_source_seeded_precedence from_prec
  on from_prec.source_reference_id = from_ref.id
left join public.v_codex_source_seeded_precedence to_prec
  on to_prec.source_reference_id = to_ref.id
where from_ref.id is not null;

create or replace view public.v_codex_source_seeded_relations as
select
  rel.id as relation_id,
  from_ref.source_key as from_source_key,
  to_ref.source_key as to_source_key,
  rel.relation_type,
  rel.relation_note,
  from_ref.source_status as from_source_status,
  to_ref.source_status as to_source_status
from public.codex_source_relation rel
join public.codex_source_reference from_ref
  on from_ref.id = rel.from_source_reference_id
join public.codex_source_reference to_ref
  on to_ref.id = rel.to_source_reference_id
where from_ref.source_status = 'seeded'
  and to_ref.source_status = 'seeded';

create or replace view public.v_codex_source_supersession as
select
  superseded.source_key as superseded_source_key,
  superseding.source_key as superseding_source_key,
  rel.id as supersession_relation_id,
  superseded.source_status as superseded_status,
  superseding.source_status as superseding_status,
  case
    when rel.relation_type <> 'supersedes' then 'invalid_relation_type'
    when superseding.source_status <> 'seeded' then 'superseding_source_not_seeded'
    when superseded.source_status not in ('seeded', 'superseded', 'deprecated') then 'superseded_source_invalid_status'
    else 'valid'
  end as supersession_validity
from public.codex_source_relation rel
join public.codex_source_reference superseding
  on superseding.id = rel.from_source_reference_id
join public.codex_source_reference superseded
  on superseded.id = rel.to_source_reference_id
where rel.relation_type = 'supersedes';

create or replace view public.v_codex_source_contradiction_candidates as
select
  'same_term_incompatible_active_surfaces' as candidate_type,
  cst.term_key,
  min(csr.source_key) as source_key,
  null::text as related_source_key,
  string_agg(distinct binding.system_surface, ', ' order by binding.system_surface) as candidate_detail
from public.codex_source_operative_binding binding
join public.codex_source_term cst
  on cst.id = binding.source_term_id
join public.codex_source_reference csr
  on csr.id = cst.source_reference_id
where binding.active_state = 'active'
group by cst.term_key
having count(distinct binding.system_surface) > 1

union all

select
  'lower_precedence_supersedes_higher_precedence' as candidate_type,
  null::text as term_key,
  lower_source.source_key as source_key,
  higher_source.source_key as related_source_key,
  rel.relation_note as candidate_detail
from public.codex_source_relation rel
join public.v_codex_source_seeded_precedence lower_source
  on lower_source.source_reference_id = rel.from_source_reference_id
join public.v_codex_source_seeded_precedence higher_source
  on higher_source.source_reference_id = rel.to_source_reference_id
where rel.relation_type = 'supersedes'
  and lower_source.precedence_rank > higher_source.precedence_rank

union all

select
  'active_binding_attached_to_unseeded_source' as candidate_type,
  cst.term_key,
  csr.source_key as source_key,
  null::text as related_source_key,
  binding.binding_key as candidate_detail
from public.codex_source_operative_binding binding
join public.codex_source_term cst
  on cst.id = binding.source_term_id
join public.codex_source_reference csr
  on csr.id = cst.source_reference_id
where binding.active_state = 'active'
  and csr.source_status <> 'seeded'

union all

select
  'superseded_source_still_carrying_active_binding' as candidate_type,
  cst.term_key,
  csr.source_key as source_key,
  null::text as related_source_key,
  binding.binding_key as candidate_detail
from public.codex_source_operative_binding binding
join public.codex_source_term cst
  on cst.id = binding.source_term_id
join public.codex_source_reference csr
  on csr.id = cst.source_reference_id
where binding.active_state = 'active'
  and csr.source_status = 'superseded'

union all

select
  'relation_path_involving_rejected_source' as candidate_type,
  null::text as term_key,
  from_ref.source_key as source_key,
  to_ref.source_key as related_source_key,
  rel.relation_note as candidate_detail
from public.codex_source_relation rel
left join public.codex_source_reference from_ref
  on from_ref.id = rel.from_source_reference_id
left join public.codex_source_reference to_ref
  on to_ref.id = rel.to_source_reference_id
where from_ref.source_status = 'rejected'
   or to_ref.source_status = 'rejected';

create or replace view public.v_codex_source_active_bindings as
select
  binding.id as binding_id,
  binding.binding_key,
  binding.binding_context,
  binding.system_surface,
  binding.active_state,
  cst.term_key,
  cst.term_label,
  cst.term_status,
  csr.source_key,
  csr.source_title,
  csr.source_status,
  prec.precedence_rank,
  prec.precedence_label
from public.codex_source_operative_binding binding
join public.codex_source_term cst
  on cst.id = binding.source_term_id
join public.codex_source_reference csr
  on csr.id = cst.source_reference_id
left join public.v_codex_source_seeded_precedence prec
  on prec.source_reference_id = csr.id
where binding.active_state = 'active'
  and cst.term_status = 'active'
  and csr.source_status = 'seeded'
  and not exists (
    select 1
    from public.v_codex_source_contradiction_candidates candidate
    where candidate.term_key = cst.term_key
       or candidate.source_key = csr.source_key
  );

create or replace view public.v_codex_source_resolution_path as
select
  csr.id as source_reference_id,
  csr.source_key,
  csr.source_title,
  csr.source_status,
  prec.precedence_rank,
  prec.precedence_label,
  rel.relation_type,
  rel.relation_note,
  cst.term_key,
  cst.term_label,
  cst.term_status,
  binding.binding_key,
  binding.binding_context,
  binding.system_surface,
  binding.active_state,
  coalesce((csr.metadata ->> 'protected_source')::boolean, false) as protected_source
from public.codex_source_reference csr
left join public.v_codex_source_seeded_precedence prec
  on prec.source_reference_id = csr.id
left join public.codex_source_relation rel
  on rel.from_source_reference_id = csr.id
left join public.codex_source_term cst
  on cst.source_reference_id = csr.id
left join public.codex_source_operative_binding binding
  on binding.source_term_id = cst.id
where csr.source_status = 'seeded';
