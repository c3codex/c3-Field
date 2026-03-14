# Measures of Inanna — Gate Completion & CoherentAI Test Readiness

Status: Final stretch before ME-level CoherentAI validation.

The goal of this phase is to complete the Obsidian Gates as canonical encounter units rendered from Supabase state. Once this layer is stable, the MEs can be used for the first CoherentAI coherence test.

---

# 1. DONE / PARTIALLY COMPLETE

These systems already exist and only require alignment.

## Core Exhibition Framework
- Measures pillar structure exists
- React routing wired
- Encounter stage implemented
- Gate components present
- Asset bucket created (`Measures-open`)
- Initial gate navigation helpers exist

## Canon Architecture
- Canon / registry model defined
- Artifact + concept separation established
- Storage buckets structured
- Supabase database in use

## Media Assets
- Gate art completed
- Animations rendered
- Plate imagery available
- Asset URLs accessible from bucket

## Encounter System
- `useMeasuresEncounter` hook implemented
- Encounter stages defined
- Exhibition shell component present

---

# 2. NEEDS DONE — GATE SYSTEM COMPLETION

These tasks complete the **Obsidian Gate layer**.

---

## A. Canonical Gate Registry

Create a single registry defining the gates.

Fields should include:

gate_slug
gate_number
title
encounter_type
previous_gate
next_gate
release_dependency
pillar = "measures"
family = "obsidian"


Example:


gate_0
gate_1_crown_removed
gate_2
gate_3
gate_4
gate_5
gate_6
gate_7


This replaces scattered ordering logic.

---

## B. Move Gate Texts to Canon Records

Remove inline plaque text from components.

Create records for:


gate_slug
plate_title
plaque_text
passage_text
epigraph_text
continue_label
sealed_text


Components should read from Supabase.

---

## C. Canonical Media Mapping

Each gate must resolve its assets from media records.


gate_slug
hero_image
hero_video
plate_image
thumbnail
audio_track


All URLs should resolve to Supabase storage.

---

## D. Gate Renderer Refactor

Ensure renderer only receives `gateSlug`.

Renderer should load:


useMeasuresEncounter(gateSlug)
useMeasuresGatePlate(gateSlug)
useGateNavigation(gateSlug)
useReleaseState(gateSlug)


Renderer must not contain gate-specific conditionals.

---

## E. Sealed / Released Gate Logic

Gate availability must come from DB state.

If gate not released:

- display sealed plate
- show connect request prompt
- prevent navigation forward

This ensures:


DB = authority
site = renderer
CoherentAI = observer


---

## F. Navigation from Registry

Remove hardcoded navigation.

Next / previous gates should come from:


gate_registry


---

## G. Component Split (optional but recommended)

Current gate component is large.

Split into:


GateHero.tsx
GateAntechamber.tsx
GatePlate.tsx
GatePassage.tsx
GateSealedState.tsx


This prevents cascade failures.

---

# 3. BLOCKERS TO CHECK

Before running CoherentAI tests verify:

- Supabase tables accessible
- storage bucket public access
- route slugs match gate registry
- no missing asset URLs
- plaque text loading correctly
- continue navigation functional

---

# 4. COHERENTAI TEST PREPARATION

After gates are complete.

Select **1 ME artifact** for first system test.

The ME must have canonical records:


me_slug
title
description
governance_function
media_urls
release_state
dependencies
pillar


---

# 5. COHERENTAI VALIDATION TEST

Test question for system:

> Can CoherentAI read the canonical state of one ME and return the same interpretation as the site renderer?

Validation includes:

- correct title
- correct media
- correct function
- correct dependencies
- correct release state

If these match site render output → system coherence confirmed.

---

# 6. FINAL DEFINITION OF "GATES COMPLETE"

The gates are considered finished when:

- every gate renders from canonical data
- no inline text remains in components
- navigation is registry driven
- sealed gates behave correctly
- media loads from canonical storage
- renderer has zero gate-specific logic

At that point:


Measures = structurally complete


and the MEs can be used for **CoherentAI reasoning validation**.

---

# 7. CURRENT PROJECT STATUS

Realistically:


Gates: ~80–90% complete
Infrastructure: stable
Remaining work: structural cleanup


Once this checklist is finished, the **Measures pillar becomes the first fully coherent installation in c3 Field.**

If you want, next I can also give you a very small but powerful improvement that will make the Gates much harder to break in the future.

It’s a single gate_manifest.ts file that becomes the authoritative spine for the entire gate system.

That one change alone will probably eliminate half the bugs you've been chasing.
