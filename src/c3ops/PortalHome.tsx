import { portals } from "./c3OpsRoutes"
export function PortalHome({onEnter,authorized=false}:{onEnter:()=>void;authorized?:boolean}) {
  return <main className="ops-door ops-portal-home">
    <header className="ops-portal-mast"><a href="/" className="ops-brand" aria-label="c3Ops home">c3Ops</a><span className="ops-access-label">Registered access · authority evaluated at entry</span></header>
    <section className="ops-portal-intro" aria-labelledby="portal-title"><p className="ops-kicker">THE OPERATIONS PORTAL</p><h1 id="portal-title">Work. Observe. Connect.</h1><p>Choose a room. Follow the registered authority and evidence within it.</p><button className="ops-portal-enter" type="button" onClick={onEnter}>{authorized?"Operator recognized · Choose a room":"Enter c3Ops · Authenticate"}</button></section>
    <nav className="ops-portal-grid" aria-label="c3Ops entrances">{portals.map((p,i)=><a className="ops-portal-card" key={p.path} href={p.path}>
      <span className="ops-portal-number" aria-hidden="true">0{i+1}</span><h2>{p.label}</h2><p className="ops-portal-purpose">{p.subtitle}</p>
      <div className="ops-portal-scope"><h3>Existing readback</h3><p>{p.available}</p><h3>Planned</h3><p>{p.planned}</p>{p.future && <p className="ops-portal-future">Future · {p.future}</p>}</div>
      <span className="ops-portal-enter">Enter {p.label} <span aria-hidden="true">↗</span></span>
    </a>)}</nav>
    <aside className="ops-portal-boundary" aria-label="Projection boundary"><strong>NUGs</strong><p>Authorized FREE projections into my_env.</p></aside>
    <footer className="ops-portal-footer"><p>Each room resolves its current authority and evidence.</p><p>Planned areas are not yet available. Access grants no action authority.</p></footer>
  </main>
}
