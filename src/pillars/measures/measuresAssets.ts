// src/pillars/measures/measuresAssets.ts

export const MEASURES_ASSETS = {
  temple: {
    still:
      "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/templehome.png",
    animated:
      "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/templehome.mp4",
  },

  audio: {
    obsidianBed:
      "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/obsidian_bed.wav",
    crystalBed:
      "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/crystal_bed.wav",
    marbleBed:
      "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/marble_bed.wav",
  },


  obsidianEpigraph: {
    id: "obsidian-epigraph",
        title: "Obsidian Gates",
        epigraph: "From the Great Above she opened her ear to the Great Below.",
        cuneiform: "𒀭𒋫𒃲𒋫 𒄑𒌆𒃲𒊺 𒀭𒈹𒁀𒀭𒌈",
    still:
      "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/obsidianepigraph.webp",
    animated:
      "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/ObsidianEpigraph.mp4",
  },

  ObsidianGateboard: {
    still:
      "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/obsidianIndex.webp",
  },

  exhibition: {
    hero:
      "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/measuresExhibition.webp",
  },

  MeasuresReturnGlyph: {
    jeweledSeal:
      "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/%20%20MeasuresReturn_thumb.webp",
  },

  // ✅ ADD THIS (guide glyph)
  syndros: {
    thumb:
      "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/syndrosReturnglyph_thumb.webp",
  },

  kumurrah: {
    still:
      "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/Kumurrah.webp",
    animated:
      "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/Kumurrahpassage.mp4",

    plateBase: "/measures/gates",

    plates: {
      gate0: {
        animated:
          "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/QofH_original.mp4",
        still:
          "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/original_gate1.jpeg",
        original:
          "https://xttrboiohqzusyaneuaw.supabase.co/storage/v1/object/public/Measures-open/original_gate1.jpeg",
      },
    },
  },
} as const;
