// src/pillars/measures/gates/ObsidianGatePlate.tsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import MeasuresReturnGlyph from "@/pillars/measures/components/MeasuresReturnGlyph";
import MeasuresCuneiformEdges from "@/pillars/measures/components/MeasuresCuneiformEdges";
import { useMeasuresAudioBus } from "@/pillars/measures/audio/MeasuresAudioBusProvider";
import { useMeasuresEncounterBundle } from "@/pillars/measures/data/hooks/useMeasuresEncounterBundle";
import { nextObsidianGateSlug } from "@/pillars/measures/data/helpers/nextGate";

const AUTO_STATIC_AFTER_MS = 6000;
const FADE_MS = 900;
const ENCOUNTER_PAUSE_MS = 3000;
const PLAQUE_OPEN_DELAY_MS = AUTO_STATIC_AFTER_MS + ENCOUNTER_PAUSE_MS;

type LooseMedia = Partial<Record<string, string | null | undefined>>;

export default function ObsidianGatePlate() {
  const nav = useNavigate();
  const { gateSlug } = useParams<{ gateSlug?: string }>();

  const nextGateSlug = nextObsidianGateSlug(gateSlug);

  const bus = useMeasuresAudioBus();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const {
    media,
    plaque,
    epigraph,
    context,
    scroll,
    loading,
    error,
  } = useMeasuresEncounterBundle(gateSlug, "all");

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

  const primaryPlaque = plaque ?? null;
  const secondaryPlaque = epigraph ?? null;

  const [mediaMode, setMediaMode] = useState<"animated" | "still">("animated");
  const [showStill, setShowStill] = useState(false);
  const [videoFading, setVideoFading] = useState(false);

  const [plaqueOpen, setPlaqueOpen] = useState(false);
  const [plaqueMinimized, setPlaqueMinimized] = useState(false);

  const { setObsidianActive, restore } = bus;

  useEffect(() => {
    setObsidianActive(true);
    return () => restore();
  }, [setObsidianActive, restore]);

  useEffect(() => {
    if (!gateSlug) return;

    const timers: number[] = [];
    const clearAll = () => timers.forEach((t) => window.clearTimeout(t));

    const v = videoRef.current;
    if (v) v.playbackRate = 0.85;

    if (videoSrc) {
      timers.push(
        window.setTimeout(() => {
          setShowStill(true);
          setVideoFading(true);

          timers.push(
            window.setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              }
              setMediaMode("still");
            }, FADE_MS)
          );
        }, AUTO_STATIC_AFTER_MS)
      );
    } else {
      setShowStill(true);
      setMediaMode("still");
    }

    timers.push(
      window.setTimeout(() => {
        setPlaqueOpen(true);
        setPlaqueMinimized(false);
      }, PLAQUE_OPEN_DELAY_MS)
    );

    return clearAll;
  }, [gateSlug, videoSrc]);

  function handleContinue() {
    if (!nextGateSlug) return;
    nav(`/measures/gates/${nextGateSlug}/passage`);
  }

  if (loading) {
    return <div className="min-h-screen bg-black p-8 text-stone-200">Loading…</div>;
  }

  if (error || !gateSlug) {
    return <div className="min-h-screen bg-black p-8 text-red-200">Gate missing</div>;
  }

  if (!stillSrc) {
    return (
      <div className="min-h-screen bg-black p-8 text-stone-200">
        Missing still image
      </div>
    );
  }

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-black">
      <img
        src={stillSrc}
        alt="Gate Plate"
        className={[
          "absolute inset-0 h-full w-full object-contain transition-opacity duration-700",
          showStill ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      {mediaMode === "animated" && videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-contain"
          style={{
            opacity: videoFading ? 0 : 1,
            transition: `opacity ${FADE_MS}ms ease`,
          }}
        />
      )}

      <div className="absolute right-5 top-5 z-40">
        <MeasuresReturnGlyph to="/measures" ariaLabel="Return to Temple" />
      </div>

      <div className="absolute inset-0 z-20">
        <MeasuresCuneiformEdges manifestSlug={gateSlug} visibility="plate-only" />
      </div>

      {plaqueOpen && !plaqueMinimized && (
        <div className="absolute bottom-10 left-1/2 z-30 w-[min(92vw,920px)] -translate-x-1/2 rounded-2xl border border-white/10 bg-black/60 px-6 py-5 backdrop-blur">
          <div className="grid gap-4 md:grid-cols-2">
            {primaryPlaque && (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-stone-100">
                <div className="font-sans text-[10px] uppercase tracking-[0.3em] text-stone-300/65">
                  {primaryPlaque.display_label || primaryPlaque.title}
                </div>
                <div className="mt-3 font-sans text-[14px] leading-relaxed text-stone-200/90">
                  <ReactMarkdown>{primaryPlaque.body_md}</ReactMarkdown>
                </div>
              </div>
            )}

            {secondaryPlaque && (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-stone-100">
                <div className="font-sans text-[10px] uppercase tracking-[0.3em] text-stone-300/65">
                  {secondaryPlaque.display_label || secondaryPlaque.title}
                </div>
                <div className="mt-3 font-sans text-[14px] leading-relaxed text-stone-200/90">
                  <ReactMarkdown>{secondaryPlaque.body_md}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          {context && (
            <details className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
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

          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setPlaqueMinimized(true)}
              className="rounded-lg bg-white/10 px-3 py-2 text-[11px] text-stone-100 transition hover:bg-white/15"
            >
              Minimize
            </button>

            {nextGateSlug && (
              <button
                type="button"
                onClick={handleContinue}
                className="rounded-lg bg-white/12 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/20"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      )}

      {plaqueOpen && plaqueMinimized && (
        <div className="absolute bottom-8 right-8 z-30">
          <button
            type="button"
            onClick={() => setPlaqueMinimized(false)}
            className="rounded-full border border-white/15 bg-black/55 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-stone-200/85 backdrop-blur transition hover:border-white/25 hover:text-stone-100"
          >
            Open Plaques
          </button>
        </div>
      )}
    </section>
  );
}