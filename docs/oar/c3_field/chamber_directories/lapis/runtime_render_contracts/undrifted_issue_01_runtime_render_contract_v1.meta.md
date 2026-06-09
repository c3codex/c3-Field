---
document_type: chamber_contract
authority_level: working
document_scope: undrifted_issue_01_runtime_render
title: unDrifted Issue 01 Runtime Render Contract v1
status: seated_not_rendered
version: v1
operator: op044
system: measures_registry
contract_key: undrifted_issue_01_runtime_render_contract_v1
route_path: /undrifted
route_role: public_publication_issue_cover
implementation_state: pending_later_oar2
public_facing: true
parent_directory: c3_field_chamber_directory_lapis_v1
registration_state: seated_not_rendered
source_oar2: docs/oar/c3_field/chamber_directories/lapis/oar2_seat_undrifted_issue_01_landing_contracts_and_chamber_media_map_v1.meta.md
tags:
  - chamber-contract
  - runtime-render
  - undrifted
  - issue-01
---

# unDrifted Issue 01 Runtime Render Contract v1

## Runtime Standing

route_path:

    /undrifted

route_role:

    public_publication_issue_cover

implementation_state:

    pending_later_oar2

## Media Behavior

    all media resolves by governed chamber media map
    no raw Supabase URL hardcoding
    no /mnt/data references
    if media missing, render honest missing-media state

## Text Behavior

    text renders as HTML / governed copy
    no text baked into media

## Article Behavior

    dispatch cards open overlay reader
    overlay reader uses governed article contract
    no default off-page navigation

## Assessment CTA Behavior

    routes to /ai-operations-assessment
    does not bypass assessment landing
    does not bypass contact gate
    does not bypass assessment runtime
    does not bypass result gate

## Disallowed Runtime Behavior

    home fallback
    blog template fallback
    hardcoded article data
    hardcoded media URLs
    invisible click zones as primary navigation
    public Lapis language
    C1/C2/C3 public exposure
