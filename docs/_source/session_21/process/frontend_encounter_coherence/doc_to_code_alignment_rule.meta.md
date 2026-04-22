---
title: doc_to_code_alignment_rule
doc_type: process_rule
circuit: c3
---

# Doc to Code Alignment Rule

## Purpose

Keep implementation aligned to seeded reference surfaces.

## Rule

Before frontend implementation changes:
- check relevant seeded docs
- confirm the contract surface
- confirm active distinctions
- avoid coding from memory or thread residue alone

## Not Allowed

- implementation from recalled conversation only
- mixed seeded and unseeded reference use without distinction
- using convenience assumptions in place of seated rule surfaces

## Result

Code follows system reference instead of assumption.
