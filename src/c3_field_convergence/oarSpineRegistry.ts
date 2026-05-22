import { supabase, supabaseConfigError } from "@/integrations/supabase/client"
import type { OarProcessInstance, OarTransitionLogEntry, SpineValidationCheck } from "./operationsSpine"

type ProcessRow = OarProcessInstance & {
  seeded_reference_standing: string
  partial_oar1_reference: string | null
  correction_scope: string | null
  created_at: string
  updated_at: string
}

type TransitionRow = OarTransitionLogEntry & {
  transition_event_key: string
  transition_type: string
  timestamp: string
  created_at: string
}

type SeededReferenceRow = {
  seeded_reference_key: string
  seeded_reference_type: string
  seeded_reference_path: string
  seeded_status: string
}

export type OarSpineRegistryState = {
  processInstances: OarProcessInstance[]
  transitionLog: OarTransitionLogEntry[]
  seededReferenceChecks: SpineValidationCheck[]
  persistenceStanding: "registry_backed" | "held_pending_persistence"
  persistenceMessage: string
}

function seededReferenceCheck(row: SeededReferenceRow): SpineValidationCheck {
  return {
    check_key: `${row.seeded_reference_key}_seeded_reference`,
    standing: row.seeded_status ? "passed" : "correction_required",
    evidence: `${row.seeded_reference_type}: ${row.seeded_reference_path}`,
  }
}

export async function loadOarSpineRegistry(): Promise<OarSpineRegistryState> {
  if (supabaseConfigError) {
    throw new Error(supabaseConfigError)
  }

  const [processResult, transitionResult, seededReferenceResult] = await Promise.all([
    supabase
      .from("c3_oar_process_instance")
      .select("*")
      .order("created_at", { ascending: true }),
    supabase
      .from("c3_oar_transition_event")
      .select("*")
      .order("timestamp", { ascending: true }),
    supabase
      .from("c3_oar_seeded_reference")
      .select("*")
      .order("created_at", { ascending: true }),
  ])

  if (processResult.error) throw processResult.error
  if (transitionResult.error) throw transitionResult.error
  if (seededReferenceResult.error) throw seededReferenceResult.error

  const processRows = (processResult.data ?? []) as ProcessRow[]
  const transitionRows = (transitionResult.data ?? []) as TransitionRow[]
  const seededReferenceRows = (seededReferenceResult.data ?? []) as SeededReferenceRow[]

  return {
    processInstances: processRows.map((row) => ({
      process_instance_key: row.process_instance_key,
      lifecycle_type: row.lifecycle_type,
      source_oar2_path: row.source_oar2_path,
      source_oar2_standing: row.source_oar2_standing,
      expected_oar1_path: row.expected_oar1_path,
      actual_oar1_path: row.actual_oar1_path,
      evidence_path: row.evidence_path,
      execution_standing: row.execution_standing,
      validation_standing: row.validation_standing,
      db_mutation_standing: row.db_mutation_standing ?? "not_authorized",
      src_mutation_standing: row.src_mutation_standing ?? "not_authorized",
      deploy_standing: row.deploy_standing,
      held_standing: row.held_standing,
      seeded_reference_standing: row.seeded_reference_standing,
      correction_source_oar2_path: row.correction_source_oar2_path,
      correction_oar2_path: row.correction_oar2_path,
      partial_oar1_reference: row.partial_oar1_reference,
      validation_finding: row.validation_finding,
      correction_scope: row.correction_scope,
      execution_result: row.execution_result,
    })),
    transitionLog: transitionRows.map((row) => ({
      transition_event_key: row.transition_event_key,
      process_instance_key: row.process_instance_key,
      actor: row.actor,
      from_status: row.from_status,
      to_status: row.to_status,
      transition_type: row.transition_type,
      timestamp: row.timestamp,
      notes: row.notes,
      evidence_reference: row.evidence_reference,
    })),
    seededReferenceChecks: seededReferenceRows.map(seededReferenceCheck),
    persistenceStanding: "registry_backed",
    persistenceMessage: "Rendering persistent Supabase registry standing.",
  }
}
