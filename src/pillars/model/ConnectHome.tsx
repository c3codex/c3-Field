// src/pillars/model/ConnectLens.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

import { CoherentAI } from "@systems/coherentai";

const FIELDLENS_BUCKET = "Measures-open";
const FIELDLENS_WEBP_PATH = "branded-fieldlens.webp";
const FIELDLENS_MP4_PATH = "branded-fieldlens.mp4";

type FeedItem = {
  id: string;
  slug: string;
  title: string;
  doc_type: string;
  version: string | null;
  status: string | null;
  storage_path_md: string | null;
  storage_path_pdf: string | null;
  date: string | null;
};

type Tab = "library" | "updates" | "projects";

/** Optional: Paragraph subscribe page */
const SUBSCRIBE_URL = import.meta.env.VITE_SUBSCRIBE_URL ?? "";

export default function ConnectLens() {
  const nav = useNavigate();

  // sanity: proves the import resolves; remove later if you want
  useEffect(() => {
    console.log("ConnectLens mounted. CoherentAI:", CoherentAI);
  }, []);

  const [tab, setTab] = useState<Tab>("library");

  // Feed state
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Hero media URLs (computed once)
  const { webpUrl, mp4Url } = useMemo(() => {
    const webp = supabase.storage.from(FIELDLENS_BUCKET).getPublicUrl(FIELDLENS_WEBP_PATH).data.publicUrl ?? "";
    const mp4 = supabase.storage.from(FIELDLENS_BUCKET).getPublicUrl(FIELDLENS_MP4_PATH).data.publicUrl ?? "";
    return { webpUrl: webp, mp4Url: mp4 };
  }, []);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase
        .from("v_connect_vault_docs")
        .select("id,slug,title,doc_type,version,status,storage_path_md,storage_path_pdf,date")
        .order("date", { ascending: false });

      if (!alive) return;

      if (error) {
        console.error("v_connect_vault_docs query error:", error);
        setErrorMsg(error.message || "Failed to load library.");
        setFeed([]);
        setLoading(false);
        return;
      }

      setFeed((data ?? []) as FeedItem[]);
      setLoading(false);
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const heroReady = !!webpUrl;

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
          <div style={S.lead}>Enter the c3 field. Preserve provenance. Keep coherence.</div>

          <div style={S.statusRow}>
            <span style={S.pill}>Field Status</span>
            <span style={S.statusText}>Holding · Listening · Building</span>
          </div>

          <div style={S.tabRow}>
            <TabButton active={tab === "library"} onClick={() => setTab("library")}>
              Library
            </TabButton>
            <TabButton active={tab === "updates"} onClick={() => setTab("updates")}>
              Updates & Events
            </TabButton>
            <TabButton active={tab === "projects"} onClick={() => setTab("projects")}>
              Projects
            </TabButton>
          </div>

          <div style={S.panel}>
            {tab === "library" ? (
              <>
                <div style={S.panelTitle}>Library</div>
                <div style={S.panelHint}>Coherent articles preserved for provenance.</div>

                <div style={S.actionsRow}>
                  <ActionButton onClick={() => nav("/model/about")}>About CoherentAI</ActionButton>

                  <ActionButton
                    onClick={() => SUBSCRIBE_URL && window.open(SUBSCRIBE_URL, "_blank", "noopener,noreferrer")}
                    disabled={!SUBSCRIBE_URL}
                    title={!SUBSCRIBE_URL ? "Set VITE_SUBSCRIBE_URL" : "Subscribe"}
                  >
                    Subscribe
                  </ActionButton>

                  <ActionButton onClick={() => nav("/model/connect")}>Recent Articles</ActionButton>
                </div>

                {errorMsg ? <div style={S.errorBox}>Error: {errorMsg}</div> : null}

                <div style={S.feedWrap}>
                  {loading ? <div style={S.muted}>Reading…</div> : null}
                  {!loading && !errorMsg && feed.length === 0 ? <div style={S.muted}>No entries yet.</div> : null}
                  {!loading && !errorMsg
                    ? feed.map((item) => <FeedCard key={item.id} item={item} />)
                    : null}
                </div>
              </>
            ) : null}

            {tab === "updates" ? (
              <>
                <div style={S.panelTitle}>Updates & Events</div>
                <div style={S.panelHint}>Field updates live here. Deeper entry is housed inside Measures.</div>

                <div style={S.eventCard}>
                  <div style={S.eventDate}>Now</div>
                  <div style={S.eventTitle}>Measures of Inanna Exhibition</div>
                  <div style={S.eventBody}>Updates, gates, and release notes. This panel stays factual and current.</div>
                  <div style={S.eventActions}>
                    <ActionButton onClick={() => nav("/measures")}>Enter Measures</ActionButton>
                  </div>
                </div>
              </>
            ) : null}

            {tab === "projects" ? (
              <>
                <div style={S.panelTitle}>Projects</div>
                <div style={S.panelHint}>A small, curated list. No noise.</div>

                <ProjectRow title="CoherentAI v0.1" status="live (vault docs feed)" onOpen={() => nav("/model/connect")} />
                <ProjectRow title="Measures of Inanna" status="active build" onOpen={() => nav("/measures")} />
                <ProjectRow title="c3 Model" status="live" onOpen={() => nav("/model")} />
              </>
            ) : null}
          </div>
        </aside>

        {/* RIGHT */}
        <div style={S.right}>
          <div style={S.mediaFrame}>
            {heroReady ? (
              <FieldLensMedia poster={webpUrl} video={mp4Url} />
            ) : (
              <div style={S.mediaPlaceholder}>
                <div style={{ fontWeight: 650, marginBottom: 6 }}>Field Lens media not found</div>
                <div style={{ opacity: 0.78, lineHeight: 1.35 }}>
                  Expected in <code>Measures-open</code>:
                  <div style={{ marginTop: 8 }}>
                    <code>{FIELDLENS_WEBP_PATH}</code>
                    <br />
                    <code>{FIELDLENS_MP4_PATH}</code> (optional)
                  </div>
                </div>
              </div>
            )}
            <div style={S.mediaGlow} aria-hidden="true" />
          </div>

          <div style={S.lensPanel}>
            <div style={S.lensTitle}>CoherentAI Field Lens</div>
            <div style={S.lensHint}>Optics for the c3 field. Interpret registry. Preserve provenance.</div>

            <div style={S.lensButtons}>
              <LensButton disabled>
                Map Relations <span style={S.comingSoon}>TBA</span>
              </LensButton>
              <LensButton disabled>
                Surface Live Nodes <span style={S.comingSoon}>TBA</span>
              </LensButton>
              <LensButton onClick={() => nav("/model/about#registry")}>Interpret Registry</LensButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function FieldLensMedia({ poster, video }: { poster: string; video: string }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // If no video or reduced motion, show poster.
  // If poster is missing, show placeholder.
  if (!video || reduceMotion) {
    return poster ? (
      <img src={poster} alt="CoherentAI Field Lens" style={S.heroMedia} />
    ) : (
      <div style={S.mediaPlaceholder}>Poster missing.</div>
    );
  }

  return (
    <video autoPlay muted loop playsInline preload="metadata" poster={poster} style={S.heroMedia}>
      <source src={video} type="video/mp4" />
    </video>
  );
}

function FeedCard({ item }: { item: FeedItem }) {
  const bucket = "codex-vault";

  const mdRaw = item.storage_path_md ?? "";
  const pdfRaw = item.storage_path_pdf ?? "";

  const mdPath = mdRaw ? mdRaw.replace(/^codex-vault\//, "") : "";
  const pdfPath = pdfRaw ? pdfRaw.replace(/^codex-vault\//, "") : "";

  const mdUrl = mdPath ? supabase.storage.from(bucket).getPublicUrl(mdPath).data.publicUrl ?? "" : "";
  const pdfUrl = pdfPath ? supabase.storage.from(bucket).getPublicUrl(pdfPath).data.publicUrl ?? "" : "";

  return (
    <div style={S.feedCard}>
      <div style={S.feedTitle}>{item.title}</div>
      <div style={S.feedMeta}>
        {item.doc_type}
        {item.version ? ` · ${item.version}` : ""}
        {item.status ? ` · ${item.status}` : ""}
      </div>

      <div style={S.feedActions}>
        {mdUrl ? (
          <a href={mdUrl} target="_blank" rel="noreferrer" style={S.feedLinkBtn}>
            View MD
          </a>
        ) : (
          <span style={S.mutedInline}>MD missing</span>
        )}

        {pdfUrl ? (
          <a href={pdfUrl} target="_blank" rel="noreferrer" style={S.feedLinkBtn}>
            View PDF
          </a>
        ) : (
          <span style={S.mutedInline}>PDF missing</span>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...S.tabBtn,
        borderColor: active ? "rgba(246,214,140,0.32)" : "rgba(255,255,255,0.12)",
        boxShadow: active ? "0 0 0 1px rgba(246,214,140,0.10) inset" : "none",
        color: active ? "rgba(246,214,140,0.98)" : "rgba(235,235,235,0.78)",
        background: active ? "rgba(0,0,0,0.28)" : "rgba(0,0,0,0.16)",
      }}
    >
      {children}
    </button>
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

function ProjectRow({
  title,
  status,
  onOpen,
}: {
  title: string;
  status: string;
  onOpen: () => void;
}) {
  return (
    <div style={S.projectRow}>
      <div>
        <div style={S.projectTitle}>{title}</div>
        <div style={S.projectStatus}>{status}</div>
      </div>
      <ActionButton onClick={onOpen}>Open</ActionButton>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", position: "relative", background: "#050608", color: "rgba(246,246,246,0.92)", overflow: "hidden" },

  // Background
  bg: { position: "absolute", inset: 0, pointerEvents: "none" },
  bgBase: { position: "absolute", inset: 0, background: "radial-gradient(1200px 900px at 25% 20%, rgba(18,16,30,0.62), rgba(5,6,8,0.98))" },
  bgStars: { position: "absolute", inset: 0, background: "radial-gradient(900px 520px at 62% 52%, rgba(255,255,255,0.03), rgba(0,0,0,0) 60%)", mixBlendMode: "overlay", opacity: 0.65 },
  bgWarm: { position: "absolute", inset: 0, background: "radial-gradient(900px 560px at 70% 48%, rgba(246,214,140,0.10), rgba(246,214,140,0) 68%)", mixBlendMode: "screen", opacity: 0.85 },
  bgVignette: { position: "absolute", inset: 0, background: "radial-gradient(80% 70% at 50% 38%, rgba(0,0,0,0.10), rgba(0,0,0,0.60) 72%, rgba(0,0,0,0.88))" },

  // Layout
  shell: { position: "relative", zIndex: 1, minHeight: "100vh", display: "grid", gridTemplateColumns: "minmax(360px, 560px) minmax(360px, 1fr)", gap: 22, padding: 28, alignItems: "start" },

  // Left
  left: { display: "grid", gap: 12, alignContent: "start" },
  h1: { margin: 0, fontSize: 56, lineHeight: 1.02, letterSpacing: 0.4, color: "rgba(236,236,236,0.94)", textShadow: "0 18px 60px rgba(0,0,0,0.70)" },
  lead: { marginTop: -6, fontSize: 15, letterSpacing: 0.4, opacity: 0.78 },
  statusRow: { marginTop: 2, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  pill: { borderRadius: 999, padding: "6px 10px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)", fontSize: 12, letterSpacing: 0.6 },
  statusText: { opacity: 0.75, fontSize: 13 },

  tabRow: { display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" },
  tabBtn: { borderRadius: 999, padding: "9px 13px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)", fontSize: 13, letterSpacing: 0.5, cursor: "pointer" },

  panel: { marginTop: 4, borderRadius: 18, padding: 14, background: "rgba(16,14,26,0.48)", border: "1px solid rgba(246,214,140,0.16)", boxShadow: "0 30px 90px rgba(0,0,0,0.55)", backdropFilter: "blur(10px)" },
  panelTitle: { fontSize: 22, letterSpacing: 0.2, color: "rgba(246,214,140,0.92)" },
  panelHint: { marginTop: 6, fontSize: 13, opacity: 0.72, maxWidth: 560 },

  actionsRow: { display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" },
  actionBtn: { borderRadius: 14, padding: "10px 12px", border: "1px solid rgba(246,214,140,0.22)", background: "rgba(246,214,140,0.08)", color: "rgba(246,214,140,0.95)", fontSize: 13, letterSpacing: 0.5 },

  feedWrap: { marginTop: 12, display: "grid", gap: 10, maxHeight: 360, overflow: "auto", paddingRight: 4 },
  feedCard: { borderRadius: 14, padding: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.18)" },
  feedTitle: { fontSize: 15, letterSpacing: 0.25, color: "rgba(246,214,140,0.95)" },
  feedMeta: { marginTop: 6, fontSize: 12, opacity: 0.62 },
  feedActions: { marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" },
  feedLinkBtn: { textDecoration: "none", borderRadius: 12, padding: "8px 10px", border: "1px solid rgba(255,255,255,0.10)", background: "rgba(0,0,0,0.18)", color: "rgba(235,235,235,0.86)", fontSize: 12.5, letterSpacing: 0.35 },
  muted: { marginTop: 8, opacity: 0.65, fontSize: 13 },
  mutedInline: { opacity: 0.65, fontSize: 12.5 },

  errorBox: { marginTop: 12, borderRadius: 14, padding: 12, border: "1px solid rgba(255,120,120,0.35)", background: "rgba(255,80,80,0.10)", color: "rgba(255,220,220,0.92)", fontSize: 13 },

  eventCard: { marginTop: 12, borderRadius: 14, padding: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.18)" },
  eventDate: { fontSize: 12, letterSpacing: 0.7, opacity: 0.78, color: "rgba(246,214,140,0.92)" },
  eventTitle: { marginTop: 4, fontSize: 15, letterSpacing: 0.3 },
  eventBody: { marginTop: 6, fontSize: 13, opacity: 0.76, lineHeight: 1.35 },
  eventActions: { marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" },

  projectRow: { marginTop: 12, borderRadius: 14, padding: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  projectTitle: { fontSize: 14, letterSpacing: 0.3 },
  projectStatus: { marginTop: 4, fontSize: 12.5, opacity: 0.7 },

  // Right
  right: { display: "grid", gap: 16, alignContent: "start" },
  mediaFrame: { position: "relative", borderRadius: 22, overflow: "hidden", border: "1px solid rgba(246,214,140,0.16)", background: "rgba(0,0,0,0.28)", boxShadow: "0 40px 120px rgba(0,0,0,0.62)", minHeight: 560 },
  heroMedia: { width: "100%", height: "100%", objectFit: "cover", display: "block", transform: "scale(1.02)" },
  mediaGlow: { position: "absolute", inset: 0, background: "radial-gradient(700px 420px at 50% 45%, rgba(246,214,140,0.12), rgba(0,0,0,0) 62%)", mixBlendMode: "screen", pointerEvents: "none" },
  mediaPlaceholder: { padding: 18, opacity: 0.9, fontSize: 13 },

  lensPanel: { borderRadius: 18, padding: 14, background: "rgba(16,14,26,0.48)", border: "1px solid rgba(246,214,140,0.16)", boxShadow: "0 30px 90px rgba(0,0,0,0.55)", backdropFilter: "blur(10px)" },
  lensTitle: { fontSize: 18, letterSpacing: 0.3, color: "rgba(246,214,140,0.94)" },
  lensHint: { marginTop: 6, fontSize: 13, opacity: 0.72 },
  lensButtons: { marginTop: 12, display: "grid", gap: 10 },
  lensBtn: { borderRadius: 14, padding: "12px 12px", border: "1px solid rgba(246,214,140,0.22)", background: "rgba(0,0,0,0.22)", color: "rgba(246,214,140,0.95)", fontSize: 13.5, letterSpacing: 0.45, textAlign: "left" },
  comingSoon: { marginLeft: 10, fontSize: 12, opacity: 0.6, color: "rgba(235,235,235,0.78)" },
};