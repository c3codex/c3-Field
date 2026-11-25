CREATE OR REPLACE FUNCTION public.c3_hardened_pac_immutable_guard_v1()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_context text:=current_setting('c3.pac_registrar_context',true);
begin
  if old.registration_protocol<>'registrar_v1' then
    return new;
  end if;

  if nullif(v_context,'') is null then
    raise exception 'registrar_v1 PAC is immutable; supersede through Registrar';
  end if;

  if (
    new.pac_key is distinct from old.pac_key
    or new.envpac_key is distinct from old.envpac_key
    or new.pac_type is distinct from old.pac_type
    or new.version is distinct from old.version
    or new.standing is distinct from old.standing
    or new.custody_uri is distinct from old.custody_uri
    or new.content_sha256 is distinct from old.content_sha256
    or new.source_authority is distinct from old.source_authority
    or new.metadata is distinct from old.metadata
    or new.schema_key is distinct from old.schema_key
    or new.owner_subject_type is distinct from old.owner_subject_type
    or new.owner_subject_key is distinct from old.owner_subject_key
    or new.owner_environment_key is distinct from old.owner_environment_key
    or new.registration_sha256 is distinct from old.registration_sha256
    or new.boundary_evaluation_key is distinct from old.boundary_evaluation_key
    or new.registered_at is distinct from old.registered_at
    or new.registrar_role_call_key is distinct from old.registrar_role_call_key
  ) then
    raise exception 'registrar_v1 PAC registered content cannot be mutated in place';
  end if;

  return new;
end $function$
;
