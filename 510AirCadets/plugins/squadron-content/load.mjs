import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { validateRecords, localInstant } from "./model.mjs";
export async function loadContent(root, now = Date.now()) {
  const records = [],
    errors = [];
  for (const kind of ["events", "announcements"]) {
    const dir = path.join(root, "content", kind);
    for (const name of (await readdir(dir)).sort()) {
      if (name.startsWith(".")) continue;
      const file = `content/${kind}/${name}`;
      if (!name.endsWith(".json")) {
        errors.push(
          `${file}: filename: only .json content files are supported`,
        );
        continue;
      }
      try {
        records.push({
          kind,
          file,
          data: JSON.parse(await readFile(path.join(dir, name), "utf8")),
        });
      } catch (e) {
        errors.push(`${file}: JSON: ${e.message}; check quotes and commas`);
      }
    }
  }
  errors.push(...validateRecords(records));
  if (errors.length)
    throw new Error(`Content validation failed:\n${errors.join("\n")}`);
  return {
    builtAt: now,
    events: records
      .filter((r) => r.kind === "events")
      .map(({ data: e }) => ({
        ...e,
        startsAt: localInstant(e.date, e.startTime),
        ...(e.endTime ? { endsAt: localInstant(e.date, e.endTime) } : {}),
      })),
    announcements: records
      .filter((r) => r.kind === "announcements")
      .map((r) => r.data),
  };
}
