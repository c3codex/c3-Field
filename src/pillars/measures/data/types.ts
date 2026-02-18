export type MeasuresGateNumeral = "Ø" | "I" | "II" | "III" | "IV" | "V" | "VI" | "VII" | string;

export type MeasuresGateIndexRow = {
  slug: string;

  gate_numeral: MeasuresGateNumeral | null;
  removal_item: string | null;

  display_title: string | null;
  display_subtitle: string | null;
  one_liner: string | null;

  gate_released: boolean;
  gate_utc: string | null;

  media_still_url: string | null;
};
