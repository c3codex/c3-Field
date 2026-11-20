import {useEffect,useState} from "react"
import {GROUND_REGIONS, GROUND_MEDIA, matchesGround, groundDestination, type GroundPresentation, type GroundPrimitive} from "./current-state-ground"
import "./current-state-ground.css"

type Props={presentation:GroundPresentation; admitted:readonly GroundPrimitive[]; onOpen:(destination:string)=>void; onUnavailable:()=>void}
export default function CurrentStateGround({presentation,admitted,onOpen,onUnavailable}:Props){
  const [loaded,setLoaded]=useState(false)
  const resolved=matchesGround(presentation)
  useEffect(()=>{if(!resolved)onUnavailable()},[resolved,onUnavailable])
  if(!resolved)return null
  return <section className="current-state-ground" aria-label="Current State — My Environment">
    <div className="current-state-ground-scene">
      <img src={GROUND_MEDIA} width={1672} height={941} alt="Current State. Change What Is Possible. Your Environment in a Field of Possibility. Connect, Contribute, Create." onLoad={()=>setLoaded(true)} onError={onUnavailable}/>
      {loaded&&<div className="current-state-ground-regions">
        {GROUND_REGIONS.map(region=>{
          const destination=groundDestination(region,admitted)
          return <button type="button" key={region.id} className="current-state-ground-region"
            style={{left:region.x+"%",top:region.y+"%",width:region.w+"%",height:region.h+"%"}}
            aria-label={region.label+(destination?"":" — held")}
            aria-disabled={!destination}
            onClick={()=>{if(destination)onOpen(destination)}}>
            <span>{region.label}{!destination&&" · Held"}</span>
          </button>
        })}
      </div>}
    </div>
  </section>
}
