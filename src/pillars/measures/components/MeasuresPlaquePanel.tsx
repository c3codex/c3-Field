// src/pillars/measures/components/MeasuresPlaquePanel.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";

export type PanelMode = "closed" | "peek" | "open";

type Props = {
  mode: PanelMode;
  setMode: (m: PanelMode) => void;

  title?: string;
  whisper?: string;

  encounterPhase?: "arrive" | "settle" | "pause" | "ready"; // optional, for auto-peek

  encounterPauseMs?: number;
  plaqueStaggerMs?: number;

  plaques: React.ReactNode[]; // each entry is one plaque
  actions?: React.ReactNode;

  maxWidthClass?: string; // default matches your exhibition
  peekMaxHClass?: string;
  openMaxHClass?: string;
};

type Step = 0 | 1 | 2 | 3 | 4 | 5; // supports up to 5 plaques (easy extension)

const DEFAULT_ENCOUNTER_PAUSE_MS = 2000;
const DEFAULT_PLAQUE_STAGGER_MS = 1400;

export function MeasuresPlaquePanel({
  mode,
  setMode,

  title = "Text Panel",
  whisper = "entering…",

  encounterPhase,
  encounterPauseMs = DEFAULT_ENCOUNTER_PAUSE_MS,
  plaqueStaggerMs = DEFAULT_PLAQUE_STAGGER_MS,

  plaques,
  actions,

  maxWidthClass = "max-w-[820px]",
  peekMaxHClass = "max-h-[42svh]",
  openMaxHClass = "max-h-[74svh]",
}: Props) {
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const [step, setStep] = useState<Step>(0);
  const [readyActions, setReadyActions] = useState(false);

  const timersRef = useRef<number[]>([]);
  const collapseBtnRef = useRef<HTMLButtonElement | null>(null);

  const clearTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  };

  const startStagger = () => {
    clearTimers();
    setStep(0);
    setReadyActions(false);

    if (prefersReducedMotion) {
      setStep(Math.min(plaques.length, 5) as Step);
      setReadyActions(true);
      return;
    }

    // reveal plaques 1..N staggered
    setStep(1);
    for (let i = 2; i <= Math.min(plaques.length, 5); i++) {
      timersRef.current.push(window.setTimeout(() => setStep(i as Step), plaqueStaggerMs * (i - 1)));
    }
    timersRef.current.push(
      window.setTimeout(() => setReadyActions(true), plaqueStaggerMs * Math.max(0, Math.min(plaques.length, 5) - 1) + 520)
    );
  };

  // auto-peek after encounter ready
  useEffect(() => {
    if (!encounterPhase) return;
    if (encounterPhase !== "ready") return;

    // allow a small pause before peeking
    const t = window.setTimeout(() => {
      setMode("peek");
      startStagger();
    }, encounterPauseMs);

    return () => {
      window.clearTimeout(t);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encounterPhase]);

  // ESC collapses
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMode("closed");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setMode]);

  // focus collapse in open mode
  useEffect(() => {
    if (mode === "open") {
      const t = window.setTimeout(() => collapseBtnRef.current?.focus(), 30);
      return () => window.clearTimeout(t);
    }
  }, [mode]);

  const panelMaxH =
    mode === "peek" ? peekMaxHClass : mode === "open" ? openMaxHClass : "max-h-0";

  const panelOpacity =
    mode === "closed" ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto";

  const panelMotion =
    prefersReducedMotion
      ? ""
      : mode === "closed"
      ? "measures-stage measures-stage-enter"
      : "measures-stage measures-stage-entered";

  return (
    <>
      {/* Expand button (only when closed) */}
      {mode === "closed" && (
        <div className="absolute inset-x-0 bottom-7 z-40 flex justify-center px-6">
          <button
            type="button"
            onClick={() => {
              setMode("open");
              startStagger();
            }}
            aria-label={`Expand ${title}`}
            className="min-h-[44px] rounded-full border border-white/14 bg-black/35 px-6 py-3
                       font-sans text-[10px] tracking-[0.35em] uppercase text-stone-200/85
                       backdrop-blur-sm transition hover:border-white/28 hover:text-stone-100"
          >
            expand text
          </button>
        </div>
      )}

      {/* Whisper while waiting */}
      {mode === "closed" && (
        <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-30 text-center">
          <span className="font-sans text-[11px] tracking-[0.32em] uppercase text-stone-200/40">
            {whisper}
          </span>
        </div>
      )}

      {/* PANEL */}
      <div className={`absolute inset-0 z-30 ${panelOpacity}`}>
        <div className={`mx-auto w-full ${maxWidthClass} px-6 pt-[88px] md:px-10 md:pt-[92px]`}>
          <div
            className={[
              "relative",
              panelMotion,
              panelMaxH,
              "overflow-hidden transition-[max-height,opacity] duration-700",
              "rounded-2xl border border-white/10 bg-black/42 shadow-[0_0_60px_rgba(0,0,0,0.55)]",
              "backdrop-blur-sm",
            ].join(" ")}
            role="region"
            aria-label={title}
          >
            {mode !== "closed" && (
              <button
                ref={collapseBtnRef}
                type="button"
                onClick={() => setMode("closed")}
                aria-label="Collapse text"
                className="absolute right-4 top-4 z-50 min-h-[44px] rounded-full
                           border border-white/25 bg-black/45 px-5 py-2
                           font-sans text-[10px] tracking-[0.35em] uppercase text-stone-100
                           backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.6)]
                           transition hover:border-white/40"
              >
                collapse
              </button>
            )}

            {/* Body */}
            <div className="max-h-[70svh] overflow-y-auto px-6 pb-8 pt-6 md:px-10 md:pb-10 md:pt-8">
              <div className="space-y-8">
                {plaques.slice(0, 5).map((node, i) => (
                  <div
                    key={i}
                    className={`transition-opacity duration-700 ${step >= i + 1 ? "opacity-100" : "opacity-0"}`}
                  >
                    {node}
                  </div>
                ))}

                {actions ? (
                  <div className={`transition-opacity duration-700 ${readyActions ? "opacity-100" : "opacity-0"}`}>
                    {actions}
                  </div>
                ) : null}

                <div className="h-6" />
              </div>
            </div>

            {/* Expand control for peek mode */}
            {mode === "peek" && (
              <div className="border-t border-white/10 px-6 py-4 md:px-10">
                <button
                  type="button"
                  onClick={() => setMode("open")}
                  className="min-h-[44px] w-full rounded-full border border-white/14 bg-black/30 px-6 py-3
                             font-sans text-[10px] tracking-[0.35em] uppercase text-stone-200/80
                             transition hover:border-white/28 hover:text-stone-100"
                >
                  expand
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}