import React from "react";
import { useMeasuresEpithetsIndex } from "@/pillars/measures/data/useMeasuresEpithetsIndex";

export default function CrystalEpithetIndex() {
  const { rows, loading, error } = useMeasuresEpithetsIndex();

  if (loading) return <div className="p-6">Loading Epithets…</div>;
  if (error) return <div className="p-6">Error: {error}</div>;

  return (
    <div className="p-6 space-y-3">
      <div className="text-xl">Crystal Epithets</div>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4 opacity-80">
          No epithets revealed yet.
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((e) => (
            <div key={e.slug} className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="text-lg">{e.display_title ?? e.slug}</div>
              <div className="text-sm opacity-75">
                {e.display_subtitle ?? e.one_liner ?? "Revealed"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
