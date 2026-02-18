// src/pillars/measures/components/EncounterStage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";

export type EncounterPhase = "arrive" | "settle" | "pause" | "ready";

type Props = {
  stillSrc: string;
  alt: string;
  videoSrc?: string | null;

  videoDurationMs?: number;
  settleFadeMs?: number;
  encounterPauseMs?: number;

  mediaFit?: "contain" | "cover";
  onPhaseChange?: (p: EncounterPhase) => void;

  videoPlaybackRate?: number;

  topLeft?: React.ReactNode;
  topRight?: React.ReactNode;
  children?: React.ReactNode;
};

export default function EncounterStage({
  stillSrc,
  alt,
  videoSrc = null,
  videoDurationMs = 5200,
  settleFadeMs = 900,
  encounterPauseMs = 1100,
  mediaFit = "contain",
  onPhaseChange,
  videoPlaybackRate = 0.9,
  topLeft,
  topRight,
  children,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [phase, setPhase] = useState<EncounterPhase>("arrive");
  const [showStill, setShowStill] = useState(false);
  const [videoFading, setVideoFading] = useState(false);
  const [videoOn, setVideoOn] = useState(Boolean(videoSrc));

  // single helper to keep state + callback in lockstep
  const setPhaseBoth = (p: EncounterPhase) => {
    setPhase(p);
    onPhaseChange?.(p);
  };

  // Tailwind-safe class for object-fit (NO dynamic template strings)
  const fitClass = useMemo(() => (mediaFit === "cover" ? "object-cover" : "object-contain"), [mediaFit]);

  // apply playback rate whenever the video is present
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = videoPlaybackRate;
  }, [videoPlaybackRate, videoSrc]);

  // timeline controller
  useEffect(() => {
    // reset baseline whenever media changes
    setVideoOn(Boolean(videoSrc));
    setShowStill(!videoSrc); // if no video, show still immediately
    setVideoFading(false);
    setPhaseBoth("arrive");

    const timers: number[] = [];
    const clearAll = () => timers.forEach((t) => window.clearTimeout(t));

    // if no video: pause -> ready
    if (!videoSrc) {
      setPhaseBoth("pause");
      timers.push(
        window.setTimeout(() => {
          setPhaseBoth("ready");
        }, encounterPauseMs)
      );

      return clearAll;
    }

    // with video: schedule settle at videoDurationMs
    timers.push(
      window.setTimeout(() => {
        setPhaseBoth("settle");
        setShowStill(true);
        setVideoFading(true);

        // drop video after crossfade
        timers.push(
          window.setTimeout(() => {
            setVideoOn(false);
          }, settleFadeMs)
        );

        // then pause
        timers.push(
          window.setTimeout(() => {
            setPhaseBoth("pause");

            // then ready
            timers.push(
              window.setTimeout(() => {
                setPhaseBoth("ready");
              }, encounterPauseMs)
            );
          }, settleFadeMs)
        );
      }, videoDurationMs)
    );

    return clearAll;
    // We intentionally key off videoSrc (and timing knobs) to re-run cleanly
  }, [videoSrc, videoDurationMs, settleFadeMs, encounterPauseMs]);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-black">
      {/* MEDIA */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[96svh] w-[min(98vw,1500px)]">
          {/* Still underlay */}
          <img
            src={stillSrc}
            alt={alt}
            draggable={false}
            className={`absolute inset-0 h-full w-full select-none ${fitClass} transition-opacity duration-700`}
            style={{ opacity: showStill || !videoOn ? 1 : 0 }}
          />

          {/* Video overlay */}
          {videoOn && videoSrc ? (
            <video
              ref={videoRef}
              className={`absolute inset-0 h-full w-full ${fitClass}`}
              autoPlay
              muted
              playsInline
              preload="auto"
              loop={false}
              style={{
                opacity: videoFading ? 0 : 1,
                transition: `opacity ${settleFadeMs}ms ease`,
              }}
              onEnded={() => {
                // if the video ends early, we still transition gracefully
                setShowStill(true);
                setVideoFading(true);
                window.setTimeout(() => setVideoOn(false), settleFadeMs);
              }}
              onError={() => {
                setShowStill(true);
                setVideoOn(false);
              }}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : null}
        </div>
      </div>

      {/* corners */}
      {topLeft ? <div className="absolute left-6 top-6 z-40">{topLeft}</div> : null}
      {topRight ? <div className="absolute right-6 top-6 z-40">{topRight}</div> : null}

      {/* children overlay */}
      {children}

      {/* (optional) keep phase available for debugging without UI impact */}
      <span className="sr-only" aria-hidden="true">
        {phase}
      </span>
    </section>
  );
}
