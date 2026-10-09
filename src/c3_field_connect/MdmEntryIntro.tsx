import {useEffect, useRef, useState} from "react"
import type {ReactNode} from "react"
import {startAuthoredIntro, type AuthoredIntroState} from "../shared/media/authoredIntroPlayback"
import "./publicIntroStage.css"

/** Policy refusal keeps the film visible; only genuine errors/stalls fail forward. */
export default function MdmEntryIntro({src, children}:{src?:string;children:ReactNode}){
  const [outcome,setOutcome]=useState<"completed"|"manual"|"media_error"|"stall"|null>(null)
  const [playback,setPlayback]=useState<AuthoredIntroState>("loading")
  const [sound,setSound]=useState(true)
  const video=useRef<HTMLVideoElement>(null)
  const stage=useRef<HTMLElement>(null)
  const controller=useRef<ReturnType<typeof startAuthoredIntro>|null>(null)
  useEffect(()=>{
    if(outcome||!src||!video.current)return
    setSound(true)
    const current=startAuthoredIntro(video.current,{
      state:setPlayback,
      complete:()=>setOutcome("completed"),
      failure:reason=>setOutcome(reason),
    },window)
    controller.current=current
    return()=>{current.dispose();if(controller.current===current)controller.current=null}
  },[outcome,src])
  if(outcome)return <div data-mdm-intro-outcome={outcome}>
    {outcome==="media_error"||outcome==="stall"?<p role="status">The introduction could not finish. Continuing to the Mission.</p>:null}
    {children}
  </div>
  function toggleSound(){
    if(!video.current)return
    const enabled=!sound;video.current.muted=!enabled;setSound(enabled)
  }
  return <main ref={stage} className="c3-public-intro-stage" data-c3-presentation-state="mdm_entry_intro" data-intro-playback={playback}>
    {src?<video ref={video} src={src} muted={!sound} playsInline preload="auto" aria-label="Million Dollar Mission introduction" />:<p role="status">The introduction media is unavailable.</p>}
    <div className="c3-public-intro-controls">
      {playback==="blocked"?<button type="button" onClick={()=>{setSound(true);controller.current?.playWithSound()}}>Play with sound</button>:null}
      {src&&playback==="playing"?<button type="button" aria-pressed={sound} onClick={toggleSound}>{sound?"SOUND OFF":"SOUND ON"}</button>:null}
      {src?<button type="button" onClick={()=>{void stage.current?.requestFullscreen?.().catch(()=>{})}}>Expand video</button>:null}
      <button type="button" onClick={()=>setOutcome("manual")}>Continue</button>
    </div>
  </main>
}
