import {json,type PassageEnv} from "../_lib/c1-passage"
import {resolveInitiativeSurfaceHost} from "../_lib/initiative-surface-host"

const receivers = {
  "/connect":"c3field_connect_receiver_c3webpac_v1",
  "/contribute":"c3field_contribute_receiver_c3webpac_v1",
  "/create":"c3field_create_receiver_c3webpac_v1",
} as const

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
    const resolved = await resolveFree("route",path)
    if (!resolved.ok) return json({standing:"HLD"},503)
    const projection = await resolved.json()
    if (projection?.standing !== "ACT" || projection.pac_key !== receivers[path]) return json({standing:"DNR"},404)

    const filters = new URLSearchParams({
      select:"pac_key",pac_key:"eq."+receivers[path],is_effective:"eq.true",release_state:"eq.public_release_authorized",
      registration_sha256:"eq."+projection.registration_sha256,
    })
    const release = await fetch(base+"/c3_pac?"+filters,{headers,redirect:"error",signal:AbortSignal.timeout(10000)})
    if (!release.ok) return json({standing:"HLD"},503)
    const rows = await release.json()
    if (!Array.isArray(rows) || rows.length !== 1 || rows[0]?.pac_key !== receivers[path]) return json({standing:"DNR"},404)

    if (path === "/connect") {
      const pavilion = projection.snapshot?.connect_pavilion
      return json({
        standing:"ACT",pac_key:receivers[path],path,
        pavilion:pavilion?{asset_key:pavilion.asset_key,width:pavilion.width,height:pavilion.height,bounds:pavilion.bounds}:null,
      })
    }
    if (path === "/create") return json({standing:"ACT",pac_key:receivers[path],path})

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
      standing:"ACT",pac_key:receivers[path],path,
      destinations:Object.fromEntries(destinations.flatMap(result=>result.status==="fulfilled"?[result.value]:[])),
    })
  } catch {
    return json({standing:"HLD"},503)
  }
}
