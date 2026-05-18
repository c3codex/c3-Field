-- Source Reference Traversal View Hardening v1
-- Authorized by docs/oar/source_reference/oar2_source_reference_traversal_view_hardening_v1.meta.md
-- Boundary: draft only. Do not execute without separate OAR2 execution authorization.
-- Purpose: public-safe projection candidate only; creates no policy, grant, or exposure.

create or replace view public.v_codex_source_public_precedence as
select
  source_key,
  source_title,
  source_type,
  authority_level,
  source_status,
  readonly,
  precedence_rank,
  precedence_label
from public.v_codex_source_seeded_precedence;
