// src/pillars/measures/gates/ObsidianGateboard.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import MeasuresReturnGlyph from "@/pillars/measures/components/MeasuresReturnGlyph";
import { useMeasuresMediaUnit } from "../data/hooks/useMeasuresMediaUnit";

const W = 4096;
const H = 2730;

function pct(n: number, denom: number) {
  return `${(n / denom) * 100}%`;
}

type Hotspot = {
  gateNumber: number;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

const HOTSPOTS: Hotspot[] = [
  { gateNumber: 0, label: "Queen of Heaven", x: 1468, y: 388, w: 536, h: 416 },
  { gateNumber: 1, label: "Gate I — The Crown", x: 846, y: 880, w: 612, h: 376 },
  { gateNumber: 2, label: "Gate II — Beads of Lapis", x: 676, y: 1134, w: 640, h: 408 },
  { gateNumber: 3, label: "Gate III — Lapis Necklace", x: 828, y: 1508, w: 808, h: 438 },
  { gateNumber: 4, label: "Gate IV — Breastplate", x: 2680, y: 746, w: 750, h: 428 },
  { gateNumber: 5, label: "Gate V — Golden Bracelet", x: 2706, y: 1138, w: 800, h: 412 },
  { gateNumber: 6, label: "Gate VI — Measuring Rod", x: 2502, y: 1498, w: 814, h: 430 },
  { gateNumber: 7, label: "Gate VII — Royal Garment", x: 2298, y: 1910, w: 776, h: 454 },
];

function getGateSlug(gateNumber: number) {
  return `gate_${gateNumber}`;
}

function getGateRoute(gateNumber: number) {
  const gateSlug = getGateSlug(gateNumber);

  if (gateNumber === 0) {
    return `/measures/gates/${gateSlug}`;
  }

  return `/measures/gates/${gateSlug}/passage`;
}

export default function ObsidianGateboard() {
  const nav = useNavigate();
  const {
    item: media,
    loading: mediaLoading,
    error: mediaError,
  } = useMeasuresMediaUnit("obsidianindex");

  const [currentGate, setCurrentGate] = useState<number>(0);
  const [phaseLoading, setPhaseLoading] = useState(true);

  useEffect(() => {
    async function loadPhase() {
      const { data, error } = await supabase
        .from("measures_current_state")
        .select("current_gate")
        .maybeSingle();

      if (error) {
        console.error("Gate phase error:", error);
      }

      if (data?.current_gate != null) {
        setCurrentGate(data.current_gate);
      }

      setPhaseLoading(false);
    }

    loadPhase();
  }, []);

  if (phaseLoading || mediaLoading) {
    return <div style={{ padding: 40 }}>Loading Gates…</div>;
  }

  const boardSrc =
    media?.still_image_url ??
    media?.epigraph_image_url ??
    media?.hero_image_url ??
    null;

  return (
    <div className="relative min-h-screen bg-black text-stone-100">
      <div className="absolute left-6 top-6 z-40">
        <MeasuresReturnGlyph to="/measures" ariaLabel="Return to Temple" />
      </div>

      {mediaError && (
        <div style={{ padding: 20, color: "#fca5a5" }}>
          Failed to load gateboard media: {mediaError}
        </div>
      )}

      {!boardSrc ? (
        <div style={{ padding: 40 }}>No gateboard image found.</div>
      ) : (
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 1200,
            margin: "0 auto",
            paddingTop: 40,
          }}
        >
          <img
            src={boardSrc}
            alt="Obsidian Gateboard"
            style={{ width: "100%", display: "block" }}
          />

          {HOTSPOTS.map((h) => {
            const unlocked = h.gateNumber <= currentGate;

            return (
              <button
                key={h.gateNumber}
                type="button"
                onClick={() => {
                  if (!unlocked) return;
                  nav(getGateRoute(h.gateNumber));
                }}
                title={unlocked ? h.label : "Gate sealed"}
                aria-label={unlocked ? h.label : `${h.label} sealed`}
                style={{
                  position: "absolute",
                  left: pct(h.x, W),
                  top: pct(h.y, H),
                  width: pct(h.w, W),
                  height: pct(h.h, H),
                  border: unlocked ? "2px solid gold" : "2px solid #444",
                  background: "transparent",
                  cursor: unlocked ? "pointer" : "not-allowed",
                  opacity: unlocked ? 1 : 0.35,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}