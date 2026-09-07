---
document_type: system_boundary_rule
title: System Surface and Custody Boundary
status: proposed_pending_operator_validation
version: v2
timestamp: 2026-08-18
operator: op044
author: chazz
system: c3_field
scope: instruction_registration_runtime_custody
---

# System Surface and Custody Boundary — v2

## Purpose

Prevent instruction, registration, custody, runtime use, evidence, and publication from collapsing into one implied standing.

## Surface Map

### ChatGPT Project Settings

Hold concise continuous behavior for Chazz within this Project. Settings are active in Project conversations but do not automatically govern external repositories or executors.

### ChatGPT Project Sources

Hold reusable contextual references. Only sources marked operative by the Project Source Authority Index may continuously guide behavior. Presence alone is not authority.

### Git Repository

Holds versioned code, repository documents, and durable history. `AGENTS.md` governs agent work within its filesystem scope. A local commit provides local Git custody; other clones do not receive it until distribution or push occurs.

### Google Drive

Holds governed documents, CanCom transfers, and returned evidence when assigned. Drive custody does not imply execution, acceptance, Project-source activation, or registry standing.

### CanCom

Records governed transfer between named identities and destinations. CanCom custody proves routing and integrity, not originating authority or final acceptance.

### Supabase and Measures Registry

Hold registered identities, relationships, states, and runtime-readable authority data. Registration may store a document identifier, version, hash, standing, and authoritative location without storing the full document.

Supabase needs the full document only when an authorized runtime is designed to retrieve and apply that document from Supabase.

### Runtime

Uses only instructions and records deliberately loaded or fetched through its activation design. Registered-but-never-fetched documents do not need to occupy runtime context.

### OAR2

Carries bounded execution authority for one execution event. File existence and delivery do not independently activate it.

### OAR1 and Evidence

Record objective execution result. Evidence supports review but does not accept, close, or authorize the next action.

### Artifact-Bound OAR1

Holds append-only AI execution provenance adjacent to a governed repository artifact. Artifact custody and OAR1 lineage custody travel together in Git, but the lineage does not itself grant authority, standing, deployment, or publication.

### AI Execution Capability Profile

Records demonstrated technical operations available to a named AI execution relation in a defined environment. Capability is not authority, permission, or standing and may not be inferred from model identity.

### Public Surface

Expresses approved public state. Internal registration, technical availability, or completed implementation does not independently authorize publication.

## Custody Types

- **Project custody** — available as Project settings or sources.
- **Git custody** — versioned in a repository.
- **Drive custody** — preserved in an assigned Drive location.
- **Registry custody** — identity and standing recorded in a registry.
- **Runtime availability** — retrievable by the runtime.
- **CanCom custody** — transferred with routing and integrity evidence.
- **Historical custody** — preserved without current operative authority.
- **Artifact provenance custody** — append-only OAR1 lineage bound to a governed artifact.
- **Execution-capability registration** — environment-qualified record of demonstrated technical operations; not authority.

One custody type does not silently establish another.

In particular:
- artifact custody does not imply OAR2 authority;
- OAR1 lineage does not imply Registry standing;
- Registry standing does not imply runtime availability;
- execution capability does not imply authority;
- technical access does not imply permission.

## Activation Rule

A document is active only when the target surface has a defined loading mechanism and current standing permits use.

Examples:

- Adding a Project source can activate it for Project context only after its operative standing is confirmed.
- Committing `AGENTS.md` activates repository guidance within that checkout's scope.
- Registering a process in Supabase does not activate full documentation unless runtime logic calls it.
- Uploading an OAR2 to Drive does not authorize execution.
- Returning OAR1 does not close the cycle.

## Minimum Registry Record

When full document storage is unnecessary, a registration record should identify:

- stable document or process identity;
- version;
- standing;
- content SHA-256;
- authoritative custody location;
- applicable system or runtime;
- activation or retrieval rule.

## Conflict Rule

If surfaces disagree, preserve each record, identify the conflict, and hold mutation or closure until the authority and custody relation is resolved. Do not overwrite history to manufacture agreement.

## Boundary

Authority is recorded. Structure relates. Registry identifies. Custody preserves. Runtime loads. Executor acts. Evidence returns. Chazz reviews. Operator disposes. Public surfaces express only approved standing.
