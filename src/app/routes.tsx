// src/routes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";

import { PRICELESS_ASSETS } from "@/assets/pricelessAssets";

import HeroPriceless from "@/components/layout/HeroPricelessGallery";
import MeasuresShell from "@/pillars/measures/MeasuresShell";

// Pillar heroes
import HeroGallery from "@/components/layout/HeroGallery";
import HeroModel from "@/components/layout/HeroModel";

// Codexstone pillar
import HeroCodexstone from "@/components/layout/HeroCodexstone";

// Introducing page
import IntroducingSection from "@/components/layout/IntroducingSection";

// Model depth pages (stubs are included below)
import ModelConnect from "@/pillars/model/ModelConnect";
import ModelContribute from "@/pillars/model/ModelContribute";
import ModelCreate from "@/pillars/model/ModelCreate";

/*import { PRICELESS_ASSETS } from "@/assets/pricelessAssets";

<Route
  path="/model"
  element={
    <HeroModel
      heroMedia={{
        video: PRICELESS_ASSETS.model.hero.video,
        poster: PRICELESS_ASSETS.model.hero.still,
        settleMs: PRICELESS_ASSETS.model.hero.settleMs,
      }}
    />
  }
/>
*
 // src/routes.tsx (near imports)

export const HERO_MEDIA = {
  model: {
    video:
      "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/c3model_hero.mp4",
    poster:
      "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/c3model_hero.webp",
    settleMs: 6000,
  },
} as const;

// usage:
// <Route path="/model" element={<HeroModel heroMedia={HERO_MEDIA.model} />} />

const HERO_MEDIA = {
  model: {
    video:
      "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/c3model_hero.mp4",
    poster:
      "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/c3model_hero.webp",
    settleMs: 6000,
  },
} as const;

/**
 * c3 Model hero media (Supabase public)
 * Keep here for now as requested; later you can move to src/media/HeroMedia if you want.
 */
const MODEL_HERO_MEDIA = {
  video:
    "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/c3model_hero.mp4",
  poster:
    "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/c3model_hero.webp",
} as const;

export default function AppRoute() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Home */}
        <Route path="/" element={<HeroPriceless />} />

        {/* Pillars */}
        <Route path="/measures/*" element={<MeasuresShell />} />
        <Route path="/gallery" element={<HeroGallery />} />
        <Route
          path="/model"
          element={<HeroModel heroMedia={MODEL_HERO_MEDIA} />}
        />
        <Route path="/codexstone" element={<HeroCodexstone />} />

        {/* Model depth (chosen after the hero) */}
        <Route path="/model/connect" element={<ModelConnect />} />
        <Route path="/model/contribute" element={<ModelContribute />} />
        <Route path="/model/create" element={<ModelCreate />} />

        {/* Introducing */}
        <Route path="/introducing" element={<IntroducingSection />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
