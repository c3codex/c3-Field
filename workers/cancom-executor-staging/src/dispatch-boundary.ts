// Deliberately not imported by the deployed inert entrypoint. This typed boundary
// describes prerequisites for reuse of createDurableExecutor after separate
// activation authority, rather than making deployment an execution permission.
export interface NativeRunner { run(instance: string): Promise<unknown> }
export interface Qualification {
  standing: 'qualified' | 'HLD';
  instance: string;
  principalId: string;
  sessionId: string;
  expiresAt: number;
  custodyVerified: boolean;
  fencedSinkQualified: boolean;
  durableCheckpointQualified: boolean;
}
export async function dispatchBoundary(input: {
  instance: string;
  executionEnabled: boolean;
  qualify: () => Promise<Qualification>;
  runner: NativeRunner;
  now?: () => number;
}): Promise<unknown> {
  // This OAR has NO activation authority: even a true flag must HOLD.
  // No identity, gateway or runner calls occur in this inert source workset.
  void input;
  return {standing:'HLD',reason:'separate_activation_authority_required'};
}
