---
document_type: oar2
authority_level: working
document_scope: private_governance_evidence_authority
title: OAR2 — Establish Private Measures of Inanna Governance Evidence Authority
status: confirmed
version: v1
operator: op044
system: measures_registry
target_environment: measures_of_inanna
execution_mode: private_repository_creation_and_evidence_transfer
private_repository: c3codex/measures-of-inanna-governance
---

# OAR2 — Establish Private Measures of Inanna Governance Evidence Authority

## OBSERVED

The Measures of Inanna Audit 01 evidence is ready for terminal commit.

The only configured Git remote is:

`origin → c3codex/c3-Field`

That repository is public.

The Audit 01 lineage contains sensitive internal operational and security evidence, including:

- Supabase schema details
- RLS policy definitions
- release-authority behavior
- anonymous-role readback evidence
- view-security behavior
- unresolved live security findings

Pushing this lineage to the public c3-Field repository would disclose sensitive findings.

No private governance or evidence repository is currently configured or documented.

The operator has confirmed creation of:

`c3codex/measures-of-inanna-governance`

as a private repository for Measures of Inanna governance evidence.

## ALIGNED

Measures of Inanna requires an explicit private evidence authority separate from its public runtime and deployment surfaces.

The public repository must remain untouched by this operation.

The private repository must:

- be created with visibility `PRIVATE`
- contain only governed evidence selected for transfer
- use a separate checkout
- preserve repository-relative evidence paths
- contain no c3-Field application history
- contain no runtime build output
- contain no database credentials or secret values
- have GitHub Pages disabled
- receive no deployment configuration
- provide a terminal commit binding Audit 01 evidence

No Audit finding is remediated by this operation.

No database, runtime, deployment, release, access, policy, function, view, cron, or migration mutation is authorized.

## ROUTED

### 1. Verify source and authentication

Identify the current c3-Field repository root.

Record:

- current branch
- current HEAD
- public origin URL
- local Audit 01 commit, if already created
- working-tree standing for the governed evidence files

Verify GitHub authentication can access the `c3codex` owner.

Do not display authentication tokens or credentials.

If authentication or ownership cannot be verified, stop with:

`private_repository_authority_unverified`

### 2. Protect the public repository

Before creating the private repository, record:

- public origin URL
- public origin visibility
- current public branch
- public remote HEAD

Do not:

- push to `c3codex/c3-Field`
- push any tag to the public origin
- change the public origin URL
- force-push
- alter public repository visibility
- add the private repository as a remote inside the public working checkout
- publish the audit through GitHub Pages or another deployment surface

After completion, verify the public remote HEAD is unchanged.

### 3. Verify or create the private repository

Target:

`c3codex/measures-of-inanna-governance`

First determine whether it already exists.

If it exists:

- verify owner is exactly `c3codex`
- verify repository name is exactly `measures-of-inanna-governance`
- verify visibility is exactly `PRIVATE`
- verify it does not contain conflicting history
- stop if it is public, internal, inaccessible, or unexpectedly populated

If it does not exist:

- create it as a private repository
- do not initialize it with README, license, template, Pages, Actions workflow, or deployment configuration
- use description: `Private governance evidence authority for Measures of Inanna`
- verify visibility from GitHub after creation

No evidence may be copied or pushed until GitHub reports visibility:

`PRIVATE`

If visibility cannot be proven, stop with:

`private_visibility_not_proven`

### 4. Create an isolated checkout

Create a new sibling working directory outside the c3-Field repository.

Suggested directory name:

`measures-of-inanna-governance`

Initialize a new Git repository with branch:

`main`

Configure its `origin` to the private repository only.

Verify:

- the new checkout is not nested inside c3-Field
- its origin points only to `c3codex/measures-of-inanna-governance`
- it contains no c3-Field Git history
- it contains no application source, node modules, build output, environment files, or deployment configuration

### 5. Select the governed Audit 01 lineage

Use:

`docs/oar/measures_registry/audit01_measures_of_inanna_authority_release_closeout_manifest_v4.meta.md`

as the authoritative 33-file inventory.

Copy exactly those 33 governed files from the source repository into the isolated checkout, preserving:

`docs/oar/measures_registry/<filename>`

Also copy this OAR2 into the same directory as file 34:

`docs/oar/measures_registry/oar2_establish_private_measures_of_inanna_governance_evidence_authority_v1.meta.md`

Do not copy unrelated Measures Registry, c3-Field, runtime, media, application, build, or database files.

For the 33 Audit files:

- verify presence
- verify bytes
- verify lines
- verify SHA-256 against Manifest v4

For this OAR2:

- record bytes
- record lines
- record SHA-256

Stop if any Audit file differs from its governed hash.

### 6. Perform secret-safety inspection

Before committing, scan the isolated checkout for credential-like material.

Check for:

- Supabase service-role keys
- private API keys
- GitHub tokens
- Cloudflare tokens
- Stripe secret keys
- database passwords
- private keys
- bearer tokens
- `.env` files
- credential-bearing connection strings

Do not print discovered secret values.

If a potential secret is found:

- report only the file path, line number, and secret category
- stop before commit or push
- classify as `secret_review_required`

Project identifiers, schema names, policy names, and redacted security findings are not credentials by themselves. Do not remove governed evidence merely because it is sensitive; privacy is provided by the private repository.

### 7. Create private evidence-authority record

Create:

`docs/oar/measures_registry/measures_of_inanna_private_governance_evidence_authority_v1.meta.md`

Record:

- repository: `c3codex/measures-of-inanna-governance`
- required visibility: `PRIVATE`
- branch: `main`
- evidence scope: Measures of Inanna internal governance and Audit evidence
- public repository: `c3codex/c3-Field`
- public-push standing: prohibited for sensitive evidence
- deployment authority: not established by this repository
- GitHub Pages: disabled
- Audit 01 source manifest: Manifest v4
- governed Audit file count: 33
- OAR2 included: yes
- credential scan result
- authority standing before first commit: `private_evidence_authority_prepared`
- operator: op044

State that runtime deployment and security remediation remain separate authorities.

### 8. Create transfer manifest

Create:

`docs/oar/measures_registry/measures_of_inanna_private_evidence_transfer_manifest_v1.meta.md`

Inventory:

- the 33 Audit 01 files
- this private-authority OAR2
- the private evidence-authority record
- this transfer manifest

Expected first-commit file count:

36

For every non-self file record:

- path
- bytes
- lines
- SHA-256
- source standing
- transfer standing

Apply the established self-hash boundary to the transfer manifest itself.

### 9. Create and push the evidence commit

In the isolated private checkout only:

- stage exactly the 36 governed files
- verify no unexpected file is staged
- commit with message:

`Seat private Measures of Inanna governance evidence authority`

Record this as the evidence commit.

Before pushing, re-verify the remote repository visibility is `PRIVATE`.

Push only:

`main → private origin/main`

Do not push any other branch or tag.

After pushing, verify:

- remote main commit equals the local evidence commit
- repository visibility remains `PRIVATE`
- GitHub Pages is not enabled
- public c3-Field remote HEAD remains unchanged

### 10. Create OAR1

After the evidence commit is successfully present on the private remote, create:

`docs/oar/measures_registry/oar1_establish_private_measures_of_inanna_governance_evidence_authority_v1.meta.md`

Record:

- private repository URL
- verified visibility
- isolated-checkout path
- evidence commit hash
- remote evidence commit hash
- source Audit file count
- transferred file count
- secret-safety result
- public c3-Field remote standing
- public push count: 0
- database mutation count: 0
- application mutation count: 0
- deployment mutation count: 0
- Pages standing
- unresolved findings preserved
- validation result

Do not include credentials or secret values.

### 11. Create private-authority closeout manifest

Create:

`docs/oar/measures_registry/measures_of_inanna_private_governance_evidence_closeout_manifest_v1.meta.md`

Inventory the 36 evidence-commit files plus:

- OAR1
- this closeout manifest

Expected final private file count:

38

For every non-self file record:

- path
- presence
- bytes
- lines
- SHA-256
- standing

Apply the established self-hash boundary to the closeout manifest.

### 12. Create and push the closeout commit

Stage only:

- OAR1
- private-authority closeout manifest

Commit with message:

`Close private Measures of Inanna governance evidence authority`

Before pushing, verify the remote remains `PRIVATE`.

Push only the private `main` branch.

After pushing, record:

- evidence commit hash
- closeout commit hash
- remote main hash
- repository visibility
- public origin unchanged
- public push count: 0

The remote closeout commit is the terminal proof for the private 38-file authority set.

### 13. Final repository checks

Verify:

- private repository visibility: `PRIVATE`
- private default branch: `main`
- private remote main equals closeout commit
- GitHub Pages: disabled
- unexpected files: 0
- public c3-Field push count: 0
- public c3-Field remote HEAD unchanged
- database mutations: 0
- application mutations: 0
- deployment mutations: 0
- security remediations: 0

Do not treat private repository creation as deployment to `measuresofinanna.com`.

### 14. Stop conditions

Stop without pushing if:

- GitHub authentication is unresolved
- owner cannot be verified
- the target repository is not private
- the target repository contains conflicting history
- any governed Audit file fails its hash
- a credential or secret requires review
- the isolated checkout contains unexpected files
- the remote points to c3-Field
- GitHub Pages is enabled unexpectedly
- a public push would occur
- a force push would be required

## CODY ROLE

Cody may:

- verify GitHub authentication and repository visibility
- create the confirmed private repository
- create an isolated checkout
- copy only the governed evidence
- run credential-safety checks
- create the private authority record and manifests
- commit and push only to the verified private repository
- create OAR1
- create and push the closeout commit
- return terminal hashes

Cody may not:

- push to c3-Field
- publish evidence publicly
- expose credentials
- alter repository visibility away from private
- enable Pages or deployment
- copy unrelated source or history
- remediate Audit findings
- mutate database or runtime state
- force-push
- invent another repository name or owner

## VALIDATION

This operation succeeds only when:

1. `c3codex/measures-of-inanna-governance` exists
2. GitHub reports visibility `PRIVATE`
3. the isolated checkout contains no c3-Field Git history
4. all 33 Audit files match Manifest v4
5. the OAR2 and authority records are included
6. credential-safety inspection passes
7. evidence commit is pushed only to private `main`
8. OAR1 exists
9. private closeout manifest accounts for 38 files
10. closeout commit is pushed only to private `main`
11. remote main equals the closeout commit
12. GitHub Pages is disabled
13. public c3-Field remote HEAD is unchanged
14. public push count is 0
15. all operational mutation counts are 0

Final standing:

`private_governance_evidence_authority_seated_audit01_terminally_bound`

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_establish_private_measures_of_inanna_governance_evidence_authority_v1.meta.md`

## CLOSE

Sensitive evidence remains private.

The public runtime repository remains untouched.

Audit 01 receives remote terminal proof.

Deployment and remediation remain separate governed actions.
