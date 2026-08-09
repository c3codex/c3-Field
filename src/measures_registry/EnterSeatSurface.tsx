import React, { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

interface EnterSeatSurfaceProps {
  renderHeader: () => React.ReactNode
  renderSystemFooter: () => React.ReactNode
}

// FREE — Frontend Replacement Encounter Environment
// FreeEnvironment resolves the enter_seat call from Registry standing,
// reads the Lapis Antechamber directory, resolves MAP findings, resolves evidence requirements,
// and invokes the registered renderer to materialize the encounter.
export function FreeEnvironment({
  callKey,
  renderHeader,
  renderSystemFooter,
}: {
  callKey: string
  renderHeader: () => React.ReactNode
  renderSystemFooter: () => React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [resolvedEnv, setResolvedEnv] = useState<any>(null)
  const [dbSystemRecord, setDbSystemRecord] = useState<any>(null)
  const [dbEncounterDef, setDbEncounterDef] = useState<any>(null)
  const [dbMediaRecords, setDbMediaRecords] = useState<any[]>([])
  
  // Dynamic form state (derived entirely from Registry-defined definitions)
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [isEvidenceVerified, setIsEvidenceVerified] = useState(false)

  // FREE Call Overlay/Simulator State
  const [activeFreeCall, setActiveFreeCall] = useState<string | null>(null)
  const [freeCallResponseMsg, setFreeCallResponseMsg] = useState("")

  useEffect(() => {
    async function resolveRegistryAndCall() {
      try {
        // 1. FREE reads the Lapis Antechamber directory and environment configuration from Registry standing
        const { data: envData, error: envErr } = await supabase
          .from("measures_registry")
          .select("*")
          .eq("registry_key", "measures_registry_lapis_antechamber")
          .maybeSingle()

        if (envErr) throw envErr
        if (!envData) {
          console.error("Fail-closed: No Registry record found for Lapis Antechamber.")
          return
        }

        const metadata = envData.metadata as any
        setResolvedEnv(metadata)

        // Pre-populate dynamic form fields from the database definitions
        const initialVals: Record<string, string> = {}
        metadata.evidence_definition_set?.definitions?.forEach((field: any) => {
          initialVals[field.key] = field.default_value || ""
        })
        setFormValues(initialVals)

        // 2. FREE resolves dynamic system-specific records from findings_source rules
        const sysKey = metadata.findings_source?.system_key || "measures_of_inanna"
        
        const [sysRes, encRes, mediaRes] = await Promise.all([
          supabase
            .from("c3_registered_system")
            .select("*")
            .eq("system_key", sysKey)
            .maybeSingle(),
          supabase
            .from("measures_encounter_def")
            .select("*")
            .eq("encounter_key", "epigraph_view")
            .maybeSingle(),
          supabase
            .from("measures_media_map")
            .select("*")
            .or("media_role.ilike.%epigraph%,metadata.cast.text.ilike.%epigraph%"),
        ])

        setDbSystemRecord(sysRes.data || null)
        setDbEncounterDef(encRes.data || null)
        setDbMediaRecords(mediaRes.data || [])

      } catch (err) {
        console.error("Error resolving Registry standing for Lapis Antechamber:", err)
      } finally {
        setLoading(false)
      }
    }

    void resolveRegistryAndCall()
  }, [callKey])

  if (loading) {
    return (
      <div style={{ background: "#02040a", color: "#8b949e", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>
        Resolving FREE Call: {callKey} from Registry standing...
      </div>
    )
  }

  if (!resolvedEnv) {
    return (
      <div style={{ background: "#02040a", color: "#f04e4e", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "monospace", padding: "2rem", textAlign: "center" }}>
        <strong>FAIL CLOSED STANDING</strong>
        <p style={{ marginTop: "0.5rem", color: "#8b949e", maxWidth: "600px" }}>
          Measures Registry could not authorize admission. Lapis Antechamber directory record is missing or access is restricted.
        </p>
      </div>
    )
  }

  // 3. Registry Package Assembly is verified against rules defined by the Registry
  const readinessConditions = resolvedEnv.readiness_rule?.conditions || []
  const isPackageReady = readinessConditions.every((cond: any) => {
    if (cond.condition === "min_length") {
      const val = formValues[cond.field] || ""
      return val.trim().length >= (cond.value || 0)
    }
    if (cond.condition === "equals" && cond.field === "is_verified") {
      return isEvidenceVerified === cond.value
    }
    return false
  })

  // Continuously assemble Registry Package following resolved schema properties
  const assembledRegistryPackage = {
    package_type: resolvedEnv.registry_package_schema?.package_type || "fallback_manifest",
    system_scope: resolvedEnv.registry_package_schema?.system_scope || "unspecified",
    segment: resolvedEnv.registry_package_schema?.segment || "unspecified",
    timestamp: new Date().toISOString(),
    evidence: {
      ...formValues,
      media_records_checksum: dbMediaRecords.map((m) => m.id).join("-") || "fallback",
    },
    governance_metrics: {
      identity: dbSystemRecord ? "verified" : "missing",
      assets: dbMediaRecords.some((m) => m.is_active) ? "present_unverified" : "missing",
      encounter_definition: dbEncounterDef ? "verified" : "missing",
      renderer: "not_assessed",
      src: "held",
      review: "held",
    },
    integrity_seal: resolvedEnv.registry_package_schema?.integrity_seal || "pending"
  }

  // Handle simulated FREE Calls dynamically from Registry definitions
  const handleFreeCallTrigger = (call: any) => {
    setActiveFreeCall(call.label)
    setFreeCallResponseMsg(call.response || "Authoritative execution held.")
  }

  const styles = {
    container: {
      background: "#02040a",
      color: "#e6edf3",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column" as const,
      fontFamily: "monospace, Courier, sans-serif",
    },
    main: {
      flex: 1,
      maxWidth: "1100px",
      margin: "0 auto",
      width: "100%",
      padding: "2.5rem 1.5rem",
      boxSizing: "border-box" as const,
    },
    headerWrapper: {
      borderBottom: "1px solid rgba(48,54,61,0.8)",
      paddingBottom: "1.5rem",
      marginBottom: "2rem",
    },
    institutionHeader: {
      fontSize: "1.75rem",
      fontWeight: "bold",
      letterSpacing: "0.06em",
      textTransform: "uppercase" as const,
      color: "#d09d3c",
      margin: "0 0 0.25rem 0",
    },
    antechamberSubtitle: {
      color: "#8b949e",
      fontSize: "0.95rem",
      letterSpacing: "0.15em",
      textTransform: "uppercase" as const,
      margin: "0 0 0.5rem 0",
    },
    registryTag: {
      fontSize: "0.7rem",
      color: "#388bfd",
      background: "rgba(56,139,253,0.1)",
      border: "1px solid rgba(56,139,253,0.2)",
      borderRadius: "0.25rem",
      padding: "0.2rem 0.5rem",
      display: "inline-block",
      letterSpacing: "0.05em",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "1.5rem",
      marginBottom: "2rem",
    },
    card: {
      background: "#0d1117",
      border: "1px solid rgba(48,54,61,0.7)",
      borderRadius: "0.5rem",
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column" as const,
    },
    cardTitle: {
      fontSize: "0.85rem",
      fontWeight: "bold" as const,
      letterSpacing: "0.1em",
      textTransform: "uppercase" as const,
      color: "#f0f6fc",
      marginBottom: "1rem",
      borderBottom: "1px solid rgba(48,54,61,0.5)",
      paddingBottom: "0.5rem",
    },
    badge: (status: string) => {
      let bg = "rgba(110,118,129,0.15)"
      let color = "#8b949e"
      if (status === "verified") {
        bg = "rgba(46,160,67,0.15)"
        color = "#3fb950"
      } else if (status === "present_unverified") {
        bg = "rgba(210,153,60,0.15)"
        color = "#d09d3c"
      } else if (status === "missing") {
        bg = "rgba(240,78,78,0.15)"
        color = "#f04e4e"
      } else if (status === "held") {
        bg = "rgba(187,128,255,0.15)"
        color = "#bc8cff"
      }
      return {
        background: bg,
        color,
        border: `1px solid ${color}33`,
        padding: "0.2rem 0.5rem",
        borderRadius: "0.25rem",
        fontSize: "0.65rem",
        fontWeight: "bold" as const,
        textTransform: "uppercase" as const,
      }
    },
    input: {
      background: "#161b22",
      border: "1px solid rgba(48,54,61,0.8)",
      borderRadius: "0.375rem",
      color: "#c9d1d9",
      padding: "0.5rem 0.75rem",
      fontSize: "0.8rem",
      fontFamily: "monospace",
      width: "100%",
      boxSizing: "border-box" as const,
      marginBottom: "0.75rem",
    },
    textarea: {
      background: "#161b22",
      border: "1px solid rgba(48,54,61,0.8)",
      borderRadius: "0.375rem",
      color: "#c9d1d9",
      padding: "0.5rem 0.75rem",
      fontSize: "0.8rem",
      fontFamily: "monospace",
      width: "100%",
      height: "70px",
      boxSizing: "border-box" as const,
      marginBottom: "0.75rem",
      resize: "none" as const,
    },
    btnCall: (isHeld: boolean) => ({
      background: isHeld ? "rgba(187,128,255,0.03)" : "rgba(56,139,253,0.08)",
      border: isHeld ? "1px solid rgba(187,128,255,0.2)" : "1px solid rgba(56,139,253,0.3)",
      color: isHeld ? "#bc8cff" : "#58a6ff",
      borderRadius: "0.25rem",
      padding: "0.4rem 0.75rem",
      fontSize: "0.7rem",
      fontWeight: "bold" as const,
      cursor: "pointer",
      textAlign: "left" as const,
      transition: "all 0.15s ease",
    }),
    progressionContainer: {
      background: "#0d1117",
      border: "1px solid rgba(48,54,61,0.7)",
      borderRadius: "0.5rem",
      padding: "1.25rem",
      marginBottom: "2rem",
    },
    progressionList: {
      display: "flex",
      flexWrap: "wrap" as const,
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.75rem",
      lineHeight: "1.6",
    },
    progressionItem: (isActive: boolean) => ({
      padding: "0.25rem 0.5rem",
      borderRadius: "0.25rem",
      background: isActive ? "rgba(208,157,60,0.1)" : "transparent",
      color: isActive ? "#d09d3c" : "#8b949e",
      border: isActive ? "1px solid rgba(208,157,60,0.3)" : "1px solid transparent",
      fontWeight: isActive ? ("bold" as const) : ("normal" as const),
    })
  }

  return (
    <div style={styles.container}>
      {renderHeader()}

      <main style={styles.main}>
        {/* Environment Boundaries Warning */}
        <div style={{
          background: "rgba(210,153,60,0.05)",
          border: "1px solid rgba(210,153,60,0.2)",
          borderRadius: "0.375rem",
          padding: "1rem",
          marginBottom: "1.5rem",
          fontSize: "0.75rem",
          color: "#d09d3c",
          lineHeight: "1.4"
        }}>
          <strong>Secondary Governed Environment Isolation Policy</strong>
          <p style={{ margin: "0.25rem 0 0 0", color: "#8b949e" }}>
            The Lapis Antechamber is decoupled from production registry mutations. No records are inserted into the database registry, and no standing determinations are committed. Actions form evidence only.
          </p>
        </div>

        {/* Brand Layer & Identity (Dressed from findings_source) */}
        <div style={styles.headerWrapper}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: "1rem" }}>
            <div>
              <div style={styles.antechamberSubtitle}>Lapis Antechamber</div>
              <h1 style={styles.institutionHeader}>
                {resolvedEnv.findings_source?.system_name || "Measures of Inanna"}
              </h1>
              <div style={styles.registryTag}>
                Governing System: {resolvedEnv.governing_system || "measures_registry"}
              </div>
            </div>
            <div style={{ ...styles.badge("held"), padding: "0.4rem 0.75rem", fontSize: "0.75rem" }}>
              Standing Unresolved
            </div>
          </div>
        </div>

        {/* Formation Work Surface Grid */}
        <div style={styles.grid}>
          {/* MAP Findings Resolved dynamically */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>MAP Findings (Epigraph Seating)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.75rem" }}>
              {(resolvedEnv.findings_source?.findings || []).map((finding: any) => {
                let currentStatus = finding.required_state
                let isCurrentSeated = false

                if (finding.key === "identity_row") {
                  isCurrentSeated = !!dbSystemRecord
                  currentStatus = dbSystemRecord ? "Seated" : "Unresolved"
                } else if (finding.key === "encounter_def") {
                  isCurrentSeated = !!dbEncounterDef
                  currentStatus = dbEncounterDef ? `${dbEncounterDef.display_title} Seated` : "Unresolved"
                } else if (finding.key === "epigraph_media") {
                  isCurrentSeated = dbMediaRecords.length > 0
                  currentStatus = dbMediaRecords.length > 0 ? `${dbMediaRecords.length} Resolved` : "fallback"
                } else if (finding.key === "participant_standing" || finding.key === "seat_active_standing") {
                  isCurrentSeated = false
                  currentStatus = finding.required_state
                }

                return (
                  <div key={finding.key} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(48,54,61,0.3)", paddingBottom: "0.4rem" }}>
                    <span style={{ color: "#8b949e" }}>{finding.label}:</span>
                    <span style={{ color: isCurrentSeated ? "#3fb950" : "#f04e4e", fontWeight: "bold" }}>
                      {currentStatus}
                    </span>
                  </div>
                )
              })}

              <div style={{ borderTop: "1px solid rgba(48,54,61,0.5)", paddingTop: "0.5rem", fontSize: "0.65rem", color: "#8b949e", lineHeight: "1.4" }}>
                * Missing references remain visibly unresolved. No inferred complete standing is represented.
              </div>
            </div>
          </div>

          {/* Working Evidence Formation Editor dynamically resolved */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Working Evidence Editor</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {(resolvedEnv.evidence_definition_set?.definitions || []).map((def: any) => (
                <React.Fragment key={def.key}>
                  <label style={{ fontSize: "0.65rem", color: "#8b949e", marginBottom: "0.25rem", textTransform: "uppercase" }}>
                    {def.label}
                  </label>
                  {def.type === "textarea" ? (
                    <textarea
                      style={styles.textarea}
                      value={formValues[def.key] || ""}
                      onChange={(e) => setFormValues({ ...formValues, [def.key]: e.target.value })}
                      placeholder={def.placeholder}
                    />
                  ) : (
                    <input
                      type="text"
                      style={styles.input}
                      value={formValues[def.key] || ""}
                      onChange={(e) => setFormValues({ ...formValues, [def.key]: e.target.value })}
                      placeholder={def.placeholder}
                    />
                  )}
                </React.Fragment>
              ))}

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                <input
                  type="checkbox"
                  id="evidence_verified"
                  checked={isEvidenceVerified}
                  onChange={(e) => setIsEvidenceVerified(e.target.checked)}
                  style={{ cursor: "pointer" }}
                />
                <label htmlFor="evidence_verified" style={{ fontSize: "0.7rem", color: "#c9d1d9", cursor: "pointer" }}>
                  Verify evidence is correct
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Evidence Formation Status Grid resolved dynamically */}
        <div style={{ ...styles.card, marginBottom: "2rem" }}>
          <div style={styles.cardTitle}>Evidence Formation Status</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem" }}>
            {(resolvedEnv.evidence_definition_set?.status_positions || []).map((item: any, i: number) => {
              let currentStatus = item.status || "missing"
              let currentSrc = item.src || "provisional fallback"

              if (item.source === "system_record") {
                currentStatus = dbSystemRecord ? "verified" : "missing"
                currentSrc = "Registry"
              } else if (item.source === "media_records") {
                const hasMedia = dbMediaRecords.length > 0
                currentStatus = hasMedia ? "present_unverified" : "missing"
                currentSrc = "Registry"
              } else if (item.source === "encounter_def") {
                currentStatus = dbEncounterDef ? "verified" : "missing"
                currentSrc = "Registry"
              }

              return (
                <div key={i} style={{
                  background: "rgba(110,118,129,0.03)",
                  border: "1px solid rgba(48,54,61,0.6)",
                  borderRadius: "0.25rem",
                  padding: "0.75rem",
                  fontSize: "0.75rem",
                }}>
                  <div style={{ fontWeight: "bold", marginBottom: "0.4rem", color: "#f0f6fc" }}>{item.label}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    <div><span style={styles.badge(currentStatus)}>{currentStatus}</span></div>
                    <div style={{ fontSize: "0.6rem", color: currentSrc === "Registry" ? "#388bfd" : "#d09d3c" }}>{currentSrc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Registry Package Assembler (dynamic rules) */}
        <div style={{ ...styles.card, marginBottom: "2rem", border: isPackageReady ? "1px solid rgba(46,160,67,0.5)" : "1px solid rgba(48,54,61,0.7)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid rgba(48,54,61,0.5)", paddingBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "bold", letterSpacing: "0.1em", textTransform: "uppercase" }}>Registry Package Assembly</span>
            <span style={styles.badge(isPackageReady ? "verified" : "missing")}>
              Package {isPackageReady ? "Ready" : "Incomplete"}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div>
              <p style={{ fontSize: "0.75rem", color: "#8b949e", lineHeight: "1.4", margin: "0 0 1rem 0" }}>
                The Registry Package is assembled continuously from Lapis Antechamber evidence. When all fields are complete and checked verified, the package is ready for manual transition.
              </p>
              <div style={{
                fontSize: "0.75rem",
                background: isPackageReady ? "rgba(46,160,67,0.05)" : "rgba(240,78,78,0.03)",
                border: isPackageReady ? "1px solid rgba(46,160,67,0.2)" : "1px solid rgba(240,78,78,0.1)",
                padding: "0.75rem",
                borderRadius: "0.25rem",
                color: isPackageReady ? "#3fb950" : "#f04e4e"
              }}>
                {isPackageReady ? (
                  <strong>✓ Package verification rules satisfied. Evidence formed.</strong>
                ) : (
                  <strong>⚠ Package incomplete. {resolvedEnv.readiness_rule?.description}</strong>
                )}
              </div>
            </div>
            <div>
              <pre style={{
                background: "#161b22",
                padding: "0.75rem",
                borderRadius: "0.375rem",
                fontSize: "0.65rem",
                color: "#8b949e",
                overflow: "auto",
                height: "120px",
                margin: 0,
                border: "1px solid rgba(48,54,61,0.5)"
              }}>
                {JSON.stringify(assembledRegistryPackage, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* FREE Calls Surface resolved dynamically */}
        <div style={{ ...styles.card, marginBottom: "2rem" }}>
          <div style={styles.cardTitle}>Materialized FREE Calls</div>
          <p style={{ fontSize: "0.75rem", color: "#8b949e", margin: "0 0 1rem 0" }}>
            Select a FREE Call to execute validation within secondary governed boundaries. No Registry mutations are performed.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-wrap, minmax(180px, 1fr))", gap: "0.75rem", gridAutoFlow: "column" }}>
            {(resolvedEnv.free_calls || []).map((call: any) => (
              <button
                key={call.key}
                style={styles.btnCall(call.standing === "held")}
                onClick={() => handleFreeCallTrigger(call)}
              >
                {call.label} {call.standing === "held" ? "(held)" : ""} &rarr;
              </button>
            ))}
          </div>

          {activeFreeCall && (
            <div style={{
              marginTop: "1.25rem",
              background: "#161b22",
              border: "1px solid rgba(56,139,253,0.3)",
              borderRadius: "0.375rem",
              padding: "1rem",
              position: "relative" as const
            }}>
              <button
                onClick={() => setActiveFreeCall(null)}
                style={{
                  position: "absolute" as const,
                  right: "0.75rem",
                  top: "0.75rem",
                  background: "transparent",
                  border: "none",
                  color: "#8b949e",
                  cursor: "pointer",
                  fontSize: "0.8rem"
                }}
              >
                ✕
              </button>
              <div style={{ fontSize: "0.7rem", color: "#58a6ff", fontWeight: "bold", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                Resolution Event: {activeFreeCall}
              </div>
              <p style={{ fontSize: "0.75rem", color: "#c9d1d9", margin: 0, lineHeight: "1.4" }}>
                {freeCallResponseMsg}
              </p>
            </div>
          )}
        </div>

        {/* Inanna Progression Reference (dynamically loaded) */}
        {resolvedEnv.progression_reference && (
          <div style={styles.progressionContainer}>
            <div style={{ fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase", marginBottom: "0.75rem", letterSpacing: "0.05em", color: "#8b949e" }}>
              Inanna Sequence Reference (Orientation)
            </div>
            <div style={styles.progressionList}>
              {resolvedEnv.progression_reference.map((step: string, idx: number) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span style={{ color: "#30363d" }}>&rarr;</span>}
                  <span style={styles.progressionItem(step === "Epigraph")}>
                    {step}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </main>

      {renderSystemFooter()}
    </div>
  )
}

export default function EnterSeatSurface({ renderHeader, renderSystemFooter }: EnterSeatSurfaceProps) {
  return (
    <FreeEnvironment
      callKey="enter_seat"
      renderHeader={renderHeader}
      renderSystemFooter={renderSystemFooter}
    />
  )
}
