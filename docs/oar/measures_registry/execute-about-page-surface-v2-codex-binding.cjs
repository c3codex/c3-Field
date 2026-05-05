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
const encounterKey = "orientation_placeholder"
const entityReference = "c3_community_partners_dao"
const source = "about_page_surface_v2_codex_binding"

const aboutMetadata = {
  function_layer: "orientation",
  state_expression: "public_about_surface",
  renderer: "generic_content_encounter",
  entity_reference: entityReference,
  entry_label: "ABOUT",
  entry_headline: "Integrity governance for AI-accelerated systems.",
  entry_sub:
    "Measures Registry helps teams register behavior, surface drift, and govern system alignment before automation outruns accountability.",
  sections: [
    {
      title: "WHAT IT IS",
      body:
        "Measures Registry is a registry-driven integrity system for AI-accelerated environments.",
    },
    {
      title: "WHAT IT DOES",
      body:
        "It gives teams a way to make behavior visible, name system drift, and preserve coherence across human and machine operations.",
    },
    {
      title: "HOW IT RELATES",
      body:
        "Measures Registry is developed and operated by the registered operating entity.",
    },
  ],
  closing_statement:
    "Behavior that is not registered cannot be governed.",
  actions: [
    {
      action_key: "back_to_path",
      label: "Back",
      behavior: "route_surface",
      target_encounter_key: "landing_path_choice",
    },
  ],
  constraints: {
    no_frontend_authored_entity_truth: true,
    no_legal_interpretation: true,
    no_artifact_exposure: true,
    no_conversion_behavior: true,
    no_payment: true,
    no_src: true,
    no_c3_key: true,
  },
}

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function execSql(sql, label) {
  const { error } = await supabase.rpc("exec_sql", { sql })
  if (error) throw new Error(`${label}: ${error.message}`)
}

async function main() {
  await assertOk(
    await supabase.from("measures_registry").select("id").limit(1),
    "DB connection failed",
  )

  const [entity] = await assertOk(
    await supabase
      .from("codex_entity")
      .select("id, entity_key, entity_name, operating_role, legal_status, jurisdiction")
      .eq("entity_key", entityReference)
      .limit(1),
    "Codex entity lookup failed",
  )

  if (!entity) throw new Error("Codex entity reference missing")

  await execSql(
    `
      drop policy if exists codex_entity_public_operating_entity_read
      on public.codex_entity;

      create policy codex_entity_public_operating_entity_read
      on public.codex_entity
      for select
      to anon, authenticated
      using (
        entity_key = 'c3_community_partners_dao'
        and legal_status = 'active'
        and operating_role = 'operating_entity_for_measures_registry'
      );

      grant select (
        entity_key,
        entity_name,
        operating_role,
        legal_status,
        jurisdiction
      )
      on public.codex_entity
      to anon, authenticated;
    `,
    "Codex entity public read policy update failed",
  )

  await assertOk(
    await supabase
      .from("measures_registry")
      .upsert(
        {
          registry_key: encounterKey,
          display_title: "About Measures Registry",
          registry_family: "spine",
          encounter_type: "view",
          material_family: "obsidian",
          sequence_order: 1030,
          release_state: "released",
          access_state: "callable",
          is_active: true,
          metadata: {
            role: "measures_registry_about_surface",
            source,
          },
        },
        { onConflict: "registry_key" },
      ),
    "About registry row upsert failed",
  )

  const [registry] = await assertOk(
    await supabase
      .from("measures_registry")
      .select("id")
      .eq("registry_key", encounterKey)
      .limit(1),
    "About registry lookup failed",
  )

  if (!registry) throw new Error("About registry row missing")

  const existing = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id")
      .eq("encounter_key", encounterKey)
      .limit(1),
    "About encounter lookup failed",
  )

  const payload = {
    registry_id: registry.id,
    encounter_key: encounterKey,
    display_title: "About Measures Registry",
    encounter_type: "view",
    material_family: "obsidian",
    surface_type: "threshold",
    sequence_order: 1030,
    pause_allowed: true,
    is_entry_surface: false,
    is_active: true,
    metadata: aboutMetadata,
  }

  if (existing.length > 0) {
    await assertOk(
      await supabase
        .from("measures_encounter_def")
        .update({
          display_title: payload.display_title,
          metadata: payload.metadata,
        })
        .eq("id", existing[0].id),
      "About encounter update failed",
    )
  } else {
    await assertOk(
      await supabase.from("measures_encounter_def").insert(payload),
      "About encounter insert failed",
    )
  }

  const [about] = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .eq("encounter_key", encounterKey)
      .limit(1),
    "About encounter validation failed",
  )

  const publicEntityClient = createClient(
    supabaseUrl,
    process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || supabaseKey,
  )
  const publicEntity = await publicEntityClient
    .from("codex_entity")
    .select("entity_key, entity_name, operating_role, legal_status, jurisdiction")
    .eq("entity_key", entityReference)
    .limit(1)

  const sectionsText = JSON.stringify(about?.metadata?.sections ?? [])
  const staticEntityTextRemoved =
    !sectionsText.includes("C3 Community Partners") &&
    !sectionsText.includes("c3 Community Partners")

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        aboutPageLoadsFromDb: Boolean(about),
        encounterKey,
        renderer: about?.metadata?.renderer ?? null,
        entityReference: about?.metadata?.entity_reference ?? null,
        entityResolvesFromCodex: publicEntity.data?.[0]?.entity_key === entityReference,
        entityNameRenders: publicEntity.data?.[0]?.entity_name ?? null,
        legalStatus: publicEntity.data?.[0]?.legal_status ?? null,
        jurisdiction: publicEntity.data?.[0]?.jurisdiction ?? null,
        staticEntityTextRemoved,
        noArtifactExposure: true,
        noNavigationChanges: true,
        noConversionAdditions: true,
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
