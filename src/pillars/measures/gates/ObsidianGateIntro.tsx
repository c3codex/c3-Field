// src/pillars/measures/gates/ObsidianGateIntro.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EncounterStage, { type EncounterPhase } from "@/pillars/measures/components/EncounterStage";
import MeasuresReturnGlyph from "@/pillars/measures/components/MeasuresReturnGlyph";
import { MEASURES_ASSETS } from "@/pillars/measures/measuresAssets";

export default function ObsidianGateIntro() {
  const nav = useNavigate();
  const [phase, setPhase] = useState<EncounterPhase>("arrive");
  const [plaqueOpen, setPlaqueOpen] = useState(false);

  const ready = phase === "ready";

  return (
    <EncounterStage
      stillSrc={MEASURES_ASSETS.obsidianEpigraph.still}
      alt="Obsidian Gates Epigraph"
      videoSrc={MEASURES_ASSETS.obsidianEpigraph.animated}
      videoDurationMs={5200}
      settleFadeMs={900}
      encounterPauseMs={1100}
      mediaFit="contain"
      videoPlaybackRate={0.9}
      onPhaseChange={(p) => {
        setPhase(p);
        if (p === "ready") setPlaqueOpen(true);
      }}
      topRight={<MeasuresReturnGlyph to="/measures" ariaLabel="Return to Temple" />}
    >
      {/* Controls */}
      <div className="absolute bottom-6 left-6 z-50 flex items-center gap-3">
        {ready ? (
          <>
            <button
              type="button"
              onClick={() => setPlaqueOpen(true)}
              className="rounded-xl bg-white/10 px-4 py-2 text-sm text-stone-100 backdrop-blur hover:bg-white/15 transition"
            >
              Open Text
            </button>

            <button
              type="button"
              onClick={() => nav("/measures/gates/passage")}
              className="rounded-xl bg-white/15 px-4 py-2 text-sm text-stone-100 backdrop-blur hover:bg-white/20 transition"
            >
              Continue Descent
            </button>
          </>
        ) : (
          <div className="text-xs tracking-[0.2em] uppercase text-stone-200/55">
            Encounter
          </div>
        )}
      </div>

      {/* Plaque */}
      {plaqueOpen && (
        <div className="absolute inset-x-0 bottom-8 z-40 px-4 pointer-events-none">
          <div className="pointer-events-auto mx-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-black/28 backdrop-blur-lg shadow-[0_16px_60px_rgba(0,0,0,0.45)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
              <div className="text-[10px] uppercase tracking-[0.3em] text-stone-200/80 font-sans">
                Measures of Inanna
              </div>

              <button
                type="button"
                onClick={() => setPlaqueOpen(false)}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-[11px] text-stone-100 hover:bg-white/15 transition"
              >
                Close Text
              </button>
            </div>

            <div className="px-5 py-4 text-stone-100/85 text-center leading-[1.7] text-[15px]">
              <p className="font-serif">
                Entrance is not introduction.
              </p>
              <p className="mt-3 text-stone-200/75">
                The Obsidian Gates measure reduction. What is removed is not lost, it is registered.
              </p>
              <p className="mt-3 text-stone-200/75">
                Continue, and the descent becomes observable.
              </p>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => nav("/measures/gates/passage")}
                  className="w-full rounded-xl bg-white/12 px-4 py-2.5 text-sm text-stone-100 hover:bg-white/18 transition"
                >
                  Continue Descent
                </button>
              </div>
            </div>

            <div className="h-1.5 bg-gradient-to-b from-white/5 to-transparent" />
          </div>
        </div>
      )}
    </EncounterStage>
  );
}
