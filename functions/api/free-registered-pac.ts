type Env={SUPABASE_URL?:string;SUPABASE_SERVICE_ROLE_KEY?:string}

function json(body:unknown,status=200){
  return new Response(JSON.stringify(body),{
    status,
    headers:{
      "content-type":"application/json",
      "cache-control":"no-store",
      "x-content-type-options":"nosniff",
      "x-c3-free-contract":"registered-pac-v1"
    }
  })
}

export const onRequestGet:PagesFunction<Env>=async({request,env})=>{
  try{
    if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)
      return json({standing:"DNR",reason:"server_configuration"},503)

    const host=new URL(request.url).hostname.trim().toLowerCase().replace(/\.+$/g,"")
    const response=await fetch(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/rpc/free_resolve_registered_webpac_v1",{
      method:"POST",
      headers:{
        apikey:env.SUPABASE_SERVICE_ROLE_KEY,
        authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,
        "content-type":"application/json"
      },
      body:JSON.stringify({p_host:host}),
      signal:AbortSignal.timeout(12000)
    })
    if(!response.ok) return json({standing:"DNR",reason:"registry_resolution_failed"},503)

    const body=await response.json() as Record<string,unknown>
    if(body.standing!=="ACT") return json(body,409)
    return json(body,200)
  }catch(error){
    return json({standing:"DNR",reason:error instanceof Error?error.message:"free_registered_pac_unavailable"},503)
  }
}

export const onRequest:PagesFunction=async()=>json({standing:"DNR",reason:"method_not_allowed"},405)
