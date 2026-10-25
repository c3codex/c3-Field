import {createRequire} from 'node:module';
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const {Client}=createRequire(import.meta.url)(process.env.C3_PG_MODULE||'pg');
const config={host:'127.0.0.1',port:55474,user:'postgres',database:'postgres'};
const c=new Client(config);await c.connect();
const root=new URL('../../../',import.meta.url),read=x=>readFileSync(new URL(x,import.meta.url),'utf8'),hash=s=>createHash('sha256').update(s).digest('hex');
const migrations=readdirSync(new URL('supabase/migrations/',root)).filter(x=>/_r0[12]_.*_candidate.sql$/.test(x)).sort();
assert.equal(migrations.length,2);
async function reset(){await c.query('drop schema public cascade;create schema public;drop schema if exists extensions cascade;drop role if exists anon;drop role if exists authenticated;drop role if exists service_role;drop role if exists fixture_accidental;');}
async function snapshot(){
 const sql={columns:"select table_name,column_name,ordinal_position,data_type,is_nullable,column_default from information_schema.columns where table_schema='public' order by table_name,ordinal_position",relations:"select relname,relkind,relrowsecurity,relforcerowsecurity,reloptions,pg_get_userbyid(relowner) as owner,relacl::text from pg_class where relnamespace='public'::regnamespace order by relname",constraints:"select conrelid::regclass::text as relation,conname,pg_get_constraintdef(oid) as definition from pg_constraint where connamespace='public'::regnamespace order by relation,conname",functions:"select oid::regprocedure::text as signature,pg_get_functiondef(oid) as definition,(select jsonb_agg(jsonb_build_object('grantee',case when x.grantee=0 then 'PUBLIC' else pg_get_userbyid(x.grantee) end,'privilege',x.privilege_type,'grantable',x.is_grantable) order by x.grantee,x.privilege_type) from aclexplode(coalesce(proacl,acldefault('f',proowner))) x) as acl from pg_proc where pronamespace='public'::regnamespace order by signature",views:"select viewname,definition from pg_views where schemaname='public' order by viewname",policies:"select tablename,policyname,permissive,roles,cmd,qual,with_check from pg_policies where schemaname='public' order by tablename,policyname"};
 const out={};for(const[k,q]of Object.entries(sql))out[k]=(await c.query(q)).rows;return out;
}
const out={environment:config,postgres:(await c.query('select version() v')).rows[0].v,profile:'c3field_integrity_disposable_pg17_v1',synthetic_only:true,migrations:[],replays:[]};
try{
 for(const name of migrations){const text=readFileSync(new URL('supabase/migrations/'+name,root),'utf8');out.migrations.push({name,sha256:hash(text)});}
 for(let n=1;n<=2;n++){
  await reset();await c.query(read('bootstrap.sql'));const before=await snapshot();
  for(const m of out.migrations)await c.query(readFileSync(new URL('supabase/migrations/'+m.name,root),'utf8'));
  const after=await snapshot();writeFileSync(new URL('catalog-'+n+'.json',import.meta.url),JSON.stringify(after,null,2)+'\n');
  const checksum=hash(JSON.stringify(after));
  for(const m of out.migrations)await c.query(readFileSync(new URL('supabase/migrations/'+m.name,root),'utf8'));
  assert.deepEqual(await snapshot(),after);
  await c.query(read('../r01/rollback.sql'));await c.query(read('../r02/rollback.sql'));
  const rolled=await snapshot();assert.deepEqual(rolled,before);
  out.replays.push({replay:n,catalog_sha256:checksum,baseline_sha256:hash(JSON.stringify(before)),rollback_sha256:hash(JSON.stringify(rolled)),migration_replay:'PASS',rollback:'PASS'});
 }
 assert.equal(out.replays[0].catalog_sha256,out.replays[1].catalog_sha256);out.result='PASS';
 // Separate observation of raw historical source replay. Never treat a fixture as that history.
 await reset();await c.query('create role anon;create role authenticated;create role service_role nologin bypassrls;create schema extensions;create extension pgcrypto with schema extensions;');
 for(const name of readdirSync(new URL('supabase/migrations/',root)).filter(x=>/^\d+.*\.sql$/.test(x)).sort()){
  try{await c.query('begin');await c.query(readFileSync(new URL('supabase/migrations/'+name,root),'utf8'));await c.query('commit');}
  catch(e){await c.query('rollback');out.historical_source_replay={standing:'HLD',first_failed_file:name,code:e.code,message:e.message,detail:e.detail||null};break;}
 }
}catch(e){out.result='FAIL';out.error=e.stack;process.exitCode=1;}
finally{await reset();writeFileSync(new URL('replay-results.json',import.meta.url),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out));await c.end();}
