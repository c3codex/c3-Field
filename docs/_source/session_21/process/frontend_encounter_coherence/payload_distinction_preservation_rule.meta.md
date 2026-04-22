---
title: payload_distinction_preservation_rule
doc_type: process_rule
circuit: c1
---

# Payload Distinction Preservation Rule

## Purpose

Prevent collapse of distinct reveal bodies.

## Rule

Distinct registered payload bodies must render distinctly.

This includes:
- description
- legend
- label
- prompt
- action
- counter

## Enforcement

- each body renders separately
- no substitution between bodies
- no visual merge unless Measures explicitly seats them as one

## Failure Pattern Observed

description was replaced by legend.

## Correction

Render per field and preserve body-specific responsibility.

description is not legend.
legend is not key text.
counter is not explanation.
action is not interpretation.

## Result

Semantic fidelity is preserved.
