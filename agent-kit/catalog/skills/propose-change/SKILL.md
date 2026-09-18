---
name: propose-change
description: "Use when evidence contradicts <PROJECT> canon, an OPEN item needs closure, a hypothesis should become a decision, or a task requires something canon prohibits or omits. Defines the only path from evidence to a canon edit: proposal format, cost, alternatives, closed question, and applying the human decision. Load before touching any canonical document."
---

# Propose a canon change

`<CANON_PATHS>` is canon. It changes through a written proposal and dated human
`DECISION:` line, or it does not change. The failure prevented is not malicious:
an agent dislikes a direction, silently edits a document, and converts an open
question into a constraint nobody chose. Default classes match `canon-lookup`:
`DECIDED · HYPOTHESIS · TUNABLE · OPEN`. Projects with other classes list them below.

## Absolute rules

1. **Never edit canon in the middle of a task.** If a task reveals a canon problem,
   record a proposal and continue under current wording, or stop with `BLOCKED`.
2. **Never change an item's classification**, in a header or inline. Only the
   human promotes, demotes, or locks it.
3. **Never promote by inference.** Implementing a hypothesis does not decide it;
   green tests do not close OPEN items; a good demo/playtest/pilot does not become canon.
4. **Only `<CANON_OWNER>` writes canon** (hook-enforced scope), only to apply an
   existing decision. Others report evidence in their handoff; the owner writes
   the proposal.
5. **The horizon stays deferred.** Deferred scope enters only through an explicit
   human decision, never because "it became easy".

## When a proposal is appropriate

| Situation | Proposal? |
| :-- | :-- |
| An OPEN item blocks work | **Yes**, with options and costs |
| Measured evidence contradicts a canon HYPOTHESIS | **Yes** |
| A validated TUNABLE should become DECIDED | **Yes**, with evidence; the human decides the class |
| Two canonical documents contradict each other | **Yes**: name both, propose neither, ask |
| A task requires work canon excludes from the milestone | **Yes**, before the first line of code |
| The direction is inconvenient or you prefer another design | **No**: implement or report `BLOCKED` |
| A tunable needs an initial value | **No**: choose, expose as a named constant, disclose in handoff |
| A new idea | **No**: one costed line in `<DOCS_ROOT>/ideas.md` |

## 1. Name the conflict precisely

Document, section, current wording, class, and evidence with `handoff-contract`
labels (📏 · 📄 · 🔮 · ❓; unlabeled means 🔮). **A proposal built on 🔮 is opinion**;
state that when applicable.

```text
<doc> § <section> (<class>) — "<short literal quote>"
Evidence: 📏 <command/measurement, date, number>; 📄 <not yet observed>.
```

## 2. Write the proposal, not the edit

`<DOCS_ROOT>/proposals/YYYY-MM-DD-slug.md`, maximum 60 lines. Include every section
in this order. "Current text" and "Proposed text" are literal blockquotes (`>`):

```markdown
# <one-line title>                           YYYY-MM-DD · <agent>
State: AWAITING HUMAN DECISION | APPLIED | REJECTED | DEFERRED
Affected canon: <doc § section> — current classification: <class>
## Current text — <short current wording>
## Problem — <what breaks, labeled evidence and provenance>
## Proposed text — <exact replacement>
## Downstream changes — <sections, code, tests, specs, tasks citing this>
## Cost — <S/M/L · worst if done · worst if NOT done · what to revalidate>
## Rejected alternatives — <at least one, and why it is worse>
## Human decision needed — <closed question: yes/no or A/B/C; recommended resulting
  class, offered as a recommendation, never an instruction>
```

One proposal, one change: three decisions require three proposals. Changing two
things together cannot establish which helped. Never resubmit a rejected proposal
without new dated evidence.

## 3. Bring proposals to the human in a batch

The scrum-master summarizes each open proposal in one line with cost and a closed
question; batch a milestone's blocking decisions in one turn. Nothing becomes a
task or implementation before the decision. Only disposable, labeled spikes in
`work/spikes/` (outside the build, never imported) may measure cost beforehand.

## 4. Apply only after the decision

- `<CANON_OWNER>` edits **exactly** what was approved, in the document's style.
- Add a decision line to `<DECISION_LOG>`: `D-NNN · YYYY-MM-DD · DECISION:
  <one sentence> · source: <proposal> · apply to: <doc § section>`.
- Add the owned task to the board (`docs/tasks/BACKLOG.md`, per `task-protocol`);
  the handoff identifies downstream sections requiring review.
- For canon shared with Codex, wait until its run finishes, then record the delta
  for it to read. See `codex-coexistence` for the remainder.
- Mark the proposal `APPLIED` or `REJECTED`, with date/reason. Never delete it;
  its record prevents resubmission.

**The owner never**, even while applying an approval: rewrites an unnamed section,
"fixes" apparently settled prose, changes classification, removes a horizon item
because a session implemented something similar, or independently resolves
contradictions between canonical documents.

## Authority order

```text
1. <CANON_PATHS>                        canon
2. Human decision in conversation       canon in progress: write it this turn
3. Measurement and human evaluation     strong evidence, not authority
4. Proposals awaiting a decision        candidates
5. Research and competitors             lowest project authority
```

A competitor's different approach never outranks canon; measurements do not edit
documents by themselves. Both become proposals. An unwritten chat decision is
lost: "the human once said" remains 📄 forever. Recording it applies an existing
decision (rule 4), not a mid-task canon edit (rule 1).

## Project notes — <PROJECT>

<!-- Project facts. New kit copies replace everything above, never this block. -->

- Canon `<CANON_PATHS>`; owner `<CANON_OWNER>`; decisions `<DECISION_LOG>`.
- Proposals `<DOCS_ROOT>/proposals/`; ideas `<DOCS_ROOT>/ideas.md`; spikes
  `work/spikes/`; board `docs/tasks/BACKLOG.md`; classes: <list differences>.
