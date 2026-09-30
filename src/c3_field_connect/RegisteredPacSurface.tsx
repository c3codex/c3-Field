import {useEffect,useMemo,useState} from "react"

export type PacSnapshot={
  pac_key:string
  version?:string
  pac_type?:string
  canonical_host?:string
  public_presentation?:Record<string,unknown>
  proposal_projection?:Record<string,unknown>
  members?:Array<Record<string,unknown>>
}
type FreeTruth={
  standing:"ACT"|"DNR"
  reason?:string
  pac_key?:string
  registered_content_sha256?:string
  current_content_sha256?:string
  registered_at?:string
  snapshot?:PacSnapshot
}

function strings(value:unknown){
  return Array.isArray(value)?value.filter((item):item is string=>typeof item==="string"):[]
}
function records(value:unknown){
  return Array.isArray(value)?value.filter((item):item is Record<string,unknown>=>!!item&&typeof item==="object"&&!Array.isArray(item)):[]
}

export function PacSnapshotSurface({
  snapshot,
  snapshotHash,
  mode="runtime"
}:{
  snapshot:PacSnapshot
  snapshotHash?:string|null
  mode?:"runtime"|"review"
}){
  const presentation=snapshot.public_presentation||{}
  const projection=snapshot.proposal_projection||{}
  const cover=useMemo(()=>{
    const members=snapshot.members||[]
    return members.find(member=>member.member_role==="cover_master"&&typeof member.runtime_uri==="string"&&member.runtime_uri)
  },[snapshot])

  const overview=strings(projection.overview)
  const readerPromise=strings(projection.reader_promise)
  const whyNow=strings(projection.why_now)
  const audience=strings(projection.audience)
  const market=strings(projection.market_position)
  const authorBackground=strings(projection.author_background)
  const platform=strings(projection.platform_publicity)
  const disclosure=strings(projection.authorship_ai_collaboration)
  const chapters=records(projection.chapter_outline)
  const comparables=records(projection.comparables)

  return <main style={{
    maxWidth:980,margin:"0 auto",padding:mode==="review"?"32px 24px 56px":"48px 24px 96px",
    fontFamily:"Georgia, 'Times New Roman', serif",lineHeight:1.65
  }}>
    <header style={{borderBottom:"1px solid currentColor",paddingBottom:32,marginBottom:40}}>
      <p style={{textTransform:"uppercase",letterSpacing:".16em",fontSize:12}}>
        {mode==="review"?"Private c3 Field-native review":"Registered public PAC · c3 Field"}
      </p>
      <h1 style={{fontSize:"clamp(3rem,8vw,6.5rem)",lineHeight:.9,margin:"18px 0"}}>
        {String(presentation.title||projection.title||snapshot.pac_key)}
      </h1>
      {presentation.subtitle&&<h2 style={{fontWeight:400,fontSize:"clamp(1.2rem,3vw,2rem)"}}>{String(presentation.subtitle)}</h2>}
      {presentation.thesis&&<blockquote style={{fontSize:"1.35rem",margin:"32px 0 0"}}>{String(presentation.thesis)}</blockquote>}
      {presentation.author&&<p>By {String(presentation.author)}{presentation.ai_narrator_participant?" · with "+String(presentation.ai_narrator_participant):""}</p>}
      {cover&&<img src={String(cover.runtime_uri)} alt={String(presentation.title||"Book cover")} style={{maxWidth:360,width:"100%",marginTop:32}}/>}
    </header>

    {overview.length>0&&<section><h2>Overview</h2>{overview.map((text,index)=><p key={index}>{text}</p>)}</section>}
    {readerPromise.length>0&&<section><h2>Book’s Form and Reader Promise</h2>{readerPromise.map((text,index)=><p key={index}>{text}</p>)}</section>}
    {whyNow.length>0&&<section><h2>Why This Book Now</h2>{whyNow.map((text,index)=><p key={index}>{text}</p>)}</section>}
    {audience.length>0&&<section><h2>Audience</h2>{audience.map((text,index)=><p key={index}>{text}</p>)}</section>}
    {market.length>0&&<section><h2>Market Position</h2>{market.map((text,index)=><p key={index}>{text}</p>)}</section>}

    {comparables.length>0&&<section><h2>Comparable and Adjacent Titles</h2>{comparables.map((item,index)=><article key={index}>
      <h3>{String(item.title||"")}{item.author?" — "+String(item.author):""}</h3>
      {item.relation&&<p>{String(item.relation)}</p>}
    </article>)}</section>}

    {authorBackground.length>0&&<section><h2>Author and Project Background</h2>{authorBackground.map((text,index)=><p key={index}>{text}</p>)}</section>}
    {platform.length>0&&<section><h2>Platform, Publicity, and Promotion</h2>{platform.map((text,index)=><p key={index}>{text}</p>)}</section>}
    {disclosure.length>0&&<section><h2>Authorship and AI Collaboration</h2>{disclosure.map((text,index)=><p key={index}>{text}</p>)}</section>}

    {chapters.length>0&&<section><h2>Chapter Outline</h2>{chapters.map((chapter,index)=><article key={index} style={{marginBottom:24}}>
      <p style={{textTransform:"uppercase",letterSpacing:".12em",fontSize:12}}>Chapter {String(chapter.chapter||index+1)}</p>
      <h3>{String(chapter.title||"")}</h3>
      {chapter.summary&&<p>{String(chapter.summary)}</p>}
    </article>)}</section>}

    <footer style={{borderTop:"1px solid currentColor",marginTop:56,paddingTop:24,fontSize:13}}>
      {mode==="review"
        ?<><p>Private review snapshot · {snapshotHash||"hash unavailable"}</p><p>This is rendered with the same c3 Field PAC surface used by the canonical host. Review does not publish or make the encounter discoverable.</p></>
        :<><p>Registry standing: ACT · Snapshot {snapshotHash}</p><p>FREE renders this registered snapshot only while the current PAC hash matches Registry. Mismatch resolves DNR.</p></>}
    </footer>
  </main>
}

export default function RegisteredPacSurface(){
  const [truth,setTruth]=useState<FreeTruth|null>(null)

  useEffect(()=>{
    let active=true
    void fetch("/api/free-registered-pac",{headers:{accept:"application/json"},cache:"no-store"})
      .then(async response=>await response.json() as FreeTruth)
      .then(body=>{if(active)setTruth(body)})
      .catch(()=>{if(active)setTruth({standing:"DNR",reason:"FREE unavailable"})})
    return()=>{active=false}
  },[])

  if(!truth) return <main style={{maxWidth:900,margin:"0 auto",padding:"64px 24px",fontFamily:"Georgia, serif"}}><p>Resolving registered PAC…</p></main>

  if(truth.standing!=="ACT"||!truth.snapshot) return <main style={{maxWidth:900,margin:"0 auto",padding:"64px 24px",fontFamily:"Georgia, serif"}}>
    <p style={{textTransform:"uppercase",letterSpacing:".14em",fontSize:12}}>c3 Field · FREE</p>
    <h1>Public encounter unavailable.</h1>
    <p>The registered PAC did not resolve.</p>
    <p><strong>DNR</strong>{truth.reason?" · "+truth.reason:""}</p>
  </main>

  return <PacSnapshotSurface snapshot={truth.snapshot} snapshotHash={truth.registered_content_sha256} mode="runtime"/>
}
