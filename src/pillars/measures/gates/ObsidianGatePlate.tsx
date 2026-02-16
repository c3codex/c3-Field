// src/pillars/measures/gates/ObsidianGatePlate.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MEASURES_ASSETS } from "@/pillars/measures/measuresAssets";
import MeasuresReturnGlyph from "@/pillars/measures/components/MeasuresReturnGlyph";

// AspectEdgeLayer removed - using only 3 cuneiform constraint markers

import { useMeasuresAudioBus } from "@/pillars/measures/audio/MeasuresAudioBusProvider";

const AUTO_STATIC_AFTER_MS = 5200; // video -> begin fade
const FADE_MS = 900; // crossfade duration
const ENCOUNTER_PAUSE_MS = 900; // beat before plaques open
const PLAQUE_OPEN_DELAY_MS = AUTO_STATIC_AFTER_MS + ENCOUNTER_PAUSE_MS;

// Chamber timing after plaque closes
const ART_YIELD_MS = 600;
const CHAMBER_OPEN_DELAY_MS = 220; // small beat after art begins yielding

// Gate 0 Cuneiform Keys (constraint marks, not decoration)
type CuneiformKey = {
  gate: string;
  glyph: string;
  label: string;
  principle: string;
  displayOrder: number;
  source: string;
  visibility: "plate-only" | "gallery-item" | "book-only";
};

const GATE_0_CUNEIFORM: readonly CuneiformKey[] = [
  {
    gate: "gate0",
    glyph: "𒀭",
    label: "Sovereign Presence",
    principle: "Station requires no witness.",
    displayOrder: 1,
    source: "Measures of Inanna / Obsidian Gate Plate",
    visibility: "plate-only",
  },
  {
    gate: "gate0",
    glyph: "𒄑",
    label: "The Eye",
    principle: "Only you are watching.",
    displayOrder: 2,
    source: "Measures of Inanna / Obsidian Gate Plate",
    visibility: "plate-only",
  },
  {
    gate: "gate0",
    glyph: "𒂵",
    label: "Edge",
    principle: "Solitude is a boundary you choose.",
    displayOrder: 3,
    source: "Measures of Inanna / Obsidian Gate Plate",
    visibility: "plate-only",
  },
] as const;

// Gate 0 Scroll (dissolved formatting)
const SOLITUDE_SCROLL = `Solitude's hidden gifts are the quiet treasures that only reveal themselves when the noise falls away and there's no one left to perform for.

In the absence of other voices, advice, expectations, comparisons, your own thoughts finally get room to finish their sentences. You hear what you actually think, not the echo of what you think you should think. Decisions that felt tangled untie themselves; truths you half-knew step fully into the light.

No one else's tempo to match. You eat when you're hungry, sleep when you're tired, create when the impulse arrives instead of when the calendar says it's convenient. The body and nervous system remember their native cadence. The tone that has been humming in the background gets space to become song instead of signal.

The mirror has no audience. Joy doesn't need validation, grief doesn't need explanation, boredom doesn't need distraction. You meet the parts of you that are inconvenient, tender, ridiculous, luminous, and there's no one to apologize to or impress. That meeting, though sometimes brutal, is the beginning of real compassion.

Intuition speaks in whispers and images; it rarely shouts over conversation or scrolling. Solitude turns down the volume of the external world so those faint signals can grow audible. You start to feel the difference between fear and genuine knowing, between restlessness and true direction.

No one is watching the draft. You can sit with a question for days, weeks, years without having to deliver an answer. The pressure to appear complete dissolves, and something more honest, more alive, emerges in its place.

When there's no one to talk to, you stop rehearsing what you'll say next and simply are. The rain on the window, the ache in the gum, the texture of breath in the chest, they all become vivid again. Solitude trains attention the way silence trains listening.

Not because you accomplished something, not because someone witnessed it, but because you stayed. You remained company for yourself when it would have been easier to flee into distraction or demand rescue. That staying is the gift that keeps giving: the knowledge that you can be your own shelter, your own witness, your own soft landing.

These gifts aren't always comfortable. Some arrive wrapped in loneliness, restlessness, even grief. But they are gifts nonetheless, delivered without fanfare, addressed only to you.

And when you finally laugh out loud at your own absurdity in the empty room, that's one of the sweetest ones: the realization that solitude didn't abandon you, it trusted you to keep your own company.`;

export default function ObsidianGatePlate() {
  const nav = useNavigate();
  const { gateId } = useParams<{ gateId?: string }>();

  const bus = useMeasuresAudioBus();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [mediaMode, setMediaMode] = useState<"animated" | "still">("animated");
  const [showStill, setShowStill] = useState(false);
  const [videoFading, setVideoFading] = useState(false);

  const [plaqueOpen, setPlaqueOpen] = useState(false);
  const [plaqueMinimized, setPlaqueMinimized] = useState(false);

  // Chamber choreography
  const [artYield, setArtYield] = useState(false);
  const [chamberOpen, setChamberOpen] = useState(false);

  // Cuneiform tooltip hover state
  const [glyphHover, setGlyphHover] = useState<number | null>(null);

  // Plate selection
  const plate = MEASURES_ASSETS.kumurrah.plates.gate0;

  // Continue route
  const continueTo = "/measures/gates/gate1";

  // --- AUDIO: keep obsidian bed active through plates, duck during plaque ---
  useEffect(() => {
    bus.setObsidianActive(true);
    return () => {
      bus.restore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (plaqueOpen && !plaqueMinimized) bus.duck();
    else bus.restore();
  }, [plaqueOpen, plaqueMinimized, bus]);

  // --- media timing: video -> still, then plaque opens ---
  useEffect(() => {
    const v = videoRef.current;
    if (v) v.playbackRate = 0.85;

    const t1 = window.setTimeout(() => {
      setShowStill(true);
      setVideoFading(true);

      window.setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
        setMediaMode("still");
      }, FADE_MS);
    }, AUTO_STATIC_AFTER_MS);

    const t2 = window.setTimeout(() => {
      setPlaqueOpen(true);
      setPlaqueMinimized(false);
      requestAnimationFrame(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      });
    }, PLAQUE_OPEN_DELAY_MS);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  // --- HINGE: when plaque is minimized, art yields and chamber opens ---
  useEffect(() => {
    if (!plaqueOpen) return;

    if (plaqueMinimized) {
      setArtYield(true);

      const t = window.setTimeout(() => {
        setChamberOpen(true);
      }, CHAMBER_OPEN_DELAY_MS);

      return () => window.clearTimeout(t);
    } else {
      // If plaque re-opened, chamber retreats and art returns
      setChamberOpen(false);
      setArtYield(false);
    }
  }, [plaqueMinimized, plaqueOpen]);

  const showContinueOnMedia = plaqueOpen && plaqueMinimized;

  const scrollParagraphs = useMemo(() => {
    return SOLITUDE_SCROLL.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  }, []);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-black">
      {/* CHAMBER DIM (only when chamber open) */}
      {chamberOpen ? (
        <div className="absolute inset-0 z-20 pointer-events-none bg-black/30" />
      ) : null}

      {/* MEDIA STACK */}
      <div className="absolute inset-0">
        {/* Background fill */}
        <img
          src={plate.still}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover select-none"
          style={{
            filter: "blur(18px) saturate(1.05)",
            transform: "scale(1.06)",
            opacity: 0.35,
          }}
        />
        <div className="absolute inset-0 bg-black/35" />

        {/* Foreground frame */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Still under video */}
          <img
            src={plate.still}
            alt="Obsidian Gate Plate"
            draggable={false}
            className="h-full w-full object-contain select-none"
            style={{
              opacity: showStill || mediaMode === "still" ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease`,
            }}
          />

          {/* Video above still */}
          {mediaMode === "animated" && (
            <video
              ref={videoRef}
              src={plate.animated}
              autoPlay
              muted
              playsInline
              preload="auto"
              poster={plate.still}
              className="absolute inset-0 h-full w-full object-contain"
              style={{
                opacity: videoFading ? 0 : 1,
                transition: `opacity ${FADE_MS}ms ease`,
              }}
            />
          )}
        </div>

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.78) 100%)",
          }}
        />
      </div>

      {/* CUNEIFORM KEYS (left vertical stack - appear with chamber) */}
      {chamberOpen && (
        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-8">
          {GATE_0_CUNEIFORM.map((key) => (
            <div
              key={key.displayOrder}
              className="relative"
              onMouseEnter={() => setGlyphHover(key.displayOrder)}
              onMouseLeave={() => setGlyphHover(null)}
            >
              <div
                className="text-[26px] leading-none text-stone-100/75 transition-opacity duration-300 cursor-help"
                style={{
                  fontFamily: "serif",
                  textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                }}
              >
                {key.glyph}
              </div>

              {/* Tooltip */}
              {glyphHover === key.displayOrder && (
                <div
                  className="absolute left-12 top-1/2 -translate-y-1/2 
                             w-64 rounded-lg border border-white/10 
                             bg-black/80 backdrop-blur-md px-4 py-3
                             pointer-events-none"
                  style={{
                    animation: "fadeIn 200ms ease-out",
                  }}
                >
                  <div className="text-xs font-sans tracking-wider uppercase text-stone-300/70">
                    {key.label}
                  </div>
                  <div className="mt-1.5 text-sm leading-relaxed text-stone-100/90">
                    {key.principle}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* RETURN GLYPH */}
      <div className="absolute top-5 right-5 z-50">
        <MeasuresReturnGlyph to="/measures" ariaLabel="Return to Temple" />
      </div>

      {/* MEDIA CONTROLS */}
      <div className="absolute bottom-6 left-6 z-50 flex items-center gap-3">
        {!plaqueOpen || plaqueMinimized ? (
          <button
            type="button"
            onClick={() => {
              setPlaqueOpen(true);
              setPlaqueMinimized(false);
              requestAnimationFrame(() => {
                if (scrollRef.current) scrollRef.current.scrollTop = 0;
              });
            }}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm text-stone-100 backdrop-blur hover:bg-white/15 transition"
          >
            Open Text
          </button>
        ) : null}

        {showContinueOnMedia ? (
          <button
            type="button"
            onClick={() => nav(continueTo)}
            className="rounded-xl bg-white/15 px-4 py-2 text-sm text-stone-100 backdrop-blur hover:bg-white/20 transition"
          >
            Continue Descent
          </button>
        ) : null}
      </div>

      {/* PLAQUE OVERLAY (historical layer - museum label aesthetic) */}
      {plaqueOpen && !plaqueMinimized && (
        <div className="absolute inset-x-0 bottom-8 z-40 px-4 pointer-events-none">
          <div
            className="
              pointer-events-auto
              mx-auto
              w-full
              max-w-2xl
              rounded-2xl
              border border-white/10
              bg-black/28
              backdrop-blur-lg
              shadow-[0_16px_60px_rgba(0,0,0,0.45)]
              overflow-hidden
            "
          >
            {/* plaque header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
              <div className="text-[10px] uppercase tracking-[0.3em] text-stone-200/80 font-sans">
                Queen of Heaven
              </div>

              <button
                type="button"
                onClick={() => setPlaqueMinimized(true)}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-[11px] text-stone-100 hover:bg-white/15 transition"
              >
                Close Text
              </button>
            </div>

            {/* scroll body (tighter, informational) */}
            <div
              ref={scrollRef}
              className="px-5 py-4 text-stone-100/85 overflow-y-auto"
              style={{ maxHeight: "42svh" }}
            >
              <div className="space-y-3 text-center leading-[1.65] text-[15px]">
                <p>
                  With the <em>me</em> in her possession, she prepared herself:
                </p>

                <p>
                  She placed the <strong>shugurra</strong>, the crown of the steppe, on her head.
                  <br />
                  She arranged the dark locks of hair across her forehead.
                  <br />
                  She tied the small lapis beads around her neck.
                </p>

                <p>
                  Let the double strand of beads fall to her breast,
                  <br />
                  And wrapped the royal robe around her body.
                </p>

                <p>
                  She daubed her eyes with ointment called
                  <br />
                  <em>"let him come, let him come."</em>
                </p>

                <p>
                  Bound the breast plate called
                  <br />
                  <em>"Come, man, come!"</em>
                  <br />
                  around her chest,
                </p>

                <p>
                  Slipped the gold ring over her wrist,
                  <br />
                  And took the lapis measuring rod and line in her hand.
                </p>

                <p className="pt-1">Inanna set out for the underworld.</p>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => nav(continueTo)}
                    className="w-full rounded-xl bg-white/12 px-4 py-2.5 text-sm text-stone-100 hover:bg-white/18 transition"
                  >
                    Continue Descent
                  </button>
                </div>
              </div>
            </div>

            <div className="h-1.5 bg-gradient-to-b from-white/5 to-transparent" />
          </div>
        </div>
      )}

      {/* CHAMBER SCROLL (condition layer - warmer, slower, architectural) */}
      {chamberOpen ? (
        <div className="absolute inset-0 z-30 pointer-events-none">
          <div className="absolute inset-0 flex items-start justify-center px-6">
            <div
              className="pointer-events-auto w-full max-w-[640px]"
              style={{ paddingTop: "8rem" }}
            >
              <div
                className="mx-auto mb-8 rounded-2xl border border-white/8 bg-black/20 backdrop-blur-xl"
                style={{
                  opacity: artYield ? 1 : 0,
                  transition: `opacity ${ART_YIELD_MS}ms ease`,
                }}
              >
                <div className="px-6 py-7 text-center">
                  <div className="font-sans text-[9px] tracking-[0.4em] uppercase text-stone-200/50">
                    aspect of the queen
                  </div>
                  <div className="mt-3 font-serif text-[32px] leading-[1.15] text-stone-50">
                    Solitude as Sovereignty
                  </div>
                  <div className="mt-3 font-sans text-[15px] leading-relaxed text-stone-200/65">
                    What returns when there is no one left to perform for.
                  </div>
                </div>

                {/* Axis line (architectural vertical center) */}
                <div className="relative">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  />
                  <div className="px-8 pb-9 pt-4">
                    <div
                      className="mx-auto max-w-[560px] text-[18px] leading-[2.0] font-serif"
                      style={{ color: "rgba(250,246,240,0.88)" }}
                    >
                      {scrollParagraphs.map((p, i) => (
                        <p key={i} className="mb-6">
                          {p}
                        </p>
                      ))}
                      {/* breathing space */}
                      <div style={{ height: "8rem" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Close chamber control */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setChamberOpen(false);
                    setArtYield(false);
                  }}
                  className="rounded-full border border-white/8 bg-black/15 px-5 py-2.5
                             font-sans text-[9px] tracking-[0.4em] uppercase text-stone-200/60
                             backdrop-blur transition hover:border-white/15 hover:text-stone-100/80"
                >
                  Close Chamber
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-4px) translateY(-50%); }
          to { opacity: 1; transform: translateX(0) translateY(-50%); }
        }
      `}</style>
    </section>
  );
}
