---
document_type: chamber_contract
authority_level: working
document_scope: undrifted_issue_01_landing_style
title: unDrifted Issue 01 Landing Style Contract v1
status: seated_not_rendered
version: v1
operator: op044
system: measures_registry
contract_key: undrifted_issue_01_landing_style_contract_v1
route_path: /undrifted
layout_type: institutional_digital_magazine_front_page
page_role: publication_issue_cover
public_facing: true
reusable_pattern: true
text_embedded_in_media: false
parent_directory: c3_field_chamber_directory_lapis_v1
registration_state: seated_not_rendered
source_oar2: docs/oar/c3_field/chamber_directories/lapis/oar2_seat_undrifted_issue_01_landing_contracts_and_chamber_media_map_v1.meta.md
tags:
  - chamber-contract
  - landing-page-design
  - undrifted
  - issue-01
  - magazine-layout
---

# unDrifted Issue 01 Landing Style Contract v1

## Style Standing

layout_type:

    institutional_digital_magazine_front_page

page_role:

    publication_issue_cover

text_embedded_in_media:

    false

## Visual System

Background:

    obsidian / graphite editorial field
    subtle paper grain
    restrained blue signal accents

Typography:

    large publication masthead
    editorial headline scale
    clean body copy
    uppercase tracked metadata

Cards:

    magazine dispatch cards
    image-led
    dark border
    spacious
    3 dispatches max in first issue row

## Required Brand Mark

    registry_mark

Do not use:

    MR square badge
    generic magazine logo
    public Lapis language
    SaaS blog layout
    dashboard layout
    lighthouse media
    robot stock imagery
    generic AI grid

## Hero / Cover Structure

Left:

    Issue 01 · June 2026
    unDrifted
    Measures Registry Launch
    A new standard for AI operations.

Right:

    hero motion-to-still visual if registered
    still fallback if motion unavailable
    resolved through governed chamber media map
    no hardcoded bucket URL

## Featured Section

Feature:

    Assess the Environment

Media:

    ai_isnt_broken_landing

Treatment:

    feature cover only
    tighter crop than assessment landing hero
    must not compete with main issue hero

## Dispatch Section

Structural Drift:

    cover: structural_drift

Agents with Keys:

    cover: agents_with_keys

Agents of Chaos:

    cover: agents_of_chaos

## Glyph Usage

Glyphs may be used as:

    small editorial accents
    section dividers
    Detect / Measure / Correct / Govern markers
    article metadata accents

Glyphs may not:

    replace registry_mark
    act as public authority
    clutter the issue cover
    become navigation authority

## Responsive Rules

Desktop:

    hero uses two-column issue-cover layout
    right-side motion-to-still remains visible
    dispatch cards stay clean and spacious

Mobile:

    masthead first
    hero media below or behind with dark veil
    featured card follows hero
    dispatch cards stack vertically
    no horizontal overflow

## Implementation Boundary

    real HTML text
    real buttons
    real cards
    real overlay reader later
    media resolved from governed chamber media map
    no raw Supabase URL hardcoding
    no text baked into media
