import { execFileSync } from "node:child_process";
import path from "node:path";

export function git(root, args) {
  return execFileSync("git", ["-C", root, ...args], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

export function assertHistory(root) {
  try {
    if (git(root, ["rev-parse", "--is-shallow-repository"]) !== "false")
      throw new Error("shallow checkout");
    git(root, ["rev-parse", "HEAD"]);
  } catch {
    throw new Error(
      "Page modification dates require a Git repository with full history. Use fetch-depth: 0 in CI and git fetch --unshallow for a shallow clone.",
    );
  }
}

export function commitDate(seconds) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/St_Johns",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(Number(seconds) * 1000));
  const field = (type) => parts.find((part) => part.type === type).value;
  return `${field("year")}-${field("month")}-${field("day")}`;
}

export function latestChange(root, sources, follow = false) {
  if (!sources.length) return 0;
  const timestamps = sources.map((source) => {
    if (!follow)
      return (
        Number(git(root, ["log", "-1", "--format=%ct", "--", source])) || 0
      );
    const history = git(root, [
      "log",
      "--follow",
      "--format=COMMIT:%ct",
      "--numstat",
      "--",
      source,
    ]);
    let timestamp = 0;
    for (const line of history.split("\n")) {
      if (line.startsWith("COMMIT:")) timestamp = Number(line.slice(7));
      const change = line.match(/^(\d+)\t(\d+)\t/);
      if (change && (Number(change[1]) > 0 || Number(change[2]) > 0))
        return timestamp;
    }
    return 0;
  });
  return Math.max(0, ...timestamps);
}

// Include deleted records and prior promotion/category values as well as current ones.
export function matchingChanges(root, directory, predicate) {
  const log = git(root, [
    "log",
    "--format=COMMIT:%H %ct",
    "--name-only",
    "--diff-filter=AMDR",
    "--",
    directory,
  ]);
  let revision;
  let timestamp = 0;
  let latest = 0;
  for (const line of log.split("\n")) {
    if (line.startsWith("COMMIT:")) {
      [revision, timestamp] = line.slice(7).split(" ");
      continue;
    }
    if (!line || Number(timestamp) <= latest) continue;
    for (const ref of [revision, revision + "^"]) {
      let text;
      try {
        text = git(root, ["show", `${ref}:${line}`]);
      } catch {
        continue;
      } // File creation/deletion has only one side.
      if (predicate(text)) {
        latest = Number(timestamp);
        break;
      }
    }
  }
  return latest;
}

export function normalizeRoute(route) {
  return route === "/" ? "/" : route.replace(/\/$/, "") + "/";
}

export function dependencies(route, sitePrefix) {
  const p = (relative) => sitePrefix + relative;
  const updateDir = p("src/pages/parents-guardians/support-committee/updates");
  const meetingsDir = p(
    "src/pages/parents-guardians/support-committee/meetings",
  );
  const directorySources = [];
  let calendar = false;
  let committeeEvents = false;
  if (["/", "/calendar/", "/calendar/archive/"].includes(route)) {
    directorySources.push(p("content/events"), p("content/announcements"));
    calendar = true;
  }
  if (
    [
      "/parents-guardians/support-committee/",
      "/parents-guardians/support-committee/updates/",
    ].includes(route)
  )
    directorySources.push(updateDir);
  if (route === "/parents-guardians/support-committee/meetings/")
    directorySources.push(meetingsDir);
  if (route === "/parents-guardians/support-committee/") committeeEvents = true;
  return { directorySources, calendar, committeeEvents, updateDir };
}

export async function buildManifest(siteDir, pages, ssc) {
  const { readFile } = await import("node:fs/promises");
  assertHistory(siteDir);
  const repoRoot = git(siteDir, ["rev-parse", "--show-toplevel"]);
  const prefix = path
    .relative(repoRoot, siteDir)
    .split(path.sep)
    .filter(Boolean)
    .join("/");
  const sitePrefix = prefix ? prefix + "/" : "";
  const promoted = matchingChanges(
    repoRoot,
    sitePrefix + "src/pages/parents-guardians/support-committee/updates",
    (text) => /^promoteToAnnouncements:\s*true\s*$/m.test(text),
  );
  const committeeEvents = matchingChanges(
    repoRoot,
    sitePrefix + "content/events",
    (text) =>
      /"category"\s*:\s*"(squadron-support-committee|parents-support-group)"/.test(
        text,
      ),
  );
  const result = {};
  for (const page of pages) {
    const source = page.source.replace(/^@site\//, "");
    const text = await readFile(path.join(siteDir, source), "utf8");
    // The site uses a shared component for static compatibility redirects.
    if (/<CompatibilityRoute\s/.test(text)) continue;
    const route = normalizeRoute(page.permalink);
    const sourcePath = sitePrefix + source;
    const own = latestChange(repoRoot, [sourcePath], true);
    if (!own) {
      console.warn(`Date Modified unavailable until first commit: ${source}`);
      result[route] = null;
      continue;
    }
    const deps = dependencies(route, sitePrefix);
    const timestamps = [own, latestChange(repoRoot, deps.directorySources)];
    if (deps.calendar) timestamps.push(promoted);
    if (deps.committeeEvents) timestamps.push(committeeEvents);
    const articles = [...ssc.updates, ...ssc.meetings];
    const article = articles.find((item) => item.url === route);
    if (article) {
      const related = articles.filter(
        (item) =>
          item.supersedes === article.slug || item.slug === article.supersedes,
      );
      for (const item of related) {
        const kind = ssc.updates.includes(item) ? "updates" : "meetings";
        timestamps.push(
          latestChange(
            repoRoot,
            [
              sitePrefix +
                `src/pages/parents-guardians/support-committee/${kind}/${item.slug}.mdx`,
            ],
            true,
          ),
        );
      }
    }
    result[route] = commitDate(Math.max(...timestamps));
  }
  return result;
}
