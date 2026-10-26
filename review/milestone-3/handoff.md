# Milestone 3 — Actions and protected main preparation

## Result and boundaries

Prepared locally on `feat/squadron-site-design`. No push, PR creation, merge, remote settings change or deployment performed. Existing tracked `docs/` is untouched. This handoff supersedes the manual-release recommendation in milestone 2: the operator has selected Actions publishing.

## Files

- `.github/workflows/validate.yml`: PRs targeting main; stable required check **Website validation**; frozen installation, TypeScript, production build and six-route/domain artifact assertions. No path filters, deployment, secrets or write token. New PR commits cancel obsolete validation runs.
- `.github/workflows/deploy.yml`: pushes to main only; repeats validation, uploads `510AirCadets/build/`, then deploys using official Pages actions. Shared deployment concurrency does not interrupt an active deployment. Build has read-only repository access; only deploy receives `pages: write` and `id-token: write`. Uses `github-pages` environment. No manual dispatch or approval step.
- `510AirCadets/.node-version`: Node 24.22.1, matching local verification.
- `510AirCadets/package.json`: pnpm 11.25.0 packageManager pin, matching local verification. Workflows install the same exact version with npm; no third-party pnpm setup action. Lockfile unchanged.
- `510AirCadets/static/CNAME`: `510aircadets.ca`, copied into builds for portability and branch-publishing rollback. Actions domain configuration remains in Pages settings; artifact CNAME does not configure it.
- `README.md` and `510AirCadets/README.md`: development and review/release instructions; replaced superseded publishing guidance.
- This handoff.

Official action references are pinned to full commit SHAs resolved from upstream major tags during preparation. Review version/SHA updates through PRs. Node and pnpm pins should be updated together with local and hosted checks. No new project dependencies. No cache initially: reduces setup complexity and cache permissions; installs remain frozen.

## Repository and enforcement findings

Read-only public API inspection on 2026-10-26 reports `visibility: public`, owner `Infomatron` of type `User`; `/repos/Infomatron/510aircadets.ca/rulesets` returns `[]`. This does not prove absence of classic branch protection. No authenticated administration connection is available in this session; private plan, collaborator list, Actions policy, environment and classic protection settings were not inspected.

GitHub documents branch rulesets and protected branches as available on public repositories even on GitHub Free. Therefore the requested controls are supported for this repository's current public/personal ownership regardless of the unseen paid plan. Owner/admin access is required to configure them. A collaborator with write access can provide an eligible review; the PR author cannot approve their own PR. Ensure at least one other eligible person is available. If visibility changes to private, a personal owner needs an appropriate paid plan (GitHub Pro) for these protections and Pages.

Workflows do not enforce PR approval or block direct pushes. The owner must activate protection. Administrators can subsequently edit/disable repository rules; an empty bypass list prevents ordinary bypass, not an owner changing governance. A workflow change itself needs human review because repository writers can propose altering checks.

## Exact main ruleset setup — owner action after authorization

1. Open repository **Settings → Rules → Rulesets → New ruleset → New branch ruleset**.
2. Name: `Protect main`. Enforcement: **Active**. Leave **Bypass list empty**, including administrators and Apps.
3. Target branches → Add target → Include by pattern → `main` (exact name).
4. Enable **Restrict deletions** and **Block force pushes**.
5. Enable **Require a pull request before merging**. Set required approvals to **1**. Enable **Dismiss stale pull request approvals when new commits are pushed**, **Require approval of the most recent reviewable push**, and **Require conversation resolution before merging**.
6. Enable **Require status checks to pass**. Add **Website validation**, produced by `validate.yml`, and select **GitHub Actions** as the expected source where offered. Enable **Require branches to be up to date before merging**.
7. Save/Create. Confirm the ruleset shows Active and applies to main. Do not enable Restrict updates (would prevent ordinary PR merges), merge queue or required deployment-before-merge. This workflow has no merge_group trigger; a merge queue would need a separate change.
8. Ensure an independent eligible collaborator has accepted their invitation (Settings → Collaborators). Do not add bypass to solve reviewer availability.

Bootstrap: the check may appear in the selector only after its first PR run. After authorized feature-branch push and PR creation, let **Website validation** run, then configure/confirm the full active ruleset BEFORE merging that PR. Do not merge with only the workflow present. GitHub's required status checks UI may show a workflow prefix; select the actual job named Website validation from this run, not Build Pages artifact or the deploy job. Test enforcement with an ordinary unapproved draft/test PR and inspection of its merge requirements; do not probe with a production push. After another commit, confirm approval is dismissed and validation reruns. A deliberately failing check can be exercised in a disposable draft PR before release.

If using classic protection instead: Settings → Branches → Add branch protection rule → pattern `main`; require PR/1 review, stale dismissal, latest-push approval, conversations resolved, Website validation/up-to-date checks; enable **Do not allow bypassing the above settings**; leave force pushes and deletions disallowed. Prefer one clear ruleset over overlapping controls. Check existing classic rules because rules may combine.

## Exact migration sequence — requires later authorization

1. Record the current Pages settings: Deploy from a branch / main / docs; custom domain `510aircadets.ca`; Enforce HTTPS checked. Record current successful Pages deployment and main SHA. Keep `docs/` and `docs/CNAME` intact. The operator confirmed these publishing settings; no settings were changed or independently authenticated here.
2. Authorize pushing this feature branch and opening a PR. It includes the prior design/content milestones. Inspect all source and workflow changes, run hosted Website validation, configure the full main ruleset above, and obtain eligible approval on the latest revision. Do not merge yet.
3. Owner: Settings → Actions → General: permit the pinned official `actions/*` actions and their dependencies. Default workflow token can remain read-only; deploy declares only the additional permissions it needs. No PAT or repository secret is required. Confirm Actions is enabled.
4. Owner: Settings → Environments → github-pages (create or edit). Deployment branches and tags: **Selected branches and tags**, add **Branch: main** only; no tag rule. Remove required reviewers, wait timers and custom approval gates for this environment: PR approval is the release gate, and deployment needs no second manual approval. Review any pre-existing restrictions explicitly.
5. During the approved migration window, owner: Settings → Pages → Build and deployment → Source → **GitHub Actions**. Do not choose/configure a suggested starter workflow, unpublish the site, remove/re-add its domain or edit DNS. Confirm custom domain and HTTPS remain set. This changes the publishing mechanism; existing published content is expected to remain served pending replacement. Verify the live site immediately; do not promise zero interruption.
6. Only after source/environment/protection are ready, merge the approved PR through GitHub. Its push-to-main event automatically validates, builds and deploys. No manual deployment approval is configured. `configure-pages` has enablement false: the workflow does not switch publishing sources itself.
7. Watch **Deploy website** → Build Pages artifact → Deploy to GitHub Pages; confirm the deployment SHA is the approved main merge. Check https://510aircadets.ca/ plus /about, /join, /activities, /parents-cadets, /contact, HTTPS certificate, canonical URLs, crest/assets, mobile navigation, recruitment/Maps links, and a missing-page response. Check both slash/non-slash existing page URLs as applicable. Do not change baseUrl `/` or production URL. Check the official registration form manually (previous environment check returned 503). No route restructuring is included; obsolete starter doc/blog URLs were intentionally removed in milestone 1, so any known inbound legacy links need explicit redirect decisions before release.
8. Only after successful replacement verification, make a NEW cleanup branch/PR deleting tracked root `docs/` and adding `/docs/` to root .gitignore. Get approval and passing checks, then merge. This ends committed build output; keep local build ignored. Do not delete docs in this migration PR. Update rollback reference and this document after actual rollout.

First-run GitHub checks cannot be verified locally: official action execution on hosted Ubuntu, clean online package installation, PR status source/context, protection behavior, Pages artifact upload/OIDC, environment restriction and actual custom-domain deployment. First-time external PR contributors may need owner approval to run Actions; that is distinct from a production deployment approval.

## Domain and HTTPS preservation

Keep existing Porkbun DNS records. Source URL remains `https://510aircadets.ca`, baseUrl remains `/`. Do not move to a repository subpath. Keep the Pages custom domain and Enforce HTTPS selected in Settings; CNAME in an Actions artifact is ignored for domain configuration. Source CNAME helps verify intent and supports fallback, but cannot replace settings. If HTTPS becomes unavailable, inspect Pages certificate/domain status before proceeding; do not disable HTTPS or remove domain to force a deployment.

## Rollback

- Before cleanup: if first Actions deployment fails, existing site should remain served; inspect the failed job first. For approved rollback, owner changes Pages source back to **Deploy from a branch → main → /docs → Save**, preserving domain and HTTPS. This republishes retained original output, not the new design. Verify the Pages-managed deployment and live site. No DNS change. Avoid further main merges while diagnosing; the Actions deployment workflow should be paused in the Actions UI if reverting to branch publishing, then re-enabled during a later approved retry.
- After docs cleanup: restore the retained production `docs/` tree from the recorded pre-cleanup commit on a NEW rollback branch, remove `/docs/` ignore if needed, and submit a reviewed PR with checks. After its merge, switch source back to main/docs. Never reset/force-push protected main. Restore CNAME with the tree. This fallback intentionally restores the archived older website.
- For a normal content regression with Actions working: revert the offending change in a NEW branch/approved PR. Merge automatically deploys the corrected build. Do not rerun an old successful deployment as a routine rollback because it may publish a commit inconsistent with current main.

## Remaining risks and owner actions

All remote writes are pending authorization. Owner must activate protection, provide an eligible reviewer, confirm Actions policy and environment configuration, switch Pages source and monitor first deployment. No environment can enforce the PR requirement by itself. Deployment serializes runs; an in-progress deployment may finish before a newer queued one. Hosted checks are still required. Full accessibility/cross-browser review and the registration-service browser check remain from milestone 2; this milestone changes no visible UI. Retained docs deliberately represents the old production site until cleanup. No screenshots are required for this infrastructure-only change.

## Sources checked

- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets
- https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments
- https://github.com/actions/checkout
- https://github.com/actions/setup-node
- https://github.com/actions/configure-pages
- https://github.com/actions/upload-pages-artifact
- https://github.com/actions/deploy-pages

## Local validation results

- Frozen dependency installation: passed with pnpm 11.25.0, using the existing offline store. A fresh online hosted install remains to be verified; the lockfile is unchanged.
- `pnpm run typecheck`: passed on Node 24.22.1.
- `pnpm run build`: passed; Docusaurus strict broken-link checking remains enabled.
- Exact workflow shell assertions for six generated route entry files and CNAME: passed.
- `actionlint` 1.7.12: passed for both workflows (syntax, expressions and action inputs). ShellCheck is not installed, so optional ShellCheck integration was unavailable.
- `git diff --check`: passed. Tracked production docs and pnpm lockfile: unchanged.
- No project lint/test scripts exist. No UI source or styles changed; browser screenshots were not repeated. Hosted execution and remote protection checks remain pending as described above.
