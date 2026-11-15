// OAR019 SOURCE ONLY. Calls proposed native executor gateway, NOT review RPCs.
// No credentials, enrollment, scheduler or privileged action implementation.
export function createNativeGatewayClient({url,publishableKey,getAccessToken,fetchImpl=fetch}) {
 if(typeof getAccessToken!=='function'||typeof url!=='string'||!url.startsWith('https://')||!publishableKey)throw Error('HLD_transport_configuration');
 const operations=new Set(['discover','resolve','claim','ack','start','renew','prepare','return','status','check']);
 return Object.freeze({async call(operation,{instance=null,token=null,fence=null,payload=null,envelope=null}={}) {
  if(!operations.has(operation))throw Error('HLD_unknown_native_operation');
  const jwt=await getAccessToken();
  if(typeof jwt!=='string'||!jwt.trim()||jwt===publishableKey)throw Error('HLD_real_user_session_required');
  const r=await fetchImpl(`${url.replace(/\/$/,'')}/rest/v1/rpc/cancom_native_executor019_v1`,{
   method:'POST',headers:{apikey:publishableKey,authorization:`Bearer ${jwt}`,'content-type':'application/json'},
   body:JSON.stringify({p_operation:operation,p_instance:instance,p_token:token,p_fence:fence,
    p_payload:payload===null?null:'\\x'+Buffer.from(payload).toString('hex'),p_envelope:envelope}),
   signal:AbortSignal.timeout(15000)});
  if(!r.ok)throw Error('HLD_native_gateway_http');
  const data=await r.json();
  if(!data||typeof data!=='object'||Array.isArray(data)||data.standing==='HLD')throw Error('HLD_native_gateway_refusal');
  // Callers still validate operation-specific exact receipt/manifest bindings.
  return data;
 }});
}
