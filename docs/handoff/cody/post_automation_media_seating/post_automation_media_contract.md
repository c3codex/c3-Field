# Post Automation Media Contract

## Campaign Key

agents_of_chaos_integrity_governance

## Rule

Automation must reference seated media records only.

Do not hardcode bucket paths in post generation or frontend runtime.

## Required Media Roles

- hero_video
- hero_poster
- registry_mark
- registry_banner
- social_card
- paragraph_cover

## Validation

- [ ] measures_media_map exists
- [ ] 6 media rows inserted
- [ ] campaign_key matches agents_of_chaos_integrity_governance
- [ ] no slug fields introduced
- [ ] post automation queue references media_role or media record id
