import {json, readOwnerClaim, type PassageEnv} from "../_lib/c1-passage"

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
export const onRequestGet: PagesFunction<PassageEnv> = async ({request,env}) => {
  try {
    const session=cookie(request,"c3_env_session")
    if(!session) return json({authenticated:false,standing:"environment_claim_required"},401)
    const claim=await readOwnerClaim(session,env)
    const [graphRows,envRows,grantRows]=await Promise.all([
      readRows(env,"c3_envpac_effective_graph",
        "envpac_key,registry_env_key,version,envpac_standing,owner_subject_type,custodian_subject_type,custodian_subject_key,custody_provider,portable,environment_bindings,rooted_systems,packages",
        {envpac_key:"eq."+claim.envpacKey}),
      readRows(env,"c3_environment",
        "env_key,environment_name,environment_class,standing,is_active,is_canonical,metadata",
        {env_key:"eq."+claim.envKey}),
      readRows(env,"c3_envpac_access_grant",
        "grant_key,subject_type,relation_role,scope,standing,granted_by_type,granted_by_key,granted_at,expires_at,revoked_at,evidence_ref",
        {envpac_key:"eq."+claim.envpacKey,standing:"eq.active"})
    ])
    const graph=graphRows[0], environment=envRows[0]
    if(!graph || !environment || graph.envpac_key!==claim.envpacKey || environment.env_key!==claim.envKey)
      return json({authenticated:true,standing:"environment_unavailable"},404)
    return json({
      authenticated:true,
      standing:"environment_ready",
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
  } catch {
    return json({authenticated:false,standing:"environment_session_invalid"},401)
  }
}
export const onRequest: PagesFunction = async () => json({error:"method not allowed"},405)
