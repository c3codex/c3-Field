// Isolated PostgreSQL only. Never point this test at the connected Registry.
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import pg from 'pg'
const port=Number(process.env.LAPZULI_TEST_PG_PORT||55432)
const config={host:'127.0.0.1',port,user:process.env.LAPZULI_TEST_PG_USER||'agent',database:process.env.LAPZULI_TEST_PG_DATABASE||'postgres'}
const admin=new pg.Client(config);await admin.connect()
const asset='undrifted_hole_map_bluesky_dist_v1',route='lapzuli_route_'+asset
const instance='registrar_lapzuli_native_occurrence_claim_binder_codex_003'
const oar='oar2_registrar_lapzuli_native_occurrence_claim_binder_chazz_20261012_003'
const hash='201e7fb50c3af165a4499c01c443053ddeb6241079f2725c6ce238462772e5df'
let assertions=0
const check=(v,message)=>{assert.ok(v,message);assertions++}
const client=async role=>{const c=new pg.Client(config);await c.connect();await c.query('set role '+role);return c}
const reset=async()=>admin.query('truncate public.measures_distribution_execution,public.c3ops_cancom_notification_event')
const prepared={distribution_asset_id:asset,route_key:route,channel_key:'bluesky_undrifted',channel_identifier:'undrifted.bsky.social',execute:true,dry_run:false,text:'fixture only'}
const preflight={standing:'EXECUTABLE',prepared_worker_request:prepared}
const claim=async(c,flight=preflight,token='a'.repeat(64))=>(await c.query('select * from public.claim_lapzuli_historical_occurrence_v1($1,$2,$3)',[token,instance,flight])).rows[0]
const standard=async c=>(await c.query('select * from public.claim_lapzuli_distribution_execution_v1($1,$2,$3,$4,$5)',[asset,'bluesky_api','bluesky_undrifted',route,'op044'])).rows[0]
try{
  // Dedicated disposable schema/database marker. Refuse a nonempty installation.
  const tables=await admin.query("select count(*)::int n from information_schema.tables where table_schema='public'")
  assert.equal(tables.rows[0].n,0,'Refuse testing against an existing database')
  await admin.query(`do $$begin if not exists(select 1 from pg_roles where rolname='anon') then create role anon; end if;
    if not exists(select 1 from pg_roles where rolname='authenticated') then create role authenticated; end if;
    if not exists(select 1 from pg_roles where rolname='service_role') then create role service_role bypassrls; end if; end$$;
    create table public.c3_envpac_capability_grant(capability_key text primary key,standing text not null,scope jsonb not null);
    create table public.measures_distribution_execution(
      execution_id uuid primary key default gen_random_uuid(),distribution_asset_id text not null,
      executor_key text,channel_key text,execution_status text,execution_mode text,attempt_number integer,
      executed_at timestamptz,published_at timestamptz,platform_post_id text,platform_url text,evidence jsonb,
      error text,source_oar2 text,created_by_actor_class text,created_by_actor_key text,
      approved_by_actor_class text,approved_by_actor_key text,metadata jsonb,optics jsonb,
      created_at timestamptz default now(),updated_at timestamptz default now());
    create table public.c3ops_cancom_notification_event(id uuid primary key default gen_random_uuid(),
      event_key text unique not null,event_type text,source_system text,source_object_type text,
      source_object_key text,actor_key text,standing text,summary text,evidence jsonb);
    alter table public.measures_distribution_execution enable row level security;
    alter table public.c3ops_cancom_notification_event enable row level security;
    grant usage on schema public to service_role,anon,authenticated;
    grant select,insert,update on all tables in schema public to service_role;
    create function public.resolve_cancom_oar_pickup_v1(text,text,text) returns jsonb language sql as
      $$select jsonb_build_object('standing','resolved_for_executor','oar_key','${oar}','sha256','${hash}')$$;`)
  await admin.query(await readFile(new URL('../supabase/migrations/20260928202008_claim_lapzuli_distribution_execution_v1.sql',import.meta.url),'utf8'))
  await admin.query(await readFile(new URL('../docs/oar/lapzuli-occurrence-003/claim-historical-occurrence.candidate.sql',import.meta.url),'utf8'))
  const service=await client('service_role')
  check((await claim(service)).reason==='historical_effect_capability_unresolved:operator','source-only/no effect grants must HOLD')
  const caps={}
  for(const [role,actor] of [['operator','op044'],['notchazz','notchazz'],['registrar','chazz'],['executor','codex']]){
    caps[role]='fixture_'+role
    await admin.query('insert into public.c3_envpac_capability_grant values($1,$2,$3)',[caps[role],'active',{
      execution_instance:instance,oar_key:oar,source_oar2_sha256:hash,actor_ref:actor,role,
      allowed_actions:['admit_historical_distribution_effect'],allowed_asset:asset,allowed_route:route,
      destination_account_identifier:'undrifted.bsky.social',external_provider_effects_authorized:true,
      max_new_external_effects:1,expires_at:new Date(Date.now()+3600000).toISOString(),
    }])
  }
  check((await claim(service)).reason==='native_individual_source_effect_admission_uninstalled','missing verifier must HOLD without metadata fallback')
  const tuple={source_class:'article',source_id:'fixture_article',source_version:'v1',source_sha256:'c'.repeat(64),source_hash_basis:'raw_utf8',
    pubpac_key:'fixture_pubpac',pubpac_version:'v1',pubpac_sha256:'d'.repeat(64),campaignpac_key:'fixture_campaign',campaignpac_version:'v1',campaignpac_sha256:'e'.repeat(64),
    payload_sha256:'f'.repeat(64),media_sha256:'0'.repeat(64),distribution_asset_key:asset,route_key:route,destination_account_identifier:'undrifted.bsky.social',
    release_scope_key:'fixture_exact_release',operator_source_confirmation_key:'fixture_confirmation'}
  // TEST DOUBLE ONLY. Does not implement or assert production actor admission.
  await admin.query(`create function public.resolve_lapzuli_historical_admission_v1(text,text,jsonb)
    returns jsonb language sql as $$select case when $1=repeat('a',64) then
    jsonb_build_object('standing','admitted','individual_authenticated',true,'operator_ref','op044',
    'execution_instance','${instance}','source_oar2','${oar}','capabilities','${JSON.stringify(caps)}'::jsonb,
    'external_effect_limit',1,'actor_evidence_ref','fixture:NOT_REAL_AUTH','prepared_worker_request',$3->'prepared_worker_request',
    'verified_at',clock_timestamp(),'valid_until',clock_timestamp()+interval '60 seconds',
    'effect_tuple','${JSON.stringify(tuple)}'::jsonb) else '{}'::jsonb end$$;`)
  check((await claim(service,preflight,'b'.repeat(64))).claimed===false,'native actor rejection must HOLD')
  const bound=await claim(service)
  check(bound.claimed===true&&bound.binding.source_oar2===oar,'bound claim created')
  const persisted=(await admin.query('select * from public.measures_distribution_execution')).rows[0]
  check(persisted.source_oar2===oar&&persisted.created_by_actor_key==='codex','only new receipt actor/source bound')
  check((await claim(service)).reason==='historical_occurrence_already_recorded','replay does not create a claim')
  check((await admin.query('select count(*)::int n from public.c3ops_cancom_notification_event')).rows[0].n===1,'one occurrence only')
  const workerBody={...prepared,atomic_execution_id:bound.execution_id,historical_occurrence_key:bound.occurrence_key}
  const consume=async body=>(await service.query('select public.consume_lapzuli_historical_worker_claim_v1($1) result',[body])).rows[0].result
  check((await consume({...workerBody,text:'drift'})).standing==='HLD','worker payload drift blocks before provider')
  await admin.query("update public.c3_envpac_capability_grant set standing='revoked' where capability_key='fixture_operator'")
  check((await consume(workerBody)).standing==='HLD','revocation rechecked at worker')
  await admin.query("update public.c3_envpac_capability_grant set standing='active' where capability_key='fixture_operator'")
  check((await consume(workerBody)).reason==='native_worker_individual_source_revalidation_uninstalled','missing current actor/source verifier blocks provider')
  await admin.query(`create function public.revalidate_lapzuli_historical_admission_v1(jsonb) returns jsonb language sql as
    $$select jsonb_build_object('standing','admitted','occurrence_key',$1->>'occurrence_key')$$;`)
  check((await consume(workerBody)).standing==='dispatch_admitted','one worker consumption')
  check((await consume(workerBody)).reason==='historical_worker_claim_already_consumed','worker retry blocked')
  for(const role of ['anon','authenticated']){
    const c=await client(role)
    await assert.rejects(()=>claim(c),/permission denied/);assertions++
    await assert.rejects(()=>c.query('select public.consume_lapzuli_historical_worker_claim_v1($1)',[workerBody]),/permission denied/);assertions++
    await c.end()
  }
  check((await admin.query("select count(*)::int n from pg_proc where proname in ('claim_lapzuli_historical_occurrence_v1','consume_lapzuli_historical_worker_claim_v1') and not prosecdef")).rows[0].n===2,'both invoker rights')
  await reset()
  await admin.query(`create function public.fixture_fail_event() returns trigger language plpgsql as $$begin raise exception 'fixture event failure'; end$$;
    create trigger fixture_event_failure before insert on public.c3ops_cancom_notification_event for each row execute function public.fixture_fail_event();`)
  await assert.rejects(()=>claim(service),/fixture event failure/);assertions++
  check((await admin.query('select count(*)::int n from public.measures_distribution_execution')).rows[0].n===0,'failed event rolls claim back')
  await admin.query('drop trigger fixture_event_failure on public.c3ops_cancom_notification_event')
  // Real concurrent connections test the actual existing advisory lock contract.
  const second=await client('service_role')
  await service.query('begin');check((await claim(service)).claimed===true,'historical wins first transaction')
  const standardPending=standard(second)
  await service.query('commit')
  check((await standardPending).claimed===false,'standard dispatch cannot race historical claim')
  await reset()
  await service.query('begin');check((await standard(service)).claimed===true,'standard wins first transaction')
  const historicalPending=claim(second)
  await service.query('commit')
  check((await historicalPending).claimed===false,'historical does not reclaim standard attempt')
  check((await admin.query('select count(*)::int n from public.c3ops_cancom_notification_event')).rows[0].n===0,'no orphan event on failed claim')
  await admin.query("update public.measures_distribution_execution set created_at=now()-interval '20 minutes'")
  check((await claim(service)).reason==='stale_claim_requires_resolution','existing expired claim remains HOLD')
  check((await admin.query('select execution_status from public.measures_distribution_execution')).rows[0].execution_status==='publication_uncertain','existing expired claim records uncertainty')
  await reset()
  await admin.query("update public.c3_envpac_capability_grant set scope=jsonb_set(scope,'{expires_at}',to_jsonb((now()-interval '1 second')::text)) where capability_key='fixture_operator'")
  check((await claim(service)).reason==='historical_effect_capability_unresolved:operator','expired capability denied')
  await second.end();await service.end()
  console.log(JSON.stringify({postgres:'isolated PostgreSQL 17.6',assertions,provider_calls:0,live_registry_mutations:0,
    admission:'TEST_DOUBLE_ONLY; native actor/source admission NOT implemented or verified',status:'PASS'}))
}finally{await admin.end()}
