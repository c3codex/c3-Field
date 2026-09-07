---
document_type: oar1
authority_level: launch_authorization
document_scope: launch_cycle_001_scheduling_and_execution
title: OAR1 - Schedule and Launch Launch Cycle 001
operator: op044
system: measures_registry
executor: Cody
status: completed_with_exceptions
disposition: partially_launched_execution_exceptions_recorded
source_oar2: OAR/OAR2/publication/oar2_schedule_and_launch_launch_cycle_001_v1.meta.md
source_queue_packet: docs/oar/measures_registry/launch_cycle_001_final_buffer_queue_scheduling_packet_v1.json
evidence_packet: docs/oar/measures_registry/launch_cycle_001_scheduling_and_launch_execution_packet_v1.json
executed_at: 2026-07-14T00:47:00Z
---

# OAR1 - Schedule and Launch Launch Cycle 001

## Execution Summary

Operator launch authorization was applied to the existing Launch Cycle 001 Buffer queue.

No creative copy was changed.

No media was changed.

No new Buffer draft was created.

Scheduling was attempted only by editing existing Buffer IDs from the approved queue packet.

## Launch Standing

| Standing | Count |
|---|---:|
| Approved Buffer items | 29 |
| Scheduled / pending release | 21 |
| Already published at closeout | 0 |
| Execution exceptions | 8 |
| Deferred campaign extensions | 2 |

Final disposition:

**PARTIALLY LAUNCHED - EXECUTION EXCEPTIONS RECORDED**

## Scheduled Inventory

| Instance | Endpoint | Buffer ID | Due At UTC | Standing |
|---|---|---|---|---|
| `lc001_p001_ud_x_release` | unDrifted X | `6a557d2929834f7ded9a8872` | `2026-07-14T14:00:00.000Z` | scheduled |
| `lc001_p001_ud_x_quote` | unDrifted X | `6a557d29a208f5b1ac0c5cd6` | `2026-07-15T15:00:00.000Z` | scheduled |
| `lc001_p001_ud_x_discussion` | unDrifted X | `6a557d2b82f1b8ce84c16b8c` | `2026-07-17T15:00:00.000Z` | scheduled |
| `lc001_p001_ud_x_followup` | unDrifted X | `6a557d2b5d83824351945f4e` | `2026-07-18T15:00:00.000Z` | scheduled |
| `lc001_p001_ud_x_source_ack` | unDrifted X | `6a557d2b0a91bd784c7c7533` | `2026-07-19T14:30:00.000Z` | scheduled |
| `lc001_p001_ud_fb_release` | unDrifted Facebook | `6a55213145f81c20067e99cf` | `2026-07-14T01:31:00.000Z` | pre-existing scheduled item preserved |
| `lc001_p001_ud_fb_quote` | unDrifted Facebook | `6a557d2d82f1b8ce84c16ba4` | `2026-07-15T16:00:00.000Z` | scheduled |
| `lc001_p001_ud_fb_discussion` | unDrifted Facebook | `6a557d2d82f1b8ce84c16bc6` | `2026-07-17T16:00:00.000Z` | scheduled |
| `lc001_p001_ud_fb_square` | unDrifted Facebook | `6a557d2e29834f7ded9a88ef` | `2026-07-18T16:00:00.000Z` | scheduled |
| `lc001_p001_ud_fb_source_ack` | unDrifted Facebook | `6a557d2e5d83824351945f7d` | `2026-07-19T15:00:00.000Z` | scheduled |
| `lc001_p002_ud_x_release` | unDrifted X | `6a557d2ff2cf2ea3bef4596e` | `2026-07-14T17:00:00.000Z` | scheduled |
| `lc001_p002_ud_x_quote` | unDrifted X | `6a557d3082f1b8ce84c16bff` | `2026-07-16T15:00:00.000Z` | scheduled |
| `lc001_p001_mr_x_ack` | Measures Registry X | `6a557d350a91bd784c7c75b2` | `2026-07-15T14:00:00.000Z` | scheduled |
| `lc001_p002_mr_x_contribution` | Measures Registry X | `6a557d360a91bd784c7c75ca` | `2026-07-16T14:00:00.000Z` | scheduled |
| `lc001_p001_mr_ig_square` | Measures Registry Instagram | `6a557d3782f1b8ce84c16cd5` | `2026-07-15T18:00:00.000Z` | scheduled |
| `lc001_p001_mr_ig_story` | Measures Registry Instagram | `6a557d385d83824351946043` | `2026-07-15T22:00:00.000Z` | scheduled |
| `lc001_p001_mr_ig_quote` | Measures Registry Instagram | `6a557d39a208f5b1ac0c5fa6` | `2026-07-16T18:00:00.000Z` | scheduled |
| `lc001_p002_mr_ig_square` | Measures Registry Instagram | `6a557d39a208f5b1ac0c5fbe` | `2026-07-16T19:00:00.000Z` | scheduled |
| `lc001_p002_mr_ig_story` | Measures Registry Instagram | `6a557d3a29834f7ded9a89a0` | `2026-07-16T22:00:00.000Z` | scheduled |
| `lc001_p002_mr_ig_quote` | Measures Registry Instagram | `6a557d3b29834f7ded9a89b8` | `2026-07-17T20:00:00.000Z` | scheduled |
| `lc001_p002_mr_ig_discussion` | Measures Registry Instagram | `6a557d3bf2cf2ea3bef45a7f` | `2026-07-18T20:00:00.000Z` | scheduled |

## Execution Exceptions

The remaining exceptions are all associated with `BUFFER_PUB2_KEY`.

Final Buffer observation:

- HTTP status: `429`
- Buffer code: `RATE_LIMIT_EXCEEDED`
- window: `24h`
- standing: external Buffer rate limit blocks further PUB2 verification or retry in this turn

Unresolved Buffer IDs at closeout:

| Instance | Endpoint | Buffer ID | Required standing |
|---|---|---|---|
| `lc001_p002_ud_x_discussion` | unDrifted X | `6a557d31a208f5b1ac0c5f37` | verify/schedule after rate-limit clears |
| `lc001_p002_ud_x_followup` | unDrifted X | `6a557d320a91bd784c7c759a` | verify/schedule after rate-limit clears |
| `lc001_p002_ud_fb_release` | unDrifted Facebook | `6a55717b82f1b8ce84c10026` | verify/schedule after rate-limit clears |
| `lc001_p002_ud_fb_quote` | unDrifted Facebook | `6a557d3329834f7ded9a893f` | verify/schedule after rate-limit clears |
| `lc001_p002_ud_fb_discussion` | unDrifted Facebook | `6a557d3382f1b8ce84c16c50` | verify/schedule after rate-limit clears |
| `lc001_p002_ud_fb_square` | unDrifted Facebook | `6a557d345d83824351945ff2` | verify/schedule after rate-limit clears |
| `lc001_p001_mr_fb_ack` | Measures Registry Facebook | `6a55717c82f1b8ce84c1004f` | verify/schedule after rate-limit clears |
| `lc001_p002_mr_fb_contribution` | Measures Registry Facebook | `6a557d3782f1b8ce84c16cbc` | verify/schedule after rate-limit clears |

## Deferred Campaign Extensions

The two Instagram Reel gaps from the prior queue closeout were reclassified by OAR2 as deferred campaign extensions and are not launch blockers:

- `lc001_p001_mr_ig_reel`
- `lc001_p002_mr_ig_reel`

## Evidence

- `docs/oar/measures_registry/launch_cycle_001_scheduling_and_launch_execution_packet_v1.json`
- `scripts/schedule-launch-cycle-001.cjs`

## No-Mutation Confirmation

- No approved copy was rewritten.
- No registered media was changed.
- No canonical publication was changed.
- No held About Measures Registry asset was published.
- No duplicate Buffer draft was created.

## Required Resume Action

After the `BUFFER_PUB2_KEY` 24-hour rate-limit window clears, resume from the eight unresolved Buffer IDs listed above. Do not recreate them. Verify by existing Buffer ID, then schedule only unresolved drafts.
