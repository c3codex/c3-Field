import {prepareReadRenewal,sessionReference,isRenewalReceipt,type ReadRenewalAttempt} from './readRenewalAttempt'
import {useEffect,useState,useRef} from 'react'
import {createClient} from '@supabase/supabase-js'
// Dedicated memory-only human session; never use the app's persisted owner session.
const publicKey=import.meta.env.VITE_SUPABASE_ANON_KEY
const client=publicKey?createClient('https://zfihrspxvennjzazxcbj.supabase.co',publicKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},global:{fetch:(url,init)=>fetch(url,{...init,signal:init?.signal?AbortSignal.any([init.signal,AbortSignal.timeout(10000)]):AbortSignal.timeout(10000)})}}):null
export function OperatorSignIn({onProof,readComplete=false,readHeld=false}:{onProof:(proof:string)=>void,readComplete?:boolean,readHeld?:boolean}){
 const [email,setEmail]=useState('contribute2c3communitypartners@gmail.com'),[password,setPassword]=useState(''),[message,setMessage]=useState('Sign in to verify your Operator read access.'),[busy,setBusy]=useState(false),[expires,setExpires]=useState(0)
 const renewal=useRef<ReadRenewalAttempt|null>(null)
 const generation=useRef(0),mounted=useRef(true)
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;generation.current++}},[])
 useEffect(()=>{if(!expires)return;const timeout=setTimeout(()=>{onProof('');setExpires(0);setMessage('Your session expired. Sign in again.')},Math.max(0,expires*1000-Date.now()));return()=>clearTimeout(timeout)},[expires,onProof])
 async function submit(event:React.FormEvent){event.preventDefault();const attempt=++generation.current;renewal.current=null;setBusy(true);onProof('');try{
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
 async function signOut(){generation.current++;renewal.current=null;onProof('');setExpires(0);setPassword('');setBusy(false);await client?.auth.signOut({scope:'local'});if(mounted.current)setMessage('Signed out of this page.')}
 return <section aria-label="Operator sign in"><h2>Operator sign in</h2><p role="status">{expires&&readComplete?'Signed in.':message}</p>{expires?<><button type="button" onClick={signOut}>Sign out</button>{readHeld&&!readComplete&&<><p>This one-use read renewal stays bound to this signed-in session. Keep this page open during activation.</p><button type="button" disabled={busy} onClick={renew}>{busy?'Checking renewal…':'Renew read access'}</button></>}</>:<form onSubmit={submit}><label>Email<input type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button disabled={busy} type="submit">{busy?'Signing in…':'Sign in'}</button></form>}</section>
}
