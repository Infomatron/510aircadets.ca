# Calendar categories and announcement priority — review handoff

Implementation branch: `feat/calendar-categories-announcement-priority`.
Base: `origin/main`, `9dcf70023e6a5d2302604c02acafc9f4add8aa2b` (PR #4 merged).
No push, merge, deployment, Pages settings or branch-rule changes were performed. Production `docs/` is untouched.

## Result and files changed

`/calendar` retains its route and design. The order is heading/intro, announcements, calendar, selected-day details. Announcement ordering, publication, inclusive expiry and archive behaviour are unchanged. No unrelated pages were redesigned.

- `510AirCadets/plugins/squadron-content/categories.mjs` and `.d.mts`: central category vocabulary, palette, native SVG paths, abbreviations and stable ordering helper.
- `plugins/squadron-content/model.mjs` and `.d.mts`: required single category validation, event type and selected-day ordering.
- `src/components/Updates/EventCategories.tsx`: category badges, legend and responsive per-event labels.
- `src/components/Updates/index.tsx`: announcements-first layout, full accessible date names and categories in event details/homepage previews.
- `src/pages/calendar.tsx`: revised introduction.
- `src/css/custom.css`: palette badges, growing date cells, legend and responsive presentations.
- Five existing `content/events/2026/11/*.json` records: category additions only.
- `contributor-templates/event.json`, its README and `CONTRIBUTING.md`: schema, vocabulary, example and public-release guidance.
- `tests/content.test.mjs`: category, ordering, duplicate-category counts and contrast tests, retaining existing date/schema/expiry tests.
- This review directory: screenshots, migration/contrast/browser results and optional reproducible browser checks.

No package dependencies, lockfile or deployment workflows changed. The existing **Website validation** job already runs content validation, all Node tests, TypeScript, production build and public-route/domain checks. Hosted execution remains pending the owner's manual push and PR.

## Revised schema and behaviour

Events remain one JSON file per item under `content/events/YYYY/MM/`, with the directory matching the event date. Required: `id`, `title`, `date`, `category`, `status`. Optional: `description`, `updatedDate`. Statuses: `scheduled`, `updated`, `cancelled`; the latter two require `updatedDate`. Category must be exactly one vocabulary string: missing values, arrays and unknown values fail validation. Unsupported event fields including location, start/end time and duration remain rejected. The interface and template contain none of those fields. Free-text descriptions still require human review to prevent restricted information.

Announcement fields and directories are unchanged: required `id`, `title`, `publicationDate`, `message`; optional `expiryDate`, `relatedEvent`, `category`, `updatedDate`. Announcement categories retain their separate existing vocabulary.

Calendar cell and selected-day ordering follows the category table below, then stable event identifier. Entries are never collapsed into unique categories. Desktop (>996px) shows all event labels, with rows growing as needed. Tablet/mobile (≤996px) shows two entries plus a count of additional **events**. Narrow screens (≤480px) show text abbreviations and `+N`; the expandable category key explains them. Full categories, titles, statuses and descriptions remain in selected-day details. Cancelled/updated labels remain textual; narrow cells use Cxl/Upd. Date buttons expose full event titles/categories/statuses to assistive technology.

## Central category mapping

Colours are foreground/border and pale badge background. Symbols are application-owned outline SVGs, decorative to assistive technology; labels communicate meaning.

| Identifier | Label | Symbol | Narrow label | Foreground / background | Text contrast |
| --- | --- | --- | --- | --- | --- |
| `training` | Training | Book | Trn | `#214867` / `#EAF1F7` | 8.42:1 |
| `marksmanship` | Marksmanship | Target | Tgt | `#A12232` / `#FCEEF0` | 6.68:1 |
| `band` | Band | Music | Bnd | `#6B3994` / `#F3EDF9` | 6.93:1 |
| `choir` | Choir | Microphone | Chr | `#9E2265` / `#FBEAF3` | 6.33:1 |
| `ground-school` | Ground School | Aircraft | Gnd | `#005F91` / `#E7F4FA` | 6.15:1 |
| `ceremony` | Ceremony | Award | Cer | `#795300` / `#FFF5D9` | 6.33:1 |
| `parade` | Parade | Flag | Par | `#515A19` / `#F2F4DE` | 6.64:1 |
| `field-training-exercise` | Field Training Exercise | Trees | FTX | `#236131` / `#EAF5E8` | 6.63:1 |
| `special-event` | Special Event | Star | Evt | `#9A420D` / `#FFF0E3` | 5.96:1 |
| `biathlon` | Biathlon | Medal | Bia | `#00695E` / `#E4F5F0` | 5.85:1 |

Every badge pair exceeds 4.5:1 (minimum 5.85:1); borders exceed 3:1 on white. All ten colours are distinct, but are not claimed to be distinguishable by every user: text, symbols and the legend provide redundant cues. Colours are never the sole category or status signal. Computed ratios are recorded in `contrast.json`.

## Existing-event migration

| Existing title | Added category |
| --- | --- |
| Marksmanship - Level 1 Only | `marksmanship` |
| Regular Training - FTUs | `training` |
| Remembrance Day Ceremony - Specific Teams | `ceremony` |
| Remembrance Day Ceremony - All | `ceremony` |
| FTX | `field-training-exercise` |

FTX was interpreted as Field Training Exercise; the two Remembrance entries explicitly identify ceremonies. No blanket default was applied. `migration.json` records each file and ID. A parsed comparison against the base commit verified every original field is unchanged. No dates, IDs, statuses, descriptions, paths or references were altered. There are five real event records and no production announcements. No event needs unresolved classification; the operator should still review the five choices.

## Verification results

- `pnpm validate:content`: PASS — five events, zero announcements.
- `pnpm test`: PASS — 60/60 Node tests, including all ten categories, missing/unknown/non-string/array categories, removed fields, duplicate IDs, directory validation, dates/leap years, month/year navigation, repeated categories/order/counts, statuses, announcement expiry and previews.
- `pnpm typecheck`: PASS.
- `pnpm build`: PASS, with broken links and anchors configured to throw.
- Built `CNAME` equals `510aircadets.ca`; all 11 public/compatibility routes exist and returned HTTP 200 locally.
- Chromium browser assertions: PASS at widths 1440, 1100, 997, 996, 768, 480, 390 and 320. No document or date-cell horizontal overflow. A fictional 12-event date has 12 visible desktop labels, or two plus +10 on compact layouts, with 12 details including repeated Training events and Cancelled/Updated statuses.
- Browser checks passed for selected dates/empty dates, arrow/Enter navigation, PageDown and Shift+PageDown month/year movement, announcements-first section positions, newest-first notices, expiry on visibility refresh, archive and no-JavaScript public-event fallback.
- Visual review: desktop, tablet and phone screenshots inspected. Existing visible-focus CSS, native buttons/selects/summary and table headings are retained. Labels are decorative inside date buttons to avoid duplicate screen-reader content; each button has a full accessible name.
- `git diff --check`: PASS. Original production `docs/`, domain settings, navbar and release architecture unchanged.

A production CSS optimization issue discovered during screenshot review was corrected by using more specific variant selectors; the browser regression check explicitly counts **visible** labels.

## Screenshots

Actual migrated content, fixed clock November 2, 2026 (not a new deployment):

- [Desktop 1440px](production-content-1440.png)
- [Tablet 768px](production-content-768.png)
- [Mobile 390px](production-content-390.png)

Fictional stress fixture, fixed clock January 19, 2027; **not confirmed activities and never placed in production content**:

- [Desktop, all ten categories and repeated events](fictional-1440.png)
- [Tablet, two entries plus ten more](fictional-768.png)
- [Mobile, compact abbreviations](fictional-390.png)

## Reproduce optional browser checks

The default CI remains dependency-free beyond existing project dependencies. The optional review script uses a separately installed `playwright-core` and a compatible local Chromium executable, neither added to the website dependency graph. It starts local servers on ports 8765/8766. Use an isolated preview, never production content:

```bash
pnpm --dir 510AirCadets install --frozen-lockfile
pnpm --dir 510AirCadets validate:content
pnpm --dir 510AirCadets test
pnpm --dir 510AirCadets typecheck
pnpm --dir 510AirCadets build
python3 review/calendar-categories-announcement-priority/prepare-fixtures.py 510AirCadets /tmp/510-category-review
cp -a 510AirCadets/node_modules /tmp/510-category-review/node_modules
pnpm --dir /tmp/510-category-review clear
pnpm --dir /tmp/510-category-review build
PLAYWRIGHT_MODULE=/absolute/path/to/playwright-core \
CHROMIUM_EXECUTABLE=/absolute/path/to/chromium \
PREVIEW_ROOT=/tmp/510-category-review \
node review/calendar-categories-announcement-priority/browser-check.cjs
```

Use a new temporary directory if that path already exists. Copy dependencies, do not symlink them: Docusaurus module resolution must remain isolated. Screenshots/results are regenerated in this directory. Fixture expectations reflect the five current source records and should be revised if production content changes.

## Limits and operator decisions

- Chromium was exercised; no physical-device, Safari/Firefox or full screen-reader audit was performed. Keyboard behaviours were tested and native semantics retained; an assistive-technology review is still useful.
- Ten categories can produce tall desktop rows on crowded dates. Phones deliberately use abbreviations with a legend; full details remain one selection away.
- Browser classification still refreshes on page load/tab return, not continuously at midnight. Device clock errors and no-JavaScript build-date staleness remain existing static-site limitations.
- Palette/symbol choices and migrated categories need operator acceptance. No classification blockers remain. Existing content and history are public; human approval is mandatory. Fork-based contribution guidance remains in effect.

## Manual import and proposed PR/release steps

The accompanying Git bundle contains the feature commit relative to the base above. In an existing clone, with a clean working tree:

```bash
git status
git fetch origin
git bundle verify /path/to/510aircadets-calendar-categories.bundle
git fetch /path/to/510aircadets-calendar-categories.bundle feat/calendar-categories-announcement-priority:feat/calendar-categories-announcement-priority
git switch feat/calendar-categories-announcement-priority
git diff --stat origin/main...HEAD
# When ready to submit your review branch:
git push -u origin feat/calendar-categories-announcement-priority
```

If the branch already exists locally, do not overwrite it; inspect it first. If main advances, reconcile it on the feature branch and rerun checks before review. Open a PR to `main` titled **Prioritize announcements and categorize calendar events**. Describe the required schema, five-record migration, responsive behaviour and the test results above. The owner should confirm Website validation passes, review colours/categories and screenshots, and obtain an eligible approval under the active branch rules. Do not merge until explicitly authorized: merging main uses the existing automatic deployment workflow. No Pages, DNS, HTTPS or branch-protection settings changes are needed. This handoff does not authorize release.
