import pg from 'pg'
import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const root=new URL('./',import.meta.url),config={host:'127.0.0.1',port:55485,user:'postgres',database:'postgres'}
const c=new pg.Client(config);await c.connect()
const checks=[];const check=(name,ok)=>{assert.ok(ok,name);checks.push(name);console.log('PASS '+name)}
const sql=readFileSync(new URL('integrity-foundation.candidate.sql',root),'utf8')
async function refused(query,code,name,client=c){try{await client.query(query);assert.fail(name)}catch(e){check(name,e.code===code)}}
async function setup(){await c.query(`drop schema public cascade;create schema public;grant usage on schema public to anon,authenticated;
 revoke fixture_parent from anon;
 create table c3_pac(pac_key text primary key,supersedes_pac_key text,is_effective boolean not null default true,superseded_at timestamptz,registration_protocol text,custody_uri text,metadata jsonb);
 create table c3_pac_member(member_key text);create table c3_pac_relation(relation_key text);
 grant truncate on c3_pac,c3_pac_member,c3_pac_relation to public,anon,authenticated;
 insert into c3_pac values('history',null,false,'2020-01-01','legacy_pre_hardening','custody://original','{"historical":true}');
 insert into c3_pac_member values('retained-member');insert into c3_pac_relation values('retained-relation')`)}
const snapshot=async()=>(await c.query('select to_jsonb(p) r from c3_pac p order by pac_key')).rows
try{
 const local=(await c.query("select current_setting('data_directory') dir,inet_server_port() port")).rows[0]
 assert.equal(local.dir.replaceAll('\\','/').toLowerCase(),'c:/c3-field-succession-test-20261125');assert.equal(local.port,55485)
 check('verified disposable instance before destructive fixture setup',true)
 await c.query(`do $$begin if not exists(select from pg_roles where rolname='anon') then create role anon;end if;
 if not exists(select from pg_roles where rolname='authenticated') then create role authenticated;end if;
 if not exists(select from pg_roles where rolname='fixture_parent') then create role fixture_parent;end if;end$$`)
 await setup();const history=await snapshot();await c.query(sql)
 check('historical custody bytes preserved',JSON.stringify(await snapshot())===JSON.stringify(history))
 for(const protocol of ['legacy_pre_hardening','registrar_v1']){
  await refused(`insert into c3_pac(pac_key,is_effective,superseded_at,registration_protocol) values('bad-${protocol}',true,now(),'${protocol}')`,'23514',protocol+' contradictory INSERT refused')
  await c.query(`insert into c3_pac(pac_key,registration_protocol) values('valid-${protocol}','${protocol}')`)
  await refused(`update c3_pac set superseded_at=now() where pac_key='valid-${protocol}'`,'23514',protocol+' contradictory UPDATE refused')
  await c.query(`update c3_pac set is_effective=false where pac_key='valid-${protocol}'`)
  check(protocol+' inactive unsuperseded state preserved',(await c.query(`select superseded_at is null v from c3_pac where pac_key='valid-${protocol}'`)).rows[0].v)
  await c.query(`update c3_pac set superseded_at=now() where pac_key='valid-${protocol}'`)
  await refused(`update c3_pac set is_effective=true where pac_key='valid-${protocol}'`,'23514',protocol+' contradictory reactivation refused')
  await c.query(`update c3_pac set superseded_at=null,is_effective=true where pac_key='valid-${protocol}'`)
  await c.query(`update c3_pac set is_effective=false,superseded_at=now() where pac_key='valid-${protocol}'`)
  check(protocol+' atomic retirement transition accepted',true)
 }
 await c.query("insert into c3_pac(pac_key,supersedes_pac_key) values('successor','history')")
 await refused("insert into c3_pac(pac_key,supersedes_pac_key,registration_protocol) values('competitor','history','registrar_v1')",'23505','persistent successor uniqueness across protocols')
 for(const role of ['anon','authenticated'])for(const table of ['c3_pac','c3_pac_member','c3_pac_relation']){
  const before=await c.query('select count(*) n from '+table)
  await c.query('set role '+role)
  try{await c.query('truncate '+table);assert.fail()}catch(e){check(role+' actual TRUNCATE refused '+table,e.code==='42501'&&e.message.includes('permission denied for table'))}finally{await c.query('reset role')}
  check(role+' failed TRUNCATE preserves '+table,(await c.query('select count(*) n from '+table)).rows[0].n===before.rows[0].n)
 }
 await setup();await c.query('grant truncate on c3_pac to fixture_parent;grant fixture_parent to anon')
 const beforeFailure=await snapshot()
 try{await c.query(sql);assert.fail()}catch(e){await c.query('rollback');check('inherited privilege refuses installation',e.message.includes('inherited_truncate_privilege'))}
 check('failed install rolls back index',(await c.query("select to_regclass('public.c3_pac_one_effective_successor_v1') v")).rows[0].v===null)
 check('failed install rolls back CHECK',(await c.query("select count(*) n from pg_constraint where conname='c3_pac_effective_state_consistent_v1'")).rows[0].n==='0')
 check('failed install rolls back direct ACL revocations',(await c.query("select has_table_privilege('authenticated','public.c3_pac','truncate') v")).rows[0].v)
 check('failed install preserves custody',JSON.stringify(await snapshot())===JSON.stringify(beforeFailure))
 await c.query('revoke fixture_parent from anon');await setup();await c.query(sql)
 const other=new pg.Client(config);await other.connect()
 try{
  await c.query('begin');await c.query("insert into c3_pac(pac_key,supersedes_pac_key) values('winner','history')")
  await other.query("set lock_timeout='150ms'")
  await refused("insert into c3_pac(pac_key,supersedes_pac_key) values('loser','history')",'55P03','concurrent successor waits and times out',other)
  await c.query('commit')
  await refused("insert into c3_pac(pac_key,supersedes_pac_key) values('loser','history')",'23505','concurrent loser refuses after winner commit',other)
  await c.query('begin;lock table c3_pac in row exclusive mode')
  try{await other.query(sql.replace("lock_timeout = '5s'","lock_timeout = '150ms'"));assert.fail()}catch(e){await other.query('rollback');check('contended installation refuses atomically',e.code==='55P03')}
  await c.query('rollback')
 }finally{await other.end()}
 writeFileSync(new URL('integrity-results.json',root),JSON.stringify({scope:'verified disposable PostgreSQL; actual CHECK/index/ACL statements; synthetic protocols and custody; actual production trigger compatibility separately qualified',checks},null,2)+'\n')
}finally{await c.end()}
