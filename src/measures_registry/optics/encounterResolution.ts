import type {
  EncounterEnvironmentAssignment,
  EncounterSurface,
} from "../encounter_renderer/types/encounterRendererTypes"

// Optics Field: Encounter Resolution
//
// Observes how a governed encounter resolves. Does not determine standing.
// Does not mutate encounter state. Does not alter release behavior.
// No PII. No private gate reasons. No internal state.
//
// Authority order: Optics observe AFTER manifestation. They prove outcome.
// They do not create, determine, arrange, or govern encounter.

export type EncounterResolutionStatus =
  | "entered"
  | "completed"
  | "abandoned"
  | "transition_selected"
  | "capture_submitted"
  | "capture_failed"
  | "held_encountered"
  | "unavailable_encountered"
  | "return_path_taken"
  | "continuation_path_taken"

export type EncounterCaptureType =
  | "assessment"
  | "subscription"
  | "connect"

// Public-safe event shape. No raw PII. No private gate reason. No unresolved internal state.
// metadata is restricted to primitive values only — no nested objects, no arrays.
export type EncounterResolutionEvent = {
  event_type: EncounterResolutionStatus
  registry_key: string
  surface: EncounterSurface
  environment: EncounterEnvironmentAssignment
  timestamp: string
  transition_target?: string | null
  capture_type?: EncounterCaptureType | null
  metadata?: Record<string, string | number | boolean | null>
}

// Creates a public-safe resolution event with auto-timestamp.
// Caller is responsible for excluding PII and private gate reasons from metadata.
// Pure — no side effects, no DB write, no analytics call.
export function createResolutionEvent(
  fields: Omit<EncounterResolutionEvent, "timestamp"> & { timestamp?: string },
): EncounterResolutionEvent {
  return {
    ...fields,
    timestamp: fields.timestamp ?? new Date().toISOString(),
  }
}
