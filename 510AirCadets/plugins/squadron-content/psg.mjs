import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_PARSE_FRONT_MATTER } from "@docusaurus/utils";
import { localParts, validDate } from "./model.mjs";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const psgRoot = "src/pages/parents/support-group";
const routeRoot = "/parents/support-group";

export async function loadPsg(root, now) {
  const lists = { updates: [], meetings: [] };
  const today = localParts(now).date;

  for (const kind of Object.keys(lists)) {
    const dir = path.join(root, psgRoot, kind);
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      continue;
    }

    for (const entry of entries) {
      const { name } = entry;
      if (name === "index.tsx") continue;
      const file = path.join(psgRoot, kind, name);
      const fail = (message) => {
        throw new Error(`${file}: ${message}`);
      };
      const slug = name.slice(0, -4);
      if (
        !entry.isFile() ||
        !name.endsWith(".mdx") ||
        !slugPattern.test(slug) ||
        slug === "index" ||
        slug.length > 70
      )
        fail("use a lowercase hyphenated .mdx filename of up to 70 characters");
      const { frontMatter: meta, content } = await DEFAULT_PARSE_FRONT_MATTER({
        fileContent: await readFile(path.join(dir, name), "utf8"),
        filePath: file,
      });
      const dateField = kind === "updates" ? "date" : "meetingDate";
      const allowed = [
        "title",
        dateField,
        "summary",
        "status",
        "topic",
        "updatedDate",
        "supersedes",
      ];
      if (kind === "updates")
        allowed.push("promoteToAnnouncements", "expiryDate");
      for (const key of Object.keys(meta)) {
        if (!allowed.includes(key)) fail(`${key} is unsupported`);
      }
      for (const [key, max] of [
        ["title", 120],
        ["summary", 500],
        ["topic", 80],
      ]) {
        if (
          meta[key] === undefined &&
          (key === "topic" || (key === "title" && kind === "meetings"))
        )
          continue;
        if (
          typeof meta[key] !== "string" ||
          !meta[key].trim() ||
          meta[key].length > max ||
          /[<>]/.test(meta[key])
        )
          fail(`${key} must be plain text (1–${max} characters)`);
      }
      const date = meta[dateField];
      if (!validDate(date) || date > today)
        fail(
          `${dateField} must be a quoted YYYY-MM-DD date on or before today in Newfoundland`,
        );
      if (meta.status !== "approved")
        fail("status must be approved for public release");
      if (!content) fail("article body is required");
      if (
        meta.updatedDate !== undefined &&
        (!validDate(meta.updatedDate) ||
          meta.updatedDate < date ||
          meta.updatedDate > today)
      )
        fail(
          "updatedDate must be a quoted date between the article date and today",
        );
      if (
        meta.promoteToAnnouncements !== undefined &&
        typeof meta.promoteToAnnouncements !== "boolean"
      )
        fail("promoteToAnnouncements must be true or false");
      if (
        meta.expiryDate !== undefined &&
        (!meta.promoteToAnnouncements ||
          !validDate(meta.expiryDate) ||
          meta.expiryDate < date)
      )
        fail(
          "expiryDate requires promotion and a quoted date on or after publication",
        );
      if (
        meta.supersedes !== undefined &&
        (typeof meta.supersedes !== "string" ||
          !slugPattern.test(meta.supersedes))
      )
        fail("supersedes must name an earlier article's filename without .mdx");

      lists[kind].push({
        ...meta,
        title: meta.title ?? `Meeting summary for ${date}`,
        date,
        slug,
        url: `${routeRoot}/${kind}/${slug}/`,
      });
    }

    for (const article of lists[kind]) {
      if (
        article.supersedes &&
        !lists[kind].some(
          (previous) =>
            previous.slug === article.supersedes &&
            previous.date < article.date,
        )
      )
        throw new Error(
          `${psgRoot}/${kind}/${article.slug}.mdx: supersedes must reference an existing earlier article in this section`,
        );
    }
    lists[kind].sort(
      (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
    );
  }
  return lists;
}

export function promotedAnnouncements(updates) {
  return updates
    .filter((article) => article.promoteToAnnouncements)
    .map((article) => ({
      id: `psg-update-${article.slug}`,
      title: article.title,
      message: article.summary,
      publicationDate: article.date,
      updatedDate: article.updatedDate,
      expiryDate: article.expiryDate,
      articleUrl: article.url,
    }));
}
