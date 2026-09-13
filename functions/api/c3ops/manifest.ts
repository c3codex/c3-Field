import { resolveMEEnvironments, readLapzuli, type ReadRows } from "../../_lib/me-environment"
export type Env = { SUPABASE_URL?: string; VITE_SUPABASE_URL?: string; SUPABASE_SERVICE_ROLE_KEY?: string }
const headers = {"content-type":"application/json; charset=utf-8","cache-control":"private, no-store"}
export function createRegistryReader(env: Env): ReadRows {
  const base = env.SUPABASE_URL ?? env.VITE_SUPABASE_URL
  const key = env.SUPABASE_SERVICE_ROLE_KEY
  if (!base || !key) throw new Error("Registry readback not configured")
  return async (table, select, filters={}) => {
    // Table and column names come only from the server resolver, never request parameters.
    const all: Record<string, unknown>[] = []
    for(let page=0;page<20;page++) {
      const query = new URLSearchParams({select,...filters,limit:"500",offset:String(page*500)})
      const response = await fetch(base.replace(/\/$/,"")+"/rest/v1/"+table+"?"+query, {
        headers:{apikey:key,authorization:"Bearer "+key},
        signal:AbortSignal.timeout(15000),
      })
      if(!response.ok) throw new Error("Registry read unavailable: "+table)
      const rows = await response.json() as Record<string,unknown>[]
      if(!Array.isArray(rows)) throw new Error("Invalid Registry response")
      all.push(...rows)
      if(rows.length<500) return all
    }
    throw new Error("Registry pagination limit reached; no partial success")
  }
}
export async function handleRead(request: Request, env: Env) {
  if(new URL(request.url).hostname!=="c3ops.c3field.online") return new Response(JSON.stringify({error:"not_found"}),{status:404,headers})
  if(request.method!=="GET") return new Response(JSON.stringify({error:"read_only"}),{status:405,headers:{...headers,allow:"GET"}})
  const params = new URL(request.url).searchParams
  const envKey = params.get("env_key") ?? undefined
  if(envKey && !/^[a-zA-Z0-9_-]{1,160}$/.test(envKey)) return new Response(JSON.stringify({error:"invalid_env_key"}),{status:400,headers})
  try {
    const read = createRegistryReader(env)
    const result = params.get("view")==="lapzuli" ? await readLapzuli(read) : await resolveMEEnvironments(read,envKey)
    return new Response(JSON.stringify(result),{headers})
  } catch {
    return new Response(JSON.stringify({standing:"HLD",error:"Registry readback unavailable",external_effects:0}),{status:503,headers})
  }
}
export const onRequest: PagesFunction<Env> = ({request,env}) => handleRead(request,env)
