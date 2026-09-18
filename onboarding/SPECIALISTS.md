# Specialization packs

These portable skills supply scoped role guidance to the active client. They
are selected from the actual task, not installed as a large team by default.
Software specialties follow solution design; marketing follows the product or
campaign brief. Use [product lifecycle](skills/product-lifecycle/SKILL.md) for
an end-to-end request and [capability expansion](skills/capability-expansion/SKILL.md)
when any domain lacks a necessary procedure, tool, evidence or access.
The advanced catalog remains useful only where its assumptions match the design.

| Capability selected by the design | Pack | Role responsibility |
| --- | --- | --- |
| Public website or browser interface | [Web](skills/web-interface/SKILL.md) | Accessible interface and visitor journey |
| JavaScript or TypeScript server | [Node](skills/node-service/SKILL.md) | Server contracts and service behavior |
| Supabase services | [Supabase](skills/supabase-service/SKILL.md) | Data access, identity and migrations |
| C# application or service | [C# / .NET](skills/dotnet-service/SKILL.md) | Typed application and service logic |
| Unity game | [Unity](skills/unity-game/SKILL.md) | Playable interaction and engine integration |
| Godot game | [Godot](skills/godot-game/SKILL.md) | Scenes, interaction and target export |
| Unreal game | [Unreal](skills/unreal-game/SKILL.md) | Gameplay and engine integration |
| Mobile application | [Mobile](skills/mobile-app/SKILL.md) | Device experience and lifecycle |
| Audience, offer and acquisition strategy | [Market strategy](skills/market-strategy/SKILL.md) | Research and positioning |
| Brand voice and persuasive text | [Brand and copy](skills/brand-copy/SKILL.md) | Messaging and conversion writing |
| Images, carousels and video assets | [Creative production](skills/creative-production/SKILL.md) | Art direction and asset production |
| Organic content and discoverability | [Content and SEO](skills/content-seo/SKILL.md) | Useful content and search readiness |
| Paid acquisition | [Paid campaigns](skills/paid-campaigns/SKILL.md) | Campaign preparation and authorized launch |
| Campaign performance | [Campaign analysis](skills/campaign-analysis/SKILL.md) | Measurement and experiment design |
| Delivery to real users | [Release operations](skills/release-operations/SKILL.md) | Release evidence and operational handoff |
| Support, retention and product learning | [Customer feedback](skills/customer-feedback/SKILL.md) | Evidence-based improvements |

This index is extensible, not an exhaustive list of supported work.
Node is not a frontend choice, Supabase is not a universal backend, and C# does
not imply Unity. A game engine is chosen from the game's actual requirements.
The solution-design procedure handles a missing specialization without forcing
the project into one of these packs.

## Activate specialists

Use [CLIENT-SETUP.md](CLIENT-SETUP.md) for the supported profile format, after
detecting the active client from the session. The presence of a folder does
not identify the client.
Start from its shipped builder/reviewer template, preserve its security fields,
and create a distinct project-local `bf-<specialty>` profile only if the role has
an actual task. Keep the existing main assistant as coordinator. Do not edit
the legacy Claude catalog or hooks to install these portable specializations.

- Codex: copy the relevant starter TOML into `.codex/agents/`, change `name`,
  `description` and `developer_instructions` to the scoped assignment. Retain
  the reviewer's read-only sandbox. Inherit the user's model. Refer to the
  architecture and selected skill paths instead of embedding all documents.
- Claude Code: derive a profile in `.claude/agents/` from its starter builder
  or reviewer; preserve tool restrictions, inherit the model, and add the
  scoped responsibility and selected skill references to the body. Never assume
  the legacy coordinator's allowlist permits a new specialist.
- Kimi Code: derive `.kimi-code/agents/` profiles from the matching starter
  template, preserving tool restrictions and adding scoped references. A
  coordinator's explicit subagent list may exclude a new role; check actual
  discovery and dispatch instead of assuming the file grants access.
- Gemini CLI: keep the assignments in team.md; this adapter does not provide
  verified native subagent profiles. Execute sequentially in the current session.

Keep skill packs as on-demand source references; their presence here does not
register slash commands. Copy to a client's native skill directory only when
needed and supported, preserving existing custom skills and internal links.
Never overwrite an existing profile. Reuse a compatible one, otherwise select a
new descriptive name and record it. Avoid creating duplicate idle roles.

Inspect the resulting profile for valid syntax, supported fields, resolved
paths and bounded responsibilities. Then check the client's real discovery and
delegation tools. If unavailable or awaiting reload, proceed with the current
assistant; describe the profile as prepared, not running. Do not relax trust,
permissions or sandbox settings to activate it. Check returned work and changed
paths before accepting a specialist's result.
