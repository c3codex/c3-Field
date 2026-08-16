// Prism Publications Phase 1 — shared type contracts.
// Non-production foundation. See docs/oar/measures_registry/prism_publications_phase1_implementation_v1.meta.md.

export type PrismChannelKey = "bluesky_measures_registry" | "bluesky_undrifted"

export type PrismExecutionStatus =
  | "draft"
  | "formed"
  | "confirmed"
  | "routed"
  | "released"
  | "scheduled"
  | "publication_attempted"
  | "published"
  | "failed"
  | "publication_uncertain"
  | "held_identity_or_authority_mismatch"
  | "cancelled_before_publication"

export type PrismNotificationEvent =
  | "route_available"
  | "route_acknowledged"
  | "execution_released"
  | "scheduled"
  | "publication_attempted"
  | "published"
  | "failed"
  | "publication_uncertain"
  | "held_identity_or_authority_mismatch"
  | "cancelled_before_publication"

export interface PrismChannelDefinition {
  channelKey: PrismChannelKey
  handle: string
  publicProfileUrl: string
  identityClass: "institutional" | "editorial"
  credentialReference: string
}

export interface PrismPublicationRequest {
  publicationUnitId: string
  distributionAssetId: string
  executionInstanceId: string
  sourceOar2Id: string
  executorKey: "bluesky_api"
  channelKey: PrismChannelKey
  text: string
  images?: PrismImageInput[]
  scheduledFor: string
  scheduledTimezone: string
  idempotencyKey: string
  contentHash: string
  assetHash?: string
}

export interface PrismImageInput {
  bytesBase64: string
  mimeType: string
  altText: string
}

export interface PrismExecutionRecord {
  executionId: string
  publicationUnitId: string
  distributionAssetId: string
  executionInstanceId: string
  sourceOar2Id: string
  executorKey: "bluesky_api"
  channelKey: PrismChannelKey
  status: PrismExecutionStatus
  attemptNumber: number
  idempotencyKey: string
  contentHash: string
  assetHash?: string
  scheduledFor: string
  executedAt?: string
  publishedAt?: string
  atUri?: string
  cid?: string
  publicUrl?: string
  errorClass?: string
  errorMessage?: string
}

export interface PrismFacet {
  byteStart: number
  byteEnd: number
  kind: "link" | "mention"
  target: string
}

export interface PrismPostRecord {
  text: string
  facets: PrismFacet[]
  createdAt: string
  embed?: PrismImageEmbed
}

export interface PrismImageEmbed {
  images: Array<{
    blobRef: unknown
    altText: string
  }>
}

export interface PrismAdapterResult {
  atUri: string
  cid: string
  publicUrl: string
}

export type PrismApiErrorClass =
  | "auth_failed"
  | "rate_limited"
  | "invalid_request"
  | "server_error"
  | "network_error"
  | "unknown"

export class PrismApiError extends Error {
  constructor(
    public readonly errorClass: PrismApiErrorClass,
    message: string,
    public readonly retriable: boolean,
    public readonly httpStatus?: number,
  ) {
    super(message)
    this.name = "PrismApiError"
  }
}

// Thrown when a response cannot be classified as success or failure
// (e.g. network timeout after the request may have reached the server).
// Must resolve to execution_status "publication_uncertain", never a silent retry.
export class PrismUncertainResponseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PrismUncertainResponseError"
  }
}
