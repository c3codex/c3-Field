---
document_type: oar1
title: OAR1 ant_oar_log Removal
version: v1
status: blocked
system: measures_registry
operator: op044
---

OAR1: oar1_ant_oar_log_removal_v1

OBJECTIVE
Remove rejected drift table `public.ant_oar_log` after confirming it is empty.

ACTION
Confirmed `public.ant_oar_log` exists and has row count `0`. Attempted removal without `CASCADE` under the authority of `oar2_ant_oar_log_removal.meta.md`.

RESULT
Removal blocked by live database dependencies. `public.ant_oar_log` was not dropped. `public.system_oar_log` remains intact.

Postgres dependency error:
```text
cannot drop table ant_oar_log because other objects depend on it
view v_envelope_bundle_by_envkey_v1 depends on table ant_oar_log
view v_ant_intake_queue_v1 depends on table ant_oar_log
view v_ant_passage_readiness_v1 depends on table ant_oar_log
Use DROP ... CASCADE to drop the dependent objects too.
```

No `CASCADE` was used because this OAR2 only authorized dropping `public.ant_oar_log`, not dependent views.

VALIDATION
```json
{
  "ant_oar_log_existed_before_removal": true,
  "ant_oar_log_row_count_before_removal": 0,
  "ant_oar_log_removed": false,
  "blocked_by_dependent_views": [
    "v_envelope_bundle_by_envkey_v1",
    "v_ant_intake_queue_v1",
    "v_ant_passage_readiness_v1"
  ],
  "system_oar_log_remains_intact": true,
  "cascade_used": false
}
```

SOURCE
docs/oar/ant_oar_log_removal/oar2_ant_oar_log_removal.meta.md
