# Work from the user's goal

Use this workflow after setup. Keep the machinery out of the conversation:
the user should be able to ask for an outcome in ordinary language.

1. Read the saved context and current task. Reuse known facts and decisions.
   Ask only about missing information that changes the result. For a clear,
   authorized task, start; do not repeat the onboarding interview.
2. State the next useful result briefly. For a larger task, keep a small plan
   in `workspace/next.md`, with a concrete check for completion. Explain real
   tradeoffs in terms the user can decide, not internal role or track names.
   For a new software product or a material change in requirements, follow
   [solution design](skills/solution-design/SKILL.md) before selecting a track
   or implementation specialist. Reuse a saved architecture for ordinary work;
   reconsider only decisions affected by new evidence or requirements.
   For an end-to-end product request, use
   [product lifecycle](skills/product-lifecycle/SKILL.md) to carry work through
   implementation, release, acquisition and operation as applicable. A small
   request needs only its relevant stage.
3. Select only relevant procedures below. Read each selected file before using
   it. Catalog roles are reference procedures until actually installed and
   available through this client's tools. Resolve project placeholders from
   real context; never run an example command as if it were verified.
   Select domain work from [the specialist index](SPECIALISTS.md), including
   marketing and operations. When coverage is missing, use
   [capability expansion](skills/capability-expansion/SKILL.md) for any domain.
   Distinguish a missing procedure from unavailable tools, data or access.
4. Do the work with the current assistant or available native agents. Delegate
   only independent work that benefits from another worker. Give each worker
   the outcome, necessary facts, allowed files and acceptance criteria. Keep
   sensitive context limited to what that task needs.
5. Check the result against the user's goal. For substantive or risky changes,
   use an independent reviewer when available; otherwise report the limits of
   self-review. Fix concrete findings before handing back the result.
6. Save the deliverable and update the next action, relevant decisions and
   blockers. Report what was produced, how it was checked and any real limit.
   Do not claim publication, integration or execution without evidence.

## Select a procedure when it helps

Paths below are relative to the repository root, under
`agent-kit/catalog/skills/`. Load the named `SKILL.md`, not the whole catalog.

| Situation | Procedure | How to apply it |
| --- | --- | --- |
| An idea needs a design before software work | `brainstorming/SKILL.md` | Clarify scope and meaningful choices; keep existing user authorization |
| A software change needs regression coverage | `test-driven-development/SKILL.md` | Use verified project test commands and a meaningful failing case |
| A bug or unexpected failure needs diagnosis | `systematic-debugging/SKILL.md` | Gather evidence and isolate the cause before changing behavior |
| Work will be delegated | `handoff-contract/SKILL.md` | Pass a focused assignment and require concrete evidence back |
| A test result is being used to claim correctness | `verify-falsification/SKILL.md` | Verify the check measures the intended behavior; use disposable fixtures for fault injection |
| Context is becoming repetitive or too large | `context-hygiene/SKILL.md` | Keep useful decisions and pointers; preserve the user's source material |

For domain work, consult the relevant track and specialist only when the
current task needs it. Business writing and planning do not require software
tests, a technical track, or all of the software catalog's approval stages.
Check factual claims, brand constraints, intended audience and completeness
using actual inputs. Research when needed and available; distinguish evidence
from assumptions. Never invent statistics, testimonials, prices or features.

Current user instructions and authorization take precedence over a reference
procedure's default conventions. Do not ask again for the same approved
action. Publishing, purchases, external messages and destructive operations
still need authorization appropriate to the actual action. A template's
mention of a commit or deployment does not grant it.

Keep the user's chosen main model. Match delegated effort to the task when the
client exposes supported options: simple lookup can use less, consequential
reasoning needs more. Do not silently replace a model or claim measured savings.

For explicit delegated model selection, consult [model policy](../docs/MODEL-POLICY.md).
