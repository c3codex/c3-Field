import {Client} from 'pg'
import {readFile} from 'node:fs/promises'
import assert from 'node:assert/strict'
const client=new Client({host:'127.0.0.1',port:55485,user:'postgres',database:'postgres'})
await client.connect()
try{
 await client.query(`create schema if not exists extensions; create extension if not exists pgcrypto with schema extensions;
 drop schema if exists public cascade; create schema public;
 create table public.c3_pac(pac_key text primary key,registration_protocol text,source_authority text,envpac_key text,metadata jsonb,is_effective boolean,superseded_at timestamptz,pac_type text,owner_subject_type text,owner_subject_key text,owner_environment_key text,supersedes_pac_key text);
 create table public.c3_pac_member(member_key text primary key,pac_key text,integrity_value text);
 create table public.c3_pac_relation(relation_key text primary key,source_pac_key text);
 create table public.c3_pac_model_binding(binding_key text primary key,pac_key text);
 create table public.c3_envpac(envpac_key text primary key,env_key text,is_effective boolean);
 create table public.measures_persistence_state(persistence_key text primary key,process_key text,oar2_key text,environment_key text,object_type text,standing text,governed_state jsonb,source_sha256 text,lineage jsonb,custody jsonb,evidence jsonb);
 create table public.c3_ci_role_call(role_call_key text primary key,call_class text,caller_role_key text,callee_role_key text,standing text,source_oar2_ref text,presented_sha256 text,result_ref text,evidence jsonb);
 create table public.fixture_seat(qualified boolean); insert into fixture_seat values(true);
 create function public.resolve_institutional_pac_eligibility_v1(text,text) returns jsonb language sql as $$select jsonb_build_object('standing',case when qualified then 'PASS' else 'HLD' end) from public.fixture_seat$$;
 insert into c3_envpac values('c3envpac_field_v0_1','env_c3_field',true),('other_envpac','other_env',true);
 insert into c3_pac values('c3field_root_orientation_c3webpac_v1','legacy_pre_hardening','c3field_public_presentation_authority_v1_2','c3envpac_field_v0_1','{"ownership_model":{"owner_subject_type":"entity","owner_subject_key":"c3_community_partners_dao_llc"}}',true,null,'c3WebPac',null,null,null,null);
 insert into c3_pac_member values('member','c3field_root_orientation_c3webpac_v1','retained-original-integrity');`)
 await client.query(await readFile(new URL('./legacy-succession.candidate.sql',import.meta.url),'utf8'))
 const successor={pac_key:'c3field_field_of_possibility_c3webpac_v1',supersedes_pac_key:'c3field_root_orientation_c3webpac_v1',envpac_key:'c3envpac_field_v0_1',pac_type:'c3WebPac',owner_subject_type:'institution',owner_subject_key:'c3_community_partners_dao_llc',owner_environment_key:'fixture_institution_environment',metadata:{legacy_succession_qualification_key:'fixture-qualified-succession'}}
 const resolve=async(p=successor,lock=false)=>(await client.query('select public.c3_validate_pac_supersession_v1($1::jsonb,$2) result',[JSON.stringify(p),lock])).rows[0].result
 let count=0;const check=(name,result,reason)=>{assert.equal(result.reason||result.standing,reason,name);console.log('PASS '+name);count++}
 check('legacy requires qualified evidence',await resolve(),'exact_legacy_succession_qualification_required')
 await client.query(`insert into measures_persistence_state values('fixture-qualified-succession','governed_object_passage_process_v4','oar2_c3field_field_of_possibility_production_20261124_001','env_c3_field','legacy_pac_succession_qualification','qualified_for_exact_succession',jsonb_build_object('predecessor_snapshot',public.c3field_legacy_predecessor_snapshot_v1(),'successor_sha256',encode(extensions.digest(convert_to($1::jsonb::text,'UTF8'),'sha256'),'hex'),'owner_resolution',jsonb_build_object('source_owner_type','entity','source_owner_key','c3_community_partners_dao_llc','owner_subject_type','institution','owner_subject_key','c3_community_partners_dao_llc','owner_environment_key','fixture_institution_environment')),encode(extensions.digest(convert_to(public.c3field_legacy_predecessor_snapshot_v1()::text,'UTF8'),'sha256'),'hex'),'{}','{"immutable_snapshot_reference":"fixture-only-retained-snapshot"}','{"registrar_qualification_receipt":"fixture-only-not-native-acceptance"}')`,[JSON.stringify(successor)])
 await client.query(`update measures_persistence_state set lineage=jsonb_build_object('predecessor_pac_key',$1::text,'successor_pac_key',$2::text)`,[successor.supersedes_pac_key,successor.pac_key])
 check('unbacked Registrar reference cannot qualify transition',await resolve(),'legacy_succession_registrar_receipt_unresolved')
 await client.query(`insert into c3_ci_role_call select 'fixture-only-not-native-acceptance','oar1_return','c3_generative_ci_v1','c3_registrar_ci_v1','RETURNED',oar2_key,source_sha256,persistence_key,jsonb_build_object('successor_sha256',governed_state->>'successor_sha256') from measures_persistence_state`)
 check('exact evidence-qualified transition',await resolve(),'PASS')
 check('different successor remains held',await resolve({...successor,pac_key:'unrelated_successor'}),'superseded_pac_not_hardened')
 check('changed successor bytes remain held',await resolve({...successor,version:'changed'}),'exact_legacy_succession_binding_mismatch')
 await client.query(`update c3_pac_member set integrity_value='drift'`)
 check('predecessor member drift',await resolve(),'exact_legacy_succession_binding_mismatch')
 await client.query(`update c3_pac_member set integrity_value='retained-original-integrity'; update fixture_seat set qualified=false`)
 check('institutional eligibility preserved',await resolve(),'HLD_INSTITUTIONAL_SEAT_REQUIRED')
 await client.query(`update fixture_seat set qualified=true; update measures_persistence_state set standing='withdrawn'`)
 check('withdrawn qualification',await resolve(),'exact_legacy_succession_qualification_required')
 await client.query(`update measures_persistence_state set standing='qualified_for_exact_succession',evidence='{}'`)
 check('missing Registrar receipt',await resolve(),'exact_legacy_succession_binding_mismatch')
 await client.query(`update measures_persistence_state set evidence='{"registrar_qualification_receipt":"fixture-only-not-native-acceptance"}'`)
 const before=(await client.query('select public.c3field_legacy_predecessor_snapshot_v1() snapshot')).rows[0].snapshot
 check('locked finalization preflight',await resolve(successor,true),'PASS')
 assert.deepEqual((await client.query('select public.c3field_legacy_predecessor_snapshot_v1() snapshot')).rows[0].snapshot,before);console.log('PASS predecessor unchanged');count++
 await client.query('begin');await resolve(successor,true)
 const concurrent=new Client({host:'127.0.0.1',port:55485,user:'postgres',database:'postgres'});await concurrent.connect()
 try{await concurrent.query(`set lock_timeout='150ms'`);await assert.rejects(concurrent.query(`update c3_pac_member set integrity_value='concurrent-drift'`),e=>e.code==='55P03');console.log('PASS concurrent member drift blocked');count++}finally{await concurrent.end();await client.query('rollback')}
 await client.query(`insert into c3_pac values('hardened_prior','registrar_v1','existing','c3envpac_field_v0_1','{}',true,null,'c3WebPac','system','existing-owner',null,null)`)
 check('existing hardened succession unchanged',await resolve({pac_key:'ordinary_successor',supersedes_pac_key:'hardened_prior',envpac_key:'c3envpac_field_v0_1',pac_type:'c3WebPac',owner_subject_type:'system',owner_subject_key:'existing-owner'}),'PASS')
 check('existing hardened owner refusal unchanged',await resolve({pac_key:'ordinary_successor',supersedes_pac_key:'hardened_prior',envpac_key:'c3envpac_field_v0_1',pac_type:'c3WebPac',owner_subject_type:'system',owner_subject_key:'wrong-owner'}),'supersession_owner_mismatch')
 console.log(JSON.stringify({checks:count,scope:'isolated-native-function-fixture-not-registration-or-production-acceptance'}))
}finally{await client.end()}
