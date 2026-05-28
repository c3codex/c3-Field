---
document_type: architecture_contract
authority_level: working
document_scope: measures_interoperability
title: Measures Registry — Obsidian Assessment Gate Contract v1
status: seated
version: v1
operator: op044
date: 2026-05-27
source_oar2: docs/oar/measures_interoperability/oar2_governed_measures_registry_isomorphic_architecture_contract_seating_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - architecture-contract
  - measures-registry
  - obsidian
  - assessment-gate
  - left-path
  - isomorphic
  - codexstone
material: obsidian
chamber_position: left-path-gate
path_position: post-c3-map
---

# Measures Registry — Obsidian Assessment Gate Contract v1

## Contract Purpose

The Obsidian Assessment Gate is the 7-question AI Environment Readiness Gate.

It exposes drift, diagnoses risk, reduces incoherence, and maps Measures resolution standing.

Obsidian = assessment, drift exposure, reduction, readiness gate.

## Runtime Anchor

| Field | Value |
|---|---|
| DB encounter_key | `measures_ai_operational_evaluation` / `iis_eval_gate1` / `measures_assessment` / `structured_eval` |
| Surface states | `measures_ai_operational_evaluation`, `iis_eval_gate1`, `measures_assessment`, `structured_eval` |
| Mechanics source | `assessment_mechanics` jsonb in `measures_encounter_def.metadata` |
| Interpretation source | `assessment_interpretation` jsonb |
| Media roles | `question_chamber_background`, `assessment_background`, `lapis_background`, `registry_watermark`, `registry_mark`, `marble_accent_reference` |
| Design token | `background_obsidian`, `panel_obsidian` |

## Material Assignment

Obsidian.

Obsidian is sharp, reductive, and clarifying.

The Assessment Gate does not comfort. It reveals.

The visitor's AI environment pattern is exposed through the question sequence.

## Gate Structure

### 7-Question Sequence

The gate presents 7 questions about the visitor's AI operational environment.

Each question has:
- `question_key` — unique identifier
- `question` — the question text
- `context_label` — optional additional context label
- `options` — 3–4 choices, each carrying `condition_tags`

Questions are rendered one at a time (`evalSectionIndex` advances per question).

### Condition Tag Resolution

Each answer carries `condition_tags`.

After all 7 questions are answered, `selectedConditionTraces` maps answers to tags.

Tags are resolved against `standing_rules` or `scoring_thresholds` in `assessment_interpretation`.

### Standing Determination

Two resolution paths:

**1. Standing Rules (tag-based)**

`resolveEnvironmentalReport` matches submitted condition tags against `standing_rules` using:
- `any_tags` — at least one tag must match
- `all_tags` — all tags must match (weighted ×3)
- `priority` — tiebreaker when scores are equal

**2. Scoring Thresholds (percentage-based)**

`resolveEnvironmentalReportByScore` calculates a score percentage across questions and matches to `scoring_thresholds` by min/max range.

Both paths produce an `EnvironmentalStandingReport`.

### EnvironmentalStandingReport

| Field | Purpose |
|---|---|
| `environmental_standing` | The named standing (e.g., "Structured Governance Candidate") |
| `standing_key` | Machine key for routing |
| `assessment_title` | Display title |
| `assessment_result` | Result label |
| `detected_conditions` | Up to 8 human-readable condition labels |
| `findings` | Primary findings derived from finding_map |
| `operational_exposure_summary` | Summary of detected drift/exposure |
| `recommended_structured_action` | Recommended response pathway |
| `continuation_pathway` | Where the visitor proceeds |
| `explainability` | Audit trail of question keys, condition tags, and standing rule |

## SRC Intake Standing

The gate requires SRC standing before assessment begins.

SRC standing is established by the `connect_src` surface.

Without SRC intake (institution_name, institution_type, contact_name, contact_email), the gate must not activate.

The `evalFields` state carries SRC data into the assessment and email contract surfaces.

## Post-Gate Routing

After the gate:
1. `measures_eval_email_contract` — delivery contact collection
2. `measures_phases_reveal` — Marble Commerced Circuit entry

The email contract surface (`measures_eval_email_contract`) receives the `EnvironmentalStandingReport` and generates the `AssessmentEmailArtifact`.

## Drift Exposure Function

The Obsidian Gate does not simply measure readiness.

It exposes the operational structure of the AI environment.

Drift = structural ambiguity operating as a hidden variable.

The gate surfaces what the environment reveals — not what the visitor claims.

## What the Assessment Gate Must Not Do

- Present pricing or commerce directly
- Route to `reserve_seat` or `phase_payment` before assessment is complete
- Skip the email contract surface
- Expose raw condition tags to the visitor
- Claim final Commerced Circuit qualification without delivering the report

## Continuation

From the Obsidian Assessment Gate → `measures_eval_email_contract` → `measures_phases_reveal` → Marble Commerced Circuit.

## Boundary

This contract governs question sequence, condition resolution, standing determination, and post-gate routing.

Marble Commerced Circuit activation is governed by the Marble Commerced Circuit Contract.

Runtime implementation is a separate OAR2.

No media, CSS, or DB mutation is authorized by this contract.

## Close

Obsidian exposes.

The gate reduces incoherence.

Standing is determined by evidence, not declaration.
