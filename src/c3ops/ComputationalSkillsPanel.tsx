import { useEffect, useMemo, useState } from "react"
import { ShieldCheck } from "lucide-react"
import { supabase, supabaseConfigError } from "../integrations/supabase/client"

type ComputationalSkillRow = {
  skill_key: string
  skill_uri: string
  skill_name: string
  provider_key: string
  observed_available: boolean
  role_call_required: boolean
  authority_effect: string
  external_relation_rule: string
}

type RoleCallSkillProcessRow = {
  process_key: string
  status: string | null
  authority_state: string | null
  metadata: Record<string, unknown> | null
}

function metadataString(metadata: Record<string, unknown> | null, key: string) {
  const value = metadata?.[key]
  return typeof value === "string" ? value : null
}

function metadataNumber(metadata: Record<string, unknown> | null, key: string) {
  const value = metadata?.[key]
  return typeof value === "number" ? value : null
}

export default function ComputationalSkillsPanel() {
  const [skills, setSkills] = useState<ComputationalSkillRow[]>([])
  const [process, setProcess] = useState<RoleCallSkillProcessRow | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (supabaseConfigError) {
      setError("Computational skill Registry read unavailable")
      return
    }

    let active = true
    void Promise.all([
      supabase
        .from("system_process_registry")
        .select("process_key,status,authority_state,metadata")
        .eq("process_key", "c3ops_role_call_computational_skills_v1")
        .maybeSingle(),
      supabase
        .from("c3_computational_skill_catalog")
        .select("skill_key,skill_uri,skill_name,provider_key,observed_available,role_call_required,authority_effect,external_relation_rule")
        .eq("is_active", true)
        .order("provider_key")
        .order("skill_name"),
    ]).then(([processResult, skillResult]) => {
      if (!active) return
      if (processResult.error || skillResult.error) {
        setError("Role Call computational skill standing unavailable")
        return
      }

      setProcess((processResult.data ?? null) as RoleCallSkillProcessRow | null)
      setSkills((skillResult.data ?? []) as ComputationalSkillRow[])
      setError(null)
    })

    return () => {
      active = false
    }
  }, [])

  const providerGroups = useMemo(() => {
    const groups = new Map<string, ComputationalSkillRow[]>()
    skills.forEach((skill) => {
      const existing = groups.get(skill.provider_key) ?? []
      existing.push(skill)
      groups.set(skill.provider_key, existing)
    })
    return Array.from(groups.entries())
  }, [skills])

  const metadata = process?.metadata ?? null
  const runtimeObserved = metadataNumber(metadata, "runtime_observed_skill_count")
  const registeredCount = metadataNumber(metadata, "registered_skill_count")
  const heldCount = metadataNumber(metadata, "catalog_write_hold_count")
  const roleKey = metadataString(metadata, "role_key") ?? "role unresolved"
  const environmentKey = metadataString(metadata, "environment_key") ?? "env_c3ops"

  return (
    <section className="c3ops-skill-panel" aria-labelledby="computational-skills">
      <div className="c3ops-skill-heading">
        <div>
          <p className="c3ops-eyebrow">Registry / Role Call</p>
          <h2 id="computational-skills">Computational Skills</h2>
          <p>Role Call resolves capability availability. Process, permission, Boundary, and effect authority remain separate.</p>
        </div>
        <div className="c3ops-skill-standing">
          <span>{process?.status ?? (error ? "held" : "reading Registry")}</span>
          <small>{process?.authority_state ?? "capability standing unresolved"}</small>
        </div>
      </div>

      <dl className="c3ops-skill-summary">
        <div><dt>Role</dt><dd>{roleKey}</dd></div>
        <div><dt>Environment</dt><dd>{environmentKey}</dd></div>
        <div><dt>Runtime observed</dt><dd>{runtimeObserved ?? "—"}</dd></div>
        <div><dt>Registered</dt><dd>{registeredCount ?? skills.length}</dd></div>
        <div><dt>Catalog hold</dt><dd>{heldCount ?? "—"}</dd></div>
        <div><dt>Authority effect</dt><dd>none</dd></div>
      </dl>

      {error ? <div className="c3ops-skill-hold">{error}</div> : null}

      <div className="c3ops-skill-providers">
        {providerGroups.map(([provider, providerSkills]) => (
          <article key={provider}>
            <div>
              <strong>{provider}</strong>
              <span>{providerSkills.length} registered</span>
            </div>
            <div className="c3ops-skill-list">
              {providerSkills.map((skill) => (
                <span key={skill.skill_key} title={skill.skill_uri}>
                  {skill.skill_name}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="c3ops-skill-law">
        <ShieldCheck size={15} />
        <span>skill present ≠ role eligible ≠ effect authorized ≠ action executed</span>
      </div>
    </section>
  )
}
