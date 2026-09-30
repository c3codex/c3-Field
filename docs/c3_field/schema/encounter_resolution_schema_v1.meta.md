---
document_type: schema
authority_level: registered
document_scope: c3_field_encounter_resolution
title: Encounter Resolution Schema v1
status: active
version: v1
operator: op044
system: c3_field
---

# Encounter Resolution Schema v1

## Purpose

Normalize encounter state so existence, access, discoverability, native rendering, external projection, and custody are not collapsed into one overloaded public/private state.

## Canonical attributes

| Attribute | Question answered | Allowed values / shape |
| --- | --- | --- |
| encounter_standing | Does a valid encounter exist? | pending, active, held, closed |
| access_scope | Who may enter it? | owner, relational, invited, public |
| discoverability | Can someone find it without already having the route or relation? | hidden, unlisted, listed |
| native_surface | What c3-native environment renders the encounter? | c3field; future registered native environment classes |
| projection_scope | Where else may the encounter be represented? | none, canopy, or other separately authorized projections |
| custody_source | What approved PAC supplies the encounter? | PAC reference only; no custody transfer |

## Normalization invariant

standing != access != discoverability != native_surface != projection_scope != custody

No renderer, PAC approval action, Registry transition, or projection action may infer one dimension from another.

## Consequences

- An encounter may be active and c3 Field-native without being public.
- An encounter may be public but unlisted.
- Canopy projection does not make an encounter public.
- Canopy projection does not change custody.
- PAC approval does not authorize encounter use.
- Encounter authorization does not determine access scope.
- Encounter authorization does not determine discoverability.
- Encounter authorization does not automatically authorize Canopy.
- custody_source is a reference to the approved PAC supplying the encounter; C2ME_env does not take PAC custody.

## Encounter Resolution Profile

A specific encounter resolves these schema fields independently.

Example:

```text
encounter_standing = active
access_scope        = relational
discoverability     = unlisted
native_surface      = c3field
projection_scope    = none
custody_source      = pac:<approved-pac-key>
```

This encounter exists natively in c3 Field, is available through qualifying relation, is not publicly discoverable, has no external projection, and leaves custody with the PAC owner/custodian.

Another valid profile:

```text
encounter_standing = active
access_scope        = public
discoverability     = unlisted
native_surface      = c3field
projection_scope    = canopy
custody_source      = pac:<approved-pac-key>
```

Public access and discoverability remain distinct. Canopy is only an authorized projection.

## Boundary with My PACs

For personally owned PACs:

personal custody -> owner approval -> separate encounter authorization -> Encounter Resolution Profile -> C2ME_env projection

Approval is not encounter authorization.

## Boundary with governed branch/system PACs

For branch/system/initiative PACs:

governed custody -> operator approval in C3OPS -> Encounter Resolution Profile -> C2ME_env projection

My Env may display registered initiative state without creating ownership or personal PAC custody.

## Smart-contract boundary

This schema is declarative authority only.

It is not a smart contract, executable contract, or mutation authority primitive.

If an executable primitive is later formed from this schema, that requires separate registration, execution authority, and OAR passage.
