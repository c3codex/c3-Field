// src/pillars/measures/MeasuresShell.tsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MeasuresTempleHome from "@/pillars/measures/templeHome/MeasuresTempleHome";
import MeasuresAntechamber from "@/pillars/measures/templeHome/MeasuresAntechamber";
import ObsidianGateEpigraph from "@/pillars/measures/gates/ObsidianGateEpigraph";
import KumurrahPassage from "@/pillars/measures/gates/KumurrahPassage";
import ObsidianGateboard from "@/pillars/measures/gates/ObsidianGateboard";
import ObsidianGatePlate from "@/pillars/measures/gates/ObsidianGatePlate";
import { MeasuresAudioBusProvider } from "@/pillars/measures/audio/MeasuresAudioBusProvider";
export default function MeasuresShell() {


  return (
    <MeasuresAudioBusProvider>
      <Routes>
        <Route index element={<MeasuresTempleHome />} />
        <Route path="antechamber" element={<MeasuresAntechamber />} />

        <Route path="gates/obsidian-epigraph" element={<ObsidianGateEpigraph />} />
        <Route path="gates/kumurrah-passage" element={<KumurrahPassage />} />
        <Route path="gates/gateboard" element={<ObsidianGateboard />} />
        <Route path="gates/:gateSlug/passage" element={<KumurrahPassage />} />
        <Route path="gates/:gateSlug" element={<ObsidianGatePlate />} />

        <Route path="*" element={<Navigate to="/measures" replace />} />
      </Routes>
    </MeasuresAudioBusProvider>
  );
}