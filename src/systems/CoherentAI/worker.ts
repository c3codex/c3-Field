// src/systems/CoherentAI/worker.ts
import { supabase } from "@/lib/supabaseClient";
import { dispatchInstallationRequest } from "./dispatcher";

type QueueRow = {
  id: string;
  pillar: string;
  task_type: string;
  user_request: string;
  object_ref: string | null;
  requested_action: string | null;
  target_files: string[] | null;
  candidate_layers: string[] | null;
  status: string;
};

async function claimNextRequest(): Promise<QueueRow | null> {
  const { data, error } = await supabase
    .from("coherent_request_queue")
    .select("*")
    .eq("status", "pending")
    .order("priority", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(1);

  if (error) throw new Error(`Queue read failed: ${error.message}`);
  if (!data || data.length === 0) return null;

  const row = data[0] as QueueRow;

  const { error: claimError } = await supabase
    .from("coherent_request_queue")
    .update({
      status: "processing",
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", row.id)
    .eq("status", "pending");

  if (claimError) throw new Error(`Queue claim failed: ${claimError.message}`);

  return row;
}

export async function runCoherentWorkerOnce() {
  const row = await claimNextRequest();
  if (!row) return { ok: true, message: "No pending requests." };

  try {
    const result = await dispatchInstallationRequest({
      requestId: row.id,
      pillar: row.pillar,
      taskType: row.task_type,
      userRequest: row.user_request,
      objectRef: row.object_ref,
      requestedAction: row.requested_action,
      targetFiles: row.target_files ?? [],
      candidateLayers: row.candidate_layers ?? [],
    });

    const nextStatus =
      result?.coherence?.status === "blocked"
        ? "blocked"
        : result?.coherence?.status === "redirected"
        ? "redirected"
        : "completed";

    const { error } = await supabase
      .from("coherent_request_queue")
      .update({
        status: nextStatus,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);

    if (error) throw new Error(`Queue completion update failed: ${error.message}`);

    return { ok: true, requestId: row.id, result };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown worker failure";

    await supabase
      .from("coherent_request_queue")
      .update({
        status: "failed",
        failed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        error_message: message,
      })
      .eq("id", row.id);

    throw err;
  }
}