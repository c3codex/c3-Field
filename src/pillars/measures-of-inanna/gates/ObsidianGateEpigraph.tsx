// src/pillars/measures/gates/ObsidianGateEpigraph.tsx

import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import MeasuresReturnGlyph from "@/pillars/measures/components/MeasuresReturnGlyph";
import MeasuresCuneiformEdges from "@/pillars/measures/components/MeasuresCuneiformEdges";
import { useMeasuresAudioBus } from "@/pillars/measures/audio/MeasuresAudioBusProvider";
import { useMeasuresEncounterBundle } from "@/pillars/measures/data/hooks/useMeasuresEncounterBundle";
import { markObsidianEpigraphSeen } from "@/pillars/measures/gates/obsidianKeys";

type LooseMedia = Partial<Record<string, string | null | undefined>>;

const EPIGRAPH_SLUG = "gate_0";

export default function ObsidianGateEpigraph() {
  const nav = useNavigate();
  const { setObsidianActive, restore } = useMeasuresAudioBus();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [showStill, setShowStill] = useState(false);

  const { media, epigraph, context, scroll, loading, error } =
useMeasuresEncounterBundle(EPIGRAPH_SLUG, "all");
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

  React.useEffect(() => {
    setObsidianActive(true);
    return () => restore();
  }, [setObsidianActive, restore]);

  React.useEffect(() => {
    if (!videoSrc) {
      setShowStill(true);
      return;
    }

    const t = window.setTimeout(() => {
      setShowStill(true);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }, 6000);

    return () => window.clearTimeout(t);
  }, [videoSrc]);

  function handleContinue() {
    markObsidianEpigraphSeen();
    nav("/measures/gates/kumurrah-passage");
  }

  if (loading) {
    return <div className="min-h-screen bg-black p-8 text-stone-200">Loading…</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-black p-8 text-red-200">Epigraph missing</div>;
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black text-stone-100">
      {stillSrc && (
        <img
          src={stillSrc}
          alt="Obsidian Epigraph"
          className={[
            "absolute inset-0 h-full w-full object-contain transition-opacity duration-700",
            showStill || !videoSrc ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
      )}

      {videoSrc && !showStill && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-contain"
        />
      )}

      <div className="absolute right-5 top-5 z-40">
        <MeasuresReturnGlyph to="/measures" ariaLabel="Return to Temple" />
      </div>

      <div className="absolute inset-0 z-20">
        <MeasuresCuneiformEdges manifestSlug={EPIGRAPH_SLUG} visibility="plate-only" />
      </div>

      <div className="relative z-30 mx-auto flex min-h-screen w-full max-w-4xl items-end px-6 pb-10">
        <div className="w-full rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur">
          {epigraph && (
            <>
              <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-stone-300/70">
                {epigraph.display_label || epigraph.title || "Epigraph"}
              </div>
              <div className="mt-4 font-sans text-[15px] leading-relaxed text-stone-100/90">
                <ReactMarkdown>{epigraph.body_md}</ReactMarkdown>
              </div>
            </>
          )}

          {context && (
            <details className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <summary className="cursor-pointer font-sans text-[11px] uppercase tracking-[0.28em] text-stone-200/70">
                Context
              </summary>
              <div className="mt-4 font-sans text-[13px] leading-relaxed text-stone-200/85">
                <ReactMarkdown>{context.body_md}</ReactMarkdown>
              </div>
            </details>
          )}

          {scroll && (
            <details className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <summary className="cursor-pointer font-sans text-[11px] uppercase tracking-[0.28em] text-stone-200/70">
                Scroll
              </summary>
              <div className="mt-4 font-sans text-[13px] leading-relaxed text-stone-200/85">
                <ReactMarkdown>{scroll.body_md}</ReactMarkdown>
              </div>
            </details>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleContinue}
              className="rounded-lg bg-white/12 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/20"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}