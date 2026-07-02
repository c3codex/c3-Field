import { useEffect, useState } from "react"
import { supabase, supabaseConfigError } from "@/integrations/supabase/client"
import type {
  EncounterDefRow,
  EncounterDesignTokenRow,
  EncounterMediaRow,
  EncounterSurfaceAssignmentRow,
  RegistryResolverData,
  RegistryRow,
} from "../types/encounterRendererTypes"

const ENCOUNTER_REGISTRY_KEYS = [
  "ai_isnt_broken_intro",
  "obsidian_chamber_orientation",
  "measures_assessment",
  "map_integrity_governance",
  "about_measures_registry",
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
  "map_integrity_governance",
  "about_measures_registry",
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
  "marble_orientation_surface",
  "marble_results_surface",
  "marble_map_surface",
  "crystal_orientation_surface",
  "crystal_longform_surface",
  "obsidian_orientation_surface",
] as const

const DESIGN_REGISTRY_KEY = "measures_registry"

const EMPTY_DATA: RegistryResolverData = {
  registryRows: [],
  encounterDefRows: [],
  mediaRows: [],
  designTokenRows: [],
  surfaceAssignmentRows: [],
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
      const [registryResult, defResult, mediaResult, tokenResult, assignmentResult] =
        await Promise.all([
          supabase
            .from("measures_registry")
            .select("registry_key, is_active, release_state, access_state, metadata")
            .in("registry_key", [...ENCOUNTER_REGISTRY_KEYS]),
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
            .select(
              "surface_key, registry_key, encounter_key, material_identity, chamber_assignment, public_routes, metadata",
            ),
        ])

      if (cancelled) return

      const error =
        registryResult.error?.message ??
        defResult.error?.message ??
        mediaResult.error?.message ??
        tokenResult.error?.message ??
        assignmentResult.error?.message ??
        null

      setData({
        registryRows: (registryResult.data ?? []) as RegistryRow[],
        encounterDefRows: (defResult.data ?? []) as EncounterDefRow[],
        mediaRows: (mediaResult.data ?? []) as EncounterMediaRow[],
        designTokenRows: (tokenResult.data ?? []) as EncounterDesignTokenRow[],
        surfaceAssignmentRows: (assignmentResult.data ?? []) as EncounterSurfaceAssignmentRow[],
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
