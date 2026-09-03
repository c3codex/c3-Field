import { FormEvent, useEffect, useState } from "react"
import { supabase, supabaseConfigError } from "../integrations/supabase/client"
import "./c3CommunityConnect.css"

type RegistryState = {
  title: string
  releaseState: string
  accessState: string
  envKey: string | null
  circuit: string | null
  current: string | null
  authority: string | null
  material: string | null
  noninheritance: boolean
}

type CaptureResult = {
  standing: string
  result_label: string
  message: string
  external_standing_created: false
}

const heldState: RegistryState = {
  title: "c3 Community Connect",
  releaseState: "held",
  accessState: "gated",
  envKey: "env_c3_community_connect",
  circuit: "C1 Connect",
  current: "C1",
  authority: "Current only",
  material: "obsidian",
  noninheritance: true,
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function stateFromRows(registryRow: { display_title: string | null; release_state: string | null; access_state: string | null; metadata: Record<string, unknown> | null } | null, envRow: { environment_name: string | null; standing: string | null; metadata: Record<string, unknown> | null } | null): RegistryState {
  const registry = asRecord(registryRow?.metadata)
  const env = asRecord(envRow?.metadata)
  return {
    title: registryRow?.display_title ?? envRow?.environment_name ?? heldState.title,
    releaseState: registryRow?.release_state ?? asString(env.public_release_state) ?? heldState.releaseState,
    accessState: registryRow?.access_state ?? heldState.accessState,
    envKey: asString(registry.env_key) ?? heldState.envKey,
    circuit: asString(registry.circuit) ?? asString(env.circuit) ?? heldState.circuit,
    current: asString(registry.current) ?? asString(env.current) ?? heldState.current,
    authority: asString(registry.authority) ?? asString(env.authority) ?? heldState.authority,
    material: asString(env.material_family) ?? "obsidian",
    noninheritance: registry.standing_inheritance === false || env.noninheritance_rule === true,
  }
}

export default function C3CommunityConnect() {
  const [state, setState] = useState<RegistryState>(heldState)
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<CaptureResult | null>(null)

  useEffect(() => {
    let active = true
    if (supabaseConfigError) {
      setLoading(false)
      return () => { active = false }
    }

    Promise.all([
      supabase
        .from("measures_registry")
        .select("display_title,release_state,access_state,metadata")
        .eq("registry_key", "c3_community_connect")
        .eq("is_active", true)
        .maybeSingle(),
      supabase
        .from("c3_environment")
        .select("environment_name,standing,metadata")
        .eq("env_key", "env_c3_community_connect")
        .eq("is_active", true)
        .maybeSingle(),
    ]).then(([registryResult, envResult]) => {
      if (!active) return
      setState(stateFromRows(registryResult.data, envResult.data))
      setLoading(false)
    }).catch(() => {
      if (!active) return
      setState(heldState)
      setLoading(false)
    })

    return () => { active = false }
  }, [])

  async function submitCandidate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setResult(null)
    const response = await fetch("/api/c3-community-connect-capture", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        message: form.get("message"),
      }),
    })
    setResult(await response.json())
  }

  return (
    <main className="c3-connect-shell" data-c3-route="/" data-standing-created="false">
      <section className="c3-connect-hero" aria-labelledby="c3-connect-title">
        <div className="c3-connect-hero-copy">
          <p className="c3-connect-kicker">{state.circuit}</p>
          <h1 id="c3-connect-title">{state.title}</h1>
          <p>
            A held Current-facing entry for people seeking a governed c3 Community connection.
            The page can receive candidate intent, but only Current can dispose relational standing.
          </p>
        </div>
        <dl className="c3-connect-state" aria-label="registered encounter state">
          <div><dt>Release</dt><dd>{loading ? "loading" : state.releaseState}</dd></div>
          <div><dt>Access</dt><dd>{loading ? "loading" : state.accessState}</dd></div>
          <div><dt>Authority</dt><dd>{state.authority}</dd></div>
          <div><dt>Material</dt><dd>{state.material}</dd></div>
        </dl>
      </section>

      <section className="c3-connect-mission" aria-labelledby="c3-connect-mission">
        <div>
          <p className="c3-connect-kicker">Mission</p>
          <h2 id="c3-connect-mission">Connection Without Standing Drift</h2>
        </div>
        <p>
          C1 Connect keeps the public doorway separate from c3 Field activation, operations,
          and Current disposition. Submitting this form does not create membership, access,
          partnership, certification, token standing, or execution authority.
        </p>
      </section>

      <section className="c3-connect-panel" aria-labelledby="c3-connect-form">
        <div>
          <p className="c3-connect-kicker">Candidate Signal</p>
          <h2 id="c3-connect-form">Request Current Review</h2>
        </div>
        <form className="c3-connect-form" onSubmit={submitCandidate}>
          <label>
            Name
            <input name="name" autoComplete="name" minLength={2} required />
          </label>
          <label>
            Email
            <input name="email" autoComplete="email" type="email" required />
          </label>
          <label>
            Message
            <textarea name="message" rows={4} />
          </label>
          <button type="submit">Submit Candidate Signal</button>
        </form>
        {result && (
          <div className="c3-connect-result" role="status">
            <strong>{result.result_label}</strong>
            <span>{result.message}</span>
          </div>
        )}
      </section>
    </main>
  )
}

export function HeldUnknownC3FieldRoute({ pathname }: { pathname: string }) {
  return (
    <main className="c3-connect-shell c3-connect-held" data-c3-route={pathname} data-operations-exposed="false">
      <section className="c3-connect-panel" aria-labelledby="c3-held-route">
        <p className="c3-connect-kicker">Route Held</p>
        <h1 id="c3-held-route">c3 Field Path Not Seated</h1>
        <p>
          This pathname has no governed c3 Field frontend boundary. It does not expose
          the OAR Operations Spine and does not create standing.
        </p>
      </section>
    </main>
  )
}
