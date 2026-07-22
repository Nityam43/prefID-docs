# prefID — Design & Internals

This document explains **what prefID is, how every part works, and why each
decision was made**. If you read it end to end, you should be able to defend the
library and answer deep questions about it.

It is written for someone comfortable with JavaScript but not necessarily with
every acronym — hard terms (RNG, CSPRNG, OIDC, ESM/CJS, …) are explained the
first time they appear and collected in the [Glossary](#glossary) at the end.

---

## Table of contents

1. [Overview](#1-overview)
2. [The problem it solves](#2-the-problem-it-solves)
3. [Public API](#3-public-api)
4. [Architecture & file layout](#4-architecture--file-layout)
5. [Deep dive: randomness](#5-deep-dive-randomness)
6. [Deep dive: type safety](#6-deep-dive-type-safety)
7. [Deep dive: uniqueness & collisions](#7-deep-dive-uniqueness--collisions)
8. [Deep dive: sortable IDs](#8-deep-dive-sortable-ids)
9. [Deep dive: cross-runtime compatibility](#9-deep-dive-cross-runtime-compatibility)
10. [Build & packaging](#10-build--packaging)
11. [Testing strategy](#11-testing-strategy)
12. [CI/CD & publishing](#12-cicd--publishing)
13. [Security considerations](#13-security-considerations)
14. [Design decisions & trade-offs](#14-design-decisions--trade-offs)
15. [Comparison with alternatives](#15-comparison-with-alternatives)
16. [Known limitations & future work](#16-known-limitations--future-work)
17. [Interview Q&A](#17-interview-qa)
18. [Glossary](#glossary)

---

## 1. Overview

**prefID** generates short, unique identifiers that carry a **prefix** describing
what they belong to — `user_a8Kd0f2b…`, `order_9f8e7d…`.

Three properties define it:

- **Self-describing** — the prefix tells you the entity type at a glance (logs,
  URLs, database rows).
- **Type-safe** — in TypeScript, `id("user")` has the literal type
  `` `user_${string}` ``, so the compiler stops you from passing a user ID where
  an order ID is expected.
- **Secure & universal** — the random part comes from a cryptographic random
  source, and the package runs on Node, browsers, Deno, Bun, and edge runtimes
  with **zero runtime dependencies**.

It is conceptually **nanoid’s randomness + a prefix + TypeScript types**, with an
optional **sortable** mode (`sortableId`) that adds a time component in the
spirit of ULID and UUIDv7 (see [§8](#8-deep-dive-sortable-ids)).

---

## 2. The problem it solves

Most apps identify records with **UUIDs** (Universally Unique Identifiers) like
`9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d`. Two problems:

1. **They’re opaque.** A UUID in a log line tells you nothing about *what* it is.
   Stripe popularised prefixed IDs (`cus_…`, `pi_…`) precisely because
   `user_a1b2c3` is instantly readable.
2. **They’re untyped.** To a type system every UUID is just `string`, so nothing
   stops you from calling `getOrder(userId)` — a bug that only shows up at
   runtime.

prefID fixes both: a readable prefix **and** a type that encodes that prefix.

---

## 3. Public API

| Export | Purpose |
| --- | --- |
| `id(prefix)` | Generate a prefixed ID with default options. |
| `createId(options?)` | Build a generator with fixed `size` / `separator` / `alphabet`. |
| `sortableId(prefix)` | Generate a **time-ordered** prefixed ID (ULID/UUIDv7-style). |
| `createSortableId(options?)` | Build a sortable generator (`randomSize`, `timestampSize`, `monotonic`, `now`, …). |
| `getTimestamp(id, options?)` | Decode the millisecond timestamp from a sortable ID, or `undefined`. |
| `template(pattern, options?)` | Generate IDs from a custom pattern (`INV-####-####`). |
| `ensureUnique(generate, exists, options?)` | Retry generation until an ID is free in *your* store. |
| `isId(value, prefix, sep?)` | Type guard — narrows `value` to `` `${prefix}_${string}` ``. |
| `getPrefix(value, sep?)` | Extract the prefix, or `undefined`. |
| `BASE32_CROCKFORD` | Crockford Base32 alphabet preset (no `I`/`L`/`O`/`U`; case-insensitive). |
| `PrefixedId<P>` (type) | `` `${P}_${string}` ``. |
| `IdOptions`, `IdGenerator`, `SortableIdOptions`, `GetTimestampOptions`, `TemplateOptions`, `EnsureUniqueOptions` (types) | Public types. |

### Defaults (in `src/constants.ts`)

- `DEFAULT_ALPHABET` = base62 → `0-9A-Za-z` (62 characters).
- `DEFAULT_SIZE` = 24 (random characters after the separator).
- `DEFAULT_SEPARATOR` = `"_"`.
- `MAX_SIZE` = 4096 (upper bound on `size` and on template placeholders).
- `DEFAULT_SORTABLE_RANDOM_SIZE` = 16 (random tail of a sortable ID; ~95 bits).
- `SORTABLE_TIME_MAX` = `2^48 - 1` (largest timestamp the default width encodes —
  the year 10889, matching ULID’s 48-bit time field).
- `BASE32_CROCKFORD` = `0123456789ABCDEFGHJKMNPQRSTVWXYZ` (32 chars; omits the
  ambiguous `I`, `L`, `O`, `U`; already ascending, so it works with `sortableId`).

### Behaviour notes

- `id("user")` → `user_` + 24 random base62 chars.
- `createId({ size, separator, alphabet })` validates its options **once** and
  returns a reusable generator. `id` is literally `createId()` with defaults.
- `sortableId("evt")` → `evt_` + a fixed-width timestamp + a random tail, so a
  plain string sort is also a chronological sort. `createSortableId(options)`
  configures it; `sortableId` is `createSortableId()` with defaults. Full detail
  in [§8](#8-deep-dive-sortable-ids).
- `template("user_####")` → each `#` becomes one random char; everything else is
  literal. Returns a **generator function** you call repeatedly.
- `ensureUnique` defaults to `maxAttempts: 5`; the caller supplies the `exists`
  check (sync or async), so the library stays stateless and DB-agnostic.

---

## 4. Architecture & file layout

```
src/
  index.ts            Public entry (universal build). Barrel of exports.
  index.node.ts       Node-specific entry. Injects node:crypto, then re-exports index.ts.
  constants/
    index.ts          Default alphabet / size / separator / MAX_SIZE / sortable + BASE32_CROCKFORD.
  types/
    index.ts          Public types (PrefixedId, IdOptions, IdGenerator).
  generators/
    generate.ts       createId() + the default id().
    sortable.ts       createSortableId() + sortableId() + getTimestamp().
    template.ts       template().
  utils/
    validate.ts       isId() + getPrefix().
    ensure-unique.ts  ensureUnique().
  internal/
    random.ts         CSPRNG sourcing + randomIndices() + the unbiased randomString.
    prefix.ts         Shared assertValidPrefix() used by every generator.
test/                 One test file per module + smoke tests.
scripts/              Cross-runtime smoke tests (smoke.mjs, smoke.cjs, browser-smoke.html).
```

The source is comment-free: behaviour is documented here in `DESIGN.md` and on
the docs site, and the code is kept self-explanatory through naming.

**Design principle:** the public surface is tiny and each file has one job. The
only genuinely tricky code lives in `internal/random.ts` and `generators/sortable.ts`;
everything else is thin, validated wrappers around them. `randomIndices()` (raw
index sampling) is the shared primitive: `randomString` maps its output to
characters, and `sortable.ts` keeps the raw indices so it can *increment* them
for monotonic ordering (see [§8](#8-deep-dive-sortable-ids)).

---

## 5. Deep dive: randomness

This is the most important part to understand.

### 5.1 Why cryptographic randomness?

IDs must be **unpredictable** (so nobody can guess the next one) and **uniformly
distributed** (so collisions stay maximally unlikely). `Math.random()` is
neither — it’s a fast but predictable PRNG (Pseudo-Random Number Generator) not
meant for security. prefID instead uses a **CSPRNG** (Cryptographically Secure
PRNG), the OS-backed random source exposed as:

- `crypto.getRandomValues()` in browsers / Deno / Bun / edge / modern Node, and
- `crypto.randomFillSync()` in Node.

### 5.2 Turning random bytes into characters — and the *modulo bias* trap

We get random **bytes** (each 0–255) but need **characters** from a 62-char
alphabet. The naive approach:

```js
const index = byte % 62; // ❌ biased
```

is wrong. 256 is not a multiple of 62: `256 = 4×62 + 8`. So byte values map such
that indices **0–7 occur 5 times** across 0–255 while **8–61 occur only 4
times** — meaning the first 8 characters of the alphabet appear ~25% more often.
That is **modulo bias**, and it weakens uniformity (and therefore collision
resistance and unpredictability).

### 5.3 The fix — masking + rejection sampling

prefID uses the same technique as nanoid (`randomIndices` in `internal/random.ts`):

```js
const mask = (2 << Math.floor(Math.log2(radix - 1))) - 1;
const step = Math.ceil((1.6 * mask * size) / radix);
// loop: for each random byte -> index = byte & mask; keep it only if index < radix
```

Step by step, for a 62-char alphabet:

1. **Bitmask.** `Math.log2(61) ≈ 5.93`, floored to `5`; `2 << 5 = 64`; minus 1 =
   **`mask = 63`** (binary `111111`, i.e. 6 bits). `byte & mask` throws away the
   high bits, giving a value in **0–63**.
2. **Rejection.** If the masked value is `< 62`, use it as an index. If it’s 62
   or 63, **reject and try the next byte.** Because every value 0–63 is equally
   likely and we only keep 0–61, the kept values are **perfectly uniform** — no
   modulo bias.
3. **Batching (`step`).** Calling the CSPRNG per character is slow, so we request
   a batch of `step` bytes at once. The `1.6 ×` factor over-allocates to cover
   the expected rejection rate, so a second batch is rarely needed. This is a
   performance optimisation, not a correctness one.

**Interview soundbite:** *“I use masking + rejection sampling instead of modulo,
because 256 isn’t divisible by 62 and modulo would bias the first 8 characters. I
verify uniformity with a statistical test in CI.”*

### 5.4 The pluggable byte provider

`internal/random.ts` exposes a swappable source:

```ts
let bytesProvider = universalProvider;          // default
export function setBytesProvider(p) { bytesProvider = p; }
export function secureRandomBytes(n) { return bytesProvider(n); }
```

`universalProvider` tries `globalThis.crypto.getRandomValues` first, then falls
back to `require("node:crypto").randomFillSync`. The Node-specific entry
(`index.node.ts`) calls `setBytesProvider` to inject a **statically-imported**
`node:crypto` — see [§9](#9-deep-dive-cross-runtime-compatibility) for why this
matters. This is **dependency injection**: the algorithm doesn’t hard-code its
randomness source, so each runtime can supply the right one.

### 5.5 `randomIndices` vs `randomString`

`randomIndices(radix, size)` returns the raw array of `[0, radix)` indices; it is
the single place the masking/rejection logic lives. `randomString(alphabet, size)`
simply maps those indices to characters. The sortable generator needs the raw
indices (not a finished string) so it can **increment** them digit-by-digit for
monotonic ordering — that’s why the primitive is exposed separately.

---

## 6. Deep dive: type safety

### 6.1 Template literal types

`PrefixedId<P>` is defined as:

```ts
export type PrefixedId<P extends string = string> = `${P}_${string}`;
```

This is a **template literal type** — a TypeScript type that describes the
*shape* of a string. `PrefixedId<"user">` is the type `` `user_${string}` ``:
any string starting with `user_`. Because `id`’s signature is
`<P extends string>(prefix: P) => PrefixedId<P>`, calling `id("user")` returns a
value typed `` `user_${string}` ``. `sortableId` shares the same signature and
type, so sortable IDs are just as type-safe.

The payoff:

```ts
function getUser(id: `user_${string}`) { /* … */ }
getUser(id("user"));   // ✅
getUser(id("order"));  // ❌ compile error — order id isn't assignable
```

### 6.2 `template()`’s type inference

`template()` uses **conditional type inference** to extract the literal prefix:

```ts
type RandomTemplate<P extends string> =
  P extends `${infer Head}#${string}` ? `${Head}${string}` : string;
```

`infer Head` captures everything before the first `#`. So
`template("user_####")` returns `` `user_${string}` ``. This only applies to the
single-argument overload (default `#` placeholder); pass custom `options` and it
safely widens to `string`.

### 6.3 Honest limits of the type safety (important to state)

- **Structural, not nominal.** Any string of the right *shape* is assignable — a
  hand-written `"user_hacked"` also type-checks. It prevents *mixing up ID
  variables*, not forging strings.
- **Compile-time only.** At runtime an ID is just a `string`; the guarantee
  disappears once the code runs. For untrusted input you must validate with
  `isId()` (or prefid-zod). This is why `isId` exists.

Stating these limits *unprompted* in an interview signals maturity.

---

## 7. Deep dive: uniqueness & collisions

### 7.1 Probabilistic uniqueness

Like uuid/nanoid, prefID does **not** remember past IDs. It relies on
**probabilistic uniqueness**: the random space is so large that a collision is
effectively impossible.

### 7.2 The entropy math

Entropy (bits of randomness) = `characters × log2(alphabet size)`.

- `id` default: `24 × log2(62) ≈ 143 bits` (a UUIDv4 has 122 random bits, so the
  default is *more* random than a UUID).
- `sortableId` default: `16 × log2(62) ≈ 95 bits` in the random tail — more than
  ULID’s 80 and UUIDv7’s ~74.

“Entropy” is **not** a storage requirement — an ID is just a string in a `text`
column; more entropy only means more characters. Tune it with `size`
(`createId`) or `randomSize` (`createSortableId`), or a denser `alphabet`.

**Birthday bound:** you reach a ~50% chance of *one* collision after roughly the
square root of the space. For the 143-bit default that is `2^71.5 ≈ 4.2 × 10²¹`
IDs: generate a billion per second and it would take tens of thousands of years
to get a coin-flip chance of a single clash. Different prefixes can never collide
(different strings).

### 7.3 The real guarantee

Probability isn’t certainty. For an absolute guarantee you do what you’d do with
any generator: a `UNIQUE` / `PRIMARY KEY` constraint in the database. `ensureUnique`
adds an application-level check for the same purpose, with a `maxAttempts` guard
so a broken `exists` function can’t loop forever.

---

## 8. Deep dive: sortable IDs

`sortableId` / `createSortableId` produce **time-ordered** IDs: a plain
lexicographic (string) sort is also a chronological sort. This is the idea behind
**ULID** and **UUIDv7**, but keeping prefID’s prefix and type.

### 8.1 The format

```
evt_ 00VQ5a1k 0lBjgjfx6pwYy6WkY
│    │        └── random tail (randomSize chars, default 16 ≈ 95 bits)
│    └────────── fixed-width timestamp (timestampSize chars, default 9)
└─────────────── prefix + separator
```

The body is `<timestamp><random>`. Because the timestamp comes first and is a
**fixed width**, comparing two IDs as strings compares their timestamps first.

### 8.2 Why the timestamp must be fixed-width and the alphabet ascending

Lexicographic comparison walks characters left-to-right and stops at the first
difference. Two properties make that match chronological order:

1. **Fixed width (zero-padded).** `"9"` and `"100"` sort as `"100" < "9"` as
   strings, which is wrong numerically. Padding every timestamp to the same width
   (`"009"`, `"100"`) fixes this — shorter-time never sorts after longer-time.
2. **Ascending alphabet.** A string sort uses code-point order. It only matches
   the digit values if the alphabet’s characters are in **strictly ascending
   code-point order**. Base62 (`0-9A-Za-z`) already is; so is `BASE32_CROCKFORD`.
   `createSortableId` **validates** this and throws a `RangeError` otherwise,
   because a non-ascending alphabet would silently break sortability.

The timestamp is the milliseconds since the Unix epoch, encoded in the alphabet’s
radix. The default width is the smallest that holds `SORTABLE_TIME_MAX = 2^48-1`
(the year 10889) — 9 chars in base62, mirroring ULID’s 48-bit time field.
`getTimestamp` reverses the encoding to read the time back out.

### 8.3 Monotonicity (same-millisecond + backward clock)

Wall clocks have only millisecond resolution and can jump **backwards** (NTP
correction, VM pause). Naively, two IDs in the same millisecond would order only
by their random tails — not strictly increasing. So by default the generator is
**monotonic** within a process:

- It keeps the last timestamp and the last tail (as raw indices).
- If the clock reads `<=` the last timestamp, it **reuses** the last timestamp
  and **increments the tail by one** (with carry) instead of drawing a fresh one.
  Incrementing guarantees the new ID is strictly greater than the previous.
- If the tail is ever fully exhausted within a millisecond, it **spills into the
  next millisecond** and draws a fresh tail.

This is the same approach as ULID’s `monotonicFactory`. Pass `monotonic: false`
for a stateless generator ordered only at millisecond granularity. **Scope:**
monotonicity is per-process (in-memory) — it does not span processes or survive a
restart, which is exactly why the random tail (not just a counter) carries the
cross-process uniqueness.

### 8.4 Distributed systems — what it does and does not guarantee

- **Uniqueness across nodes — solid.** Coordination-free schemes get multi-node
  uniqueness from *random bits*, not from a server. Two nodes minting in the same
  millisecond collide only via the birthday bound on the ~95-bit tail — far safer
  than ULID (80 bits) or UUIDv7 (~74). No node IDs required.
- **Ordering across nodes — “k-sorted”, not total.** Two IDs from different nodes
  in the same millisecond order by their random tails (i.e. arbitrarily *within*
  that 1 ms window). This is **exactly** what ULID and UUIDv7 give; no scheme
  achieves true global time-ordering without coordination (a central sequencer,
  or synchronized clocks with uncertainty waits like Spanner’s TrueTime).
- **Clock skew.** The timestamp is wall-clock, so a node whose clock runs ahead
  mints IDs that sort ahead of a slower node’s later IDs. Every timestamp-based
  ID (UUIDv7, ULID, KSUID) shares this; the mitigation is NTP/chrony, not code.
- **vs Snowflake.** Snowflake encodes a **worker/node ID** and a per-ms sequence
  because its 64-bit budget is too small to rely on randomness — so it *must*
  partition, at the cost of assigning unique node IDs (config/coordination) and a
  hard `~4096/ms/node` cap that **blocks** when exceeded. prefID trades that for
  randomness: no node assignment, no hard cap, no blocking — but the ID does not
  encode which node produced it, and the per-ms ordering across nodes is random.

**The prefix caveat.** Because the prefix is leftmost, sortability holds *within a
single prefix* (the normal case: one prefix per table). Across different prefixes
IDs group by prefix first, then time — so a single mixed-prefix stream is not
globally time-sorted by ID alone. Moving the timestamp before the prefix would
fix that but discard the whole point of a prefix-first, readable, typed ID; it is
a deliberate trade, not a bug.

### 8.5 The `BASE32_CROCKFORD` preset

For case-insensitive, unambiguous IDs, pass `BASE32_CROCKFORD` as the `alphabet`.
It is Crockford’s Base32 — the alphabet ULID uses — which omits `I`, `L`, `O`,
`U`, so no `1`/`l` or `0`/`O` confusion, and being single-case it survives
case-folding stores, printed codes, and read-aloud use. It is already ascending,
so it plugs into `createSortableId` directly.

**Interview soundbite:** *“It’s ULID/UUIDv7-style: a fixed-width, ascending-encoded
timestamp so string sort equals time sort, plus ~95 random bits for coordination-
free uniqueness. It’s monotonic within a process and k-sorted across nodes —
which is all any coordination-free scheme can promise.”*

---

## 9. Deep dive: cross-runtime compatibility

This is prefID’s best engineering story.

### 9.1 The runtimes and their random sources

- **Browsers, Deno, Bun, edge, modern Node** expose a global
  `globalThis.crypto.getRandomValues`.
- **Node.js** always has `node:crypto` (with `randomFillSync`).

### 9.2 The bug (great war story)

The unit tests passed, but a **runtime smoke test** (an actual script executed by
each runtime) failed on **Node 18 in ES module (ESM) mode**. Investigation:

- In a real Node 18 `.mjs` file, **`globalThis.crypto` is `undefined`** — Web
  Crypto only became a global in ESM in Node 20.
- ESM has no `require`, so the `node:crypto` fallback (which used `require`)
  couldn’t fire either.
- Result: on Node 18 ESM specifically, *neither* source resolved → prefID threw.
  (Unit tests missed it because the test runner executes in a CommonJS-ish
  context where `require` *is* available.)

### 9.3 The fix — dual entry points via `exports` conditions

Rather than dropping Node 18, prefID ships **two builds** and lets the package
manager pick the right one automatically:

- `index.ts` — the **universal** build: `globalThis.crypto` with a `require`
  fallback.
- `index.node.ts` — the **Node** build: it **statically** `import`s
  `node:crypto` (which works in ESM on every Node ≥ 14.18) and injects it via
  `setBytesProvider`, then re-exports everything.

`package.json` routes to them with **conditional exports**:

```jsonc
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "node":    { "import": "./dist/index.node.js", "require": "./dist/index.cjs" },
    "browser": "./dist/index.js",
    "import":  "./dist/index.js",
    "require": "./dist/index.cjs"
  }
}
```

- **In Node** (any version, ESM or CJS): the `node` condition wins →
  `index.node.js`, which uses `node:crypto` and therefore works even on Node 18
  ESM.
- **In a browser bundler**: the `browser` condition wins → `index.js`
  (`globalThis.crypto`, no `node:crypto` import to break the bundle).
- **Deno / Bun / edge**: fall through to `import`/`require` → the universal build,
  which uses `globalThis.crypto`.

**Why this is clean:** the `node:crypto` import only exists in the Node build, so
browser bundlers never see it; and Node never depends on the global crypto that
older versions lack. Minimum runtime is **Node 14.18** — the first release with
`node:crypto` (the `node:` protocol import).

---

## 10. Build & packaging

- **Bundler:** [tsup](https://tsup.egoist.dev) (a thin wrapper over esbuild).
- **Two entries** (`index.ts`, `index.node.ts`) × **two formats** produce:
  - `dist/index.js` — **ESM** (ECMAScript Modules, the `import` standard).
  - `dist/index.cjs` — **CJS** (CommonJS, the `require` standard).
  - `dist/index.node.js` — ESM Node build.
  - `dist/index.d.ts` / `.d.cts` — TypeScript declaration files (the types
    shipped to consumers).
- **`"files": ["dist"]`** — only the compiled output is published; `src/`,
  `test/`, config, etc. stay in the repo.
- **`"sideEffects": false`** — tells bundlers the package has no import-time side
  effects, enabling **tree-shaking** (dead-code elimination): an app that imports
  only `id` doesn’t bundle `template` or `sortableId`.
- **Zero `dependencies`.** Everything under `devDependencies` is build/test
  tooling and never ships.

---

## 11. Testing strategy

Three complementary layers:

1. **Unit tests (Vitest)** — one file per module covering behaviour, options,
   validation, and error cases (including the sortable-specific edge cases:
   ordering, monotonicity, backward-clock clamp, tail-overflow spill,
   timestamp round-trip, non-ascending-alphabet rejection, timestamp-too-large).
2. **A statistical test** — generates tens of thousands of single-char IDs and
   asserts each character appears within a tight margin of the expected uniform
   frequency. This is what *proves* the rejection-sampling has no modulo bias.
3. **Cross-runtime smoke tests** (`scripts/smoke.mjs`, `smoke.cjs`,
   `browser-smoke.html`) — a plain script run by **Node (ESM + CJS), Bun, and
   Deno** in CI, plus a browser page. It exercises `id`, `sortableId`
   (ordering + `getTimestamp`) and `BASE32_CROCKFORD`. Because it *actually
   executes* in each runtime, it verifies the crypto sourcing per environment
   (this is what caught the Node 18 bug).

CI runs the unit suite on a **Node version matrix** and the smoke suite across
runtimes on every push.

---

## 12. CI/CD & publishing

Automated with **GitHub Actions** (CI = Continuous Integration; CD = Continuous
Delivery/Deployment — running checks and shipping automatically).

- **`ci.yml`** — on every push/PR: format check → typecheck → tests → build,
  across the Node matrix, plus the cross-runtime job.
- **`publish.yml`** — on pushing a version tag (`v0.4.0`): test, then publish to
  npm, then auto-create a GitHub Release with generated notes.

### OIDC trusted publishing (explained)

**OIDC** = *OpenID Connect*, an identity protocol. Instead of storing a
long-lived npm token as a secret (which could leak), the GitHub Actions job
requests a **short-lived OIDC token** that cryptographically proves “this
workflow, in *this* repo, at *this* commit, is running.” npm verifies that
against a **trusted publisher** you configured, and allows the publish. No token
to store, rotate, or leak.

### Provenance (explained)

**Provenance** is a signed attestation published alongside the package that links
it to the exact source commit and build that produced it. npm shows a
**“provenance” badge**, so users can verify the code on npm really came from your
repo — a **supply-chain security** guarantee (protection against a tampered or
impersonated release).

### Versioning

**SemVer** (Semantic Versioning) — `MAJOR.MINOR.PATCH`: PATCH = backwards-
compatible fixes, MINOR = backwards-compatible features, MAJOR = breaking
changes. `template()` and `sortableId()` shipped as MINOR bumps; bug fixes as
PATCH. A future stable API graduates to `1.0.0`. `CHANGELOG.md` follows *Keep a
Changelog*.

---

## 13. Security considerations

- **CSPRNG only** — never `Math.random()`; IDs (including the sortable random
  tail) are unpredictable.
- **Unbiased output** — rejection sampling keeps the distribution uniform, which
  is what preserves both unpredictability and collision resistance.
- **Input hardening** — `size`, `randomSize`, `timestampSize`, and template
  placeholder counts are capped at `MAX_SIZE` (4096) so an attacker feeding a
  huge value from untrusted input can’t exhaust memory. Prefixes / alphabets /
  separators are validated with clear `TypeError`/`RangeError`s.
- **Sortable IDs leak creation time by design** — the timestamp is decodable via
  `getTimestamp`. That is the point; just don’t use one where the creation time
  must stay secret (use `id` there).
- **Supply chain** — OIDC trusted publishing + provenance (see §12).
- **Compile-time types are not runtime validation** — untrusted strings must be
  checked with `isId()`.

---

## 14. Design decisions & trade-offs

Be ready to justify each of these:

| Decision | Why | Trade-off accepted |
| --- | --- | --- |
| **base62 default alphabet** | URL-safe, double-click-selectable, case-dense for short IDs; already ascending so it works for sortable IDs too | Mixed case can be case-sensitivity-sensitive in some stores (use `BASE32_CROCKFORD` there) |
| **`_` separator** | Matches Stripe convention; keeps the whole ID one “word” for selection | — |
| **Rejection sampling over modulo** | Eliminates modulo bias → uniform, secure | Slightly more bytes consumed on average |
| **Sortable = timestamp-first, prefix stays leftmost** | Keeps readability + type; sortable within a prefix (the per-table norm) | Not globally time-sorted across different prefixes |
| **Monotonic by default (per-process)** | Strictly increasing within a process even on same-ms / backward clock | State is in-memory only; cross-node order is k-sorted |
| **Uniqueness via randomness, not node IDs** | Coordination-free; no node-ID assignment; no throughput cap | ID doesn’t encode its origin node; no hard per-ms guarantee |
| **Stateless `ensureUnique`** | Keeps the core dependency-free and DB-agnostic | Caller must wire up the check |
| **Prefix type is structural** | Zero runtime cost, simple, ergonomic | Not forgery-proof (needs `isId`) |
| **Dual entry + `exports` conditions** | Works on every runtime incl. Node 18 ESM, without breaking browser bundlers | More build complexity than a single file |
| **Zero dependencies** | Nothing to audit, tiny install, no supply-chain surface | Re-implement small utilities ourselves |
| **Node ≥ 14.18** | First version with `node:crypto`; broad support without hacks | Won’t run on ancient Node |

---

## 15. Comparison with alternatives

| | Prefixes | Type-safe prefix | Sortable | Secure RNG | Deps |
| --- | :-: | :-: | :-: | :-: | :-: |
| `uuid` (v4) | ❌ | ❌ | ❌ | ✅ | 0 |
| `uuid` (v7) | ❌ | ❌ | ✅ | ✅ | 0 |
| `nanoid` | ❌ | ❌ | ❌ | ✅ | 0 |
| `ulid` | ❌ | ❌ | ✅ | ✅ | few |
| `cuid2` | ❌ | ❌ | ❌ | ✅ | few |
| **prefID** | ✅ | ✅ | ✅ (`sortableId`) | ✅ | **0** |

- **uuid** — the RFC 9562 standard; use it when you need the exact format (e.g. a
  Postgres `UUID` column) or a fixed 16-byte binary key. prefID IDs are readable
  strings, so they cost more storage than a packed UUID — that is the trade for
  legibility.
- **nanoid** — short, customisable random strings; prefID borrows its RNG
  technique.
- **ulid / uuid v7** — the closest to prefID’s `sortableId`: 48-bit time +
  randomness, k-sorted across nodes. `sortableId` matches their model with more
  default entropy, a prefix, and a type.
- **prefID’s niche** — readable, self-describing, *type-safe* IDs, optionally
  time-ordered.

---

## 16. Known limitations & future work

- **Sortability is per-prefix and k-sorted across nodes.** Within one prefix and
  one process it’s strictly ordered; across prefixes it groups by prefix, and
  across nodes it’s only millisecond-granular (see [§8.4](#8-deep-dive-sortable-ids)).
  True global ordering needs coordination — out of scope for a coordination-free
  library.
- **Wall-clock dependence.** Sortable IDs inherit clock-skew behaviour common to
  all timestamp IDs; run NTP.
- **Structural typing** isn’t forgery-proof (by design; use `isId`).
- **No embedded node ID.** Unlike Snowflake, an ID doesn’t say which node made
  it. A future optional `node` segment (placed after the timestamp to keep
  ordering) could add that for traceability — deliberately omitted for now
  because randomness already covers uniqueness.
- **No built-in checksum.** A future option could add a check character to detect
  typo’d/corrupted IDs.
- **Ecosystem** — `prefid-zod` (validation), ORM adapters (Drizzle/Prisma) are
  natural companion packages.

---

## 17. Interview Q&A

**Q: Why not just use UUID?**
A: UUIDs are opaque and untyped. prefID gives readable, self-describing IDs
(`user_…`) and encodes the prefix in the type so the compiler catches mixing up
ID types. If you need the RFC standard or a native UUID column, use uuid — they
solve different problems.

**Q: How do you guarantee uniqueness?**
A: I don’t *guarantee* it in the generator — same as uuid/nanoid; it’s
probabilistic. Defaults are ~143 bits (`id`) / ~95 bits (`sortableId`), so a
collision is astronomically unlikely. For a hard guarantee you add a DB UNIQUE
constraint, and `ensureUnique` offers an app-level check with a retry cap.

**Q: How do the sortable IDs work?**
A: The body is a fixed-width, ascending-encoded millisecond timestamp followed by
a random tail, so a plain string sort equals a time sort — the ULID/UUIDv7 idea.
Fixed width + an ascending alphabet are what make string order match time order,
and I validate the alphabet is ascending.

**Q: Are they safe in a distributed system?**
A: For uniqueness, yes — coordination-free via ~95 random bits, more than ULID or
UUIDv7. For ordering they’re *k-sorted*: two nodes in the same millisecond order
by randomness, exactly like ULID/UUIDv7. Nobody gets true global order without
coordination. They also inherit wall-clock skew, so you run NTP.

**Q: How is that different from Snowflake?**
A: Snowflake partitions the space with a worker-ID + sequence because 64 bits is
too tight to rely on randomness; that needs node-ID assignment and has a hard
per-ms cap that blocks. I rely on randomness instead: no coordination, no cap, no
blocking — but the ID doesn’t encode its node.

**Q: Why not `Math.random()`?**
A: It’s a predictable PRNG, not secure, and can produce guessable IDs. I use the
platform CSPRNG (`crypto.getRandomValues` / `node:crypto`).

**Q: Walk me through generating one character.**
A: Get a random byte, mask it to the alphabet’s bit-width (6 bits → 0–63 for
base62), and accept it as an index only if it’s < 62; otherwise reject and take
the next byte. That rejection sampling avoids modulo bias, because 256 isn’t a
multiple of 62.

**Q: How is it type-safe at runtime?**
A: It isn’t — types are compile-time only. `id("user")` returns
`` `user_${string}` `` for the compiler, but at runtime it’s a string. For
untrusted input you validate with `isId()`.

**Q: How does it work in the browser *and* Node?**
A: Two builds selected by `exports` conditions: a Node build that statically
imports `node:crypto`, and a universal build that uses `globalThis.crypto`.
Browsers get the universal build (no Node import to break bundling); Node gets
the Node build (works even on Node 18 ESM, where the global crypto is missing).

**Q: What was the hardest bug?**
A: A cross-runtime one. Unit tests passed, but a smoke test run *by Node 18 in
ESM* failed — `globalThis.crypto` is undefined there and ESM has no `require`, so
neither random source resolved. I fixed it with the dual-entry + `exports`
conditions design so Node always gets a `node:crypto`-backed build.

**Q: Why zero dependencies?**
A: Smaller install, nothing to audit, and no supply-chain surface. The only
non-trivial logic (unbiased RNG) is ~15 lines, so pulling in a dependency for it
isn’t worth the cost.

**Q: How do you publish it safely?**
A: GitHub Actions publishes on a version tag using OIDC trusted publishing (no
stored token) and attaches provenance, so users can verify the package matches
the source commit.

---

## Glossary

- **RNG** — Random Number Generator.
- **PRNG** — Pseudo-Random Number Generator: deterministic, seeded, fast, *not*
  secure (e.g. `Math.random()`).
- **CSPRNG** — Cryptographically Secure PRNG: unpredictable, OS-backed
  (`crypto.getRandomValues`, `node:crypto`).
- **Entropy** — amount of randomness, measured in bits; more bits = exponentially
  fewer collisions and harder to guess.
- **Modulo bias** — non-uniform character distribution caused by `%` when the
  byte range isn’t a multiple of the alphabet size.
- **Rejection sampling** — discarding out-of-range random values to keep the
  distribution uniform.
- **Birthday bound** — the rule that collisions become likely around the square
  root of the space size (`√N`), not `N`.
- **Sortable / time-ordered ID** — an ID whose lexicographic order matches
  creation-time order (ULID, UUIDv7, prefID’s `sortableId`).
- **Monotonic** — strictly increasing; here, successive IDs within a process are
  guaranteed to increase even within one millisecond or if the clock rewinds.
- **k-sorted** — approximately time-ordered: correct across milliseconds, but
  arbitrary within the same millisecond across independent generators.
- **ULID** — Universally unique Lexicographically-sortable Identifier: 48-bit
  time + 80-bit randomness in Crockford Base32.
- **UUIDv7** — the RFC 9562 time-ordered UUID: 48-bit ms timestamp + random bits.
- **Snowflake** — Twitter’s 64-bit ID: timestamp + worker-ID + per-ms sequence;
  requires assigning unique node IDs.
- **Crockford Base32** — a 32-char alphabet omitting `I`/`L`/`O`/`U`; case-
  insensitive and unambiguous (`BASE32_CROCKFORD`).
- **Clock skew** — disagreement between machines’ wall clocks; affects any
  timestamp-based ID’s cross-node ordering.
- **Coordination-free** — generators need no shared server/lock to stay unique.
- **ESM** — ECMAScript Modules: the standard `import`/`export` module system.
- **CJS** — CommonJS: Node’s older `require`/`module.exports` system.
- **Template literal type** — a TypeScript type describing a string’s shape,
  e.g. `` `user_${string}` ``.
- **Structural vs nominal typing** — structural: types match by shape (TS’s
  default); nominal: types match by declared identity (not used here).
- **Tree-shaking** — bundlers removing unused exports from the final bundle.
- **`exports` conditions** — a `package.json` map letting different environments
  (`node`, `browser`, `import`, `require`) resolve to different files.
- **SemVer** — Semantic Versioning: `MAJOR.MINOR.PATCH`.
- **CI/CD** — Continuous Integration / Continuous Delivery: automated checks and
  releases.
- **OIDC** — OpenID Connect: an identity protocol; here it lets GitHub prove a
  workflow’s identity to npm so no long-lived token is needed.
- **Provenance** — a signed attestation linking a published package to the source
  commit and build that produced it (supply-chain security).
- **Supply chain (security)** — trust in everything between source code and the
  installed package; provenance/OIDC protect it.
- **UUID** — Universally Unique Identifier (RFC 9562); the `8-4-4-4-12` hex
  standard.
- **tsup / esbuild** — the build tools that compile TypeScript to shippable JS.
- **Vitest** — the test runner used here.
