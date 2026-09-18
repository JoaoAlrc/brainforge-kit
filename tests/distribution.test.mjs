import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {TIERS,selectModel} from '../runtime/model-policy.mjs';
import {codexTier,validateCodexOptions} from '../agent-kit/bootstrap/codex-adapter.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
test('basic distribution excludes app and optional paid asset collections',()=>{
  for(const p of ['desktop','onboarding/packs'])assert.equal(fs.existsSync(path.join(root,p)),false,p);
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'kit.json')));
  assert.equal(manifest.version,JSON.parse(fs.readFileSync(path.join(root,'package.json'))).version);
  for(const p of [manifest.entrypoint,manifest.modelPolicy,'THIRD_PARTY_NOTICES.md','onboarding/skills/impeccable/LICENSE'])assert.ok(fs.existsSync(path.join(root,p)),p);
  const recipes=fs.readFileSync(path.join(root,'onboarding/recipes.json'),'utf8');
  assert.doesNotMatch(recipes,/\.brainforge-kit\/onboarding\/packs/);
});
test('design routing in generated profiles and host policy share critical defaults',()=>{
  assert.equal(codexTier('design-steward','scrum-master'),'critical');
  const selection=selectModel('codex',{id:'design-steward'},'build','standard');
  assert.equal(selection.model,TIERS.critical.model);
  assert.equal(selection.effort,TIERS.critical.effort);
  assert.doesNotThrow(()=>validateCodexOptions({models:{critical:{model:'available-model',effort:'high'}}}));
  assert.equal(selectModel('codex',null,'build','critical','inherit').model,null);
});
