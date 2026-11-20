import {json,type PassageEnv} from "../_lib/c1-passage"

const receivers = {
  "/contribute":"c3field_contribute_receiver_c3webpac_v1",
  "/create":"c3field_create_receiver_c3webpac_v1",
} as const

export const onRequestGet:PagesFunction<PassageEnv> = async ({request,env}) => {
  const url = new URL(request.url)
  const path = url.searchParams.get("path")
  if (!["c3field.online","www.c3field.online"].includes(url.hostname) ||
      (path !== "/contribute" && path !== "/create")) return json({standing:"DNR"},404)

  try {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return json({standing:"HLD"},503)
    const headers = {
      apikey:env.SUPABASE_SERVICE_ROLE_KEY,
      authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,
      "content-type":"application/json",
    }
    const base = env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1"
    const resolved = await fetch(base+"/rpc/free_resolve_pac_encounter_v1",{
      method:"POST",headers,redirect:"error",signal:AbortSignal.timeout(10000),
      body:JSON.stringify({p_free_call_key:"c3_public_webpac_encounter",p_selector_type:"route",p_selector_value:path}),
    })
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

    return json({standing:"ACT",pac_key:receivers[path],path})
  } catch {
    return json({standing:"HLD"},503)
  }
}
