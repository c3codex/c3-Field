# Frontend Contract — SRC Reserve Seat

## Purpose

Wire Reserve Your Seat → SRC intake → RPC → success state.

## Fields

- origin_type *
- full_name *
- email *
- role_or_title
- institution_name
- interest_area
- course_intent
- message

## Submission Rule

Frontend must call RPC only:

`submit_src_intake_request`

Do not insert directly into `src_intake_request`.

## Supabase Call

```ts
const { data, error } = await supabase.rpc(
  "submit_src_intake_request",
  {
    p_origin_type: form.origin_type,
    p_full_name: form.full_name,
    p_email: form.email,
    p_role_or_title: form.role_or_title,
    p_institution_name: form.institution_name,
    p_interest_area: form.interest_area,
    p_course_intent: form.course_intent,
    p_message: form.message
  }
);Success

If data.ok === true, show:

“Your seat request has been received.”

Error

Show:

“Submission failed. Please try again.”

Do not expose internal DB errors.

Validation
 RPC callable from frontend
 Row created in src_intake_request
 env_key generated
 Row created in oar1_log
 oar1_status = logged
 success response returned
