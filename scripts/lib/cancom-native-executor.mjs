import { createHash } from 'node:crypto';

// Source-only orchestration. No RPC, shell, scheduler, identity or storage is
// provisioned here. Production adapter/atomic durable journal remain unqualified.
export class ExecutorHold extends Error {}
const hold = reason => { throw new ExecutorHold(reason); };
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const text = x => typeof x === 'string' && x.trim().length > 0;
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export function createNativeExecutor({ adapter, journal, actions = {}, now = Date.now }) {
  async function qualified(instance, token) {
    const a = await adapter.authorize(instance, token);
    if (a?.standing !== 'qualified' || a.executor !== 'codex' ||
        !text(a.principalId) || !text(a.sessionId) ||
        !Number.isFinite(a.expiresAt) || a.expiresAt <= now()) hold('authority_unqualified');
    return a;
  }
  return {
    async run(instance) {
      if (!text(instance)) hold('instance_required');
      if (!adapter || !journal || !['authorize','resolve','readPayload','claim','returnOar1'].every(k => typeof adapter[k] === 'function') ||
          !['get','insert','replace'].every(k => typeof journal[k] === 'function')) hold('qualified_adapter_and_durable_journal_required');
      const auth = await qualified(instance);
      const p = await adapter.resolve(instance);
      if (p?.standing !== 'resolved_for_executor' || p.executor_ref !== 'codex' ||
          p.execution_instance !== instance || p.passage_key !== instance ||
          !text(p.oar_key) || !text(p.capability_ref) ||
          p.authority_scope_ref !== `capability:${p.capability_ref}` ||
          !text(p.wake_event_key) || !text(p.manifest_event_key) ||
          p.return_route !== `registry://cancom/oar1_return/${instance}` ||
          p.serialization_basis !== 'utf8_raw_bytes_sha256' ||
          !/^[0-9a-f]{64}$/.test(p.sha256) || !text(p.payload_custody_ref) ||
          !Number.isSafeInteger(p.payload_bytes) || p.payload_bytes <= 0) hold('pickup_binding');
      const bytes = await adapter.readPayload(p.payload_custody_ref);
      if (!(bytes instanceof Uint8Array) || bytes.length !== p.payload_bytes || hash(bytes) !== p.sha256) hold('payload_integrity');
      // Action selection is a qualified interpretation of THESE bytes, not a
      // command embedded in notification text. No eval/spawn or implicit action.
      const permit = await qualified(instance);
      if (permit.principalId !== auth.principalId || permit.sessionId !== auth.sessionId ||
          permit.oarKey !== p.oar_key || permit.sourceSha256 !== p.sha256 ||
          permit.returnRoute !== p.return_route || !text(permit.action) ||
          !Object.hasOwn(actions, permit.action)) hold('action_or_identity_unbound');
      let saved = await journal.get(instance);
      const binding = { oar: p.oar_key, sha: p.sha256, action: permit.action, route: p.return_route };
      if (saved && !equal(saved.binding, binding)) hold('journal_binding_conflict');
      if (saved?.phase === 'returned') hold('already_returned');
      if (saved?.phase === 'started') hold('execution_outcome_unknown_manual_reconciliation_required');
      if (!saved) {
        const lease = await adapter.claim(instance, permit);
        if (!text(lease?.token) || !Number.isFinite(lease.expiresAt) || lease.expiresAt <= now()) hold('lease_unavailable');
        const started = { binding, phase: 'started', token: lease.token, expiresAt: lease.expiresAt };
        if (!await journal.insert(instance, started)) hold('duplicate_work');
        const current = await qualified(instance, lease.token);
        if (!equal(current, permit) || lease.expiresAt <= now()) hold('authority_changed');
        // A thrown timeout/crash leaves started durable: NEVER auto-rerun.
        const result = await actions[permit.action]({ bytes, instance, sourceSha256: p.sha256 });
        if (!result || !text(result.oar1Text) || !['returned_for_registrar_review','held_for_registrar_review'].includes(result.standing)) hold('invalid_action_evidence');
        saved = { ...started, phase: 'ready', result };
        if (!await journal.replace(instance, 'started', saved)) hold('journal_conflict');
      }
      if (saved.phase !== 'ready') hold('journal_invalid');
      const current = await qualified(instance, saved.token);
      if (!equal(current, permit) || saved.expiresAt <= now()) hold('lease_or_authority_expired');
      // Adapter must map this exact envelope to register_cancom_oar_return_v1,
      // preserving all required native evidence fields and immutable text.
      const request = { instance, executor: 'codex', oar2Key: p.oar_key,
        returnRoute: p.return_route, sourceSha256: p.sha256,
        oar1Sha256: hash(Buffer.from(saved.result.oar1Text, 'utf8')),
        leaseToken: saved.token, result: saved.result };
      const receipt = await adapter.returnOar1(request);
      if (receipt?.standing !== saved.result.standing || receipt.execution_instance !== instance ||
          receipt.origin_oar2_key !== p.oar_key || receipt.return_route !== p.return_route ||
          !text(receipt.return_event_key)) hold('return_receipt_ambiguous');
      if (!await journal.replace(instance, 'ready', { ...saved, phase: 'returned', receipt })) hold('journal_conflict');
      return { standing: 'source_run_returned', receipt, operatorDisposition: 'RESERVED' };
    },
  };
}
