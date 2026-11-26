import pg from "file:///C:/c3-field-production-20261124/node_modules/pg/esm/index.mjs"
import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const root=new URL("file:///C:/c3-field-production-20261124/governance/qualification/native-lifecycle-20261126/"),config={host:'127.0.0.1',port:55485,user:'postgres',database:'postgres'}
const c=new pg.Client(config);await c.connect()
const checks=[];const check=(name,ok)=>{assert.ok(ok,name);checks.push(name);console.log('PASS '+name)}
const deps=JSON.parse(readFileSync(new URL('profile-dependencies.json',root)))
const shapes=JSON.parse(readFileSync(new URL('../participant-withdrawal-20261125/native/table-shapes.json',root)))
async function insert(table,values){const keys=Object.keys(values);await c.query(`insert into ${table}(${keys.join(',')}) values(${keys.map((_,i)=>'$'+(i+1)).join(',')})`,Object.values(values).map(value=>Array.isArray(value)?JSON.stringify(value):value))}
const call="select form_profile_pac_v1_internal('ep-a','individual','owner-a','individual','Owner A','private') r"
async function header(token){await c.query("select set_config('request.headers',$1,false)",[JSON.stringify({'x-c3-owner-session':token})])}
async function refused(name,query=call){try{await c.query(query);assert.fail(name)}catch(e){check(name,e.code==='42501'&&e.message.includes('owner_session_authorization_unresolved'))}}
try{
 assert.equal((await c.query('show data_directory')).rows[0].data_directory.replaceAll('\\','/').toLowerCase(),'c:/c3-field-succession-test-20261125')
 await c.query('drop schema public cascade;create schema public;create schema if not exists extensions;create extension if not exists pgcrypto with schema extensions')
 const tables={...Object.fromEntries(shapes.map(x=>[x.table_name,x.columns])),...Object.fromEntries(deps.shapes.map(x=>[x.table_name,x.columns])),...Object.fromEntries(deps.dependencies.filter(x=>x.kind==='profile_shape').map(x=>[x.value.table_name,x.value.columns])),c3_environment:'env_key text,is_active boolean,environment_class text,metadata jsonb',c3_env_runtime_session:'token_sha256 text,envpac_key text,env_key text,subject_type text,subject_key text,standing text,revoked_at timestamptz,expires_at timestamptz'}
 tables.c3_envpac_runtime_primitive='envpac_key text,primitive_key text,primitive_class text,standing text,config jsonb'
 for(const [name,columns] of Object.entries(tables))await c.query(`create table ${name}(${columns})`)
 await c.query("do $$begin if not exists(select from pg_roles where rolname='service_role') then create role service_role;end if;end$$;alter table c3_pac add primary key(pac_key)")
 await c.query(deps.dependencies.find(x=>x.kind==='path_helper').value)
 for(const helper of deps.helpers)await c.query(helper.definition)
 const native=JSON.parse(readFileSync(new URL('native-functions.json',root)))
 await c.query(native.find(x=>x.proname==='c3_guard_profile_pac_chain').definition)
 await c.query('create trigger profile_chain before insert or update on c3_profile_pac for each row execute function c3_guard_profile_pac_chain()')
 await c.query(readFileSync(new URL('profile-owner-session.candidate.sql',root),'utf8'))
 await c.query(readFileSync(new URL("file:///C:/c3-field-production-20261124/governance/qualification/integrity-revision-20261126/integrity-foundation.candidate.sql"),'utf8'))
 await insert('c3_pac_type_contract',deps.dependencies.find(x=>x.kind==='profile_contract').value)
 for(const owner of ['a','b']){
  await insert('c3_environment',{env_key:'env-'+owner,is_active:true})
  await insert('c3_envpac',{envpac_key:'ep-'+owner,env_key:'env-'+owner,owner_subject_type:'individual',owner_subject_key:'owner-'+owner,is_effective:true,effective_at:new Date(0),metadata:{formed_from_c1:true}})
  await insert('c3_envpac_runtime_primitive',{envpac_key:'ep-'+owner,primitive_key:'profile_pac',primitive_class:'participant_formable_pac',standing:'active',config:{contract_key:'pac_contract_profilepac_v1'}})
  await insert('c3_env_runtime_session',{token_sha256:(await c.query("select encode(extensions.digest($1,'sha256'),'hex') v",['token-'+owner])).rows[0].v,envpac_key:'ep-'+owner,env_key:'env-'+owner,subject_type:'individual',subject_key:'owner-'+owner,standing:'active',expires_at:'2099-01-01'})
  await insert('c3_envpac_access_grant',{envpac_key:'ep-'+owner,subject_type:'individual',subject_key:'owner-'+owner,relation_role:'owner',standing:'active'})
 }
 await header('');await refused('owner identifiers alone refuse native formation')
 await header('token-b');await refused('different authenticated owner refuses formation')
 await header('token-a')
 try{await c.query(call);assert.fail()}catch(e){check('baseline exact admitted contract fails generic relation evaluator',e.message==='profile_pac_incomplete')}
 await c.query(readFileSync(new URL('profile-contract-relations.candidate.sql',root),'utf8'))
 let formed=(await c.query(call)).rows[0].r
 check('authenticated owner forms private profile using actual evaluator',formed.created===true&&formed.truth.profile.subject_key==='owner-a'&&formed.truth.evaluation.completeness_state==='pass')
 check('formation replay creates no duplicate',(await c.query(call)).rows[0].r.created===false)
 const update="select update_profile_pac_personalization_internal('ep-a','individual','owner-a','{\"display_label\":\"Updated\",\"visibility_scope\":\"private\",\"about\":\"Retained owner\"}'::jsonb) r"
 check('authenticated owner updates private personalization',(await c.query(update)).rows[0].r.truth.profile.about==='Retained owner')
 const pacKey=formed.truth.pac_key
 await c.query("update c3_envpac_runtime_primitive set standing='withdrawn' where envpac_key='ep-a'")
 check('withdrawn primitive fails existing evaluator',(await c.query('select c3_pac_evaluate($1) r',[pacKey])).rows[0].r.completeness_state==='held')
 try{await c.query(update);assert.fail()}catch(e){check('existing chain guard refuses withdrawn primitive',e.message.includes('active ProfilePAC primitive not resolved'))}
 await c.query("update c3_envpac_runtime_primitive set standing='active' where envpac_key='ep-a'")
 await c.query("update c3_pac_type_contract set required_relations=required_relations||'[ {\"relation\":\"unknown relation\"} ]'::jsonb")
 check('unknown contract relation refuses completeness',(await c.query('select c3_pac_evaluate($1) r',[pacKey])).rows[0].r.completeness_state==='held')
 const beforeMismatch=(await c.query('select to_jsonb(p) r from c3_profile_pac p')).rows
 try{await c.query(update.replace('Updated','Unauthorized mismatch'));assert.fail()}catch(e){check('post-persistence contract mismatch refuses effect',e.message.includes('profile_post_persistence_confirmation_failed'))}
 check('post-persistence mismatch rolls back profile bytes',JSON.stringify((await c.query('select to_jsonb(p) r from c3_profile_pac p')).rows)===JSON.stringify(beforeMismatch))
 await c.query("update c3_pac_type_contract set required_relations=required_relations-2")
 await header('token-b');await refused('different session refuses personalization',update)
 await header('token-a');await c.query("update c3_env_runtime_session set revoked_at=now() where subject_key='owner-a'")
 await refused('revoked session refuses mutation',update)
 await c.query("update c3_env_runtime_session set revoked_at=null where subject_key='owner-a';update c3_envpac_access_grant set standing='revoked' where subject_key='owner-a'")
 await refused('withdrawn grant refuses mutation',update)
 await c.query("update c3_envpac_access_grant set standing='active' where subject_key='owner-a'")
 const other=new pg.Client(config);await other.connect()
 try{
  await c.query('begin');await c.query(update)
  await other.query("set lock_timeout='150ms'")
  try{await other.query("insert into c3_envpac_access_grant(envpac_key,subject_key,standing) values('ep-a','owner-a','revoked')");assert.fail()}catch(e){check('appended grant mutation serializes with profile write',e.code==='55P03')}
  await c.query('commit')
  await other.query('begin');await other.query("update c3_env_runtime_session set revoked_at=now() where subject_key='owner-a'")
  await c.query("set lock_timeout='150ms'")
  try{await c.query(update);assert.fail()}catch(e){check('in-flight session withdrawal blocks owner effect',e.code==='55P03')}
  await other.query('commit');await refused('committed session withdrawal refuses replay',update)
 }finally{await other.end()}
 check('public execution removed',!(await c.query("select has_function_privilege('anon','public.form_profile_pac_v1_internal(text,text,text,text,text,text)','execute') v")).rows[0].v)
 writeFileSync(new URL('profile-compatibility-results.json',"file:///C:/c3-field-production-20261124/governance/qualification/integrity-revision-20261126/"),JSON.stringify({scope:'isolated native function bodies, native completeness evaluator and contract, existing ProfilePAC chain trigger; synthetic rows; persistent effective-state CHECK and successor uniqueness installed; full SRC/NotChazz pipeline and all production triggers not claimed',checks},null,2)+'\n')
}finally{await c.end()}
