import { FormEvent, useEffect, useRef, useState } from "react"
import { loadC1EnvironmentPackage } from "./c1EnvironmentPackage"
import "./c3CommunityConnect.css"

export default function C3CommunityConnect() {
  const [environment, setEnvironment] = useState<Awaited<ReturnType<typeof loadC1EnvironmentPackage>> | null>(null)
  useEffect(() => {
    let active = true
    loadC1EnvironmentPackage().then(value => { if (active) setEnvironment(value) }).catch(() => { if (active) setLoadFailed(true) })
    return () => { active = false }
  }, [])
  const [loadFailed, setLoadFailed] = useState(false)
  const [connectAs, setConnectAs] = useState("individual")
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [mediaFailed, setMediaFailed] = useState(false)
  const [emblemFailed, setEmblemFailed] = useState(false)
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 600px)").matches)
  useEffect(() => {
    const query = window.matchMedia("(max-width: 600px)")
    const update = () => { setMobile(query.matches); setMediaFailed(false) }
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  const submitting = useRef(false)

  async function submitCandidate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current || !environment?.available || environment.encounterEnabled === false) return
    const form = new FormData(event.currentTarget)
    if (!event.currentTarget.checkValidity()) return
    submitting.current = true
    setPending(true)
    setResult(null)
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 15000)
    try {
      const response = await fetch("/api/c3-community-connect-capture", {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          name: String(form.get("name") ?? "").trim(),
          email: String(form.get("email") ?? "").trim(),
          message: String(form.get("message") ?? "").trim(),
          consent: form.get("consent") === "on",
          participationIntention: form.get("participationIntention") === "on",
          attestation: form.get("attestation") === "on",
          connectAs,
          ...(connectAs === "initiative" ? { initiativeKey: form.get("initiativeKey") } : {}),
        }),
      })
      const body: unknown = await response.json().catch(() => null)
      const held = body && typeof body === "object" && "standing" in body &&
        typeof body.standing === "string" && body.standing.startsWith("held")
      const verificationRequired = response.status === 202 && body && typeof body === "object" &&
        "standing" in body && body.standing === "verification_required"
      setResult(verificationRequired
        ? "If your request can be processed, check your email to confirm your connection."
        : held
          ? "We could not confirm your connection. Your information remains in this form."
          : "We could not confirm a saved submission. Your information remains in this form.")
    } catch {
      setResult("We could not reach the connection service. Your information remains in this form; no saved submission is confirmed.")
    } finally {
      window.clearTimeout(timeout)
      submitting.current = false
      setPending(false)
    }
  }

  if (!environment && !loadFailed) return <main className="c3-connect-shell c3-connect-held"><p className="c3-connect-width" role="status">Loading…</p></main>
  if (!environment?.available) return <HeldUnknownC3FieldRoute pathname="/" />
  const { copy, assets, initiatives } = environment

  return (
    <main className="c3-connect-shell" data-c3-route="/" data-standing-created="false">
      <a className="c3-connect-skip" href="#connect">Skip to Connect</a>
      {environment.reviewOnly && <div className="c3-connect-review" role="note">Implementation preview · Connecting is not open. Submissions are not saved.</div>}
      <header className="c3-connect-header c3-connect-width">
        <a href="#top" className="c3-connect-identity" aria-label="c3 Community Partners home">
          {!emblemFailed && <img src={assets.emblem.src} alt={assets.emblem.alt} onError={() => setEmblemFailed(true)} width="54" height="54" />}
          <span>c3 Community<br /><strong>Partners</strong></span>
        </a>
        <a className="c3-connect-nav" href="#connect">CONNECT <span aria-hidden="true">↗</span></a>
      </header>

      <section id="top" className="c3-connect-hero c3-connect-width" aria-labelledby="c3-connect-title">
        <div className="c3-connect-hero-copy">
          <p className="c3-connect-kicker">{copy.brandLine}</p>
          <h1 id="c3-connect-title">{copy.heroTitle}</h1>
          <p className="c3-connect-lead">{copy.heroBody}</p>
          <a className="c3-connect-button" href="#connect">CONNECT <span aria-hidden="true">↗</span></a>
        </div>
        <div className="c3-connect-emblem-stage" aria-hidden="true">
          {!emblemFailed && <img src={assets.emblem.src} alt="" onError={() => setEmblemFailed(true)} />}
        </div>
      </section>
      <div className="c3-connect-structure c3-connect-width">{copy.structuralLine}</div>

      <section className="c3-connect-mission" aria-labelledby="c3-connect-mission-title">
        <div className="c3-connect-width c3-connect-mission-grid">
          <div><p className="c3-connect-kicker">Our shared mission</p><h2 id="c3-connect-mission-title">{copy.missionTitle}</h2></div>
          <div className="c3-connect-mission-body"><p>{copy.missionBody}</p><p className="c3-connect-mission-closing">{copy.missionClosing}</p></div>
        </div>
      </section>

      <section className="c3-connect-media c3-connect-width" aria-labelledby="c3-connect-media-title">
        <div className="c3-connect-section-heading"><p className="c3-connect-kicker">{copy.brandLine}</p><h2 id="c3-connect-media-title">{copy.mediaTitle}</h2></div>
        <div className="c3-connect-video-frame">
          {mediaFailed ? <p className="c3-connect-media-unavailable" role="status">The introduction is temporarily unavailable.</p> :
            <video src={mobile && assets.intro.mobileSrc ? assets.intro.mobileSrc : assets.intro.src} controls playsInline preload="metadata" poster={assets.intro.poster} aria-label={copy.mediaTitle} onError={() => setMediaFailed(true)}>
              Your browser does not support this video.
            </video>}
        </div>
      </section>

      <section id="connect" className="c3-connect-panel c3-connect-width" aria-labelledby="c3-connect-form-title">
        <div className="c3-connect-form-intro"><p className="c3-connect-kicker">CONNECT</p><h2 id="c3-connect-form-title">{copy.encounterIntro}</h2></div>
        <form className="c3-connect-form" onSubmit={submitCandidate} aria-busy={pending}>
          {environment.encounterEnabled === false && <p role="status">Connecting is not open yet. Please return later.</p>}
          <fieldset disabled={pending || environment.encounterEnabled === false}>
            <legend className="c3-connect-sr-only">Your connection</legend>
            <div className="c3-connect-input-pair">
              <label>Name<input name="name" autoComplete="name" minLength={2} maxLength={160} required /></label>
              <label>Email<input name="email" autoComplete="email" type="email" maxLength={254} required /></label>
            </div>
            <label>Connect as:
              <select name="connectAs" value={connectAs} onChange={event => setConnectAs(event.target.value)}>
                <option value="individual">Individual</option>
                {initiatives.length > 0 && <option value="initiative">Initiative / Event</option>}
              </select>
            </label>
            {connectAs === "initiative" && <label>Initiative / Event<select name="initiativeKey" required defaultValue=""><option value="" disabled>Select an initiative or event</option>{initiatives.map(initiative => <option key={initiative.key} value={initiative.key}>{initiative.label}</option>)}</select></label>}
            <label>{copy.openPrompt}<textarea name="message" rows={5} maxLength={4000} /></label>
            <p className="c3-connect-custody">{copy.custodyNotice}</p>
            <label className="c3-connect-check"><input name="consent" type="checkbox" required /><span>{copy.consent}</span></label>
            <label className="c3-connect-check"><input name="attestation" type="checkbox" required /><span>{copy.attestation}</span></label>
            <label className="c3-connect-check"><input name="participationIntention" type="checkbox" required /><span>{copy.participationIntention}</span></label>
            <button className="c3-connect-button" type="submit">{pending ? "Sending…" : "CONNECT"}<span aria-hidden="true">↗</span></button>
          </fieldset>
          {result && <p className="c3-connect-result" role="status">{result}</p>}
        </form>
      </section>
      <footer className="c3-connect-footer c3-connect-width"><span>c3 Community Partners</span><span>{copy.brandLine}</span></footer>
    </main>
  )
}

export function HeldUnknownC3FieldRoute({ pathname }: { pathname: string }) {
  return <main className="c3-connect-shell c3-connect-held" data-c3-route={pathname} data-operations-exposed="false"><section className="c3-connect-width"><p className="c3-connect-kicker"><span className="c3-connect-brand-token">c3</span> Community Partners</p><h1>This page is not available yet.</h1><p>Please return later.</p></section></main>
}
