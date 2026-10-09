import {useEffect,useState} from "react"
import MeasuresRegistryOrchestrator from "../measures_registry/encounter_renderer/MeasuresRegistryOrchestrator"
import {resolveRegisteredUndriftedProjection,type RegisteredPublicationProjection} from "./registeredPublicationProjection"

type State =
  | {standing:"loading"}
  | {standing:"held"}
  | {standing:"resolved";projection:RegisteredPublicationProjection}

export default function RegisteredPublicationProjectionDoor(){
  const [state,setState]=useState<State>({standing:"loading"})
  const pathname=window.location.pathname.length>1?window.location.pathname.replace(/\/$/,""):window.location.pathname

  useEffect(()=>{
    let active=true
    if(pathname!=="/"){
      setState({standing:"held"})
      return()=>{active=false}
    }
    void fetch("/api/public-surface",{headers:{accept:"application/json"},cache:"no-store"})
      .then(async response=>response.ok?await response.json():null)
      .then(body=>{
        if(!active)return
        const projection=resolveRegisteredUndriftedProjection(body,window.location.hostname)
        setState(projection?{standing:"resolved",projection}:{standing:"held"})
      })
      .catch(()=>{if(active)setState({standing:"held"})})
    return()=>{active=false}
  },[pathname])

  if(state.standing==="loading")
    return <main className="c3-connect-shell c3-connect-held"><p className="c3-connect-width" role="status">Resolving registered publication projection…</p></main>

  if(state.standing==="held")
    return <main className="c3-connect-shell c3-connect-held"><p className="c3-connect-width">This c3 Field publication projection is not currently resolvable.</p></main>

  return <>
    <aside
      aria-label="c3 Field publication projection"
      style={{
        padding:"0.65rem 1rem",
        borderBottom:"1px solid currentColor",
        display:"flex",
        gap:"1rem",
        justifyContent:"space-between",
        alignItems:"center",
        flexWrap:"wrap",
        fontFamily:"system-ui, sans-serif",
        fontSize:"0.78rem",
        letterSpacing:"0.04em"
      }}
    >
      <span><strong>c3 Field projection</strong> · unDrifted</span>
      <span>
        Native publication:{" "}
        <a href="https://measuresregistry.com/undrifted/" rel="external">
          measuresregistry.com/undrifted
        </a>
      </span>
    </aside>
    <MeasuresRegistryOrchestrator routeOverride="/undrifted" projectionMode />
  </>
}
