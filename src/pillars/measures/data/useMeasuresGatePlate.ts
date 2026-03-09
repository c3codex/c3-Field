import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MEASURES_USE_SUPABASE } from "@/pillars/measures/config/measuresRuntime";
import { MEASURES_ASSETS } from "@/pillars/measures/measuresAssets";

export type MeasuresGatePlateRow = {
  slug: string;
  kind: string;
  pillar: string;

  display_title: string | null;
  display_subtitle: string | null;
  one_liner: string | null;

  gate_numeral: string | null;
  removal_item: string | null;

  plaque_md: string | null;

  gate_released: boolean;
  gate_utc: string | null;

  media_still_url: string | null;
  media_animated_url: string | null;
  media_passage_url: string | null;
};

// --- optional: normalize common variants ---
const NUM_TO_ROMAN: Record<string, string> = {
  "0": "gate-0",
  "1": "gate-i",
  "2": "gate-ii",
  "3": "gate-iii",
  "4": "gate-iv",
  "5": "gate-v",
  "6": "gate-vi",
  "7": "gate-vii",
};

function normalizeGateSlug(s: string) {
  const x = s.trim().toLowerCase();

  // Gate Ø variants
  if (x === "gate0" || x === "gate-ø" || x === "gate-0" || x === "ø" || x === "0") return "gate-0";

  // Roman already (canonical)
  if (/^gate-(i|ii|iii|iv|v|vi|vii)$/.test(x)) return x;
  if (/^(i|ii|iii|iv|v|vi|vii)$/.test(x)) return `gate-${x}`;

  // Numeric aliases: gate1, gate-1, 1, etc. → roman
  const m = x.match(/^gate[-_]?([0-7])$/);
  if (m) return NUM_TO_ROMAN[m[1]];

  if (/^[0-7]$/.test(x)) return NUM_TO_ROMAN[x];

  return x;
}
// --- TS fallback canon ---
// Keep it small + factual. Expand as you like.
const TS_FALLBACK_META: Record<string, Pick<MeasuresGatePlateRow,
  "display_title" | "display_subtitle" | "one_liner" | "gate_numeral" | "removal_item"
>> = {
  "gate-0": { display_title: "Gate Ø", display_subtitle: "Queen of Heaven", one_liner: "The sovereign in solitude.", gate_numeral: "Ø", removal_item: "Queen of Heaven" },
  "gate-i": { display_title: "Gate I", display_subtitle: "Crown Removed", one_liner: "Recognition precedes descent.", gate_numeral: "I", removal_item: "Crown" },
  "gate-ii": { display_title: "Gate II", display_subtitle: null, one_liner: "The second threshold of reduction.", gate_numeral: "II", removal_item: "Lapis Beads" },
  "gate-iii": { display_title: "Gate III", display_subtitle: null, one_liner: "The third threshold of reduction.", gate_numeral: "III", removal_item: "Necklace of Lapis" },
  "gate-iv": { display_title: "Gate IV", display_subtitle: null, one_liner: "The fourth threshold of reduction.", gate_numeral: "IV", removal_item: "Breastplate" },
  "gate-v": { display_title: "Gate V", display_subtitle: null, one_liner: "The fifth threshold of reduction.", gate_numeral: "V", removal_item: "Ring" },
  "gate-vi": { display_title: "Gate VI", display_subtitle: null, one_liner: "The sixth threshold of reduction.", gate_numeral: "VI", removal_item: "Measuring Rod and Line" },
  "gate-vii": { display_title: "Gate VII", display_subtitle: null, one_liner: "The seventh threshold of reduction.", gate_numeral: "VII", removal_item: "Royal Garment" },
};

function tsGateFallback(slug: string): MeasuresGatePlateRow | null {
  if (slug === "gate-0") {
    return {
      slug: "gate-0",
      kind: "gate",
      pillar: "obsidian",

      display_title: "Gate Ø",
      display_subtitle: "Queen of Heaven",
      one_liner: "Before descent: sovereign solitude.",

      gate_numeral: "Ø",
      removal_item: null,

      // optional: you can put markdown here later, but your plate component already
      // renders the Gate Ø plaque from TS content, so null is fine.
      plaque_md: null,

      gate_released: true,
      gate_utc: null,

      media_still_url: MEASURES_ASSETS.kumurrah?.plates?.gate0?.still ?? null,
      media_animated_url: MEASURES_ASSETS.kumurrah?.plates?.gate0?.animated ?? null,
      media_passage_url: null, // your component already has DEFAULT_GATE0_PASSAGE fallback
    };
  }

  if (slug === "gate-i") {
    return {
      slug: "gate-i",
      kind: "gate",
      pillar: "obsidian",

      display_title: "Gate I",
      display_subtitle: "The Crown Removed",
      one_liner: "Recognition precedes descent.",

      gate_numeral: "I",
      removal_item: "Crown",

      plaque_md: null, // your component uses the TS epigraph constant
      gate_released: true,
      gate_utc: null,

      // if you have these in MEASURES_ASSETS, wire them; otherwise leave null
      media_still_url: null,
      media_animated_url: null,
      media_passage_url: null,
    };
  }

  return null;
}

export function useMeasuresGatePlate(gateSlug?: string | null) {
  const normalized = useMemo(() => (gateSlug ? normalizeGateSlug(gateSlug) : null), [gateSlug]);

  const [row, setRow] = useState<MeasuresGatePlateRow | null>(null);
  const [loading, setLoading] = useState<boolean>(!!normalized);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  console.log("Supabase flag =", MEASURES_USE_SUPABASE);
}, []);

  useEffect(() => {
    if (!normalized) {
      setRow(null);
      setLoading(false);
      setError(null);
      return;
    }

    // ✅ TS-only mode: return immediately
    if (!MEASURES_USE_SUPABASE) {
      const fallback = tsGateFallback(normalized);
      setRow(fallback);
      setLoading(false);
      setError(fallback ? null : `Gate not found (TS): ${normalized}`);
      return;
    }

    

      const q = supabase
        .from("v_measures_state_v2")
        .select(
          `
          slug,kind,pillar,
          display_title,display_subtitle,one_liner,
          gate_numeral,removal_item,
          plaque_md,
          gate_released,gate_utc,
          media_still_url,media_animated_url,media_passage_url
        `
        )
        .eq("kind", "gate")
        .eq("pillar", "obsidian")
        .eq("slug", normalized)
        .limit(1)
.single();

           
  }, [normalized]);

  return { row, loading, error };
}
