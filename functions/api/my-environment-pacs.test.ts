import {test} from 'node:test'
import assert from 'node:assert/strict'
import {onRequestGet} from './my-environment-pacs'
test('owner notices use mutable authorization instead of stale immutable PAC metadata',async()=>{
 const original=globalThis.fetch
 globalThis.fetch=async(input,init)=>{
  const u=new URL(String(input))
  if(u.pathname.endsWith('c3_env_runtime_session'))return Response.json([{session_key:'session',env_key:'env',envpac_key:'ep',subject_key:'owner',subject_type:'individual',expires_at:'2099-01-01T00:00:00Z'}])
  if(u.pathname.endsWith('c3_envpac_access_grant'))return Response.json([{grant_key:'owner',standing:'active',scope:{withdrawn_pac_projections:['withdrawn']}}])
  if(u.pathname.endsWith('c3_pac'))return Response.json(['withdrawn','unaffected'].map(pac_key=>({pac_key,pac_type:'ProfilePAC',metadata:{ownership_model:{owner_subject_type:'individual',owner_subject_key:'owner'},custody_model:{custody_class:'personal_pac_custody'},encounter_projection:{standing:'AUTHORIZED',authorized_by_owner:true,presentation_scope:'c3field_plus_canopy',surface_projections:['c3field','canopy']}}})))
  if(u.pathname.endsWith('c3_pac_review_candidate_v1'))return Response.json({snapshot_hash:'a'.repeat(64)})
  throw Error('unexpected route')
 }
 try{
  const response=await onRequestGet({request:new Request('https://my.c3field.online/api/my-environment-pacs',{headers:{cookie:'c3_env_session='+'a'.repeat(64)}}),env:{SUPABASE_URL:'https://registry.invalid',SUPABASE_SERVICE_ROLE_KEY:'fixture'}} as never)
  assert.equal(response.status,200);const result=await response.json() as any
  assert.equal(result.pacs[0].encounter_projection.standing,'REVOKED')
  assert.equal(result.pacs[0].encounter_projection.authorized_by_owner,false)
  assert.deepEqual(result.pacs[0].encounter_projection.surface_projections,[])
  assert.equal(result.pacs[1].encounter_projection.authorized_by_owner,true)
 }finally{globalThis.fetch=original}
})
