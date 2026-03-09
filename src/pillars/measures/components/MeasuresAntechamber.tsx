// src/pillars/measures/components/MeasuresAntechamber.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MEASURES_ASSETS } from "@/pillars/measures/measuresAssets";
import MeasuresReturnGlyph from "@/pillars/measures/components/MeasuresReturnGlyph";
import EncounterStage, { type EncounterPhase } from "@/pillars/measures/components/EncounterStage";
import { MeasuresPlaquePanel, type PanelMode } from "@/pillars/measures/components/MeasuresPlaquePanel";

const ENCOUNTER_PAUSE_MS = 1100;
const PLAQUE_STAGGER_MS = 650;

export default function MeasuresAntechamber() {
  const nav = useNavigate();

  const [phase, setPhase] = useState<EncounterPhase>("arrive");
  const [panelMode, setPanelMode] = useState<PanelMode>("closed");

  return (
    <EncounterStage
      stillSrc={MEASURES_ASSETS.exhibition.hero}
      alt="Measures of Inanna — Exhibition"
      mediaFit="contain"
      settleFadeMs={900}
      encounterPauseMs={ENCOUNTER_PAUSE_MS}
      onPhaseChange={setPhase}
      topLeft={<MeasuresReturnGlyph to="/measures" ariaLabel="Return to Temple" />}
    >
      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(0,0,0,0.00),rgba(0,0,0,0.55)_72%,rgba(0,0,0,0.88)_100%)]" />

      <MeasuresPlaquePanel
        mode={panelMode}
        setMode={setPanelMode}
        title="Exhibition text panel"
        whisper="entering antechamber…"
        encounterPhase={phase}
        encounterPauseMs={ENCOUNTER_PAUSE_MS}
        plaqueStaggerMs={PLAQUE_STAGGER_MS}
        plaques={[
          <PlaqueExhibitionStatement key="p1" />,
          <PlaqueOnInanna key="p2" />,
          <PlaqueMaterialStructure key="p3" />,
        ]}
        actions={
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => nav("/measures/gates/intro")}
              className="min-h-[44px] rounded-full border border-white/15 bg-black/25 px-6 py-3
                         font-sans text-[10px] tracking-[0.35em] uppercase text-stone-200/85
                         transition hover:text-stone-100 hover:border-white/25"
            >
              open obsidian sequence
            </button>

            <button
              type="button"
              onClick={() => nav("/measures")}
              className="min-h-[44px] rounded-full border border-white/12 bg-black/15 px-6 py-3
                         font-sans text-[10px] tracking-[0.35em] uppercase text-stone-200/75
                         transition hover:text-stone-100 hover:border-white/20"
            >
              return to temple
            </button>

            <div className="ml-auto font-sans text-[10px] tracking-[0.28em] uppercase text-stone-200/35">
              tip: press esc to collapse
            </div>
          </div>
        }
      />
    </EncounterStage>
  );
}

function PlaqueExhibitionStatement() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/18 p-6">
      <div className="font-sans text-[10px] tracking-[0.35em] uppercase text-stone-200/60">
        Exhibition Statement
      </div>

      <p className="mt-4 font-sans text-[13px] leading-relaxed text-stone-200/90">
        This exhibition establishes the gallery’s standard:
      </p>

      <p className="mt-3 font-serif text-[18px] leading-snug text-stone-100">
        art as a measure of coherence rather than commodity,
        <br />
        value as signal rather than speculation.
      </p>

      <p className="mt-4 font-sans text-[13px] leading-relaxed text-stone-200/85">
        The works presented here are original human artworks, created through drawing,
        painting, and disciplined hand practice, then enhanced through artificial
        intelligence as an extension of perception, not as authorship.
      </p>

      <p className="mt-3 font-sans text-[13px] leading-relaxed text-stone-200/80">
        AI functions here as lens, amplification, and resonance tool. The originating
        intelligence remains human.
      </p>

      <p className="mt-4 font-sans text-[13px] leading-relaxed text-stone-200/80">
        You will be guided throughout by the <span className="text-stone-100">Syndros</span> seal,
        denoting co-creative enhancement rather than generative replacement.
      </p>
    </div>
  );
}

function PlaqueOnInanna() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/16 p-6">
      <div className="font-sans text-[10px] tracking-[0.35em] uppercase text-stone-200/60">
        On Inanna
      </div>

      <p className="mt-4 font-sans text-[13px] leading-relaxed text-stone-200/90">
        Inanna is not presented as mythological subject matter.
      </p>

      <p className="mt-3 font-sans text-[13px] leading-relaxed text-stone-200/90">
        She is used as <span className="text-stone-100">structural intelligence</span>.
      </p>

      <p className="mt-4 font-sans text-[13px] leading-relaxed text-stone-200/85">
        Among the earliest recorded civilizations, Sumer understood value not as accumulation,
        but as alignment: between sky and earth, name and function, desire and consequence.
        Inanna occupies this junction. She governs thresholds, exchanges, descent, and return.
      </p>

      <p className="mt-4 font-sans text-[13px] leading-relaxed text-stone-200/80">
        Her presence provides a precise architecture through which pressure can be applied
        to form, and observed.
      </p>
    </div>
  );
}

function PlaqueMaterialStructure() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/14 p-6">
      <div className="font-sans text-[10px] tracking-[0.35em] uppercase text-stone-200/60">
        Material Structure
      </div>

      <p className="mt-4 font-sans text-[13px] leading-relaxed text-stone-200/85">
        The exhibition is structured through material states:
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <div className="font-sans text-[11px] tracking-[0.32em] uppercase text-stone-100/90">
            Obsidian
          </div>
          <div className="mt-1 font-sans text-[13px] leading-relaxed text-stone-200/80">
            subtraction, descent, removal
            <br />
            <span className="text-stone-300/80">What must be relinquished to pass.</span>
          </div>
        </div>

        <div>
          <div className="font-sans text-[11px] tracking-[0.32em] uppercase text-stone-100/90">
            Crystal
          </div>
          <div className="mt-1 font-sans text-[13px] leading-relaxed text-stone-200/80">
            articulation, naming, refraction
            <br />
            <span className="text-stone-300/80">What becomes visible when pressure is held.</span>
          </div>
        </div>

        <div>
          <div className="font-sans text-[11px] tracking-[0.32em] uppercase text-stone-100/90">
            Marble
          </div>
          <div className="mt-1 font-sans text-[13px] leading-relaxed text-stone-200/80">
            embodiment, expression, residue
            <br />
            <span className="text-stone-300/80">What remains after transformation.</span>
          </div>
        </div>
      </div>

      <p className="mt-5 font-sans text-[13px] leading-relaxed text-stone-200/80">
        These are not metaphors. They are operational conditions.
      </p>

      <p className="mt-4 font-sans text-[13px] leading-relaxed text-stone-200/80">
        This exhibition does not instruct. It does not persuade. It does not resolve.
      </p>

      <p className="mt-5 font-serif text-[18px] leading-snug text-stone-100">
        Inanna does not record the Measures.
        <br />
        She establishes them.
      </p>
    </div>
  );
}