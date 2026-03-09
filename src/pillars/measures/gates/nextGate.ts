// src/pillars/measures/gates/nextGate.ts

export const OBSIDIAN_GATE_ORDER = [
  "gate-0",
  "gate-i",
  "gate-ii",
  "gate-iii",
  "gate-iv",
  "gate-v",
  "gate-vi",
  "gate-vii",
] as const;

export type ObsidianGateSlug = (typeof OBSIDIAN_GATE_ORDER)[number];

/**
 * Normalize anything plausible (gate1, 1, i, gate-i, gate-ø, ø) -> canonical slug.
 * Keep this aligned with your existing normalizeGateSlug if you want one source of truth.
 */
export function normalizeObsidianGateSlug(input: string): ObsidianGateSlug | null {
  const x = input.trim().toLowerCase();

  if (x === "gate0" || x === "gate-0" || x === "0" || x === "ø" || x === "gate-ø") return "gate-0";

  // roman already
  if (x === "gate-i" || x === "i") return "gate-i";
  if (x === "gate-ii" || x === "ii") return "gate-ii";
  if (x === "gate-iii" || x === "iii") return "gate-iii";
  if (x === "gate-iv" || x === "iv") return "gate-iv";
  if (x === "gate-v" || x === "v") return "gate-v";
  if (x === "gate-vi" || x === "vi") return "gate-vi";
  if (x === "gate-vii" || x === "vii") return "gate-vii";

  // numeric aliases gate-1 / gate1 / 1 -> gate-i, etc
  const m = x.match(/^gate[-_]?([0-7])$/);
  const n = m ? Number(m[1]) : (/^[0-7]$/.test(x) ? Number(x) : NaN);
  if (Number.isFinite(n)) {
    const map: Record<number, ObsidianGateSlug> = {
      0: "gate-0",
      1: "gate-i",
      2: "gate-ii",
      3: "gate-iii",
      4: "gate-iv",
      5: "gate-v",
      6: "gate-vi",
      7: "gate-vii",
    };
    return map[n];
  }

  // if it's not one of ours, null (caller decides what to do)
  return null;
}

/**
 * ✅ THE “NEXT-GATE MAP” FUNCTION
 * Returns the next gate in the canonical order, or null if you're at the end / unknown.
 */
export function nextObsidianGateSlug(current: string): ObsidianGateSlug | null {
  const slug = normalizeObsidianGateSlug(current);
  if (!slug) return null;

  const i = OBSIDIAN_GATE_ORDER.indexOf(slug);
  if (i < 0) return null;

  return OBSIDIAN_GATE_ORDER[i + 1] ?? null;
}