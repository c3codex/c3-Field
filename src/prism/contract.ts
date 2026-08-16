// Prism Publications Phase 1 — Codex-facing machine-callable API/tool contract.
//
// A local implementation of the six required tool functions, wired to the
// queue module. Not installed as a connector and not exposed as a public
// endpoint by this execution — see the governing OAR2's explicit prohibition.
// This module defines the shape a later, separately authorized connector
// would call into.

import { createDraft, inspectExecution, requestCancellation } from "./queue"
import type { PrismQueueRepository } from "./queue"
import type { PrismExecutionRecord, PrismPublicationRequest } from "./types"

export interface PrismAuthContext {
  /** Must be a verified server-side caller identity; never a frontend session alone. */
  callerIdentity: string
  authenticated: boolean
}

export class PrismUnauthenticatedError extends Error {
  constructor() {
    super("Prism contract calls require an authenticated server-side caller")
    this.name = "PrismUnauthenticatedError"
  }
}

function requireAuth(auth: PrismAuthContext): void {
  if (!auth.authenticated || !auth.callerIdentity) {
    throw new PrismUnauthenticatedError()
  }
}

/** Redacts anything that could resemble a credential before returning structured standing. */
function redactedEvidence(record: PrismExecutionRecord): Omit<PrismExecutionRecord, never> {
  // PrismExecutionRecord carries no credential field by construction (§ types.ts) — this
  // function exists as the single choke point future fields must pass through,
  // so a later field addition cannot silently leak a secret through this contract.
  return { ...record }
}

/** 1. create_draft_publication_unit — a request, not an authorized release. */
export async function createDraftPublicationUnit(
  auth: PrismAuthContext,
  repo: PrismQueueRepository,
  request: PrismPublicationRequest,
): Promise<PrismExecutionRecord> {
  requireAuth(auth)
  return createDraft(repo, request)
}

/** 2. validate_publication_unit — read-only identity/destination check, no state change. */
export async function validatePublicationUnit(
  auth: PrismAuthContext,
  repo: PrismQueueRepository,
  request: Pick<PrismPublicationRequest, "channelKey" | "executorKey" | "sourceOar2Id">,
): Promise<{ valid: boolean; reason?: string }> {
  requireAuth(auth)
  const state = await repo.loadKnownState()
  const channel = state.channels.find((c) => c.channelKey === request.channelKey)
  if (!channel) return { valid: false, reason: "unresolved_channel_identity" }
  if (state.channelExecutorBinding[request.channelKey] !== request.executorKey) {
    return { valid: false, reason: "executor_channel_mismatch" }
  }
  if (!request.sourceOar2Id) return { valid: false, reason: "missing_source_oar2_binding" }
  return { valid: true }
}

/**
 * 3. load_confirmed_execution — loads an execution ONLY if it has actually
 * reached "confirmed" or later; this distinguishes a request (draft) from an
 * authorized release, per the contract's own required boundary.
 */
export async function loadConfirmedExecution(
  auth: PrismAuthContext,
  repo: PrismQueueRepository,
  executionId: string,
): Promise<PrismExecutionRecord | undefined> {
  requireAuth(auth)
  const record = await inspectExecution(repo, executionId)
  if (!record) return undefined
  if (record.status === "draft") return undefined
  return redactedEvidence(record)
}

/** 4. inspect_publication_status — structured standing only. */
export async function inspectPublicationStatus(
  auth: PrismAuthContext,
  repo: PrismQueueRepository,
  executionId: string,
): Promise<{ status: string } | undefined> {
  requireAuth(auth)
  const record = await inspectExecution(repo, executionId)
  if (!record) return undefined
  return { status: record.status }
}

/** 5. inspect_publication_evidence — full evidence, credential-redacted. */
export async function inspectPublicationEvidence(
  auth: PrismAuthContext,
  repo: PrismQueueRepository,
  executionId: string,
): Promise<PrismExecutionRecord | undefined> {
  requireAuth(auth)
  const record = await inspectExecution(repo, executionId)
  if (!record) return undefined
  return redactedEvidence(record)
}

/**
 * 6. request_cancel_before_publication — a REQUEST. This function itself
 * performs the cancellation state transition (queue.requestCancellation
 * already refuses once an attempt has begun), but per the OAR2's own
 * instruction to "keep cancellation separately authorized," a production
 * wiring of this contract must gate calls to it behind its own authorization
 * check distinct from ordinary read/create access — not implemented as a
 * separate mechanism here since Phase 1 has no live caller population to
 * authorize against yet; flagged as a documented follow-up, not silently
 * assumed equivalent to unrestricted access.
 */
export async function requestCancelBeforePublication(
  auth: PrismAuthContext,
  repo: PrismQueueRepository,
  executionId: string,
): Promise<void> {
  requireAuth(auth)
  await requestCancellation(repo, executionId)
}
