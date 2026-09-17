import {json, readOwnerClaim, type PassageEnv} from "../_lib/c1-passage"
import {createEnvironmentSession,environmentSessionCookie,resolveEnvironmentSession,type EnvironmentSession} from "../_lib/env-session"

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
    const [graphRows,envRows,grantRows,ownerRows]=await Promise.all([
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
        {relationship_key:"eq."+session.relationshipKey,is_active:"eq.true"})
    ])
    const graph=graphRows[0], environment=envRows[0], owner=ownerRows[0]
    if(!graph || !environment || !owner || graph.envpac_key!==session.envpacKey ||
      environment.env_key!==session.envKey || owner.relationship_key!==session.relationshipKey)
      return json({authenticated:true,standing:"environment_unavailable"},404)
    const response=json({
      authenticated:true,
      standing:"environment_ready",
      owner:{
        display_name:typeof owner.display_name==="string" && owner.display_name.trim()?owner.display_name.trim():null
      },
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
        packages:graph.packages
      },
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
