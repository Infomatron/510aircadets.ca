import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { validateRecords } from "./model.mjs";
export async function loadContent(root, now = Date.now()) {
  const records = [],
    errors = [];
  for (const kind of ["events", "announcements"]) {
    async function walk(parts = []) {
      const dir = path.join(root, "content", kind, ...parts);
      const entries = (await readdir(dir, { withFileTypes: true })).sort(
        (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0),
      );
      for (const entry of entries) {
        if (entry.name.startsWith(".")) continue;
        const relative = [...parts, entry.name];
        const file = ["content", kind, ...relative].join("/");
        if (entry.isDirectory()) {
          if (parts.length === 0 && !/^20\d{2}$/.test(entry.name))
            errors.push(
              `${file}: directory: expected a four-digit year, 2000–2099`,
            );
          if (parts.length === 1 && !/^(0[1-9]|1[0-2])$/.test(entry.name))
            errors.push(
              `${file}: directory: expected a zero-padded month, 01–12`,
            );
          if (parts.length >= 2)
            errors.push(
              `${file}: directory: extra nesting is unsupported; put JSON files directly under YYYY/MM`,
            );
          await walk(relative);
          continue;
        }
        if (!entry.isFile()) {
          errors.push(
            `${file}: file: symbolic links and special entries are unsupported`,
          );
          continue;
        }
        if (!entry.name.endsWith(".json")) {
          errors.push(
            `${file}: filename: only .json content files are supported`,
          );
          continue;
        }
        try {
          records.push({
            kind,
            file,
            data: JSON.parse(
              await readFile(path.join(dir, entry.name), "utf8"),
            ),
          });
        } catch (e) {
          errors.push(`${file}: JSON: ${e.message}; check quotes and commas`);
        }
      }
    }
    await walk();
  }
  errors.push(...validateRecords(records));
  if (errors.length)
    throw new Error(`Content validation failed:\n${errors.join("\n")}`);
  return {
    builtAt: now,
    events: records.filter((r) => r.kind === "events").map((r) => r.data),
    announcements: records
      .filter((r) => r.kind === "announcements")
      .map((r) => r.data),
  };
}
