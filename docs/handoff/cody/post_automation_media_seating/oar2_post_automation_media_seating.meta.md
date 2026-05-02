---
document_type: oar2
title: Measures Registry Post Automation + Media Seating
version: v1
status: handoff_ready
campaign_key: agents_of_chaos_integrity_governance
---

# OAR2 — Post Automation + Bucket Media Seating

## Observed

Bucket media confirmed:

- measures_registry/video/integrity_governance_intro.mp4
- measures_registry/images/integrity_governance_poster.webp
- measures_registry/brand/measures_registry_mark.webp
- measures_registry/brand/measures_registry_banner.webp
- measures_registry/brand/measures_registry_social_card.webp
- measures_registry/images/paragraph_cover_agents_of_chaos.webp

## Aligned

Media must be seated before post automation references it.

No hardcoded media paths in frontend or automation logic.

Use only:

- registry_key
- encounter_key
- campaign_key
- media_role
- storage_path

No slugs.

## Routed

1. Seat confirmed bucket media.
2. Bind media to campaign_key: agents_of_chaos_integrity_governance.
3. Create post automation queue only after media seating is verified.
4. Scheduled posts reference seated media records only.
