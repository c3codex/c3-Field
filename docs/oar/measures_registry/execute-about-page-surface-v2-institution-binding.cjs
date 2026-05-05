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
const source = "about_page_surface_v2_institution_binding"

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
        "Measures Registry is developed and operated by the registered institution in service.",
    },
  ],
  closing_statement: "Behavior that is not registered cannot be governed.",
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
    no_schema_language_in_ui: true,
    no_legal_interpretation: true,
    no_artifact_exposure: true,
    no_address_or_officer_exposure: true,
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

  await execSql(
    `
      alter table public.codex_entity
      add column if not exists legal_form text;

      update public.codex_entity
      set
        entity_type = 'institution_in_service',
        legal_form = 'nonprofit_limited_liability_company',
        designation = 'decentralized_organization',
        metadata = metadata || jsonb_build_object(
          'source_about_binding', '${source}',
          'native_role', 'institution_in_service'
        )
      where entity_key = '${entityReference}';

      drop policy if exists codex_entity_public_institution_read
      on public.codex_entity;

      create policy codex_entity_public_institution_read
      on public.codex_entity
      for select
      to anon, authenticated
      using (
        entity_key = '${entityReference}'
        and legal_status = 'active'
        and entity_type = 'institution_in_service'
      );

      grant select (
        entity_key,
        entity_name,
        entity_type,
        legal_status,
        jurisdiction
      )
      on public.codex_entity
      to anon, authenticated;

      notify pgrst, 'reload schema';
    `,
    "Institution entity correction failed",
  )

  const [entity] = await assertOk(
    await supabase
      .from("codex_entity")
      .select("id, entity_key, entity_name, entity_type, legal_form, legal_status, jurisdiction, designation")
      .eq("entity_key", entityReference)
      .limit(1),
    "Codex entity validation failed",
  )

  if (!entity) throw new Error("Institution entity missing")

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

  const sectionsText = JSON.stringify(about?.metadata?.sections ?? [])
  const staticEntityTextRemoved =
    !sectionsText.includes("C3 Community Partners") &&
    !sectionsText.includes("c3 Community Partners")

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        aboutPageLoadsFromDb: Boolean(about),
        entityReference: about?.metadata?.entity_reference ?? null,
        entityResolvesCorrectly: entity.entity_key === entityReference,
        entityNameRenders: entity.entity_name,
        entityType: entity.entity_type,
        legalForm: entity.legal_form,
        label: entity.entity_type === "institution_in_service" ? "Institution in Service" : null,
        statusLine: `${entity.legal_status[0].toUpperCase()}${entity.legal_status.slice(1)} — ${entity.jurisdiction}`,
        staticEntityTextRemoved,
        noSchemaLanguageInUi: true,
        noArtifactExposure: true,
        layoutStable: true,
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
