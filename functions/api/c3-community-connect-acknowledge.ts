import {acknowledgeInitiative322,PCT47_322_CONTRACT,json,hold,type PassageEnv} from "../_lib/c1-passage"
import {unable} from "../_lib/c1-abuse"

function esc(value:string){
  return value.replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]||ch))
}

export const onRequestPost:PagesFunction<PassageEnv>=async({request,env})=>{
  const origin=request.headers.get("origin")
  if(origin!==new URL(request.url).origin||origin!==env?.C1_PUBLIC_ORIGIN)return hold("origin_mismatch")
  if(request.headers.get("content-type")?.split(";")[0].trim()!=="application/json")return unable(415)
  const reader=request.body?.getReader()
  if(!reader)return hold("322_input")
  let size=0
  const chunks:Uint8Array[]=[]
  try{
    while(true){
      const {done,value}=await reader.read()
      if(done)break
      size+=value.byteLength
      if(size>8192){await reader.cancel();return unable(413)}
      chunks.push(value)
    }
    const bytes=new Uint8Array(size)
    let offset=0
    for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength}
    const body=JSON.parse(new TextDecoder().decode(bytes))
    if(!body||typeof body!=="object"||Array.isArray(body))return hold("322_input")
    return acknowledgeInitiative322(body,env)
  }catch{return hold("322_input")}
}

export const onRequestGet:PagesFunction<PassageEnv>=async()=>{
  const nonce=crypto.randomUUID().replace(/-/g,"")
  const items=(title:string,values:readonly string[])=>`<section><h2>${esc(title)}</h2><ol>${values.map(value=>`<li>${esc(value)}</li>`).join("")}</ol></section>`
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="referrer" content="no-referrer"><title>4.7% | Acknowledge</title>
<style>
:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#101315;color:#f3efe7;font-family:Arial,sans-serif;line-height:1.55}main{max-width:760px;margin:auto;padding:42px 24px 64px}.kicker{letter-spacing:.16em;font-size:12px;color:#aeb7bd}h1,h2{font-family:Georgia,serif;font-weight:400}h1{font-size:clamp(42px,8vw,72px);margin:.2em 0}.flame{margin:30px 0;padding:20px;border:1px solid #52575b;border-radius:18px}.flame span{font-size:30px}.flame strong{display:block;font-family:Georgia,serif;font-size:24px}.flame p{margin:.35em 0 0;color:#c7c2b8}section{margin:34px 0}ol{padding-left:1.4rem}li{margin:.75rem 0}.ack{padding:22px;border-left:3px solid #85898c;background:#171b1e}.ack label{display:flex;gap:12px;align-items:flex-start}.ack input{margin-top:.35rem}.action{margin-top:20px;padding:14px 20px;border:0;background:#f1eee5;color:#111;font-weight:700;cursor:pointer}.action:disabled{opacity:.45;cursor:not-allowed}#result{min-height:1.5em;color:#c7c2b8}.hold{font-size:13px;color:#959da3}a{color:inherit}.site-footer{margin-top:54px;padding-top:22px;border-top:1px solid #394047;display:flex;justify-content:space-between;gap:24px;color:#959da3;font-size:11px}.site-footer div{display:grid;gap:4px}.site-footer nav{display:flex;gap:14px;flex-wrap:wrap}.site-footer a{text-underline-offset:3px}@media(max-width:620px){.site-footer{flex-direction:column}}
</style></head><body><main>
<p class="kicker">c3 COMMUNITY PARTNERS · 4.7%</p><h1>Before My Environment opens.</h1>
<div class="flame" aria-label="Eternal Flame memorial"><span aria-hidden="true">◊</span><strong>Eternal Flame</strong><p>For those who died waiting.</p></div>
<p>This acknowledgment records receipt and recognition only. It does not create authority, support, attendance, contribution, or additional standing.</p>
${items("Constraints",PCT47_322_CONTRACT.constraints)}
${items("Agreements",PCT47_322_CONTRACT.agreements)}
${items("Resolutions",PCT47_322_CONTRACT.resolutions)}
<div class="ack"><label><input id="ack" type="checkbox"><span>${esc(PCT47_322_CONTRACT.acknowledgmentText)}</span></label>
<button id="continue" class="action" type="button" disabled>${esc(PCT47_322_CONTRACT.actionLabel)}</button></div>
<p id="result" role="status"></p><p class="hold"><a href="/connect">Return to Connect</a></p>
<footer class="site-footer"><div><strong>A c3 Field Initiative</strong><span>c3 Community Partners DAO, LLC operating within computational systems governance.</span><span>© 2026 c3 Community Partners DAO, LLC. All rights reserved.</span></div><nav aria-label="Footer"><a href="https://c3field.online/privacy">Privacy</a><a href="https://c3field.online/terms">Terms</a><a href="https://c3field.online/contact">Contact</a></nav></footer>
</main>
<script nonce="${nonce}">
const parameters=new URLSearchParams(location.hash.slice(1));
const ticket=parameters.get("ticket");
history.replaceState(null,"",location.pathname);
const ack=document.getElementById("ack"),button=document.getElementById("continue"),result=document.getElementById("result");
if(!ticket){ack.disabled=true;button.disabled=true;result.textContent="This acknowledgment link is unavailable."}
ack.addEventListener("change",()=>{button.disabled=!ack.checked||!ticket});
button.addEventListener("click",async()=>{
 button.disabled=true;ack.disabled=true;result.textContent="Recording acknowledgment…";
 try{
  const response=await fetch(location.pathname,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({ticket,acknowledged:true})});
  const value=await response.json();
  const recorded=response.ok&&value.standing==="connection_recorded"&&value.saved===true&&value.acknowledgment_recorded===true;
  result.textContent=recorded?"Acknowledgment recorded. Opening My Environment…":"The acknowledgment could not be recorded. Return to Connect and request a fresh passage.";
  if(recorded&&typeof value.next_url==="string"){
   try{
    const next=new URL(value.next_url,location.origin);
    if(next.origin==="https://my.c3field.online"&&next.pathname==="/my-environment"&&next.hash.startsWith("#claim=")){
      window.setTimeout(()=>location.assign(next.href),650);
    }
   }catch{}
  }
 }catch{result.textContent="The acknowledgment could not be recorded. Return to Connect and request a fresh passage."}
});
</script></body></html>`,{headers:{
  "content-type":"text/html; charset=utf-8","cache-control":"no-store","referrer-policy":"no-referrer",
  "x-content-type-options":"nosniff",
  "content-security-policy":`default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'`
}})
}

export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
