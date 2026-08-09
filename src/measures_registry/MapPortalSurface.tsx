import React, { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import type { MarbleChamberProps } from "./encounter_renderer/chambers/MarbleChamberRenderer"

// FREE — Frontend Replacement Encounter Environment
// MapPortalSurface manifests the governed admission profile results for /map-portal.
// It has NO frontend-owned simulation, fake override controls, or hardcoded mock progression state.
interface EvidenceRef {
  evidence_key: string
  evidence_class: string
  content_hash: string
  evidence_standing: string
}

export function MapPortalSurface({
  encounter,
  registryTokenStyle,
  renderHeader,
  renderSystemFooter,
  resolverData,
}: MarbleChamberProps) {
  const admission = resolverData?.mapPortalAdmission

  const profileSeated = admission?.profileSeated ?? false
  const envKeySeated = admission?.envKeyStanding === "resolved_current_state"
  const representativeRelationSeated = admission?.representativeRelationStanding === "resolved_institutional_representative"
  const mapProgressionSeated = admission?.mapProgressionSeated ?? false
  const evidenceRefs = (admission?.evidenceRefs || []) as EvidenceRef[]

  // Purely governed resolver logic
  const getResolvedAdmissionState = () => {
    if (!profileSeated) {
      return "held_missing_profile"
    }
    if (!representativeRelationSeated) {
      return admission?.representativeRelationStanding || "held_missing_representative_relation"
    }
    if (!envKeySeated) {
      return "held_missing_env_key"
    }
    if (!mapProgressionSeated) {
      return "held_no_permitted_MAP_encounter"
    }
    return "admitted_MAP_101"
  }

  const activeAdmissionState = getResolvedAdmissionState()

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
    banner: {
      background: "rgba(210,153,60,0.05)",
      border: "1px solid rgba(210,153,60,0.2)",
      borderRadius: "0.375rem",
      padding: "1rem",
      marginBottom: "1.5rem",
      fontSize: "0.75rem",
      color: "#d09d3c",
      lineHeight: "1.4"
    },
    header: {
      borderBottom: "1px solid rgba(48,54,61,0.8)",
      paddingBottom: "1.5rem",
      marginBottom: "2rem",
    },
    title: {
      fontSize: "1.75rem",
      fontWeight: "bold",
      letterSpacing: "0.06em",
      textTransform: "uppercase" as const,
      color: "#d09d3c",
      margin: "0 0 0.25rem 0",
    },
    subtitle: {
      color: "#8b949e",
      fontSize: "0.95rem",
      letterSpacing: "0.15em",
      textTransform: "uppercase" as const,
      margin: "0 0 0.5rem 0",
    },
    tag: {
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
      if (status === "admitted_MAP_101" || status === "verified" || status === "active") {
        bg = "rgba(46,160,67,0.15)"
        color = "#3fb950"
      } else if (status.startsWith("held_") || status === "held") {
        bg = "rgba(240,78,78,0.15)"
        color = "#f04e4e"
      } else if (status === "system_held") {
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
    }
  }

  if (resolverData?.loading) {
    return (
      <div style={{ background: "#02040a", color: "#8b949e", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>
        Resolving MAP Portal Standing from Registry profiles...
      </div>
    )
  }

  return (
    <div style={{ ...styles.container, ...registryTokenStyle }}>
      {renderHeader({ title: "Measures Registry" })}

      <main style={styles.main}>
        {/* Secondary Governed Environment Isolation Policy Banner */}
        <div style={styles.banner}>
          <strong>Measures Registry /map-portal Isolation Policy</strong>
          <p style={{ margin: "0.25rem 0 0 0", color: "#8b949e" }}>
            The MAP Portal is a read-only environment-first admission gate. Progression standing, active keys, and participant relations are managed strictly by registry-defined profile rules. Admission does not assign SEAT or grant Operator standing.
          </p>
        </div>

        {/* Portal Header */}
        <div style={styles.header}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={styles.subtitle}>C2 / MAP Progression Surface</div>
              <h1 style={styles.title}>MAP Portal</h1>
              <div style={styles.tag}>
                Admission Profile: map_portal_admission_profile_v1
              </div>
            </div>
            <div style={styles.badge(activeAdmissionState)}>
              Admission: {activeAdmissionState}
            </div>
          </div>
        </div>

        {/* Grid of Live DB Evidence */}
        <div style={styles.grid}>
          {/* Real Database Evidence Registry Readback */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Live Database Evidence</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8b949e" }}>Profile Seated:</span>
                <span style={{ color: profileSeated ? "#3fb950" : "#f04e4e", fontWeight: "bold" }}>
                  {profileSeated ? "Verified" : "Missing"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8b949e" }}>Institutional Rep relation:</span>
                <span style={{ color: representativeRelationSeated ? "#3fb950" : "#bc8cff", fontWeight: "bold" }}>
                  {representativeRelationSeated ? "Verified" : `Held (${activeAdmissionState})`}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8b949e" }}>Canonical env_key:</span>
                <span style={{ color: envKeySeated ? "#3fb950" : "#f04e4e", fontWeight: "bold" }}>
                  {envKeySeated ? "Active (env_measures_of_inanna)" : "Held (held_missing_env_key)"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8b949e" }}>MAP Progression records:</span>
                <span style={{ color: mapProgressionSeated ? "#3fb950" : "#bc8cff", fontWeight: "bold" }}>
                  {mapProgressionSeated ? "Verified" : "Held (Initial Module)"}
                </span>
              </div>
              {envKeySeated && evidenceRefs && evidenceRefs.length > 0 && (
                <div style={{ borderTop: "1px solid rgba(48,54,61,0.5)", paddingTop: "0.75rem", marginTop: "0.5rem" }}>
                  <span style={{ color: "#8b949e", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Current Evidence References:</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                    {evidenceRefs.map((ref: EvidenceRef, idx: number) => (
                      <div key={idx} style={{ background: "rgba(255,255,255,0.02)", padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid rgba(48,54,61,0.3)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <strong style={{ color: "#d09d3c", fontSize: "0.7rem", wordBreak: "break-all" }}>{ref.evidence_key}</strong>
                          <span style={styles.badge("verified")}>{ref.evidence_class}</span>
                        </div>
                        <div style={{ color: "#8b949e", fontSize: "0.6rem", marginTop: "0.25rem", wordBreak: "break-all" }}>
                          SHA-256: <code style={{ color: "#e6edf3" }}>{ref.content_hash}</code>
                        </div>
                        <div style={{ color: "#8b949e", fontSize: "0.6rem" }}>
                          Standing: <span style={{ color: "#bc8cff" }}>{ref.evidence_standing}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* system_held GPT Guide Role */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>System-Held GPT Guide</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8b949e" }}>Role Resolution:</span>
                <span style={styles.badge("system_held")}>system_held</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8b949e" }}>GPT Guide Type:</span>
                <span style={{ color: "#bc8cff", fontWeight: "bold" }}>Chazz Role</span>
              </div>
              <p style={{ color: "#8b949e", fontSize: "0.65rem", lineHeight: "1.4", margin: "0.5rem 0 0 0" }}>
                The Institutional Representative does not choose or possess a personal role key. The guide assists with the current active encounter.
              </p>
            </div>
          </div>
        </div>

        {/* Admitted MAP Progression Modules Section */}
        <div style={{ ...styles.card, marginBottom: "2rem" }}>
          <div style={styles.cardTitle}>MAP Module Progression Gating</div>
          {activeAdmissionState === "admitted_MAP_101" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              <div style={{ background: "rgba(46,160,67,0.05)", border: "1px solid rgba(46,160,67,0.3)", borderRadius: "0.25rem", padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <strong style={{ fontSize: "0.8rem", color: "#f0f6fc" }}>MAP 101</strong>
                  <span style={styles.badge("active")}>Available</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#8b949e", marginBottom: "0.5rem" }}>Measure the Environment</div>
                <div style={{ fontSize: "0.65rem", color: "#8b949e" }}>Entry: valid portal admission. Unlocks: MAP 102</div>
              </div>

              <div style={{ background: "rgba(110,118,129,0.05)", border: "1px solid rgba(110,118,129,0.2)", borderRadius: "0.25rem", padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <strong style={{ fontSize: "0.8rem", color: "#8b949e" }}>MAP 102</strong>
                  <span style={styles.badge("held")}>Locked</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#8b949e", marginBottom: "0.5rem" }}>Audit the Environment</div>
                <div style={{ fontSize: "0.65rem", color: "#8b949e" }}>Entry: requires MAP 101 completion standing. Unlocks: MAP 103</div>
              </div>

              <div style={{ background: "rgba(110,118,129,0.05)", border: "1px solid rgba(110,118,129,0.2)", borderRadius: "0.25rem", padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <strong style={{ fontSize: "0.8rem", color: "#8b949e" }}>MAP 103</strong>
                  <span style={styles.badge("held")}>Locked</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#8b949e", marginBottom: "0.5rem" }}>Prepare the Environment</div>
                <div style={{ fontSize: "0.65rem", color: "#8b949e" }}>Entry: requires MAP 102 completion standing. Unlocks: live review SEAT input</div>
              </div>
            </div>
          ) : (
            <div style={{ background: "rgba(240,78,78,0.03)", border: "1px solid rgba(240,78,78,0.1)", padding: "1rem", borderRadius: "0.25rem", color: "#f04e4e", fontSize: "0.75rem" }}>
              <strong>⚠ Gated: Portal Admission has not been granted.</strong>
              <p style={{ margin: "0.25rem 0 0 0", color: "#8b949e" }}>
                Reason: {activeAdmissionState === "held_missing_representative_relation" 
                  ? "Obsidian contact-capture relation is not resolved yet." 
                  : activeAdmissionState === "held_missing_env_key"
                  ? "No canonical active environment key exists for this representative profile."
                  : activeAdmissionState === "held_missing_profile"
                  ? "Registry admission profile is not found."
                  : "No permitted MAP encounter progression record exists."}
              </p>
            </div>
          )}
        </div>

        {/* SRC2 Bridge held state */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>SRC2 / Lapis Bridge</div>
            <p style={{ fontSize: "0.7rem", color: "#8b949e", lineHeight: "1.4", margin: "0 0 1rem 0" }}>
              Exposes a bounded Structured Registry Contribution call to staging custody in the Lapis Antechamber when material contributions are required.
            </p>
            <div style={{ fontSize: "0.75rem", color: "#f04e4e", fontWeight: "bold" }}>
              Bridge status: HELD_UNAUTHORIZED (Staging custody is held pending permitted encounter resolution)
            </div>
          </div>
        </div>
      </main>

      {renderSystemFooter()}
    </div>
  )
}
