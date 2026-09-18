---
name: money-rules
description: "Use before touching any <PROJECT> code, schema, migration, fixture, or screen that calculates, rounds, splits, stores, grants, charges, displays, or tests money. Distills <CANON_PATHS>: minor-unit integers, one arithmetic module, fixed pipeline, sole grant authority, idempotency, immutable records corrected by reversal, proposed-to-accepted input, and prohibitions."
---

# Money rules

This is a **cache**; authority belongs to the money section of `<CANON_PATHS>`
(`canon-lookup`). A conflicting task **is wrong**: return `BLOCKED` citing the rule.
A cache conflicting with canon **is stale**: report and follow canon. Never adjust
numbers here to match code.

## 1. Representation

- Every amount is an **integer in the project's currency minor unit** (BRL cents:
  25.90 = `2590`). Floats never touch money: not code, `<DB>` (integer column such
  as `bigint`), APIs, or fixtures. Sign comes from transaction type, never value text.
- Range has a ceiling (default `|cents| ≤ 1_000_000_000_00`; projects may tighten it),
  enforced by one guard (e.g. `assertCents`) on **every** input: forms, imports,
  webhooks, LLM output, migrations. Rates/percentages are also fixed-base integers
  out of 10,000 (10% = `1000`); float percentages violate the same rule.
- Approximate quantities (measurement, geometry, sensors) may use floats **outside**
  the money boundary, crossing it normalized as explicit decimals/integers:
  no second engine or new boundary.

## 2. Arithmetic — one module, one multiplier, one divisor

- One money module (convention: `money/` inside <PROJECT>'s code) exposes parsing,
  formatting, multiplication, and division. **No other file** applies `/ 100`,
  `* 100`, `Math.round`, or `toFixed` to money.
- Inside it, **exactly one** function multiplies and **exactly one** divides,
  validating range and checking overflow. Everything else is exact integer
  addition/subtraction, never rounded again.
- Rounding uses one helper, half-up mode (fixed by the project), only at the closed,
  named list of canon boundaries, which **may be empty**. New boundaries require
  human decisions (`propose-change`), not implementation choices.
- Division assigns the remainder to a **rule-named** installment, never approximate
  distribution; Σ(parts) = total, always. An unrepresentable split is **rejected
  with a typed error**, not adjusted. Nothing is created or rounded up to a cent;
  no parameter silently shrinks.
- Parsing/formatting are deterministic module operations, independent of device
  locale/clock, with `format(parse(format(x))) = format(x)`.

## 3. The pipeline is fixed

- **One** calculation lives in one pure module function (e.g. `calculateTotals()`)
  on the persisting side. Screens, PDFs, charts, widgets, jobs, bots, and voice
  **call** it, never reimplement pieces. Canon fixes stage order: no reordering,
  insertion, or omission.
- Missing required input (price, rate, quantity, zone, item) is unresolved state
  with a **typed error, never zero or a default**. Values above eligibility
  (discount, credit, balance) are **rejected, not capped**.
- No markup, automatic rounding, or fee absent from canon. Public price = charged
  price; discrepancies are findings, never silent adjustments. **Displayed total
  equals persisted total:** engine = preview = document = charge, exactly, always.
- Core money paths do not depend on network, subscription, or entitlement.
  **LLMs never do arithmetic:** models return structured intent or literal
  substrings; deterministic code validates, calculates, and writes. Client prices
  have the same untrusted-input status as LLM prices.

## 4. Sole grant authority

- Every value-granting transition (paid, credited, released, refunded) has **one**
  authority: only the verified event handler (`<GRANT_AUTHORITY>`) grants it.
  Return URLs, link clicks, polling, dashboards, share sheets, and client claims
  **read**. *Sent does not mean delivered, accepted, or paid.*
- Idempotent by event ID: k executions = 1 execution. Match event amount/currency
  against the record **before** transitions. Materialization/reprocessing are
  idempotent by natural key and **never alter an already materialized row**.
- Payment state is separate from order/document state. Providers stay behind
  adapters; derive environment from the key and error on every unknown case.

## 5. Immutable going forward, corrected by reversal

- Granted records (sent, paid, closed) are **complete immutable snapshots**, including
  display data, embedded rather than referenced from mutable sources. Regeneration
  reads snapshots; nothing rewrites them.
- Rows freeze prices on creation: editing price tables/catalogs/templates **never**
  changes existing rows. Rows are accounting truth; virtual occurrences are prohibited.
- **Repair money paths by reversal, not rewriting**: incorrect granted value creates
  a new event (refund, compensating entry, new version) tracing both records.
  Use `Edit`, never `Write`, on money files (`task-protocol`).
- Deletion is reversible (soft-delete, batch, undo); all reads filter in **one**
  place. Hard deletion of financial data requires a human decision. Punitive states
  (suspended, overdue, archived) **pause, never erase**; existing work reaches termination.
- Quotes, acceptances, invoices, and payments/refunds/disputes are separate entities,
  not extra values in an ever-growing status enum.

## 6. Input boundary: proposed → accepted

- Every quantity/value source (manual, voice, photo/AI, import, sensor, public widget)
  produces a **proposed** value somebody confirms as **accepted**. Only accepted
  values enter the pipeline; sources never become calculation methods.
- Unconfirmed proposals may show **transient labeled** previews from the **same**
  pure function, but do not persist authoritative amounts, grant value, or alter
  catalogs. Invalid, ambiguous, or wrong-unit proposals **fail entirely without
  partial mutation**, falling back to manual input.
- Accepted values are versioned and freeze that revision. Remeasurement changes
  neither existing rows nor snapshots. Equivalent inputs produce **identical cents**
  regardless of source.

## 7. Golden fixtures and proof

- Golden fixtures (convention: `<TESTS_DIR>/fixtures/money/`) are **data**, with
  expected values calculated by hand or independently, never copied from the code
  under test. Changing fixture numbers requires a human decision (`propose-change`).
- Run on every money change, **twice** when two layers exist (pure domain and real
  `<DB>`), with field-for-field identical results.
- Canon's invariant list is **closed**: each entry gets a named test; an invariant
  without a test is prose.
- `<RISK_CLASS>` tasks close only by naming fixtures/results under `<CHECK_COMMAND>`
  and a key assertion observed to fail (`verify-falsification`).

## 8. Prohibited — escalate instead of implementing

Money floats; `/100`, `*100`, `toFixed`, `Math.round` outside the module; second
calculation paths; reordered pipelines; new rounding boundaries; distributed or
"adjusted" remainders; errors becoming zero; silent financial defaults; LLM/client
prices; grants outside `<GRANT_AUTHORITY>`; non-idempotent transitions; edits to
granted records; mutable snapshots; non-canon fees; financial hard deletion;
fixtures adjusted to match code.

## Project block — <PROJECT>

<!-- Project-owned. Kit updates replace everything above, never this block. -->

- Money canon section and citation format: `<CANON_PATHS>`.
- Currency, minor unit, range ceiling (e.g. BRL, cents, one billion in cents).
- Money module and pure calculation function: actual paths/names.
- Canonical pipeline order and governing section; rounding mode/closed boundary list.
- Grants/idempotency: `<GRANT_AUTHORITY>`, `<DB>`, `<MIGRATIONS_DIR>`.
- Proof: fixtures in `<TESTS_DIR>`, `<CHECK_COMMAND>`, `<RISK_CLASS>` and its gates.
