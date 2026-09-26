import "./currentConstellation.css"

export type CurrentToken={
  current_token_key:string
  token_class:string
  source_relation_type:string
  source_relation_key:string
  source_pac_key?:string|null
  retention_standing:string
  relation_standing:string
  retained_at:string
  last_relation_at:string
  metadata?:Record<string,unknown>
}

type Props={tokens:CurrentToken[];mode?:"c1"|"c2"}

const POSITIONS=[
  [24,30],[72,25],[18,54],[80,52],[34,18],[60,16],[28,72],[70,70],
  [12,40],[88,38],[42,34],[58,38],[39,65],[61,62],[48,20],[52,78]
] as const

function hash(value:string){
  let h=2166136261
  for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619)}
  return h>>>0
}
function point(token:CurrentToken,index:number){
  const seed=hash(token.current_token_key)
  const base=POSITIONS[(seed+index)%POSITIONS.length]
  const dx=((seed>>>8)%7)-3
  const dy=((seed>>>16)%7)-3
  return {x:Math.max(8,Math.min(92,base[0]+dx)),y:Math.max(10,Math.min(82,base[1]+dy))}
}

export default function CurrentConstellation({tokens,mode="c1"}:Props){
  const retained=[...tokens].filter(token=>token.retention_standing==="retained").sort((a,b)=>a.retained_at.localeCompare(b.retained_at))
  const points=retained.map(point)
  const treeOpacity=Math.min(.48,Math.max(0,(retained.length-1)*.11))
  return <div className={"current-constellation current-constellation--"+mode} aria-hidden="true" data-current-count={retained.length}>
    {mode==="c2"&&<svg className="current-ground-map" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet">
      <path d="M10 21 L17 15 L29 12 L38 15 L49 10 L62 12 L69 17 L81 18 L89 25 L84 34 L74 36 L68 43 L55 42 L47 48 L34 45 L25 39 L15 36 L9 29 Z"/>
      <path d="M14 29 C30 24 43 27 54 20 C65 14 76 23 86 25"/>
      <path d="M22 38 C35 31 49 36 61 30 C72 26 78 32 82 34"/>
    </svg>}
    <svg className="current-constellation-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      {mode==="c1"&&retained.length>1&&<g className="current-tree" style={{opacity:treeOpacity}}>
        <path d="M50 96 C49 85 51 76 50 67"/>
        <path d="M50 78 C42 69 37 62 31 55"/>
        <path d="M50 75 C58 66 64 59 70 50"/>
      </g>}
      {points.map((p,index)=>{
        const inactive=retained[index].relation_standing!=="active"
        const origin=mode==="c1"?{x:50,y:88}:{x:50,y:54}
        return <g key={retained[index].current_token_key}>
          <path className={"current-branch"+(inactive?" current-branch--inactive":"")} d={`M${origin.x} ${origin.y} Q50 58 ${p.x} ${p.y}`}/>
          <circle className={"current-light-halo"+(inactive?" current-light--inactive":"")} cx={p.x} cy={p.y} r="2.8"/>
          <circle className={"current-light"+(inactive?" current-light--inactive":"")} cx={p.x} cy={p.y} r="0.72"/>
        </g>
      })}
    </svg>
  </div>
}
