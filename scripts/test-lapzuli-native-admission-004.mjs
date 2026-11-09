// LOCAL ONLY. Actual admission/Current/operator SQL; synthetic session and
// independently scoped future-effect fixtures are never production proof.
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {createHash,randomUUID} from 'node:crypto'
import pg from 'pg'
const root=new URL('../',import.meta.url),folder='docs/oar/lapzuli-occurrence-003/'
const schema=JSON.parse(await readFile(new URL(folder+'native-schema.fixture.json',root),'utf8'))
const source=JSON.parse(await readFile(new URL(folder+'source-registry.fixture.json',root),'utf8'))
const config={host:'127.0.0.1',port:55432,user:'agent',database:'lapzuli_admission_004_'+Date.now()}
const bootstrap=new pg.Client({...config,database:'postgres'});await bootstrap.connect()
await bootstrap.query('create database "'+config.database+'"');await bootstrap.end()
const db=new pg.Client(config);await db.connect()
const qi=x=>'"'+x.replaceAll('"','""')+'"'
const hash=x=>createHash('sha256').update(x).digest('hex')
const tables=[...new Set(schema.columns.map(c=>c.table))]
const skip=[];let assertions=0
const check=(v,message)=>{assert.ok(v,message);assertions++}
const defaults=type=>type==='uuid'?randomUUID():type.includes('timestamp')?new Date().toISOString():type==='date'?'2000-01-01':
  type==='jsonb'?{}:type==='boolean'?false:type.includes('integer')||type==='bigint'||type==='numeric'?1:'fixture_only'
async function insert(table,row){
  const value={...row}
  for(const col of schema.columns.filter(c=>c.table===table&&c.not_null&&c.default===null))
    if(value[col.column]===undefined)value[col.column]=defaults(col.type)
  const keys=Object.keys(value)
  try{return await db.query('insert into public.'+qi(table)+'('+keys.map(qi).join(',')+') values('+keys.map((_,i)=>'$'+(i+1)).join(',')+') returning *',keys.map(k=>
    schema.columns.find(c=>c.table===table&&c.column===k)?.type==='jsonb'&&value[k]!==null?JSON.stringify(value[k]):value[k]))}
  catch(error){throw Error('Fixture insert '+table+': '+error.message,{cause:error})}
}
const instance='registrar_lapzuli_native_occurrence_claim_binder_codex_003',oar='oar2_registrar_lapzuli_native_occurrence_claim_binder_chazz_20261012_003'
const asset='undrifted_hole_map_bluesky_dist_v1',route='lapzuli_route_'+asset,token='a'.repeat(64),session=randomUUID()
const relationship='fixture_crs_individual',named='fixture_named_individual',personal='fixture_personal_env',pac='fixture_personal_envpac'
let service,second
try{
  for(const table of tables){
    const columns=schema.columns.filter(c=>c.table===table).map(c=>{
      let def=c.default
      if(def?.includes('extensions.uuid_generate_v4'))def='gen_random_uuid()'
      if(def?.includes('nextval'))def=null
      return qi(c.column)+' '+c.type+(def?' default '+def:'')+(c.not_null?' not null':'')
    })
    await db.query('create table public.'+qi(table)+'('+columns.join(',')+')')
  }
  for(const con of schema.constraints.filter(c=>['p','u','c','x'].includes(c.kind)))
    await db.query('alter table public.'+qi(con.table)+' add constraint '+qi(con.name)+' '+con.definition)
  // Foreign keys are added after seeding; all internal selected-relation FKs
  // remain enforced. Dependencies outside this bounded fixture are documented.
  for(const [table,rows] of Object.entries(source))for(const row of rows??[])await insert(table,row)
  for(const process_key of ['oar_custody_resolution_v1','oar_evidence_asset_custody_resolution_v1'])
    await insert('system_process_registry',{process_key,process_status:'active',status:'active',authority_state:'operator_confirmed_registered'})
  await insert('crs_relationship',{relationship_key:relationship,relationship_standing:'c1_C1_persisted',is_active:true,is_test_relationship:false,primary_email:'fixture@example.invalid'})
  await insert('c3_envpac',{envpac_key:pac,env_key:personal,version:'v1',standing:'effective',owner_subject_type:'individual',owner_subject_key:relationship,
    custodian_subject_type:'system',custodian_subject_key:'registry',custody_uri:'fixture:local',custody_provider:'fixture',is_effective:true})
  await insert('c3_envpac',{envpac_key:'c3envpac_c3ops_v0_1',env_key:'env_c3ops',version:'v1',standing:'effective',owner_subject_type:'system',owner_subject_key:'c3ops',
    custodian_subject_type:'system',custodian_subject_key:'registry',custody_uri:'fixture:local',custody_provider:'fixture',is_effective:true})
  await insert('c3_envpac',{envpac_key:'c3envpac_measures_registry_v0_1',env_key:'env_measures_registry',version:'v1',standing:'effective',owner_subject_type:'system',owner_subject_key:'measures_registry',
    custodian_subject_type:'system',custodian_subject_key:'registry',custody_uri:'fixture:local',custody_provider:'fixture',is_effective:true})
  await insert('c3_envpac_access_grant',{grant_key:'fixture_owner',envpac_key:pac,subject_type:'individual',subject_key:relationship,relation_role:'owner',standing:'active'})
  await insert('c3_current_state',{current_state_key:'fixture_current',env_key:personal,state_version:1,standing:'effective',is_current:true,formation_authority_ref:'fixture:authority',created_by:'fixture'})
  await insert('c3_current_evidence_ref',{current_evidence_ref_key:'fixture_current_evidence',current_state_key:'fixture_current',evidence_standing:'accepted',content_hash:'b'.repeat(64),hash_algorithm:'sha256'})
  await insert('c3_named_individual',{named_individual_key:named,first_name:'Fixture',email_reference:'fixture@example.invalid',registry_standing:'held_pending_onboarding_evidence'})
  await insert('c3_operator_standing',{operator_standing_key:'fixture_op044',operator_identifier:'op044',standing:'active',scope:'project_scoped'})
  await insert('c3_named_individual_operator_binding',{relation_key:'fixture_carrier',named_individual_key:named,operator_standing_key:'fixture_op044',standing:'active'})
  await insert('c3_named_individual_crs_binding',{continuity_binding_key:'fixture_continuity',named_individual_key:named,relationship_key:relationship,
    binding_class:'governed_identity_continuity',binding_standing:'active',continuity_role:'primary_current',
    governing_constraint_key:'c1_relational_notchazz_encounter_boundary_v1',determination_process_key:'c1_relational_notchazz_encounter_boundary_v1'})
  for(const [key,env,ep,scope] of [['fixture_personal_operator',personal,pac,'project_operator_personal_environment'],['fixture_c3ops_operator','env_c3ops','c3envpac_c3ops_v0_1','c3ops_operator_read_preflight_workroom_preparation']])
    await insert('c3_environment_operator_binding',{environment_operator_binding_key:key,env_key:env,envpac_key:ep,operator_standing_key:'fixture_op044',carrier_binding_key:'fixture_carrier',
      operator_role:'operator',binding_standing:'active',scope_class:scope,c3me_standing_required:false,determination_process_key:'c1_relational_notchazz_encounter_boundary_v1'})
  await insert('c3_env_runtime_session',{session_key:session,token_sha256:hash(token),env_key:personal,envpac_key:pac,subject_type:'individual',subject_key:relationship,
    standing:'active',expires_at:new Date(Date.now()+3600000).toISOString(),evidence_ref:'fixture_owner'})
  await insert('c3ops_oar_custody_resolution_event',{resolution_event_key:'fixture_prior_return',process_key:'oar_custody_resolution_v1',object_identifier:'prior_oar1',object_type:'oar1',
    related_execution_instance:'registrar_lapzuli_manual_backlog_handoff_codex_002r',integrity_hash:'662f4cd9403c215eb48940be375cb7e3a5c60101605bacb107889d41977e76bb',
    standing:'reviewed_reconciliation_source_only_hld',resolution_status:'resolved',custody_type:'registry_return_manifest',custody_reference:'fixture:prior_return',retrieval_access_rule:'fixture:local'})
  // All FKs between selected production tables are restored, including auth
  // session/owner/identity chains. Historical unrelated row dependencies remain
  // NOT VALID but enforce every new test mutation; production installation is not claimed.
  for(const con of schema.constraints.filter(c=>c.kind==='f')){
    if(!tables.includes(con.referenced_table)){skip.push(con.name);continue}
    await db.query('alter table public.'+qi(con.table)+' add constraint '+qi(con.name)+' '+con.definition+' not valid')
  }
  for(const table of tables)await db.query('alter table public.'+qi(table)+' enable row level security')
  await db.query('grant usage on schema public to service_role,anon,authenticated; grant select,insert,update on all tables in schema public to service_role')
  // Match observed production Current ACLs: row locks are supported by an
  // existing key-column UPDATE grant, not a general Current mutation grant.
  await db.query('revoke update on public.c3_current_state,public.c3_current_evidence_ref from service_role; grant update(current_state_key) on public.c3_current_state to service_role; grant update(current_evidence_ref_key) on public.c3_current_evidence_ref to service_role')
  for(const [view,definition] of Object.entries(schema.views))await db.query('create view public.'+qi(view)+' with (security_invoker=true) as '+definition)
  await db.query('grant select on public.lapzuli_derivative_execution_view_v1,public.undrifted_distribution_report_v1 to service_role')
  for(const def of Object.values(schema.functions))await db.query(def)
  await db.query(`create function public.resolve_cancom_oar_pickup_v1(text,text,text) returns jsonb language sql as $$select jsonb_build_object('standing','resolved_for_executor','queue_status','executing','oar_key','${oar}','sha256','201e7fb50c3af165a4499c01c443053ddeb6241079f2725c6ce238462772e5df')$$`)
  // Only CanCom pickup is a fixture double. Authentication/Current/operator,
  // source/PAC, admission, claim, consumption/revalidation SQL are real code.
  await db.query(await readFile(new URL(folder+'claim-historical-occurrence.candidate.sql',root),'utf8'))
  const native=await readFile(new URL(folder+'native-admission.candidate.sql',root),'utf8');await db.query(native)
  service=new pg.Client(config);await service.connect();await service.query('set role service_role')
  second=new pg.Client(config);await second.connect();await second.query('set role service_role')
  const admit=async(t=token,flight={})=>(await service.query('select public.resolve_lapzuli_historical_admission_v1($1,$2,$3) result',[t,instance,flight])).rows[0].result
  const actor=async()=>(await service.query('select public.resolve_lapzuli_historical_actor_v1($1) result',[session])).rows[0].result
  check((await actor()).standing==='identity_resolved','actual existing Current/operator resolver establishes fixture identity')
  await assert.rejects(()=>service.query("update public.c3_current_state set standing='forged'"),/permission denied/);assertions++
  check((await admit('b'.repeat(64))).reason==='existing_individual_session_inactive','unknown token cannot use supplied identity')
  check((await admit(hash(token))).reason==='existing_individual_session_inactive','service-readable token digest cannot replace individual token possession')
  check((await admit()).reason==='myenv_lapzuli_identity_passage_capability_inactive_or_unscoped','identity and read/preflight context do not authorize a passage')
  await insert('c3_envpac_capability_grant',{capability_key:'fixture_source_passage',envpac_key:pac,system_key:'c3ops',capability:'lapzuli_distribution',standing:'active',
    scope:{execution_instance:instance,operator_ref:'op044',allowed_asset:asset,allowed_actions:['historical_identity_passage'],expires_at:new Date(Date.now()+3600000).toISOString()}})
  check((await admit()).reason==='separate_exact_effect_grant_unresolved:operator','identity/passage alone cannot publish')
  await db.query("update public.c3_env_runtime_session set revoked_at=now() where session_key=$1",[session])
  check((await actor()).reason==='existing_individual_session_inactive','session revocation honored')
  await db.query('update public.c3_env_runtime_session set revoked_at=null where session_key=$1',[session])
  await db.query("update public.c3_envpac_access_grant set standing='revoked' where grant_key='fixture_owner'")
  check((await actor()).reason==='session_original_owner_grant_inactive_or_mismatched','original owner grant revocation honored')
  await db.query("update public.c3_envpac_access_grant set standing='active' where grant_key='fixture_owner'")
  await db.query("update public.c3_named_individual_crs_binding set binding_standing='held' where continuity_binding_key='fixture_continuity'")
  check((await actor()).standing==='HLD','continuity held is not op044 authentication')
  await db.query("update public.c3_named_individual_crs_binding set binding_standing='active' where continuity_binding_key='fixture_continuity'")
  const caps={},nativeHash=hash(native)
  for(const [role,who] of [['operator','op044'],['notchazz','notchazz'],['registrar','chazz'],['executor','codex']]){
    caps[role]='fixture_effect_'+role
    await insert('c3_envpac_capability_grant',{capability_key:caps[role],envpac_key:'c3envpac_c3ops_v0_1',system_key:'c3ops',capability:'fixture_local_exact_effect_'+role,standing:'active',scope:{
      execution_instance:instance,oar_key:oar,source_oar2_sha256:'201e7fb50c3af165a4499c01c443053ddeb6241079f2725c6ce238462772e5df',role,actor_ref:who,operator_ref:'op044',
      named_individual_key:named,target_operator_binding_key:'fixture_c3ops_operator',target_env_key:'env_c3ops',target_envpac_key:'c3envpac_c3ops_v0_1',
      allowed_asset:asset,allowed_route:route,destination_account_identifier:'undrifted.bsky.social',allowed_actions:['admit_historical_distribution_effect'],
      external_provider_effects_authorized:true,max_new_external_effects:1,native_source_sha256:nativeHash,expires_at:new Date(Date.now()+3600000).toISOString()}})
  }
  check((await admit()).reason==='independently_reviewed_native_installation_unresolved','source tests do not manufacture install review')
  const functionHashes={}
  for(const fn of ['resolve_lapzuli_historical_actor_v1(uuid)','resolve_lapzuli_historical_source_v1(jsonb,text)','resolve_lapzuli_historical_admission_v1(text,text,jsonb)',
    'revalidate_lapzuli_historical_admission_v1(jsonb)','claim_lapzuli_historical_occurrence_v1(text,text,jsonb)','consume_lapzuli_historical_worker_claim_v1(jsonb)',
    'resolve_c1me_current_internal(text)','resolve_c1me_operator_context_internal(text)'])
    functionHashes[fn]=(await db.query("select encode(sha256(convert_to(pg_get_functiondef(to_regprocedure($1)),'UTF8')),'hex') h",['public.'+fn])).rows[0].h
  await insert('system_process_registry',{process_key:'lapzuli_historical_admission_installation_v1',process_status:'active',status:'active',authority_state:'operator_confirmed_registered',
    metadata:{source_sha256:nativeHash,function_hashes:functionHashes,notchazz_effect_review_ref:'fixture_install_review',registrar_effect_review_ref:'fixture_registrar_review',
      installation_oar2_key:'fixture_install_oar',installation_oar2_sha256:'c'.repeat(64)}})
  await insert('c3ops_notchazz_oar_formation_evaluation',{evaluation_key:'fixture_install_review',oar_key:'fixture_install_oar',execution_instance:'fixture_install',
    oar_integrity_sha256:'c'.repeat(64),result:'PASS',standing:'active',authority_created:false,required_predicates:[],unresolved_predicates:[]})
  await insert('c3_ci_role_call',{role_call_key:'fixture_registrar_review',call_class:'execution',caller_role_key:'fixture',callee_role_key:'fixture',source_oar2_ref:'fixture_install_oar',
    presented_sha256:'c'.repeat(64),standing:'RETURNED',evidence:{reviewed_native_source_sha256:nativeHash}})
  check((await admit()).reason==='fresh_native_source_media_provider_evidence_unresolved','caller preflight flags cannot attest provider/source bytes')
  const a=source.measures_publication_distribution_asset[0],r=source.lapzuli_route[0],d=source.measures_publication_derivative_asset[0],c=source.c3_pac.find(p=>p.pac_type==='CampaignPac'),p=source.c3_pac.find(p=>p.pac_type==='PubPac')
  const callrow=(await db.query('select * from public.lapzuli_derivative_execution_view_v1')).rows[0]
  const request={campaign_pac_key:c.pac_key,public_speaking_identity:'unDrifted',source_pubpac_key:p.pac_key,destination_account_key:'bluesky_undrifted',destination_account_identifier:'undrifted.bsky.social',
    dry_run:false,execute:true,publication_object_key:r.publication_object_key,derivative_key:d.derivative_key,distribution_asset_id:asset,channel_key:'bluesky_undrifted',channel_identifier:'undrifted.bsky.social',
    executor_key:'bluesky_api',registered_standing_key:callrow.registered_standing_key,registered_standing:callrow.registered_standing,authority_reference:r.authority_reference,route_key:route,
    operator_confirmed:true,lapzuli_callable:true,idempotency_key:asset+':'+callrow.registered_standing_key,text:a.payload.text,canonical_url:a.payload.canonical_url,image_url:a.payload.image_url,buffer_mode:'shareNow'}
  const requestHash=(await db.query("select encode(sha256(convert_to($1::jsonb::text,'UTF8')),'hex') h",[request])).rows[0].h
  await insert('c3_envpac_capability_grant',{capability_key:'fixture_proof_producer',envpac_key:'c3envpac_c3ops_v0_1',system_key:'c3ops',capability:'fixture_preflight_attestation',standing:'active',
    scope:{execution_instance:instance,oar_key:oar,allowed_asset:asset,allowed_route:route,destination_account_identifier:'undrifted.bsky.social',max_new_external_effects:0,
      allowed_actions:['attest_lapzuli_historical_preflight'],native_source_sha256:nativeHash,expires_at:new Date(Date.now()+3600000).toISOString()}})
  const proof={external_publication_effects:0,source_sha256:d.metadata.source_sha256,media_sha256:a.payload.media.sha256,worker_request_sha256:requestHash,account_handle:'undrifted.bsky.social',
    provider_identity_verified:true,provider_payload_verified:true,producer_capability_ref:'fixture_proof_producer'}
  const proofHash=(await db.query("select encode(sha256(convert_to($1::jsonb::text,'UTF8')),'hex') h",[proof])).rows[0].h
  await insert('c3ops_oar_custody_resolution_event',{resolution_event_key:'fixture_fresh_proof',process_key:'oar_evidence_asset_custody_resolution_v1',object_identifier:'fixture_proof',object_type:'evidence',
    intended_function:'lapzuli_historical_preflight',related_oar2:oar,related_execution_instance:instance,standing:'observed',resolution_status:'resolved',integrity_hash:proofHash,
    custody_type:'registry_receipt_manifest',custody_reference:'fixture:preflight',retrieval_access_rule:'fixture:local',metadata:proof})
  const flight={standing:'EXECUTABLE',prepared_worker_request:request,native_preflight_evidence_key:'fixture_fresh_proof'}
  const admitted=await admit(token,flight);check(admitted.standing==='admitted',JSON.stringify(admitted))
  check(!JSON.stringify(admitted).includes(token)&&!JSON.stringify(admitted).includes(hash(token)),'no raw token or token digest in admission/evidence')
  check((await admit(token,{...flight,prepared_worker_request:{...request,text:'drift'}})).reason==='prepared_payload_differs_from_registry','payload drift held')
  async function negative(update,restore,reason){
    await db.query(update)
    try{const result=await admit(token,flight);check(result.standing==='HLD'&&result.reason===reason,JSON.stringify(result))}
    finally{await db.query(restore)}
  }
  await negative("update public.c3_env_runtime_session set expires_at=now()-interval '1 second'",
    "update public.c3_env_runtime_session set expires_at=now()+interval '1 hour'",'existing_individual_session_inactive')
  await negative("update public.c3_envpac_access_grant set expires_at=now()-interval '1 second' where grant_key='fixture_owner'",
    "update public.c3_envpac_access_grant set expires_at=null where grant_key='fixture_owner'",'session_original_owner_grant_inactive_or_mismatched')
  await negative("update public.c3_environment_operator_binding set revoked_at=now() where environment_operator_binding_key='fixture_c3ops_operator'",
    "update public.c3_environment_operator_binding set revoked_at=null where environment_operator_binding_key='fixture_c3ops_operator'",'existing_c3ops_operator_relation_unresolved')
  await negative("update public.c3_envpac_capability_grant set standing='inactive' where capability_key='fixture_source_passage'",
    "update public.c3_envpac_capability_grant set standing='active' where capability_key='fixture_source_passage'",'myenv_lapzuli_identity_passage_capability_inactive_or_unscoped')
  await negative("update public.c3_envpac_capability_grant set standing='revoked' where capability_key='fixture_effect_operator'",
    "update public.c3_envpac_capability_grant set standing='active' where capability_key='fixture_effect_operator'",'separate_exact_effect_grant_unresolved:operator')
  await negative("update public.c3_envpac_capability_grant set scope=jsonb_set(scope,'{expires_at}','\"infinity\"'::jsonb) where capability_key='fixture_effect_operator'",
    "update public.c3_envpac_capability_grant set scope=jsonb_set(scope,'{expires_at}',to_jsonb((now()+interval '1 hour')::text)) where capability_key='fixture_effect_operator'",'separate_exact_effect_grant_unresolved:operator')
  await negative("update public.c3_pac set is_effective=false where pac_type='CampaignPac'",
    "update public.c3_pac set is_effective=true where pac_type='CampaignPac'",'current_pac_source_derivative_route_or_release_mismatch')
  await negative("update public.lapzuli_outlet_qualification set standing='unqualified'",
    "update public.lapzuli_outlet_qualification set standing='qualified_with_constraints'",'current_outlet_qualification_constraints_unresolved')
  await negative("update public.lapzuli_object_profile set ai_disclosure_available=false",
    "update public.lapzuli_object_profile set ai_disclosure_available=true",'current_outlet_qualification_constraints_unresolved')
  await negative("update public.c3ops_oar_custody_resolution_event set created_at=now()-interval '61 seconds' where resolution_event_key='fixture_fresh_proof'",
    "update public.c3ops_oar_custody_resolution_event set created_at=now() where resolution_event_key='fixture_fresh_proof'",'fresh_native_source_media_provider_evidence_unresolved')
  await negative("update public.c3_envpac_capability_grant set standing='revoked' where capability_key='fixture_proof_producer'",
    "update public.c3_envpac_capability_grant set standing='active' where capability_key='fixture_proof_producer'",'native_preflight_producer_authority_unresolved')
  await negative("update public.c3ops_notchazz_oar_formation_evaluation set result='HOLD' where evaluation_key='fixture_install_review'",
    "update public.c3ops_notchazz_oar_formation_evaluation set result='PASS' where evaluation_key='fixture_install_review'",'native_installer_role_review_evidence_unresolved')
  await db.query("update public.c3ops_asset_record set license_or_use_rights='fixture_revoked' where asset_key='undrifted_hole_map_article_v1'")
  check((await admit(token,flight)).reason==='current_source_media_rights_or_custody_mismatch','rights revocation before claim held')
  await db.query("update public.c3ops_asset_record set license_or_use_rights='operator_approved_publication_use' where asset_key='undrifted_hole_map_article_v1'")
  const claim=async(c=service)=>(await c.query('select * from public.claim_lapzuli_historical_occurrence_v1($1,$2,$3)',[token,instance,flight])).rows[0]
  const standard=async(c=service)=>(await c.query('select * from public.claim_lapzuli_distribution_execution_v1($1,$2,$3,$4,$5)',[asset,'bluesky_api','bluesky_undrifted',route,'op044'])).rows[0]
  const bound=await claim();check(bound.claimed===true,JSON.stringify(bound))
  check(bound.binding.actor_binding.named_individual_key===named,'claim binds actual native actor reference')
  const revalidate=async b=>(await service.query('select public.revalidate_lapzuli_historical_admission_v1($1) result',[b])).rows[0].result
  check((await revalidate({...bound.binding,actor_binding:{...bound.binding.actor_binding,named_individual_key:'forged'}})).standing==='HLD','forged actor metadata does not revalidate')
  check((await revalidate(bound.binding)).standing==='admitted','real persisted actor/source revalidation passes')
  await db.query('update public.c3_env_runtime_session set revoked_at=now() where session_key=$1',[session])
  check((await revalidate(bound.binding)).reason==='existing_individual_session_inactive','session revocation immediately before provider held')
  await db.query('update public.c3_env_runtime_session set revoked_at=null where session_key=$1',[session])
  const consume=async()=>(await service.query('select public.consume_lapzuli_historical_worker_claim_v1($1) result',[{...request,atomic_execution_id:bound.execution_id,historical_occurrence_key:bound.occurrence_key}])).rows[0].result
  check((await consume()).standing==='dispatch_admitted','one-shot worker consumption uses real native revalidation')
  check((await consume()).reason==='historical_worker_claim_already_consumed','no repeat provider admission')
  for(const role of ['anon','authenticated']){
    const denied=new pg.Client(config);await denied.connect();await denied.query('set role '+role)
    await assert.rejects(()=>denied.query('select public.resolve_lapzuli_historical_admission_v1($1,$2,$3)',[token,instance,flight]),/permission denied/);assertions++
    await assert.rejects(()=>denied.query('select public.revalidate_lapzuli_historical_admission_v1($1)',[bound.binding]),/permission denied/);assertions++
    await denied.end()
  }
  const reset=async()=>db.query('truncate public.measures_distribution_execution,public.c3ops_cancom_notification_event')
  await reset();await service.query('begin');check((await claim()).claimed,'historical claim first')
  const racedStandard=standard(second);await service.query('commit');check(!(await racedStandard).claimed,'standard race prevented')
  await reset();await service.query('begin');check((await standard()).claimed,'standard claim first')
  const racedHistorical=claim(second);await service.query('commit');check(!(await racedHistorical).claimed,'historical race prevented')
  check((await db.query('select count(*)::int n from public.c3ops_cancom_notification_event')).rows[0].n===0,'failed claim creates no orphan occurrence')
  await reset()
  await db.query(`create function public.fixture_fail_native_event() returns trigger language plpgsql as $$begin raise exception 'fixture rollback'; end$$;
    create trigger fixture_event_failure before insert on public.c3ops_cancom_notification_event for each row execute function public.fixture_fail_native_event();`)
  await assert.rejects(()=>claim(),/fixture rollback/);assertions++
  check((await db.query('select count(*)::int n from public.measures_distribution_execution')).rows[0].n===0,'actual native admission claim rolls back on notification failure')
  await db.query('drop trigger fixture_event_failure on public.c3ops_cancom_notification_event')
  // Revocation waits on the native actor row lock; after commit it prevents any
  // subsequent effect. No network I/O occurs while the database lock is held.
  await service.query('begin');check((await actor()).standing==='identity_resolved','actor lock acquired')
  let revoked=false
  const revocation=db.query('update public.c3_env_runtime_session set revoked_at=now() where session_key=$1',[session]).then(()=>{revoked=true})
  await second.query('select 1');check(!revoked,'revocation cannot race a held native session lock')
  await service.query('commit');await revocation;check((await actor()).standing==='HLD','post-commit revocation enforced')
  check((await db.query("select count(*)::int n from pg_proc where proname like '%lapzuli_historical%' and prosecdef")).rows[0].n===0,'new functions use invoker rights')
  console.log(JSON.stringify({status:'PASS',assertions,production_columns:schema.columns.length,production_constraints:schema.constraints.length,
    external_dependency_fks_skipped:skip.length,authentication_resolvers:'ACTUAL EXISTING NATIVE SQL; synthetic credential/authority/proof fixtures only',
    provider_calls:0,production_mutations:0,local_database:config.database}))
}finally{
  if(service)await service.end();if(second)await second.end();await db.end()
  const cleanup=new pg.Client({...config,database:'postgres'});await cleanup.connect()
  await cleanup.query('drop database '+qi(config.database));await cleanup.end()
}
