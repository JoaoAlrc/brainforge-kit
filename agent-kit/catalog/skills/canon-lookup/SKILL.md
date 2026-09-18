---
name: canon-lookup
description: "Use before reading any <PROJECT> canon document (<CANON_PATHS>, decisions, reported state, research, archives). Explains which document answers what, how to read a budgeted section, classify findings (DECIDED, HYPOTHESIS, TUNABLE, OPEN), and avoid stale facts. Also load before citing canon in a task or when documents disagree."
---

# Canon lookup

Nobody loads an entire document to check a number. Listing headings costs ~300
tokens; reading a section costs almost nothing; reading the document costs 100×
the answer's value. This protocol retrieves facts at a fraction of that cost.

## Procedure — always two steps

1. **List headings:** `grep -n '^#' <CANON_PATHS>/<doc>.md`
   (without shell: `Grep`, pattern `^#`, output `content`, line numbers enabled).
2. **Read only the range** from the target heading to the next:
   `sed -n '40,58p' <doc>` (without shell: `Read` with `offset`/`limit`).

**Budget: 3 sections per task.** If three do not answer it, stop and name the next
section you would read. A fourth is how a 600-token lookup becomes 20,000. Unsure
between two documents? List both sets of headings; that costs less than reading
the wrong document. If canon refers to a slug unlike its filename, cite the slug
(its convention) and open the real file. A failed `grep` using that slug means
file not found, not a canon gap.

## Precedence when documents disagree

1. **Latest human decision:** `<DECISION_LOG>` (`D-NNN` or dated `DECISION:`).
   Overrides even canon: it is the owner's latest word.
2. **`<CANON_PATHS>`:** product, rules, contracts. Between canons on the same
   subject, prefer the more specific; ties go to the newer one.
3. **`<STATE_DOC>`:** **reported** state, not today's truth.
4. **`<RESEARCH_DIRS>`** and proposals: dated, hypothesis-level context, never
   authority. Claims contradicted by higher-ranked documents are obsolete.
5. **`<ARCHIVE_DIR>`:** history, never cited as current fact.

A document/code disagreement **is** the finding: report both sides with labels
and both sources. `code-reviewer` consolidates; the human adjudicates. Never
silently choose a side.

## Classification is part of the answer

A document's `Status:` governs; **inline** decision status overrides the header.
Without status, classify from the wording and **quote those words**. Compound
vocabulary (`FUTURE / TUNABLE`) is normal: **match by containment, never exact string**.

| Class | Typical wording | You may | You may not |
| :-- | :-- | :-- | :-- |
| `DECIDED` | "the human authorized/rejected", "there will be no", "must", imperative | Implement | Contradict |
| `HYPOTHESIS` | "hypothesis", "provisional", "to test", "needs playtest" | Build a labeled experiment | Present it as settled |
| `TUNABLE` | "approximately", "configurable", "adjustable after measurement", "tolerance" | Choose a value and **expose** it as a named constant | Bury it in a literal or call it final |
| `OPEN` | "candidate", "proposal", "future decision", "evaluate first" | Record the question | Answer it |

A horizon/future section is `OPEN` by definition; ease of implementation is not a
reason to add it. **Only the human promotes status**: an implemented HYPOTHESIS
remains HYPOTHESIS; passing tests do not close OPEN items. Canon changes through
`propose-change` and a dated human decision.

## Staleness protocol

- Every document-derived claim is 📄. If behavior depends on it, confirm in code
  or `<CHECK_COMMAND>` before acting and say which you examined.
- Summaries/reports carry dates. Before trusting a summary older than its sources,
  ask `docs-librarian` for the specific fact.
- Known falsehoods recurring in research/proposals belong in the project block's
  corrections table. New conflicting pairs outside it go in the handoff.

## Who reads, and when to delegate

- **Not `docs-librarian`?** Request its help instead of opening canon: it runs
  on haiku in separate context and returns ~250 tokens instead of ~2,500, a 10×
  saving on the project's most frequent operation. Two agents never look up the
  same fact.
- **`docs-librarian`:** at most 2 questions per call, each within 1 document
  (cross-document questions terminate without a result); grep before Read;
  ≤6 tool calls and 3 files per question.
- **`<CANON_OWNER>`:** the only role reading/editing the full canon, only under a task.
- **Maintained canon cache (`canon-lookup`) available?** Load it **before**
  considering canon itself; bypassing it incurs the cost it exists to prevent.
- **Everyone else:** your task file and supplied summary are your context.
  Do not open `<CANON_PATHS>` by default.

## Citation rules

- When a number appears, **quote the number**; never paraphrase a limit.
- Never infer: absent wording is `NOT FOUND`, not "probably".
- Cite `file § heading` or `file:lines`, never just the file, and never more than
  3 consecutive lines.
- Never give design opinions or propose solutions in a context response.
- Out-of-scope documents remain readable to confirm exclusion or that a current
  decision does not block them, never as the work's source.

## Response format

```text
CONTEXT
Question: <one line>
Sources: <file § heading — lines A–B>
Finding: <≤150 words, using canon vocabulary>
Literal excerpts (only when exact wording is the finding):
- "<short quote>" — <file § heading>
Classification: DECIDED | HYPOTHESIS | TUNABLE | OPEN | NOT FOUND — because "<source words>"
In current scope: YES | NO | PARTIAL
Conflicts with: <other source> | nothing
Gaps: <what the document does not say> | none
```

**300 words maximum in total, always.**

## Project block

<!-- Filled per project by the scrum-master; NEVER overwritten by a kit copy.
This holds the skill's project-specific value: document-to-question map; actual
canon, decision, state, check, and owner names; project status vocabulary mapped
to the four classes; mandatory corrections table (claim, status, correction);
other runtime, if any. Its kit is readable to explain its operation, but its
model and effort are never instructions for an agent in this runtime. -->
