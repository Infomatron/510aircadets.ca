# Publish Parents Support Group content

Prepare approved public summaries in Markdown. The website maintainer and
squadron representatives should confirm who can approve public content.
The existing GitHub pull request process applies to every change.

## Keep private records separate

GitHub branches, commits, pull requests and their history are public. Keep
raw emails and texts, internal deliberations, raw minutes, names and contact
details, attendance lists, cadet and family information, sensitive financial
details and private logistics in private records. Check the summary, article,
links, filenames and GitHub discussion before submission. Use responsible
role names in action lists. Only include personal identifiers with explicit
authorization. Review the [public release rules](CONTRIBUTING.md).

## Write an update

In `510AirCadets/src/pages/parents/support-group/updates/` create one `.mdx`
file. Choose a lowercase, hyphenated filename. The filename determines its
permanent URL, so keep it when editing the article. The listing is automatic.

Copy this example and replace all sample values with approved public material.
Use a quoted Newfoundland calendar date that has already arrived.

```mdx
---
title: "Example PSG update"
date: "2026-11-13"
summary: "Replace this with a short approved public summary."
status: approved
topic: "Volunteering"
promoteToAnnouncements: false
---

import { PsgArticleLayout } from '@site/src/components/ParentsSupportGroup';

<PsgArticleLayout>

## Update

Replace this example with the approved public article.

</PsgArticleLayout>
```

The layout supplies the title, date and summary. Use Markdown for the body
and start its headings at H2. Title and summary are required. Topic and
`updatedDate` are optional. Quote dates in `YYYY-MM-DD` format.

Set `promoteToAnnouncements: true` only for an update cleared for wider
distribution. The calendar announcement list then uses its title, summary,
date and article link automatically. It also participates in the existing
homepage announcement preview. An optional quoted `expiryDate` keeps the
notice active through that Newfoundland date and then moves it to the
announcement archive. The full article stays in the PSG listing.

## Record a meeting and its decisions

Create one `.mdx` file under
`510AirCadets/src/pages/parents/support-group/meetings/`. The listing groups
summaries by year and orders newest first. The title is optional.

```mdx
---
title: "Example PSG meeting summary"
meetingDate: "2026-11-13"
summary: "Replace this with the approved public meeting summary."
status: approved
---

import { PsgArticleLayout } from '@site/src/components/ParentsSupportGroup';

<PsgArticleLayout>

## Topics discussed

Summarize only approved public information.

## Decisions

- **Topic** — Record the decision and its status. Use Proposed, Approved,
  Completed, Rescinded or Superseded as appropriate.

## Follow-up actions

| Action | Responsible role | Status |
| --- | --- | --- |
| Replace this example | Committee role | Planned |

## Next steps

Add approved public information or links to earlier public summaries.

</PsgArticleLayout>
```

The front matter status applies to approval of the public summary. Use
decision and action statuses in the body to record their actual state.

## Correct or supersede information

For a minor correction, retain the filename and original date, record what
changed where useful and add a quoted `updatedDate`. For a changed decision,
keep the original summary and add a new approved summary explaining which
decision was changed and what replaces it. Set `supersedes: previous-slug`
to connect it to an earlier article in the same section. The page displays
links in both directions. When only one decision in a summary changes,
link directly to the earlier summary in the body and describe the change.

## Add an event and submit for review

Use the existing [calendar event process](CONTRIBUTING.md#2-add-an-event).
Set `category` to `parents-support-group`. Use an approved public date,
title and optional public description. Keep times, durations and private
locations out of the public record. The event appears in the shared calendar.

Create a branch from current main, add the file and open a PR after checking
that its contents are cleared for public review. Use **Website validation**
to see errors. If you have the site running locally, run `pnpm start` from
`510AirCadets` and check the hub, article and calendar. Run
`pnpm validate:content`, `pnpm test`, `pnpm typecheck` and `pnpm build`.
Review the article and any promoted summary before merging through the
existing process.
