import type { MeasuresTextContent } from "../hooks/useMeasuresTextContent";

export type MeasuresSelectedTexts = {
  epigraph: MeasuresTextContent | null;
  plaque: MeasuresTextContent | null;
  context: MeasuresTextContent | null;
  scroll: MeasuresTextContent | null;
  passage: MeasuresTextContent | null;
  statement: MeasuresTextContent | null;
  structure: MeasuresTextContent | null;
};

export function selectMeasuresTexts(
  items: MeasuresTextContent[]
): MeasuresSelectedTexts {
  const findKind = (kind: MeasuresTextContent["text_kind"]) =>
    items.find((item) => item.text_kind === kind) ?? null;

  return {
    epigraph: findKind("epigraph"),
    plaque: findKind("plaque"),
    context: findKind("context"),
    scroll: findKind("scroll"),
    passage: findKind("passage"),
    statement: findKind("statement"),
    structure: findKind("structure"),
  };
}