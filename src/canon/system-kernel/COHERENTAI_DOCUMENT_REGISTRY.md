---
title: CoherentAI Document Registry
slug: coherentai-document-registry
document_type: registry
document_scope: kernel
document_status: active
authority_level: structural
canonical: true
version: 3.0
last_reviewed: 2026-03-14
related_system: coherentai
source_bucket: codex-vault
source_folder: system-kernel
summary: |
  Complete document registry for CoherentAI v3.0. Defines all 52 canon
  documents across field canon, pillar canon, system kernel, measures kernel,
  and role contracts — with slug, path, doc_class, binding_strength, pillar,
  folder, and status. The authoritative index CoherentAI uses for document
  classification, routing, and storage decisions.
---

# CoherentAI Document Registry v3.0

## Binding Strength Scale

| Value | Meaning |
|---|---|
| `critical` | Foundational. Cannot be overridden. Changes require full canon challenge. |
| `high` | Binding architecture. Governs implementation decisions. |
| `medium_high` | Strong guidance. Deviation requires documented reason. |
| `medium` | Operational reference. May be updated through normal process. |
| `low` | Draft, progress, or informational. Not binding. |

## Document Classes

| Class | Description |
|---|---|
| `field_canon` | Top-level canon. Governs all pillars. |
| `pillar_meta` | Pillar-level canon authority doc. |
| `doctrine` | Binding system architecture. |
| `protocol` | Execution procedure. |
| `architecture` | Structural design document. |
| `logic_map` | Encounter, navigation, or behavior map. |
| `taxonomy` | Classification or naming system. |
| `encounter_model` | Encounter type definitions. |
| `data_contract` | DB schema or data shape contract. |
| `conversion_record` | Migration or conversion log. |
| `installation_model` | Installation structure definition. |
| `test_spec` | Test definition and success criteria. |
| `checklist` | Completion or readiness checklist. |
| `registry` | Index or registry document. |
| `role_contract` | Bounded operational role definition. |
| `assessment` | Architectural or system evaluation. |
| `glyph_registry` | Glyph/symbol classification index. |

---

# SECTION 1 — Field Canon
bucket: codex-vault / folder: field-canon / total: 4

  - slug: oarlogic-canon
    file: oarlogic_canon.md
    doc_class: field_canon
    binding_strength: critical
    pillar: coherentai
    status: draft
    event_required: true
    note: Incomplete — aligned and routed column semantics require authoring before sealing.
    summary: Defines OAR Logic as a field-level governance primitive. The append-only ledger that converts real actions into coherent signals across the c3 circuit.

  - slug: recognition-as-protocol-whitepaper
    file: recognition-as-protocol-whitepaper.md
    doc_class: field_canon
    binding_strength: high
    pillar: c3
    status: active
    summary: Documents recognition as a transmissible coherence protocol across systems. DAO Technical Brief.

  - slug: coherent-convergence-packet-v1
    file: Coherent-Convergence-Packet_v1.md
    doc_class: field_canon
    binding_strength: high
    pillar: c3
    status: active
    event_required: true
    summary: Formalizes transition into coherent convergence. February 17, 2026 New Moon / Lunar Eclipse integration marker.

  - slug: c3-model-circuit-spec
    file: Priceless_Gallery_Initiative.md
    doc_class: field_canon
    binding_strength: critical
    pillar: c3-model
    status: active
    summary: Defines Connect · Contribute · Create circuits and the immutable 33/33/33 value split. Priceless Gallery as proof-of-function.

---

# SECTION 2 — Pillar Canon
bucket: codex-vault / folder: pillar-canon / total: 11

  - slug: measures-of-inanna-pillar-meta
    file: measures-of-inanna-meta.md
    doc_class: pillar_meta
    binding_strength: critical
    pillar: measures
    status: active
    summary: Pillar-level canon authority for all Measures implementation, rendering, and governance decisions.

  - slug: priceless-gallery-pillar-meta
    file: priceless-gallery-meta.md
    doc_class: pillar_meta
    binding_strength: critical
    pillar: gallery
    status: active
    summary: Pillar-level canon authority for the Priceless Gallery and three-circuit governance.

  - slug: c3-model-pillar-meta
    file: c3-model-meta.md
    doc_class: pillar_meta
    binding_strength: critical
    pillar: c3-model
    status: active
    summary: Pillar-level canon authority for the c3 Model circuit definition and circulation law.

  - slug: c3-community-partners-dao-llc-pillar-meta
    file: c3-community-partners-dao-llc-meta.md
    doc_class: pillar_meta
    binding_strength: critical
    pillar: restore
    status: active
    summary: Pillar-level canon authority for Commons & Restoration, DAO governance, and restoration pathways.

  - slug: measures-of-inanna-exhibition
    file: Measures_impact.md
    doc_class: canon
    binding_strength: high
    pillar: measures
    status: active
    summary: Exhibition in three movements — Obsidian, Crystal, Marble. The measure holds with or without witness.

  - slug: obsidian-measure-of-reduction
    file: Obsidian_Measure_of_Reduction.md
    doc_class: canon
    binding_strength: high
    pillar: measures
    status: active
    summary: Defines the Obsidian pillar as descent as a measured process. Reduction as calibration, not punishment.

  - slug: crystal-measure-of-recognition
    file: Crystal_Measure_of_Recognition.md
    doc_class: canon
    binding_strength: high
    pillar: measures
    status: active
    summary: Defines the Crystal pillar as recognition as structural clarification. Epithets are identifications, not conferred attributes.

  - slug: marble-mes-canon
    file: Marble_MEs_Canon.md
    doc_class: canon
    binding_strength: critical
    pillar: measures
    status: active
    summary: Defines the Thirteen Marble MEs as governance primitives. Integration into durable form.

  - slug: marble-pillar-authority-context
    file: Marble_Pillar_Authority_Context.md
    doc_class: canon
    binding_strength: high
    pillar: measures
    status: active
    summary: Mesopotamian authority context. Authority as transmission, not ownership.

  - slug: mes-function-c3-governance
    file: MEs_Function_c3_governance.md
    doc_class: canon
    binding_strength: high
    pillar: measures
    status: active
    summary: Maps the 13 MEs to c3 architecture layers across four seasonal release phases.

  - slug: measures-phase-release-calendar
    file: Measures_Phase_Release.md
    doc_class: canon
    binding_strength: critical
    pillar: measures
    status: active
    event_required: true
    summary: Full phased release calendar anchored to astronomical markers. Cathedral timing across a full year arc.

---

# SECTION 3 — System Kernel
bucket: codex-vault / folder: system-kernel / total: 23

  - slug: coherentai-kernel-overview
    file: 00_kernel_overview.md
    doc_class: doctrine
    binding_strength: critical
    pillar: coherentai
    status: active
    summary: Defines the CoherentAI kernel as the minimal operating structure. Not governance — the bounded operational pathway.

  - slug: coherentai-system-map
    file: COHERENTAI_SYSTEM_MAP.md
    doc_class: doctrine
    binding_strength: critical
    pillar: coherentai
    status: active
    summary: Formalizes the operating structure of c3 Field. Binding for request routing, authority resolution, and anti-drift enforcement.

  - slug: nine-guardrails
    file: 11_guardrails_9.md
    doc_class: canon
    binding_strength: critical
    pillar: coherentai
    status: active
    summary: The nine non-negotiable structural protections. Not preferences — boundary conditions.

  - slug: coherentai-role-charter
    file: 03_rolecharter.md
    doc_class: architecture
    binding_strength: critical
    pillar: coherentai
    status: active
    summary: Defines the Seven Roles as bounded functional authorities. Not personalities — operational contracts.

  - slug: coherentai-verification-rules
    file: 05_verification_rules.md
    doc_class: architecture
    binding_strength: high
    pillar: coherentai
    status: active
    event_required: true
    summary: Four verification layers — canon, architecture, registry/asset, operational. How the field confirms itself.

  - slug: coherentai-change-control
    file: 05_change_control.md
    doc_class: protocol
    binding_strength: high
    pillar: coherentai
    status: active
    event_required: true
    summary: Three change categories, standard change path, disallowed patterns. Emergency does not cancel provenance.

  - slug: coherentai-oar-logging-spec
    file: 06_oar_logging_spec.md
    doc_class: architecture
    binding_strength: high
    pillar: coherentai
    status: active
    depends_on: oarlogic-canon
    summary: Kernel implementation spec for OAR — when to log, required fields, categories, and examples.

  - slug: coherentai-result-layer-spec
    file: 07_result_layer.md
    doc_class: architecture
    binding_strength: high
    pillar: coherentai
    status: active
    summary: Final kernel component. Bounded, legible, traceable return of governed process output.

  - slug: coherentai-dispatcher-spec
    file: 02_dispatcher_spec.md
    doc_class: architecture
    binding_strength: high
    pillar: coherentai
    status: draft
    summary: Routing spine of the kernel. Turns claimed work into scoped execution through contract-aware dispatch.

  - slug: coherentai-llm-execution-engine-spec
    file: 04_llm_execution_engine_spec.md
    doc_class: architecture
    binding_strength: high
    pillar: coherentai
    status: draft
    summary: Bounded language-model execution. The LLM is a component used by the system, not the system itself.

  - slug: coherentai-installation-protocol
    file: COHERENTAI_INSTALLATION_PROTOCOL.md
    doc_class: protocol
    binding_strength: high
    pillar: coherentai
    status: active
    summary: Execution protocol for installing, testing, and evolving system components through CoherentAI.

  - slug: coherentai-document-classification-function
    file: COHERENTAI_DOCUMENT_CLASSIFICATION_FUNCTION.md
    doc_class: architecture
    binding_strength: high
    pillar: coherentai
    status: draft
    summary: Function contract for detecting document need, classifying type, and prompting for storage or event registration.

  - slug: coherentai-first-test
    file: COHERENTAI_FIRST_TEST.md
    doc_class: test_spec
    binding_strength: medium
    pillar: coherentai
    related_pillar: measures
    status: active
    event_required: true
    summary: Install-1 test spec — ME-I Runtime Resolution through the full governed execution path.

  - slug: structural-boundaries
    file: STRUCTURAL_BOUNDRIES.md
    doc_class: architecture
    binding_strength: high
    pillar: coherentai
    status: active
    summary: Current structural boundary model for pillars, systems, state, and installation architecture. v2.0.

  - slug: c3-canon-decision-protocol
    file: c3-canon-decision-protocol.md
    doc_class: protocol
    binding_strength: high
    pillar: coherentai
    status: draft
    summary: Protocol for making and recording binding canon decisions within c3 Field.

  - slug: glyph-registry
    file: GLYPH_REGISTRY.md
    doc_class: glyph_registry
    binding_strength: medium
    pillar: coherentai
    status: active
    summary: Initial glyph markers for document classification within the Codex vault and CoherentAI kernel.

  - slug: coherentai-v1-spec
    file: coherentai-v1-spec.md
    doc_class: architecture
    binding_strength: high
    pillar: coherentai
    status: active
    summary: Minimum viable CoherentAI system — canon registry, integrity model, concept linkage, OAR routing, phased release.

  - slug: coherentai-v1-assessment-of-findings
    file: assessment-of-findings-v1.0.md
    doc_class: assessment
    binding_strength: medium
    pillar: coherentai
    status: active
    summary: External architectural assessment. CoherentAI as coherent field within which AI can operate reliably.

  - slug: full-system-flow
    file: full-system-flow.md
    doc_class: architecture
    binding_strength: high
    pillar: coherentai
    status: active
    summary: Mermaid flowchart of the full c3 Field system — users, site, Supabase, CoherentAI, LLM engine, executors.

  - slug: coherentai-system-kernel-index
    file: system_kernel_index.md
    doc_class: registry
    binding_strength: high
    pillar: coherentai
    status: active
    summary: Front-door index for all kernel documents. Reading order, document map, governing principle.

  - slug: role-contracts-index
    file: role_contracts_index.md
    doc_class: registry
    binding_strength: high
    pillar: coherentai
    status: active
    summary: Front-door index for all seven role contracts. Reading order and shared role principles.

  - slug: measures-coherentai-installation-environment
    file: measures_installation_environment.md
    doc_class: architecture
    binding_strength: high
    pillar: measures
    status: active
    summary: Measures as the first CoherentAI installation environment and reference implementation.

  - slug: coherentai-document-registry
    file: COHERENTAI_DOCUMENT_REGISTRY.md
    doc_class: registry
    binding_strength: critical
    pillar: coherentai
    status: active
    summary: This document. Complete index of all 52 canon documents across all folders.

---

# SECTION 4 — Measures Kernel
bucket: codex-vault / folder: measures-kernel / total: 7

  - slug: measures-data-contract
    file: MEASURES_DATA_CONTRACT.md
    doc_class: data_contract
    binding_strength: high
    pillar: measures
    status: draft
    summary: Canonical data shape and DB contract for the Measures installation.

  - slug: measures-encounter-types
    file: MEASURES_ENCOUNTER_TYPES.md
    doc_class: encounter_model
    binding_strength: high
    pillar: measures
    status: active
    summary: Five canonical encounter types — epigraph, passage, gateboard, gateplate, connect_invite.

  - slug: measures-gates-conversion-record
    file: MEASURES_GATES-CONVERSION_RECORD.md
    doc_class: conversion_record
    binding_strength: medium
    pillar: measures
    status: draft
    note: Seal when gate conversion is complete.
    summary: Records the conversion and migration of Measures gate data to canonical form.

  - slug: measures-installation-logic-map
    file: MEASURES_INSTALLATION_LOGIC_MAP.md
    doc_class: logic_map
    binding_strength: high
    pillar: measures
    status: active
    summary: Maps encounter types, navigation resolution, media fallback rules, and access-state behavior.

  - slug: measures-installation-architecture
    file: MEASURES_INSTALLATION_MODEL.md
    doc_class: installation_model
    binding_strength: high
    pillar: measures
    status: draft
    note: Slug renamed from measures-installation-model to avoid collision with field canon.
    summary: Installation structure and encounter model for Measures of Inanna.

  - slug: measures-text-taxonomy
    file: MEASURES_TEXT_TAXONOMY.md
    doc_class: taxonomy
    binding_strength: medium_high
    pillar: measures
    status: active
    summary: Defines text roles — epigraph, plaque, context, aspect, passage, connect_invite.

  - slug: gate-completion-checklist
    file: gate-completion-checklist.md
    doc_class: checklist
    binding_strength: medium
    pillar: measures
    status: active
    event_required: true
    summary: Final stretch checklist before ME-level CoherentAI validation.

---

# SECTION 5 — Role Contracts
bucket: codex-vault / folder: role-contracts / total: 7

  - slug: role-contract-architecture-steward
    file: 01_architecture_steward.md
    doc_class: role_contract
    binding_strength: high
    pillar: coherentai
    status: active
    summary: Protects structural integrity, boundary clarity, layer separation.

  - slug: role-contract-implementation-builder
    file: 02_implementation_builder.md
    doc_class: role_contract
    binding_strength: high
    pillar: coherentai
    status: active
    summary: Translates approved structure into working code, migrations, and interfaces.

  - slug: role-contract-coherence-validator
    file: 03_coherence_validator.md
    doc_class: role_contract
    binding_strength: high
    pillar: coherentai
    status: active
    summary: Detects drift, validates registry and schema integrity. Pass / warn / fail / escalate.

  - slug: role-contract-operations-weaver
    file: 04_operations_weaver.md
    doc_class: role_contract
    binding_strength: high
    pillar: coherentai
    status: active
    summary: Converts repetition into reliable process. Automation without hidden authority.

  - slug: role-contract-canon-librarian
    file: 05_canon_librarian.md
    doc_class: role_contract
    binding_strength: high
    pillar: coherentai
    status: active
    summary: Preserves legibility, canon access, concept mapping, and documentation continuity.

  - slug: role-contract-oar-router
    file: 06_oar_router.md
    doc_class: role_contract
    binding_strength: high
    pillar: coherentai
    status: active
    summary: Preserves reasoning trace. Connects observations to alignment context and routing consequence.

  - slug: role-contract-field-curator
    file: 07_field_curator.md
    doc_class: role_contract
    binding_strength: high
    pillar: coherentai
    status: active
    summary: Protects release legibility, sequence integrity, and coherent presentation across live surfaces.

---

# Registry Summary

total_documents: 52

by_folder:
  field-canon: 4
  pillar-canon: 11
  system-kernel: 23
  measures-kernel: 7
  role-contracts: 7
  oar-logs: 0

by_binding_strength:
  critical: 18
  high: 27
  medium_high: 1
  medium: 4
  low: 0

by_status:
  active: 42
  draft: 7
  event_required: 8

removed_from_v2:
  - structural-boundaries-legacy — superseded by v2.0, archived to git history
  - measures-progress-map — point-in-time status doc, non-binding working note

pending_completion:
  - oarlogic-canon — aligned and routed column semantics incomplete
  - c3-canon-decision-protocol — draft, needs authoring
  - coherentai-dispatcher-spec — draft
  - coherentai-llm-execution-engine-spec — draft
  - coherentai-document-classification-function — draft
  - measures-data-contract — draft
  - measures-installation-architecture — draft
