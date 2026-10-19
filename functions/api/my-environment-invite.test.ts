import test from "node:test"
import assert from "node:assert/strict"
import {onRequestPost} from "./my-environment-invite"
const via="90c495d0-3588-4d2b-a5bc-bd919b10513b"
type Call={url:URL;method:string;body:any}
async function exercise(mode:string,initiative=true){
 const calls:Call[]=[],original=globalThis.fetch
 globalThis.fetch=async(input,init)=>{
  const url=new URL(String(input)),method=init?.method||"GET",body=init?.body?JSON.parse(String(init.body)):null
  calls.push({url,method,body});const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status})
  if(url.pathname.endsWith("c3_env_runtime_session"))return reply(method==="PATCH"?[]:mode==="expired"?[]:[{env_key:"owner-env",envpac_key:"owner-pac",subject_key:"owner",subject_type:mode==="wrong-subject"?"entity":"individual",expires_at:"2099-01-01T00:00:00Z"}])
  if(url.pathname.endsWith("c3_envpac_access_grant"))return reply(mode==="revoked-owner"?[]:[{subject_key:"owner",relation_role:"owner",standing:"active"}])
  if(url.pathname.endsWith("rpc/resolve_c1me_visible_initiatives_internal")){
   if(mode==="rpc-failed")return reply({},503)
   const row={initiative_key:"founders_ground",initiative_envpac_key:"initiative-pac",context_class:"operator",invite_context_allowed:mode!=="revoked-operator",initiative_operator_binding_key:"operator-binding"}
   return reply({resolution:"existing_c1",relationship_ref:mode==="wrong-owner"?"other":"owner",env_key:"owner-env",envpac_ref:"owner-pac",initiative_resolution:"envpac_resolved",initiatives:mode==="unauthorized"?[]:mode==="collision-context"?[row,row]:[row]})
  }
  if(url.pathname.endsWith("system_process_registry")){
   if(mode==="read-failed")return reply({},503)
   if(mode==="released"||mode==="forged-route"){
    const key=url.searchParams.get("process_key")
    if(key==="eq.fixture_initiative")return reply([{status:"active",process_status:"active",metadata:{initiative_key:"founders_ground"}}])
    if(key==="eq.fixture_webpac")return reply([{process_key:"fixture_webpac",status:"active",process_status:"active",metadata:{pac_key:"fixture_webpac",public_release_authorized:true,runtime_release_authorized:true}}])
    return reply([{process_key:"fixture_surface",status:"active",process_status:"active",metadata:{
     active:true,canonical:true,initiative_key:"founders_ground",surface_type:"initiative_connect_surface",
     binding_state:"active",release_state:"released",access_state:"public",system_key:"c3_field",
     env_key:"env_c3_community_connect",canonical_host:"fixture.c3field.online",canonical_url:"https://fixture.c3field.online/",
     surface_key:"fixture_surface",initiative_process_key:"fixture_initiative",webpac_key:"fixture_webpac",
     route:mode==="forged-route"?"https://attacker.invalid/":"/"}}])
   }
   const row={status:"active",process_status:"active",metadata:{initiative_key:"founders_ground",surface_type:"initiative_connect_surface",canonical:true,binding_state:mode==="revoked-surface"?"revoked":"active",release_state:mode==="unreleased"?"held":"released",access_state:"public",canonical_host:"forged.invalid"}}
   return reply(["collision-surface","forged-surface","revoked-surface","unreleased"].includes(mode)?(mode==="collision-surface"?[row,row]:[row]):[])
  }
  if(url.pathname.endsWith("c3_environment"))return reply([{env_key:"env_c3_community_connect",system_key:"c3_field",standing:"governed_environment",is_canonical:true,is_active:true,metadata:{connect_encounter_route:"/connect"}}])
  if(url.pathname.endsWith("c3_env_share_reference")&&method==="POST"){return mode==="write-failed"?reply({},503):reply([{share_reference:via}])}
  throw Error("unexpected fixture route "+url.pathname)
 }
 try{
  const input=mode==="array-intake"?[]:mode==="forged-owner-intake"?{message:"test",owner_subject_key:"other-owner"}:mode==="malformed-message"?{message:42}:{message:"Private introduction",...(initiative?{source_initiative_key:"founders_ground"}:{})}
  const request=new Request("https://my.c3field.online/api/my-environment-invite",{method:"POST",headers:{"content-type":"application/json",cookie:"c3_env_session="+"a".repeat(64)},body:JSON.stringify(input)})
  const response=await onRequestPost({request,env:{SUPABASE_URL:"https://fixture.invalid",SUPABASE_SERVICE_ROLE_KEY:"fixture-only",...(mode==="bad-origin"?{C1_PUBLIC_ORIGIN:"https://attacker.invalid"}:{})}} as never)
  return {response,body:await response.json() as any,calls}
 }finally{globalThis.fetch=original}
}
for(const mode of ["no-surface","unreleased"])test(mode+" authorized provenance reaches accepted intro then Current State entry",async()=>{
 const r=await exercise(mode);assert.equal(r.response.status,200);assert.equal(r.body.public_url,"https://c3field.online/?via="+via)
 assert.equal(r.body.destination_class,"current_state_connection");assert.equal(r.body.initiative_surface_state,"unreleased")
 assert.equal(r.body.initiative_provenance.source_operator_binding_key,"operator-binding")
 const minted=r.calls.filter(c=>c.url.pathname.endsWith("c3_env_share_reference"));assert.equal(minted.length,1)
 assert.equal(minted[0].body.metadata.standing_created,false);assert.equal(r.body.relationship_created,false)
 assert.ok(r.calls.findIndex(c=>c.url.pathname.endsWith("system_process_registry"))<r.calls.findIndex(c=>c.url.pathname.endsWith("c3_env_share_reference")))
 assert.ok(!r.body.public_url.includes("founders_ground"))
})
test("ordinary personal invitation uses same verified personal entrance",async()=>{const r=await exercise("generic",false);assert.equal(r.response.status,200);assert.equal(r.body.initiative_surface_state,"not_selected")})
for(const mode of ["expired","revoked-owner","wrong-subject","rpc-failed","wrong-owner","unauthorized","collision-context","revoked-operator","read-failed","collision-surface","forged-surface","forged-route","revoked-surface","bad-origin"])test(mode+" HLD before share mint",async()=>{
 const r=await exercise(mode);assert.ok(r.response.status>=400);assert.equal(r.body.standing,"connection_invite_held")
 assert.equal(r.calls.filter(c=>c.url.pathname.endsWith("c3_env_share_reference")).length,0)
 assert.ok(r.calls.every(c=>c.url.hostname==="fixture.invalid"))
})
test("write failure never returns a usable invitation or sends a message",async()=>{
 const r=await exercise("write-failed");assert.equal(r.response.status,409);assert.equal(r.body.public_url,undefined)
 assert.equal(r.calls.filter(c=>c.url.pathname.endsWith("c3_env_share_reference")).length,1)
})
test("released qualified initiative retains actual native host resolution before mint",async()=>{
 const r=await exercise("released");assert.equal(r.response.status,200)
 assert.equal(r.body.public_url,"https://fixture.c3field.online/?via="+via)
 assert.equal(r.body.destination_class,"initiative_connection")
 assert.ok(r.calls.find(c=>c.url.pathname.endsWith("c3_environment")))
})
for(const mode of ["array-intake","forged-owner-intake","malformed-message"])test(mode+" does not mint or trust caller ownership",async()=>{
 const r=await exercise(mode);assert.equal(r.response.status,400)
 assert.equal(r.calls.filter(c=>c.url.pathname.endsWith("c3_env_share_reference")).length,0)
})
