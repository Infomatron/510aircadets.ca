# 510 St. John's Lions Air Cadets website

Independent public information website maintained by a parent volunteer. Built with Docusaurus Classic, React and TypeScript.

## Local development

Use Node.js 20 or later and pnpm. Run commands from `510AirCadets/`:

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

Use official external services for registration. Do not add forms collecting minors' information. Use only permission-cleared imagery. Refer to `../review/implementation-notes.md` for provisional content and review gaps.

## Deployment boundary

Root-level `../docs/` contains the currently committed production output and `CNAME`. It has intentionally not been regenerated during this milestone. No deployment workflow was added.

The actual GitHub Pages source setting could not be verified through the unauthenticated API. Confirm the publishing branch and directory in GitHub Settings → Pages before altering deployment files. Keep the existing `docs/CNAME` (`510aircadets.ca`) intact. Once the source is confirmed, add `CNAME` to `static/` so builds copy it automatically before establishing a release procedure. Do not use the Docusaurus `deploy` command: its default branch-based publishing behaviour has not been configured for this repository.

Do not merge or deploy without the operator's explicit approval.
