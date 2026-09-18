---
name: unreal-ops
description: "Build, generate content, run headless checks, capture, and package <PROJECT>'s Unreal project without deadlocking the build mutex or opening the Editor: exact commands, flags, result files, approval criteria, and prohibitions. Use before Build.bat, UnrealEditor-Cmd, RunUAT, or Scripts/ commands."
---

# Unreal ops

Unreal root: `<UE_ROOT>`; project: `<UE_ROOT>/<PROJECT>.uproject`; targets:
`<PROJECT>Editor` (Editor), `<PROJECT>` (Game, packaging only), generated from the
module name. Renamed projects override these in the final block. Engine `<ENGINE>`
lives in `<ENGINE_DIR>`. Kit defaults: `Scripts/` under the Unreal root and probe
map `/Game/Maps/Probe`. Run everything through **Bash**; PowerShell only through
`powershell -NoProfile -ExecutionPolicy Bypass -File Scripts/example.ps1`.

## Defining rule

**One build/Editor at a time across the entire session.** UBT and UnrealEditor-Cmd
share a global mutex. Simultaneous attempts lock up the session until killed.
The lead keeps exactly one build-authorized agent active; others wait or perform
non-compiling work. `<CHECK_COMMAND>` compiles pure code only (no engine includes)
and can run alongside anything. Sandbox restrictions sometimes block UBT before
logging: stop, report `BLOCKED (UBT stuck in sandbox)`, and the lead reruns with
access granted. Never bypass the restriction.

## Build

```bash
export DOTNET_CLI_HOME="<UE_ROOT>/Saved/DotNet" DOTNET_CLI_TELEMETRY_OPTOUT=1
"<ENGINE_DIR>/Engine/Build/BatchFiles/Build.bat" <PROJECT>Editor Win64 Development \
  "<UE_ROOT>/<PROJECT>.uproject" -WaitMutex -NoHotReloadFromIDE -NoUBA
```

C++ compilation errors appear in Build.bat's **stdout**: read stdout, not just
exit status. Never use `-UBA`, an IDE, or change `BuildSettingsVersion`.

## Headless proof — approval criteria

| Proof | Command | Result |
| :-- | :-- | :-- |
| Pure rules (engine-free logic) | `<CHECK_COMMAND>` | Assertions; exit 0 + `passed` |
| First-minute smoke | `<HEADLESS_CMD> -Mode FirstMinute [-Graphics]` | `Saved/Tests/FirstMinute.txt` |
| In-game action/reaction | `<HEADLESS_CMD> -Mode Combate` (one mode per journey) | `Saved/Tests/CombateProbe.txt` |
| Multiprocess (networked projects only) | `<HEADLESS_CMD> -Mode Net -Peers 2 [-PackagedRoot Release/Windows]` | `Saved/Tests/NetProbe_*.txt`, one per peer |

Approval requires a **file newer than run start** and `CHECKS=N FAILURES=0` with
N > 0 and no `FAIL |` lines. Full criteria, result format, and sabotage-to-red
principles are in `verify-gameplay`; only Unreal specifics belong here. Engine
exit 0 is not approval. Scripts reject it already; direct engine runs need your check:

```bash
UnrealEditor-Cmd.exe "<UE_ROOT>/<PROJECT>.uproject" /Game/Maps/Probe -game -unattended \
  -nop4 -nosplash -NoScreenMessages -abslog="Saved/Logs/probe.log"
```

Add `-NullRHI -nosound` for rules, or `-RenderOffscreen -windowed -ResX=1920 -ResY=1080
-ForceRes -ExecCmds="t.MaxFPS 60"` for graphics. Every probe uses **its own save**,
never the player's slot. Default timeout: 5 minutes per probe; scripts terminate
only their own process on timeout.

## Captures

Use the game's own offscreen viewport through its probe capture function
(default 1920×1080). **Never** capture the desktop, compete for focus, or launch
the graphical Editor from an agent. `.cmd` launchers (play, host, join) belong to
the human. Inspect images with `Read` before making claims, ≤5 per round.
`verify-gameplay` defines what captures do and do not prove.

## Content through the headless Editor

```bash
UnrealEditor-Cmd.exe "<UE_ROOT>/<PROJECT>.uproject" -run=pythonscript \
  -script=Scripts/bootstrap_content.py -unattended -NullRHI -nop4 -log=Saved/Logs/bootstrap.log
```

Engine Python property names change across versions. Verify `unreal.*` in
`<ENGINE>` docs or `Engine/Plugins/Experimental/PythonScriptPlugin`, never memory.
New assets go in their area's `Content/` subfolder according to CLAUDE.md topology;
scripts **preserve** existing content. Never enable plugins, change
`EngineAssociation`/engine version, or import store content without a recorded
human decision and license entry in `<DOCS_ROOT>/licenses.md`.

## Package

Windows Development package with pak through RunUAT BuildCookRun. **Update the
main delivery in place**, default `Release/Windows/` under the Unreal root:
launcher, binaries, README, verification, captures, and evidence together;
preserve profiles/saves. Build incrementally during development. Re-cook for
playable rounds or changes requiring executable proof. **No new folder or ZIP
per adjustment**; separate snapshots only for meaningful milestones.
Before delivery claims: graphical checks with `-PackagedRoot Release/Windows`,
network checks if networking changed, inspected package captures, and results
recorded in project state. Dated deliveries and milestone snapshots are
**immutable**: never rewrite, delete, or reopen them.

## Processes

Use `WaitForExit` on your own process, never `Start-Process -Wait` on something
spawning persistent child services. Terminate only your own PID; never poll.
See `verify-gameplay`.

## Prohibited

Graphical Editor; two simultaneous builds; desktop captures; `-UBA`; engine/plugin
version changes; unlicensed paid assets; firewall changes; publishing; rewriting
dated deliveries; weakening checks; claiming unperformed executions.

## Project block — `<PROJECT>`

> **This tail belongs to the project, not the kit.** New catalog copies replace
> everything above, **never** this block. Resolve `<UE_ROOT>` and `<ENGINE_DIR>`
> here and override kit defaults that do not apply.

- **Root/engine:** `<UE_ROOT>`, `<ENGINE_DIR>`, exact `<ENGINE>` version and known pitfalls (Python API, cvars, flags).
- **Actual names:** Editor/Game targets if unlike `<PROJECT>Editor`/`<PROJECT>`; probe map if unlike `/Game/Maps/Probe`; `Scripts/` and bootstrap if relocated.
- **Commands:** `<CHECK_COMMAND>` (pure code), `<HEADLESS_CMD>` (engine probe), available modes, saves/timeouts.
- **Delivery:** package root if unlike `Release/Windows/`; immutable snapshot definition; licenses in `<DOCS_ROOT>/licenses.md`; human `.cmd` launchers.
- **Canon:** `<CANON_PATHS>` and `<OWNERS>`; this skill reads, never edits.
