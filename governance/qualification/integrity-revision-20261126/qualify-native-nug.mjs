// Derive the retained owner FREE fixture, replacing its explicit preflight double.
// Every replacement asserts its preimage; generated executed fixture is retained.
import {readFileSync,writeFileSync} from 'node:fs'
const here=new URL('./',import.meta.url),old=new URL('../native-lifecycle-20261126/',here)
let fixture=readFileSync(new URL('qualify-current-free.mjs',old),'utf8')
const replace=(before,after)=>{if(!fixture.includes(before))throw Error('fixture preimage missing: '+before.slice(0,80));fixture=fixture.replace(before,after)}
replace("from 'pg'",'from '+JSON.stringify(import.meta.resolve('pg')))
replace("const root=new URL('./',import.meta.url)",`const root=new URL(${JSON.stringify(old.href)})`)
replace("const checks=[];",`const here=new URL(${JSON.stringify(here.href)});const inputs=JSON.parse(readFileSync(new URL('native-nug-inputs.json',here)));Object.assign(extraUnusedPlaceholder||{},{});const checks=[];`)
// Keep declarations before data references; shapes are installed after extra exists.
replace('Object.assign(extraUnusedPlaceholder||{},{});','')
replace("try{\n await c.query('drop schema public cascade;", "try{\n assert.equal((await c.query('show data_directory')).rows[0].data_directory.replaceAll('\\\\','/').toLowerCase(),'c:/c3-field-succession-test-20261125')\n await c.query('drop schema public cascade;")
replace("async function insert(table,values)","Object.assign(extra,Object.fromEntries(inputs.shapes.map(x=>[x.table_name,x.columns])));extra.c3ops_nug_effect_passage='occurrence_key text';\nasync function insert(table,values)")
replace("await c.query(`create function preflight_c3ops_nug_spec_v1(text,jsonb) returns jsonb language sql stable as $$select jsonb_build_object('standing',case when $2->>'fixture_preflight'='pass' then 'resolved_for_nug' else 'HLD' end)$$`)","for(const f of inputs.functions)await c.query(f.definition)")
replace("await c.query(native.find(x=>x.proname==='resolve_c3ops_nug_v1').definition)","await c.query(native.find(x=>x.proname==='resolve_c3ops_my_stash_v1').definition)")
replace("await insert('c3ops_nug_binding',{nug_key:'stash-a',standing:'active',spec})",`
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
`)
replace(`['native preflight refusal',"update c3ops_nug_binding set spec=jsonb_set(spec,'{fixture_preflight}','\\\"refuse\\\"')","update c3ops_nug_binding set spec=jsonb_set(spec,'{fixture_preflight}','\\\"pass\\\"')"]`,
 `['native preflight refusal',"update system_process_registry set process_status='withdrawn' where process_key='c3ops_nug_my_stash_v1'","update system_process_registry set process_status='active' where process_key='c3ops_nug_my_stash_v1'"]`)
replace("await c.query(\"update c3_env_runtime_session set revoked_at=now() where token_sha256='token-a'\")",`
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
`)
replace("'current-free-results.json',root","'native-nug-results.json',here")
replace('native service preflight explicitly doubled; no service invoked','actual native service preflight, My Stash invocation and CURRENT return; synthetic admission and owner fixtures; no production effects')
replace('// Explicit dependency double: test FREE binding, not native service preflight qualification.','// Actual captured preflight and native caller, no dependency doubles.')
fixture=fixture.replace(/^[\t ]+$/gm,'')
writeFileSync(new URL('native-nug.executed-fixture.mjs',here),fixture)
await import(new URL('native-nug.executed-fixture.mjs',here))
