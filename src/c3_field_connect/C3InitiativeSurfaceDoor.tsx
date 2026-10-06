import {useEffect,useState} from "react"
import C3CommunityConnect,{HeldUnknownC3FieldRoute} from "./C3CommunityConnect"
import RegisteredPacSurface from "./RegisteredPacSurface"
import {isInitiativeSurfacePathAllowed,loadInitiativeSurfaceHost,type InitiativeSurfaceRuntime} from "./initiativeSurfaceHost"

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

    const registeredPacRequest=pathname==="/"
      ? fetch("/api/public-surface",{headers:{accept:"application/json"},cache:"no-store"})
      : Promise.resolve(new Response(JSON.stringify({status:"unavailable"}),{
          status:409,
          headers:{"content-type":"application/json"}
        }))

    void registeredPacRequest
      .then(async response=>await response.json().catch(()=>null))
      .then(body=>{
        if(!active)return
        if(body?.status==="available"){
          setRegisteredPac(true)
          return
        }
        if(!isInitiativeSurfacePathAllowed(pathname)){
          setHeld(true)
          return
        }
        loadInitiativeSurfaceHost()
          .then(value=>{if(active)setSurface(value)})
          .catch(()=>{if(active)setHeld(true)})
      })
      .catch(()=>{
        if(!active)return
        if(!isInitiativeSurfacePathAllowed(pathname)){setHeld(true);return}
        loadInitiativeSurfaceHost()
          .then(value=>{if(active)setSurface(value)})
          .catch(()=>{if(active)setHeld(true)})
      })

    return()=>{active=false}
  },[pathname])

  if(registeredPac) return <RegisteredPacSurface/>
  if((pathname!=="/"&&!isInitiativeSurfacePathAllowed(pathname))||held) return <HeldUnknownC3FieldRoute pathname={pathname} />
  if(!surface) return <main className="c3-connect-shell c3-connect-held"><p className="c3-connect-width" role="status">Loading…</p></main>
  return <C3CommunityConnect initiativeSurface={surface} />
}
