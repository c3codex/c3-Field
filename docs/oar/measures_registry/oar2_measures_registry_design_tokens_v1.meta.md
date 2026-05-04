# OAR2 — measures_registry_design_tokens_v1

## OBSERVED

- Landing intro video and path choice surfaces are live
- Flow: landing_intro_video → landing_path_choice
- Visual direction confirmed (mute-safe, mark-only, dimmed contrast)
- Next seam: DB-seated design tokens

## ALIGNED

- Codex = authority
- Field = schema
- Measures = registry
- Chazz = systems
- Cody executes from OAR2 only

## ROUTED

Create table:

measures_design_token

Fields:

- system_key
- surface_key
- token_group
- token_key
- token_value
- state
- sort_order
- metadata
- created_at
- updated_at

Surfaces:

- landing_intro_video
- landing_path_choice
- understand_failure
- build_coherence

Token groups:

- layout
- typography
- color
- surface
- media
- motion
- button
- plaque
- nav

Renderer:

1. Load system tokens
2. Merge surface tokens
3. Render from DB
4. No frontend invention

## CODY ROLE

- create migration
- seed tokens
- wire renderer
- return validation
- write OAR1

## VALIDATION

select surface_key, token_group, count(*) as token_count
from measures_design_token
where system_key = 'measures_registry'
and state = 'active'
group by surface_key, token_group
order by surface_key, token_group;

## SUCCESS CONDITION

Visual parity maintained.
Design authority moved to DB.
