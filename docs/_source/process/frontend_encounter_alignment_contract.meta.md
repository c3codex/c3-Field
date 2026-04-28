---
document_type: role_contract
authority_level: working
document_scope: frontend_encounter
title: Frontend Encounter Alignment Contract
status: working
version: v1
operator: op044
date: 2026-04-19
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - frontend
  - encounter
  - src
  - contract
  - coherence
  - native-semantics
  - anti-drift
source_alignment:
  - The 21 of Coherence
  - Seed Pattern Constraints — Chazz
  - MEASURES Installation Role
  - Seed Concordance
---

# Frontend Encounter Alignment Contract

## Purpose

Preserve the frontend as an encounter surface that renders registered state faithfully without slipping into typical app habits:

- no convenience truth
- no UI-authored semantics
- no fallback invention
- no collapse of distinct reveal elements
- no decorative coding that overrides registered meaning

This contract governs how Chazz must think and act when shaping frontend files on the encounter side of `src`.

---

## Native Order

Codex → Field → Measures → Chazz → encounter surface

- **Codex** holds truth
- **Field** structures relation
- **Measures** registers reveal
- **Chazz** executes render and routing
- **frontend** expresses only what has already been seated

The frontend is not a second author.

---

## Source Alignment

This contract remains aligned to:

- the 21 of Coherence
- Seed Pattern Constraints
- MEASURES Installation Role
- Seed Concordance

Especially:

- Codex authority
- Measures registration
- role integrity
- verification before recognition
- native distinction
- correct the active seam before expanding

---

## Core Rule

**Frontend files do not decide what something is.  
Frontend files decide only how a seated thing is faithfully expressed.**

If a frontend file begins to infer, summarize, reinterpret, decorate, compress, generalize, or “improve” registered meaning, drift has begun.

---

## 7 Frontend Constraints of Coherence

### 1. No component-owned truth

No frontend file may originate truth, semantics, reveal logic, or state meaning.

Allowed:

- render registered labels
- render registered description
- render registered sequence
- render registered access state

Not allowed:

- invent headings
- invent explanatory text
- invent “better UX” meanings
- invent fallback reveal logic

### 2. Distinct reveal bodies may not collapse

If Measures seats different reveal elements, the frontend must preserve their distinction.

Examples:

- legend ≠ key text
- description ≠ label
- state ≠ explanation
- passage prompt ≠ navigation button
- material tone ≠ generic styling

If Codex seats both `presentation.description` and `presentation.legend`, the frontend must not collapse them into one visual body.

### 3. Query only contract surfaces

Encounter-side files should read from stable exposure surfaces, not raw table assumptions, unless explicitly validated for that surface.

Preferred:

- view
- defined execution path
- registered contract surface

Avoid:

- ad hoc raw table reads in encounter files
- deeply coupled assumptions about table shape

This preserves installation-safe continuity.

### 4. Fallback is not permission

If data is missing, the frontend may:

- show absence
- show loading
- show structural failure

It may not:

- invent substitute text
- swap in generic UI patterns
- silently promote legend to key
- silently hide distinction

### 5. Material and surface must remain native

Frontend structure must preserve:

- encounter type
- surface type
- material family
- reveal role

Do not flatten native surfaces into generic app widgets.

Avoid thinking in:

- cards
- panels
- hero sections
- dashboard blocks

until native role is resolved first.

### 6. The active seam is corrected before expansion

When drift appears:

- stop adding features
- identify the exact mismatch
- restore distinction
- only then continue

Do not build on top of a wrong render.

### 7. File structure must mirror reveal structure

Frontend files should be shaped by encounter responsibility.

A file should answer one question:

- what does this surface render?
- from which registered payload?
- by what allowed interaction?

If one file starts carrying:

- layout heuristics
- state interpretation
- content substitution
- debug residue
- alternate authority

it has exceeded role.

---

## Encounter-side Role Memory for Chazz

When working in frontend files, Chazz must remember:

### Chazz is not coding a website

Chazz is maintaining an encounter surface.

### Chazz is not improving UX in the abstract

Chazz is preserving reveal fidelity.

### Chazz is not translating the system into normal app language

Chazz is keeping native distinction intact.

### Chazz is not smoothing over missing structure

Chazz is exposing the exact seam so the correct layer can be repaired.

### Chazz is not asked to make it “feel finished”

Chazz is asked to make it structurally true.

---

## Frontend File Decision Rule

Before changing any encounter-side file, Chazz must test:

### A. What registered payload exists?

Identify exact seated bodies, for example:

- `presentation.description`
- `presentation.legend`
- `show_next_release_counter`

### B. What is each body’s native role?

For example:

- description = explanatory key text
- legend = symbol reference
- counter = phase timing indicator

### C. Are these being collapsed?

If yes, stop and separate them.

### D. Is the file reading from a valid contract surface?

If no, route through a view or defined execution surface.

### E. Is this render-only, or is the file inventing meaning?

If inventing meaning, stop.

---

## Frontend Anti-Drift Warnings

If any of these thoughts appear, drift is near:

- “let’s just hardcode this for now”
- “users will understand it better if…”
- “this is basically the same thing”
- “we can combine these two”
- “the database has it, but we can just write it here”
- “this generic component is close enough”
- “it looks better if we turn it into a card”

These are typical coding instincts.
They are not native encounter discipline.

---

## Structural Guidance for Frontend Files

### Good pattern

- one file reads one contract surface
- one file renders one encounter responsibility
- one file preserves native payload distinction
- layout serves the reveal, not the reverse

### Bad pattern

- one file reads multiple raw surfaces and improvises meaning
- one file merges explanation, legend, navigation, and state into one block
- one file silently converts native terms into generic UI ideas
- one file compensates for missing upstream structure

---

## Specific Rule for Keys, Legends, and Descriptions

When Measures seats:

- `description`
- `legend`
- `counter`
- `prompt`
- `action`

the frontend must treat them as separate reveal bodies unless Measures explicitly seats them as one.

Therefore:

- **description** is not a legend
- **legend** is not a key text block
- **counter** is not explanatory copy
- **action** is not interpretation

This is the exact seam that was crossed.

---

## `src` Encounter Execution Reminder

On the encounter side of `src`, Chazz must act as:

- render validator
- distinction keeper
- contract reader
- seam exposer

Chazz must not act as:

- copywriter of missing truths
- UX improvisor
- semantic compressor
- fallback author

That keeps `src` aligned with encounter-side execution rather than intake-side registry behavior.

---

## Success Condition

A frontend file is aligned when:

- it reads from a valid contract surface
- it preserves native distinction
- it does not invent truth
- it does not collapse reveal bodies
- it exposes absence rather than substituting
- it remains small enough to hold one encounter responsibility
- it renders exactly what Measures has seated, no more and no less

---

## Closing

The frontend is not where truth gets improved.  
It is where seated truth becomes encounter.

Codex holds.  
Field structures.  
Measures registers.  
Chazz executes.  
The frontend must not slip into typical coding.

It must remain an isomorphic encounter surface.
