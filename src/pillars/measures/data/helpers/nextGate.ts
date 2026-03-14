// src/pillars/measures/data/helpers/nextGate.ts

export const OBSIDIAN_GATE_ORDER = [
  "gate-00-queen-of-heaven",
  "gate-01-crown-removed",
  "gate-02-beads-of-lapis",
  "gate-03-lapis-necklace",
  "gate-04-breastplate",
  "gate-05-golden-bracelet",
  "gate-06-measuring-rod",
  "gate-07-royal-robe",
] as const;

export type ObsidianGateSlug = (typeof OBSIDIAN_GATE_ORDER)[number];

export function isObsidianGateSlug(value: string): value is ObsidianGateSlug {
  return OBSIDIAN_GATE_ORDER.includes(value as ObsidianGateSlug);
}

export function normalizeObsidianGateSlug(
  input: string
): ObsidianGateSlug | null {
  const x = input.trim().toLowerCase();

  const aliasMap: Record<string, ObsidianGateSlug> = {
    "gate-00-queen-of-heaven": "gate-00-queen-of-heaven",
    "gate-0": "gate-00-queen-of-heaven",
    "gate0": "gate-00-queen-of-heaven",
    "0": "gate-00-queen-of-heaven",

    "gate-01-crown-removed": "gate-01-crown-removed",
    "gate-1": "gate-01-crown-removed",
    "gate1": "gate-01-crown-removed",
    "1": "gate-01-crown-removed",

    "gate-02-beads-of-lapis": "gate-02-beads-of-lapis",
    "gate-2": "gate-02-beads-of-lapis",
    "gate2": "gate-02-beads-of-lapis",
    "2": "gate-02-beads-of-lapis",

    "gate-03-lapis-necklace": "gate-03-lapis-necklace",
    "gate-3": "gate-03-lapis-necklace",
    "gate3": "gate-03-lapis-necklace",
    "3": "gate-03-lapis-necklace",

    "gate-04-breastplate": "gate-04-breastplate",
    "gate-4": "gate-04-breastplate",
    "gate4": "gate-04-breastplate",
    "4": "gate-04-breastplate",

    "gate-05-golden-bracelet": "gate-05-golden-bracelet",
    "gate-5": "gate-05-golden-bracelet",
    "gate5": "gate-05-golden-bracelet",
    "5": "gate-05-golden-bracelet",

    "gate-06-measuring-rod": "gate-06-measuring-rod",
    "gate-6": "gate-06-measuring-rod",
    "gate6": "gate-06-measuring-rod",
    "6": "gate-06-measuring-rod",

    "gate-07-royal-robe": "gate-07-royal-robe",
    "gate-7": "gate-07-royal-robe",
    "gate7": "gate-07-royal-robe",
    "7": "gate-07-royal-robe",
  };

  return aliasMap[x] ?? null;
}

export function nextObsidianGateSlug(
  current: string | null | undefined
): ObsidianGateSlug | null {
  if (!current) return null;

  const slug = normalizeObsidianGateSlug(current);
  if (!slug) return null;

  const i = OBSIDIAN_GATE_ORDER.indexOf(slug);
  if (i < 0) return null;

  return OBSIDIAN_GATE_ORDER[i + 1] ?? null;
}

export function previousObsidianGateSlug(
  current: string | null | undefined
): ObsidianGateSlug | null {
  if (!current) return null;

  const slug = normalizeObsidianGateSlug(current);
  if (!slug) return null;

  const i = OBSIDIAN_GATE_ORDER.indexOf(slug);
  if (i <= 0) return null;

  return OBSIDIAN_GATE_ORDER[i - 1] ?? null;
}

export function getObsidianGateNumber(
  current: string | null | undefined
): number | null {
  if (!current) return null;

  const slug = normalizeObsidianGateSlug(current);
  if (!slug) return null;

  const i = OBSIDIAN_GATE_ORDER.indexOf(slug);
  return i >= 0 ? i : null;
}