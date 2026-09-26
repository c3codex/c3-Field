begin;

update public.c3_pac
set metadata =
  jsonb_set(
    jsonb_set(
      metadata,
      '{public_presentation,memorial_text}',
      to_jsonb('For those who were never heard.'::text),
      true
    ),
    '{persistent_memorial,purpose}',
    to_jsonb('For those who were never heard.'::text),
    true
  ),
  updated_at=now()
where pac_key='47pct_c1_connect_c3webpac_v1';

commit;
