import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import PricelessHome from "@pillars/gallery/PricelessHome";
import IntroducingSection from "@/components/layout/IntroducingSection";
import MeasuresShell from "@/pillars/measures/MeasuresShell";
import ModelHome from "@/pillars/model/ModelHome";
import ConnectLens from "@/pillars/model/ConnectLens";
import AboutSurface from "@pillars/model/CoherentLibrary";

export default function AppRoute() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<PricelessHome />} />
        

        {/* ✅ Measures subtree lives here */}
        <Route path="/measures/*" element={<MeasuresShell />} />

        <Route path="/model" element={<ModelHome />} />
        <Route path="/model/connect" element={<ConnectLens />} />
        <Route path="/model/about" element={<AboutSurface />} />
        
        <Route path="/introducing" element={<IntroducingSection />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}