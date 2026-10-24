import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, rmdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { after, test } from 'node:test';

const directory = mkdtempSync(join(tmpdir(), 'cauldron-commit-tests-'));
const messagePath = join(directory, 'message with spaces.txt');
const validator = fileURLToPath(
  new URL('./validate-commit-message.mjs', import.meta.url),
);

after(() => {
  rmSync(messagePath, { force: true });
  rmdirSync(directory);
});

const validMessages = [
  'chore: add Git hooks',
  'fix(parser): prevent invalid input',
  'feat!: change the save format',
  'feat(storage)!: change the save format\n\nBREAKING CHANGE: replace old saves',
  'docs: explain setup\n\nDescribe installation.\n\nRefs: #2',
  'test: cover message validation\r\n\r\nUse Windows line endings.\r\n',
  'custom: allow other lowercase Conventional Commit types',
  'Merge pull request #2 from kakatwa/chore/code-quality\n\nchore: configure tooling',
];

const invalidMessages = [
  '',
  'update files',
  'Chore: add hooks',
  'chore:add hooks',
  'chore: ',
  'chore:  add hooks',
  'chore: add hooks ',
  'chore(): add hooks',
  'chore(scope: add hooks',
  'chore: add hooks\nBody without a blank line',
  'Merge anything',
  'Merge pull request #2',
  'fixup! chore: add hooks',
];

for (const [accepted, messages] of [
  [true, validMessages],
  [false, invalidMessages],
]) {
  for (const message of messages) {
    test(`${accepted ? 'accept' : 'reject'} ${JSON.stringify(message)}`, () => {
      writeFileSync(messagePath, message);
      const result = spawnSync(process.execPath, [validator, messagePath], {
        encoding: 'utf8',
      });
      assert.equal(result.status, accepted ? 0 : 1, result.stderr);
      if (!accepted) assert.match(result.stderr, /Commit message rejected:/);
    });
  }
}

test('reject a missing message file argument', () => {
  const result = spawnSync(process.execPath, [validator], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Pass the commit message file path/);
});

test('reject an unreadable message file', () => {
  const result = spawnSync(
    process.execPath,
    [validator, join(directory, 'missing.txt')],
    { encoding: 'utf8' },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Commit message rejected:/);
});
