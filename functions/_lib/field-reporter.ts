import {resolveInitiativeSurfaceHost, type InitiativeSurfaceEnv} from "./initiative-surface-host"

type Row=Record<string,any>
type Read=(table:string,filters:Record<string,string>)=>Promise<Row[]>
export async function resolveFieldReporter(slug:string,read:Read){
  const one=async(table:string,filters:Record<string,string>)=>{
    const rows=await read(table,filters)
    if(rows.length!==1)throw new Error("publication_identity_missing_or_ambiguous")
    return rows[0]
  }
  const registration=await one("c3_registrar_publication_registration",{
    native_context_key:"eq.47pct",native_context_class:"eq.initiative",
    metadata:"cs."+JSON.stringify({target_canonical_path:"/field-reporter/"+slug})
  })
  const [publication,desk,pac]=await Promise.all([
    one("c3ops_publication_object",{publication_object_key:"eq."+registration.publication_object_key}),
    one("c3_registrar_publication_desk",{desk_key:"eq."+registration.desk_key}),
    one("c3_pac",{pac_key:"eq."+registration.pubpac_key})
  ])
  const authority=await one("c3_registrar_publication_authority",{authority_key:"eq."+desk.publication_authority_key})
  if(desk.standing!=="active"||authority.standing!=="active"||
    desk.native_context_key!=="47pct"||authority.authority_key!=="c3_registrar"||
    publication.publisher_key!==authority.authority_key||publication.publication_key!=="47pct"||
    pac.pac_type!=="PubPac"||pac.is_effective!==true||
    pac.metadata?.registrar_registration_key!==registration.registration_key||
    pac.metadata?.publication_authority!==authority.authority_key||
    pac.metadata?.editorial_voice_key!==registration.editorial_voice_key)
    throw new Error("publication_authority_mismatch")
  const member=await one("c3_pac_member",{member_key:"eq."+registration.metadata?.article_member_key})
  if(member.source_object_key!==publication.publication_object_key||member.metadata?.title!==publication.title)
    throw new Error("publication_body_identity_mismatch")
  const identity={publicationLabel:authority.authority_label+" — "+authority.public_publication_name,
    deskLabel:desk.desk_label,editorialVoice:pac.metadata.series,title:publication.title,
    registrationKey:registration.registration_key,publicationObjectKey:publication.publication_object_key}
  if(Object.values(identity).some(value=>typeof value!=="string"||!value.trim()))
    throw new Error("publication_identity_incomplete")
  if(member.metadata?.body_state!=="PERSISTED_EXACT_APPROVED_BODY"||
    !member.runtime_uri||!/^[0-9a-f]{64}$/.test(member.integrity_value||""))
    return {...identity,standing:"HLD",reason:"REGISTRY_APPROVED_BODY_NOT_YET_PERSISTED_TO_RUNTIME"}
  const requiredResolver=registration.metadata?.required_contract
  if(typeof requiredResolver!=="string"||!requiredResolver)throw new Error("publication_free_binding_missing")
  const resolver=await read("system_process_registry",{process_key:"eq."+requiredResolver})
  // An approved PubPAC and durable body are not a FREE publication disposition.
  // A future registration alone cannot silently activate an unimplemented adapter.
  return {...identity,standing:"HLD",reason:resolver.length!==1
    ?"registrar_pubpac_free_callable_unresolved":"registrar_pubpac_free_adapter_unresolved",
    requiredResolver,
    bodyState:member.metadata.body_state,publicationStanding:registration.publication_standing,
    distributionStanding:registration.distribution_standing}
}

export async function fieldReporterResponse(request:Request,env:InitiativeSurfaceEnv){
  const json=(body:unknown,status:number)=>new Response(JSON.stringify(body),{status,headers:{
    "content-type":"application/json","cache-control":"no-store","x-content-type-options":"nosniff"}})
  try{
    const url=new URL(request.url)
    if(url.hostname!=="47pct.c3field.online")return json({standing:"HLD",reason:"publication_host_mismatch"},404)
    const slug=url.searchParams.get("slug")||""
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))return json({standing:"HLD",reason:"publication_slug_invalid"},400)
    const surface=await resolveInitiativeSurfaceHost(env,url.hostname)
    if(surface.initiativeKey!=="47pct")throw new Error("publication_host_binding_mismatch")
    const read:Read=async(table,filters)=>{
      if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw new Error("server_configuration")
      const target=new URL(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/"+table)
      target.searchParams.set("select","*")
      for(const [key,value] of Object.entries(filters))target.searchParams.set(key,value)
      const response=await fetch(target,{headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,
        authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY},redirect:"manual",signal:AbortSignal.timeout(12000)})
      if(!response.ok)throw new Error("publication_registry_unavailable")
      const rows=await response.json()
      if(!Array.isArray(rows))throw new Error("publication_registry_unavailable")
      return rows
    }
    return json(await resolveFieldReporter(slug,read),423)
  }catch(error){return json({standing:"HLD",reason:error instanceof Error?error.message:"publication_unavailable"},409)}
}
