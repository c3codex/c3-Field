---
document_type: oar1
title: OAR1 landing_design_seeding
version: v1
status: executed
system: measures_registry
operator: op044
---

OAR1: oar1_landing_design_seeding_v1

OBJECTIVE
Seat and render the Measures Registry public landing design from DB-owned encounter, action, and media records.

ACTION
Updated landing DB seating for `landing_intro_video` and `landing_path_choice`, including header, hero claim, binary path plaques, routed actions, and required media roles. Updated the frontend renderer to read public landing copy, actions, and media from Supabase records without public diagnostic panels.

RESULT
Verified:
- `landing_intro_video` and `landing_path_choice` are seated.
- Hero claim renders from DB: `AI isn't broken. Systems are.`
- Header title/actions render from DB.
- Path plaques render from DB.
- `reserve_seat` routes to SRC intake via `submit_src_intake_request`.
- `explore_system` routes to orientation placeholder.
- Media roles resolve through `measures_media_map`.
- Public diagnostics are not rendered.
- Registry build passes.

VALIDATION
```json
{
  "encounter_count": 2,
  "media_count": 4,
  "hero_video_status": 200,
  "hero_poster_status": 200,
  "path_choice_background_status": 200,
  "registry_mark_status": 200,
  "build_registry": "passed"
}
```

SOURCE
docs/oar/landing_design_seeding/oar2_landing_design_seeding.meta.md
