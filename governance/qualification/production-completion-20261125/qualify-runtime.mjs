import pg from 'pg'
import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const root=new URL('./',import.meta.url),old=new URL('../participant-withdrawal-20261125/',import.meta.url)
const c=new pg.Client({host:'127.0.0.1',port:55485,user:'postgres',database:'postgres'});await c.connect()
const checks=[];const check=(name,value)=>{assert.ok(value,name);checks.push(name);console.log('PASS '+name)}
const shapes=JSON.parse(readFileSync(new URL('native/table-shapes.json',old),'utf8'))
const extra=JSON.parse(readFileSync(new URL('runtime-shapes.json',root),'utf8'))
async function insert(table,values){const keys=Object.keys(values);await c.query(`insert into ${table}(${keys.join(',')}) values(${keys.map((_,i)=>'$'+(i+1)).join(',')})`,Object.values(values))}
try{
 await c.query('drop schema public cascade;create schema public;create schema if not exists extensions;create extension if not exists pgcrypto with schema extensions')
 for(const [table,columns] of Object.entries({...Object.fromEntries(shapes.map(x=>[x.table_name,x.columns])),...extra}))await c.query(`create table ${table}(${columns})`)
 await c.query(`create function c3_pac_review_sha256_v1(text) returns text language sql as $$select repeat('b',64)$$`)
 for(const path of [new URL('native/hardened-immutability.sql',old),new URL('projection-withdrawal.candidate.sql',root),new URL('free-owner-authorization.candidate.sql',root)])await c.query(readFileSync(path,'utf8'))
 await c.query(`create trigger immutable before update or delete on c3_pac for each row execute function c3_hardened_pac_immutable_guard_v1()`)
 await insert('c3_free_call',{free_call_key:'call',standing:'active',requires_pac_snapshot:true,surface_class:'c3_field'})
 await insert('c3_pac_schema',{schema_key:'schema',pac_type:'ProfilePAC',standing:'active',is_active:true,requires_c3_model_binding:true})
 for(const key of ['a','b']){
  await insert('c3_envpac',{envpac_key:'ep-'+key,env_key:'env-'+key,owner_subject_type:'individual',owner_subject_key:'owner-'+key,is_effective:true})
  await insert('c3_envpac_access_grant',{grant_key:'grant-'+key,envpac_key:'ep-'+key,subject_type:'individual',subject_key:'owner-'+key,relation_role:'owner',standing:'active',scope:{rights:['revoke','export']}})
  await insert('c3_pac',{pac_key:'pac-'+key,envpac_key:'ep-'+key,pac_type:'ProfilePAC',schema_key:'schema',registration_protocol:'registrar_v1',registration_sha256:'a'.repeat(64),is_effective:true,owner_subject_type:'individual',owner_subject_key:'owner-'+key,custodian_subject_type:'individual',custodian_subject_key:'owner-'+key,metadata:{ownership_model:{owner_subject_type:'individual',owner_subject_key:'owner-'+key},custody_model:{custody_class:'personal_pac_custody'}}})
  await insert('c3_pac_encounter_scope',{scope_key:'scope-'+key,pac_key:'pac-'+key,free_call_key:'call',encounter_key:'encounter',surface_type:'canopy',selector_type:'host',selector_value:key+'.invalid',standing:'active'})
  await insert('c3_free_pac_snapshot',{free_snapshot_key:'snapshot-'+key,pac_key:'pac-'+key,free_call_key:'call',schema_key:'schema',registration_sha256:'a'.repeat(64),encounter_key:'encounter',surface_type:'canopy',selector_type:'host',selector_value:key+'.invalid',standing:'active',projection:{fixture:'owner-'+key}})
  await insert('c3_pac_model_binding',{binding_key:'binding-'+key,pac_key:'pac-'+key,circuit_key:'circuit',env_key:'env-'+key,standing:'active'})
  await insert('c3_current_state',{current_state_key:'current-'+key,env_key:'env-'+key,is_current:true,effective_at:new Date(0)})
  await insert('c3_pac_registration_receipt',{registration_key:'receipt-'+key,pac_key:'pac-'+key,standing:'registered',registration_sha256:'a'.repeat(64)})
  await insert('c3_current_accrual',{accrual_key:'accrual-'+key,env_key:'env-'+key,envpac_key:'ep-'+key,current_state_key:'current-'+key,source_class:'pac',source_pac_key:'pac-'+key,source_key:'pac_registration:pac-'+key+':circuit',subject_type:'individual',subject_key:'owner-'+key,relation_standing:'registered',evidence_ref:'pac_registration:receipt-'+key})
 }
 await c.query(`update c3_free_pac_snapshot set projection_sha256=encode(extensions.digest(convert_to(projection::text,'UTF8'),'sha256'),'hex')`)
 const resolve=async key=>(await c.query(`select free_resolve_pac_encounter_v1('call','host',$1) result`,[key+'.invalid'])).rows[0].result
 const revoke=async owner=>(await c.query(`select c3_pac_set_personal_encounter_projection_v1('pac-a',$1,'REVOKE','encounter','c3field_only') result`,[owner])).rows[0].result
 const before=(await c.query(`select to_jsonb(p) row from c3_pac p order by pac_key`)).rows
 const history=(await c.query(`select to_jsonb(a) row from c3_current_accrual a order by accrual_key`)).rows
 check('registered owner encounter ACT before withdrawal',(await resolve('a')).standing==='ACT')
 check('cross-owner withdrawal refused',(await revoke('owner-b')).standing==='DNR')
 check('cross-owner refusal leaves ACT unchanged',(await resolve('a')).standing==='ACT')
 check('hardened owner withdrawal succeeds',(await revoke('owner-a')).encounter_projection_standing==='REVOKED')
 check('FREE after withdrawal returns DNR',(await resolve('a')).reason==='projection_authorization_withdrawn')
 check('unaffected owner encounter remains ACT',(await resolve('b')).standing==='ACT')
 await revoke('owner-a');const scope=(await c.query(`select scope from c3_envpac_access_grant where grant_key='grant-a'`)).rows[0].scope
 check('replayed withdrawal has one authorization tombstone',scope.withdrawn_pac_projections.length===1)
 check('immutable PAC bytes unchanged',JSON.stringify((await c.query(`select to_jsonb(p) row from c3_pac p order by pac_key`)).rows)===JSON.stringify(before))
 check('CURRENT accrual history unchanged',JSON.stringify((await c.query(`select to_jsonb(a) row from c3_current_accrual a order by accrual_key`)).rows)===JSON.stringify(history))
 await c.query(`update c3_envpac set is_effective=false where envpac_key='ep-b'`)
 check('retired individual environment cannot continue public FREE',(await resolve('b')).reason==='individual_owner_environment_not_effective')
 writeFileSync(new URL('runtime-qualification.json',root),JSON.stringify({scope:'isolated actual function candidates and immutable guard; synthetic registrations, not production acceptance',checks},null,2)+'\n')
}finally{await c.end()}
