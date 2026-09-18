// SHIM — not the implementation. The real <NAME> lives at
// .claude/hooks/<NAME> and this file re-runs it.
//
// Why a shim instead of a copy: every .codex/hooks/*.mjs in this fleet used to
// be a byte copy of the Claude-side original, and every one of them had
// drifted — including stale scopes.json files that made the Codex side enforce
// an ownership map the Claude side had already corrected. A copy is never
// authority. With this shim there is exactly one engine and exactly one config
// for both runtimes.
//
// Config resolution follows the REAL module, not this shim: the engine
// resolves its JSON from its own `import.meta.url`, so it reads
// .claude/hooks/*.json — which is the point. Do not "fix" that by re-adding a
// .codex/hooks/*.json; it would be ignored and would rot into a second source
// of truth that nothing checks.
//
// The import is relative to THIS file, so it does not care what the working
// directory is when the harness fires the hook.
import "../../.claude/hooks/<NAME>";
