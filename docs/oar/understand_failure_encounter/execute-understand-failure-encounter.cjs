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

const campaignKey = "agents_of_chaos_integrity_governance"
const encounterKey = "understand_failure"
const optionalMediaRoles = [
  "unstable_network",
  "partial_geometry",
  "failed_alignment_sequences",
]

async function assertOk(result, label) {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message}`)
  }
  return result.data
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
          display_title: "UNDERSTAND FAILURE",
          registry_family: "spine",
          encounter_type: "view",
          material_family: "obsidian",
          sequence_order: 1030,
          release_state: "released",
          access_state: "callable",
          is_active: true,
          metadata: {
            role: "measures_registry_landing_encounter",
            source: "understand_failure_encounter_v1",
          },
        },
        { onConflict: "registry_key" },
      ),
    "Understand Failure registry row upsert failed",
  )

  const registryRows = await assertOk(
    await supabase
      .from("measures_registry")
      .select("id, registry_key")
      .in("registry_key", ["landing_path_choice", encounterKey]),
    "Registry row lookup failed",
  )

  const registryIdByKey = new Map(
    registryRows.map((row) => [row.registry_key, row.id]),
  )
  const understandRegistryId = registryIdByKey.get(encounterKey)

  if (!understandRegistryId) {
    throw new Error("Understand Failure registry id missing after upsert")
  }

  const encounterMetadata = {
    renderer: "generic_media_encounter",
    header: {
      title: "Measures Registry",
      mark_media_role: "registry_mark",
      actions: [
        {
          action_key: "back_to_path",
          label: "Back to Path",
          behavior: "route_surface",
          target_encounter_key: "landing_path_choice",
        },
      ],
    },
    entry_label: "UNDERSTAND FAILURE",
    entry_headline: "Your systems don't resolve.",
    entry_sub: "AI isn't failing.\nYour environment is.",
    breakdown_blocks: [
      "Outputs drift. Results change without cause.",
      "Decisions don't stabilize. Every pass produces a new answer.",
      "Systems don't align. Tools operate without shared structure.",
      "Scale increases noise. More input, less resolution.",
    ],
    resolution_shift: "This isn't an AI problem.\nIt's a system problem.",
    transition_statement:
      "You don't need better AI.\nYou need a system that resolves.",
    media_roles: optionalMediaRoles,
    actions: [
      {
        action_key: "build_coherence",
        label: "BUILD COHERENCE",
        behavior: "route_surface",
        target_encounter_key: "reserve_seat",
      },
      {
        action_key: "back_to_path",
        label: "Back to Path",
        behavior: "route_surface",
        target_encounter_key: "landing_path_choice",
      },
    ],
  }

  await assertOk(
    await supabase
      .from("measures_encounter_def")
      .upsert(
        {
          registry_id: understandRegistryId,
          encounter_key: encounterKey,
          display_title: "UNDERSTAND FAILURE",
          encounter_type: "view",
          material_family: "obsidian",
          surface_type: "threshold",
          sequence_order: 1030,
          pause_allowed: true,
          is_entry_surface: false,
          is_active: true,
          metadata: encounterMetadata,
        },
        { onConflict: "registry_id" },
      ),
    "Understand Failure encounter upsert failed",
  )

  const pathRows = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, metadata")
      .eq("encounter_key", "landing_path_choice")
      .limit(1),
    "Landing path choice lookup failed",
  )

  const pathRow = pathRows[0]
  if (pathRow?.metadata) {
    const metadata = pathRow.metadata

    metadata.actions = (metadata.actions ?? []).map((action) =>
      action?.action_key === "explore_system"
        ? { ...action, target_encounter_key: encounterKey }
        : action,
    )

    metadata.plaques = (metadata.plaques ?? []).map((plaque) =>
      plaque?.action_key === "explore_system"
        ? { ...plaque, action_label: "Explore System" }
        : plaque,
    )

    await assertOk(
      await supabase
        .from("measures_encounter_def")
        .update({ metadata })
        .eq("id", pathRow.id),
      "Landing path choice action retarget failed",
    )
  }

  const seated = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .eq("encounter_key", encounterKey)
      .limit(1),
    "Understand Failure verification failed",
  )

  const media = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("media_role, storage_bucket, storage_path, is_active")
      .eq("campaign_key", campaignKey)
      .in("media_role", optionalMediaRoles)
      .eq("is_active", true),
    "Understand Failure media verification failed",
  )

  const seatedMediaRoles = new Set(media.map((row) => row.media_role))
  const missingMediaRoles = optionalMediaRoles.filter((role) => !seatedMediaRoles.has(role))
  const metadata = seated[0]?.metadata ?? {}

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        understandFailureEncounterSeated: seated.length === 1,
        renderer: metadata.renderer,
        sectionsPresent: [
          "entry_label",
          "entry_headline",
          "entry_sub",
          "breakdown_blocks",
          "resolution_shift",
          "transition_statement",
          "actions",
        ].every((key) => Boolean(metadata[key])),
        breakdownBlockCount: metadata.breakdown_blocks?.length ?? 0,
        optionalMediaRoles,
        seatedMediaRoles: [...seatedMediaRoles],
        missingMediaRoles,
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
