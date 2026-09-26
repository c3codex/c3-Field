import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveScopedEnvironmentSession} from "../_lib/env-session"

type Row=Record<string,unknown>
function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name){try{return decodeURIComponent(rest.join("="))}catch{return null}}
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
  for(const [key,value] of Object.entries(params)) url.searchParams.set(key,value)
  const response=await fetch(url.toString(),{headers:headers(env),signal:AbortSignal.timeout(12000)})
  if(!response.ok) throw new Error("read_failed")
  const rows=await response.json()
  if(!Array.isArray(rows)) throw new Error("read_shape")
  return rows as Row[]
}
async function rpc(env:PassageEnv,name:string,body:Record<string,unknown>){
  const response=await fetch(base(env)+"/rest/v1/rpc/"+name,{
    method:"POST",
    headers:headers(env,{"content-type":"application/json"}),
    body:JSON.stringify(body),
    signal:AbortSignal.timeout(12000)
  })
  if(!response.ok) throw new Error("resolver_failed:"+name)
  return response.json()
}
function obj(value:unknown):Record<string,unknown>{
  return value&&typeof value==="object"&&!Array.isArray(value)?value as Record<string,unknown>:{}
}

export const onRequestGet:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    const raw=cookie(request,"c3_c2_session")
    if(!raw) return json({authenticated:false,standing:"c2_session_required"},401)
    const session=await resolveScopedEnvironmentSession(raw,env,{
      envKey:"env_c3_community_contribute",
      envpacKey:"c3envpac_c2me_v0_1",
      relationRole:"consumer",
      initiativeKey:"47pct"
    })

    const visibilityRows=await read(env,"c3_env_initiative_visibility",{
      select:"visibility_key,relationship_key,env_key,envpac_key,initiative_key,initiative_envpac_key,target_environment_key,visibility_source,standing,revoked_at,source_ref,metadata",
      relationship_key:"eq."+session.subjectKey,
      initiative_key:"eq.47pct",
      initiative_envpac_key:"eq.c3envpac_c2me_v0_1",
      target_environment_key:"eq.env_c3_community_contribute",
      standing:"eq.active",
      revoked_at:"is.null",
      limit:"1"
    })
    const visibility=visibilityRows[0]
    if(!visibility) return json({authenticated:false,standing:"c2_participant_relation_required"},403)

    const [components,propertyMap,ground,current,evidencePac,assertions]=await Promise.all([
      read(env,"c3_envpac_runtime_component",{
        select:"binding_key,component_key,renderer_key,sort_order,standing,config",
        envpac_key:"eq.c3envpac_c2me_v0_1",
        context_class:"eq.initiative",
        context_key:"eq.47pct",
        order:"sort_order.asc"
      }),
      rpc(env,"resolve_47pct_property_map_internal",{p_include_sources:true}),
      rpc(env,"resolve_47pct_ground_map_internal",{p_layer:"ground"}),
      rpc(env,"resolve_c3_current",{p_env_key:"env_c3_community_contribute"}),
      read(env,"c3_pac",{
        select:"pac_key,standing,is_effective,metadata",
        pac_key:"eq.evidence_pac_47pct_v1",
        limit:"1"
      }),
      read(env,"c3_47pct_property_assertion",{
        select:"assertion_key,property_key,evidence_class,assertion_type,statement,source_name,source_url,source_date,observed_date,attribution,assertion_status,standing,public_projection_allowed,metadata",
        standing:"eq.admitted",
        public_projection_allowed:"eq.true",
        order:"source_date.desc"
      })
    ])

    const property=obj(propertyMap)
    const groundResolved=obj(ground)
    const moneyTypes=new Set([
      "council_settlement_contribution","council_program_service_income",
      "trust_financial_flow","non_scout_paid_use","planned_outside_group_rental"
    ])
    const moneyAssertions=assertions.filter(row=>moneyTypes.has(String(row.assertion_type||"")))
    const evidenceMeta=obj(evidencePac[0]?.metadata)

    return json({
      authenticated:true,
      standing:"47pct_c2_encounter_ready",
      initiative_key:"47pct",
      participant:{
        relationship_key:session.subjectKey,
        visibility_key:visibility.visibility_key,
        visibility_source:visibility.visibility_source,
        source_personal_env_key:visibility.env_key,
        source_personal_envpac_key:visibility.envpac_key
      },
      environment:{
        env_key:"env_c3_community_contribute",
        envpac_key:"c3envpac_c2me_v0_1",
        label:"c2ME.env",
        access_role:"consumer"
      },
      evidence:{
        pac_key:"evidence_pac_47pct_v1",
        standing:evidencePac[0]?.standing,
        corpus_state:evidenceMeta.evidence_corpus_state||"OPEN_INCOMPLETE",
        quantifier_gate:obj(evidenceMeta.quantifier_integrity_rule).surface_condition||"source_and_citation_required_before_display",
        raw_evidence_public_release_authorized:false
      },
      components,
      ground:{
        resolution:groundResolved.resolution,
        map_points:Array.isArray(property.map_points)?property.map_points:[],
        universe_sources:Array.isArray(groundResolved.universe_sources)?groundResolved.universe_sources:[]
      },
      money:{
        assertions:moneyAssertions,
        rule:"Every displayed quantifier must carry source and citation. No aggregate is synthesized here."
      },
      current:Array.isArray(current)?current:[],
      ledger:{
        standing:components.find(row=>row.component_key==="ledger")?.standing||"held",
        writable:false
      }
    })
  }catch(error){
    const reason=error instanceof Error?error.message:"47pct_c2_unavailable"
    const status=reason==="session_expired"||reason==="c2_session_required"?401:
      reason.includes("grant")||reason.includes("relation")?403:503
    return json({authenticated:false,standing:"47pct_c2_held",reason},status)
  }
}

export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
