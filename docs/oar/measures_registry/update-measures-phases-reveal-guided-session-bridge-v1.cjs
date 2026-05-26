// OAR2 — reseat measures_phases_reveal guided session conversion bridge
// Run: node docs/oar/measures_registry/update-measures-phases-reveal-guided-session-bridge-v1.cjs

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
  console.log("BEFORE — content_contract keys:", Object.keys(before.metadata?.content_contract || {}))
  console.log("BEFORE — route_cards count:", before.metadata?.route_cards?.length)

  const existing = before.metadata || {}

  const updatedMetadata = {
    ...existing,

    eyebrow: "FOUNDATIONAL CONVERSION PATHWAY",
    title: "Three Guided Sessions. Six Retained Assets.",
    subtitle: "Measures Registry begins with a structured review of your AI operating environment, then converts that review into retained governance assets your organization can use.",

    styling_contract: {
      ...( existing.styling_contract || {} ),
      material_family: "lapis",
      foundation_material: "lapis",
      surface_mode: "guided_conversion_bridge",
      background_mode: "codexstone_lapis_field",
      material_texture_visibility: true,
    },

    layout_contract: {
      ...( existing.layout_contract || {} ),
      layout_mode: "guided_session_conversion_bridge",
      viewport_fit: "single_screen_initial_view",
      session_layout: "three_session_grid",
      asset_count: 6,
      primary_cta_route: "reserve_seat",
      support_links_visible: true,
      footer_visibility: "visible",
      mobile_layout: "single_column_scroll_allowed",
    },

    content_contract: {
      asset_total: 6,
      video_candidate: {
        enabled: false,
        role: "phase_reveal_explainer",
        standing: "future_candidate",
      },
      guided_sessions: [
        {
          session_number: "01",
          title: "Name the Operating Environment",
          body: "Identify the systems, tools, automations, decision points, and authority gaps currently shaping AI output.",
          retained_assets: [
            "Operating Environment Map",
            "Authority + Runtime Surface Inventory",
          ],
        },
        {
          session_number: "02",
          title: "Register Behavior and Review Pathways",
          body: "Document how AI-generated output enters decisions, where review occurs, and where responsibility currently fragments.",
          retained_assets: [
            "AI Behavior Pathway Register",
            "Review + Approval Pathway Map",
          ],
        },
        {
          session_number: "03",
          title: "Structure the Response",
          body: "Define the operational standard, role boundaries, and next-step governance pathway needed to support safe acceleration.",
          retained_assets: [
            "Structural Drift Assessment",
            "Recommended Response Framework",
          ],
        },
      ],
    },

    route_cards: [
      {
        title: "Reserve a Seat",
        route: "reserve_seat",
        body: "Begin the structured conversion pathway for your organization.",
        priority: "primary",
      },
      {
        title: "About Measures Registry",
        route: "about_measures_registry",
        body: "Understand the registry framework for governable AI environments.",
        priority: "support",
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
  console.log("AFTER — layout_contract.asset_count:", m.layout_contract?.asset_count)
  console.log("AFTER — layout_contract.primary_cta_route:", m.layout_contract?.primary_cta_route)
  console.log("AFTER — eyebrow:", m.eyebrow)
  console.log("AFTER — title:", m.title)
  console.log("AFTER — subtitle:", m.subtitle?.slice(0, 60) + "...")
  console.log("AFTER — content_contract.asset_total:", m.content_contract?.asset_total)
  console.log("AFTER — content_contract.guided_sessions count:", m.content_contract?.guided_sessions?.length)
  console.log("AFTER — content_contract.guided_sessions[0].title:", m.content_contract?.guided_sessions?.[0]?.title)
  console.log("AFTER — content_contract.guided_sessions[0].retained_assets:", m.content_contract?.guided_sessions?.[0]?.retained_assets)
  console.log("AFTER — content_contract.guided_sessions[1].title:", m.content_contract?.guided_sessions?.[1]?.title)
  console.log("AFTER — content_contract.guided_sessions[2].title:", m.content_contract?.guided_sessions?.[2]?.title)
  console.log("AFTER — route_cards count:", m.route_cards?.length)
  console.log("AFTER — route_cards:", m.route_cards?.map(c => `${c.route} [${c.priority}]`))
  console.log("AFTER — content_contract.video_candidate.enabled:", m.content_contract?.video_candidate?.enabled)
  console.log("\n✓ measures_phases_reveal reseated as guided session conversion bridge")
})()
