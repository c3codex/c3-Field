import {json, type PassageEnv} from "../_lib/c1-passage"

type PacRow={
  pac_key:string
  custody_uri:string|null
  content_sha256:string|null
  standing:string|null
  is_effective:boolean|null
}

type RpcResolution={
  resolution_state?:string
  reason?:string
  [key:string]:unknown
}

const MR_HOME_PAC_KEY="measures_registry_home_c3webpac_v0_4"

function hex(bytes:ArrayBuffer){
  return [...new Uint8Array(bytes)].map((b)=>b.toString(16).padStart(2,"0")).join("")
}

function parseGithubCustody(uri:string){
  const match=/^repo:\/\/([^/]+\/[^@/]+)@([0-9a-f]{40})\/(.+)$/.exec(uri)
  if(!match) return null
  return {repo:match[1],commit:match[2],path:match[3]}
}

async function registryRequest(env:PassageEnv,path:string,init?:RequestInit){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  return fetch(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/"+path,{
    ...init,
    headers:{
      apikey:env.SUPABASE_SERVICE_ROLE_KEY,
      authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,
      "content-type":"application/json",
      ...(init?.headers||{}),
    },
    signal:AbortSignal.timeout(12000),
  })
}

export const onRequestGet:PagesFunction<PassageEnv>=async({env})=>{
  try{
    const pacResponse=await registryRequest(
      env,
      "c3_pac?select=pac_key,custody_uri,content_sha256,standing,is_effective&pac_key=eq."+MR_HOME_PAC_KEY,
    )
    if(!pacResponse.ok) return json({resolution_state:"DNR",reason:"registry_read_failed"},503)
    const rows=await pacResponse.json() as PacRow[]
    if(rows.length!==1) return json({resolution_state:"DNR",reason:"pac_not_registered"},423)
    const pac=rows[0]
    if(pac.standing!=="active"||pac.is_effective!==true||!pac.custody_uri)
      return json({resolution_state:"DNR",reason:"pac_not_active_effective"},423)

    const custody=parseGithubCustody(pac.custody_uri)
    if(!custody) return json({resolution_state:"DNR",reason:"custody_uri_not_immutable_github"},423)

    const rawUrl="https://raw.githubusercontent.com/"+custody.repo+"/"+custody.commit+"/"+custody.path
    const custodyResponse=await fetch(rawUrl,{redirect:"error",signal:AbortSignal.timeout(12000)})
    if(!custodyResponse.ok) return json({resolution_state:"DNR",reason:"custody_object_unavailable"},423)
    const bytes=await custodyResponse.arrayBuffer()
    const observedHash=hex(await crypto.subtle.digest("SHA-256",bytes))

    const rpcResponse=await registryRequest(env,"rpc/resolve_measures_registry_pac_snapshot_v1",{
      method:"POST",
      body:JSON.stringify({p_pac_key:MR_HOME_PAC_KEY,p_observed_content_sha256:observedHash}),
    })
    if(!rpcResponse.ok) return json({resolution_state:"DNR",reason:"registry_resolution_failed"},503)
    const resolution=await rpcResponse.json() as RpcResolution
    const status=resolution.resolution_state==="RESOLVED"?200:423
    const response=json({...resolution,custody_commit:custody.commit},status)
    response.headers.set("cache-control","no-store")
    response.headers.set("x-c3-free-contract","measures-registry-pac-resolution-v1")
    return response
  }catch(error){
    return json({resolution_state:"DNR",reason:error instanceof Error?error.message:"mr_pac_resolution_unavailable"},503)
  }
}

export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
