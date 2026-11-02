# Calendar & Announcements — revision handoff

## Result

Implemented on the existing `feat/events-announcements` branch, extending `1c4464d`. Read-only GitHub inspection and fetch confirmed latest main remains `da3c356d34a71921242a1521403cb817abdf48e9`; reconciling main reported already up to date. The remote feature branch still contains the prior implementation. This revision is local only: no push, PR mutation, merge to main, deployment, Pages setting change or branch-protection change performed. Root production `docs/`, project dependencies and pnpm lockfile are unchanged.

This report supersedes the earlier `review/events-announcements/handoff.md` for schema, interface, route and contribution guidance. Earlier screenshots are historical, not the current design.

## Interface and architecture

- `/calendar`: **Calendar & Announcements**. Introductory text, seven-column monthly calendar, selected-date event list, then active announcements separated by a yellow rule and heading.
- Previous/next month, direct month/year selectors, Today control. Supported years 2000–2099. Today derives from America/St_Johns.
- Date buttons show day number and an event-count badge. Mobile badges use counts, with explanatory text and full accessible date/count/status labels. Multiple entries on one date render together below the grid. Selected date and today have distinct visual indicators; event statuses include visible Scheduled/Updated/Cancelled text and explicit cancellation wording.
- Native semantic table and buttons; one calendar date in the Tab order. Arrow keys move focus by day/week, Home/End within the week, Page Up/Down by month, Shift+Page Up/Down by year, Enter/Space selects. Controls retain visible focus styles; selection changes have a concise status announcement. Direct related-event links select the corresponding date/month/year.
- `/calendar/archive`: expired announcements by publication year. Active notices appear only beneath the main calendar. Related links return to `/calendar?date=YYYY-MM-DD#selected-events`.
- Navbar has one Calendar & Announcements entry. Homepage retains three upcoming event previews and three newest active notices, all pointing to consolidated routes. Parents & Cadets updated.
- One JSON file per record; existing local plugin and shared validator retained. No calendar library, backend, scheduled deployment or new dependency.

## Revised schemas

### Events

Required: `id`, `title`, `date`, `status`.
Optional: `description`, `updatedDate`.
Statuses: `scheduled`, `updated`, `cancelled`. Updated/cancelled records require `updatedDate`. Identifiers remain stable and match filenames. Single-day date-only records remain supported for years 2000–2099. Same-date entries are ordered deterministically by identifier.

`startTime`, `endTime`, `location` and any unsupported field (including `duration`) fail validation. The event TypeScript interface, loader output, event cards, calendar, homepage event previews and current event template contain no scheduling-clock, location or duration fields. Current contribution documentation and fictional calendar examples contain no such information. Descriptions remain free text, so authorized reviewers must still ensure public suitability; schema validation cannot identify all sensitive prose.

All statuses remain upcoming on the homepage through their local date and leave it after local midnight. The month calendar can show any supported past/future date; records are retained rather than deleted. Removing event clocks also removes the former DST conversion/ambiguous-time logic. Only local date calculation needs America/St_Johns; month/leap arithmetic uses UTC as a date container.

### Announcements (unchanged)

Required: `id`, `title`, `publicationDate`, `message`.
Optional: `expiryDate`, `relatedEvent`, `category`, `updatedDate`.
Categories: general, reminder, schedule-change, cancellation. Newest first; future publication hidden; inclusive Newfoundland expiry dates; expired records preserved in public archive. Related-event references must resolve.

## Migration and compatibility

- `/events` and `/announcements` are compatibility pages leading to `/calendar`.
- `/announcements/archive` leads to `/calendar/archive`.
- These are static-site compatibility redirects (meta refresh plus browser replacement and a fallback link), not HTTP server 301 rules. Query strings/fragments are preserved by the browser replacement. Legacy `/events#event-id` links are handled by the calendar and select the referenced record's date. Tested across all six viewport sizes.
- No real content records currently exist in the production content folders. Templates and temporary review fixtures are not production records.
- Any external/unmerged event JSON using removed fields must be reviewed and edited before building. Validation intentionally fails instead of silently discarding those values. Keep each id/filename stable. Do not paste restricted details into a public migration PR.
- Removed fields remain visible in prior Git history and historical review material. This is a schema/interface revision, not history rewriting or a claim of removing previously published data.

## Files changed relative to the previous feature commit

- `510AirCadets/plugins/squadron-content/model.mjs`: simplified event schema/date-only filtering, month/year/date arithmetic and date selection helpers.
- `510AirCadets/plugins/squadron-content/model.d.mts`: revised event interface and calendar helper types.
- `510AirCadets/plugins/squadron-content/load.mjs`: returns validated date-only records without derived timestamps.
- `510AirCadets/src/components/Updates/index.tsx`: calendar UI, date-only cards, consolidated announcements, related-event selection, homepage links and compatibility component.
- `510AirCadets/src/pages/calendar.tsx`: new consolidated route.
- `510AirCadets/src/pages/calendar/archive.tsx`: new archive route.
- `510AirCadets/src/pages/events.tsx`, `src/pages/announcements/index.tsx`, `src/pages/announcements/archive.tsx`: compatibility pages.
- `510AirCadets/docusaurus.config.ts`: one consolidated navbar entry.
- `510AirCadets/src/pages/parents-cadets.tsx`: consolidated public-update link.
- `510AirCadets/src/css/custom.css`: responsive seven-column calendar, controls, selection, event counts, announcement separation and focus treatment.
- `510AirCadets/contributor-templates/event.json`: four-field basic date-only template.
- `510AirCadets/CONTRIBUTING.md`: revised schema, calendar use, GitHub web/fork/PR instructions and public-release safeguards.
- `README.md`, `510AirCadets/README.md`: consolidated feature label.
- `510AirCadets/tests/content.test.mjs`: 26 validation/date/calendar/announcement tests.
- `.github/workflows/validate.yml`, `.github/workflows/deploy.yml`: include consolidated and compatibility route assertions. Existing required check, triggers, permissions and deployment architecture unchanged.
- `review/events-announcements/handoff.md`: marked as historical/superseded.
- This review directory: handoff, screenshots and verification evidence.

## Verification

- Frozen pnpm installation: passed; no lockfile/dependency changes.
- Content validator: passed with **zero production events and announcements** after review fixtures were removed.
- Node built-in test runner: **26 passed**, zero failures. Covers required fields/types/limits, forbidden HTML/unsupported fields, removed-field rejection, stable filenames and duplicate ids, statuses/update dates, references, real dates, leap years, month grids, year rollover/bounds, keyboard-date arithmetic, multi-event selection, empty dates, announcement ordering/future publication/inclusive expiry, Newfoundland winter/summer date boundaries, upcoming previews and filesystem loading.
- Negative Docusaurus build: rejects all removed fields with file/field-specific messages. See `legacy-field-rejection.txt`. Temporary invalid record removed before final production build.
- TypeScript: passed.
- Final production build: passed with strict broken-link and broken-anchor failures enabled. No fixture content remains in final `/calendar` HTML or production content folders.
- actionlint: both workflow files passed. Existing check stays **Website validation**. No project lint script; optional ShellCheck unavailable.
- Chromium populated checks at **1440, 1100, 1024, 768, 390 and 320 px** passed. Calendar grid, Feb 2028/2032 leap days, prior/next month, direct year changes, year rollover, empty-date selection, three entries on one date, Cancelled/Updated text, announcement ordering/future exclusion, archive links, selected related-event dates and compatibility routes verified.
- Keyboard browser checks passed: arrows across month boundaries, Home/End, Page Up, Enter selection, visible outline and keyboard-opened mobile menu. Native selector labels identify Month and Year. No runtime errors or horizontal overflow.
- No-JavaScript static build fallback verified: build-date notice and complete date-only public event list remain readable.
- Final empty-state checks: eight content routes across six viewport sizes (**48 route/viewport checks**), plus internal-link responses and keyboard skip-navigation/focus checks. Compatibility redirects tested separately above. See `empty-browser-checks.json` for exact counts.
- All desktop/mobile populated screenshots and no-JavaScript screenshot visually inspected. They use clearly fictional dates/records and a fixed browser review clock (2028-02-15). Empty screenshots reflect the delivered content state. Tools used only for local QA were installed outside the repository; no project dependencies added.

## Screenshots

| Surface | Desktop | Mobile |
| --- | --- | --- |
| Consolidated calendar + notices (fictional) | [View](calendar-desktop-fictional.png) | [View](calendar-mobile-fictional.png) |
| Archive (fictional) | [View](archive-desktop-fictional.png) | [View](archive-mobile-fictional.png) |
| Homepage previews (fictional) | [View](home-desktop-fictional.png) | [View](home-mobile-fictional.png) |
| Calendar empty state | [View](calendar-desktop-empty.png) | [View](calendar-mobile-empty.png) |

[No-JavaScript fallback](calendar-no-javascript.png) shows fictional fixtures in the static full event list and the build-month calendar. It does not depict real squadron information.

## Limits and outstanding decisions

- No unapproved real content added. Initial release remains empty until authorized records are contributed.
- Browser tests use Chromium; Firefox/Safari, real devices and a full screen-reader/WCAG audit remain outstanding.
- Supported calendar years are 2000–2099, Sunday-first weeks. No recurring or multi-day records, drag/drop editing or month URL persistence beyond selected-date links.
- JavaScript is required for interactive month/date controls. Static HTML and a full public event list provide a fallback. Active/expired classifications refresh on load and tab visibility, not on a recurring timer. A continuously visible page or incorrect device clock can be stale.
- Filtering is presentation, not access control: future/expired records and Git history remain public. Human review is mandatory. The contributor guide retains fork-based contributions without upstream write permission.
- Hosted checks have not run for this local revision. No production/settings changes are required for the new routes beyond the normal approved PR deployment.

## Proposed next steps

Review this handoff, screenshots, simplified schemas and guide. After authorization, push the revision to the existing feature branch (or import the supplied updated bundle on an authenticated computer), update/open its PR against main, and wait for **Website validation**. Resolve review conversations and obtain eligible approval covering the latest revision. Merge only after subsequent explicit release approval; the existing Actions workflow then publishes automatically. Verify `/calendar`, date selection/navigation, active/archive notices and all compatibility routes after deployment. Do not remove production docs or change Pages/branch settings for this revision.
