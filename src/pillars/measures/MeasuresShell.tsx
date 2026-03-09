// src/pillars/measures/MeasuresShell.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import MeasuresTempleHome from "@/pillars/measures/MeasuresTempleHome";
import MeasuresAntechamber from "@/pillars/measures/components/MeasuresAntechamber";

import ObsidianGateIntro from "@/pillars/measures/gates/ObsidianGateIntro";
import KumurrahPassage from "@/pillars/measures/gates/KumurrahPassage";
import ObsidianGateboard from "@/pillars/measures/gates/ObsidianGateboard";
import ObsidianGatePlate from "@/pillars/measures/gates/ObsidianGatePlate";

import CodexstoneChamber from "@/pillars/measures/mes/CodexstoneChamber";
import MarbleMEPlate from "@/pillars/measures/mes/MarbleMEPlate";

import { MeasuresAudioBusProvider } from "@/pillars/measures/audio/MeasuresAudioBusProvider";

export default function MeasuresShell() {
  return (
    <MeasuresAudioBusProvider>
      <Routes>
        <Route index element={<MeasuresTempleHome />} />
        <Route path="antechamber" element={<MeasuresAntechamber />} />

        <Route path="gates/intro" element={<ObsidianGateIntro />} />
        <Route path="gates/passage" element={<KumurrahPassage />} />
        <Route path="gates" element={<ObsidianGateboard />} />
        <Route path="gates/:gateId" element={<ObsidianGatePlate />} />

        <Route path="mes" element={<CodexstoneChamber />} />
        <Route path="mes/:meId" element={<MarbleMEPlate />} />

        <Route path="*" element={<Navigate to="/measures" replace />} />
      </Routes>
    </MeasuresAudioBusProvider>
  );
}