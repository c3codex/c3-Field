import { REGISTRY_BY_PILLAR, REGISTRY_ALL } from "@/data/registry";

export default function RegistryLibrary() {
  return (
    <main style={{ padding: 28, color: "rgba(246,246,246,0.92)" }}>
      <h1 style={{ margin: 0, fontSize: 34 }}>Registry Library</h1>
      <div style={{ opacity: 0.7, marginTop: 8 }}>
        Structural index · {REGISTRY_ALL.length} items
      </div>

      {Object.entries(REGISTRY_BY_PILLAR).map(([pillar, items]) => (
        <section key={pillar} style={{ marginTop: 22 }}>
          <h2 style={{ margin: "0 0 10px 0", fontSize: 18, opacity: 0.9 }}>{pillar}</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {items.map((it) => (
              <div
                key={it.id}
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 14,
                  padding: 12,
                  background: "rgba(0,0,0,0.18)",
                }}
              >
                <div style={{ fontWeight: 600 }}>{it.title}</div>
                {it.summary ? <div style={{ opacity: 0.72, marginTop: 6 }}>{it.summary}</div> : null}
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}