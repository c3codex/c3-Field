// OAR2 — reseat about_measures_registry featured structural drift contract
// Run: node docs/oar/measures_registry/update-about-measures-registry-featured-structural-drift-v1.cjs

require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })
const { createClient } = require("@supabase/supabase-js")

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) throw new Error("Supabase credentials missing")
const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

;(async () => {
  // --- read before ---
  const { data: before, error: readErr } = await supabase
    .from("measures_encounter_def")
    .select("encounter_key, display_title, metadata")
    .eq("encounter_key", "about_measures_registry")
    .single()

  if (readErr) { console.error("Read error:", readErr); process.exit(1) }
  console.log("BEFORE — styling_contract.material_family:", before.metadata?.styling_contract?.material_family)
  console.log("BEFORE — layout_contract.layout_mode:", before.metadata?.layout_contract?.layout_mode)
  console.log("BEFORE — eyebrow:", before.metadata?.eyebrow)
  console.log("BEFORE — title:", before.metadata?.title)
  console.log("BEFORE — content_contract:", JSON.stringify(before.metadata?.content_contract, null, 2))
  console.log("BEFORE — route_cards:", before.metadata?.route_cards)

  const existing = before.metadata || {}

  const updatedMetadata = {
    ...existing,

    eyebrow: "ABOUT MEASURES REGISTRY",
    title: "Integrity Governance for AI-Accelerated Systems",
    subtitle: "Measures Registry is a c3 Field system registered by c3 Community Partners DAO, LLC, a legally formed member-managed DAO, to help institutions evaluate and structure the environments where AI-generated output begins influencing decisions.",

    styling_contract: {
      ...( existing.styling_contract || {} ),
      material_family: "lapis",
      foundation_material: "lapis",
      surface_mode: "about_registry_featured_explainer",
      background_mode: "measures_registry_lapis_field",
      material_texture_visibility: true,
      disallow_background_roles: ["codexstone_chamber", "marble_chamber"],
    },

    layout_contract: {
      ...( existing.layout_contract || {} ),
      layout_mode: "about_registry_featured_split",
      viewport_fit: "single_screen_initial_view",
      content_layout: "side_by_side",
      primary_panel: "about_explainer",
      secondary_panel: "featured_structural_drift",
      footer_visibility: "visible",
      mobile_layout: "single_column_scroll_allowed",
    },

    content_contract: {
      about_sections: [
        {
          title: "What Measures Registry Does",
          body: "Measures Registry evaluates the operating environment around AI use: authority, review pathways, runtime surfaces, automation exposure, and decision flow. The goal is not to judge intelligence. The goal is to identify whether the surrounding system can safely support acceleration.",
        },
        {
          title: "How c3 Community Partners Supports the Work",
          body: "c3 Community Partners DAO, LLC, a legally formed member-managed DAO, develops non-extractive governance pathways for institutions, communities, and creative systems. Measures Registry applies that work to AI governance by converting evaluation into retained structural assets, guided sessions, and clearer operational standards.",
        },
        {
          title: "Contact",
          body: "For questions, institutional inquiries, or guided conversion interest, contact connect@measuresregistry.com.",
        },
      ],
      featured: {
        eyebrow: "FEATURED FIELD NOTE",
        title: "Structural Drift",
        body: "Structural Drift documents recurring implementation failures, governance gaps, authority fragmentation, and environmental instability observed across AI-accelerated systems.",
        image_role: "structural_drift_feature_image",
        cta_label: "Read Structural Drift",
        route: "structural_drift_publication",
      },
    },

    route_cards: [
      {
        title: "Reserve a Seat",
        route: "reserve_seat",
        body: "Begin the structured conversion pathway for your organization.",
        priority: "primary",
      },
      {
        title: "Read Structural Drift",
        route: "structural_drift_publication",
        body: "Review the field note on recurring implementation failures and authority fragmentation.",
        priority: "support",
      },
    ],
  }

  const { error: updateErr } = await supabase
    .from("measures_encounter_def")
    .update({ metadata: updatedMetadata })
    .eq("encounter_key", "about_measures_registry")

  if (updateErr) { console.error("Update error:", updateErr); process.exit(1) }

  // --- readback ---
  const { data: after, error: afterErr } = await supabase
    .from("measures_encounter_def")
    .select("encounter_key, display_title, metadata")
    .eq("encounter_key", "about_measures_registry")
    .single()

  if (afterErr) { console.error("Readback error:", afterErr); process.exit(1) }

  const m = after.metadata || {}
  console.log("\nAFTER — styling_contract.material_family:", m.styling_contract?.material_family)
  console.log("AFTER — styling_contract.surface_mode:", m.styling_contract?.surface_mode)
  console.log("AFTER — layout_contract.layout_mode:", m.layout_contract?.layout_mode)
  console.log("AFTER — layout_contract.content_layout:", m.layout_contract?.content_layout)
  console.log("AFTER — eyebrow:", m.eyebrow)
  console.log("AFTER — title:", m.title)
  console.log("AFTER — subtitle:", m.subtitle?.slice(0, 60) + "...")
  console.log("AFTER — content_contract.about_sections count:", m.content_contract?.about_sections?.length)
  console.log("AFTER — content_contract.about_sections[0].title:", m.content_contract?.about_sections?.[0]?.title)
  console.log("AFTER — content_contract.about_sections[1].title:", m.content_contract?.about_sections?.[1]?.title)
  console.log("AFTER — content_contract.about_sections[2].title:", m.content_contract?.about_sections?.[2]?.title)
  console.log("AFTER — content_contract.featured.title:", m.content_contract?.featured?.title)
  console.log("AFTER — content_contract.featured.image_role:", m.content_contract?.featured?.image_role)
  console.log("AFTER — content_contract.featured.cta_label:", m.content_contract?.featured?.cta_label)
  console.log("AFTER — content_contract.featured.route:", m.content_contract?.featured?.route)
  console.log("AFTER — route_cards count:", m.route_cards?.length)
  console.log("AFTER — route_cards:", m.route_cards?.map(c => `${c.route} [${c.priority}]`))
  console.log("\n✓ about_measures_registry seated as featured structural drift surface")
})()
