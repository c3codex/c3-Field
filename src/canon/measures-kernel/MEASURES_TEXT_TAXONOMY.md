---
title: Measures Text Taxonomy
slug: measures-text-taxonomy
document_type: architecture
document_scope: pillar
document_status: active
authority_level: structural
canonical: true
event_required: false
related_pillar: measures
related_system: coherentai
source_origin: measures installation
last_reviewed: 2026-03-14
version: 1.0
tags:
  - measures
  - text
  - taxonomy
  - encounter
  - plaque
  - epigraph
  - passage
source_bucket: codex-vault
source_folder: measures-kernel
summary: Defines the text roles used within the Measures installation. Text roles are separated so that threshold, passage, and encounter layers do not conflict.
---
# Measures Text Taxonomy

Defines the text roles used within the Measures installation.

Text roles are separated so that threshold, passage, and encounter layers
do not conflict.

---

# Epigraph

Encounter: Epigraph Encounter

Purpose  
Threshold opening for the Measures descent.

Behavior
- displayed after animation → still transition
- plaque style text

Example role
Opening invocation.

---

# Plaque

Encounter: Gateplate Encounter

Purpose  
Primary text displayed on gateplate.

Behavior
- appears after delay on still media
- associated with the specific gateplate

Example role
Formal plate text.

---

# Context

Encounter: Gateplate Encounter

Purpose  
Expanded explanation or supporting context.

Behavior
- optional
- not required for plate rendering

---

# Aspect

Encounter: Gateplate Encounter

Purpose  
Cuneiform or symbolic aspect reference.

Behavior
- supports interpretive layer
- may appear alongside plate or context

---

# Passage Text

Encounter: Passage

Purpose  
Support transitional encounters.

Behavior
- minimal
- atmospheric or directional

Often paired with passage animation.

---

# Connect Invite Text

Encounter: Connect Invite

Purpose  
Displayed when a sealed gateplate is encountered.

Behavior
- invites user to Connect
- maintains c3 alignment

Must not block navigation.

---

# Text Role Law

Text roles must not collapse across encounter types.

Epigraph text must not be used as plaque text.

Passage text must not replace plaque text.

Plaque text must remain gate-specific.

---

# Rendering Rule

Text enriches the encounter.

Text does not control encounter availability.

Media and navigation must function even if text fails to load.