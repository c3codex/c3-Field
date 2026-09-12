import { useMemo, useState } from "react"
import {
  Activity,
  Boxes,
  CircleDot,
  Eye,
  FileStack,
  GitBranch,
  Layers3,
  Network,
  Orbit,
  Plus,
  ShieldCheck,
  Workflow,
} from "lucide-react"
import OarOperationsConsole from "../c3_field_convergence/OarOperationsConsole"
import "./c3OpsShell.css"

type SurfaceKey = "current" | "build" | "work" | "systems" | "registry" | "evidence"

const surfaces = [
  { key: "current" as const, label: "Current", question: "What is true now?", icon: CircleDot },
  { key: "build" as const, label: "Build", question: "What environment are we forming?", icon: Layers3 },
  { key: "work" as const, label: "Work", question: "What is moving?", icon: Workflow },
  { key: "systems" as const, label: "Systems", question: "Where does bounded responsibility live?", icon: Boxes },
  { key: "registry" as const, label: "Registry", question: "What does this environment recognize?", icon: Orbit },
  { key: "evidence" as const, label: "Evidence", question: "Why is this state trusted?", icon: FileStack },
]

function BuildSurface() {
  const [open, setOpen] = useState(false)

  return (
    <div className="c3ops-stack">
      <section className="c3ops-call-card">
        <div className="c3ops-free-mark">FREE</div>
        <div className="c3ops-call-copy">
          <p className="c3ops-eyebrow">Governed encounter</p>
          <h2>Environment</h2>
          <p>
            BUILD calls the Environment encounter. The encounter forms the environment definition; it does not
            grant standing, Current, implementation authority, or activation.
          </p>
        </div>
        <button className="c3ops-primary-action" type="button" onClick={() => setOpen((value) => !value)}>
          <Plus size={16} />
          {open ? "Close Environment" : "Open Environment"}
        </button>

        {open ? (
          <div className="c3ops-environment-form">
            <div className="c3ops-boundary-note">
              <ShieldCheck size={18} />
              <div>
                <strong>Formation only</strong>
                <span>Registry truth remains downstream of governed passage.</span>
              </div>
            </div>

            <div className="c3ops-form-grid">
              <label>
                <span>Purpose</span>
                <textarea rows={3} placeholder="What must this environment make possible?" />
              </label>
              <label>
                <span>Responsible system</span>
                <input placeholder="Registered system or governing relation" />
              </label>
              <label>
                <span>Environment class</span>
                <input placeholder="Bounded environment classification" />
              </label>
              <label>
                <span>Scope</span>
                <input placeholder="What is inside this environment?" />
              </label>
              <label>
                <span>Authority boundary</span>
                <textarea rows={3} placeholder="What may happen here, and what may not?" />
              </label>
              <label>
                <span>Evidence requirement</span>
                <textarea rows={3} placeholder="What must return before standing can change?" />
              </label>
            </div>

            <div className="c3ops-formation-rails">
              <article>
                <Network size={18} />
                <div>
                  <strong>Material / Interoperability</strong>
                  <span>Source, destination, permitted passage, custody, expected return.</span>
                </div>
              </article>
              <article>
                <Eye size={18} />
                <div>
                  <strong>c3Optics</strong>
                  <span>What must be observable, correlated, inspected, and verified.</span>
                </div>
              </article>
            </div>

            <div className="c3ops-sequence" aria-label="Environment formation sequence">
              {["Define", "Relate", "Bound", "Interop", "Optics", "MGS", "Elevate", "Persist"].map((step) => (
                <span key={step}>{step}</span>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  )
}

function CurrentSurface() {
  return (
    <div className="c3ops-grid">
      <article className="c3ops-card c3ops-card-wide">
        <p className="c3ops-eyebrow">Environment</p>
        <div className="c3ops-card-title-row">
          <h2>env_c3ops</h2>
          <span className="c3ops-state c3ops-state-held">Current held</span>
        </div>
        <dl className="c3ops-detail-list">
          <div><dt>Surface</dt><dd>c3ops.c3field.online</dd></div>
          <div><dt>Parent relation</dt><dd>env_c3_community_connect</dd></div>
          <div><dt>Current</dt><dd>held_env_c3ops_current_binding_missing</dd></div>
          <div><dt>Renderer</dt><dd>shell only · authority read model not yet wired</dd></div>
        </dl>
      </article>

      <article className="c3ops-card">
        <p className="c3ops-eyebrow">Boundary</p>
        <h3>Current is the result of passage.</h3>
        <p>The shell will not inherit the parent environment's C1 Current or fabricate one in frontend state.</p>
      </article>

      <article className="c3ops-card">
        <p className="c3ops-eyebrow">Next condition</p>
        <h3>Bind env_c3ops Current.</h3>
        <p>After governed readback, the Current surface can consume the authoritative resolver.</p>
      </article>
    </div>
  )
}

function SystemsSurface() {
  return (
    <div className="c3ops-grid">
      {["Measures Registry", "Measures of Inanna", "c3 Field", "c3 Ops"].map((name) => (
        <article className="c3ops-card" key={name}>
          <p className="c3ops-eyebrow">Bounded relation</p>
          <h3>{name}</h3>
          <p>Standing and responsibility will render from Registry authority, not from shell constants.</p>
        </article>
      ))}
    </div>
  )
}

function RegistrySurface() {
  return (
    <div className="c3ops-object-grid">
      {["People", "Agents", "Roles", "Systems", "Environments", "Processes", "Sources", "Assets", "Relationships", "Standing"].map((name) => (
        <article key={name}><Orbit size={16} /><span>{name}</span></article>
      ))}
    </div>
  )
}

function EvidenceSurface() {
  return (
    <div className="c3ops-grid">
      {[
        ["Passage", "Prior state → governed action → resulting state."],
        ["Custody", "Who controls the authoritative object and where it resides."],
        ["Lineage", "What preceded the current object, state, or evidence."],
        ["Verification", "What objective readback proves about the resulting state."],
      ].map(([title, body]) => (
        <article className="c3ops-card" key={title}>
          <p className="c3ops-eyebrow">Evidence</p>
          <h3>{title}</h3>
          <p>{body}</p>
        </article>
      ))}
    </div>
  )
}

export default function C3OpsShell() {
  const [active, setActive] = useState<SurfaceKey>("current")
  const definition = useMemo(() => surfaces.find((surface) => surface.key === active) ?? surfaces[0], [active])

  return (
    <div className="c3ops-shell">
      <header className="c3ops-topbar">
        <div className="c3ops-brand">
          <span className="c3ops-brand-mark">c3</span>
          <div><strong>Ops</strong><span>Governed Environment</span></div>
        </div>
        <div className="c3ops-host-context">
          <span>c3ops.c3field.online</span>
          <span className="c3ops-state">shell formation</span>
        </div>
      </header>

      <div className="c3ops-horizontal">
        <div><Eye size={15} /><strong>c3Optics</strong><span>observe · correlate · verify</span></div>
        <div><Network size={15} /><strong>Material Layer</strong><span>bounded interoperability</span></div>
      </div>

      <div className="c3ops-body">
        <aside className="c3ops-rail">
          <nav>
            {surfaces.map((surface) => {
              const Icon = surface.icon
              return (
                <button
                  key={surface.key}
                  type="button"
                  data-active={active === surface.key}
                  aria-current={active === surface.key ? "page" : undefined}
                  onClick={() => setActive(surface.key)}
                >
                  <Icon size={18} />
                  <span>{surface.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="c3ops-law">
            <GitBranch size={15} />
            <span>Visibility ≠ action<br />Action ≠ passage<br />Passage ≠ authority</span>
          </div>
        </aside>

        <main className="c3ops-main">
          <section className="c3ops-heading">
            <div>
              <p className="c3ops-eyebrow">c3 Ops / {definition.label}</p>
              <h1>{definition.label}</h1>
            </div>
            <p>{definition.question}</p>
          </section>

          {active === "current" ? <CurrentSurface /> : null}
          {active === "build" ? <BuildSurface /> : null}
          {active === "work" ? (
            <section className="c3ops-work">
              <div className="c3ops-substrate"><Activity size={16} /><span>Existing governed WORK substrate</span></div>
              <OarOperationsConsole />
            </section>
          ) : null}
          {active === "systems" ? <SystemsSurface /> : null}
          {active === "registry" ? <RegistrySurface /> : null}
          {active === "evidence" ? <EvidenceSurface /> : null}
        </main>
      </div>
    </div>
  )
}
