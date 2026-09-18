import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const gitPatterns = readFileSync(join(root, '.gitignore'), 'utf8');
const geminiPatterns = readFileSync(join(root, '.geminiignore'), 'utf8');
const memory = ['context.md', 'preferences.md', 'team.md', 'next.md'].map(name => `workspace/${name}`);
const readable = [...memory, 'workspace/output/instagram-week.md'];
const privateFiles = [
  'workspace/owner-notes.md', 'workspace/secrets.json', 'workspace/.env',
  'workspace/output/customers.csv', 'workspace/output/photo.png',
  'workspace/output/.env.md', 'workspace/output/private/note.md',
  '.env', '.env.local', 'answers.json', 'credentials.key', '.audit-tmp/report.md',
];

// Current Gemini's FileDiscoveryService adds .geminiignore after .gitignore;
// GitIgnoreParser uses the ignore package's Git-compatible negation rules.
// This checks those shipped patterns with Git itself, not a live Gemini session.
// https://github.com/google-gemini/gemini-cli/blob/main/packages/core/src/services/fileDiscoveryService.ts
function ignoredBy(patterns, paths) {
  const directory = mkdtempSync(join(tmpdir(), 'brainforge-gemini-ignore-'));
  try {
    const globalConfig = join(directory, 'empty-global-config');
    writeFileSync(globalConfig, '');
    const env = { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: globalConfig };
    const init = spawnSync('git', ['init', '--quiet'], { cwd: directory, env, encoding: 'utf8' });
    assert.equal(init.status, 0, init.stderr || init.error?.message);
    writeFileSync(join(directory, '.gitignore'), patterns);
    const result = spawnSync('git', ['check-ignore', '--no-index', '--stdin'], {
      cwd: directory, env, encoding: 'utf8', input: paths.join('\n') + '\n',
    });
    assert.ok(result.status === 0 || result.status === 1, result.stderr || result.error?.message);
    return new Set(result.stdout.trim().split(/\r?\n/).filter(Boolean));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test('Git continues to keep onboarding memory and deliverables out of commits', () => {
  const ignored = ignoredBy(gitPatterns, [...readable, ...privateFiles]);
  for (const path of [...readable, ...privateFiles]) assert.ok(ignored.has(path), `${path} must stay ignored by Git`);
});

for (const [name, patterns] of [
  ['cloned repository', `${gitPatterns}\n${geminiPatterns}`],
  ['downloaded folder', geminiPatterns],
]) {
  test(`Gemini patterns expose working memory while retaining private files: ${name}`, () => {
    const ignored = ignoredBy(patterns, [...readable, ...privateFiles]);
    for (const path of readable) assert.ok(!ignored.has(path), `${path} must be readable for setup and resumption`);
    for (const path of privateFiles) assert.ok(ignored.has(path), `${path} must remain ignored`);
  });
}
