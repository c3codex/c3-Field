// FREE resolves exact Registry relations; it creates no publication authority.
export type Row = Record<string, unknown>
export type Read = (table: string, select: string, filters?: Record<string,string>) => Promise<Row[]>
export type Probe = (path:string, method?:"GET"|"POST", payload?:Row) => Promise<{ok:boolean;body:Row}>
const obj=(v:unknown):Row=>v && typeof v==="object" && !Array.isArray(v)?v as Row:{}
const str=(v:unknown)=>typeof v==="string"&&v.trim()?v.trim():null
export function routeAssetKey(route:Row) {
  const ref=str(route.payload_reference)
  return str(obj(route.metadata).distribution_asset_key) ??
    (ref?.startsWith("measures_publication_distribution_asset:")?ref.split(":")[1]:ref)
}
export async function resolveLapzuliFreeRoute(read:Read, routeKey:string, probe?:Probe):Promise<Row> {
  const result:Row={binding_version:"lapzuli_free_runtime_v1",route_key:routeKey,
    observed_at:new Date().toISOString(),external_publication_effects:0,
    publication_authority_created:false,second_operator_confirmation_required:false}
  const predicates:Row[]=[]
  const check=(predicate:string,pass:boolean,evidence:unknown)=>predicates.push({predicate,pass,evidence})
  const finish=()=>({...result,predicates,standing:result.standing ?? (result.historical_effect===true?"HISTORICAL_OR_SUPERSEDED":predicates.every(p=>p.pass===true)?"EXECUTABLE":"HLD"),
    reason:result.reason ?? predicates.find(p=>p.pass!==true)?.predicate ?? null})
  const exact=async(table:string,key:string,value:string)=> (await read(table,"*",{[key]:"eq."+value}))[0]
  const route=await exact("lapzuli_route","route_key",routeKey)
  if(!route)return {...result,standing:"HLD",reason:"registered_route_missing",predicates}
  if(route.route_status!=="authorized" || route.operator_confirmed!==true || !str(route.authority_reference))
    return {...result,standing:"CANDIDATE",reason:"exact_route_authority_unresolved",predicates}
  check("exact_route_authority",true,{authority_reference:route.authority_reference,operator_confirmed:true})
  check("return_evidence_path",route.return_required===true,"lapzuli_encounter_evidence:"+routeKey)
  const meta=obj(route.metadata),assetKey=routeAssetKey(route)
  result.distribution_asset_key=assetKey
  const [asset,qualifications,outlet,encounters]=await Promise.all([
    assetKey?exact("measures_publication_distribution_asset","distribution_asset_key",assetKey):undefined,
    read("lapzuli_outlet_qualification","*",{outlet_key:"eq."+route.outlet_key,desk_key:"eq."+route.desk_key}),
    exact("lapzuli_outlet","outlet_key",String(route.outlet_key)),
    read("lapzuli_encounter_evidence","observed_outcome,external_id,external_url",{route_key:"eq."+routeKey}),
  ])
  const q=qualifications.find(row=>["qualified","qualified_with_constraints"].includes(String(row.standing)))
  check("desk_outlet_qualification",!!q,{outlet_key:route.outlet_key,desk_key:route.desk_key,standing:q?.standing,
    operator_disposition_required:q?.operator_disposition_required,
    disposition_satisfied_by:"exact authorized route and upstream release; qualification constraints remain operative"})
  check("registered_account_standing",outlet?.account_standing==="verified",outlet?.account_standing ?? null)
  check("registered_payload_binding",!!asset && asset.publication_asset_id===route.publication_object_key,assetKey)
  const am=obj(asset?.metadata),payload=obj(asset?.payload)
  const callable=assetKey?(await read("lapzuli_derivative_execution_view_v1","*",{distribution_asset_key:"eq."+assetKey}))[0]:undefined
  const reports=await read("undrifted_distribution_report_v1","*",{publication_object_key:"eq."+route.publication_object_key})
  const source=reports[0]
  // A package approval cannot silently supersede a source hold.
  check("publication_release_authority",source?source.publication_status==="published" && source.source_distribution_hold===false:callable?.lapzuli_callable===true,
    {publication_object_key:route.publication_object_key,publication_status:source?.publication_status ?? null,
      source_distribution_hold:source?.source_distribution_hold ?? null})
  check("package_release_authority",am.external_distribution_authorized!==false &&
    (am.external_distribution_authorized===true || am.external_publication_authorized===true ||
      (!!str(asset?.approved_by_actor_key)&&["ready_for_operator_execution","ready_for_lapzuli_resolution","registered"].includes(String(asset?.status)))),
    {approved_by_actor_key:asset?.approved_by_actor_key ?? null,status:asset?.status ?? null,
      external_distribution_authorized:am.external_distribution_authorized ?? null,
      historical_execution_external_publication_authorized:am.external_publication_authorized ?? null,
      authority_basis:"current source release plus exact approved package and confirmed route; no metadata flags changed"})
  if(encounters.some(e=>e.external_id||e.external_url)) {
    result.historical_effect=true
    check("duplicate_guard",false,"registered prior external encounter")
  }
  const executions=assetKey?await read("measures_distribution_execution","execution_id,execution_status,platform_post_id,platform_url,evidence",{distribution_asset_id:"eq."+assetKey}):[]
  if(executions.some(e=>["published","queued"].includes(String(e.execution_status))||e.platform_post_id||e.platform_url||obj(e.evidence).external_publication_effects===1))result.historical_effect=true
  check("execution_effect_guard",!executions.some(e=>["published","queued","publication_uncertain","pending","publication_attempted"].includes(String(e.execution_status)) || e.platform_post_id || e.platform_url || obj(e.evidence).external_publication_effects===1),
    executions.map(e=>({execution_id:e.execution_id,execution_status:e.execution_status})))
  const channelKey=str(meta.channel_key) ?? str(am.channel_key) ?? str(callable?.channel_key)
  const executorKey=str(meta.executor_key) ?? str(am.executor_key) ?? str(callable?.executor_key)
  result.channel_key=channelKey;result.executor_key=executorKey
  const executor=executorKey?await exact("measures_distribution_executor","executor_key",executorKey):undefined
  check("executor_available",executor?.status==="available"&&executor.supports_publish===true,{executor_key:executorKey,status:executor?.status ?? null})
  const processKey=str(obj(executor?.metadata).bound_process_key)
  if(processKey){const process=await exact("system_process_registry","process_key",processKey)
    check("executor_process_active",process?.process_status==="active",{process_key:processKey,process_status:process?.process_status ?? null})}
  const canonical=str(payload.canonical_url) ?? str(route.canonical_url)
  let canonicalPass=false
  try{const u=new URL(canonical ?? "");canonicalPass=u.protocol==="https:"&&["measuresregistry.com","c3field.online","47pct.c3field.online","mdm.c3field.online"].includes(u.hostname)}catch{}
  check("canonical_url_scope",canonicalPass,canonical)
  const channel=channelKey?await exact("measures_distribution_channel","channel_key",channelKey):undefined
  result.channel_identifier=channel?.channel_identifier??null
  result.registered_operator=str(meta.operator)??str(meta.operator_confirmed_by)
  if(["buffer","bluesky_api","paragraph_api"].includes(executorKey??""))check("registered_channel_active",channel?.status==="active"&&channel.executor_key===executorKey&&!!str(channel.channel_identifier),{channel_key:channelKey,status:channel?.status ?? null})
  const text=str(payload.text) ?? str(payload.caption)
  const media=obj(payload.media)
  const image=str(payload.image_url) ?? str(media.runtime_uri)
  check("provider_payload",["paragraph_api","dev_api"].includes(executorKey??"")?!!str(payload.title)&&!!str(payload.body_markdown):executorKey==="medium_import_manual"?canonicalPass:!!text,
    {text_present:!!text,body_present:!!str(payload.body_markdown),media_uri_present:!!image})
  const constraints=obj(q?.provenance_constraints)
  const profile=await exact("lapzuli_object_profile","publication_object_key",String(route.publication_object_key))
  check("qualification_constraints",!!q && (!q.requires_ai_disclosure || profile?.ai_disclosure_available===true || payload.ai_disclosure_required===true || obj(payload.constraints).ai_disclosure_required===true) &&
    (!q.requires_original_contribution || (profile?.researched_and_cited===true && profile?.operator_initiated_research===true)) &&
    (!constraints.not_pure_promotion || obj(payload.constraints).not_pure_promotion===true),{requires_ai_disclosure:q?.requires_ai_disclosure,requires_original_contribution:q?.requires_original_contribution,
      researched_and_cited:profile?.researched_and_cited ?? null,operator_initiated_research:profile?.operator_initiated_research ?? null,ai_disclosure_available:profile?.ai_disclosure_available ?? null})
  if(!probe){check("current_provider_preflight",false,"server-side runtime probe required");return finish()}
  // Probe only fixed, non-effecting paths. Never submit publication/import commands.
  if(executorKey==="bluesky_api"){
    const paths:Record<string,string>={bluesky_undrifted:"/verify/bluesky/undrifted",bluesky_measures_registry:"/verify/bluesky/measures",bluesky_c3_field:"/verify/bluesky/c3-field",bluesky_c3_partners:"/verify/bluesky/c3-partners"}
    const path=paths[channelKey??""]
    const verified=path?await probe(path):{ok:false,body:{reason:"registered_identity_adapter_missing"}}
    check("current_provider_identity",verified.ok && verified.body.handle===channel?.channel_identifier,{handle:verified.body.handle ?? null,reason:verified.body.reason ?? verified.body.standing ?? null})
  }else if(executorKey==="buffer"){
    const inventory=await probe(channelKey?.startsWith("c3_")?"/buffer/c3/channels":"/buffer/channels")
    const credentials=obj(inventory.body.credentials)
    const channels=Array.isArray(inventory.body.channels)?inventory.body.channels as Row[]:Object.values(credentials).flatMap(v=>Array.isArray(obj(v).channels)?obj(v).channels as Row[]:[])
    check("current_provider_channel",inventory.ok&&channels.some(c=>c.id===channel?.channel_identifier&&str(c.externalLink)?.replace(/\/$/,"")===str(channel?.channel_url)?.replace(/\/$/,"")&&c.isDisconnected!==true&&c.isLocked!==true),{channel_identifier:channel?.channel_identifier ?? null,inventory_verified:inventory.ok})
  }else if(executorKey==="medium_import_manual"){
    const session=await probe("/browser/medium/session-proof")
    check("current_medium_session",session.ok&&session.body.ok===true,{standing:session.body.standing ?? null})
  }else if(executorKey==="paragraph_api"){
    check("registered_dispatch_operator",!!result.registered_operator,result.registered_operator)
    const verified=await probe("/paragraph/preflight")
    const em=obj(executor?.metadata)
    check("current_provider_identity",verified.ok&&verified.body.publication_id===em.verified_publication_id&&verified.body.publication_slug===em.verified_publication_slug&&verified.body.publication_id===channel?.channel_identifier,{publication_id:verified.body.publication_id,publication_slug:verified.body.publication_slug,standing:verified.body.standing})
    check("runtime_adapter_binding",verified.ok&&verified.body.adapter==="paragraph_direct_api_v1",verified.body.adapter??null)
    const prepared=await probe("/paragraph/posts","POST",{...payload,dry_run:true,execute:false,operator_confirmed:true,lapzuli_callable:true,route_key:routeKey,publication_object_key:route.publication_object_key,distribution_asset_id:assetKey,authority_reference:route.authority_reference,channel_key:channelKey,channel_identifier:channel?.channel_identifier,idempotency_key:str(payload.idempotency_key)??routeKey+":"+assetKey,canonical_url:canonical,sendNewsletter:false})
    check("provider_payload_preflight",prepared.ok&&prepared.body.external_publication_effects===0,{standing:prepared.body.standing,external_publication_effects:prepared.body.external_publication_effects})
    if(prepared.body.standing==="HISTORICAL_OR_SUPERSEDED")result.standing="HISTORICAL_OR_SUPERSEDED"
  }else if(executorKey==="dev_api"){
    const verified=await probe("/dev/preflight")
    const expected=str(obj(channel?.metadata).account_username)??str(obj(executor?.metadata).verified_account_username)
    check("current_provider_identity",verified.ok&&!!expected&&verified.body.account_username===expected,{expected_username:expected,observed_username:verified.body.account_username??null,standing:verified.body.standing})
  }else{
    check("runtime_adapter_binding",false,"registered provider adapter missing")
  }
  if(["buffer","bluesky_api"].includes(executorKey??"")){
    const path=executorKey==="bluesky_api"?"/bluesky/posts":channelKey?.startsWith("c3_")?"/buffer/c3/posts":"/buffer/posts"
    const prepared=await probe(path,"POST",{dry_run:true,execute:false,operator_confirmed:true,lapzuli_callable:true,
      route_key:routeKey,authority_reference:route.authority_reference,publication_object_key:route.publication_object_key,
      distribution_asset_id:assetKey,channel_key:channelKey,channel_identifier:channel?.channel_identifier,
      executor_key:executorKey,derivative_key:callable?.derivative_key,registered_standing_key:callable?.registered_standing_key,
      registered_standing:callable?.registered_standing,idempotency_key:str(payload.idempotency_key)??routeKey+":"+assetKey,
      text:text,canonical_url:canonical,image_url:image,buffer_mode:"shareNow"})
    check("provider_payload_preflight",prepared.ok&&prepared.body.external_publication_effects===0,
      {standing:prepared.body.standing ?? null,missing:prepared.body.missing ?? null,external_publication_effects:prepared.body.external_publication_effects ?? null})
  }
  return finish()
}
