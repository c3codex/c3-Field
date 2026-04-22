---
title: material_surface_integrity_rule
doc_type: process_rule
circuit: c2
---

# Material Surface Integrity Rule

## Purpose

Preserve native encounter identity in frontend structure.

## Rule

Frontend must respect the native render distinctions seated in Measures.

This includes:
- material_family
- surface_type
- encounter_type
- reveal role

## Not Allowed

- flattening all native surfaces into generic app widgets
- treating chamberplate, passage, phase_map, and threshold as equivalent containers
- overriding material tone with generic UI patterns

## Correction

Render logic must preserve native distinctions instead of abstracting them away.

## Result

Encounter remains native rather than drifting into ordinary app form.
