module.exports = function (context) {
  let manifest = {};
  return {
    name: "page-modified",
    getPathsToWatch() {
      return [
        `${context.siteDir}/src/pages/**/*`,
        `${context.siteDir}/content/**/*`,
      ];
    },
    async allContentLoaded({ allContent, actions }) {
      const { buildManifest } = await import("./history.mjs");
      const pages = Object.values(allContent["docusaurus-plugin-content-pages"])
        .flat()
        .filter(Boolean);
      const content = allContent["squadron-content"].default;
      manifest = await buildManifest(context.siteDir, pages, content.ssc);
      actions.setGlobalData(manifest);
    },
    async postBuild({ outDir }) {
      const fs = require("node:fs/promises");
      const path = require("node:path");
      for (const [route, date] of Object.entries(manifest)) {
        if (!date) {
          if (process.env.CI)
            throw new Error(`Missing committed modification date for ${route}`);
          continue;
        }
        const html = await fs.readFile(
          path.join(outDir, route, "index.html"),
          "utf8",
        );
        if (
          !html.includes(`dateTime="${date}"`) &&
          !html.includes(`datetime="${date}"`)
        )
          throw new Error(`Missing modification date rendering for ${route}`);
      }
    },
  };
};
