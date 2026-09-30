import {useEffect,useState,type FormEvent} from "react"
import ProfilePacPanel,{type ProfileContract,type ProfileShape} from "./ProfilePacPanel"
import {PacSnapshotSurface,type PacSnapshot} from "./RegisteredPacSurface"

type ReviewState={
  standing:string
  snapshot_hash:string
  reviewed_snapshot_hash?:string|null
  current:boolean
  reviewed_at?:string|null
  candidate_payload:Record<string,unknown>
}
type PersonalPac={
  pac_key:string
  pac_type:string
  version?:string|null
  standing:string
  release_state?:string|null
  custody_uri?:string|null
  custody_provider?:string|null
  title:string
  subtitle?:string|null
  review:ReviewState
  approval:{standing:string;snapshot_hash?:string|null;current:boolean;resolved_at?:string|null}
  encounter_projection:{
    standing:string
    encounter_key:string
    authorized_by_owner:boolean
    presentation_scope:string
    surface_projections:string[]
    authorization_snapshot_hash?:string|null
    resolved_at?:string|null
  }
  distribution:{standing:string;reason?:string|null}
  custody_model?:Record<string,unknown>
}
type Payload={
  authenticated:boolean
  standing:string
  custody_class?:string
  approval_surface?:string
  c2_projection_rule?:string
  pacs?:PersonalPac[]
  reason?:string
}
type Props={
  initialProfile?:ProfileShape|null
  profileContract?:ProfileContract|null
  profileLoaded:boolean
  profileHeld:boolean
  onProfileSaved?:(profile:ProfileShape)=>void
  presentation?:{
    opening_visual_asset_key:string
    owner_changeable:boolean
  }|null
  presentationAsset:string
  onPresentationAssetChange:(value:string)=>void
  onSavePresentation:(event:FormEvent)=>void
}

function record(value:unknown){
  return value&&typeof value==="object"&&!Array.isArray(value)?value as Record<string,unknown>:{}
}
function text(value:unknown){
  return typeof value==="string"?value:""
}
function textArray(value:unknown){
  return Array.isArray(value)?value.filter((item):item is string=>typeof item==="string"):[]
}
function ReviewPreview({pac}:{pac:PersonalPac}){
  const payload=pac.review.candidate_payload
  const presentation=record(payload.public_presentation)
  const proposal=record(payload.proposal_projection)
  const profile=record(payload.profile)
  const profileMeta=record(profile.metadata)
  const personalization=record(profileMeta.personalization)
  const members=Array.isArray(payload.members)?payload.members.filter((item):item is Record<string,unknown>=>!!item&&typeof item==="object"):[]
  const cover=members.find(member=>member.member_role==="cover_master")
  const coverUrl=text(cover?.runtime_uri)
  const title=text(presentation.title)||text(profile.display_label)||pac.title
  const subtitle=text(presentation.subtitle)||pac.subtitle||""
  const thesis=text(presentation.thesis)
  const overview=textArray(proposal.overview)
  const readerPromise=textArray(proposal.reader_promise)
  const about=text(personalization.about)
  const interests=text(personalization.interests)
  const location=text(personalization.location_region)
  const openTo=textArray(personalization.open_to)
  const isProfile=pac.pac_type==="ProfilePAC"
  const isWebPac=pac.pac_type==="c3WebPac"

  return <section className="myenv-pac-review-preview">
    <div className="myenv-thread-heading">
      <p className="myenv-kicker">PRIVATE REVIEW CANDIDATE</p>
      <h3>{title}</h3>
      {subtitle&&<p>{subtitle}</p>}
      <p>This is the human-facing state tied to snapshot <code>{pac.review.snapshot_hash.slice(0,16)}…</code>. Approval binds to this exact snapshot.</p>
    </div>
    {isProfile&&<div className="myenv-profile-review-card">
      <div className="myenv-profile-review-head">
        <div>
          <p className="myenv-kicker">PROFILE</p>
          <h3>{title}</h3>
          {location&&<p>{location}</p>}
        </div>
        {profile.visibility_scope&&<span className="myenv-profile-review-visibility">{text(profile.visibility_scope)}</span>}
      </div>
      {about&&<section>
        <h4>About</h4>
        <p>{about}</p>
      </section>}
      {interests&&<section>
        <h4>Interests</h4>
        <p>{interests}</p>
      </section>}
      {openTo.length>0&&<section>
        <h4>Open to</h4>
        <div className="myenv-profile-review-tags">
          {openTo.map(item=><span key={item}>{item}</span>)}
        </div>
      </section>}
    </div>}
    {isWebPac&&<div className="myenv-native-pac-review">
      <PacSnapshotSurface
        snapshot={payload as unknown as PacSnapshot}
        snapshotHash={pac.review.snapshot_hash}
        mode="review"
      />
    </div>}
    {!isProfile&&!isWebPac&&coverUrl&&<img className="myenv-pac-review-cover" src={coverUrl} alt={title+" review cover"}/>}
    {!isProfile&&!isWebPac&&thesis&&<p><strong>{thesis}</strong></p>}
    {!isProfile&&!isWebPac&&profile.visibility_scope&&<p><strong>Visibility:</strong> {text(profile.visibility_scope)}</p>}
    {!isProfile&&!isWebPac&&overview.map((paragraph,index)=><p key={"overview-"+index}>{paragraph}</p>)}
    {!isProfile&&!isWebPac&&readerPromise.length>0&&<div className="myenv-pac-review-copy">
      <h4>Reader promise</h4>
      {readerPromise.map((paragraph,index)=><p key={"promise-"+index}>{paragraph}</p>)}
    </div>}
    <details className="myenv-pac-review-data">
      <summary>Exact snapshot data</summary>
      <pre>{JSON.stringify(payload,null,2)}</pre>
    </details>
  </section>
}

export default function MyPacsPanel({
  initialProfile,profileContract,profileLoaded,profileHeld,onProfileSaved,
  presentation,presentationAsset,onPresentationAssetChange,onSavePresentation
}:Props){
  const [pacs,setPacs]=useState<PersonalPac[]>([])
  const [loaded,setLoaded]=useState(false)
  const [notice,setNotice]=useState("")
  const [busy,setBusy]=useState("")
  const [previewPac,setPreviewPac]=useState("")

  async function load(){
    try{
      const response=await fetch("/api/my-environment-pacs",{headers:{accept:"application/json"},cache:"no-store"})
      const body=await response.json() as Payload
      if(!response.ok||body.standing!=="my_pacs_ready")
        throw new Error(body.reason||body.standing||"My PACs could not be resolved.")
      setPacs(body.pacs||[])
      setLoaded(true)
    }catch(error){
      setLoaded(false)
      setNotice(error instanceof Error?error.message:"My PACs could not be resolved.")
    }
  }

  useEffect(()=>{void load()},[])

  async function reviewSnapshot(pac:PersonalPac,next:"REVIEWED"|"HLD"){
    if(busy)return
    setBusy(pac.pac_key);setNotice("")
    try{
      const response=await fetch("/api/my-environment-pacs",{
        method:"POST",
        headers:{"content-type":"application/json","accept":"application/json"},
        body:JSON.stringify({
          action:"review_snapshot",
          pac_key:pac.pac_key,
          review_disposition:next,
          candidate_hash:pac.review.snapshot_hash
        })
      })
      const body=await response.json().catch(()=>null) as {
        standing?:string;reason?:string;review_standing?:string;review_snapshot_hash?:string;reviewed_at?:string
      }|null
      if(!response.ok||!body||!["ACT","HLD"].includes(String(body.standing||"")))
        throw new Error(body?.reason||body?.standing||"Review resolution did not persist.")
      setPacs(current=>current.map(item=>item.pac_key===pac.pac_key?{
        ...item,
        review:{
          ...item.review,
          standing:body.review_standing||next,
          reviewed_snapshot_hash:body.review_snapshot_hash||item.review.snapshot_hash,
          current:next==="REVIEWED",
          reviewed_at:body.reviewed_at||new Date().toISOString()
        },
        approval:{...item.approval,current:false},
        distribution:{
          standing:next==="REVIEWED"?"HLD_APPROVAL_REFRESH_REQUIRED":"HLD_REVIEW",
          reason:next==="REVIEWED"?"review_complete_exact_approval_required":"owner_held_after_review"
        }
      }:item))
      setNotice(next==="REVIEWED"
        ?"Exact review snapshot recorded. Approve this reviewed version to bind approval to what you saw."
        :"PAC held at review.")
    }catch(error){
      setNotice(error instanceof Error?error.message:"Review resolution did not persist.")
    }finally{setBusy("")}
  }

  async function disposition(pacKey:string,next:"APPROVED"|"HLD"){
    if(busy)return
    setBusy(pacKey);setNotice("")
    try{
      const response=await fetch("/api/my-environment-pacs",{
        method:"POST",
        headers:{"content-type":"application/json","accept":"application/json"},
        body:JSON.stringify({action:"custody_disposition",pac_key:pacKey,disposition:next})
      })
      const body=await response.json().catch(()=>null) as {
        standing?:string;reason?:string;resolved_at?:string;encounter_projection_standing?:string;approval_snapshot_hash?:string
      }|null
      if(!response.ok||!body||!["ACT","HLD"].includes(String(body.standing||"")))
        throw new Error(body?.reason||body?.standing||"PAC disposition did not resolve.")
      setPacs(current=>current.map(pac=>pac.pac_key===pacKey?{
        ...pac,
        approval:{
          standing:next,
          snapshot_hash:body.approval_snapshot_hash||null,
          current:next==="APPROVED",
          resolved_at:body.resolved_at||new Date().toISOString()
        },
        encounter_projection:{
          ...pac.encounter_projection,
          standing:body.encounter_projection_standing|| (next==="APPROVED"?"PENDING":"HLD"),
          authorized_by_owner:false,
          resolved_at:null
        },
        distribution:{
          standing:next==="APPROVED"?"HLD_OWNER_DISTRIBUTION_DECISION_REQUIRED":"HLD_PAC",
          reason:next==="APPROVED"?"approval_does_not_authorize_distribution":"pac_not_approved_in_custody"
        }
      }:pac))
      setNotice(next==="APPROVED"
        ?"Reviewed PAC approved in your custody. Encounter and distribution remain separate owner decisions."
        :"PAC held in your custody.")
    }catch(error){
      setNotice(error instanceof Error?error.message:"PAC disposition did not resolve.")
    }finally{setBusy("")}
  }

  async function encounterProjection(
    pacKey:string,
    action:"AUTHORIZE"|"REVOKE",
    surfaceScope:"c3field_only"|"c3field_plus_canopy"="c3field_only"
  ){
    if(busy)return
    setBusy(pacKey);setNotice("")
    try{
      const response=await fetch("/api/my-environment-pacs",{
        method:"POST",
        headers:{"content-type":"application/json","accept":"application/json"},
        body:JSON.stringify({
          action:"encounter_projection",
          pac_key:pacKey,
          projection_action:action,
          encounter_key:"c3envpac_c2me_v0_1",
          surface_scope:surfaceScope
        })
      })
      const body=await response.json().catch(()=>null) as {
        standing?:string;reason?:string;resolved_at?:string
        encounter_projection_standing?:string;authorized_by_owner?:boolean
        presentation_scope?:string;surface_projections?:string[]
        authorization_snapshot_hash?:string
      }|null
      if(!response.ok||!body||!["ACT","HLD"].includes(String(body.standing||"")))
        throw new Error(body?.reason||body?.standing||"Encounter decision did not resolve.")
      setPacs(current=>current.map(pac=>pac.pac_key===pacKey?{
        ...pac,
        encounter_projection:{
          ...pac.encounter_projection,
          standing:body.encounter_projection_standing|| (action==="AUTHORIZE"?"AUTHORIZED":"REVOKED"),
          authorized_by_owner:body.authorized_by_owner===true,
          presentation_scope:body.presentation_scope||surfaceScope,
          surface_projections:Array.isArray(body.surface_projections)?body.surface_projections:[],
          authorization_snapshot_hash:body.authorization_snapshot_hash||null,
          resolved_at:body.resolved_at||new Date().toISOString()
        }
      }:pac))
      setNotice(action==="AUTHORIZE"
        ?(surfaceScope==="c3field_plus_canopy"
          ?"Owner authorized this reviewed PAC for the encounter on c3 Field and Canopy."
          :"Owner authorized this reviewed PAC for the encounter on c3 Field only.")
        :"Encounter projection authorization revoked. PAC remains in your custody.")
    }catch(error){
      setNotice(error instanceof Error?error.message:"Encounter decision did not resolve.")
    }finally{setBusy("")}
  }

  function reviewControls(pac:PersonalPac){
    const previewOpen=previewPac===pac.pac_key
    const approvalReady=pac.review.current
    return <>
      <div className="myenv-pac-status">
        <span>Review · {pac.review.current?"current":pac.review.standing.toLowerCase()}</span>
        <span>Approval · {pac.approval.current?"current":pac.approval.standing.toLowerCase()}</span>
        <span>Distribution · {pac.distribution.standing.replace(/_/g," ").toLowerCase()}</span>
      </div>
      <div className="myenv-chazz-compose-actions">
        <button type="button" onClick={()=>setPreviewPac(previewOpen?"":pac.pac_key)}>
          {previewOpen?"CLOSE PREVIEW":"PREVIEW / REVIEW"}
        </button>
        {previewOpen&&<button type="button" disabled={busy===pac.pac_key} onClick={()=>void reviewSnapshot(pac,"REVIEWED")}>
          {busy===pac.pac_key?"RESOLVING…":"I REVIEWED THIS VERSION"}
        </button>}
        {previewOpen&&<button type="button" disabled={busy===pac.pac_key} onClick={()=>void reviewSnapshot(pac,"HLD")}>HOLD AT REVIEW</button>}
      </div>
      {previewOpen&&<ReviewPreview pac={pac}/>}
      <div className="myenv-chazz-compose-actions">
        <button
          type="button"
          disabled={busy===pac.pac_key||!approvalReady}
          onClick={()=>void disposition(pac.pac_key,"APPROVED")}
        >
          {busy===pac.pac_key?"RESOLVING…":"APPROVE REVIEWED VERSION"}
        </button>
        <button type="button" disabled={busy===pac.pac_key} onClick={()=>void disposition(pac.pac_key,"HLD")}>HOLD PAC</button>
      </div>
      {!approvalReady&&<p className="myenv-runtime-warning">Preview and review the current snapshot before approval. A changed snapshot requires review again.</p>}
    </>
  }

  const profilePac=pacs.find(pac=>pac.pac_type==="ProfilePAC")
  const otherPacs=pacs.filter(pac=>pac.pac_type!=="ProfilePAC")

  return <section className="myenv-connections-thread">
    <div className="myenv-thread-heading">
      <p className="myenv-kicker">PERSONAL CUSTODY</p>
      <h2>My PACs</h2>
      <p>Review the exact candidate before approval. Approval binds to the reviewed snapshot. Encounter use, discoverability, projection, and wider distribution remain separate decisions.</p>
    </div>

    {!loaded&&<p className="myenv-runtime-warning">{notice||"Resolving personal PAC custody…"}</p>}
    {loaded&&pacs.length===0&&<p className="myenv-relations-empty">No personally custodied PACs are currently resolved.</p>}

    {profilePac&&<section className="myenv-profile-pac-nested">
      <div className="myenv-thread-heading">
        <p className="myenv-kicker">MY PACS · PROFILEPAC</p>
        <h3>{profilePac.title}</h3>
        <p>ProfilePAC is part of your personal PAC custody. It remains subject-owned and owner-editable; it does not create standing, authority, membership, or initiative relations.</p>
      </div>
      {presentation&&<form className="myenv-thread-compose" onSubmit={onSavePresentation}>
        <label>Environment presentation</label>
        <input
          aria-label="Opening visual asset key"
          maxLength={240}
          value={presentationAsset}
          onChange={event=>onPresentationAssetChange(event.target.value)}
          disabled={!presentation.owner_changeable}
          placeholder="FREE media asset key"
        />
        <p>Current visual: {presentation.opening_visual_asset_key}</p>
        <button type="submit" disabled={!presentation.owner_changeable||!presentationAsset.trim()}>SAVE PRESENTATION</button>
      </form>}
      <ProfilePacPanel
        initialProfile={initialProfile||null}
        contract={profileContract}
        loaded={profileLoaded}
        held={profileHeld}
        onSaved={onProfileSaved}
      />
      {reviewControls(profilePac)}
      <div className="myenv-pac-status">
        <span>Encounter · {profilePac.encounter_projection.standing.toLowerCase()}</span>
        {profilePac.encounter_projection.authorized_by_owner&&<span>Surface · {profilePac.encounter_projection.presentation_scope==="c3field_plus_canopy"?"c3 Field + Canopy":"c3 Field"}</span>}
      </div>
      {profilePac.approval.current&&!profilePac.encounter_projection.authorized_by_owner&&<div className="myenv-chazz-compose-actions">
        <button type="button" disabled={busy===profilePac.pac_key} onClick={()=>void encounterProjection(profilePac.pac_key,"AUTHORIZE","c3field_only")}>USE ON C3 FIELD</button>
        <button type="button" disabled={busy===profilePac.pac_key} onClick={()=>void encounterProjection(profilePac.pac_key,"AUTHORIZE","c3field_plus_canopy")}>C3 FIELD + CANOPY</button>
      </div>}
      {profilePac.encounter_projection.authorized_by_owner&&<button
        type="button"
        disabled={busy===profilePac.pac_key}
        onClick={()=>void encounterProjection(profilePac.pac_key,"REVOKE",profilePac.encounter_projection.presentation_scope==="c3field_plus_canopy"?"c3field_plus_canopy":"c3field_only")}
      >
        REMOVE FROM ENCOUNTER
      </button>}
    </section>}

    {otherPacs.length>0&&<div className="myenv-thread-entries">
      {otherPacs.map(pac=><article key={pac.pac_key}>
        <div>
          <span>{pac.pac_type} · {pac.approval.standing}</span>
          {pac.approval.resolved_at&&<time>{new Date(pac.approval.resolved_at).toLocaleString()}</time>}
        </div>
        <h3>{pac.title}</h3>
        {pac.subtitle&&<p>{pac.subtitle}</p>}
        <p><strong>Custody:</strong> personal · {pac.custody_provider||"c3 Field"}</p>
        {reviewControls(pac)}
        <p><strong>Encounter:</strong> {pac.encounter_projection.standing.toLowerCase()}</p>
        {pac.encounter_projection.authorized_by_owner&&<p><strong>Surface:</strong> {pac.encounter_projection.presentation_scope==="c3field_plus_canopy"?"c3 Field + Canopy":"c3 Field only"}</p>}
        {pac.approval.current&&!pac.encounter_projection.authorized_by_owner&&<div className="myenv-chazz-compose-actions">
          <button type="button" disabled={busy===pac.pac_key} onClick={()=>void encounterProjection(pac.pac_key,"AUTHORIZE","c3field_only")}>USE ON C3 FIELD</button>
          <button type="button" disabled={busy===pac.pac_key} onClick={()=>void encounterProjection(pac.pac_key,"AUTHORIZE","c3field_plus_canopy")}>C3 FIELD + CANOPY</button>
        </div>}
        {pac.encounter_projection.authorized_by_owner&&<button
          type="button"
          disabled={busy===pac.pac_key}
          onClick={()=>void encounterProjection(pac.pac_key,"REVOKE",pac.encounter_projection.presentation_scope==="c3field_plus_canopy"?"c3field_plus_canopy":"c3field_only")}
        >
          REMOVE FROM ENCOUNTER
        </button>}
      </article>)}
    </div>}

    {notice&&loaded&&<p className="myenv-initiative-notice" role="status">{notice}</p>}
  </section>
}
