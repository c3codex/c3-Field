import {json,readOwnerClaim,type PassageEnv} from '../_lib/c1-passage'

export const onRequestGet:PagesFunction=async()=>new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>Retained records recovery</title><main><h1>Recover retained records</h1><p>Recovery preserves your withdrawal. It does not reopen participation or authorize projections.</p><button id="recover">Download retained manifest</button><p id="notice" role="status"></p></main><script>const claim=new URLSearchParams(location.hash.slice(1)).get('claim');history.replaceState(null,'',location.pathname);document.getElementById('recover').onclick=async()=>{const notice=document.getElementById('notice');try{const r=await fetch(location.pathname,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({claim})});const data=await r.json();if(!r.ok)throw Error();const a=document.createElement('a');const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.href=url;a.download='retained-c3-records.json';a.click();URL.revokeObjectURL(url);notice.textContent='Retained manifest downloaded. Participation remains withdrawn.'}catch{notice.textContent='Recovery could not be verified. Request a fresh access link.'}}</script></html>`,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','referrer-policy':'no-referrer','x-content-type-options':'nosniff'}})

export const onRequestPost:PagesFunction<PassageEnv>=async({request,env})=>{
  try{
    if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return json({standing:'DNR'},403)
    if(Number(request.headers.get('content-length')||0)>8192)return json({standing:'DNR'},413)
    const body=await request.json() as Record<string,unknown>
    if(typeof body.claim!=='string'||body.claim.length>4096)return json({standing:'recovery_unavailable'},401)
    const owner=await readOwnerClaim(body.claim,env)
    if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw Error('configuration')
    const query=new URLSearchParams({select:'receipt_key,portable_manifest,manifest_sha256,completed_at',
      relationship_key:'eq.'+owner.relationshipKey,env_key:'eq.'+owner.envKey,envpac_key:'eq.'+owner.envpacKey,
      action:'eq.terminate',standing:'eq.completed',order:'completed_at.desc',limit:'1'})
    const response=await fetch(env.SUPABASE_URL.replace(/\/$/,'')+'/rest/v1/c3_my_env_owner_lifecycle_receipt?'+query,{
      headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:'Bearer '+env.SUPABASE_SERVICE_ROLE_KEY},redirect:'error',signal:AbortSignal.timeout(12000)})
    const rows=response.ok?await response.json():[]
    if(!Array.isArray(rows)||rows.length!==1)return json({standing:'recovery_unavailable'},403)
    const receipt=rows[0] as Record<string,unknown>
    return json({standing:'retained_manifest_recovered',receipt_key:receipt.receipt_key,manifest:receipt.portable_manifest,
      manifest_sha256:receipt.manifest_sha256,as_at:receipt.completed_at,participation_restored:false,
      projection_authorized:false,binary_assets_embedded:false})
  }catch{return json({standing:'recovery_unavailable'},401)}
}
export const onRequest:PagesFunction=async()=>json({standing:'DNR'},405)
