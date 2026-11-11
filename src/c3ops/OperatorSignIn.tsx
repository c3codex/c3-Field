import {prepareReadRenewal,sessionReference,isRenewalReceipt,type ReadRenewalAttempt} from './readRenewalAttempt'
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
 const renewal=useRef<ReadRenewalAttempt|null>(null)
 const generation=useRef(0),mounted=useRef(true)
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;generation.current++}},[])
 useEffect(()=>{if(!expires)return;const timeout=setTimeout(()=>{onProof('');setExpires(0);setMessage('Your session expired. Sign in again.')},Math.max(0,expires*1000-Date.now()));return()=>clearTimeout(timeout)},[expires,onProof])
 async function submit(event:React.FormEvent){event.preventDefault();const attempt=++generation.current;renewal.current=null;setFallbackRequest(null);setFallbackMessage('');setBusy(true);onProof('');try{
  if(!client)throw Error('configuration')
  const {data,error}=await client.auth.signInWithPassword({email,password});if(!mounted.current||generation.current!==attempt)return;setPassword('');if(error||!data.session)throw Error('signin')
  const checked=await client.auth.getUser();if(checked.error||checked.data.user?.id!=='1cd2c032-7ef0-4537-8b08-e99b68895eb0'||!checked.data.user.email_confirmed_at||!data.session.expires_at||data.session.expires_at*1000<=Date.now())throw Error('identity')
  if(!mounted.current||generation.current!==attempt)return;setExpires(data.session.expires_at);onProof(data.session.access_token);setMessage('Signed in. Checking your registered read permissions.')
 }catch{if(mounted.current&&generation.current===attempt){onProof('');setMessage('Sign-in could not be verified. Check your account details and try again.')}}finally{if(mounted.current&&generation.current===attempt){setPassword('');setBusy(false)}}}
 async function renew(){
  if(!client||busy)return;const attempt=++generation.current;setBusy(true)
  try{
   const {data:{session}}=await client.auth.getSession();if(!session||!session.expires_at||session.expires_at*1000<=Date.now())throw Error('identity')
   const checked=await client.auth.getUser(session.access_token);if(checked.error||checked.data.user?.id!=='1cd2c032-7ef0-4537-8b08-e99b68895eb0'||!checked.data.user.email_confirmed_at)throw Error('identity')
   if(!mounted.current||generation.current!==attempt)return
   renewal.current=prepareReadRenewal(renewal.current,sessionReference(session.access_token));const reference=renewal.current
   const result=await client.rpc('c3ops_activate_operator_read_once_v1',{p_request_id:reference.requestId})
   if(!mounted.current||generation.current!==attempt)return
   if(result.error)throw Error('uncertain')
   if(result.data?.standing==='held'){setMessage('Read renewal is held. The bounded activation may not be open.');return}
   if(!isRenewalReceipt(result.data,reference))throw Error('uncertain')
   setMessage('Read renewal recorded. Checking current permissions.');onProof(session.access_token)
  }catch{if(mounted.current&&generation.current===attempt)setMessage('Renewal could not be confirmed. Retrying keeps the same request reference.')}
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
 async function signOut(){generation.current++;renewal.current=null;setFallbackRequest(null);setFallbackMessage('');setFallbackBusy(false);onProof('');setExpires(0);setPassword('');setBusy(false);await client?.auth.signOut({scope:'local'});if(mounted.current)setMessage('Signed out of this page.')}
 return <section aria-label="Operator sign in"><h2>Operator sign in</h2><p role="status">{expires&&readComplete?'Signed in.':message}</p>{expires?<><button type="button" onClick={signOut}>Sign out</button>
    <div aria-label="Registrar fallback request" className="ops-fallback-request">
      <p>Request a bounded Registrar thread-fallback intake for c3Ops. This records Operator intent only; it does not authorize execution or installation.</p>
      <button type="button" disabled={busy||fallbackBusy||Boolean(fallbackRequest)} onClick={()=>void requestRegistrarFallback()}>{fallbackBusy?'Submitting request…':fallbackRequest?'Request recorded':'Request Registrar Fallback'}</button>
      {fallbackMessage&&<p role="status">{fallbackMessage}</p>}
      {fallbackRequest&&<p>Request reference: <code>{fallbackRequest.requestId}</code><br/>Expires: {new Date(fallbackRequest.expiresAt).toLocaleString()}</p>}
    </div>{readHeld&&!readComplete&&<><p>This one-use read renewal stays bound to this signed-in session. Keep this page open during activation.</p><button type="button" disabled={busy} onClick={renew}>{busy?'Checking renewal…':'Renew read access'}</button></>}</>:<form onSubmit={submit}><label>Email<input type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button disabled={busy} type="submit">{busy?'Signing in…':'Sign in'}</button></form>}</section>
}
