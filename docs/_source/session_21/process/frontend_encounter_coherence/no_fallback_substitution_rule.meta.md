---
title: no_fallback_substitution_rule
doc_type: process_rule
circuit: c2
---

# No Fallback Substitution Rule

## Purpose

Prevent helpful-looking render lies.

## Rule

Missing data is not permission to substitute.

## Allowed

- loading state
- absence state
- structural failure state

## Not Allowed

- invented copy
- substituted payload bodies
- approximate UI meaning
- generic filler text standing in for registered content

## Failure Pattern Observed

The frontend rendered something plausible instead of something true.

## Correction

Expose the seam.
Do not patch over it in the encounter file.

## Result

Truth is preserved over appearance.
