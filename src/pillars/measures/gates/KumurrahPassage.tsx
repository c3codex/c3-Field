// src/pillars/measures/gates/KumurrahPassage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EncounterStage, { type EncounterPhase } from "@/pillars/measures/components/EncounterStage";
import MeasuresReturnGlyph from "@/pillars/measures/components/MeasuresReturnGlyph";
import { MEASURES_ASSETS } from "@/pillars/measures/measuresAssets";

export default function KumurrahPassage() {
  const nav = useNavigate();
  const [phase, setPhase] = useState<EncounterPhase>("arrive");

  // When ready, proceed to Index
  useEffect(() => {
    if (phase === "ready") nav("/measures/gates");
  }, [phase, nav]);

  return (
    <EncounterStage
      stillSrc={MEASURES_ASSETS.kumurrah.still}
      alt="Kumurrah Passage"
      videoSrc={MEASURES_ASSETS.kumurrah.animated}
      videoDurationMs={5200}
      settleFadeMs={900}
      encounterPauseMs={700}
      mediaFit="cover"
      videoPlaybackRate={1}
      onPhaseChange={setPhase}
      topRight={<MeasuresReturnGlyph to="/measures" ariaLabel="Return to Temple" />}
    >
      <div className="absolute bottom-6 left-6 z-50 flex items-center gap-3">
        <button
          type="button"
          onClick={() => nav("/measures/gates")}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-stone-100 backdrop-blur hover:bg-white/15 transition"
        >
          Skip
        </button>
      </div>
    </EncounterStage>
  );
}
