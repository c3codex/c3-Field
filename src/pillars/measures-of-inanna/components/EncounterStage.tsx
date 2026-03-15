import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

  const settledOnceRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  const setPhaseBoth = useCallback(
    (p: EncounterPhase) => {
      setPhase(p);
      onPhaseChange?.(p);
    },
    [onPhaseChange]
  );

  const fitClass = useMemo(
    () => (mediaFit === "cover" ? "object-cover" : "object-contain"),
    [mediaFit]
  );

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = videoPlaybackRate;
  }, [videoPlaybackRate, videoSrc]);

  const settleNow = useCallback(() => {
    if (settledOnceRef.current) return;
    settledOnceRef.current = true;

    setPhaseBoth("settle");
    setShowStill(true);
    setVideoFading(true);

    timersRef.current.push(
      window.setTimeout(() => {
        setVideoOn(false);
        const v = videoRef.current;
        if (v) {
          try {
            v.pause();
            v.currentTime = 0;
          } catch {
            /* ignore */
          }
        }
      }, settleFadeMs)
    );

    timersRef.current.push(
      window.setTimeout(() => {
        setPhaseBoth("pause");
        timersRef.current.push(
          window.setTimeout(() => setPhaseBoth("ready"), encounterPauseMs)
        );
      }, settleFadeMs)
    );
  }, [encounterPauseMs, settleFadeMs, setPhaseBoth]);

  useEffect(() => {
    clearTimers();
    settledOnceRef.current = false;

    setVideoOn(Boolean(videoSrc));
    setShowStill(!videoSrc);
    setVideoFading(false);
    setPhaseBoth("arrive");

    if (!videoSrc) {
      setPhaseBoth("pause");
      timersRef.current.push(
        window.setTimeout(() => setPhaseBoth("ready"), encounterPauseMs)
      );
      return clearTimers;
    }

    timersRef.current.push(window.setTimeout(settleNow, videoDurationMs));
    return clearTimers;
  }, [videoSrc, videoDurationMs, encounterPauseMs, clearTimers, setPhaseBoth, settleNow]);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-black">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[96svh] w-[min(98vw,1500px)]">
          <img
            src={stillSrc}
            alt={alt}
            draggable={false}
            className={`absolute inset-0 h-full w-full select-none ${fitClass} transition-opacity duration-700`}
            style={{ opacity: showStill || !videoOn ? 1 : 0 }}
          />

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
              onEnded={settleNow}
              onError={settleNow}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : null}
        </div>
      </div>

      {topLeft ? <div className="absolute left-6 top-6 z-40">{topLeft}</div> : null}
      {topRight ? <div className="absolute right-6 top-6 z-40">{topRight}</div> : null}

      {children}

      <span className="sr-only" aria-hidden="true">
        {phase}
      </span>
    </section>
  );
}