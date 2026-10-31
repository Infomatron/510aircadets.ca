# 510 St. John's Lions Air Cadets website

Independent public information website maintained by a parent volunteer. Built with Docusaurus Classic, React and TypeScript.

## Local development

Use Node.js 24.22.1 (`.node-version`) and pnpm 11.25.0 (`package.json` packageManager). Run commands from `510AirCadets/`:

```sh
pnpm install --frozen-lockfile
pnpm start
```

## Verification and local preview

```sh
pnpm run typecheck
pnpm run build
pnpm run serve
```

Build output goes to `510AirCadets/build/`. There are currently no lint or test scripts. Review all six routes, mobile navigation, keyboard focus, skip navigation, zoom/reflow and contrast before release.

## Content and design

- Pages: `src/pages/`.
- Shared content layout, actions and activity cards: `src/components/Squadron/index.tsx`.
- Navigation, footer and metadata: `docusaurus.config.ts`.
- Design tokens and responsive styling: `src/css/custom.css`.
- Temporary authorized crest: `static/img/squadron-crest.png`. Replace this file with higher-resolution approved artwork, preserving the original proportions and design.
- The favicon is a text-based `510` identifier; the crest has too much detail for a small icon.

Use official external services for registration. Do not add forms collecting minors' information. Use only permission-cleared imagery. Refer to `../review/milestone-2/handoff.md` for confirmed content and remaining review gaps.

## Publishing preparation

The operator confirmed current Pages publishing from `main` / root `docs/`. That production output is retained until the first approved Actions deployment is verified. Source `static/CNAME` now preserves the domain in build output; the Pages custom-domain setting remains authoritative for Actions.

The prepared workflows validate PRs and automatically deploy main after merge. The owner must first activate branch protection and configure Pages and the environment. See [milestone 3 handoff](../review/milestone-3/handoff.md) for the exact sequence, required status check, domain/HTTPS preservation and rollback. Do not use the Docusaurus `deploy` command or manually copy builds into `docs/` for the selected Actions process.

No push, merge, Pages setting change or deployment is authorized during preparation.

## Public events and announcements

See [CONTRIBUTING.md](CONTRIBUTING.md) for content file locations, schemas, templates, date rules and the GitHub editing workflow.
