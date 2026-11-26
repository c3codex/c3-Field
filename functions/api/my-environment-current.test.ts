import assert from 'node:assert/strict'
import {test} from 'node:test'
import {onRequestGet} from './my-environment-current'
const env={SUPABASE_URL:'https://registry.invalid',SUPABASE_SERVICE_ROLE_KEY:'synthetic-test-key'}
const request=()=>new Request('https://my.c3field.online/api/my-environment-current',{headers:{cookie:'c3_env_session='+'a'.repeat(64)}})
function mock(mismatch=false,revoked=false){return async(input:RequestInfo|URL)=>{
  const url=String(input)
  if(url.includes('/c3_env_runtime_session?'))return Response.json([{env_key:'owner-env',envpac_key:'owner-pac',subject_type:'individual',subject_key:'owner',expires_at:'2099-01-01T00:00:00Z'}])
  if(url.includes('/c3_envpac_access_grant?'))return Response.json(revoked?[]:[{grant_key:'owner-grant'}])
  if(url.endsWith('/rpc/resolve_c1me_current_tokens_internal'))return Response.json({CURRENT_resolution:'resolved',relationship_ref:'owner',env_key:mismatch?'other-env':'owner-env',envpac_ref:'owner-pac',current_ref:'current',tokens:[{current_token_key:'retained'}],accruals:[{accrual_key:'existing',evidence_ref:'immutable-evidence'}]})
  throw Error('unexpected runtime read')
}}
test('ordinary participant CURRENT exposes existing accruals without operational authorization',async()=>{const original=globalThis.fetch;globalThis.fetch=mock();try{const response=await onRequestGet({request:request(),env} as never);assert.equal(response.status,200);const body=await response.json() as any;assert.equal(body.accrual_count,1);assert.equal(body.accruals[0].accrual_key,'existing');assert.equal(body.token_count,1);assert.equal(body.authority_created,false)}finally{globalThis.fetch=original}})
test('cross-environment resolver response is held without exposing history',async()=>{const original=globalThis.fetch;globalThis.fetch=mock(true);try{const response=await onRequestGet({request:request(),env} as never);assert.equal(response.status,409);const body=await response.json() as any;assert.equal(body.reason,'current_environment_mismatch');assert.equal(body.accruals,undefined);assert.equal(body.tokens,undefined)}finally{globalThis.fetch=original}})
test('missing session and withdrawn owner access do not resolve CURRENT',async()=>{assert.equal((await onRequestGet({request:new Request(request().url),env} as never)).status,401);const original=globalThis.fetch;globalThis.fetch=mock(false,true);try{const response=await onRequestGet({request:request(),env} as never);const body=await response.json() as any;assert.equal(body.standing,'CURRENT_held');assert.equal(body.accruals,undefined)}finally{globalThis.fetch=original}})
