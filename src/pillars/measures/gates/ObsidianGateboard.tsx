import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import MeasuresReturnGlyph from "@/pillars/measures/components/MeasuresReturnGlyph";
import { MEASURES_ASSETS } from "@/pillars/measures/measuresAssets";

const W = 4096;
const H = 2730;

function pct(n: number, denom: number) {
  return `${(n / denom) * 100}%`;
}

type Hotspot = {
  slug: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

const HOTSPOTS: Hotspot[] = [
  { slug: "gate-0", label: "Queen of Heaven", x: 1468, y: 388, w: 536, h: 416 },
  { slug: "gate-i", label: "Gate I — The Crown", x: 846, y: 880, w: 612, h: 376 },
  { slug: "gate-ii", label: "Gate II — Beads of Lapis", x: 676, y: 1134, w: 640, h: 408 },
  { slug: "gate-iii", label: "Gate III — Lapis Necklace", x: 828, y: 1508, w: 808, h: 438 },
  { slug: "gate-iv", label: "Gate IV — Breastplate", x: 2680, y: 746, w: 750, h: 428 },
  { slug: "gate-v", label: "Gate V — Golden Bracelet", x: 2706, y: 1138, w: 800, h: 412 },
  { slug: "gate-vi", label: "Gate VI — Measuring Rod", x: 2502, y: 1498, w: 814, h: 430 },
  { slug: "gate-vii", label: "Gate VII — Royal Garment", x: 2298, y: 1910, w: 776, h: 454 },
];

const GATE_ORDER: Record<string, number> = {
  "gate-0": 0,
  "gate-i": 1,
  "gate-ii": 2,
  "gate-iii": 3,
  "gate-iv": 4,
  "gate-v": 5,
  "gate-vi": 6,
  "gate-vii": 7,
};

export default function ObsidianGateboard() {
  const nav = useNavigate();

  const [currentGate, setCurrentGate] = useState<number>(0);
  const [loading, setLoading] = useState(true);

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

      setLoading(false);
    }

    loadPhase();
  }, []);

  if (loading) {
    return <div style={{ padding: 40 }}>Loading Gates…</div>;
  }

  return (
    <div className="obsidian-gateboard">

      <MeasuresReturnGlyph />

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <img
          src={MEASURES_ASSETS.ObsidianGateboard.still}
          style={{ width: "100%", display: "block" }}
        />

        {HOTSPOTS.map((h) => {
          const gateIndex = GATE_ORDER[h.slug];
          const unlocked = gateIndex <= currentGate;

          return (
            <button
              key={h.slug}
              onClick={() => unlocked && nav(`/measures/${h.slug}`)}
              title={unlocked ? h.label : "Gate sealed"}
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
    </div>
  );
}