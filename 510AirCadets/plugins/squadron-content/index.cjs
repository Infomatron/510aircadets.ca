module.exports = function (context) {
  return {
    name: "squadron-content",
    getPathsToWatch() {
      return ["events", "announcements"].map(
        (kind) => `${context.siteDir}/content/${kind}/**/*`,
      );
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
