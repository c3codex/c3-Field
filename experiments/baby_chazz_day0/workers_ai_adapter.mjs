/** Nonproduction synthetic-only open-weight inference adapter for Cloudflare Workers AI. */
import {AdmissionHold} from './nursery.mjs';
export const CANDIDATE_MODELS=Object.freeze([
  '@cf/openai/gpt-oss-20b',
  '@cf/qwen/qwen3-30b-a3b-fp8',
  '@cf/google/gemma-4-26b-a4b-it',
]);
export function createWorkersAIDriver({accountId,token,modelId,remoteOptIn=false,fetchImpl=globalThis.fetch}){
  if (!remoteOptIn) throw new AdmissionHold('REMOTE_INFERENCE_NOT_AUTHORIZED');
  if (!CANDIDATE_MODELS.includes(modelId)) throw new AdmissionHold('MODEL_NOT_ALLOWLISTED');
  if (!/^[a-f0-9]{32}$/i.test(accountId||'')) throw new AdmissionHold('ACCOUNT_ID_REQUIRED');
  if (!token || typeof token !== 'string') throw new AdmissionHold('TOKEN_REQUIRED');
  if (typeof fetchImpl !== 'function') throw new AdmissionHold('FETCH_DRIVER_REQUIRED');
  const url='https://api.cloudflare.com/client/v4/accounts/'+accountId+'/ai/run/'+modelId;
  return async envelope=>{
    if (!envelope.environment_key.startsWith('synthetic_') || !envelope.current_ref.startsWith('synthetic_') ||
        !envelope.facts.every(f=>f.ref.startsWith('synthetic:')))
      throw new AdmissionHold('REAL_ENVIRONMENT_INFERENCE_FORBIDDEN');
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),30000);
    try {
      const response=await fetchImpl(url,{
        method:'POST', signal:controller.signal,
        headers:{'Authorization':'Bearer '+token,'Content-Type':'application/json'},
        body:JSON.stringify({messages:[
          {role:'system',content:'You are a read-only experimental environmental reasoning model. Return only JSON with keys kind, text, evidence_refs, and candidate (only for a candidate). Allowed kind: orientation, explanation, candidate, hold. A candidate is never registered. Never claim or perform effects; no tools exist.'},
          {role:'user',content:JSON.stringify(envelope)}
        ],max_tokens:512})
      });
      if (!response.ok) throw new AdmissionHold('INFERENCE_HTTP_HOLD');
      const data=await response.json();
      const candidate=data?.result?.response ?? data?.result?.output_text;
      if (typeof candidate !== 'string') throw new AdmissionHold('MODEL_REPLY_NOT_STRUCTURED');
      try {return JSON.parse(candidate);} catch {throw new AdmissionHold('MODEL_REPLY_NOT_JSON');}
    } finally {clearTimeout(timer);}
  };
}
