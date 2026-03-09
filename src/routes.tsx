import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";

import HeroPriceless from "@/components/layout/HeroPricelessGallery";
import HeroGallery from "@/components/layout/HeroGallery";
import HeroCodexstone from "@/components/layout/HeroCodexstone";
import IntroducingSection from "@/components/layout/IntroducingSection";

import MeasuresShell from "@/pillars/measures/MeasuresShell";

import HeroModel from "@/pillars/model/HeroModel";
import ConnectLens from "@/pillars/model/ConnectLens";
import AboutSurface from "@pillars/model/CoherentLibrary";
import ModelContribute from "@/pillars/model/ModelContribute";
import ModelCreate from "@/pillars/model/ModelCreate";

import RegistryPage from "@/structure/registry/RegistryPage";

export default function AppRoute() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HeroPriceless />} />
        <Route path="/registry" element={<RegistryPage />} />

        {/* ✅ Measures subtree lives here */}
        <Route path="/measures/*" element={<MeasuresShell />} />

        <Route path="/gallery" element={<HeroGallery />} />
        <Route path="/codexstone" element={<HeroCodexstone />} />

        <Route path="/model" element={<HeroModel />} />
        <Route path="/model/connect" element={<ConnectLens />} />
        <Route path="/model/about" element={<AboutSurface />} />
        <Route path="/model/contribute" element={<ModelContribute />} />
        <Route path="/model/create" element={<ModelCreate />} />

        <Route path="/introducing" element={<IntroducingSection />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}