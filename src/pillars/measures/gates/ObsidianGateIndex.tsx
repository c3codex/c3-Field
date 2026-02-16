import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MEASURES_ASSETS } from "@/pillars/measures/measuresAssets";
import MeasuresReturnGlyph from "@/pillars/measures/components/MeasuresReturnGlyph";
import { useMeasuresAudioBus } from "@/pillars/measures/audio/MeasuresAudioBusProvider";

type GateDef = {
  id: number;
  label: string;
  route: string;
  enabled: boolean;
  zone: { top: string; left: string; width: string; height: string };
};

const KUMURRAH_DURATION_MS = 6200;
const FADE_MS = 1200;

// optional: soften bed during the video “encounter” then restore on index
const DUCK_DURING_VIDEO = true;

// IMPORTANT: set this to match your obsidianIndex still's aspect ratio.
// If you don't know it yet, leave as "16 / 9" temporarily and adjust later.
const INDEX_ASPECT_RATIO = "16 / 9";

export default function ObsidianGateIndex() {
  const nav = useNavigate();
  const bus = useMeasuresAudioBus();

  const [phase, setPhase] = useState<"video" | "index">("video");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // ✅ AUDIO: start obsidian bed for the whole index page
  useEffect(() => {
    bus.setObsidianActive(true);
    if (DUCK_DURING_VIDEO) bus.duck(); // keeps Kumurrah cinematic + not “too present”
    return () => {
      bus.restore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ AUDIO: restore bed once the index still is fully available
  useEffect(() => {
    if (phase === "index") bus.restore();
  }, [phase, bus]);

  useEffect(() => {
    const t = window.setTimeout(() => setPhase("index"), KUMURRAH_DURATION_MS);
    return () => window.clearTimeout(t);
  }, []);

  const base = MEASURES_ASSETS.kumurrah.plateBase; // "/measures/gates"
  const gateRoute = (n: number) => `${base}/gate${n}`;

  const gates: GateDef[] = [
    {
      id: 0,
      label: "Queen of Heaven",
      route: gateRoute(0),
      enabled: true,
      zone: { top: "18%", left: "14%", width: "22%", height: "14%" },
    },
    { id: 1, label: "The Crown", route: gateRoute(1), enabled: false, zone: { top: "36%", left: "14%", width: "22%", height: "14%" } },
    { id: 2, label: "The Beads of Lapis", route: gateRoute(2), enabled: false, zone: { top: "52%", left: "14%", width: "22%", height: "14%" } },
    { id: 3, label: "The Lapis Necklace", route: gateRoute(3), enabled: false, zone: { top: "68%", left: "14%", width: "22%", height: "14%" } },
    { id: 4, label: "The Breastplate", route: gateRoute(4), enabled: false, zone: { top: "36%", left: "64%", width: "22%", height: "14%" } },
    { id: 5, label: "The Golden Bracelet", route: gateRoute(5), enabled: false, zone: { top: "52%", left: "64%", width: "22%", height: "14%" } },
    { id: 6, label: "The Measuring Rod", route: gateRoute(6), enabled: false, zone: { top: "68%", left: "64%", width: "22%", height: "14%" } },
    { id: 7, label: "The Royal Robe", route: gateRoute(7), enabled: false, zone: { top: "84%", left: "64%", width: "22%", height: "14%" } },
  ];

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-black">
      {/* KUMURRAH VIDEO */}
      {phase === "video" && (
        <video
          ref={videoRef}
          src={MEASURES_ASSETS.kumurrah.animated}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-contain"
          style={{ pointerEvents: "none" }} // never steal taps
        />
      )}

      {/* INDEX IMAGE */}
      <div
        className="absolute inset-0"
        style={{
          opacity: phase === "index" ? 1 : 0,
          transition: `opacity ${FADE_MS}ms ease`,
          pointerEvents: phase === "index" ? "auto" : "none",
        }}
      >
        {/* Centered aspect box: zones align to the actual displayed art */}
        <div className="absolute inset-0 grid place-items-center">
          <div
            className="relative"
            style={{
              aspectRatio: INDEX_ASPECT_RATIO,
              width: "min(100vw, calc(100svh * (16/9)))",
              height: "min(100svh, calc(100vw * (9/16)))",
              maxWidth: "100vw",
              maxHeight: "100svh",
            }}
          >
            <img
              src={MEASURES_ASSETS.obsidianIndex.still}
              alt="Obsidian Gates of Descent"
              draggable={false}
              className="absolute inset-0 h-full w-full select-none"
              style={{ objectFit: "fill", pointerEvents: "none" }} // image itself shouldn't steal taps
            />

            {/* GATE HOT ZONES */}
            {gates.map((gate) => (
              <button
                key={gate.id}
                type="button"
                aria-label={gate.label}
                disabled={!gate.enabled}
                onPointerDown={() => gate.enabled && nav(gate.route)}
                onClick={() => gate.enabled && nav(gate.route)}
                className={`absolute z-30 rounded-xl transition ${
                  gate.enabled
                    ? "hover:bg-white/5 focus:outline-none"
                    : "cursor-not-allowed opacity-30"
                }`}
                style={{
                  top: gate.zone.top,
                  left: gate.zone.left,
                  width: gate.zone.width,
                  height: gate.zone.height,
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                }}
              />
            ))}
          </div>
        </div>

        {/* RETURN GLYPH */}
        <div className="absolute bottom-6 right-6 z-40">
          <MeasuresReturnGlyph to="/measures" ariaLabel="Return to Temple" />
        </div>
      </div>
    </section>
  );
}
