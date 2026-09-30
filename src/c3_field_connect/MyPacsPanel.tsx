import {useEffect,useState} from "react"
import ProfilePacPanel,{type ProfileContract,type ProfileShape} from "./ProfilePacPanel"

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
  approval:{standing:string;resolved_at?:string|null;c2_projection_eligible:boolean}
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
  onSavePresentation:(event:React.FormEvent)=>void
}

export default function MyPacsPanel({
  initialProfile,profileContract,profileLoaded,profileHeld,onProfileSaved,
  presentation,presentationAsset,onPresentationAssetChange,onSavePresentation
}:Props){
  const [pacs,setPacs]=useState<PersonalPac[]>([])
  const [loaded,setLoaded]=useState(false)
  const [notice,setNotice]=useState("")
  const [busy,setBusy]=useState("")

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

  async function disposition(pacKey:string,next:"APPROVED"|"HLD"){
    if(busy)return
    setBusy(pacKey);setNotice("")
    try{
      const response=await fetch("/api/my-environment-pacs",{
        method:"POST",
        headers:{"content-type":"application/json","accept":"application/json"},
        body:JSON.stringify({pac_key:pacKey,disposition:next})
      })
      const body=await response.json().catch(()=>null) as {
        standing?:string;reason?:string;resolved_at?:string;c2_projection_eligible?:boolean
      }|null
      if(!response.ok||!body||!["ACT","HLD"].includes(String(body.standing||"")))
        throw new Error(body?.reason||body?.standing||"PAC disposition did not resolve.")
      setPacs(current=>current.map(pac=>pac.pac_key===pacKey?{
        ...pac,
        approval:{
          standing:next,
          resolved_at:body.resolved_at||new Date().toISOString(),
          c2_projection_eligible:body.c2_projection_eligible===true
        }
      }:pac))
      setNotice(next==="APPROVED"
        ?"PAC approved in your custody. It is now eligible for C2ME_env projection."
        :"PAC held in your custody. It is not eligible for C2ME_env projection.")
    }catch(error){
      setNotice(error instanceof Error?error.message:"PAC disposition did not resolve.")
    }finally{setBusy("")}
  }

  const profilePac=pacs.find(pac=>pac.pac_type==="ProfilePAC")
  const otherPacs=pacs.filter(pac=>pac.pac_type!=="ProfilePAC")

  return <section className="myenv-connections-thread">
    <div className="myenv-thread-heading">
      <p className="myenv-kicker">PERSONAL CUSTODY</p>
      <h2>My PACs</h2>
      <p>PACs in your personal custody are reviewed here. Approval makes a PAC eligible for C2ME_env projection; it does not transfer custody. Governed branch and initiative PACs are excluded.</p>
    </div>

    {!loaded&&<p className="myenv-runtime-warning">{notice||"Resolving personal PAC custody…"}</p>}
    {loaded&&pacs.length===0&&<p className="myenv-relations-empty">No personally custodied PACs are currently resolved.</p>}

    {profilePac&&<section className="myenv-profile-pac-nested">
      <div className="myenv-thread-heading">
        <p className="myenv-kicker">MY PACS · PROFILEPAC</p>
        <h3>{profilePac.title}</h3>
        <p>ProfilePAC is part of your personal PAC custody. It remains subject-owned and owner-editable; it does not create standing, authority, membership, or initiative relations.</p>
      </div>
      <div className="myenv-pac-status">
        <span>{profilePac.approval.standing}</span>
        <span>C2 projection · {profilePac.approval.c2_projection_eligible?"eligible":"held"}</span>
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
      <div className="myenv-chazz-compose-actions">
        <button type="button" disabled={busy===profilePac.pac_key} onClick={()=>void disposition(profilePac.pac_key,"APPROVED")}>
          {busy===profilePac.pac_key?"RESOLVING…":"APPROVE PROFILEPAC"}
        </button>
        <button type="button" disabled={busy===profilePac.pac_key} onClick={()=>void disposition(profilePac.pac_key,"HLD")}>HOLD</button>
      </div>
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
        <p><strong>C2 projection:</strong> {pac.approval.c2_projection_eligible?"eligible":"held until approval"}</p>
        <div className="myenv-chazz-compose-actions">
          <button type="button" disabled={busy===pac.pac_key} onClick={()=>void disposition(pac.pac_key,"APPROVED")}>
            {busy===pac.pac_key?"RESOLVING…":"APPROVE"}
          </button>
          <button type="button" disabled={busy===pac.pac_key} onClick={()=>void disposition(pac.pac_key,"HLD")}>HOLD</button>
        </div>
      </article>)}
    </div>}

    {notice&&loaded&&<p className="myenv-initiative-notice" role="status">{notice}</p>}
  </section>
}
