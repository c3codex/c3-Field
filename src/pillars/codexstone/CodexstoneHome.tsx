// src/components/layout/HeroCodexstone.tsx
import { useEffect, useRef, useState } from "react";
import CodexstoneNav from "./CodexstoneNav";

const ANIMATED_SRC =
  "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/codexstoneHero.mp4";
const STATIC_SRC =
  "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/CodexstoneHero.png";

const FADE_MS = 850;
const END_PAD_SEC = 0.12;

export default function HeroCodexstone() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [settled, setSettled] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [stillLoaded, setStillLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let durationTimer: number | null = null;

    const settle = () => {
      setFadeOut(true);
      window.setTimeout(() => setSettled(true), FADE_MS);
    };

    const onEnded = () => settle();

    const onLoadedMeta = () => {
      const d = video.duration;
      if (Number.isFinite(d) && d > 0) {
        const ms = Math.max(0, (d - END_PAD_SEC) * 1000);
        durationTimer = window.setTimeout(() => settle(), ms);
      }
    };

    const onError = () => {
      // If the video fails, just show still
      setSettled(true);
      setFadeOut(true);
    };

    video.addEventListener("ended", onEnded);
    video.addEventListener("loadedmetadata", onLoadedMeta);
    video.addEventListener("error", onError);

    return () => {
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("loadedmetadata", onLoadedMeta);
      video.removeEventListener("error", onError);
      if (durationTimer) window.clearTimeout(durationTimer);
    };
  }, []);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-[radial-gradient(circle_at_center,_#0b1320_0%,_#05080f_72%)]">
      <div className="relative z-10 mx-auto grid h-full max-w-[1400px] grid-rows-[auto,1.25fr,0.75fr] px-6 pt-4 pb-3">
        {/* HEADER (not on the stone) */}
        <header className="text-center pointer-events-none">
          <div className="font-cinzel text-[clamp(28px,4vw,52px)] tracking-[0.14em] text-stone-200/80">
            Priceless Gallery
          </div>
        </header>

        {/* STAGE */}
        <div className="flex items-center justify-center">
          <div className="relative w-[min(94vw,1100px)] aspect-[16/9]">
            {/* STILL */}
            <img
              src={STATIC_SRC}
              alt="Codexstone"
              onLoad={() => setStillLoaded(true)}
              className={[
                "absolute inset-0 h-full w-full object-contain",
                "transition-opacity duration-500",
                stillLoaded ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />

            {/* VIDEO */}
            <video
  ref={videoRef}
  src={ANIMATED_SRC}
  autoPlay
  muted
  playsInline
  preload="auto"
  style={{ transitionDuration: `${FADE_MS}ms` }}
  className={[
    "absolute inset-0 h-full w-full object-contain transition-opacity",
    fadeOut ? "opacity-0" : "opacity-100",
  ].join(" ")}
/>

              


                className={[
                  "absolute inset-0 h-full w-full object-contain",
                  "transition-opacity duration-[850ms]",
                  fadeOut ? "opacity-0" : "opacity-100",
                ].join(" ")}
              /
            

            {/* GEO NAV (forced above media, clickable) */}
            <CodexstoneNav
              className="absolute inset-0 z-50"
              mobileMode="twoTap"
              twoTapWindowMs={1200}
              // Turn this on briefly if you need to see hit zones:
              // debugZones
            />
          </div>
        </div>

        {/* FOOTER */}
        <footer className="text-center pointer-events-none">
          <div className="font-inter text-[11px] tracking-[0.28em] text-stone-500/45">
            a c3 initiative
          </div>
        </footer>
      </div>
    </section>
  );
}
