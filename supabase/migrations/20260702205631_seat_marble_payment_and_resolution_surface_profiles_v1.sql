
-- OAR2: seat_marble_payment_and_resolution_surface_profiles_v1
-- Remove renderer_gap flags. Seat final content profiles for C2_agreement and C2_resolution.

-- Remove renderer_gap from both surface assignments
UPDATE measures_encounter_surface_assignment
SET metadata = metadata - 'renderer_gap'
WHERE surface_key IN ('marble_chamber_C2_agreement','marble_chamber_C2_resolution');

-- C2_agreement: correct CTA label to "Continue to Payment"
UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{content_profile,cta_label}',
  '"Continue to Payment"'
)
WHERE encounter_key = 'marble_chamber_C2_agreement';

-- C2_resolution: seat expanded content profile with receipt, access, and survey fields
UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{content_profile}',
  '{
    "eyebrow": "MAP Registration",
    "title": "Registration Received",
    "body": "Your MAP the Environment registration has been received.",
    "receipt_copy": "A receipt has been sent to the email you provided.",
    "access_copy": "Your MAP the Environment engagement details will be delivered within one business day.",
    "survey_label": "Share feedback",
    "survey_url": null,
    "cta_label": "Finish"
  }'::jsonb
)
WHERE encounter_key = 'marble_chamber_C2_resolution';
