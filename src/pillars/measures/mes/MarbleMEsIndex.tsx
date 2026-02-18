import React from "react";
import { useMeasuresMEsIndex } from "@/pillars/measures/data/useMeasuresMEsIndex";

export default function MarbleMEIndex() {
  const { rows, loading, error } = useMeasuresMEsIndex();

  if (loading) return <div className="p-6">Loading Marble MEs…</div>;
  if (error) return <div className="p-6">Error: {error}</div>;

  const releasedCount = rows.filter((r) => r.me_released).length;

  return (
    <div className="p-6 space-y-3">
      <div className="text-xl">Marble MEs</div>
      <div className="text-sm opacity-70">
        Activated: {releasedCount} / 13
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-6">
        <div className="text-sm opacity-80">
          Codexstone encounter container goes here (image + subtle modulation + tethers).
        </div>
      </div>

      <div className="space-y-2">
        {rows.map((m) => {
          const isReleased = Boolean(m.me_released);
          return (
            <div key={m.slug} className="rounded-xl border border-white/10 bg-black/30 p-4 flex justify-between">
              <div>
                <div className="text-lg">{m.display_title ?? m.slug}</div>
                <div className="text-sm opacity-75">{m.display_subtitle ?? m.one_liner ?? ""}</div>
              </div>
              <div className={`text-sm ${isReleased ? "opacity-90" : "opacity-40"}`}>
                {isReleased ? "Active" : "Sealed"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

