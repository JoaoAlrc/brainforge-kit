---
name: capability-expansion
description: Diagnose missing capabilities and create or adapt a scoped procedure and specialist for any domain. Use when existing skills, tools, access or evidence do not cover an authorized task.
---

# Close a real capability gap

Apply to software, marketing, research, creative work and operations. Creating
a role or skill supplies instructions; it does not add a tool, account access,
professional qualification or demonstrated competence.

## Diagnose before creating

Read the task, relevant context and selected procedure. Inspect the specialist
index and actual client tool/skill inventory before deciding coverage is absent.
Distinguish available, reference-only, prepared, discovered and executed.
Do not assume the maintainer's personal plugins ship with Brainforge.

Classify the missing piece; a task may have several:

| Gap | Response |
| --- | --- |
| Facts or user assets | Research authoritative sources or request the specific missing input; label assumptions |
| Reusable procedure | Reuse or adapt a compatible skill, otherwise author the local skill below |
| Narrow one-off assignment | Give a current worker a focused brief; no permanent skill is necessary |
| Tool or runtime | Inspect available supported capabilities; prepare a useful substitute if it fulfills the goal, otherwise record the missing tool |
| Account access or permission | Identify the required connection/action; never ask for a secret in a document or manufacture access |
| External decision or unavailable service | Mark the affected step blocked and continue independent work |

Choose the least additional machinery that closes the gap. Do not install a
plugin, change global settings, enable permissions or buy a service merely
because a generated procedure says to do so. Honor the current task's actual
authorization and the host's tool rules.

## Author a portable local skill when needed

Research the authoritative documentation relevant to the task. Record source
links and date, distinguishing checked facts from unverified assumptions. For
novel domains without enough evidence, prepare a research task rather than a
confident specialist. Legal, health or other consequential claims require
appropriate sources and review; a generated role does not establish expertise.

Create `workspace/output/<capability>-skill.md` in English, preserving existing
custom files. Include native-compatible `name` and `description` frontmatter
and these sections: purpose and trigger; inputs and missing-input behavior;
available tools and access dependencies; concrete workflow; output contract;
failure/stop conditions; and a first acceptance example. Keep it self-contained
or use resolved references readable by the current client.

Capture only reusable guidance. Keep private customer facts in workspace
context, not in generic skill text. Do not copy an external skill wholesale;
retain applicable license notices for any material actually adapted.

Map the skill to a scoped responsibility in team.md with a real first task,
allowed files, dependencies and acceptance evidence. Use the starter profiles
and [activation rules](../../SPECIALISTS.md#activate-specialists) when native
agents are available. Inherit the user's model and existing restrictions.
For clients without native delegation, execute the assignment in the current
session. Do not claim native registration from reading a Markdown file.

## Calibrate before relying on it

Check frontmatter, references, available tools and the clarity of its trigger.
Run a small representative task using real or clearly labeled synthetic inputs
in local disposable output, without publishing or spending. Verify observable
output against the acceptance example, including a meaningful missing-input
or failure case. Use independent review when available and proportionate.
If an essential tool is absent, report that validation as pending.

Record gap type, selected remedy, evidence, validation status and remaining
dependencies in `workspace/output/capabilities.md`; link it from team.md. A
new skill starts as `draft`, becomes `structurally-checked`, then `trial-verified`
only after the trial passes. Native discovery and task execution are separate
facts. Improve or retire ineffective profiles instead of accumulating idle ones.

Resume the original task. A generated skill is an intermediate artifact, not
completion of the user's app, campaign or operational request.
