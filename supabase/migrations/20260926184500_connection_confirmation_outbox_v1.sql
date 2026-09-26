-- Queue bilateral email confirmations only after an invite-backed native connection persists.

create table if not exists public.c3_env_connection_confirmation_outbox (
  dispatch_key uuid primary key default gen_random_uuid(),
  connection_key text not null references public.c3_env_native_connection(connection_key) on update cascade on delete cascade,
  acceptance_key uuid not null references public.c3_env_invite_acceptance(acceptance_key) on update cascade on delete cascade,
  share_reference uuid not null references public.c3_env_share_reference(share_reference) on update cascade,
  recipient_relationship_key text not null,
  recipient_role text not null,
  recipient_email text not null,
  recipient_display_name text,
  counterpart_display_name text,
  dispatch_state text not null default 'pending',
  attempt_count integer not null default 0,
  created_at timestamptz not null default now(),
  last_attempt_at timestamptz,
  sent_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  constraint c3_env_connection_confirmation_outbox_role_check check (recipient_role in ('inviter','invitee')),
  constraint c3_env_connection_confirmation_outbox_state_check check (dispatch_state in ('pending','sent','failed')),
  unique(connection_key,recipient_relationship_key)
);
alter table public.c3_env_connection_confirmation_outbox enable row level security;
revoke all on public.c3_env_connection_confirmation_outbox from public,anon,authenticated;
grant select,insert,update on public.c3_env_connection_confirmation_outbox to service_role;

create or replace function public.queue_c3_env_connection_confirmation()
returns trigger
language plpgsql
security definer
set search_path to public,pg_temp
as $$
declare
  v_connection public.c3_env_native_connection%rowtype;
  v_source public.crs_relationship%rowtype;
  v_target public.crs_relationship%rowtype;
begin
  if old.acceptance_state='accepted' or new.acceptance_state<>'accepted' then return new; end if;
  if coalesce(new.metadata->>'connection_key','')='' then return new; end if;

  select * into v_connection from public.c3_env_native_connection
  where connection_key=new.metadata->>'connection_key' and standing='active';
  if not found then return new; end if;

  select * into v_source from public.crs_relationship
  where relationship_key=v_connection.source_relationship_key and is_active=true;
  select * into v_target from public.crs_relationship
  where relationship_key=v_connection.target_relationship_key and is_active=true;

  if v_source.relationship_key is not null and v_source.primary_email is not null then
    insert into public.c3_env_connection_confirmation_outbox(
      connection_key,acceptance_key,share_reference,recipient_relationship_key,recipient_role,
      recipient_email,recipient_display_name,counterpart_display_name,metadata
    ) values (
      v_connection.connection_key,new.acceptance_key,new.share_reference,v_source.relationship_key,'inviter',
      v_source.primary_email,v_source.display_name,v_target.display_name,
      jsonb_build_object('source','invite_acceptance_persisted','standing_effect','none','authority_effect','none')
    ) on conflict (connection_key,recipient_relationship_key) do nothing;
  end if;

  if v_target.relationship_key is not null and v_target.primary_email is not null then
    insert into public.c3_env_connection_confirmation_outbox(
      connection_key,acceptance_key,share_reference,recipient_relationship_key,recipient_role,
      recipient_email,recipient_display_name,counterpart_display_name,metadata
    ) values (
      v_connection.connection_key,new.acceptance_key,new.share_reference,v_target.relationship_key,'invitee',
      v_target.primary_email,v_target.display_name,v_source.display_name,
      jsonb_build_object('source','invite_acceptance_persisted','standing_effect','none','authority_effect','none')
    ) on conflict (connection_key,recipient_relationship_key) do nothing;
  end if;

  return new;
end;
$$;
revoke all on function public.queue_c3_env_connection_confirmation() from public,anon,authenticated;
grant execute on function public.queue_c3_env_connection_confirmation() to service_role;

drop trigger if exists trg_queue_c3_env_connection_confirmation on public.c3_env_invite_acceptance;
create trigger trg_queue_c3_env_connection_confirmation
after update of acceptance_state on public.c3_env_invite_acceptance
for each row
when (old.acceptance_state is distinct from new.acceptance_state and new.acceptance_state='accepted')
execute function public.queue_c3_env_connection_confirmation();
