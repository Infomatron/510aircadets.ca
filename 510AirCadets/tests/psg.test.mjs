import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  loadPsg,
  promotedAnnouncements,
  psgRoot,
} from "../plugins/squadron-content/psg.mjs";
import {
  classify,
  validateRecords,
} from "../plugins/squadron-content/model.mjs";
import {
  CATEGORY_BY_ID,
  calendarEntries,
} from "../plugins/squadron-content/categories.mjs";

const now = Date.parse("2026-11-13T17:00:00Z");
async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), "psg-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  return {
    root,
    async article(kind, slug, metadata) {
      const dir = path.join(root, psgRoot, kind);
      await mkdir(dir, { recursive: true });
      await writeFile(
        path.join(dir, slug + ".mdx"),
        `---\n${metadata}\n---\n\nFictional test body.\n`,
      );
    },
  };
}

test("approved PSG MDX lists sort newest first and derive stable routes from filenames", async (t) => {
  const f = await fixture(t);
  const common = "summary: Fictional fixture\nstatus: approved";
  await f.article(
    "updates",
    "older",
    `title: Older\ndate: "2026-11-09"\n${common}`,
  );
  await f.article(
    "updates",
    "newer",
    `title: Newer\ndate: "2026-11-11"\nsupersedes: older\n${common}`,
  );
  await f.article(
    "meetings",
    "first-meeting",
    `meetingDate: "2026-10-31"\n${common}`,
  );
  await f.article(
    "meetings",
    "second-meeting",
    `meetingDate: "2026-11-10"\n${common}`,
  );
  const { updates, meetings } = await loadPsg(f.root, now);
  assert.deepEqual(
    updates.map((item) => item.slug),
    ["newer", "older"],
  );
  assert.equal(updates[0].url, "/parents/support-group/updates/newer/");
  assert.equal(updates[0].supersedes, "older");
  assert.deepEqual(
    meetings.map((item) => item.slug),
    ["second-meeting", "first-meeting"],
  );
  assert.equal(meetings[0].title, "Meeting summary for 2026-11-10");
});

test("promotion is opt-in and uses the normal Newfoundland date and expiry rules", async (t) => {
  const f = await fixture(t);
  const common =
    'date: "2026-11-13"\nsummary: Fictional fixture\nstatus: approved';
  await f.article(
    "updates",
    "private-to-listing",
    `title: Listing only\n${common}`,
  );
  await f.article(
    "updates",
    "explicit-no",
    `title: No promotion\npromoteToAnnouncements: false\n${common}`,
  );
  await f.article(
    "updates",
    "promoted",
    `title: Promoted\npromoteToAnnouncements: true\nexpiryDate: "2026-11-13"\n${common}`,
  );
  const { updates } = await loadPsg(f.root, now);
  assert.equal(updates.length, 3);
  const announcements = promotedAnnouncements(updates);
  assert.equal(announcements.length, 1);
  assert.equal(
    announcements[0].articleUrl,
    "/parents/support-group/updates/promoted/",
  );
  const existing = {
    id: "announcement-existing",
    title: "Existing",
    publicationDate: "2026-11-12",
    message: "Existing notice",
  };
  const content = { events: [], announcements: [existing, ...announcements] };
  assert.deepEqual(
    classify(content, now).active.map((a) => a.id),
    ["psg-update-promoted", existing.id],
  );
  assert.equal(
    classify(content, Date.parse("2026-11-13T03:29:59Z")).active.length,
    1,
  );
  const nextDay = classify(content, Date.parse("2026-11-14T03:30:00Z"));
  assert.deepEqual(nextDay.active, [existing]);
  assert.equal(nextDay.archive[0].id, "psg-update-promoted");
});

for (const [label, metadata, error] of [
  [
    "missing title",
    'date: "2026-11-12"\nsummary: Example\nstatus: approved',
    /title must/,
  ],
  [
    "invalid date",
    'title: Example\ndate: "2026-02-30"\nsummary: Example\nstatus: approved',
    /date must/,
  ],
  [
    "future date",
    'title: Example\ndate: "2026-11-14"\nsummary: Example\nstatus: approved',
    /date must/,
  ],
  [
    "draft",
    'title: Example\ndate: "2026-11-12"\nsummary: Example\nstatus: draft',
    /status must be approved/,
  ],
  [
    "invalid flag",
    'title: Example\ndate: "2026-11-12"\nsummary: Example\nstatus: approved\npromoteToAnnouncements: "true"',
    /must be true or false/,
  ],
  [
    "missing predecessor",
    'title: Example\ndate: "2026-11-12"\nsummary: Example\nstatus: approved\nsupersedes: missing',
    /existing earlier article/,
  ],
  [
    "route override",
    'title: Example\ndate: "2026-11-12"\nsummary: Example\nstatus: approved\nslug: /elsewhere',
    /slug is unsupported/,
  ],
]) {
  test(`reject PSG metadata with ${label}`, async (t) => {
    const f = await fixture(t);
    await f.article("updates", "example", metadata);
    await assert.rejects(loadPsg(f.root, now), error);
  });
}

test("PSG events retain shared schema and calendar category presentation", () => {
  const event = {
    id: "event-psg-test",
    title: "Fictional",
    date: "2026-11-13",
    status: "scheduled",
    category: "parents-support-group",
  };
  const file = "content/events/2026/11/2026-11-13-psg-test.json";
  assert.deepEqual(
    validateRecords([{ kind: "events", file, data: event }]),
    [],
  );
  assert.match(
    validateRecords([
      { kind: "events", file, data: { ...event, startTime: "18:00" } },
    ]).join("\n"),
    /unsupported field/,
  );
  const [visible] = calendarEntries([event]).visible;
  assert.equal(CATEGORY_BY_ID[visible.category].label, "Parents Support Group");
  assert.equal(CATEGORY_BY_ID[visible.category].short, "PSG");
});
