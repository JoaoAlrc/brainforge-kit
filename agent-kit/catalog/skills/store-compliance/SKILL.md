---
name: store-compliance
description: "Store-compliance cache: violation classes/verdicts, closed monetization anti-pattern list, generated-asset provenance, and conditional child-directed requirements (Apple Kids Category, Google Play Families, COPPA/GDPR-K). Use for ads, purchases/subscriptions, currencies, paywalls, data, SDKs, permissions, generated art/audio, listing text/screenshots, store forms, and submissions."
---

# Store, advertising, and data compliance

Cache maintained by `doc-steward` from `<DOCS_ROOT>/compliance/policy-refs.md`, one
rule per line with source URL/read date, researched under `research-protocol`.
**Policy outranks cache**: current policy text governs conflicts; create a cache
update task in the same session. Unsourced rules are ❓ and cannot close gates.
Use `handoff-contract` labels (📏 📄 🔮 ❓). Nothing here authorizes SDK installation,
terms acceptance, questionnaire answers, or publishing; those need human decisions
in `<DECISION_LOG>`.

## Violation classes — verdict per class

| Class | Fails when |
| :-- | :-- |
| `REAL-BRAND` | Recognizable third-party name/logo/UI/character/music appears in app, listing, or generation prompt; describe inspiration, never copy |
| `CHILD-AUDIENCE` | App/art/ads/listing attracts children without corresponding audience declaration/program, or declares adults to evade policy |
| `DECEPTIVE-ADVERTISING` | Any item in the closed list below |
| `LICENSE-PROVENANCE` | Missing asset provenance; generated under noncommercial terms/plan; unrecorded font/package license |
| `STORE-CLAIM` | Listing text/screenshots show unsupported behavior; unlabeled simulation; "ad-free" with hidden video |
| `CURRENCY-CHANCE` | Premium currency lacks traceable receipt; paid loot boxes; undisclosed odds; real-money conversion |
| `PRIVACY` | Telemetry PII; SDK before consent; data form contradicts traffic; no privacy-policy URL |
| `PLATFORM` | Target API below requirements; incorrect build-artifact format; assumed dependency license |
| `CHILD-DATA` | Where the conditional section applies: any collection it prohibits |

Verdict: `APPROVED`, `APPROVED WITH CORRECTIONS` (numbered findings, owner, S/M/L),
or `BLOCKED`. A single `DECEPTIVE-ADVERTISING`, `CURRENCY-CHANCE`, `REAL-BRAND`, or
`CHILD-DATA` violation blocks. `kids-compliance` verdicts cannot be waived by agents
or deadlines. Agents never argue a BLOCKED verdict down; only the human decides,
in writing in `<DECISION_LOG>`. A clean design with no findings is legitimate;
finding quotas are not.

## Closed list — monetization anti-patterns that immediately fail

1. Mandatory ads/videos to continue, enter, or use basic functions; interstitials at activity start, mid-gesture, or on every button.
2. Fake timers/counters, timers running behind ads/overlays, ad buttons imitating system buttons, notifications, or error dialogs.
3. Locked nonexistent content; priced/ad-gated "coming soon"; charging again for owned items; paid previews of already purchased content.
4. Promised reward differs from delivery; offers hiding the benefit until afterward.
5. Cancellation/unavailability/errors charging, discarding attempts, or blocking; duplicate callback payments; bonuses without attempt/offer IDs (`money-rules`).
6. "Ad-free" still showing videos, or removing benefits instead of direct redemption with the same limits.
7. Paid draws, mystery boxes, or wheels using real money or purchasable currency.
8. Energy, lives, or streaks punishing nonuse; deliberately slowed progression to sell.
9. Price, balance, or odds shown only in marketing, not the interacted object (`money-rules`: public price = charged price).
10. Ads/listings using third-party art or depicting unsupported usage.

## Generated-asset provenance

Mandatory asset-manifest entry (default `<DOCS_ROOT>/assets/manifest.md`):

```text
<file> · tool/model · plan (paid/free) · date · prompt: <path> § <heading> · rights: declared | verified (terms URL, date) · human approved: yes/no
```

Free plans or terms forbidding commercial use veto adoption until a human decision.
Store icons/logos require human authorship or explicit terms verification. Generated
content entering the bundle/listing triggers its own review: neither "just an
asset" nor "third-party SDK" exempts it.

## Conditional — only for child-directed apps

Applies under Apple Kids Category, Google Play Families, COPPA/GDPR-K. Declared
adult audiences skip this section, but `CHILD-AUDIENCE` still applies. Additional
blocking class: `CHILD-DATA`. Strategy: **avoid collection, not merely document it**:
collect nothing so there is nothing to consent to, label, leak, or defend. Category
entry is opt-in and effectively final (leaving requires another review). **Declared
age range is a human decision** recorded in `<CANON_PATHS>`, never decided by a
submission form.

- **Zero collection by design.** No children's PII—names, photos, voice, contacts,
  location—even "just for personalization". On-device progress is not collection;
  server sync is. **Persistent identifiers** (device/ad IDs, cookies, SDK-generated
  IDs) count as PII: no tracking, attribution, fingerprinting, IDFA, or ATT prompts.
  The narrow internal-operations exception (security/aggregate-only identifiers,
  never profiling) is the sole basis for minimal anonymous analytics. Document
  compliance with it or do not collect. Verifiable parental consent is deliberately
  expensive and high-friction: avoid needing it; GDPR-K strengthens that conclusion.
- **Outside the gate: no links, purchases, or data requests. Kids Category apps
  send no PII or device information to third parties**. The second sentence governs
  every bundled SDK, including billing. Read source sections before citing numbers;
  Apple approval is not a legal defense.
- **Gate ≠ parental consent**: independent requirements; passing a gate authorizes
  no collection. A valid gate is an **adult-level task**, not adult-level written
  instructions: variable, non-memorizable responses. A fixed dexterity procedure
  is learnable by observing one adult use. Stores **specify no numeric limits**
  (attempts, lockout, difficulty, answer space). Numeric ceilings are house rules,
  never represented as store requirements or justified by market convention.
- **Play Families:** honest audience declaration (declaring adults to evade is a
  ban); no transmitted ad ID; only self-certified ad SDKs; no precise location;
  every bundled SDK appropriate for child-directed use with documented data surface;
  privacy-policy URL in listing; human-completed IARC questionnaire.
- **Bundled SDKs are your responsibility. Data forms** (App Privacy / Data safety)
  are legal declarations, not marketing: match actual binary traffic and recheck
  each release. One SDK phoning home invalidates "no data collected"; therefore
  new dependencies require human decisions. Traffic audit is 📏; SDK marketing is 📄.
- Purchases/restores go through one project wrapper (one module in `<MONEY_PATHS>`,
  one purchase path, one restore path). Sensitive permissions (camera, microphone,
  location) need blocking review and human decisions. Cross-promotion of your own
  apps, where permitted by the store (📄), still counts as a link and needs a gate.
- **Prove the purchase path; do not assume it.** Coupling SDK setup to mounting the
  adult area does not prove setup precedes the first offer query (framework effect
  ordering decides; symptoms are missing prices/Restore). Require an ordering
  assertion and a type requiring hook passage; default no-ops keep suites green
  while defects survive. Purchases unconfirmed within the store's **refund window**
  are refunded and entitlements revoked; measure this path, including app closure
  before reconciliation.

## Before submission — claims requiring evidence

Real-device touch/UX (📏 only with report + build hash), measured p95 performance,
regional consent/gates, purchase restoration, data forms based on observed traffic
rather than SDK promises, and human-completed age ratings. Green `<CHECK_COMMAND>`
is not a network audit. `NOT VERIFIABLE HERE` is honest when the device, store
account, or policy text is unavailable.

## Usage

- `doc-steward` revalidates sources before first submission and every release,
  updating the index and this skill together; never invent policy or cite guideline
  numbers from memory.
- Designers/reviewers check economy, ads, paywalls, data, and listings against every
  class and attach verdicts. `spec-auditor` compares listings, README, and roadmap
  against the build under `STORE-CLAIM`.
- If the design requires prohibited behavior, do not work around it. Report the
  cited rule to the human, naming the exact decision needed: child program, age
  range, privacy policy, price, or new dependency.
