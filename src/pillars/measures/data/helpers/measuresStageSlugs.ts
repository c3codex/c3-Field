// src/pillars/measures/data/helpers/measuresStageSlugs.ts

export const MEASURES_STAGE_SLUGS = {
  templeHome: "templehome",

  antechamber: "antechamber",

  obsidianEpigraph: "obsidianepigraph",
  kumurrahPassage: "passage-kumurrah",
  gatesPassage: "gates-passage",
  gateIndex: "obsidianindex",

  gate0: "gate-00-queen-of-heaven",
  gate1: "gate-01-crown-removed",
  gate2: "gate-02-beads-of-lapis",
  gate3: "gate-03-lapis-necklace",
  gate4: "gate-04-breastplate",
  gate5: "gate-05-golden-bracelet",
  gate6: "gate-06-measuring-rod",
  gate7: "gate-07-royal-robe",
} as const;

export function getMeasuresGateSlug(gateNumber: number): string {
  switch (gateNumber) {
    case 0:
      return MEASURES_STAGE_SLUGS.gate0;
    case 1:
      return MEASURES_STAGE_SLUGS.gate1;
    case 2:
      return MEASURES_STAGE_SLUGS.gate2;
    case 3:
      return MEASURES_STAGE_SLUGS.gate3;
    case 4:
      return MEASURES_STAGE_SLUGS.gate4;
    case 5:
      return MEASURES_STAGE_SLUGS.gate5;
    case 6:
      return MEASURES_STAGE_SLUGS.gate6;
    case 7:
      return MEASURES_STAGE_SLUGS.gate7;
    default:
      return `gate-${String(gateNumber).padStart(2, "0")}`;
  }
}