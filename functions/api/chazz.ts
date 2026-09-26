type Env = {
  SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  OPERATOR_DISPATCH_KEY?: string
  OPENAI_API_KEY?: string
  CHAZZ_OPENAI_MODEL?: string
}

type RuntimeContext = {
  relationship_ref: string
  env_key: string
  envpac_ref: string
  current_ref: string
  operator_identifiers: string[]
  capability_scope: Record<string, unknown>
  rooted_system_key: string
}

type InputBody = {
  contract?: unknown
  message?: unknown
  context?: unknown
}

const CONTRACT = "c3ops_myenv_chazz_v1"
const HOST = "c3ops.c3field.online"
const ROLE_KEY = "chazz_bounded_executor_v1"
const BRIDGE_PROCESS = "c3ops_my_env_chazz_bridge_v1"
const RUNTIME_PROCESS = "c3ops_chazz_model_runtime_v1"
const DEFAULT_MODEL = "gpt-5.6"

const headers = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "private, no-store",
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers })
}

function safeEqual(left: string, right: string) {
  const a = new TextEncoder().encode(left)
  const b = new TextEncoder().encode(right)
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i]
  return diff === 0
}

function supabaseBase(env: Env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("registry_config_missing")
  return env.SUPABASE_URL.replace(/\/$/, "")
}

async function dbRows(env: Env, path: string) {
  const response = await fetch(supabaseBase(env) + "/rest/v1/" + path, {
    redirect: "manual",
    signal: AbortSignal.timeout(15000),
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY!,
      authorization: "Bearer " + env.SUPABASE_SERVICE_ROLE_KEY!,
      accept: "application/json",
    },
  })
  if (!response.ok) throw new Error("registry_read_failed")
  return await response.json() as Array<Record<string, unknown>>
}

function readContext(value: unknown): RuntimeContext | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  const row = value as Record<string, unknown>
  const operators = Array.isArray(row.operator_identifiers)
    ? row.operator_identifiers.filter((item): item is string => typeof item === "string" && !!item)
    : []
  if (
    typeof row.relationship_ref !== "string" ||
    typeof row.env_key !== "string" ||
    typeof row.envpac_ref !== "string" ||
    typeof row.current_ref !== "string" ||
    typeof row.rooted_system_key !== "string" ||
    !row.capability_scope ||
    typeof row.capability_scope !== "object" ||
    Array.isArray(row.capability_scope) ||
    !operators.length
  ) return null
  return {
    relationship_ref: row.relationship_ref,
    env_key: row.env_key,
    envpac_ref: row.envpac_ref,
    current_ref: row.current_ref,
    operator_identifiers: operators,
    capability_scope: row.capability_scope as Record<string, unknown>,
    rooted_system_key: row.rooted_system_key,
  }
}

async function resolveGovernedRuntime(request: Request, env: Env, context?: RuntimeContext) {
  const url = new URL(request.url)
  if (url.hostname !== HOST) throw new Error("host_boundary")
  if (!env.OPERATOR_DISPATCH_KEY) throw new Error("dispatch_key_missing")

  const dispatch = request.headers.get("x-operator-dispatch-key") || ""
  if (!safeEqual(dispatch, env.OPERATOR_DISPATCH_KEY)) throw new Error("dispatch_denied")

  if (request.headers.get("x-c3-contract") !== CONTRACT) throw new Error("contract_invalid")
  const currentHeader = request.headers.get("x-c3-current-ref") || ""
  const envpacHeader = request.headers.get("x-c3-envpac-ref") || ""
  if (!currentHeader || !envpacHeader) throw new Error("context_headers_missing")

  if (context) {
    if (context.current_ref !== currentHeader || context.envpac_ref !== envpacHeader) throw new Error("context_mismatch")
  }

  const roleQuery = new URLSearchParams({
    select: "role_key,role_state,is_active,runtime_authority_allowed,mutation_authority_allowed",
    role_key: "eq." + ROLE_KEY,
    is_active: "eq.true",
    limit: "1",
  })
  const bridgeQuery = new URLSearchParams({
    select: "process_key,process_status,authority_state",
    process_key: "eq." + BRIDGE_PROCESS,
    limit: "1",
  })
  const runtimeQuery = new URLSearchParams({
    select: "process_key,process_status,authority_state",
    process_key: "eq." + RUNTIME_PROCESS,
    limit: "1",
  })
  const currentQuery = new URLSearchParams({
    select: "current_state_key,env_key,standing,is_current",
    current_state_key: "eq." + currentHeader,
    is_current: "eq.true",
    limit: "1",
  })
  const capabilityQuery = new URLSearchParams({
    select: "capability_key,standing,scope",
    envpac_key: "eq." + envpacHeader,
    system_key: "eq.c3ops",
    capability: "eq.chazz_conversation",
    standing: "eq.active",
    limit: "1",
  })

  const [roles, bridges, runtimes, currents, capabilities] = await Promise.all([
    dbRows(env, "c3_role_contract?" + roleQuery),
    dbRows(env, "system_process_registry?" + bridgeQuery),
    dbRows(env, "system_process_registry?" + runtimeQuery),
    dbRows(env, "c3_current_state?" + currentQuery),
    dbRows(env, "c3_envpac_capability_grant?" + capabilityQuery),
  ])

  const role = roles[0]
  if (!role || role.role_state !== "active") throw new Error("role_held")
  if (role.runtime_authority_allowed === true || role.mutation_authority_allowed === true) throw new Error("role_authority_drift")

  const bridge = bridges[0]
  if (!bridge || bridge.process_status !== "active") throw new Error("bridge_held")

  const runtime = runtimes[0]
  if (!runtime || runtime.process_status !== "active") throw new Error("runtime_process_held")

  const current = currents[0]
  if (!current || current.is_current !== true) throw new Error("current_unresolved")
  if (context && current.env_key !== context.env_key) throw new Error("current_context_mismatch")

  const capability = capabilities[0]
  if (!capability || capability.standing !== "active") throw new Error("capability_held")

  if (!env.OPENAI_API_KEY) throw new Error("openai_credential_missing")

  return {
    model: env.CHAZZ_OPENAI_MODEL?.trim() || DEFAULT_MODEL,
    role,
    bridge,
    runtime,
    current,
    capability,
  }
}

function outputText(payload: Record<string, unknown>) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) return payload.output_text.trim()
  if (!Array.isArray(payload.output)) return ""
  const parts: string[] = []
  for (const item of payload.output) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue
    const content = (item as Record<string, unknown>).content
    if (!Array.isArray(content)) continue
    for (const part of content) {
      if (!part || typeof part !== "object" || Array.isArray(part)) continue
      const row = part as Record<string, unknown>
      if (row.type === "output_text" && typeof row.text === "string") parts.push(row.text)
    }
  }
  return parts.join("\n").trim()
}

function hold(error: unknown) {
  const code = error instanceof Error ? error.message : "runtime_unavailable"
  if (code === "host_boundary" || code === "dispatch_denied") return { standing: "HLD", reason: "c3Ops operator runtime boundary did not resolve.", status: 403 }
  if (code === "dispatch_key_missing") return { standing: "HLD", reason: "c3Ops runtime authentication is not configured.", status: 503 }
  if (code === "openai_credential_missing") return { standing: "HLD", reason: "Chazz model runtime credential is not configured.", status: 503 }
  if (code === "contract_invalid" || code === "context_headers_missing" || code === "context_mismatch" || code === "current_context_mismatch")
    return { standing: "DNR", reason: "The My Environment Chazz runtime contract did not resolve.", status: 409 }
  if (code === "current_unresolved") return { standing: "DNR", reason: "CURRENT did not resolve at the c3Ops runtime.", status: 409 }
  if (code === "role_authority_drift") return { standing: "HLD", reason: "Chazz runtime authority drift was detected.", status: 409 }
  if (code === "role_held" || code === "bridge_held" || code === "runtime_process_held" || code === "capability_held")
    return { standing: "HLD", reason: "Chazz runtime standing is held in c3Ops.", status: 409 }
  if (code === "registry_config_missing" || code === "registry_read_failed")
    return { standing: "HLD", reason: "c3Ops Registry readback did not resolve.", status: 503 }
  return { standing: "HLD", reason: "The Chazz model runtime did not resolve.", status: 502 }
}

async function callOpenAI(env: Env, model: string, message: string, context: RuntimeContext) {
  const instructions = [
    "You are Chazz, the c3Ops systems intelligence working with operator op044 inside a governed My Environment.",
    "Use only the runtime context supplied for this turn and do not invent Registry standing, authorization, evidence, or completed actions.",
    "Capability never implies authority. CURRENT is observed state, not a permission token.",
    "This My Environment runtime may converse, reason with CURRENT context, and prepare governed work. It has no independent Registry mutation, publication, distribution, messaging, payment, or external-effect authority.",
    "When work would require a consequential effect, identify the bounded next step rather than claiming the effect occurred.",
    "Preserve the lifecycle: thread -> confirmation -> CanCom -> execution -> return -> Chazz review -> Operator disposition.",
    "Be direct, warm, concise, and technically precise.",
    "Runtime context: env_key=" + context.env_key + "; current_ref=" + context.current_ref + "; rooted_system=" + context.rooted_system_key + "; operators=" + context.operator_identifiers.join(","),
  ].join("\n")

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    redirect: "manual",
    signal: AbortSignal.timeout(90000),
    headers: {
      authorization: "Bearer " + env.OPENAI_API_KEY!,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions,
      input: message,
      reasoning: { effort: "medium" },
      max_output_tokens: 2200,
      store: false,
    }),
  })

  const payload = await response.json().catch(() => null) as Record<string, unknown> | null
  if (!response.ok || !payload) {
    if (response.status === 401 || response.status === 403) throw new Error("openai_credential_missing")
    throw new Error("openai_runtime_held")
  }
  const text = outputText(payload)
  if (!text) throw new Error("openai_runtime_held")
  return { text, responseId: typeof payload.id === "string" ? payload.id : null }
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const runtime = await resolveGovernedRuntime(request, env)
    return json({
      standing: "ACT",
      runtime: "c3ops_chazz_openai_v1",
      reason: "Chazz runtime is available.",
      messages: [],
      model: runtime.model,
      mutation_authority: false,
      external_effect_authority: false,
    })
  } catch (error) {
    const out = hold(error)
    return json({
      standing: out.standing,
      runtime: "c3ops_chazz_held",
      reason: out.reason,
      messages: [],
      mutation_authority: false,
      external_effect_authority: false,
    }, out.status)
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    if ((request.headers.get("content-type") || "").split(";")[0].trim() !== "application/json")
      return json({ standing: "DNR", reason: "Expected JSON input." }, 415)

    const body = await request.json() as InputBody
    if (body.contract !== CONTRACT || typeof body.message !== "string" || !body.message.trim() || body.message.length > 12000)
      return json({ standing: "DNR", reason: "Message did not resolve to the bounded Chazz input contract." }, 400)

    const context = readContext(body.context)
    if (!context) return json({ standing: "DNR", reason: "My Environment runtime context did not resolve." }, 400)

    const runtime = await resolveGovernedRuntime(request, env, context)
    const completion = await callOpenAI(env, runtime.model, body.message.trim(), context)

    return json({
      standing: "ACT",
      runtime: "c3ops_chazz_openai_v1",
      message: completion.text,
      model: runtime.model,
      evidence: {
        provider: "openai",
        response_id: completion.responseId,
        current_ref: context.current_ref,
        envpac_ref: context.envpac_ref,
        authority_effect: "none",
      },
      mutation_authority: false,
      external_effect_authority: false,
    })
  } catch (error) {
    const out = hold(error)
    return json({
      standing: out.standing,
      runtime: "c3ops_chazz_turn_held",
      reason: out.reason,
      mutation_authority: false,
      external_effect_authority: false,
    }, out.status)
  }
}

export const onRequest: PagesFunction = async () => json({ error: "method not allowed" }, 405)
