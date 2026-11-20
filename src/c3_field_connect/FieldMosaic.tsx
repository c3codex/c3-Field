import "./fieldMosaic.css"

const positions = [
  {key:"connect", label:"Connect", route:"/connect"},
  {key:"contribute", label:"Contribute", route:"/contribute"},
  {key:"create", label:"Create", route:"/create"},
] as const

type Zone = {key:string; left:number; top:number; width:number; height:number; target?:string|null}
export type FieldMosaicPresentation = {asset_key:string; width:number; height:number; zones:Zone[]}

export function resolveFieldMosaic(value:FieldMosaicPresentation|undefined){
  if (!value || typeof value.asset_key !== "string" || !/^[a-z0-9_]+$/.test(value.asset_key) ||
      !Number.isSafeInteger(value.width) || !Number.isSafeInteger(value.height) ||
      value.width <= 0 || value.height <= 0 || !Array.isArray(value.zones) ||
      value.zones.length !== positions.length) return null

  const zones = positions.map(position => {
    const zone = value.zones.find(candidate => candidate?.key === position.key)
    if (!zone || ![zone.left, zone.top, zone.width, zone.height].every(Number.isFinite) ||
        zone.left < 0 || zone.top < 0 || zone.width <= 0 || zone.height <= 0 ||
        zone.left + zone.width > 1 || zone.top + zone.height > 1) return null

    return {...position, target:zone.target === position.route ? position.route : null, bounds:zone}
  })
  if (zones.some(zone => zone === null)) return null

  return {src:"/api/free-media?asset="+encodeURIComponent(value.asset_key), width:value.width, height:value.height, zones:zones.filter(zone => zone !== null)}
}

export default function FieldMosaic({presentation}:{presentation:FieldMosaicPresentation|undefined}){
  const mosaic = resolveFieldMosaic(presentation)
  if (!mosaic) return null

  return <nav aria-label="c3 Field encounters" className="c3-field-mosaic">
    <img src={mosaic.src} width={mosaic.width} height={mosaic.height} alt="" />
    {mosaic.zones.map(({key, label, target, bounds}) => {
      const style = {
        left:`${bounds.left * 100}%`,
        top:`${bounds.top * 100}%`,
        width:`${bounds.width * 100}%`,
        height:`${bounds.height * 100}%`,
      }
      return target
        ? <a key={key} href={target} style={style}><span>{label}</span></a>
        : <div key={key} className="c3-field-mosaic-held" style={style}><span>{label} <small>Unavailable</small></span></div>
    })}
  </nav>
}
