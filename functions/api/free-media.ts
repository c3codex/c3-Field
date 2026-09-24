import {json, type PassageEnv} from "../_lib/c1-passage"
import {resolveEnvironmentSession} from "../_lib/env-session"
import {
  InitiativeSurfaceResolutionError,
  isInitiativeSurfaceHostname,
  normalizeInitiativeSurfaceHostname,
  resolveInitiativeSurfaceHost,
} from "../_lib/initiative-surface-host"

type R2ObjectBody={body:ReadableStream|null;size:number;httpEtag?:string;range?:{offset:number;length:number};writeHttpMetadata?:(headers:Headers)=>void}
type R2BucketLike={get:(key:string,options?:{range?:{offset:number;length:number}})=>Promise<R2ObjectBody|null>}
type FreeMediaEnv=PassageEnv&{C1ME_ENV_READY?:R2BucketLike;C3_FIELD_MEDIA?:R2BucketLike}
type RegistryRow=Record<string,unknown>

const PERSONAL_MEDIA_ASSETS=new Set([
  "c3_field_c1me_arrival_video_v1",
  "c3_field_c1me_live_backdrop_v1",
])

class FreeMediaError extends Error{
  status:number
  constructor(reason:string,status=409){
    super(reason)
    this.name="FreeMediaError"
    this.status=status
  }
}

function record(value:unknown):Record<string,unknown>{
  return value && typeof value==="object" && !Array.isArray(value) ? value as Record<string,unknown> : {}
}
function str(value:unknown){return typeof value==="string"&&value.trim()?value.trim():null}

function cookie(request:Request,name:string){
  const source=request.headers.get("cookie")||""
  for(const part of source.split(";")){
    const [key,...rest]=part.trim().split("=")
    if(key===name) return decodeURIComponent(rest.join("="))
  }
  return null
}

async function readRows(env:FreeMediaEnv,table:string,select:string,filters:Record<string,string>){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new FreeMediaError("server_configuration",503)
  const url=new URL(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/"+table)
  url.searchParams.set("select",select)
  for(const [key,value] of Object.entries(filters)) url.searchParams.set(key,value)
  const response=await fetch(url.toString(),{
    headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY},
    redirect:"manual",
    signal:AbortSignal.timeout(12000)
  })
  if(!response.ok) throw new FreeMediaError("registry_read_failed",503)
  const rows=await response.json() as unknown
  if(!Array.isArray(rows)) throw new FreeMediaError("registry_read_failed",503)
  return rows as RegistryRow[]
}

async function readAsset(env:FreeMediaEnv,assetKey:string){
  const rows=await readRows(
    env,
    "c3ops_asset_record",
    "asset_key,owning_system_key,standing,mime_type,byte_size,content_hash,hash_algorithm,authoritative_custody_provider,authoritative_custody_identifier,authoritative_custody_location,public_retrieval_standing,current_free_binding",
    {asset_key:"eq."+assetKey,owning_system_key:"eq.c3_field"}
  )
  if(rows.length!==1) throw new FreeMediaError("asset_unavailable",404)
  return rows[0]
}

function cacheHeaders(asset:RegistryRow){
  const headers=new Headers({"cache-control":"private, max-age=300","x-content-type-options":"nosniff","referrer-policy":"no-referrer"})
  if(typeof asset.mime_type==="string") headers.set("content-type",asset.mime_type)
  if(typeof asset.content_hash==="string") headers.set("etag",`"${asset.content_hash}"`)
  return headers
}

async function resolveSupabase(asset:RegistryRow,env:FreeMediaEnv){
  const bucket=asset.authoritative_custody_identifier
  const object=asset.authoritative_custody_location
  if(bucket!=="c3-field-media"||typeof object!=="string"||!env.SUPABASE_URL) throw new FreeMediaError("custody_mismatch")
  const url=env.SUPABASE_URL.replace(/\/$/,"")+"/storage/v1/object/public/"+encodeURIComponent(bucket)+"/"+object.split("/").map(encodeURIComponent).join("/")
  const response=await fetch(url,{redirect:"manual",signal:AbortSignal.timeout(12000)})
  if(!response.ok||!response.body) throw new FreeMediaError("provider_unavailable",503)
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

export function normalizedProvider(value:unknown){
  return typeof value==="string"
    ? value.trim().toLowerCase().replace(/[\s-]+/g,"_")
    : ""
}

async function resolvePublicR2Fallback(asset:RegistryRow,request:Request){
  if(asset.authoritative_custody_identifier!=="c3-field-media"||typeof asset.authoritative_custody_location!=="string") throw new FreeMediaError("custody_mismatch")
  const object=asset.authoritative_custody_location.split("/").map(part=>encodeURIComponent(part)).join("/")
  const source="https://field-media.c3field.online/"+object
  const upstreamHeaders=new Headers()
  const range=request.headers.get("range")
  if(range) upstreamHeaders.set("range",range)
  const response=await fetch(source,{headers:upstreamHeaders,redirect:"manual",signal:AbortSignal.timeout(20000)})
  if((response.status!==200&&response.status!==206)||!response.body) throw new FreeMediaError("provider_unavailable",503)
  const headers=cacheHeaders(asset)
  for(const name of ["content-length","content-range","accept-ranges","last-modified"]){
    const value=response.headers.get(name)
    if(value) headers.set(name,value)
  }
  if(response.status===206) headers.set("accept-ranges","bytes")
  return new Response(response.body,{status:response.status,headers})
}

async function resolveBoundR2(asset:RegistryRow,env:FreeMediaEnv,request:Request){
  const object=asset.authoritative_custody_location
  const bindingKey=r2BindingKey(asset.authoritative_custody_identifier)
  if(typeof object!=="string"||!bindingKey) throw new FreeMediaError("custody_mismatch")
  const bucket=env[bindingKey]
  if(!bucket){
    if(bindingKey==="C3_FIELD_MEDIA") return await resolvePublicR2Fallback(asset,request)
    throw new FreeMediaError("r2_binding_unavailable",503)
  }

  const total=typeof asset.byte_size==="number"&&Number.isSafeInteger(asset.byte_size)&&asset.byte_size>0
    ? asset.byte_size
    : null
  if(!total) throw new FreeMediaError("asset_size_unavailable",503)

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
  if(!resolved||!resolved.body) throw new FreeMediaError("provider_unavailable",503)

  if(range.kind==="range"){
    headers.set("content-range",`bytes ${range.offset}-${range.end}/${total}`)
    headers.set("content-length",String(range.length))
    return new Response(resolved.body,{status:206,headers})
  }

  headers.set("content-length",String(total))
  return new Response(resolved.body,{status:200,headers})
}

async function resolveNativeCustody(asset:RegistryRow,env:FreeMediaEnv,request:Request){
  const provider=normalizedProvider(asset.authoritative_custody_provider)
  if(provider==="cloudflare_r2") return await resolveBoundR2(asset,env,request)
  if(provider==="supabase") return await resolveSupabase(asset,env)
  throw new FreeMediaError("free_media_provider_not_registered")
}

async function canonicalPublicIntroPacKey(env:FreeMediaEnv){
  const rows=await readRows(
    env,
    "c3_environment",
    "env_key,system_key,standing,is_active,is_canonical,metadata",
    {
      env_key:"eq.env_c3_community_connect",
      system_key:"eq.c3_field",
      standing:"eq.governed_environment",
      is_active:"eq.true",
      is_canonical:"eq.true",
    }
  )
  if(rows.length!==1) throw new FreeMediaError("canonical_c1me_unavailable",503)
  const key=str(record(rows[0].metadata).public_intro_webpac_key)
  if(!key) throw new FreeMediaError("public_intro_webpac_unbound",423)
  return key
}

async function publicPacKeyForRequest(env:FreeMediaEnv,request:Request){
  const host=normalizeInitiativeSurfaceHostname(new URL(request.url).hostname)
  if(isInitiativeSurfaceHostname(host)){
    return (await resolveInitiativeSurfaceHost(env,host)).webpacKey
  }
  if(host==="c3field.online"||host==="www.c3field.online"){
    return await canonicalPublicIntroPacKey(env)
  }
  throw new FreeMediaError("public_media_surface_unregistered",404)
}

async function requireEligiblePublicPac(env:FreeMediaEnv,pacKey:string){
  const rows=await readRows(
    env,
    "c3_pac",
    "pac_key,envpac_key,pac_type,version,standing,is_effective,metadata",
    {pac_key:"eq."+pacKey}
  )
  if(rows.length!==1) throw new FreeMediaError("public_webpac_unavailable",423)
  const pac=rows[0]
  const metadata=record(pac.metadata)
  if(
    pac.pac_type!=="c3WebPac"||
    pac.is_effective!==true||
    metadata.completeness!=="pass"||
    metadata.public_release_authorized!==true||
    metadata.runtime_release_authorized!==true
  ) throw new FreeMediaError("public_webpac_held",423)
  return pac
}

async function requirePacRuntimeBinding(env:FreeMediaEnv,pacKey:string,assetKey:string,asset:RegistryRow){
  const rows=await readRows(
    env,
    "c3_pac_runtime_binding",
    "binding_key,pac_key,media_role,provider,bucket_name,object_path,runtime_uri,standing,metadata",
    {
      pac_key:"eq."+pacKey,
      standing:"eq.active",
      metadata:"cs."+JSON.stringify({source_asset_key:assetKey}),
    }
  )
  if(rows.length===0) throw new FreeMediaError("pac_media_binding_unavailable",423)
  if(rows.length!==1) throw new FreeMediaError("pac_media_binding_collision",409)
  const binding=rows[0]
  const metadata=record(binding.metadata)

  if(metadata.source_asset_key!==assetKey) throw new FreeMediaError("pac_media_asset_mismatch")
  if(normalizedProvider(binding.provider)!==normalizedProvider(asset.authoritative_custody_provider))
    throw new FreeMediaError("pac_media_provider_mismatch")
  if(binding.bucket_name!==asset.authoritative_custody_identifier)
    throw new FreeMediaError("pac_media_bucket_mismatch")
  if(binding.object_path!==asset.authoritative_custody_location)
    throw new FreeMediaError("pac_media_object_mismatch")

  const freeBinding=str(asset.current_free_binding)
  const runtimeUri=str(binding.runtime_uri)
  if(runtimeUri&&freeBinding&&runtimeUri!==freeBinding)
    throw new FreeMediaError("pac_media_runtime_uri_mismatch")

  return binding
}

function addPacProof(response:Response,pacKey:string,binding:RegistryRow){
  response.headers.set("x-c3-pac-key",pacKey)
  if(typeof binding.binding_key==="string") response.headers.set("x-c3-media-binding",binding.binding_key)
  if(typeof binding.media_role==="string") response.headers.set("x-c3-media-role",binding.media_role)
  return response
}

export const onRequestGet:PagesFunction<FreeMediaEnv>=async({request,env})=>{
  try{
    const assetKey=new URL(request.url).searchParams.get("asset")||""
    if(!assetKey) return json({standing:"free_media_asset_required"},400)

    const asset=await readAsset(env,assetKey)
    if(asset.standing!=="operator_approved_webpac_reference"&&asset.standing!=="operator_approved_default_environment_visual")
      return json({standing:"free_media_standing_held"},409)

    const isPublicAsset=asset.public_retrieval_standing==="bounded_public_runtime"
    if(isPublicAsset){
      const pacKey=await publicPacKeyForRequest(env,request)
      await requireEligiblePublicPac(env,pacKey)
      const binding=await requirePacRuntimeBinding(env,pacKey,assetKey,asset)
      return addPacProof(await resolveNativeCustody(asset,env,request),pacKey,binding)
    }

    if(!PERSONAL_MEDIA_ASSETS.has(assetKey)) return json({standing:"free_media_not_registered"},404)
    const sessionCookie=cookie(request,"c3_env_session")
    if(!sessionCookie) return json({standing:"environment_claim_required"},401)
    await resolveEnvironmentSession(sessionCookie,env)
    return await resolveNativeCustody(asset,env,request)
  }catch(error){
    if(error instanceof InitiativeSurfaceResolutionError)
      return json({standing:"free_media_held",reason:error.reasonCode},error.status)
    if(error instanceof FreeMediaError)
      return json({standing:"free_media_held",reason:error.message},error.status)
    const reason=error instanceof Error?error.message:"free_media_unavailable"
    return json({standing:"free_media_held",reason},503)
  }
}

export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
