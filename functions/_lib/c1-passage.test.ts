import assert from "node:assert/strict"
import test from "node:test"
import {captureCandidate,verifyCandidate,ENV_KEY,type PassageEnv} from "./c1-passage"
import {onRequestPost as captureRoute} from "../api/c3-community-connect-capture"
import {onRequestPost as verifyRoute,onRequestGet} from "../api/c3-community-connect-verify"
const key="crs_"+"a".repeat(32), token="b".repeat(48)
const env: PassageEnv={SUPABASE_URL:"https://zfihrspxvennjzazxcbj.supabase.co",SUPABASE_SERVICE_ROLE_KEY:"server-secret",RESEND_API_KEY:"transport-secret",C1_VERIFICATION_FROM:"c3 <connect@example.invalid>",C1_PUBLIC_ORIGIN:"https://example.invalid",C1_VERIFICATION_SIGNING_KEY:"s".repeat(48),C1_PASSAGE_ENABLED:"true"}
const candidate={name:"Synthetic",email:"synthetic@example.invalid",message:"Test",consent:true,attestation:true,participationIntention:true,connectAs:"individual"}
const states: Record<string,any>={
 capture_relational_candidate:{accepted:true,relationship_key:key,relationship_standing:"candidate_unverified",standing_created:false,current_created:false,persistence_created:false},
 issue_relational_verification:{accepted:true,relationship_key:key,challenge_key:"challenge_test",challenge_token:token,expires_at:new Date(Date.now()+1800000).toISOString(),standing_created:false,current_created:false,persistence_created:false},
 verify_relational_contact:{verified:true,relationship_key:key,relationship_standing:"candidate_contact_verified"},
 evaluate_relational_car:{accepted:true,relationship_key:key,env_key:ENV_KEY,car_state:"pass",relationship_state:"car_passed_candidate",next_permitted_encounter:"boundary"},
 evaluate_c1_relational_boundary:{accepted:true,relationship_key:key,env_key:ENV_KEY,boundary_result:{boundary_state:"pass",relationship_state:"boundary_passed_candidate",next_permitted_encounter:"registration"},notchazz_evaluation:{flag_count:0,final_disposition_authority:false}},
 register_and_persist_c1_relationship:{accepted:true,relationship_key:key,rrt_provenance_key:key,relationship_standing:"c1_C1_persisted",current_resolution:"C1",next_permitted_encounter:"c2_eligibility_review",current_created_as_separate_record:false,c2_created:false,public_release_created:false,registration_event_key:"event_test",persistence:{result:"recoverable_governed_state",persistence_key:ENV_KEY+":"+key}},
}
function harness(overrides:Record<string,any>={}) {
 const calls:string[]=[], requests:any[]=[]
 let deliveredLink=""
 const deps={now:()=>Date.now(),fetch:async (input:any,init:any)=>{
  const url=String(input), name=url.split("/").pop()!
  calls.push(name); requests.push({url,init,args:JSON.parse(init.body)})
  if (overrides[name] instanceof Error) throw overrides[name]
  if(name==="emails"){
   const body=JSON.parse(init.body); deliveredLink=body.text.split("\n\n")[1]
   assert.deepEqual(body.to,[candidate.email])
   return new Response(JSON.stringify(overrides[name] ?? {id:"delivery-test"}),{status:200})
  }
  assert.equal(init.headers.apikey,"server-secret")
  assert.equal(init.headers.authorization,"Bearer server-secret")
  return new Response(JSON.stringify(overrides[name] ?? states[name]),{status:200})
 }}
 return {calls,requests,deps,get proof(){return Object.fromEntries(new URLSearchParams(new URL(deliveredLink).hash.slice(1)))}}
}
test("capture issues challenge via transport only; callback alone completes exact sequence",async()=>{
 const h=harness()
 const r=await captureCandidate(candidate,env,h.deps), body:any=await r.json()
 assert.equal(r.status,202); assert.equal(body.standing,"verification_required");assert.equal(body.saved,false)
 assert.deepEqual(h.calls,["capture_relational_candidate","issue_relational_verification","emails"])
 assert.ok(!JSON.stringify(body).includes(token));assert.ok(!JSON.stringify(body).includes(key));assert.ok(!JSON.stringify(body).includes("secret"))
 const done=await verifyCandidate(h.proof,env,h.deps)
 assert.deepEqual(await done.json(),{standing:"connection_recorded",saved:true,message:"Your Connect relationship is confirmed and recorded."})
 assert.deepEqual(h.calls,["capture_relational_candidate","issue_relational_verification","emails","verify_relational_contact","evaluate_relational_car","evaluate_c1_relational_boundary","register_and_persist_c1_relationship"])
 assert.ok(h.requests.every(r=>!r.url.includes("c3_current") && !r.url.includes("c2")))
 for(const r of h.requests.filter(r=>["evaluate_relational_car","evaluate_c1_relational_boundary","register_and_persist_c1_relationship"].includes(r.url.split("/").pop()))) assert.equal(r.args.p_relationship_key,key)
})
for(const missing of ["RESEND_API_KEY","C1_VERIFICATION_FROM","C1_VERIFICATION_SIGNING_KEY","C1_PUBLIC_ORIGIN","SUPABASE_SERVICE_ROLE_KEY","C1_PASSAGE_ENABLED"]){
 test("missing "+missing+" stops before capture",async()=>{const h=harness();const r=await captureCandidate(candidate,{...env,[missing]:undefined},h.deps);assert.equal(r.status,409);assert.equal(h.calls.length,0)})
}
test("wrong project or malformed origin cannot receive privileged credentials",async()=>{
 for(const change of [{SUPABASE_URL:"https://other.invalid"},{C1_PUBLIC_ORIGIN:"https://example.invalid/path"}]){
  const h=harness();await captureCandidate(candidate,{...env,...change},h.deps);assert.equal(h.calls.length,0)
 }
})
for(const failure of ["capture_relational_candidate","issue_relational_verification","emails"]){
 test(failure+" network failure stops initial encounter without false success",async()=>{
  const h=harness({[failure]:new Error("secret must not leak")});const r=await captureCandidate(candidate,env,h.deps)
  assert.equal(r.status,409);const b:any=await r.json();assert.equal(b.saved,false)
  assert.equal(h.calls.at(-1),failure);assert.ok(!JSON.stringify(b).includes("secret"))
  assert.equal(b.candidate_saved,failure==="capture_relational_candidate"?null:true)
 })
}
for(const [name,value] of [
 ["verify_relational_contact",{verified:false}],
 ["evaluate_relational_car",{...states.evaluate_relational_car,car_state:"hold"}],
 ["evaluate_c1_relational_boundary",{...states.evaluate_c1_relational_boundary,boundary_result:{boundary_state:"hold"}}],
 ["register_and_persist_c1_relationship",{...states.register_and_persist_c1_relationship,persistence:{result:"held"}}],
] as const){
 test(name+" hold stops downstream effects",async()=>{
  const h=harness({[name]:value});await captureCandidate(candidate,env,h.deps)
  const r=await verifyCandidate(h.proof,env,h.deps);assert.equal(r.status,409);assert.equal((await r.json() as any).saved,false);assert.equal(h.calls.at(-1),name)
 })
}
for(const name of ["verify_relational_contact","evaluate_relational_car","evaluate_c1_relational_boundary","register_and_persist_c1_relationship"]){
 test(name+" network error cannot become success",async()=>{
  const h=harness({[name]:new Error("private error")});await captureCandidate(candidate,env,h.deps)
  const r=await verifyCandidate(h.proof,env,h.deps);assert.equal(r.status,409);assert.equal(h.calls.at(-1),name)
 })
}
test("expired or tampered signed receipt cannot invoke any callback RPC",async()=>{
 const h=harness();await captureCandidate(candidate,env,h.deps)
 const proof=h.proof, prior=h.calls.length
 for(const body of [{...proof,receipt:proof.receipt+"a"},{...proof,relationship_key:"invented"}]){
  assert.equal((await verifyCandidate(body,env,h.deps)).status,409)
 }
 assert.equal((await verifyCandidate(proof,env,{...h.deps,now:()=>Date.now()+3600000})).status,409)
 assert.equal(h.calls.length,prior)
})
test("wrong, expired, superseded or replayed token rejection never reaches CAR",async()=>{
 for(const rejected of [{verified:false},new Error("verification_challenge_expired"),new Error("active_verification_challenge_not_found")]){
  const h=harness({verify_relational_contact:rejected});await captureCandidate(candidate,env,h.deps)
  await verifyCandidate({...h.proof,token:"c".repeat(48)},env,h.deps)
  assert.equal(h.calls.at(-1),"verify_relational_contact")
 }
})
test("inconsistent persisted provenance cannot create participant success",async()=>{
 for(const change of [{rrt_provenance_key:"different"},{current_resolution:"C2"},{c2_created:true},{current_created_as_separate_record:true}]){
  const h=harness({register_and_persist_c1_relationship:{...states.register_and_persist_c1_relationship,...change}})
  await captureCandidate(candidate,env,h.deps);assert.equal((await verifyCandidate(h.proof,env,h.deps)).status,409)
 }
})
test("capture validates form and refuses client authority before network",async()=>{
 for(const body of [{...candidate,consent:false},{...candidate,contactVerified:true},{...candidate,email:"bad"}]){
  const r=await captureRoute({env,request:new Request("https://example.invalid/api/c3-community-connect-capture",{method:"POST",headers:{"content-type":"application/json",origin:"https://example.invalid"},body:JSON.stringify(body)})} as any)
  assert.equal(r.status,400)
 }
})
test("callback GET is inert and contains no token; POST rejects cross-origin and oversized body",async()=>{
 const get=await onRequestGet({} as any), html=await get.text()
 assert.ok(html.includes('button.addEventListener("click"'));assert.ok(html.includes('history.replaceState'))
 assert.ok(!html.includes(token));assert.equal(get.headers.get("referrer-policy"),"no-referrer")
 assert.ok(get.headers.get("content-security-policy")?.includes("frame-ancestors 'none'"))
 for(const [origin,body,status] of [["https://other.invalid","{}",409],["https://example.invalid","x".repeat(5000),413]] as const){
  const r=await verifyRoute({env,request:new Request("https://example.invalid/api/c3-community-connect-verify",{method:"POST",headers:{origin,"content-type":"application/json"},body})} as any)
  assert.equal(r.status,status)
 }
})
