import {json, type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"

type R2ObjectBody={body:ReadableStream|null;size:number;httpEtag?:string;range?:{offset:number;length:number};writeHttpMetadata?:(headers:Headers)=>void}
type R2BucketLike={get:(key:string,options?:{range?:{offset:number;length:number}})=>Promise<R2ObjectBody|null>}
type FreeMediaEnv=PassageEnv&{C1ME_ENV_READY?:R2BucketLike;C3_FIELD_MEDIA?:R2BucketLike}

const PUBLIC_SUPABASE_ASSETS=new Set([
  "c3_field_connect_hero_backdrop_v1",
  "c3_field_mdm_connect_room_backdrop_v1",
  "c3_field_mdm_capacity_projects_backdrop_v1",
  "c3_field_mdm_serene_place_backdrop_v1",
  "c3_field_mdm_c3_center_og_master_v1",
  "c3_field_handcrafted_emblem_render_v1",
])
const ALLOWED_ASSETS=new Set([
  "c3_field_c1me_arrival_video_v1",
  "c3_field_c1me_live_backdrop_v1",
  "c3_field_public_intro_million_dollar_mission_v1",
  "c3_field_public_intro_current_v1",
  ...PUBLIC_SUPABASE_ASSETS,
])

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
  url.searchParams.set("select","asset_key,owning_system_key,standing,mime_type,byte_size,content_hash,hash_algorithm,authoritative_custody_provider,authoritative_custody_identifier,authoritative_custody_location,public_retrieval_standing,current_free_binding")
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
  if(typeof asset.content_hash==="string") headers.set("etag",`"${asset.content_hash}"`)
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

export type ParsedByteRange=
  | {kind:"none"}
  | {kind:"range";offset:number;length:number;end:number}
  | {kind:"invalid"}

export function parseByteRange(value:string|null,total:number):ParsedByteRange{
  if(!value) return {kind:"none"}
  if(!Number.isSafeInteger(total)||total<=0) return {kind:"invalid"}
  const match=/^bytes=(\d*)-(\d*)$/.exec(value.trim())
  if(!match||(!match[1]&&!match[2])) return {kind:"invalid"}

  if(!match[1]){
    const suffix=Number(match[2])
    if(!Number.isSafeInteger(suffix)||suffix<=0) return {kind:"invalid"}
    const length=Math.min(suffix,total)
    const offset=total-length
    return {kind:"range",offset,length,end:total-1}
  }

  const offset=Number(match[1])
  if(!Number.isSafeInteger(offset)||offset<0||offset>=total) return {kind:"invalid"}
  const requestedEnd=match[2]?Number(match[2]):total-1
  if(!Number.isSafeInteger(requestedEnd)||requestedEnd<offset) return {kind:"invalid"}
  const end=Math.min(requestedEnd,total-1)
  return {kind:"range",offset,length:end-offset+1,end}
}

export function r2BindingKey(custodyIdentifier:unknown){
  if(custodyIdentifier==="c3-field-media") return "C3_FIELD_MEDIA" as const
  if(custodyIdentifier==="c1ME.env_ready") return "C1ME_ENV_READY" as const
  return null
}

async function resolveBoundR2(asset:Record<string,unknown>,env:FreeMediaEnv,request:Request){
  const object=asset.authoritative_custody_location
  const bindingKey=r2BindingKey(asset.authoritative_custody_identifier)
  if(typeof object!=="string"||!bindingKey) throw new Error("custody_mismatch")
  const bucket=env[bindingKey]
  if(!bucket) throw new Error("r2_binding_unavailable")

  const total=typeof asset.byte_size==="number"&&Number.isSafeInteger(asset.byte_size)&&asset.byte_size>0
    ? asset.byte_size
    : null
  if(!total) throw new Error("asset_size_unavailable")

  const range=parseByteRange(request.headers.get("range"),total)
  const headers=cacheHeaders(asset)
  headers.set("accept-ranges","bytes")

  if(range.kind==="invalid"){
    headers.set("content-range",`bytes */${total}`)
    headers.set("content-length","0")
    return new Response(null,{status:416,headers})
  }

  const options=range.kind==="range"?{range:{offset:range.offset,length:range.length}}:undefined
  const resolved=await bucket.get(object,options)
  if(!resolved||!resolved.body) throw new Error("provider_unavailable")

  if(range.kind==="range"){
    headers.set("content-range",`bytes ${range.offset}-${range.end}/${total}`)
    headers.set("content-length",String(range.length))
    return new Response(resolved.body,{status:206,headers})
  }

  headers.set("content-length",String(total))
  return new Response(resolved.body,{status:200,headers})
}

export const onRequestGet:PagesFunction<FreeMediaEnv>=async({request,env})=>{
  try{
    const assetKey=new URL(request.url).searchParams.get("asset")||""
    if(!ALLOWED_ASSETS.has(assetKey)) return json({standing:"free_media_not_registered"},404)
    const asset=await readAsset(env,assetKey)
    const isPublicAsset=(PUBLIC_SUPABASE_ASSETS.has(assetKey)||assetKey==="c3_field_public_intro_million_dollar_mission_v1"||assetKey==="c3_field_public_intro_current_v1")&&asset.public_retrieval_standing==="bounded_public_runtime"
    if(!isPublicAsset){
      const sessionCookie=cookie(request,"c3_env_session")
      if(!sessionCookie) return json({standing:"environment_claim_required"},401)
      await resolveEnvironmentSession(sessionCookie,env)
    }
    if(asset.standing!=="operator_approved_webpac_reference"&&asset.standing!=="operator_approved_default_environment_visual") return json({standing:"free_media_standing_held"},409)
    if(asset.authoritative_custody_provider==="Cloudflare R2") return await resolveBoundR2(asset,env,request)
    if((assetKey==="c3_field_c1me_live_backdrop_v1"||PUBLIC_SUPABASE_ASSETS.has(assetKey))&&asset.authoritative_custody_provider==="supabase") return await resolveSupabase(asset,env)
    return json({standing:"free_media_provider_not_registered"},409)
  }catch(error){
    const reason=error instanceof Error?error.message:"free_media_unavailable"
    return json({standing:"free_media_held",reason},503)
  }
}

export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
