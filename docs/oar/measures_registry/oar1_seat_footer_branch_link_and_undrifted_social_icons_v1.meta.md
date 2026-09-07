---
document_type: oar1
authority_level: working
document_scope: footer_and_undrifted_social_surface
title: OAR1 — Seat Footer Branch Link and Undrifted Social Icons
status: completed_with_missing_public_targets_held
version: v1
operator: cody
system: measures_registry
process_key: seat_footer_branch_link_and_undrifted_social_icons
source_oar2: docs/oar/measures_registry/oar2_seat_footer_branch_link_and_undrifted_social_icons_v1.meta.md
completed_at: 2026-06-21
db_mutation_performed: true
runtime_mutation_performed: true
deployment_performed: false
production_verification_performed: false
---

# OAR1 — Seat Footer Branch Link and Undrifted Social Icons v1

## OUTCOME

The footer branch-link contract and `/undrifted` article/social manifest were seated in the Measures registry and bound into the registered runtime.

Missing public targets remain held. No c3 Field route or social profile URL was invented.

## SEATED STATE

SQL artifact:

- `docs/oar/measures_registry/seat-footer-branch-link-and-undrifted-social-icons-v1.sql`

`measures_registry_root.metadata.footer_contract` now seats:

- `copy_prefix: Registered Branch of `
- `link_label: c3 Field`
- `link_target_key: c3_field_our_story`
- `link_url: null`
- `link_standing: held_missing_public_url`
- `global_navigation: false`

`undrifted_publication_landing.metadata.social_links` now seats exactly:

- X — `url: null`, `standing: held_missing_url`
- Facebook — `url: null`, `standing: held_missing_url`
- Instagram — `url: null`, `standing: held_missing_url`

`undrifted_publication_landing.metadata.featured_article_set` now seats exactly:

- Agents With Keys — `publication_state: unpublished`, `media_role: agents_with_keys_cover`, `article_route: null`
- Fables and Myths — `publication_state: published`, `media_role: fables_and_myths_cover`, `article_route: null`

## RUNTIME DELIVERY

The registered system footer preserves the existing `registry-system-footer` styling and renders:

- plain text: `Registered Branch of `
- governed label: `c3 Field`

Only the governed label can become an anchor when `link_url` is seated. In the current held state it renders as non-clickable text. The footer does not become global navigation.

The `/undrifted` renderer now reads the seated social manifest and renders icon-only X, Facebook, and Instagram positions in an `/undrifted`-only social strip. Because all three URLs are absent, each icon renders as a held, non-clickable semantic icon.

The featured article index is registry-driven and contains only Agents With Keys and Fables and Myths. Measures Registry, Structural Drift, and Agents of Chaos article cards remain absent.

Fables and Myths opens a top standing overlay, but the overlay explicitly reports that its route/content are not seated and opening remains held. Agents With Keys preserves unpublished standing and does not invent publication access.

## LIVE READBACK EVIDENCE

Protected and anonymous REST readback both returned the governing registry rows:

- `measures_registry_root`
- `undrifted_publication_landing`

Protected readback confirmed:

- footer label `c3 Field`
- footer URL `null`
- footer standing `held_missing_public_url`
- three social entries, all with `url: null` and `standing: held_missing_url`
- Fables and Myths `published` with `article_route: null`
- Agents With Keys `unpublished` with `article_route: null`

No-payment-mutation counts:

- `map_payment_events`: before `0`, after `0`
- `stripe_webhook_events`: before `0`, after `0`

## VALIDATION

- registry build: passed
- transformed modules: `103`
- generated bundle: `dist-registry/assets/index-CUHHJPif.js`
- generated governed route heads: `/ai-operations-assessment`, `/structural-drift`, `/undrifted`
- scoped `git diff --check`: passed
- root authority changed by this OAR: no
- encounter sequence changed by this OAR: no
- MAP/payment runtime changed by this OAR: no
- About Measures Registry changed by this OAR: no
- social URLs hardcoded: no
- c3 Field route invented: no
- removed article cards restored: no

The build emitted the existing large-chunk advisory only; it did not fail.

## HELD STATE

- c3 Field / Our Story link remains held until a public URL is seated.
- X, Facebook, and Instagram links remain held until approved profile URLs are seated.
- Fables and Myths route/content opening remains held even though publication standing is published.
- Agents With Keys remains unpublished.
- deployment and production-browser verification remain pending the next authorized delivery step.

## CLOSE

Completed footer and `/undrifted` social-surface delivery with missing targets surfaced honestly. Ready for separately authorized deployment and live verification.
