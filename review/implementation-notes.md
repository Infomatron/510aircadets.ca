# First implementation milestone

Historical record: operational facts and recruitment/activity status below are superseded by the [Milestone 2 handoff](milestone-2/handoff.md).

Branch: `feat/squadron-site-design`. Production output in root `docs/` is unchanged. No merge, push or deployment performed.

## Implemented

Six public routes: Home, About, Join, Activities, Parents & Cadets and Contact. Retained Docusaurus navigation, mobile menu, footer and skip-navigation behaviour. Added shared content-page, action and activity-card components. Applied approved provisional blue/yellow design tokens, responsive grids, visible focus styles and reduced-motion handling. Removed starter source pages, documentation, blog content and illustrations. Corrected canonical/site identity and repository configuration. Added authorized temporary Linktree crest and a text-based favicon.

## Content verification record

- Operator and independent status: confirmed by operator in planning handoff.
- Crest permission: confirmed by operator. Temporary source: https://ugc.production.linktr.ee/58681212-9ac6-4f4a-a3c6-8a43762ec7be_40PYGrqs-400x400--1-.png?io=true&size=avatar-v3_0 . Downloaded 400 × 400; decoded and saved as PNG without cropping, recolouring or redrawing. Displayed at 220 px in desktop hero and 40 px in navigation. Replace with supplied original when available.
- Colours: approved provisionally from Linktree: blue #214867; yellow #F9BD11; secondary #FEC010.
- Ages 12–18: corroborated by Canada.ca Cadets landing page. Free program: squadron Linktree. No local recruitment availability claim made.
- Local band, biathlon and marksmanship: publicly listed at https://510air.cadets.site/ . Current offering remains unconfirmed. Cards explicitly label these as publicly listed.
- Aviation, leadership and field training: described as broader program opportunities, not guaranteed local activities.
- DRAFT ONLY — unconfirmed: 196 Pennywell Road, St. John's, NL; Tuesdays 18:30–21:00. Omitted from public pages pending operator confirmation.
- DRAFT ONLY — unresolved recruitment capacity: public listing says Full Capacity; Linktree invites registration. Neither acceptance nor waiting list is claimed.
- No photography, personal email addresses, private schedules or custom forms were added.

## Governance review

Reviewed CJCR Gp O 2008-6, verified 2026-05-05: https://www.canada.ca/en/department-national-defence/services/cadets-junior-canadian-rangers/cjcr-policy/cjcrgporders/2000/2008-6.html . Section 5.1 gives disclaimer examples for independently managed supporting websites. The supplied footer/About wording follows that transparency approach; it is retained as provisional rather than described as formal policy approval. No unrelated official program identifiers were added. Official resources are linked rather than copied.

## Architecture and deployment

No new project dependencies or deployment workflows. Actual Pages settings could not be retrieved through the unauthenticated GitHub API (404 is inconclusive). Root docs/CNAME is untouched. Source static/CNAME addition is deferred until Pages settings are verified, as required by the brief.

## Review decisions

Approve design and wording. Confirm address, parade hours, visitor arrangements, current activities and recruitment capacity. Provide high-resolution authorized crest and permission-cleared photography when available. Confirm Pages branch/source before release preparation.

## Verification results

- `pnpm run typecheck`: passed.
- `pnpm run build`: passed; strict Docusaurus broken-link checking enabled.
- `git diff --check`: passed.
- Chromium rendering: desktop 1440 × 1000, tablet 768 × 1024, mobile 390 × 844; screenshots inspected. No homepage horizontal overflow; additional 320 px reflow check passed.
- All six routes returned HTTP 200. Each has one main landmark and one h1 in the initial homepage checks; all route canonicals use https://510aircadets.ca/.
- Mobile menu opened and its navigation link was visible.
- Keyboard: first focus reaches Skip to main content; after activation the next Tab reaches the homepage's primary action. Docusaurus temporarily focuses main then removes its tabindex, so document.activeElement returns body afterward. Focus outline on the action is 3 px blue with a contrasting white outer ring.
- 42 internal link checks: no failures. No client-side JavaScript errors observed.
- No forms and no images missing alt attributes on the six public routes.
- Brand contrast: blue/white 9.60:1; blue/primary yellow 5.63:1. Yellow/white 1.71:1, so no white text on yellow buttons.
- Official program, ranks, badge and resource links retrieved through web lookup. Official registration URL matches Linktree but the registration service could not be fetched reliably from this environment; end-to-end registration was not attempted. Social links match the supplied public accounts; social page content could not be fully inspected.
- No lint/test scripts exist. No new testing framework or project dependency added. Rendering tools were installed only in temporary scratch tooling.
- Limits: Chromium checks are not a complete WCAG audit. Screen-reader testing, Safari/Firefox, real-device testing and comprehensive keyboard/zoom checks remain for release review. No assertion of full WCAG conformance is made.

Screenshots: `home-desktop.png`, `home-tablet.png`, `home-mobile.png`. Raw browser observations: `browser-checks.txt`.

## Files changed

- Updated: `510AirCadets/docusaurus.config.ts`, `510AirCadets/src/pages/index.tsx`, `510AirCadets/src/css/custom.css`, `510AirCadets/README.md`.
- Added: `510AirCadets/src/components/Squadron/index.tsx`; page files `about.tsx`, `join.tsx`, `activities.tsx`, `parents-cadets.tsx`, `contact.tsx`; `static/img/squadron-crest.png`, `static/img/favicon.svg`; this review directory.
- Removed: starter source `510AirCadets/docs/`, `510AirCadets/blog/`, `sidebars.ts`, `src/pages/markdown-page.mdx`, obsolete homepage feature component and CSS module, obsolete index CSS module, Docusaurus sample assets.
- Preserved: all production output in root `docs/`, custom domain, package versions and lockfile.

## Recommended next milestone

Planning review of the visual design and copy, followed by confirmed operational content and higher-resolution artwork. After approval, verify Pages settings and prepare a separate, reviewable release process that preserves CNAME. Do not release this milestone directly.
