import { FormEvent, useEffect, useState } from "react"
import { supabase, supabaseConfigError } from "../integrations/supabase/client"
import "./c3CommunityConnect.css"

type RegistryState = {
  title: string
  releaseState: string
  accessState: string
  envKey: string
  environmentName: string
  environmentClass: string
  standing: string
  circuit: string
  current: string
  authority: string
  governingBody: string
  functionName: string
}

type CaptureResult = {
  standing: string
  result_label: string
  message: string
  external_standing_created: false
  mutation_count?: number
}

const fallbackState: RegistryState = {
  title: "c3 Community Connect",
  releaseState: "held",
  accessState: "gated",
  envKey: "env_c3_community_connect",
  environmentName: "c1ME_env",
  environmentClass: "c1_connect_environment",
  standing: "governed_environment",
  circuit: "c1",
  current: "C1",
  authority: "Current only",
  governingBody: "c3 Community Partners DAO, LLC",
  functionName: "Connect",
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function stateFromRows(
  registryRow: { display_title: string | null; release_state: string | null; access_state: string | null; metadata: Record<string, unknown> | null } | null,
  envRow: { env_key: string | null; environment_name: string | null; environment_class: string | null; standing: string | null; metadata: Record<string, unknown> | null } | null,
): RegistryState {
  const registry = asRecord(registryRow?.metadata)
  const env = asRecord(envRow?.metadata)
  return {
    title: registryRow?.display_title ?? "c3 Community Connect",
    releaseState: registryRow?.release_state ?? asString(env.public_release_state) ?? fallbackState.releaseState,
    accessState: registryRow?.access_state ?? fallbackState.accessState,
    envKey: envRow?.env_key ?? asString(registry.env_key) ?? fallbackState.envKey,
    environmentName: envRow?.environment_name ?? fallbackState.environmentName,
    environmentClass: envRow?.environment_class ?? fallbackState.environmentClass,
    standing: envRow?.standing ?? fallbackState.standing,
    circuit: asString(env.circuit) ?? asString(registry.circuit) ?? fallbackState.circuit,
    current: asString(env.current) ?? asString(registry.current) ?? fallbackState.current,
    authority: asString(env.authority) ?? asString(registry.authority) ?? fallbackState.authority,
    governingBody: asString(env.governing_body) ?? fallbackState.governingBody,
    functionName: asString(env.function) ?? fallbackState.functionName,
  }
}

export default function C3CommunityConnect() {
  const [state,setState]=useState<RegistryState>(fallbackState)
  const [loading,setLoading]=useState(true)
  const [submitting,setSubmitting]=useState(false)
  const [result,setResult]=useState<CaptureResult|null>(null)

  useEffect(()=>{
    document.title="Connect | c3 Community Partners"
    let active=true
    if(supabaseConfigError){setLoading(false);return()=>{active=false}}
    Promise.all([
      supabase.from("measures_registry").select("display_title,release_state,access_state,metadata").eq("registry_key","c3_community_connect").eq("is_active",true).maybeSingle(),
      supabase.from("c3_environment").select("env_key,environment_name,environment_class,standing,metadata").eq("env_key","env_c3_community_connect").eq("is_active",true).maybeSingle(),
    ]).then(([registryResult,envResult])=>{
      if(!active)return
      setState(stateFromRows(registryResult.data,envResult.data))
      setLoading(false)
    }).catch(()=>{if(active)setLoading(false)})
    return()=>{active=false}
  },[])

  async function submitCandidate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form=new FormData(event.currentTarget)
    setSubmitting(true)
    setResult(null)
    try {
      const response=await fetch("/api/c3-community-connect-capture",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({
          name:form.get("name"),
          email:form.get("email"),
          message:form.get("message"),
        }),
      })
      setResult(await response.json())
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="c1me-shell" data-environment={state.envKey} data-standing={state.standing}>
      <aside className="c1me-rail">
        <a className="c1me-brand" href="/">
          <strong>c3</strong>
          <span>Community Partners</span>
        </a>
        <nav aria-label="c1ME environment">
          <a href="#connect" aria-current="page">Connect</a>
          <a href="#environment">Environment</a>
          <a href="#passage">Passage</a>
          <a href="/my-environment">My Environment</a>
        </nav>
        <div className="c1me-rail-foot">
          <span>CONNECT</span>
          <span>CONTRIBUTE</span>
          <span>CREATE</span>
        </div>
      </aside>

      <section className="c1me-main">
        <section className="c1me-hero" id="connect">
          <div className="c1me-tree" aria-hidden="true">
            <img src="/c3ops/c3-tree-source-v1.png" alt="" />
          </div>
          <div className="c1me-hero-copy">
            <p className="c1me-kicker">C1 · Connect</p>
            <h1>Find your place<br/>in the environment.</h1>
            <p className="c1me-lede">
              Connection begins with a real person, a real place, and a reason to participate.
            </p>
            <a className="c1me-primary-link" href="#signal">Open Connect</a>
          </div>

          <aside className="c1me-state-card" id="environment" aria-label="C1 environment state">
            <p className="c1me-kicker">Environment</p>
            <h2>{state.environmentName}</h2>
            <code>{state.envKey}</code>
            <dl>
              <div><dt>Function</dt><dd>{state.functionName}</dd></div>
              <div><dt>Standing</dt><dd>{loading ? "resolving" : state.standing.replace(/_/g," ")}</dd></div>
              <div><dt>Current</dt><dd>{state.current}</dd></div>
              <div><dt>Authority</dt><dd>{state.authority}</dd></div>
              <div><dt>Release</dt><dd>{loading ? "resolving" : state.releaseState}</dd></div>
            </dl>
            <p className="c1me-owner">Governed by {state.governingBody}</p>
          </aside>
        </section>

        <section className="c1me-passage" id="passage" aria-labelledby="c1me-passage-title">
          <div>
            <p className="c1me-kicker">The passage</p>
            <h2 id="c1me-passage-title">Connect does not mean surrender.</h2>
          </div>
          <div className="c1me-passage-grid">
            <article><span>01</span><h3>Signal</h3><p>You tell us who you are and where you see a possible connection.</p></article>
            <article><span>02</span><h3>Review</h3><p>The environment receives the signal without inventing membership, authority, or standing.</p></article>
            <article><span>03</span><h3>Relation</h3><p>A valid relation can progress only through the governed passage that actually applies.</p></article>
          </div>
        </section>

        <section className="c1me-connect" id="signal" aria-labelledby="c1me-connect-title">
          <div className="c1me-connect-intro">
            <p className="c1me-kicker">Candidate signal</p>
            <h2 id="c1me-connect-title">Where could connection create possibility?</h2>
            <p>
              Share enough for c3 Community Partners to understand the connection you are trying to make.
              Submitting this form does not by itself create membership, partnership, access, or execution authority.
            </p>
          </div>

          <form className="c1me-form" onSubmit={submitCandidate}>
            <label>
              <span>Name</span>
              <input name="name" autoComplete="name" minLength={2} required />
            </label>
            <label>
              <span>Email</span>
              <input name="email" autoComplete="email" type="email" required />
            </label>
            <label>
              <span>What do you want to connect?</span>
              <textarea name="message" rows={6} placeholder="People, skills, ideas, resources, a place, a project…" />
            </label>
            <button type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send Connection Signal"}</button>
          </form>

          {result ? (
            <div className="c1me-result" role="status">
              <p className="c1me-kicker">{result.standing.replace(/_/g," ")}</p>
              <h3>{result.result_label}</h3>
              <p>{result.message}</p>
            </div>
          ) : null}
        </section>

        <footer className="c1me-footer">
          <strong>c3</strong>
          <span>People · Places · Possibility</span>
          <span>Connect · Contribute · Create</span>
        </footer>
      </section>
    </main>
  )
}

export function HeldUnknownC3FieldRoute({ pathname }: { pathname: string }) {
  return (
    <main className="c1me-shell c1me-held" data-c3-route={pathname} data-operations-exposed="false">
      <section>
        <p className="c1me-kicker">Route Held</p>
        <h1>c3 Field Path Not Seated</h1>
        <p>This pathname has no governed c3 Field encounter.</p>
      </section>
    </main>
  )
}
