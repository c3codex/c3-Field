import { useMemo } from "react";
import { useMeasuresMediaUnit } from "./useMeasuresMediaUnit";
import { useMeasuresTextContent } from "./useMeasuresTextContent";
import { useMeasuresCuneiformAspects } from "./useMeasuresCuneiformAspects";
import { selectMeasuresTexts } from "../helpers/selectMeasuresTexts";

export function useMeasuresEncounterBundle(
  manifestSlug?: string | null,
  aspectVisibility: "plate-only" | "gallery-item" | "book-only" | "all" = "all"
) {
  const mediaQuery = useMeasuresMediaUnit(manifestSlug);
  const textQuery = useMeasuresTextContent(manifestSlug);
  const aspectQuery = useMeasuresCuneiformAspects(
    manifestSlug,
    aspectVisibility
  );

  const selectedTexts = useMemo(
    () => selectMeasuresTexts(textQuery.items),
    [textQuery.items]
  );

  return {
    manifestSlug,
    media: mediaQuery.item,
    textItems: textQuery.items,
    aspects: aspectQuery.aspects,
    ...selectedTexts,
    loading:
      mediaQuery.loading || textQuery.loading || aspectQuery.loading,
    error:
      mediaQuery.error || textQuery.error || aspectQuery.error || null,
  };
}