import {isInitiativeSurfaceHostname,resolveInitiativeSurfaceHost,type InitiativeSurfaceEnv} from "../_lib/initiative-surface-host"

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

    let presentation=sm
    if(initiativeSurface){
      const projected=JSON.parse(JSON.stringify(sm)) as Record<string,unknown>
      const requestPath=requestUrl.pathname.length>1?requestUrl.pathname.replace(/\/$/,""):"/"
      const rootUrl=initiativeSurface.canonicalUrl.replace(/\/$/,"")
      const canonicalUrl=requestPath===initiativeSurface.connectRoute
        ? rootUrl+initiativeSurface.connectRoute
        : initiativeSurface.canonicalUrl

      projected.seo={
        ...record(projected.seo),
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
    }

    return json({
      standing:"bounded_public_runtime",
      sourceKey:source.source_key,
      version:source.version_label,
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
    const reason=error instanceof Error?error.message:"unavailable"
    const status=reason.includes("held")?423:503
    return json({standing:"public_presentation_held",reason},status)
  }
}

export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
