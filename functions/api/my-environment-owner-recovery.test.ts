import {test} from 'node:test'
import assert from 'node:assert/strict'
import {signedOwnerClaim,requestEnvironmentAccessLink,readOwnerClaim} from '../_lib/c1-passage'
import {onRequestPost} from './my-environment-owner-recovery'
const owner={relationshipKey:'crs_'+'a'.repeat(32),envKey:'env_person_'+'b'.repeat(24),envpacKey:'c3envpac_person_'+'b'.repeat(24)+'_v0_1'}
const env={SUPABASE_URL:'https://registry.invalid',SUPABASE_SERVICE_ROLE_KEY:'fixture',C1_VERIFICATION_SIGNING_KEY:'fixture-signing-key-'.repeat(3)}
const call=(body:unknown,origin='https://my.c3field.online')=>onRequestPost({env,request:new Request('https://my.c3field.online/api/my-environment-owner-recovery',{method:'POST',headers:{'content-type':'application/json',origin},body:JSON.stringify(body)})} as never)
test('retained manifest recovery uses signed owner context without active participation and cannot restore authority',async()=>{
 const original=globalThis.fetch;const requests:string[]=[]
 globalThis.fetch=async input=>{requests.push(String(input));return Response.json([{receipt_key:'retained',portable_manifest:{owned_pacs:['owner-a']},manifest_sha256:'a'.repeat(64)}])}
 try{
  const claim=await signedOwnerClaim(owner.relationshipKey,owner.envKey,owner.envpacKey,env)
  const response=await call({claim,relationship_key:'other-owner',envpac_key:'other-env'})
  assert.equal(response.status,200);const result=await response.json() as any
  assert.equal(result.participation_restored,false);assert.equal(result.projection_authorized,false)
  assert.equal(response.headers.get('set-cookie'),null)
  assert.equal(requests.length,1);const query=new URL(requests[0]).searchParams
  assert.equal(query.get('relationship_key'),'eq.'+owner.relationshipKey);assert.equal(query.get('envpac_key'),'eq.'+owner.envpacKey)
  assert.equal(query.get('action'),'eq.terminate')
 }finally{globalThis.fetch=original}
})
test('tampered expired and cross-origin recovery cannot read retained records',async()=>{
 const original=globalThis.fetch;let calls=0;globalThis.fetch=async()=>{calls++;return Response.json([])}
 try{
  const claim=await signedOwnerClaim(owner.relationshipKey,owner.envKey,owner.envpacKey,env)
  assert.equal((await call({claim:claim+'x'})).status,401)
  const expired=await signedOwnerClaim(owner.relationshipKey,owner.envKey,owner.envpacKey,env,Date.now()-9*3600000)
  assert.equal((await call({claim:expired})).status,401)
  assert.equal((await call({claim},'https://other.invalid')).status,403)
  assert.equal(calls,0)
 }finally{globalThis.fetch=original}
})
test('absent retained receipt is not successful recovery',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async()=>Response.json([])
 try{const claim=await signedOwnerClaim(owner.relationshipKey,owner.envKey,owner.envpacKey,env);assert.equal((await call({claim})).status,403)}finally{globalThis.fetch=original}
})

test('fresh retired-owner recovery is sent only to the retained identity and does not reopen participation',async()=>{
 const sent:any[]=[];const calls:string[]=[]
 const fullEnv={...env,SUPABASE_URL:'https://zfihrspxvennjzazxcbj.supabase.co',C1_PASSAGE_ENABLED:'true',C1_PUBLIC_ORIGIN:'https://c3field.online',C3_RESEND_API_KEY:'fixture-mail',C1_VERIFICATION_FROM:'fixture@example.invalid'}
 const deps={now:()=>Date.now(),fetch:(async(input,init)=>{
  const url=new URL(String(input));calls.push(url.pathname)
  if(url.pathname.endsWith('resolve_c1_owner_reentry'))return Response.json({accepted:false})
  if(url.pathname.endsWith('crs_relationship'))return Response.json([{relationship_key:owner.relationshipKey,primary_email:'retired@example.invalid'}])
  if(url.pathname.endsWith('c3_my_env_owner_lifecycle_receipt'))return Response.json([{relationship_key:owner.relationshipKey,env_key:owner.envKey,envpac_key:owner.envpacKey}])
  if(url.host==='api.resend.com'){sent.push(JSON.parse(String(init?.body)));return Response.json({id:'fixture-message'})}
  throw Error('unexpected recovery effect')
 }) as typeof fetch}
 const response=await requestEnvironmentAccessLink('retired@example.invalid',fullEnv,deps)
 assert.equal(response.status,202);assert.equal(sent.length,1)
 assert.deepEqual(sent[0].to,['retired@example.invalid'])
 const link=sent[0].text.match(/https:\/\/\S+/)[0];const claim=new URLSearchParams(new URL(link).hash.slice(1)).get('claim')!
 assert.equal((await readOwnerClaim(claim,fullEnv)).relationshipKey,owner.relationshipKey)
 assert.match(link,/owner-recovery/)
 assert.equal(calls.some(path=>/form_c1|register_and_persist|c3_env_runtime_session/.test(path)),false)
})
