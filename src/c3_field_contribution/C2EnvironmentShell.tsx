import {c2Environment, readC2Eligibility} from "./c2Environment"
import "./c2Environment.css"

export default function C2EnvironmentShell() {
  const eligibility = readC2Eligibility()
  return <main className="c2-shell" aria-labelledby="c2-title">
    <header>
      <a href="/">c3 Field</a>
      <p className="c2-shell-label">Environment formation · c2ME_env</p>
      <h1 id="c2-title">Contribution environment</h1>
      <p>A technical shell for Chazz/op044 to continue encounter design and initiative formation.</p>
      <aside aria-label="Prerequisite hold" data-standing={eligibility.standing}>
        <strong>c1/C1 prerequisite held</strong>
        <p>Participation and contribution are not open. Verified persisted c1/C1 evidence remains required.</p>
        <p>c2 inherits eligibility to participate, not authority from c1.</p>
      </aside>
    </header>
    <section className="c2-shell-grid" aria-label="Formation interfaces">
      {c2Environment.seams.map(seam => <article key={seam.id} id={`c2-${seam.id}`}>
        <span className="c2-shell-label">Not connected</span>
        <h2>{seam.title}</h2><p>{seam.description}</p>
      </article>)}
    </section>
    <footer>Formation only. No submission, persistence, C2 Current or c3 Key action is available.</footer>
  </main>
}
