import type {OperatorActorRecognition} from './c3ops-operator-authority'
type Env={SUPABASE_URL?:string;VITE_SUPABASE_URL?:string;SUPABASE_ANON_KEY?:string;VITE_SUPABASE_ANON_KEY?:string}
const hold=(reason:string):OperatorActorRecognition=>({standing:'HOLD',reason})
export async function recognizeOperatorRead(request:Request,env:Env):Promise<OperatorActorRecognition>{
 if(new URL(request.url).origin!=='https://c3ops.c3field.online')return hold('wrong_target')
 const proof=request.headers.get('x-c3ops-session-proof')||''
 if(proof.length>8192||!/^[-A-Za-z0-9_]+\.[-A-Za-z0-9_]+\.[-A-Za-z0-9_]+$/.test(proof))return hold('native_session_required')
 const base=env.SUPABASE_URL??env.VITE_SUPABASE_URL,key=env.SUPABASE_ANON_KEY??env.VITE_SUPABASE_ANON_KEY
 if(base?.replace(/\/$/,'')!=='https://zfihrspxvennjzazxcbj.supabase.co'||!key)return hold('native_auth_configuration')
 try{
 const response=await fetch(base.replace(/\/$/,'')+'/rest/v1/rpc/c3ops_recognize_operator_read_v1',{method:'POST',redirect:'manual',signal:AbortSignal.timeout(5000),headers:{apikey:key,authorization:'Bearer '+proof,'content-type':'application/json'},body:'{}'})
 if(!response.ok||!response.headers.get('content-type')?.includes('application/json'))return hold('native_recognition_denied')
 const text=await response.text();if(text.length>4096)return hold('recognition_response_oversized')
 const r=JSON.parse(text),a=r?.actor
 if(r.verification!=='authenticated_operator_read'||r.mutation_authority!==false||r.external_effects!==0||typeof r.mapping_ref!=='string'||!r.mapping_ref||JSON.stringify(r.rights)!=='["inspect_governed_status","read_preflight_evidence"]'||a?.standing!=='VERIFIED'||a.operatorKey!=='op044_operator_standing'||a.carrierKey!=='stephanie_joanne__op044__binding'||a.namedIndividualKey!=='stephanie_joanne_gaffney'||a.environmentKey!=='env_c3ops'||!Number.isFinite(Date.parse(a.expiresAt))||Date.parse(a.expiresAt)<=Date.now())return hold('native_recognition_binding_mismatch')
 return {standing:'VERIFIED',operatorKey:a.operatorKey,carrierKey:a.carrierKey,namedIndividualKey:a.namedIndividualKey,environmentKey:a.environmentKey,expiresAt:a.expiresAt}
 }catch{return hold('native_recognition_unavailable')}
}
