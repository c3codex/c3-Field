// src/pillars/measures/mes/MarbleMEPlate.tsx
import React from "react";
import { useParams } from "react-router-dom";
import MeasuresReturnGlyph from "@/pillars/measures/components/MeasuresReturnGlyph";

export default function MarbleMEPlate() {
  const { meId } = useParams<{ meId?: string }>();

  return (
    <section className="relative min-h-[100svh] bg-black text-stone-100">
      <div className="absolute top-5 right-5 z-50">
        <MeasuresReturnGlyph to="/measures/mes" ariaLabel="Return to Marble Index" />
      </div>

      <div className="px-8 pt-14">
        <div className="text-[10px] uppercase tracking-[0.35em] text-stone-200/55 font-sans">Marble Measures</div>
        <h1 className="mt-4 font-serif text-4xl text-stone-50">{meId ?? "ME"}</h1>
        <p className="mt-3 max-w-2xl text-stone-200/60">Plate stub. We’ll bind media + plaque next.</p>
      </div>
    </section>
  );
}
