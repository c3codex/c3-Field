import React from "react";
import { REGISTRY_ALL } from "@/data/registry";
import { codexVaultPublicUrl } from "@/data/registry/resolveLinks";

export default function RegistryPage() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";

  return (
    <main style={{ padding: 28, color: "rgba(246,246,246,0.92)" }}>
      <h1 style={{ margin: 0, fontSize: 32 }}>Registry</h1>
      <div style={{ marginTop: 8, opacity: 0.7 }}>
        Structural index · {REGISTRY_ALL.length} items
      </div>

      <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
        {REGISTRY_ALL.map((item) => (
          <article
            key={item.id}
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 14,
              padding: 12,
              background: "rgba(0,0,0,0.18)",
            }}
          >
            <div style={{ fontWeight: 700 }}>{item.title}</div>
            {item.summary ? (
              <div style={{ marginTop: 6, opacity: 0.75, whiteSpace: "pre-wrap" }}>
                {item.summary}
              </div>
            ) : null}

            {item.links?.length ? (
              <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                {item.links.map((link, idx) => {
                  const href = codexVaultPublicUrl(supabaseUrl, link.href);
                  if (!href) return null;

                  return (
                    <a
                      key={`${item.id}-${idx}`}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        borderRadius: 12,
                        padding: "8px 10px",
                        border: "1px solid rgba(255,255,255,0.10)",
                        background: "rgba(0,0,0,0.22)",
                        color: "rgba(246,214,140,0.95)",
                        fontSize: 13,
                      }}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </div>
            ) : (
              <div style={{ marginTop: 10, opacity: 0.6, fontSize: 13 }}>No links</div>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}