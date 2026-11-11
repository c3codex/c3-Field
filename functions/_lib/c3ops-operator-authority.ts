import type {ReadRows, Row} from './me-environment'

const K={operator:'op044_operator_standing',carrier:'stephanie_joanne__op044__binding',binding:'envop_op044_env_c3ops_031_v1',root:'c3envpac_c3ops_v0_1',current:'current_env_c3ops_v1',mgs:'current_evidence_c3ops_postbind_mgs_031_v1',grant:'grant_op044_c3ops_031_read_preflight',env:'env_c3ops'} as const
const ROOT_HASH='684c4e324314722b105419aa5ae19615626512ecf2a9fb2a9ee7faeb708f66ac'
const MGS_HASH='9461f9cae213406e9ce85266dcadd9c1b3554347483b56b646474ba1574c33db'
const ADMIN={key:'current_evidence_c3ops_human_read_A03_20261110_v1',hash:'eb0f714cbc4aed778225f9e821af8ba8482c66e10280c75bce6d6494352431de',manifest:'2b26a73b2518404c34c5d8a1ec0738944925f1e7262562ed1fcadf4781823955'} as const
const RIGHTS=['inspect_governed_status','read_preflight_evidence'] as const
type Snapshot=Record<'operator'|'carrier'|'binding'|'root'|'current'|'mgs'|'grant'|'process',Row[]>&{continuity?:Row[]}
// This is a server-side verifier result, never a request field or dispatch-key claim.
// The fixed native RPC supplies this result; request JSON cannot supply it.
export type OperatorActorRecognition={standing:'VERIFIED';proofSource?:'native_supabase_operator_read_rpc';operatorKey:string;carrierKey:string;namedIndividualKey:string;environmentKey:string;expiresAt:string}|{standing:'HOLD';reason:string}
const obj=(x:unknown):Row=>x&&typeof x==='object'&&!Array.isArray(x)?x as Row:{}
const time=(x:unknown)=>typeof x==='string'?Date.parse(x):NaN
const future=(x:unknown,now:number)=>Number.isFinite(time(x))&&time(x)>now

export function evaluateC3OpsOperatorAuthority(snapshot:Snapshot,actor:OperatorActorRecognition,environmentKey=K.env as string,now=Date.now()){
 const ref=snapshot.grant.length===1?snapshot.grant[0].evidence_ref:null
 const selected=ref==='registry://c3_current_evidence_ref/'+ADMIN.key?ADMIN.key:ref==='registry://c3_current_evidence_ref/'+K.mgs?K.mgs:null
 const observed={...snapshot,mgs:snapshot.mgs.filter(m=>m.current_evidence_ref_key===selected)}
 const administrative=selected===ADMIN.key
 const refusals:string[]=[]
 const one=(key:Exclude<keyof Snapshot,'continuity'>)=>{if(observed[key].length!==1)refusals.push(key+'_missing_or_ambiguous');return observed[key][0]??{}}
 const o=one('operator'),c=one('carrier'),b=one('binding'),r=one('root'),cu=one('current'),m=one('mgs'),g=one('grant')
 const bm=obj(b.metadata),mm=obj(m.metadata),s=obj(g.scope)
 const check=(ok:boolean,reason:string)=>{if(!ok)refusals.push(reason)}
 check(Number.isFinite(now),'invalid_observation_time')
 check([o.effective_at,c.effective_at,b.effective_at,r.effective_at,cu.effective_at,m.attested_at,g.granted_at].every(t=>Number.isFinite(time(t))&&time(t)<=now),'not_yet_effective_or_invalid_time')
 const processes=['c3_environment_operator_binding_v1','c3ops_operator_admission_registrar_v1','c3ops_postbind_mgs_registrar_v1']
 check(snapshot.process.length===processes.length&&processes.every(key=>snapshot.process.filter(p=>p.process_key===key&&p.process_status==='active'&&p.authority_state==='operator_confirmed_registered').length===1),'governing_process_unqualified')
 check(environmentKey===K.env,'foreign_environment')
 check(o.operator_standing_key===K.operator&&o.operator_identifier==='op044'&&o.standing==='active','operator_inactive_or_mismatched')
 check(c.relation_key===K.carrier&&c.operator_standing_key===K.operator&&c.standing==='active'&&typeof c.named_individual_key==='string'&&!!c.named_individual_key,'carrier_inactive_or_mismatched')
 check(b.environment_operator_binding_key===K.binding&&b.env_key===K.env&&b.envpac_key===K.root&&b.operator_standing_key===K.operator&&b.carrier_binding_key===K.carrier&&b.operator_role==='operator'&&b.binding_standing==='active'&&b.revoked_at===null&&b.determination_process_key==='c3_environment_operator_binding_v1'&&b.scope_class==='c3ops_operator_read_preflight_workroom_preparation','binding_revoked_or_mismatched')
 check(r.envpac_key===K.root&&r.env_key===K.env&&r.is_effective===true&&r.standing==='effective'&&r.superseded_at===null&&r.content_sha256===ROOT_HASH&&r.owner_subject_type==='system'&&r.owner_subject_key==='c3_field'&&r.custodian_subject_type==='system'&&r.custodian_subject_key==='c3_field','root_unqualified')
 check(cu.current_state_key===K.current&&cu.env_key===K.env&&cu.is_current===true&&cu.superseded_at===null,'stale_current')
 check(m.current_state_key===K.current&&(administrative?(m.current_evidence_ref_key===ADMIN.key&&m.evidence_class==='administrative_human_read_mgs'&&m.evidence_standing==='operator_adopted_independent_review'&&m.content_hash===ADMIN.hash&&m.source_execution_instance_id==='c3ops_operational_integrity_completion_codex_20261103_001'&&mm.qualification_mode==='A03_administrative_human_read'&&mm.registrar_runtime_authenticated===false&&mm.management_connection_is_identity===false&&mm.adopted_manifest_sha256===ADMIN.manifest&&mm.predecessor_evidence_ref===K.mgs):(m.current_evidence_ref_key===K.mgs&&m.evidence_class==='post_envpac_target_mgs'&&m.evidence_standing==='confirmed_postbind_mgs'&&m.content_hash===MGS_HASH&&mm.registration_process_key==='c3ops_postbind_mgs_registrar_v1'&&mm.root_sha256===ROOT_HASH)),'mgs_unqualified')
 if(administrative)check(actor.standing==='VERIFIED'&&actor.proofSource==='native_supabase_operator_read_rpc','administrative_native_read_proof_required')
 check(g.grant_key===K.grant&&g.envpac_key===K.root&&g.subject_type==='individual'&&g.subject_key===c.named_individual_key&&g.relation_role==='consumer'&&g.standing==='active'&&g.revoked_at===null,'grant_revoked_or_mismatched')
 check(s.environment_key===K.env&&s.current_state_key===K.current&&s.operator_standing_key===K.operator&&s.actor_binding_key===K.carrier&&s.authenticated_session_required===true&&s.live_postbind_mgs_expiry_required===true&&s.general_ops_granted===false&&s.ownership_created===false&&s.publication_authorized===false&&s.provider_dispatch_authorized===false,'grant_scope_mismatch')
 check(future(g.expires_at,now)&&future(mm.expires_at,now)&&future(bm.expiry_at,now),'grant_mgs_or_binding_expired')
 check((administrative?time(g.expires_at)<=time(mm.expires_at):time(g.expires_at)===time(mm.expires_at))&&time(g.expires_at)===time(bm.expiry_at),'expiry_binding_mismatch')
 check(bm.current_key===K.current&&bm.formation_process_key==='c3ops_operator_admission_registrar_v1'&&b.evidence_ref==='registry://c3_current_evidence_ref/'+selected&&g.evidence_ref===b.evidence_ref&&m.attested_by===(administrative?'op044_administrative_disposition':'c3_registrar_ci_v1'),'evidence_lineage_mismatch')
 check(Array.isArray(s.rights)&&s.rights.length===RIGHTS.length&&new Set(s.rights).size===RIGHTS.length&&RIGHTS.every(x=>(s.rights as unknown[]).includes(x)),'unexpected_effect_scope')
 const registered=refusals.length===0
 const actorRefusals:string[]=[]
 if(actor.standing!=='VERIFIED')actorRefusals.push(actor.reason)
 else{
  if(actor.operatorKey!==K.operator||actor.carrierKey!==K.carrier||actor.namedIndividualKey!==c.named_individual_key)actorRefusals.push('foreign_actor')
  if(actor.environmentKey!==K.env)actorRefusals.push('actor_environment_mismatch')
  if(!future(actor.expiresAt,now))actorRefusals.push('actor_recognition_expired')
 }
 const runtime=registered&&actorRefusals.length===0
 const continuity=snapshot.continuity??[]
 const ci=continuity[0]??{}
 const continuityRegistered=continuity.length===1&&ci.continuity_binding_key==='identity_continuity_stephanie_joanne_crs_93e901_v1'&&ci.relationship_key==='crs_93e901234ae044a396654ee80644b005'&&ci.named_individual_key===c.named_individual_key&&ci.binding_class==='governed_identity_continuity'&&ci.binding_standing==='active'&&ci.revoked_at===null&&Number.isFinite(time(ci.effective_at))&&time(ci.effective_at)<=now&&ci.determination_process_key==='c3_named_individual_crs_continuity_binding_v1'&&ci.governing_constraint_key==='individual_authority_custody_continuity_seam_weld_v1'
 return {contract:'c3ops_op044_authority_projection_v1' as const,observed_at:new Date(Number.isFinite(now)?now:0).toISOString(),environment:K.env,
  registered_operator:{standing:o.operator_standing_key===K.operator&&o.operator_identifier==='op044'&&o.standing==='active'&&Number.isFinite(time(o.effective_at))&&time(o.effective_at)<=now?'ACTIVE':'HOLD',key:K.operator},
  identity_continuity:{standing:continuityRegistered?'REGISTERED':'HOLD',record:continuityRegistered?String(ci.continuity_binding_key):null,authenticates_session:false,creates_operator_standing:false},
  registry_qualification:registered?(administrative?'ADMINISTRATIVE_READ_ONLY':'PASS'):'HOLD',environmental_qualification:registered?(administrative?'ADMINISTRATIVE_READ_ONLY':'PASS'):'HOLD',qualification_mode:administrative?'A03_administrative_human_read':'original_postbind',registrar_runtime_authentication_established:false,
  authenticated_actor:{standing:runtime?'VERIFIED':'HOLD',refusals:actorRefusals},
  effective_access_grant:{key:K.grant,standing:registered?'EFFECTIVE':'HOLD',expires_at:typeof g.expires_at==='string'?g.expires_at:null},
  registered_rights:registered?[...RIGHTS]:[],eligible_read_effects:runtime?[...RIGHTS]:[],
  // This projection never dispatches even an eligible read, or authorizes a write.
  executable_effects:[],mutation_authority:false as const,external_effects:0,
  excluded_effects:['prepare_workroom_admission','general_operations','publication','provider_dispatch'],
  historical_metadata_is_authority:false,refusals,
  records:{...K,mgs:selected??'unresolved'},source_hashes:{root:ROOT_HASH,mgs:administrative?ADMIN.hash:MGS_HASH}}
}

export async function readC3OpsOperatorAuthority(read:ReadRows,environmentKey=K.env as string,actor:OperatorActorRecognition={standing:'HOLD',reason:'independent_c3ops_target_actor_session_not_qualified'}){
 const definitions:[keyof Snapshot,string,string,Record<string,string>][]=[
  ['operator','c3_operator_standing','operator_standing_key,operator_identifier,standing,effective_at',{operator_standing_key:'eq.'+K.operator}],
  ['carrier','c3_named_individual_operator_binding','relation_key,operator_standing_key,named_individual_key,standing,effective_at',{relation_key:'eq.'+K.carrier}],
  ['binding','c3_environment_operator_binding','environment_operator_binding_key,env_key,envpac_key,operator_standing_key,carrier_binding_key,operator_role,binding_standing,revoked_at,scope_class,determination_process_key,effective_at,evidence_ref,metadata',{environment_operator_binding_key:'eq.'+K.binding}],
  ['root','c3_envpac','envpac_key,env_key,is_effective,standing,superseded_at,content_sha256,owner_subject_type,owner_subject_key,custodian_subject_type,custodian_subject_key,effective_at',{envpac_key:'eq.'+K.root}],
  ['current','c3_current_state','current_state_key,env_key,is_current,superseded_at,effective_at',{env_key:'eq.'+K.env,is_current:'eq.true'}],
  ['mgs','c3_current_evidence_ref','current_evidence_ref_key,current_state_key,evidence_class,evidence_standing,content_hash,metadata,attested_by,attested_at,source_execution_instance_id',{current_evidence_ref_key:'in.('+K.mgs+','+ADMIN.key+')'}],
  ['grant','c3_envpac_access_grant','grant_key,envpac_key,subject_type,subject_key,relation_role,standing,revoked_at,expires_at,scope,evidence_ref,granted_at',{grant_key:'eq.'+K.grant}],
  ['process','system_process_registry','process_key,process_status,authority_state',{process_key:'in.(c3_environment_operator_binding_v1,c3ops_operator_admission_registrar_v1,c3ops_postbind_mgs_registrar_v1)'}],
  ['continuity','c3_named_individual_crs_binding','continuity_binding_key,relationship_key,named_individual_key,binding_class,binding_standing,revoked_at,effective_at,determination_process_key,governing_constraint_key',{continuity_binding_key:'eq.identity_continuity_stephanie_joanne_crs_93e901_v1'}],
 ]
 const snapshot={} as Snapshot
 const failures:string[]=[]
 await Promise.all(definitions.map(async([name,table,select,filters])=>{try{snapshot[name]=await read(table,select,filters)}catch{snapshot[name]=[];failures.push(name+'_read_unavailable')}}))
 const result=evaluateC3OpsOperatorAuthority(snapshot,actor,environmentKey)
 result.refusals.push(...failures.sort())
 return result
}
export type C3OpsOperatorAuthority=ReturnType<typeof evaluateC3OpsOperatorAuthority>
