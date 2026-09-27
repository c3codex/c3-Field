import {useEffect,useMemo,useState} from "react"

export type GroundSource={
  assertion_key?:string
  type?:string
  status?:string
  statement?:string
  source_name?:string
  source_url?:string
  source_date?:string
}

export type PropertyPoint={
  property_key:string
  name:string
  council_name:string
  location_label:string
  address:string
  city?:string
  county?:string
  state?:string
  sector_key?:string
  sector_label?:string
  latitude?:number
  longitude?:number
  coordinate_precision?:string
  geocode_standing?:string
  geocode_source_name?:string
  geocode_source_url?:string
  geocode_observed_date?:string
  summary?:string
  qualification?:string
  registry_standing?:string
  transaction_class?:string
  transaction_state?:string
  current_use_state?:string
  current_as_of?:string
  acreage?:number|null
  settlement_cash?:number|null
  settlement_property?:number|null
  sources?:GroundSource[]
}

export type GroundSector={
  sector_key:string
  sector_label:string
  state:string
  property_count:number
  verified_coordinate_count?:number
  qualified_coordinate_count?:number
}

type Props={
  points:PropertyPoint[]
  sectors:GroundSector[]
  selectedKey:string|null
  onSelect:(propertyKey:string)=>void
}

const LON_MIN=-125
const LON_MAX=-66
const LAT_MIN=24
const LAT_MAX=50
const LON_GRID=[-120,-110,-100,-90,-80,-70]
const LAT_GRID=[25,30,35,40,45,50]

function finite(value:unknown):value is number{
  return typeof value==="number"&&Number.isFinite(value)
}
function position(point:PropertyPoint){
  if(!finite(point.longitude)||!finite(point.latitude))return null
  const x=((point.longitude-LON_MIN)/(LON_MAX-LON_MIN))*100
  const y=((LAT_MAX-point.latitude)/(LAT_MAX-LAT_MIN))*100
  return {x:Math.max(1.5,Math.min(98.5,x)),y:Math.max(2,Math.min(98,y))}
}
function readable(value?:string){
  return value?value.replace(/_/g," "):"not recorded"
}

export default function C247GroundSectorMap({points,sectors,selectedKey,onSelect}:Props){
  const sectorRows=useMemo(
    ()=>[...sectors].sort((a,b)=>b.property_count-a.property_count||a.sector_label.localeCompare(b.sector_label)),
    [sectors]
  )
  const selectedPoint=useMemo(()=>points.find(point=>point.property_key===selectedKey)||null,[points,selectedKey])
  const [sector,setSector]=useState<string>("ALL")

  useEffect(()=>{
    if(selectedPoint?.sector_key)setSector(selectedPoint.sector_key)
    else if(sectorRows.some(item=>item.sector_key==="US-TN"))setSector("US-TN")
    else if(sectorRows[0])setSector(sectorRows[0].sector_key)
  },[selectedPoint?.sector_key,sectorRows])

  const visible=sector==="ALL"?points:points.filter(point=>(point.sector_key||`US-${point.state||"—"}`)===sector)
  const sectorLabel=sector==="ALL"?"All registered ground":sectorRows.find(item=>item.sector_key===sector)?.sector_label||"Registered ground"
  function chooseSector(key:string){
    setSector(key)
    if(key==="ALL")return
    const first=points.find(point=>(point.sector_key||`US-${point.state||"—"}`)===key)
    if(first)onSelect(first.property_key)
  }

  return <section className="pct47-ground-map" aria-labelledby="pct47-ground-map-title">
    <header className="pct47-ground-map-heading">
      <div>
        <p className="pct47-c2-eyebrow">EVIDENCE_PAC · GROUND SECTORS</p>
        <h2 id="pct47-ground-map-title">{sectorLabel}</h2>
      </div>
      <span>{visible.length} registered {visible.length===1?"property":"properties"}</span>
    </header>

    <div className="pct47-ground-sector-nav" aria-label="Ground sectors">
      <button type="button" className={sector==="ALL"?"selected":""} onClick={()=>chooseSector("ALL")}>
        ALL <small>{points.length}</small>
      </button>
      {sectorRows.map(item=><button type="button" key={item.sector_key} className={sector===item.sector_key?"selected":""} onClick={()=>chooseSector(item.sector_key)}>
        {item.sector_label.toUpperCase()} <small>{item.property_count}</small>
      </button>)}
    </div>

    <div className="pct47-ground-coordinate-field" aria-label={`Coordinate map of ${sectorLabel}. Pins represent Registry-qualified Scouting properties only.`}>
      <svg viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">
        <rect x="0" y="0" width="1000" height="500" className="pct47-ground-frame"/>
        {LON_GRID.map(lon=>{
          const x=((lon-LON_MIN)/(LON_MAX-LON_MIN))*100
          return <g key={lon}><line x1={x*10} x2={x*10} y1="0" y2="500" className="pct47-ground-gridline"/><text x={x*10+7} y="486" className="pct47-ground-gridlabel">{Math.abs(lon)}°W</text></g>
        })}
        {LAT_GRID.map(lat=>{
          const y=((LAT_MAX-lat)/(LAT_MAX-LAT_MIN))*100
          return <g key={lat}><line x1="0" x2="1000" y1={y*5} y2={y*5} className="pct47-ground-gridline"/><text x="12" y={Math.max(18,y*5-7)} className="pct47-ground-gridlabel">{lat}°N</text></g>
        })}
      </svg>
      {points.map(point=>{
        const pos=position(point)
        if(!pos)return null
        const pointSector=point.sector_key||`US-${point.state||"—"}`
        const dimmed=sector!=="ALL"&&pointSector!==sector
        const selected=point.property_key===selectedKey
        return <button
          type="button"
          key={point.property_key}
          className={"pct47-ground-pin"+(selected?" selected":"")+(dimmed?" dimmed":"")}
          style={{left:`${pos.x}%`,top:`${pos.y}%`}}
          onClick={()=>{setSector(pointSector);onSelect(point.property_key)}}
          aria-label={`Open ${point.name}, ${point.location_label}`}
          title={point.name}
        ><span/><b>{selected?point.name:""}</b></button>
      })}
      <div className="pct47-ground-map-caption">Longitude/latitude projection · property point, not parcel boundary</div>
    </div>

    <div className="pct47-ground-card-grid">
      {visible.map(point=><button
        type="button"
        key={point.property_key}
        className={"pct47-ground-card"+(point.property_key===selectedKey?" selected":"")}
        onClick={()=>onSelect(point.property_key)}
      >
        <div><span>{point.state||"GROUND"}</span><small>{readable(point.registry_standing)}</small></div>
        <h3>{point.name}</h3>
        <p>{point.location_label}</p>
        <dl>
          <div><dt>Disposition</dt><dd>{readable(point.transaction_state)}</dd></div>
          <div><dt>Current use</dt><dd>{readable(point.current_use_state)}</dd></div>
          <div><dt>Evidence</dt><dd>{point.sources?.length||0} sourced {point.sources?.length===1?"assertion":"assertions"}</dd></div>
        </dl>
      </button>)}
    </div>

    <p className="pct47-ground-map-rule">
      Pins resolve only from registered property + registered coordinate evidence. A pin identifies ground; it does not establish that abuse occurred there.
    </p>
  </section>
}
