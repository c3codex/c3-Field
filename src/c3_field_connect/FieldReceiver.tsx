import {useEffect,useRef,useState} from "react"
import "./fieldMosaic.css"

type Path = "/contribute"|"/create"
const initiatives = ["Million Dollar Mission","4.7%","unDrifted","Run Aground","Plateau Commons"]

export default function FieldReceiver({path}:{path:Path}){
  const [standing,setStanding] = useState<"loading"|"ACT"|"held">("loading")
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLButtonElement>(null)
  const [preview,setPreview] = useState("")

  function openPreview(name:string,control:HTMLButtonElement){
    opener.current=control
    setPreview(name)
    dialog.current?.showModal()
  }

  useEffect(()=>{
    const controller = new AbortController()
    fetch("/api/c3-field-receiver?"+new URLSearchParams({path}),{signal:controller.signal})
      .then(async response=>{
        const body = await response.json()
        setStanding(response.ok && body.standing === "ACT" && body.path === path ? "ACT" : "held")
      })
      .catch(()=>{if (!controller.signal.aborted) setStanding("held")})
    return ()=>controller.abort()
  },[path])

  const create = path === "/create"
  return <main className="c3-field-receiver">
    <a href="/">c3 Field</a>
    <h1>{create ? "Create" : "Contribute"}</h1>
    {standing === "loading" && <p role="status">Resolving encounter…</p>}
    {standing === "held" && <p role="status">This encounter is currently unavailable.</p>}
    {standing === "ACT" && <>
      {create
        ? <button type="button" onClick={event=>openPreview("Priceless Gallery",event.currentTarget)}>Priceless Gallery</button>
        : <ul>{initiatives.map(name=><li key={name}>
            <button type="button" onClick={event=>openPreview(name,event.currentTarget)}>{name}</button>
          </li>)}</ul>}
      <dialog ref={dialog} className="c3-field-receiver-card" aria-labelledby="field-preview-title" onClose={()=>opener.current?.focus()}>
        <h2 id="field-preview-title">{preview}</h2>
        {create ? <>
          <p>Work in progress</p>
          <p>An emerging exhibition space where independent artists can share their work on their own terms.</p>
        </> : <p>The initiative destination is currently unavailable.</p>}
        <form method="dialog"><button>Close</button></form>
      </dialog>
    </>}
  </main>
}
