begin;

create table if not exists private.cancom_personal_message_payload (
  payload_key uuid primary key default gen_random_uuid(),
  message_key uuid not null unique,
  connection_key text not null,
  sender_relationship_key text not null,
  content_type text not null default 'text/plain',
  body text not null,
  content_sha256 text not null,
  visibility text not null default 'participants_only',
  custody_standing text not null default 'active',
  migrated_from_registry boolean not null default false,
  created_at timestamptz not null default now(),
  constraint cancom_personal_message_payload_body_check check (length(btrim(body)) between 1 and 5000),
  constraint cancom_personal_message_payload_sha256_check check (content_sha256 ~ '^[0-9a-f]{64}$'),
  constraint cancom_personal_message_payload_visibility_check check (visibility in ('participants_only')),
  constraint cancom_personal_message_payload_standing_check check (custody_standing in ('active','removed'))
);

alter table private.cancom_personal_message_payload enable row level security;
revoke all on private.cancom_personal_message_payload from public, anon, authenticated;
grant select, insert, update on private.cancom_personal_message_payload to service_role;

alter table public.c3_env_connection_message
  add column if not exists payload_ref text,
  add column if not exists content_sha256 text,
  add column if not exists content_visibility text,
  add column if not exists payload_custody_type text;

insert into private.cancom_personal_message_payload(
  payload_key,message_key,connection_key,sender_relationship_key,content_type,body,
  content_sha256,visibility,custody_standing,migrated_from_registry,created_at
)
select
  gen_random_uuid(),m.message_key,m.connection_key,m.sender_relationship_key,'text/plain',m.body,
  encode(digest(convert_to(m.body,'UTF8'),'sha256'),'hex'),
  'participants_only',
  case when m.standing='removed' then 'removed' else 'active' end,
  true,
  m.created_at
from public.c3_env_connection_message m
where m.body is not null
  and not exists (
    select 1 from private.cancom_personal_message_payload p where p.message_key=m.message_key
  );

update public.c3_env_connection_message m
set payload_ref='private://cancom_personal_message_payload/'||p.payload_key::text,
    content_sha256=p.content_sha256,
    content_visibility='participants_only',
    payload_custody_type='private_cancom_payload',
    metadata=coalesce(m.metadata,'{}'::jsonb)||jsonb_build_object(
      'registry_envelope_only',true,
      'content_externalized',true,
      'content_authority',false
    )
from private.cancom_personal_message_payload p
where p.message_key=m.message_key;

alter table public.c3_env_connection_message
  alter column body drop not null;

update public.c3_env_connection_message
set body=null
where body is not null;

alter table public.c3_env_connection_message
  drop constraint if exists c3_env_connection_message_body_check;

alter table public.c3_env_connection_message
  add constraint c3_env_connection_message_body_null_check check (body is null),
  add constraint c3_env_connection_message_payload_ref_check check (
    payload_ref is not null and payload_ref like 'private://cancom_personal_message_payload/%'
  ),
  add constraint c3_env_connection_message_content_sha256_check check (
    content_sha256 is not null and content_sha256 ~ '^[0-9a-f]{64}$'
  ),
  add constraint c3_env_connection_message_visibility_check check (
    content_visibility='participants_only'
  ),
  add constraint c3_env_connection_message_payload_custody_check check (
    payload_custody_type='private_cancom_payload'
  );

alter table public.c3_env_connection_message
  alter column payload_ref set not null,
  alter column content_sha256 set not null,
  alter column content_visibility set default 'participants_only',
  alter column content_visibility set not null,
  alter column payload_custody_type set default 'private_cancom_payload',
  alter column payload_custody_type set not null;

create or replace function private.externalize_connection_message_body_v1()
returns trigger
language plpgsql
security invoker
set search_path=''
as $$
declare
  v_payload_key uuid;
  v_hash text;
begin
  if new.body is null then
    if new.payload_ref is null or new.content_sha256 is null then
      raise exception 'personal_message_payload_required';
    end if;
    return new;
  end if;

  if length(btrim(new.body)) < 1 or length(btrim(new.body)) > 5000 then
    raise exception 'personal_message_body_invalid';
  end if;

  v_payload_key:=gen_random_uuid();
  v_hash:=encode(digest(convert_to(btrim(new.body),'UTF8'),'sha256'),'hex');

  insert into private.cancom_personal_message_payload(
    payload_key,message_key,connection_key,sender_relationship_key,content_type,body,
    content_sha256,visibility,custody_standing,migrated_from_registry,created_at
  ) values (
    v_payload_key,new.message_key,new.connection_key,new.sender_relationship_key,'text/plain',btrim(new.body),
    v_hash,'participants_only',
    case when new.standing='removed' then 'removed' else 'active' end,
    false,coalesce(new.created_at,now())
  );

  new.payload_ref:='private://cancom_personal_message_payload/'||v_payload_key::text;
  new.content_sha256:=v_hash;
  new.content_visibility:='participants_only';
  new.payload_custody_type:='private_cancom_payload';
  new.metadata:=coalesce(new.metadata,'{}'::jsonb)||jsonb_build_object(
    'registry_envelope_only',true,
    'content_externalized',true,
    'content_authority',false
  );
  new.body:=null;
  return new;
end
$$;

revoke all on function private.externalize_connection_message_body_v1() from public, anon, authenticated;
grant execute on function private.externalize_connection_message_body_v1() to service_role;

drop trigger if exists c3_env_connection_message_externalize_body_v1 on public.c3_env_connection_message;
create trigger c3_env_connection_message_externalize_body_v1
before insert on public.c3_env_connection_message
for each row execute function private.externalize_connection_message_body_v1();

create or replace function public.resolve_c1me_connection_messages_internal(
  p_connection_key text,
  p_requester_relationship_key text
)
returns jsonb
language plpgsql
stable
security invoker
set search_path=''
as $$
declare
  v_connection public.c3_env_native_connection%rowtype;
  v_messages jsonb;
begin
  select * into v_connection
  from public.c3_env_native_connection
  where connection_key=p_connection_key
    and standing='active'
    and revoked_at is null;

  if not found then
    return jsonb_build_object('standing','HLD','reason','connection_unavailable','messages','[]'::jsonb);
  end if;

  if p_requester_relationship_key not in (v_connection.source_relationship_key,v_connection.target_relationship_key) then
    return jsonb_build_object('standing','HLD','reason','connection_message_not_authorized','messages','[]'::jsonb);
  end if;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'message_key',m.message_key,
      'connection_key',m.connection_key,
      'sender_relationship_key',m.sender_relationship_key,
      'message_type',m.message_type,
      'body',p.body,
      'standing',m.standing,
      'created_at',m.created_at,
      'content_sha256',m.content_sha256,
      'content_visibility',m.content_visibility
    )
    order by m.created_at
  ),'[]'::jsonb)
  into v_messages
  from public.c3_env_connection_message m
  join private.cancom_personal_message_payload p
    on m.payload_ref='private://cancom_personal_message_payload/'||p.payload_key::text
   and p.message_key=m.message_key
  where m.connection_key=p_connection_key
    and m.standing='active'
    and p.custody_standing='active';

  return jsonb_build_object(
    'standing','resolved',
    'connection_key',p_connection_key,
    'content_visibility','participants_only',
    'messages',v_messages
  );
end
$$;

revoke all on function public.resolve_c1me_connection_messages_internal(text,text) from public, anon, authenticated;
grant execute on function public.resolve_c1me_connection_messages_internal(text,text) to service_role;

create or replace function public.record_c1me_connection_message_internal(
  p_connection_key text,
  p_sender_relationship_key text,
  p_message_type text,
  p_body text
)
returns jsonb
language plpgsql
security invoker
set search_path=''
as $$
declare
  v_connection public.c3_env_native_connection%rowtype;
  v_message public.c3_env_connection_message%rowtype;
begin
  if nullif(btrim(p_body),'') is null or length(btrim(p_body)) > 5000 then
    return jsonb_build_object('standing','HLD','reason','connection_message_invalid');
  end if;

  if p_message_type not in ('note','introduction','opportunity','follow_up') then
    return jsonb_build_object('standing','HLD','reason','connection_message_type_invalid');
  end if;

  select * into v_connection
  from public.c3_env_native_connection
  where connection_key=p_connection_key
    and standing='active'
    and revoked_at is null
  for share;

  if not found then
    return jsonb_build_object('standing','HLD','reason','connection_unavailable');
  end if;

  if p_sender_relationship_key not in (v_connection.source_relationship_key,v_connection.target_relationship_key) then
    return jsonb_build_object('standing','HLD','reason','connection_message_not_authorized');
  end if;

  insert into public.c3_env_connection_message(
    connection_key,sender_relationship_key,message_type,body,standing,metadata
  ) values (
    p_connection_key,p_sender_relationship_key,p_message_type,btrim(p_body),'active',
    jsonb_build_object(
      'source','my_environment_cancom',
      'registry_standing_created',false,
      'authority_created',false,
      'registry_envelope_only',true
    )
  )
  returning * into v_message;

  insert into public.c3_env_native_connection_event(
    connection_key,event_type,actor_relationship_key,share_reference,event_data
  ) values (
    p_connection_key,'message_sent',p_sender_relationship_key,null,
    jsonb_build_object(
      'message_key',v_message.message_key,
      'message_type',p_message_type,
      'payload_ref',v_message.payload_ref,
      'content_sha256',v_message.content_sha256,
      'content_visibility','participants_only'
    )
  );

  return jsonb_build_object(
    'standing','connection_message_recorded',
    'message',jsonb_build_object(
      'message_key',v_message.message_key,
      'connection_key',v_message.connection_key,
      'sender_relationship_key',v_message.sender_relationship_key,
      'message_type',v_message.message_type,
      'body',btrim(p_body),
      'standing',v_message.standing,
      'created_at',v_message.created_at,
      'content_sha256',v_message.content_sha256,
      'content_visibility',v_message.content_visibility
    )
  );
end
$$;

revoke all on function public.record_c1me_connection_message_internal(text,text,text,text) from public, anon, authenticated;
grant execute on function public.record_c1me_connection_message_internal(text,text,text,text) to service_role;

insert into public.concordance_term
(term_key,version_key,term_label,canonical_definition,axis,circuit,role,resolves_to,term_standing,visibility_standing,source_excerpt,metadata)
values (
 'cancom_v1_personal_payload_privacy_boundary',
 'cancom_concordance_v1',
 'Personal Payload Privacy Boundary',
 'Personal communication content is not Registry state. Registry may retain the minimum relational and passage envelope required to resolve, deliver, verify, and return a communication, including identifiers, relation references, timestamps, custody references, integrity values, and standing. The conversational payload itself remains in separate private CanCom custody and is visible only through an authorized participating relation. Content does not create authority, standing, or relationship.',
 'Boundary','cancom','personal communication privacy boundary','private CanCom payload custody',
 'active','internal',null,
 jsonb_build_object(
   'registry_envelope_only',true,
   'content_visibility','participants_only',
   'content_authority',false,
   'payload_evidence_separation',true,
   'cryptographic_participant_only_encryption','future_hardening_not_yet_claimed'
 )
)
on conflict (term_key) do nothing;

update public.system_process_registry
set metadata=metadata||jsonb_build_object(
  'personal_message_privacy_boundary','cancom_v1_personal_payload_privacy_boundary',
  'personal_message_registry_role','envelope_and_passage_evidence_only',
  'personal_message_payload_custody','private.cancom_personal_message_payload',
  'personal_message_content_visibility','participants_only',
  'plaintext_message_body_in_registry_allowed',false
),
updated_at=now()
where process_key in ('c1me_relational_runtime_v1','cancom_oar_delivery_retrieval_v1');

commit;
