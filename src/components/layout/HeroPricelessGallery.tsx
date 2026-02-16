// src/components/layout/HeroPriceless.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { PRICELESS_ASSETS } from "@/assets/pricelessAssets";

const FADE_MS = 850;
const END_PAD_SEC = 0.12;

export default function HeroPriceless() {
  const nav = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const PRICLESS_SEEN_KEY = "priceless:seen";

const [mode, setMode] = useState<"video" | "static">(() => {
  return localStorage.getItem(PRICLESS_SEEN_KEY) === "1" ? "static" : "video";
});

// when the video finishes (or after your settle timeout)
useEffect(() => {
  if (mode === "video") {
    const t = window.setTimeout(() => {
      localStorage.setItem(PRICLESS_SEEN_KEY, "1");
      setMode("static");
    }, 6000 /* or your priceless hero duration */);
    return () => window.clearTimeout(t);
  }
}, [mode]);

  const [settled, setSettled] = useState(false); // once true, we show the still (and hide video)
  const [fadeOutVideo, setFadeOutVideo] = useState(false);
  const [stillLoaded, setStillLoaded] = useState(false);
  const [videoErrored, setVideoErrored] = useState(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    // Reduced motion: skip straight to still (no autoplay video).
    if (prefersReducedMotion) {
      setSettled(true);
      setFadeOutVideo(true);
      return;
    }

    const v = videoRef.current;
    if (!v) return;

    let durationTimer: number | null = null;

    const settle = () => {
      setFadeOutVideo(true);
      window.setTimeout(() => setSettled(true), FADE_MS);
    };

    const onEnded = () => settle();

    const onLoadedMeta = () => {
      const d = v.duration;
      if (Number.isFinite(d) && d > 0) {
        const ms = Math.max(0, (d - END_PAD_SEC) * 1000);
        durationTimer = window.setTimeout(() => settle(), ms);
      }
    };

    const onError = () => {
      // If video fails, fall back to still immediately.
      setVideoErrored(true);
      setSettled(true);
      setFadeOutVideo(true);
    };

    v.addEventListener("ended", onEnded);
    v.addEventListener("loadedmetadata", onLoadedMeta);
    v.addEventListener("error", onError);

    return () => {
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("loadedmetadata", onLoadedMeta);
      v.removeEventListener("error", onError);
      if (durationTimer) window.clearTimeout(durationTimer);
    };
  }, [prefersReducedMotion]);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-obsidian">
      {/* STAGE */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[100svh] w-full">
          {/* MEDIA STAGE (keeps video + still aligned, no crop/zoom) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[96svh] w-[min(98vw,1500px)]">
              {/* VIDEO (plays first; still stays hidden until settled OR video error) */}
              {!prefersReducedMotion && !videoErrored && !settled && (
                <video
                  ref={videoRef}
                  src={PRICELESS_ASSETS.priceless.hero.video}
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  className={[
                    "absolute inset-0 h-full w-full object-contain",
                    "transition-opacity",
                    fadeOutVideo ? "opacity-0" : "opacity-100",
                  ].join(" ")}
                  style={{ transitionDuration: `${FADE_MS}ms` }}
                />
              )}

              {/* STILL (only appears after settle OR if video fails OR reduced motion) */}
              {(settled || videoErrored || prefersReducedMotion) && (
                <img
                  src={PRICELESS_ASSETS.priceless.hero.still}
                  alt="Priceless Gallery — Pillars"
                  draggable={false}
                  onLoad={() => setStillLoaded(true)}
                  className={[
                    "absolute inset-0 h-full w-full object-contain select-none",
                    "transition-opacity duration-500",
                    stillLoaded ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                />
              )}
            </div>
          </div>

          {/* Vignette (keeps nav readable, doesn’t blur the hero) */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,rgba(0,0,0,0.00),rgba(0,0,0,0.42)_62%,rgba(0,0,0,0.88)_100%)]" />

          {/* LEFT: Introducing link (quiet, museum label) */}
          <div className="absolute left-5 top-6 z-40">
            <button
              type="button"
              onClick={() => nav("/introducing")}
              className="group flex min-h-[44px] items-center rounded-full border border-white/10 bg-black/25 px-4 py-2
                         text-left backdrop-blur-sm transition hover:border-white/20"
              aria-label="Open Introducing: Priceless Gallery"
            >
              <div className="leading-tight">
                <div className="font-sans text-[10px] tracking-[0.32em] uppercase text-stone-200/55">
                  Introducing
                </div>
                <div className="mt-1 font-sans text-[11px] tracking-[0.18em] text-stone-200/85 group-hover:text-stone-100">
                  Priceless Gallery
                </div>
              </div>
              <span className="ml-3 text-stone-200/35 group-hover:text-stone-100/70">›</span>
            </button>
          </div>

          {/* BOTTOM NAV: text-link row (mobile-first, slim, tappable) */}
          <nav
            aria-label="Primary navigation"
            className="absolute inset-x-0 bottom-0 z-40 flex justify-center px-5
                       pb-[max(14px,env(safe-area-inset-bottom))]"
          >
            <div
              className="flex w-full max-w-[560px] items-center justify-between rounded-full border border-white/10 bg-black/20
                         px-5 py-3 backdrop-blur-sm"
            >
              <PillarLink to="/measures" label="Measures of Inanna" />
              <Dot />
              <PillarLink to="/gallery" label="Gallery" />
              <Dot />
              <PillarLink to="/model" label="Model" />
              <Dot />
              <PillarLink to="/codexstone" label="Codexstone" />
            </div>
          </nav>

          {/* FOOT NOTE (optional; also could become a link later) */}
          <div className="pointer-events-none absolute bottom-[56px] left-0 right-0 z-30 text-center">
            <span className="font-sans text-[10px] tracking-[0.28em] uppercase text-stone-200/30">
              a c3 initiative
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return <span className="px-2 text-stone-200/18">•</span>;
}

function PillarLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "min-h-[44px] px-1 py-1",
          "font-sans text-[10px] tracking-[0.28em] uppercase",
          "transition",
          isActive ? "text-stone-100" : "text-stone-200/70 hover:text-stone-100",
        ].join(" ")
      }
      aria-label={`Navigate to ${label}`}
    >
      {label}
    </NavLink>
  );
}
