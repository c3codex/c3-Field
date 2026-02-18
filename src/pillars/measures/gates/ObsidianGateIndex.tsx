import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MeasuresReturnGlyph from "@/pillars/measures/components/MeasuresReturnGlyph";
import { useMeasuresGatesIndex } from "@/pillars/measures/data/useMeasuresGatesIndex";

function gateLabel(numeral: string | null) {
  if (!numeral) return "Gate";
  return `Gate ${numeral}`;
}

export default function ObsidianGateIndex() {
  const nav = useNavigate();
  const { rows, loading, error } = useMeasuresGatesIndex();
  const [hint, setHint] = useState<string | null>(null);

  const cards = useMemo(() => rows, [rows]);

  if (loading) {
    return <div className="min-h-[100svh] bg-black p-8 text-stone-200/70">Loading gates…</div>;
  }

  if (error) {
    return (
      <div className="min-h-[100svh] bg-black p-8 text-red-200/70">
        Error loading gates: {error}
      </div>
    );
  }

  return (
    <section className="relative min-h-[100svh] w-full bg-black text-stone-100 overflow-hidden">
      {/* Return */}
      <div className="absolute top-5 right-5 z-50">
        <MeasuresReturnGlyph to="/measures" ariaLabel="Return to Temple" />
      </div>

      {/* Header */}
      <div className="px-8 pt-14 pb-8">
        <div className="text-[10px] uppercase tracking-[0.35em] text-stone-200/55 font-sans">
          Measures of Inanna
        </div>
        <h1 className="mt-4 font-serif text-4xl text-stone-50">Obsidian Gates</h1>
        <p className="mt-3 max-w-2xl text-stone-200/60 leading-relaxed">
          Each gate reduces the visible form. What is removed is not lost, it is measured.
        </p>
      </div>

      {/* Hint (tiny, non-modal) */}
      {hint ? (
        <div className="fixed left-1/2 top-8 -translate-x-1/2 z-[9999]">
          <div className="rounded-full border border-white/10 bg-black/60 backdrop-blur px-4 py-2 text-xs tracking-[0.18em] uppercase text-stone-100/80">
            {hint}
          </div>
        </div>
      ) : null}

      {/* List */}
      <div className="px-8 pb-14">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((g) => {
            const title = g.removal_item ? `The ${g.removal_item}` : gateLabel(g.gate_numeral);
            const subtitle = g.removal_item
              ? `The ${g.removal_item} Removed`
              : g.gate_numeral
                ? "Reduction"
                : "—";

            const actionLabel = g.gate_released ? "Enter" : "Sealed";

            return (
              <button
                key={g.slug}
                type="button"
                onClick={() => {
                  if (!g.gate_released) {
                    setHint("Sealed until release.");
                    window.setTimeout(() => setHint(null), 1400);
                    return;
                  }
                  nav(`/measures/gates/${g.slug}`);
                }}
                className="
                  text-left
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  backdrop-blur
                  px-5 py-5
                  hover:bg-white/7
                  transition
                "
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.32em] text-stone-200/55 font-sans">
                      {gateLabel(g.gate_numeral)}
                    </div>

                    <div className="mt-2 font-serif text-2xl text-stone-50">{title}</div>
                    <div className="mt-2 text-stone-200/60">{subtitle}</div>

                    {/* Optional still preview if you want it now */}
                    {g.media_still_url ? (
                      <div className="mt-4 overflow-hidden rounded-xl border border-white/8">
                        <img
                          src={g.media_still_url}
                          alt=""
                          aria-hidden="true"
                          draggable={false}
                          className="h-40 w-full object-cover opacity-90"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div
                    className="
                      shrink-0
                      rounded-full
                      border border-white/10
                      px-3 py-1.5
                      text-[11px]
                      tracking-[0.22em]
                      uppercase
                    "
                    style={{
                      background: g.gate_released ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.04)",
                      color: g.gate_released ? "rgba(250,246,240,0.90)" : "rgba(250,246,240,0.55)",
                    }}
                  >
                    {actionLabel}
                  </div>
                </div>

                {/* Optional time stamp */}
                {g.gate_utc ? (
                  <div className="mt-4 text-[11px] tracking-[0.22em] uppercase text-stone-200/40">
                    {g.gate_released ? "Released" : "Scheduled"} · {new Date(g.gate_utc).toISOString().replace("T", " ").slice(0, 16)} UTC
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
