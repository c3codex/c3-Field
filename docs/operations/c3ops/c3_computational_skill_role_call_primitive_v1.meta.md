---
document_type: primitive
title: c3 Computational Skill / Role Call Primitive
version: v1
date: 2026-09-12
operator: op044
system: c3_field
surface: c3ops
standing: elevated_confirmed_pending_persist
semantic_change: true
---

# c3 Computational Skill / Role Call Primitive v1

## Determination

A Computational Skill is a bounded capability definition available to a computational runtime.

A skill is not a role, permission, authority, credential, process, standing, or secure role key.

Local model skill definitions remain provider/runtime-owned. c3 registers only capability identity and governed relation: skill URI, name, provider, public description, observed availability, execution identity, Role Call requirement, external/Canopy dependency, and returned evidence.

## Role Call

Role Call resolves which currently available computational skills may be brought into an encounter by the called role.

Role identity -> Environment -> Skill catalog -> Role/skill eligibility -> Process/permission/Boundary -> Invocation -> Evidence return.

Skill present != role eligible != effect authorized != action executed.

AVAILABLE means computationally available to the role. It does not authorize every effect the skill can technically perform.

## Existing-law compatibility

Existing Role Call law remains:
- chambers assemble;
- roles authorize;
- native roles are structural encounter authorities;
- AI role profiles remain separate from native roles;
- secure role keys remain separate from public/native role names.

This primitive adds subordinate skill resolution. It does not turn skills into roles.

## Canopy

Skills requiring non-c3 providers or services use the Canopy relation. Provider availability never creates external-passage authority.

c3 Role Call may narrow c3Ops skill use but may not override platform safety, connector authorization, runtime absence, or provider consent requirements.

## 3-2-2

Constraints:
1. Skill does not create authority.
2. Local availability does not create c3 eligibility; Role Call is required.
3. Role eligibility does not authorize consequential effects.

Agreements:
1. All locally exposed model skills are catalog candidates.
2. Governed invocation returns capability, role, environment, effect, result, and external evidence.

Resolutions:
1. Role Call determines computational availability.
2. Missing role, environment, skill, provider, permission, process authority, or Boundary standing returns HOLD/SEND/DENY rather than inferred execution.

## Dispositions

AVAILABLE | HOLD | SEND | DENY | UNAVAILABLE

## Inventory snapshot

2026-09-12 active runtime: 54 model-local skills.

Provider families:
google-drive 5; supabase 2; data-analytics 20; openai-templates 20; template-creator 1; presentations-router 1; pdf-router 1; documents-router 1; deep-research-work 1; plugin-management 1; spreadsheets-router 1.

This is an availability snapshot, not a permanent guarantee.

## Elevation

Ledger/source: PASS.
MGS: PASS.
Primitive: CONFIRMED.
Concordance: REQUIRED because this introduces governing Computational Skill semantics and extends Role Call semantics.

Standing: ELEVATED_CONFIRMED_PENDING_PERSIST.

Next: advance semantic source, register model-local skill catalog, seat Role Call resolution, expose read-only c3Ops projection.
