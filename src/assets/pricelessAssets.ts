// src/assets/pricelessAssets.ts

export const PRICELESS_ASSETS = {
  
  // NEW — Priceless Gallery Hero (pillars)
priceless: {
    hero: {
      video:
        "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/heroPriceless.mov",
      still:
        "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/PricelessHero.webp",
    },

    // Optional static fallback / alt usage
    pillars:
      "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/Pricelessgallerypillars.png",
  },

    // c3 Model hero
  model: {
    hero: {
      video:
        "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/c3model_hero.mp4",
      still:
        "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/c3model_hero.webp",
      settleMs: 6000,
    },
  },


  // Shared return glyph
  syndros: {
    thumb:
      "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/Syndros_thumb.webp",
  },
} as const;
