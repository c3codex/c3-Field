// src/pillars/measures/components/aspects/AspectEdgeLayer.tsx
import React, { useState } from "react";
import AspectMarker from "./AspectMarker";
import AspectCard from "./AspectCard";
import type { Aspect } from "./aspectTypes";

type Props = {
  aspects: readonly Aspect[];
  enabled?: boolean;
};

export default function AspectEdgeLayer({ aspects, enabled = true }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = aspects.find((a) => a.id === activeId) ?? null;

  if (!enabled) return null;

  return (
    <div className="absolute inset-0 z-50 pointer-events-none">
      {aspects.map((a) => (
        <AspectMarker
          key={a.id}
          sign={a.sign}
          side={a.side}
          top={a.top}
          active={a.id === activeId}
          onClick={() => setActiveId((prev) => (prev === a.id ? null : a.id))}
        />
      ))}

      {active && (
        <AspectCard
          sign={active.sign}
          title={active.title}
          text={active.text}
          side={active.side}
          onClose={() => setActiveId(null)}
        />
      )}
    </div>
  );
}
