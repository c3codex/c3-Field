type Env={SUPABASE_URL?:string;SUPABASE_SERVICE_ROLE_KEY?:string}

function json(body:unknown,status=200){
  return new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json","cache-control":"public, max-age=60, stale-while-revalidate=300","x-content-type-options":"nosniff"}})
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

export const onRequestGet:PagesFunction<Env>=async({env})=>{
  try{
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
    const authoritySource=typeof em.public_presentation_authority_source==="string"
      ? em.public_presentation_authority_source
      : ""
    if(!authoritySource||!/^[a-z0-9_]+$/i.test(authoritySource)) return json({standing:"public_presentation_authority_missing"},409)
    if(em.public_presentation_release_state!=="bounded_public_runtime") return json({standing:"public_presentation_held"},423)

    const source=await readOne(env,"codex_source_reference",{
      select:"source_key,version_label,source_status,metadata",
      source_key:"eq."+authoritySource,
      source_status:"eq.committed"
    })
    const sm=source.metadata as Record<string,unknown>|undefined
    if(!sm) return json({standing:"public_presentation_authority_missing"},409)
    if(source.source_key!==authoritySource) return json({standing:"public_presentation_authority_mismatch"},409)

    return json({
      standing:"bounded_public_runtime",
      sourceKey:source.source_key,
      version:source.version_label,
      canonicalEnvironment:environment.env_key,
      presentation:sm
    })
  }catch(error){
    return json({standing:"public_presentation_held",reason:error instanceof Error?error.message:"unavailable"},503)
  }
}

export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
