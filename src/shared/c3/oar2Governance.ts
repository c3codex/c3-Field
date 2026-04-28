export type CodexSourceRecordKey =
  | "seed_concordance"
  | "system_concordance"
  | "twenty_one_of_coherence"
  | "coherence_matrix_v1"

export type IntegrityGovernanceAlignmentStatus = "pending" | "passed" | "failed"
  | "correction_required"

export type IntegrityGovernance = {
  matrix_ref: string | null
  constraints: string[]
  agreements: string[]
  expected_resolutions: string[]
  actor_scope: string[]
  alignment_status: IntegrityGovernanceAlignmentStatus
  is_db_held: boolean
}

export type AntechamberState =
  | "held"
  | "correction_required"
  | "ready_for_phase_map"

export type PhaseMapVerificationState =
  | "incomplete"
  | "blocked"
  | "ready_for_verification"
  | "verified"
  | "correction_required"

export type Oar2Governance = {
  antechamber_state: AntechamberState
  phase_map_state: PhaseMapVerificationState
  integrity_governance: IntegrityGovernance
  codex_source_records: CodexSourceRecordKey[]
  oar1_present: boolean
  oar2_present: boolean
  blocked_paths: string[]
  missing_paths: string[]
}

type JsonRecord = Record<string, unknown>

export const DB_HELD_CODEX_SOURCE_RECORDS: CodexSourceRecordKey[] = [
  "seed_concordance",
  "system_concordance",
  "twenty_one_of_coherence",
  "coherence_matrix_v1",
]

const ANTECHAMBER_STATES: AntechamberState[] = [
  "held",
  "correction_required",
  "ready_for_phase_map",
]

const PHASE_MAP_STATES: PhaseMapVerificationState[] = [
  "incomplete",
  "blocked",
  "ready_for_verification",
  "verified",
  "correction_required",
]

const ALIGNMENT_STATES: IntegrityGovernanceAlignmentStatus[] = [
  "pending",
  "passed",
  "failed",
  "correction_required",
]

const MISSING_INTEGRITY_GOVERNANCE: IntegrityGovernance = {
  matrix_ref: null,
  constraints: [],
  agreements: [],
  expected_resolutions: [],
  actor_scope: [],
  alignment_status: "correction_required",
  is_db_held: false,
}

function asRecord(value: unknown): JsonRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  return value as JsonRecord
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : []
}

function stateValue<T extends string>(value: unknown, allowed: T[]) {
  return typeof value === "string" && allowed.includes(value as T) ? (value as T) : null
}

function standingPresent(value: unknown) {
  if (typeof value === "boolean") return value
  if (typeof value !== "string") return false
  return ["present", "accepted", "passed", "verified", "created", "ready"].includes(value)
}

function readStanding(metadata: JsonRecord, key: "oar1" | "oar2") {
  const oar = asRecord(metadata.oar)
  return (
    standingPresent(metadata[`${key}_present`]) ||
    standingPresent(metadata[key]) ||
    standingPresent(oar?.[key])
  )
}

function rawSourceRecords(metadata: JsonRecord) {
  const records =
    metadata.codex_source_record ??
    metadata.codex_source_records ??
    metadata.codex_sources ??
    asRecord(metadata.oar2)?.codex_source_records ??
    []

  return Array.isArray(records) ? records : []
}

function sourceRecordKey(value: unknown): CodexSourceRecordKey | null {
  const source = asRecord(value)
  const key =
    typeof value === "string"
      ? value.replace(/^public\./, "").replace(/^codex_source_record\./, "")
      : source?.key ?? source?.source_key ?? source?.record_key ?? source?.ref

  if (typeof key !== "string") return null
  return DB_HELD_CODEX_SOURCE_RECORDS.includes(key as CodexSourceRecordKey)
    ? (key as CodexSourceRecordKey)
    : null
}

export function resolveCodexSourceRecords(metadata: JsonRecord) {
  return rawSourceRecords(metadata).flatMap((record) => {
    const key = sourceRecordKey(record)
    return key ? [key] : []
  })
}

export function resolveIntegrityGovernance(metadata: JsonRecord): IntegrityGovernance {
  const source =
    asRecord(metadata.integrity_governance) ??
    asRecord(asRecord(metadata.oar2)?.integrity_governance)

  if (!source) return MISSING_INTEGRITY_GOVERNANCE

  const alignmentStatus = stateValue(source.alignment_status, ALIGNMENT_STATES)

  return {
    matrix_ref: typeof source.matrix_ref === "string" ? source.matrix_ref : null,
    constraints: asStringArray(source.constraints),
    agreements: asStringArray(source.agreements),
    expected_resolutions: asStringArray(source.expected_resolutions),
    actor_scope: asStringArray(source.actor_scope),
    alignment_status: alignmentStatus ?? "correction_required",
    is_db_held: true,
  }
}

export function resolveAntechamberState(metadata: JsonRecord): AntechamberState {
  const antechamber = asRecord(metadata.antechamber)
  return stateValue(metadata.antechamber_state ?? antechamber?.state, ANTECHAMBER_STATES) ??
    "correction_required"
}

export function resolvePhaseMapState(metadata: JsonRecord): PhaseMapVerificationState {
  const phaseMap = asRecord(metadata.phase_map)
  return stateValue(
    metadata.phase_map_state ?? phaseMap?.verification_state ?? phaseMap?.state,
    PHASE_MAP_STATES,
  ) ?? "correction_required"
}

export function resolveOar2Governance(metadata: JsonRecord): Oar2Governance {
  const integrity = resolveIntegrityGovernance(metadata)
  const records = resolveCodexSourceRecords(metadata)
  const sourceRecords = rawSourceRecords(metadata)
  const phaseMapState = resolvePhaseMapState(metadata)
  const antechamberState = resolveAntechamberState(metadata)
  const oar1Present = readStanding(metadata, "oar1")
  const oar2Present = readStanding(metadata, "oar2")
  const blockedPaths: string[] = []
  const missingPaths: string[] = []

  if (!integrity.is_db_held) missingPaths.push("integrity_governance")
  if (!("antechamber_state" in metadata) && !asRecord(metadata.antechamber)?.state) {
    missingPaths.push("antechamber_state")
  }
  if (!("phase_map_state" in metadata) && !asRecord(metadata.phase_map)?.verification_state && !asRecord(metadata.phase_map)?.state) {
    missingPaths.push("phase_map_state")
  }

  if (missingPaths.length > 0) blockedPaths.push("correction_required")
  if (!oar1Present) blockedPaths.push("phase_map_access")
  if (
    phaseMapState === "incomplete" ||
    phaseMapState === "blocked" ||
    phaseMapState === "correction_required"
  ) {
    blockedPaths.push("conversion")
  }
  if (integrity.alignment_status !== "passed") blockedPaths.push("oar2_route")
  if (!oar2Present) blockedPaths.push("src_measures_execution")
  if (phaseMapState !== "verified") blockedPaths.push("recognition")
  if (
    sourceRecords.length > 0 &&
    sourceRecords.some((record) => sourceRecordKey(record) === null)
  ) {
    blockedPaths.push("codex_source_record")
  }

  return {
    antechamber_state: antechamberState,
    phase_map_state: phaseMapState,
    integrity_governance: integrity,
    codex_source_records: records,
    oar1_present: oar1Present,
    oar2_present: oar2Present,
    blocked_paths: blockedPaths,
    missing_paths: missingPaths,
  }
}
