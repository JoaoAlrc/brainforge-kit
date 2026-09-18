# Existing sources

Entry points verified during adaptation. This is not another canon or backlog;
consult only what the task needs.

- [README.md](../README.md)
- `agents/`, `hooks/`, `skills/`, and `templates/` contain the Claude kit. Codex
  variants live in `.codex/` and `.agents/`; do not convert the source in place.
- `bootstrap/codex-adapter.mjs` generates native configuration and roles;
  `bootstrap/client-adapters.mjs` generates shared role/skill copies. Canonical
  sources remain in `catalog/`.
- `bootstrap/codex-adapter.test.mjs` covers all four tracks, reader sandboxing,
  model configuration, runtime selection, and file preservation.
