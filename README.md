# Alchemist's Cauldron

An RS School game project. The eventual goal is to mix ingredients, bring
temperature, density, and magic power into a recipe's target ranges, and brew
potions before time or lives run out.

## Current status

Story 1 is in progress. The project foundation displays a responsive welcome
page. Gameplay is not implemented yet, so there are no game controls.
ESLint, Prettier, and Husky Git hooks are configured. The RS School PR template
and GitHub Pages workflow are prepared. The delivery feature PR, a successful
public deployment, and the final unmerged submission PR are still pending.
This repository does not yet represent a fully delivered Story 1.

## Task stages

- Story 1: repository, tooling, and folder structure (58 points).
- Level 1: a playable game with fixed rules.
- Level 2: difficulty selection and saving/continuing a game.
- Level 3: drag and drop, tooltips, reactions, keyboard shortcuts, and effects.

Only Story 1 is in scope for this setup.
See the [official task](https://github.com/rolling-scopes-school/qualifying-stage/blob/main/tasks/game-alchemists-cauldron/README.md)
and [Story 1 criteria](https://github.com/rolling-scopes-school/qualifying-stage/blob/main/tasks/game-alchemists-cauldron/precondition-user-story.md).

## Run locally

Use Node.js 24.22.1 or a newer 24.x release with its bundled npm. The `.nvmrc`
file pins the reviewed security release; `.npmrc` rejects installs on unsupported
Node versions. With nvm, run `nvm install` and `nvm use` before installing packages.
On Windows without a version manager, install the patched Node.js 24.x release
and restart your terminal.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite, including `/alchemists-cauldron/`.
With the default port, this is `http://localhost:5173/alchemists-cauldron/`.
Stop the server with Ctrl+C. To inspect the production build locally:

```sh
npm run build
npm run preview
```

Open `http://localhost:4173/alchemists-cauldron/`, or use the port Vite prints
if that port is occupied. Preview serves `dist/`; rebuild after source changes.

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

## Security maintenance

The October 25, 2026 review found no known dependency vulnerabilities with
`npm audit`, including development dependencies. The installed Node.js 24.19.0
was below the required security patch level. Node.js 24.22.1 fixes the October 21
runtime vulnerabilities, including the Brotli decoder issue CVE-2026-111497;
see the [official release notes](https://nodejs.org/en/blog/release/v24.22.1).
Changing the project version requirement does not upgrade an installed runtime:
verify `node --version` after installing the update.

This repository contains a static browser application, with no PHP backend or
production Node.js server. Publish only the generated `dist/` files. Keep Vite's
development and preview servers local; they are not production hosting servers.
The review covers this repository and the active local Node.js version, not a
deployed host, other applications, or evidence of a machine compromise.

Run `npm audit` regularly and after dependency changes. An audit checks known npm
advisories, not Node.js runtime vulnerabilities or every possible security issue.
Keep Node.js patched and update the version floor and `.nvmrc` when reviewing
future security releases. Retain the lockfile and use `npm ci` for reproducible
installs.

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
npm run test:hooks
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
- Use Node 24.22.1 or newer within 24.x, and make sure `node`, `npm`, and Git are on
  the terminal's PATH.
  On Windows, install Git for Windows (which supplies the shell used by hooks).
  If PowerShell blocks `npm.ps1`, use `npm.cmd ci` or `npm.cmd run prepare`.
- A GUI Git client must also be able to find Node/npm. Restart it after fixing
  PATH, or configure your version manager in `~/.config/husky/init.sh` as described
  in the [Husky guide](https://typicode.github.io/husky/how-to.html).
- Install development dependencies and allow npm lifecycle scripts. Do not use
  `--no-verify`, disable Husky, or suppress lint/format rules to get past failures.
- The message tests create and clean up temporary files outside the repository;
  they never make commits or change branches. Git hooks are local checks, not a
  replacement for the checks run by GitHub Actions.

## Project structure

```text
.github/
  pull_request_template.md  RS School review/submission fields
  workflows/pages.yml      Checks and story-1 Pages deployment
.husky/                    Tracked commit-msg and pre-push scripts
docs/screenshots/          Actual local production-preview captures
scripts/                   Commit-message validator and regression tests
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

Use [.github/pull_request_template.md](.github/pull_request_template.md) for PR
descriptions. If GitHub does not prefill it while the template is absent from the
default branch, copy its contents manually. Feature PRs describe their own scope;
the final PR covers all eight tasks, actual screenshots, a verified deployment,
and real submission/deadline dates. Never mark pending work as complete.

The earlier runtime-security commit `3914519` was made directly on `story-1`.
Its history is preserved; subsequent groups follow the feature-PR workflow.

## GitHub Pages deployment

**Status: configuration prepared; no successful public deployment verified.**
There is no verified deployment URL to report yet. Obtain it from the successful
deployment job or Settings → Pages, then open it before adding it to the final PR.

### What gets deployed

[The workflow](.github/workflows/pages.yml) runs checks on PRs targeting `story-1`
or `main`, but PR runs never deploy. A push to `story-1`, including merging a
feature PR into it, runs the checks and publishes only the generated `dist/`
artifact after they pass. This deploys the Story 1 scaffold while the final
`story-1` → `main` PR stays unmerged. `main` is not the deployment source.

The Ubuntu runner uses the exact Node version in `.nvmrc` and runs `npm ci`,
type checking, ESLint, Prettier checks, commit-message tests, and the production
build. Husky remains enabled. Official GitHub Actions are pinned to verified
commit revisions; review those pins when updating actions. Only the deployment
job receives Pages write and OIDC token permissions; no personal access token is
needed. Deployment uses the `github-pages` environment.

Vite already sets `base: '/alchemists-cauldron/'`. This matches this repository's
project-site subpath, so built JavaScript, CSS, and favicon URLs keep that prefix.
If the repository name or hosting path changes later, review this setting before
deploying. Do not publish the source tree or run Vite's preview server as hosting.

### GitHub settings to enable before merging the delivery PR

In the `kakatwa/alchemists-cauldron` repository, an owner/maintainer should:

1. Open **Settings → Actions → General** and ensure Actions are enabled. If actions
   are restricted, allow the official `actions/checkout`, `actions/setup-node`,
   `actions/configure-pages`, `actions/upload-pages-artifact`, and
   `actions/deploy-pages` actions. Leave the default token permissions read-only;
   the workflow requests the deployment permissions for its deployment job.
2. Open **Settings → Pages → Build and deployment**. Set **Source** to
   **GitHub Actions**. Do not select **Deploy from a branch**, a `gh-pages` branch,
   or a source folder; the workflow supplies the built artifact.
3. Open **Settings → Environments**. Create or open **github-pages**. Under
   **Deployment branches and tags**, choose **Selected branches and tags** and
   add a **Branch** rule matching `story-1`. If a default rule permits only `main`,
   replace that rule with `story-1`. Keep any required approvals and approve the
   deployment when prompted.
4. Keep `main` as the default branch. Do not merge the final submission PR to
   enable deployment. If Pages settings are unavailable, verify repository
   visibility, plan eligibility, and your admin/maintainer permissions.

These are instructions, not confirmation that the remote settings have been
changed. See the official [Pages publishing settings](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
and [custom workflow requirements](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

### Merge, verify, and submit

1. Push the delivery branch, open its feature PR into `story-1`, review its checks,
   and merge using **Create a merge commit**. Pull the updated `story-1` locally.
2. Open **Actions → Verify and deploy Story 1** and inspect the **push** run for
   the merge commit. Both **Check and build** and **Deploy story-1 to Pages** must
   succeed. A successful PR check alone is not a deployment.
3. If the run failed because Pages/environment settings were not ready, fix the
   settings and select **Re-run all jobs** on that push run. There is no manual
   dispatch dependency on the workflow existing in `main`.
4. Open the actual public URL reported by the deployment. Verify the title,
   gameplay-not-implemented message, styles, favicon, reload, and asset requests.
   Check 375px and 1920px widths for horizontal overflow and inspect the console.
5. Capture a real screenshot of the deployed scaffold and attach it to the final
   PR. A local preview screenshot is useful evidence but does not prove deployment.
6. After verification, prepare the final `story-1` → `main` PR. Complete its
   task link, screenshot, verified URL, actual dates, and self-assessment. Leave
   it **open and unmerged**. Submit its URL in **RS App → Cross-Check: Submit**.

For deployment failures, inspect the failed step first. Missing Pages setup or
an environment branch restriction must be fixed in settings. An engine error
means the runner's Node version must satisfy `package.json`. Asset 404s require
checking the Vite base path and that the uploaded artifact is `dist/`.

### Local verification evidence (25 October 2026)

On Windows with Node 24.22.1 and npm 11.19.1, a clean `npm ci`, type checking,
ESLint, Prettier checks, the production build, and all 23 commit-message tests
passed. `npm ci` installed Husky with `core.hooksPath` set to `.husky/_`.
The workflow YAML and its triggers, deployment guard, permissions, artifact path,
and pinned action references were checked locally. The GitHub-hosted Ubuntu
workflow has not run yet.

Chrome 156.0.8078.47 inspected the built local preview at 375 × 812 and
1920 × 1080. Document widths matched the viewport widths; no horizontal overflow,
failed resource requests, console errors, or runtime exceptions were observed.
All three built asset URLs (JavaScript, CSS, and favicon) use the
`/alchemists-cauldron/assets/` prefix and resolve to output files.

- [375px local preview screenshot](docs/screenshots/story-1-375.png)
- [1920px local preview screenshot](docs/screenshots/story-1-1920.png)

These are actual local production-preview captures, not mockups or screenshots
of a public deployment. Recheck the deployed site and attach a deployed screenshot
before final submission. Local results do not confirm remote Pages settings.

## Story 1 acceptance-criteria evidence

The table maps the 58 available points to implementation evidence. It is not a
claim of awarded points or completed remote delivery. All requirements are linked
from the [official Story 1 page](https://github.com/rolling-scopes-school/qualifying-stage/blob/main/tasks/game-alchemists-cauldron/precondition-user-story.md).

| Criterion                      | Points | Evidence                                                                                     |
| ------------------------------ | -----: | -------------------------------------------------------------------------------------------- |
| PRE-QS-1-1-1: Repository setup |     10 | Git repository, this README, `.gitignore`, `package.json`, committed npm lockfile            |
| PRE-QS-1-1-2: Folder structure |     10 | Seven domain folders under `src/`; DOM rendering in `ui/`, future rules reserved in `logic/` |
| PRE-QS-1-1-3: PR template      |      5 | `.github/pull_request_template.md` with all five official fields and assessment checklist    |
| PRE-QS-1-2-1: Bundler          |     10 | Vite, dev/build/preview commands, CSS/SVG bundling, repository base path                     |
| PRE-QS-1-2-2: TypeScript       |      5 | `strict`, `noImplicitAny`, separate typecheck, checking before production build              |
| PRE-QS-1-2-3: ESLint           |      5 | Recommended rules plus explicit-any and console.log rejection; lint script                   |
| PRE-QS-1-2-4: Prettier         |      5 | Shared configuration, format/check scripts, ESLint compatibility configuration               |
| PRE-QS-1-2-5: Husky            |      8 | Automatic prepare, commit-msg validator/tests, lint/format pre-push hook                     |

Remaining delivery evidence: merge this feature PR, successful remote Actions
and Pages runs, verified public URL and deployed screenshot, real submission and
deadline dates, and the final unmerged PR submitted through RS App. Browser and
local command checks do not substitute for these remote steps.
