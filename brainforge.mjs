#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.dirname(fileURLToPath(import.meta.url));
const generator = path.join(root, 'agent-kit/bootstrap/new-project.mjs');
const usage = `Brainforge — advanced project-team generator

  node brainforge.mjs list
  node brainforge.mjs answers --track web-saas --out answers.json
  node brainforge.mjs create --answers answers.json --target ../my-project [--dry-run] [--no-git]
  node brainforge.mjs doctor

Edit the JSON before generation: name, runtimes, placeholders and scopes.
Clients: claude, codex, kimi, gemini. Global settings remain unchanged.
Creates instructions and agents, not application code or dependencies.
For conversational setup without Node, open your assistant and say: Set up Brainforge for me.`;

function fail(message) { console.error(message); process.exitCode = 2; }
function parse(argv, allowed) {
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (!Object.hasOwn(allowed, key)) throw new Error(`Unknown option: ${key}`);
    if (Object.hasOwn(options, key)) throw new Error(`Repeated option: ${key}`);
    if (allowed[key] === 'flag') options[key] = true;
    else {
      const value = argv[++i];
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${key}`);
      options[key] = value;
    }
  }
  return options;
}
function run(args, capture = false) {
  const result = spawnSync(process.execPath, [generator, ...args], {
    encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit', windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    if (capture && result.stderr) console.error(result.stderr.trim());
    process.exitCode = result.status || 1;
    return null;
  }
  return result.stdout || '';
}

try {
  const [command = 'help', ...argv] = process.argv.slice(2);
  if (command === 'help' || command === '--help' || command === '-h') console.log(usage);
  else if (command === 'list') { parse(argv, {}); run(['--list']); }
  else if (command === 'answers') {
    const o = parse(argv, { '--track': 'value', '--out': 'value' });
    if (!o['--track'] || !o['--out']) throw new Error('Provide --track and --out.');
    const destination = path.resolve(o['--out']);
    const content = run(['--track', o['--track'], '--print-answers'], true);
    if (content !== null) {
      JSON.parse(content);
      fs.writeFileSync(destination, content, { encoding: 'utf8', flag: 'wx' });
      console.log(`Answers written to ${destination}. Fill the <FILL:...> fields and select runtimes before generation.`);
    }
  } else if (command === 'create') {
    const o = parse(argv, { '--answers': 'value', '--target': 'value', '--dry-run': 'flag', '--no-git': 'flag' });
    if (!o['--answers'] || !o['--target']) throw new Error('Provide --answers and --target.');
    const destination = path.resolve(o['--target']);
    if (fs.existsSync(destination) && (!fs.statSync(destination).isDirectory() || fs.readdirSync(destination).length)) {
      throw new Error('The target must be a new or empty directory. Your existing files were preserved.');
    }
    const args = ['--answers', path.resolve(o['--answers']), '--target', destination];
    if (o['--dry-run']) args.push('--dry-run');
    if (o['--no-git']) args.push('--no-git');
    run(args);
  } else if (command === 'doctor') {
    parse(argv, {});
    const major = Number(process.versions.node.split('.')[0]);
    console.log(`Node ${process.versions.node}: ${major >= 22 ? 'OK' : 'use Node 22 or newer'}`);
    const git = spawnSync('git', ['--version'], { encoding: 'utf8', windowsHide: true });
    console.log(git.status === 0 ? git.stdout.trim() : 'Git not found: install Git or use create --no-git.');
    if (git.status === 0) {
      const configured = ['user.name', 'user.email'].every(key => {
        const result = spawnSync('git', ['config', '--get', key], { encoding: 'utf8', windowsHide: true });
        return result.status === 0 && result.stdout.trim();
      });
      console.log(configured ? 'Git identity is configured here; confirm it also applies in the target directory.' : 'Git identity is missing: configure your name/email in Git or use create --no-git.');
    }
    const cat = JSON.parse(fs.readFileSync(path.join(root, 'agent-kit/catalog/catalog.json'), 'utf8'));
    console.log(`Catalog: ${Object.keys(cat.agents).length} roles, ${Object.keys(cat.skills).length} skills, ${Object.keys(cat.tracks).length} tracks.`);
    console.log('AI clients are installed and authenticated separately. Doctor does not test login or call paid models.');
    console.log('Full Claude catalog and business template: see docs/CLAUDE-REVIEW.md before distributing as stable.');
    if (major < 22) process.exitCode = 1;
  } else throw new Error(`Unknown command: ${command}\n\n${usage}`);
} catch (error) { fail(error.message); }
