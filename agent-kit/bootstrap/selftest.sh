#!/usr/bin/env bash
# Create disposable projects and verify generated files and hook behavior.
# Run with Bash, including Git Bash on Windows:
#   bash bootstrap/selftest.sh [track...]    (default: all four tracks)
# Repeat after catalog changes; a previous manual run does not prove regression safety.
set -u
KIT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="${TMPDIR:-/tmp}/kit-selftest-$$"
TRILHAS=("$@")
[ ${#TRILHAS[@]} -eq 0 ] && TRILHAS=(web-saas mobile-expo godot-game unreal-game)
falhas=0

ok()   { printf "    ok    %s\n" "$1"; }
fail() { printf "    FAIL %s\n" "$1"; falhas=$((falhas+1)); }

for t in "${TRILHAS[@]}"; do
  echo "== track: $t =="
  alvo="$TMP/$t"
  resp="$TMP/$t.json"
  mkdir -p "$TMP"

  node "$KIT/bootstrap/new-project.mjs" --track "$t" --print-answers > "$resp" 2>/dev/null \
    || { fail "--print-answers"; continue; }

  # Fill project-specific answers with plausible nonempty values so the
  # generated project is exercised rather than passing with empty placeholders.
  node -e '
    const fs=require("fs"); const p=process.argv[1]; const t=process.argv[2];
    const r=JSON.parse(fs.readFileSync(p,"utf8"));
    r.name="selftest-"+t;
    for (const k of Object.keys(r.placeholders)) {
      r.placeholders[k] = ({
        PROJECT:"Selftest", ENGINE:t, REPORT_LANGUAGE:"en",
        CHECK_COMMAND:"npm test", HEADLESS_CMD:"echo headless",
        CANON_PATHS:"docs/canon/", DECISION_LOG:"docs/DECISIONS.md",
        DOCS_ROOT:"docs/", RESEARCH_DIR:"docs/research/", EVIDENCE_DIR:"docs/qa/",
        MIGRATIONS_DIR:"supabase/migrations/", DB:"Postgres + RLS",
        GENERATED_FILES:"src/routeTree.gen.ts", MONEY_PATHS:"src/lib/billing/",
        GAMEPLAY_PATHS:"src/core/", RULES_PATHS:"data/rules/", TESTS_DIR:"tests/",
        TOKENS_DIR:"src/styles.css", RISK_CLASS:"routine | logic | money",
        OWNERS:"see scopes.json", QA_AGENT:"qa-web", ENGINE_CRAFT_SKILL:"engine-craft",
      })[k] ?? ("selftest-"+k.toLowerCase());
    }
    fs.writeFileSync(p, JSON.stringify(r,null,2));
  ' "$resp" "$t" || { fail "fill answers"; continue; }

  out=$(node "$KIT/bootstrap/new-project.mjs" --answers "$resp" --target "$alvo" 2>&1)
  echo "$out" | grep -q "self-test: .*272 passed, 0 failed" && ok "scope-guard --self-test in generated project" || { fail "--self-test"; echo "$out" | sed 's/^/      /' | head -12; }
  echo "$out" | grep -qi "check:.*\(ok\|sem problema\|0 problem\)" && ok "scope-guard --check" || echo "    note  --check: $(echo "$out" | grep -i -- '--check:' | head -1)"

  # 1. A ready project must have no unresolved placeholders.
  # The literal word <PLACEHOLDER> explains the mechanism; ignore that one word.
  restou=$(grep -rhoE "<[A-Z][A-Z0-9_]{2,}>" "$alvo/.claude" 2>/dev/null | grep -v "^<PLACEHOLDER>$" | sort -u)
  if [ -z "$restou" ]; then ok "no unresolved placeholders"
  else fail "remaining placeholder: $(echo "$restou" | tr '\n' ' ')"; fi

  # 2. Generated scopes.json must be valid and actually fail closed.
  node -e '
    const fs=require("fs");const s=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));
    const err=[];
    if(!s.lead) err.push("missing lead");
    if(!Object.keys(s.write||{}).length) err.push("no writable roles");
    for(const [a,d] of Object.entries(s.write||{})) {
      for(const p of d.allow||[]) if(p.includes("*")&&!/^[^*]+\*$/.test(p)) err.push(a+": invalid glob "+p);
      if(!(d.allow||[]).length) err.push(a+": empty allow");
    }
    if(!(s.shell||{})["workflow-subagent"]) err.push("missing workflow-subagent identity");
    if(err.length){console.error(err.join("; "));process.exit(1)}
  ' "$alvo/.claude/hooks/scopes.json" && ok "scopes.json consistent" || fail "scopes.json"

  # 3. Live negative control: a read-only reviewer must be denied a code write.
  rev=$(node -e '
    const fs=require("fs");const s=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));
    console.log((s.read_only||[])[0]||"");
  ' "$alvo/.claude/hooks/scopes.json")
  if [ -n "$rev" ]; then
    ev="{\"tool_name\":\"Write\",\"tool_input\":{\"file_path\":\"src/x.ts\"},\"cwd\":\"$alvo\",\"agent_name\":\"$rev\"}"
    if printf '%s' "$ev" | node "$alvo/.claude/hooks/scope-guard.mjs" 2>&1 | grep -q '"deny"'; then
      ok "reviewer '$rev' DENIED writing src/x.ts (live fail-closed check)"
    else
      fail "reviewer '$rev' could write code"
    fi
    # Positive control: the lead must be able to write in docs/.
    ev2="{\"tool_name\":\"Write\",\"tool_input\":{\"file_path\":\"docs/x.md\"},\"cwd\":\"$alvo\",\"agent_name\":\"$(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).lead)' "$alvo/.claude/hooks/scopes.json")\"}"
    if printf '%s' "$ev2" | node "$alvo/.claude/hooks/scope-guard.mjs" 2>&1 | grep -q '"deny"'; then
      fail "positive control: lead denied in docs/; guard denies everything"
    else
      ok "positive control: lead ALLOWED in docs/"
    fi
  fi

  # 4. Legacy compatibility check when a Codex shim is present.
  if [ -f "$alvo/.codex/hooks/scope-guard.mjs" ]; then
    node "$alvo/.codex/hooks/scope-guard.mjs" --self-test 2>&1 | grep -q "272 passed, 0 failed" \
      && ok "self-test through Codex shim" || fail "Codex shim"
    [ -f "$alvo/.codex/hooks/scopes.json" ] && fail ".codex/hooks/scopes.json recreated (would be ignored and drift)" || ok "no duplicate config in .codex"
  fi

  # 5. Every skill required by an agent must have been copied.
  faltando=$(node -e '
    const fs=require("fs"),path=require("path");const a=process.argv[1];
    const tem=new Set(fs.existsSync(a+"/.claude/skills")?fs.readdirSync(a+"/.claude/skills"):[]);
    const falta=new Set();
    for(const f of (fs.existsSync(a+"/.claude/agents")?fs.readdirSync(a+"/.claude/agents"):[])){
      const fm=(fs.readFileSync(a+"/.claude/agents/"+f,"utf8").split("---")[1]||"");
      const m=fm.match(/skills:([\s\S]*?)(?:\n[a-z_]+:|$)/); if(!m) continue;
      for(const s of m[1].split(/[\n,·]/).map(x=>x.replace(/^\s*-\s*/,"").trim()).filter(Boolean))
        if(!s.startsWith("<")&&!tem.has(s)) falta.add(s);
    }
    console.log([...falta].join(" "));
  ' "$alvo")
  [ -z "$faltando" ] && ok "all referenced skills copied" || fail "referenced skill missing: $faltando"

  # 6. Generated projects must start with their own Git history.
  if git -C "$alvo" rev-parse HEAD >/dev/null 2>&1; then
    ok "Git initialized with an initial commit"
  else
    fail "generated project has no Git history (expected git init + commit)"
  fi

  echo "    ($(find "$alvo" -type f | wc -l) files in $alvo)"
done

echo
if [ "$falhas" -eq 0 ]; then
  echo "ALL PASSED. Removing $TMP"
  rm -rf "$TMP"
  exit 0
else
  echo "$falhas FAIL(S). $TMP was retained for inspection."
  exit 1
fi
