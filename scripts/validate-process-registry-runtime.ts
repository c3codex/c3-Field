#!/usr/bin/env tsx

import {
  attachOar1Path,
  createRuntimeValidationResult,
  insertExecutionEvidenceDraft,
  recordOperatorConfirmation,
  recordPreflightResult,
  transitionAllowedLifecycleState,
  type RuntimeQueueStanding,
} from "./lib/process-registry-runtime";

function assert(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function expectThrows(label: string, fn: () => unknown): string {
  try {
    fn();
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }

  throw new Error(`${label} did not throw.`);
}

function applyPatch(standing: RuntimeQueueStanding, patch: Partial<RuntimeQueueStanding>): RuntimeQueueStanding {
  return {
    ...standing,
    ...patch,
  };
}

const baseStanding: RuntimeQueueStanding = {
  queue_key: "queue_runtime_validation_v1",
  process_key: "runtime_validation_v1",
  oar_key: "oar2_bounded_process_registry_runtime_implementation_v1",
  oar_type: "oar2",
  queue_status: "queued",
  preflight_status: "required",
  operator_confirmed_at: null,
  execution_started_at: null,
  execution_completed_at: null,
  blocked_reason: null,
  refusal_reason: null,
  oar1_path: null,
};

const directExecutionRejected = expectThrows("direct queued to executing", () =>
  transitionAllowedLifecycleState(baseStanding, "executing", {
    now: "2026-05-19T00:00:00.000Z",
  }),
);

const failedPreflightPatch = recordPreflightResult(baseStanding, "failed", "preflight_failed");
assert(failedPreflightPatch.queue_status === "blocked", "failed preflight should block queue");
assert(failedPreflightPatch.preflight_status === "failed", "failed preflight should remain visible");

const passedPreflightStanding = applyPatch(baseStanding, recordPreflightResult(baseStanding, "passed"));
assert(
  passedPreflightStanding.queue_status === "awaiting_operator_confirm",
  "passed preflight should await operator confirmation",
);

const unconfirmedRejected = expectThrows("missing operator confirmation", () =>
  recordOperatorConfirmation(passedPreflightStanding, {
    confirmed: false,
    confirmedAt: "2026-05-19T00:01:00.000Z",
  }),
);

const approvedStanding = applyPatch(
  passedPreflightStanding,
  recordOperatorConfirmation(passedPreflightStanding, {
    confirmed: true,
    confirmedAt: "2026-05-19T00:01:00.000Z",
  }),
);
assert(approvedStanding.queue_status === "approved_for_execution", "operator confirmation should approve execution");

const executingStanding = applyPatch(
  approvedStanding,
  transitionAllowedLifecycleState(approvedStanding, "executing", {
    now: "2026-05-19T00:02:00.000Z",
  }),
);
assert(executingStanding.queue_status === "executing", "approved queue should enter executing");
assert(Boolean(executingStanding.execution_started_at), "executing transition should stamp start time");

const completedStanding = applyPatch(
  executingStanding,
  transitionAllowedLifecycleState(executingStanding, "completed", {
    now: "2026-05-19T00:03:00.000Z",
  }),
);
assert(completedStanding.queue_status === "completed", "executing queue should complete");
assert(Boolean(completedStanding.execution_completed_at), "completed transition should stamp completion time");

const closeWithoutEvidenceRejected = expectThrows("close without evidence", () =>
  transitionAllowedLifecycleState(completedStanding, "closed", {
    now: "2026-05-19T00:04:00.000Z",
    evidenceCount: 0,
    oar1Path: "docs/oar/process/oar1_bounded_process_registry_runtime_implementation_v1.meta.md",
  }),
);

const evidence = insertExecutionEvidenceDraft({
  evidence_key: "evidence_runtime_validation_v1",
  queue_key: completedStanding.queue_key,
  evidence_type: "runtime_validation",
  evidence_summary: "Runtime validation confirms bounded lifecycle helpers reject bypass and require evidence.",
  validation_result: {
    directExecutionRejected,
    unconfirmedRejected,
    closeWithoutEvidenceRejected,
  },
  artifact_path: "docs/oar/process/oar1_bounded_process_registry_runtime_implementation_v1.meta.md",
});
assert(evidence.validation_result !== null, "evidence should preserve validation result");

const withOar1Standing = applyPatch(
  completedStanding,
  attachOar1Path(completedStanding, "docs/oar/process/oar1_bounded_process_registry_runtime_implementation_v1.meta.md"),
);

const closedStanding = applyPatch(
  withOar1Standing,
  transitionAllowedLifecycleState(withOar1Standing, "closed", {
    now: "2026-05-19T00:04:00.000Z",
    evidenceCount: 1,
    oar1Path: withOar1Standing.oar1_path,
  }),
);
assert(closedStanding.queue_status === "closed", "completed queue with evidence and OAR1 should close");

const validationResult = createRuntimeValidationResult(closedStanding, 1);

console.log(
  JSON.stringify(
    {
      runtime_imports_cleanly: true,
      direct_execution_rejected: directExecutionRejected,
      missing_operator_confirmation_rejected: unconfirmedRejected,
      close_without_evidence_rejected: closeWithoutEvidenceRejected,
      evidence_required_for_closeout: true,
      final_validation_result: validationResult,
    },
    null,
    2,
  ),
);
