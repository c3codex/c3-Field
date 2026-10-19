import test from "node:test"
import assert from "node:assert/strict"
import {onRequestPost} from "./c3-community-connect-capture"
const via="90c495d0-3588-4d2b-a5bc-bd919b10513b"
for(const mode of ["malformed","revoked","unknown","backend-failure"])test(mode+" referral stops before candidate/participant registration",async()=>{
 const original=globalThis.fetch,calls:string[]=[]
 globalThis.fetch=async(input,init)=>{
  const url=new URL(String(input));calls.push(url.pathname)
  assert.equal(init?.method,undefined)
  assert.ok(url.pathname.endsWith("/c3_env_share_reference"))
  assert.equal(url.searchParams.get("share_state"),"eq.active")
  return new Response(JSON.stringify(mode==="backend-failure"?{}:[]),{status:mode==="backend-failure"?503:200})
 }
 try{
 const request=new Request("https://c3field.online/api/c3-community-connect-capture",{method:"POST",headers:{"content-type":"application/json",origin:"https://c3field.online"},body:JSON.stringify({
  name:"Isolated recipient",email:"fixture@example.invalid",consent:true,attestation:true,participationIntention:true,
  connectAs:"individual",shareReference:mode==="malformed"?"not-a-uuid":via})})
 const response=await onRequestPost({request,env:{C1_PASSAGE_ENABLED:"true",C1_PUBLIC_ORIGIN:"https://c3field.online",
  SUPABASE_URL:"https://fixture.invalid",SUPABASE_SERVICE_ROLE_KEY:"fixture-only"}} as never)
 assert.ok(response.status>=400);assert.equal(calls.length,mode==="malformed"?0:1)
 }finally{globalThis.fetch=original}
})
