// src/components/layout/HeroModel.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/heroModel.css";

import { SyndrosReturnGlyph } from "@/components/ui/SyndrosReturnGlyph";

type HeroMedia = {
  video: string;
  poster: string;
  settleMs?: number;
};

type Phase =
  | "playing" // hero animation
  | "settling" // crossfade to poster
  | "inhale" // slight noticeable inhale pause
  | "title"
  | "subtitle"
  | "holdAfterSubtitle"
  | "words"
  | "holdAfterWords"
  | "rest";

export default function HeroModel({ heroMedia }: { heroMedia: HeroMedia }) {
  const nav = useNavigate();
  const vref = useRef<HTMLVideoElement | null>(null);

  const settleMs = heroMedia.settleMs ?? 6000;

  const [phase, setPhase] = useState<Phase>("playing");
  const [showPoster, setShowPoster] = useState(false);
  const [videoFadeOut, setVideoFadeOut] = useState(false);

  const [hovered, setHovered] = useState<null | "connect" | "contribute" | "create">(null);
  const [pulse, setPulse] = useState(false);

  // Timeline:
  // video (6s) -> crossfade (520ms) -> inhale (520ms) -> title -> subtitle -> HOLD -> words -> HOLD -> rest
  useEffect(() => {
    const t0 = window.setTimeout(() => {
      setShowPoster(true);
      setPhase("settling");

      // begin fade out shortly after poster mounts
      const tfade = window.setTimeout(() => setVideoFadeOut(true), 60);

      // finish settle
      const t1 = window.setTimeout(() => {
        const v = vref.current;
        if (v) {
      
        v.pause();

        }
        setPhase("inhale");

        const t2 = window.setTimeout(() => {
          setPhase("title");

          const t3 = window.setTimeout(() => {
            setPhase("subtitle");

            // longer pause after governance circuit
            const tHold1 = window.setTimeout(() => {
              setPhase("holdAfterSubtitle");

              const t4 = window.setTimeout(() => {
                setPhase("words");

                // longer pause after connect row appears (before full “rest” interaction)
                const tHold2 = window.setTimeout(() => {
                  setPhase("holdAfterWords");

                  const t5 = window.setTimeout(() => {
                    setPhase("rest");
                  }, 260);

                  return () => window.clearTimeout(t5);
                }, 700);

                return () => window.clearTimeout(tHold2);
              }, 420);

              return () => window.clearTimeout(t4);
            }, 850);

            return () => window.clearTimeout(tHold1);
          }, 320);

          return () => window.clearTimeout(t3);
        }, 520);

        return () => window.clearTimeout(t2);
      }, 520);

      return () => {
        window.clearTimeout(tfade);
        window.clearTimeout(t1);
      };
    }, settleMs);

    return () => window.clearTimeout(t0);
  }, [settleMs]);

  const showPanel = phase !== "playing" && phase !== "settling" && phase !== "inhale";
  const showTitle = showPanel;
  const showSubtitle = phase !== "title" && showPanel;
  const showWords = phase === "words" || phase === "holdAfterWords" || phase === "rest";

  // Allow hover/click only once the words are visible (and after the brief hold feels better)
  const canInteract = phase === "holdAfterWords" || phase === "rest";

  const connectBright = useMemo(() => {
    if (hovered === "contribute" || hovered === "create") return true;
    // Connect stays slightly brighter once the model is named
    return showPanel;
  }, [hovered, showPanel]);

  const onClickConnect = () => {
    if (!canInteract) return;
    setPulse(true);
    window.setTimeout(() => nav("/model/connect"), 900);
  };

  // Syndros component may render a label; pass common “hide label” props safely.
  const SyndrosAny = SyndrosReturnGlyph ;

  return (
    <main style={S.page}>
      {/* Obsidian field */}
      <div style={S.field} aria-hidden="true">
        <div style={S.obsidianBase} />
        <div style={S.obsidianMicro} />
        <div style={S.heldChargeWarm} />
        {pulse ? <div style={S.pulse} /> : null}
      </div>

      {/* Media layer */}
      <div style={S.mediaWrap} aria-hidden="true">
        {showPoster ? <img src={heroMedia.poster} alt="" style={S.poster} /> : null}

        <video
          ref={vref}
          autoPlay
          muted
          playsInline
          preload="auto"
          style={{
            ...S.video,
            opacity: videoFadeOut ? 0 : 1,
            transition: "opacity 520ms ease",
          }}
        >
          <source src={heroMedia.video} type="video/mp4" />
        </video>

        <div style={S.veil} />
      </div>

      {/* Content layer */}
      <section style={S.center}>
        {/* PANEL: only mounts after hero (prevents blocking animation) */}
        {showPanel ? (
          <div style={S.panel}>
            <div
              style={{
                ...S.title,
                opacity: showTitle ? 1 : 0,
                transform: showTitle ? "translateY(0px)" : "translateY(6px)",
              }}
            >
              The c3 Model
            </div>

            <div
              style={{
                ...S.subtitle,
                opacity: showSubtitle ? 1 : 0,
                transform: showSubtitle ? "translateY(0px)" : "translateY(6px)",
              }}
            >
              A self-sustaining governance circuit.
            </div>

            <div
              style={{
                ...S.wordsRow,
                opacity: showWords ? 1 : 0,
                transform: showWords ? "translateY(0px)" : "translateY(8px)",
                pointerEvents: showWords ? "auto" : "none",
              }}
            >
              <button
                type="button"
                onClick={onClickConnect}
                onMouseEnter={() => canInteract && setHovered("connect")}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => canInteract && setHovered("connect")}
                onBlur={() => setHovered(null)}
                style={{
                  ...S.connectBtn,
                  color: connectBright ? "rgba(246, 214, 140, 0.98)" : "rgba(235,235,235,0.82)",
                  borderColor: connectBright ? "rgba(246, 214, 140, 0.30)" : "rgba(255,255,255,0.14)",
                  boxShadow: connectBright
                    ? "0 0 0 1px rgba(246, 214, 140, 0.10) inset, 0 18px 46px rgba(0,0,0,0.45)"
                    : "0 18px 46px rgba(0,0,0,0.40)",
                  transform: connectBright ? "translateY(-1px)" : "translateY(0px)",
                }}
              >
                Connect
              </button>

              <span
                onMouseEnter={() => canInteract && setHovered("contribute")}
                onMouseLeave={() => setHovered(null)}
                style={S.ghostWord}
              >
                Contribute
              </span>

              <span
                onMouseEnter={() => canInteract && setHovered("create")}
                onMouseLeave={() => setHovered(null)}
                style={S.ghostWord}
              >
                Create
              </span>
            </div>

            <div style={S.micro}>The field holds. Depth is chosen.</div>
          </div>
        ) : null}
      </section>

      {/* Syndros return (glyph only) */}
      <div className="heroModel-syndrosWrap" style={S.syndrosWrap}>

      </div>
    </main>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: {
    position: "relative",
    minHeight: "100vh",
    background: "#050608",
    overflow: "hidden",
    color: "rgba(236,236,236,0.92)",
  },

  field: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
  },

  obsidianBase: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(1200px 900px at 50% 35%, rgba(18,20,24,0.70), rgba(5,6,8,0.98))",
  },

  obsidianMicro: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(900px 520px at 55% 55%, rgba(255,255,255,0.035), rgba(0,0,0,0) 60%)",
    mixBlendMode: "overlay",
    opacity: 0.55,
    animation: "obsidianMicroDrift 14s ease-in-out infinite",
  },

  heldChargeWarm: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(840px 520px at 50% 58%, rgba(246, 214, 140, 0.085), rgba(246, 214, 140, 0.00) 68%)",
    mixBlendMode: "screen",
    opacity: 0.8,
  },

  pulse: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(520px 520px at 50% 60%, rgba(246, 214, 140, 0.18), rgba(246, 214, 140, 0.00) 72%)",
    opacity: 0,
    animation: "c3Pulse 0.9s ease-out 1",
    mixBlendMode: "screen",
  },

  mediaWrap: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    pointerEvents: "none",
  },

  video: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transform: "scale(1.01)",
  },

  poster: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transform: "scale(1.01)",
    opacity: 1,
  },

  veil: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(72% 58% at 50% 42%, rgba(0,0,0,0.18), rgba(0,0,0,0.56) 70%, rgba(0,0,0,0.84))",
  },

  center: {
    position: "relative",
    zIndex: 2,
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "28px",
  },

  panel: {
  width: "min(620px, 90vw)",
  borderRadius: 16,
  padding: "14px 16px 10px",
  background: "rgba(0,0,0,0.24)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(8px)",
  display: "grid",
  justifyItems: "center",
  gap: 8,
},


  title: {
    fontSize: 26,
    letterSpacing: 0.8,
    color: "rgba(246, 214, 140, 0.92)",
    textShadow: "0 10px 38px rgba(0,0,0,0.75)",
    transition: "opacity 420ms ease, transform 420ms ease",
  },

  subtitle: {
    fontSize: 13.5,
    letterSpacing: 0.45,
    color: "rgba(230,230,230,0.74)",
    textShadow: "0 10px 38px rgba(0,0,0,0.75)",
    transition: "opacity 420ms ease, transform 420ms ease",
    marginBottom: 6,
  },

  wordsRow: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    transition: "opacity 520ms ease, transform 520ms ease",
    paddingTop: 4,
  },

  connectBtn: {
    borderRadius: 14,
    padding: "10px 14px",
    background: "rgba(0,0,0,0.22)",
    border: "1px solid rgba(255,255,255,0.14)",
    cursor: "pointer",
    fontSize: 14.5,
    letterSpacing: 0.55,
    transition:
      "color 180ms ease, border-color 180ms ease, box-shadow 220ms ease, transform 180ms ease",
    textShadow: "0 10px 38px rgba(0,0,0,0.75)",
  },

  ghostWord: {
    borderRadius: 14,
    padding: "10px 14px",
    background: "rgba(0,0,0,0.12)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(235,235,235,0.62)",
    fontSize: 14.5,
    letterSpacing: 0.55,
    userSelect: "none",
    textShadow: "0 10px 38px rgba(0,0,0,0.75)",
  },

  micro: {
    marginTop: 6,
    fontSize: 12,
    color: "rgba(235,235,235,0.62)",
    textShadow: "0 10px 38px rgba(0,0,0,0.75)",
    textAlign: "center",
  },

  syndrosWrap: {
    position: "absolute",
    right: 22,
    bottom: 22,
    zIndex: 3,
    opacity: 0.7,
  },
};
