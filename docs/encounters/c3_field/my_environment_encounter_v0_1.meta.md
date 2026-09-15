---
document_type: encounter_definition
title: My Environment Encounter
version: v0.1
status: CAPTURED_ENCOUNTER
operator: op044
system: c3_field
gTM_context: c3_community_partners
surface: my_environment
date: 2026-09-15
source_architecture:
  - docs/architecture/c3_field/c3pac_architecture_v0_1.meta.md
  - docs/strategy/c3_gtm/c3_gtm_critical_path_v0_1.meta.md
---

# My Environment Encounter v0.1

## Purpose

My Environment is the owner-facing c3 Field / c3 Community Partners GTM encounter for an owned environment.

It renders the effective c3EnvPac graph and exposes only actions backed by registered capability, custody, standing, or relation.

It is not a Measures Registry replacement.

Measures Registry remains the institutional entrance for assessment, readiness, standing, and MAP passage.

## Core rule

Nothing decorative pretends to be a control.

Every visible actionable element must:

1. resolve to a real c3 primitive or registered relation;
2. resolve current authority/capability before execution;
3. perform only the bounded action allowed;
4. persist the resulting state or relation;
5. return evidence;
6. update Current where the operation actually changes Current.

If an action is not available, the encounter shows its held standing and reason rather than simulating operation.

## Encounter source

Primary read model:

c3EnvPac
-> owned C3ME.env
-> rooted systems
-> nested c3Pacs
-> access grants
-> runtime bindings
-> evidence
-> Current

Preferred read surface:
- public.c3_envpac_effective_graph

Supporting surfaces may include:
- public.c3_envpac_registry_reference
- public.c3_envpac_access_grant
- public.c3_envpac_capability_grant
- public.c3_pac_runtime_binding
- public.c3_pac_relation
- public.c3_current_state
- public.c3_current_evidence_ref

The frontend does not invent missing truth.

## Primary navigation

### My Environment

Resolves the effective c3EnvPac graph for the owner.

Shows:
- environment identity
- owner
- custodian
- standing
- portability
- C3ME.env relation
- rooted systems
- nested packages
- access relations
- current/evidence summary

### Overview

Resolves:
- Current
- standing
- recent evidence
- active relations
- unresolved or held conditions

### Environments

Resolves owned and explicitly related C3ME.env instances.

No unrelated environment is shown as connected merely because it exists.

### Projects / Initiatives

Resolves initiatives and projects related to this environment.

The encounter does not become a global marketplace or generic listing surface.

### Partners

Resolves bounded person/entity relations to the environment.

### Access

Resolves owner, custodian, delegate, and consumer grants.

Permitted actions may include:
- inspect
- grant
- revoke
- scope review

All writes require actual capability resolution.

### Activity

Resolves c3Ops operations, Current transitions, and returned evidence in chronological relation.

### Evidence

Resolves evidence records, hashes, source references, operation records, and standing.

### Marketplace

Held until the commerce/value-exchange layer is explicitly ready for this environment.

No decorative marketplace behavior is permitted.

### Settings

Exposes only environment-level settings the current actor has authority to change.

## Operable summary cards

### Rooted Systems

Opens the rooted-system graph.

Each system resolves:
- system identity
- relation role
- standing
- capability grants
- runtime relation
- source reference
- returned evidence

### Packages

Opens the c3EnvPac package index.

Each package resolves:
- pac_key
- pac_type
- version
- standing
- custody
- hash/evidence reference
- runtime bindings
- history/relations

### Access

Opens real access-grant management.

A grant never transfers ownership unless an explicit ownership-transfer process exists.

### Evidence

Opens the returned evidence stream.

### Initiatives

Opens initiatives/projects related to the current environment.

## Rooted-system encounter behavior

### c3Ops

May expose only capabilities actually granted to the environment, including where seated:
- BUILD
- WORK
- SYSTEMS
- REGISTRY
- EVIDENCE
- CURRENT
- c3Optics
- Interoperability

c3Ops operates the environment without taking ownership or custody beyond its explicit custodial grant.

### Measures Registry

Remains the institutional entrance.

Its relation may expose:
- Assess the Environment
- MAP the Environment
- standing/reference
- readiness/evaluation relations

It does not become the owner-facing c3 Field shell.

### Other rooted systems

Prism, Inanna, Lapzuli, Registrar, or any future rooted system appears only when an explicit environment relation and standing exist.

No frontend inference.

## Export Environment

Export Environment is an operative portability function, not a decorative download.

When implemented, export must produce an owner-addressable c3EnvPac export containing or referencing, as permitted:

- c3EnvPac manifest
- environment identity
- owner/custodian declaration
- nested c3Pac index
- package versions
- package custody references
- content hashes/evidence references
- rooted-system relations
- access grants appropriate for export
- runtime dependency references
- Current/evidence references
- portability metadata

Export does not silently transfer custody.

Transfer custody is a distinct governed operation.

## Interaction law

Every consequential interaction follows:

click
-> resolve actor
-> resolve relation
-> resolve capability
-> resolve current standing
-> perform bounded operation
-> persist
-> return evidence
-> update Current only if Current actually changed

## Visibility law

Visibility does not grant action.

Action does not grant passage.

Passage does not transfer authority.

Reference does not transfer custody.

Runtime possession does not establish ownership.

## GTM role

This encounter is the first customer-visible proof of:

Own your environment.

A successful encounter allows a person or organization to look at the surface and correctly understand:

- this is my environment;
- these systems are connected to it;
- these packages belong to it;
- these actors have bounded access;
- this is what happened;
- this is what is portable;
- this is what I may change.

## Initial implementation standing

Read-first.

The first implementation may render the effective graph and held/active actions before mutation pathways are enabled.

Mutation controls must not be enabled until each action has a registered capability path and returned-evidence path.

## Encounter boundary

Frontend is encounter, not authority.

c3EnvPac owns the environment package graph.

C3ME.env is the represented environment.

c3Ops operates.

Registry records standing/reference.

Measures remains the institutional entrance.

The owner owns the environment.
