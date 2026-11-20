import {useEffect,useRef,useState} from "react"
import "./fieldMosaic.css"

type Pavilion = {asset_key:string;width:number;height:number;bounds:[number,number,number,number]}

function resolvePavilion(value:unknown):Pavilion|null {
  if (!value || typeof value!=="object") return null
  const item=value as Pavilion
  if (typeof item.asset_key!=="string" || !/^[a-z0-9_]+$/.test(item.asset_key) ||
      !Number.isSafeInteger(item.width) || !Number.isSafeInteger(item.height) ||
      item.width<=0 || item.height<=0 || !Array.isArray(item.bounds) ||
      item.bounds.length!==4 || !item.bounds.every(Number.isFinite)) return null
  const [x,y,width,height]=item.bounds
  return x>=0&&y>=0&&width>0&&height>0&&x+width<=1&&y+height<=1 ? item : null
}

export default function ConnectPavilion(){
  const [pavilion,setPavilion]=useState<Pavilion|null>(null)
  const dialog=useRef<HTMLDialogElement>(null)
  const control=useRef<HTMLButtonElement>(null)

  useEffect(()=>{
    if (!["c3field.online","www.c3field.online"].includes(window.location.hostname)) return
    const signal=new AbortController()
    fetch("/api/c3-field-receiver?path=%2Fconnect",{signal:signal.signal})
      .then(async response=>{
        if (!response.ok) return
        const body=await response.json()
        if (!signal.signal.aborted && body.standing==="ACT" && body.path==="/connect") {
          setPavilion(resolvePavilion(body.pavilion))
        }
      })
      .catch(()=>{})
    return ()=>signal.abort()
  },[])

  if (!pavilion) return null
  const [x,y,width,height]=pavilion.bounds
  return <section className="c3-connect-width" aria-label="Connect pavilion">
    <div className="c3-field-mosaic c3-connect-pavilion">
      <img src={"/api/free-media?asset="+pavilion.asset_key} width={pavilion.width} height={pavilion.height} alt="" />
      <button ref={control} type="button" style={{
        left:`${x*100}%`,top:`${y*100}%`,width:`${width*100}%`,height:`${height*100}%`,
      }} onClick={()=>dialog.current?.showModal()}><span>Browse profiles</span></button>
    </div>
    <dialog ref={dialog} className="c3-field-receiver-card" aria-labelledby="profile-preview-title" onClose={()=>control.current?.focus()}>
      <h2 id="profile-preview-title">Browse profiles</h2>
      <p>Profile browsing is currently unavailable.</p>
      <form method="dialog"><button>Close</button></form>
    </dialog>
  </section>
}
