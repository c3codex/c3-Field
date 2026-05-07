---
document_type: oar2
title: OAR2 Structural Drift Publication Seeding
version: v2
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: structural_drift_publication_seeding_v2

OBSERVED
Measures Registry now includes an institutional publication surface titled:

Structural Drift
Dispatches from the Measures Registry

The publication is already externally published on Paragraph and must now be seated as a governed Codex-linked publication surface.

ALIGNED
- Codex is database authority.
- Publications are DB-seated surfaces.
- Dispatches inherit publication structure.
- External slugs and URLs are route metadata only, not authority.
- Internal authority remains publication_key + dispatch_key.
- Media, references, CTAs, and subscription surfaces must be seated.
- No frontend invention.
- No slugs as authority.
- Cody executes from OAR2 only.

ROUTED

1. Create publication registry table if absent:

table:
public.measures_publication_registry

Required fields:
- id uuid primary key
- publication_key text unique not null
- title text not null
- subtitle text
- publication_type text not null
- status text not null
- distribution_surface text
- external_platform text
- external_slug text
- external_url text
- tone jsonb not null default '[]'::jsonb
- metadata jsonb not null default '{}'::jsonb
- created_at timestamptz
- updated_at timestamptz

2. Create dispatch table if absent:

table:
public.measures_publication_dispatch

Required fields:
- id uuid primary key
- publication_key text not null
- dispatch_key text unique not null
- title text not null
- dispatch_body text not null
- excerpt text
- seo_description text
- tags jsonb not null default '[]'::jsonb
- primary_cta text
- secondary_cta text
- references jsonb not null default '[]'::jsonb
- media_manifest jsonb not null default '{}'::jsonb
- internal_route text
- external_platform text
- external_slug text
- external_url text
- status text not null
- published_at timestamptz
- metadata jsonb not null default '{}'::jsonb
- created_at timestamptz
- updated_at timestamptz

3. Seat publication registry:

publication_key:
structural_drift

title:
Structural Drift

subtitle:
Dispatches from the Measures Registry

publication_type:
institutional_diagnostic

status:
published

distribution_surface:
x_primary

external_platform:
paragraph

external_slug:
structural-drift

external_url:
https://paragraph.com/@measures-registry/structural-drift

tone:
[
  "institutional",
  "diagnostic",
  "restrained",
  "evidence_backed"
]

4. Seat first dispatch:

dispatch_key:
agents_of_chaos_dispatch_v1

title:
The Harness Was Never the Fix

excerpt:
Autonomous agents are not failing in isolation. They are exposing structural drift inside the systems that deploy them.

seo_description:
A Measures Registry dispatch on autonomous AI agents, structural drift, and why institutional AI failures emerge from unresolved systems, not intelligence alone.

primary_cta:
Evaluate Structural Coherence

secondary_cta:
Receive Registry Dispatches

internal_route:
/publication/structural_drift/agents_of_chaos_dispatch_v1

external_platform:
paragraph

external_slug:
agents-of-chaos

external_url:
https://paragraph.com/@measures-registry/agents-of-chaos

status:
published

tags:
[
  "AI Governance",
  "AI Agents",
  "Autonomous Agents",
  "Structural Drift",
  "Integrity Governance",
  "Enterprise AI",
  "Agentic Systems",
  "Harness Engineering",
  "Operational Coherence"
]

5. Seat references:

references:
[
  {
    "title": "Agents of Chaos",
    "year": "2026",
    "type": "research_paper"
  },
  {
    "title": "The Last Harness You'll Ever Build",
    "year": "2026",
    "type": "research_paper",
    "citation": "arXiv:2604.21003v1"
  }
]

6. Seat media manifest:

media_manifest:
{
  "banner_image": "measures-registry/structural_drift.webp",
  "publication_video": {
    "platform": "youtube",
    "external_url": "https://youtu.be/29f2Gcxwv9o",
    "title": "AI isn’t broken. Systems are.",
    "type": "longform_dispatch_video"
  }
}

7. Insert full approved article body:
"The Harness Was Never the Fix"

8. Create publication renderer support:

renderer_key:
publication_dispatch

Requirements:
- responsive desktop/mobile
- restrained typography
- read Measures Registry design tokens
- no pure white text
- references rendered separately
- CTA block rendered at end
- banner image rendered if present
- embedded YouTube video rendered if present
- no diagnostics visible publicly

9. Seat subscription capture support:

subscription_type:
dual_surface

Requirements:
- Paragraph external subscription preserved
- Codex-native capture surface created
- capture fields:
  - email
  - organization optional
- capture source:
  structural_drift_dispatch
- no popup interruption
- rendered beneath CTA surface

10. Write OAR1 closeout beside this OAR2.

CODY ROLE

Cody is executor only.

May:
- create publication tables
- seat publication records
- seat dispatch
- insert approved article body
- wire renderer support
- create Codex capture surface
- write OAR1 closeout

May NOT:
- rewrite publication content
- invent tags or CTAs
- use slugs as authority
- expose diagnostics
- proceed from thread instructions

VALIDATION

- publication registry exists
- dispatch exists
- references seated
- media manifest seated
- article body renders
- YouTube embed renders
- CTA block renders
- Codex capture renders
- responsive rendering verified
- no diagnostics visible
- OAR1 closeout written
