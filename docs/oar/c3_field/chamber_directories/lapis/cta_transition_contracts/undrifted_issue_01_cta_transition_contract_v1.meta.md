---
document_type: chamber_contract
authority_level: working
document_scope: undrifted_issue_01_cta_transition
title: unDrifted Issue 01 CTA Transition Contract v1
status: seated_not_rendered
version: v1
operator: op044
system: measures_registry
contract_key: undrifted_issue_01_cta_transition_contract_v1
route_path: /undrifted
public_facing: true
parent_directory: c3_field_chamber_directory_lapis_v1
registration_state: seated_not_rendered
source_oar2: docs/oar/c3_field/chamber_directories/lapis/oar2_seat_undrifted_issue_01_landing_contracts_and_chamber_media_map_v1.meta.md
tags:
  - chamber-contract
  - cta-transition
  - undrifted
  - issue-01
---

# unDrifted Issue 01 CTA Transition Contract v1

## Primary Top CTA

label:

    Assess the Environment

from:

    /undrifted

to:

    /ai-operations-assessment

relation:

    publication_to_assessment_landing

## Featured CTA

label:

    Assess the Environment

from:

    /undrifted featured block

to:

    /ai-operations-assessment

relation:

    featured_assessment_to_assessment_landing

## Dispatch CTA

label:

    Read Dispatch

from:

    dispatch card

to:

    overlay reader

relation:

    issue_card_to_overlay_reader

## Leadership CTA

label:

    Begin the conversation

from:

    leadership invitation

to:

    governed contact / leadership conversation route

relation:

    publication_to_leadership_invitation

standing:

    route_target_pending_verification

runtime_resolution:

    pending_runtime_resolution

## Boundary

    no route into payment
    no route into c3 Key
    no route into SRC
    no route into Marble
    no direct conversion route
    no certification route

If leadership target is missing:

    document pending target
    do not invent route
    do not hardcode mailto unless already seated
    mark as pending_runtime_resolution
