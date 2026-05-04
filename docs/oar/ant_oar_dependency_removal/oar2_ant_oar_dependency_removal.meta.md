---
document_type: oar2
title: OAR2 ant_oar Dependency Removal
version: v1
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: ant_oar_dependency_removal_v1

OBSERVED
public.ant_oar_log is rejected drift.
Direct removal was blocked because dependent views exist:
- v_envelope_bundle_by_envkey_v1
- v_ant_intake_queue_v1
- v_ant_passage_readiness_v1

Operator confirms these ANT-dependent views are unused drift.
The envelope bundle view may be redefined later under conversion architecture if needed, but this ANT-bound version is not approved.

ALIGNED
- system_oar_log is the approved OAR Log surface.
- ant_oar_log is not approved.
- ANT-dependent views are drift.
- No CASCADE.
- Drop only explicitly listed views and table.
- No landing work.
- No slugs.

ROUTED
1. Confirm these views exist:
   - public.v_envelope_bundle_by_envkey_v1
   - public.v_ant_intake_queue_v1
   - public.v_ant_passage_readiness_v1

2. Drop exactly these views:
   - public.v_envelope_bundle_by_envkey_v1
   - public.v_ant_intake_queue_v1
   - public.v_ant_passage_readiness_v1

3. Confirm public.ant_oar_log exists and row count = 0.

4. Drop public.ant_oar_log without CASCADE.

5. Verify:
   - listed views no longer exist
   - public.ant_oar_log no longer exists
   - public.system_oar_log remains intact

6. Write OAR1 closeout beside this OAR2.

CODY ROLE
Cody is executor only.

May:
- drop the three explicitly listed views
- drop ant_oar_log after views are removed
- verify removal
- write OAR1 closeout

May NOT:
- use CASCADE
- drop any unlisted object
- modify system_oar_log
- introduce slugs
- proceed to landing work
- act from thread instructions

VALIDATION
- three listed views removed
- ant_oar_log removed
- system_oar_log intact
- no cascade used
- OAR1 closeout written
