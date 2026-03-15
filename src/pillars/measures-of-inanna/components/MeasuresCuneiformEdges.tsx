import React from "react";
import { useMeasuresCuneiformAspects } from "../data/hooks/useMeasuresCuneiformAspects";

type Props = {
  manifestSlug?: string | null;
  visibility?: "plate-only" | "gallery-item" | "book-only" | "all";
  className?: string;
};

export default function MeasuresCuneiformEdges({
  manifestSlug,
  visibility = "plate-only",
  className = "",
}: Props) {
  const { aspects, loading, error } = useMeasuresCuneiformAspects(
    manifestSlug,
    visibility
  );

  if (!manifestSlug || loading || error || aspects.length === 0) {
    return null;
  }

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      {aspects.map((aspect) => {
        const isLeft = aspect.side === "left";

        return (
          <div
            key={aspect.id}
            className="absolute"
            style={{
              top: aspect.top_position,
              left: isLeft ? "0.75rem" : undefined,
              right: isLeft ? undefined : "0.75rem",
              transform: "translateY(-50%)",
            }}
          >
            <span
              className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/45 text-[22px] leading-none text-stone-100/80 shadow-[0_0_18px_rgba(0,0,0,0.28)]"
              title={`${aspect.title}: ${aspect.body_md}`}
              aria-label={`${aspect.title}: ${aspect.body_md}`}
            >
              {aspect.glyph}
            </span>
          </div>
        );
      })}
    </div>
  );
}