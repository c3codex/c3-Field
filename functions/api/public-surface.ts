type Env={SUPABASE_URL?:string;SUPABASE_SERVICE_ROLE_KEY?:string}

function json(body:unknown,status=200){
  return new Response(JSON.stringify(body),{
    status,
    headers:{
      "content-type":"application/json",
      "cache-control":"no-store",
      "x-content-type-options":"nosniff"
    }
  })
}

export const onRequestGet:PagesFunction<Env>=async({request,env})=>{
  try{
    if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)
      return json({status:"unavailable"},503)

    const host=new URL(request.url).hostname.trim().toLowerCase().replace(/\.+$/g,"")
    const response=await fetch(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/rpc/resolve_public_surface_v1",{
      method:"POST",
      headers:{
        apikey:env.SUPABASE_SERVICE_ROLE_KEY,
        authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,
        "content-type":"application/json"
      },
      body:JSON.stringify({p_host:host}),
      signal:AbortSignal.timeout(12000)
    })
    if(!response.ok) return json({status:"unavailable"},503)

    const body=await response.json() as Record<string,unknown>
    if(body.status!=="available"||!body.presentation||typeof body.presentation!=="object"||Array.isArray(body.presentation))
      return json({status:"unavailable"},409)

    return json({status:"available",presentation:body.presentation},200)
  }catch{
    return json({status:"unavailable"},503)
  }
}

export const onRequest:PagesFunction=async()=>json({status:"unavailable"},405)
