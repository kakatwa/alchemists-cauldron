import { readFileSync } from 'node:fs';

const messagePath = process.argv[2];

try {
  if (!messagePath) {
    throw new Error('Pass the commit message file path as the first argument.');
  }

  const message = readFileSync(messagePath, 'utf8').replace(/\r\n/g, '\n');
  const [header, secondLine] = message.split('\n');
  const conventionalHeader = /^[a-z]+(?:\([^()\s]+\))?!?: \S(?:.*\S)?$/u;
  const githubMergeHeader =
    /^Merge pull request #[1-9]\d* from [a-zA-Z0-9-]+\/\S+$/u;

  if (!conventionalHeader.test(header) && !githubMergeHeader.test(header)) {
    throw new Error(
      'Use a lowercase type, optional (scope) and !, then ": " and a description.\n' +
        'Example: chore: add Git hooks\n' +
        'GitHub "Merge pull request #123 from owner/branch" headers are also accepted.',
    );
  }

  if (secondLine !== undefined && secondLine.trim() !== '') {
    throw new Error(
      'Separate the commit header from its body with a blank line.',
    );
  }
} catch (error) {
  console.error(
    `Commit message rejected: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
}
