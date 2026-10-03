import {useEffect,useState} from "react"
import "./c3CommunityConnect.css"
import "./FieldReporterEncounter.css"

type Decision={standing:string;reason:string;publicationLabel?:string;deskLabel?:string;editorialVoice?:string;title?:string}
export default function FieldReporterEncounter(){
  const [decision,setDecision]=useState<Decision|null>(null)
  useEffect(()=>{
    let active=true
    const match=/^\/field-reporter\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(window.location.pathname)
    if(!match){setDecision({standing:"HLD",reason:"publication_slug_invalid"});return}
    void fetch("/api/field-reporter?slug="+encodeURIComponent(match[1]),{headers:{accept:"application/json"},cache:"no-store"})
      .then(response=>response.json())
      .then(body=>{
        if(!active)return
        if(body.standing!=="HLD"||typeof body.reason!=="string")throw new Error("publication_decision_unverified")
        setDecision(body)
        if(body.title)document.title=body.title+" | "+body.publicationLabel
        // A held encounter cannot claim an article canonical URL.
        document.querySelector('link[rel="canonical"]')?.remove()
        for(const selector of ['meta[property="og:url"]','meta[property="og:image"]'])document.querySelector(selector)?.remove()
      }).catch(()=>{if(active)setDecision({standing:"HLD",reason:"publication_decision_unverified"})})
    return()=>{active=false}
  },[])
  return <main className="c3-connect-shell pct47-field-reporter">
    <div className="c3-connect-width">
      <header><a href="/">4.7%</a>{decision?.publicationLabel&&<p>{decision.publicationLabel}</p>}</header>
      <article>
        {decision?.deskLabel&&<p className="c3-connect-kicker">{decision.deskLabel} · {decision.editorialVoice}</p>}
        {decision?.title&&<h1>{decision.title}</h1>}
        <section role="status" aria-live="polite">
          <h2>{decision?"Publication held":"Resolving publication…"}</h2>
          {decision&&<><p>Standing: {decision.standing}</p><p className="pct47-publication-reason">{decision.reason}</p></>}
        </section>
      </article>
    </div>
  </main>
}
