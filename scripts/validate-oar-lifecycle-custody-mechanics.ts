#!/usr/bin/env tsx

import {
  buildRecoverabilityEventDraft,
  executePostDispositionTransition,
  resolveRegistrarCustody,
  type CustodyObjectReference,
  type CustodyRegistry,
} from "./lib/oar-lifecycle-custody-mechanics";

function assert(condition: unknown, message: string): void {
  if (!condition) throw new Error(message);
}

const registry: CustodyRegistry = {
  registrarRoleKey: "c3ops_registrar",
  opticsOarCustodyRef: "optics:oar-custody",
  cancomReviewRef: "G:\\My Drive\\CanCom\\review",
  evidenceDocumentCustodyBySystem: {
    c3ops: "docs/evidence/c3ops",
  },
  systemDocumentStorageBySystem: {
    c3ops: "docs/operations/c3ops/documents",
  },
  freeCallBucketByChamber: {
    crystal: "bucket:measures-registry/chambered-free-call/crystal",
  },
  protectedSourceCustodyRef: "docs/_source/process",
};

const base: Omit<CustodyObjectReference, "objectIdentifier" | "objectType" | "intendedFunction" | "standing" | "applicableProcessKey"> = {
  relatedSystem: "c3ops",
  integrityHash: "A".repeat(64),
  retrievalAccessRule: "service_role_or_governed_review",
  relatedExecutionInstance: "implement_oar_lifecycle_custody_mechanics_codex_001",
  relatedOar1: "oar1_example.meta.md",
  relatedOar2: "oar2_example.meta.md",
};

function object(overrides: Partial<CustodyObjectReference> & Pick<CustodyObjectReference, "objectIdentifier" | "objectType" | "intendedFunction" | "standing" | "applicableProcessKey">): CustodyObjectReference {
  return { ...base, ...overrides };
}

const validOar1Return = resolveRegistrarCustody({
  callerRoleKey: "c3ops_registrar",
  registry,
  object: object({
    objectIdentifier: "oar1_valid_return",
    objectType: "oar1",
    intendedFunction: "oar_review_return",
    standing: "returned_for_review",
    applicableProcessKey: "oar_lifecycle_resolution_v1",
  }),
});
assert(validOar1Return.status === "resolved" && validOar1Return.custodyType === "cancom_review", "valid OAR1 return should resolve to CanCom review");

const missingOar2 = resolveRegistrarCustody({
  callerRoleKey: "c3ops_registrar",
  registry,
  object: object({
    objectIdentifier: "oar1_missing_oar2",
    objectType: "oar1",
    intendedFunction: "oar_review_return",
    standing: "returned_for_review",
    relatedOar2: null,
    applicableProcessKey: "oar_lifecycle_resolution_v1",
  }),
});
assert(missingOar2.status === "held" && missingOar2.holdReason === "missing_originating_oar2_relation", "missing OAR2 relation should hold");

const completedOar2 = resolveRegistrarCustody({
  callerRoleKey: "c3ops_registrar",
  registry,
  object: object({
    objectIdentifier: "oar2_completed",
    objectType: "oar2",
    intendedFunction: "completed_oar2_custody",
    standing: "completed",
    applicableProcessKey: "oar_custody_resolution_v1",
  }),
});
assert(completedOar2.status === "resolved" && completedOar2.custodyType === "optics_oar_custody", "completed OAR2 should resolve to Optics");

assert(validOar1Return.custodyType === "cancom_review", "OAR1 must remain in Review before Operator disposition");

const disposedOar1 = executePostDispositionTransition({
  callerRoleKey: "c3ops_registrar",
  registry,
  chazzReviewStanding: "reviewed",
  operatorDisposition: "confirmed",
  object: object({
    objectIdentifier: "oar1_disposed",
    objectType: "oar1",
    intendedFunction: "disposed_oar1_custody",
    standing: "operator_disposed",
    applicableProcessKey: "oar_custody_resolution_v1",
  }),
});
assert(disposedOar1.status === "resolved" && disposedOar1.custodyType === "optics_oar_custody", "disposed OAR1 should transition to Optics");

const evidence = resolveRegistrarCustody({
  callerRoleKey: "c3ops_registrar",
  registry,
  object: object({
    objectIdentifier: "execution_evidence",
    objectType: "evidence",
    intendedFunction: "execution_evidence",
    standing: "registered",
    applicableProcessKey: "oar_evidence_asset_custody_resolution_v1",
  }),
});
assert(evidence.status === "resolved" && evidence.custodyType === "evidence_document_custody", "evidence should resolve to evidence/document custody");

const freeAsset = resolveRegistrarCustody({
  callerRoleKey: "c3ops_registrar",
  registry,
  object: object({
    objectIdentifier: "free_call_asset",
    objectType: "asset",
    intendedFunction: "chambered_free_call",
    standing: "registered",
    applicableProcessKey: "oar_evidence_asset_custody_resolution_v1",
    assetRegisteredForFreeCall: true,
    chamberKey: "crystal",
    encounterKey: "crystal_intro",
  }),
});
assert(freeAsset.status === "resolved" && freeAsset.custodyType === "governed_free_call_bucket", "FREE-call asset should resolve to governed bucket");

const nonFreeAsset = resolveRegistrarCustody({
  callerRoleKey: "c3ops_registrar",
  registry,
  object: object({
    objectIdentifier: "non_free_asset",
    objectType: "asset",
    intendedFunction: "registered_system_document",
    standing: "registered",
    applicableProcessKey: "oar_evidence_asset_custody_resolution_v1",
    assetRegisteredForFreeCall: false,
  }),
});
assert(nonFreeAsset.status === "resolved" && nonFreeAsset.custodyType === "registered_system_document_storage", "non-FREE asset should resolve to System document storage");

const protectedSource = resolveRegistrarCustody({
  callerRoleKey: "c3ops_registrar",
  registry,
  object: object({
    objectIdentifier: "protected_source_process",
    objectType: "protected_source",
    intendedFunction: "protected_source",
    standing: "protected",
    applicableProcessKey: "oar_evidence_asset_custody_resolution_v1",
  }),
});
assert(protectedSource.status === "resolved" && protectedSource.custodyType === "protected_source_custody", "protected Source should remain protected");

const missingCustody = resolveRegistrarCustody({
  callerRoleKey: "c3ops_registrar",
  registry: { ...registry, evidenceDocumentCustodyBySystem: {} },
  object: object({
    objectIdentifier: "evidence_missing_custody",
    objectType: "evidence",
    intendedFunction: "execution_evidence",
    standing: "registered",
    applicableProcessKey: "oar_evidence_asset_custody_resolution_v1",
  }),
});
assert(missingCustody.status === "held" && missingCustody.holdReason === "missing_registered_evidence_document_custody", "missing custody registration should hold");

const conflictingCustody = resolveRegistrarCustody({
  callerRoleKey: "c3ops_registrar",
  registry,
  object: object({
    objectIdentifier: "conflicting_free_asset",
    objectType: "asset",
    intendedFunction: "chambered_free_call",
    standing: "registered",
    applicableProcessKey: "oar_evidence_asset_custody_resolution_v1",
    assetRegisteredForFreeCall: false,
    chamberKey: "crystal",
  }),
});
assert(conflictingCustody.status === "held" && conflictingCustody.holdReason === "asset_not_registered_for_chambered_free_call", "conflicting FREE-call registration should hold");

const missingReview = executePostDispositionTransition({
  callerRoleKey: "c3ops_registrar",
  registry,
  chazzReviewStanding: "missing",
  operatorDisposition: "confirmed",
  object: object({
    objectIdentifier: "missing_review_oar1",
    objectType: "oar1",
    intendedFunction: "disposed_oar1_custody",
    standing: "operator_disposed",
    applicableProcessKey: "oar_custody_resolution_v1",
  }),
});
assert(missingReview.status === "held" && missingReview.holdReason === "missing_chazz_review", "missing Chazz review should block transition");

const missingDisposition = executePostDispositionTransition({
  callerRoleKey: "c3ops_registrar",
  registry,
  chazzReviewStanding: "reviewed",
  operatorDisposition: null,
  object: object({
    objectIdentifier: "missing_disposition_oar1",
    objectType: "oar1",
    intendedFunction: "disposed_oar1_custody",
    standing: "operator_disposed",
    applicableProcessKey: "oar_custody_resolution_v1",
  }),
});
assert(missingDisposition.status === "held" && missingDisposition.holdReason === "missing_operator_disposition", "missing Operator disposition should block transition");

const publicBypass = resolveRegistrarCustody({
  callerRoleKey: "public_client",
  registry,
  object: object({
    objectIdentifier: "public_bypass_attempt",
    objectType: "evidence",
    intendedFunction: "execution_evidence",
    standing: "registered",
    applicableProcessKey: "oar_evidence_asset_custody_resolution_v1",
  }),
});
assert(publicBypass.status === "held" && publicBypass.holdReason === "caller_not_registered_registrar", "public caller must not bypass Registrar");

const recoverability = buildRecoverabilityEventDraft("resolution_event_validation_001", evidence);
assert(recoverability.relatedExecutionInstance === evidence.relatedExecutionInstance, "recoverability keeps execution identity");
assert(recoverability.relatedOar1 === evidence.relatedOar1, "recoverability keeps OAR1 identity");
assert(recoverability.relatedOar2 === evidence.relatedOar2, "recoverability keeps OAR2 identity");
assert(recoverability.custodyReference === evidence.custodyReference, "recoverability keeps custody reference");

const requiredMechanicsValidated = [
  validOar1Return,
  missingOar2,
  completedOar2,
  disposedOar1,
  evidence,
  freeAsset,
  nonFreeAsset,
  protectedSource,
  missingCustody,
  conflictingCustody,
  missingReview,
  missingDisposition,
  publicBypass,
].every((result) => result.status === "resolved" || result.status === "held");

console.log(
  JSON.stringify(
    {
      validation_count: 16,
      required_mechanics_validated: requiredMechanicsValidated,
      oar1_return_valid_originating_oar2: validOar1Return,
      oar1_return_missing_oar2_hold: missingOar2,
      completed_oar2_to_optics: completedOar2,
      oar1_review_before_disposition: validOar1Return.custodyType,
      oar1_post_disposition_to_optics: disposedOar1,
      evidence_to_document_custody: evidence,
      free_call_asset_to_bucket: freeAsset,
      non_free_asset_to_system_document_storage: nonFreeAsset,
      protected_source_custody: protectedSource,
      missing_custody_registration_hold: missingCustody,
      conflicting_custody_registration_hold: conflictingCustody,
      missing_chazz_review_hold: missingReview,
      missing_operator_disposition_hold: missingDisposition,
      public_caller_bypass_rejected: publicBypass,
      recoverability_event: recoverability,
      process_rows_may_promote_to_operationally_available: true,
    },
    null,
    2,
  ),
);
