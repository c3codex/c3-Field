alter table public.measures_notification_dispatch_log
  drop constraint if exists measures_notification_dispatch_log_event_type_check;

alter table public.measures_notification_dispatch_log
  add constraint measures_notification_dispatch_log_event_type_check
  check (
    event_type = any (
      array[
        'assessment_receipt'::text,
        'assessment_completed'::text,
        'map_payment_completed'::text,
        'map_payment_failed'::text,
        'map_payment_canceled'::text
      ]
    )
  );
