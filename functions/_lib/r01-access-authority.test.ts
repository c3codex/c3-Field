import {test} from 'node:test'
import assert from 'node:assert/strict'
import {resolveEnvironmentSession,resolveScopedEnvironmentSession} from './env-session'
import {handleRead} from '../api/c3ops/manifest'

const env={SUPABASE_URL:'https://fixture.invalid',SUPABASE_SERVICE_ROLE_KEY:'synthetic_service',OPERATOR_DISPATCH_KEY:'synthetic_operator'}
const token='a'.repeat(64)
function sessionFixture(overrides:Record<string,unknown>={},grantOverrides:Record<string,unknown>={}){
  const calls:Array<{url:URL,method:string}>=[]
  const row={session_key:'synthetic_session',envpac_key:'owner_a',env_key:'env_a',subject_type:'individual',subject_key:'subject_a',standing:'active',expires_at:new Date(Date.now()+3600000).toISOString(),revoked_at:null,...overrides}
  const grant={grant_key:'synthetic_owner',envpac_key:'owner_a',subject_key:'subject_a',relation_role:'owner',standing:'active',expires_at:new Date(Date.now()+3600000).toISOString(),revoked_at:null,...grantOverrides}
  const fetch=async(input:RequestInfo|URL,init?:RequestInit)=>{
    const url=new URL(String(input)),method=init?.method??'GET';assert.equal(url.hostname,'fixture.invalid','Live/provider calls forbidden');calls.push({url,method})
    if(method==='PATCH')return new Response(null,{status:204})
    if(url.pathname.endsWith('c3_env_runtime_session'))return Response.json(row.revoked_at?[]:[row])
    if(url.pathname.endsWith('c3_envpac_access_grant')){
      assert.equal(url.searchParams.get('subject_key'),'eq.subject_a');assert.equal(url.searchParams.get('envpac_key'),'eq.owner_a');assert.equal(url.searchParams.get('revoked_at'),'is.null')
      return Response.json(grant.revoked_at||grant.standing!=='active'?[]:[grant])
    }
    throw Error('Unexpected fixture path')
  }
  return {calls,fetch}
}
test('owner read is read-only and binds exact owner/environment grant filters',async()=>{
  const f=sessionFixture(),old=globalThis.fetch;globalThis.fetch=f.fetch as typeof fetch
  try{const session=await resolveEnvironmentSession(token,env);assert.equal(session.subjectKey,'subject_a');assert.equal(session.envpacKey,'owner_a');assert.equal(f.calls.length,2);assert.ok(f.calls.every(c=>c.method==='GET'))}finally{globalThis.fetch=old}
})
test('expired or malformed session/grant and revoked ownership fail closed',async()=>{
  for(const [session,grant]of [[{expires_at:'invalid'},{}],[{expires_at:'2000-01-01T00:00:00Z'},{}],[{revoked_at:'2026-01-01'},{}],[{},{expires_at:'invalid'}],[{},{expires_at:'2000-01-01T00:00:00Z'}],[{},{revoked_at:'2026-01-01'}]]){
    const f=sessionFixture(session,grant),old=globalThis.fetch;globalThis.fetch=f.fetch as typeof fetch
    try{await assert.rejects(resolveEnvironmentSession(token,env));assert.ok(f.calls.every(c=>c.method==='GET'))}finally{globalThis.fetch=old}
  }
})
test('read-side telemetry requires explicit internal opt-in',async()=>{
  const f=sessionFixture(),old=globalThis.fetch;globalThis.fetch=f.fetch as typeof fetch
  try{await resolveEnvironmentSession(token,env,{touchLastSeen:true});assert.equal(f.calls.filter(c=>c.method==='PATCH').length,1)}finally{globalThis.fetch=old}
})
test('existing scoped session is read-only and rejects wrong owner target or malformed expiry',async()=>{
  const expected={envKey:'env_a',envpacKey:'owner_a',relationRole:'consumer',initiativeKey:'fixture_initiative'}
  for(const [overrides,shouldPass]of [[{},true],[{expires_at:'invalid'},false],[{envpac_key:'owner_b'},false]] as const){
    const f=sessionFixture({metadata:{session_class:'initiative_c2_consumer',relation_role:'consumer',initiative_key:'fixture_initiative'},evidence_ref:'synthetic_owner',...overrides},{scope:{initiative_key:'fixture_initiative'}}),old=globalThis.fetch;globalThis.fetch=f.fetch as typeof fetch
    try{if(shouldPass)assert.equal((await resolveScopedEnvironmentSession(token,env,expected)).envpacKey,'owner_a');else await assert.rejects(resolveScopedEnvironmentSession(token,env,expected));assert.ok(f.calls.every(c=>c.method==='GET'))}finally{globalThis.fetch=old}
  }
})
test('manifest direct invocation preserves existing Operator boundary before any Registry read or action',async()=>{
  const old=globalThis.fetch;let calls=0;globalThis.fetch=(async()=>{calls++;throw Error('No reads allowed')}) as typeof fetch
  try{for(const url of ['https://c3ops.c3field.online/api/c3ops/manifest?view=lapzuli','https://c3ops.c3field.online/api/c3ops/manifest?view=current_state','https://c3ops.c3field.online/api/c3ops/manifest?view=lapzuli_free&route_key=fixture']){
    assert.equal((await handleRead(new Request(url),env)).status,403)
    assert.equal((await handleRead(new Request(url,{headers:{'x-operator-dispatch-key':'forged'}}),env)).status,403)
  }assert.equal((await handleRead(new Request('https://c3ops.c3field.online/api/c3ops/manifest?view=lapzuli_action',{method:'POST',body:'{}'}),env)).status,403);assert.equal(calls,0)}finally{globalThis.fetch=old}
})
test('authorized existing Operator projection remains read-only with no new public authority',async()=>{
  const old=globalThis.fetch,calls:string[]=[];globalThis.fetch=(async(input,init)=>{const url=new URL(String(input));assert.equal(url.hostname,'fixture.invalid');assert.equal(init?.method??'GET','GET');calls.push(url.pathname);return Response.json([])}) as typeof fetch
  try{const r=await handleRead(new Request('https://c3ops.c3field.online/api/c3ops/manifest?view=lapzuli',{headers:{'x-operator-dispatch-key':'synthetic_operator'}}),env);assert.equal(r.status,200);assert.match(r.headers.get('cache-control')!,/private/);assert.ok(calls.some(x=>x.endsWith('/c3ops_publication_object')))}finally{globalThis.fetch=old}
})
