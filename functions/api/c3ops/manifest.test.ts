import assert from "node:assert/strict"
import test from "node:test"
import { resolveMEEnvironments, readLapzuli, readC3OpsCurrentState, type ReadRows } from "../../_lib/me-environment"
import { handleRead, createRegistryReader } from "./manifest"
import { onRequest as middleware } from "../../_middleware"
import { c3OpsRoute, isC3OpsHost } from "../../../src/c3ops/c3OpsRoutes"

const c2={env_key:"env_c3_community_contribute",system_key:"c3_field",environment_name:"c2ME_env",environment_class:"c2_contribute_environment",standing:"governed_environment",is_active:true,is_canonical:true,source_authority_ref:"operator",metadata:{standing:"FORMED",runtime_activation_state:"held",primary_email:"PRIVATE",token:"SECRET"}}
const fixture: ReadRows=async table=>table==="c3_environment"?[c2]:[]

test("formed c2 does not manufacture Result, Current or c1 relationship",async()=>{
 const result=await resolveMEEnvironments(fixture)
 const e=result.environments[0]
 assert.equal(e.formation,"FORMED");assert.equal(e.canonical,true)
 assert.equal(e.current.status,"unresolved_no_registered_relation")
 assert.equal(e.contribution.result,null);assert.equal(e.c1.records.length,0)
 assert.equal(e.c2.records[0].env_key,c2.env_key)
 assert.equal(e.mutation_authority,false)
 assert.ok(e.unresolved.some(x=>x.startsWith("Boundary:")))
 assert.doesNotMatch(JSON.stringify(result),/PRIVATE|SECRET|primary_email|token/)
})
test("Current evidence is joined by explicit Current key and preserved",async()=>{
 const calls:unknown[]=[]
 const read:ReadRows=async(table,select,filters)=>{
  calls.push({table,filters})
  if(table==="c3_environment") return [{...c2,env_key:"c1",environment_class:"c1_connect_environment"}]
  if(table==="c3_current_state") return [{current_state_key:"cur1",standing:"governed_environment"}]
  if(table==="c3_current_evidence_ref") return [{evidence_key:"proof1",current_state_key:"cur1"}]
  return []
 }
 const e=(await resolveMEEnvironments(read)).environments[0]
 assert.equal(e.current.records[0].current_state_key,"cur1")
 assert.equal(e.evidence.records[0].evidence_key,"proof1")
 assert.ok(calls.some((c:any)=>c.table==="c3_current_evidence_ref"&&c.filters.current_state_key==="eq.cur1"))
})
test("read failure cannot masquerade as complete coverage",async()=>{
 const r=await resolveMEEnvironments(async(table)=>{if(table==="c3_environment")return[c2];throw Error("private database detail")})
 assert.ok(r.environments[0].read_errors.includes("c3_current_state"))
 assert.doesNotMatch(JSON.stringify(r),/private database detail/)
})
test("route evidence preserves history without turning publication into Current",async()=>{
 const r=await readLapzuli(async table=>table==="lapzuli_route"?[{route_key:"r1"}]:[{route_key:"r1",observed_outcome:"held"},{route_key:"r1",observed_outcome:"published",external_id:"p1"}])
 assert.equal(r.evidence.length,2)
 assert.equal(r.current_status,"unresolved_without_explicit_current_relation")
 assert.equal(r.mutation_authority,false)
})
test("current state projection resolves only its six registered authority groups",async()=>{
 const calls:{table:string,filters?:Record<string,string>}[]=[]
 const read:ReadRows=async(table,_select,filters)=>{
  calls.push({table,filters})
  if(table==="system_process_registry") return [{process_key:filters?.process_key?.replace("eq.",""),status:"active",process_status:"active",authority_state:"registered"}]
  if(table==="c3_current_state") return [{current_state_key:"current_env_c3ops_v1",env_key:"env_c3ops",standing:"governed_environment",is_current:true}]
  if(table==="c3_optics_observation") return [{observation_key:"optics432:operational_proof:c3_system_baseline_v1",standing:"HLD"}]
  return []
 }
 const r=await readC3OpsCurrentState(read)
 assert.deepEqual(r.components.map(c=>c.key),["prism","lapzuli","optics","c3_model","current","chazz"])
 assert.equal(r.mutation_authority,false);assert.equal(r.external_effects,0)
 assert.equal(r.standing_definitions.ACT,"Accrued Current Trace")
 assert.ok(calls.some(c=>c.table==="c3_current_state"&&c.filters?.env_key==="eq.env_c3ops"&&c.filters?.is_current==="eq.true"))
 assert.ok(calls.some(c=>c.table==="system_process_registry"&&c.filters?.process_key==="eq.prism_publication_operations_v1"))
 assert.ok(calls.some(c=>c.table==="system_process_registry"&&c.filters?.process_key==="eq.lapzuli_distribution"))
 assert.ok(calls.some(c=>c.table==="system_process_registry"&&c.filters?.process_key==="eq.minimum_governed_standard_v1"))
 assert.ok(calls.some(c=>c.table==="system_process_registry"&&c.filters?.process_key==="eq.c3ops_role_call_computational_skills_v1"))
})
test("absent required environments are gaps, never invented rows",async()=>{
 const r=await resolveMEEnvironments(async()=>[])
 assert.equal(r.environments.length,0)
 assert.ok(r.missing_environments.includes("env_c3_community_contribute"))
})
test("the c3Ops API does not introduce a surface on unrelated hosts",async()=>{
 assert.equal((await handleRead(new Request("https://measuresregistry.com/api/c3ops/manifest"),{})).status,404)
})
test("write methods are rejected before any Registry access",async()=>{
 for(const method of ["POST","PUT","PATCH","DELETE"]){
  const response=await handleRead(new Request("https://c3ops.c3field.online/api/c3ops/manifest",{method}),{})
  assert.equal(response.status,405)
 }
})
test("invalid env filters and missing configuration fail closed",async()=>{
 assert.equal((await handleRead(new Request("https://c3ops.c3field.online/api/c3ops/manifest?env_key=x%26or=evil"),{})).status,400)
 const r=await handleRead(new Request("https://c3ops.c3field.online/api/c3ops/manifest"),{})
 assert.equal(r.status,503);assert.match(r.headers.get("cache-control")! ,/no-store/)
})
test("pagination reads every page using GET and rejects upstream errors",async()=>{
 const original=globalThis.fetch
 let count=0
 globalThis.fetch=(async(_url,init)=>{assert.equal(init?.method,undefined); count++;return Response.json(count===1?Array.from({length:500},(_,i)=>({i})):[{i:500}])}) as typeof fetch
 try {assert.equal((await createRegistryReader({SUPABASE_URL:"https://fixture.invalid",SUPABASE_SERVICE_ROLE_KEY:"test"})("c3_environment","env_key")).length,501)} finally {globalThis.fetch=original}
})
test("all new private surfaces require existing operator authorization",async()=>{
 for(const path of ["/systems-access","/c3optics","/relational-operations/lapzuli","/api/c3ops/manifest"]){
  let accessed=false
  const result=await middleware({request:new Request("https://c3ops.c3field.online"+path),env:{OPERATOR_DISPATCH_KEY:"test"},next:async()=>{accessed=true;return new Response("private")}} as never)
  assert.equal(accessed,false);assert.ok([401,403].includes(result.status))
 }
})
test("authenticated operator read is private and unrelated hosts retain routes",async()=>{
 let count=0
 const result=await middleware({request:new Request("https://c3ops.c3field.online/api/c3ops/manifest",{headers:{"x-operator-dispatch-key":"test"}}),env:{OPERATOR_DISPATCH_KEY:"test"},next:async()=>{count++;return new Response("ok")}} as never)
 assert.equal(count,1);assert.equal(result.status,200);assert.match(result.headers.get("cache-control")!,/private/)
 assert.equal(isC3OpsHost("c3field.online"),false);assert.equal(isC3OpsHost("measuresregistry.com"),false);assert.equal(isC3OpsHost("c3op.c3field.online"),false)
 assert.equal(isC3OpsHost("c3ops.c3field.online"),true)
 assert.equal(c3OpsRoute("/systems-access/"),"/systems-access");assert.equal(c3OpsRoute("/unknown"),null)
})
