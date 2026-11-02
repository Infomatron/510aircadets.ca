import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  validateRecords,
  validDate,
  localParts,
  classify,
  previews,
  shiftMonth,
  monthCells,
  moveDate,
  eventsOnDate,
} from "../plugins/squadron-content/model.mjs";
import { loadContent } from "../plugins/squadron-content/load.mjs";
const event = (extra = {}) => ({
  id: "event-test",
  title: "Fictional fixture",
  date: "2027-01-19",
  status: "scheduled",
  ...extra,
});
const announcement = (extra = {}) => ({
  id: "announcement-test",
  title: "Fixture",
  publicationDate: "2027-01-19",
  message: "Fictional test only.",
  ...extra,
});
const record = (kind, data, file = `content/${kind}/${data.id}.json`) => ({
  kind,
  data,
  file,
});
const now = Date.parse("2027-01-19T15:00:00Z");

test("valid revised schema, references and text limits", () =>
  assert.deepEqual(
    validateRecords([
      record(
        "events",
        event({ title: "x".repeat(120), description: "x".repeat(1000) }),
      ),
      record("announcements", announcement({ relatedEvent: "event-test" })),
    ]),
    [],
  ));
for (const field of ["startTime", "endTime", "location", "duration"])
  test(`removed event field ${field} is rejected`, () =>
    assert.match(
      validateRecords([
        record("events", event({ [field]: "not allowed" })),
      ]).join("\n"),
      new RegExp(`${field}: unsupported field`),
    ));
for (const [field, value, match] of [
  ["title", "", /non-empty/],
  ["title", "x".repeat(121), /120/],
  ["date", "2027-02-30", /real date/],
  ["status", "pending", /scheduled/],
  ["description", "<script>alert(1)</script>", /HTML/],
  ["unknown", "value", /unsupported/],
  ["id", "Not valid", /lowercase/],
])
  test(`reject invalid ${field}`, () =>
    assert.match(
      validateRecords([record("events", event({ [field]: value }))]).join("\n"),
      match,
    ));
test("missing required fields and non-objects fail by file and field", () => {
  for (const kind of ["events", "announcements"])
    for (const field of kind === "events"
      ? ["id", "title", "date", "status"]
      : ["id", "title", "publicationDate", "message"]) {
      const d = kind === "events" ? event() : announcement();
      delete d[field];
      assert.match(
        validateRecords([record(kind, d, "fixture.json")]).join("\n"),
        new RegExp(`fixture.json: ${field}: required`),
      );
    }
  assert.match(
    validateRecords([{ kind: "events", file: "bad.json", data: [] }]).join(
      "\n",
    ),
    /bad.json.*JSON object/,
  );
});
test("stable filenames, duplicates and conditional update dates", () => {
  assert.match(
    validateRecords([record("events", event(), "wrong.json")]).join("\n"),
    /filename/,
  );
  assert.match(
    validateRecords([
      record("events", event()),
      record("events", event()),
    ]).join("\n"),
    /duplicate/,
  );
  for (const status of ["updated", "cancelled"]) {
    assert.match(
      validateRecords([record("events", event({ status }))]).join("\n"),
      /updatedDate: required/,
    );
    assert.deepEqual(
      validateRecords([
        record("events", event({ status, updatedDate: "2027-01-18" })),
      ]),
      [],
    );
  }
});
test("real dates and leap years", () => {
  assert.equal(validDate("2028-02-29"), true);
  assert.equal(validDate("2027-02-29"), false);
  assert.equal(validDate("2027-1-02"), false);
  assert.equal(validDate("2100-01-01"), false);
  assert.equal(monthCells(2028, 1).filter(Boolean).length, 29);
  assert.equal(monthCells(2027, 1).filter(Boolean).length, 28);
});
test("month grid has seven columns with correct blank cells", () => {
  const cells = monthCells(2027, 0);
  assert.equal(cells.length % 7, 0);
  assert.equal(cells[0], null);
  assert.equal(cells[5], "2027-01-01");
  assert.equal(cells.filter(Boolean).length, 31);
});
test("previous/next month and direct year boundaries", () => {
  assert.deepEqual(shiftMonth(2027, 11, 1), { year: 2028, month: 0 });
  assert.deepEqual(shiftMonth(2027, 0, -1), { year: 2026, month: 11 });
  assert.deepEqual(shiftMonth(2000, 0, -1), { year: 2000, month: 0 });
  assert.deepEqual(shiftMonth(2099, 11, 1), { year: 2099, month: 11 });
  assert.equal(monthCells(2032, 1).filter(Boolean).length, 29);
});
test("keyboard date movement crosses months, leap days and years", () => {
  assert.equal(moveDate("2028-02-28", 1), "2028-02-29");
  assert.equal(moveDate("2028-02-29", 1), "2028-03-01");
  assert.equal(moveDate("2027-12-31", 1), "2028-01-01");
  assert.equal(moveDate("2027-01-01", -7), "2026-12-25");
  assert.equal(moveDate("2000-01-01", -1), "2000-01-01");
  assert.equal(moveDate("2099-12-31", 1), "2099-12-31");
});
test("date selection returns multiple entries with all statuses and no unrelated entries", () => {
  const entries = ["scheduled", "updated", "cancelled"].map((status) =>
    event({ id: `event-${status}`, status }),
  );
  entries.push(event({ id: "event-other", date: "2027-01-20" }));
  assert.deepEqual(
    eventsOnDate(entries, "2027-01-19").map((e) => e.status),
    ["cancelled", "scheduled", "updated"],
  );
  assert.deepEqual(eventsOnDate(entries, "2027-02-01"), []);
});
test("announcements validate categories, date order and references", () => {
  for (const extra of [
    { category: "urgent" },
    { expiryDate: "2027-01-18" },
    { updatedDate: "2027-01-18" },
    { relatedEvent: "event-missing" },
    { message: 42 },
    { message: "<b>raw</b>" },
  ])
    assert.ok(
      validateRecords([record("announcements", announcement(extra))]).length,
    );
});
test("expiry inclusive at Newfoundland midnight and future publication hidden", () => {
  const c = {
    events: [],
    announcements: [
      announcement({ expiryDate: "2027-01-19" }),
      announcement({
        id: "announcement-future",
        publicationDate: "2027-01-20",
      }),
    ],
  };
  assert.equal(
    classify(c, Date.parse("2027-01-20T03:29:59Z")).active.length,
    1,
  );
  const next = classify(c, Date.parse("2027-01-20T03:30:00Z"));
  assert.deepEqual(
    next.active.map((x) => x.id),
    ["announcement-future"],
  );
  assert.equal(next.archive.length, 1);
});
test("local dates follow Newfoundland DST offsets without event clocks", () => {
  assert.equal(
    localParts(Date.parse("2027-01-20T03:29:00Z")).date,
    "2027-01-19",
  );
  assert.equal(
    localParts(Date.parse("2027-07-20T02:29:00Z")).date,
    "2027-07-19",
  );
  assert.equal(
    localParts(Date.parse("2027-07-20T02:30:00Z")).date,
    "2027-07-20",
  );
});
test("all statuses remain upcoming through their local date and stay in original records", () => {
  const c = {
    events: ["scheduled", "updated", "cancelled"].map((status) =>
      event({ id: `event-${status}`, status }),
    ),
    announcements: [],
  };
  assert.equal(
    classify(c, Date.parse("2027-01-20T03:29:59Z")).events.length,
    3,
  );
  assert.equal(
    classify(c, Date.parse("2027-01-20T03:30:00Z")).events.length,
    0,
  );
  assert.equal(c.events.length, 3);
});
test("chronological ordering, newest notices and three-item previews", () => {
  const c = {
    events: [23, 21, 22, 20].map((day) =>
      event({ id: `event-${day}`, date: `2027-01-${day}` }),
    ),
    announcements: [15, 18, 16, 17].map((day) =>
      announcement({
        id: `announcement-${day}`,
        publicationDate: `2027-01-${day}`,
      }),
    ),
  };
  const p = previews(c, now);
  assert.deepEqual(
    p.events.map((e) => e.id),
    ["event-20", "event-21", "event-22"],
  );
  assert.deepEqual(
    p.announcements.map((a) => a.id),
    ["announcement-18", "announcement-17", "announcement-16"],
  );
});
test("empty content", () =>
  assert.deepEqual(classify({ events: [], announcements: [] }, now), {
    events: [],
    active: [],
    archive: [],
  }));
test("loader validates files and returns only the revised event schema", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "510-calendar-"));
  try {
    for (const kind of ["events", "announcements"])
      await mkdir(path.join(root, "content", kind), { recursive: true });
    await writeFile(
      path.join(root, "content/events/event-test.json"),
      JSON.stringify(event()),
    );
    await writeFile(
      path.join(root, "content/announcements/announcement-test.json"),
      JSON.stringify(announcement({ relatedEvent: "event-test" })),
    );
    const c = await loadContent(root, 123);
    assert.equal(c.builtAt, 123);
    assert.deepEqual(c.events, [event()]);
    await writeFile(
      path.join(root, "content/events/event-bad.json"),
      "{ broken",
    );
    await writeFile(path.join(root, "content/events/notes.txt"), "bad");
    await assert.rejects(
      loadContent(root),
      (e) =>
        e.message.includes("event-bad.json: JSON:") &&
        e.message.includes("notes.txt: filename:"),
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
