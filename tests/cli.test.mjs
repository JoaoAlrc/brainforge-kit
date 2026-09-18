import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const cli = fileURLToPath(new URL('../brainforge.mjs', import.meta.url));
const run = (args, cwd) => spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8', windowsHide: true });
function workspace(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'brainforge-cli-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}
test('answers writes valid UTF-8 from another cwd and refuses to overwrite', t => {
  const dir = workspace(t);
  const args = ['answers', '--track', 'web-saas', '--out', 'answers.json'];
  const first = run(args, dir);
  assert.equal(first.status, 0, first.stderr);
  const content = fs.readFileSync(path.join(dir, 'answers.json'), 'utf8');
  assert.equal(JSON.parse(content).track, 'web-saas');
  assert.notEqual(run(args, dir).status, 0);
  assert.equal(fs.readFileSync(path.join(dir, 'answers.json'), 'utf8'), content);
});
test('create refuses existing content before invoking generator', t => {
  const dir = workspace(t);
  const target = path.join(dir, 'used');
  fs.mkdirSync(target);
  fs.writeFileSync(path.join(target, 'important.txt'), 'keep');
  const result = run(['create', '--answers', 'missing.json', '--target', target], dir);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /new or empty directory/);
  assert.deepEqual(fs.readdirSync(target), ['important.txt']);
});
test('incomplete answers fail without creating destination', t => {
  const dir = workspace(t);
  assert.equal(run(['answers', '--track', 'web-saas', '--out', 'answers.json'], dir).status, 0);
  assert.notEqual(run(['create', '--answers', 'answers.json', '--target', 'new'], dir).status, 0);
  assert.equal(fs.existsSync(path.join(dir, 'new')), false);
});
test('unknown and missing options return errors', () => {
  assert.notEqual(run(['answers', '--track']).status, 0);
  assert.notEqual(run(['create', '--force']).status, 0);
  assert.notEqual(run(['list', '--typo']).status, 0);
});
