# Solution design validation

The shared conversational flow now selects requirements and architecture before
legacy tracks. Eight software and eight marketing, release and feedback packs
supplement the advanced catalog. Three shared procedures cover solution design,
product delivery and capability expansion. Claude profiles and hooks remain
unchanged; root shared instructions make these procedures available across
clients with their existing tool and delegation limitations.

## Behavioral acceptance scenarios

Use these scenarios for live client evaluation. They are review criteria, not
claims that model executions or generated applications have passed.

| User situation | Observable acceptance criteria |
| --- | --- |
| Restaurant wants a menu, hours and contact link; no accounts or ordering | Do not create authentication or a database by default; deliver a public visitor journey and explain the simplest fitting approach |
| Same restaurant adds online ordering and payment | Reconsider affected architecture decisions; identify order states, payment boundaries and persistence; do not silently publish or purchase services |
| User only asks for a car game | Ask about the visible experience and target device before choosing an engine; do not ask the user to pick a programming language |
| User specifies a 2D offline driving game for desktop | Compare fitting options from current evidence; omit online accounts and multiplayer; prepare the first playable interaction |
| Existing Unity project with C# scripts | Preserve the engine and project structure; use the Unity pack rather than interpreting C# as a request for an ASP.NET server |
| Existing Python service with a small requested fix | Preserve Python; inspect local conventions and create a focused pack only if needed; do not force the Node or Supabase tracks |
| Relevant documentation cannot be accessed | Mark compatibility or pricing facts unverified; continue a reversible step when possible without inventing research |
| Native profile cannot be discovered | Report prepared versus active accurately; continue sequentially and do not claim independent review |
| Existing customized specialist profile | Preserve it; reuse when compatible or choose a distinct name; do not overwrite permissions |
| Campaign brief but no ad account connection | Produce a concrete campaign package; record the connection dependency without claiming launch |
| Creative request without an image/video tool | Distinguish an actual rendered asset from a production brief and complete unblocked work |
| Marketing report with mixed currencies, summary rows and missing conversions | Avoid double-counting, keep currencies separate and report unavailable metrics honestly |
| New recurring business task without a matching skill | Diagnose the gap, adapt or create a scoped local procedure and trial it before reliance |
| Full application requested | Continue from plan into authorized implementation, tests, release preparation and appropriate acquisition work; track blocked external actions separately |

## Scope of verification

Local verification for this change:

- All 27 existing repository tests passed after the workflow integration.
- All 19 skills passed the skill-creator validator using PyYAML in an isolated
  ignored validation folder. A deliberately malformed YAML control was rejected.
- Python's TOML parser accepted the updated Codex coordinator; local relative
  links and the constrained skill frontmatter were checked.
- Kimi parsed the updated starter profiles before its trust prompt and rejected
  a malformed negative control. No trust change or model execution was used.
- Claude's directory validator returned success but also accepted the malformed
  directory control, so that result is not treated as evidence of skill parsing.

Two bounded independent forward evaluations also passed:

- Campaign analysis produced a real report from a synthetic mixed-currency
  export. It excluded the summary row, preserved missing values, handled zero
  denominators, and derived BRL spend 500, four purchases, CPA 125 and ROAS 1.2
  without combining the separate USD segment or claiming reliable attribution.
- Capability expansion created a local support-triage procedure and exercised
  it on synthetic CSV input. Seven rows became six unique tickets and five issue
  groups; a missing required identifier column produced a blocked-input report.
  The trial preserved unknown severity and distinguished local recommendations
  from unavailable live ticketing actions. Thirteen parser/structure checks,
  expected evidence rows and 21 local links were verified.

Trial artifacts remain in the ignored local audit folder. These tests exercised
two procedures in Codex; they did not register new native agents, access ad or
ticketing accounts, publish content, or establish production-quality performance.

Static review checks entrypoint links, skill structure and consistency with
client starter templates. The repository test suite checks existing generator
and adapter behavior; it does not prove architecture-selection quality.
Broader live evaluations, native discovery of newly composed specialists and
representative application/game builds remain separate checks. This change
does not implement the proposed cross-client supervisor or voice interface.
