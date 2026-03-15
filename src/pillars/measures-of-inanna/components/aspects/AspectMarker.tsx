// src/pillars/measures/components/aspects/AspectMarker.tsx
import React from "react";

type Props = {
  sign: string;
  side: "left" | "right";
  top: string;
  active: boolean;
  onClick: () => void;
};

export default function AspectMarker({
  sign,
  side,
  top,
  active,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      aria-label="Reveal aspect"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={`pointer-events-auto absolute z-[60] select-none transition ${
        side === "left" ? "left-4" : "right-4"
      } ${
        active
          ? "opacity-60"
          : "opacity-30 hover:opacity-55 animate-[c3Pulse_10s_ease-in-out_infinite]"
      }`}
      style={{ top }}
    >
      <span className="text-2xl text-stone-200">{sign}</span>
    </button>
  );
}
