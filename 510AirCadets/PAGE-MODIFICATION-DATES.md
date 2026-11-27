# Page modification dates

Every Docusaurus Pages route receives a modification date through the shared
theme Layout wrapper. This includes React pages and Markdown/MDX pages.
The Pages plugin's last-update metadata supports Markdown, while the centralized
manifest also covers React pages and content from multiple records.

Dates come from the latest relevant committed content change, converted from
the Git committer timestamp to America/St_Johns. Rebuild and deployment times
have no effect. Pure file renames follow the prior content history. Changes to
shared styling, navigation or footer configuration have no effect on other pages.

## Sources and dependencies

The page-modified plugin consumes all Pages plugin route metadata. It uses each
route's actual source and permalink, so future pages and custom Markdown slugs
are included automatically. A post-build check verifies the rendered date on
every content route.

- Each page uses its own source history, following file renames.
- The homepage, calendar and announcement archive include event and announcement
  directory history, including deleted records. All calendar dates are browsable,
  so past event records are relevant.
- The same pages include the latest change to an SSC article that has promotion
  enabled on either side of a commit. This includes unpromotion and deletion.
- The SSC overview includes update history and SSC event history. Category
  changes into and out of SSC are included.
- The SSC update and meeting listings include their respective content directories.
- An individual SSC article includes earlier and newer linked supersession
  records whose titles and links are rendered on that page.

The directory rules are in `plugins/page-modified/history.mjs`. If adding a new
page driven by multiple content files, add its dependency mapping there and a
test showing that relevant records affect its date. Ordinary pages need no
date component or manual date field.

Shared content components can affect multiple pages. Their history is
deliberately excluded because those files also contain shared layout and
rendering logic. When changing factual copy rendered entirely by a shared
component, update the affected page sources or add a specific dependency rule
and test. Generated file dates and runtime clocks are never date sources.

## Development and CI

Use a full Git checkout. CI checkout steps use `fetch-depth: 0`. A missing Git
repository or shallow history raises an actionable error. New uncommitted pages
show “Date Modified: Awaiting first commit” and emit a build warning. CI fails
if a content route lacks a committed date. Existing pages with local edits show
their last committed date until the change is committed.

Commit dates reflect Git history. Imports with rewritten timestamps and history
rewrites can affect them. A merge can alter which commit is considered most recent.
Modification dates describe source changes rather than content review approval.

## Exclusions

Compatibility redirect pages use the shared CompatibilityRoute component and
are excluded. The generated 404 page is excluded because it has no content page
source. If a future page bypasses the theme Layout entirely, the post-build
coverage check fails and prompts its author to use the shared layout.
