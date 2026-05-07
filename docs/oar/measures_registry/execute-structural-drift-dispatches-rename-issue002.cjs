require("dotenv").config({ path: ".env" })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing")

const supabase = createClient(supabaseUrl, supabaseKey)
const source = "structural_drift_dispatches_rename_issue002_v1"
const priorEncounterKey = "structural_drift_field_guide"
const encounterKey = "structural_drift_dispatches"
const publicationKey = "structural_drift"
const issue001DispatchKey = "agents_of_chaos_dispatch_v1"
const issue002DispatchKey = "structural_drift_dispatch_v1"
const campaignKey = "agents_of_chaos_integrity_governance"
const registryParent = "measures_registry_landing"
const bucket = "measures-registry"
const featuredImageRole = "structural_drift_featured_image"
const featuredImagePath = "structural_drift.webp"

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function execSql(sql, label) {
  const { error } = await supabase.rpc("exec_sql", { sql })
  if (error) throw new Error(`${label}: ${error.message}`)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function withSchemaRetry(operation, label) {
  let lastError = null

  for (let attempt = 1; attempt <= 6; attempt += 1) {
    const result = await operation()
    if (!result.error) return result.data
    lastError = result.error
    if (!/schema cache|Could not find|does not exist/.test(result.error.message)) break
    await sleep(1500)
  }

  throw new Error(`${label}: ${lastError?.message ?? "unknown error"}`)
}

async function main() {
  await assertOk(await supabase.from("measures_registry").select("id").limit(1), "DB connection failed")

  await execSql(`
    alter table public.measures_publication_dispatch
      add column if not exists issue_number text,
      add column if not exists article_url text;

    notify pgrst, 'reload schema';
  `, "publication dispatch schema migration failed")

  await sleep(1500)

  const storageRows = await assertOk(
    await supabase.storage.from(bucket).list("", { search: featuredImagePath, limit: 100 }),
    "structural drift featured image storage lookup failed",
  )
  const featuredImage = storageRows.find((file) => file.name === featuredImagePath)

  if (featuredImage) {
    const mediaPayload = {
      registry_key: registryParent,
      encounter_key: encounterKey,
      campaign_key: campaignKey,
      media_role: featuredImageRole,
      storage_bucket: bucket,
      storage_path: featuredImagePath,
      mime_type: "image/webp",
      sort_order: 62,
      is_active: true,
      metadata: {
        source,
        storage_size: featuredImage.metadata?.size ?? featuredImage.metadata?.contentLength ?? null,
      },
    }

    const existingMedia = await assertOk(
      await supabase
        .from("measures_media_map")
        .select("id")
        .eq("campaign_key", campaignKey)
        .eq("media_role", featuredImageRole)
        .limit(1),
      "structural drift featured image media lookup failed",
    )

    if (existingMedia.length > 0) {
      await assertOk(
        await supabase.from("measures_media_map").update(mediaPayload).eq("id", existingMedia[0].id),
        "structural drift featured image media update failed",
      )
    } else {
      await assertOk(
        await supabase.from("measures_media_map").insert(mediaPayload),
        "structural drift featured image media insert failed",
      )
    }
  }

  await assertOk(
    await supabase
      .from("measures_registry")
      .upsert(
        {
          registry_key: encounterKey,
          display_title: "Structural Drift",
          registry_family: "spine",
          encounter_type: "view",
          material_family: "obsidian",
          sequence_order: 1045,
          release_state: "released",
          access_state: "callable",
          is_active: true,
          metadata: { source, parent: registryParent, publication_key: publicationKey },
        },
        { onConflict: "registry_key" },
      ),
    "structural_drift_dispatches registry upsert failed",
  )

  await assertOk(
    await supabase
      .from("measures_registry")
      .update({
        release_state: "released",
        access_state: "callable",
        is_active: false,
        metadata: {
          source,
          replaced_by: encounterKey,
          prior_encounter_key: priorEncounterKey,
        },
      })
      .eq("registry_key", priorEncounterKey),
    "prior field guide registry deactivation failed",
  )

  const [registry] = await assertOk(
    await supabase.from("measures_registry").select("id").eq("registry_key", encounterKey).limit(1),
    "structural_drift_dispatches registry lookup failed",
  )
  if (!registry) throw new Error("structural_drift_dispatches registry row missing")

  const dispatchesMetadata = {
    function_layer: "publication_surface",
    state_expression: "native_structural_drift_dispatches",
    renderer: "structural_drift_dispatches",
    marker: "MEASURES REGISTRY ANALYSIS SURFACE",
    title: "Structural Drift",
    subtitle: "Dispatches from the Measures Registry",
    publication_key: publicationKey,
    publication_role: "registered_observation_surface",
    media_roles: [featuredImageRole],
    layout_order: [
      "registry_marker",
      "publication_masthead",
      "featured_dispatch",
      "dispatch_index",
      "evaluation_cta",
      "footer",
    ],
    actions: [
      {
        action_key: "route_structural_drift_article",
        label: "Open Structural Drift",
        behavior: "route_surface",
        target_encounter_key: encounterKey,
      },
      {
        action_key: "begin_structural_evaluation",
        label: "Begin Structural Evaluation",
        behavior: "route_surface",
        target_encounter_key: "iis_eval_gate1",
      },
    ],
    footer: {
      copyright: "© 2026 c3 Community Partners DAO, LLC",
      system_statement: "Measures Registry is a registered c3 Field system.",
      link_label: "c3 Field",
      target_encounter_key: "c3_field",
    },
    constraints: {
      paragraph_distribution_only: true,
      no_article_card_hardcoding: true,
      no_slug_authority: true,
      no_placeholder_dispatches: true,
    },
    source_structural_drift_dispatches: source,
  }

  const existingDispatches = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, metadata")
      .eq("encounter_key", encounterKey)
      .limit(1),
    "structural_drift_dispatches lookup failed",
  )

  if (existingDispatches.length > 0) {
    await assertOk(
      await supabase
        .from("measures_encounter_def")
        .update({
          display_title: "Structural Drift",
          sequence_order: 1045,
          is_active: true,
          metadata: { ...(existingDispatches[0].metadata ?? {}), ...dispatchesMetadata },
        })
        .eq("id", existingDispatches[0].id),
      "structural_drift_dispatches update failed",
    )
  } else {
    await assertOk(
      await supabase.from("measures_encounter_def").insert({
        registry_id: registry.id,
        encounter_key: encounterKey,
        display_title: "Structural Drift",
        encounter_type: "view",
        material_family: "obsidian",
        surface_type: "threshold",
        sequence_order: 1045,
        pause_allowed: true,
        is_entry_surface: false,
        is_active: true,
        metadata: dispatchesMetadata,
      }),
      "structural_drift_dispatches insert failed",
    )
  }

  await assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({
        is_active: false,
        metadata: {
          source,
          replaced_by: encounterKey,
          prior_encounter_key: priorEncounterKey,
        },
      })
      .eq("encounter_key", priorEncounterKey),
    "prior field guide encounter deactivation failed",
  )

  const [issue001] = await withSchemaRetry(
    () =>
      supabase
        .from("measures_publication_dispatch")
        .select("metadata, external_url, article_url")
        .eq("dispatch_key", issue001DispatchKey)
        .limit(1),
    "issue 001 lookup failed",
  )
  if (!issue001) throw new Error("ISSUE 001 dispatch missing")

  await assertOk(
    await supabase
      .from("measures_publication_dispatch")
      .update({
        title: "Agents of Chaos",
        issue_number: "ISSUE 001",
        article_url: issue001.article_url ?? issue001.external_url ?? "https://paragraph.com/@measures-registry/agents-of-chaos",
        metadata: {
          ...(issue001.metadata ?? {}),
          issue_number: "ISSUE 001",
          dispatch_type: "FIELD NOTE",
          diagnostic_thesis:
            "Behavior that is not registered cannot be governed.",
          capture_source: "structural_drift_dispatch",
          source_issue_ordering: source,
        },
      })
      .eq("dispatch_key", issue001DispatchKey),
    "ISSUE 001 dispatch ordering update failed",
  )

  const issue002Payload = {
    publication_key: publicationKey,
    dispatch_key: issue002DispatchKey,
    issue_number: "ISSUE 002",
    title: "Structural Drift",
    dispatch_body: "",
    excerpt: "When structure fails, intelligence amplifies instability.",
    seo_description: "A Measures Registry field note on Structural Drift.",
    tags: ["structural drift", "governance", "ai systems"],
    primary_cta: "Begin Structural Evaluation",
    secondary_cta: "Dispatches from the Measures Registry",
    references: [],
    media_manifest: {},
    internal_route: "/publication/structural_drift/structural_drift_dispatch_v1",
    external_platform: "paragraph",
    external_slug: "structural-drift",
    external_url: "https://paragraph.com/@measures-registry/structural-drift",
    article_url: "https://paragraph.com/@measures-registry/structural-drift",
    status: "published",
    published_at: "2026-05-06T00:00:00+00:00",
    metadata: {
      source,
      issue_number: "ISSUE 002",
      dispatch_type: "FIELD NOTE",
      diagnostic_thesis: "When structure fails, intelligence amplifies instability.",
      capture_source: "structural_drift_dispatch",
      article_url: "https://paragraph.com/@measures-registry/structural-drift",
      content_body_status: "not_seated",
      paragraph_distribution_only: true,
    },
  }

  await assertOk(
    await supabase
      .from("measures_publication_dispatch")
      .upsert(issue002Payload, { onConflict: "dispatch_key" }),
    "ISSUE 002 dispatch upsert failed",
  )

  const [educate] = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, metadata")
      .eq("encounter_key", "educate_eval_encounter")
      .limit(1),
    "educate_eval_encounter lookup failed",
  )

  if (educate) {
    const metadata = educate.metadata ?? {}
    const actions = Array.isArray(metadata.actions) ? metadata.actions : []
    const nextActions = actions.map((action) =>
      action?.action_key === "route_structural_drift_article"
        ? { ...action, target_encounter_key: encounterKey, label: action.label ?? "Open Structural Drift" }
        : action,
    )
    if (!nextActions.some((action) => action?.action_key === "route_structural_drift_article")) {
      nextActions.push({
        action_key: "route_structural_drift_article",
        label: "Open Structural Drift",
        behavior: "route_surface",
        target_encounter_key: encounterKey,
      })
    }

    await assertOk(
      await supabase
        .from("measures_encounter_def")
        .update({
          metadata: {
            ...metadata,
            actions: nextActions,
            structural_drift_dispatches: {
              encounter_key: encounterKey,
              publication_key: publicationKey,
              source,
            },
          },
        })
        .eq("id", educate.id),
      "educate_eval_encounter dispatch route patch failed",
    )
  }

  const registryRows = await assertOk(
    await supabase
      .from("measures_registry")
      .select("registry_key, release_state, access_state, is_active")
      .in("registry_key", [priorEncounterKey, encounterKey])
      .order("registry_key"),
    "registry validation failed",
  )

  const encounterRows = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, is_active, metadata")
      .in("encounter_key", [priorEncounterKey, encounterKey])
      .order("encounter_key"),
    "encounter validation failed",
  )

  const dispatchRows = await withSchemaRetry(
    () =>
      supabase
        .from("measures_publication_dispatch")
        .select("publication_key, dispatch_key, issue_number, title, article_url, status, metadata")
        .eq("publication_key", publicationKey)
        .order("issue_number", { ascending: true }),
    "dispatch validation failed",
  )

  console.log(JSON.stringify({
    dbConnection: "active",
    registryRows,
    encounterRows: encounterRows.map((row) => ({
      encounter_key: row.encounter_key,
      is_active: row.is_active,
      renderer: row.metadata?.renderer ?? null,
      publication_key: row.metadata?.publication_key ?? null,
    })),
    dispatchRows,
    activeEncounter: encounterRows.find((row) => row.encounter_key === encounterKey && row.is_active === true)?.encounter_key ?? null,
    duplicateActivePriorSurface: encounterRows.some((row) => row.encounter_key === priorEncounterKey && row.is_active === true),
    issue001: dispatchRows.find((row) => row.dispatch_key === issue001DispatchKey)?.title ?? null,
    issue002: dispatchRows.find((row) => row.dispatch_key === issue002DispatchKey)?.title ?? null,
    featuredImageStorageFound: Boolean(featuredImage),
  }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
