import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MeasuresReturnGlyph from "@/pillars/measures/components/MeasuresReturnGlyph";
import { useMeasuresMediaUnit } from "@/pillars/measures/data/hooks/useMeasuresMediaUnit";
import { hasSeenObsidianEpigraph } from "@/pillars/measures/gates/obsidianKeys";

const AUTO_STATIC_AFTER_MS = 5200;
const TEMPLE_SEEN_KEY = "measures:temple_seen";

type ZoneId = "obsidian" | "crystal" | "marble";

export default function MeasuresTempleHome() {
  const nav = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const settledRef = useRef(false);

  const { item: media, loading: mediaLoading } = useMeasuresMediaUnit("templehome");

  const [mode, setMode] = useState<"video" | "static">(() => {
    if (typeof window === "undefined") return "video";
    return localStorage.getItem(TEMPLE_SEEN_KEY) ? "static" : "video";
  });

  const isStatic = mode === "static";

  const settleToStatic = () => {
    if (settledRef.current) return;
    settledRef.current = true;

    const v = videoRef.current;
    if (v) {
      try {
        v.pause();
        v.currentTime = 0;
      } catch {
        // ignore
      }
    }

    try {
      localStorage.setItem(TEMPLE_SEEN_KEY, "true");
    } catch {
      // ignore
    }

    setMode("static");
  };

  useEffect(() => {
    if (mode === "static") return;
    if (!media?.animated_video_url) return;

    const t = window.setTimeout(settleToStatic, AUTO_STATIC_AFTER_MS);

    const v = videoRef.current;
    if (v) {
      v.playbackRate = 0.85;

      const onEnded = () => settleToStatic();
      const onError = () => settleToStatic();

      v.addEventListener("ended", onEnded);
      v.addEventListener("error", onError);

      return () => {
        window.clearTimeout(t);
        v.removeEventListener("ended", onEnded);
        v.removeEventListener("error", onError);
      };
    }

    return () => window.clearTimeout(t);
  }, [mode, media?.animated_video_url]);

  function handleObsidianClick() {
    if (!isStatic) return;

    if (hasSeenObsidianEpigraph()) {
      nav("/measures/gates/kumurrah-passage");
      return;
    }

    nav("/measures/gates/obsidian-epigraph");
  }

  function handleCrystalClick() {
    if (!isStatic) return;
    nav("/measures/epithets");
  }

  function handleMarbleClick() {
    if (!isStatic) return;
    nav("/measures/mes");
  }

  const go = (zone: ZoneId) => {
    if (!isStatic) return;

    switch (zone) {
      case "obsidian":
        handleObsidianClick();
        break;
      case "crystal":
        handleCrystalClick();
        break;
      case "marble":
        handleMarbleClick();
        break;
    }
  };

  const animatedSrc = media?.animated_video_url ?? null;
  const stillSrc = media?.still_image_url ?? null;

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-obsidian">
      <div className="absolute left-6 top-6 z-40">
        <MeasuresReturnGlyph to="/" ariaLabel="Return to Priceless Gallery" />
      </div>

      <div className="absolute left-6 top-[110px] z-40">
        <button
          type="button"
          onClick={() => isStatic && nav("/measures/antechamber")}
          className="rounded-full border border-white/15 bg-black/30 px-5 py-2 font-sans text-[10px] uppercase tracking-[0.35em] text-stone-200/80 transition hover:border-white/30 hover:text-stone-100"
        >
          enter antechamber
        </button>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[96svh] w-[min(98vw,1500px)]">
          {!mediaLoading && mode === "video" && animatedSrc && (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-contain transition-opacity duration-700"
              autoPlay
              muted
              playsInline
              preload="auto"
              loop={false}
            >
              <source src={animatedSrc} type="video/mp4" />
            </video>
          )}

          {!mediaLoading && stillSrc && (
            <img
              src={stillSrc}
              alt="Measures of Inanna — Temple"
              draggable={false}
              className={[
                "absolute inset-0 h-full w-full object-contain transition-opacity duration-700",
                isStatic || !animatedSrc ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />
          )}

          <div
            className={[
              "absolute bottom-[8%] left-1/2 z-30 -translate-x-1/2",
              "flex gap-4",
              isStatic ? "pointer-events-auto" : "pointer-events-none opacity-40",
            ].join(" ")}
          >
            <PillarButton label="obsidian gates" onClick={() => go("obsidian")} />
            <PillarButton label="crystal epithets" onClick={() => go("crystal")} />
            <PillarButton label="marble MEs" onClick={() => go("marble")} />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(0,0,0,0.00),rgba(0,0,0,0.55)_72%,rgba(0,0,0,0.88)_100%)]" />

      <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-30 text-center">
        <span className="font-sans text-[11px] uppercase tracking-[0.32em] text-stone-200/45">
          {isStatic || !animatedSrc ? "select a threshold" : "settling…"}
        </span>
      </div>
    </section>
  );
}

function PillarButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-white/15 bg-black/25 px-6 py-3 font-sans text-[10px] uppercase tracking-[0.35em] text-stone-200/85 transition hover:border-white/30 hover:text-stone-100"
    >
      {label}
    </button>
  );
}