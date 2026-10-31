# Events and Announcements — implementation handoff

Implemented locally on `feat/events-announcements`, based on verified remote main `da3c356d34a71921242a1521403cb817abdf48e9`. All three approved milestones are complete. No push, PR creation, merge, deployment, Pages setting change or branch-protection change was performed. Root production `docs/` is unchanged. No project dependencies or lockfile changes.

## Architecture

One JSON file per item under `510AirCadets/content/events/` and `510AirCadets/content/announcements/`. These production directories are intentionally empty except for `.gitkeep`; no real public event/announcement information was supplied. Templates are fictional and live outside production content directories.

`plugins/squadron-content/model.mjs` defines the shared content rules, Newfoundland local-time conversion, classification, ordering and preview limits. Its companion declaration exposes types to React. `load.mjs` reads records deterministically, reports errors by file/field, validates references, and normalizes event timestamps. The local Docusaurus plugin calls this loader on every build and watches content during development. Its global data includes all approved public records plus a build timestamp.

`src/components/Updates/index.tsx` provides reusable event/announcement lists and homepage previews. `/events`, `/announcements` and `/announcements/archive` retain existing layouts, metadata, palette and keyboard focus styles. Events/Announcements navigation and Parents & Cadets links added. Compact intermediate desktop navigation avoids overcrowding; mobile uses Docusaurus's existing menu. Past events remain in a closed disclosure and automatically open for a related-event anchor, so references remain useful after expiry. Archive entries are grouped by publication year. No calendar grid, CMS, database, authentication or comments.

### Date rules

- All dates/classification use America/St_Johns, not the machine/browser's selected timezone.
- Events expire at their end time, or after their local date when no end time exists. Cancelled events follow the same rule and retain explicit cancellation text until then.
- Inclusive expiry dates; future-dated notices excluded from normal lists. No expiry means active indefinitely. Archives preserve expired notices.
- Fixed-format dates, years 2000–2099, and HH:mm times. Reject nonexistent/repeated DST times instead of guessing. Current Newfoundland standard/daylight offsets are round-tripped through Intl during normalization.
- Static HTML uses the build time. Browser classification updates after hydration and on return to a visible tab. No recurring timers. A continuously visible tab can remain stale across a date/time boundary until reloaded/revisited; a wrong device clock can misclassify records. The no-JavaScript notice identifies the build date and directs visitors to explicit dates.
- Filtering is not access control. Future/expired content is public in GitHub and built data. No confidential/embargoed data should be committed.

## Contribution and safeguards

`510AirCadets/CONTRIBUTING.md` is a beginner guide to GitHub web editing: fork, sync, branch, copy template, edit/cancel/correct, commit, PR, inspect failure logs, respond to reviews and obtain approval. Describes JSON syntax, field limits, stable ids, time/expiry semantics and public Git history. Fork contributions require no upstream collaborator grant. New PR template includes public-release checks; authorized human review remains mandatory. No permission settings were changed.

## Files changed

### Framework and existing pages

- `.github/workflows/validate.yml`: content validation/tests before existing typecheck/build; nine-route assertion. Required job stays **Website validation**; read-only pull_request trigger retained.
- `.github/workflows/deploy.yml`: repeats content checks/tests and nine-route assertion; existing main-only Pages architecture, permissions, concurrency and environment retained.
- `.github/pull_request_template.md`: public-release review checklist.
- `510AirCadets/package.json`: `validate:content` and built-in Node `test` scripts. Dependencies unchanged.
- `510AirCadets/docusaurus.config.ts`: local plugin, two navbar entries, broken anchors now fail the build alongside broken links.
- `510AirCadets/src/pages/index.tsx`: homepage update previews, maximum three of each.
- `510AirCadets/src/pages/parents-cadets.tsx`: links to public updates; private-channel guidance retained.
- `510AirCadets/src/css/custom.css`: update cards, status borders/text, responsive columns and intermediate navbar spacing; existing design preserved.
- `README.md`, `510AirCadets/README.md`: contribution-guide links.

### New content foundation and pages

- `510AirCadets/content/events/.gitkeep`
- `510AirCadets/content/announcements/.gitkeep`
- `510AirCadets/contributor-templates/event.json`
- `510AirCadets/contributor-templates/announcement.json`
- `510AirCadets/CONTRIBUTING.md`
- `510AirCadets/plugins/squadron-content/index.cjs`
- `510AirCadets/plugins/squadron-content/load.mjs`
- `510AirCadets/plugins/squadron-content/model.mjs`
- `510AirCadets/plugins/squadron-content/model.d.mts`
- `510AirCadets/scripts/validate-content.mjs`
- `510AirCadets/tests/content.test.mjs`
- `510AirCadets/src/components/Updates/index.tsx`
- `510AirCadets/src/pages/events.tsx`
- `510AirCadets/src/pages/announcements/index.tsx`
- `510AirCadets/src/pages/announcements/archive.tsx`
- This review directory: handoff, verification records and desktop/mobile screenshots.

## Verification

- Node 24.22.1 / pnpm 11.25.0 frozen offline installation: passed. Lockfile unchanged.
- Content CLI: passed with zero production records.
- Built-in Node tests: **19 passed**, zero failures. Covers valid/invalid fields, lengths, dates/time formats, leap dates, unsupported fields, HTML, filenames/ids/duplicates, update requirements, related references, malformed JSON, unsupported file extensions, DST transitions, half-hour offsets, future publication, inclusive expiry at local midnight, event end boundaries across all statuses, ordering, three-item limits and empty lists. Filesystem fixtures isolated in temporary folders.
- TypeScript: passed.
- Production build: passed, with strict broken-link AND broken-anchor checks.
- Negative build check: actual Docusaurus build with a temporary invalid record failed as expected, naming file and affected fields. Temporary file removed; final empty-content build then passed. See `invalid-build-check.txt`.
- actionlint 1.7.12: both workflows passed. No project lint script exists; optional ShellCheck was unavailable.
- All nine public routes tested at **1440, 1100, 1024, 768, 390 and 320 px**. HTTP success, one main/h1, no horizontal/nav overflow, no runtime errors. Mobile menu includes Announcements. Skip navigation checked; keyboard progression moves into page links. **17 distinct local URLs** returned successful responses. See `browser-checks.json`.
- Populated fictional fixture build: strict links/anchors passed. At 1440, 390 and 320 px, tested preview limits, visible cancellation text, future notice exclusion, archive, past-event link disclosure opening, and expiry reclassification on visibility change at Newfoundland midnight. No runtime errors or overflow. See `populated-checks.json`.
- No-JavaScript static notice verified in browser; useful lists/empty states appear in generated HTML.
- All desktop/mobile populated screenshots visually inspected. Fictional fixtures were removed before the final build and are not in production content or committed content records.
- Temporary browser/formatting/lint tools were installed outside the repository solely for verification. No project runtime/dev dependencies added.

## Screenshots

Populated screenshots use clearly labelled fictional examples and a fixed review clock (2027-01-19). They show layout and state handling, not actual squadron activities. Empty-state screenshots show the delivered production-content state.

| Page | Desktop examples | Mobile examples |
| --- | --- | --- |
| Home | [Desktop](home-desktop-fictional.png) | [Mobile](home-mobile-fictional.png) |
| Events | [Desktop](events-desktop-fictional.png) | [Mobile](events-mobile-fictional.png) |
| Announcements | [Desktop](announcements-desktop-fictional.png) | [Mobile](announcements-mobile-fictional.png) |
| Archive | [Desktop](announcements-archive-desktop-fictional.png) | [Mobile](announcements-archive-mobile-fictional.png) |

Empty states: `home-{desktop,mobile}-empty.png`, `events-{desktop,mobile}-empty.png`, `announcements-{desktop,mobile}-empty.png`, `announcements-archive-{desktop,mobile}-empty.png`.

## Limits and remaining decisions

- No approved real records supplied: the released pages will initially show empty states unless reviewed content is added through PRs.
- Single-day events, plain text, no arbitrary content links/photos. Event-related links are generated from ids. No pagination initially; suitable for anticipated low content volume. Revisit list/archive scale if usage grows.
- Browser checks used Chromium only. Full screen-reader audit, real-device and Firefox/Safari testing remain unperformed. No claim of complete WCAG conformance.
- Clock/no-JavaScript limitations above are intentional approved behaviour. Future notices are not private, and cancellation notices do not replace official direct communications.
- Automated validation cannot determine public-release authority; reviewers must check content suitability, not just green checks.
- Hosted Actions must run after a subsequently authorized push/PR. Local success does not prove hosted results. Existing upstream plugin write limitations previously required the operator to push a Git bundle; use an authenticated local push if that remains necessary.

## Proposed review, PR and release steps

1. Review this handoff, screenshots and contribution guide. No deployment approval is requested or inferred here.
2. Once authorized, push `feat/events-announcements` and open a PR against current main; verify the required **Website validation** job passes on its latest revision.
3. Have an authorized reviewer check the feature, docs and any initial real public content; resolve conversations and obtain approval. New commits must pass checks and refresh approvals as required.
4. Only after explicit subsequent release authorization, merge the approved PR. The existing Actions workflow then deploys automatically; no Pages/DNS/environment/ruleset changes are needed.
5. Verify all nine routes, empty/populated states, homepage previews, Newfoundland date handling, cancellation labels, archive and related-event links in production.
6. Roll back a regression through a separate reviewed revert PR; do not force-push main or modify the retained production docs tree.
