import type { MeasuresTextContent } from "../hooks/useMeasuresTextContent";

export function selectMeasuresText(
  items: MeasuresTextContent[],
  kind: MeasuresTextContent["text_kind"]
) {
  return items.find((item) => item.text_kind === kind) ?? null;
}