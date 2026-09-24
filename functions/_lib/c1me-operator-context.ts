import type {PassageEnv} from "./c1-passage"

export type C1MeOperatorContext = {
  resolution: "operator_context_resolved"|"operator_context_none"|"operator_context_held"
  reason_code?: string
  relationship_ref?: string
  env_key?: string
  envpac_ref?: string
  current_ref?: string
  operator_count?: number
  operators?: Array<{
    continuity_binding_key?: string
    named_individual_key?: string
    carrier_binding_key?: string
    operator_standing_key?: string
    operator_identifier?: string
    operator_scope?: string
    environment_operator_binding_key?: string
    operator_role?: string
    scope_class?: string
    c3me_standing_required?: boolean
    minimum_c3me_standing?: string|null
    boundary?: string
  }>
}

export async function resolveC1MeOperatorContext(
  relationshipKey:string,
  env:PassageEnv
):Promise<C1MeOperatorContext>{
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  const response=await fetch(
    env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/rpc/resolve_c1me_operator_context_internal",
    {
      method:"POST",
      redirect:"manual",
      signal:AbortSignal.timeout(12000),
      headers:{
        apikey:env.SUPABASE_SERVICE_ROLE_KEY,
        authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,
        "content-type":"application/json"
      },
      body:JSON.stringify({p_relationship_key:relationshipKey})
    }
  )
  if(!response.ok) throw new Error("operator_context_unavailable")
  const body=await response.json() as C1MeOperatorContext
  if(!body || !["operator_context_resolved","operator_context_none","operator_context_held"].includes(body.resolution))
    throw new Error("operator_context_invalid")
  return body
}
