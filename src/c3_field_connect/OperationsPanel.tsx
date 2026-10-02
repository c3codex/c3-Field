import {useEffect,useState} from "react"

type Operation={
  oar_key:string
  oar_type:string
  queue_status:string
  scope_key:string
  requested_action:string
  preflight_status:string
  operator_confirmed_at?:string|null
  execution_started_at?:string|null
  execution_completed_at?:string|null
  return_standing?:string|null
  execution_summary?:string|null
  executor_ref?:string|null
  model_resolution_standing?:string|null
  created_at?:string|null
  updated_at?:string|null
}
type Payload={ok?:boolean;standing?:string;reason?:string;optics_only?:boolean;operations?:Operation[]}

export default function OperationsPanel(){
  const [state,setState]=useState<"loading"|"ready"|"held">("loading")
  const [operations,setOperations]=useState<Operation[]>([])
  const [notice,setNotice]=useState("")
  useEffect(()=>{
    let active=true
    fetch("/api/my-environment-operations",{headers:{accept:"application/json"}})
      .then(async response=>{
        const body=await response.json().catch(()=>null) as Payload|null
        if(!response.ok||!body?.ok)throw new Error(body?.reason||body?.standing||"Operations could not be resolved.")
        if(active){setOperations(body.operations||[]);setState("ready")}
      })
      .catch(error=>{if(active){setNotice(error instanceof Error?error.message:"Operations could not be resolved.");setState("held")}})
    return()=>{active=false}
  },[])

  return <section className="myenv-connections-thread">
    <div className="myenv-thread-heading">
      <p className="myenv-kicker">C3OPS · OPERATOR OPTICS</p>
      <h2>Operations</h2>
      <p>OAR execution state resolves from Registry. This surface is read-only optics and creates no authority.</p>
    </div>
    {state==="loading"&&<p className="myenv-relations-empty">Resolving OAR state from Registry…</p>}
    {state==="held"&&<p className="myenv-runtime-warning">{notice}</p>}
    {state==="ready"&&operations.length===0&&<p className="myenv-relations-empty">No operator OARs are currently registered.</p>}
    <div className="myenv-thread-entries">
      {operations.map(operation=><article key={operation.scope_key}>
        <div>
          <span>{operation.oar_type.toUpperCase()} · {operation.queue_status.replace(/_/g," ")}</span>
          {operation.created_at&&<time>{new Date(operation.created_at).toLocaleString()}</time>}
        </div>
        <h3>{operation.oar_key}</h3>
        <p>{operation.requested_action}</p>
        <p><strong>Executor:</strong> {operation.executor_ref||"unresolved"} · <strong>Preflight:</strong> {operation.preflight_status}</p>
        <p><strong>Return:</strong> {operation.return_standing?.replace(/_/g," ")||"awaiting OAR1"} · <strong>Model evidence:</strong> {operation.model_resolution_standing?.replace(/_/g," ")||"unresolved"}</p>
        {operation.execution_summary&&<p>{operation.execution_summary}</p>}
        <small>{operation.scope_key}</small>
      </article>)}
    </div>
  </section>
}
