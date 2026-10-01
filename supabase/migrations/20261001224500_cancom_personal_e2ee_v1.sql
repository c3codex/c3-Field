begin;

create table if not exists public.c3_cancom_device_key (
  device_key text primary key,
  relationship_key text not null,
  env_key text not null,
  envpac_key text not null,
  encryption_public_key text not null,
  signing_public_key text not null,
  encryption_algorithm text not null default 'X25519',
  signing_algorithm text not null default 'Ed25519',
  key_fingerprint text not null,
  standing text not null default 'active',
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  constraint c3_cancom_device_key_fingerprint_check check (key_fingerprint ~ '^[0-9a-f]{64}$'),
  constraint c3_cancom_device_key_standing_check check (standing in ('active','revoked')),
  constraint c3_cancom_device_key_algorithms_check check (encryption_algorithm='X25519' and signing_algorithm='Ed25519')
);
create index if not exists c3_cancom_device_key_relationship_idx
  on public.c3_cancom_device_key(relationship_key,standing,last_seen_at desc);
alter table public.c3_cancom_device_key enable row level security;
revoke all on public.c3_cancom_device_key from public,anon,authenticated;
grant select,insert,update on public.c3_cancom_device_key to service_role;

grant usage on schema private to service_role;
revoke all on schema private from anon, authenticated;

alter table private.cancom_personal_message_payload alter column body drop not null;
alter table private.cancom_personal_message_payload
  add column if not exists payload_mode text,
  add column if not exists ciphertext text,
  add column if not exists content_iv text,
  add column if not exists sender_device_key text,
  add column if not exists crypto_protocol text,
  add column if not exists crypto_version text,
  add column if not exists key_wraps jsonb,
  add column if not exists signature text,
  add column if not exists signature_algorithm text,
  add column if not exists additional_data text,
  add column if not exists integrity_basis text;
update private.cancom_personal_message_payload
set payload_mode=coalesce(payload_mode,'legacy_private'),
    integrity_basis=coalesce(integrity_basis,'plaintext_sha256_legacy')
where payload_mode is null or integrity_basis is null;
alter table private.cancom_personal_message_payload
  alter column payload_mode set default 'legacy_private',
  alter column payload_mode set not null,
  alter column integrity_basis set not null;
alter table private.cancom_personal_message_payload
  drop constraint if exists cancom_personal_message_payload_mode_check;
alter table private.cancom_personal_message_payload
  add constraint cancom_personal_message_payload_mode_check check (
    (payload_mode='legacy_private' and body is not null and ciphertext is null and integrity_basis='plaintext_sha256_legacy')
    or
    (payload_mode='e2ee_ciphertext' and body is null and ciphertext is not null and content_iv is not null
      and sender_device_key is not null and crypto_protocol='c3_cancom_e2ee_v1' and crypto_version='1'
      and jsonb_typeof(key_wraps)='array' and jsonb_array_length(key_wraps)>=2
      and signature is not null and signature_algorithm='Ed25519'
      and additional_data is not null and integrity_basis='ciphertext_sha256')
  );

alter table public.c3_env_connection_message
  add column if not exists payload_mode text,
  add column if not exists sender_device_key text,
  add column if not exists crypto_protocol text,
  add column if not exists crypto_version text,
  add column if not exists integrity_basis text;
update public.c3_env_connection_message
set payload_mode=coalesce(payload_mode,'legacy_private'),
    integrity_basis=coalesce(integrity_basis,'plaintext_sha256_legacy')
where payload_mode is null or integrity_basis is null;
alter table public.c3_env_connection_message
  alter column payload_mode set default 'legacy_private',
  alter column payload_mode set not null,
  alter column integrity_basis set not null;
alter table public.c3_env_connection_message
  drop constraint if exists c3_env_connection_message_payload_mode_check;
alter table public.c3_env_connection_message
  add constraint c3_env_connection_message_payload_mode_check check (
    (payload_mode='legacy_private' and sender_device_key is null and crypto_protocol is null
      and crypto_version is null and integrity_basis='plaintext_sha256_legacy')
    or
    (payload_mode='e2ee_ciphertext' and sender_device_key is not null
      and crypto_protocol='c3_cancom_e2ee_v1' and crypto_version='1'
      and integrity_basis='ciphertext_sha256')
  );

create or replace function public.register_cancom_device_key_internal(
  p_device_key text,p_relationship_key text,p_env_key text,p_envpac_key text,
  p_encryption_public_key text,p_signing_public_key text
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare v_existing public.c3_cancom_device_key%rowtype; v_fingerprint text;
begin
  if nullif(btrim(p_device_key),'') is null or nullif(btrim(p_relationship_key),'') is null
     or nullif(btrim(p_env_key),'') is null or nullif(btrim(p_envpac_key),'') is null
  then return jsonb_build_object('standing','HLD','reason','device_registration_invalid'); end if;
  begin
    if octet_length(decode(p_encryption_public_key,'base64'))<>32
       or octet_length(decode(p_signing_public_key,'base64'))<>32
    then return jsonb_build_object('standing','HLD','reason','device_public_key_invalid'); end if;
  exception when others then
    return jsonb_build_object('standing','HLD','reason','device_public_key_invalid');
  end;
  if not exists (
    select 1 from public.c3_envpac p where p.envpac_key=p_envpac_key and p.env_key=p_env_key
      and p.owner_subject_key=p_relationship_key and p.standing='effective' and p.is_effective=true
  ) then return jsonb_build_object('standing','HLD','reason','device_environment_relation_unresolved'); end if;
  v_fingerprint:=encode(digest(convert_to(p_encryption_public_key||':'||p_signing_public_key,'UTF8'),'sha256'),'hex');
  select * into v_existing from public.c3_cancom_device_key where device_key=p_device_key;
  if found then
    if v_existing.relationship_key<>p_relationship_key or v_existing.env_key<>p_env_key
       or v_existing.envpac_key<>p_envpac_key or v_existing.encryption_public_key<>p_encryption_public_key
       or v_existing.signing_public_key<>p_signing_public_key
    then return jsonb_build_object('standing','HLD','reason','device_key_conflict'); end if;
    update public.c3_cancom_device_key set last_seen_at=now(),standing='active',revoked_at=null where device_key=p_device_key;
    return jsonb_build_object('standing','device_ready','device_key',p_device_key,'key_fingerprint',v_fingerprint,'existing',true);
  end if;
  insert into public.c3_cancom_device_key(
    device_key,relationship_key,env_key,envpac_key,encryption_public_key,signing_public_key,key_fingerprint,standing,metadata
  ) values (
    p_device_key,p_relationship_key,p_env_key,p_envpac_key,p_encryption_public_key,p_signing_public_key,v_fingerprint,'active',
    jsonb_build_object('source','my_environment_device_registration','private_key_custody','device_only',
      'registry_holds_private_key',false,'e2ee_protocol','c3_cancom_e2ee_v1')
  );
  return jsonb_build_object('standing','device_ready','device_key',p_device_key,'key_fingerprint',v_fingerprint,'existing',false);
end $$;
revoke all on function public.register_cancom_device_key_internal(text,text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.register_cancom_device_key_internal(text,text,text,text,text,text) to service_role;

create or replace function public.resolve_cancom_connection_devices_internal(
  p_connection_key text,p_requester_relationship_key text
) returns jsonb language plpgsql stable security invoker set search_path='' as $$
declare v_connection public.c3_env_native_connection%rowtype; v_devices jsonb;
begin
  select * into v_connection from public.c3_env_native_connection
  where connection_key=p_connection_key and standing='active' and revoked_at is null;
  if not found then return jsonb_build_object('standing','HLD','reason','connection_unavailable','devices','[]'::jsonb); end if;
  if p_requester_relationship_key not in (v_connection.source_relationship_key,v_connection.target_relationship_key)
  then return jsonb_build_object('standing','HLD','reason','connection_message_not_authorized','devices','[]'::jsonb); end if;
  select coalesce(jsonb_agg(jsonb_build_object(
    'device_key',d.device_key,'relationship_key',d.relationship_key,
    'encryption_public_key',d.encryption_public_key,'signing_public_key',d.signing_public_key,
    'key_fingerprint',d.key_fingerprint,
    'participant_role',case when d.relationship_key=p_requester_relationship_key then 'requester' else 'peer' end,
    'created_at',d.created_at
  ) order by d.relationship_key,d.created_at,d.device_key),'[]'::jsonb)
  into v_devices from public.c3_cancom_device_key d
  where d.standing='active' and d.revoked_at is null
    and d.relationship_key in (v_connection.source_relationship_key,v_connection.target_relationship_key);
  return jsonb_build_object('standing','resolved','connection_key',p_connection_key,'devices',v_devices);
end $$;
revoke all on function public.resolve_cancom_connection_devices_internal(text,text) from public,anon,authenticated;
grant execute on function public.resolve_cancom_connection_devices_internal(text,text) to service_role;

create or replace function public.record_c1me_connection_ciphertext_internal(
  p_message_key uuid,p_connection_key text,p_sender_relationship_key text,p_sender_device_key text,
  p_message_type text,p_ciphertext text,p_content_iv text,p_key_wraps jsonb,p_signature text,
  p_additional_data text,p_ciphertext_sha256 text
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare
  v_connection public.c3_env_native_connection%rowtype;
  v_peer_relationship_key text;
  v_payload_key uuid:=gen_random_uuid();
  v_device public.c3_cancom_device_key%rowtype;
  v_computed_hash text;
begin
  if p_message_type not in ('note','introduction','opportunity','follow_up')
  then return jsonb_build_object('standing','HLD','reason','connection_message_type_invalid'); end if;
  if nullif(btrim(p_ciphertext),'') is null or length(p_ciphertext)>12000
     or nullif(btrim(p_content_iv),'') is null or nullif(btrim(p_signature),'') is null
     or nullif(btrim(p_additional_data),'') is null or jsonb_typeof(p_key_wraps)<>'array'
     or jsonb_array_length(p_key_wraps)<2 or p_ciphertext_sha256 !~ '^[0-9a-f]{64}$'
  then return jsonb_build_object('standing','HLD','reason','encrypted_payload_invalid'); end if;
  begin
    v_computed_hash:=encode(digest(decode(p_ciphertext,'base64'),'sha256'),'hex');
  exception when others then
    return jsonb_build_object('standing','HLD','reason','encrypted_payload_encoding_invalid');
  end;
  if v_computed_hash<>p_ciphertext_sha256
  then return jsonb_build_object('standing','HLD','reason','ciphertext_integrity_mismatch'); end if;
  select * into v_connection from public.c3_env_native_connection
  where connection_key=p_connection_key and standing='active' and revoked_at is null for share;
  if not found then return jsonb_build_object('standing','HLD','reason','connection_unavailable'); end if;
  if p_sender_relationship_key not in (v_connection.source_relationship_key,v_connection.target_relationship_key)
  then return jsonb_build_object('standing','HLD','reason','connection_message_not_authorized'); end if;
  v_peer_relationship_key:=case when p_sender_relationship_key=v_connection.source_relationship_key
    then v_connection.target_relationship_key else v_connection.source_relationship_key end;
  select * into v_device from public.c3_cancom_device_key
  where device_key=p_sender_device_key and relationship_key=p_sender_relationship_key
    and standing='active' and revoked_at is null;
  if not found then return jsonb_build_object('standing','HLD','reason','sender_device_unresolved'); end if;
  if not exists(select 1 from public.c3_cancom_device_key d
    where d.relationship_key=v_peer_relationship_key and d.standing='active' and d.revoked_at is null)
  then return jsonb_build_object('standing','HLD','reason','recipient_secure_device_unavailable'); end if;
  if exists (
    select 1 from jsonb_array_elements(p_key_wraps) w
    left join public.c3_cancom_device_key d on d.device_key=w->>'device_key' and d.standing='active' and d.revoked_at is null
    where d.device_key is null or d.relationship_key not in (v_connection.source_relationship_key,v_connection.target_relationship_key)
  ) then return jsonb_build_object('standing','HLD','reason','encrypted_key_wrap_invalid'); end if;
  if exists (
    select 1 from public.c3_cancom_device_key d
    where d.standing='active' and d.revoked_at is null
      and d.relationship_key in (v_connection.source_relationship_key,v_connection.target_relationship_key)
      and not exists(select 1 from jsonb_array_elements(p_key_wraps) w where w->>'device_key'=d.device_key)
  ) then return jsonb_build_object('standing','HLD','reason','encrypted_key_wrap_incomplete'); end if;
  if exists(select 1 from public.c3_env_connection_message where message_key=p_message_key)
  then return jsonb_build_object('standing','HLD','reason','message_key_already_exists'); end if;

  insert into private.cancom_personal_message_payload(
    payload_key,message_key,connection_key,sender_relationship_key,content_type,body,content_sha256,
    visibility,custody_standing,migrated_from_registry,created_at,payload_mode,ciphertext,content_iv,
    sender_device_key,crypto_protocol,crypto_version,key_wraps,signature,signature_algorithm,
    additional_data,integrity_basis
  ) values (
    v_payload_key,p_message_key,p_connection_key,p_sender_relationship_key,'application/octet-stream',null,
    p_ciphertext_sha256,'participants_only','active',false,now(),'e2ee_ciphertext',p_ciphertext,p_content_iv,
    p_sender_device_key,'c3_cancom_e2ee_v1','1',p_key_wraps,p_signature,'Ed25519',p_additional_data,'ciphertext_sha256'
  );
  insert into public.c3_env_connection_message(
    message_key,connection_key,sender_relationship_key,message_type,body,standing,created_at,metadata,
    payload_ref,content_sha256,content_visibility,payload_custody_type,payload_mode,sender_device_key,
    crypto_protocol,crypto_version,integrity_basis
  ) values (
    p_message_key,p_connection_key,p_sender_relationship_key,p_message_type,null,'active',now(),
    jsonb_build_object('source','my_environment_cancom_e2ee','registry_standing_created',false,
      'authority_created',false,'registry_envelope_only',true,'plaintext_received_by_server',false,
      'content_visibility','participants_only'),
    'private://cancom_personal_message_payload/'||v_payload_key::text,p_ciphertext_sha256,
    'participants_only','private_cancom_payload','e2ee_ciphertext',p_sender_device_key,
    'c3_cancom_e2ee_v1','1','ciphertext_sha256'
  );
  insert into public.c3_env_native_connection_event(
    connection_key,event_type,actor_relationship_key,share_reference,event_data
  ) values (
    p_connection_key,'message_sent',p_sender_relationship_key,null,
    jsonb_build_object('message_key',p_message_key,'message_type',p_message_type,
      'payload_mode','e2ee_ciphertext','ciphertext_sha256',p_ciphertext_sha256,
      'sender_device_key',p_sender_device_key,'content_visibility','participants_only')
  );
  return jsonb_build_object('standing','connection_message_recorded_e2ee','message',jsonb_build_object(
    'message_key',p_message_key,'connection_key',p_connection_key,'sender_relationship_key',p_sender_relationship_key,
    'message_type',p_message_type,'standing','active','created_at',now(),'payload_mode','e2ee_ciphertext',
    'sender_device_key',p_sender_device_key,'crypto_protocol','c3_cancom_e2ee_v1','crypto_version','1',
    'content_sha256',p_ciphertext_sha256,'content_visibility','participants_only'));
end $$;
revoke all on function public.record_c1me_connection_ciphertext_internal(uuid,text,text,text,text,text,text,jsonb,text,text,text)
  from public,anon,authenticated;
grant execute on function public.record_c1me_connection_ciphertext_internal(uuid,text,text,text,text,text,text,jsonb,text,text,text)
  to service_role;

create or replace function public.resolve_c1me_connection_messages_internal(
  p_connection_key text,p_requester_relationship_key text
) returns jsonb language plpgsql stable security invoker set search_path='' as $$
declare v_connection public.c3_env_native_connection%rowtype; v_messages jsonb;
begin
  select * into v_connection from public.c3_env_native_connection
  where connection_key=p_connection_key and standing='active' and revoked_at is null;
  if not found then return jsonb_build_object('standing','HLD','reason','connection_unavailable','messages','[]'::jsonb); end if;
  if p_requester_relationship_key not in (v_connection.source_relationship_key,v_connection.target_relationship_key)
  then return jsonb_build_object('standing','HLD','reason','connection_message_not_authorized','messages','[]'::jsonb); end if;
  select coalesce(jsonb_agg(
    case when p.payload_mode='legacy_private' then jsonb_build_object(
      'message_key',m.message_key,'connection_key',m.connection_key,'sender_relationship_key',m.sender_relationship_key,
      'message_type',m.message_type,'body',p.body,'standing',m.standing,'created_at',m.created_at,
      'payload_mode','legacy_private','content_visibility',m.content_visibility)
    else jsonb_build_object(
      'message_key',m.message_key,'connection_key',m.connection_key,'sender_relationship_key',m.sender_relationship_key,
      'message_type',m.message_type,'body',null,'standing',m.standing,'created_at',m.created_at,
      'payload_mode','e2ee_ciphertext','sender_device_key',p.sender_device_key,
      'sender_signing_public_key',d.signing_public_key,'sender_key_fingerprint',d.key_fingerprint,
      'crypto_protocol',p.crypto_protocol,'crypto_version',p.crypto_version,'ciphertext',p.ciphertext,
      'content_iv',p.content_iv,'key_wraps',p.key_wraps,'signature',p.signature,
      'signature_algorithm',p.signature_algorithm,'additional_data',p.additional_data,
      'content_sha256',m.content_sha256,'content_visibility',m.content_visibility)
    end order by m.created_at),'[]'::jsonb)
  into v_messages
  from public.c3_env_connection_message m
  join private.cancom_personal_message_payload p
    on m.payload_ref='private://cancom_personal_message_payload/'||p.payload_key::text and p.message_key=m.message_key
  left join public.c3_cancom_device_key d on d.device_key=p.sender_device_key
  where m.connection_key=p_connection_key and m.standing='active' and p.custody_standing='active';
  return jsonb_build_object('standing','resolved','connection_key',p_connection_key,
    'content_visibility','participants_only','messages',v_messages);
end $$;
revoke all on function public.resolve_c1me_connection_messages_internal(text,text) from public,anon,authenticated;
grant execute on function public.resolve_c1me_connection_messages_internal(text,text) to service_role;

create or replace function public.record_c1me_connection_message_internal(
  p_connection_key text,p_sender_relationship_key text,p_message_type text,p_body text
) returns jsonb language sql security invoker set search_path='' as $$
  select jsonb_build_object('standing','HLD','reason','cancom_e2ee_ciphertext_required');
$$;
revoke all on function public.record_c1me_connection_message_internal(text,text,text,text) from public,anon,authenticated;
grant execute on function public.record_c1me_connection_message_internal(text,text,text,text) to service_role;

create or replace function private.reject_connection_message_plaintext_v1()
returns trigger language plpgsql security invoker set search_path='' as $$
begin
  if new.body is not null then raise exception 'cancom_e2ee_ciphertext_required'; end if;
  return new;
end $$;
revoke all on function private.reject_connection_message_plaintext_v1() from public,anon,authenticated;
grant execute on function private.reject_connection_message_plaintext_v1() to service_role;
drop trigger if exists c3_env_connection_message_externalize_body_v1 on public.c3_env_connection_message;
drop trigger if exists c3_env_connection_message_reject_plaintext_v1 on public.c3_env_connection_message;
create trigger c3_env_connection_message_reject_plaintext_v1
before insert or update of body on public.c3_env_connection_message
for each row execute function private.reject_connection_message_plaintext_v1();

insert into public.concordance_term
(term_key,version_key,term_label,canonical_definition,axis,circuit,role,resolves_to,term_standing,visibility_standing,source_excerpt,metadata)
values (
 'cancom_v1_personal_e2ee_boundary','cancom_concordance_v1','Personal End-to-End Encryption Boundary',
 'New personal CanCom communication content must be encrypted inside the originating participant device before leaving that environment and may be decrypted only inside an authorized participating device. Registry and CanCom transport may retain public device keys, ciphertext, custody references, integrity evidence, relation references, and delivery standing, but may not receive or retain new personal-message plaintext or participant private keys. If no qualified recipient device is available, passage holds; plaintext fallback is prohibited.',
 'Boundary','cancom','personal end-to-end encryption boundary','device-encrypted CanCom passage','active','internal',null,
 jsonb_build_object('protocol','c3_cancom_e2ee_v1','content_cipher','AES-256-GCM','key_agreement','X25519',
  'key_derivation','HKDF-SHA-256','signature','Ed25519','private_key_custody','device_only_nonextractable_crypto_key',
  'server_plaintext_allowed',false,'plaintext_fallback_allowed',false,'legacy_messages_e2ee',false,
  'forward_secrecy_standing','not_full_ratchet','post_compromise_security_standing','not_yet_mls_or_double_ratchet',
  'future_group_protocol','MLS_RFC_9420')
) on conflict (term_key) do nothing;

insert into public.system_process_registry(
  process_key,process_family,title,status,source_path,authority_state,metadata,
  process_title,process_scope,process_status,authority_level,source_reference_set,
  required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout
) values (
  'cancom_personal_e2ee_v1','c3_field','CanCom Personal E2EE v1','implemented_pending_runtime_browser_proof',
  'registry://cancom/personal_e2ee/v1','operator_confirmed_registry_held',
  jsonb_build_object('operator','op044','privacy_boundary','cancom_v1_personal_e2ee_boundary',
    'device_key_registry','public.c3_cancom_device_key','ciphertext_custody','private.cancom_personal_message_payload',
    'registry_message_role','envelope_only','plaintext_fallback_allowed',false,'legacy_private_message_count',2,
    'legacy_messages_not_reclassified_e2ee',true,'cryptographic_private_key_custody','browser_device_only',
    'runtime_proof_required',true,
    'forward_secrecy_limit','v1 uses per-message ephemeral X25519 wrapping but recipient long-term device key remains a historical decryption dependency',
    'next_crypto_hardening','MLS or audited ratcheting session protocol for forward secrecy and post-compromise security'),
  'CanCom Personal E2EE v1','personal_my_env_connection_message_end_to_end_encryption','active',
  'governed_security_boundary',
  jsonb_build_array('term:cancom_v1_personal_e2ee_boundary','process:c1me_relational_runtime_v1','process:cancom_oar_delivery_retrieval_v1'),
  'both',true,true,true
) on conflict (process_key) do update
set status=excluded.status,authority_state=excluded.authority_state,metadata=excluded.metadata,
    process_status='active',source_reference_set=excluded.source_reference_set,updated_at=now();

update public.system_process_registry
set metadata=metadata||jsonb_build_object(
  'personal_e2ee_process','cancom_personal_e2ee_v1',
  'new_personal_message_plaintext_allowed',false,
  'new_personal_message_ciphertext_required',true,
  'e2ee_runtime_standing','implemented_pending_browser_proof'
),updated_at=now()
where process_key in ('c1me_relational_runtime_v1','cancom_oar_delivery_retrieval_v1');

notify pgrst, 'reload schema';

commit;
