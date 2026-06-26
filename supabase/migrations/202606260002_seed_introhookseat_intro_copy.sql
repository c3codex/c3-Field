-- Seed intro_copy into ai_isnt_broken_intro encounter_def metadata.
-- OAR2: oar2_seed_introhookseat_metadata_alignment_v1
-- Uses || merge — existing keys are preserved. Only intro_copy is added.

UPDATE measures_encounter_def
SET metadata = metadata || $json${
  "intro_copy": {
    "headline": "AI Isn't Broken. Systems Are.",
    "subheadline": "Optimization cannot occur in environments that lack Governed System Integrity.",
    "body": "Measures Registry helps organizations identify structural drift, understand system integrity, and prepare for optimized AI deployment.",
    "cta": "Assess the Environment",
    "supporting_copy": "The goal is not more tools. The goal is governable environments."
  }
}$json$::jsonb
WHERE encounter_key = 'ai_isnt_broken_intro';
