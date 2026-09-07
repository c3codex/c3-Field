---
document_type: canopy_communication
authority_level: working
status: draft_pending_operator_delivery
process_scope: governed_multi_file_evidence_delivery
source_event: audit01_measures_of_inanna_reconciliation_packet
operator: op044
executor: claude
observation_time: 2026-07-15
---

# Canopy Communication — Multi-File Governed Packet Delivery State

**Standing: `draft_pending_operator_delivery`.** This record has not been transmitted to or received by Canopy. No claim is made that Canopy has seen this communication.

## Finding to communicate

A governed multi-file packet (e.g. an Audit reconciliation packet delivered as multiple chat attachments/turns) may arrive across multiple attachment turns without any explicit terminal delivery signal from the delivery surface itself. During the Audit 01 reconciliation review, this caused an intermediate review to observe fewer files than the governed set actually contained — not because any file was missing or unproduced, but because the packet was still being delivered when it was reviewed. The authoritative v2 closeout manifest (`expected: 18, found: 18, missing: 0, unexpected: 0`) confirms the full packet was, in fact, complete once delivery finished.

**Until the operator or a recognized packet manifest declares delivery complete, expected files not yet visible must be classified as `delivery_pending`, not `missing_evidence`.** These are different failure domains: `missing_evidence` implies the executor did not produce something it was supposed to; `delivery_pending` implies the transport/interface layer has not yet surfaced something that was already produced.

## Required Canopy states

1. `receiving` — packet transmission in progress; expected-file count may or may not yet be known.
2. `delivery_complete` — all expected files have arrived at the delivery surface.
3. `review_ready` — delivery is complete and an explicit signal (operator action or a recognized closeout manifest) has authorized review to begin.

## Required interface behavior

- Expose the expected-file count as soon as it is known (e.g., from a closeout manifest's own "expected" field).
- Expose the received-file count as attachments arrive.
- Preserve packet identity across attachment turns so partial and complete views of the same packet are recognized as one packet, not several.
- Allow the operator to explicitly declare delivery complete.
- Recognize a closeout manifest's own `expected`/`found`/`missing`/`unexpected` fields as a packet-completeness signal in their own right.
- Prevent any missing-file judgment while packet state is `receiving`.
- Distinguish `not_yet_delivered` (transport state) from `manifest_declared_missing` (an actual evidence gap asserted by the manifest itself).
- Notify the reviewer when the packet transitions to `review_ready`.

## Impact of the current gap

- Premature review of an incomplete delivery view.
- False missing-file notices for files that were already produced but not yet visible.
- Unnecessary correction cycles responding to a transport artifact rather than a real defect.
- Unnecessary hash regeneration to "prove" a file exists that was simply not yet delivered.
- Confusion between transport state (an interface property) and executor performance (an evidence property).

## Required validation

No file may be classified as missing solely because it is absent from an intermediate attachment turn while the governed packet remains in `receiving` state. A packet's completeness should be judged against its own closeout manifest, not against how many attachments have rendered in a given turn.

This communication record does not assert that Canopy has received or acted on any of the above. It is a communication-ready artifact only.
