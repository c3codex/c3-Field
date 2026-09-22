-- Personal environments are canonical per owner, not globally singleton per c3Field class.
-- Applied to production on 2026-09-22.
drop index if exists public.c3_environment_one_active_canonical_per_system_class;

create unique index c3_environment_one_active_canonical_per_system_class
on public.c3_environment(system_key,environment_class)
where is_canonical is true
  and is_active is true
  and environment_class <> 'c3me_individual_environment';

create unique index c3_environment_one_active_canonical_personal_per_owner
on public.c3_environment(system_key,environment_class,((metadata->>'owner_subject_key')))
where is_canonical is true
  and is_active is true
  and environment_class='c3me_individual_environment'
  and nullif(metadata->>'owner_subject_key','') is not null;
