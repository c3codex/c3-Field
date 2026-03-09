// src/pillars/measures/gates/ObsidianGateIntro.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EncounterStage, { type EncounterPhase } from "@/pillars/measures/components/EncounterStage";
import MeasuresReturnGlyph from "@/pillars/measures/components/MeasuresReturnGlyph";
import { MEASURES_ASSETS } from "@/pillars/measures/measuresAssets";

export default function ObsidianGateIntro() {
  const nav = useNavigate();
  const [phase, setPhase] = useState<EncounterPhase>("arrive");
  const [plaqueOpen, setPlaqueOpen] = useState(false);

  // Keep these aligned with EncounterStage props (so our failsafe matches your intended choreography)
  const videoDurationMs = 5200;
  const encounterPauseMs = 1100;
  const settleFadeMs = 900;

  // If EncounterStage never calls "ready", we still progress.
  const fallbackReadyAtMs = useMemo(
    () => videoDurationMs + encounterPauseMs + settleFadeMs + 200,
    [videoDurationMs, encounterPauseMs, settleFadeMs]
  );

  useEffect(() => {
    const t = window.setTimeout(() => {
      setPhase((p) => (p === "ready" ? p : "ready"));
      setPlaqueOpen(true);
    }, fallbackReadyAtMs);

    return () => window.clearTimeout(t);
  }, [fallbackReadyAtMs]);

  const ready = phase === "ready";

  return (
    <EncounterStage
      stillSrc={MEASURES_ASSETS.obsidianEpigraph.still}
      alt="Obsidian Gates Epigraph"
      videoSrc={MEASURES_ASSETS.obsidianEpigraph.animated}
      videoDurationMs={videoDurationMs}
      settleFadeMs={settleFadeMs}
      encounterPauseMs={encounterPauseMs}
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
          <div className="text-xs tracking-[0.2em] uppercase text-stone-200/55">Encounter</div>
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
              <p className="font-serif"
              
              >𒀭𒈹𒁀𒀭𒌈
           𒀭𒋫𒃲𒋫 𒄑𒌆𒃲𒊺

           From the Great Above  
               she opened her ear to the Great Below.

This line is among the oldest recorded passages attributed to the Descent of Inanna,
preserved in Sumerian cuneiform on clay tablets over four thousand years ago.

It does not announce a journey.  
It marks a decision.

Inanna does not fall.  
She listens.
    `.trim(),</p>
              <p className="mt-3 text-stone-200/75">
                Inanna was one of the central deities of ancient Sumer, governing fertility,
sovereignty, exchange, sexuality, and transformation. She presided over thresholds —
between heaven and earth, power and surrender, life and death.

The Descent of Inanna is among the earliest written narratives in human history.
It describes a goddess who willingly descends into the underworld, passing through
seven gates. At each gate, she removes a symbol of authority, protection, or status.

By the time she reaches the Great Below, nothing remains to shield her.

This is not punishment.  
It is procedure.

Sumerian culture understood descent not as failure, but as a necessary condition
for renewal. Transformation required contact with consequence.
    `.trim(),
,
              </p>           .
          
            <div className="pt-4">
                <button
                  type="button"
                  onClick={() => nav("/measures/gates/passage")}
                  className="w-full rounded-xl bg-white/12 px-4 py-2.5 text-sm text-stone-100 hover:bg-white/18 transition"
                >Continue, and the descent becomes observable.
                
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