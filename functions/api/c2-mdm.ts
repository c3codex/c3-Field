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
async function resolvePublicProfile(env:PassageEnv,session:Awaited<ReturnType<typeof sessionFor>>){
  try{
    const response=await fetch(base(env)+"/rest/v1/rpc/resolve_profile_pac_v1_internal",{
      method:"POST",
      headers:headers(env,{"content-type":"application/json"}),
      body:JSON.stringify({p_envpac_key:session.envpacKey,p_subject_type:session.subjectType,p_subject_key:session.subjectKey}),
      signal:AbortSignal.timeout(12000)
    })
    if(!response.ok) return null
    const truth=await response.json() as Record<string,any>
    const profile=truth.profile
    if(truth.release_state!=="public"||!profile||profile.visibility_scope!=="public") return null
    return {profile_key:profile.profile_key,display_label:profile.display_label,visibility_scope:"public"}
  }catch{return null}
}
async function sessionFor(request:Request,env:PassageEnv){
  const raw=cookie(request,"c3_env_session")
  if(!raw) throw new Error("environment_claim_required")
  const session=await resolveEnvironmentSession(raw,env)
  const relations=await read(env,"c2_mdm_participation_relation",{
    select:"participation_key,standing,passage_standing,revoked_at,source_env_key,source_envpac_key",
    participant_relationship_key:"eq."+session.subjectKey,
    initiative_key:"eq.million_dollar_mission",
    standing:"eq.active",
    passage_standing:"eq.c2_participation_granted",
    revoked_at:"is.null",
    limit:"1"
  })
  const relation=relations[0]
  if(!relation ||
    relation.source_env_key!==session.envKey ||
    relation.source_envpac_key!==session.envpacKey)
    throw new Error("c2_participation_relation_required")
  return session
}
async function activeProspect(env:PassageEnv,key:string){
  const rows=await read(env,"c2_mdm_prospect",{select:"prospect_key,display_name,standing",prospect_key:"eq."+key,standing:"eq.active_prospect",participant_visible:"eq.true",limit:"1"})
  if(rows.length!==1) throw new Error("prospect_unavailable")
  return rows[0]
}

export const onRequestGet:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const session=await sessionFor(request,env)
    const [prospects,evidence,supports,contributions,current,threads,threadEntries,publicProfile]=await Promise.all([
      read(env,"c2_mdm_prospect",{select:"prospect_key,display_name,county,state,standing,prospect_reason_summary,tract_context,demographics_summary,economic_context_summary,history_identity_summary,transportation_access_summary,existing_assets,missing_conditions,public_private_investment,property_place_leads,people_institutions_businesses,open_questions,participant_contribution_needs,current_stage,updated_at",standing:"eq.active_prospect",participant_visible:"eq.true",order:"display_name.asc"}),
      read(env,"c2_mdm_place_evidence",{select:"evidence_key,prospect_key,evidence_type,title,statement,source_name,source_url_or_registry_ref,geography_relation,tract_relation,property_relation,standing,freshness_state,notes,updated_at",participant_visibility:"eq.true",order:"updated_at.desc"}),
      read(env,"c2_mdm_support",{select:"participant_relationship_key,prospect_key,support_status,updated_at",support_status:"eq.active"}),
      read(env,"c2_mdm_contribution",{select:"contribution_key,participant_relationship_key,prospect_key,contribution_type,description,standing,created_at,updated_at",order:"created_at.desc"}),
      read(env,"c2_mdm_current",{select:"current_key,event_type,prospect_key,participant_relationship_key,contribution_key,statement,standing,evidence_reference,metadata,occurred_at",participant_visible:"eq.true",order:"occurred_at.desc",limit:"100"}),
      read(env,"c2_mdm_ledger_thread",{select:"thread_key,initiative_key,prospect_key,title,purpose,standing,metadata,created_at,updated_at",participant_visible:"eq.true",standing:"eq.active",order:"created_at.asc"}),
      read(env,"c2_mdm_ledger_thread_entry",{select:"entry_key,thread_key,participant_relationship_key,prospect_key,entry_type,body,source_url,evidence_reference,standing,parent_entry_key,metadata,created_at,updated_at",participant_visible:"eq.true",order:"created_at.asc",limit:"200"}),
      resolvePublicProfile(env,session)
    ])
    const supportCounts=new Map<string,number>()
    for(const row of supports){
      const k=String(row.prospect_key||"")
      supportCounts.set(k,(supportCounts.get(k)||0)+1)
    }
    const contributionCounts=new Map<string,number>()
    for(const row of contributions){
      if(row.prospect_key){
        const k=String(row.prospect_key)
        contributionCounts.set(k,(contributionCounts.get(k)||0)+1)
      }
    }
    const mySupport=supports.find(row=>row.participant_relationship_key===session.subjectKey)||null
    const myContributions=contributions.filter(row=>row.participant_relationship_key===session.subjectKey)
    return json({
      authenticated:true,
      standing:"c2_mdm_participation_surface_ready",
      participant:{relationship_key:session.subjectKey,profile:publicProfile},
      mission:{
        title:"The Million Dollar Mission",
        working_form:"One small town / One million dollars / 90 days",
        question:"Can $1 million placed into a community help activate local potential rather than simply pass through it?"
      },
      prospects:prospects.map(p=>({
        ...p,
        supporter_count:supportCounts.get(String(p.prospect_key))||0,
        contributor_count:contributionCounts.get(String(p.prospect_key))||0,
        evidence:evidence.filter(e=>e.prospect_key===p.prospect_key)
      })),
      my_support:mySupport,
      my_contributions:myContributions,
      current,
      ledger_threads:threads.map(thread=>({
        ...thread,
        entries:threadEntries.filter(entry=>entry.thread_key===thread.thread_key)
      }))
    })
  }catch(error){
    const reason=error instanceof Error?error.message:"c2_mdm_unavailable"
    const status=reason==="environment_claim_required"||reason==="session_expired"?401:reason==="c2_participation_relation_required"?403:503
    return json({authenticated:false,standing:"c2_mdm_held",reason},status)
  }
}

export const onRequestPost:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const session=await sessionFor(request,env)
    const body=await request.json() as Record<string,unknown>
    const action=String(body.action||"")
    if(action==="support"){
      const prospectKey=String(body.prospect_key||"")
      const prospect=await activeProspect(env,prospectKey)
      const existing=await read(env,"c2_mdm_support",{select:"participant_relationship_key,prospect_key,support_status",participant_relationship_key:"eq."+session.subjectKey,limit:"1"})
      const previous=existing[0]?.prospect_key?String(existing[0].prospect_key):null
      const payload={
        participant_relationship_key:session.subjectKey,
        prospect_key:prospectKey,
        previous_prospect_key:previous&&previous!==prospectKey?previous:null,
        support_status:"active",
        reason:typeof body.reason==="string"?body.reason.slice(0,1000):null,
        local_connection_declaration:typeof body.local_connection_declaration==="string"?body.local_connection_declaration.slice(0,500):null,
        local_connection_standing:"unverified",
        updated_at:new Date().toISOString()
      }
      if(existing.length){
        await write(env,"c2_mdm_support","PATCH",payload,{participant_relationship_key:"eq."+session.subjectKey},"return=minimal")
      }else{
        await write(env,"c2_mdm_support","POST",payload,{},"return=minimal")
      }
      await write(env,"c2_mdm_current","POST",{
        event_type:previous&&previous!==prospectKey?"support_changed":"support_registered",
        prospect_key:prospectKey,
        participant_relationship_key:session.subjectKey,
        statement:"A connected participant registered support for "+String(prospect.display_name)+".",
        standing:"registered",
        participant_visible:true,
        evidence_reference:"relationship:"+session.subjectKey,
        metadata:{previous_prospect_key:previous}
      },{},"return=minimal")
      return json({ok:true,standing:"support_registered",prospect_key:prospectKey})
    }
    if(action==="thread_entry"){
      const threadKey=String(body.thread_key||"mdm_main_thread")
      const threadRows=await read(env,"c2_mdm_ledger_thread",{select:"thread_key,standing",thread_key:"eq."+threadKey,standing:"eq.active",participant_visible:"eq.true",limit:"1"})
      if(threadRows.length!==1) return json({ok:false,standing:"ledger_thread_unavailable"},404)
      const entryType=String(body.entry_type||"discussion").trim()
      const allowed=new Set(["discussion","question","local_knowledge","evidence","project_update","proposal"])
      if(!allowed.has(entryType)) return json({ok:false,standing:"ledger_entry_type_not_supported"},400)
      const text=String(body.body||"").trim()
      if(!text) return json({ok:false,standing:"ledger_entry_body_required"},400)
      const prospectKey=typeof body.prospect_key==="string"&&body.prospect_key?body.prospect_key:null
      if(prospectKey) await activeProspect(env,prospectKey)
      const rows=await write(env,"c2_mdm_ledger_thread_entry","POST",{
        thread_key:threadKey,
        participant_relationship_key:session.subjectKey,
        prospect_key:prospectKey,
        entry_type:entryType,
        body:text.slice(0,5000),
        source_url:typeof body.source_url==="string"?body.source_url.slice(0,1000):null,
        standing:"participant_visible",
        participant_visible:true,
        metadata:{source:"connected_participant",submission_is_verification:false}
      },{},"return=representation")
      const created=rows[0]
      await write(env,"c2_mdm_current","POST",{
        event_type:"ledger_thread_entry_added",
        prospect_key:prospectKey,
        participant_relationship_key:session.subjectKey,
        statement:"A connected participant added an entry to the Million Dollar Mission Ledger Thread.",
        standing:"registered",
        participant_visible:true,
        evidence_reference:created?.entry_key?"ledger_thread_entry:"+String(created.entry_key):null,
        metadata:{thread_key:threadKey,entry_type:entryType}
      },{},"return=minimal")
      return json({ok:true,standing:"ledger_thread_entry_recorded",entry:created})
    }
    if(action==="contribute"){
      const prospectKey=typeof body.prospect_key==="string"&&body.prospect_key?body.prospect_key:null
      if(prospectKey) await activeProspect(env,prospectKey)
      const type=String(body.contribution_type||"").trim()
      const description=String(body.description||"").trim()
      if(!type||!description) return json({ok:false,standing:"contribution_fields_required"},400)
      const rows=await write(env,"c2_mdm_contribution","POST",{
        participant_relationship_key:session.subjectKey,
        prospect_key:prospectKey,
        contribution_type:type.slice(0,120),
        description:description.slice(0,4000),
        organization_business:typeof body.organization_business==="string"?body.organization_business.slice(0,300):null,
        location:typeof body.location==="string"?body.location.slice(0,300):null,
        source_url:typeof body.source_url==="string"?body.source_url.slice(0,1000):null,
        conditions_constraints:typeof body.conditions_constraints==="string"?body.conditions_constraints.slice(0,1500):null,
        standing:"submitted_unreviewed",
        consent_to_submit:true
      },{},"return=representation")
      const created=rows[0]
      await write(env,"c2_mdm_current","POST",{
        event_type:"contribution_submitted",
        prospect_key:prospectKey,
        participant_relationship_key:session.subjectKey,
        contribution_key:created?.contribution_key||null,
        statement:"A connected participant submitted a contribution for review.",
        standing:"submitted_unreviewed",
        participant_visible:true,
        evidence_reference:created?.contribution_key?"contribution:"+String(created.contribution_key):null
      },{},"return=minimal")
      return json({ok:true,standing:"submitted_unreviewed",contribution:created})
    }
    return json({ok:false,standing:"action_not_supported"},400)
  }catch(error){
    const reason=error instanceof Error?error.message:"c2_mdm_unavailable"
    const status=reason==="environment_claim_required"||reason==="session_expired"?401:reason==="c2_participation_relation_required"?403:reason==="prospect_unavailable"?404:503
    return json({ok:false,standing:"c2_mdm_held",reason},status)
  }
}

export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
