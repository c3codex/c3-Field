import pg from "file:///C:/c3-field-production-20261124/node_modules/pg/esm/index.mjs"
import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const root=new URL("file:///C:/c3-field-production-20261124/governance/qualification/native-lifecycle-20261126/"),prior=new URL('../production-completion-20261125/',root)
const c=new pg.Client({host:'127.0.0.1',port:55485,user:'postgres',database:'postgres'});await c.connect()
const here=new URL("file:///C:/c3-field-production-20261124/governance/qualification/integrity-revision-20261126/");const inputs=JSON.parse(readFileSync(new URL('native-nug-inputs.json',here)));const checks=[];const check=(name,ok)=>{assert.ok(ok,name);checks.push(name);console.log('PASS '+name)}
const shapes=JSON.parse(readFileSync(new URL('../participant-withdrawal-20261125/native/table-shapes.json',root)))
const extra=JSON.parse(readFileSync(new URL('runtime-shapes.json',prior)))
Object.assign(extra,{
 c3_env_runtime_session:'token_sha256 text,envpac_key text,env_key text,subject_type text,subject_key text,standing text,revoked_at timestamptz,expires_at timestamptz',
 c3_environment:'env_key text,is_active boolean',
 c3_envpac_presentation:'envpac_key text,selection_standing text,source_webpac_key text,metadata jsonb',
 measures_persistence_state:'persistence_key text,oar2_key text,environment_key text,object_key text,object_type text,standing text,source_sha256 text,governed_state jsonb',
 c3ops_nug_binding:'nug_key text,standing text,spec jsonb,missing_predicates jsonb'
})
Object.assign(extra,Object.fromEntries(inputs.shapes.map(x=>[x.table_name,x.columns])));extra.c3ops_nug_effect_passage='occurrence_key text';
async function insert(table,values){const keys=Object.keys(values);await c.query(`insert into ${table}(${keys.join(',')}) values(${keys.map((_,i)=>'$'+(i+1)).join(',')})`,Object.values(values))}
try{
 assert.equal((await c.query('show data_directory')).rows[0].data_directory.replaceAll('\\','/').toLowerCase(),'c:/c3-field-succession-test-20261125')
 await c.query('drop schema public cascade;create schema public;create schema if not exists extensions;create extension if not exists pgcrypto with schema extensions')
 for(const [table,columns] of Object.entries({...Object.fromEntries(shapes.map(x=>[x.table_name,x.columns])),...extra}))await c.query(`create table ${table}(${columns})`)
 // Actual captured preflight and native caller, no dependency doubles.
 for(const f of inputs.functions)await c.query(f.definition)
 const native=JSON.parse(readFileSync(new URL('native-functions.json',root)))
 await c.query(native.find(x=>x.proname==='resolve_c3ops_my_stash_v1').definition)
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

 for(const key of ['c3ops_nugs_native_universal_general_services_v1','c3ops_nug_my_stash_v1','aop_006_free_binding'])await insert('system_process_registry',{process_key:key,process_status:'active'})
 spec.origin_env_key='env-b';spec.native_function_sha256=(await c.query("select encode(extensions.digest(pg_get_functiondef('public.resolve_c3ops_my_stash_v1(jsonb)'::regprocedure),'sha256'),'hex') v")).rows[0].v
 spec.native_result_standing='my_stash_resolved';spec.evidence_return_relation='registry://c3_current_evidence_ref/current-a';delete spec.fixture_preflight
 const tupleKeys=['native_process_key','native_function_ref','native_function_sha256','origin_env_key','env_key','envpac_key','current_state_key','executor_ref','execution_instance','context_binding_key','adapter_class','adapter_process_key','effect_class','native_input','native_result_standing','evidence_return_relation']
 async function admit(key,s){
  const tuple={nug_key:key,...Object.fromEntries(tupleKeys.map(k=>[k,s[k]??null]))}
  await insert('c3_envpac_capability_grant',{capability_key:s.capability_ref,envpac_key:s.envpac_key,standing:'active',scope:{allowed_actions:['call_nug'],nug_bindings:[tuple],db_mutation_authorized:true}})
  await insert('system_oar_queue',{oar_key:s.authority_oar_key,scope_key:s.execution_instance,queue_status:'executing',operator_confirmed_at:new Date(),preflight_status:'passed',automation_permissions:{executor_ref:s.executor_ref,capability_ref:s.capability_ref,nug_bindings:[tuple],db_mutation:true}})
  await insert('c3ops_cancom_context_binding',{binding_key:s.context_binding_key,standing:'active',operator_confirmed_at:new Date(),origin_environment:s.origin_env_key,receiving_environment:s.env_key,resolved_actor:s.executor_ref,capability_ref:s.capability_ref,source_authority_ref:'registry://cancom/oar2/'+s.authority_oar_key,transport_adapter:'registry_cancom_internal',payload_custody_class:'none'})
  await insert('c3ops_nug_binding',{nug_key:key,standing:'active',spec:s})
 }
 await admit('stash-a',spec)

 const resolve=async token=>(await c.query('select free_resolve_my_env_current_state_v1($1) result',[token])).rows[0].result
 let value=await resolve('token-a')
 check('authenticated owner receives exact CURRENT My Stash descriptor',value.standing==='ACT'&&value.available_nugs[0]?.nug_key==='stash-a'&&value.available_nugs[0]?.current_state_key==='current-a')
 check('descriptor does not expose executor or operational authority',Object.keys(value.available_nugs[0]).sort().join(',')==='current_state_key,effect_class,nug_key,service')
 check('unrelated owner receives no cross-owner service',(await resolve('token-b')).available_nugs.length===0)
 check('unknown session cannot resolve',(await resolve('unknown')).standing==='DNR')
 for(const [name,mutation,restore] of [
  ['noncurrent state',"update c3_current_state set is_current=false where env_key='env-a'","update c3_current_state set is_current=true where env_key='env-a'"],
  ['withdrawn binding',"update c3ops_nug_binding set standing='withdrawn'","update c3ops_nug_binding set standing='active'"],
  ['native preflight refusal',"update system_process_registry set process_status='withdrawn' where process_key='c3ops_nug_my_stash_v1'","update system_process_registry set process_status='active' where process_key='c3ops_nug_my_stash_v1'"],
  ['owner mismatch',"update c3ops_nug_binding set spec=jsonb_set(spec,'{native_input,owner_subject_key}','\"owner-b\"')","update c3ops_nug_binding set spec=jsonb_set(spec,'{native_input,owner_subject_key}','\"owner-a\"')"],
  ['external effect',"update c3ops_nug_binding set spec=jsonb_set(spec,'{effect_class}','\"external_email\"')","update c3ops_nug_binding set spec=jsonb_set(spec,'{effect_class}','\"none\"')"]
 ]){await c.query(mutation);check(name+' removes availability',(await resolve('token-a')).available_nugs.length===0);await c.query(restore)}
 await c.query("update c3_env_runtime_session set expires_at=now()-interval '1 second' where token_sha256='token-a'")
 check('expired session cannot resolve',(await resolve('token-a')).standing==='DNR')
 await c.query("update c3_env_runtime_session set expires_at='2099-01-01' where token_sha256='token-a';update c3_envpac set is_effective=false where envpac_key='ep-a'")
 check('retired environment cannot resolve',(await resolve('token-a')).standing==='DNR')
 await c.query("update c3_envpac set is_effective=true where envpac_key='ep-a'")

 const peer=structuredClone(spec);Object.assign(peer,{origin_env_key:'env-a',env_key:'env-b',envpac_key:'ep-b',current_state_key:'current-b',capability_ref:'cap-b',authority_oar_key:'admission-b',execution_instance:'instance-b',context_binding_key:'context-b',evidence_return_relation:'registry://c3_current_evidence_ref/current-b'});peer.native_input={...peer.native_input,env_key:'env-b',envpac_key:'ep-b',current_state_key:'current-b',owner_subject_key:'owner-b'}
 await admit('stash-b',peer)
 check('independently admitted reciprocal receiving scope resolves',(await resolve('token-b')).available_nugs[0]?.nug_key==='stash-b')
 await c.query("update c3ops_cancom_context_binding set standing='withdrawn' where binding_key='context-b'")
 check('withdrawn receiving acceptance refuses peer',(await resolve('token-b')).available_nugs.length===0)
 check('peer withdrawal preserves original service',(await resolve('token-a')).available_nugs[0]?.nug_key==='stash-a')
 const request={...spec,nug_key:'stash-a',participant_input:{action:'list'}}
 for(const field of ['origin_env_key','env_key','envpac_key','current_state_key','executor_ref','execution_instance','capability_ref','authority_oar_key','context_binding_key']){
  const missing={...request};delete missing[field]
  const refusal=(await c.query('select resolve_c3ops_nug_v1($1) r',[missing])).rows[0].r
  check('actual native preflight refuses missing '+field,refusal.missing_predicates.includes(field))
 }
 const invoke=async(key)=>(await c.query('select call_c3ops_nug_native_v1($1,$2) r',[request,key])).rows[0].r
 check('actual native My Stash invocation returns evidence',(await invoke('fixture-occurrence')).standing==='occurrence_returned')
 check('native occurrence replay refuses',(await invoke('fixture-occurrence')).reason==='occurrence_already_returned')
 const evidence=(await c.query("select e.content_hash=encode(extensions.digest(to_jsonb(o)::text,'sha256'),'hex') v from c3_current_evidence_ref e join c3ops_nug_occurrence o on e.evidence_key=o.occurrence_key where o.occurrence_key='fixture-occurrence'")).rows
 check('exact CURRENT occurrence evidence digest matches',evidence.length===1&&evidence[0].v)
 check('replay creates one occurrence',(await c.query("select count(*) n from c3ops_nug_occurrence where occurrence_key='fixture-occurrence'")).rows[0].n==='1')
 await c.query("update c3_env_runtime_session set revoked_at=now() where token_sha256='token-a'")

 check('revoked session cannot resolve',(await resolve('token-a')).standing==='DNR')
 check('unaffected owner presentation preserved',(await resolve('token-b')).standing==='ACT')
 writeFileSync(new URL('native-nug-results.json',here),JSON.stringify({scope:'isolated actual FREE candidate and existing NUG resolver; synthetic owner/session/registration rows; actual native service preflight, My Stash invocation and CURRENT return; synthetic admission and owner fixtures; no production effects',checks},null,2)+'\n')
}finally{await c.end()}
