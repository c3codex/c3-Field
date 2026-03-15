import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

type VaultDocRow = {
  id: string;
  slug: string;
  title: string;
  doc_type: string;
  version: string | null;
  status: string;
  storage_path_md: string | null;
  storage_path_pdf: string | null;
  date: string; // created_at::text in view
};

function publicUrlFromStoragePath(storagePath: string | null): string | null {
  if (!storagePath) return null;

  // Expecting "bucket/path/to/file.ext"
  const firstSlash = storagePath.indexOf("/");
  if (firstSlash <= 0) return null;

  const bucket = storagePath.slice(0, firstSlash);
  const path = storagePath.slice(firstSlash + 1);

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export default function CoherentLibrary() {
  const nav = useNavigate();
  const [docs, setDocs] = useState<VaultDocRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("v_connect_vault_docs")
        .select("*")
        .order("date", { ascending: false });

      if (!error && data) setDocs(data as VaultDocRow[]);
      setLoading(false);
    }
    load();
  }, []);

  const categorized = useMemo(() => {
    // Optional: prioritize a stable order instead of newest-first
    const order = ["spec", "architecture", "assessment"];
    const rank = (t: string) => {
      const i = order.indexOf((t ?? "").toLowerCase());
      return i === -1 ? 999 : i;
    };

    return [...docs].sort((a, b) => {
      const ra = rank(a.doc_type);
      const rb = rank(b.doc_type);
      if (ra !== rb) return ra - rb;
      // fallback: newest first
      return (b.date ?? "").localeCompare(a.date ?? "");
    });
  }, [docs]);

  return (
    <main style={S.page}>
      <button onClick={() => nav("/connect")} style={S.backBtn}>
        ← Back to Connect
      </button>

      <header style={{ marginTop: 14 }}>
        <div style={S.kicker}>CONNECT</div>
        <h1 style={S.h1}>About CoherentAI</h1>
        <p style={S.p}>
          CoherentAI is a field lens for the c3 system. It maps relations, interprets registry,
          and preserves provenance through explainable outputs. No extraction. No coercive ranking.
        </p>
      </header>

      <section style={S.card}>
        <div style={S.cardTitle}>v0.1 Surface</div>
        <ul style={S.ul}>
          <li>Read-only public lens layer (Connect).</li>
          <li>Docs are surfaced from <code>vault_docs</code> with visibility <code>lens</code> or <code>public</code>.</li>
          <li>MD/PDF stored in Supabase Storage; links resolved at render time.</li>
        </ul>
      </section>

      <section style={S.grid}>
        {loading ? <div style={S.muted}>Loading…</div> : null}
        {!loading && categorized.length === 0 ? (
          <div style={S.muted}>
            No CoherentAI docs are visible yet. Set <code>visibility</code> to <code>lens</code> or <code>public</code>.
          </div>
        ) : null}

        {categorized.map((d) => {
          const mdUrl = publicUrlFromStoragePath(d.storage_path_md);
          const pdfUrl = publicUrlFromStoragePath(d.storage_path_pdf);

          return (
            <article key={d.id} style={S.docCard}>
              <div style={S.docTop}>
                <div style={S.docType}>{(d.doc_type ?? "doc").toUpperCase()}</div>
                <div style={S.docMeta}>
                  {d.version ? <span style={S.badge}>v{d.version}</span> : null}
                  <span style={S.badgeGhost}>{d.status}</span>
                </div>
              </div>

              <div style={S.docTitle}>{d.title}</div>
              <div style={S.docSlug}>{d.slug}</div>

              <div style={S.actions}>
                {mdUrl ? (
                  <a href={mdUrl} target="_blank" rel="noreferrer" style={S.linkBtn}>
                    View MD
                  </a>
                ) : (
                  <span style={S.disabledBtn} title="No storage_path_md">
                    MD
                  </span>
                )}

                {pdfUrl ? (
                  <a href={pdfUrl} target="_blank" rel="noreferrer" style={S.linkBtn}>
                    View PDF
                  </a>
                ) : (
                  <span style={S.disabledBtn} title="No storage_path_pdf">
                    PDF
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <section style={S.card}>
        <div style={S.cardTitle}>Guardrails</div>
        <ul style={S.ul}>
          <li>Non-extractive constraint and process protection.</li>
          <li>Explainable mapping: links should carry rationale.</li>
          <li>Visibility tiers: <code>internal</code> (vault), <code>lens</code> (Connect), <code>public</code> (culture).</li>
        </ul>
      </section>
    </main>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#050608",
    color: "rgba(236,236,236,0.92)",
    padding: 28,
  },
  backBtn: {
    borderRadius: 12,
    padding: "10px 12px",
    background: "rgba(0,0,0,0.22)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(235,235,235,0.84)",
    cursor: "pointer",
  },
  kicker: { fontSize: 12, letterSpacing: 2.2, opacity: 0.72 },
  h1: {
    margin: "10px 0 6px",
    fontSize: 36,
    color: "rgba(246,214,140,0.95)",
    letterSpacing: 0.4,
  },
  p: { maxWidth: 900, opacity: 0.8, lineHeight: 1.45 },
  card: {
    marginTop: 14,
    borderRadius: 18,
    padding: 14,
    background: "rgba(20,18,35,0.45)",
    border: "1px solid rgba(255,220,170,0.16)",
    boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
    backdropFilter: "blur(10px)",
  },
  cardTitle: { fontSize: 14, letterSpacing: 0.7, opacity: 0.92 },
  ul: { marginTop: 10, opacity: 0.78, lineHeight: 1.55 },
  grid: {
    marginTop: 14,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 14,
    alignItems: "stretch",
  },
  muted: { marginTop: 10, opacity: 0.6, fontSize: 13 },
  docCard: {
    borderRadius: 18,
    padding: 14,
    background: "rgba(0,0,0,0.22)",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  docTop: { display: "flex", justifyContent: "space-between", gap: 10 },
  docType: {
    fontSize: 12,
    letterSpacing: 1.4,
    opacity: 0.75,
    color: "rgba(246,214,140,0.92)",
  },
  docMeta: { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" },
  badge: {
    borderRadius: 999,
    padding: "5px 9px",
    border: "1px solid rgba(246,214,140,0.24)",
    background: "rgba(246,214,140,0.08)",
    color: "rgba(246,214,140,0.95)",
    fontSize: 12,
  },
  badgeGhost: {
    borderRadius: 999,
    padding: "5px 9px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.18)",
    color: "rgba(235,235,235,0.80)",
    fontSize: 12,
  },
  docTitle: { marginTop: 10, fontSize: 16, letterSpacing: 0.3 },
  docSlug: { marginTop: 6, fontSize: 12.5, opacity: 0.65 },
  actions: { marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" },
  linkBtn: {
    borderRadius: 14,
    padding: "10px 12px",
    border: "1px solid rgba(246,214,140,0.22)",
    background: "rgba(246,214,140,0.08)",
    color: "rgba(246,214,140,0.95)",
    textDecoration: "none",
    fontSize: 13,
  },
  disabledBtn: {
    borderRadius: 14,
    padding: "10px 12px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.16)",
    color: "rgba(235,235,235,0.55)",
    fontSize: 13,
  },
};