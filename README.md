# Alchemist's Cauldron

An RS School game project. The eventual goal is to mix ingredients, bring
temperature, density, and magic power into a recipe's target ranges, and brew
potions before time or lives run out.

## Current status

Story 1 is in progress. The project foundation displays a responsive welcome
page. Gameplay is not implemented yet, so there are no game controls.
ESLint and Prettier are configured. Git hooks, the PR template, and deployment
automation are planned for subsequent feature PRs.

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

| Command                | Purpose                                                       |
| ---------------------- | ------------------------------------------------------------- |
| `npm run dev`          | Start Vite's development server with live updates.            |
| `npm run typecheck`    | Check TypeScript types without generating files.              |
| `npm run build`        | Check types, then bundle production files into `dist/`.       |
| `npm run preview`      | Serve the production build locally after building.            |
| `npm run lint`         | Check code quality; errors or warnings make the command fail. |
| `npm run format`       | Rewrite supported project files with consistent formatting.   |
| `npm run format:check` | Check formatting without changing files.                      |

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

Review the formatting changes before committing. These checks are currently
manual; automated commit and push hooks will be added in the next feature group.

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
