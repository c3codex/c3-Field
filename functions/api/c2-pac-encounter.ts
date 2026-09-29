import {json, type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"

type Row=Record<string,unknown>

function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name) return decodeURIComponent(rest.join("="))
  }
  return null
}

function base(env:PassageEnv){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  return env.SUPABASE_URL.replace(/\/$/,"")
}

function headers(env:PassageEnv,extra:Record<string,string>={}){
  return {
    apikey:env.SUPABASE_SERVICE_ROLE_KEY!,
    authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!,
    ...extra
  }
}

async function read(env:PassageEnv,table:string,params:Record<string,string>){
  const url=new URL(base(env)+"/rest/v1/"+table)
  for(const [key,value] of Object.entries(params)) url.searchParams.set(key,value)
  const response=await fetch(url.toString(),{headers:headers(env),signal:AbortSignal.timeout(12000)})
  if(!response.ok) throw new Error("registry_read_failed")
  const rows=await response.json()
  if(!Array.isArray(rows)) throw new Error("registry_read_shape")
  return rows as Row[]
}

async function rpc(env:PassageEnv,name:string,body:Record<string,unknown>){
  const response=await fetch(base(env)+"/rest/v1/rpc/"+name,{
    method:"POST",
    headers:headers(env,{"content-type":"application/json"}),
    body:JSON.stringify(body),
    signal:AbortSignal.timeout(12000)
  })
  if(!response.ok) throw new Error("registry_rpc_failed")
  return await response.json() as Record<string,unknown>
}

async function sessionFor(request:Request,env:PassageEnv){
  const raw=cookie(request,"c3_env_session")
  if(!raw) throw new Error("environment_claim_required")
  const session=await resolveEnvironmentSession(raw,env)

  const [tokens,c2Events,c2Grants]=await Promise.all([
    read(env,"c3_current_token",{
      select:"current_token_key,owner_relationship_key,env_key,envpac_key,token_class,retention_standing,relation_standing,metadata",
      owner_relationship_key:"eq."+session.subjectKey,
      envpac_key:"eq."+session.envpacKey,
      retention_standing:"eq.retained",
      relation_standing:"eq.active"
    }),
    read(env,"c2_mdm_current",{
      select:"current_key,event_type,participant_relationship_key,standing,metadata",
      participant_relationship_key:"eq."+session.subjectKey,
      event_type:"eq.initiative_participation_connected",
      standing:"eq.registered"
    }),
    read(env,"c3_envpac_access_grant",{
      select:"grant_key,envpac_key,subject_key,relation_role,standing,revoked_at,scope",
      envpac_key:"eq.c3envpac_c2me_v0_1",
      subject_key:"eq."+session.subjectKey,
      standing:"eq.active",
      revoked_at:"is.null"
    })
  ])

  const retainedC2=tokens.some(row=>{
    const metadata=(row.metadata&&typeof row.metadata==="object"&&!Array.isArray(row.metadata))
      ? row.metadata as Record<string,unknown>
      : {}
    return metadata.initiative_envpac_key==="c3envpac_c2me_v0_1"
  })
  const registeredC2Event=c2Events.some(row=>{
    const metadata=(row.metadata&&typeof row.metadata==="object"&&!Array.isArray(row.metadata))
      ? row.metadata as Record<string,unknown>
      : {}
    return metadata.target_environment_key==="c2ME_env"
  })
  const activeC2Grant=c2Grants.length>0

  if(!retainedC2) throw new Error("persisted_current_required")
  if(!registeredC2Event&&!activeC2Grant) throw new Error("c2_passage_standing_required")

  return {session,tokens,c2Events,c2Grants}
}

async function pacRows(env:PassageEnv,subjectKey:string,pacKey?:string|null){
  const params:Record<string,string>={
    select:"pac_key,pac_type,version,standing,is_effective,custody_uri,content_sha256,release_state,formation_state,custodian_subject_type,custodian_subject_key,metadata",
    pac_type:"eq.c3WebPac",
    is_effective:"eq.true",
    custodian_subject_type:"eq.individual",
    custodian_subject_key:"eq."+subjectKey,
    order:"updated_at.desc"
  }
  if(pacKey) params.pac_key="eq."+pacKey
  return await read(env,"c3_pac",params)
}

async function projectPac(env:PassageEnv,row:Row){
  const evaluation=await rpc(env,"c3_pac_evaluate",{p_pac_key:String(row.pac_key||"")})
  const metadata=(row.metadata&&typeof row.metadata==="object"&&!Array.isArray(row.metadata))
    ? row.metadata as Record<string,unknown>
    : {}
  const workflow=(metadata.publication_workflow&&typeof metadata.publication_workflow==="object"&&!Array.isArray(metadata.publication_workflow))
    ? metadata.publication_workflow as Record<string,unknown>
    : {}
  const presentation=(metadata.public_presentation&&typeof metadata.public_presentation==="object"&&!Array.isArray(metadata.public_presentation))
    ? metadata.public_presentation as Record<string,unknown>
    : {}
  return {
    pac_key:row.pac_key,
    standing:row.standing,
    release_state:row.release_state,
    custody_uri:row.custody_uri,
    canonical_host:metadata.canonical_host,
    title:presentation.title||row.pac_key,
    subtitle:presentation.subtitle||null,
    thesis:presentation.thesis||null,
    evaluation,
    workflow:{
      ni_public_encounter_approval:workflow.ni_public_encounter_approval||null,
      operator_encounter_approval:workflow.operator_encounter_approval||"PENDING",
      registry_submission_state:workflow.registry_submission_state||"NOT_SUBMITTED",
      registry_approval_state:workflow.registry_approval_state||"NOT_REVIEWED",
      free_resolution_state:workflow.free_resolution_state||"BLOCKED",
      runtime_state:workflow.runtime_state||"HELD"
    },
    registered_content_sha256:metadata.registered_content_sha256||null,
    registry_registration_state:metadata.registry_registration_state||null
  }
}

export const onRequestGet:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const {session}=await sessionFor(request,env)
    const url=new URL(request.url)
    const pacKey=url.searchParams.get("pac")
    const rows=await pacRows(env,session.subjectKey,pacKey)
    if(pacKey&&rows.length!==1) return json({authenticated:true,standing:"DNR",reason:"pac_not_in_custodian_scope"},404)
    const pacs=[]
    for(const row of rows) pacs.push(await projectPac(env,row))
    return json({
      authenticated:true,
      standing:"c2_pac_encounter_ready",
      environment:"C2ME_env",
      custody_transfer:false,
      subject_key:session.subjectKey,
      pacs
    })
  }catch(error){
    const reason=error instanceof Error?error.message:"c2_pac_encounter_unavailable"
    const status=reason==="environment_claim_required"||reason==="session_expired"?401:
      reason==="persisted_current_required"||reason==="c2_passage_standing_required"?403:503
    return json({authenticated:false,standing:"DNR",reason},status)
  }
}

export const onRequestPost:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const {session}=await sessionFor(request,env)
    const body=await request.json() as Record<string,unknown>
    const action=String(body.action||"")
    const pacKey=String(body.pac_key||"")
    if(!pacKey) return json({standing:"DNR",reason:"pac_key_required"},400)

    const rows=await pacRows(env,session.subjectKey,pacKey)
    if(rows.length!==1) return json({standing:"DNR",reason:"pac_not_in_custodian_scope"},403)

    if(action==="approve_public_encounter"){
      const result=await rpc(env,"c3_pac_approve_public_encounter_v1",{
        p_pac_key:pacKey,
        p_subject_key:session.subjectKey
      })
      return json(result,result.standing==="ACT"?200:409)
    }

    if(action==="register_public_encounter"){
      const result=await rpc(env,"c3_register_public_pac_encounter_v1",{
        p_pac_key:pacKey,
        p_subject_key:session.subjectKey
      })
      return json(result,result.standing==="ACT"?200:409)
    }

    return json({standing:"DNR",reason:"unsupported_action"},400)
  }catch(error){
    const reason=error instanceof Error?error.message:"c2_pac_encounter_unavailable"
    const status=reason==="environment_claim_required"||reason==="session_expired"?401:
      reason==="persisted_current_required"||reason==="c2_passage_standing_required"?403:503
    return json({standing:"DNR",reason},status)
  }
}
