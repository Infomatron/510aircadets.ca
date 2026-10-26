# 510 Air Cadets website

Independent parent-volunteer website for 510 St. John's Lions Royal Canadian Air Cadet Squadron. Docusaurus source is in `510AirCadets/`.

## Development

Use Node **24.22.1** (`510AirCadets/.node-version`) and pnpm **11.25.0** (`packageManager` in `510AirCadets/package.json`). Install pnpm with `npm install --global pnpm@11.25.0`.

```sh
cd 510AirCadets
pnpm install --frozen-lockfile
pnpm start
```

Before submitting a PR:

```sh
pnpm run typecheck
pnpm run build
```

Build output goes to `510AirCadets/build/`. Do not commit build output or run `pnpm deploy`; that legacy Docusaurus command is not the selected release process.

## Review and publishing

Every change belongs on a separate branch and PR targeting `main`. The prepared PR workflow checks types and builds the site. The owner must activate branch protection requiring **Website validation**, one eligible independent approval, fresh approvals after changes and resolved conversations. Workflows alone do not enforce reviews.

After the approved migration, merging an approved PR automatically builds and deploys the source using GitHub Pages Actions. No separate deployment approval is required. The current live site still publishes committed root `docs/` until the owner changes Pages settings; retain that directory until the replacement is verified.

See [milestone 3 handoff](review/milestone-3/handoff.md) for exact protection, migration, custom-domain preservation, validation limits and rollback instructions. Nothing in that document authorizes pushing, merging or changing hosting settings.
