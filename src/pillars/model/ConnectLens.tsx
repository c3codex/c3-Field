// src/pillars/model/ConnectLens.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

// system import (allowed: pillar -> system)
import { CoherentAI } from "@systems/coherentai";
export default function ConnectLens() {
  const nav = useNavigate();

  // Safe: proves system import resolves without crashing the UI
  // (remove later if you want)
  // console.log("ConnectLens mounted. CoherentAI:", CoherentAI);

  return (
    <main style={S.page}>
      {/* Background */}
      <div style={S.bg} aria-hidden="true">
        <div style={S.bgBase} />
        <div style={S.bgStars} />
        <div style={S.bgWarm} />
        <div style={S.bgVignette} />
      </div>

      <section style={S.shell}>
        {/* LEFT */}
        <aside style={S.left}>
          <h1 style={S.h1}>Connect</h1>
          <div style={S.lead}>
            Enter the c3 field. Preserve provenance. Keep coherence.
          </div>

          <div style={S.statusRow}>
            <span style={S.pill}>Field Status</span>
            <span style={S.statusText}>Holding · Listening · Building</span>
          </div>

          <div style={S.panel}>
            <div style={S.panelTitle}>CoherentAI Field Lens</div>
            <div style={S.panelHint}>
              “A lens for coherent systems.”
            </div><div style={{ marginTop: 12 }}>
  <button
    type="button"
    onClick={() => nav("/registry")}
    style={{
      borderRadius: 14,
      padding: "10px 14px",
      border: "1px solid rgba(246,214,140,0.22)",
      background: "rgba(0,0,0,0.22)",
      color: "rgba(246,214,140,0.95)",
      fontSize: 13.5,
      letterSpacing: 0.45,
      cursor: "pointer",
    }}
  >
    Open Registry
  </button>
</div>

            <div style={S.actionsRow}>
              <ActionButton onClick={() => nav("/model/about")}>
                About CoherentAI
              </ActionButton>
              <ActionButton onClick={() => nav("/model")}>c3 Model</ActionButton>
              <ActionButton onClick={() => nav("/measures")}>Enter Measures of Inanna</ActionButton>
<ActionButton onClick={() => nav("/registry")}>Structural Index</ActionButton>
            </div>

            <div style={S.block}>
              <div style={S.blockTitle}>Library</div>
              <div style={S.blockBody}>
                Library feed will render here (vault docs). For now this page is
                intentionally clean and stable.
              </div>
            </div>

            <div style={S.block}>
              <div style={S.blockTitle}>Updates</div>
              <div style={S.blockBody}>
                Field updates and events will render here. This panel stays factual.
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT */}
        <div style={S.right}>
          <div style={S.mediaFrame}>
            <div style={S.mediaPlaceholder}>
              <div style={{ fontWeight: 650, marginBottom: 8 }}>
                Field Lens Media
              </div>
              <div style={{ opacity: 0.78, lineHeight: 1.4 }}>
                Hero media placeholder. Wire Supabase bucket paths once the page
                layout is locked.
              </div>
            </div>
            <div style={S.mediaGlow} aria-hidden="true" />
          </div>

          <div style={S.lensPanel}>
            <div style={S.lensTitle}>Lens Actions</div>
            <div style={S.lensHint}>
              Actions are links for now. No analysis, no automation.
            </div>

            <div style={S.lensButtons}>
              <LensButton disabled>Map Relations <span style={S.comingSoon}>TBA</span></LensButton>
              <LensButton disabled>Surface Live Nodes <span style={S.comingSoon}>TBA</span></LensButton>
              <LensButton onClick={() => nav("/model/about#registry")}>Interpret Registry</LensButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ActionButton({
  onClick,
  children,
  disabled,
  title,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      title={title}
      style={{
        ...S.actionBtn,
        opacity: disabled ? 0.55 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

function LensButton({
  onClick,
  children,
  disabled,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      style={{
        ...S.lensBtn,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    position: "relative",
    background: "#050608",
    color: "rgba(246,246,246,0.92)",
    overflow: "hidden",
  },

  // Background
  bg: { position: "absolute", inset: 0, pointerEvents: "none" },
  bgBase: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(1200px 900px at 25% 20%, rgba(18,16,30,0.62), rgba(5,6,8,0.98))",
  },
  bgStars: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(900px 520px at 62% 52%, rgba(255,255,255,0.03), rgba(0,0,0,0) 60%)",
    mixBlendMode: "overlay",
    opacity: 0.65,
  },
  bgWarm: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(900px 560px at 70% 48%, rgba(246,214,140,0.10), rgba(246,214,140,0) 68%)",
    mixBlendMode: "screen",
    opacity: 0.85,
  },
  bgVignette: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(80% 70% at 50% 38%, rgba(0,0,0,0.10), rgba(0,0,0,0.60) 72%, rgba(0,0,0,0.88))",
  },

  // Layout
  shell: {
    position: "relative",
    zIndex: 1,
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "minmax(360px, 560px) minmax(360px, 1fr)",
    gap: 22,
    padding: 28,
    alignItems: "start",
  },

  // Left
  left: { display: "grid", gap: 12, alignContent: "start" },
  h1: {
    margin: 0,
    fontSize: 56,
    lineHeight: 1.02,
    letterSpacing: 0.4,
    color: "rgba(236,236,236,0.94)",
    textShadow: "0 18px 60px rgba(0,0,0,0.70)",
  },
  lead: { marginTop: -6, fontSize: 15, letterSpacing: 0.4, opacity: 0.78 },

  statusRow: {
    marginTop: 2,
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
  },
  pill: {
    borderRadius: 999,
    padding: "6px 10px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.18)",
    fontSize: 12,
    letterSpacing: 0.6,
  },
  statusText: { opacity: 0.75, fontSize: 13 },

  panel: {
    marginTop: 4,
    borderRadius: 18,
    padding: 14,
    background: "rgba(16,14,26,0.48)",
    border: "1px solid rgba(246,214,140,0.16)",
    boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
    backdropFilter: "blur(10px)",
  },
  panelTitle: { fontSize: 22, letterSpacing: 0.2, color: "rgba(246,214,140,0.92)" },
  panelHint: { marginTop: 6, fontSize: 13, opacity: 0.72, maxWidth: 560 },

  actionsRow: { display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" },
  actionBtn: {
    borderRadius: 14,
    padding: "10px 12px",
    border: "1px solid rgba(246,214,140,0.22)",
    background: "rgba(246,214,140,0.08)",
    color: "rgba(246,214,140,0.95)",
    fontSize: 13,
    letterSpacing: 0.5,
  },

  block: {
    marginTop: 12,
    borderRadius: 14,
    padding: 12,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.18)",
  },
  blockTitle: { fontSize: 14, letterSpacing: 0.3, color: "rgba(246,214,140,0.92)" },
  blockBody: { marginTop: 6, fontSize: 13, opacity: 0.75, lineHeight: 1.35 },

  // Right
  right: { display: "grid", gap: 16, alignContent: "start" },
  mediaFrame: {
    position: "relative",
    borderRadius: 22,
    overflow: "hidden",
    border: "1px solid rgba(246,214,140,0.16)",
    background: "rgba(0,0,0,0.28)",
    boxShadow: "0 40px 120px rgba(0,0,0,0.62)",
    minHeight: 560,
  },
  mediaPlaceholder: { padding: 18, opacity: 0.9, fontSize: 13 },
  mediaGlow: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(700px 420px at 50% 45%, rgba(246,214,140,0.12), rgba(0,0,0,0) 62%)",
    mixBlendMode: "screen",
    pointerEvents: "none",
  },

  lensPanel: {
    borderRadius: 18,
    padding: 14,
    background: "rgba(16,14,26,0.48)",
    border: "1px solid rgba(246,214,140,0.16)",
    boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
    backdropFilter: "blur(10px)",
  },
  lensTitle: { fontSize: 18, letterSpacing: 0.3, color: "rgba(246,214,140,0.94)" },
  lensHint: { marginTop: 6, fontSize: 13, opacity: 0.72 },
  lensButtons: { marginTop: 12, display: "grid", gap: 10 },
  lensBtn: {
    borderRadius: 14,
    padding: "12px 12px",
    border: "1px solid rgba(246,214,140,0.22)",
    background: "rgba(0,0,0,0.22)",
    color: "rgba(246,214,140,0.95)",
    fontSize: 13.5,
    letterSpacing: 0.45,
    textAlign: "left",
  },
  comingSoon: {
    marginLeft: 10,
    fontSize: 12,
    opacity: 0.6,
    color: "rgba(235,235,235,0.78)",
  },
};