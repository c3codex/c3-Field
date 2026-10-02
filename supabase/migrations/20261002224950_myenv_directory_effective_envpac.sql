-- Preserve EnvPAC standing: personal runtime authority requires effective,
-- not the active standing used by Directory contacts and runtime bindings.
-- Preserve the existing invoker function, grants, and all other predicates.
do $migration$
declare definition text;
begin
  definition := pg_get_functiondef('public.resolve_c3_env_directory_v1(jsonb)'::regprocedure);
  if position('and e.standing=''active'' and e.is_effective=true' in definition)=0 then
    raise exception 'held_directory_definition_mismatch';
  end if;
  execute replace(definition,
    'and e.standing=''active'' and e.is_effective=true',
    'and e.standing=''effective'' and e.is_effective=true');
end
$migration$;
