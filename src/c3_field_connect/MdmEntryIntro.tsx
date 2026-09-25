import {useEffect, useRef, useState} from "react"
import type {ReactNode} from "react"

/** Missing, failed, stalled, or rejected playback must never gate the landing. */
export default function MdmEntryIntro({src, children}:{src?:string;children:ReactNode}){
  const [done,setDone]=useState(!src)
  const video=useRef<HTMLVideoElement>(null)
  useEffect(()=>{
    if(done||!src)return
    let active=true
    const finish=()=>{if(active)setDone(true)}
    const timeout=window.setTimeout(finish,60000)
    video.current?.play()?.catch(finish)
    return()=>{active=false;window.clearTimeout(timeout)}
  },[done,src])
  if(done||!src)return <>{children}</>
  return <main className="c3-intro-env" data-c3-presentation-state="mdm_entry_intro">
    <video ref={video} src={src} autoPlay muted playsInline preload="auto"
      aria-label="Million Dollar Mission introduction" onEnded={()=>setDone(true)} onError={()=>setDone(true)} />
    <button type="button" onClick={()=>setDone(true)}>Continue</button>
  </main>
}
