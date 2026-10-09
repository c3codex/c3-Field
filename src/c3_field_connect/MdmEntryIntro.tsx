import {useEffect, useRef, useState} from "react"
import type {ReactNode} from "react"
import {startIntroPlayback} from "./introPlayback"
import "./publicIntroStage.css"

/** Missing, failed, stalled, or rejected playback must never gate the landing. */
export default function MdmEntryIntro({src, children}:{src?:string;children:ReactNode}){
  const [done,setDone]=useState(!src)
  const [sound,setSound]=useState(false)
  const video=useRef<HTMLVideoElement>(null)
  const stage=useRef<HTMLElement>(null)
  useEffect(()=>{
    if(done||!src)return
    if(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches){setDone(true);return}
    if(video.current)return startIntroPlayback(video.current,()=>setDone(true),window)
  },[done,src])
  if(done||!src)return <>{children}</>
  function toggleSound(){
    const player=video.current
    if(!player)return
    const enabled=!sound
    player.muted=!enabled
    setSound(enabled)
    if(enabled)void player.play().catch(()=>{player.muted=true;setSound(false)})
  }
  return <main ref={stage} className="c3-public-intro-stage" data-c3-presentation-state="mdm_entry_intro">
    <video ref={video} src={src} autoPlay muted={!sound} playsInline preload="auto"
      aria-label="Million Dollar Mission introduction" onEnded={()=>setDone(true)} onError={()=>setDone(true)} />
    <div className="c3-public-intro-controls">
      <button type="button" aria-label={sound?"Turn introduction sound off":"Turn introduction sound on"} aria-pressed={sound} onClick={toggleSound}>{sound?"SOUND OFF":"SOUND ON"}</button>
      <button type="button" onClick={()=>{void stage.current?.requestFullscreen?.().catch(()=>{})}}>Expand video</button>
      <button type="button" onClick={()=>setDone(true)}>Continue</button>
    </div>
  </main>
}
