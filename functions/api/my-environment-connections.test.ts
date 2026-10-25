import {test} from 'node:test'
import assert from 'node:assert/strict'
import {onRequestGet,onRequestPost} from './my-environment-connections'

const owner={subject:'fixture_owner_a',env:'fixture_env_a',envpac:'fixture_envpac_a',token:'a'.repeat(64)}
const env={SUPABASE_URL:'https://fixture.invalid',SUPABASE_SERVICE_ROLE_KEY:'synthetic_only'}
function fixture(options:{lostInsertResponse?:boolean;expireOnRecheck?:boolean;existing?:boolean}={}){
 const calls:Array<{name:string;method:string;url:URL;body:any}>=[]
 let sessionReads=0,inserted=0
 let thread:any=options.existing?row():null
 function row(){return {thread_key:'connections:'+owner.env,env_key:owner.env,envpac_key:owner.envpac,owner_relationship_key:owner.subject,title:'Connections',standing:'active',visibility:'owner_private',metadata:{source:'native_connection_projection',thread_is_authority:false,thread_is_relationship_registry:false}}}
 const fetch:typeof globalThis.fetch=async(input,init)=>{
  const url=new URL(String(input)),method=init?.method||'GET',name=url.pathname.replace('/rest/v1/',''),body=init?.body?JSON.parse(String(init.body)):null
  assert.equal(url.hostname,'fixture.invalid','Provider/other network forbidden');calls.push({name,method,url,body})
  if(name==='c3_env_runtime_session'){sessionReads++;return Response.json(options.expireOnRecheck&&sessionReads>1?[]:[{session_key:'fixture_session',env_key:owner.env,envpac_key:owner.envpac,subject_type:'individual',subject_key:owner.subject,expires_at:'2099-01-01',revoked_at:null}])}
  if(name==='c3_envpac_access_grant')return Response.json([{grant_key:'fixture_grant',subject_type:'individual',subject_key:owner.subject,relation_role:'owner',expires_at:'2099-01-01',revoked_at:null}])
  if(name==='rpc/resolve_c1me_current_internal')return Response.json({resolution:'existing_c1',relationship_ref:owner.subject,env_key:owner.env,envpac_ref:owner.envpac,current_ref:'fixture_current'})
  if(name==='c3_envpac')return Response.json([{env_key:owner.env,envpac_key:owner.envpac}])
  if(name==='c3_envpac_capability_grant')return Response.json([])
  if(name==='c3_environment')return Response.json([{environment_class:'fixture',standing:'fixture'}])
  if(name==='crs_consent')return Response.json([{consent_scope:'c1_connect_relationship'}])
  if(name==='system_process_registry')return Response.json([{process_key:'minimum_governed_standard_v1'}])
  if(name==='measures_registry')return Response.json([{metadata:{version:'v0.1',record_class:'target_bound_mgs',target_class:'c1ME.env',standing:'operative',registration_standing:'registered'}}])
  if(name==='measures_persistence_state')return Response.json(url.searchParams.get('object_type')==='eq.minimum_governed_standard_binding'?[{governed_state:{mgs_key:'fixture_mgs',mgs_version:'v0.1',target_env_key:owner.env,target_envpac_key:owner.envpac,scope_match:true,unresolved_holds:[]}}]:[{persistence_key:'fixture_evaluation',governed_state:{result:'minimum_governed_standard_satisfied',mgs_key:'fixture_mgs',mgs_version:'v0.1',target_env_key:owner.env,target_envpac_key:owner.envpac,subject_key:owner.subject,applicable_role:'owner',mgs_target_class:'c1ME.env',target_registry_environment_class:'fixture',environment_standing:'fixture',owner_grant_resolved:true,active_capability_count:0,consent_resolved:true,formal_mgs_satisfaction_created:true},evidence:{current_binding:'fixture_binding'}}])
  if(name==='c1_environment_connection_thread'){
   if(method==='GET')return Response.json(thread?[thread]:[])
   assert.equal(method,'POST');assert.equal(url.searchParams.get('on_conflict'),'thread_key');assert.match(String((init?.headers as any)?.prefer),/resolution=ignore-duplicates/)
   if(thread)return Response.json([])
   inserted++;thread={...row(),...body};if(options.lostInsertResponse)throw Error('synthetic response lost after commit')
   return Response.json([thread])
  }
  if(name==='c1_environment_connection_thread_entry'&&method==='POST')return Response.json([{entry_key:'fixture_note',...body}])
  if(name==='rpc/register_cancom_device_key_internal')return Response.json({standing:'device_ready',device_key:body.p_device_key})
  if(['c1_environment_connection_thread_entry','c3_env_native_connection','c3_env_initiative_visibility'].includes(name))return Response.json([])
  throw Error('Unexpected fixture request '+name)
 }
 return {calls,fetch,get inserted(){return inserted}}
}
function request(body?:any,origin:string|null='https://c3field.online'){
 return new Request('https://c3field.online/api/my-environment-connections',{method:body?'POST':'GET',headers:{cookie:'c3_env_session='+owner.token,'content-type':'application/json',...(origin?{origin}:{})},...(body?{body:JSON.stringify(body)}:{})})
}
async function using(f:ReturnType<typeof fixture>,fn:()=>Promise<void>){const old=globalThis.fetch;globalThis.fetch=f.fetch;try{await fn()}finally{globalThis.fetch=old}}
test('first GET is read-only and existing native-private thread retains normal projection',async()=>{
 for(const existing of [false,true]){const f=fixture({existing});await using(f,async()=>{const r=await onRequestGet({request:request(),env} as any);assert.equal(r.status,200);const body=await r.json() as any;assert.equal(body.standing,existing?'connections_ready':'thread_not_initialized');assert.equal(f.inserted,0);assert.ok(f.calls.every(c=>c.method==='GET'||c.name==='rpc/resolve_c1me_current_internal'))})}
})
test('explicit owner POST inserts once and verified retry reports zero',async()=>{const f=fixture();await using(f,async()=>{const a=await onRequestPost({request:request({action:'ensure_owner_private_connections_thread'}),env} as any);assert.equal(a.status,201);assert.equal((await a.json() as any).inserted_row_count,1);const b=await onRequestPost({request:request({action:'ensure_owner_private_connections_thread'}),env} as any);assert.equal(b.status,200);assert.equal((await b.json() as any).inserted_row_count,0);assert.equal(f.inserted,1)})})
test('lost insert response remains held even when matching row appears; never invent zero effect',async()=>{const f=fixture({lostInsertResponse:true});await using(f,async()=>{const r=await onRequestPost({request:request({action:'ensure_owner_private_connections_thread'}),env} as any);assert.equal(r.status,409);const body=await r.json() as any;assert.equal(body.reason,'connections_initialization_effect_unverified');assert.equal('inserted_row_count' in body,false);assert.equal(f.inserted,1)})})
test('expired session at effect-time recheck refuses initialization',async()=>{const f=fixture({expireOnRecheck:true});await using(f,async()=>{const r=await onRequestPost({request:request({action:'ensure_owner_private_connections_thread'}),env} as any);assert.equal(r.status,401);assert.equal(f.inserted,0)})})
test('missing origin and user supplied target claims cannot initialize',async()=>{for(const [body,origin]of [[{action:'ensure_owner_private_connections_thread'},null],[{action:'ensure_owner_private_connections_thread',env_key:'foreign'},'https://c3field.online']] as const){const f=fixture();await using(f,async()=>{const r=await onRequestPost({request:request(body,origin),env} as any);assert.ok(r.status===400||r.status===403);assert.equal(f.inserted,0)})}})
test('existing private note action remains functional but never lazily initializes a missing thread',async()=>{for(const existing of [false,true]){const f=fixture({existing});await using(f,async()=>{const r=await onRequestPost({request:request({action:'add_note',entry_type:'note',body:'Synthetic note'}),env} as any);assert.equal(r.status,existing?200:409);assert.equal(f.inserted,0);assert.equal(f.calls.filter(c=>c.name==='c1_environment_connection_thread_entry'&&c.method==='POST').length,existing?1:0)})}})
test('native device registration dispatch is preserved without workspace initialization',async()=>{const f=fixture();await using(f,async()=>{const r=await onRequestPost({request:request({action:'register_e2ee_device',device_key:'fixture_device',encryption_public_key:'synthetic_encryption',signing_public_key:'synthetic_signing'}),env} as any);assert.equal(r.status,200);assert.equal((await r.json() as any).standing,'device_ready');assert.equal(f.inserted,0)})})
