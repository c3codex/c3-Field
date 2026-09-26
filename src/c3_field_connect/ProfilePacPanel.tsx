import {FormEvent,useEffect,useMemo,useState} from "react"

export type ProfileQuestion={
  key:string
  label:string
  input:"text"|"select"|"textarea"|"multiselect"
  required?:boolean
  max_length?:number
  placeholder?:string
  default?:string
  options?:Array<{value:string;label:string}>
}
export type ProfileContract={pac_type:string;contract_version:string;questions:ProfileQuestion[];authority_effect:string}
export type ProfileShape={
  display_label:string
  visibility_scope:string
  about?:string|null
  interests?:string|null
  open_to?:string[]
  location_region?:string|null
}

type Props={
  initialProfile?:ProfileShape|null
  contract?:ProfileContract|null
  loaded:boolean
  held:boolean
  onSaved?:(profile:ProfileShape)=>void
}

function keyOf(question:ProfileQuestion){return question.key.replace(/^profile\./,"")}
function defaultValue(question:ProfileQuestion,profile?:ProfileShape|null):string|string[]{
  const key=keyOf(question) as keyof ProfileShape
  const current=profile?.[key]
  if(question.input==="multiselect") return Array.isArray(current)?current:[]
  if(typeof current==="string") return current
  return question.default||""
}

export default function ProfilePacPanel({initialProfile,contract,loaded,held,onSaved}:Props){
  const questions=contract?.questions||[]
  const [values,setValues]=useState<Record<string,string|string[]>>({})
  const [notice,setNotice]=useState("")
  const [busy,setBusy]=useState(false)

  useEffect(()=>{
    const next:Record<string,string|string[]>={}
    for(const question of questions) next[keyOf(question)]=defaultValue(question,initialProfile)
    setValues(next)
  },[contract,initialProfile])

  const ready=loaded&&!held&&questions.length>0
  const preview=useMemo(()=>({
    display_label:String(values.display_label||initialProfile?.display_label||""),
    visibility_scope:String(values.visibility_scope||initialProfile?.visibility_scope||"private"),
    about:String(values.about||initialProfile?.about||""),
    interests:String(values.interests||initialProfile?.interests||""),
    open_to:Array.isArray(values.open_to)?values.open_to:(initialProfile?.open_to||[]),
    location_region:String(values.location_region||initialProfile?.location_region||"")
  }),[values,initialProfile])

  async function save(event:FormEvent){
    event.preventDefault()
    if(!ready||busy)return
    setBusy(true);setNotice("")
    try{
      const response=await fetch("/api/my-environment-profile",{
        method:"POST",headers:{"content-type":"application/json"},
        body:JSON.stringify({fields:preview})
      })
      const body=await response.json().catch(()=>null) as {ok?:boolean;standing?:string;reason?:string}|null
      if(!response.ok||!body?.ok)throw new Error(body?.reason||body?.standing||"Profile-PAC could not be saved.")
      setNotice("Profile-PAC saved in your EnvPAC.")
      onSaved?.(preview)
    }catch(error){
      setNotice(error instanceof Error?error.message:"Profile-PAC could not be saved.")
    }finally{setBusy(false)}
  }

  if(!loaded)return <p className="myenv-runtime-warning">Profile-PAC state could not be resolved from this EnvPAC.</p>
  if(held)return <p className="myenv-runtime-warning">Profile-PAC is held inside this EnvPAC.</p>
  if(!contract||questions.length===0)return <p className="myenv-runtime-warning">Profile-PAC intake contract is unavailable.</p>

  return <>
    {initialProfile&&<article className="myenv-initiative-card"><div>
      <span>{initialProfile.visibility_scope}</span>
      <h3>{initialProfile.display_label}</h3>
      {initialProfile.about&&<p>{initialProfile.about}</p>}
      {initialProfile.open_to&&initialProfile.open_to.length>0&&<p>Open to: {initialProfile.open_to.join(" · ")}</p>}
      {initialProfile.location_region&&<p>{initialProfile.location_region}</p>}
    </div></article>}
    <form className="myenv-thread-compose" onSubmit={save}>
      {questions.map(question=>{
        const key=keyOf(question)
        const value=values[key]??(question.input==="multiselect"?[]:"")
        if(question.input==="select")return <label key={question.key}>{question.label}
          <select aria-label={question.label} required={question.required} value={String(value)} onChange={e=>setValues(current=>({...current,[key]:e.target.value}))}>
            {(question.options||[]).map(option=><option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        if(question.input==="textarea")return <label key={question.key}>{question.label}
          <textarea aria-label={question.label} rows={4} required={question.required} maxLength={question.max_length} placeholder={question.placeholder} value={String(value)} onChange={e=>setValues(current=>({...current,[key]:e.target.value}))}/>
        </label>
        if(question.input==="multiselect"){
          const selected=Array.isArray(value)?value:[]
          return <fieldset key={question.key}><legend>{question.label}</legend>
            <div className="myenv-profile-options">
              {(question.options||[]).map(option=><label key={option.value}>
                <input type="checkbox" checked={selected.includes(option.value)} onChange={e=>setValues(current=>({...current,[key]:e.target.checked?[...selected,option.value]:selected.filter(item=>item!==option.value)}))}/>
                <span>{option.label}</span>
              </label>)}
            </div>
          </fieldset>
        }
        return <label key={question.key}>{question.label}
          <input aria-label={question.label} type="text" required={question.required} maxLength={question.max_length} placeholder={question.placeholder} value={String(value)} onChange={e=>setValues(current=>({...current,[key]:e.target.value}))}/>
        </label>
      })}
      <button type="submit" disabled={busy||!String(values.display_label||"").trim()}>{busy?"SAVING…":initialProfile?"SAVE PROFILE-PAC":"COMPLETE PROFILE-PAC"}</button>
    </form>
    {notice&&<p className="myenv-initiative-notice" role="status">{notice}</p>}
  </>
}
