// src/pillars/measures/templeHome/MeasuresAntechamber.tsx

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MeasuresReturnGlyph from "@/pillars/measures/components/MeasuresReturnGlyph";
import EncounterStage, {
  type EncounterPhase,
} from "@/pillars/measures/components/EncounterStage";
import {
  MeasuresPlaquePanel,
  type PanelMode,
} from "@/pillars/measures/components/MeasuresPlaquePanel";
import { useMeasuresMediaUnit } from "@/pillars/measures/data/hooks/useMeasuresMediaUnit";
import { useMeasuresTextContent } from "@/pillars/measures/data/hooks/useMeasuresTextContent";
import MeasuresTextPlaqueCard from "@/pillars/measures/components/MeasuresTextPlaqueCard";
import { hasSeenObsidianEpigraph } from "@/pillars/measures/gates/obsidianKeys";

const ENCOUNTER_PAUSE_MS = 1100;
const PLAQUE_STAGGER_MS = 650;

export default function MeasuresAntechamber() {
  const nav = useNavigate();

  const [phase, setPhase] = useState<EncounterPhase>("arrive");
  const [panelMode, setPanelMode] = useState<PanelMode>("closed");

  const { item: media } = useMeasuresMediaUnit("measuresexhibition");
  const { items: antechamberItems } = useMeasuresTextContent("antechamber");

  const antechamber = antechamberItems[0] ?? null;

  const plaques = useMemo(() => {
    if (!antechamber) return [];

    return [
      <MeasuresTextPlaqueCard
        key={antechamber.slug}
        heading={antechamber.title}
        bodyMd={antechamber.body_md}
        tone="deep"
      />,
    ];
  }, [antechamber]);

  function handleOpenObsidianSequence() {
    if (hasSeenObsidianEpigraph()) {
      nav("/measures/gates/kumurrah-passage");
      return;
    }

    nav("/measures/gates/obsidian-epigraph");
  }

  return (
    <EncounterStage
      stillSrc={media?.still_image_url ?? undefined}
      alt="Measures of Inanna — Exhibition"
      mediaFit="contain"
      settleFadeMs={900}
      encounterPauseMs={ENCOUNTER_PAUSE_MS}
      onPhaseChange={setPhase}
      topLeft={<MeasuresReturnGlyph to="/measures" ariaLabel="Return to Temple" />}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(0,0,0,0.00),rgba(0,0,0,0.55)_72%,rgba(0,0,0,0.88)_100%)]" />

      <MeasuresPlaquePanel
        mode={panelMode}
        setMode={setPanelMode}
        title="Exhibition text panel"
        whisper="entering antechamber…"
        encounterPhase={phase}
        encounterPauseMs={ENCOUNTER_PAUSE_MS}
        plaqueStaggerMs={PLAQUE_STAGGER_MS}
        plaques={plaques}
        actions={
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleOpenObsidianSequence}
              className="min-h-[44px] rounded-full border border-white/15 bg-black/25 px-6 py-3
                         font-sans text-[10px] uppercase tracking-[0.35em] text-stone-200/85
                         transition hover:border-white/25 hover:text-stone-100"
            >
              open obsidian sequence
            </button>

            <button
              type="button"
              onClick={() => nav("/measures")}
              className="min-h-[44px] rounded-full border border-white/12 bg-black/15 px-6 py-3
                         font-sans text-[10px] uppercase tracking-[0.35em] text-stone-200/75
                         transition hover:border-white/20 hover:text-stone-100"
            >
              return to temple
            </button>

            <div className="ml-auto font-sans text-[10px] uppercase tracking-[0.28em] text-stone-200/35">
              tip: press esc to collapse
            </div>
          </div>
        }
      />
    </EncounterStage>
  );
}