---
title: CoherentAI LLM Execution Engine Specification
slug: coherentai-llm-execution-engine-spec
document_type: architecture
document_class: create
document_scope: kernel
document_status: draft
authority_level: structural
canonical: true
event_required: false
version: 0.1
last_reviewed: 2026-03-14
related_pillar: coherentai
related_system: coherentai
source_bucket: codex-vault
source_folder: system-kernel
depends_on:
  - coherentai-dispatcher-spec
  - role-contracts
  - coherentai-verification-rules
  - coherentai-oar-logging-spec
tags:
  - coherentai
  - kernel
  - llm
  - execution-engine
  - bounded-operator
  - prompt
  - verification
  - provenance
summary: |
  Defines the LLM Execution Engine — the component that performs bounded
  language-model execution inside the CoherentAI kernel. Takes a dispatch
  package, assembles authorized execution context, calls the configured model,
  and returns a structured result for verification. The LLM is a component
  used by the system, not the system itself.
---

# CoherentAI LLM Execution Engine Specification

**Document Type:** Kernel Specification  
**Component:** LLM Execution Engine  
**Status:** Draft v0.1  
**Scope:** CoherentAI Kernel  
**Depends On:** Dispatcher, role contracts, policy refs, stable views, verification layer, OAR logging spec

---

## 1. Purpose

The LLM Execution Engine is the component that performs bounded language-model execution inside the CoherentAI kernel.

Its job is to take a dispatch package, assemble the authorized execution context, call the configured model, and return a structured result for verification.

It does not create authority.  
It does not replace canon.  
It does not decide final truth.

It is a **bounded operator** acting inside the coherent field.

---

## 2. Design Role in the Kernel

**Request Interface → Dispatcher → Role Contract Loader → LLM Execution Engine → Verification → OAR Log → Result**

The Execution Engine begins only after:
- the request has been validated
- the role has been resolved
- the task has been proven in-scope
- dependency bindings have been attached

This ordering is non-negotiable. Direct model invocation outside this sequence is architectural drift.

---

## 3. Core Principle

The LLM is not the system.

The LLM is a component used by the system.

CoherentAI does not ask the model to invent structure. It asks the model to operate within already-defined structure:
- sealed canon
- typed concept linkage
- append-only OAR logic
- bounded roles
- measured verification

The field precedes the agent.

---

## 4. Responsibilities

The LLM Execution Engine performs six functions:

1. Receives a dispatch package.
2. Resolves the model profile and execution settings.
3. Builds the role-bounded prompt package.
4. Executes the model call.
5. Normalizes the response into a structured output envelope.
6. Passes the output forward for verification.

It must not:
- authorize its own scope
- bypass verification
- write directly to canon
- interpret missing contracts
- mutate role definitions
- return unchecked output as final truth when verification is required

---

## 5. Execution Result Shape

```json
{
  "run_id": "uuid",
  "dispatch_id": "uuid",
  "role_slug": "validator_chazz",
  "task": "scan_measures_structure",
  "status": "completed",
  "output_mode": "structured_json",
  "result": {
    "status": "warning",
    "issues": ["Gate 03 asset missing", "Epithet registry mismatch"]
  },
  "provenance": {
    "model_profile": "analysis_strict",
    "provider": "openai",
    "prompt_version": "validator_v1",
    "executed_at": "2026-03-08T16:10:00Z"
  }
}
```

---

## 6. Prompt Construction Model

Prompt construction follows a layered model:

| Layer | Purpose |
|---|---|
| System | Non-negotiable execution rules, role boundaries, output format |
| Role | What the role is for and what it may do |
| Task | The requested task and explicit target |
| Context | Scoped data from permitted views and policy refs |
| Output | Exact output schema expected by downstream verification |

```ts
const prompt = [
  buildSystemGuardrails(dispatchPackage),
  buildRoleInstructions(contract),
  buildTaskInstructions(dispatchPackage.task, dispatchPackage.context),
  buildScopedContext(allowedSources),
  buildOutputSchema(dispatchPackage.output_mode)
].join("\n\n");
```

---

## 7. Model Profiles

Named model profiles rather than raw per-request model settings:

- `analysis_strict`
- `proposal_guarded`
- `router_structured`
- `linker_schema_first`

A model profile defines: provider, model name, temperature, max tokens, retry policy, timeout, structured output mode, safety settings.

Callers must not choose model behavior directly unless a governing contract explicitly allows it.

---

## 8. Failure Modes

| Code | Condition | Response |
|---|---|---|
| Provider failure | Timeout or error | Return error envelope, stop before verification |
| `OUTPUT_PARSE_FAILED` | Malformed output | Mark and optionally retry |
| Scope leakage | Out-of-scope context in prompt | Fail closed, log operational error |
| Hallucinated authority | Model proposes out-of-scope actions | Preserve for diagnosis, verification rejects downstream effects |
| Missing policy ref | Required ref cannot be loaded | Abort with dependency error |

---

## 9. Type Sketch

```ts
export type ExecutionResult = {
  run_id: string;
  dispatch_id: string;
  role_slug: string;
  task: string;
  status: "completed" | "failed" | "needs_retry";
  output_mode: string;
  result?: Record<string, unknown>;
  error_code?: string;
  error_message?: string;
  provenance: {
    model_profile: string;
    provider?: string;
    model?: string;
    prompt_version?: string;
    executed_at: string;
  };
};
```

---

## 10. Key Separation Principles

**Engine vs Verification:**
- Engine parsing: "Did the model return valid structure?"
- Verification: "Does the proposed output maintain system integrity?"

**Engine vs OAR:**
- The engine emits operational execution logs.
- It does not author the final OAR trace merely by having run.
- OAR represents observed, aligned, and routed meaning after verification-relevant processing.

**Model trust posture:**
- Outputs are inspectable, not self-justifying.
- Outputs do not become canon by being eloquent.
- Outputs do not create authority by being confident.

---

## 11. Acceptance Criteria

- no model call occurs without a dispatch package
- prompts are assembled from approved bounded sources
- output is normalized into a stable shape
- provenance is attached to every run
- required verification cannot be bypassed
- the engine remains provider-pluggable without changing kernel law
