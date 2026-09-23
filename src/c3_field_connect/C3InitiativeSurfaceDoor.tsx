import {useEffect,useState} from "react"
import C3CommunityConnect,{HeldUnknownC3FieldRoute} from "./C3CommunityConnect"
import {isInitiativeSurfacePathAllowed,loadInitiativeSurfaceHost,type InitiativeSurfaceRuntime} from "./initiativeSurfaceHost"

export default function C3InitiativeSurfaceDoor(){
  const pathname=window.location.pathname
  const [surface,setSurface]=useState<InitiativeSurfaceRuntime|null>(null)
  const [held,setHeld]=useState(false)

  useEffect(()=>{
    let active=true
    if(!isInitiativeSurfacePathAllowed(pathname)){
      setHeld(true)
      return()=>{active=false}
    }
    loadInitiativeSurfaceHost()
      .then(value=>{if(active)setSurface(value)})
      .catch(()=>{if(active)setHeld(true)})
    return()=>{active=false}
  },[pathname])

  if(!isInitiativeSurfacePathAllowed(pathname)||held) return <HeldUnknownC3FieldRoute pathname={pathname} />
  if(!surface) return <main className="c3-connect-shell c3-connect-held"><p className="c3-connect-width" role="status">Resolving initiative surface…</p></main>
  return <C3CommunityConnect />
}
