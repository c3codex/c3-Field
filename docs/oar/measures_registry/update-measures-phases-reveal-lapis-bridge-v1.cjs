// OAR1 — seat measures_phases_reveal lapis structural requirements bridge
// Run: node docs/oar/measures_registry/update-measures-phases-reveal-lapis-bridge-v1.cjs

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
    .eq("encounter_key", "measures_phases_reveal")
    .single()

  if (readErr) { console.error("Read error:", readErr); process.exit(1) }
  console.log("BEFORE — styling_contract.material_family:", before.metadata?.styling_contract?.material_family)
  console.log("BEFORE — layout_contract.layout_mode:", before.metadata?.layout_contract?.layout_mode)
  console.log("BEFORE — eyebrow:", before.metadata?.eyebrow)
  console.log("BEFORE — title:", before.metadata?.title)
  console.log("BEFORE — route_cards:", before.metadata?.route_cards)
  console.log("BEFORE — content_contract:", before.metadata?.content_contract)

  const existing = before.metadata || {}

  const updatedMetadata = {
    ...existing,

    eyebrow: "STRUCTURAL REQUIREMENTS",
    title: "Three Requirements for Governable AI",
    subtitle: "AI acceleration becomes stable only when the operating environment can identify authority, register behavior, and govern review.",

    styling_contract: {
      ...( existing.styling_contract || {} ),
      material_family: "lapis",
      foundation_material: "lapis",
      surface_mode: "structural_requirements_bridge",
      background_mode: "codexstone_lapis_field",
      material_texture_visibility: true,
    },

    layout_contract: {
      ...( existing.layout_contract || {} ),
      layout_mode: "structural_requirements_bridge",
      viewport_fit: "single_screen_initial_view",
      content_alignment: "centered_governed",
      requirements_layout: "three_card_grid",
      route_cards_layout: "three_action_cards",
      footer_visibility: "visible",
      mobile_layout: "single_column_scroll_allowed",
    },

    content_contract: {
      requirements: [
        {
          title: "Authority must be named.",
          body: "AI systems need a clear source of operational authority. Without a named authority layer, outputs drift into action without accountability.",
        },
        {
          title: "Behavior must be registered.",
          body: "Every AI-assisted action, automation, external tool, and runtime surface must be visible enough to be reviewed, traced, and governed.",
        },
        {
          title: "Review must be governed.",
          body: "AI review cannot depend on individual judgment or availability. It requires a persistent operational standard that can hold under acceleration.",
        },
      ],
    },

    route_cards: [
      {
        title: "About Measures Registry",
        route: "about_measures_registry",
        body: "Understand the registry framework for governable AI environments.",
      },
      {
        title: "Read Structural Drift",
        route: "structural_drift_publication",
        body: "Review the field note on recurring implementation failures and authority fragmentation.",
      },
      {
        title: "Reserve a Seat",
        route: "reserve_seat",
        body: "Begin the structured conversion pathway for your organization.",
      },
    ],
  }

  const { error: updateErr } = await supabase
    .from("measures_encounter_def")
    .update({ metadata: updatedMetadata })
    .eq("encounter_key", "measures_phases_reveal")

  if (updateErr) { console.error("Update error:", updateErr); process.exit(1) }

  // --- readback ---
  const { data: after, error: afterErr } = await supabase
    .from("measures_encounter_def")
    .select("encounter_key, display_title, metadata")
    .eq("encounter_key", "measures_phases_reveal")
    .single()

  if (afterErr) { console.error("Readback error:", afterErr); process.exit(1) }

  const m = after.metadata || {}
  console.log("\nAFTER — styling_contract.material_family:", m.styling_contract?.material_family)
  console.log("AFTER — styling_contract.surface_mode:", m.styling_contract?.surface_mode)
  console.log("AFTER — styling_contract.background_mode:", m.styling_contract?.background_mode)
  console.log("AFTER — layout_contract.layout_mode:", m.layout_contract?.layout_mode)
  console.log("AFTER — layout_contract.viewport_fit:", m.layout_contract?.viewport_fit)
  console.log("AFTER — eyebrow:", m.eyebrow)
  console.log("AFTER — title:", m.title)
  console.log("AFTER — subtitle:", m.subtitle)
  console.log("AFTER — content_contract.requirements count:", m.content_contract?.requirements?.length)
  console.log("AFTER — route_cards count:", m.route_cards?.length)
  console.log("AFTER — route_cards routes:", m.route_cards?.map(c => c.route))
  console.log("\n✓ measures_phases_reveal seated")
})()
