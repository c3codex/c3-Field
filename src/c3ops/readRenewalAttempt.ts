// Local retry references only. Native Auth/RPC establishes identity and authority.
export type ReadRenewalAttempt={requestId:string;sessionRef:string}
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export function sessionReference(token:string){
 const payload=token.split('.')[1];if(!payload)throw Error('session_reference_unavailable')
 const decoded=JSON.parse(atob(payload.replace(/-/g,'+').replace(/_/g,'/')))
 if(typeof decoded.session_id!=='string'||!uuid.test(decoded.session_id))throw Error('session_reference_unavailable')
 return decoded.session_id as string
}
export function prepareReadRenewal(previous:ReadRenewalAttempt|null,sessionRef:string,mint=()=>crypto.randomUUID()):ReadRenewalAttempt{
 if(!uuid.test(sessionRef))throw Error('session_reference_unavailable')
 if(previous){if(previous.sessionRef!==sessionRef||!uuid.test(previous.requestId))throw Error('renewal_context_changed');return previous}
 const requestId=mint();if(!uuid.test(requestId))throw Error('request_reference_unavailable');return {requestId,sessionRef}
}
export function isRenewalReceipt(data:unknown,attempt:ReadRenewalAttempt){
 if(!data||typeof data!=='object'||Array.isArray(data))return false
 const d=data as Record<string,unknown>
 return d.request_id===attempt.requestId&&typeof d.expires_at==='string'&&Number.isFinite(Date.parse(d.expires_at))&&
 ((d.standing==='renewed'&&d.effect_committed===true)||(d.standing==='historical_receipt'&&d.historical_effect_committed===true&&d.current_access_verified===false))
}
