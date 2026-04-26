-- Enable a DB-seated collapse control for text plaques.
-- The frontend renders this only when plaque.collapse.enabled resolves true.

update public.measures_encounter_def
set
  metadata = jsonb_set(
    metadata,
    '{presentation,plaque,collapse}',
    jsonb_build_object(
      'enabled', true,
      'collapse_label', 'Collapse text',
      'expand_label', 'Show text',
      'default_collapsed', false
    ),
    true
  ),
  updated_at = now()
where metadata #> '{presentation,plaque}' is not null;

update public.measures_encounter_def
set
  metadata = jsonb_set(
    metadata,
    '{plaque,collapse}',
    jsonb_build_object(
      'enabled', true,
      'collapse_label', 'Collapse text',
      'expand_label', 'Show text',
      'default_collapsed', false
    ),
    true
  ),
  updated_at = now()
where metadata -> 'plaque' is not null;
