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
2. On your branch, choose **Add file → Create new file**. Name it `510AirCadets/content/events/event-your-short-name.json`.
3. Paste the template and replace all fictional values. Set `id` to `event-your-short-name`, exactly matching the filename without `.json`. Use lowercase words, numbers and hyphens.
4. Supply a title, a date in `YYYY-MM-DD` format and status `scheduled`. These, plus the stable identifier, are sufficient for a basic event.
5. Choose **Commit changes**, describe the proposed change and commit to your feature branch. This does not publish to the squadron website.

Required event fields: `id`, `title`, `date`, `status`.
Optional event fields: `description`, `updatedDate`.
Allowed statuses: `scheduled`, `updated`, `cancelled`.

Use one file for each event. Multiple events can share a date. Dates use Newfoundland local calendar dates, America/St_Johns, and support years 2000–2099. All events remain current through their date; prior dates can still be viewed by navigating the calendar. The homepage shows at most three upcoming events, ordered by date then identifier. Keep descriptions to approved public information; private arrangements belong in direct squadron communications.

### Update or cancel

Edit the existing file with its pencil button. Preserve the identifier and filename, even if its date changes. Use status `updated` or `cancelled` and set `updatedDate` to the date of your correction. Both statuses require that field. Do not delete a cancelled record: its date remains visible with a Cancelled label. An optional related announcement can explain an approved change, but does not update the event automatically.

## 3. Add or correct an announcement

Copy `510AirCadets/contributor-templates/announcement.json` to `510AirCadets/content/announcements/announcement-your-short-name.json`. Match its id to that filename without `.json`.

Required: `id`, `title`, `publicationDate`, `message`.
Optional: `expiryDate`, `relatedEvent`, `category`, `updatedDate`.
Categories: `general`, `reminder`, `schedule-change`, `cancellation`. Omit category for General.

Messages are plain text; no HTML or Markdown. Use `\n\n` inside a JSON string for paragraph breaks. `relatedEvent` must match an existing event id; the site generates a link selecting that event's calendar date.

Expiry dates are inclusive in Newfoundland. A notice expiring `2027-01-19` remains active through that date and is archived from the next local midnight. Without expiry, a notice stays active until deliberately updated. Future publication dates hide notices from normal lists, but their text is PUBLIC in GitHub and built site data: this is not embargoed publishing.

For a correction, retain the original id and publication date, edit its message and add/update `updatedDate`. Create a new record for a different announcement.

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

Select a month/year or use Previous/Next; Today returns to the current Newfoundland date. Date buttons show event counts. Select a date to read all its events and statuses. Arrow keys move between dates, Home/End move within a week, Page Up/Down move by month (with Shift, by year), and Enter/Space selects a date.

Useful HTML is generated at each build. With JavaScript, the current date and active/expired classifications refresh on load and when returning to the tab. There is no background timer: continuously open pages can remain stale until revisited/reloaded. An incorrect device clock can affect classification. Without JavaScript the built month, selected-date list, full public event list and build-date notice remain available; interactive navigation requires JavaScript. Future and expired records remain public.

## Maintainer commands

From `510AirCadets/`: `pnpm run validate:content`, `pnpm test`, `pnpm run typecheck`, `pnpm run build`. The build also invokes shared validation. PR checks remain read-only `pull_request` checks; main deployment repeats content tests. Required check name stays **Website validation**. Do not grant upstream write access merely for cadet contributions. No repository permissions or protection settings are changed by this feature.
