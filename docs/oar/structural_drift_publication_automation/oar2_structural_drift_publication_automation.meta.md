---
document_type: oar2
title: OAR2 Structural Drift Publication Automation
version: v1
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: structural_drift_publication_automation_v1

OBSERVED
Structural Drift is seated as a governed Measures Registry publication surface.
The first dispatch is seated and committed.

A repeatable automation process is needed for future dispatch creation, DB seating, OAR1 closeout, and distribution preparation.

ALIGNED
- Codex is database authority.
- Automation may draft and seat approved structures.
- Operator approval is required before public distribution.
- No automatic posting to Paragraph or X.
- No slugs as authority.
- Internal keys remain authority.
- Cody executes from OAR2 only.

ROUTED

1. Create dispatch automation support.

Automation must generate a new dispatch package containing:
- dispatch_key
- title
- excerpt
- seo_description
- tags
- references
- media_manifest
- primary_cta
- secondary_cta
- dispatch_body
- paragraph_metadata
- x_caption_options

2. Create local generator if appropriate:

path:
docs/process/publication/new-structural-drift-dispatch.ps1

Generator output path:
docs/oar/structural_drift_dispatches/<dispatch_key>/

Required output files:
- oar2_<dispatch_key>.meta.md
- dispatch_body.md
- paragraph_metadata.json
- x_captions.md

3. Require operator confirmation before:
- DB seating
- Paragraph publication
- X posting
- deploy

4. DB seating behavior:
Future dispatches must insert/update:
- public.measures_publication_dispatch
- public.measures_publication_subscription_capture only if capture schema changes are needed
- public.system_oar_log after OAR1 closeout

5. Dispatch key rule:
- lowercase
- underscore-separated
- descriptive
- versioned suffix where needed
- no external slug as authority

6. External route metadata:
Allowed:
- external_platform
- external_slug
- external_url

Not allowed:
- using external_slug as internal key
- deriving authority from Paragraph URL

7. Distribution preparation:
Automation may prepare:
- Paragraph title
- Paragraph subtitle/preview
- Paragraph tags
- Paragraph cover image path
- X caption options
- CTA block

Automation may NOT:
- auto-post
- rewrite approved dispatch body
- invent research citations
- invent publication claims

8. Validation command:
Add reusable validation command if appropriate:

npm script:
validate:structural-drift

Validation should check:
- publication exists
- latest dispatch exists
- required fields present
- references present
- CTA present
- media manifest valid
- no slug authority
- public read works
- subscription capture insert works

9. Write OAR1 closeout beside this OAR2.

CODY ROLE

Cody is executor only.

May:
- create automation generator
- create validation helper
- add npm script if appropriate
- document automation process
- write OAR1 closeout

May NOT:
- auto-post publicly
- invent dispatch content
- introduce slugs as authority
- modify existing dispatch content without instruction
- proceed from thread instructions

VALIDATION

- generator exists or documented as intentionally not needed
- generated dispatch package structure is correct
- validation helper exists or documented as intentionally not needed
- no public posting automation added
- no slug authority introduced
- OAR1 closeout written
