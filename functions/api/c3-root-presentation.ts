type Env={SUPABASE_URL?:string;SUPABASE_SERVICE_ROLE_KEY?:string}

function json(body:unknown,status=200){
  return new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json","cache-control":"public, max-age=60, stale-while-revalidate=300","x-content-type-options":"nosniff"}})
}
async function rows(env:Env,table:string,params:Record<string,string>){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw new Error("server_configuration")
  const url=new URL(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/"+table)
  for(const [key,value] of Object.entries(params))url.searchParams.set(key,value)
  const response=await fetch(url,{headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY},signal:AbortSignal.timeout(12000)})
  if(!response.ok)throw new Error("registry_read_failed")
  return await response.json() as Record<string,unknown>[]
}
export const onRequestGet:PagesFunction<Env>=async({env,request})=>{
  try{
    const url=new URL(request.url)
    if(!["c3field.online","www.c3field.online"].includes(url.hostname))return json({standing:"root_surface_host_mismatch"},409)
    const pac=await rows(env,"c3_pac",{select:"pac_key,standing,is_effective,release_state,metadata",pac_key:"eq.c3field_root_orientation_c3webpac_v1",is_effective:"eq.true"})
    const manifest=await rows(env,"c3_webpac_presentation_manifest",{select:"manifest_key,pac_key,presentation_schema_version,surface_type,canonical_host,canonical_path,composition,renderer_capabilities,accessibility_responsive,og_share_presentation",pac_key:"eq.c3field_root_orientation_c3webpac_v1",canonical_host:"eq.c3field.online",canonical_path:"eq./"})
    const bindings=await rows(env,"c3_pac_runtime_binding",{select:"binding_key,media_role,provider,bucket_name,object_path,runtime_uri,standing,metadata",pac_key:"eq.c3field_root_orientation_c3webpac_v1"})
    if(pac.length!==1||manifest.length!==1)return json({standing:"root_presentation_authority_unavailable"},409)
    const active=bindings.filter(row=>row.standing==="active")
    const opening=active.find(row=>row.media_role==="opening_video")
    const backdrop=active.find(row=>row.media_role==="muted_backdrop")
    if(!opening||!backdrop)return json({standing:"root_runtime_media_held"},423)
    const composition=manifest[0].composition as Record<string,unknown>
    const footerKey=typeof composition?.footer_source==="string"?composition.footer_source:""
    if(!footerKey)return json({standing:"root_footer_authority_missing"},409)
    const footer=await rows(env,"codex_source_reference",{select:"source_key,source_status,metadata",source_key:"eq."+footerKey,source_status:"eq.committed"})
    if(footer.length!==1)return json({standing:"root_footer_authority_unavailable"},409)
    return json({standing:"bounded_public_runtime",pac:pac[0],manifest:manifest[0],runtimeMedia:{opening,backdrop},publicIdentity:footer[0].metadata})
  }catch(error){return json({standing:"root_presentation_held",reason:error instanceof Error?error.message:"unavailable"},503)}
}
export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
