# Maintain Calendar & Announcements

You can edit public content through GitHub's website. No React, TypeScript or local software is required. The public calendar is at `/calendar`; current announcements appear beneath it. Expired announcements remain at `/calendar/archive`.

## Everything here is public

The website, forks, branches, pull requests, comments, commits and Git history are publicly accessible. Removing a file later does not remove its history. Only submit information approved for unrestricted public release. “Unclassified” does not by itself mean suitable for publication.

Never include cadet personal information, attendance lists, private contacts, unapproved photographs, sensitive activity logistics or private instructions. Do not include these in draft PRs or review comments either. Ask an authorized adult through private squadron channels if unsure. A green check does not approve information for release: authorized human review is mandatory. If private information is accidentally committed, stop and privately notify the owner without repeating it in a public issue.

## 1. Fork, sync and create a branch

1. Sign in to your own eligible GitHub account. Open https://github.com/Infomatron/510aircadets.ca and choose **Fork**. This creates your own public copy; you do not need write access to the original. Do not share accounts.
2. Before later contributions, open your fork's main branch and use **Sync fork → Update branch**.
3. Open the branch selector, type a short name such as `content/public-event` and select **Create branch**. Start each change from your updated main.

## 2. Add an event

1. Copy `510AirCadets/contributor-templates/event.json`.
2. On your branch, choose **Add file → Create new file**. Name it `510AirCadets/content/events/2027/01/2027-01-19-example.json`, replacing the example date and short name. GitHub creates the year/month folders from the full filename you enter.
3. Paste the template and replace all fictional values. Set a unique `id` such as `event-your-short-name`. The identifier is independent of the filename; use lowercase words, numbers and hyphens, and never change an existing id.
4. Supply a title, a date in `YYYY-MM-DD` format, exactly one `category` from the table below and status `scheduled`. These, plus the stable identifier, are sufficient for a basic event.
5. Choose **Commit changes**, describe the proposed change and commit to your feature branch. This does not publish to the squadron website.

Required event fields: `id`, `title`, `date`, `category`, `status`.
Optional event fields: `description`, `updatedDate`.
Allowed statuses: `scheduled`, `updated`, `cancelled`.

Use one file for each event. Multiple events can share a date. Dates use Newfoundland local calendar dates, America/St_Johns, and support years 2000–2099. All events remain current through their date; prior dates can still be viewed by navigating the calendar. The homepage shows at most three upcoming events, ordered by date then identifier. Keep descriptions to approved public information; private arrangements belong in direct squadron communications.

### Choose one primary event category

The application supplies each category's label, colour and symbol automatically. Do not add colours, icons or multiple categories to JSON. Categories describe the activity; the separate title describes the particular event. These identifiers apply to events only; announcement categories remain unchanged.

| Identifier | Display label | Symbol |
| --- | --- | --- |
| `training` | Training | Book |
| `marksmanship` | Marksmanship | Target |
| `band` | Band | Music |
| `choir` | Choir | Microphone |
| `ground-school` | Ground School | Aircraft |
| `ceremony` | Ceremony | Award |
| `parade` | Parade | Flag |
| `field-training-exercise` | Field Training Exercise | Trees |
| `special-event` | Special Event | Star |
| `biathlon` | Biathlon | Medal |

Copyable fictional example, not a confirmed squadron event:

```json
{
  "id": "event-fictional-training",
  "title": "Fictional training example",
  "date": "2027-01-19",
  "category": "training",
  "status": "scheduled"
}
```

Place that example in `content/events/2027/01/2027-01-19-fictional-training.json` only after replacing it with approved content. All real event records require a category; ask the authorized reviewer if unsure rather than selecting an arbitrary default. Keep locations, start/end times and durations out of public event records and descriptions.

Calendar cells use the order in the table, then stable id within a category. On smaller screens only two entries are shown and `+N more` counts additional EVENTS, including repeated categories. Narrow screens use text abbreviations explained in the Event category key. Every event remains available by selecting the date. Cancelled/updated events keep their category and display separate status labels.

### Update or cancel

Edit the existing file with its pencil button. Preserve the identifier. If the date changes, move the file to the year/month of its new date in the same commit; you may also rename its date-prefixed filename. In GitHub’s file editor, edit the full filename/path above the text area, then edit the JSON date. Do not leave a second copy behind. Use status `updated` or `cancelled` and set `updatedDate` to the date of your correction. Both statuses require that field. Do not delete a cancelled record: its date remains visible with a Cancelled label. An optional related announcement can explain an approved change, but does not update the event automatically.

## 3. Add or correct an announcement

Copy `510AirCadets/contributor-templates/announcement.json` to `510AirCadets/content/announcements/2027/01/2027-01-12-example.json`, replacing the date and short name. Set a unique stable id such as `announcement-your-short-name`; it does not have to match the filename. Organize by publication date, not expiry date or correction date.

Required: `id`, `title`, `publicationDate`, `message`.
Optional: `expiryDate`, `relatedEvent`, `category`, `updatedDate`.
Categories: `general`, `reminder`, `schedule-change`, `cancellation`. Omit category for General.

Messages are plain text; no HTML or Markdown. Use `\n\n` inside a JSON string for paragraph breaks. `relatedEvent` must match an existing event id; the site generates a link selecting that event's calendar date.

Expiry dates are inclusive in Newfoundland. A notice expiring `2027-01-19` remains active through that date and is archived from the next local midnight. Without expiry, a notice stays active until deliberately updated. Future publication dates hide notices from normal lists, but their text is PUBLIC in GitHub and built site data: this is not embargoed publishing.

For a correction, retain the original id and publication date, edit its message and add/update `updatedDate`. Create a new record for a different announcement.

## Directory rules and fictional placement examples

Use exactly `content/events/YYYY/MM/filename.json` or `content/announcements/YYYY/MM/filename.json` inside `510AirCadets/`. Years have four digits (2000–2099); months are numeric and zero-padded (`01`–`12`). Named months, flat files and extra subfolders fail validation. JSON discovery is recursive, and ids must be unique across all year/month folders.

The event folder must match `date`. An announcement folder must match `publicationDate`; changing only its message, `updatedDate` or `expiryDate` does not move it. If correcting a mistaken publication date, also correct its folder and retain its id. Prefer date-prefixed filenames for browsing; valid lowercase hyphen-separated legacy filenames are also accepted after moving to the correct folder. Filenames need not equal ids and may be renamed without changing references. Maximum filename length: 140 characters including `.json`.

These examples are fictional and do not describe confirmed squadron activities:

| Change | File path within `510AirCadets/` | Identifier |
| --- | --- | --- |
| New event dated 2027-01-19 | `content/events/2027/01/2027-01-19-example.json` | `event-example` |
| Same event rescheduled to 2027-02-03 | `content/events/2027/02/2027-02-03-example.json` | Keep `event-example` |
| New notice published 2027-01-12 | `content/announcements/2027/01/2027-01-12-example.json` | `announcement-example` |
| Message corrected in February, original publication retained | Same January announcement path | Keep `announcement-example` |

For a reschedule, change the existing file’s path and date together, set `status` to `updated`, and set `updatedDate`. Announcement `relatedEvent` references keep working because the id stays the same. Do not copy the record into its new month and leave the old copy: duplicate ids fail validation. The calendar and public URLs do not depend on source filenames or folder names.

## 4. JSON tips

- Use double quotes around field names and text. Separate fields with commas; do not put a comma after the last field.
- Escape quotation marks inside text as `\"`.
- Omit unused optional fields; no empty strings, `null` or additional fields.
- Titles: at most 120 characters. Messages/descriptions: 1000. Other fields: 100.
- Keep template files outside production content folders until copied and edited. Their sample dates and wording are fictional.

## 5. Pull request, checks and review

1. From your fork's branch choose **Contribute → Open pull request** (or **Compare & pull request**).
2. Confirm base repository `Infomatron/510aircadets.ca`, base branch `main`, and your fork/feature branch as head.
3. Give a clear title and explain the approved public change. Do not name minors or include private information in the PR description.
4. Choose **Create pull request**. A maintainer may need to allow a first-time fork's validation run.
5. Open **Checks → Website validation**. For a red check, read **Validate public content** and **Test content rules**. Errors name the file, field and expected correction. Fix the file on the SAME branch and commit; the PR updates automatically. Ask the maintainer about unfamiliar build errors rather than editing workflows.
6. Read review comments, correct the same branch and reply explaining what changed. Leave approval and resolution decisions to the reviewer. New commits can dismiss earlier approvals.
7. An authorized reviewer checks content, approves the latest revision and ensures checks and conversations are complete. A maintainer merges; the existing Actions process publishes. Never bypass protection or publish directly.

## Calendar use and static-site behaviour

Read the announcements at the top of `/calendar` first. Select a month/year or use Previous/Next; Today returns to the current Newfoundland date. Date buttons show category labels, with an additional-event count when space is limited. Select a date to read all its events and statuses. Arrow keys move between dates, Home/End move within a week, Page Up/Down move by month (with Shift, by year), and Enter/Space selects a date.

Useful HTML is generated at each build. With JavaScript, the current date and active/expired classifications refresh on load and when returning to the tab. There is no background timer: continuously open pages can remain stale until revisited/reloaded. An incorrect device clock can affect classification. Without JavaScript the built month, selected-date list, full public event list and build-date notice remain available; interactive navigation requires JavaScript. Future and expired records remain public.

## Maintainer commands

From `510AirCadets/`: `pnpm run validate:content`, `pnpm test`, `pnpm run typecheck`, `pnpm run build`. The build also invokes shared validation. PR checks remain read-only `pull_request` checks; main deployment repeats content tests. Required check name stays **Website validation**. Do not grant upstream write access merely for cadet contributions. No repository permissions or protection settings are changed by this feature.
