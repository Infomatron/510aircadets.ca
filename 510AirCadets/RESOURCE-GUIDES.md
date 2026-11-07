# Add a cadet or parent resource guide

Use the same branch, pull request and public release review process as other site
content. The [contribution guide](CONTRIBUTING.md) explains what can be published
and how to request review.

## Create the page

Place a reviewed guide in `src/pages/cadets/` or `src/pages/parents/` within
`510AirCadets/`. Use lowercase, hyphenated filenames. For example,
`src/pages/cadets/uniforms/badge-placement.mdx` maps to
`/cadets/uniforms/badge-placement/`. Docusaurus builds pages from this folder.
An `index` file serves its enclosing folder, so
`src/pages/cadets/uniforms/index.tsx` serves `/cadets/uniforms/`. The default
site base URL is `/`.

Use Markdown (`.md`) for prose or MDX (`.mdx`) if the guide needs a React
component. Include a descriptive title and summary in the page front matter,
then a single visible H1 and H2 headings for the main steps or topics. The built
in Markdown page layout supplies the site theme. For a custom page that needs
the same title and introduction layout as the hubs, follow the existing
`ContentPage` usage in `src/pages/cadets/index.tsx` in a TSX page.

Once the guide is ready for review, add a descriptive link in its parent
landing page using `@docusaurus/Link`. For a uniform guide, replace its plain
text planned entry in `src/pages/cadets/uniforms/index.tsx` with the link.
For a parent guide, add it to the resource list in `src/pages/parents/index.tsx`.
Include a link from each guide back to its parent section.

## Add illustrations and references

Place approved public illustrations under
`static/img/resources/cadets/` or `static/img/resources/parents/` and refer
to them as `/img/resources/...` in Markdown image links. Give each image
descriptive alt text and explain any essential steps or information in the
surrounding text. Use responsive images and keep legible labels at phone widths.

Link to the relevant official publication or section with descriptive text.
Record the source title and edition or date where available. Confirm that
instructions and illustrations reflect the current approved guidance before
requesting public release. Keep the squadron's explanatory material clearly
distinguished from official references.

## Preview and review

From `510AirCadets/`, run `pnpm start` to preview the guide and check its
parent link, return link, headings and illustrations on a phone and desktop.
Run `pnpm typecheck` and `pnpm build` before submitting the PR. The production
build checks internal links and anchors. Ask a reviewer to verify the
instructions, references and suitability for public release.
