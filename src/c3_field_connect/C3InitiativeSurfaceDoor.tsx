import {useEffect,useState} from "react"
import C3CommunityConnect,{HeldUnknownC3FieldRoute} from "./C3CommunityConnect"
import RegisteredPacSurface from "./RegisteredPacSurface"
import {isInitiativeSurfacePathAllowed,type InitiativeSurfaceRuntime} from "./initiativeSurfaceHost"
import {resolveRegisteredInitiativeProjection} from "./registeredInitiativeProjection"

export default function C3InitiativeSurfaceDoor(){
  const pathname=window.location.pathname
  const [surface,setSurface]=useState<InitiativeSurfaceRuntime|null>(null)
  const [registeredPac,setRegisteredPac]=useState(false)
  const [held,setHeld]=useState(false)

  useEffect(()=>{
    let active=true
    if(pathname!=="/"&&!isInitiativeSurfacePathAllowed(pathname)){
      setHeld(true)
      return()=>{active=false}
    }

    const registeredPacRequest=fetch("/api/public-surface",{headers:{accept:"application/json"},cache:"no-store"})

    void registeredPacRequest
      .then(async response=>await response.json().catch(()=>null))
      .then(body=>{
        if(!active)return
        if(body?.status==="available"){
          const registeredInitiative=resolveRegisteredInitiativeProjection(body,window.location.hostname)
          if(registeredInitiative){
            setSurface(registeredInitiative)
            return
          }
          if(body.presentation?.projection_type==="registered_owner_custodied_pac_projection"&&pathname==="/")setRegisteredPac(true)
          else setHeld(true)
          return
        }
        setHeld(true)
      })
      .catch(()=>{
        if(!active)return
        setHeld(true)
      })

    return()=>{active=false}
  },[pathname])

  if(registeredPac) return <RegisteredPacSurface/>
  if((pathname!=="/"&&!isInitiativeSurfacePathAllowed(pathname))||held) return <HeldUnknownC3FieldRoute pathname={pathname} />
  if(!surface) return <main className="c3-connect-shell c3-connect-held"><p className="c3-connect-width" role="status">Loading…</p></main>
  return <C3CommunityConnect initiativeSurface={surface} />
}
