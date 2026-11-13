/**
 * Baby Chazz α — Day 0, isolated cognition contract.
 * No Registry, CanCom, storage, tool, network, or publication adapters are available.
 * An injected model is a language/reasoning function, NEVER an authority.
 */
const KINDS = new Set(['orientation', 'explanation', 'candidate', 'hold']);
const VALID_KEYS = new Set(['kind', 'text', 'candidate', 'evidence_refs']);
export class AdmissionHold extends Error {
  constructor(code) { super(code); this.name = 'AdmissionHold'; this.code = code; }
}
const required = (value, code) => { if (typeof value !== 'string' || !value.trim()) throw new AdmissionHold(code); return value.trim(); };
const isObj = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const deny = code => { throw new AdmissionHold(code); };

export function formOrientation(context, request) {
  if (!isObj(context) || !isObj(request)) deny('INVALID_INPUT');
  const environment = required(context.environment_key, 'ENVIRONMENT_REQUIRED');
  if (required(request.environment_key, 'REQUEST_ENVIRONMENT_REQUIRED') !== environment) deny('ENVIRONMENT_MISMATCH');
  const current = required(context.current_ref, 'CURRENT_REQUIRED');
  if (context.current_verified !== true) deny('CURRENT_UNVERIFIED');
  if (context.capability !== 'chazz_conversation' || context.capability_active !== true) deny('CAPABILITY_NOT_RESOLVED');
  const message = required(request.message, 'MESSAGE_REQUIRED');
  if (message.length > 12000) deny('MESSAGE_TOO_LARGE');
  if (!Array.isArray(context.facts)) deny('FACTS_REQUIRED');

  const facts = context.facts.map((fact, i) => {
    if (!isObj(fact) || fact.environment_key !== environment || fact.retrieval_authorized !== true) deny('FACT_OUTSIDE_AUTHORIZED_ENVIRONMENT');
    return Object.freeze({
      ref: required(fact.ref, `FACT_REF_${i}_REQUIRED`),
      text: required(fact.text, `FACT_TEXT_${i}_REQUIRED`),
    });
  });
  const envelope = Object.freeze({
    environment_key: environment,
    current_ref: current,
    request: message,
    facts: Object.freeze(facts),
    read_only: true,
    available_actions: Object.freeze([]),
    authority_effect: 'none',
    independent_cancom_send: false,
    independent_registry_write: false,
  });
  return envelope;
}

export function validateModelReply(reply, admittedEnvelope) {
  if (!isObj(reply)) deny('MODEL_REPLY_NOT_STRUCTURED');
  if (Object.keys(reply).some(k => !VALID_KEYS.has(k))) deny('MODEL_REPLY_UNSUPPORTED_FIELD');
  if (!KINDS.has(reply.kind)) deny('MODEL_REPLY_KIND_INVALID');
  const message = required(reply.text, 'MODEL_REPLY_TEXT_REQUIRED');
  if (!Array.isArray(reply.evidence_refs)) deny('EVIDENCE_REFS_REQUIRED');
  const allowedRefs = new Set(admittedEnvelope.facts.map(x => x.ref));
  if (!reply.evidence_refs.every(x => typeof x === 'string' && allowedRefs.has(x))) deny('EVIDENCE_OUTSIDE_ENVIRONMENT');
  if (reply.kind === 'candidate') {
    if (!isObj(reply.candidate) || typeof reply.candidate.summary !== 'string' || !reply.candidate.summary.trim() || Object.keys(reply.candidate).some(k => k !== 'summary')) deny('INVALID_CANDIDATE');
  } else if (reply.candidate !== undefined) deny('UNREQUESTED_CANDIDATE');

  return Object.freeze({
    standing: reply.kind === 'hold' ? 'HLD' : 'CANDIDATE_ONLY',
    interpretation: reply.kind,
    message,
    evidence_refs: Object.freeze([...reply.evidence_refs]),
    candidate: reply.kind === 'candidate' ? Object.freeze({summary: reply.candidate.summary.trim(), registration: 'not_requested'}) : null,
    environment_key: admittedEnvelope.environment_key,
    current_ref: admittedEnvelope.current_ref,
    authority_effect: 'none',
    registry_write: false,
    cancom_send: false,
    durable_memory_write: false,
  });
}

export async function nurseryTurn(context, request, driver) {
  const envelope = formOrientation(context, request);
  if (typeof driver !== 'function') deny('MODEL_DRIVER_REQUIRED');
  const reply = await driver(envelope);
  return validateModelReply(reply, envelope);
}
