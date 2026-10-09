import { resolvePublicationPresentation } from "../_lib/publication-presentation"
type Env = { SUPABASE_URL?: string; SUPABASE_SERVICE_ROLE_KEY?: string }
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store", "x-content-type-options": "nosniff" } })
export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  try {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
    const surface = new URL(request.url).searchParams.get("surface")
    if (!surface) return json({ standing: "HLD", reason: "registered_surface_required" }, 400)
    const read = async (table: string, select: string, filters: Record<string, string> = {}) => {
      const url = new URL(env.SUPABASE_URL!.replace(/\/$/, "") + "/rest/v1/" + table)
      url.searchParams.set("select", select)
      for (const [k, v] of Object.entries(filters)) url.searchParams.set(k, v)
      const r = await fetch(url, { headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY!, authorization: "Bearer " + env.SUPABASE_SERVICE_ROLE_KEY! }, redirect: "manual", signal: AbortSignal.timeout(12000) })
      if (!r.ok) throw new Error("registry_read_failed")
      const rows = await r.json(); if (!Array.isArray(rows)) throw new Error("registry_read_shape")
      return rows
    }
    const presentation = await resolvePublicationPresentation(read, surface, env.SUPABASE_URL.replace(/\/$/, ""))
    const routeRows=await read("measures_registry","registry_key,is_active,release_state,access_state,metadata",{registry_key:"eq.undrifted_publication_landing",is_active:"eq.true",release_state:"eq.released",access_state:"eq.visible"})
    const socialMetadata=routeRows.length===1 ? routeRows[0].metadata?.seo : null
    return json({ standing: "resolved", presentation, socialMetadata, socialMetadataSource:routeRows.length===1?routeRows[0].registry_key:null })
  } catch (e) {
    const reason = e instanceof Error && /^[a-z_]+$/.test(e.message) ? e.message : "publication_resolution_failed"
    return json({ standing: "HLD", reason }, 409)
  }
}
