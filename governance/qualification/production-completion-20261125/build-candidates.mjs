import {readFileSync,writeFileSync} from 'node:fs'
const root=new URL('./',import.meta.url),prior=new URL('../participant-withdrawal-20261125/',import.meta.url)
const read=p=>readFileSync(p,'utf8')
let projection=read(new URL('native/projection-withdrawal.sql',prior))
const branch=`  -- Owner withdrawal is mutable authorization, never an immutable PAC edit.
  if v_pac.registration_protocol='registrar_v1' and p_action='REVOKE' then
    update public.c3_envpac_access_grant
    set scope=coalesce(scope,'{}'::jsonb)||jsonb_build_object(
      'withdrawn_pac_projections',case
        when coalesce(scope->'withdrawn_pac_projections','[]'::jsonb) ? p_pac_key
          then scope->'withdrawn_pac_projections'
        else coalesce(scope->'withdrawn_pac_projections','[]'::jsonb)||jsonb_build_array(p_pac_key)
      end),
      metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object('projection_withdrawals',
        coalesce(metadata->'projection_withdrawals','{}'::jsonb)||jsonb_build_object(p_pac_key,
          coalesce(metadata->'projection_withdrawals'->p_pac_key,jsonb_build_object(
            'pac_key',p_pac_key,'owner_subject_key',p_subject_key,'encounter_key',p_encounter_key,
            'standing','REVOKED','withdrawn_at',v_now,'authority','individual_owner'))))
    where envpac_key=v_pac.envpac_key and subject_type='individual'
      and subject_key=p_subject_key and relation_role='owner'
      and standing='active' and revoked_at is null
      and (expires_at is null or expires_at>v_now)
      and coalesce(scope,'{}'::jsonb)->'rights' ? 'revoke';
    if not found then
      return jsonb_build_object('standing','DNR','reason','owner_projection_revoke_right_required');
    end if;
    update public.c3_envpac_canopy_reference
    set reference_state='removed',removed_at=coalesce(removed_at,v_now),updated_at=v_now
    where envpac_key=v_pac.envpac_key and owner_subject_key=p_subject_key
      and metadata->>'source_pac_key'=p_pac_key and reference_state<>'removed';
    return jsonb_build_object('standing','HLD','pac_key',p_pac_key,
      'encounter_projection_standing','REVOKED','authorized_by_owner',false,
      'presentation_scope','none','surface_projections','[]'::jsonb,
      'authorization_state_source','owner_access_grant','resolved_at',v_now);
  end if;
  if v_pac.registration_protocol='registrar_v1' and p_action='AUTHORIZE'
     and exists(select 1 from public.c3_envpac_access_grant g
       where g.envpac_key=v_pac.envpac_key and g.subject_type='individual'
         and g.subject_key=p_subject_key and g.relation_role='owner'
         and coalesce(g.scope->'withdrawn_pac_projections','[]'::jsonb) ? p_pac_key) then
    return jsonb_build_object('standing','HLD','reason','withdrawn_projection_requires_qualified_owner_reauthorization');
  end if;

`
const marker='  v_authorized:=p_action=\'AUTHORIZE\';'
if(!projection.includes(marker))throw Error('projection source changed')
projection=projection.replace(marker,branch+marker)
writeFileSync(new URL('projection-withdrawal.candidate.sql',root),projection)
let free=read(new URL('native/free-resolver.sql',prior))
const freeMarker='  if v_pac.schema_key is distinct from v_snapshot.schema_key'
free=free.replace(freeMarker,`  if v_pac.owner_subject_type='individual' then
    if not exists(select 1 from public.c3_envpac ep where ep.envpac_key=v_pac.envpac_key
      and ep.owner_subject_type='individual' and ep.owner_subject_key=v_pac.owner_subject_key
      and ep.is_effective=true) then
      return jsonb_build_object('standing','DNR','reason','individual_owner_environment_not_effective');
    end if;
    if exists(select 1 from public.c3_envpac_access_grant g
      where g.envpac_key=v_pac.envpac_key and g.subject_type='individual'
        and g.subject_key=v_pac.owner_subject_key and g.relation_role='owner'
        and coalesce(g.scope->'withdrawn_pac_projections','[]'::jsonb) ? v_pac.pac_key) then
      return jsonb_build_object('standing','DNR','reason','projection_authorization_withdrawn');
    end if;
  end if;

`+freeMarker)
writeFileSync(new URL('free-owner-authorization.candidate.sql',root),free)
let succession=read(new URL('../field-legacy-succession-20261125/legacy-succession.candidate.sql',root))
succession=succession.replaceAll("'{owner_resolution,owner_subject_type}' is distinct from 'institution'","'{owner_resolution,owner_subject_type}' is distinct from 'system'")
 .replaceAll("'{owner_resolution,owner_subject_key}' is distinct from 'c3_community_partners_dao_llc'","'{owner_resolution,owner_subject_key}' is distinct from 'c3_field'")
 .replace("p_presented_pac->>'owner_subject_type' is distinct from 'institution'","p_presented_pac->>'owner_subject_type' is distinct from 'system'")
 .replace("p_presented_pac->>'owner_subject_key' is distinct from 'c3_community_partners_dao_llc'","p_presented_pac->>'owner_subject_key' is distinct from 'c3_field'")
const start=succession.indexOf('    if coalesce(public.resolve_institutional_pac_eligibility_v1(')
const end=succession.indexOf('    v_exact_legacy:=true;',start)
if(start<0||end<0)throw Error('legacy source changed')
succession=succession.slice(0,start)+`    if p_presented_pac->>'owner_environment_key' is distinct from 'env_c3_field'
       or not exists(select 1 from public.c3_envpac ep
         where ep.envpac_key='c3envpac_field_v0_1' and ep.env_key='env_c3_field'
           and ep.owner_subject_type='system' and ep.owner_subject_key='c3_field' and ep.is_effective=true)
       or not exists(select 1 from public.codex_source_reference s
         where s.source_key='c3field_public_identity_authority_v1_0' and s.source_status='committed'
           and s.source_hash='819102c92167a77895671bd2b31bd29abeb571696274b1072de33e1ccccf61cf'
           and s.metadata->>'legal_entity'='c3 Community Partners DAO, LLC') then
      return jsonb_build_object('standing','HLD','reason','system_parent_formation_evidence_required');
    end if;
`+succession.slice(end)
succession=succession.replace("'owner_subject_type',v_prior.owner_subject_type","'owner_subject_type',case when v_exact_legacy then p_presented_pac->>'owner_subject_type' else v_prior.owner_subject_type end")
 .replace("'owner_subject_key',v_prior.owner_subject_key","'owner_subject_key',case when v_exact_legacy then p_presented_pac->>'owner_subject_key' else v_prior.owner_subject_key end")
writeFileSync(new URL('system-succession.candidate.sql',root),succession)
const guard=(signature,hash)=>`DO $guard$ BEGIN IF encode(extensions.digest(convert_to(pg_get_functiondef('${signature}'::regprocedure),'UTF8'),'sha256'),'hex') <> '${hash}' THEN RAISE EXCEPTION 'held_source_preimage_mismatch: ${signature}'; END IF; END $guard$;\n`
writeFileSync(new URL('runtime.install-candidate.sql',root),'-- Source candidate only; not installed or independently accepted. ACLs are unchanged.\nBEGIN;\n'+
 guard('c3_pac_set_personal_encounter_projection_v1(text,text,text,text,text)','29fb0b821f7337a0b5e41dc871c4ee63ecbeb94205f6e66c031f75d5525f02f5')+
 guard('free_resolve_pac_encounter_v1(text,text,text)','6e960f5b9dec20f533f85a18be55c5e9e070881b4fc65fe65aef08448611802c')+
 guard('terminate_my_env_owner_v1(jsonb)','95b81d207113027b368536235bdaf33a4c0758aa12957d3bfa97c437444de844')+
 projection+'\n'+free+'\n'+read(new URL('terminate-replay.candidate.sql',prior))+'\nCOMMIT;\n')
writeFileSync(new URL('system-succession.install-candidate.sql',root),'-- Exact system-owned succession source candidate; not installed or independently accepted.\nBEGIN;\n'+
 guard('c3_validate_pac_supersession_v1(jsonb,boolean)','f28c9a11e3ffa035135e520f6fdcbb190dabef3e51d19647fddbf3b09f586861')+
 `DO $guard$ BEGIN IF to_regprocedure('c3field_legacy_predecessor_snapshot_v1()') IS NOT NULL THEN RAISE EXCEPTION 'held_existing_helper_requires_reconciliation'; END IF; END $guard$;\n`+
 succession+'\nCOMMIT;\n')
console.log('Prepared bounded candidates; no native installation or registration')
