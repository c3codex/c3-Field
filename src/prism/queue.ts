// Prism Publications Phase 1 — governed queue operations.
//
// Operates against an injectable PrismQueueRepository, not a live database
// connection. This module authorizes code formation only, per the governing
// OAR2 — no live queue row is created or mutated by this module itself; a
// Supabase-backed repository implementation, and the credential/connection
// wiring it would require, is a separate, later, explicitly authorized step
// (see docs/oar/measures_registry/prism_publications_phase1_implementation_v1.meta.md,
// "Deployment prerequisites").
//
// Queue truth is intended to live entirely in `measures_distribution_execution`
// (and the tables it references) once that repository implementation exists.
// This module's job is to make every transition explicit and guarded — the
// frontend or a Codex-facing client must never invent standing.

import { guardPublicationRequest, guardRetry, type GuardResult, type KnownState } from "./idempotency"
import type { PrismExecutionRecord, PrismExecutionStatus, PrismPublicationRequest } from "./types"

export interface PrismQueueRepository {
  create(record: PrismExecutionRecord): Promise<void>
  update(executionId: string, patch: Partial<PrismExecutionRecord>): Promise<void>
  findById(executionId: string): Promise<PrismExecutionRecord | undefined>
  findByIdempotencyKey(idempotencyKey: string): Promise<PrismExecutionRecord | undefined>
  listByPublicationUnit(publicationUnitId: string): Promise<PrismExecutionRecord[]>
  loadKnownState(): Promise<KnownState>
}

/** Reference in-memory repository — for tests and local validation only. */
export class InMemoryPrismQueueRepository implements PrismQueueRepository {
  private records = new Map<string, PrismExecutionRecord>()

  constructor(private knownStateSeed: Omit<KnownState, "priorExecutions">) {}

  async create(record: PrismExecutionRecord): Promise<void> {
    if (this.records.has(record.executionId)) {
      throw new Error(`execution ${record.executionId} already exists`)
    }
    this.records.set(record.executionId, { ...record })
  }

  async update(executionId: string, patch: Partial<PrismExecutionRecord>): Promise<void> {
    const existing = this.records.get(executionId)
    if (!existing) throw new Error(`execution ${executionId} not found`)
    this.records.set(executionId, { ...existing, ...patch })
  }

  async findById(executionId: string): Promise<PrismExecutionRecord | undefined> {
    return this.records.get(executionId)
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<PrismExecutionRecord | undefined> {
    return [...this.records.values()].find((r) => r.idempotencyKey === idempotencyKey)
  }

  async listByPublicationUnit(publicationUnitId: string): Promise<PrismExecutionRecord[]> {
    return [...this.records.values()].filter((r) => r.publicationUnitId === publicationUnitId)
  }

  /** Test/reference-only helper — a real repository would never expose an unbounded scan like this. */
  protected listAll(): PrismExecutionRecord[] {
    return [...this.records.values()]
  }

  async loadKnownState(): Promise<KnownState> {
    return { ...this.knownStateSeed, priorExecutions: [...this.records.values()] }
  }
}

function requireGuardPass(result: GuardResult): void {
  if (!result.allowed) {
    throw new Error(`refused (${result.reason}): ${result.detail}`)
  }
}

/** 1. Creating a draft execution record. */
export async function createDraft(
  repo: PrismQueueRepository,
  request: PrismPublicationRequest,
  idGenerator: () => string = () => crypto.randomUUID(),
): Promise<PrismExecutionRecord> {
  const state = await repo.loadKnownState()
  requireGuardPass(guardPublicationRequest(request, state))

  const record: PrismExecutionRecord = {
    executionId: idGenerator(),
    publicationUnitId: request.publicationUnitId,
    distributionAssetId: request.distributionAssetId,
    executionInstanceId: request.executionInstanceId,
    sourceOar2Id: request.sourceOar2Id,
    executorKey: request.executorKey,
    channelKey: request.channelKey,
    status: "draft",
    attemptNumber: 0,
    idempotencyKey: request.idempotencyKey,
    contentHash: request.contentHash,
    assetHash: request.assetHash,
    scheduledFor: request.scheduledFor,
  }
  await repo.create(record)
  return record
}

/** 2 & 3. Validate executor/channel identity and bind a confirmed source OAR2 — combined as "confirm". */
export async function confirmExecution(
  repo: PrismQueueRepository,
  executionId: string,
  confirmedSourceOar2Id: string,
): Promise<void> {
  const record = await repo.findById(executionId)
  if (!record) throw new Error(`execution ${executionId} not found`)
  if (record.status !== "draft") {
    throw new Error(`execution ${executionId} is "${record.status}", not "draft" — cannot confirm`)
  }
  if (!confirmedSourceOar2Id || confirmedSourceOar2Id.trim().length === 0) {
    throw new Error("confirmation requires an explicit Operator-confirmed source OAR2 id")
  }
  await repo.update(executionId, { status: "confirmed", sourceOar2Id: confirmedSourceOar2Id })
}

/** 4. Release an eligible execution (confirmed -> released). */
export async function releaseExecution(repo: PrismQueueRepository, executionId: string): Promise<void> {
  const record = await repo.findById(executionId)
  if (!record) throw new Error(`execution ${executionId} not found`)
  if (record.status !== "confirmed") {
    throw new Error(`execution ${executionId} is "${record.status}", not "confirmed" — cannot release`)
  }
  await repo.update(executionId, { status: "released" })
}

/** 5. Assign a scheduled time (released -> scheduled). */
export async function scheduleExecution(
  repo: PrismQueueRepository,
  executionId: string,
  scheduledFor: string,
): Promise<void> {
  const record = await repo.findById(executionId)
  if (!record) throw new Error(`execution ${executionId} not found`)
  if (record.status !== "released") {
    throw new Error(`execution ${executionId} is "${record.status}", not "released" — cannot schedule`)
  }
  await repo.update(executionId, { status: "scheduled", scheduledFor })
}

/** 6. Record an attempt (scheduled -> publication_attempted). */
export async function recordAttempt(repo: PrismQueueRepository, executionId: string): Promise<void> {
  const record = await repo.findById(executionId)
  if (!record) throw new Error(`execution ${executionId} not found`)
  if (record.status !== "scheduled" && record.status !== "publication_uncertain") {
    throw new Error(`execution ${executionId} is "${record.status}" — cannot record an attempt from this state`)
  }
  await repo.update(executionId, {
    status: "publication_attempted",
    attemptNumber: record.attemptNumber + 1,
    executedAt: new Date().toISOString(),
  })
}

/** 7. Record published evidence (publication_attempted -> published). */
export async function recordPublished(
  repo: PrismQueueRepository,
  executionId: string,
  evidence: { atUri: string; cid: string; publicUrl: string },
): Promise<void> {
  const record = await repo.findById(executionId)
  if (!record) throw new Error(`execution ${executionId} not found`)
  if (record.status !== "publication_attempted") {
    throw new Error(`execution ${executionId} is "${record.status}", not "publication_attempted" — cannot record published`)
  }
  await repo.update(executionId, {
    status: "published",
    publishedAt: new Date().toISOString(),
    atUri: evidence.atUri,
    cid: evidence.cid,
    publicUrl: evidence.publicUrl,
  })
}

/** 8. Record a classified failure (publication_attempted -> failed). */
export async function recordFailure(
  repo: PrismQueueRepository,
  executionId: string,
  errorClass: string,
  errorMessage: string,
): Promise<void> {
  const record = await repo.findById(executionId)
  if (!record) throw new Error(`execution ${executionId} not found`)
  if (record.status !== "publication_attempted") {
    throw new Error(`execution ${executionId} is "${record.status}", not "publication_attempted" — cannot record failure`)
  }
  await repo.update(executionId, { status: "failed", errorClass, errorMessage })
}

/** 9. Record uncertain standing (publication_attempted -> publication_uncertain). Never auto-retried. */
export async function recordUncertain(repo: PrismQueueRepository, executionId: string, detail: string): Promise<void> {
  const record = await repo.findById(executionId)
  if (!record) throw new Error(`execution ${executionId} not found`)
  if (record.status !== "publication_attempted") {
    throw new Error(`execution ${executionId} is "${record.status}", not "publication_attempted" — cannot record uncertain`)
  }
  await repo.update(executionId, { status: "publication_uncertain", errorMessage: detail })
}

/** 10. Request cancellation before publication. Refused once an attempt has begun. */
export async function requestCancellation(repo: PrismQueueRepository, executionId: string): Promise<void> {
  const record = await repo.findById(executionId)
  if (!record) throw new Error(`execution ${executionId} not found`)
  const cancellableStates: PrismExecutionStatus[] = ["draft", "formed", "confirmed", "routed", "released", "scheduled"]
  if (!cancellableStates.includes(record.status)) {
    throw new Error(
      `execution ${executionId} is "${record.status}" — cancellation before publication is only permitted from ${cancellableStates.join(", ")}`,
    )
  }
  await repo.update(executionId, { status: "cancelled_before_publication" })
}

/** 11. Inspect state and evidence (read-only). */
export async function inspectExecution(
  repo: PrismQueueRepository,
  executionId: string,
): Promise<PrismExecutionRecord | undefined> {
  return repo.findById(executionId)
}

/** Retry an execution left `publication_uncertain`, requiring recorded retry authority. */
export async function retryUncertainExecution(
  repo: PrismQueueRepository,
  executionId: string,
  recordedRetryAuthority: string,
): Promise<void> {
  const record = await repo.findById(executionId)
  if (!record) throw new Error(`execution ${executionId} not found`)
  requireGuardPass(guardRetry(record, recordedRetryAuthority))
  await repo.update(executionId, { status: "scheduled" })
}
