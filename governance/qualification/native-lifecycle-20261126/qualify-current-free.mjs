import pg from 'pg'
import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const root=new URL('./',import.meta.url),prior=new URL('../production-completion-20261125/',root)
const c=new pg.Client({host:'127.0.0.1',port:55485,user:'postgres',database:'postgres'});await c.connect()
const checks=[];const check=(name,ok)=>{assert.ok(ok,name);checks.push(name);console.log('PASS '+name)}
const shapes=JSON.parse(readFileSync(new URL('../participant-withdrawal-20261125/native/table-shapes.json',root)))
const extra=JSON.parse(readFileSync(new URL('runtime-shapes.json',prior)))
Object.assign(extra,{
 c3_env_runtime_session:'token_sha256 text,envpac_key text,env_key text,subject_type text,subject_key text,standing text,revoked_at timestamptz,expires_at timestamptz',
 c3_environment:'env_key text,is_active boolean',
 c3_envpac_presentation:'envpac_key text,selection_standing text,source_webpac_key text,metadata jsonb',
 measures_persistence_state:'persistence_key text,oar2_key text,environment_key text,object_key text,object_type text,standing text,source_sha256 text,governed_state jsonb',
 c3ops_nug_binding:'nug_key text,standing text,spec jsonb,missing_predicates jsonb'
})
async function insert(table,values){const keys=Object.keys(values);await c.query(`insert into ${table}(${keys.join(',')}) values(${keys.map((_,i)=>'$'+(i+1)).join(',')})`,Object.values(values))}
try{
 await c.query('drop schema public cascade;create schema public;create schema if not exists extensions;create extension if not exists pgcrypto with schema extensions')
 for(const [table,columns] of Object.entries({...Object.fromEntries(shapes.map(x=>[x.table_name,x.columns])),...extra}))await c.query(`create table ${table}(${columns})`)
 // Explicit dependency double: test FREE binding, not native service preflight qualification.
 await c.query(`create function preflight_c3ops_nug_spec_v1(text,jsonb) returns jsonb language sql stable as $$select jsonb_build_object('standing',case when $2->>'fixture_preflight'='pass' then 'resolved_for_nug' else 'HLD' end)$$`)
 const native=JSON.parse(readFileSync(new URL('native-functions.json',root)))
 await c.query(native.find(x=>x.proname==='resolve_c3ops_nug_v1').definition)
 await c.query(readFileSync(new URL('current-free.candidate.sql',root),'utf8'))
 for(const owner of ['a','b']){
  await insert('c3_environment',{env_key:'env-'+owner,is_active:true})
  await insert('c3_envpac',{envpac_key:'ep-'+owner,env_key:'env-'+owner,owner_subject_type:'individual',owner_subject_key:'owner-'+owner,is_effective:true,effective_at:new Date(0)})
  await insert('c3_env_runtime_session',{token_sha256:'token-'+owner,envpac_key:'ep-'+owner,env_key:'env-'+owner,subject_type:'individual',subject_key:'owner-'+owner,standing:'active',expires_at:'2099-01-01'})
  await insert('c3_envpac_access_grant',{envpac_key:'ep-'+owner,subject_type:'individual',subject_key:'owner-'+owner,relation_role:'owner',standing:'active'})
  await insert('c3_envpac_presentation',{envpac_key:'ep-'+owner,selection_standing:'active',source_webpac_key:'web-'+owner,metadata:{design_pac_key:'design',design_registration_sha256:'a'.repeat(64)}})
  await insert('c3_pac',{pac_key:'web-'+owner,envpac_key:'ep-'+owner,pac_type:'c3WebPac',is_effective:true,effective_at:new Date(0),release_state:'private'})
  await insert('c3_current_state',{current_state_key:'current-'+owner,env_key:'env-'+owner,is_current:true})
 }
 await insert('c3_pac',{pac_key:'design',registration_sha256:'a'.repeat(64),pac_type:'DesignPac',schema_key:'schema',is_effective:true,effective_at:new Date(0),release_state:'private',authority_effect:'none',registrar_role_call_key:'original-admission'})
 // Candidate preserves the exact admitted DesignPAC schema contract.
 await c.query("update c3_pac set schema_key='pac_schema_designpac_v1_1' where pac_key='design'")
 await insert('c3_pac_schema',{schema_key:'pac_schema_designpac_v1_1',pac_type:'DesignPac',is_active:true,standing:'active'})
 await insert('c3_free_call',{free_call_key:'my_env_current_state_owner_presentation',call_class:'environment_projection',surface_class:'my_env',standing:'active',requires_pac_snapshot:true,requires_projection:true})
 const encounter={pac_key:'design',free_call_key:'my_env_current_state_owner_presentation',surface_type:'my_env',encounter_key:'my_env_current_state',selector_type:'encounter',selector_value:'my_env_current_state',standing:'active'}
 await insert('c3_free_pac_snapshot',{...encounter,free_snapshot_key:'snapshot',schema_key:'pac_schema_designpac_v1_1',registration_sha256:'a'.repeat(64),registrar_role_call_key:'original-admission',projection:{title:'fixture'}})
 await c.query("update c3_free_pac_snapshot set projection_sha256=encode(extensions.digest(convert_to(projection::text,'UTF8'),'sha256'),'hex')")
 await insert('c3_pac_encounter_scope',encounter)
 const spec={envpac_key:'ep-a',env_key:'env-a',current_state_key:'current-a',native_process_key:'c3ops_nug_my_stash_v1',native_function_ref:'public.resolve_c3ops_my_stash_v1(jsonb)',effect_class:'none',adapter_class:'direct_native',fixture_preflight:'pass',native_input:{envpac_key:'ep-a',env_key:'env-a',current_state_key:'current-a',owner_subject_key:'owner-a',default_visibility:'private',event_contract:'my_stash_private_reference_v1'}}
 for(const key of ['origin_env_key','executor_ref','execution_instance','capability_ref','authority_oar_key','context_binding_key'])spec[key]='fixture-'+key
 await insert('c3ops_nug_binding',{nug_key:'stash-a',standing:'active',spec})
 const resolve=async token=>(await c.query('select free_resolve_my_env_current_state_v1($1) result',[token])).rows[0].result
 let value=await resolve('token-a')
 check('authenticated owner receives exact CURRENT My Stash descriptor',value.standing==='ACT'&&value.available_nugs[0]?.nug_key==='stash-a'&&value.available_nugs[0]?.current_state_key==='current-a')
 check('descriptor does not expose executor or operational authority',Object.keys(value.available_nugs[0]).sort().join(',')==='current_state_key,effect_class,nug_key,service')
 check('unrelated owner receives no cross-owner service',(await resolve('token-b')).available_nugs.length===0)
 check('unknown session cannot resolve',(await resolve('unknown')).standing==='DNR')
 for(const [name,mutation,restore] of [
  ['noncurrent state',"update c3_current_state set is_current=false where env_key='env-a'","update c3_current_state set is_current=true where env_key='env-a'"],
  ['withdrawn binding',"update c3ops_nug_binding set standing='withdrawn'","update c3ops_nug_binding set standing='active'"],
  ['native preflight refusal',"update c3ops_nug_binding set spec=jsonb_set(spec,'{fixture_preflight}','\"refuse\"')","update c3ops_nug_binding set spec=jsonb_set(spec,'{fixture_preflight}','\"pass\"')"],
  ['owner mismatch',"update c3ops_nug_binding set spec=jsonb_set(spec,'{native_input,owner_subject_key}','\"owner-b\"')","update c3ops_nug_binding set spec=jsonb_set(spec,'{native_input,owner_subject_key}','\"owner-a\"')"],
  ['external effect',"update c3ops_nug_binding set spec=jsonb_set(spec,'{effect_class}','\"external_email\"')","update c3ops_nug_binding set spec=jsonb_set(spec,'{effect_class}','\"none\"')"]
 ]){await c.query(mutation);check(name+' removes availability',(await resolve('token-a')).available_nugs.length===0);await c.query(restore)}
 await c.query("update c3_env_runtime_session set expires_at=now()-interval '1 second' where token_sha256='token-a'")
 check('expired session cannot resolve',(await resolve('token-a')).standing==='DNR')
 await c.query("update c3_env_runtime_session set expires_at='2099-01-01' where token_sha256='token-a';update c3_envpac set is_effective=false where envpac_key='ep-a'")
 check('retired environment cannot resolve',(await resolve('token-a')).standing==='DNR')
 await c.query("update c3_envpac set is_effective=true where envpac_key='ep-a'")
 await c.query("update c3_env_runtime_session set revoked_at=now() where token_sha256='token-a'")
 check('revoked session cannot resolve',(await resolve('token-a')).standing==='DNR')
 check('unaffected owner presentation preserved',(await resolve('token-b')).standing==='ACT')
 writeFileSync(new URL('current-free-results.json',root),JSON.stringify({scope:'isolated actual FREE candidate and existing NUG resolver; synthetic owner/session/registration rows; native service preflight explicitly doubled; no service invoked',checks},null,2)+'\n')
}finally{await c.end()}
