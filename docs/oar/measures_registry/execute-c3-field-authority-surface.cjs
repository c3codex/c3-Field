require("dotenv").config({ path: ".env" })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase credentials missing")
}

const supabase = createClient(supabaseUrl, supabaseKey)
const source = "c3_field_authority_surface_v1"
const encounterKey = "c3_field"
const legacyAboutKey = "orientation_placeholder"

const title = "c3 Field"
const paragraphs = [
  "Measures Registry operates within the c3 Field — a registry-governed environment where behavior is defined, verified, and enforced through structured state.",
  "It is developed and operated by c3 Community Partners DAO, LLC.",
  "This structure is not conventional.\nIt is intentional.\nIt is what allows AI systems to resolve, stabilize, and scale without drift.\nMeasures Registry is not technology.\nIt is the environment in which technology can scale without collapse.",
  "The system aligns interoperable functions without collapsing distinct identity.",
  "Without defined authority, systems drift.\nWithout structured relation, they fragment.\nWithout enforced sequence, they destabilize.\nWithout registered execution, they cannot be governed.",
  "No interface defines behavior.\nNo output is accepted without registration.",
  "Participation, conversion, and recognition occur only through the registry.",
]

const authorityMetadata = {
  function_layer: "authority",
  state_expression: "public_authority_surface",
  renderer: "static_authority_surface",
  title,
  paragraphs,
  actions: [],
  constraints: {
    no_cta: true,
    no_buttons_inside_content: true,
    no_links_embedded: true,
    no_cards: true,
    no_panels: true,
    no_icons: true,
    no_section_dividers: true,
    read_only: true,
    no_frontend_authored_copy: true,
  },
  source,
}

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function normalizeHeaderAction(action) {
  if (!action || typeof action !== "object") return action
  const key = action.action_key
  const target = action.target_encounter_key

  if (key === "about" || target === legacyAboutKey || action.label === "About") {
    return {
      ...action,
      action_key: "c3_field",
      label: "c3 Field",
      behavior: "route_surface",
      target_encounter_key: encounterKey,
    }
  }

  return action
}

async function main() {
  await assertOk(
    await supabase.from("measures_registry").select("id").limit(1),
    "DB connection failed",
  )

  await assertOk(
    await supabase
      .from("measures_registry")
      .upsert(
        {
          registry_key: encounterKey,
          display_title: title,
          registry_family: "spine",
          encounter_type: "view",
          material_family: "obsidian",
          sequence_order: 1030,
          release_state: "released",
          access_state: "callable",
          is_active: true,
          metadata: {
            role: "measures_registry_authority_surface",
            surface_type: "static_authority_surface",
            source,
          },
        },
        { onConflict: "registry_key" },
      ),
    "c3 Field registry upsert failed",
  )

  const [registry] = await assertOk(
    await supabase
      .from("measures_registry")
      .select("id")
      .eq("registry_key", encounterKey)
      .limit(1),
    "c3 Field registry lookup failed",
  )

  if (!registry) throw new Error("c3 Field registry row missing")

  const existing = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id")
      .eq("encounter_key", encounterKey)
      .limit(1),
    "c3 Field encounter lookup failed",
  )

  const payload = {
    registry_id: registry.id,
    encounter_key: encounterKey,
    display_title: title,
    encounter_type: "view",
    material_family: "obsidian",
    surface_type: "threshold",
    sequence_order: 1030,
    pause_allowed: true,
    is_entry_surface: false,
    is_active: true,
    metadata: authorityMetadata,
  }

  if (existing.length > 0) {
    await assertOk(
      await supabase
        .from("measures_encounter_def")
        .update({
          display_title: payload.display_title,
          encounter_type: payload.encounter_type,
          material_family: payload.material_family,
          surface_type: payload.surface_type,
          sequence_order: payload.sequence_order,
          pause_allowed: payload.pause_allowed,
          is_entry_surface: payload.is_entry_surface,
          is_active: payload.is_active,
          metadata: payload.metadata,
        })
        .eq("id", existing[0].id),
      "c3 Field encounter update failed",
    )
  } else {
    await assertOk(
      await supabase.from("measures_encounter_def").insert(payload),
      "c3 Field encounter insert failed",
    )
  }

  const landingRows = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, metadata")
      .eq("encounter_key", "landing_path_choice")
      .limit(1),
    "Landing path choice lookup failed",
  )

  if (landingRows.length === 0) throw new Error("landing_path_choice row missing")
  const landing = landingRows[0]
  const metadata = landing.metadata ?? {}
  const header = metadata.header && typeof metadata.header === "object" ? metadata.header : {}
  const headerActions = Array.isArray(header.actions) ? header.actions.map(normalizeHeaderAction) : []
  const hasC3FieldAction = headerActions.some(
    (action) => action?.action_key === "c3_field" || action?.target_encounter_key === encounterKey,
  )
  const nextHeaderActions = hasC3FieldAction
    ? headerActions
    : [
        ...headerActions,
        {
          action_key: "c3_field",
          label: "c3 Field",
          behavior: "route_surface",
          target_encounter_key: encounterKey,
        },
      ]

  await assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({
        metadata: {
          ...metadata,
          header: {
            ...header,
            actions: nextHeaderActions,
          },
          source_authority_surface: source,
        },
      })
      .eq("id", landing.id),
    "Landing header update failed",
  )

  await assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({ is_active: false })
      .eq("encounter_key", legacyAboutKey),
    "Legacy About encounter retirement failed",
  )

  await assertOk(
    await supabase
      .from("measures_registry")
      .update({ is_active: false })
      .eq("registry_key", legacyAboutKey),
    "Legacy About registry retirement failed",
  )

  const validationRows = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, display_title, surface_type, is_active, metadata")
      .in("encounter_key", [encounterKey, legacyAboutKey, "landing_path_choice"]),
    "Validation load failed",
  )

  const byKey = new Map(validationRows.map((row) => [row.encounter_key, row]))
  const c3Field = byKey.get(encounterKey)
  const legacyAbout = byKey.get(legacyAboutKey)
  const landingAfter = byKey.get("landing_path_choice")
  const landingHeaderActions = landingAfter?.metadata?.header?.actions ?? []
  const contentExact =
    c3Field?.metadata?.title === title &&
    JSON.stringify(c3Field?.metadata?.paragraphs ?? []) === JSON.stringify(paragraphs)
  const labelUpdated = JSON.stringify(landingHeaderActions).includes('"label":"c3 Field"')
  const noAboutRoute = !JSON.stringify(landingHeaderActions).includes(legacyAboutKey)

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        surfaceKey: c3Field?.encounter_key ?? null,
        displayTitle: c3Field?.display_title ?? null,
        surfaceType: c3Field?.surface_type ?? null,
        contentExact,
        paragraphCount: c3Field?.metadata?.paragraphs?.length ?? 0,
        actionsInsideContent: c3Field?.metadata?.actions?.length ?? null,
        layoutConstraints: c3Field?.metadata?.constraints ?? null,
        navigationLabelUpdated: labelUpdated,
        noLegacyAboutTargetInHeader: noAboutRoute,
        legacyAboutActive: legacyAbout?.is_active ?? null,
        autoRoute: "none",
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
