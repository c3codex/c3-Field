import type {
  ActionEmphasis,
  ActionKind,
  Json,
  PromptKind,
  ResolvedAction,
  TransitionRow,
} from "@/systems/measures/types"

function asRecord(value: unknown): Record<string, Json> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, Json>)
    : null
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback
}

function deriveDefaultActionKind(
  transitionKind: TransitionRow["transition_kind"],
): ActionKind {
  switch (transitionKind) {
    case "return":
      return "return"
    case "pause":
      return "pause"
    case "release":
      return "release"
    case "seal":
      return "seal"
    case "connect_request_prompt":
      return "prompt"
    default:
      return "navigate"
  }
}

function deriveDefaultLabel(row: TransitionRow): string {
  switch (row.transition_kind) {
    case "return":
      return row.to_encounter_title ? `Return to ${row.to_encounter_title}` : "Return"
    case "pause":
      return "Pause"
    case "release":
      return "Release"
    case "seal":
      return "Seal"
    case "connect_request_prompt":
      return "Continue"
    default:
      return row.to_encounter_title ? `Enter ${row.to_encounter_title}` : "Continue"
  }
}

export function normalizeAction(
  row: TransitionRow,
  blocked: boolean,
  blockedReason: string | null,
): ResolvedAction {
  const meta = asRecord(row.metadata)
  const action = asRecord(meta?.action)
  const prompt = asRecord(meta?.prompt)

  const id = asString(action?.id, row.id)
  const label = asString(action?.label, deriveDefaultLabel(row))
  const kind = asString(
    action?.kind,
    deriveDefaultActionKind(row.transition_kind),
  ) as ActionKind
  const emphasis = asString(action?.emphasis, "secondary") as ActionEmphasis

  const promptEnabled =
    asBoolean(prompt?.enabled, false) || (blocked && row.requires_connect_prompt)

  const promptKind = asString(
    promptEnabled ? prompt?.kind : "none",
    promptEnabled ? "connect_request" : "none",
  ) as PromptKind

  return {
    id,
    label,
    kind,
    emphasis,
    blocked,
    blockedReason,
    promptEnabled,
    promptKind,
    targetRegistryKey: row.to_registry_key,
    targetEncounterKey: row.to_encounter_key,
    transitionKind: row.transition_kind,
    sortOrder: row.sort_order,
    metadata: meta,
  }
}
