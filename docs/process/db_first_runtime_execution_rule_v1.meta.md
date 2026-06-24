---
document_type: process_rule
authority_level: working
document_scope: execution_governance
title: DB-First Runtime Execution Rule
status: active
version: v1
operator: op044
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: frontend_executor
tags:
  - db-first
  - runtime
  - execution
  - governance
  - frontend
  - measures-registry
  - codex-authority
---

# DB-First Runtime Execution Rule

## PURPOSE

Require every Measures Registry OAR2 to query and validate current database state before runtime, frontend, route, media, styling, content, or behavioral mutation.

This rule exists to preserve:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Database authority remains primary.

Runtime remains dependent.

Frontend renders seated state only.

---

## CORE RULE

Database state is always queried first.

Runtime state is never authority.

Frontend state is never authority.

Route state is never authority.

Cached state is never authority.

Media presence is never authority.

Database state is the authority surface.

---

## REQUIRED OAR2 INSERT

Every Measures Registry OAR2 shall contain the following execution requirement.

### DB-FIRST EXECUTION RULE

Before execution, Cody must query current database state for all affected surfaces.

Observed state must be derived from seated DB records, including where applicable:

- registry records
- release state
- encounter definitions
- media mappings
- transition rules
- runtime contracts
- active standing
- dependency standing
- access standing

Runtime behavior must be checked against DB authority before mutation.

If DB state is missing, stale, blocked, contradictory, or unavailable:

- report missing state
- report contradictory state
- do not invent state
- do not hardcode fallback truth
- do not infer release standing
- do not infer route standing
- do not infer media standing
- do not infer content standing
- stop mutation until DB standing is clarified

Database first.

Runtime second.

Frontend renders seated state only.

---

## OBSERVED REQUIREMENT

All OAR2 Observed sections must begin with:

1. Query current DB state.
2. Verify seated records.
3. Verify release standing.
4. Verify encounter standing.
5. Verify media mappings.
6. Verify runtime contracts.
7. Compare runtime behavior against DB authority.
8. Identify drift.

Observed runtime behavior alone is insufficient.

Observed DB state is required.

---

## FRONTEND RULE

Frontend may:

- render seated state
- report missing state
- report unavailable state
- report held state

Frontend may not:

- invent routes
- invent content
- invent release standing
- invent media mappings
- invent dependencies
- invent authority

No frontend-owned truth.

---

## MEDIA RULE

Media existence inside bucket storage does not create standing.

Media standing exists only when seated in database state.

Runtime media behavior must resolve from DB records.

---

## ROUTING RULE

Route existence does not create authority.

Routes must resolve from seated records and active standing.

Routing behavior remains dependent on DB state.

---

## SUCCESS CONDITION

The rule is satisfied when:

- all future OAR2 execution begins with DB verification
- runtime corrections validate DB standing before mutation
- frontend renders seated state only
- hardcoded fallback truth is eliminated
- runtime behavior remains dependent on database authority

---

## CLOSE

Codex holds authority.

Field structures relation.

Measures registers reveal.

OAR2 routes execution.

Chazz validates.

Cody implements.

src renders seated state.

Database first.

Runtime second.
