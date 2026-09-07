-- OAR2: oar2_seat_assessment_and_payment_notification_dispatch_v1
-- Generalized, DB-seated notification template + append-only dispatch log for
-- assessment_completed and map_payment_completed/failed/canceled events.
-- Distinct from measures_seat_hold_notification_template/dispatch_log (that pair
-- stays scoped to the seat-hold offering flow and is untouched by this migration).

create table public.measures_notification_template (
  id uuid primary key default gen_random_uuid(),
  template_key text not null unique,
  event_type text not null check (event_type in (
    'assessment_completed',
    'map_payment_completed',
    'map_payment_failed',
    'map_payment_canceled'
  )),
  recipient_class text not null check (recipient_class in ('operator', 'participant')),
  subject text not null,
  body text not null,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.measures_notification_template is
  'DB-seated subject/body templates for assessment and MAP payment notification dispatch. Frontend does not author copy.';

create trigger measures_notification_template_set_updated_at
  before update on public.measures_notification_template
  for each row execute function public.set_updated_at();

alter table public.measures_notification_template enable row level security;

create table public.measures_notification_dispatch_log (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in (
    'assessment_completed',
    'map_payment_completed',
    'map_payment_failed',
    'map_payment_canceled'
  )),
  recipient_class text not null check (recipient_class in ('operator', 'participant')),
  source_table text not null,
  source_id text not null,
  recipient_email text not null,
  template_key text,
  provider text not null,
  provider_message_id text,
  dispatch_state text not null check (dispatch_state in ('attempted', 'sent', 'failed', 'skipped', 'blocked')),
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.measures_notification_dispatch_log is
  'Append-only dispatch history for assessment and MAP payment notifications. No update or delete permitted.';

-- Idempotency backstop: at most one successful send per event/recipient-class/source,
-- enforced at the DB level (not just application logic) per OAR2 section 9.
create unique index measures_notification_dispatch_log_sent_once
  on public.measures_notification_dispatch_log (event_type, recipient_class, source_id)
  where dispatch_state = 'sent';

create index measures_notification_dispatch_log_source_idx
  on public.measures_notification_dispatch_log (source_table, source_id);

create function public.measures_notification_dispatch_log_prevent_mutation()
returns trigger
language plpgsql
set search_path to 'public'
as $function$
begin
  raise exception 'notification dispatch log is append-only';
end;
$function$;

create trigger measures_notification_dispatch_log_no_update
  before update on public.measures_notification_dispatch_log
  for each row execute function public.measures_notification_dispatch_log_prevent_mutation();

create trigger measures_notification_dispatch_log_no_delete
  before delete on public.measures_notification_dispatch_log
  for each row execute function public.measures_notification_dispatch_log_prevent_mutation();

alter table public.measures_notification_dispatch_log enable row level security;

-- Seat governed templates. No certification/SEAT/c3 Key/conversion/DAO-standing claims.
insert into public.measures_notification_template (template_key, event_type, recipient_class, subject, body, metadata) values
(
  'assessment_completed_operator_v1',
  'assessment_completed',
  'operator',
  'New assessment completed — {{institution_name}}',
  E'A new AI Operations Assessment has been completed.\n\nCapture ID: {{capture_id}}\nInstitution: {{institution_name}}\nContact: {{contact_name}} <{{contact_email}}>\nBusiness type: {{business_type}}\nAssessment result: {{assessment_result}}\nEnvironmental standing: {{environmental_standing}}\nRecommended pathway: {{continuation_pathway}}\nSubmitted: {{submitted_at}}\n\nReview reference: {{review_reference}}\n\nThis is an internal operational notice. It is not sent to the assessed institution.',
  jsonb_build_object('source_oar2', 'seat_assessment_and_payment_notification_dispatch_v1')
),
(
  'map_payment_completed_operator_v1',
  'map_payment_completed',
  'operator',
  'MAP payment received — {{contact_email}}',
  E'A MAP (Measures Alignment Protocol) payment has been confirmed.\n\nMAP order ID: {{map_order_id}}\nAssessment reference: {{evaluation_result_id}}\nParticipant email: {{contact_email}}\nSelected pathway: {{map_pathway}}\nAmount paid: {{amount_paid}} {{currency}}\nPayment state: {{payment_status}}\nStripe reference: {{stripe_payment_intent_id}}\nCompleted: {{paid_at}}\n\nThis is an internal operational notice. It does not itself create SEAT standing, a c3 Key, or certification.',
  jsonb_build_object('source_oar2', 'seat_assessment_and_payment_notification_dispatch_v1')
),
(
  'map_payment_completed_participant_v1',
  'map_payment_completed',
  'participant',
  'Your Measures Registry MAP payment is confirmed',
  E'Thank you. Your payment for the Measures Alignment Protocol (MAP) has been received and confirmed.\n\nSelected pathway: {{map_pathway}}\nAmount paid: {{amount_paid}} {{currency}}\nCompleted: {{paid_at}}\n\nA Measures Registry team member will follow up with next steps for your MAP engagement. A payment receipt is issued separately by our payment processor.\n\nThis confirmation is informational only. It does not itself create SEAT standing, Registry Certification, c3 Key issuance, or public recognition.\n\nQuestions? Contact us at connect@measuresregistry.com.',
  jsonb_build_object('source_oar2', 'seat_assessment_and_payment_notification_dispatch_v1')
),
(
  'map_payment_failed_operator_v1',
  'map_payment_failed',
  'operator',
  'MAP payment failed — {{contact_email}}',
  E'A MAP payment attempt failed.\n\nMAP order ID: {{map_order_id}}\nParticipant email: {{contact_email}}\nSelected pathway: {{map_pathway}}\nStripe reference: {{stripe_payment_intent_id}}\nRecorded: {{failed_at}}\n\nThis is an internal operational notice only.',
  jsonb_build_object('source_oar2', 'seat_assessment_and_payment_notification_dispatch_v1')
),
(
  'map_payment_canceled_operator_v1',
  'map_payment_canceled',
  'operator',
  'MAP payment canceled — {{contact_email}}',
  E'A MAP checkout session was canceled or expired before payment completed.\n\nMAP order ID: {{map_order_id}}\nParticipant email: {{contact_email}}\nSelected pathway: {{map_pathway}}\nRecorded: {{canceled_at}}\n\nThis is an internal operational notice only.',
  jsonb_build_object('source_oar2', 'seat_assessment_and_payment_notification_dispatch_v1')
);