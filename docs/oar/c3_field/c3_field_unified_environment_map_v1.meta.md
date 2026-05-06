---
document_type: architecture_plan
title: c3 Field Unified Environment Map and Implementation Plan
version: v1
status: draft
system: c3_field
execution_type:
  - process_update
  - architecture_plan
canonical_keys:
  parent_environment: c3_field
  governance_layer: c3_dao
  public_encounter_layer: priceless_gallery
  exhibition: measures_of_inanna
  institutional_conversion_layer: measures_registry
  access_layer: acquire
deploy: do_not_deploy
fallback_policy: report_only_no_invention
---

# c3 Field Unified Environment Map and Implementation Plan

## Purpose

Define c3 Field as the shared coherence environment that holds the system backend, public encounter, institutional conversion, governance, and access/payment layers without collapsing their distinct identities.

This is not a generic multi-site homepage plan.

This is a field architecture:

- one coherence environment
- shared backend authority
- distinct public surfaces
- registry-governed conversion
- public encounter through exhibition
- web3 governance through c3 DAO
- access/payment through Acquire

## Core Architecture

```text
c3 Field
├─ System Backend + Governance
│  └─ c3 DAO
├─ Public Encounter Environment
│  └─ Priceless Gallery
│     └─ Measures of Inanna exhibition
├─ Institutional Conversion Environment
│  └─ Measures Registry
└─ Access + Payment Layer
   └─ Acquire
```

## Domain Map

```text
c3field.com
Primary working surface for the shared coherence environment.
Holds orientation, system map, routing, authority, and cross-surface access.

pricelessgallery.com
Public encounter entry surface.
Hosts public field encounters and gallery expressions.

measuresofinanna.com
Direct exhibition entry into the Measures of Inanna exhibition.
Functionally belongs under Priceless Gallery.

measuresregistry.com
Institutional conversion entry surface.
Routes serious actors into registry-governed participation and seat/access flows.

Acquire surface
Shared access/payment layer.
May resolve as acquire.c3field.com or c3field.com/acquire once routing is defined.

c3 DAO surface
Governance, contribution routing, recognition, and coordinated evolution layer.
May resolve through c3field.com until a dedicated governance domain/surface is seated.
```

## Functional Roles

### c3 Field

Role: shared coherence environment.

Function:

- introduces the field
- establishes authority
- routes visitors to the correct surface
- preserves distinct identity between systems
- manages shared coherence language
- points to Acquire when access/payment is required

Must not become:

- a generic homepage
- a marketing portal
- a portfolio index
- a collapsed brand umbrella

### Priceless Gallery

Role: public encounter environment.

Function:

- hosts public-facing encounter work
- allows people to experience the field before institutional conversion
- carries presence, archive, exhibition, and public meaning
- contains Measures of Inanna as an exhibition

Must not become:

- a sales funnel first
- a registry intake surface
- a governance dashboard

### Measures of Inanna

Role: exhibition inside Priceless Gallery.

Function:

- direct exhibition entry
- demonstrates structured progression and phase coherence
- remains public encounter, not institutional conversion
- can route to Acquire when access, patronage, or exhibition payment is required

Must not become:

- a peer institutional system to Measures Registry
- the backend model for all c3 Field surfaces
- a generic product funnel

### Measures Registry

Role: institutional conversion environment.

Function:

- receives serious actors
- supports seat reservation and access flows
- registers institutional intent
- governs participation through structured records
- routes payment/access through Acquire

Must not become:

- Priceless Gallery
- an exhibition surface
- a purely informational landing page

### c3 DAO

Role: web3 governance and backend authority layer.

Function:

- contribution routing
- recognition logic
- governance standing
- coordinated evolution
- institutional authority continuity
- backend relation between surfaces

Must not become:

- front-facing marketing copy only
- an unstructured community page
- a separate identity detached from c3 Field

### Acquire

Role: access, payment, and recognition gateway.

Function:

- replaces generic sales behavior
- provides payment access for Measures Registry
- provides payment/access paths for Priceless Gallery and Measures of Inanna
- supports reservations, patronage, acquisition, paid access, contribution, and recognition
- returns confirmed access state back to the originating surface

Must not become:

- a generic checkout button
- a disconnected payment page
- a sales funnel that overrides surface identity

## Relationship Model

```text
Visitor enters through any domain.

Domain identifies origin surface.

Origin surface establishes context:
- public encounter
- institutional conversion
- governance/contribution
- access/payment

If payment or access is required:
origin surface routes to Acquire.

Acquire processes access/payment.

Acquire returns state to origin surface and shared backend.

c3 DAO/governance layer records recognition, contribution, or standing when applicable.
```

## Shared Backend Requirements

The unified environment should eventually share:

- one process registry
- one system registry
- one media seating pattern
- one access/payment state model
- one capture/intent model
- one governance/contribution model
- one domain routing model
- one OAR execution process
- one authority policy for frontend rendering

Each public surface may keep separate styling and identity, but should not duplicate backend authority.

## Identity Boundary Rules

### Shared

All surfaces share:

- c3 Field coherence
- backend authority
- registry/governance process
- access/payment protocol
- OAR-controlled implementation

### Distinct

Each surface keeps distinct:

- purpose
- visual identity
- conversion mode
- public language
- route behavior
- access requirements

## Acquire Access Patterns

### Measures Registry Access

Possible access types:

- reserve seat
- foundation seat
- systems seat
- institutional access
- cohort access
- operator-reviewed participation

Payment/access result should produce:

- access record
- source surface
- offering key
- lifecycle state
- notification state if needed
- recognition/governance state if applicable

### Priceless Gallery Access

Possible access types:

- exhibition access
- patronage
- acquisition
- collector recognition
- archive access
- event/encounter access

Payment/access result should produce:

- access record
- exhibition or work reference
- origin surface
- recognition state if applicable
- contribution/governance reference if applicable

### Measures of Inanna Access

Possible access types:

- exhibition entry
- guided encounter access
- patron/acquire route
- archive or phase access if later defined

Payment/access result should return to:

- Measures of Inanna exhibition state
- Priceless Gallery public encounter layer

## Implementation Plan

### Phase 1 — Architecture Seating

Goal: establish c3 Field as the parent environment in documents and DB/process records.

Tasks:

- create OAR2 for unified environment architecture
- seat canonical system keys
- define domain-to-surface mapping
- define parent/child relationships
- define Acquire as access/payment layer, not sales
- define Measures of Inanna as Priceless Gallery exhibition

Validation:

- c3 Field parent key exists
- each child surface has canonical key
- no slug fields introduced
- no identity collapse between surfaces

### Phase 2 — Domain Routing Plan

Goal: define how each domain enters the shared environment.

Tasks:

- map `c3field.com` to primary c3 Field working surface
- map `measuresregistry.com` to Measures Registry conversion surface
- map `pricelessgallery.com` to Priceless Gallery encounter surface
- map `measuresofinanna.com` to Measures of Inanna exhibition surface
- define Acquire route location
- define governance route location

Validation:

- each domain has one canonical entry surface
- no domain routes to generic fallback
- direct domain entry preserves surface identity
- cross-routing occurs through registered actions only

### Phase 3 — Shared Registry Model

Goal: create one backend model for systems, surfaces, access, and governance references.

Tasks:

- audit existing tables and keys
- identify where Measures Registry tables can generalize safely
- define whether to create c3 Field parent tables or views
- define shared fields for origin surface, access type, offering, contribution, and recognition
- keep existing production flows stable while introducing parent model

Validation:

- no existing Measures Registry capture flow is broken
- no Inanna exhibition records are rewritten without OAR
- access records can identify source surface
- governance records can reference origin and purpose

### Phase 4 — Acquire Access Layer

Goal: replace sales behavior with registered access/payment flows.

Tasks:

- define Acquire surface role
- define access/payment state machine
- define integration requirements with payment provider
- define post-payment return behavior
- define access records for Registry and Gallery
- define recognition hooks for c3 DAO where applicable

Validation:

- Measures Registry can route to Acquire for paid access
- Priceless Gallery can route to Acquire for public encounter payment/acquisition
- payment does not erase source identity
- access result writes registered backend state
- no frontend-only payment truth

### Phase 5 — c3field.com Working Surface

Goal: implement c3field.com as the operating surface for shared coherence.

Tasks:

- design c3 Field primary entry surface
- include system map, not marketing index
- route to Priceless Gallery, Measures Registry, c3 DAO, and Acquire
- keep identity minimal and authoritative
- expose no diagnostic UI publicly
- read routes/content from DB where possible

Validation:

- c3field.com loads as parent environment
- routes are registered
- no hardcoded conversion truth
- no generic homepage behavior
- distinct surfaces remain distinct

### Phase 6 — Public Encounter Integration

Goal: seat Priceless Gallery as public encounter environment and Measures of Inanna as exhibition.

Tasks:

- define Priceless Gallery surface contract
- define Measures of Inanna exhibition relationship
- route Measures of Inanna direct domain into exhibition state
- define Acquire hooks only where access/payment is required
- preserve public encounter tone

Validation:

- Measures of Inanna is not treated as peer institutional system
- Priceless Gallery can host exhibition references
- public encounter remains distinct from institutional conversion

### Phase 7 — Governance Integration

Goal: define c3 DAO as governance and backend authority layer.

Tasks:

- define contribution routing
- define recognition records
- define governance standing
- connect Acquire outcomes to governance state where needed
- avoid exposing internal governance mechanics as marketing content

Validation:

- c3 DAO receives only appropriate records
- contribution/recognition has source context
- governance state is not invented by frontend

## Recommended Next OARs

1. `oar2_c3_field_unified_environment_architecture_v1`

Purpose:
seat c3 Field as parent environment and define canonical child systems.

2. `oar2_c3_field_domain_routing_v1`

Purpose:
define domain-to-surface routing for c3field, measuresregistry, pricelessgallery, and measuresofinanna.

3. `oar2_acquire_access_layer_architecture_v1`

Purpose:
define Acquire as shared payment/access protocol for Registry and Gallery.

4. `oar2_priceless_gallery_public_encounter_surface_v1`

Purpose:
seat Priceless Gallery as public encounter environment and define Measures of Inanna as exhibition child.

5. `oar2_c3_dao_governance_backend_layer_v1`

Purpose:
define governance, contribution, recognition, and coordinated evolution layer.

## Non-Negotiables

- No generic homepage collapse.
- No sales language replacing Acquire.
- No payment truth in frontend only.
- No hardcoded source identity where DB authority is required.
- No treating Measures of Inanna as a peer to Priceless Gallery.
- No treating Measures Registry as gallery/public encounter.
- No treating c3 DAO as marketing surface.
- No shared backend refactor without validation and rollback boundary.

## Close

c3 Field is the parent coherence environment.

Priceless Gallery is the public encounter layer.

Measures of Inanna is an exhibition inside Priceless Gallery.

Measures Registry is the institutional conversion layer.

c3 DAO is the web3 governance/backend layer.

Acquire is the access and payment protocol.

Unified backend.
Distinct public surfaces.
Shared coherence.
