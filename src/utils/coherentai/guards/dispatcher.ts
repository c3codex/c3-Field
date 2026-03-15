// src/systems/CoherentAI/dispatcher.ts
import type { InstallationRequest, DispatchEnvelope } from "./guards/types";
import { enforceInstallationCoherence } from "./guards/enforceInstallationCoherence";
import { runExecutionEngine } from "./engine";

export async function dispatchInstallationRequest(
  request: InstallationRequest
) {
  const coherence = await enforceInstallationCoherence(request);

  if (coherence.status === "needs_authority_resolution") {
    return {
      ok: false,
      coherence,
      reason: coherence.reason,
    };
  }

  const envelope: DispatchEnvelope = {
    request,
    coherence,
  };

  const execution = await runExecutionEngine(envelope);

  return {
    ok: true,
    coherence,
    execution,
  };
}