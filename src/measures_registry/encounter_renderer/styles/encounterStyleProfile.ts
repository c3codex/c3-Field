// OAR2 "Seat Registry-Governed Encounter Style Profiles" — canonical profile shape.
//
// TEMPORARY, NON-AUTHORITATIVE frontend contract. Only `style_profile` is DB-seeded
// today (supabase/migrations/202606300019_seat_style_profiles_for_13_registered_surfaces.sql
// and 202607020001_..._marble_surface_style_profiles_and_nested_car_acknowledgments.sql).
// The remaining fields below are not yet seated in the registry — Field/Measures must
// define and seat them before this contract can be treated as authoritative. Cody does
// not invent their values: unresolved fields resolve to `null` ("gap"), never a fallback
// default, per the OAR2 rule that CSS/src may not create fallback truth.
//
// Use `resolveEncounterStyleProfile()` everywhere a chamber renderer currently reads
// `surfaceAssignmentMetadata?.style_profile` ad hoc — one resolver, one profile shape,
// consumed the same way by every chamber.

export type EncounterStyleProfile = {
  profile_key: string
  material_family: string | null
  encounter_type: string | null
  surface_role: string | null
  frame_mode: string | null
  media_ratio: string | null
  media_fit: string | null
  content_position: string | null
  content_width: string | null
  typography_scale: string | null
  heading_treatment: string | null
  body_treatment: string | null
  button_position: string | null
  button_treatment: string | null
  overlay_treatment: string | null
  watermark_treatment: string | null
  audio_control_treatment: string | null
  mobile_behavior: string | null
  release_state_behavior: string | null
}

// Resolves the DB-seeded `style_profile` key from surface assignment metadata.
// Returns null ("gap") when unseeded — never a synthetic default profile_key.
export function resolveEncounterStyleProfile(
  surfaceAssignmentMetadata: Record<string, unknown> | null | undefined,
): EncounterStyleProfile | null {
  const key = surfaceAssignmentMetadata?.style_profile
  if (typeof key !== "string" || !key) return null
  return {
    profile_key: key,
    material_family: null,
    encounter_type: null,
    surface_role: null,
    frame_mode: null,
    media_ratio: null,
    media_fit: null,
    content_position: null,
    content_width: null,
    typography_scale: null,
    heading_treatment: null,
    body_treatment: null,
    button_position: null,
    button_treatment: null,
    overlay_treatment: null,
    watermark_treatment: null,
    audio_control_treatment: null,
    mobile_behavior: null,
    release_state_behavior: null,
  }
}
