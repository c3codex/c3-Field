---
document_type: oar2
title: OAR2 landing_design_seeding
version: v1
status: ready_for_cody
system: measures_registry
---

OAR2: landing_design_seeding_v1

OBSERVED
Measures Registry public page is currently rendering diagnostic state instead of a conversion-ready landing.

Landing requires:
- header
- hero claim
- binary path plaques
- routed actions (explore_system, reserve_seat)

Media is partially seated.
Landing encounters are not fully defined or rendered.

ALIGNED
- Codex (DB) is authority
- All copy, media, and actions must be DB-seated
- No hardcoded text or media paths
- No slugs
- No public diagnostics
- Renderer must resolve from registry_key, encounter_key, media_role

ROUTED
1. Create/seed landing encounters:
- landing_intro_video
- landing_path_choice

2. Seed hero text:
Title:
AI isn’t broken.
Systems are.

Subtext:
Most AI failures aren’t intelligence problems.
They’re system failures.

3. Seed path plaques:
LEFT:
UNDERSTAND FAILURE
Why AI integrations break inside ungoverned systems.
Action: explore_system

RIGHT:
BUILD COHERENCE
How to structure systems that actually resolve.
Action: reserve_seat

4. Render header:
- registry_mark (media_role)
- Measures Registry (title)
- About (action)
- Contact (action)

5. Render flow:
- intro video loads first (hero_video)
- on completion → landing_path_choice
- path_choice uses path_choice_background

6. Wire actions:
- reserve_seat → submit_src_intake_request
- explore_system → orientation placeholder

7. Remove public diagnostics:
- Codex Sources
- OAR2 Route
- Integrity Alignment
- Phase Map
- Antechamber

CODY ROLE
Cody is executor only.

May:
- implement DB-driven rendering
- execute SQL contracts
- wire media and actions
- report missing records

May NOT:
- invent data
- hardcode media
- introduce slugs
- bypass RPC
- expose diagnostics publicly
- change system contracts

VALIDATION
- page loads without diagnostic panels
- header renders with mark + nav
- hero text renders from DB
- intro video plays and transitions
- path plaques render correctly
- Reserve Your Seat opens SRC intake
- Explore System routes without error
- media loads from measures_media_map
- no console errors
