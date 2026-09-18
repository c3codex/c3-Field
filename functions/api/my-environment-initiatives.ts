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
  return {apikey:env.SUPABASE_SERVICE_ROLE_KEY!,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY!,...extra}
}
async function read(env:PassageEnv,table:string,params:Record<string,string>){
  const url=new URL(base(env)+"/rest/v1/"+table)
  for(const [k,v] of Object.entries(params)) url.searchParams.set(k,v)
  const response=await fetch(url.toString(),{headers:headers(env),signal:AbortSignal.timeout(12000)})
  if(!response.ok) throw new Error("read_failed")
  const rows=await response.json()
  if(!Array.isArray(rows)) throw new Error("read_shape")
  return rows as Row[]
}
async function write(env:PassageEnv,table:string,method:"POST"|"PATCH",body:unknown,params:Record<string,string>={},prefer="return=representation"){
  const url=new URL(base(env)+"/rest/v1/"+table)
  for(const [k,v] of Object.entries(params)) url.searchParams.set(k,v)
  const response=await fetch(url.toString(),{
    method,
    headers:headers(env,{"content-type":"application/json",prefer}),
    body:JSON.stringify(body),
    signal:AbortSignal.timeout(12000)
  })
  if(!response.ok) throw new Error("write_failed")
  if(prefer.includes("return=minimal")) return []
  const rows=await response.json()
  return Array.isArray(rows)?rows as Row[]:[]
}
async function sessionFor(request:Request,env:PassageEnv){
  const raw=cookie(request,"c3_env_session")
  if(!raw) throw new Error("environment_claim_required")
  const session=await resolveEnvironmentSession(raw,env)
  const rows=await read(env,"c3_environment",{
    select:"env_key,environment_name,environment_class,standing,is_active,metadata",
    env_key:"eq."+session.envKey,
    limit:"1"
  })
  const environment=rows[0]
  const metadata=environment?.metadata as Row|undefined
  if(!environment ||
    environment.environment_class!=="c3me_individual_environment" ||
    environment.standing!=="c1_connected" ||
    environment.is_active!==true ||
    metadata?.c1_standing!=="c1_C1_persisted")
    throw new Error("c1_environment_not_eligible")
  return session
}

export const onRequestGet:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const session=await sessionFor(request,env)
    const relations=await read(env,"c2_mdm_participation_relation",{
      select:"participation_key,initiative_key,target_environment_key,relation_role,standing,passage_standing,connected_at,revoked_at,metadata",
      participant_relationship_key:"eq."+session.subjectKey,
      initiative_key:"eq.million_dollar_mission",
      limit:"1"
    })
    const relation=relations[0]||null
    return json({
      authenticated:true,
      standing:"initiative_discovery_ready",
      initiatives:[{
        initiative_key:"million_dollar_mission",
        title:"The Million Dollar Mission",
        summary:"One small town. One million dollars. Ninety days. See the prospect places, contribute what you know or can bring, and support the town you think the Mission should pursue.",
        target_environment_key:"c2ME_env",
        route:"/c2",
        relation_required:true,
        connected:relation?.standing==="active"&&relation?.passage_standing==="c2_participation_granted"&&!relation?.revoked_at,
        participation:relation
      }]
    })
  }catch(error){
    const reason=error instanceof Error?error.message:"initiative_discovery_unavailable"
    const status=reason==="environment_claim_required"||reason==="session_expired"?401:409
    return json({authenticated:false,standing:"initiative_discovery_held",reason},status)
  }
}

export const onRequestPost:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const session=await sessionFor(request,env)
    const body=await request.json() as Record<string,unknown>
    if(body.action!=="connect"||body.initiative_key!=="million_dollar_mission")
      return json({ok:false,standing:"initiative_action_not_supported"},400)

    const existing=await read(env,"c2_mdm_participation_relation",{
      select:"participation_key,standing,passage_standing,revoked_at",
      participant_relationship_key:"eq."+session.subjectKey,
      initiative_key:"eq.million_dollar_mission",
      limit:"1"
    })
    const payload={
      participant_relationship_key:session.subjectKey,
      source_env_key:session.envKey,
      source_envpac_key:session.envpacKey,
      initiative_key:"million_dollar_mission",
      target_environment_key:"c2ME_env",
      relation_role:"participant",
      standing:"active",
      passage_standing:"c2_participation_granted",
      connected_at:new Date().toISOString(),
      revoked_at:null,
      evidence_ref:"runtime:my-environment-connect-to-mission",
      metadata:{
        source:"my_environment_initiative_discovery",
        c1_session_identifies_not_authorizes:true,
        explicit_participant_connect:true,
        authority_created:false,
        custody_transfer:false
      },
      updated_at:new Date().toISOString()
    }
    if(existing.length){
      await write(env,"c2_mdm_participation_relation","PATCH",payload,{
        participant_relationship_key:"eq."+session.subjectKey,
        initiative_key:"eq.million_dollar_mission"
      },"return=minimal")
    }else{
      await write(env,"c2_mdm_participation_relation","POST",payload,{},"return=minimal")
    }

    await write(env,"c2_mdm_current","POST",{
      event_type:"initiative_participation_connected",
      participant_relationship_key:session.subjectKey,
      statement:"A connected participant established a Million Dollar Mission participation relation.",
      standing:"registered",
      participant_visible:true,
      evidence_reference:"relationship:"+session.subjectKey,
      metadata:{initiative_key:"million_dollar_mission",target_environment_key:"c2ME_env"}
    },{},"return=minimal")

    const connectionThreadKey="connections:"+session.envKey
    const threadRows=await read(env,"c1_environment_connection_thread",{
      select:"thread_key",
      thread_key:"eq."+connectionThreadKey,
      owner_relationship_key:"eq."+session.subjectKey,
      limit:"1"
    })
    if(!threadRows.length){
      await write(env,"c1_environment_connection_thread","POST",{
        thread_key:connectionThreadKey,
        env_key:session.envKey,
        envpac_key:session.envpacKey,
        owner_relationship_key:session.subjectKey,
        title:"Connections",
        standing:"active",
        visibility:"owner_private",
        metadata:{source:"my_environment",thread_is_authority:false,thread_is_relationship_registry:false}
      },{},"return=minimal")
    }
    const shouldAppendConnection=!existing.length || existing[0]?.standing!=="active" || existing[0]?.passage_standing!=="c2_participation_granted" || Boolean(existing[0]?.revoked_at)
    if(shouldAppendConnection){
      await write(env,"c1_environment_connection_thread_entry","POST",{
        thread_key:connectionThreadKey,
        owner_relationship_key:session.subjectKey,
        entry_type:"connection",
        title:"Connected to The Million Dollar Mission",
        body:"A participation relation was established from My Environment to the Million Dollar Mission c2ME.env.",
        related_type:"initiative",
        related_key:"million_dollar_mission",
        related_route:"/c2",
        standing:"active",
        metadata:{source:"initiative_participation_passage",creates_relationship:false,records_existing_relation:true}
      },{},"return=minimal")
    }

    return json({ok:true,standing:"c2_participation_granted",next_url:"/c2"})
  }catch(error){
    const reason=error instanceof Error?error.message:"initiative_connect_unavailable"
    const status=reason==="environment_claim_required"||reason==="session_expired"?401:409
    return json({ok:false,standing:"initiative_connect_held",reason},status)
  }
}

export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
