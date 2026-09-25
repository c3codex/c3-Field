import {InitiativeSurfaceResolutionError,isInitiativeSurfaceHostname,resolveInitiativeSurfaceHost,type InitiativeSurfaceEnv} from "../_lib/initiative-surface-host"
import {projectMdmMediaRoles} from "../_lib/mdm-media-roles"

type Env=InitiativeSurfaceEnv

function json(body:unknown,status=200){
  return new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json","cache-control":"public, max-age=60, stale-while-revalidate=300","x-content-type-options":"nosniff"}})
}

function record(value:unknown):Record<string,unknown>{
  return value && typeof value==="object" && !Array.isArray(value) ? value as Record<string,unknown> : {}
}

async function readOne(env:Env,table:string,params:Record<string,string>){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  const url=new URL(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/"+table)
  for(const [key,value] of Object.entries(params)) url.searchParams.set(key,value)
  const response=await fetch(url.toString(),{headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY},signal:AbortSignal.timeout(12000)})
  if(!response.ok) throw new Error("registry_read_failed")
  const rows=await response.json() as Record<string,unknown>[]
  if(!Array.isArray(rows)||rows.length!==1) throw new Error("registry_authority_unavailable")
  return rows[0]
}

export const onRequestGet:PagesFunction<Env>=async({env,request})=>{
  try{
    const requestUrl=new URL(request.url)
    const environment=await readOne(env,"c3_environment",{
      select:"env_key,system_key,standing,is_canonical,is_active,metadata",
      env_key:"eq.env_c3_community_connect",
      system_key:"eq.c3_field",
      standing:"eq.governed_environment",
      is_canonical:"eq.true",
      is_active:"eq.true"
    })
    const em=environment.metadata as Record<string,unknown>|undefined
    if(!em) return json({standing:"public_presentation_authority_missing"},409)
    if(em.public_presentation_release_state!=="bounded_public_runtime") return json({standing:"public_presentation_held"},423)

    const identitySourceKey=typeof em.public_identity_authority_source==="string"?em.public_identity_authority_source:""
    if(!identitySourceKey||!/^[a-z0-9_]+$/i.test(identitySourceKey))
      return json({standing:"public_identity_authority_missing"},409)

    const identitySource=await readOne(env,"codex_source_reference",{
      select:"source_key,version_label,source_status,metadata",
      source_key:"eq."+identitySourceKey,
      source_status:"eq.committed"
    })
    const identity=record(identitySource.metadata)
    const requiredIdentity=[
      "brand","legal_entity","formal_authority_statement","environment_name","environment_definition",
      "model_name","model_descriptor","model_path","initiative_label",
      "contact_email","contact_phone","contact_phone_href","privacy_route","terms_route","contact_route","copyright"
    ]
    if(identitySource.source_key!==identitySourceKey||requiredIdentity.some(key=>typeof identity[key]!=="string"||!(identity[key] as string).trim()))
      return json({standing:"public_identity_authority_incomplete"},409)

    const initiativeSurface=isInitiativeSurfaceHostname(requestUrl.hostname)
      ? await resolveInitiativeSurfaceHost(env,requestUrl.hostname)
      : null

    const authoritySource=initiativeSurface
      ? typeof initiativeSurface.bindingMetadata.presentation_source_key==="string"
        ? initiativeSurface.bindingMetadata.presentation_source_key
        : ""
      : typeof em.public_presentation_authority_source==="string"
        ? em.public_presentation_authority_source
        : ""

    if(!authoritySource||!/^[a-z0-9_]+$/i.test(authoritySource)) return json({standing:"public_presentation_authority_missing"},409)

    const source=await readOne(env,"codex_source_reference",{
      select:"source_key,version_label,source_status,metadata",
      source_key:"eq."+authoritySource,
      source_status:"eq.committed"
    })
    const sm=source.metadata as Record<string,unknown>|undefined
    if(!sm) return json({standing:"public_presentation_authority_missing"},409)
    if(source.source_key!==authoritySource) return json({standing:"public_presentation_authority_mismatch"},409)

    let presentation:Record<string,unknown>={...sm,public_identity:identity}
    if(initiativeSurface){
      const projected=JSON.parse(JSON.stringify(presentation)) as Record<string,unknown>
      const requestPath=requestUrl.pathname.length>1?requestUrl.pathname.replace(/\/$/,""):"/"
      const rootUrl=initiativeSurface.canonicalUrl.replace(/\/$/,"")
      const canonicalUrl=requestPath===initiativeSurface.connectRoute
        ? rootUrl+initiativeSurface.connectRoute
        : initiativeSurface.canonicalUrl

      const initiativePresentation=record(initiativeSurface.publicPresentation)
      projected.seo={
        ...record(projected.seo),
        ...(initiativeSurface.initiativeKey==="47pct"?{
          title:initiativePresentation.og_title,
          description:initiativePresentation.og_description
        }:{}),
        canonical_url:canonicalUrl,
        og_url:canonicalUrl
      }

      if(Array.isArray(projected.navigation)){
        projected.navigation=projected.navigation.map(item=>{
          const entry=record(item)
          const route=typeof entry.route==="string"?entry.route:""
          if(route==="/") return {...entry,route:initiativeSurface.canonicalUrl}
          if(route===initiativeSurface.connectRoute) return {...entry,route:rootUrl+initiativeSurface.connectRoute}
          if(route.startsWith("/")) return {...entry,route:"https://c3field.online"+route}
          return entry
        })
      }

      projected.landing={
        ...record(projected.landing),
        primary_cta_route:initiativeSurface.connectRoute
      }
      presentation=projected
      if(initiativeSurface.initiativeKey==="million_dollar_mission"){
        // The host resolver establishes package release. FREE still verifies each asset's custody.
        const url=new URL(env.SUPABASE_URL!.replace(/\/$/,"")+"/rest/v1/c3_pac_runtime_binding")
        url.searchParams.set("select","media_role,runtime_uri,standing,metadata")
        url.searchParams.set("pac_key","eq."+initiativeSurface.webpacKey)
        const response=await fetch(url,{headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY!,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY},signal:AbortSignal.timeout(12000)})
        if(!response.ok)throw new Error("registry_read_failed")
        const rows=await response.json()
        if(!Array.isArray(rows))throw new Error("registry_read_failed")
        presentation.runtime_media=projectMdmMediaRoles(rows)
      }
    }

    return json({
      standing:"bounded_public_runtime",
      sourceKey:source.source_key,
      version:source.version_label,
      identitySourceKey:identitySource.source_key,
      identityVersion:identitySource.version_label,
      canonicalEnvironment:environment.env_key,
      ...(initiativeSurface?{surface:{
        surfaceKey:initiativeSurface.surfaceKey,
        initiativeKey:initiativeSurface.initiativeKey,
        webpacKey:initiativeSurface.webpacKey,
        canonicalUrl:initiativeSurface.canonicalUrl,
        connectRoute:initiativeSurface.connectRoute
      }}:{}),
      presentation
    })
  }catch(error){
    if(error instanceof InitiativeSurfaceResolutionError)
      return json({standing:"public_presentation_held",reason:error.reasonCode},error.status)
    const reason=error instanceof Error?error.message:"unavailable"
    return json({standing:"public_presentation_held",reason},503)
  }
}

export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
