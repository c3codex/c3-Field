# Intel Recovery Packet Template

## Packet Metadata

packet_key:

version: v1

status: capture_requested | capture_in_progress | packet_ready_for_chazz | chazz_review_required | incorporation_approved | correction_required | rejected_out_of_scope | closed_logged

operator:

cody_executor:

chazz_validator:

created_at:

updated_at:

## Source Context

source_thread_or_session:

source_date:

source_location_or_reference:

related_oar2:

related_oar1:

related_process_instance:

## Operator Signal

What did the Operator ask to recover?

```txt

```

Why is this recovery needed?

```txt

```

## Cody Capture Summary

What did Cody find?

```txt

```

What remains uncertain?

```txt

```

## Candidate Recovered Intel

List recovered claims, instructions, decisions, or patterns.

```txt
1.
2.
3.
```

## Affected Standing

Potentially affected surfaces:

- [ ] role standing
- [ ] infrastructure standing
- [ ] process standing
- [ ] validation standing
- [ ] deploy standing
- [ ] correction lineage
- [ ] seeded reference
- [ ] runtime implementation
- [ ] documentation/process

Affected paths:

```txt

```

## Authority Risk

Could this intel alter authority, scope, deployment, DB state, or validation standing?

```txt

```

Risk level:

- [ ] low
- [ ] moderate
- [ ] high
- [ ] hold until Operator decision

## Cody Recommended Classification

Cody may recommend one, but may not decide final standing.

- [ ] incorporate_as_seeded_reference
- [ ] route_to_correction_oar2
- [ ] hold_pending_operator
- [ ] hold_pending_source
- [ ] reject_out_of_scope
- [ ] archive_as_non_governing_context

Cody rationale:

```txt

```

## Chazz Classification

Final Chazz classification:

- [ ] incorporate_as_seeded_reference
- [ ] route_to_correction_oar2
- [ ] hold_pending_operator
- [ ] hold_pending_source
- [ ] reject_out_of_scope
- [ ] archive_as_non_governing_context

Chazz rationale:

```txt

```

## Required Decision

Does this require Operator decision?

- [ ] yes
- [ ] no

Decision needed:

```txt

```

## Incorporation Route

If approved, how does this become governing?

```txt

```

Required OAR2:

```txt

```

Seeded reference path:

```txt

```

## Correction Route

If correction is required:

source_oar2:

partial_oar1:

validation_finding:

correction_oar2:

correction_scope:

## Rejection Reason

If rejected or archived as non-governing context:

```txt

```

May be reconsidered?

- [ ] yes
- [ ] no

Condition for reconsideration:

```txt

```

## Transition Log

transition_event_key:

from_status:

to_status:

actor:

evidence_reference:

notes:

## Closeout Standing

closeout_status:

- [ ] closed_logged
- [ ] held_pending_operator
- [ ] held_pending_source
- [ ] correction_required
- [ ] rejected_out_of_scope

Does recovered intel govern implementation now?

- [ ] yes
- [ ] no

If yes, cite seated authority:

```txt

```

If no, state boundary:

```txt

```
