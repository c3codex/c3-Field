const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {Client}=require('C:/c3-lapzuli-013-testtools/node_modules/pg');
const {spawnSync}=require('child_process');
const root=__dirname,bin='C:/c3-lapzuli-013-testtools/node_modules/@embedded-postgres/windows-x64/native/bin';
const data=path.join(root,'test-data-'+Date.now());
function run(exe,args){const r=spawnSync(path.join(bin,exe+'.exe'),args,{encoding:'utf8',windowsHide:true,stdio:'ignore'});if(r.status!==0)throw Error(exe+' failed: '+r.status);}
if(!fs.existsSync(data))run('initdb',['-D',data,'-U','postgres','-A','trust','--encoding=UTF8','--locale=C']);
if(!fs.existsSync(path.join(data,'postmaster.pid')))run('pg_ctl',['-D',data,'-l',path.join(root,'postgres.log'),'-o','-h 127.0.0.1 -p 55439','-w','start']);
const c=new Client({host:'127.0.0.1',port:55439,user:'postgres',database:'postgres'});
let pass=0;
async function check(name,f){await c.query('begin');try{await f();pass++;console.log('PASS '+name);}finally{await c.query('rollback');}}
const q=s=>c.query(s);
const req={relationship_key:'owner',env_key:'env',envpac_key:'ep'};
async function call(extra={}){return (await c.query('select resolve_my_env_owner_portability_v1($1::jsonb) r',[JSON.stringify({...req,...extra})])).rows[0].r;}
async function pac(key='a',type='individual',owner='owner',env='env',meta=null){
 await c.query(`insert into c3_pac(pac_key,envpac_key,pac_type,owner_subject_type,owner_subject_key,owner_environment_key,registration_protocol,registered_at,registration_sha256,boundary_evaluation_key,registrar_role_call_key,metadata) values($1,'ep','c3WebPac',$2,$3,$4,'registrar_v1',now(),'hash',$1,$1,$5)`,[key,type,owner,env,meta?{ownership_model:meta}:{}]);
 await c.query("insert into c3_pac_boundary_evaluation values($1,$1,'hash',$2,$3,$4,'PASS')",[key,type,owner,env]);
 await c.query("insert into c3_pac_registration_receipt values($1,'hash',$1,$1,'registered')",[key]);
}
const transfer={action:'transfer_custody',confirmed_custody_received:true,target_custodian_type:'individual',target_custodian_key:'receiver',target_custody_provider:'fixture',target_custody_uri:'fixture://ep',pac_custody:{a:{custody_provider:'fixture',custody_uri:'fixture://a'},b:{custody_provider:'fixture',custody_uri:'fixture://b'}}};
(async()=>{try{
 await c.connect();await q(fs.readFileSync(path.join(root,'fixtures.sql'),'utf8'));
 await q(fs.readFileSync(path.join(root,'baseline.sql'),'utf8'));
 await check('baseline reproduces missing-header-metadata defect',async()=>{await pac();assert.equal((await call()).owned_pac_count,0);});
 await q(fs.readFileSync(path.join(root,'candidate.sql'),'utf8'));
 await check('registered individual header, absent metadata: count manifest relations',async()=>{await pac();await q("insert into c3_pac_relation values('rel','a')");let r=await call();assert.equal(r.owned_pac_count,1);assert.equal(r.manifest.owned_pacs.length,1);assert.equal(r.manifest.owned_pac_relations.length,1);assert.equal(r.non_owned_reference_count,0);});
 await check('matching header and metadata',async()=>{await pac('a','individual','owner','env',{owner_subject_type:'individual',owner_subject_key:'owner'});assert.equal((await call()).owned_pac_count,1);});
 for(const [type,owner] of [['individual','foreign'],['system','c3_field'],['initiative','initiative']])await check('foreign reference excluded '+type,async()=>{await pac('a',type,owner,null);const r=await call();assert.equal(r.owned_pac_count,0);assert.equal(r.non_owned_reference_count,1);assert.equal(r.manifest.owned_pacs.length,0);assert.equal((await call(transfer)).standing,'held');});
 await check('contradictory metadata holds all actions',async()=>{await pac('a','individual','owner','env',{owner_subject_type:'individual',owner_subject_key:'foreign'});for(const action of ['preview','export','transfer_custody'])assert.equal((await call({action})).standing,'held');assert.equal((await q('select count(*) n from c3_my_env_owner_lifecycle_receipt')).rows[0].n,'0');});
 for(const condition of ["revoked_at=now()","expires_at=now()-interval '1 second'","standing='revoked'","scope='{}'"])await check('invalid export grant '+condition,async()=>{await pac();await q('update c3_envpac_access_grant set '+condition);assert.equal((await call({action:'export'})).reason,'owner_export_right_unresolved');});
 await check('missing export grant',async()=>{await q('delete from c3_envpac_access_grant');assert.equal((await call()).standing,'held');});
 for(const extra of [{env_key:'wrong'},{envpac_key:'wrong'},{relationship_key:'wrong'}])await check('wrong context '+JSON.stringify(extra),async()=>assert.equal((await call(extra)).standing,'held'));
 await check('header owner environment mismatch',async()=>{await pac('a','individual','owner','wrong');assert.equal((await call()).standing,'held');});
 await check('missing registration receipt holds',async()=>{await pac();await q('delete from c3_pac_registration_receipt');assert.equal((await call()).standing,'held');});
 await check('boundary owner mismatch holds',async()=>{await pac();await q("update c3_pac_boundary_evaluation set owner_subject_key='foreign'");assert.equal((await call()).standing,'held');});
 await check('legacy metadata remains owned',async()=>{await q(`insert into c3_pac(pac_key,envpac_key,metadata) values('legacy','ep','{"ownership_model":{"owner_subject_type":"individual","owner_subject_key":"owner"}}')`);assert.equal((await call()).owned_pac_count,1);});
 await check('membership and custody alone never own',async()=>{await q("insert into c3_pac(pac_key,envpac_key,custodian_subject_type,custodian_subject_key) values('legacy','ep','individual','owner')");assert.equal((await call()).owned_pac_count,0);});
 await check('preview idempotent without owner mutation',async()=>{await pac();const a=await call(),b=await call();assert.deepEqual(a,b);assert.equal((await q('select count(*) n from c3_my_env_owner_lifecycle_receipt')).rows[0].n,'0');});
 await check('export receipt has complete qualified manifest',async()=>{await pac();let r=await call({action:'export'});assert.equal(r.standing,'export_ready');assert.equal(r.manifest.owned_pacs.length,1);assert.equal((await q('select count(*) n from c3_my_env_owner_lifecycle_receipt')).rows[0].n,'1');assert.equal((await q("select custodian_subject_key from c3_pac where pac_key='a'")).rows[0].custodian_subject_key,null);});
 await check('per-PAC custody map requires header-owned PAC',async()=>{await pac();assert.equal((await call({...transfer,pac_custody:{}})).reason,'complete_per_owned_pac_custody_map_required');});
 await check('incomplete second target leaves no partial mutation',async()=>{await pac();await pac('b');assert.equal((await call({...transfer,pac_custody:{a:transfer.pac_custody.a,b:{}}})).reason,'per_owned_pac_custody_target_incomplete');assert.equal((await q('select count(*) n from c3_pac where custodian_subject_key is not null')).rows[0].n,'0');});
 await check('transfer receipt and lineage preserve owner',async()=>{await pac();assert.equal((await call(transfer)).standing,'custody_transferred');const p=(await q("select * from c3_pac where pac_key='a'")).rows[0];assert.equal(p.owner_subject_key,'owner');assert.equal(p.custodian_subject_key,'receiver');assert.equal(p.metadata.lineage_preserved,true);assert.ok(p.metadata.prior_manifest_sha256);});
 await check('mid-transfer exception rolls back custody and receipt atomically',async()=>{await pac();await pac('b');await q(`create function fixture_fail() returns trigger language plpgsql as $$begin if new.pac_key='b' then raise exception 'fixture failure';end if;return new;end$$;create trigger fixture_fail before update on c3_pac for each row execute function fixture_fail()`);await q('savepoint effect');await assert.rejects(()=>call(transfer),/fixture failure/);await q('rollback to effect');assert.equal((await q('select count(*) n from c3_pac where custodian_subject_key is not null')).rows[0].n,'0');assert.equal((await q('select count(*) n from c3_my_env_owner_lifecycle_receipt')).rows[0].n,'0');});
 console.log('TOTAL PASS '+pass);
 }finally{await c.end();run('pg_ctl',['-D',data,'-m','fast','-w','stop']);}})().catch(e=>{console.error(e);process.exitCode=1;});
