import {useEffect,useState,useRef} from 'react'
import {createClient} from '@supabase/supabase-js'
// Dedicated memory-only human session; never use the app's persisted owner session.
const publicKey=import.meta.env.VITE_SUPABASE_ANON_KEY
const client=publicKey?createClient('https://zfihrspxvennjzazxcbj.supabase.co',publicKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},global:{fetch:(url,init)=>fetch(url,{...init,signal:init?.signal?AbortSignal.any([init.signal,AbortSignal.timeout(10000)]):AbortSignal.timeout(10000)})}}):null
export function OperatorSignIn({onProof,readComplete=false,readHeld=false}:{onProof:(proof:string)=>void,readComplete?:boolean,readHeld?:boolean}){
 const [email,setEmail]=useState('contribute2c3communitypartners@gmail.com'),[password,setPassword]=useState(''),[message,setMessage]=useState('Sign in to verify your Operator read access.'),[busy,setBusy]=useState(false),[expires,setExpires]=useState(0)
 const [fallbackRequest,setFallbackRequest]=useState<{requestId:string;expiresAt:string}|null>(null)
 const [fallbackMessage,setFallbackMessage]=useState('')
 const [fallbackBusy,setFallbackBusy]=useState(false)
 const [enrollmentIntent,setEnrollmentIntent]=useState<{requestId:string;expiresAt:string}|null>(null)
 const [enrollmentMessage,setEnrollmentMessage]=useState('')
 const [enrollmentBusy,setEnrollmentBusy]=useState(false)
 const generation=useRef(0),mounted=useRef(true)
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;generation.current++}},[])
 useEffect(()=>{if(!expires)return;const timeout=setTimeout(()=>{onProof('');setExpires(0);setMessage('Your session expired. Sign in again.')},Math.max(0,expires*1000-Date.now()));return()=>clearTimeout(timeout)},[expires,onProof])
 async function submit(event:React.FormEvent){event.preventDefault();const attempt=++generation.current;setFallbackRequest(null);setFallbackMessage('');setEnrollmentIntent(null);setEnrollmentMessage('');setEnrollmentBusy(false);setBusy(true);onProof('');try{
  if(!client)throw Error('configuration')
  const {data,error}=await client.auth.signInWithPassword({email,password});if(!mounted.current||generation.current!==attempt)return;setPassword('');if(error||!data.session)throw Error('signin')
  const checked=await client.auth.getUser();if(checked.error||checked.data.user?.id!=='1cd2c032-7ef0-4537-8b08-e99b68895eb0'||!checked.data.user.email_confirmed_at||!data.session.expires_at||data.session.expires_at*1000<=Date.now())throw Error('identity')
  if(!mounted.current||generation.current!==attempt)return;setExpires(data.session.expires_at);onProof(data.session.access_token);setMessage('Signed in. Checking your registered read permissions. Submission authority is evaluated separately.')
 }catch{if(mounted.current&&generation.current===attempt){onProof('');setMessage('Sign-in could not be verified. Check your account details and try again.')}}finally{if(mounted.current&&generation.current===attempt){setPassword('');setBusy(false)}}}
 async function renew(){
  if(!client||busy)return;const attempt=++generation.current;setBusy(true)
  try{
   const {data:{session}}=await client.auth.getSession();if(!session||!session.expires_at||session.expires_at*1000<=Date.now())throw Error('identity')
   const checked=await client.auth.getUser(session.access_token);if(checked.error||checked.data.user?.id!=='1cd2c032-7ef0-4537-8b08-e99b68895eb0'||!checked.data.user.email_confirmed_at)throw Error('identity')
   if(!mounted.current||generation.current!==attempt)return
   const result=await client.rpc('c3ops_renew_operator_read_v2')
   if(!mounted.current||generation.current!==attempt)return
   if(result.error)throw Error('uncertain')
   const r=result.data as {standing?:unknown;renewed?:unknown;expires_at?:unknown;rights?:unknown}|null
   if(!r||r.standing!=='renewed'||typeof r.renewed!=='boolean'||typeof r.expires_at!=='string'||!Number.isFinite(Date.parse(r.expires_at))||Date.parse(r.expires_at)<=Date.now()||JSON.stringify(r.rights)!=='[\"inspect_governed_status\",\"read_preflight_evidence\"]')throw Error('uncertain')
   setMessage('Read renewal recorded. Checking current permissions.');onProof(session.access_token)
  }catch{if(mounted.current&&generation.current===attempt)setMessage('Read renewal could not be confirmed. The native authorization remains held.')}
  finally{if(mounted.current&&generation.current===attempt)setBusy(false)}
 }
 async function requestRegistrarFallback(){
  if(!client||busy||fallbackBusy||fallbackRequest)return
  const attempt=generation.current
  setFallbackBusy(true);setFallbackMessage('')
  try{
   const {data:{session},error:sessionError}=await client.auth.getSession()
   if(sessionError||!session?.access_token||!session.expires_at||session.expires_at*1000<=Date.now())throw Error('expired')
   const checked=await client.auth.getUser(session.access_token)
   if(checked.error||checked.data.user?.id!=='1cd2c032-7ef0-4537-8b08-e99b68895eb0')throw Error('identity')
   const {data,error}=await client.rpc('c3ops_request_registrar_fallback_v1')
   if(!mounted.current||generation.current!==attempt)return
   if(error||!data||typeof data!=='object'||Array.isArray(data))throw Error('unavailable')
   const result=data as Record<string,unknown>
   if(result.standing!=='REQUESTED'||typeof result.request_id!=='string'||typeof result.expires_at!=='string'||result.registrar_execution_authorized!==false||result.installation_authorized!==false)throw Error('unexpected')
   setFallbackRequest({requestId:result.request_id,expiresAt:result.expires_at})
   setFallbackMessage('REQUESTED · Checking existing bounded read standing...')
   // The canonical portal consumes the same existing, append-only Registry
   // continuation. This is NOT workroom admission or Registrar execution.
   const decision=await client.rpc('c3ops_resolve_fallback_read_v1',{p_request_id:result.request_id})
   if(!mounted.current||generation.current!==attempt)return
   const value=decision.data as Record<string,unknown>|null
   if(decision.error||!value||value.standing!=='READ_PREFLIGHT_CONFIRMED'
      ||value.request_id!==result.request_id||typeof value.expires_at!=='string'
      ||!Number.isFinite(Date.parse(value.expires_at))||Date.parse(value.expires_at)<=Date.now()
      ||value.registrar_execution_authorized!==false||value.installation_authorized!==false
      ||value.workroom_admission_authorized!==false){
     setFallbackMessage('REQUESTED · Read continuation HLD. No Registrar execution or workroom admission.')
     return
   }
   setFallbackMessage('READ PREFLIGHT CONFIRMED · Existing read rights recognized. Registrar execution and workroom admission remain held.')
  }catch{
   if(mounted.current&&generation.current===attempt)setFallbackMessage('Request could not be verified. No Registrar execution is authorized. Check current Operator standing and sign in again if needed.')
  }finally{if(mounted.current&&generation.current===attempt)setFallbackBusy(false)}
 }
 async function requestEnrollmentReview(){
  if(!client||!expires||expires*1000<=Date.now()||busy||enrollmentBusy||enrollmentIntent)return
  const attempt=generation.current
  setEnrollmentBusy(true);setEnrollmentMessage('')
  try{
   const {data:{session},error:sessionError}=await client.auth.getSession()
   if(sessionError||!session?.access_token||!session.expires_at||session.expires_at*1000<=Date.now())throw Error('session')
   const identity=await client.auth.getUser(session.access_token)
   if(identity.error||identity.data.user?.id!=='1cd2c032-7ef0-4537-8b08-e99b68895eb0'||!identity.data.user.email_confirmed_at)throw Error('identity')
   if(!mounted.current||generation.current!==attempt)return
   const {data,error}=await client.rpc('c3ops_request_worker_enrollment_review_v1')
   if(!mounted.current||generation.current!==attempt)return
   if(error||!data||typeof data!=='object'||Array.isArray(data))throw Error('held')
   const r=data as Record<string,unknown>
   if(r.standing!=='REQUESTED_REVIEW_ONLY'||r.operator!=='op044'||r.environment!=='env_c3ops'||r.oar_key!=='oar2_op044_registrar_codex_worker_identity_qualification_codex_20261115_026'||r.worker_mailbox!=='registrar-worker@c3field.online'||typeof r.request_id!=='string'||typeof r.request_expires_at!=='string'||!Number.isFinite(Date.parse(r.request_expires_at))||Date.parse(r.request_expires_at)<=Date.now()||r.worker_enrollment_authorized!==false||r.registrar_execution_authorized!==false||r.worker_dispatch_authorized!==false||r.installation_authorized!==false)throw Error('unverified_receipt')
   setEnrollmentIntent({requestId:r.request_id,expiresAt:r.request_expires_at})
   setEnrollmentMessage('REQUESTED · Registry receipt confirmed. Awaiting Registrar review. No worker enrollment or execution authorized.')
  }catch{if(mounted.current&&generation.current===attempt)setEnrollmentMessage('HLD · Registry submission not confirmed. No authorization granted. Do not assume a decision was recorded.')}
  finally{if(mounted.current&&generation.current===attempt)setEnrollmentBusy(false)}
 }
 async function signOut(){generation.current++;setEnrollmentIntent(null);setEnrollmentMessage('');setEnrollmentBusy(false);setFallbackRequest(null);setFallbackMessage('');setFallbackBusy(false);onProof('');setExpires(0);setPassword('');setBusy(false);await client?.auth.signOut({scope:'local'});if(mounted.current)setMessage('Signed out of this page.')}
 return <section aria-label="Operator sign in"><h2>Operator sign in</h2><p role="status">{expires&&readComplete?'Signed in.':message}</p>{expires?<><button type="button" onClick={signOut}>Sign out</button>
    {<section aria-label="OAR026 worker enrollment review request" className="ops-fallback-request">
      <h3>Worker enrollment · OAR026</h3><p>Request Registrar review of registrar-worker@c3field.online, for one supervised identity enrollment. This records intent only, not approval or execution authority.</p>
      <button type="button" disabled={busy||enrollmentBusy||Boolean(enrollmentIntent)} onClick={()=>void requestEnrollmentReview()}>{enrollmentBusy?'Submitting…':enrollmentIntent?'Review requested':'Submit enrollment review request'}</button>
      {enrollmentMessage&&<p role="status">{enrollmentMessage}</p>}
      {enrollmentIntent&&<p>Registry receipt: <code>{enrollmentIntent.requestId}</code><br/>Expires: {new Date(enrollmentIntent.expiresAt).toLocaleString()}</p>}
    </section>}
    <div aria-label="Registrar fallback request" className="ops-fallback-request">
      <p>Request a bounded Registrar thread-fallback intake for c3Ops. This records Operator intent only; it does not authorize execution or installation.</p>
      <button type="button" disabled={busy||fallbackBusy||Boolean(fallbackRequest)} onClick={()=>void requestRegistrarFallback()}>{fallbackBusy?'Submitting request…':fallbackRequest?'Request recorded':'Request Registrar Fallback'}</button>
      {fallbackMessage&&<p role="status">{fallbackMessage}</p>}
      {fallbackRequest&&<p>Request reference: <code>{fallbackRequest.requestId}</code><br/>Expires: {new Date(fallbackRequest.expiresAt).toLocaleString()}</p>}
    </div>{readHeld&&!readComplete&&<><p>Renew read access for this authenticated session. No Registrar or deployment authority is granted.</p><button type="button" disabled={busy} onClick={renew}>{busy?'Checking renewal…':'Renew read access'}</button></>}</>:<form onSubmit={submit}><label>Email<input type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button disabled={busy} type="submit">{busy?'Signing in…':'Sign in'}</button></form>}</section>
}
