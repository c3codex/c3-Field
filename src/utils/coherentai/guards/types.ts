// src/systems/CoherentAI/guards/types.ts
export type InstallationRequest = {
  requestId: string;
  pillar: string;
  taskType: string;
  userRequest: string;
  objectRef?: string | null;
  requestedAction?: string | null;
  targetFiles?: string[];
  candidateLayers?: string[];
};

export type CoherenceContract = {
  status: "approved" | "blocked" | "redirected" | "needs_authority_resolution";
  layer: string | null;
  authority: {
    primaryTable?: string | null;
    resolvedView?: string | null;
    notes?: string | null;
  };
  forbiddenPaths: string[];
  executionContract: {
    resolverRequired: boolean;
    componentDirectResolutionForbidden: boolean;
    samePillarImportsRelative: boolean;
    allowedOutputs?: string[];
    forbiddenOutputs?: string[];
  };
  decisionRefs: string[];
  driftSignals: string[];
  reason: string;
};

export type DispatchEnvelope = {
  request: InstallationRequest;
  coherence: CoherenceContract;
};