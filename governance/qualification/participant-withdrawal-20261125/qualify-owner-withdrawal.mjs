// Disposable local function qualification, never a production connection.
import pg from 'pg'
import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const root=new URL('./',import.meta.url)
const client=new pg.Client({host:'127.0.0.1',port:55485,user:'postgres',database:'postgres'})
const shapes=JSON.parse(readFileSync(new URL('native/table-shapes.json',root),'utf8'))
const results=[]
const candidateMode=process.argv.includes('--candidate')
const record=(name,pass,detail)=>{results.push({name,standing:pass?'PASS':'FAIL',detail});console.log((pass?'PASS ':'DEFICIENCY ')+name)}
await client.connect()
async function insert(table,values){const keys=Object.keys(values);await client.query(`insert into public.${table} (${keys.join(',')}) values (${keys.map((_,i)=>'$'+(i+1)).join(',')})`,Object.values(values))}
async function reset(){
 await client.query(shapes.map(x=>`truncate public.${x.table_name}`).join(';'))
 for(const [env,ep,owner] of [['env-a','ep-a','owner-a'],['env-b','ep-b','owner-b']]){
  await insert('c3_environment',{env_key:env,environment_class:'c3me_individual_environment',is_active:true,metadata:{}})
  await insert('c3_envpac',{envpac_key:ep,env_key:env,owner_subject_type:'individual',owner_subject_key:owner,is_effective:true,portable:true,metadata:{}})
  await insert('crs_relationship',{relationship_key:owner,is_active:true,metadata:{}})
  await insert('c3_envpac_access_grant',{grant_key:'grant-'+owner,envpac_key:ep,subject_type:'individual',subject_key:owner,relation_role:'owner',standing:'active',scope:{rights:['export','revoke']},metadata:{}})
  await insert('c3_pac',{pac_key:'pac-'+owner,envpac_key:ep,pac_type:'ProfilePAC',registration_protocol:'legacy_pre_hardening',is_effective:true,metadata:{ownership_model:{owner_subject_type:'individual',owner_subject_key:owner},custody_model:{custody_class:'personal_pac_custody'},profile_projection:{owner_authorized:true}},owner_subject_type:'individual',owner_subject_key:owner,custodian_subject_type:'individual',custodian_subject_key:owner,custody_uri:'fixture://retained/'+owner})
  await insert('c3_env_runtime_session',{session_key:env==='env-a'?'11111111-1111-4111-8111-111111111111':'22222222-2222-4222-8222-222222222222',env_key:env,envpac_key:ep,subject_type:'individual',subject_key:owner,standing:'active',metadata:{}})
 }
 for(const [key,source,target] of [['affected','owner-a','owner-b'],['unaffected','owner-b','owner-c']])await insert('c3_env_native_connection',{connection_key:key,source_relationship_key:source,target_relationship_key:target,standing:'active',metadata:{}})
 await client.query(`truncate fixture_current_history;insert into fixture_current_history values('historic-a','owner-a','retained'),('historic-b','owner-b','retained')`)
}
const request={relationship_key:'owner-a',env_key:'env-a',envpac_key:'ep-a',disposition:'retain_c3_field_custody'}
const invoke=async(name,body)=>(await client.query(`select public.${name}($1::jsonb) result`,[JSON.stringify(body)])).rows[0].result
try{
 await client.query('drop schema if exists public cascade; create schema public; create schema if not exists extensions; create extension if not exists pgcrypto with schema extensions')
 for(const shape of shapes)await client.query(`create table public.${shape.table_name} (${shape.columns})`)
 await client.query(`alter table c3_my_env_owner_lifecycle_receipt alter receipt_key set default gen_random_uuid();create table fixture_current_history(evidence_key text,owner_key text,standing text)`)
 for(const name of ['resolve_my_env_owner_portability_v1','terminate_my_env_owner_v1'])await client.query(readFileSync(new URL('native/'+name+'.sql',root),'utf8'))
 if(candidateMode)await client.query(readFileSync(new URL('terminate-replay.candidate.sql',root),'utf8'))
 await reset()
 let out=await invoke('terminate_my_env_owner_v1',{...request,relationship_key:'owner-b'})
 record('cross-owner native context refused',out.standing==='held'&&out.reason==='active_owner_environment_unresolved',out)
 out=await invoke('terminate_my_env_owner_v1',{...request,relationship_key:'c3_field'})
 record('system identity cannot terminate individual context',out.standing==='held',out)
 out=await invoke('resolve_my_env_owner_portability_v1',{...request,action:'preview',relationship_key:'owner-b'})
 record('cross-owner portable manifest refused',out.standing==='held',out)
 const pacBefore=(await client.query(`select to_jsonb(p) row from c3_pac p where pac_key='pac-owner-a'`)).rows[0].row
 const historyBefore=(await client.query(`select * from fixture_current_history order by evidence_key`)).rows
 out=await invoke('terminate_my_env_owner_v1',request)
 record('individual owner withdrawal succeeds',out.standing==='terminated',{standing:out.standing,receipt:!!out.termination_receipt_key})
 record('individual PAC ownership custody and projection metadata not confiscated',JSON.stringify((await client.query(`select to_jsonb(p) row from c3_pac p where pac_key='pac-owner-a'`)).rows[0].row)===JSON.stringify(pacBefore),'exact PAC row comparison')
 record('historical CURRENT evidence untouched by function',JSON.stringify((await client.query(`select * from fixture_current_history order by evidence_key`)).rows)===JSON.stringify(historyBefore),'synthetic sentinel table; real CURRENT triggers not reproduced')
 const connections=(await client.query(`select connection_key,standing from c3_env_native_connection order by connection_key`)).rows
 record('unaffected relationship remains active',connections.find(x=>x.connection_key==='unaffected').standing==='active',connections)
 record('affected relationship revoked',connections.find(x=>x.connection_key==='affected').standing==='revoked',connections)
 const receiptCount=Number((await client.query(`select count(*) from c3_my_env_owner_lifecycle_receipt`)).rows[0].count)
 out=await invoke('terminate_my_env_owner_v1',request)
 record('sequential replay does not duplicate termination',Number((await client.query(`select count(*) from c3_my_env_owner_lifecycle_receipt`)).rows[0].count)===receiptCount,{standing:out.standing,reason:out.reason})
 out=await invoke('resolve_my_env_owner_portability_v1',{...request,action:'preview'})
 record('post-withdrawal recovery available through same service',out.standing==='resolved',{standing:out.standing,reason:out.reason,note:'current export grant is revoked; HTTP owner session also revoked'})
 await reset()
 out=await invoke('resolve_my_env_owner_portability_v1',{...request,action:'export'})
 record('pre-withdrawal portability preserves owned PAC',out.standing==='export_ready'&&out.manifest.owned_pacs.length===1,{standing:out.standing,count:out.manifest?.owned_pacs?.length})
 out=await invoke('terminate_my_env_owner_v1',{...request,disposition:'portable_export',portability_receipt_key:out.receipt_key})
 record('receipted export permits withdrawal',out.standing==='terminated',{standing:out.standing})
 await reset()
 await client.query(`update c3_envpac_access_grant set scope='{"rights":["export"]}' where subject_key='owner-a'`)
 out=await invoke('terminate_my_env_owner_v1',request)
 record('missing owner revoke right refuses effect',out.standing==='held'&&Number((await client.query(`select count(*) from c3_my_env_owner_lifecycle_receipt`)).rows[0].count)===0,out)
 await reset()
 await client.query(`create function fixture_delay_receipt() returns trigger language plpgsql as $$begin perform pg_sleep(0.3);return new;end$$;create trigger fixture_delay before insert on c3_my_env_owner_lifecycle_receipt for each row execute function fixture_delay_receipt()`)
 const simultaneous=new pg.Client({host:'127.0.0.1',port:55485,user:'postgres',database:'postgres'});await simultaneous.connect()
 try{
  const both=await Promise.all([invoke('terminate_my_env_owner_v1',request),simultaneous.query('select public.terminate_my_env_owner_v1($1::jsonb) result',[JSON.stringify(request)]).then(r=>r.rows[0].result)])
  const count=Number((await client.query(`select count(*) from c3_my_env_owner_lifecycle_receipt where action='terminate'`)).rows[0].count)
  record('concurrent replay does not duplicate termination',count===1,{count,standings:both.map(x=>x.standing),note:'isolated delay exposes overlapping requests; native receipt table has no unique termination key'})
 }finally{await simultaneous.end();await client.query('drop trigger fixture_delay on c3_my_env_owner_lifecycle_receipt')}
 await reset()
 // REVOKE does not inspect the review digest. This stub is isolated and cannot qualify AUTHORIZE.
 await client.query(`create function public.c3_pac_review_sha256_v1(text) returns text language sql as $$select repeat('b',64)$$`)
 await client.query(readFileSync(new URL('native/projection-withdrawal.sql',root),'utf8'))
 const project=async(owner)=>(await client.query(`select public.c3_pac_set_personal_encounter_projection_v1('pac-owner-a',$1,'REVOKE','c3envpac_c2me_v0_1','c3field_only') result`,[owner])).rows[0].result
 out=await project('owner-b');record('cross-owner projection withdrawal refused',out.standing==='DNR',out)
 out=await project('owner-a');record('legacy owner projection withdrawal succeeds',out.encounter_projection_standing==='REVOKED'&&out.authorized_by_owner===false,out)
 await project('owner-a');record('legacy projection replay does not add records',Number((await client.query(`select count(*) from c3_pac where pac_key='pac-owner-a'`)).rows[0].count)===1,'same PAC retained; REVOKE remains REVOKE')
 await client.query(`update c3_pac set registration_protocol='registrar_v1' where pac_key='pac-owner-a'`)
 await client.query(readFileSync(new URL('native/hardened-immutability.sql',root),'utf8'))
 await client.query(`create trigger native_hardened_guard before update or delete on c3_pac for each row execute function c3_hardened_pac_immutable_guard_v1()`)
 try{out=await project('owner-a');record('hardened owner projection withdrawal succeeds',out.encounter_projection_standing==='REVOKED',out)}catch(error){record('hardened owner projection withdrawal succeeds',false,{error:error.message,note:'actual native projection body plus actual immutable trigger; no Registrar bypass'})}
 const report={scope:'isolated-installed-function-bodies-with-synthetic-rows-no-native-registration-or-production-acceptance',limitations:['No production participants used','Native constraints and triggers are not cloned','Historical CURRENT check is a sentinel, not actual accrual qualification','Public FREE and restoration require separate native mechanisms'],results}
 writeFileSync(new URL(candidateMode?'owner-withdrawal.candidate-isolated.json':'owner-withdrawal.isolated.json',root),JSON.stringify({...report,candidateMode},null,2)+'\n')
 assert.equal(results.filter(x=>x.standing==='FAIL').length,candidateMode?2:3,'expected discoveries: recovery denial, concurrent duplicate (baseline only) and hardened projection refusal')
}finally{await client.end()}
