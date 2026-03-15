// src/pillars/measures/gates/KumurrahPassage.tsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EncounterStage, {
  type EncounterPhase,
} from "@/pillars/measures/components/EncounterStage";
import MeasuresReturnGlyph from "@/pillars/measures/components/MeasuresReturnGlyph";
import { useMeasuresEncounterBundle } from "@/pillars/measures/data/hooks/useMeasuresEncounterBundle";
import { MEASURES_STAGE_SLUGS } from "@/pillars/measures/data/helpers/measuresStageSlugs";
import { useMeasuresAudioBus } from "@/pillars/measures/audio/MeasuresAudioBusProvider";

type LooseMedia = Partial<Record<string, string | null | undefined>>;

export default function KumurrahPassage() {
  const nav = useNavigate();
  const { gateSlug } = useParams<{ gateSlug?: string }>();
  const [phase, setPhase] = useState<EncounterPhase>("arrive");

  const { duck, restore } = useMeasuresAudioBus();

  useEffect(() => {
    duck();
    return restore;
  }, [duck, restore]);

  const manifestSlug = gateSlug ?? MEASURES_STAGE_SLUGS.kumurrahPassage;

  const { media, loading, error } = useMeasuresEncounterBundle(manifestSlug, "all");

  const mediaMap = useMemo(() => (media ?? {}) as LooseMedia, [media]);

  const videoSrc = useMemo(() => {
    return (
      mediaMap.video_src ??
      mediaMap.video_url ??
      mediaMap.animated_url ??
      mediaMap.motion_url ??
      null
    );
  }, [mediaMap]);

  const stillSrc = useMemo(() => {
    return (
      mediaMap.still_src ??
      mediaMap.still_url ??
      mediaMap.image_url ??
      mediaMap.render_url ??
      mediaMap.poster_url ??
      null
    );
  }, [mediaMap]);

  useEffect(() => {
    if (phase !== "ready") return;

    if (gateSlug) {
      nav(`/measures/gates/${gateSlug}`);
      return;
    }

    nav("/measures/gates/gateboard");
  }, [phase, gateSlug, nav]);

  function handleSkip() {
    if (gateSlug) {
      nav(`/measures/gates/${gateSlug}`);
      return;
    }

    nav("/measures/gates/gateboard");
  }

  return (
    <EncounterStage
      alt="Kumurrah Passage"
      videoSrc={videoSrc ?? undefined}
      stillSrc={stillSrc ?? undefined}
      videoDurationMs={5200}
      settleFadeMs={900}
      encounterPauseMs={700}
      mediaFit="contain"
      videoPlaybackRate={1}
      onPhaseChange={setPhase}
      topRight={<MeasuresReturnGlyph to="/measures" ariaLabel="Return to Temple" />}
    >
      {error && (
        <div className="absolute left-6 top-6 z-50 rounded-lg border border-red-400/20 bg-black/60 px-3 py-2 text-xs text-red-200">
          Failed to load passage media: {error}
        </div>
      )}

      {!loading && !videoSrc && !stillSrc && !error && (
        <div className="absolute inset-x-0 bottom-8 z-40 px-4">
          <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-center text-sm text-stone-200/75 backdrop-blur">
            No media found for <span className="text-stone-100">{manifestSlug}</span>.
          </div>
        </div>
      )}

      <div className="absolute bottom-6 left-6 z-50 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSkip}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-stone-100 backdrop-blur transition hover:bg-white/15"
        >
          Skip
        </button>
      </div>
    </EncounterStage>
  );
}