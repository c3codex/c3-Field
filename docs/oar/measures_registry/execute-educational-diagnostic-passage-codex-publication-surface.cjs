require("dotenv").config({ path: ".env" })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing")

const supabase = createClient(supabaseUrl, supabaseKey)

const campaignKey = "agents_of_chaos_integrity_governance"
const registryKey = "measures_registry_landing"
const source = "educational_diagnostic_passage_codex_publication_surface_v1"
const bucket = "measures-registry"

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function upsertEncounter(payload) {
  await assertOk(
    await supabase
      .from("measures_registry")
      .upsert(
        {
          registry_key: payload.encounter_key,
          display_title: payload.display_title,
          registry_family: "spine",
          encounter_type: "view",
          material_family: "obsidian",
          sequence_order: payload.sequence_order,
          release_state: "released",
          access_state: "callable",
          is_active: true,
          metadata: { source, parent: registryKey },
        },
        { onConflict: "registry_key" },
      ),
    `${payload.encounter_key} registry upsert failed`,
  )

  const [registry] = await assertOk(
    await supabase.from("measures_registry").select("id").eq("registry_key", payload.encounter_key).limit(1),
    `${payload.encounter_key} registry lookup failed`,
  )
  if (!registry) throw new Error(`${payload.encounter_key} registry row missing`)

  const existing = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, metadata")
      .eq("encounter_key", payload.encounter_key)
      .limit(1),
    `${payload.encounter_key} lookup failed`,
  )

  if (existing.length > 0) {
    await assertOk(
      await supabase
        .from("measures_encounter_def")
        .update({
          display_title: payload.display_title,
          sequence_order: payload.sequence_order,
          is_entry_surface: payload.is_entry_surface,
          is_active: true,
          metadata: { ...(existing[0].metadata ?? {}), ...payload.metadata },
        })
        .eq("id", existing[0].id),
      `${payload.encounter_key} update failed`,
    )
    return "updated"
  }

  await assertOk(
    await supabase.from("measures_encounter_def").insert({
      registry_id: registry.id,
      encounter_key: payload.encounter_key,
      display_title: payload.display_title,
      encounter_type: "view",
      material_family: "obsidian",
      surface_type: "threshold",
      sequence_order: payload.sequence_order,
      pause_allowed: true,
      is_entry_surface: payload.is_entry_surface,
      is_active: true,
      metadata: payload.metadata,
    }),
    `${payload.encounter_key} insert failed`,
  )
  return "inserted"
}

async function findStorageAsset(fileName, aliases = []) {
  const candidates = [fileName, ...aliases]
  const prefixes = ["", "measures_registry", "measures_registry/images", "measures_registry/landing/images"]

  for (const prefix of prefixes) {
    for (const candidate of candidates) {
      const files = await assertOk(
        await supabase.storage.from(bucket).list(prefix, { search: candidate, limit: 100 }),
        `storage lookup failed for ${prefix || "/"}`,
      )
      const exact = files.find((file) => file.name === candidate)
      if (exact) {
        return {
          path: prefix ? `${prefix}/${candidate}` : candidate,
          resolvedAsset: candidate,
          size: exact.metadata?.size ?? exact.metadata?.contentLength ?? null,
        }
      }
    }
  }

  throw new Error(`Storage asset missing: ${fileName}`)
}

async function upsertMediaRole({ role, file, aliases, mimeType, sortOrder }) {
  const resolved = await findStorageAsset(file, aliases)
  const payload = {
    registry_key: registryKey,
    encounter_key: "educate_eval_encounter",
    campaign_key: campaignKey,
    media_role: role,
    storage_bucket: bucket,
    storage_path: resolved.path,
    mime_type: mimeType,
    sort_order: sortOrder,
    is_active: true,
    metadata: {
      source,
      expected_asset: file,
      accepted_aliases: aliases ?? [],
      resolved_asset: resolved.resolvedAsset,
      resolved_path: resolved.path,
      storage_size: resolved.size,
      surface: "codex_publication_resource",
    },
  }

  const existing = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("id")
      .eq("campaign_key", campaignKey)
      .eq("media_role", role)
      .limit(1),
    `${role} lookup failed`,
  )

  if (existing.length > 0) {
    await assertOk(await supabase.from("measures_media_map").update(payload).eq("id", existing[0].id), `${role} update failed`)
    return { role, operation: "updated", ...resolved }
  }

  await assertOk(await supabase.from("measures_media_map").insert(payload), `${role} insert failed`)
  return { role, operation: "inserted", ...resolved }
}

async function main() {
  await assertOk(await supabase.from("measures_registry").select("id").limit(1), "DB connection failed")

  const passageOperation = await upsertEncounter({
    encounter_key: "educational_diagnostic_passage",
    display_title: "Educational Diagnostic Passage",
    sequence_order: 1003,
    is_entry_surface: false,
    metadata: {
      function_layer: "education_diagnostic",
      state_expression: "public_educational_diagnostic_passage",
      renderer: "diagnostic_explainer_passage",
      eyebrow: "Recognition Passage",
      title: "Before evaluation, recognize the environment.",
      subtitle:
        "This passage frames instability, ambiguity, and unresolved AI propagation before the institution enters diagnostic evaluation.",
      media_roles: ["explainer_video"],
      actions: [
        {
          action_key: "continue_to_evaluation",
          label: "Continue to Evaluation",
          behavior: "route_surface",
          target_encounter_key: "educate_eval_encounter",
        },
      ],
      source_educational_diagnostic_passage: source,
    },
  })

  const [landing] = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, metadata")
      .eq("encounter_key", "landing_root")
      .limit(1),
    "landing_root lookup failed",
  )
  if (!landing) throw new Error("landing_root missing")

  const landingMetadata = landing.metadata ?? {}
  const landingActions = Array.isArray(landingMetadata.actions) ? landingMetadata.actions : []
  const patchedActions = landingActions.map((action) =>
    action?.action_key === "route_educate_eval"
      ? { ...action, target_encounter_key: "educational_diagnostic_passage" }
      : action,
  )

  await assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({
        metadata: {
          ...landingMetadata,
          actions: patchedActions,
          source_left_path_passage_route: source,
        },
      })
      .eq("id", landing.id),
    "landing_root route patch failed",
  )

  const [educate] = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, metadata")
      .eq("encounter_key", "educate_eval_encounter")
      .limit(1),
    "educate_eval_encounter lookup failed",
  )
  if (!educate) throw new Error("educate_eval_encounter missing")

  const publicationMedia = await upsertMediaRole({
    role: "paragraph_agents_of_chaos",
    file: "paragraph_agents_of_chaos.webp",
    aliases: ["paragraph_agents_of_chaos.png", "paragraph_cover_agents_of_chaos.webp"],
    mimeType: "image/png",
    sortOrder: 60,
  })

  const educateMetadata = educate.metadata ?? {}
  await assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({
        metadata: {
          ...educateMetadata,
          media_roles: ["paragraph_agents_of_chaos"],
          featured_publication: {
            title: "Agents of Chaos",
            subtitle:
              "A Measures Registry publication context for recognizing unresolved AI behavior, authority absence, and the need for governed evaluation.",
            url: "https://paragraph.xyz/@measuresregistry",
            source: "Paragraph",
            handle: "@measuresregistry",
            context: "Measures Registry publication",
            registry_relevance:
              "This publication supports the diagnostic chamber by naming why uncontrolled propagation and unstable interpretation must be evaluated before institutional scale.",
            subscription_available: true,
            media_role: "paragraph_agents_of_chaos",
          },
          subscription_entry: {
            title: "Receive Registry Dispatches",
            body:
              "Subscribe for Measures Registry publication updates, diagnostic context, and institutional governance dispatches.",
            label: "Subscribe to Measures Registry",
            url: "https://paragraph.xyz/@measuresregistry",
            source: "Paragraph",
          },
          source_publication_surface: source,
        },
      })
      .eq("id", educate.id),
    "educate_eval_encounter publication patch failed",
  )

  const rows = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .in("encounter_key", ["landing_root", "educational_diagnostic_passage", "educate_eval_encounter"]),
    "validation encounter lookup failed",
  )

  const mediaRows = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("media_role, storage_bucket, storage_path, mime_type, is_active")
      .eq("campaign_key", campaignKey)
      .in("media_role", ["explainer_video", "paragraph_agents_of_chaos"])
      .eq("is_active", true)
      .order("media_role"),
    "validation media lookup failed",
  )

  const rowByKey = new Map(rows.map((row) => [row.encounter_key, row]))
  const landingRoute = rowByKey
    .get("landing_root")
    ?.metadata?.actions?.find((action) => action.action_key === "route_educate_eval")

  console.log(JSON.stringify({
    dbConnection: "active",
    source,
    passageOperation,
    leftPathTarget: landingRoute?.target_encounter_key ?? null,
    passageRenderer: rowByKey.get("educational_diagnostic_passage")?.metadata?.renderer ?? null,
    educateRenderer: rowByKey.get("educate_eval_encounter")?.metadata?.renderer ?? null,
    educateMediaRoles: rowByKey.get("educate_eval_encounter")?.metadata?.media_roles ?? [],
    featuredPublicationSeated: Boolean(rowByKey.get("educate_eval_encounter")?.metadata?.featured_publication),
    subscriptionEntrySeated: Boolean(rowByKey.get("educate_eval_encounter")?.metadata?.subscription_entry),
    publicationMedia,
    mediaRows,
  }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
