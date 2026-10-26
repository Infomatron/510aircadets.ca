# Milestone 2 handoff — confirmed operational content

Completed on `feat/squadron-site-design`. The approved design, typography, colours, responsive styling, temporary crest and independent-site disclaimer are retained. No project dependencies added. No publishing settings, workflow, root-level production output or CNAME changed. No push, merge or deployment performed.

## Content changes

- Homepage and Contact show Tuesday parade hours of 18:30–21:30 at 196 Pennywell Road, St. John's, NL A1C 2L6. Parents/guardians are asked to arrive by 21:15 for pickup; this is not described as dismissal. Schedule-change caveat included.
- Both pages use an ordinary, same-tab Google Maps link labelled “View Directions on Google Maps”, with the complete encoded address. No map embed or map scripts.
- Homepage and Join use approved at-capacity recruitment wording and a “Register Your Interest” action pointing to https://registration.cadets.gc.ca/get-started.html?unitId=441 . Contact and navbar use the same action. Join remains an internal navigation destination.
- No automatic waitlist placement, contact timeframe, immediate enrollment or guaranteed placement is promised. Registration administration remains with the squadron.
- Activities now describes six confirmed squadron categories: Aviation; Outdoor & Field Training; Marksmanship; Biathlon; Band; Leadership & Personal Development (including citizenship and physical fitness). Availability may vary through the training year.
- Shared parade and recruitment components reduce duplicated operational copy. Historical provisional wording is removed from current source pages.

## Modified files

- `510AirCadets/src/components/Squadron/index.tsx`: shared parade/recruitment content, Maps URL, six activity categories.
- `510AirCadets/src/pages/index.tsx`: homepage information, activity introduction and actions.
- `510AirCadets/src/pages/join.tsx`: confirmed status, approved wording and FAQs.
- `510AirCadets/src/pages/activities.tsx`: confirmed squadron offerings.
- `510AirCadets/src/pages/contact.tsx`: confirmed schedule/address/pickup and registration action.
- `510AirCadets/docusaurus.config.ts`: external registration action and internal Join navigation link. No publishing configuration changes.
- `review/implementation-notes.md`: marked as historical, superseded where applicable.
- Added this handoff, eight screenshots, browser observations and external-link results in `review/milestone-2/`.

## Screenshots

| Page | Desktop | Mobile |
|---|---|---|
| Home | [Desktop](home-desktop.png) | [Mobile](home-mobile.png) |
| Join | [Desktop](join-desktop.png) | [Mobile](join-mobile.png) |
| Activities | [Desktop](activities-desktop.png) | [Mobile](activities-mobile.png) |
| Contact | [Desktop](contact-desktop.png) | [Mobile](contact-mobile.png) |

All eight screenshots inspected. No redesign or CSS changes were needed.

## Verification

- `pnpm run typecheck`: passed.
- `pnpm run build`: passed, with Docusaurus strict broken-link checking.
- Desktop 1440 × 1000 and mobile 390 × 844: all six routes returned 200, with one h1/main, no images missing alt, and no horizontal overflow.
- 12 distinct local link URLs (including fragment variants): successful responses.
- Mobile menu opens and Join destination is visible after the menu transition.
- Skip navigation is first keyboard focus; subsequent progression reaches the primary hero action. Visible 3 px focus outline retained.
- Homepage reflow at 320 px: passed. No JavaScript errors observed.
- Browser assertions verify exact registration URL, decoded Maps address, no Maps target override, all confirmed times/address on homepage and Contact, at-capacity wording, and removal of old provisional phrases. Source contains no 21:00 parade hours.
- External HTTP checks: Google Maps, Linktree, Instagram and four Canada.ca references returned 200. Facebook redirects to login (200), so logged-out page content was not validated. Registration returned 503; exact approved URL is retained. This does not establish whether the service is unavailable to ordinary visitors. Check the form in a normal browser before release; no registration was submitted.
- No configured lint/test scripts. No new testing framework added. See `browser-checks.txt` and `external-links.json` for observations.
- Limits: Chromium-only checks, not a full WCAG audit. Screen-reader, real-device, Safari/Firefox and comprehensive zoom/keyboard testing remain release-review gaps. No new accessibility regression observed in the checks performed.

## GitHub Pages investigation

### Verified evidence

- Public repository metadata reports default branch `main` and Pages enabled.
- Public remote has only `main` as a branch as of inspection.
- Most recent successful Pages deployment targets `main`, commit `62443b82075e799de89e007411abcbcd6d754433`, environment https://510aircadets.ca/ . Status recorded 2026-10-24T17:55:05Z.
- Run: https://github.com/Infomatron/510aircadets.ca/actions/runs/40118270161 . Name `pages build and deployment`, event `dynamic`, path `dynamic/pages/pages-build-deployment`. This is GitHub's Pages-managed workflow, not a tracked custom Docusaurus build workflow.
- Root `docs/` contains committed static HTML/assets, introduced with the Docusaurus starter in commit `13ebad9`. No tracked workflow or release script generates it.
- `package.json` build script is plain `docusaurus build`. Current builds produce `510AirCadets/build/`, not root `docs/`.
- The domain file exists only at root `docs/CNAME`, containing `510aircadets.ca`. Current local build does not include CNAME because `static/CNAME` has not been added.

### Conclusion and limitation

Publishing from `main` is verified by deployment/run records. Publishing directory `/docs` is strongly supported by the committed site location, absence of a root entry page/custom build workflow and prior project setup. The exact Pages settings field cannot be independently read: unauthenticated `/repos/Infomatron/510aircadets.ca/pages` returns 404. Confirm `main` + `/docs` in Settings → Pages before release preparation. Do not treat the 404 as evidence that Pages is disabled.

The prior build-to-docs step appears to have happened outside tracked automation (manual copy or an untracked local command); the exact command cannot be recovered from the repository.

## Release options — recommendations only

| Option | Process | Tradeoff |
|---|---|---|
| Simple manual release | After confirming Pages settings, add source `static/CNAME`; install from frozen lockfile; typecheck/build to local build directory; cleanly replace only root production `docs/` with verified build output; verify CNAME, `.nojekyll`, routes and removal of obsolete starter files; review source and generated diff in a release PR; merge only after explicit release approval. | Preserves current hosting setup and is simple for occasional changes. Generated files produce noisy diffs and source/output can drift if the step is skipped. |
| Automated GitHub Actions | Separate PR validation from deployment. Pin tested Node/pnpm and action versions; frozen install, typecheck and build; upload Pages artifact from `510AirCadets/build/`; deploy approved main commits using official Pages actions and a protected `github-pages` environment. Change publishing source to GitHub Actions only during an approved migration. | Recommended long-term: reproducible source-to-artifact builds and no committed build output. Requires one deliberate Pages configuration migration and environment permissions/review rules. |

For manual branch publishing, adding `static/CNAME` during release preparation ensures Docusaurus copies the domain file into each build; verify it before replacing `/docs`. For an Actions migration, preserve the custom domain in Pages settings; a CNAME artifact alone does not configure the domain. Neither approach needs DNS changes for this milestone. Keep the existing docs/CNAME untouched until the approved release process replaces it with an equivalent verified file.

Do not run the current `deploy` package command as a shortcut; it uses Docusaurus publishing behaviour that is not configured for this repository's existing `/docs` arrangement.

Sources: [GitHub publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [Docusaurus deployment](https://docusaurus.io/docs/deployment), [Docusaurus CLI](https://current.docusaurus.io/docs/cli).

## Next steps for planning review

Review the updated screenshots and operational copy. Confirm the official registration form loads in a normal browser. Verify the Pages source setting. Select manual release preparation for minimal hosting change, or authorize a separate Actions migration for ongoing maintainability. Neither release option has been implemented. Higher-resolution artwork remains pending but does not block content review. No further operational facts are required for the scope completed here.
