---
document_type: oar2
authority_level: execution_request
document_scope: measures_registry_assessment_runtime_authority
title: OAR2 — Restore Canonical Assessment Runtime Resolution
status: approved
version: v1
operator: op044
system: measures_registry
priority: launch_blocker

native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  executor: claude
  runtime: free

source_alignment:
  - measures_registry_operative_concordance_update_v1
  - database_src_manifest
  - session_13_db_preflight_verification_checklist_v1
  - oar_lifecycle
  - thread_authority

tags:
  - assessment
  - runtime
  - canonical
  - database
  - authority
  - launch
  - measures_registry
---

# OBJECTIVE

Restore canonical Measures Registry Assessment runtime authority by ensuring the
public assessment renders exclusively from the database-authoritative
`measures_assessment` encounter.

This OAR restores runtime authority only.

No assessment content shall be modified.

---

# OBSERVED

Database verification confirms the canonical assessment exists as:

    encounter_key = measures_assessment

containing:

- seven assessment questions
- current wording
- current labels
- current option values
- current condition_tags
- current scoring contract

A historical assessment also exists:

    encounter_key = iis_eval_gate1

This record contains:

- five questions
- obsolete wording
- obsolete condition tags
- obsolete assessment structure

Current runtime attempts to resolve:

    measures_ai_operational_evaluation

No database authority exists for this encounter key.

Runtime therefore falls through to:

    iis_eval_gate1

causing production to render the deprecated assessment.

The canonical database metadata already records:

    held_state.status = under_review
    rendering_status = db_seated_renderer_gap_pending

confirming this renderer gap is already acknowledged by database authority.

---

# ALIGNED

Measures Registry authority remains:

Codex
↓
Field
↓
Measures
↓
Runtime

Database is the sole authority.

Frontend owns no assessment truth.

The runtime shall never silently substitute deprecated assessment content.

Historical database records remain preserved.

Historical runtime behavior shall not.

---

# ROUTED

## 1. Inventory Runtime Resolution

Inspect every runtime reference to:

- measures_assessment
- measures_ai_operational_evaluation
- iis_eval_gate1

Return:

- file paths
- active resolver
- deprecated resolver
- production entry point

Confirm the actual runtime path before modification.

---

## 2. Restore Canonical Resolution

Update the active resolver to query:

    encounter_key = measures_assessment

Do not create aliases.

Do not duplicate assessment rows.

Do not move assessment content into frontend source.

---

## 3. Remove Deprecated Runtime Fallback

Remove active runtime dependency on:

    iis_eval_gate1

If the canonical assessment cannot be resolved, render a governed unavailable state.

Do not silently substitute another assessment.

---

## 4. Preserve Historical Authority

Retain:

    iis_eval_gate1

Mark as:

- deprecated
- historical
- runtime_unreachable

Do not delete.

Maintain append-only history.

---

## 5. Verify Canonical Contract

Confirm runtime renders:

1. ai_deployment_status
2. active_ai_system_visibility
3. failure_traceability
4. persistent_review_standard
5. safe_ai_acceleration_capacity
6. role_authority_boundary
7. implementation_boundary

Verify exact database match for:

- question text
- context_label
- option order
- option values
- option labels
- condition_tags

---

## 6. Runtime QA

Execute complete assessment.

Verify:

- seven questions render
- navigation
- answer persistence
- contact capture
- submission
- report generation
- MAP continuation

No regressions permitted.

---

## 7. Resolve Metadata

After successful verification:

Resolve:

    db_seated_renderer_gap_pending

using append-only metadata governance.

Preserve historical evidence.

---

## 8. Verification

Execute:

    npx tsc --noEmit

    npm run build:registry

Browser QA:

- Desktop
- Mobile

Confirm:

- canonical assessment rendered
- no stale assessment
- no fallback path
- no console errors

---

# EXECUTOR CONSTRAINTS

Executor MAY:

- inspect runtime
- inspect resolver
- update resolver
- update metadata
- execute QA
- produce OAR1 evidence

Executor SHALL NOT:

- rewrite assessment questions
- alter scoring
- alter labels
- alter option values
- alter condition_tags
- alter MAP pricing
- alter reports
- alter Stripe
- alter contact capture
- expand scope

---

# SUCCESS

The Measures Registry Assessment renders exclusively from:

    measures_assessment

Database once again becomes the single operational authority.

The deprecated assessment remains preserved but unreachable.

The canonical seven-question contract is restored.

This OAR resolves the current launch blocker and restores the Assessment as the authoritative foundation for MAP the Environment.

---

# EXPECTED OAR1

docs/oar/measures_registry/oar1_restore_canonical_assessment_runtime_resolution_v1.meta.md
