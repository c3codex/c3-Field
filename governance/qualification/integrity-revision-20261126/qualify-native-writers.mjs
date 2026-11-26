import pg from 'pg'
import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const root=new URL('./',import.meta.url),old=new URL('../native-lifecycle-20261126/',root)
const c=new pg.Client({host:'127.0.0.1',port:55485,user:'postgres',database:'postgres'});await c.connect()
const checks=[];const check=(name,ok)=>{assert.ok(ok,name);checks.push(name);console.log('PASS '+name)}
const catalog=JSON.parse(readFileSync(new URL('native-catalog.json',root))),inputs=JSON.parse(readFileSync(new URL('native-writer-inputs.json',root)))
const native=JSON.parse(readFileSync(new URL('native-functions.json',old)))
async function insert(table,values){const keys=Object.keys(values);await c.query(`insert into ${table}(${keys.join(',')}) values(${keys.map((_,i)=>'$'+(i+1)).join(',')})`,Object.values(values))}
try{
 const dir=(await c.query("show data_directory")).rows[0].data_directory
 assert.equal(dir.replaceAll('\\','/').toLowerCase(),'c:/c3-field-succession-test-20261125')
 await c.query('drop schema public cascade;create schema public;create schema if not exists extensions;create extension if not exists pgcrypto with schema extensions')
 const shapes=JSON.parse(readFileSync(new URL('../participant-withdrawal-20261125/native/table-shapes.json',root)))
 const extra=JSON.parse(readFileSync(new URL('../production-completion-20261125/runtime-shapes.json',root)))
 const tables={...Object.fromEntries(shapes.map(x=>[x.table_name,x.columns])),...extra,...Object.fromEntries(inputs.shapes.map(x=>[x.table_name,x.columns]))}
 for(const name of ['c3_pac','c3_pac_member','c3_pac_relation']){
  tables[name]=catalog.filter(x=>x.kind==='column'&&x.value.table===name).map(({value:a})=>`"${a.name}" ${a.type}${a.default?' default '+a.default:''}${a.not_null?' not null':''}`).join(',')
 }
 for(const [table,columns] of Object.entries(tables))await c.query(`create table ${table}(${columns})`)
 for(const [table,key] of [['c3_envpac','envpac_key'],['c3_pac_type_contract','contract_key'],['c3_pac_boundary_evaluation','evaluation_key'],['c3_ci_role_call','role_call_key'],['c3_pac_schema','schema_key'],['c3_pac_runtime_binding','binding_key']]){
  if(!tables[table])await c.query(`create table ${table}(${key} text primary key)`)
  else await c.query(`alter table ${table} add primary key(${key})`)
 }
 for(const row of catalog.filter(x=>x.kind==='constraint'&&['p','u','c'].includes(x.value.type)))await c.query(`alter table ${row.value.table} add constraint ${row.value.name} ${row.value.definition}`)
 for(const row of catalog.filter(x=>x.kind==='constraint'&&x.value.type==='f'))await c.query(`alter table ${row.value.table} add constraint ${row.value.name} ${row.value.definition}`)
 for(const row of inputs.functions)await c.query(row.definition)
 await c.query(readFileSync(new URL('native-institutional-eligibility.sql',root),'utf8'))
 for(const row of catalog.filter(x=>x.kind==='trigger'))await c.query(row.value.function_definition)
 for(const row of catalog.filter(x=>x.kind==='trigger'))await c.query(row.value.definition)
 for(const table of ['c3_pac','c3_pac_member','c3_pac_relation'])await c.query(`alter table ${table} enable row level security`)
 await c.query(native.find(x=>x.proname==='registrar_register_pac_v1').definition)
 check('all ten target triggers and all native target constraints installed',(await c.query("select count(*) n from pg_trigger where tgrelid in ('c3_pac'::regclass,'c3_pac_member'::regclass,'c3_pac_relation'::regclass) and not tgisinternal")).rows[0].n==='10')
 await insert('c3_envpac',{envpac_key:'fixture-ep',env_key:'fixture-env',is_effective:true})
 await insert('c3_pac_schema',{schema_key:'fixture-schema',pac_type:'EvidencePAC',is_active:true,standing:'active',requires_c3_model_binding:false})
 await insert('c3_free_call',{free_call_key:'fixture-definition',standing:'active',requires_projection:false})
 async function register(key,prior=null){
  const presented={pac_key:key,envpac_key:'fixture-ep',pac_type:'EvidencePAC',version:key,standing:'active',custody_uri:'fixture://custody/'+key,schema_key:'fixture-schema',owner_subject_type:'system',owner_subject_key:'fixture-system',custodian_subject_type:'system',custodian_subject_key:'fixture-system',is_effective:true,supersedes_pac_key:prior,authority_effect:'none',return_evidence_required:false,encounter_scopes:[{surface_type:'fixture',encounter_key:'definition'}]}
  const sha=(await c.query("select encode(extensions.digest($1::jsonb::text,'sha256'),'hex') v",[presented])).rows[0].v
  const evaluation='evaluation-'+key,role='role-'+key
  await insert('c3_pac_boundary_evaluation',{evaluation_key:evaluation,notchazz_result:'PASS',presented_pac_key:key,presented_registration_sha256:sha})
  await insert('c3_ci_role_call',{role_call_key:role,call_class:'pac_registration',caller_role_key:'c3_notchazz_boundary_v1',callee_role_key:'c3_registrar_ci_v1',standing:'OPEN',boundary_evaluation_key:evaluation,presented_sha256:sha,source_oar2_ref:'fixture-admission',evidence:{}})
  await c.query('begin')
  try{
   const result=(await c.query('select registrar_register_pac_v1($1,$2,$3,$4) r',[presented,evaluation,role,'fixture-admission'])).rows[0].r
   assert.equal(result.standing,'REGISTERED',JSON.stringify(result))
   // Existing caller must complete its qualified FREE binding before deferred checks.
   await c.query("update c3_pac_encounter_scope set free_call_key='fixture-definition',selector_type='encounter',selector_value='definition' where pac_key=$1",[key])
   await c.query('commit');return {result,presented,evaluation,role}
  }catch(e){await c.query('rollback');throw e}
 }
 await register('baseline');await register('baseline-successor','baseline')
 check('actual native Registrar writer and trigger succession works before candidate',true)
 const history=(await c.query("select to_jsonb(p) r from c3_pac p where pac_key='baseline'")).rows
 await c.query(readFileSync(new URL('integrity-foundation.candidate.sql',root),'utf8'))
 await register('after');const successor=await register('after-successor','after')
 check('actual native Registrar writer and deferred triggers work after CHECK',true)
 const replay=(await c.query('select registrar_register_pac_v1($1,$2,$3,$4) r',[successor.presented,successor.evaluation,successor.role,'fixture-admission'])).rows[0].r
 check('actual Registrar retry remains idempotent after CHECK',replay.standing==='REGISTERED'&&replay.idempotent===true)
 const forged=(await c.query('select registrar_register_pac_v1_core($1,$2,$3,$4) r',[{...successor.presented,pac_key:'forged'},'absent-evaluation',successor.role,'fixture-admission'])).rows[0].r
 check('actual writer refuses missing exact NotChazz evidence',forged.reason==='notchazz_pass_exact_match_required')
 const retired=(await c.query("select is_effective,superseded_at,custody_uri from c3_pac where pac_key='after'")).rows[0]
 check('native writer atomic retirement satisfies persistent invariant',!retired.is_effective&&retired.superseded_at!==null&&retired.custody_uri==='fixture://custody/after')
 check('historical native predecessor bytes unchanged',JSON.stringify((await c.query("select to_jsonb(p) r from c3_pac p where pac_key='baseline'")).rows)===JSON.stringify(history))
 await insert('c3_pac',{pac_key:'legacy',envpac_key:'fixture-ep',pac_type:'EvidencePAC',version:'v1',standing:'active',custody_uri:'fixture://legacy'})
 await c.query("update c3_pac set is_effective=false where pac_key='legacy';update c3_pac set superseded_at=now() where pac_key='legacy'")
 check('actual legacy trigger path accepts retire-then-stamp',true)
 try{await c.query("update c3_pac set is_effective=true where pac_key='legacy'");assert.fail()}catch(e){check('actual legacy trigger path refuses contradiction',e.code==='23514')}
 await c.query("begin;select set_config('c3.pac_registrar_context','fixture-context',true)")
 try{await c.query("update c3_pac set superseded_at=now() where pac_key='after-successor'");assert.fail()}catch(e){check('actual hardened trigger path refuses contradictory state',e.code==='23514');await c.query('rollback')}
 const core=inputs.functions.find(x=>x.proname==='registrar_register_pac_v1_core').definition
 check('live writer retires both columns in one statement',/set is_effective=false,superseded_at=now\(\),updated_at=now\(\)/.test(core))
 writeFileSync(new URL('native-writer-results.json',root),JSON.stringify({scope:'actual captured target columns/defaults/checks/unique/FKs and all ten target triggers; actual Registrar wrapper/core and validator; dependency tables column fixtures; synthetic admission evidence explicitly not native acceptance; no production writes',checks},null,2)+'\n')
}finally{await c.end()}
