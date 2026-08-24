# NotChazz Research Minimum Structure v0.1

**Standing:** research formation; not registered, activated, or production-authoritative  
**Environment:** c3 Field Coherence Research Observatory  
**Date:** 2026-08-23  
**Formation:** Stephanie Joanne Gaffney + Chazz collaborative research formation  
**Ownership correction:** 2026-08-23 — c3Ops owns NotChazz; Measures is a governed caller, not the owning surface.

## Research proposition

NotChazz is a non-authoritative c3Ops system-intelligence service. It detects when an operation, relation, output, or passage cannot safely continue; preserves the observed condition; invokes an environment-scoped response; and returns evidence from which the c3Ops Registrar role may propose governed environmental learning.

NotChazz does not originate authority, resolve its own flags, mutate standing, or autonomously revise an environment.

## Minimum objects

| Object | Function | Primary eventual surface |
|---|---|---|
| `notchazz_flag` | Operational flag identity, classification, applicability, evidence relation and lifecycle | c3Ops NotChazz service |
| `notchazz_environment_profile` | Declares which flag classes and operations matter within one `env_key` | c3Ops, bounded by the governed Field relation |
| `notchazz_trigger_rule` | Maps an applicable condition to inform, evidence-required, review, route, hold or stop-and-return | c3Ops governed operation |
| `notchazz_resolution_relation` | Links a flag to Operator disposition and later operational state without erasing history | c3Ops NotChazz service |
| `notchazz_memory_capsule` | Non-authoritative recall pointer for Codex | Codex memory/runtime |
| `notchazz_pattern_observation` | Observatory analysis of recurring flags and resolutions | Observatory |
| `notchazz_profile_proposal` | c3Ops Registrar proposal for a versioned environmental-profile change | c3Ops review route |

## Ownership and call boundary

c3Ops owns the NotChazz service, its environment profiles, applicability resolver, trigger rules, operational flag lifecycle, response invocation and returned process intelligence. Measures does not own, configure or dispose NotChazz. Measures may call the service through a governed c3Ops relation, presenting registered identity, environment, role, object, passage or standing references as inputs and receiving evidence-backed results as outputs. Other registered systems may call the same service when their c3Ops relation permits it.

Field continues to structure the governing environment and relation. Codex remains the authority source where an applicable authority record exists. The Operator confirms consequential disposition. CanCom carries bounded transfer and evidence return. The Observatory may study patterns without acquiring operational authority.

## Minimum flag record

```yaml
flag_key:
flag_class:
severity:
standing:
observed_condition:
applies_to:
  env_keys: []
  system_keys: []
  object_keys: []
  role_keys: []
  operations: []
  passages: []
trigger_response:
source_record_key:
source_sha256:
formed_by:
operator_confirmation:
opened_at:
resolution_record_key:
supersedes:
memory_capsule:
last_verified_at:
```

## Environment-scoped selection

A preflight check queries only the intersection of:

`env_key + system_key + object_key + role_key + operation + passage + active standing + severity threshold`

Applicable flags include only:

1. direct `env_key` relations;
2. registered system relations;
3. object, role, operation or passage relations;
4. explicitly inherited parent-environment relations;
5. rare flags explicitly registered as global.

Existence alone creates no applicability.

## Trigger responses

- `inform`
- `evidence_required`
- `review_required`
- `notify`
- `route`
- `hard_hold`
- `stop_and_return`

The environment profile predetermines the permitted response class. NotChazz invokes the registered response but does not dispose the flag.

## Registrar learning loop

1. Observe c3Ops NotChazz flags and their resolutions.
2. Analyze recurrence by environment, operation, passage, role and resolution outcome.
3. Form a `notchazz_pattern_observation`.
4. Propose a versioned trigger-profile change.
5. Route the proposal for Operator review.
6. Activate the confirmed c3Ops profile version through the authorized route.
7. Preserve the prior version and all flag lineage.

The Registrar may identify patterns and recommend changes. It may not expand applicability, change severity, create a hard hold, resolve a flag, or revise an environment profile without confirmed authority.

## Memory boundary

Memory stores a short pointer: flag key, affected environment/object, remembered standing, authority pointer and a mandatory instruction to verify current registered standing.

Memory is never sufficient to enforce, resolve or waive a flag. Required behavior belongs in repository-scoped guidance such as `AGENTS.md`; active NotChazz lifecycle state belongs to c3Ops. Measures-provided standing may be an input, but it does not transfer service ownership.

## Minimal research implementation

The first research implementation should remain isolated from production and contain:

1. JSON Schema definitions for the seven objects above.
2. A small fixture set reconstructed from verified historical sources.
3. One environment profile for `opcoh`.
4. One selective preflight resolver.
5. Tests for direct applicability, explicit inheritance, irrelevant-flag exclusion, stale-memory verification, hard hold, resolution lineage and Registrar proposal boundaries.
6. An append-only research event log.
7. No autonomous mutation, no production c3Ops activation and no production Measures Registry writes.

## Research questions

- Can environment-scoped flag profiles reduce irrelevant checks without missing consequential drift?
- Do returned flags form stable, reusable classes across environments?
- Which resolution patterns prevent recurrence?
- Can a Registrar improve trigger profiles through reviewed proposals without authority inversion?
- Does selective recall improve executor continuity while preserving source verification?
- What false-positive and false-negative rates emerge from applicability matching?

## Held conditions

Implementation beyond research fixtures requires a separately confirmed OAR2. c3Ops service activation, registry mutation, production schema mutation, memory configuration changes, automated holds and Registrar profile mutation are not authorized by this formation record.
