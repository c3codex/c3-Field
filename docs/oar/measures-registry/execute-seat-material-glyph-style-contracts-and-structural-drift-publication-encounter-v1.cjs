require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_C3_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing")

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const SOURCE_OAR2 =
  "docs/oar/measures-registry/oar2_seat_material_glyph_style_contracts_and_structural_drift_publication_encounter_v1.meta.md"

const FOOTER_LINES = [
  "\u00a9 2026 Measures Registry. All rights reserved.",
  "Measures Registry is a registered c3 Field system.",
  "Operated by c3 Community Partners DAO, LLC.",
]

const MATERIAL_STYLE_CONTRACTS = {
  version: "v1",
  source_oar2: SOURCE_OAR2,
  renderer_rule: "compose_material_layout_glyph_media_copy_cta_footer_from_registered_state",
  public_material_naming_allowed: false,
  materials: {
    obsidian: {
      use_for: ["assessment", "threshold", "reduction", "operational_evaluation", "passage"],
      background_treatment: "dark restrained threshold field",
      glyph_treatment: "small seal or low-opacity watermark only where seated",
      registry_mark_placement: "upper_left_governed_header",
      typography_scale: "compact high-contrast operational",
      media_frame_treatment: "contained no glow",
      cta_treatment: "clear bordered controls",
      footer_treatment: "quiet separated rule",
      spacing_rhythm: "compact desktop fit",
      mobile_behavior: "single_column_scroll_allowed",
      desktop_fit_behavior: "controls_visible",
    },
    crystal: {
      use_for: ["recognition", "orientation", "questions", "clarity", "sparse_chamber"],
      background_treatment: "precise dark field with restrained luminous accent",
      glyph_treatment: "subtle registry seal or seated crystal glyph when available",
      registry_mark_placement: "upper_left_governed_header",
      typography_scale: "clear sparse hierarchy",
      media_frame_treatment: "contained luminous frame",
      cta_treatment: "quiet precision controls",
      footer_treatment: "lightweight readable",
      spacing_rhythm: "sparse but frame-fit",
      mobile_behavior: "single_column_scroll_allowed",
      desktop_fit_behavior: "video_publication_ctas_visible_where_possible",
    },
    lapis: {
      use_for: ["relational_positioning", "transition_education", "orientation_support"],
      background_treatment: "deep blue relational support",
      glyph_treatment: "relation glyph only where seated",
      registry_mark_placement: "upper_left_governed_header",
      typography_scale: "calm supportive",
      media_frame_treatment: "contained supportive",
      cta_treatment: "calm transition controls",
      footer_treatment: "quiet readable",
      spacing_rhythm: "supportive",
      mobile_behavior: "single_column_scroll_allowed",
      desktop_fit_behavior: "avoid assessment confusion",
    },
    marble: {
      use_for: ["governance", "inscription", "continuation", "implementation"],
      background_treatment: "formal stable inscription field",
      glyph_treatment: "marble accent where seated",
      registry_mark_placement: "upper_left_governed_header",
      typography_scale: "formal structured",
      media_frame_treatment: "inscribed frame",
      cta_treatment: "formal continuation controls",
      footer_treatment: "inscribed quiet rule",
      spacing_rhythm: "stable governed",
      mobile_behavior: "single_column_scroll_allowed",
      desktop_fit_behavior: "structured readable",
    },
  },
}

const LAYOUT_CONTRACTS = {
  version: "v1",
  source_oar2: SOURCE_OAR2,
  layouts: {
    passage: {
      role: "media_plus_position_copy",
      desktop_fit: "title_media_copy_controls_footer_coherent",
      mobile_behavior: "media_first_then_copy",
    },
    sparse_chamber: {
      role: "video_publication_cta_sequence",
      desktop_fit: "contained_video_compact_publication_visible_ctas",
      mobile_behavior: "single_column_scroll_allowed",
    },
    assessment: {
      role: "single_question_operational_threshold",
      desktop_fit: "controls_visible",
      mobile_behavior: "controls_accessible",
    },
    contact_contract: {
      role: "capture_after_relevant_public_state",
      desktop_fit: "compact_form",
      mobile_behavior: "scroll_allowed",
    },
    publication_encounter: {
      role: "professional_publication_card_or_article",
      desktop_fit: "cover_copy_cta_balanced",
      mobile_behavior: "cover_then_copy",
    },
    cta_panel: {
      role: "bounded_next_action",
      desktop_fit: "visible_or_immediately_reachable",
      mobile_behavior: "full_width_button",
    },
    footer: {
      role: "registered_system_standing",
      desktop_fit: "does_not_bury_controls",
      mobile_behavior: "wrap_readable",
    },
  },
}

const GLYPH_CONTRACTS = {
  version: "v1",
  source_oar2: SOURCE_OAR2,
  available_registered_roles: {
    registry_mark: "small chamber seal and brand mark",
    registry_watermark: "watermark eligible only when no text/label bleed occurs",
    watermark: "watermark eligible only when no text/label bleed occurs",
    marble_accent_reference: "marble inscription/accent support",
  },
  missing_dedicated_material_glyph_roles: [
    "obsidian_glyph",
    "crystal_glyph",
    "lapis_glyph",
    "marble_glyph",
  ],
  public_rendering_rules: {
    use_seated_assets_only: true,
    hardcode_unregistered_urls: false,
    labels_visible: false,
    media_role_names_visible: false,
    bucket_paths_visible: false,
    glyphs_must_not_impair_readability: true,
  },
}

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function clone(value) {
  return value == null ? {} : JSON.parse(JSON.stringify(value))
}

function footerContract() {
  return {
    version: "v2",
    source_oar2: SOURCE_OAR2,
    inherits_from: "mrssc_v1_footer_contract",
    footer_visible: true,
    footer_visibility: "visible",
    copy_authority: "measures_encounter_def.metadata.footer_contract",
    frontend_hardcode_allowed: false,
    copy_lines: FOOTER_LINES,
    copyright: FOOTER_LINES[0],
    system_statement: FOOTER_LINES[1],
    operator_statement: FOOTER_LINES[2],
  }
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

  const mediaRows = assertOk(
    await supabase
      .from("measures_media_map")
      .select("campaign_key, media_role, storage_bucket, storage_path, mime_type, is_active, metadata")
      .in("media_role", [
        "structural_drift_cover",
        "structural_drift_cover_photo",
        "structural_drift_publication_cover",
        "publication_structural_drift_cover",
        "structural_drift_feature_image",
        "structural_drift_featured_image",
        "registry_mark",
        "watermark",
        "registry_watermark",
        "marble_accent_reference",
      ]),
    "media readback",
  )

  const coverRow =
    mediaRows.find((row) => row.media_role === "structural_drift_cover" && row.is_active !== false) ??
    mediaRows.find((row) => row.media_role === "structural_drift_cover_photo" && row.is_active !== false) ??
    mediaRows.find((row) => row.media_role === "structural_drift_publication_cover" && row.is_active !== false) ??
    mediaRows.find((row) => row.media_role === "publication_structural_drift_cover" && row.is_active !== false) ??
    mediaRows.find((row) => row.media_role === "structural_drift_feature_image" && row.is_active !== false) ??
    mediaRows.find((row) => row.media_role === "structural_drift_featured_image" && row.is_active !== false) ??
    null

  if (!coverRow) {
    throw new Error("No registered Structural Drift cover/feature media row found")
  }

  const rows = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, encounter_key, display_title, material_family, metadata")
      .in("encounter_key", ["crystal_chamber", "structural_drift_publication", "measures_assessment", "structure_passage"]),
    "encounter readback",
  )
  const byKey = new Map(rows.map((row) => [row.encounter_key, row]))

  for (const key of ["measures_assessment", "structure_passage"]) {
    const row = byKey.get(key)
    if (!row) continue
    const metadata = clone(row.metadata)
    await assertOk(
      await supabase
        .from("measures_encounter_def")
        .update({
          metadata: {
            ...metadata,
            material_style_contracts_v1: MATERIAL_STYLE_CONTRACTS,
            layout_contracts_v1: LAYOUT_CONTRACTS,
            glyph_contracts_v1: GLYPH_CONTRACTS,
          },
        })
        .eq("id", row.id),
      `update shared contracts ${key}`,
    )
  }

  const structuralRow = byKey.get("structural_drift_publication")
  if (!structuralRow) throw new Error("structural_drift_publication row missing")
  const structuralMetadata = clone(structuralRow.metadata)
  const publicationEncounter = {
    version: "v1",
    source_oar2: SOURCE_OAR2,
    surface_role: "publication_encounter",
    title: "Structural Drift",
    subtitle: "AI instability is not only a model problem. It is often an environment problem.",
    abstract:
      "Structural Drift names the conditions that allow AI-supported decisions, workflows, approvals, and outputs to become unstable across an organization. Measures Registry evaluates those conditions before optimization proceeds.",
    cta_label: "Read Structural Drift",
    cover_media_role: coverRow.media_role,
    cover_storage_bucket: coverRow.storage_bucket,
    cover_storage_path: coverRow.storage_path,
    media_authority: "measures_media_map",
    frontend_hardcode_allowed: false,
  }
  await assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({
        display_title: "Structural Drift",
        material_family: "crystal",
        metadata: {
          ...structuralMetadata,
          title: "Structural Drift",
          subtitle: publicationEncounter.subtitle,
          media_roles: Array.from(new Set([...(Array.isArray(structuralMetadata.media_roles) ? structuralMetadata.media_roles : []), coverRow.media_role])),
          material_style_contracts_v1: MATERIAL_STYLE_CONTRACTS,
          layout_contracts_v1: LAYOUT_CONTRACTS,
          glyph_contracts_v1: GLYPH_CONTRACTS,
          publication_encounter_contract_v1: publicationEncounter,
          styling_contract: {
            ...clone(structuralMetadata.styling_contract),
            version: "v2",
            source_oar2: SOURCE_OAR2,
            material_family: "crystal",
            foundation_material: "crystal",
            accent_material: "obsidian",
            surface_type: "publication_encounter",
            plain_text_box_allowed: false,
          },
          layout_contract: {
            ...clone(structuralMetadata.layout_contract),
            version: "v2",
            source_oar2: SOURCE_OAR2,
            layout_mode: "publication_encounter",
            cover_media_role: coverRow.media_role,
            viewport_fit: "compact_publication_encounter",
          },
          footer_contract: footerContract(),
        },
      })
      .eq("id", structuralRow.id),
    "update structural_drift_publication",
  )

  const crystalRow = byKey.get("crystal_chamber")
  if (!crystalRow) throw new Error("crystal_chamber row missing")
  const crystalMetadata = clone(crystalRow.metadata)
  const crystalContracts = clone(crystalMetadata.crystal_chamber_content_contracts)
  const about = clone(crystalContracts.about_measures_registry_encounter)
  const contentBlocks = clone(about.content_blocks)
  const structuralBlock = clone(contentBlocks.structural_drift_publication_block)
  const structuralPublicationContract = clone(
    structuralBlock.publication_contract ?? crystalContracts.structural_drift_publication_contract,
  )
  const nextPublicationContract = {
    ...structuralPublicationContract,
    ...publicationEncounter,
    placement: "crystal_chamber_publication_encounter",
    max_visual_weight: "below_questions_video",
  }

  await assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({
        material_family: "crystal",
        metadata: {
          ...crystalMetadata,
          material_style_contracts_v1: MATERIAL_STYLE_CONTRACTS,
          layout_contracts_v1: LAYOUT_CONTRACTS,
          glyph_contracts_v1: GLYPH_CONTRACTS,
          media_roles: Array.from(new Set([...(Array.isArray(crystalMetadata.media_roles) ? crystalMetadata.media_roles : []), coverRow.media_role])),
          styling_contract: {
            ...clone(crystalMetadata.styling_contract),
            version: "v3",
            source_oar2: SOURCE_OAR2,
            material_family: "crystal",
            visual_contract: "sparse_luminous_chamber_with_publication_encounter",
            glyph_usage: "registry_mark_as_subtle_seal_when_available",
          },
          layout_contract: {
            ...clone(crystalMetadata.layout_contract),
            version: "v3",
            source_oar2: SOURCE_OAR2,
            layout_mode: "sparse_chamber",
            publication_encounter_max_weight: "compact",
            desktop_fit: "video_publication_ctas_footer_visible_where_possible",
          },
          crystal_chamber_content_contracts: {
            ...crystalContracts,
            structural_drift_publication_contract: nextPublicationContract,
            about_measures_registry_encounter: {
              ...about,
              content_blocks: {
                ...contentBlocks,
                structural_drift_publication_block: {
                  ...structuralBlock,
                  public_label: "Structural Drift",
                  deck: publicationEncounter.subtitle,
                  abstract: publicationEncounter.abstract,
                  cta: publicationEncounter.cta_label,
                  publication_contract: nextPublicationContract,
                },
              },
            },
          },
        },
      })
      .eq("id", crystalRow.id),
    "update crystal_chamber publication encounter",
  )

  const verifyRows = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, display_title, material_family, metadata")
      .in("encounter_key", ["crystal_chamber", "structural_drift_publication", "measures_assessment", "structure_passage"]),
    "verify encounters",
  )
  const verifyCrystal = verifyRows.find((row) => row.encounter_key === "crystal_chamber")?.metadata ?? {}
  const verifyPublication = verifyRows.find((row) => row.encounter_key === "structural_drift_publication")?.metadata ?? {}
  const errors = []

  if (verifyPublication.publication_encounter_contract_v1?.cover_media_role !== coverRow.media_role) {
    errors.push("Structural Drift cover media role not bound")
  }
  if (verifyPublication.publication_encounter_contract_v1?.title !== "Structural Drift") {
    errors.push("Structural Drift publication title not seated")
  }
  if (verifyCrystal.crystal_chamber_content_contracts?.about_measures_registry_encounter?.content_blocks?.structural_drift_publication_block?.publication_contract?.surface_role !== "publication_encounter") {
    errors.push("Crystal Structural Drift publication encounter not seated")
  }
  for (const material of ["obsidian", "crystal", "lapis", "marble"]) {
    if (!verifyCrystal.material_style_contracts_v1?.materials?.[material]) {
      errors.push(`missing material contract ${material}`)
    }
  }
  for (const layout of ["passage", "sparse_chamber", "assessment", "contact_contract", "publication_encounter", "cta_panel", "footer"]) {
    if (!verifyCrystal.layout_contracts_v1?.layouts?.[layout]) {
      errors.push(`missing layout contract ${layout}`)
    }
  }

  const publicStrings = collectStrings([
    verifyCrystal.crystal_chamber_content_contracts?.about_measures_registry_encounter?.content_blocks?.structural_drift_publication_block,
    verifyPublication.publication_encounter_contract_v1,
  ])
  const forbidden = ["EMBLEM ONLY", "GLYPH ONLY", "bucket path", "debug label", "contract label"]
  for (const term of forbidden) {
    if (publicStrings.some((value) => value.toLowerCase().includes(term.toLowerCase()))) {
      errors.push(`forbidden public term seated: ${term}`)
    }
  }

  if (errors.length > 0) throw new Error(`validation failed:\n${errors.join("\n")}`)

  console.log(JSON.stringify({
    source_oar2: SOURCE_OAR2,
    cover_media: {
      media_role: coverRow.media_role,
      storage_bucket: coverRow.storage_bucket,
      storage_path: coverRow.storage_path,
      is_active: coverRow.is_active,
    },
    material_contracts: Object.keys(MATERIAL_STYLE_CONTRACTS.materials),
    layout_contracts: Object.keys(LAYOUT_CONTRACTS.layouts),
    glyph_contract: {
      used_registered_roles: Object.keys(GLYPH_CONTRACTS.available_registered_roles),
      missing_dedicated_material_glyph_roles: GLYPH_CONTRACTS.missing_dedicated_material_glyph_roles,
    },
    structural_drift_publication_encounter: {
      title: "Structural Drift",
      cta_label: "Read Structural Drift",
      cover_media_role: coverRow.media_role,
      status: "seated",
    },
    validation: "PASS",
  }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
