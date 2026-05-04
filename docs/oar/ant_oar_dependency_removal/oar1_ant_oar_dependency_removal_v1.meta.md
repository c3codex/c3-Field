---
document_type: oar1
title: OAR1 ant_oar Dependency Removal
version: v1
status: executed
system: measures_registry
operator: op044
---

OAR1: oar1_ant_oar_dependency_removal_v1

OBJECTIVE
Remove explicitly approved ANT drift dependencies and then remove empty rejected drift table `public.ant_oar_log`.

ACTION
Dropped exactly the three authorized drift views:
- `public.v_envelope_bundle_by_envkey_v1`
- `public.v_ant_intake_queue_v1`
- `public.v_ant_passage_readiness_v1`

Confirmed `public.ant_oar_log` existed and had row count `0`, then dropped `public.ant_oar_log` without `CASCADE`.

RESULT
The three listed drift views were removed. `public.ant_oar_log` was removed. `public.system_oar_log` remains intact.

VALIDATION
```json
{
  "views_removed": [
    "v_envelope_bundle_by_envkey_v1",
    "v_ant_intake_queue_v1",
    "v_ant_passage_readiness_v1"
  ],
  "ant_oar_log_existed_before_removal": true,
  "ant_oar_log_row_count_before_removal": 0,
  "ant_oar_log_removed": true,
  "system_oar_log_remains_intact": true,
  "cascade_used": false
}
```

SOURCE
docs/oar/ant_oar_dependency_removal/oar2_ant_oar_dependency_removal.meta.md
