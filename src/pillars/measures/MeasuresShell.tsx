// src/pillars/measures/MeasuresShell.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import MeasuresTempleHome from "@/pillars/measures/MeasuresTempleHome";
import MeasuresExhibition from "@/pillars/measures/MeasuresExhibition";

import ObsidianGateIntro from "@/pillars/measures/gates/ObsidianGateIntro";
import KumurrahPassage from "@/pillars/measures/gates/KumurrahPassage";
import ObsidianGateIndex from "@/pillars/measures/gates/ObsidianGateIndex";
import ObsidianGatePlate from "@/pillars/measures/gates/ObsidianGatePlate";

import CodexstoneChamber from "@/pillars/measures/mes/CodexstoneChamber";
import MarbleMEPlate from "@/pillars/measures/mes/MarbleMEPlate";
import { MeasuresAudioBusProvider } from "@/pillars/measures/audio/MeasuresAudioBusProvider";

export default function MeasuresShell() {
  return (
    <MeasuresAudioBusProvider>
      <Routes>
        {/* Temple */}
        <Route index element={<MeasuresTempleHome />} />
        <Route path="exhibition" element={<MeasuresExhibition />} />

        {/* Obsidian: tone + sequence */}
        <Route path="gates/intro" element={<ObsidianGateIntro />} />
        <Route path="gates/passage" element={<KumurrahPassage />} />
        <Route path="gates" element={<ObsidianGateIndex />} />
        <Route path="gates/:gateId" element={<ObsidianGatePlate />} />

        {/* Marble: Codexstone chamber (index lives inside) */}
        <Route path="mes" element={<CodexstoneChamber />} />
<Route path="mes/:meId" element={<MarbleMEPlate />} />
        {/* safety */}
        <Route path="*" element={<Navigate to="/measures" replace />} />
      </Routes>
    </MeasuresAudioBusProvider>
  );
}
