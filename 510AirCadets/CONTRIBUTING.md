# Add public events and announcements

You can do this in GitHub's website: no React, TypeScript or local software is required.

## Before you type: everything here is public

The website, forks, branches, pull requests, comments, commits and Git history are publicly accessible. Removing a file later does not remove its history. Only submit information already approved for unrestricted public release. “Unclassified” does not by itself mean suitable for publication.

Never include cadet personal information, attendance lists, private phone numbers or email addresses, unapproved photographs, sensitive activity logistics or private instructions. Do not put these in a draft PR or review comment either. If unsure, ask an authorized adult through the squadron's private channels first. Human review is mandatory; a green automated check does not approve information for release. If private information is committed accidentally, stop and privately notify the repository owner immediately; do not repeat it in a public issue.

## 1. Fork and create a branch

1. Sign in to your own eligible GitHub account. Open https://github.com/Infomatron/510aircadets.ca and click **Fork**. A fork is your own public copy; you do not need write access to the original repository. Do not share accounts.
2. For later changes, open your fork and use **Sync fork → Update branch** on its main branch first.
3. Open the branch selector (usually showing `main`). Type a short branch name such as `content/public-event` and choose **Create branch**. Start a separate branch from your updated main for each change.

## 2. Add an event

1. In your fork, open `510AirCadets/contributor-templates/event.json`. Copy its text.
2. Still on your new branch, use **Add file → Create new file**. Name it `510AirCadets/content/events/event-your-short-name.json`.
3. Paste the template and replace all fictional values. Make `id` exactly `event-your-short-name`, matching the filename without `.json`. Use lowercase words, numbers and hyphens. Keep this identifier when updating the event later.
4. Use **Commit changes**, describe your change and commit to your feature branch. This saves your proposal; it does not publish to the squadron website.

Required fields: `id`, `title`, `date`, `startTime`, `status`.
Optional: `endTime`, `location`, `description`, `updatedDate`.

Dates use `YYYY-MM-DD` (years 2000–2099); times use `HH:mm`, for example `18:30`. All times are Newfoundland local time, America/St_Johns, including daylight saving. Do not convert to your device's timezone. End times must be later on the same date. Recurring, overnight and multi-day events are not supported: ask the maintainer before proposing one. Ambiguous/repeated or nonexistent daylight-saving times fail validation; ask the maintainer to resolve the schedule rather than guessing.

For an event with no end time, omit `endTime` completely; it remains current through its local calendar date. With an end time, it leaves the upcoming list at that time. Cancelled events follow the same rules and remain visibly cancelled until then. Past records are retained and accessible under **Past public events**.

### Update or cancel an event

Edit the existing file using its pencil button. Preserve its id and filename. Change `status` to `updated` or `cancelled`, add `updatedDate` with the date of the change, and correct the description as needed. Both statuses require `updatedDate`. Do not delete a cancelled event. If an extra public explanation is useful, add an announcement with `relatedEvent` set to that event's id. Update the event itself too: an announcement does not change its status.

## 3. Add or correct an announcement

Copy `510AirCadets/contributor-templates/announcement.json` into a new file under `510AirCadets/content/announcements/announcement-your-short-name.json`. Match its id to the filename.

Required fields: `id`, `title`, `publicationDate`, `message`.
Optional: `expiryDate`, `relatedEvent`, `category`, `updatedDate`.

Categories are `general`, `reminder`, `schedule-change`, `cancellation`. Omit category to use General. Messages are plain text; no HTML or Markdown formatting. Separate paragraphs inside a JSON string using `\n\n`. Related event links are generated automatically; `relatedEvent` must match an existing event id.

Expiry dates are inclusive in Newfoundland: a notice expiring `2027-01-19` is active through that day and archived from the next local midnight. Future publication dates are hidden from the normal lists, but their text is still PUBLIC in GitHub and the built site data. This is not embargoed/private publishing. No expiry means it remains active until deliberately updated. Expired records stay in the public archive.

For a correction, edit the existing file, keep its id and original publication date, and add/update `updatedDate`. Do not silently turn an old notice into a different announcement. Create a new record for a different message.

## 4. JSON tips and limits

- Keep double quotes around field names and text. Separate fields with commas, but do not put a comma after the last field.
- Escape a quotation mark inside text as `\"`.
- Omit unused optional fields. Do not use empty strings, `null` or extra fields.
- Title: at most 120 characters. Message/description: 1000. Location: 200. Other fields: 100.
- Do not paste HTML, scripts, photos or private contact details.
- Template dates and titles are fictional; replace them before submitting. Template folders are not published as content.

## 5. Open a pull request and respond to review

1. Open your fork's branch. Choose **Contribute → Open pull request** (or **Compare & pull request**).
2. Check the destination: base repository `Infomatron/510aircadets.ca`, base branch `main`; head is your fork and feature branch.
3. Give it a clear title and explain what public information changed. Confirm that the information is authorized for public release. Do not name minors in the title or description.
4. Choose **Create pull request**. First-time fork contributions may need a maintainer to approve the validation run; ask if it is waiting.
5. Open **Checks → Website validation**. If red, inspect **Validate public content** and **Test content rules**. Errors name the file and field, for example `endTime: must be later than startTime on the same date`. Fix the file on the SAME fork branch and commit again; the PR updates automatically. For unfamiliar build errors, ask the maintainer rather than editing workflows.
6. Read review comments, make requested corrections on the same branch, and reply to explain what changed. Leave approval/resolution decisions to the reviewer. New commits can dismiss a previous approval.
7. An authorized reviewer checks content, approves the latest revision and ensures checks/conversations are complete. A maintainer merges it. You must not bypass the rules or publish directly. Actions then publishes the merged update automatically.

## Static-site behaviour

Useful HTML is generated at each build. With JavaScript, active/past/expired classifications refresh on page load and when you return to the browser tab. There is no background timer: a page left open continuously across a time boundary may show the earlier classification until reloaded or revisited. Classification depends on the visitor's clock; it cannot detect an incorrect device clock. Without JavaScript, lists reflect the build date and show a notice to check the explicit dates. No scheduled rebuilds, login, comments or private content are provided.

All content remains public, including expired announcements and past events. Browser filtering is presentation, not access control.

## Maintainer checks

From `510AirCadets/`, run `pnpm run validate:content`, `pnpm test`, `pnpm run typecheck`, `pnpm run build`. The Docusaurus build also invokes the shared validator. PR validation is read-only, uses `pull_request`, and never deploys; main deployment repeats content tests. Keep the required check named **Website validation**. Do not grant upstream collaborator write access merely for cadet content contributions. No permissions or branch settings are changed by this feature.
