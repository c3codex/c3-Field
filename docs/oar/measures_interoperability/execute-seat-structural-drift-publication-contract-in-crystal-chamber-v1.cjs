require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_C3_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and a Supabase write key are required")
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const SOURCE_OAR2 =
  "docs/oar/measures_interoperability/oar2_seat_structural_drift_publication_contract_in_crystal_chamber_v1.meta.md"
const TARGET_KEY = "structure_passage"
const PUBLICATION_KEY = "structural_drift"

const PUBLIC_COPY = [
  "Structural Drift: Dispatches from the Measures Registry examines how ungoverned systems begin to degrade before institutions can see the full operational impact.",
  "Read Structural Drift to understand why AI governance cannot be reduced to tools, prompts, policies, or more agents. It must include the system conditions that shape AI behavior.",
]

const PROHIBITED_PUBLIC_COPY = [
  "C1 / C2 / C3",
  "pricing",
  "payment",
  "wallet connect",
  "temp payment provider",
  "c3 Key assignment",
  "temp c3 Key assignment",
  "SRC binding mechanics",
  "permission standing",
  "recognition standing",
  "conversion standing",
  "certification standing",
  "Crystal Chamber",
  "Marble Governance Chamber",
  "Obsidian route",
  "Lapis route",
  "material-family chamber labels",
]

function clone(value) {
  return value == null ? {} : JSON.parse(JSON.stringify(value))
}

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function fetchPublicationReference() {
  const registryResult = await supabase
    .from("measures_publication_registry")
    .select("publication_key, title, status, external_url, metadata")
    .eq("publication_key", PUBLICATION_KEY)
    .maybeSingle()

  const dispatchResult = await supabase
    .from("measures_publication_dispatch")
    .select(
      "publication_key, dispatch_key, title, status, internal_route, article_url, external_url, metadata",
    )
    .eq("publication_key", PUBLICATION_KEY)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(1)

  const registry = registryResult.error ? null : registryResult.data
  const dispatch = dispatchResult.error ? null : dispatchResult.data?.[0] || null
  const seatedUrl =
    registry?.external_url ||
    dispatch?.article_url ||
    dispatch?.external_url ||
    dispatch?.internal_route ||
    null

  return {
    registry,
    dispatch,
    seatedUrl,
    source: seatedUrl
      ? registry?.external_url
        ? "measures_publication_registry.external_url"
        : dispatch?.article_url
          ? "measures_publication_dispatch.article_url"
          : dispatch?.external_url
            ? "measures_publication_dispatch.external_url"
            : "measures_publication_dispatch.internal_route"
      : null,
  }
}

function buildPublicationContract(publicationRef) {
  const hasSeatedUrl = Boolean(publicationRef.seatedUrl)

  return {
    version: "v1",
    source_oar2: SOURCE_OAR2,
    contract_key: "structural_drift_publication_contract",
    parent_chamber_contract: "crystal_chamber_contract",
    parent_encounter: "about_measures_registry_encounter",
    content_block_key: "structural_drift_publication_block",
    public_label: "Structural Drift: Dispatches from the Measures Registry",
    contract_type: "publication_contract",
    role: "public education / proof-of-thinking / structural drift orientation",
    visibility: "public",
    public_material_naming_allowed: false,
    renderer_rule: "render_seated_state_only",
    frontend_hardcode_allowed: false,
    runtime_final_pass_authorized: false,
    publication_purpose: [
      "explains how ungoverned AI-accelerated systems begin to degrade before institutions can see the full operational impact",
      "frames AI drift as an environmental and structural condition, not merely a model failure",
    ],
    public_copy: PUBLIC_COPY,
    placement_contract: {
      render_inside: "about_measures_registry_encounter",
      preferred_placement: [
        "after About Measures Registry core copy",
        "before Foundational Leadership block",
        "alongside or above the leadership invitation depending responsive layout",
      ],
      desktop: "publication card beside Foundational Leadership block",
      mobile: "publication card appears before Foundational Leadership block",
      hero: "may be teased, but not fully rendered",
    },
    cta_contract: {
      primary_cta: "Read Structural Drift",
      cta_behavior_type: "outbound_or_internal_publication_link",
      state: hasSeatedUrl ? "seated_publication_link" : "held_publication_link",
      publication_url: publicationRef.seatedUrl,
      publication_url_source: publicationRef.source,
      fallback_state: "held_publication_link",
      fallback_copy: "Structural Drift publication link coming soon.",
      renderer_rule:
        "If publication URL is seated, render active CTA. If publication URL is missing, render held copy. Do not invent URL. Do not hide block unless release_state is explicitly held.",
    },
    publication_asset_contract: {
      asset_key: "structural_drift_publication_card_asset",
      asset_type: "image/webp",
      role: "publication card / editorial cover / visual support",
      bucket: "measures-registry",
      path_suggestion:
        "measures-registry/crystal/publications/structural_drift_publication_card_v1.webp",
      required_for_runtime: false,
      asset_authority: "support_only",
      boundary:
        "Publication card asset may support style. Publication card asset does not define publication authority.",
    },
    relation_to_comparison_video: {
      sequence: [
        "The Questions Ungoverned AI Systems Cannot Answer",
        "About Measures Registry",
        "Structural Drift publication",
      ],
      comparison_video: "recognition passage",
      structural_drift: "explanation / proof-of-thinking artifact",
      MAP_the_Environment: "governed runtime audit education",
    },
    public_boundary: {
      may_mention: [
        "AI drift",
        "structural drift",
        "ungoverned systems",
        "system integrity",
        "AI-accelerated systems",
        "runtime structure",
        "governance by system integrity",
      ],
      may_not_expose: PROHIBITED_PUBLIC_COPY,
    },
    activation_standing: {
      payment: false,
      c3_key: false,
      SRC_binding: false,
      permission: false,
      recognition: false,
      conversion: false,
      certification: false,
      DAO: false,
      distribution: false,
    },
  }
}

function publicStringsFromContract(contract) {
  return [
    contract.public_label,
    ...(contract.public_copy || []),
    contract.cta_contract?.primary_cta,
    contract.cta_contract?.fallback_copy,
  ].filter(Boolean)
}

async function main() {
  assertOk(
    await supabase.from("measures_encounter_def").select("id").limit(1),
    "DB connection",
  )

  const row = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, encounter_key, metadata")
      .eq("encounter_key", TARGET_KEY)
      .single(),
    "fetch structure_passage",
  )

  const publicationRef = await fetchPublicationReference()
  const publicationContract = buildPublicationContract(publicationRef)
  const metadata = clone(row.metadata)
  const contentContracts = clone(metadata.crystal_chamber_content_contracts)
  const about =
    clone(contentContracts.about_measures_registry_encounter) || {
      active_key: "about_measures_registry_encounter",
    }
  const contentBlocks = clone(about.content_blocks)

  contentBlocks.structural_drift_publication_block = {
    ...(contentBlocks.structural_drift_publication_block || {}),
    content_block_key: "structural_drift_publication_block",
    public_label: publicationContract.public_label,
    role: publicationContract.role,
    content: PUBLIC_COPY.join(" "),
    cta: publicationContract.cta_contract.primary_cta,
    publication_contract_key: publicationContract.contract_key,
    publication_contract: publicationContract,
  }

  about.content_blocks = contentBlocks
  contentContracts.about_measures_registry_encounter = about

  const nextMetadata = {
    ...metadata,
    structural_drift_publication_contract: publicationContract,
    crystal_chamber_content_contracts: {
      ...contentContracts,
      structural_drift_publication_contract: publicationContract,
    },
    structural_drift_publication_contract_seating: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      status: "seated",
      target_row: TARGET_KEY,
      parent_chamber_contract: "crystal_chamber_contract",
      parent_encounter: "about_measures_registry_encounter",
      runtime_final_pass_authorized: false,
      frontend_hardcode_allowed: false,
      public_material_naming_allowed: false,
      db_term_tag_authority_created: false,
      publication_url_resolution: publicationContract.cta_contract.state,
      activation_standing: publicationContract.activation_standing,
    },
  }

  const updated = assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({ metadata: nextMetadata })
      .eq("id", row.id)
      .select("encounter_key, metadata")
      .single(),
    "update structure_passage",
  )

  const readback = updated.metadata
  const contract = readback.structural_drift_publication_contract
  const errors = []

  if (contract?.contract_key !== "structural_drift_publication_contract") {
    errors.push("publication contract missing")
  }
  if (contract?.parent_chamber_contract !== "crystal_chamber_contract") {
    errors.push("parent chamber missing")
  }
  if (contract?.parent_encounter !== "about_measures_registry_encounter") {
    errors.push("parent encounter missing")
  }
  if (!contract?.public_copy?.every((copy, index) => copy === PUBLIC_COPY[index])) {
    errors.push("public copy mismatch")
  }
  if (!contract?.placement_contract?.render_inside) {
    errors.push("placement contract missing")
  }
  if (!contract?.cta_contract?.fallback_copy) {
    errors.push("CTA held fallback missing")
  }
  if (!contract?.publication_asset_contract || contract.publication_asset_contract.required_for_runtime !== false) {
    errors.push("optional asset contract invalid")
  }
  if (!contract?.relation_to_comparison_video?.sequence?.includes("Structural Drift publication")) {
    errors.push("comparison video relation missing")
  }
  for (const term of ["C1 / C2 / C3", "Crystal Chamber", "Marble Governance Chamber", "Obsidian route", "Lapis route"]) {
    if (publicStringsFromContract(contract).some((value) => value.includes(term))) {
      errors.push(`prohibited public term found: ${term}`)
    }
  }
  for (const [key, value] of Object.entries(contract?.activation_standing || {})) {
    if (value !== false) errors.push(`${key} activated`)
  }
  if (contract?.runtime_final_pass_authorized !== false) {
    errors.push("runtime final pass not blocked")
  }

  if (errors.length > 0) {
    throw new Error(`validation failed:\n${errors.join("\n")}`)
  }

  console.log(
    JSON.stringify(
      {
        source_oar2: SOURCE_OAR2,
        target_row: TARGET_KEY,
        contract_key: contract.contract_key,
        parent_chamber_contract: contract.parent_chamber_contract,
        parent_encounter: contract.parent_encounter,
        cta_state: contract.cta_contract.state,
        publication_url_source: contract.cta_contract.publication_url_source,
        publication_url: contract.cta_contract.publication_url,
        optional_asset_required_for_runtime:
          contract.publication_asset_contract.required_for_runtime,
        public_material_naming_allowed: contract.public_material_naming_allowed,
        runtime_final_pass_authorized: contract.runtime_final_pass_authorized,
        activation_standing: contract.activation_standing,
        validation: "PASS",
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
