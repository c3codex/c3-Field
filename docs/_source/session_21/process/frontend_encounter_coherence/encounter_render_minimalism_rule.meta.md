---
title: encounter_render_minimalism_rule
doc_type: process_rule
circuit: c2
---

# Encounter Render Minimalism Rule

## Purpose

Prevent encounter files from becoming mixed-authority components.

## Rule

Each encounter-side file should carry one primary render responsibility.

A file should answer:
- what does this surface render
- from which registered payload
- by what allowed interaction

## Avoid

- mixing layout heuristics with semantic interpretation
- merging content substitution with rendering
- carrying multiple reveal responsibilities in one file

## Failure Pattern Observed

Files began combining layout, meaning, and fallback behavior.

## Correction

Split render responsibilities where needed:
- media render
- text render
- action render
- state render

## Result

Smaller, clearer, and more faithful encounter files.
