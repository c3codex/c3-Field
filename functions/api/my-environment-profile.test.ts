import test from 'node:test'
import assert from 'node:assert/strict'
import {onRequestPost} from './my-environment-profile'

test('profile writes forward only the authenticated server session and derive owner identity',async t=>{
 const token='a'.repeat(64),writes:string[]=[]
 t.mock.method(globalThis,'fetch',async(input:URL|string,init?:RequestInit)=>{
  const u=new URL(String(input))
  if(u.pathname.endsWith('c3_env_runtime_session'))return Response.json([{session_key:'session',env_key:'env',envpac_key:'ep',subject_key:'owner',subject_type:'individual',expires_at:'2099-01-01T00:00:00Z'}])
  if(u.pathname.endsWith('c3_envpac_access_grant'))return Response.json([{grant_key:'owner',standing:'active'}])
  if(u.pathname.includes('/rpc/')){
   assert.equal(new Headers(init?.headers).get('x-c3-owner-session'),token)
   const body=JSON.parse(String(init?.body))
   assert.equal(body.p_subject_key,'owner');assert.equal(body.p_envpac_key,'ep')
   writes.push(u.pathname)
   return Response.json({ok:true,created:true,updated:true})
  }
  throw Error('unexpected route')
 })
 const response=await onRequestPost({request:new Request('https://my.c3field.online/api/my-environment-profile',{
  method:'POST',headers:{cookie:'c3_env_session='+token,'content-type':'application/json','x-c3-owner-session':'forged'},
  body:JSON.stringify({p_subject_key:'forged-owner',fields:{display_label:'Owner',visibility_scope:'private'}})
 }),env:{SUPABASE_URL:'https://registry.invalid',SUPABASE_SERVICE_ROLE_KEY:'fixture'}} as never)
 assert.equal(response.status,201)
 assert.deepEqual(writes,['/rest/v1/rpc/form_profile_pac_v1_internal','/rest/v1/rpc/update_profile_pac_personalization_internal'])
 assert.equal((await response.text()).includes(token),false)
})
