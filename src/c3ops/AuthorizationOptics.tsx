import type {AuthorizationOpticsReadback} from '../../functions/_lib/c3ops-authorization-optics'

const readable=(timestamp:string|null)=>timestamp?new Date(timestamp).toLocaleString():'unresolved'
export function AuthorizationOptics({data,onRefresh}:{data:AuthorizationOpticsReadback;onRefresh:()=>void}){
 const effective=data.grant?.standing==='EFFECTIVE'
 const confirmed=data.requests.filter(x=>x.disposition==='READ_PREFLIGHT_CONFIRMED').length
 const awaiting=data.requests.filter(x=>x.disposition==='AWAITING_DISPOSITION').length
 const held=data.requests.filter(x=>x.disposition==='HLD'||x.disposition==='EXPIRED_UNQUALIFIED').length
 return <section className="ops-command-room" aria-label="Live authorization optics">
   <header className="ops-command-mast">
     <div><p className="ops-kicker">LIVE REGISTRY · READ ONLY</p><h2>Authorizations</h2>
       <p>Observed {readable(data.observed_at)} · Last 25 authenticated fallback requests. Historic confirmation is not current authority.</p></div>
     <button type="button" onClick={onRefresh}>Refresh Registry</button>
   </header>
   <div className="lapzuli-counts" aria-label="Authorization standing summary">
     <span>Read grant: <b>{effective?'EFFECTIVE':'HLD'}</b></span>
     <span>Confirmed history: {confirmed}</span><span>Awaiting: {awaiting}</span><span>Held / expired: {held}</span>
   </div>
   <article className="ops-env" aria-label="Existing bounded Operator authorization">
     <p className="ops-kicker">op044 · env_c3ops</p><h3>Registered read grant</h3>
     {data.grant?<dl>
       <div><dt>Standing now</dt><dd>{data.grant.standing}</dd></div>
       <div><dt>Grant</dt><dd>{data.grant.key}</dd></div>
       <div><dt>Recorded standing</dt><dd>{data.grant.recorded_standing}</dd></div>
       <div><dt>Expires</dt><dd>{readable(data.grant.expires_at)}</dd></div>
       <div><dt>Rights</dt><dd>{data.grant.rights.join(' · ')}</dd></div>
     </dl>:<p className="ops-unresolved">DNR — no registered bound grant returned.</p>}
   </article>
   <h3>Request and disposition history</h3>
   <div className="ops-env-grid">
     {data.requests.map(r=><article className="ops-env" key={r.request_id} data-standing={r.disposition}>
       <p className="ops-kicker">{r.currently_effective?'EFFECTIVE READ DISPOSITION':'HISTORICAL / HELD'}</p>
       <h3>{r.disposition.replaceAll('_',' ')}</h3>
       <dl>
         <div><dt>Request</dt><dd><code>{r.request_id}</code></dd></div>
         <div><dt>Intake</dt><dd>{r.request_standing} · {readable(r.requested_at)}</dd></div>
         <div><dt>Requested through</dt><dd>{readable(r.request_expires_at)}</dd></div>
         <div><dt>Qualified</dt><dd>{readable(r.qualified_at)}</dd></div>
         <div><dt>Disposition through</dt><dd>{readable(r.disposition_expires_at)}</dd></div>
         <div><dt>Currently effective</dt><dd>{r.currently_effective?'YES (bounded read only)':'NO'}</dd></div>
       </dl>
     </article>)}
   </div>
   {!data.requests.length&&<p className="ops-unresolved">DNR — no fallback requests returned.</p>}
   <footer className="ops-command-footer">
     <span>Intake REQUESTED is immutable · Disposition is an append-only record.</span>
     <span>Registrar execution: HELD · Workroom admission: HELD · No mutations from Optics.</span>
   </footer>
 </section>
}
