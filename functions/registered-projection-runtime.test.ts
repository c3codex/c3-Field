import test from "node:test"
import assert from "node:assert/strict"
import {onRequest as middleware} from "./_middleware"
import {onRequestGet as media} from "./api/free-media"
import {resolveRegisteredNativeInitiative} from "./_lib/registered-public-surface"

const env={SUPABASE_URL:"https://registry.example",SUPABASE_SERVICE_ROLE_KEY:"server-test-key"}
const native=(host:string,key:string)=>({status:"available",presentation:{projection_type:"registered_c3_native_initiative_projection",canonical_host:host,canonical_path:"/",canonical_url:"https://"+host+"/",route:"/",connect_route:"/connect",canonical_environment:"env_c3_community_connect",release_state:"public",authority_effect:"none",frontend_invention:false,creates_standing:false,initiative_key:key,initiative_process_key:key+"_initiative",surface_key:key+"_surface",webpac_key:key+"_projection"}})
const og47={image_asset_key:"47pct_og",runtime_uri:"/api/free-media?asset=47pct_og",social_delivery_uri:"https://media.example/approved.webp",webpac_binding_key:"og_binding",image_integrity_sha256:"1".repeat(64),frontend_fallback_allowed:false,image_mime_type:"image/webp"}
const html='<html><head><title>Measures Registry</title><meta name="description" content="Measures Registry" /><link rel="canonical" href="https://measuresregistry.com/" /><meta property="og:title" content="Measures Registry" /><meta property="og:description" content="Measures Registry" /><meta property="og:image" content="https://measuresregistry.com/og.jpeg" /><meta property="og:url" content="https://measuresregistry.com/" /></head><body></body></html>'
async function head(host:string,path:string,body:any,presentation?:any){
  const original=globalThis.fetch
  const calls:string[]=[]
  globalThis.fetch=async input=>{
    const url=new URL(String(input));calls.push(url.pathname)
    if(url.pathname==="/api/public-surface")return Response.json(body)
    if(url.pathname==="/api/c3-public-presentation"&&presentation)return Response.json(presentation)
    throw new Error("unexpected authority dependency")
  }
  try {return {response:await middleware({env:{},request:new Request("https://"+host+path),next:async()=>new Response(html,{headers:{"content-type":"text/html"}})} as never),calls}}
  finally{globalThis.fetch=original}
}
test("registered 4.7 root and Connect head are 200 without legacy authority or Measures metadata",async()=>{
  const b=native("47pct.c3field.online","47pct") as any
  b.presentation.public_presentation={og_title:"Approved 4.7%",og_description:"Approved description",og_image_asset_key:"47pct_og"};b.presentation.open_graph_contract=og47
  for(const path of ["/","/connect"]){
    const {response,calls}=await head("47pct.c3field.online",path,b)
    assert.equal(response.status,200);const out=await response.text()
    assert(!out.includes("Measures Registry"));assert(out.includes("https://47pct.c3field.online"+path));assert(out.includes(og47.social_delivery_uri));assert.deepEqual(calls,["/api/public-surface"])
  }
})
test("registered MDM resolves separate approved presentation and source OG on root and Connect",async()=>{
  const b=native("mdm.c3field.online","million_dollar_mission")
  const seo={title:"Approved Mission",description:"Approved mission description",canonical_url:b.presentation.canonical_url,og_image_asset_key:"mdm_og",og_type:"website"}
  const p={standing:"bounded_public_runtime",surface:{initiativeKey:"million_dollar_mission",webpacKey:b.presentation.webpac_key,canonicalUrl:b.presentation.canonical_url},presentation:{seo,open_graph_contract:{title:seo.title,description:seo.description,canonical_url:seo.canonical_url,image_asset_key:"mdm_og",runtime_uri:"/api/free-media?asset=mdm_og",webpac_binding_key:"mdm_og_binding",frontend_fallback_allowed:false}}}
  for(const path of ["/","/connect"]){const {response}=await head("mdm.c3field.online",path,b,p);assert.equal(response.status,200);const out=await response.text();assert(!out.includes("Measures Registry"));assert(out.includes("https://mdm.c3field.online"+path));assert(out.includes("asset=mdm_og"))}
  const drift=structuredClone(p);drift.presentation.open_graph_contract.image_asset_key="other"
  assert.equal((await head("mdm.c3field.online","/",b,drift)).response.status,503)
})
test("held, misbound and authority-creating projections retain 503 guards",async()=>{
  for(const mutation of [{release_state:"held"},{canonical_host:"other.c3field.online"},{projection_type:"registered_owner_custodied_pac_projection"},{frontend_invention:true},{creates_standing:true},{canonical_url:"https://47pct.c3field.online/not-root"}]){
    const b=native("47pct.c3field.online","47pct") as any;Object.assign(b.presentation,mutation)
    const {response}=await head("47pct.c3field.online","/",b);assert.equal(response.status,503);assert.equal(response.headers.get("x-c3-social-head"),"47pct-held")
  }
})
test("Run Aground preserves released content while declining unregistered OG copy/image",async()=>{
  const {response}=await head("runaground.c3field.online","/",{status:"available",presentation:{projection_type:"registered_owner_custodied_pac_projection",canonical_host:"runaground.c3field.online",canonical_path:"/",release_state:"public",authority_effect:"none",frontend_invention:false,custody_transfer:false,public_presentation:{title:"Run Aground"}}})
  assert.equal(response.status,200);const out=await response.text();assert(out.includes("<title>Run Aground</title>"));assert(!out.includes("Measures Registry"));assert(!out.includes('property="og:image"'))
})
test("native initiative source lineage resolves without reading or unholding legacy processes",async()=>{
  const original=fetch;const b=native("mdm.c3field.online","million_dollar_mission")
  globalThis.fetch=async input=>{
    const u=new URL(String(input))
    if(u.pathname.endsWith("resolve_public_surface_v1"))return Response.json(b)
    assert(!u.pathname.includes("system_process_registry"))
    const projection=u.searchParams.get("pac_key")==="eq."+b.presentation.webpac_key
    return Response.json([{pac_key:projection?b.presentation.webpac_key:"source_pac",pac_type:"c3WebPac",is_effective:true,metadata:projection?{canonical_host:b.presentation.canonical_host,initiative_key:b.presentation.initiative_key,frontend_invention:false,creates_standing:false,legacy_presentation_source_pac:"source_pac",presentation_authority:"approved_source"}:{hardened_projection_pac_key:b.presentation.webpac_key}}])
  }
  try{const value=await resolveRegisteredNativeInitiative(env,b.presentation.canonical_host);assert.equal(value.sourcePacKey,"source_pac");assert.equal(value.presentationSourceKey,"approved_source")}
  finally{globalThis.fetch=original}
})
test("owner-custodied public cover uses exact approved member and retained held source; other assets fail closed",async()=>{
  const original=fetch;let providerReads=0
  const key="approved_cover",uri="/api/free-media?asset="+key
  const asset={asset_key:key,standing:"operator_approved_webpac_reference",public_retrieval_standing:"bounded_public_runtime",authoritative_custody_provider:"supabase",authoritative_custody_identifier:"c3-field-media",authoritative_custody_location:"cover.webp",current_free_binding:uri,content_hash:"approved-hash",hash_algorithm:"sha256",byte_size:3,mime_type:"image/webp"}
  const member={member_role:"cover_master",runtime_uri:uri,metadata:{runtime_derivative_asset_key:key,approval_state:"operator_approved",runtime_binding_state:"READY",frontend_invention_allowed:false,runtime_storage_provider:"supabase",runtime_storage_bucket:"c3-field-media",runtime_storage_object:"cover.webp",runtime_integrity_state:"sha256_verified",runtime_derivative_sha256:"approved-hash",runtime_derivative_byte_size:3,runtime_derivative_mime_type:"image/webp"}}
  globalThis.fetch=async input=>{
    const u=new URL(String(input))
    if(u.pathname.endsWith("resolve_public_surface_v1"))return Response.json({status:"available",presentation:{projection_type:"registered_owner_custodied_pac_projection",canonical_host:"runaground.c3field.online",canonical_path:"/",release_state:"public",authority_effect:"none",frontend_invention:false,custody_transfer:false,projection_origin:"my_env",pac_key:"projection_pac",source_pac_key:"source_pac",members:[member]}})
    if(u.pathname.endsWith("c3ops_asset_record"))return Response.json([asset])
    if(u.pathname.endsWith("c3_pac")){const projection=u.searchParams.get("pac_key")==="eq.projection_pac";return Response.json([{pac_key:projection?"projection_pac":"source_pac",pac_type:"c3WebPac",is_effective:true,standing:projection?"formed":"registered_complete_runtime_release_held",metadata:projection?{canonical_host:"runaground.c3field.online",source_pac_key:"source_pac",custody_transfer:false,frontend_invention:false}:{runtime_release_authorized:false}}])}
    if(u.pathname.endsWith("c3_pac_runtime_binding"))return Response.json([{binding_key:"cover_binding",pac_key:"source_pac",media_role:"cover_master",provider:"supabase",bucket_name:"c3-field-media",object_path:"cover.webp",runtime_uri:uri,standing:"active",metadata:{source_asset_key:key}}])
    if(u.pathname.includes("/storage/")){providerReads++;return new Response(new Uint8Array([1,2,3]),{headers:{"content-type":"image/webp"}})}
    throw new Error("unexpected authority dependency")
  }
  try {
    const call=(k:string)=>media({env,request:new Request("https://runaground.c3field.online/api/free-media?asset="+k)} as never)
    const valid=await call(key);assert.equal(valid.status,200);assert.equal(valid.headers.get("x-c3-media-binding"),"cover_binding");assert.equal(providerReads,1)
    const missing=await call("private_manuscript");assert.equal(missing.status,423);assert.equal(providerReads,1)
    member.metadata.runtime_derivative_sha256="different";assert.equal((await call(key)).status,409);assert.equal(providerReads,1)
  }finally{globalThis.fetch=original}
})
