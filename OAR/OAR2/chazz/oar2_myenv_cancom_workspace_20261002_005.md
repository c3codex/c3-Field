# OAR2 — My Env CanCom Workspace + Directory + Reply Threading — 2026-10-02 — 005

## Route
Operator: op044
Registrar / bounded executor: Chazz
System: c3ops / NUGS / My Env / CanCom / Directory
OAR key: oar2_myenv_cancom_workspace_20261002_005
Execution instance: myenv_cancom_workspace_chazz_005
Standing: EXECUTE_BOUNDED_AFTER_NOTCHAZZ_PASS

## Operator intent
Make My Env materially workable as a communication environment.

Required user-facing behavior:
1. A first-class CanCom workspace in My Env where the Operator can compose, review, edit, and explicitly send a CanCom email.
2. A first-class owner-private Directory in My Env.
3. Manual add/edit of contacts.
4. Successful outbound CanComs automatically upsert the recipient into Directory.
5. Inbound email replies surface back in My Env on the same CanCom thread.
6. Every outbound message is visibly branded and includes an automatic c3 Community Partners signature before confirmation/send.
7. Existing work-card send actions may open the CanCom composer with context prefilled rather than dispatching blindly.

## Brand/signature authority
Public identity source:
c3field_public_identity_authority_v1_0

Canonical brand constants:
- brand: c3 Community Partners
- legal entity: c3 Community Partners DAO, LLC
- model path: Connect · Contribute · Create
- public contact: connect@c3field.online
- public web: c3field.online

Operator signature profile:
- Stephanie Joanne Gaffney
- organization: c3 Community Partners DAO, LLC

Personal title is a separately editable operator-profile field and must not fork the brand identity source.

## Privacy / custody
Directory metadata may be Registry-held owner-private state.
CanCom message bodies must not become general Registry authority state.
Registry stores:
- contact state
- thread/message references
- provider email IDs
- RFC Message-ID / In-Reply-To references
- subject, participants, delivery standing
- hashes / evidence refs
- work-context refs

Email provider remains payload custodian for sent/received body content. My Env fetches provider content server-side when a thread is opened.

## Runtime/state scope
Create owner-private contact state keyed to:
- env_key: env_person_eea672f5a7676dad4316755b
- envpac_key: c3envpac_person_eea672f5a7676dad4316755b_v0_1

Create owner-private CanCom thread/message reference rails for external email.

No contact row creates c3 relationship, participant standing, c3 Key, membership, or relational authority.

## Directory NUG
Implement Directory as a native c3Ops interoperable function and admit it for the Operator My Env after exact preflight.

Directory NUG functions:
- resolve owner-private directory
- upsert contact
- update contact
- derive contact from successful CanCom send or verified inbound reply

Candidate Directory must remain fail-closed until exact capability + authority + context + effect predicates resolve.

## CanCom workspace
Add My Env primitives:
- CanCom
- Directory

CanCom composer must display before send:
- From
- To
- Subject
- full editable message body
- full rendered signature
- work-context reference where present
- CANCEL / SEND controls

No click from a work card may send without this review step.

## Send behavior
Use standing CanCom email NUG:
myenv_cancom_email_op044_v1

Extend send evidence to:
- upsert Directory recipient after provider acceptance
- register outbound thread/message reference
- retrieve provider Message-ID when available
- preserve provider receipt return to CURRENT
- never create relationship standing

## Reply behavior
Implement a signed inbound-provider webhook endpoint.
Preferred adapter: Resend inbound/webhook.
Verify webhook cryptographically before accepting evidence.
Correlate replies using:
- RFC Message-ID
- In-Reply-To
- References
- provider email ID
- normalized sender email

Verified inbound reply must:
- upsert Directory sender
- attach to matching CanCom thread, or create an owner-private external thread if unmatched
- register provider payload reference / hash / metadata
- surface unread reply in My Env
- not create c3 relationship standing

Inbound routing/provider configuration may remain HELD if provider reply-domain/webhook configuration cannot be proven from available authority. Do not fake activation.

## Signature
Automatic signature is part of the previewed body, not an invisible transport footer.

Default:
Stephanie Joanne Gaffney
c3 Community Partners DAO, LLC
Connect · Contribute · Create
connect@c3field.online | c3field.online

Brand constants resolve from canonical public identity authority.
Operator may later edit personal title/profile without changing canonical brand constants.

## Source/deploy authority
Authorized:
- source mutation on chazz/myenv-cancom-workspace-005
- owner-private Registry schema/state for Directory + CanCom thread refs
- service-only APIs for My Env CanCom/Directory
- source-backed identity/signature projection
- provider inbound webhook endpoint
- migration/source durability where tooling permits
- tests/build
- fast-forward c3field after clean anti-race proof
- registered c3-field Cloudflare Pages auto-deploy
- separate standing Directory NUG authority after deployment if preflight passes

Not authorized:
- sending a new external email during implementation
- importing whole external address books
- creating participant/relationship standing
- bulk mail
- attachments
- CC/BCC
- credential disclosure/change
- force push
- direct Wrangler deploy
- reactivating retired c3ops Worker shell
- PAC semantic mutation

## Return
Return OAR1 to:
registry://cancom/oar1_return/myenv_cancom_workspace_chazz_005

## Invariants
The relation is never governed; the environment is governed.
Capability does not imply authority.
Provider is infrastructure, not the NUG.
Directory contact does not imply c3 relationship.
Message payload custody remains outside Registry authority state.
