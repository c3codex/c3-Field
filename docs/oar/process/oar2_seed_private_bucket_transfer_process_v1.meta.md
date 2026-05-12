---
document_type: oar2
authority_level: working
document_scope: private_bucket_transfer_process
title: OAR2 — Seed Private Bucket Transfer Process
status: proposed
version: v1
operator: op044
system: process
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# OAR2 — Seed Private Bucket Transfer Process

## OBSERVED

The media authority process seed was written, confirmed, and committed.

Attempted operator-side bucket transfer failed because the active PowerShell session did not have:

- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

This exposed a process gap:

    precheck is not transfer

Manual transfer creates extra contact points and env risk.

Cody already operates through OAR2 and can execute bounded transfer more cleanly when transfer scope is explicit.

## ALIGNED

Codex remains authority.

Field structures transfer relation.

Measures registers process seed location.

Chazz routes the transfer process.

Cody executes only from this OAR2.

This OAR2 authorizes Cody to seed a private bucket transfer process and transfer the confirmed media authority process seed into the private measures-seed bucket.

## ROUTED

### 1. Create transfer process seed doc

Create:

    docs/process/transfer/seed_bucket_transfer_process.meta.md

The process must define:

- precheck is not transfer
- bucket transfer requires explicit source path
- bucket transfer requires explicit bucket name
- bucket transfer requires explicit object path
- bucket transfer requires explicit content type
- env vars must be checked before transfer
- VITE vars are not transfer credentials
- transfer must return success evidence
- operator confirms object exists after transfer
- no transfer is complete without verification

### 2. Transfer media process seed

Transfer source file:

    docs/process/media/media_authority_governance_process_seed.meta.md

Target bucket:

    measures-seed

Target object path:

    process/media/media_authority_governance_process_seed.meta.md

Content type:

    text/markdown

Upsert:

    true

### 3. Validate transfer

Cody must validate:

- source file exists
- target bucket exists or transfer endpoint accepts bucket
- object upload succeeds
- object path is returned
- uploaded object can be read or metadata-confirmed through authorized check

### 4. Write OAR1 closeout

Create:

    docs/oar/process/oar1_seed_private_bucket_transfer_process_v1.meta.md

OAR1 must report:

- process seed file created
- media process seed transferred
- bucket/object path
- validation method
- mutation count
- errors if any

## CODY ROLE

Cody may:

- write the transfer process seed doc
- perform the private bucket upload
- validate upload result
- write OAR1 closeout

Cody may not:

- expose service role credentials
- use VITE publishable credentials for transfer
- transfer unrelated files
- mutate unrelated bucket objects
- delete bucket objects
- change media authority seed content

## VALIDATION

This OAR2 resolves successfully when:

1. transfer process seed exists
2. media authority process seed is uploaded to measures-seed
3. uploaded object path is confirmed
4. OAR1 closeout is written
5. no unrelated bucket/object mutation occurred

## EXPECTED OAR1

    docs/oar/process/oar1_seed_private_bucket_transfer_process_v1.meta.md

## CLOSE

Precheck is not transfer.

Use Cody for bounded bucket transfer.

Reduce contact points.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
