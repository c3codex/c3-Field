# NUGS runtime foundation

Source authority: `oar2_nugs_runtime_20261001_001`, execution `nugs_runtime_primitive_codex_001`.

This foundation preserves the registered NUG definition and existing PAC, FREE,
CanCom, Calendar, Directory and EnvPAC semantics. Its new internal Registry rails
record bindings and occurrences; they do not grant capability, authority,
relationships, custody or ownership. Existing services remain documentary
candidates until an exact functional passage is admitted.

## Resolution and admission

`register_c3ops_nug_binding_v1` preflights the complete spec before admitting an
active binding. Missing predicates produce `HLD` and no binding insert.
`resolve_c3ops_nug_v1` repeats those checks against live Registry data. The request
must identify the exact origin and receiving environment, EnvPAC, Current State,
executor, execution instance, capability, authority OAR and context binding.

The spec records native process/function identity, a SHA-256 of the catalog
function definition, fixed native input and expected native result standing,
adapter class, effect class and evidence-return relation. The native ABI is an
existing invoker-rights `public.function(jsonb) -> jsonb`; the direct adapter also
requires a stable or immutable function and `effect_class=none`.

The resolved `binding` tuple must appear independently in both the active
EnvPAC capability's `scope.nug_bindings` and the operator-confirmed authority
OAR queue's `automation_permissions.nug_bindings`. The capability must permit
`call_nug`. Neither enumeration creates or substitutes for the other. The
context must already be operator-confirmed, have the exact actor/environment/
capability relation, and cite that OAR as its source authority. Current State
must remain current in the receiving environment's effective EnvPAC.

`registered_adapter` describes already registered infrastructure with an exact
native-function relation. It is never the NUG. Consequential effects additionally
require the same exact `effect_preflights` tuple in the capability and authority
OAR, including binding, effect class, Current State and context. Explicit external
provider permissions must be true; external email also requires explicit external
correspondence permission. These are execution predicates, not permissions
created by this implementation.

## FREE and evidence return

`createFreeNugServerRuntime` uses existing server Registry credentials and four
fixed RPC operations. FREE stores no NUG state and has no provider dispatch. No
new public endpoint, Worker, provider, account or credential is created.

1. `resolve` delegates to live Registry preflight.
2. `callNative` atomically re-preflights, invokes the admitted fixed native input,
   records a replay-guarded occurrence, and attaches its hash-backed evidence to
   the exact Current State. It accepts only the workerless, non-effectful adapter.
3. `prepareEffect` records a preflighted passage awaiting a receipt, without
   dispatching. Preparation is not evidence that an effect happened and does not
   waive re-preflight at the later separately authorized adapter's effect boundary.
4. `returnEffect` links an independently attested Current receipt and a resolved
   Registry custody evidence object to the exact prepared occurrence. It verifies
   execution, actor, native function, authority, effect class, custody and hash
   relations. Supplied receipt identifiers alone are insufficient. Receipt return
   does not claim provider success, advance Current version, or create an effect.

Native occurrence evidence hashes `to_jsonb(occurrence)::text` as UTF-8 with
SHA-256. The row separately records the native result hash and standing; it does
not retain a native result payload in Registry. Evidence tells Current to resolve
again through its existing evidence relation; it does not manufacture a new
Current version or an advancement disposition. Replays are refused. FREE holds
ambiguous responses without retries.

## Standing and verification

The live CanCom, Calendar and Directory candidate records all resolve `HLD`.
There are no live admitted NUG bindings, occurrences, prepared effects or receipts
from this execution. Positive proofs use explicit synthetic authorization in
temporary shadow tables, the deployed NUG bodies, and the existing CanCom native
resolver; all shadow writes roll back. They establish implementation behavior,
not live service admission or external effect authority.

Run `scripts/verify-nugs-runtime.sql` through the authorized Registry SQL surface,
`node --import tsx --test functions/_lib/free-nugs.test.ts`, the focused TypeScript
check and `npm run build:c3field`. Existing CanCom boundary regressions are in
`scripts/verify-cancom-oar007-regressions.sql`.

For the later My Env → Plateau Commons → Humanity AI → CanCom → external email
passage, separately prove the exact native function, receiving environment and
Current, EnvPAC capability, effect OAR, context and existing infrastructure. Admit
that exact binding under its own authority and use an independently authorized
adapter that rechecks effect preflight and returns a verified receipt. This OAR
implements none of that email dispatch and sends no message.
