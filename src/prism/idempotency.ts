// Prism Publications Phase 1 — identity and idempotency guard.
//
// Pure validation: given a publication request and the current known state
// (registered channels/executors, prior executions), determines whether the
// request may proceed, and if not, which specific refusal reason applies.
// Contains no I/O — callers supply the "known state" from the Registry.

import type { PrismChannelDefinition, PrismExecutionRecord, PrismPublicationRequest } from "./types"

export type GuardRefusalReason =
  | "missing_source_oar2_binding"
  | "channel_not_confirmed_active"
  | "unresolved_channel_identity"
  | "executor_channel_mismatch"
  | "content_changed_after_confirmation"
  | "asset_changed_after_confirmation"
  | "duplicate_idempotency_key"
  | "cross_identity_publication"
  | "unsupported_cross_posting"
  | "retry_without_recorded_authority"
  | "publication_after_cancellation"

export interface GuardResult {
  allowed: boolean
  reason?: GuardRefusalReason
  detail?: string
}

export interface KnownState {
  channels: PrismChannelDefinition[]
  /** channelKey -> executorKey the channel is actually bound to in the Registry */
  channelExecutorBinding: Record<string, string>
  /** channel status as currently recorded (must be 'active' to publish) */
  channelStatus: Record<string, "held" | "active" | "superseded" | "blocked">
  priorExecutions: PrismExecutionRecord[]
}

function ok(): GuardResult {
  return { allowed: true }
}

function refuse(reason: GuardRefusalReason, detail: string): GuardResult {
  return { allowed: false, reason, detail }
}

export function guardPublicationRequest(request: PrismPublicationRequest, state: KnownState): GuardResult {
  if (!request.sourceOar2Id || request.sourceOar2Id.trim().length === 0) {
    return refuse("missing_source_oar2_binding", "no Operator-confirmed source OAR2 identity supplied")
  }

  const channel = state.channels.find((c) => c.channelKey === request.channelKey)
  if (!channel) {
    return refuse("unresolved_channel_identity", `no registered channel for channelKey "${request.channelKey}"`)
  }

  const boundExecutor = state.channelExecutorBinding[request.channelKey]
  if (!boundExecutor) {
    return refuse("unresolved_channel_identity", `channel "${request.channelKey}" has no recorded executor binding`)
  }
  if (boundExecutor !== request.executorKey) {
    return refuse(
      "executor_channel_mismatch",
      `channel "${request.channelKey}" is bound to executor "${boundExecutor}", not "${request.executorKey}"`,
    )
  }

  const status = state.channelStatus[request.channelKey]
  if (status !== "active") {
    return refuse(
      "channel_not_confirmed_active",
      `channel "${request.channelKey}" is "${status ?? "unknown"}", not confirmed active`,
    )
  }

  const priorByIdempotencyKey = state.priorExecutions.find((e) => e.idempotencyKey === request.idempotencyKey)
  if (priorByIdempotencyKey) {
    // Same key, same content/asset hash = idempotent replay of an identical
    // request, not a duplicate in the refused sense — but this guard treats
    // ANY prior record with this key as requiring the caller to inspect and
    // decide, since silently treating it as "fine" without comparing every
    // field would risk exactly the "changed content after confirmation" case
    // this guard exists to prevent.
    if (
      priorByIdempotencyKey.contentHash !== request.contentHash ||
      priorByIdempotencyKey.assetHash !== request.assetHash
    ) {
      return refuse(
        "content_changed_after_confirmation",
        `idempotency key "${request.idempotencyKey}" was previously bound to a different content/asset hash`,
      )
    }
    return refuse(
      "duplicate_idempotency_key",
      `idempotency key "${request.idempotencyKey}" already has a recorded execution (${priorByIdempotencyKey.executionId})`,
    )
  }

  const priorForPublicationUnit = state.priorExecutions.filter(
    (e) => e.publicationUnitId === request.publicationUnitId,
  )
  for (const prior of priorForPublicationUnit) {
    if (prior.status === "cancelled_before_publication") {
      return refuse(
        "publication_after_cancellation",
        `publication unit "${request.publicationUnitId}" was cancelled before publication (execution ${prior.executionId})`,
      )
    }
    if (prior.channelKey !== request.channelKey) {
      return refuse(
        "cross_identity_publication",
        `publication unit "${request.publicationUnitId}" already has an execution bound to a different channel ("${prior.channelKey}")`,
      )
    }
    if (prior.contentHash !== request.contentHash) {
      return refuse(
        "content_changed_after_confirmation",
        `publication unit "${request.publicationUnitId}" content hash changed since a prior recorded execution`,
      )
    }
    if (request.assetHash && prior.assetHash && prior.assetHash !== request.assetHash) {
      return refuse(
        "asset_changed_after_confirmation",
        `publication unit "${request.publicationUnitId}" asset hash changed since a prior recorded execution`,
      )
    }
  }

  return ok()
}

/**
 * A retry of an existing execution requires the caller to supply an explicit
 * `recordedRetryAuthority` (e.g. a separate Operator-confirmed OAR2 id) — a
 * retry is never authorized merely because the caller wants to try again.
 */
export function guardRetry(
  priorExecution: PrismExecutionRecord,
  recordedRetryAuthority: string | undefined,
): GuardResult {
  if (!recordedRetryAuthority || recordedRetryAuthority.trim().length === 0) {
    return refuse(
      "retry_without_recorded_authority",
      `retry of execution "${priorExecution.executionId}" requires a separately recorded retry authority`,
    )
  }
  if (priorExecution.status === "cancelled_before_publication") {
    return refuse(
      "publication_after_cancellation",
      `execution "${priorExecution.executionId}" was cancelled before publication and cannot be retried`,
    )
  }
  return ok()
}
