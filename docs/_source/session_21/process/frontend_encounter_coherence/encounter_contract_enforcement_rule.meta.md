---
title: encounter_contract_enforcement_rule
doc_type: process_rule
circuit: c1
---

# Encounter Contract Enforcement Rule

## Purpose

Bind frontend encounter work to the registered encounter contract.

## Rule

Frontend renders only registered state.

It may not:
- infer meaning
- author semantics
- substitute convenience truth
- smooth over structural absence

## Enforcement

- render only payload keys from EncounterResolution
- preserve registered distinction
- expose absence rather than invent replacement

## Failure Pattern Observed

A legend body rendered where Codex-seated text should have rendered.

## Correction

Bind render paths strictly to explicit payload fields.

If the intended body is missing:
- show absence
- show loading
- or show failure

Never substitute another reveal body.

## Result

Codex truth remains intact at the encounter surface.
