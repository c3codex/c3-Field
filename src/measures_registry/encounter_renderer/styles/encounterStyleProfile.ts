// OAR2 "Seat Registry-Governed Encounter Style Profiles" +
// OAR2 "Seat Encounter Style Concordance Language" +
// OAR2 "Seat Remaining Encounter Style Authority Terms" — canonical profile
// shape and bounded visual vocabulary for Measures Registry encounter rendering.
//
// TEMPORARY, NON-AUTHORITATIVE frontend contract. Only `style_profile` is DB-seeded
// today (supabase/migrations/202606300019_seat_style_profiles_for_13_registered_surfaces.sql
// and 202607020001_..._marble_surface_style_profiles_and_nested_car_acknowledgments.sql).
// Every other field is not yet seated in the registry — Field/Measures must define and
// seat them before this contract can be treated as authoritative. Cody does not invent
// their values: unresolved fields resolve to `null` ("gap"), never a fallback default,
// per the rule that CSS/src may not create fallback truth.
//
// Use `resolveEncounterStyleProfile()` everywhere a chamber renderer currently reads
// `surfaceAssignmentMetadata?.style_profile` ad hoc — one resolver, one profile shape,
// consumed the same way by every chamber.

export type MaterialFamily = "crystal" | "obsidian" | "marble" | "lapis"

// Frame Profile — how the encounter occupies the viewport.
export type FrameProfile =
  | "cinematic_frame"
  | "document_frame"
  | "gallery_frame"
  | "split_frame"
  | "threshold_frame"
  | "modal_frame"

// Spatial Profile — how content lives inside the frame.
export type SpatialProfile =
  | "immersive_space"
  | "institutional_space"
  | "intimate_space"
  | "ceremonial_space"
  | "compressed_space"

// Content Anchor — where the encounter naturally rests.
export type ContentAnchor =
  | "anchor_center"
  | "anchor_right"
  | "anchor_left"
  | "anchor_bottom"
  | "anchor_floating"

// Typography Profile — the behavior of type, not the font itself.
export type TypographyProfile =
  | "whisper_type"
  | "institutional_type"
  | "editorial_type"
  | "ceremonial_type"
  | "signal_type"

// Motion Profile — movement behavior.
export type MotionProfile =
  | "still_motion"
  | "breathing_motion"
  | "passage_motion"
  | "cinematic_motion"
  | "ritual_motion"

// Surface Density — how much information may exist simultaneously.
export type SurfaceDensity =
  | "minimal_density"
  | "narrative_density"
  | "operational_density"
  | "reference_density"

// Visual Tension — the emotional/structural pressure of the surface.
export type VisualTension =
  | "calm_tension"
  | "threshold_tension"
  | "diagnostic_tension"
  | "ceremonial_tension"
  | "transformative_tension"

// Media Ratio — the expected media frame relationship.
export type MediaRatio =
  | "portrait_9_16"
  | "portrait_4_5"
  | "landscape_16_9"
  | "square_1_1"
  | "fluid_media"

// Content Width — the readable or visual measure of text/content.
export type ContentWidth =
  | "narrow_measure"
  | "reading_measure"
  | "institutional_measure"
  | "immersive_measure"
  | "full_bleed_measure"

// Button Position — where action authority appears.
export type ButtonPosition =
  | "right_cta"
  | "left_cta"
  | "center_cta"
  | "floating_cta"
  | "hidden_cta"

// Overlay Treatment — how visual atmosphere or readability is supported over media/background.
export type OverlayTreatment =
  | "none_overlay"
  | "soft_overlay"
  | "cinematic_overlay"
  | "threshold_overlay"
  | "ceremonial_overlay"

// Watermark Treatment — registry mark visibility.
export type WatermarkTreatment =
  | "hidden_mark"
  | "subtle_mark"
  | "institutional_mark"
  | "ceremonial_mark"
  | "persistent_mark"

// Audio Control Treatment — visibility and behavior of audio/media controls.
export type AudioControlTreatment =
  | "always_visible_audio"
  | "hover_audio"
  | "minimal_audio"
  | "ambient_audio"
  | "hidden_audio"

// Mobile Behavior — how the encounter responds on mobile viewport.
export type MobileBehavior =
  | "preserve_frame"
  | "stack_content"
  | "collapse_media"
  | "mobile_specific"
  | "locked_orientation"

// Release State Behavior — how visual rendering responds to state.
export type ReleaseStateBehavior =
  | "visible_state"
  | "held_state"
  | "sealed_state"
  | "dependent_state"
  | "unavailable_state"

// Layout Profile — structural arrangement of the encounter. Distinct from frame_profile
// (viewport occupation) and content_width (measure) — this is the arrangement of panels,
// cards, and sections relative to one another. OAR2 "Seat Encounter Layout and Composition
// Authority".
export const LAYOUT_PROFILE_VALUES = [
  "hero_layout",
  "split_layout",
  "stacked_layout",
  "editorial_layout",
  "report_layout",
  "assessment_layout",
  "form_layout",
  "three_panel_layout",
  "single_card_layout",
  "chamber_layout",
] as const
export type LayoutProfile = (typeof LAYOUT_PROFILE_VALUES)[number]

// Composition Profile — how the encounter holds attention, weight, and visual meaning.
// Distinct from layout_profile (arrangement) and space_profile (spatial density/character).
export const COMPOSITION_PROFILE_VALUES = [
  "cinematic_composition",
  "threshold_composition",
  "institutional_composition",
  "assessment_composition",
  "document_composition",
  "exchange_composition",
  "ceremonial_composition",
  "publication_composition",
  "confirmation_composition",
] as const
export type CompositionProfile = (typeof COMPOSITION_PROFILE_VALUES)[number]

// Render Status — whether browser-observed current rendering matches seated target
// authority (layout_profile/composition_profile). OAR2 "Seat Render Intent Authority for
// Layout Composition Drift".
export const RENDER_STATUS_VALUES = [
  "matched",
  "target_registered",
  "drift_detected",
  "held",
  "unavailable",
] as const
export type RenderStatus = (typeof RENDER_STATUS_VALUES)[number]

// Render Intent — what should happen next given render_status. Distinct from render_status
// (a diagnosis) — this is the registered next action, still implemented by a later OAR.
export const RENDER_INTENT_VALUES = [
  "preserve",
  "transform",
  "suppress",
  "resolve",
  "hold",
] as const
export type RenderIntent = (typeof RENDER_INTENT_VALUES)[number]

export type EncounterStyleProfile = {
  profile_key: string
  material_family: MaterialFamily | null
  frame_profile: FrameProfile | null
  space_profile: SpatialProfile | null
  content_anchor: ContentAnchor | null
  typography_profile: TypographyProfile | null
  motion_profile: MotionProfile | null
  surface_density: SurfaceDensity | null
  visual_tension: VisualTension | null
  media_ratio: MediaRatio | null
  content_width: ContentWidth | null
  button_position: ButtonPosition | null
  overlay_treatment: OverlayTreatment | null
  watermark_treatment: WatermarkTreatment | null
  audio_control_treatment: AudioControlTreatment | null
  mobile_behavior: MobileBehavior | null
  release_state_behavior: ReleaseStateBehavior | null
  layout_profile: LayoutProfile | null
  mobile_layout_profile: LayoutProfile | null
  composition_profile: CompositionProfile | null
  mobile_composition_profile: CompositionProfile | null
  render_status: RenderStatus | null
  render_intent: RenderIntent | null
  render_drift_note: string | null
}

const GAP_FIELDS: Omit<EncounterStyleProfile, "profile_key"> = {
  material_family: null,
  frame_profile: null,
  space_profile: null,
  content_anchor: null,
  typography_profile: null,
  motion_profile: null,
  surface_density: null,
  visual_tension: null,
  media_ratio: null,
  content_width: null,
  button_position: null,
  overlay_treatment: null,
  watermark_treatment: null,
  audio_control_treatment: null,
  mobile_behavior: null,
  release_state_behavior: null,
  layout_profile: null,
  mobile_layout_profile: null,
  composition_profile: null,
  mobile_composition_profile: null,
  render_status: null,
  render_intent: null,
  render_drift_note: null,
}

// Returns `value` narrowed to `T` when it is one of `allowed`, else `null`. Never invents
// a fallback — an unrecognized or missing DB value is a documented gap, not a guess.
function asEnum<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : null
}

// Resolves the DB-seeded `style_profile` key from surface assignment metadata, plus the
// layout/composition/render-intent fields seated by OAR2 "Seat Encounter Layout and
// Composition Authority" and OAR2 "Seat Render Intent Authority for Layout Composition
// Drift". Returns null ("gap") when unseeded — never a synthetic default profile_key.
// Every field not explicitly read below remains a documented gap until Field/Measures
// seat it (see GAP_FIELDS) — this function must not invent fallbacks for them either.
export function resolveEncounterStyleProfile(
  surfaceAssignmentMetadata: Record<string, unknown> | null | undefined,
): EncounterStyleProfile | null {
  const key = surfaceAssignmentMetadata?.style_profile
  if (typeof key !== "string" || !key) return null
  const meta = surfaceAssignmentMetadata
  return {
    profile_key: key,
    ...GAP_FIELDS,
    layout_profile: asEnum(meta.layout_profile, LAYOUT_PROFILE_VALUES),
    mobile_layout_profile: asEnum(meta.mobile_layout_profile, LAYOUT_PROFILE_VALUES),
    composition_profile: asEnum(meta.composition_profile, COMPOSITION_PROFILE_VALUES),
    mobile_composition_profile: asEnum(meta.mobile_composition_profile, COMPOSITION_PROFILE_VALUES),
    render_status: asEnum(meta.render_status, RENDER_STATUS_VALUES),
    render_intent: asEnum(meta.render_intent, RENDER_INTENT_VALUES),
    render_drift_note: typeof meta.render_drift_note === "string" ? meta.render_drift_note : null,
  }
}

// Exposes the registered layout/composition/render-status/render-intent authority as
// data attributes on an encounter root, per OAR2 "Implement Render Intent Corrections for
// Layout Composition Drift" §2. `render_drift_note` is deliberately not exposed publicly —
// it may remain internal.
export function encounterStyleDataAttributes(
  surfaceAssignmentMetadata: Record<string, unknown> | null | undefined,
): {
  "data-style-profile": string | undefined
  "data-layout-profile": string | undefined
  "data-mobile-layout-profile": string | undefined
  "data-composition-profile": string | undefined
  "data-mobile-composition-profile": string | undefined
  "data-render-status": string | undefined
  "data-render-intent": string | undefined
} {
  const profile = resolveEncounterStyleProfile(surfaceAssignmentMetadata)
  return {
    "data-style-profile": profile?.profile_key ?? undefined,
    "data-layout-profile": profile?.layout_profile ?? undefined,
    "data-mobile-layout-profile": profile?.mobile_layout_profile ?? undefined,
    "data-composition-profile": profile?.composition_profile ?? undefined,
    "data-mobile-composition-profile": profile?.mobile_composition_profile ?? undefined,
    "data-render-status": profile?.render_status ?? undefined,
    "data-render-intent": profile?.render_intent ?? undefined,
  }
}

// --- Provisional material defaults (OAR2 "Seat Encounter Style Concordance Language") ---
//
// PROVISIONAL, NON-AUTHORITATIVE. These are the OAR2-documented per-material defaults for
// the seven concordance dimensions. Codex/Field has not seated them as DB truth — they are
// not wired into `resolveEncounterStyleProfile()` and must never be read as if they were a
// resolved profile. They exist only so a caller can *explicitly* opt into a provisional
// fallback via `applyProvisionalMaterialDefaults()` below, which marks its output as
// provisional so nothing downstream can mistake it for seated state.
type ConcordanceFields = Pick<
  EncounterStyleProfile,
  "frame_profile" | "space_profile" | "content_anchor" | "typography_profile" | "motion_profile" | "surface_density" | "visual_tension"
>

export const PROVISIONAL_MATERIAL_STYLE_CONCORDANCE_DEFAULTS: Record<MaterialFamily, ConcordanceFields> = {
  crystal: {
    frame_profile: "cinematic_frame",
    space_profile: "ceremonial_space",
    content_anchor: "anchor_center",
    typography_profile: "signal_type",
    motion_profile: "breathing_motion",
    surface_density: "minimal_density",
    visual_tension: "calm_tension",
  },
  obsidian: {
    frame_profile: "threshold_frame",
    space_profile: "immersive_space",
    content_anchor: "anchor_right",
    typography_profile: "institutional_type",
    motion_profile: "passage_motion",
    surface_density: "operational_density",
    visual_tension: "diagnostic_tension",
  },
  marble: {
    frame_profile: "document_frame",
    space_profile: "institutional_space",
    content_anchor: "anchor_left",
    typography_profile: "editorial_type",
    motion_profile: "still_motion",
    surface_density: "narrative_density",
    visual_tension: "ceremonial_tension",
  },
  lapis: {
    frame_profile: "split_frame",
    space_profile: "intimate_space",
    content_anchor: "anchor_floating",
    typography_profile: "whisper_type",
    motion_profile: "ritual_motion",
    surface_density: "narrative_density",
    visual_tension: "transformative_tension",
  },
}

// Explicit, opt-in only. Fills unseeded concordance fields with the provisional material
// default and reports exactly which fields were provisional — never silently, never as if
// seated. Does not touch media_ratio/content_width/button_position/etc — those have no
// documented material default and remain gaps.
export function applyProvisionalMaterialDefaults(
  profile: EncounterStyleProfile,
  materialFamily: MaterialFamily,
): { profile: EncounterStyleProfile; provisionalFieldsApplied: (keyof ConcordanceFields)[] } {
  const defaults = PROVISIONAL_MATERIAL_STYLE_CONCORDANCE_DEFAULTS[materialFamily]
  const provisionalFieldsApplied: (keyof ConcordanceFields)[] = []
  const next: EncounterStyleProfile = { ...profile, material_family: profile.material_family ?? materialFamily }
  for (const field of Object.keys(defaults) as (keyof ConcordanceFields)[]) {
    if (next[field] == null) {
      next[field] = defaults[field]
      provisionalFieldsApplied.push(field)
    }
  }
  return { profile: next, provisionalFieldsApplied }
}
