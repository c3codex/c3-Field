// Governed regeneration path: Publication Registry + Publication Dispatch -> Encounter Projection.
//
// Per oar2_seat_undrifted_publication_synchronization_and_launch_ready_encounter_projection_v1:
// measures_encounter_def ("Encounter Projection") must never be an independently edited
// authority surface. This script is the ONLY sanctioned writer of
// measures_encounter_def.metadata for encounter_key = 'undrifted' — it regenerates it
// deterministically from measures_publication_registry (canonical publication identity,
// style contract, issue metadata, hierarchy) and measures_publication_dispatch (canonical
// article/dispatch records), and preserves the small set of encounter_def-only fields that
// currently have no canonical source upstream (documented below) rather than deleting them.
//
// Extended by oar2_finalize_undrifted_launch_projection_and_encounter_profile_v1 to also
// project assessment_feature, section_labels, and encounter_profile — all now seated
// canonically under measures_publication_registry.metadata.
//
// encounter_profile is projected as a whole object (see nextMetadata below), so
// oar2_seat_undrifted_issue_page_model_and_launch_layout_sequence_v1's additions to it
// (issue_page_sequence, front_matter_sequence, article_sequence, encounter_sequence,
// layout_profiles, held_future_renderers — sourced from measures_publication_issue_page)
// flow through automatically on the next run, without a code change here.
//
// Usage:
//   node scripts/regenerate-undrifted-encounter-projection.cjs           (dry run — prints diff only)
//   node scripts/regenerate-undrifted-encounter-projection.cjs --apply   (writes the correction)

require("dotenv").config({ path: ".env" })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase credentials missing (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)")
}

const supabase = createClient(supabaseUrl, supabaseKey)

const APPLY = process.argv.includes("--apply")

// Section-sequence entries that are page-structure markers, not article references.
const STRUCTURAL_SECTIONS = new Set(["cover_story", "assessment_feature", "role_call", "next_issue", "footer"])

async function assertOk(result, label) {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message}`)
  }
  return result.data
}

function slugToUnderscoreKey(slug) {
  return slug.replace(/-/g, "_")
}

async function run() {
  const [publicationRows, dispatchRows, encounterRows] = await Promise.all([
    assertOk(
      await supabase
        .from("measures_publication_registry")
        .select("metadata")
        .eq("publication_key", "undrifted")
        .limit(1),
      "Publication Registry lookup failed",
    ),
    assertOk(
      await supabase
        .from("measures_publication_dispatch")
        .select("dispatch_key, title, article_url, external_slug, status, metadata")
        .eq("publication_key", "undrifted")
        .eq("status", "published"),
      "Publication Dispatch lookup failed",
    ),
    assertOk(
      await supabase
        .from("measures_encounter_def")
        .select("metadata")
        .eq("encounter_key", "undrifted")
        .limit(1),
      "Encounter Projection lookup failed",
    ),
  ])

  const publication = publicationRows[0]?.metadata
  const existingProjection = encounterRows[0]?.metadata

  if (!publication) throw new Error("No measures_publication_registry row for publication_key='undrifted'")
  if (!existingProjection) throw new Error("No measures_encounter_def row for encounter_key='undrifted'")

  const dispatchBySlugKey = new Map(dispatchRows.map((row) => [slugToUnderscoreKey(row.external_slug), row]))

  // Resolve article references in the canonical section_sequence against Publication
  // Dispatch. Never invents an article — a sequence entry with no matching published
  // dispatch is skipped and reported, not silently dropped.
  const sectionSequence = Array.isArray(publication.issue_record?.section_sequence)
    ? publication.issue_record.section_sequence
    : []

  const unresolvedSequenceEntries = []
  const featuredArticleSet = []

  for (const entry of sectionSequence) {
    if (STRUCTURAL_SECTIONS.has(entry)) continue
    const dispatch = dispatchBySlugKey.get(entry)
    if (!dispatch) {
      unresolvedSequenceEntries.push(entry)
      continue
    }
    const meta = dispatch.metadata || {}
    featuredArticleSet.push({
      title: dispatch.title,
      teaser: meta.feature_teaser ?? null,
      subtitle: meta.subtitle ?? null,
      media_role: meta.cover_media_role ?? null,
      article_url: dispatch.article_url,
      feature_label: meta.feature_label ?? "FEATURE ARTICLE",
      publication_state: dispatch.status,
    })
  }

  // Fields with NO canonical source in measures_publication_registry — FREE-technical only,
  // correctly projection-owned by design (not drift). assessment_feature and
  // landing_design_contract were preserved here until
  // oar2_finalize_undrifted_launch_projection_and_encounter_profile_v1 seated their canonical
  // sources (metadata.assessment_feature, metadata.section_labels, metadata.encounter_profile)
  // — both are now projected from Publication Registry below instead.
  const preserved = {
    media_locator: existingProjection.media_locator ?? null,
    content_profile: existingProjection.content_profile ?? null,
    directory_key: existingProjection.directory_key ?? null,
  }

  // brand_copy: canonical fields from Publication Registry, plus `descriptor_line`, which
  // exists only in the current projection with no Publication Registry source to correct it
  // against — preserved, not invented.
  const brandCopy = {
    ...publication.brand_copy,
    ...(existingProjection.brand_copy?.descriptor_line
      ? { descriptor_line: existingProjection.brand_copy.descriptor_line }
      : {}),
  }

  const nextMetadata = {
    ...preserved,
    brand_copy: brandCopy,
    brand_assets: publication.brand_assets ?? existingProjection.brand_assets,
    cover_story: publication.cover_story ?? existingProjection.cover_story,
    issue_record: publication.issue_record ?? existingProjection.issue_record,
    role_call_feature: publication.role_call_feature ?? existingProjection.role_call_feature,
    next_issue_teaser: publication.next_issue_teaser ?? existingProjection.next_issue_teaser,
    footer_record: publication.footer_record ?? existingProjection.footer_record,
    style_contract: publication.style_contract ?? existingProjection.style_contract,
    hierarchy: publication.hierarchy ?? null,
    parent_authority: publication.parent_authority ?? null,
    primary_series: publication.primary_series ?? null,
    assessment_feature: publication.assessment_feature ?? existingProjection.assessment_feature,
    section_labels: publication.section_labels ?? null,
    landing_design_contract: publication.landing_design_contract ?? existingProjection.landing_design_contract,
    encounter_profile: publication.encounter_profile ?? null,
    featured_article_set: featuredArticleSet,
    content_source: "measures_publication_registry + measures_publication_dispatch",
    source_oar2: "OAR/OAR2/publication/oar2_finalize_undrifted_launch_projection_and_encounter_profile_v1.meta.md",
    projection_meta: {
      regenerated_at: new Date().toISOString(),
      regenerated_by_oar2: "oar2_finalize_undrifted_launch_projection_and_encounter_profile_v1",
      regeneration_script: "scripts/regenerate-undrifted-encounter-projection.cjs",
      canonical_sources: ["measures_publication_registry", "measures_publication_dispatch"],
      preserved_no_canonical_source: Object.keys(preserved).filter((k) => preserved[k] !== null),
      unresolved_section_sequence_entries: unresolvedSequenceEntries,
    },
  }

  const diff = {
    issue_record: { before: existingProjection.issue_record, after: nextMetadata.issue_record },
    style_contract: { before: existingProjection.style_contract, after: nextMetadata.style_contract },
    role_call_feature: { before: existingProjection.role_call_feature, after: nextMetadata.role_call_feature },
    brand_copy: { before: existingProjection.brand_copy, after: nextMetadata.brand_copy },
    assessment_feature_now_canonical: nextMetadata.assessment_feature != null,
    encounter_profile_seated: nextMetadata.encounter_profile != null,
    landing_design_contract_standing: nextMetadata.landing_design_contract?.standing ?? "unchanged",
    featured_article_set_count: {
      before: (existingProjection.featured_article_set || []).length,
      after: featuredArticleSet.length,
    },
    new_fields_added: [
      "hierarchy",
      "parent_authority",
      "primary_series",
      "section_labels",
      "encounter_profile",
      "projection_meta",
    ],
    unresolved_section_sequence_entries: unresolvedSequenceEntries,
  }

  if (!APPLY) {
    console.log(JSON.stringify({ mode: "dry_run", diff }, null, 2))
    return
  }

  await assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({ metadata: nextMetadata })
      .eq("encounter_key", "undrifted"),
    "Encounter Projection write failed",
  )

  console.log(JSON.stringify({ mode: "applied", diff }, null, 2))
}

run().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
