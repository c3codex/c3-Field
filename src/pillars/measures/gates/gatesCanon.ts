// src/pillars/measures/gates/gatesCanon.ts
import type { MeasuresGateIndexRow } from "@/pillars/measures/data/types";
import type { MeasuresGatePlateRow } from "@/pillars/measures/data/useMeasuresGatePlate";
import { MEASURES_ASSETS } from "@/pillars/measures/measuresAssets";

// normalize common slug variants so routes don’t break silently
export function normalizeGateSlug(s: string) {
  const x = s.trim().toLowerCase();
  if (x === "gate0" || x === "gate-ø" || x === "0" || x === "ø") return "gate-0";
  if (x === "gate1" || x === "gate-1" || x === "i") return "gate-i";
  return x;
}

export function getGatesIndexCanon(): MeasuresGateIndexRow[] {
  const gate0Still = MEASURES_ASSETS.kumurrah?.plates?.gate0?.still ?? null;

  return [
    {
      slug: "gate-0",
      gate_numeral: "Ø",
      removal_item: null,
      gate_released: true,
      gate_utc: null,
      media_still_url: gate0Still,
      display_title: "Gate Ø",
      display_subtitle: "Queen of Heaven",
      one_liner: "Before descent: sovereign solitude.",
    } as MeasuresGateIndexRow,
    {
      slug: "gate-i",
      gate_numeral: "I",
      removal_item: "Crown",
      gate_released: true,
      gate_utc: null,
      media_still_url: null, // fill when you confirm path in assets
      display_title: "Gate I",
      display_subtitle: "The Crown Removed",
      one_liner: "Recognition precedes descent.",
    } as MeasuresGateIndexRow,
    // Add II–VII when ready
  ];
}

export function getGatePlateCanon(slugRaw: string): MeasuresGatePlateRow | null {
  const slug = normalizeGateSlug(slugRaw);

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
      plaque_md: null,
      gate_released: true,
      gate_utc: null,
      media_still_url: MEASURES_ASSETS.kumurrah?.plates?.gate0?.still ?? null,
      media_animated_url: MEASURES_ASSETS.kumurrah?.plates?.gate0?.animated ?? null,
      media_passage_url: null,
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
      plaque_md: null,
      gate_released: true,
      gate_utc: null,
      media_still_url: null,
      media_animated_url: null,
      media_passage_url: null,
    };
  }

  return null;
}