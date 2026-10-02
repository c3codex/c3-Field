import { createHash } from "node:crypto"

export type RegistryRpc = (name: string, args: Record<string, unknown>) => Promise<Record<string, unknown>>
export type PayloadRead = (custodyRef: string) => Promise<Uint8Array>

export type Pickup = {
  standing: "resolved_for_executor"
  oar_key: string
  execution_instance: string
  passage_key: string
  payload_custody_ref: string
  payload_custody_provider: string
  payload_bytes: number
  sha256: string
  serialization_basis: "utf8_raw_bytes_sha256"
  authority_scope_ref: string
  return_route: string
  executor_ref: string
  capability_ref: string
  queue_key: string
  wake_event_key: string
  manifest_event_key: string
  external_correspondence_authorized: boolean
  deployment_authorized: boolean
}

export class CanComHold extends Error {
  readonly reason: string
  readonly evidence?: unknown
  constructor(reason: string, evidence?: unknown) {
    super(reason)
    this.reason = reason
    this.evidence = evidence
  }
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) throw new CanComHold(`missing_${field}`)
  return value
}

function custodyMatchesProvider(ref: string, provider: string): boolean {
  const prefix = ref.split(":", 1)[0]
  return /^[a-z][a-z0-9_]*$/.test(provider) &&
    (prefix === provider || prefix === `${provider}_file`)
}

export function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex")
}

export function createGitHubCustodyReader(fetchBytes: typeof fetch = fetch): PayloadRead {
  return async custodyRef => {
    const match = /^github_file:([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)@([0-9a-f]{40}):(.+)$/.exec(custodyRef)
    if (!match || match[4].split("/").some(part => part === ".." || part === "." || !part)) {
      throw new CanComHold("github_custody_ref_invalid")
    }
    const [, owner, repo, commit, path] = match
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${commit}/${path.split("/").map(encodeURIComponent).join("/")}`
    const response = await fetchBytes(url, { signal: AbortSignal.timeout(15_000) })
    if (!response.ok) throw new CanComHold("github_custody_unavailable", { status: response.status })
    return new Uint8Array(await response.arrayBuffer())
  }
}

export function createCanComOarPassage(registry: RegistryRpc, readPayload: PayloadRead) {
  return {
    async registerDelivery(manifest: Record<string, unknown>, passage: Record<string, unknown>, registrar: string) {
      requiredString(registrar, "registrar")
      const result = await registry("register_cancom_oar_delivery_v1", {
        p_manifest: manifest, p_passage: passage, p_registrar: registrar,
      })
      if (result.standing !== "delivered_for_execution") {
        throw new CanComHold(String(result.reason ?? "delivery_registration_held"), result)
      }
      return result
    },

    async pickup(keyType: "oar_key" | "passage_key" | "execution_instance", key: string, executor: string) {
      requiredString(key, "lookup_key")
      requiredString(executor, "executor")
      // Registry resolves identity, passage and capability before content is fetched.
      const result = await registry("resolve_cancom_oar_pickup_v1", {
        p_key_type: keyType, p_key: key, p_executor: executor,
      })
      if (result.standing !== "resolved_for_executor") {
        throw new CanComHold(String(result.reason ?? "pickup_held"), result)
      }
      const pickup = result as Pickup
      if (pickup.serialization_basis !== "utf8_raw_bytes_sha256" ||
          !/^[a-z][a-z0-9_]*:.+$/.test(requiredString(pickup.payload_custody_ref, "payload_ref")) ||
          !custodyMatchesProvider(pickup.payload_custody_ref,
            requiredString(pickup.payload_custody_provider, "payload_custody_provider")) ||
          !/^[0-9a-f]{64}$/.test(requiredString(pickup.sha256, "sha256")) ||
          !Number.isSafeInteger(pickup.payload_bytes) || pickup.payload_bytes <= 0 ||
          pickup.executor_ref !== executor || pickup.execution_instance !== pickup.passage_key ||
          pickup.return_route !== `registry://cancom/oar1_return/${pickup.execution_instance}`) {
        throw new CanComHold("registry_resolution_shape_conflict", result)
      }
      const payload = await readPayload(pickup.payload_custody_ref)
      if (payload.byteLength !== pickup.payload_bytes || sha256(payload) !== pickup.sha256) {
        throw new CanComHold("canonical_payload_integrity_mismatch", {
          expected_bytes: pickup.payload_bytes, observed_bytes: payload.byteLength,
          expected_sha256: pickup.sha256, observed_sha256: sha256(payload),
        })
      }
      return { pickup, payload }
    },

    async registerReturn(args: {
      executionInstance: string
      executor: string
      oar1Key: string
      custodyRef: string
      standing: "returned_for_registrar_review" | "held_for_registrar_review"
      evidence: Record<string, unknown>
      bytes: Uint8Array
    }) {
      // The DB function repeats the current Registry preflight atomically.
      const result = await registry("register_cancom_oar_return_v1", {
        p_execution_instance: requiredString(args.executionInstance, "execution_instance"),
        p_executor: requiredString(args.executor, "executor"),
        p_oar1_key: requiredString(args.oar1Key, "oar1_key"),
        p_integrity_sha256: sha256(args.bytes),
        p_custody_reference: requiredString(args.custodyRef, "custody_reference"),
        p_return_standing: args.standing,
        p_evidence: args.evidence,
      })
      if (result.standing !== args.standing) {
        throw new CanComHold(String(result.reason ?? "return_registration_held"), result)
      }
      return result
    },
  }
}

// Server-only helper. Never put a service-role key in a browser bundle.
export function createSupabaseRegistryRpc(baseUrl: string, serviceRoleKey: string): RegistryRpc {
  const base = requiredString(baseUrl, "registry_url").replace(/\/$/, "")
  const key = requiredString(serviceRoleKey, "server_registry_key")
  return async (name, args) => {
    if (!/^(register_cancom_oar_delivery_v1|resolve_cancom_oar_pickup_v1|register_cancom_oar_return_v1)$/.test(name)) {
      throw new CanComHold("unsupported_registry_operation")
    }
    const response = await fetch(`${base}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(15_000),
    })
    if (!response.ok) throw new CanComHold("registry_rpc_unavailable", { operation: name, status: response.status })
    const result = await response.json()
    if (!result || typeof result !== "object" || Array.isArray(result)) {
      throw new CanComHold("registry_rpc_invalid_response", { operation: name })
    }
    return result as Record<string, unknown>
  }
}
