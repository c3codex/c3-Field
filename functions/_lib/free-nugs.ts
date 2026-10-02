// Server-side FREE functional resolution. Registry owns bindings and evidence;
// FREE neither stores NUG state nor creates capability, authority or custody.
export type NugRequest = {
  nug_key: string
  origin_env_key: string
  env_key: string
  envpac_key: string
  current_state_key: string
  executor_ref: string
  execution_instance: string
  capability_ref: string
  authority_oar_key: string
  context_binding_key: string
}
export type NugResult = Record<string, unknown>
export type NugRegistryRpc = (name: string, args: Record<string, unknown>) => Promise<NugResult>
class NugRegistryError extends Error {
  constructor(readonly code:string,readonly relation:string|null){super("nug_registry_permission_denied")}
}

// Existing server Registry credentials only. This is never a browser client or
// external effect adapter, and it cannot call an arbitrary RPC/provider URL.
export function createFreeNugServerRuntime(url: string, serviceRoleKey: string) {
  const base = new URL(url)
  if (base.protocol !== "https:" || base.username || base.password || !serviceRoleKey.trim()) {
    throw new Error("server_registry_configuration_unresolved")
  }
  const operations = new Set(["resolve_c3ops_nug_v1", "call_c3ops_nug_native_v1",
    "prepare_c3ops_nug_effect_v1", "return_c3ops_nug_effect_v1"])
  return createFreeNugRuntime(async (name, args) => {
    if (!operations.has(name)) throw new Error("unsupported_nug_registry_operation")
    const response = await fetch(new URL(`/rest/v1/rpc/${name}`, base), {
      method:"POST", redirect:"error", signal:AbortSignal.timeout(15_000),
      headers:{apikey:serviceRoleKey, authorization:`Bearer ${serviceRoleKey}`, "content-type":"application/json"},
      body:JSON.stringify(args),
    })
    if (!response.ok) {
      const error=await response.json().catch(()=>null) as {code?:unknown;message?:unknown}|null
      if(error?.code==="42501"){
        const match=typeof error.message==="string"? /^permission denied for table (c3_current_state|c3_current_evidence_ref)$/.exec(error.message):null
        throw new NugRegistryError("42501",match?.[1]||null)
      }
      throw new Error("nug_registry_unavailable")
    }
    const result: unknown = await response.json()
    if (!result || typeof result !== "object" || Array.isArray(result)) throw new Error("nug_registry_invalid_response")
    return result as NugResult
  })
}

export function createFreeNugRuntime(registry: NugRegistryRpc) {
  const held = (reason: string): NugResult => ({standing: "HLD", reason})
  const valid = (request: NugRequest) => request && Object.values(request).every(
    value => typeof value === "string" && value.trim().length > 0,
  ) && ["nug_key", "origin_env_key", "env_key", "envpac_key", "current_state_key",
    "executor_ref", "execution_instance", "capability_ref", "authority_oar_key", "context_binding_key",
  ].every(key => Object.hasOwn(request, key))
  return {
    async resolve(request: NugRequest): Promise<NugResult> {
      if (!valid(request)) return held("request_boundary_missing")
      try {
        const result = await registry("resolve_c3ops_nug_v1", {p_request: request})
        return result?.standing === "resolved_for_nug" || result?.standing === "HLD"
          ? result : held("registry_resolution_invalid")
      } catch { return held("registry_resolution_unavailable") }
    },
    async callNative(request: NugRequest, occurrenceKey: string): Promise<NugResult> {
      if (!valid(request) || typeof occurrenceKey !== "string" || !occurrenceKey.trim()) {
        return held("request_boundary_missing")
      }
      // Re-preflight and native invocation occur atomically in the Registry.
      // Do not retry an ambiguous response: the occurrence key is replay guarded.
      try {
        const result = await registry("call_c3ops_nug_native_v1", {
          p_request: request, p_occurrence_key: occurrenceKey,
        })
        if (result?.standing === "HLD") return result
        return result?.standing === "occurrence_returned"
          && result.current_state_key === request.current_state_key
          && result.occurrence_key === occurrenceKey && result.external_effects === 0
          && result.custody_transferred === false
          && result.evidence_return_relation === `registry://c3_current_evidence_ref/${request.current_state_key}`
          ? result : held("occurrence_return_unverified")
      } catch { return held("occurrence_return_unverified") }
    },
    async prepareEffect(request: NugRequest, occurrenceKey: string): Promise<NugResult> {
      if (!valid(request) || typeof occurrenceKey !== "string" || !occurrenceKey.trim()) return held("request_boundary_missing")
      try {
        const result = await registry("prepare_c3ops_nug_effect_v1", {p_request: request, p_occurrence_key: occurrenceKey})
        if (result?.standing === "HLD") return result
        return result?.standing === "awaiting_effect_receipt" && result.occurrence_key === occurrenceKey
          && result.provider_called === false && result.external_effects === 0
          ? result : held("effect_preparation_unverified")
      } catch(error) {
        return error instanceof NugRegistryError
          ? {...held("nug_registry_permission_denied"),registry_error:{code:error.code,relation:error.relation}}
          : held("effect_preparation_unverified")
      }
    },
    async returnEffect(occurrenceKey: string, executor: string, receiptEvidenceRefKey: string): Promise<NugResult> {
      if ([occurrenceKey, executor, receiptEvidenceRefKey].some(value => typeof value !== "string" || !value.trim())) {
        return held("receipt_boundary_missing")
      }
      try {
        const result = await registry("return_c3ops_nug_effect_v1", {
          p_occurrence_key: occurrenceKey, p_executor: executor, p_receipt_evidence_ref_key: receiptEvidenceRefKey,
        })
        if (result?.standing === "HLD") return result
        return result?.standing === "receipt_returned" && result.occurrence_key === occurrenceKey
          && result.receipt_evidence_ref_key === receiptEvidenceRefKey && result.provider_called === false
          && result.new_external_effects === 0 && result.custody_transferred === false
          && typeof result.current_state_key === "string" && result.current_state_key.length > 0
          && result.evidence_return_relation === `registry://c3_current_evidence_ref/${result.current_state_key}`
          ? result : held("effect_receipt_return_unverified")
      } catch { return held("effect_receipt_return_unverified") }
    },
  }
}
