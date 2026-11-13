module.exports = function (context) {
  return {
    name: "squadron-content",
    getPathsToWatch() {
      return [
        `${context.siteDir}/content/{events,announcements}/**/*`,
        `${context.siteDir}/src/pages/parents/support-group/**/*.mdx`,
      ];
    },
    async loadContent() {
      const { loadContent } = await import("./load.mjs");
      return loadContent(context.siteDir);
    },
    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content);
    },
  };
};
