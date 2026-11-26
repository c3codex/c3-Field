import pg from 'pg'
import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const root=new URL('./',import.meta.url)
const config={host:'127.0.0.1',port:55485,user:'postgres',database:'postgres'}
const c=new pg.Client(config);await c.connect()
const checks=[]
const check=(name,ok)=>{assert.ok(ok,name);checks.push(name);console.log('PASS '+name)}
const sql=readFileSync(new URL('inputs/integrity-foundation.candidate.sql',root),'utf8')
async function setup(){
 await c.query(`drop schema public cascade;create schema public;
 do $$begin if not exists(select from pg_roles where rolname='anon') then create role anon;end if;
 if not exists(select from pg_roles where rolname='authenticated') then create role authenticated;end if;
 if not exists(select from pg_roles where rolname='fixture_parent') then create role fixture_parent;end if;end$$;
 revoke fixture_parent from anon;
 create table c3_pac(pac_key text primary key,supersedes_pac_key text,is_effective boolean,superseded_at timestamptz,registration_protocol text);
 create table c3_pac_member(member_key text);create table c3_pac_relation(relation_key text);
 grant truncate on c3_pac,c3_pac_member,c3_pac_relation to public,anon,authenticated;
 insert into c3_pac values('history',null,false,now(),'legacy_pre_hardening')`)
}
async function refuse(reason){try{await c.query(sql);assert.fail('expected refusal')}catch(e){await c.query('rollback');check(reason,e.message.includes(reason))}}
try{
 await setup();const before=(await c.query('select row_to_json(p) r from c3_pac p')).rows
 await c.query(sql)
 check('history preserved',JSON.stringify(before)===JSON.stringify((await c.query('select row_to_json(p) r from c3_pac p')).rows))
 for(const role of ['anon','authenticated'])for(const table of ['c3_pac','c3_pac_member','c3_pac_relation']){
  check(role+' truncate refused '+table,!(await c.query(`select has_table_privilege($1,$2,'truncate') v`,[role,table])).rows[0].v)
 }
 await c.query(`insert into c3_pac values('successor','history',true,null,'legacy_pre_hardening')`)
 try{await c.query(`insert into c3_pac values('competitor','history',true,null,'registrar_v1')`);assert.fail()}catch(e){check('cross-protocol competitor refused',e.code==='23505')}
 await refuse('existing_index_requires_exact_readback')
 await setup();await c.query(`insert into c3_pac values('invalid',null,true,now(),'legacy_pre_hardening')`)
 await refuse('inconsistent_effective_state')
 await setup();await c.query(`insert into c3_pac values('a','history',true,null,'registrar_v1'),('b','history',true,null,'legacy_pre_hardening')`)
 await refuse('competing_effective_successors')
 await setup();await c.query('grant truncate on c3_pac to fixture_parent;grant fixture_parent to anon')
 await refuse('inherited_truncate_privilege')
 check('failed install rolls back index',(await c.query("select to_regclass('public.c3_pac_one_effective_successor_v1') v")).rows[0].v===null)
 await c.query('revoke fixture_parent from anon');await setup();await c.query(sql)
 const second=new pg.Client(config);await second.connect()
 try{
  await c.query('begin');await c.query(`insert into c3_pac values('winner','history',true,null,'legacy_pre_hardening')`)
  await second.query("set lock_timeout='150ms'")
  try{await second.query(`insert into c3_pac values('loser','history',true,null,'registrar_v1')`);assert.fail()}catch(e){check('concurrent successor waits then refuses lock timeout',e.code==='55P03')}
  await c.query('commit')
  try{await second.query(`insert into c3_pac values('loser','history',true,null,'registrar_v1')`);assert.fail()}catch(e){check('concurrent loser refused after winner commit',e.code==='23505')}
  await c.query('begin;lock table c3_pac in row exclusive mode')
  try{await second.query(sql.replace("lock_timeout = '5s'","lock_timeout = '150ms'"));assert.fail()}catch(e){await second.query('rollback');check('installation lock contention refuses atomically',e.code==='55P03')}
  await c.query('rollback')
 }finally{await second.end()}
 writeFileSync(new URL('integrity-results.json',root),JSON.stringify({scope:'isolated PostgreSQL; synthetic rows and roles; exact candidate SQL except shortened lock timeout in contention test',checks},null,2)+'\n')
}finally{await c.end()}
