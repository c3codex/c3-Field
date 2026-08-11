export type RegisteredProcessKey =
  | "oar_lifecycle_resolution_v1"
  | "oar_custody_resolution_v1"
  | "oar_evidence_asset_custody_resolution_v1";

export type CustodyObjectType = "oar1" | "oar2" | "evidence" | "asset" | "protected_source";

export type CustodyStanding =
  | "returned_for_review"
  | "completed"
  | "reviewed"
  | "operator_disposed"
  | "registered"
  | "held"
  | "protected";

export type IntendedFunction =
  | "oar_review_return"
  | "completed_oar2_custody"
  | "disposed_oar1_custody"
  | "execution_evidence"
  | "chambered_free_call"
  | "registered_system_document"
  | "protected_source";

export type CustodyType =
  | "cancom_review"
  | "optics_oar_custody"
  | "evidence_document_custody"
  | "governed_free_call_bucket"
  | "registered_system_document_storage"
  | "protected_source_custody";

export type CustodyResolutionStatus = "resolved" | "held";

export type CustodyRegistry = {
  registrarRoleKey: string;
  opticsOarCustodyRef: string;
  cancomReviewRef: string;
  evidenceDocumentCustodyBySystem: Record<string, string>;
  systemDocumentStorageBySystem: Record<string, string>;
  freeCallBucketByChamber: Record<string, string>;
  protectedSourceCustodyRef: string;
};

export type CustodyObjectReference = {
  objectIdentifier: string;
  objectType: CustodyObjectType;
  relatedSystem: string;
  intendedFunction: IntendedFunction;
  standing: CustodyStanding;
  integrityHash?: string | null;
  retrievalAccessRule?: string | null;
  relatedExecutionInstance: string;
  relatedOar1?: string | null;
  relatedOar2?: string | null;
  applicableProcessKey: RegisteredProcessKey;
  chamberKey?: string | null;
  encounterKey?: string | null;
  assetRegisteredForFreeCall?: boolean;
};

export type CustodyResolutionRequest = {
  callerRoleKey: string;
  registry: CustodyRegistry;
  object: CustodyObjectReference;
};

export type CustodyResolution = {
  status: CustodyResolutionStatus;
  objectIdentifier: string;
  objectType: CustodyObjectType;
  relatedSystem: string;
  intendedFunction: IntendedFunction;
  standing: CustodyStanding;
  custodyType: CustodyType | null;
  custodyReference: string | null;
  retrievalAccessRule: string | null;
  integrityHash: string | null;
  relatedExecutionInstance: string;
  relatedOar1: string | null;
  relatedOar2: string | null;
  applicableProcessKey: RegisteredProcessKey;
  holdReason: string | null;
};

export type PostDispositionRequest = {
  callerRoleKey: string;
  registry: CustodyRegistry;
  object: CustodyObjectReference;
  chazzReviewStanding?: "reviewed" | "missing" | "held";
  operatorDisposition?: "confirmed" | "disputed" | "held" | "rerouted" | null;
};

export type RecoverabilityEventDraft = {
  resolutionEventKey: string;
  processKey: RegisteredProcessKey;
  objectIdentifier: string;
  objectType: CustodyObjectType;
  relatedSystem: string;
  intendedFunction: IntendedFunction;
  standing: CustodyStanding;
  integrityHash: string | null;
  custodyType: CustodyType | null;
  custodyReference: string | null;
  retrievalAccessRule: string | null;
  relatedExecutionInstance: string;
  relatedOar1: string | null;
  relatedOar2: string | null;
  resolutionStatus: CustodyResolutionStatus;
  holdReason: string | null;
};

const registeredProcessKeys = new Set<RegisteredProcessKey>([
  "oar_lifecycle_resolution_v1",
  "oar_custody_resolution_v1",
  "oar_evidence_asset_custody_resolution_v1",
]);

export function resolveRegistrarCustody(request: CustodyResolutionRequest): CustodyResolution {
  const authHold = validateBaseRequest(request);
  if (authHold) return heldResolution(request.object, authHold);

  const object = request.object;
  const registry = request.registry;

  if (object.objectType === "oar1" && object.intendedFunction === "oar_review_return") {
    if (!object.relatedOar2) return heldResolution(object, "missing_originating_oar2_relation");
    return resolvedResolution(request, "cancom_review", registry.cancomReviewRef);
  }

  if (object.objectType === "oar2" && object.intendedFunction === "completed_oar2_custody") {
    if (object.standing !== "completed") return heldResolution(object, "oar2_not_completed");
    return resolvedResolution(request, "optics_oar_custody", registry.opticsOarCustodyRef);
  }

  if (object.objectType === "evidence" && object.intendedFunction === "execution_evidence") {
    const destination = registry.evidenceDocumentCustodyBySystem[object.relatedSystem];
    if (!destination) return heldResolution(object, "missing_registered_evidence_document_custody");
    if (!object.integrityHash) return heldResolution(object, "missing_integrity_hash");
    return resolvedResolution(request, "evidence_document_custody", destination);
  }

  if (object.objectType === "asset" && object.intendedFunction === "chambered_free_call") {
    if (!object.assetRegisteredForFreeCall) return heldResolution(object, "asset_not_registered_for_chambered_free_call");
    if (!object.chamberKey) return heldResolution(object, "missing_chamber_key");
    const destination = registry.freeCallBucketByChamber[object.chamberKey];
    if (!destination) return heldResolution(object, "missing_governed_free_call_bucket");
    if (!object.integrityHash) return heldResolution(object, "missing_integrity_hash");
    return resolvedResolution(request, "governed_free_call_bucket", destination);
  }

  if (object.objectType === "asset" && object.intendedFunction === "registered_system_document") {
    const destination = registry.systemDocumentStorageBySystem[object.relatedSystem];
    if (!destination) return heldResolution(object, "missing_registered_system_document_storage");
    if (!object.integrityHash) return heldResolution(object, "missing_integrity_hash");
    return resolvedResolution(request, "registered_system_document_storage", destination);
  }

  if (object.objectType === "protected_source" && object.intendedFunction === "protected_source") {
    return resolvedResolution(request, "protected_source_custody", registry.protectedSourceCustodyRef);
  }

  return heldResolution(object, "unsupported_object_function_pair");
}

export function executePostDispositionTransition(request: PostDispositionRequest): CustodyResolution {
  const authHold = validateBaseRequest(request);
  if (authHold) return heldResolution(request.object, authHold);

  const object = request.object;
  if (object.objectType !== "oar1" || object.intendedFunction !== "disposed_oar1_custody") {
    return heldResolution(object, "post_disposition_requires_disposed_oar1");
  }

  if (request.chazzReviewStanding !== "reviewed") {
    return heldResolution(object, "missing_chazz_review");
  }

  if (!request.operatorDisposition) {
    return heldResolution(object, "missing_operator_disposition");
  }

  if (!object.relatedOar2) {
    return heldResolution(object, "missing_originating_oar2_relation");
  }

  return resolvedResolution(request, "optics_oar_custody", request.registry.opticsOarCustodyRef);
}

export function buildRecoverabilityEventDraft(
  resolutionEventKey: string,
  resolution: CustodyResolution,
): RecoverabilityEventDraft {
  assertNonEmpty("resolutionEventKey", resolutionEventKey);

  return {
    resolutionEventKey,
    processKey: resolution.applicableProcessKey,
    objectIdentifier: resolution.objectIdentifier,
    objectType: resolution.objectType,
    relatedSystem: resolution.relatedSystem,
    intendedFunction: resolution.intendedFunction,
    standing: resolution.standing,
    integrityHash: resolution.integrityHash,
    custodyType: resolution.custodyType,
    custodyReference: resolution.custodyReference,
    retrievalAccessRule: resolution.retrievalAccessRule,
    relatedExecutionInstance: resolution.relatedExecutionInstance,
    relatedOar1: resolution.relatedOar1,
    relatedOar2: resolution.relatedOar2,
    resolutionStatus: resolution.status,
    holdReason: resolution.holdReason,
  };
}

function validateBaseRequest(request: CustodyResolutionRequest): string | null {
  if (request.callerRoleKey !== request.registry.registrarRoleKey) return "caller_not_registered_registrar";
  if (!registeredProcessKeys.has(request.object.applicableProcessKey)) return "unregistered_process_key";
  if (!request.object.objectIdentifier.trim()) return "missing_object_identifier";
  if (!request.object.relatedSystem.trim()) return "missing_related_system";
  if (!request.object.relatedExecutionInstance.trim()) return "missing_execution_instance";
  return null;
}

function resolvedResolution(
  request: CustodyResolutionRequest,
  custodyType: CustodyType,
  custodyReference: string,
): CustodyResolution {
  if (!custodyReference.trim()) return heldResolution(request.object, `missing_${custodyType}_reference`);

  return {
    ...baseResolution(request.object),
    status: "resolved",
    custodyType,
    custodyReference,
    holdReason: null,
  };
}

function heldResolution(object: CustodyObjectReference, holdReason: string): CustodyResolution {
  return {
    ...baseResolution(object),
    status: "held",
    custodyType: null,
    custodyReference: null,
    holdReason,
  };
}

function baseResolution(object: CustodyObjectReference): Omit<CustodyResolution, "status" | "custodyType" | "custodyReference" | "holdReason"> {
  return {
    objectIdentifier: object.objectIdentifier,
    objectType: object.objectType,
    relatedSystem: object.relatedSystem,
    intendedFunction: object.intendedFunction,
    standing: object.standing,
    integrityHash: object.integrityHash ?? null,
    retrievalAccessRule: object.retrievalAccessRule ?? null,
    relatedExecutionInstance: object.relatedExecutionInstance,
    relatedOar1: object.relatedOar1 ?? null,
    relatedOar2: object.relatedOar2 ?? null,
    applicableProcessKey: object.applicableProcessKey,
  };
}

function assertNonEmpty(field: string, value: string): void {
  if (!value.trim()) throw new Error(`${field} is required.`);
}
