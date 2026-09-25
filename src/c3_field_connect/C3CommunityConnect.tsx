import { FormEvent, useEffect, useRef, useState } from "react"
import { loadC1EnvironmentPackage } from "./c1EnvironmentPackage"
import MillionDollarMissionLanding from "./MillionDollarMissionLanding"
import {loadC3PublicPresentation,type C3PublicPresentation} from "./c3PublicPresentation"
import type {InitiativeSurfaceRuntime} from "./initiativeSurfaceHost"
import EternalFlame from "./EternalFlame"


export default function C3CommunityConnect({initiativeSurface=null}:{initiativeSurface?:InitiativeSurfaceRuntime|null}={}) {
  return <C3CommunityConnectSurface initiativeSurface={initiativeSurface} />
}

function C3CommunityConnectSurface({initiativeSurface}:{initiativeSurface:InitiativeSurfaceRuntime|null}) {
  const [environment, setEnvironment] = useState<Awaited<ReturnType<typeof loadC1EnvironmentPackage>> | null>(null)
  const [presentation,setPresentation]=useState<C3PublicPresentation|null>(null)
  const [presentationFailed,setPresentationFailed]=useState(false)
  useEffect(() => {
    let active = true
    loadC1EnvironmentPackage().then(value => { if (active) setEnvironment(value) }).catch(() => { if (active) setLoadFailed(true) })
    if(!initiativeSurface) loadC3PublicPresentation().then(value=>{if(active)setPresentation(value)}).catch(()=>{if(active)setPresentationFailed(true)})
    return () => { active = false }
  }, [initiativeSurface])
  const [loadFailed, setLoadFailed] = useState(false)
  const [connectAs, setConnectAs] = useState("individual")
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [mediaFailed, setMediaFailed] = useState(false)
  const [publicStage, setPublicStage] = useState<"intro"|"landing"|"connect">(() => initiativeSurface ? (window.location.pathname === "/connect" ? "connect" : "landing") : (window.location.pathname === "/connect" ? "connect" : "intro"))
  const [introMuted, setIntroMuted] = useState(true)
  const introVideoRef = useRef<HTMLVideoElement | null>(null)
  const [emblemFailed, setEmblemFailed] = useState(false)
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 600px)").matches)
  const shareReference = (() => {
    const value = new URLSearchParams(window.location.search).get("via")
    return value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value) ? value : null
  })()
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
          ...(shareReference ? { shareReference } : {}),
          ...(connectAs === "initiative" ? { initiativeKey: form.get("initiativeKey") } : {}),
        }),
      })
      const body: unknown = await response.json().catch(() => null)
      const held = body && typeof body === "object" && "standing" in body &&
        typeof body.standing === "string" && body.standing.startsWith("held")
      const verificationRequired = response.status === 202 && body && typeof body === "object" &&
        "standing" in body && body.standing === "verification_required"
      const continuationSent = response.status === 202 && body && typeof body === "object" &&
        "standing" in body && body.standing === "continuation_sent"
      setResult(continuationSent
        ? "Check your email to continue to your existing environment."
        : verificationRequired
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
  if (!initiativeSurface && publicStage!=="intro" && !presentation && !presentationFailed) return <main className="c3-connect-shell c3-connect-held"><p className="c3-connect-width" role="status">Loading public presentation…</p></main>
  if (!initiativeSurface && publicStage!=="intro" && (!presentation || presentationFailed)) return <main className="c3-connect-shell c3-connect-held"><p className="c3-connect-width" role="status">Public presentation authority is temporarily unavailable.</p></main>
  const { copy, assets } = environment
  // Initiative projection remains held until independently registered; ordinary individual Connect stays available.
  const initiatives: typeof environment.initiatives = []

  if(publicStage==="intro"){
    return (
      <main className="c3-intro-env" data-c3-environment="env_c3_community_connect" data-c3-presentation-state="c3field_public_intro" data-standing-created="false">
        {environment.reviewOnly && <div className="c3-connect-review" role="note">Implementation preview · Connecting is not open. Submissions are not saved.</div>}
        {mediaFailed ? (
          <div className="c3-intro-fallback" role="status">
            <p>The introduction is temporarily unavailable.</p>
            <button className="c3-connect-button" type="button" onClick={() => setPublicStage("landing")}>CONTINUE <span aria-hidden="true">↗</span></button>
          </div>
        ) : (
          <video
            ref={introVideoRef}
            src={mobile && assets.intro.mobileSrc ? assets.intro.mobileSrc : assets.intro.src}
            autoPlay
            muted={introMuted}
            playsInline
            preload="auto"
            poster={assets.intro.poster}
            aria-label={copy.mediaTitle}
            onEnded={() => setPublicStage("landing")}
            onError={() => setMediaFailed(true)}
          >
            Your browser does not support this video.
          </video>
        )}
        {!mediaFailed && <button className="c3-intro-sound" type="button" aria-pressed={!introMuted} onClick={() => {
          const nextMuted = !introMuted
          setIntroMuted(nextMuted)
          if (introVideoRef.current) introVideoRef.current.muted = nextMuted
        }}>{introMuted ? "SOUND ON" : "SOUND OFF"}</button>}
      </main>
    )
  }

  if(publicStage==="landing" && initiativeSurface?.initiativeKey==="47pct"){
    const publicPresentation=initiativeSurface.publicPresentation!
    const watermarkOpacity=typeof publicPresentation.watermark_opacity==="number"?publicPresentation.watermark_opacity:.12
    return <main className="c3-connect-shell pct47-surface" data-c3-route="/" data-c3-environment="env_c3_community_connect" data-standing-created="false">
      {publicPresentation.watermark_runtime_url&&<img className="pct47-watermark" src={publicPresentation.watermark_runtime_url} alt="" aria-hidden="true" style={{opacity:watermarkOpacity}} />}
      <header className="c3-connect-header c3-connect-width">
        <a href="/" className="c3-connect-identity" aria-label="4.7% home">
          {publicPresentation.watermark_runtime_url&&<img src={publicPresentation.watermark_runtime_url} alt="" width="48" height="48" />}
          <span>{publicPresentation.title}</span>
        </a>
        <nav className="c3-connect-public-nav" aria-label="Public"><button className="c3-connect-nav" type="button" onClick={()=>setPublicStage("connect")}>{publicPresentation.primary_cta} <span aria-hidden="true">↗</span></button></nav>
      </header>
      <section className="c3-connect-panel c3-connect-width" aria-labelledby="pct47-title">
        <div className="c3-connect-form-intro">
          <p className="c3-connect-kicker">{publicPresentation.kicker}</p>
          <h1 id="pct47-title">{publicPresentation.title}</h1>
          <p className="c3-connect-form-lead">{publicPresentation.initiative_explanation}</p>
          {publicPresentation.audience_copy&&<p className="c3-connect-form-meaning">{publicPresentation.audience_copy}</p>}
        </div>
        <div className="c3-connect-form">
          <EternalFlame label={publicPresentation.memorial_name} text={publicPresentation.memorial_text} />
          <p className="c3-connect-custody">{publicPresentation.connect_copy}</p>
          <button className="c3-connect-button" type="button" onClick={()=>setPublicStage("connect")}>{publicPresentation.primary_cta} <span aria-hidden="true">↗</span></button>
        </div>
      </section>
      <footer className="c3-connect-footer c3-connect-width"><div><strong>c3 Community Partners</strong><span>{publicPresentation.title}</span></div></footer>
    </main>
  }
  if(publicStage==="landing" && presentation) return <MillionDollarMissionLanding presentation={presentation} />

  if(initiativeSurface?.initiativeKey==="47pct"){
    const publicPresentation=initiativeSurface.publicPresentation!
    return <main className="c3-connect-shell pct47-surface" data-c3-route="/connect" data-c3-environment="env_c3_community_connect" data-standing-created="false">
    {publicPresentation.watermark_runtime_url&&<img className="pct47-watermark" src={publicPresentation.watermark_runtime_url} alt="" aria-hidden="true" style={{opacity:Math.max(.05,(publicPresentation.watermark_opacity??.12)*.72)}} />}
    <a className="c3-connect-skip" href="#connect">Skip to Connect</a>
    <header className="c3-connect-header c3-connect-width">
      <button type="button" className="c3-connect-identity" aria-label="Return to 4.7%" onClick={()=>setPublicStage("landing")}>
        {publicPresentation.watermark_runtime_url&&<img src={publicPresentation.watermark_runtime_url} alt="" width="44" height="44" />}
        <span>{publicPresentation.title}</span>
      </button>
      <nav className="c3-connect-public-nav" aria-label="Public"><span>{publicPresentation.memorial_name} · {publicPresentation.memorial_text}</span></nav>
    </header>
    <section id="connect" className="c3-connect-panel c3-connect-width" aria-labelledby="pct47-connect-title">
      <div className="c3-connect-form-intro">
        <p className="c3-connect-kicker">{publicPresentation.primary_cta}</p>
        <h1 id="pct47-connect-title">{publicPresentation.connect_copy}</h1>
        <p className="c3-connect-form-meaning">Enter through your own environment. Check your email to continue after Connect.</p>
        <EternalFlame compact label={publicPresentation.memorial_name} text={publicPresentation.memorial_text} className="pct47-connect-flame" />
      </div>
      <form className="c3-connect-form" onSubmit={submitCandidate} aria-busy={pending}>
        {environment.encounterEnabled === false && <p role="status">Connecting is not open yet. Please return later.</p>}
        <fieldset disabled={pending || environment.encounterEnabled === false}>
          <legend className="c3-connect-sr-only">Your connection</legend>
          <div className="c3-connect-input-pair">
            <label>Name<input name="name" autoComplete="name" minLength={2} maxLength={160} required /></label>
            <label>Email<input name="email" autoComplete="email" type="email" maxLength={254} required /></label>
          </div>
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
    <footer className="c3-connect-footer c3-connect-width"><div><strong>c3 Community Partners</strong><span>{publicPresentation.title}</span><span>{publicPresentation.memorial_name} · {publicPresentation.memorial_text}</span></div></footer>
  </main>
  }

  return (
    <main className="c3-connect-shell" data-c3-route="/connect" data-c3-environment="env_c3_community_connect" data-standing-created="false">

      <a className="c3-connect-skip" href="#connect">Skip to Connect</a>
      {environment.reviewOnly && <div className="c3-connect-review" role="note">Implementation preview · Connecting is not open. Submissions are not saved.</div>}

      <header className="c3-connect-header c3-connect-width">
        <a href="/" className="c3-connect-identity" aria-label={presentation?.brand+" home"}>
          {presentation?.media_roles.handcrafted_emblem && !emblemFailed && <img src={"/api/free-media?asset="+presentation.media_roles.handcrafted_emblem} alt="" onError={() => setEmblemFailed(true)} width="54" height="54" />}
          <span>{presentation?.brand}</span>
        </a>
        <nav className="c3-connect-public-nav" aria-label="Public">
          {presentation?.navigation.filter(item=>["/community-potential","/privacy","/contact"].includes(item.route)).map(item=><a key={item.route} href={item.route}>{item.label}</a>)}
          <a className="c3-connect-nav" href="#connect">CONNECT <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <section id="connect" className="c3-connect-panel c3-connect-width" aria-labelledby="c3-connect-form-title">
        <div className="c3-connect-form-intro" style={presentation?.media_roles.connect_room ? {backgroundImage:`linear-gradient(90deg,rgba(9,12,14,.88),rgba(9,12,14,.58)),url("/api/free-media?asset=${presentation.media_roles.connect_room}")`} : undefined}>
          <p className="c3-connect-kicker">CONNECT</p>
          <h1 id="c3-connect-form-title">{presentation?.connect_presentation?.hero_title ?? copy.heroTitle}</h1>
          {presentation?.connect_presentation?.hero_body && <p className="c3-connect-form-lead">{presentation.connect_presentation.hero_body}</p>}
          <p className="c3-connect-form-meaning">{copy.encounterIntro}</p>
        </div>
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

      <footer className="c3-connect-footer c3-connect-width">
        <div><strong>{presentation?.footer.brand}</strong><span>{presentation?.footer.environment_line}</span><span>{presentation?.footer.copyright}</span></div>
        <nav aria-label="Footer">{presentation?.navigation.filter(item=>["/community-potential","/privacy","/terms","/contact"].includes(item.route)).map(item=><a key={item.route} href={item.route}>{item.label}</a>)}</nav>
      </footer>
    </main>
  )

}

export function HeldUnknownC3FieldRoute({ pathname }: { pathname: string }) {
  return <main className="c3-connect-shell c3-connect-held" data-c3-route={pathname} data-operations-exposed="false"><section className="c3-connect-width"><h1>This page is not available yet.</h1><p>Please return later.</p></section></main>
}
