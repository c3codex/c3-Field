// src/pillars/measures/mes/CodexstoneChamber.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import MeasuresReturnGlyph from "@/pillars/measures/components/MeasuresReturnGlyph";
import { useMeasuresMarbleIndex } from "@/pillars/measures/data/useMeasuresMarbleIndex";
import type { MeasuresMarbleIndexRow } from "@/pillars/measures/data/useMeasuresMarbleIndex";

function titleFor(r: MeasuresMarbleIndexRow) {
  return r.display_title ?? r.slug ?? "Measure";
}

export default function CodexstoneChamber() {
  const nav = useNavigate();
  const { rows, loading, error } = useMeasuresMarbleIndex();

  const [indexOpen, setIndexOpen] = useState(false);

  const chamber = useMemo(() => {
    return (rows ?? []).find((r) => r.slug === "codexstone-chamber") ?? null;
  }, [rows]);

  const chamberStill =
    chamber?.media_still_url ??
    "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/codexstone-chamber.webp";

  const list = useMemo(() => {
    return (rows ?? []).filter((r) => r.slug !== "codexstone-chamber");
  }, [rows]);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-black">
      {/* Return glyph only */}
      <div className="absolute top-5 right-5 z-50">
        <MeasuresReturnGlyph to="/measures" ariaLabel="Return to Temple" />
      </div>

      {/* Chamber image only */}
      <div className="absolute inset-0">
        <img
          src={chamberStill}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover select-none"
          style={{ filter: "blur(18px) saturate(1.05)", transform: "scale(1.06)", opacity: 0.35 }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={chamberStill}
            alt="The Codexstone Chamber"
            draggable={false}
            className="h-full w-full object-contain select-none"
          />
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 72%, rgba(0,0,0,0.88) 100%)",
          }}
        />
      </div>

      {/* Enter */}
      {!indexOpen && (
        <div className="absolute inset-x-0 bottom-8 z-40 px-4">
          <div className="mx-auto w-full max-w-xl rounded-2xl border border-white/10 bg-black/30 backdrop-blur-lg p-5 text-center">
            <div className="text-[10px] uppercase tracking-[0.35em] text-stone-200/70">Marble</div>
            <div className="mt-2 font-serif text-2xl text-stone-50">{chamber?.display_title ?? "The Codexstone"}</div>
            {chamber?.one_liner ? <div className="mt-2 text-sm text-stone-200/70">{chamber.one_liner}</div> : null}

            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => setIndexOpen(true)}
                className="rounded-xl bg-white/12 px-5 py-3 text-sm text-stone-100 hover:bg-white/18 transition"
              >
                Enter Codexstone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Index overlay */}
      {indexOpen && (
        <div className="absolute inset-0 z-50">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />

          <div className="absolute inset-x-0 bottom-0 px-4 pb-6">
            <div className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-black/55 backdrop-blur-lg shadow-[0_16px_60px_rgba(0,0,0,0.55)] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="text-[10px] uppercase tracking-[0.32em] text-stone-200/70">Measures Index</div>
                <button
                  type="button"
                  onClick={() => setIndexOpen(false)}
                  className="rounded-lg bg-white/10 px-3 py-1.5 text-[11px] text-stone-100 hover:bg-white/15 transition"
                >
                  Close
                </button>
              </div>

              <div className="max-h-[62svh] overflow-y-auto p-4">
                {loading ? (
                  <div className="p-4 text-stone-200/70">Loading…</div>
                ) : error ? (
                  <div className="p-4 text-red-200/75">Error: {error}</div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {list.map((r) => {
                      const released = Boolean(r.me_released); // ✅ only field we know exists
                      return (
                        <button
                          key={r.slug}
                          type="button"
                          onClick={() => {
                            if (!released) return;
                            nav(`/measures/mes/${r.slug}`);
                          }}
                          className="text-left rounded-xl border border-white/10 bg-white/5 px-4 py-4 hover:bg-white/7 transition"
                        >
                          <div className="text-[10px] uppercase tracking-[0.32em] text-stone-200/55">
                            {released ? "Open" : "Sealed"}
                          </div>
                          <div className="mt-1 font-serif text-xl text-stone-50">{titleFor(r)}</div>
                          {r.display_subtitle ? <div className="mt-1 text-sm text-stone-200/65">{r.display_subtitle}</div> : null}
                          {r.one_liner ? <div className="mt-2 text-sm text-stone-100/70">{r.one_liner}</div> : null}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="h-1.5 bg-gradient-to-b from-white/5 to-transparent" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
