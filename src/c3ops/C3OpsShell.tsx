import { useMemo, useState } from "react"
import {
  Activity,
  Boxes,
  CircleDot,
  Eye,
  FileStack,
  GitBranch,
  Layers3,
  LockKeyhole,
  Network,
  Orbit,
  Plus,
  ShieldCheck,
  Workflow,
} from "lucide-react"
import OarOperationsConsole from "../c3_field_convergence/OarOperationsConsole"
import "./c3OpsShell.css"

type SurfaceKey = "current" | "systems" | "registry" | "evidence" | "build" | "work"
type SurfaceKind = "view" | "operation"

type SurfaceDefinition = {
  key: SurfaceKey
  label: string
  question: string
  kind: SurfaceKind
  icon: typeof CircleDot
  access: "scoped_read" | "secure_operation"
}

const views: SurfaceDefinition[] = [
  { key: "current", label: "Current", question: "What is true now?", kind: "view", icon: CircleDot, access: "scoped_read" },
  { key: "systems", label: "Systems", question: "Where does bounded responsibility live?", kind: "view", icon: Boxes, access: "scoped_read" },
  { key: "registry", label: "Registry", question: "What does this environment recognize?", kind: "view", icon: Orbit, access: "scoped_read" },
  { key: "evidence", label: "Evidence", question: "Why is this state trusted?", kind: "view", icon: FileStack, access: "scoped_read" },
]

const operations: SurfaceDefinition[] = [
  { key: "build", label: "Build", question: "What environment are we forming?", kind: "operation", icon: Layers3, access: "secure_operation" },
  { key: "work", label: "Work", question: "What governed work is moving?", kind: "operation", icon: Workflow, access: "secure_operation" },
]

const surfaces = [...views, ...operations]

const accessContext = [
  ["Identity", "unresolved"],
  ["Role", "unresolved"],
  ["Environment", "env_c3ops"],
  ["View permission", "not yet resolved"],
  ["Process permission", "not yet resolved"],
  ["Action authority", "not yet resolved"],
]

function SurfaceNav({
  title,
  items,
  active,
  onSelect,
}: {
  title: string
  items: SurfaceDefinition[]
  active: SurfaceKey
  onSelect: (key: SurfaceKey) => void
}) {
  return (
    <div className="c3ops-nav-group">
      <p>{title}</p>
      {items.map((surface) => {
        const Icon = surface.icon
        return (
          <button
            key={surface.key}
            type="button"
            data-active={active === surface.key}
            data-kind={surface.kind}
            aria-current={active === surface.key ? "page" : undefined}
            onClick={() => onSelect(surface.key)}
          >
            <Icon size={17} />
            <span>{surface.label}</span>
            {surface.kind === "operation" ? <LockKeyhole className="c3ops-nav-lock" size={12} /> : null}
          </button>
        )
      })}
    </div>
  )
}

function AccessBoundary({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? "c3ops-access-boundary c3ops-access-compact" : "c3ops-access-boundary"}>
      <div className="c3ops-access-heading">
        <LockKeyhole size={16} />
        <div>
          <strong>Secure access boundary</strong>
          <span>Identity → role → environment → permission → authority</span>
        </div>
      </div>
      {!compact ? (
        <dl>
          {accessContext.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  )
}

function BuildSurface() {
  const [previewOpen, setPreviewOpen] = useState(false)

  return (
    <div className="c3ops-stack">
      <AccessBoundary />

      <section className="c3ops-call-card" data-secure-operation="true">
        <div className="c3ops-free-mark">FREE</div>
        <div className="c3ops-call-copy">
          <p className="c3ops-eyebrow">Process call · secure operation</p>
          <h2>Environment</h2>
          <p>
            BUILD is the operations workspace. It calls the Environment encounter, which forms a bounded
            environment definition. The encounter does not grant standing, Current, implementation authority,
            or activation.
          </p>
        </div>
        <button
          className="c3ops-primary-action"
          type="button"
          onClick={() => setPreviewOpen((value) => !value)}
        >
          <Plus size={16} />
          {previewOpen ? "Close Preview" : "Preview Environment"}
        </button>

        {previewOpen ? (
          <div className="c3ops-environment-form">
            <div className="c3ops-boundary-note">
              <ShieldCheck size={18} />
              <div>
                <strong>Preview only · no process call</strong>
                <span>Inputs remain local to this shell. Nothing is persisted, elevated, transferred, or activated.</span>
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

      <section className="c3ops-process-register">
        <p className="c3ops-eyebrow">Underlying registered process family</p>
        <div>
          {["Environment formation", "MGS evaluation", "Standing resolution", "Current binding", "Evidence return"].map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </section>
    </div>
  )
}

function CurrentSurface() {
  return (
    <div className="c3ops-grid">
      <article className="c3ops-card c3ops-card-wide">
        <p className="c3ops-eyebrow">View · governed present state</p>
        <div className="c3ops-card-title-row">
          <h2>env_c3ops</h2>
          <span className="c3ops-state c3ops-state-held">Current held</span>
        </div>
        <dl className="c3ops-detail-list">
          <div><dt>Surface</dt><dd>c3ops.c3field.online</dd></div>
          <div><dt>Parent relation</dt><dd>env_c3_community_connect</dd></div>
          <div><dt>Current</dt><dd>held_env_c3ops_current_binding_missing</dd></div>
          <div><dt>View standing</dt><dd>shell projection only · resolver not yet wired</dd></div>
        </dl>
      </article>

      <article className="c3ops-card">
        <p className="c3ops-eyebrow">View boundary</p>
        <h3>Current shows state. It does not move state.</h3>
        <p>The shell will not inherit the parent C1 Current or fabricate state in frontend memory.</p>
      </article>

      <article className="c3ops-card">
        <p className="c3ops-eyebrow">Optics</p>
        <h3>Read what passage produced.</h3>
        <p>Once Current is bound, this view should resolve evidence, holds, passage, and resulting standing.</p>
      </article>
    </div>
  )
}

function SystemsSurface() {
  return (
    <div className="c3ops-grid">
      {["Measures Registry", "Measures of Inanna", "c3 Field", "c3 Ops"].map((name) => (
        <article className="c3ops-card" key={name}>
          <p className="c3ops-eyebrow">View · bounded responsibility</p>
          <h3>{name}</h3>
          <p>Classification, environment relation, and standing will resolve from governed authority.</p>
        </article>
      ))}
    </div>
  )
}

function RegistrySurface() {
  return (
    <div className="c3ops-object-grid">
      {["People", "Agents", "Roles", "Systems", "Environments", "Processes", "Sources", "Assets", "Relationships", "Standing"].map((name) => (
        <article key={name}>
          <Orbit size={16} />
          <div>
            <span>{name}</span>
            <small>read model</small>
          </div>
        </article>
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
          <p className="c3ops-eyebrow">View · evidence</p>
          <h3>{title}</h3>
          <p>{body}</p>
        </article>
      ))}
    </div>
  )
}

function WorkSurface() {
  const [previewOpen, setPreviewOpen] = useState(false)

  return (
    <div className="c3ops-stack">
      <AccessBoundary />
      <section className="c3ops-operation-intro">
        <div>
          <p className="c3ops-eyebrow">Operations workspace</p>
          <h2>Governed work</h2>
          <p>
            WORK invokes and observes registered processes. The existing OAR Operations Spine remains a process
            substrate; it is not c3 Ops itself.
          </p>
        </div>
        <button className="c3ops-secondary-action" type="button" onClick={() => setPreviewOpen((value) => !value)}>
          <Activity size={15} />
          {previewOpen ? "Hide substrate" : "Inspect substrate"}
        </button>
      </section>

      <section className="c3ops-process-register">
        <p className="c3ops-eyebrow">Process families</p>
        <div>
          {["OAR lifecycle", "Custody resolution", "Transfer", "Registration", "Review", "Publication / distribution"].map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </section>

      {previewOpen ? (
        <section className="c3ops-work">
          <div className="c3ops-substrate">
            <Activity size={16} />
            <span>Existing governed WORK substrate · inspection only</span>
          </div>
          <OarOperationsConsole />
        </section>
      ) : null}
    </div>
  )
}

export default function C3OpsShell() {
  const [active, setActive] = useState<SurfaceKey>("current")
  const definition = useMemo(
    () => surfaces.find((surface) => surface.key === active) ?? surfaces[0],
    [active],
  )

  return (
    <div className="c3ops-shell">
      <header className="c3ops-topbar">
        <div className="c3ops-brand">
          <span className="c3ops-brand-mark">c3</span>
          <div>
            <strong>Ops</strong>
            <span>Secure governed environment</span>
          </div>
        </div>
        <div className="c3ops-host-context">
          <span>c3ops.c3field.online</span>
          <span className="c3ops-state c3ops-state-held">access unresolved</span>
        </div>
      </header>

      <div className="c3ops-horizontal">
        <div><Eye size={15} /><strong>c3Optics</strong><span>observe · correlate · verify</span></div>
        <div><Network size={15} /><strong>Material Layer</strong><span>bounded interoperability</span></div>
      </div>

      <div className="c3ops-body">
        <aside className="c3ops-rail">
          <div>
            <SurfaceNav title="Views" items={views} active={active} onSelect={setActive} />
            <SurfaceNav title="Operations" items={operations} active={active} onSelect={setActive} />
          </div>

          <div className="c3ops-rail-lower">
            <AccessBoundary compact />
            <div className="c3ops-law">
              <GitBranch size={15} />
              <span>Visibility ≠ action<br />Action ≠ passage<br />Passage ≠ authority</span>
            </div>
          </div>
        </aside>

        <main className="c3ops-main">
          <section className="c3ops-heading">
            <div>
              <div className="c3ops-heading-meta">
                <span className={definition.kind === "view" ? "c3ops-kind c3ops-kind-view" : "c3ops-kind c3ops-kind-operation"}>
                  {definition.kind}
                </span>
                <span className="c3ops-access-label">
                  {definition.access === "scoped_read" ? "scoped read" : "secure access required"}
                </span>
              </div>
              <p className="c3ops-eyebrow">c3 Ops / {definition.label}</p>
              <h1>{definition.label}</h1>
            </div>
            <p>{definition.question}</p>
          </section>

          {active === "current" ? <CurrentSurface /> : null}
          {active === "systems" ? <SystemsSurface /> : null}
          {active === "registry" ? <RegistrySurface /> : null}
          {active === "evidence" ? <EvidenceSurface /> : null}
          {active === "build" ? <BuildSurface /> : null}
          {active === "work" ? <WorkSurface /> : null}
        </main>
      </div>
    </div>
  )
}
