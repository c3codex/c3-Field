-- Seat DB-driven labels for the insights (dispatches) section on /undrifted.
UPDATE measures_registry
SET metadata = jsonb_set(
  jsonb_set(
    metadata,
    '{landing_design_contract,insights_eyebrow}',
    '"Insights"',
    true
  ),
  '{landing_design_contract,insights_heading}',
  '"Read unDrifted"',
  true
)
WHERE registry_key = 'undrifted_publication_landing';
