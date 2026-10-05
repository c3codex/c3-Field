import test from 'node:test'
import assert from 'node:assert/strict'
import {handleRead} from './manifest'
import {onRequest as operatorMiddleware} from '../../_middleware'
import {readLapzuli,type Row} from '../../_lib/me-environment'

function fixture(count=16) {
 const keys=Array.from({length:count},(_,i)=>'asset_'+i)
 const rows:Record<string,Row[]>={
  measures_publication_campaign:[{campaign_key:'campaign',publication_key:'undrifted',issue_id:'issue003',campaign_name:'Issue003',status:'active',review_status:'operator_approved',release_state:'authorized_pending_lapzuli_execution',metadata:{activation_operator:'op044',campaign_pac_key:'pac',external_distribution_authorized:true,lapzuli_active_asset_keys:keys}}],
  measures_publication_distribution_asset:keys.map((key,i)=>({distribution_asset_key:key,campaign_id:'campaign',publication_asset_id:'publication_'+i,status:'ready_for_lapzuli_resolution',review_status:'operator_approved',distribution_type:'social_source_link',metadata:{campaign_pac_key:'pac',derivative_key:'derivative_'+i,channel_key:'bluesky_undrifted',executor_key:'bluesky_api',route_key:'lapzuli_route_'+key,operator_confirmed:true,external_distribution_authorized:true},payload:{text:'Exact operator-approved text '+i,canonical_url:'https://measuresregistry.com/article_'+i}})),
  measures_publication_derivative_asset:keys.map((_,i)=>({derivative_key:'derivative_'+i,approval_status:'operator_approved',review_status:'approved',release_state:'released',metadata:{}})),
  measures_distribution_channel:[{channel_key:'bluesky_undrifted',status:'active',channel_identifier:'undrifted.bsky.social'}],
  measures_distribution_executor:[{executor_key:'bluesky_api',status:'available',supports_publish:true}],
  registered_process_log:[],
  lapzuli_route:keys.map((key,i)=>({route_key:'lapzuli_route_'+key,publication_object_key:'publication_'+i,payload_reference:key,route_status:'authorized',operator_confirmed:true,outlet_key:'bluesky',metadata:{campaign_pac_key:'pac'}})),
  c3_pac:[{pac_key:'pac',pac_type:'CampaignPac',standing:'registered',is_effective:true,metadata:{public_speaking_identity:'unDrifted',source_pubpac:'pubpac'}}],
  measures_distribution_execution:[],lapzuli_encounter_evidence:[],lapzuli_derivative_execution_view_v1:[],
 }
 const calls:Array<{method:string;table:string;records:number}>=[],env={SUPABASE_URL:'https://registry.fixture.invalid',SUPABASE_SERVICE_ROLE_KEY:'fixture_service_only',OPERATOR_DISPATCH_KEY:'fixture_operator_only'}
 let failuresAt:number|null=null
 const fetch=async(input:RequestInfo|URL,init?:RequestInit)=>{
  const url=new URL(String(input));assert.equal(url.hostname,'registry.fixture.invalid','No live Registry or provider request permitted')
  const method=init?.method??'GET',table=url.pathname.split('/').pop()!,body=method==='GET'?null:JSON.parse(String(init?.body)),records=Array.isArray(body)?body:body?[body]:[]
  calls.push({method,table,records:records.length})
  if(calls.length>50){failuresAt=calls.length;throw Error('Too many subrequests by single Worker invocation.')}
  if(method==='GET')return Response.json(rows[table]??[])
  assert.ok(['registered_process_log','measures_publication_derivative_asset','measures_publication_distribution_asset','lapzuli_route'].includes(table),'No execution/dispatch mutation permitted')
  if(method==='PATCH'){
   const key=table==='measures_publication_derivative_asset'?'derivative_key':'distribution_asset_key',id=url.searchParams.get(key)?.slice(3),row=rows[table].find(x=>x[key]===id);assert.ok(row);Object.assign(row,body)
  }else{
   const key=table==='registered_process_log'?'process_key':'route_key'
   for(const value of records){const old=rows[table].find(x=>x[key]===value[key]);if(old)Object.assign(old,value);else rows[table].push(value)}
  }
  return new Response(null,{status:204})
 }
 const request=(key='fixture_operator_only')=>new Request('https://c3ops.c3field.online/api/c3ops/manifest?view=lapzuli_action',{method:'POST',headers:{'content-type':'application/json','x-operator-dispatch-key':key},body:JSON.stringify({action:'resolve_campaign',campaign_key:'campaign'})})
 const invoke=async()=>{
  const original=globalThis.fetch;globalThis.fetch=fetch as typeof globalThis.fetch
  try{const req=request();return await operatorMiddleware({request:req,env,next:()=>handleRead(req,env)} as never)}finally{globalThis.fetch=original}
 }
 return{keys,rows,calls,env,fetch,request,invoke,failedAt:()=>failuresAt}
}

test('production-shaped middleware and manifest Resolve completes 16 assets within 50 subrequests',async()=>{
 const f=fixture();const before=await readLapzuli(async table=>f.rows[table]??[])
 assert.ok(before.campaigns[0].assets.every(a=>a.distribution_state==='ready_for_lapzuli_resolution'&&!a.registered_standing_key&&a.lapzuli_callable===false))
 const response=await f.invoke(),body=await response.json();assert.equal(response.status,200,JSON.stringify(body));assert.equal(body.standing,'ACT');assert.equal(body.resolved_count,16);assert.equal(body.external_publication_effects,0)
 assert.equal(f.calls.length,39);assert.equal(f.failedAt(),null);assert.equal(f.calls.filter(c=>c.table==='lapzuli_route'&&c.method==='POST').length,1);assert.equal(f.calls.at(-1)?.records,16)
 assert.equal(f.rows.registered_process_log.length,1);assert.ok(f.rows.measures_publication_distribution_asset.every(a=>a.status==='ready_for_operator_execution'&&!!(a.metadata as Row).registered_standing_key))
 const held=await readLapzuli(async table=>f.rows[table]??[]);assert.ok(held.campaigns[0].assets.every(a=>a.distribution_state==='held'),'Registration alone does not infer callability')
 f.rows.lapzuli_derivative_execution_view_v1=f.keys.map(key=>({distribution_asset_key:key,registered_standing_key:'campaign_lapzuli_registered',lapzuli_callable:true}))
 const ready=await readLapzuli(async table=>f.rows[table]??[]);assert.ok(ready.campaigns[0].assets.every(a=>a.distribution_state==='ready_for_operator_execution'))
 assert.deepEqual(f.rows.measures_distribution_execution,[]);assert.deepEqual(f.rows.lapzuli_encounter_evidence,[])
})

test('operator authentication rejects action before all Registry calls',async()=>{
 const f=fixture(),req=f.request('wrong');const response=await operatorMiddleware({request:req,env:f.env,next:()=>handleRead(req,f.env)} as never)
 assert.equal(response.status,403);assert.deepEqual(f.calls,[])
})

test('campaign authority hold returns before any mutation',async()=>{
 const f=fixture();f.rows.measures_publication_campaign[0].review_status='draft';const response=await f.invoke(),body=await response.json()
 assert.equal(response.status,409);assert.equal(body.reason,'campaign_not_operator_approved');assert.ok(f.calls.every(c=>c.method==='GET'))
})

test('ineligible assets stay held and outside active scope without forming standing',async()=>{
 const f=fixture(3);(f.rows.measures_publication_distribution_asset[0].metadata as Row).operator_confirmed=false;f.rows.measures_publication_derivative_asset[1].approval_status='draft';(f.rows.measures_publication_campaign[0].metadata as Row).lapzuli_active_asset_keys=['asset_0','asset_1']
 const response=await f.invoke(),body=await response.json();assert.equal(response.status,409);assert.equal(body.reason,'no_callable_distribution_assets');assert.equal(body.held.length,3);assert.ok(f.calls.every(c=>c.method==='GET'));assert.equal(f.rows.registered_process_log.length,0)
})

test('mixed held and eligible assets batch only the eligible routes',async()=>{
 const f=fixture(16);(f.rows.measures_publication_distribution_asset[0].metadata as Row).external_distribution_authorized=false
 const response=await f.invoke(),body=await response.json();assert.equal(response.status,200);assert.equal(body.resolved_count,15);assert.equal(body.held_count,1);assert.equal(f.rows.measures_publication_distribution_asset[0].status,'ready_for_lapzuli_resolution');assert.equal(f.calls.at(-1)?.records,15)
})

test('oversized resolution is held before mutations instead of partially crossing runtime budget',async()=>{
 const f=fixture(22);const response=await f.invoke(),body=await response.json();assert.equal(response.status,409);assert.equal(body.reason,'resolve_campaign_runtime_capacity_hold');assert.ok(f.calls.every(c=>c.method==='GET'));assert.equal(f.rows.registered_process_log.length,0)
})
