import { useEffect, useState } from "react"
import { supabase, supabaseConfigError } from "@/integrations/supabase/client"
import type {
  EncounterDefRow,
  EncounterDesignTokenRow,
  EncounterIssuePageRow,
  EncounterMediaRow,
  EncounterPublicationDispatchRow,
  EncounterSurfaceAssignmentRow,
  RegistryResolverData,
  RegistryRow,
} from "../types/encounterRendererTypes"

const ISSUE_PAGE_PUBLICATION_KEYS = ["undrifted"] as const
const PUBLICATION_DISPATCH_KEYS = ["undrifted"] as const

const ENCOUNTER_REGISTRY_KEYS = [
  "ai_isnt_broken_intro",
  "obsidian_chamber_orientation",
  "measures_assessment",
  "map_the_environment",
  "about_measures_registry",
  "measures_registry_faq",
  "undrifted",
  "measures_registry_root",
  "crystal_seat_intro",
  "obsidian_chamber_C1_compact",
  "marble_chamber_orientation",
  "marble_chamber_encounter",
  "marble_chamber_results",
  "marble_chamber_C2_agreement",
  "marble_chamber_C2_resolution",
] as const

const ENCOUNTER_DEF_KEYS = [
  "ai_isnt_broken_intro",
  "obsidian_chamber_orientation",
  "measures_assessment",
  "map_the_environment",
  "about_measures_registry",
  "measures_registry_faq",
  "undrifted",
  "crystal_seat_intro",
  "obsidian_chamber_C1_compact",
  "marble_chamber_orientation",
  "marble_chamber_encounter",
  "marble_chamber_results",
  "marble_chamber_C2_agreement",
  "marble_chamber_C2_resolution",
] as const

const MEDIA_CAMPAIGN_KEYS = [
  "agents_of_chaos_integrity_governance",
  "measures_registry_root_authority_v1",
] as const

const MEDIA_ROLES = [
  "intro_hook_video",
  "obsidian",
  "left_hero_fracture",
  "left_hero_fracture_motion",
  "right_measured_hero",
  "measured_hero_motion_graphic",
  "background",
  "lapis_background",
  "watermark",
  "registry_watermark",
  "registry_mark",
  "evaluation_reference_image",
  "structured_environment_passage_video",
  "crystal_tone",
  "lapis_tone",
  "obsidian_tone",
  "marble_tone",
  "installation_tone_marble",
  "installation_tone_marble_rise_return_v1",
  "about_measures_registry_video",
  "agents_with_keys_cover",
  "fables_and_myths_cover",
  "ai_isnt_broken_landing",
  "measures_registry_logo",
  "measures_position",
  "official_codexstone_seal",
  "obsidian_contact_surface_visual",
  "obsidian_assessment_surface_visual",
  "obsidian_eval_result_surface_visual",
  "assessment_report_orientation",
  "undrifted_publication_masthead",
  "lapis_publication_chamber_operator_environment",
  "marble_orientation_surface",
  "marble_results_surface",
  "marble_map_surface",
  "crystal_orientation_surface",
  "crystal_longform_surface",
  "obsidian_orientation_surface",
  "marble_payment_confirmation_background",
  "marble_payment_confirmation_seal",
  "hero_poster",
  "about_hero_poster",
  "mr_public_presentation_seal_artwork_webp_v1",
  "mr_public_social_banner_webp_v1",
] as const

const DESIGN_REGISTRY_KEY = "measures_registry"

const EMPTY_DATA: RegistryResolverData = {
  registryRows: [],
  encounterDefRows: [],
  mediaRows: [],
  designTokenRows: [],
  surfaceAssignmentRows: [],
  issuePageRows: [],
  publicationDispatchRows: [],
  loading: true,
  error: null,
}

export function useRegistryResolver(): RegistryResolverData {
  const [data, setData] = useState<RegistryResolverData>(EMPTY_DATA)

  useEffect(() => {
    if (supabaseConfigError) {
      setData({ ...EMPTY_DATA, loading: false, error: "supabase_config_error" })
      return
    }

    let cancelled = false

    async function load() {
      const [
        registryResult,
        publicationResult,
        defResult,
        mediaResult,
        tokenResult,
        assignmentResult,
        issuePageResult,
        publicationDispatchResult,
      ] = await Promise.all([
        supabase
          .from("measures_registry")
          .select("registry_key, is_active, release_state, access_state, metadata")
          .in("registry_key", [...ENCOUNTER_REGISTRY_KEYS]),
        supabase
          .from("measures_publication_registry")
          .select("publication_key, title, subtitle, metadata")
          .eq("publication_key", "undrifted"),
        supabase
          .from("measures_encounter_def")
          .select("encounter_key, display_title, metadata")
          .in("encounter_key", [...ENCOUNTER_DEF_KEYS])
          .order("sequence_order", { ascending: true }),
        supabase
          .from("measures_media_map")
          .select("media_role, storage_bucket, storage_path, mime_type, is_active, metadata")
          .in("campaign_key", [...MEDIA_CAMPAIGN_KEYS])
          .in("media_role", [...MEDIA_ROLES])
          .order("sort_order", { ascending: true }),
        supabase
          .from("measures_design_token")
          .select("token_key, token_value, media_query, is_active")
          .eq("registry_key", DESIGN_REGISTRY_KEY)
          .eq("is_active", true),
        supabase
          .from("measures_encounter_surface_assignment")
          .select("surface_key, registry_key, encounter_key, material_identity, chamber_assignment, public_routes, metadata"),
        supabase
          .from("measures_publication_issue_page")
          .select("page_key, publication_key, issue_id, page_number, page_role, title, subtitle, asset_id, dispatch_key, banner_asset_id, route_path, layout_profile_key, release_state, visibility_state, metadata")
          .in("publication_key", [...ISSUE_PAGE_PUBLICATION_KEYS])
          .order("page_number", { ascending: true }),
        supabase
          .from("measures_publication_dispatch")
          .select("publication_key, dispatch_key, title, dispatch_body, excerpt, media_manifest, internal_route, external_url, article_url, status, published_at, issue_number, metadata")
          .in("publication_key", [...PUBLICATION_DISPATCH_KEYS])
          .eq("status", "published")
          .order("published_at", { ascending: false, nullsFirst: false }),
      ])

      if (cancelled) return

      const error =
        registryResult.error?.message ??
        publicationResult.error?.message ??
        defResult.error?.message ??
        mediaResult.error?.message ??
        tokenResult.error?.message ??
        assignmentResult.error?.message ??
        issuePageResult.error?.message ??
        publicationDispatchResult.error?.message ??
        null

      const rawMediaRows = (mediaResult.data ?? []) as EncounterMediaRow[]
      const mediaRows = await Promise.all(
        rawMediaRows.map(async (row) => {
          if (row.storage_bucket === "measures-seed" && row.is_active !== false) {
            try {
              const { data } = await supabase.storage.from(row.storage_bucket).createSignedUrl(row.storage_path, 86400)
              if (data?.signedUrl) {
                return {
                  ...row,
                  metadata: {
                    ...(row.metadata as Record<string, unknown>),
                    public_url: data.signedUrl,
                    exact_url_seated: data.signedUrl,
                  },
                }
              }
            } catch (err) {
              console.error("Error signing private custody media:", row.media_role, err)
            }
          }
          return row
        }),
      )

      const rawRegistryRows = (registryResult.data ?? []) as RegistryRow[]
      const registryRows = rawRegistryRows.map((row) => {
        if (row.registry_key === "undrifted") {
          const pubRow = publicationResult.data?.[0]
          if (pubRow) {
            return {
              ...row,
              metadata: {
                ...(row.metadata as Record<string, unknown>),
                ...(pubRow.metadata as Record<string, unknown>),
                publication_title: pubRow.title,
                publication_subtitle: pubRow.subtitle,
              },
            }
          }
        }
        return row
      })

      setData({
        registryRows,
        encounterDefRows: (defResult.data ?? []) as EncounterDefRow[],
        mediaRows,
        designTokenRows: (tokenResult.data ?? []) as EncounterDesignTokenRow[],
        surfaceAssignmentRows: (assignmentResult.data ?? []) as EncounterSurfaceAssignmentRow[],
        issuePageRows: (issuePageResult.data ?? []) as EncounterIssuePageRow[],
        publicationDispatchRows: (publicationDispatchResult.data ?? []) as EncounterPublicationDispatchRow[],
        loading: false,
        error,
      })
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return data
}
