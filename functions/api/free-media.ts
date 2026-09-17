import {json, type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"

type R2ObjectBody={body:ReadableStream|null;size:number;httpEtag?:string;writeHttpMetadata?:(headers:Headers)=>void}
type R2BucketLike={get:(key:string,options?:unknown)=>Promise<R2ObjectBody|null>}
type FreeMediaEnv=PassageEnv&{C1ME_ENV_READY?:R2BucketLike}

const ALLOWED_ASSETS=new Set(["c3_field_c1me_arrival_video_v1","c3_field_c1me_live_backdrop_v1"])

function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name) return decodeURIComponent(rest.join("="))
  }
  return null
}

async function readAsset(env:FreeMediaEnv,assetKey:string){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  const url=new URL(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/c3ops_asset_record")
  url.searchParams.set("select","asset_key,owning_system_key,standing,mime_type,byte_size,content_hash,hash_algorithm,authoritative_custody_provider,authoritative_custody_identifier,authoritative_custody_location,public_retrieval_standing")
  url.searchParams.set("asset_key","eq."+assetKey)
  url.searchParams.set("owning_system_key","eq.c3_field")
  const response=await fetch(url.toString(),{headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY},redirect:"manual",signal:AbortSignal.timeout(12000)})
  if(!response.ok) throw new Error("asset_read_failed")
  const rows=await response.json() as Record<string,unknown>[]
  if(!Array.isArray(rows)||rows.length!==1) throw new Error("asset_unavailable")
  return rows[0]
}

function cacheHeaders(asset:Record<string,unknown>){
  const headers=new Headers({"cache-control":"private, max-age=300","x-content-type-options":"nosniff","referrer-policy":"no-referrer"})
  if(typeof asset.mime_type==="string") headers.set("content-type",asset.mime_type)
  if(typeof asset.content_hash==="string") headers.set("etag",`\"${asset.content_hash}\"`)
  return headers
}

async function resolveSupabase(asset:Record<string,unknown>,env:FreeMediaEnv){
  const bucket=asset.authoritative_custody_identifier
  const object=asset.authoritative_custody_location
  if(bucket!=="c3-field-media"||typeof object!=="string"||!env.SUPABASE_URL) throw new Error("custody_mismatch")
  const url=env.SUPABASE_URL.replace(/\/$/,"")+"/storage/v1/object/public/"+encodeURIComponent(bucket)+"/"+object.split("/").map(encodeURIComponent).join("/")
  const response=await fetch(url,{redirect:"manual",signal:AbortSignal.timeout(12000)})
  if(!response.ok||!response.body) throw new Error("provider_unavailable")
  const headers=cacheHeaders(asset)
  const length=response.headers.get("content-length")
  if(length) headers.set("content-length",length)
  return new Response(response.body,{status:200,headers})
}

async function resolveR2(asset:Record<string,unknown>,env:FreeMediaEnv){
  if(asset.authoritative_custody_identifier!=="c1ME.env_ready"||typeof asset.authoritative_custody_location!=="string") throw new Error("custody_mismatch")
  if(!env.C1ME_ENV_READY) throw new Error("r2_binding_unavailable")
  const object=await env.C1ME_ENV_READY.get(asset.authoritative_custody_location)
  if(!object||!object.body) throw new Error("provider_unavailable")
  const headers=cacheHeaders(asset)
  headers.set("content-length",String(object.size))
  return new Response(object.body,{status:200,headers})
}

export const onRequestGet:PagesFunction<FreeMediaEnv>=async({request,env})=>{
  try{
    const sessionCookie=cookie(request,"c3_env_session")
    if(!sessionCookie) return json({standing:"environment_claim_required"},401)
    await resolveEnvironmentSession(sessionCookie,env)
    const assetKey=new URL(request.url).searchParams.get("asset")||""
    if(!ALLOWED_ASSETS.has(assetKey)) return json({standing:"free_media_not_registered"},404)
    const asset=await readAsset(env,assetKey)
    if(asset.standing!=="operator_approved_webpac_reference"&&asset.standing!=="operator_approved_default_environment_visual") return json({standing:"free_media_standing_held"},409)
    if(assetKey==="c3_field_c1me_arrival_video_v1"&&asset.authoritative_custody_provider==="Cloudflare R2") return await resolveR2(asset,env)
    if(assetKey==="c3_field_c1me_live_backdrop_v1"&&asset.authoritative_custody_provider==="supabase") return await resolveSupabase(asset,env)
    return json({standing:"free_media_provider_not_registered"},409)
  }catch(error){
    const reason=error instanceof Error?error.message:"free_media_unavailable"
    return json({standing:"free_media_held",reason},503)
  }
}

export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
