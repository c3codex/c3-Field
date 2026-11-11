// Read-only authorization Optics projection. The Registry is the source, not browser state.
// This module never creates authority or exposes the underlying actor/session identifiers.
export type AuthorizationOpticsRecord = {
  request_id:string; requested_at:string; request_standing:'REQUESTED';
  request_expires_at:string; disposition:'READ_PREFLIGHT_CONFIRMED'|'EXPIRED_UNQUALIFIED'|'AWAITING_DISPOSITION'|'HLD';
  qualified_at:string|null; disposition_expires_at:string|null; currently_effective:boolean;
  registrar_execution_authorized:false;workroom_admission_authorized:false;
}
export type AuthorizationOpticsReadback={
 contract:'c3ops_authorization_optics_v1';observed_at:string;environment:'env_c3ops';operator:'op044';
 grant:{key:string;standing:'EFFECTIVE'|'HLD';recorded_standing:string;expires_at:string;rights:string[];revoked:boolean}|null;
 requests:AuthorizationOpticsRecord[];execution_authority:false;mutation_authority:false;workroom_admission_authority:false;
}
const isRecord=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v)
const isTime=(v:unknown)=>typeof v==='string'&&Number.isFinite(Date.parse(v))
export function validateAuthorizationOptics(value:unknown):AuthorizationOpticsReadback {
 if(!isRecord(value)||value.contract!=='c3ops_authorization_optics_v1'||value.environment!=='env_c3ops'||value.operator!=='op044'||!isTime(value.observed_at)
  ||value.execution_authority!==false||value.mutation_authority!==false||value.workroom_admission_authority!==false
  ||!Array.isArray(value.requests)||value.requests.length>25)throw Error('HLD: authorization optics contract not qualified')
 const grant=value.grant
 if(grant!==null&&(!isRecord(grant)||grant.key!=='grant_op044_c3ops_031_read_preflight'||!['EFFECTIVE','HLD'].includes(String(grant.standing))
  ||typeof grant.revoked!=='boolean'||!isTime(grant.expires_at)||!Array.isArray(grant.rights)
  ||grant.rights.length!==2||!['inspect_governed_status','read_preflight_evidence'].every(r=>grant.rights.includes(r))))throw Error('HLD: grant optics contract not qualified')
 const seen=new Set<string>()
 for(const row of value.requests){
  if(!isRecord(row)||typeof row.request_id!=='string'||seen.has(row.request_id)
    ||row.request_standing!=='REQUESTED'||!isTime(row.requested_at)||!isTime(row.request_expires_at)
    ||!['READ_PREFLIGHT_CONFIRMED','EXPIRED_UNQUALIFIED','AWAITING_DISPOSITION','HLD'].includes(String(row.disposition))
    ||!(row.qualified_at===null||isTime(row.qualified_at))
    ||!(row.disposition_expires_at===null||isTime(row.disposition_expires_at))
    ||typeof row.currently_effective!=='boolean'
    ||row.registrar_execution_authorized!==false||row.workroom_admission_authorized!==false)throw Error('HLD: request optics contract not qualified')
  seen.add(row.request_id)
 }
 return value as AuthorizationOpticsReadback
}
export async function readAuthorizationOptics(env:{SUPABASE_URL?:string;VITE_SUPABASE_URL?:string;SUPABASE_SERVICE_ROLE_KEY?:string},fetcher:typeof fetch=fetch){
 const origin=env.SUPABASE_URL??env.VITE_SUPABASE_URL
 const key=env.SUPABASE_SERVICE_ROLE_KEY
 if(!origin||!key)throw Error('HLD: authorization optics source not configured')
 const response=await fetcher(origin.replace(/\/$/,'')+'/rest/v1/rpc/c3ops_authorization_optics_read_v1',{
  method:'POST',headers:{apikey:key,authorization:'Bearer '+key,'content-type':'application/json'},
  body:'{}',redirect:'manual',signal:AbortSignal.timeout(12000)
 })
 if(!response.ok)throw Error('HLD: live authorization optics not available')
 return validateAuthorizationOptics(await response.json())
}
