export type OarType = "oar1" | "oar2";

export type QueueStatus =
  | "draft"
  | "queued"
  | "preflight_required"
  | "awaiting_operator_confirm"
  | "approved_for_execution"
  | "executing"
  | "blocked"
  | "refused"
  | "completed"
  | "closed";

export type PreflightStatus = "required" | "passed" | "failed" | "waived";

export type EvidenceType =
  | "file_check"
  | "db_query"
  | "migration_result"
  | "git_commit"
  | "operator_review"
  | "runtime_validation"
  | "refusal_record";

export type RuntimeQueueStanding = {
  queue_key: string;
  process_key: string;
  oar_key: string;
  oar_type: OarType;
  queue_status: QueueStatus;
  preflight_status: PreflightStatus;
  operator_confirmed_at: string | null;
  execution_started_at: string | null;
  execution_completed_at: string | null;
  blocked_reason: string | null;
  refusal_reason: string | null;
  oar1_path: string | null;
};

export type RuntimeEvidenceDraft = {
  evidence_key: string;
  queue_key: string;
  evidence_type: EvidenceType;
  evidence_summary: string;
  validation_query?: string | null;
  validation_result?: Record<string, unknown> | null;
  artifact_path?: string | null;
  commit_hash?: string | null;
};

export type RuntimeValidationResult = {
  allowed: boolean;
  reason: string;
  required?: string[];
};

export type QueuePatch = Partial<
  Pick<
    RuntimeQueueStanding,
    | "queue_status"
    | "preflight_status"
    | "operator_confirmed_at"
    | "execution_started_at"
    | "execution_completed_at"
    | "blocked_reason"
    | "refusal_reason"
    | "oar1_path"
  >
>;

export type ProcessRegistryRuntimeAdapter = {
  fetchQueueStanding(queueKey: string): Promise<RuntimeQueueStanding | null>;
  updateQueueStanding(queueKey: string, patch: QueuePatch): Promise<RuntimeQueueStanding>;
  insertExecutionEvidence(evidence: RuntimeEvidenceDraft): Promise<RuntimeEvidenceDraft>;
};

const allowedTransitions: Record<QueueStatus, QueueStatus[]> = {
  draft: ["queued", "blocked", "refused"],
  queued: ["preflight_required", "awaiting_operator_confirm", "blocked", "refused"],
  preflight_required: ["awaiting_operator_confirm", "blocked", "refused"],
  awaiting_operator_confirm: ["approved_for_execution", "blocked", "refused"],
  approved_for_execution: ["executing", "blocked", "refused"],
  executing: ["completed", "blocked", "refused"],
  completed: ["closed"],
  blocked: ["preflight_required", "awaiting_operator_confirm", "refused"],
  refused: [],
  closed: [],
};

export function fetchQueueStanding(
  adapter: Pick<ProcessRegistryRuntimeAdapter, "fetchQueueStanding">,
  queueKey: string,
): Promise<RuntimeQueueStanding | null> {
  assertNonEmpty("queueKey", queueKey);
  return adapter.fetchQueueStanding(queueKey);
}

export function validateLifecycleEligibility(
  standing: RuntimeQueueStanding,
  targetStatus: QueueStatus,
  options: { evidenceCount?: number; oar1Path?: string | null } = {},
): RuntimeValidationResult {
  const allowedTargets = allowedTransitions[standing.queue_status] ?? [];

  if (!allowedTargets.includes(targetStatus)) {
    return {
      allowed: false,
      reason: `Transition ${standing.queue_status} -> ${targetStatus} is not allowed.`,
    };
  }

  if (targetStatus === "executing") {
    const required: string[] = [];
    if (standing.preflight_status !== "passed") required.push("preflight_status = passed");
    if (!standing.operator_confirmed_at) required.push("operator_confirmed_at");

    if (required.length > 0) {
      return {
        allowed: false,
        reason: "Execution requires passed preflight and operator confirmation.",
        required,
      };
    }
  }

  if (targetStatus === "closed") {
    const required: string[] = [];
    if (!options.oar1Path && !standing.oar1_path) required.push("oar1_path");
    if (!options.evidenceCount || options.evidenceCount < 1) required.push("execution evidence");
    if (!standing.execution_completed_at) required.push("execution_completed_at");

    if (required.length > 0) {
      return {
        allowed: false,
        reason: "Closeout requires OAR1 path, completion timestamp, and execution evidence.",
        required,
      };
    }
  }

  return {
    allowed: true,
    reason: `Transition ${standing.queue_status} -> ${targetStatus} is eligible.`,
  };
}

export function recordPreflightResult(
  standing: RuntimeQueueStanding,
  preflightStatus: Extract<PreflightStatus, "passed" | "failed" | "waived">,
  reason?: string,
): QueuePatch {
  if (!["queued", "preflight_required", "blocked"].includes(standing.queue_status)) {
    throw new Error(`Cannot record preflight from ${standing.queue_status}.`);
  }

  if (preflightStatus === "failed") {
    return {
      preflight_status: "failed",
      queue_status: "blocked",
      blocked_reason: reason ?? "preflight_failed",
    };
  }

  return {
    preflight_status: preflightStatus,
    queue_status: "awaiting_operator_confirm",
    blocked_reason: reason ?? null,
  };
}

export function recordOperatorConfirmation(
  standing: RuntimeQueueStanding,
  confirmation: { confirmed: boolean; confirmedAt: string },
): QueuePatch {
  if (!confirmation.confirmed) {
    throw new Error("Operator confirmation was not supplied.");
  }

  assertNonEmpty("confirmedAt", confirmation.confirmedAt);

  if (standing.queue_status !== "awaiting_operator_confirm") {
    throw new Error(`Cannot record operator confirmation from ${standing.queue_status}.`);
  }

  if (standing.preflight_status !== "passed") {
    throw new Error("Operator confirmation requires passed preflight.");
  }

  return {
    operator_confirmed_at: confirmation.confirmedAt,
    queue_status: "approved_for_execution",
  };
}

export function transitionAllowedLifecycleState(
  standing: RuntimeQueueStanding,
  targetStatus: QueueStatus,
  options: {
    now: string;
    evidenceCount?: number;
    oar1Path?: string | null;
  },
): QueuePatch {
  assertNonEmpty("now", options.now);

  const validation = validateLifecycleEligibility(standing, targetStatus, {
    evidenceCount: options.evidenceCount,
    oar1Path: options.oar1Path,
  });

  if (!validation.allowed) {
    throw new Error(validation.reason);
  }

  if (targetStatus === "executing") {
    return {
      queue_status: "executing",
      execution_started_at: options.now,
    };
  }

  if (targetStatus === "completed") {
    return {
      queue_status: "completed",
      execution_completed_at: options.now,
    };
  }

  if (targetStatus === "closed") {
    return {
      queue_status: "closed",
      oar1_path: options.oar1Path ?? standing.oar1_path,
    };
  }

  return {
    queue_status: targetStatus,
  };
}

export function insertExecutionEvidenceDraft(evidence: RuntimeEvidenceDraft): RuntimeEvidenceDraft {
  assertNonEmpty("evidence_key", evidence.evidence_key);
  assertNonEmpty("queue_key", evidence.queue_key);
  assertNonEmpty("evidence_summary", evidence.evidence_summary);

  return {
    evidence_key: evidence.evidence_key,
    queue_key: evidence.queue_key,
    evidence_type: evidence.evidence_type,
    evidence_summary: evidence.evidence_summary,
    validation_query: evidence.validation_query ?? null,
    validation_result: evidence.validation_result ?? null,
    artifact_path: evidence.artifact_path ?? null,
    commit_hash: evidence.commit_hash ?? null,
  };
}

export function attachOar1Path(standing: RuntimeQueueStanding, oar1Path: string): QueuePatch {
  assertNonEmpty("oar1Path", oar1Path);

  if (!["completed", "closed"].includes(standing.queue_status)) {
    throw new Error(`Cannot attach OAR1 path from ${standing.queue_status}.`);
  }

  return {
    oar1_path: oar1Path,
  };
}

export function createRuntimeValidationResult(
  standing: RuntimeQueueStanding,
  evidenceCount: number,
): Record<string, unknown> {
  return {
    queue_key: standing.queue_key,
    queue_status: standing.queue_status,
    preflight_status: standing.preflight_status,
    operator_confirmed: Boolean(standing.operator_confirmed_at),
    execution_started: Boolean(standing.execution_started_at),
    execution_completed: Boolean(standing.execution_completed_at),
    oar1_path_present: Boolean(standing.oar1_path),
    evidence_count: evidenceCount,
  };
}

function assertNonEmpty(field: string, value: string): void {
  if (!value.trim()) {
    throw new Error(`${field} is required.`);
  }
}
