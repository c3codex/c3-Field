// src/pillars/model/HeroModel.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import "@/styles/heroModel.css";


type Phase =
  | "playing"
  | "settling"
  | "title"
  | "subtitle"
  | "words"
  | "rest";

export default function HeroModel() {
  const nav = useNavigate();
  const vref = useRef<HTMLVideoElement | null>(null);

  const [phase, setPhase] = useState<Phase>("playing");
  const [showPoster, setShowPoster] = useState(false);
  const [videoFadeOut, setVideoFadeOut] = useState(false);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);

  // Resolve media from Supabase
  useEffect(() => {
    const bucket = "Measures-open";

    const video = supabase.storage
      .from(bucket)
      .getPublicUrl("c3model_hero.mp4").data.publicUrl;

    const poster = supabase.storage
      .from(bucket)
      .getPublicUrl("c3model_hero.webp").data.publicUrl;

    setVideoUrl(video);
    setPosterUrl(poster);
  }, []);

  // Simple timeline
  useEffect(() => {
    const t0 = setTimeout(() => {
      setShowPoster(true);
      setPhase("settling");

      setTimeout(() => setVideoFadeOut(true), 60);

      setTimeout(() => {
        const v = vref.current;
        if (v) v.pause();

        setPhase("title");

        setTimeout(() => {
          setPhase("subtitle");

          setTimeout(() => {
            setPhase("words");
          }, 400);
        }, 300);
      }, 520);
    }, 6000);

    return () => clearTimeout(t0);
  }, []);

  const showPanel = phase !== "playing" && phase !== "settling";
  const showWords = phase === "words" || phase === "rest";

  const onEnterField = () => {
    nav("/model/connect");
  };

  return (
    <main style={S.page}>
      {/* Media Layer */}
      <div style={S.mediaWrap}>
        {showPoster && posterUrl && (
          <img src={posterUrl} alt="" style={S.poster} />
        )}

        {videoUrl && (
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
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}

        <div style={S.veil} />
      </div>

      {/* Header + Intro */}
      <section style={S.content}>
        <h1 style={S.heading}>Architecture, Not Metaphor.</h1>
        <h2 style={S.subheading}>The c3 Model</h2>

        <p style={S.paragraph}>
          The c3 Model governs how this system moves.
        </p>

        <p style={S.paragraph}>
          Connect establishes coherence before action.
          Contribute redistributes value without extraction.
          Create manifests aligned form.
        </p>

        <p style={S.paragraph}>
          Together, these movements create a self-sustaining circuit of participation.
          Every project, artifact, and governance layer within c3 Community Partners
          is structured through this architecture.
        </p>

        <button style={S.cta} onClick={onEnterField}>
          Enter the c3 Field →
        </button>
      </section>
    </main>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: {
    position: "relative",
    minHeight: "100vh",
    background: "#050608",
    color: "rgba(236,236,236,0.92)",
    overflow: "hidden",
  },
  mediaWrap: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
  },
  video: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "80vh",
    objectFit: "cover",
  },
  poster: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "80vh",
    objectFit: "cover",
  },
  veil: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.15) 40%, rgba(5,6,8,0.95) 90%)",
  },
  content: {
    position: "relative",
    zIndex: 1,
    padding: "70vh 28px 80px",
    maxWidth: 760,
    margin: "0 auto",
  },
  heading: {
    fontSize: 28,
    letterSpacing: 0.8,
    color: "rgba(246,214,140,0.92)",
    marginBottom: 6,
  },
  subheading: {
    fontSize: 16,
    letterSpacing: 0.5,
    color: "rgba(230,230,230,0.74)",
    marginBottom: 24,
  },
  paragraph: {
    fontSize: 14.5,
    lineHeight: 1.6,
    marginBottom: 16,
    color: "rgba(230,230,230,0.78)",
  },
  cta: {
    marginTop: 24,
    borderRadius: 16,
    padding: "12px 18px",
    background: "rgba(246,214,140,0.12)",
    border: "1px solid rgba(246,214,140,0.30)",
    color: "rgba(246,214,140,0.98)",
    cursor: "pointer",
  },
};