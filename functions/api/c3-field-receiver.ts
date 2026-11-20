import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveInitiativeSurfaceHost} from "../_lib/initiative-surface-host"

import {fieldRecord,fieldWebPacKey,fieldWebPacManifestKey,qualifiedFieldWebPacSource,readFieldRows,resolveFieldReceiver} from "../_lib/c3-field-webpac"

export const onRequestGet:PagesFunction<PassageEnv> = async ({request,env}) => {
  const url = new URL(request.url)
  const path = url.searchParams.get("path")
  if (!["c3field.online","www.c3field.online"].includes(url.hostname) ||
      (path !== "/connect" && path !== "/contribute" && path !== "/create")) return json({standing:"DNR"},404)

  try {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return json({standing:"HLD"},503)
    const headers = {
      apikey:env.SUPABASE_SERVICE_ROLE_KEY,
      authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,
      "content-type":"application/json",
    }
    const base = env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1"
    const resolveFree = (type:string,value:string)=>fetch(base+"/rpc/free_resolve_pac_encounter_v1",{
      method:"POST",headers,redirect:"error",signal:AbortSignal.timeout(10000),
      body:JSON.stringify({p_free_call_key:"c3_public_webpac_encounter",p_selector_type:type,p_selector_value:value}),
    })
    const [pacs,manifests]=await Promise.all([
      readFieldRows(env,"c3_pac",{
        select:"pac_key,is_effective,release_state",pac_key:"eq."+fieldWebPacKey,
        is_effective:"eq.true",release_state:"eq.public_release_authorized",
      }),
      readFieldRows(env,"c3_webpac_presentation_manifest",{
        select:"manifest_key,pac_key,canonical_host,canonical_path,composition",
        manifest_key:"eq."+fieldWebPacManifestKey,pac_key:"eq."+fieldWebPacKey,
        canonical_host:"eq.c3field.online",canonical_path:"eq./",
      }),
    ])
    const pac=pacs[0],manifest=manifests[0]
    if (pacs.length!==1 || pac.pac_key!==fieldWebPacKey || pac.is_effective!==true ||
        pac.release_state!=="public_release_authorized" || manifests.length!==1 ||
        manifest.manifest_key!==fieldWebPacManifestKey || manifest.pac_key!==fieldWebPacKey ||
        manifest.canonical_host!=="c3field.online" || manifest.canonical_path!=="/") {
      return json({standing:"DNR"},404)
    }
    const composition=fieldRecord(manifest.composition)
    const receiver=resolveFieldReceiver(composition,path)
    if (!receiver || !await qualifiedFieldWebPacSource(env,composition)) return json({standing:"DNR"},404)
    const identity={standing:"ACT",pac_key:fieldWebPacKey,manifest_key:fieldWebPacManifestKey,path}

    if (path === "/connect") {
      const pavilion=fieldRecord(receiver.connect_pavilion)
      return json({
        ...identity,
        pavilion:{asset_key:pavilion.asset_key,width:pavilion.width,height:pavilion.height,bounds:pavilion.bounds},
      })
    }
    if (path === "/create") return json(identity)

    const publicInitiatives = [
      {name:"Million Dollar Mission",host:"mdm.c3field.online",key:"million_dollar_mission"},
      {name:"4.7%",host:"47pct.c3field.online",key:"47pct"},
    ]
    const destinations = await Promise.allSettled([
      ...publicInitiatives.map(async ({name,host,key})=>{
        const surface = await resolveInitiativeSurfaceHost(env,host)
        if(surface.initiativeKey !== key) throw new Error("initiative_identity_mismatch")
        return [name,surface.canonicalUrl]
      }),
      (async()=>{
        const response = await resolveFree("host","undrifted.measuresregistry.com")
        if (!response.ok) throw new Error("publication_unavailable")
        const publication = await response.json()
        if (publication.standing !== "ACT" || publication.pac_key !== "undrifted_field_projection_c3webpac_v2") {
          throw new Error("publication_unresolved")
        }
        return ["unDrifted","https://undrifted.measuresregistry.com/"]
      })(),
    ])
    return json({
      ...identity,
      destinations:Object.fromEntries(destinations.flatMap(result=>result.status==="fulfilled"?[result.value]:[])),
    })
  } catch {
    return json({standing:"HLD"},503)
  }
}
