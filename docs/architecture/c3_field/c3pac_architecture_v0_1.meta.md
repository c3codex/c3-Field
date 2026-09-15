---
document_type: architecture_spec
title: c3Pac Architecture
version: v0.1
status: captured_persisted
operator: op044
system: c3_field
date: 2026-09-15
---

# c3Pac Architecture v0.1

## Core determination

A governed environment resolves through one controlling c3EnvPac.

The c3EnvPac is the owned custody object for the environment package graph.

The Registry references the c3EnvPac. The Registry does not absorb the full package contents.

Runtime buckets, repositories, databases, renderers, and delivery surfaces are implementation and delivery locations. They do not become custody authority merely because an artifact is present there.

## Package family

c3Pac is the shared package grammar.

c3EnvPac is the environment-level custody package.

Nested package types may include:
- c3WebPac — website / public encounter package
- c3PubPac — publication package
- c3SrcPac — source package
- c3MediaPac — media package
- c3DataPac — data/read-model package
- c3EvidencePac — evidence package
- c3ProcessPac — process package

Additional c3Pac types may be introduced later without changing the top-level architecture.

Historical WebPac, PubPac, SrcPac, or similar names remain lineage terms and are not silently renamed.

## Native relation

Registry
-> env_key
-> c3EnvPac
-> package_index
-> nested c3Pac
-> designated runtime/storage bindings
-> runtime consumer
-> evidence return

## Minimum c3Pac envelope

Each c3Pac should expose at minimum:
- pac_key
- pac_type
- version
- standing
- custody_owner
- custody_path
- sha256 or evidence reference when available
- parent_envpac
- source_authority
- runtime_targets
- relations

Package-specific fields remain inside the applicable c3Pac type.

## Custody rule

Every c3Pac has one controlling c3EnvPac for custody.

A c3Pac may be referenced by multiple environments, but cross-environment reference does not transfer custody and does not create duplicate ownership.

Reference is relation, not custody transfer.

## Runtime rule

Runtime copies may exist in designated buckets or other delivery stores.

The controlling c3Pac records the runtime binding.

Bucket presence alone does not establish package identity, standing, source authority, custody, release authorization, or Registry authority.

## Registry rule

The Registry should remain compact and durable.

An environment package reference should resolve at minimum:
- env_key
- envpac_key
- envpac_version
- envpac_sha256 or evidence reference
- envpac_custody_path
- envpac_standing
- effective_version

Child package contents remain under c3EnvPac/c3Pac custody.

## Non-collapse

The website is not the environment.
The database row is not the environment.
The bucket is not the environment.
The repository is not the environment.
The renderer is not the environment.

The c3EnvPac is the durable environment custody object that preserves the governed package graph across implementation changes.

## Scaling principle

An environment may migrate frontend, renderer, storage provider, database, media delivery, publication tooling, or source repository without losing its package graph, custody relation, or Registry referent, provided the c3EnvPac and its lineage remain intact.

## Founding principle

The Registry records which c3EnvPac governs an environment and what standing that package has.

The c3EnvPac records what belongs to that environment and how its nested packages may manifest.

Runtime infrastructure delivers.

Renderers consume.

Neither runtime infrastructure nor renderers own the environment.
