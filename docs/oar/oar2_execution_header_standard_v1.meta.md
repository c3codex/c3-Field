---
document_type: process_standard
title: OAR2 Execution Header Standard
version: v1
status: proposed
process_family: oar
---

# OAR2 Execution Header Standard

## Purpose

This standard makes OAR2 files more directly executable by Codex and other operators.

The existing OAR structure already carries intent well:

- Observed
- Aligned
- Routed
- Validation
- Close

The improvement is to add a compact execution header that states scope, canonical keys, deployment boundary, fallback policy, and prohibited touch zones before implementation begins.

This reduces ambiguity, prevents alias drift, and protects DB-driven authority.

## Recommended Header

Use this block in OAR2 frontmatter whenever possible:

```yaml
execution_type:
  - frontend_runtime
  - db_seating
canonical_keys:
  surface: c3_field
  encounter_key: c3_field
  registry_key: c3_field
  media_roles:
    - c3_field_video
  action_keys:
    - explore_system
    - reserve_seat
deploy: requires_confirmation
fallback_policy: report_only_no_invention
do_not_touch:
  - measures_of_inanna
  - seat_capture_flow
  - production_env_vars
validation:
  requires_db_connection: true
  requires_build: true
  requires_deploy: false
```

## Field Definitions

### execution_type

Declares what kind of work the OAR authorizes.

Recommended values:

- `frontend_runtime`
- `visual_only`
- `db_seating`
- `schema_change`
- `content_update`
- `media_map`
- `routing_update`
- `diagnostic_only`
- `deploy_only`
- `process_update`

This tells the operator whether to patch application code, write a seating script, run Supabase validation, avoid DB entirely, or only deploy existing work.

### canonical_keys

Declares the exact keys the operator must use.

Use this to prevent alias drift between conceptual surface names and implementation keys.

Examples:

```yaml
canonical_keys:
  surface: landing_path_choice
  encounter_key: landing_path_choice
  media_roles:
    - hero_video
    - path_choice_background
  action_keys:
    - explore_system
    - reserve_seat
```

If an OAR uses a conceptual phrase such as `landing_path_surface`, this block should clarify the implementation key, for example:

```yaml
canonical_keys:
  conceptual_surface: landing_path_surface
  implementation_surface: landing_path_choice
```

### deploy

Declares whether deployment is authorized.

Recommended values:

- `requires_confirmation`
- `immediate`
- `do_not_deploy`

Default should be `requires_confirmation` unless explicitly stated otherwise.

### fallback_policy

Declares what to do when expected DB, media, or routing state is missing.

Recommended values:

- `report_only_no_invention`
- `block_render_report_missing`
- `diagnostic_only`
- `use_registered_fallback_only`

For registry-governed systems, default should be:

```yaml
fallback_policy: report_only_no_invention
```

This means:

- do not hardcode replacement copy
- do not invent media paths
- do not invent action behavior
- report exact missing records or storage responses

### do_not_touch

Lists surfaces, flows, environments, or systems outside the authorized scope.

Examples:

```yaml
do_not_touch:
  - measures_of_inanna
  - seat_capture_flow
  - notification_dispatch
  - production_env_vars
```

This protects adjacent systems when an OAR touches shared runtime files.

### validation

Declares the validation obligations before OAR1 closeout.

Recommended fields:

```yaml
validation:
  requires_db_connection: true
  requires_build: true
  requires_storage_check: true
  requires_deploy: false
  query: |
    select encounter_key, metadata
    from public.measures_encounter_def
    where encounter_key = 'c3_field';
```

When DB state matters, include either:

- exact SQL query
- expected JSON shape
- required row count
- required media role and storage path

## Optional Sections

### DB MUST SEAT

Use when an OAR requires database state.

Example:

```text
DB MUST SEAT:
- encounter_key: c3_field
- media_role: c3_field_video
- metadata.field_expressions
```

### FRONTEND MAY RENDER

Use when rendering is conditional on DB state.

Example:

```text
FRONTEND MAY RENDER:
- c3_field_video only if media map resolves
- field_expressions only if DB records exist
- no fallback content
```

### IF MISSING

Use when missing records should not be silently replaced.

Example:

```text
IF MISSING:
- report exact missing encounter_key
- report exact media_role
- report resolved Supabase public URL when available
- do not invent frontend replacement
```

## Operator Behavior

When an OAR2 includes this header, Codex should:

1. Read the execution header before implementation.
2. Treat canonical keys as binding.
3. Refuse alias invention unless the OAR explicitly authorizes it.
4. Use DB seating scripts for DB-authoritative content.
5. Keep frontend renderers DB-driven.
6. Run required validation before OAR1.
7. Write OAR1 closeout with:
   - executed files
   - DB validation result
   - build result
   - deploy status
   - known residual risk
8. Deploy only if the OAR or user explicitly authorizes deploy.

## Minimal Template

```yaml
---
document_type: oar2
title: OAR2 — Short Title
version: v1
status: ready_for_cody
system: measures_registry
execution_type:
  - frontend_runtime
canonical_keys:
  surface: landing_path_choice
  encounter_key: landing_path_choice
deploy: requires_confirmation
fallback_policy: report_only_no_invention
do_not_touch:
  - measures_of_inanna
validation:
  requires_db_connection: false
  requires_build: true
---
```

## Close

This header does not replace OAR judgment.

It sharpens execution.

The purpose is not more ceremony.
The purpose is cleaner authority, fewer assumptions, and faster closeout.
