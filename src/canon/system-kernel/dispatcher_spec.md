---
title: CoherentAI Dispatcher Specification
slug: coherentai-dispatcher-spec
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
  - request-interface
  - role-contracts
  - policy-beacon
  - coherentai-verification-rules
tags:
  - coherentai
  - kernel
  - dispatcher
  - routing
  - role-contracts
  - authority
  - architecture
summary: |
  Defines the Dispatcher — the routing spine of the CoherentAI kernel.
  Turns claimed work into scoped execution by resolving role contracts,
  checking task scope, binding execution boundaries, and preventing
  authority drift. No kernel task reaches execution without passing through
  the Dispatcher.
---

# CoherentAI Dispatcher Specification

**Document Type:** Kernel Specification  
**Component:** Dispatcher  
**Status:** Draft v0.1  
**Scope:** CoherentAI Kernel  
**Depends On:** Request Interface, role contracts, policy beacon, stable views, verification layer

---

## 1. Purpose

The Dispatcher is the routing spine of the CoherentAI kernel.

Its job is to take a validated request, determine the correct execution path, load the applicable role contract, and hand the task to the LLM Execution Engine in a bounded form.

It is the component that turns **claimed work** into **scoped execution**.

Without a dispatcher, the system either collapses into direct prompt execution or grows hidden routing behavior in too many places. Both create drift.

---

## 2. Design Role in the Kernel

Within the kernel path:

**Request Interface → Dispatcher → Role Contract Loader → LLM Execution Engine → Verification → OAR Log → Result**

The Dispatcher performs the following kernel functions:

1. Receives a normalized request from the Request Interface.
2. Resolves the requested role.
3. Loads the role contract and relevant policy metadata.
4. Checks that the requested task is in scope for that role.
5. Builds an execution package for the LLM Execution Engine.
6. Declines requests that exceed role authority or violate dispatch rules.

It is the **traffic controller**, but with contracts instead of hand signals.

---

## 3. Core Principle

The Dispatcher does not decide what is true.

The Dispatcher decides **which bounded operator may act on which task under which contract**.

That distinction matters. The Dispatcher is about authority routing, not epistemic judgment.

---

## 4. Inputs and Outputs

### 4.1 Input
A normalized `KernelRequest`.

### 4.2 Output on success
A dispatch package containing:
- request metadata
- loaded contract
- allowed scopes
- execution target
- verification requirement
- policy references

### 4.3 Output on failure
A structured rejection indicating why dispatch was denied.

---

## 5. Dispatcher Responsibilities

### 5.1 Resolve role
The dispatcher must identify which role contract applies.

### 5.2 Load contract
Contracts are loaded from a stable source such as `coherentai_roles` or a versioned contract beacon.

### 5.3 Check task scope
The dispatcher must verify that the requested task is permitted by the role contract.

### 5.4 Bind execution boundaries
The dispatcher turns abstract permissions into a concrete execution package:
- what sources may be read
- what writes, if any, are permitted
- whether verification is mandatory
- which view versions must be used
- whether the request is read-only

### 5.5 Prevent authority drift
The dispatcher must reject execution if the request attempts to exceed contract scope.

---

## 6. Contract-Aware Routing Model

The Dispatcher never routes directly from request to LLM on role name alone.

Routing requires contract resolution.

Minimum contract elements should include:

- `role_slug`
- `status`
- `description`
- `allowed_tasks`
- `read_scope`
- `write_scope`
- `verification_required`
- `model_profile`
- `output_mode`
- `policy_refs`

Example conceptual shape:

```json
{
  "role_slug": "validator_chazz",
  "status": "active",
  "allowed_tasks": [
    "scan_measures_structure",
    "validate_release_dependencies",
    "monitor_drift_pattern"
  ],
  "read_scope": [
    "v_measures_state_v1",
    "v_measures_encounter_v1",
    "canon_public_v1"
  ],
  "write_scope": [
    "coherentai_validation_runs",
    "coherentai_validation_issues",
    "oar_log"
  ],
  "verification_required": true,
  "model_profile": "analysis_strict",
  "output_mode": "structured_json",
  "policy_refs": [
    "oarlogic_canon",
    "codexstone_geometric_logic"
  ]
}
```

---

## 7. Dispatch Decision Logic

A dispatch succeeds only when all of the following are true:

1. The request arrived from the Request Interface in valid form.
2. The requested role contract exists.
3. The role contract is active.
4. The requested task is allowed by the contract.
5. The request does not seek prohibited data or mutation scope.
6. The execution mode is compatible with policy and system state.
7. Required dependency views or policy refs are available.

If any of these fail, dispatch stops.

---

## 8. Dispatch Package

```json
{
  "dispatch_id": "uuid",
  "request_id": "uuid",
  "role_slug": "validator_chazz",
  "task": "scan_measures_structure",
  "contract_version": "2026-03-08",
  "policy_refs": ["oarlogic_canon", "codexstone_geometric_logic"],
  "read_scope": ["v_measures_state_v1"],
  "write_scope": ["coherentai_validation_runs", "coherentai_validation_issues", "oar_log"],
  "verification_required": true,
  "model_profile": "analysis_strict",
  "output_mode": "structured_json",
  "context": {
    "phase": "gate_validation",
    "target": "measures"
  }
}
```

---

## 9. Role Resolution Rules

### 9.1 No fallback to nearest role
If `validator_chazz` is requested and absent, the system must not silently substitute `architect_chazz`.

### 9.2 No direct task dispatch without role
A task alone is insufficient. The execution path must remain role-bound.

### 9.3 No implicit write authority
Write scope must be explicitly present in the contract.

### 9.4 No role alias drift
Any aliases must be canonicalized before dispatch and preserved in logs.

---

## 10. Failure Cases

| Code | Condition |
|---|---|
| `UNKNOWN_ROLE` | Role not found |
| `ROLE_INACTIVE` | Contract inactive |
| `TASK_NOT_ALLOWED_FOR_ROLE` | Task outside scope |
| `MISSING_DISPATCH_DEPENDENCY` | Required view unavailable |
| `WRITE_SCOPE_VIOLATION` | Write attempt outside scope |
| `POLICY_BINDING_ERROR` | Policy mismatch |

---

## 11. Pseudocode

```ts
export async function dispatchTask(request: KernelRequest) {
  const contract = await loadRoleContract(request.role);
  if (!contract) throw new Error("UNKNOWN_ROLE");
  if (contract.status !== "active") throw new Error("ROLE_INACTIVE");
  if (!contract.allowed_tasks.includes(request.task)) throw new Error("TASK_NOT_ALLOWED_FOR_ROLE");
  const pkg = buildDispatchPackage(request, contract);
  enforceScopeRules(pkg);
  enforceDependencyBindings(pkg);
  return pkg;
}
```

---

## 12. Type Sketch

```ts
export type RoleContract = {
  role_slug: string;
  status: "active" | "disabled" | "draft";
  description: string;
  allowed_tasks: string[];
  read_scope: string[];
  write_scope: string[];
  verification_required: boolean;
  model_profile: string;
  output_mode: "structured_json" | "text" | "proposal";
  policy_refs: string[];
};

export type DispatchPackage = {
  dispatch_id: string;
  request_id: string;
  role_slug: string;
  task: string;
  contract_version?: string;
  policy_refs: string[];
  read_scope: string[];
  write_scope: string[];
  verification_required: boolean;
  model_profile: string;
  output_mode: string;
  context: Record<string, unknown>;
};
```

---

## 13. Security Notes

- contract lookup from approved source only
- no unsigned contract overrides
- no caller-provided write scope
- no runtime role mutation from request payload
- no direct model profile injection from caller

Callers may request work. They may not define the law of the route.

---

## 14. Acceptance Criteria

- no kernel task reaches execution without contract resolution
- role authority is checked before execution
- read/write scope is explicit in the dispatch package
- verification requirement is preserved
- out-of-scope tasks are rejected deterministically
- policy and view references are bound at dispatch time
