import { resolveMEEnvironments, readLapzuli, readC3OpsCurrentState, type ReadRows } from "../../_lib/me-environment"
import { handleLapzuliAction, preflightLapzuliRoute } from "./lapzuli"
import {isAuthorizedOperator} from "../../_middleware"
export type Env = {
  OPERATOR_DISPATCH_KEY?: string
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  LAPZULI_DISTRIBUTION_CONTROL_TOKEN?: string
  LAPZULI_DISTRIBUTION_WORKER_URL?: string
}
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
  const params = new URL(request.url).searchParams
  const view=params.get("view")
  const actionRequest=request.method==="POST" && view==="lapzuli_action"
  if(request.method!=="GET" && !actionRequest) return new Response(JSON.stringify({error:"read_only"}),{status:405,headers:{...headers,allow:"GET, POST"}})
  const envKey = params.get("env_key") ?? undefined
  if(envKey && !/^[a-zA-Z0-9_-]{1,160}$/.test(envKey)) return new Response(JSON.stringify({error:"invalid_env_key"}),{status:400,headers})
  try {
    // Reuse the existing Operator boundary even if this handler is called without
    // Pages middleware. A host name or server credential is not caller authority.
    if(!env.OPERATOR_DISPATCH_KEY) return new Response(JSON.stringify({standing:"HLD",error:"operator access not configured"}),{status:503,headers})
    if(!await isAuthorizedOperator(request,env.OPERATOR_DISPATCH_KEY)) return new Response(JSON.stringify({standing:"HLD",error:"operator access denied"}),{status:403,headers})
    if(actionRequest) return handleLapzuliAction(request,env)
    if(view==="lapzuli_free"){
      const routeKey=params.get("route_key")
      if(!routeKey || !/^[a-zA-Z0-9_-]{1,200}$/.test(routeKey))return new Response(JSON.stringify({standing:"HLD",reason:"exact_route_key_required",external_publication_effects:0}),{status:400,headers})
      const result=await preflightLapzuliRoute(env,routeKey)
      return new Response(JSON.stringify(result),{status:result.standing==="EXECUTABLE"?200:409,headers})
    }
    const read = createRegistryReader(env)
    const result = view==="lapzuli" ? await readLapzuli(read) : view==="current_state" ? await readC3OpsCurrentState(read) : await resolveMEEnvironments(read,envKey)
    return new Response(JSON.stringify(result),{headers})
  } catch {
    return new Response(JSON.stringify({standing:"HLD",error:"Registry readback unavailable",external_effects:0}),{status:503,headers})
  }
}
export const onRequest: PagesFunction<Env> = ({request,env}) => handleRead(request,env)
