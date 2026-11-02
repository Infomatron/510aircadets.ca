# Content organization and navigation refinement — handoff

## Result and scope

Implemented locally on `feat/content-organization-navigation`, based on latest verified main `cd688a4ff6a3391ff5db5463aa8a0aba7a0bb05e` (merged Calendar & Announcements feature). No push, PR creation, merge, deployment, Pages configuration change or branch-protection change performed. Existing production `docs/`, routes, content schema fields, dependencies, lockfile and GitHub Actions workflows are unchanged.

The latest main contains no event or announcement JSON records, only the root placeholder files. Therefore no live records needed migration and no content meaning or identifiers changed. Fictional populated review data was generated in an isolated temporary site, never in this branch's production content folders.

## Updated content organization

| Content | Required source path inside `510AirCadets/` | Date determining the folder |
| --- | --- | --- |
| Event | `content/events/YYYY/MM/filename.json` | `date` |
| Announcement | `content/announcements/YYYY/MM/filename.json` | `publicationDate` |

Use numeric zero-padded months `01`–`12` and four-digit years `2000`–`2099`, matching the existing date range. Example fictional files: `content/events/2027/01/2027-01-19-example.json` and `content/announcements/2027/01/2027-01-12-example.json`.

The loader discovers files recursively and validates the exact two-level year/month structure, including invalid empty directories. Wrong months/years, named months, flat JSON files, extra directory nesting and unsupported files fail with file/path-specific corrections. Directory/date mismatch messages identify the correct destination. Symbolic links and special filesystem entries are not followed. Existing hidden placeholders remain ignored.

Identifiers remain unique across the full discovered collection, including different years/months. **Ids no longer have to equal filenames.** This is necessary to combine stable references with date-prefixed filenames that may change during rescheduling. Id format/length rules and all event/announcement field validation remain in place. Recommended filenames are date-prefixed, lowercase and hyphen-separated; valid legacy lowercase hyphen-separated filenames are accepted after moving into the correct folder. Filename length is capped at 140 characters. The filename's date prefix is a browsing convention, not an additional source of truth; the JSON date and matching folder are authoritative.

For a reschedule, move the existing file into the new event-date folder, change its date/status/update date, and KEEP its id. Optionally update the filename's date prefix. Do not leave a duplicate in the old folder. Announcement references continue working because they use ids. An announcement correction retains its original publication folder unless the publication date itself is corrected; expiry and update dates do not determine its directory.

No empty example date folders are committed to production. GitHub creates the actual year/month folders when contributors add their first approved record. Template originals remain outside production content directories.

## Navigation

Uses Docusaurus's built-in navbar dropdown, with no custom navigation component:

1. Existing squadron logo/title links to `/`.
2. **Explore** dropdown: About (`/about`), Join (`/join`), Activities (`/activities`), in that order.
3. Calendar & Announcements (`/calendar`).
4. Parents & Cadets (`/parents-cadets`).
5. Contact (`/contact`).

The standalone Home item is removed. The existing right-side Register Your Interest action is retained. All page routes and footer destinations remain unchanged. Removed the previous intermediate-width CSS rule that hid the navbar title; the named homepage link now remains visible at those widths as well.

Desktop keyboard expansion uses the framework's native Explore control and `aria-expanded`. Mobile uses its built-in collapsible subgroup and separate native caret button, which reports expanded/collapsed state. Visible focus treatment remains unchanged.

## Files changed

- `510AirCadets/plugins/squadron-content/load.mjs`: recursive deterministic discovery, directory validation and unsupported-entry errors.
- `510AirCadets/plugins/squadron-content/model.mjs`: validates year/month against the applicable content date; decouples ids from filenames while retaining global duplicate detection and filename rules.
- `510AirCadets/tests/content.test.mjs`: updated existing filesystem fixtures and added organization/rescheduling tests; 38 tests total.
- `510AirCadets/docusaurus.config.ts`: Home removed; built-in Explore dropdown replaces About/Join/Activities top-level entries.
- `510AirCadets/src/css/custom.css`: removes obsolete intermediate-width title-hiding/navbar-spacing override.
- `510AirCadets/CONTRIBUTING.md`: new paths, GitHub web placement/move guidance, stable ids, announcement corrections and four fictional placement examples.
- `510AirCadets/contributor-templates/README.md`: explains where each existing JSON template belongs and how to preserve ids on moves/corrections. JSON schema fields/templates themselves do not change.
- This review directory: handoff, browser verification record, invalid-directory build check and desktop/mobile screenshots.

Existing content-watching globs already cover nested directories. Existing Website validation invokes content checks/tests, TypeScript and a strict production build, so no workflow/ruleset change is needed to cover these new rules.

## Validation and test results

- Frozen dependency installation: passed with the existing lockfile; no dependency changes.
- Content validation: passed, zero production records.
- Built-in Node tests: **38 passed**, zero failures. Includes recursive discovery, year/month validation, flat/extra/named-month rejection, duplicate identifiers across folders, date-prefixed filenames independent of ids, cross-month rescheduling with stable references, announcement folder determined by publication rather than expiry, expiry/archive behavior, calendar selection/month/year/leap logic and all prior schema safeguards.
- TypeScript: passed.
- Production build: passed with strict broken-link and broken-anchor checks retained.
- Negative integration check: an isolated Docusaurus build rejected an event whose directory did not match its date and named the correct destination. See `invalid-directory-build-check.txt`.
- Browser QA: **72 route/viewport checks** (eight content routes at 1440, 1200, 1100, 1024, 997, 996, 768, 390 and 320 px). All pages responded successfully with no horizontal overflow or runtime errors.
- Desktop checks: named brand/home link, Home nav item absent, Explore order and destinations, Space/Enter expansion, visible keyboard focus, Tab into submenu and actual navigation to all three pages.
- Mobile/tablet checks: keyboard-opened menu, native caret expansion state, About/Join/Activities order, visibility of retained top-level links and actual submenu navigation. Includes both sides of the 996 px breakpoint.
- **15 distinct local URLs** returned successful responses.
- Isolated populated build: recursively loaded three events and three announcements from multiple months/years; rendered same-date records, active notice, future-notice exclusion, expired archive and a related-event link selecting a rescheduled event in another month. Browser checks at 1440, 390 and 320 px passed. Additional month/year controls checked at desktop/mobile, including February 2028's 29 dates.
- Source/build production folders remain free of fictional records. Populated screenshots use explicitly fictional records only in an isolated site.
- All six screenshots visually inspected. Browser tools/formatting tools and isolated preview dependencies were kept outside the repository; no project dependencies were introduced.
- `git diff --check`: passed. `docs/`, pnpm lockfile and workflow files: unchanged from main.

## Screenshots

| Surface | Desktop | Mobile |
| --- | --- | --- |
| Explore expanded with keyboard focus | [View](navigation-desktop-expanded.png) | [View](navigation-mobile-expanded.png) |
| Homepage with simplified navigation | [View](home-desktop.png) | [View](home-mobile.png) |
| Nested-content rendering, fictional | [View](nested-content-desktop-fictional.png) | [View](nested-content-mobile-fictional.png) |

## Migration notes and limits

- No real records were present on main, so migration is a no-op for this baseline. If another branch or uncommitted copy contains flat records, move them into the appropriate year/month folders before building. Preserve JSON values/ids, except deliberate reviewed corrections. No silent data conversion or record deletion is performed.
- Flat records intentionally fail validation; leaving one behind cannot produce a partially migrated release. Moving without deleting the original also fails due to duplicate id detection.
- Sources may be moved/renamed without changing public routes or related-event references. No redirects or deployment setting changes are needed for source folder organization.
- Current static-site clock/no-JavaScript limitations remain unchanged. Public history, fork-based contributions and mandatory authorized review remain documented.
- Browser verification used Chromium. Firefox/Safari, real-device and full screen-reader testing remain outstanding; no claim of a complete accessibility audit.
- Hosted Website validation must run after a subsequently authorized push/PR. Local tests are not represented as hosted results.

## Proposed PR and release steps

Review this handoff, screenshots and contribution guide. Once authorized, push `feat/content-organization-navigation` (or import the supplied Git bundle on an authenticated computer), open a PR against current main, and verify **Website validation** on the latest revision. Resolve conversations and obtain eligible approval. Merge only after subsequent release authorization; existing Actions then deploys automatically. After deployment, verify desktop/mobile Explore, the homepage brand link, Calendar & Announcements and a reviewed nested content contribution. Do not change Pages, DNS, branch protection or the retained production `docs/` tree for this change.
