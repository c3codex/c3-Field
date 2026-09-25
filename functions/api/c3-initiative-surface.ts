import {InitiativeSurfaceResolutionError,resolveInitiativeSurfaceHost,type InitiativeSurfaceEnv} from "../_lib/initiative-surface-host"

function json(body:unknown,status=200){
  return new Response(JSON.stringify(body),{
    status,
    headers:{
      "content-type":"application/json; charset=utf-8",
      "cache-control":"public, max-age=30, stale-while-revalidate=60",
      "x-content-type-options":"nosniff"
    }
  })
}

export const onRequestGet:PagesFunction<InitiativeSurfaceEnv>=async({env,request})=>{
  try{
    const resolved=await resolveInitiativeSurfaceHost(env,new URL(request.url).hostname)
    return json({
      standing:"resolved",
      host:resolved.host,
      surfaceKey:resolved.surfaceKey,
      initiativeKey:resolved.initiativeKey,
      webpacKey:resolved.webpacKey,
      canonicalEnvironment:resolved.canonicalEnvironment,
      canonicalUrl:resolved.canonicalUrl,
      route:resolved.route,
      connectRoute:resolved.connectRoute,
      publicPresentation:resolved.publicPresentation,
      createsStanding:false
    })
  }catch(error){
    if(error instanceof InitiativeSurfaceResolutionError)
      return json({standing:"held",reason_code:error.reasonCode},error.status)
    return json({standing:"held",reason_code:"initiative_surface_unavailable"},503)
  }
}

export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
