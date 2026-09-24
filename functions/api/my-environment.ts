import {json, readOwnerClaim, type PassageEnv} from "../_lib/c1-passage"
import {createEnvironmentSession,environmentSessionCookie,resolveEnvironmentSession,type EnvironmentSession} from "../_lib/env-session"
import {resolveC1MeOperatorContext} from "../_lib/c1me-operator-context"

function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name) return decodeURIComponent(rest.join("="))
  }
  return null
}
async function readRows(env:PassageEnv,table:string,select:string,filters:Record<string,string>){
  if(!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  const url=new URL(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/"+table)
  url.searchParams.set("select",select)
  for(const [key,value] of Object.entries(filters)) url.searchParams.set(key,value)
  const response=await fetch(url.toString(),{
    headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY},
    redirect:"manual",signal:AbortSignal.timeout(12000)
  })
  if(!response.ok) throw new Error("read_failed")
  const rows=await response.json()
  if(!Array.isArray(rows)) throw new Error("read_shape")
  return rows as Record<string,unknown>[]
}

async function resolveCurrent(session:EnvironmentSession,env:PassageEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  const response=await fetch(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/rpc/resolve_c1me_current_internal",{
    method:"POST",redirect:"manual",signal:AbortSignal.timeout(12000),
    headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,"content-type":"application/json"},
    body:JSON.stringify({p_relationship_key:session.subjectKey})
  })
  if(!response.ok) throw new Error("current_read_failed")
  const current=await response.json() as Record<string,unknown>
  if(current.resolution!=="existing_c1" || current.relationship_ref!==session.subjectKey || current.envpac_ref!==session.envpacKey || current.env_key!==session.envKey || typeof current.current_ref!=="string") throw new Error("current_mismatch")
  return current
}

async function resolveProfileFromEnvpac(session:EnvironmentSession,env:PassageEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  const response=await fetch(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/rpc/resolve_profile_pac_v1_internal",{
    method:"POST",redirect:"manual",signal:AbortSignal.timeout(12000),
    headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,"content-type":"application/json"},
    body:JSON.stringify({p_envpac_key:session.envpacKey,p_subject_type:session.subjectType,p_subject_key:session.subjectKey})
  })
  if(!response.ok) return {projection_standing:"held",reason:"profile_read_failed",authority_effect:"none"}
  const truth=await response.json() as Record<string,any>
  if(truth.standing==="profile_not_formed") return null
  if(truth.envpac_key!==session.envpacKey||truth.profile?.subject_type!==session.subjectType||truth.profile?.subject_key!==session.subjectKey)
    return {projection_standing:"held",reason:"profile_envpac_mismatch",authority_effect:"none"}
  if(truth.evaluation?.resolution_state!=="pass")
    return {projection_standing:"held",reason:"profile_resolution_held",authority_effect:"none",
      evaluation:{completeness_state:truth.evaluation?.completeness_state||"held",resolution_state:truth.evaluation?.resolution_state||"held"}}
  return {projection_standing:"resolved",pac_key:truth.pac_key,version:truth.version,standing:truth.standing,
    release_state:truth.release_state,authority_effect:"none",
    profile:{profile_key:truth.profile.profile_key,profile_class:truth.profile.profile_class,
      display_label:truth.profile.display_label,visibility_scope:truth.profile.visibility_scope},
    evaluation:{completeness_state:truth.evaluation.completeness_state,resolution_state:truth.evaluation.resolution_state}}
}

async function runtimeSession(raw:string,env:PassageEnv):Promise<EnvironmentSession>{
  try{return await resolveEnvironmentSession(raw,env)}catch(error){
    if(!raw.includes(".")) throw error
    const claim=await readOwnerClaim(raw,env)
    const session=await createEnvironmentSession(claim,env,"legacy_claim_cookie_migration")
    return {...session,migratedFromClaim:true}
  }
}
export const onRequestGet: PagesFunction<PassageEnv> = async ({request,env}) => {
  try {
    const rawSession=cookie(request,"c3_env_session")
    if(!rawSession) return json({authenticated:false,standing:"environment_claim_required"},401)
    const session=await runtimeSession(rawSession,env)
    const current=await resolveCurrent(session,env)
    const operatorContext=await resolveC1MeOperatorContext(session.subjectKey,env)
    if(operatorContext.relationship_ref!==session.subjectKey || operatorContext.env_key!==session.envKey ||
      operatorContext.envpac_ref!==session.envpacKey || operatorContext.current_ref!==current.current_ref)
      throw new Error("operator_context_mismatch")
    const [graphRows,envRows,grantRows,ownerRows,presentationRows,profileProjection]=await Promise.all([
      readRows(env,"c3_envpac_effective_graph",
        "envpac_key,registry_env_key,version,envpac_standing,owner_subject_type,custodian_subject_type,custodian_subject_key,custody_provider,portable,environment_bindings,rooted_systems,packages",
        {envpac_key:"eq."+session.envpacKey}),
      readRows(env,"c3_environment",
        "env_key,environment_name,environment_class,standing,is_active,is_canonical,metadata",
        {env_key:"eq."+session.envKey}),
      readRows(env,"c3_envpac_access_grant",
        "grant_key,subject_type,relation_role,scope,standing,granted_by_type,granted_by_key,granted_at,expires_at,revoked_at,evidence_ref",
        {envpac_key:"eq."+session.envpacKey,standing:"eq.active"}),
      readRows(env,"crs_relationship",
        "relationship_key,display_name,is_active",
        {relationship_key:"eq."+session.subjectKey,is_active:"eq.true"}),
      readRows(env,"c3_envpac_presentation",
        "envpac_key,opening_visual_asset_key,opening_visual_url,source_webpac_key,owner_changeable,selection_standing,selected_by_type,selected_by_key,selected_at,updated_at",
        {envpac_key:"eq."+session.envpacKey,selection_standing:"eq.active"}),
      resolveProfileFromEnvpac(session,env)
    ])
    const graph=graphRows[0], environment=envRows[0], owner=ownerRows[0], presentation=presentationRows[0]
    if(!graph || !environment || !owner || graph.envpac_key!==session.envpacKey ||
      environment.env_key!==session.envKey || owner.relationship_key!==session.subjectKey)
      return json({authenticated:true,standing:"environment_unavailable"},404)
    const response=json({
      authenticated:true,
      standing:"environment_ready",
      owner:{
        display_name:typeof owner.display_name==="string" && owner.display_name.trim()?owner.display_name.trim():null
      },
      current:{current_ref:current.current_ref},
      operator_context:operatorContext,
      environment:{
        env_key:environment.env_key,
        environment_name:environment.environment_name,
        environment_class:environment.environment_class,
        standing:environment.standing,
        is_active:environment.is_active,
        is_canonical:environment.is_canonical
      },
      envpac:{
        envpac_key:graph.envpac_key,
        version:graph.version,
        standing:graph.envpac_standing,
        owner_subject_type:graph.owner_subject_type,
        custodian_subject_type:graph.custodian_subject_type,
        custodian_subject_key:graph.custodian_subject_key,
        custody_provider:graph.custody_provider,
        portable:graph.portable,
        environment_bindings:graph.environment_bindings,
        rooted_systems:graph.rooted_systems,
        packages:graph.packages,
        profile_pac:profileProjection
      },
      presentation:presentation?{
        opening_visual_asset_key:presentation.opening_visual_asset_key,
        opening_visual_url:presentation.opening_visual_url,
        source_webpac_key:presentation.source_webpac_key,
        owner_changeable:presentation.owner_changeable,
        selection_standing:presentation.selection_standing,
        selected_at:presentation.selected_at,
        updated_at:presentation.updated_at
      }:null,
      access:grantRows.map(row=>({
        grant_key:row.grant_key,
        subject_type:row.subject_type,
        relation_role:row.relation_role,
        scope:row.scope,
        standing:row.standing,
        granted_at:row.granted_at,
        expires_at:row.expires_at,
        revoked_at:row.revoked_at,
        evidence_ref:row.evidence_ref
      }))
    })
    if(session.migratedFromClaim) response.headers.append("set-cookie",environmentSessionCookie(session.token))
    return response
  } catch {
    return json({authenticated:false,standing:"environment_session_invalid"},401)
  }
}
export const onRequest: PagesFunction = async () => json({error:"method not allowed"},405)
