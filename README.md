# Alchemist's Cauldron

An RS School game project. The eventual goal is to mix ingredients, bring
temperature, density, and magic power into a recipe's target ranges, and brew
potions before time or lives run out.

## Current status

Story 1 is in progress. The project foundation displays a responsive welcome
page. Gameplay is not implemented yet, so there are no game controls.
ESLint, Prettier, and Husky Git hooks are configured. The PR template and
deployment automation are planned for the delivery feature group.

## Task stages

- Story 1: repository, tooling, and folder structure (58 points).
- Level 1: a playable game with fixed rules.
- Level 2: difficulty selection and saving/continuing a game.
- Level 3: drag and drop, tooltips, reactions, keyboard shortcuts, and effects.

Only Story 1 is in scope for this setup.
See the [official task](https://github.com/rolling-scopes-school/qualifying-stage/blob/main/tasks/game-alchemists-cauldron/README.md)
and [Story 1 criteria](https://github.com/rolling-scopes-school/qualifying-stage/blob/main/tasks/game-alchemists-cauldron/precondition-user-story.md).

## Run locally

Use Node.js 24.x with its bundled npm. The `.nvmrc` file records that major version.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite, including `/alchemists-cauldron/`.

| Command                | Purpose                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run dev`          | Start Vite's development server with live updates.               |
| `npm run typecheck`    | Check TypeScript types without generating files.                 |
| `npm run build`        | Check types, then bundle production files into `dist/`.          |
| `npm run preview`      | Serve the production build locally after building.               |
| `npm run lint`         | Check code quality; errors or warnings make the command fail.    |
| `npm run format`       | Rewrite supported project files with consistent formatting.      |
| `npm run format:check` | Check formatting without changing files.                         |
| `npm run prepare`      | Install or repair Husky hooks in this Git checkout.              |
| `npm run test:hooks`   | Test valid and invalid commit messages without creating commits. |

Vite serves source files during development and bundles them for production.
TypeScript catches type mistakes before the browser runs the code. Both are
development tools; this project has no runtime library dependencies.

## Code quality

ESLint checks JavaScript and TypeScript using recommended rules. Explicit `any`
and `console.log` are errors. Browser globals are available in application code;
Node.js globals are available in tooling configuration. Generated build output
and installed dependencies are excluded.

Prettier handles formatting: two spaces, semicolons, single quotes where
appropriate, trailing commas, an 80-character preferred line width, and LF line
endings. `eslint-config-prettier` prevents conflicting formatting rules while
keeping the code-quality rules enabled. Prettier skips generated builds,
dependencies, and the npm-managed lockfile; it also respects `.gitignore`.

TypeScript is pinned to 6.0.3 because typescript-eslint 8.72.0 supports TypeScript
versions below 6.1, not the foundation's original 7.0.2. All strict compiler
settings are retained, and Vite remains at 8.3.5. Do not use `--force` or
`--legacy-peer-deps` to bypass compatibility checks when updating tools.

Before a feature PR, run:

```sh
npm run format
npm run typecheck
npm run lint
npm run format:check
npm run build
```

Review formatting changes before committing. The pre-push hook runs lint and
format checks automatically; type checking and build remain separate commands.

## Git hooks

Husky 9.1.7 connects Git events to our checks. In a normal Git checkout, run
`npm ci` with development dependencies and lifecycle scripts enabled. npm runs
`prepare` automatically, which installs Husky's wrappers and sets the local
`core.hooksPath` to `.husky/_`. No global Husky installation is needed.

The tracked `.husky/commit-msg` and `.husky/pre-push` files use portable POSIX
shell commands for Ubuntu and Git Bash on Windows. Generated files in
`.husky/_` are ignored and must not be edited or committed. The repository's
`.gitattributes` keeps tracked shell files on LF line endings.

### Before a commit

Git passes the message file to `commit-msg`. Our Node.js validator reads it and
blocks the commit if the header is malformed. Write a lowercase type, an optional
scope, an optional breaking-change `!`, then a colon, one space, and a nonempty
description. Separate an optional body or footer from the header with a blank
line. Examples:

```text
chore: add Git hooks
fix(storage): handle a missing save
feat!: change the save format
```

Use present-tense imperative wording: `add hooks`, not `added hooks` or
`adds hooks`. Grammar and whether the description accurately explains the change
still require human review; the validator checks structure, not English grammar.
Types such as `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `perf`, `build`,
`ci`, `chore`, and `revert` are conventional; other lowercase types are permitted
by the [RS School convention](https://rs.school/docs/git-convention).

For our **Create a merge commit** workflow, the validator also accepts GitHub's
specific generated header, such as
`Merge pull request #2 from kakatwa/chore/code-quality`. It does not accept any
arbitrary message starting with `Merge`. GitHub creates remote merge commits
without running your local hooks; pulling those existing commits does not run
`commit-msg` again. Use conventional headers for your own commits.

### Before a push

`pre-push` runs `npm run lint` and, if lint passes, `npm run format:check`. A
failure stops the push. These checks inspect the working tree, including
uncommitted supported files, and do not automatically rewrite or stage files.
Fix lint errors, run `npm run format` for formatting issues, review the changes,
commit any intended fixes, and retry the push.

### Troubleshooting

- If hooks do not run, check `git config --get core.hooksPath`; expect `.husky/_`.
  Run `npm run prepare` to repair installation, then `npm run test:hooks`.
- A downloaded ZIP is not a Git checkout. Clone the repository and run `npm ci`
  from its root, with permission to update its Git configuration.
- Use Node 24.x and make sure `node`, `npm`, and Git are on the terminal's PATH.
  On Windows, install Git for Windows (which supplies the shell used by hooks).
  If PowerShell blocks `npm.ps1`, use `npm.cmd ci` or `npm.cmd run prepare`.
- A GUI Git client must also be able to find Node/npm. Restart it after fixing
  PATH, or configure your version manager in `~/.config/husky/init.sh` as described
  in the [Husky guide](https://typicode.github.io/husky/how-to.html).
- Install development dependencies and allow npm lifecycle scripts. Do not use
  `--no-verify`, disable Husky, or suppress lint/format rules to get past failures.
- The message tests create and clean up temporary files outside the repository;
  they never make commits or change branches. Git hooks are local checks, not a
  replacement for future CI checks.

## Project structure

```text
src/
  assets/   Individual images and other static assets
  data/     Ingredient and recipe definitions (reserved)
  logic/    Game rules without DOM access (reserved)
  state/    Current game state (reserved)
  storage/  Persistence helpers (reserved)
  styles/   Page styles
  ui/       DOM rendering
  main.ts   Application entry point
```

Reserved folders contain `.gitkeep` files so Git tracks them without adding
unused code. Future game rules belong in `logic/`, separate from rendering in `ui/`.

## Branch workflow

Create each feature branch from the updated `story-1`. Commit small changes,
open a PR back into `story-1`, and merge it using a merge commit to preserve the
individual commits before starting the next group.

When all setup work is verified, open `story-1` into `main` and leave that final
PR unmerged. Submit its URL in RS App under **Cross-Check: Submit**.

## Deployment status

No public deployment has been verified yet. Vite's base path is configured as
`/alchemists-cauldron/` for this repository's GitHub Pages path. The deployment
workflow and GitHub settings instructions will be added in the delivery PR.
