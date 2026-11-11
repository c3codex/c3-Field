import {recognizeOperatorRead} from '../../_lib/recognition'
import { resolveMEEnvironments, readLapzuli, readC3OpsCurrentState, type ReadRows } from "../../_lib/me-environment"

import {readC3OpsOperatorAuthority} from '../../_lib/c3ops-operator-authority'
import {readAuthorizationOptics} from '../../_lib/c3ops-authorization-optics'
export type Env = {
  SUPABASE_ANON_KEY?: string
  VITE_SUPABASE_ANON_KEY?: string
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
export async function handleRead(request:Request,env:Env){
 const url=new URL(request.url)
 const held=(reason:string,status=403)=>new Response(JSON.stringify({standing:'HLD',reason,mutation_authority:false,external_effects:0}),{status,headers})
 if(url.origin!=='https://c3ops.c3field.online')return held('not_found',404)
 if(request.method!=='GET')return held('read_only',405)
 const view=url.searchParams.get('view')
 if(view!==null&&view!=='current_state'&&view!=='authorizations')return held('read_view_not_admitted')
 if(url.searchParams.has('env_key')&&url.searchParams.get('env_key')!=='env_c3ops')return held('foreign_environment')
 try{
  // Registered native Operator recognition, not the legacy dispatch secret,
  // is the sole authorization proof for this GET-only projection.
  const actor=await recognizeOperatorRead(request,env)
  if(actor.standing!=='VERIFIED')return held(actor.reason,401)
  const read=createRegistryReader(env)
  // Only fixed qualification-record reads occur before authorization succeeds.
  const authority=await readC3OpsOperatorAuthority(read,'env_c3ops',actor)
  const right=view==='current_state'?'read_preflight_evidence':'inspect_governed_status'
  if(authority.authenticated_actor.standing!=='VERIFIED'||!authority.eligible_read_effects.includes(right))return held('registered_read_authority_unavailable')
  const body=view==='authorizations'?await readAuthorizationOptics(env):view==='current_state'?await readC3OpsCurrentState(read):{...await resolveMEEnvironments(read,'env_c3ops'),operator_authority:authority}
  if(Date.parse(actor.expiresAt)<=Date.now())return held('recognition_expired',401)
  return new Response(JSON.stringify(body),{headers})
 }catch{return held('readback_unavailable',503)}
}
export const onRequest:PagesFunction<Env>=({request,env})=>handleRead(request,env)
