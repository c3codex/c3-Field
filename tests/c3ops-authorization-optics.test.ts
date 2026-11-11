import assert from 'node:assert/strict'
import {test} from 'node:test'
import {readAuthorizationOptics,validateAuthorizationOptics} from '../functions/_lib/c3ops-authorization-optics'
import {handleRead} from '../functions/api/c3ops/manifest'

const snapshot={
 contract:'c3ops_authorization_optics_v1',observed_at:'2026-11-11T21:05:34Z',
 environment:'env_c3ops',operator:'op044',
 grant:{key:'grant_op044_c3ops_031_read_preflight',standing:'EFFECTIVE',
 recorded_standing:'active',expires_at:'2026-11-12T00:00:00Z',
 rights:['inspect_governed_status','read_preflight_evidence'],revoked:false},
 requests:[{request_id:'ea077812-83fd-4176-9a85-4a28677a1a8a',requested_at:'2026-11-11T21:04:22Z',
 request_standing:'REQUESTED',request_expires_at:'2026-11-11T21:19:22Z',
 disposition:'READ_PREFLIGHT_CONFIRMED',qualified_at:'2026-11-11T21:04:22Z',
 disposition_expires_at:'2026-11-11T21:19:22Z',currently_effective:true,
 registrar_execution_authorized:false,workroom_admission_authorized:false}],
 execution_authority:false,mutation_authority:false,workroom_admission_authority:false
} as const

test('authorization Optics accepts only narrowly scoped record projections',()=>{
 assert.equal(validateAuthorizationOptics(snapshot).requests.length,1)
 for(const change of [
  {...snapshot,mutation_authority:true},
  {...snapshot,workroom_admission_authority:true},
  {...snapshot,requests:[{...snapshot.requests[0],registrar_execution_authorized:true}]},
  {...snapshot,grant:{...snapshot.grant,rights:['general_operations','read_preflight_evidence']}},
  {...snapshot,requests:[snapshot.requests[0],snapshot.requests[0]]},
 ]){
  assert.throws(()=>validateAuthorizationOptics(change),/HLD/)
 }
})
test('authorization reader uses service-only RPC with POST and never requests raw tables',async()=>{
 const calls:string[]=[]
 const reader=async(url:RequestInfo|URL,options?:RequestInit)=>{
  calls.push(String(url))
  assert.equal(options?.method,'POST')
  assert.equal(options?.body,'{}')
  assert.equal((options?.headers as Record<string,string>)?.authorization,'Bearer fixture-key')
  return Response.json(snapshot)
 }
 const output=await readAuthorizationOptics({SUPABASE_URL:'https://fixture.invalid',SUPABASE_SERVICE_ROLE_KEY:'fixture-key'},reader as typeof fetch)
 assert.equal(output.contract,'c3ops_authorization_optics_v1')
 assert.deepEqual(calls,['https://fixture.invalid/rest/v1/rpc/c3ops_authorization_optics_read_v1'])
})
test('optics reader fails closed without server credentials',async()=>{
 await assert.rejects(readAuthorizationOptics({}),/HLD/)
})
test('authorization optics view stays host-bound and operator-guarded',async()=>{
 const other=await handleRead(new Request('https://c3field.online/api/c3ops/manifest?view=authorizations'),{})
 assert.equal(other.status,404)
 const missing=await handleRead(new Request('https://c3ops.c3field.online/api/c3ops/manifest?view=authorizations'),{})
 assert.equal(missing.status,401)
 const invalid=await handleRead(new Request('https://c3ops.c3field.online/api/c3ops/manifest?view=authorizations&env_key=other'),{})
 assert.equal(invalid.status,403)
})
