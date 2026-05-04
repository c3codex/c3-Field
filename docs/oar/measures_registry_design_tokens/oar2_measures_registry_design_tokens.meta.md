---
document_type: oar2
title: OAR2 Measures Registry Design Tokens
version: v1
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: measures_registry_design_tokens_v1

OBSERVED
Measures Registry landing and encounter pages need responsive styling, typography, spacing, and color behavior seated as DB-driven design tokens.

Current issue:
Renderer styling is too interpretive.
Typography is oversized.
Pure white text is too harsh.
Mobile and desktop need explicit tokenized behavior.

ALIGNED
- Codex is database authority.
- Frontend renders seated design state.
- Styling must not be hardcoded as silent frontend authority.
- No slugs.
- No diagnostics publicly.
- Cody executes from OAR2 only.

ROUTED
1. Create approved design token table if absent:

table:
public.measures_design_token

Required fields:
- id uuid primary key
- registry_key text not null
- token_scope text not null
- token_key text not null
- token_value text not null
- token_type text not null
- media_query text
- is_active boolean not null default true
- metadata jsonb not null default '{}'::jsonb
- created_at timestamptz
- updated_at timestamptz

2. Add constraints:
- token_type in ('color','font_size','spacing','layout','opacity','line_height','component')
- unique(registry_key, token_scope, token_key, coalesce(media_query,''))

3. Seat Measures Registry tokens:

registry_key:
measures_registry

Color tokens:
- text_primary = #E8E6DF
- text_secondary = rgba(232,230,223,0.72)
- text_muted = rgba(232,230,223,0.52)
- background_obsidian = #050607
- panel_obsidian = rgba(8,10,14,0.72)
- border_subtle = rgba(232,230,223,0.14)
- accent_warm = rgba(214,132,62,0.82)
- accent_cool = rgba(108,154,208,0.82)

Typography desktop:
- entry_label = 13px
- entry_headline = clamp(36px, 4.5vw, 48px)
- entry_sub = 17px
- body = 16px
- section_headline = 24px
- plaque_title = 24px
- plaque_body = 16px

Typography mobile:
- entry_headline = clamp(26px, 9vw, 32px)
- entry_sub = 15px
- body = 15px
- plaque_title = 21px
- plaque_body = 15px

Spacing:
- section_spacing_desktop = 72px
- section_spacing_mobile = 44px
- page_padding_desktop = 48px
- page_padding_mobile = 20px
- plaque_padding_desktop = 32px
- plaque_padding_mobile = 24px

Layout:
- content_max_width = 1080px
- text_max_width = 680px
- header_height = 64px
- mobile_breakpoint = 768px

Rules:
- no #FFFFFF text
- no glow
- no bloom
- no oversized headline beyond token max
- mobile layouts single-column unless explicitly seated otherwise

4. Update landing and encounter renderer to read active tokens by:
registry_key = measures_registry

5. If tokens are missing:
report missing tokens.
Do not invent fallback styling except safe browser defaults.

6. Write OAR1 closeout beside this OAR2.

CODY ROLE
Cody is executor only.

May:
- create measures_design_token table
- seat listed tokens
- wire renderer to read tokens
- report missing token state
- write OAR1 closeout

May NOT:
- invent token names
- hardcode replacement styles
- introduce slugs
- expose diagnostics
- proceed from thread instructions

VALIDATION
- measures_design_token exists
- all required tokens seated
- renderer reads active tokens
- no #FFFFFF text in Measures Registry surfaces
- mobile and desktop sizes respect tokens
- OAR1 closeout written
