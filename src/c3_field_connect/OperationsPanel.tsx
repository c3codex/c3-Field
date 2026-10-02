import {useEffect,useState} from "react"

type Operation={
  oar_key:string
  queue_standing:string
  execution_instance:string
  requested_action:string
  preflight_standing:string
  return_standing?:string|null
  model_resolution_standing?:string|null
  validation_standing?:string|null
  execution_summary?:string|null
  deploy_standing?:string|null
  executor_ref?:string|null
  created_at?:string|null
  updated_at?:string|null
}
type Payload={ok?:boolean;interface?:string;standing?:string;reason?:string;optics_only?:boolean;operations?:Operation[]}

export default function OperationsPanel(){
  const [state,setState]=useState<"loading"|"ready"|"held">("loading")
  const [operations,setOperations]=useState<Operation[]>([])
  const [notice,setNotice]=useState("")
  useEffect(()=>{
    let active=true
    fetch("/api/my-environment-operations",{headers:{accept:"application/json"}})
      .then(async response=>{
        const body=await response.json().catch(()=>null) as Payload|null
        if(!response.ok||!body?.ok||body.interface!=="c3ops_oar_lifecycle_optics_resolution_v1"||!Array.isArray(body.operations))throw new Error(body?.reason||"Operations could not be resolved.")
        if(active){setOperations(body.operations||[]);setState("ready")}
      })
      .catch(error=>{if(active){setNotice(error instanceof Error?error.message:"Operations could not be resolved.");setState("held")}})
    return()=>{active=false}
  },[])

  return <section className="myenv-connections-thread">
    <div className="myenv-thread-heading">
      <p className="myenv-kicker">C3OPS · OPERATOR OPTICS</p>
      <h2>Operations</h2>
      <p>Execution and return state from c3ops.</p>
    </div>
    {state==="loading"&&<p className="myenv-relations-empty">Resolving OAR state from Registry…</p>}
    {state==="held"&&<p className="myenv-runtime-warning">{notice}</p>}
    {state==="ready"&&operations.length===0&&<p className="myenv-relations-empty">No operator OARs are currently registered.</p>}
    <div className="myenv-thread-entries">
      {operations.map(operation=><article key={operation.execution_instance}>
        <div>
          <span>{operation.queue_standing.replace(/_/g," ")}</span>
          {operation.created_at&&<time>{new Date(operation.created_at).toLocaleString()}</time>}
        </div>
        <h3>{operation.oar_key}</h3>
        <p>{operation.requested_action}</p>
        <p><strong>Executor:</strong> {operation.executor_ref||"unresolved"} · <strong>Preflight:</strong> {operation.preflight_standing}</p>
        <p><strong>Return:</strong> {operation.return_standing||"unresolved"} · <strong>Model:</strong> {operation.model_resolution_standing||"unresolved"}</p>
        <p><strong>Validation:</strong> {operation.validation_standing||"unresolved"} · <strong>Deploy:</strong> {operation.deploy_standing||"unresolved"}</p>
        {operation.execution_summary&&<p>{operation.execution_summary}</p>}
        <small>{operation.execution_instance}</small>
      </article>)}
    </div>
  </section>
}
