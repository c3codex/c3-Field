// src/systems/CoherentAI/guards/enforceInstallationCoherence.ts
import { supabase } from "@/lib/supabaseClient";
import type { InstallationRequest, CoherenceContract } from "./types";

type DecisionRow = {
  decision_key: string;
  authority_table: string | null;
  authority_view: string | null;
  authority_notes: string | null;
  forbidden_paths: string[] | null;
  execution_contract: {
    resolver_required?: boolean;
    component_direct_resolution_forbidden?: boolean;
    same_pillar_imports_relative?: boolean;
    allowed_outputs?: string[];
    forbidden_outputs?: string[];
  } | null;
};

function detectDriftSignals(request: InstallationRequest): string[] {
  const haystack = [
    request.userRequest,
    request.requestedAction ?? "",
    ...(request.targetFiles ?? []),
    ...(request.candidateLayers ?? []),
  ]
    .join(" ")
    .toLowerCase();

  const signals: string[] = [];

  if (haystack.includes("canon_artifact")) signals.push("canon_candidate_detected");
  if (
    haystack.includes("hardcoded") ||
    haystack.includes("paste url") ||
    haystack.includes("public url")
  ) {
    signals.push("hardcoded_url_candidate");
  }
  if (haystack.includes("measuresassets") || haystack.includes("local registry")) {
    signals.push("deleted_registry_candidate");
  }
  if ((request.targetFiles ?? []).some((f) => f.includes("/components/"))) {
    signals.push("component_authority_leak_risk");
  }

  return signals;
}

function resolveLayer(request: InstallationRequest) {
  const text = [
    request.pillar,
    request.taskType,
    request.userRequest,
    request.objectRef ?? "",
    request.requestedAction ?? "",
    ...(request.candidateLayers ?? []),
  ]
    .join(" ")
    .toLowerCase();

  if (
    request.pillar === "measures" &&
    (
      text.includes("media") ||
      text.includes("asset") ||
      text.includes("glyph") ||
      text.includes("still") ||
      text.includes("animated") ||
      text.includes("storage")
    )
  ) {
    return {
      layer: "runtime_media",
      authorityTable: "measures_media",
      authorityView: "v_measures_media_resolved",
      notes: "Operational Measures assets resolve through categorized media and the resolved view.",
    };
  }

  if (text.includes("canon") || text.includes("sealed")) {
    return {
      layer: "sealed_canon",
      authorityTable: "canon_artifact",
      authorityView: null,
      notes: "Sealed records belong to canon_artifact.",
    };
  }

  return {
    layer: null,
    authorityTable: null,
    authorityView: null,
    notes: null,
  };
}

async function loadBindingDecisions(
  pillar: string,
  layer: string
): Promise<DecisionRow[]> {
  const { data, error } = await supabase
    .from("coherent_decision_ledger")
    .select(`
      decision_key,
      authority_table,
      authority_view,
      authority_notes,
      forbidden_paths,
      execution_contract
    `)
    .eq("pillar", pillar)
    .eq("layer", layer)
    .eq("status", "active")
    .eq("is_binding", true);

  if (error) {
    throw new Error(`Decision ledger lookup failed: ${error.message}`);
  }

  return (data ?? []) as DecisionRow[];
}

function mergeForbiddenPaths(rows: DecisionRow[]): string[] {
  return Array.from(
    new Set(
      rows.flatMap((row) =>
        Array.isArray(row.forbidden_paths) ? row.forbidden_paths : []
      )
    )
  );
}

function mergeExecutionContract(
  rows: DecisionRow[]
): CoherenceContract["executionContract"] {
  return rows.reduce<CoherenceContract["executionContract"]>(
    (acc, row) => {
      const c = row.execution_contract ?? {};

      acc.resolverRequired ||= Boolean(c.resolver_required);
      acc.componentDirectResolutionForbidden ||=
        Boolean(c.component_direct_resolution_forbidden);
      acc.samePillarImportsRelative ||= Boolean(c.same_pillar_imports_relative);

      acc.allowedOutputs = Array.from(
        new Set([...(acc.allowedOutputs ?? []), ...(c.allowed_outputs ?? [])])
      );
      acc.forbiddenOutputs = Array.from(
        new Set([...(acc.forbiddenOutputs ?? []), ...(c.forbidden_outputs ?? [])])
      );

      return acc;
    },
    {
      resolverRequired: false,
      componentDirectResolutionForbidden: false,
      samePillarImportsRelative: false,
      allowedOutputs: [],
      forbiddenOutputs: [],
    }
  );
}

async function logGuardEvent(
  request: InstallationRequest,
  contract: CoherenceContract,
  initialLayerGuess: string | null
) {
  const { error } = await supabase.from("coherent_guard_event").insert({
    request_id: request.requestId,
    pillar: request.pillar,
    task_type: request.taskType,
    object_ref: request.objectRef ?? null,
    requested_action: request.requestedAction ?? null,
    initial_layer_guess: initialLayerGuess,
    resolved_layer: contract.layer,
    status: contract.status,
    reason: contract.reason,
    authority_table: contract.authority.primaryTable ?? null,
    authority_view: contract.authority.resolvedView ?? null,
    blocked_paths: contract.forbiddenPaths,
    decision_keys: contract.decisionRefs,
    execution_contract: contract.executionContract,
    drift_signals: contract.driftSignals,
  });

  if (error) {
    console.error("coherent_guard_event insert failed:", error.message);
  }
}

export async function enforceInstallationCoherence(
  request: InstallationRequest
): Promise<CoherenceContract> {
  const resolved = resolveLayer(request);
  const driftSignals = detectDriftSignals(request);

  if (!resolved.layer) {
    const unresolved: CoherenceContract = {
      status: "needs_authority_resolution",
      layer: null,
      authority: {},
      forbiddenPaths: [],
      executionContract: {
        resolverRequired: true,
        componentDirectResolutionForbidden: true,
        samePillarImportsRelative: true,
        allowedOutputs: [],
        forbiddenOutputs: [],
      },
      decisionRefs: [],
      driftSignals,
      reason: "Unable to resolve authoritative layer before execution.",
    };

    await logGuardEvent(request, unresolved, null);
    return unresolved;
  }

  const decisions = await loadBindingDecisions(request.pillar, resolved.layer);
  const forbiddenPaths = mergeForbiddenPaths(decisions);
  const executionContract = mergeExecutionContract(decisions);
  const decisionRefs = decisions.map((d) => d.decision_key);

  const redirected =
    (forbiddenPaths.includes("canon_artifact") &&
      driftSignals.includes("canon_candidate_detected")) ||
    (forbiddenPaths.includes("hardcoded_url") &&
      driftSignals.includes("hardcoded_url_candidate")) ||
    (forbiddenPaths.includes("deleted_local_registry") &&
      driftSignals.includes("deleted_registry_candidate"));

  const contract: CoherenceContract = {
    status: redirected ? "redirected" : "approved",
    layer: resolved.layer,
    authority: {
      primaryTable: resolved.authorityTable,
      resolvedView: resolved.authorityView,
      notes: resolved.notes,
    },
    forbiddenPaths,
    executionContract,
    decisionRefs,
    driftSignals,
    reason: redirected
      ? "Request contained drift-prone candidates and was redirected to authoritative execution."
      : "Request passed anti-drift guard.",
  };

  await logGuardEvent(request, contract, resolved.layer);
  return contract;
}