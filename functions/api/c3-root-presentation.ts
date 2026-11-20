import {fieldReceiverPaths,fieldRecord,fieldWebPacKey,fieldWebPacManifestKey,qualifiedFieldWebPacSource,readFieldRows as rows,resolveFieldReceiver,type FieldWebPacEnv as Env} from "../_lib/c3-field-webpac"

function json(body:unknown,status=200){
  return new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json","cache-control":"public, max-age=60, stale-while-revalidate=300","x-content-type-options":"nosniff"}})
}
export const onRequestGet:PagesFunction<Env>=async({env,request})=>{
  try{
    const url=new URL(request.url)
    if(!["c3field.online","www.c3field.online"].includes(url.hostname))return json({standing:"root_surface_host_mismatch"},409)
    const pac=await rows(env,"c3_pac",{select:"pac_key,standing,is_effective,release_state,metadata",pac_key:"eq."+fieldWebPacKey,is_effective:"eq.true"})
    const manifest=await rows(env,"c3_webpac_presentation_manifest",{select:"manifest_key,pac_key,presentation_schema_version,surface_type,canonical_host,canonical_path,composition,renderer_capabilities,accessibility_responsive,og_share_presentation",pac_key:"eq."+fieldWebPacKey,manifest_key:"eq."+fieldWebPacManifestKey,canonical_host:"eq.c3field.online",canonical_path:"eq./"})
    const bindings=await rows(env,"c3_pac_runtime_binding",{select:"binding_key,media_role,provider,bucket_name,object_path,runtime_uri,standing,metadata",pac_key:"eq."+fieldWebPacKey})
    if(pac.length!==1||manifest.length!==1)return json({standing:"root_presentation_authority_unavailable"},409)
    const active=bindings.filter(row=>row.standing==="active")
    const opening=active.find(row=>row.media_role==="opening_video")
    const backdrop=active.find(row=>row.media_role==="muted_backdrop")
    if(!opening||!backdrop)return json({standing:"root_runtime_media_held"},423)
    const composition={...fieldRecord(manifest[0].composition)}
    if (composition.interactive_mosaic) {
      const sourceQualified=pac[0].release_state==="public_release_authorized" &&
        await qualifiedFieldWebPacSource(env,composition).catch(()=>false)
      if (!sourceQualified) delete composition.interactive_mosaic
      else {
        const mosaic=fieldRecord(composition.interactive_mosaic)
        if (Array.isArray(mosaic.zones)) composition.interactive_mosaic={
          ...mosaic,
          zones:mosaic.zones.map(value=>{
            const zone=fieldRecord(value)
            const target=fieldReceiverPaths.find(path=>path===zone.target)
            return {...zone,target:target && resolveFieldReceiver(composition,target)?target:null}
          }),
        }
      }
    }
    delete composition.receiving_positions
    delete composition.webpac_source_ref
    const footerKey=typeof composition?.footer_source==="string"?composition.footer_source:""
    if(!footerKey)return json({standing:"root_footer_authority_missing"},409)
    const footer=await rows(env,"codex_source_reference",{select:"source_key,source_status,metadata",source_key:"eq."+footerKey,source_status:"eq.committed"})
    if(footer.length!==1)return json({standing:"root_footer_authority_unavailable"},409)
    return json({standing:"bounded_public_runtime",pac:pac[0],manifest:{...manifest[0],composition},runtimeMedia:{opening,backdrop},publicIdentity:footer[0].metadata})
  }catch(error){return json({standing:"root_presentation_held",reason:error instanceof Error?error.message:"unavailable"},503)}
}
export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
