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
  "docs/oar/measures_interoperability/oar2_correct_crystal_passage_context_shell_metadata_registry_mark_and_foundational_leadership_contact_contract_v1.meta.md"
const TARGET_KEY = "structure_passage"

const PUBLIC_COPY_CONTRACT = {
  contract_key: "crystal_passage_public_copy_contract",
  source_oar2: SOURCE_OAR2,
  metadata_bleed_disallowed: true,
  prohibited_visible_phrases: [
    "video-first education passage",
    "structure_passage",
    "Crystal Chamber",
    "material family",
  ],
  title: "Understand the Environment",
  context_body:
    "AI systems do not operate in isolation. They interact with workflows, roles, approvals, data, outputs, and decisions. This passage explains why the operating environment matters before an institution evaluates, maps, or restructures AI-facing systems.",
  cta_label: "Begin Understanding",
}

const VIDEO_CONTROL_CONTRACT = {
  contract_key: "video_control_contract",
  source_oar2: SOURCE_OAR2,
  audio_control_required: true,
  mute_control_required: true,
  skip_control_required: true,
  auto_advance_allowed: true,
  cta_fallback_required: true,
  cta_label: "Begin Understanding",
  no_dead_end_surface: true,
}

const SITEWIDE_REGISTRY_MARK_CONTRACT = {
  contract_key: "sitewide_registry_mark_contract_v1",
  source_oar2: SOURCE_OAR2,
  mark_required: true,
  size_must_be_intentional: true,
  tiny_favicon_scale_disallowed: true,
  role: "brand_anchor",
  public_label_visible: false,
  applies_to: ["threshold", "crystal", "obsidian", "passage", "held_surfaces"],
  placement: {
    desktop: "upper_left",
    mobile: "upper_left",
  },
  desktop_size: {
    width_px: 44,
    min_width_px: 40,
  },
  mobile_size: {
    width_px: 34,
    min_width_px: 30,
  },
  opacity: {
    default: 0.72,
    hover: 1,
  },
}

const FOUNDATIONAL_LEADERSHIP_CONTACT_CONTRACT = {
  contract_key: "foundational_leadership_contact_contract_v1",
  source_oar2: SOURCE_OAR2,
  contract_type: "public_contact_message",
  public_label: "Request a Foundational Leadership Conversation",
  commerce_entry: false,
  pricing_allowed: false,
  payment_allowed: false,
  key_mechanics_allowed: false,
  internal_route_visible: false,
  public_runtime_allowed: true,
  message_delivery_required: true,
  consent_required: true,
  public_pathway: "Foundational Leadership",
  internal_route: "leadership_invitation",
  helper_copy: "Request a Foundational Leadership conversation with Measures Registry.",
  boundary_note:
    "This request begins a conversation only. It does not create approval, enrollment, implementation, or verified registry status.",
  required_fields: [
    { field_key: "institution_name", public_label: "Institution / Organization Name", type: "text", required: true },
    { field_key: "contact_name", public_label: "Contact Name", type: "text", required: true },
    { field_key: "contact_email", public_label: "Email", type: "email", required: true },
    { field_key: "role_title", public_label: "Your Role / Title", type: "text", required: true },
    { field_key: "message", public_label: "Message", type: "textarea", required: true },
  ],
  optional_fields: [
    { field_key: "website", public_label: "Website", type: "url", required: false },
    {
      field_key: "measures_registry_updates_opt_in",
      public_label: "I would like to receive future Measures Registry updates.",
      type: "checkbox",
      required: false,
    },
  ],
  consent_fields: [
    {
      field_key: "foundational_leadership_contact_consent",
      public_label: "I agree to be contacted about a Foundational Leadership conversation.",
      type: "checkbox",
      required: true,
    },
  ],
  boundary_acknowledgment: {
    field_key: "foundational_leadership_boundary_acknowledgment",
    public_label:
      "I understand this request begins a conversation only. It does not create approval, enrollment, implementation, or verified registry status.",
    type: "checkbox",
    required: true,
  },
  message_delivery_boundary: {
    implemented_in_this_route: false,
    held_safe_submission_copy: "Conversation request held for Measures Registry review. No standing has been granted.",
    no_payment_triggered: true,
    no_key_mechanics_triggered: true,
    no_standing_granted: true,
    no_marble_route_opened: true,
  },
}

const GOVERNED_CONTINUITY_EDUCATION_CONTRACT = {
  public_label: "Governed Continuity",
  role: "public continuity education",
  content:
    "Measures Registry explains why AI-facing environments need sequence, review, and implementation boundaries before any later pathway can be considered.",
  boundary:
    "This education surface does not create approval, enrollment, implementation, or verified registry status.",
}

function clone(value) {
  return value == null ? {} : JSON.parse(JSON.stringify(value))
}

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function collectStrings(value) {
  if (value == null) return []
  if (typeof value === "string") return [value]
  if (Array.isArray(value)) return value.flatMap(collectStrings)
  if (typeof value === "object") return Object.values(value).flatMap(collectStrings)
  return []
}

async function main() {
  assertOk(await supabase.from("measures_encounter_def").select("id").limit(1), "DB connection")

  const row = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, encounter_key, metadata")
      .eq("encounter_key", TARGET_KEY)
      .single(),
    "fetch structure_passage",
  )

  const metadata = clone(row.metadata)
  const contracts = clone(metadata.crystal_chamber_content_contracts)
  const understandPassage = clone(contracts.understand_environment_passage)
  const about = clone(contracts.about_measures_registry_encounter)
  const contentBlocks = clone(about.content_blocks)
  const foundationalLeadershipBlock = clone(contentBlocks.foundational_leadership_block)

  const nextFoundationalLeadershipBlock = {
    ...foundationalLeadershipBlock,
    public_label: "Foundational Leadership",
    role: "leadership invitation / partner development surface",
    content:
      "Measures Registry is opening space for foundational leaders who understand that AI governance is not only a technical challenge. It is a systems integrity challenge.",
    cta: "Request a Foundational Leadership Conversation",
    boundary: FOUNDATIONAL_LEADERSHIP_CONTACT_CONTRACT.boundary_note,
    foundational_leadership_contact_contract_v1: FOUNDATIONAL_LEADERSHIP_CONTACT_CONTRACT,
  }

  const nextContracts = {
    ...contracts,
    understand_environment_passage: {
      ...understandPassage,
      public_label: "Understand the Environment",
      role: "public orientation passage",
      crystal_passage_public_copy_contract: PUBLIC_COPY_CONTRACT,
      video_control_contract: VIDEO_CONTROL_CONTRACT,
    },
    about_measures_registry_encounter: {
      ...about,
      content: [
        "Measures Registry provides Integrity Governance for AI-Accelerated Systems.",
        "AI drift is not only a model problem. It is amplified by ungoverned authority, unclear roles, exposed runtime surfaces, missing review pathways, and implementation conditions that have not been structured.",
        "Measures Registry helps institutions identify the conditions shaping AI behavior, recognize drift-amplifying factors, and move toward governed action where appropriate.",
        "This is governance by system integrity.",
      ],
      content_blocks: {
        ...contentBlocks,
        foundational_leadership_block: nextFoundationalLeadershipBlock,
      },
    },
    measures_conversion_education_encounter: {
      ...clone(contracts.measures_conversion_education_encounter),
      ...GOVERNED_CONTINUITY_EDUCATION_CONTRACT,
    },
    foundational_leadership_contact_contract_v1: FOUNDATIONAL_LEADERSHIP_CONTACT_CONTRACT,
    sitewide_registry_mark_contract_v1: SITEWIDE_REGISTRY_MARK_CONTRACT,
  }

  const nextMetadata = {
    ...metadata,
    title: "Understand the Environment",
    subtitle: PUBLIC_COPY_CONTRACT.context_body,
    sitewide_registry_mark_contract_v1: SITEWIDE_REGISTRY_MARK_CONTRACT,
    foundational_leadership_contact_contract_v1: FOUNDATIONAL_LEADERSHIP_CONTACT_CONTRACT,
    crystal_chamber_content_contracts: nextContracts,
    crystal_passage_context_shell_correction_v1: {
      source_oar2: SOURCE_OAR2,
      metadata_bleed_corrected: true,
      public_shell_title_required: "Measures Registry",
      no_deployment: true,
      no_commerce: true,
      no_pricing: true,
      no_payment: true,
      no_key_mechanics: true,
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
  const errors = []
  const readbackContracts = readback.crystal_chamber_content_contracts || {}
  const publicCopy =
    readbackContracts.understand_environment_passage?.crystal_passage_public_copy_contract
  const videoControl =
    readbackContracts.understand_environment_passage?.video_control_contract
  const contact =
    readbackContracts.foundational_leadership_contact_contract_v1 ||
    readback.foundational_leadership_contact_contract_v1
  const mark =
    readbackContracts.sitewide_registry_mark_contract_v1 ||
    readback.sitewide_registry_mark_contract_v1

  if (publicCopy?.metadata_bleed_disallowed !== true) errors.push("public copy contract missing")
  if (videoControl?.cta_label !== "Begin Understanding") errors.push("video control contract missing")
  if (mark?.desktop_size?.width_px !== 44) errors.push("registry mark contract missing")
  if (contact?.commerce_entry !== false || contact?.payment_allowed !== false) {
    errors.push("foundational leadership non-commerce boundary missing")
  }
  if (!Array.isArray(contact?.required_fields) || contact.required_fields.length !== 5) {
    errors.push("required contact fields missing")
  }
  if (!Array.isArray(contact?.consent_fields) || contact.consent_fields.length !== 1) {
    errors.push("consent field missing")
  }
  if (contact?.boundary_acknowledgment?.required !== true) {
    errors.push("boundary acknowledgment missing")
  }

  const aboutReadback = readbackContracts.about_measures_registry_encounter || {}
  const leadershipReadback =
    aboutReadback.content_blocks?.foundational_leadership_block || {}
  const visibleContactFields = [
    ...(contact.required_fields || []),
    ...(contact.optional_fields || []),
    ...(contact.consent_fields || []),
    contact.boundary_acknowledgment || {},
  ].map((field) => field.public_label)
  const publicStrings = collectStrings([
    publicCopy?.title,
    publicCopy?.context_body,
    publicCopy?.cta_label,
    aboutReadback.public_label,
    aboutReadback.content,
    aboutReadback.content_blocks?.structural_drift_publication_block?.public_label,
    aboutReadback.content_blocks?.structural_drift_publication_block?.content,
    aboutReadback.content_blocks?.structural_drift_publication_block?.cta,
    leadershipReadback.public_label,
    leadershipReadback.content,
    leadershipReadback.cta,
    leadershipReadback.boundary,
    readbackContracts.measures_conversion_education_encounter?.public_label,
    readbackContracts.measures_conversion_education_encounter?.content,
    readbackContracts.measures_conversion_education_encounter?.boundary,
    contact.public_label,
    contact.helper_copy,
    contact.boundary_note,
    visibleContactFields,
    contact.message_delivery_boundary?.held_safe_submission_copy,
  ])
  for (const term of ["video-first education passage", "structure_passage", "Crystal Chamber", "material family"]) {
    if (publicStrings.some((value) => value.includes(term))) {
      errors.push(`metadata bleed term found: ${term}`)
    }
  }
  for (const term of [
    "pricing",
    "payment",
    "c3 Key",
    "temp c3 Key",
    "wallet",
    "NFT",
    "C1",
    "C2",
    "C3",
    "commerce circuit",
    "SRC active",
    "permission standing",
    "conversion standing",
    "certification standing",
    "DAO standing",
    "distribution standing",
    "Buy now",
    "Reserve seat",
    "Proceed to payment",
  ]) {
    if (publicStrings.some((value) => value.includes(term))) {
      errors.push(`prohibited commerce term found: ${term}`)
    }
  }

  if (errors.length > 0) {
    throw new Error(`validation failed:\n${errors.join("\n")}`)
  }

  console.log(
    JSON.stringify(
      {
        source_oar2: SOURCE_OAR2,
        target_row: TARGET_KEY,
        public_copy_contract: "PASS",
        video_control_contract: "PASS",
        sitewide_registry_mark_contract: "PASS",
        foundational_leadership_contact_contract: "PASS",
        required_contact_fields: contact.required_fields.map((field) => field.field_key),
        consent_fields: contact.consent_fields.map((field) => field.field_key),
        boundary_acknowledgment: contact.boundary_acknowledgment.field_key,
        message_delivery: "held_safe_no_runtime_delivery",
        no_commerce: true,
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
