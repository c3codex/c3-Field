# OAR2 — FREE Cutover: EncounterEntry Active Assessment Path
## Status: READY_FOR_EXECUTION
## Surface: Measures Registry / AI Operations Assessment
## Decision: CUTOVER NOW

OBJECTIVE
Cut public assessment submission away from the registered runtime path and make EncounterEntry the active public assessment authority.

Registered runtime must no longer serve as the active route authority for the free assessment path.

BOUNDARY
registered runtime:
- archived / held evidence only
- not active public assessment authority
- not route authority
- not source of frontend truth

EncounterEntry:
- active public entry
- wired into App.tsx
- routes assessment through EncounterBoundary
- uses ObsidianChamberRenderer for assessment capture

IMPLEMENTATION
1. Wire EncounterEntry into App.tsx for the public assessment route.

2. Route public assessment path through:
   EncounterEntry
   → EncounterBoundary
   → ObsidianChamberRenderer
   → onCaptureAssessment
   → Supabase insert

3. Use existing ObsidianChamberRenderer onCaptureAssessment callback shape.

4. Move actual DB insert logic into EncounterBoundary or the approved persistence boundary.

5. Confirm insert target:
   public.measures_iis_eval_gate1_capture

6. Confirm RLS migration has been applied:
   202606270001_grant_anon_insert_on_assessment_capture.sql

SQL policy required:
ALTER TABLE public.measures_iis_eval_gate1_capture ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "assessment_capture_insert_public"
  ON public.measures_iis_eval_gate1_capture;

CREATE POLICY "assessment_capture_insert_public"
  ON public.measures_iis_eval_gate1_capture
  FOR INSERT
  TO public
  WITH CHECK (true);

DECOMMISSION ACTIVE RUNTIME PATH
1. Remove registered runtime from active public assessment routing.
2. Do not delete prior evidence records.
3. Mark prior runtime as held/archive if represented in registry.
4. Remove or bypass stale runtime calls from App.tsx.
5. Do not leave duplicate assessment routes active.

VALIDATION
After execution, test:

1. /ai-operations-assessment loads through EncounterEntry.
2. Assessment questions still load from DB.
3. Contact and consent submission succeeds.
4. Insert appears in measures_iis_eval_gate1_capture.
5. User no longer sees:
   “Evaluation could not be seated. Please try again.”
6. Result/evaluation renders after submission.
7. Email dispatch still follows approved consent behavior.
8. Browser console has no runtime route errors.
9. Network POST returns 2xx.
10. Registered runtime is not called during public assessment submission.

RETURN EVIDENCE
- App.tsx route diff
- EncounterEntry wiring diff
- EncounterBoundary persistence diff
- insert response evidence
- Supabase row evidence
- final route tested
- confirmation registered runtime inactive on public path

DO NOT
- Do not preserve registered runtime as active route authority.
- Do not create frontend-owned truth.
- Do not invent new assessment route names.
- Do not use deprecated runtime terminology in user-facing copy.
- Do not expose SEAT, certification, c3 Key, DAO, payment, or registration claims from the free assessment.
- Do not delete historical registered runtime evidence.

READY_FOR_EXECUTION
