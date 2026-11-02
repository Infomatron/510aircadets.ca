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
const record = (
  kind,
  data,
  file = `content/${kind}/2027/01/${data.id}.json`,
) => ({
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
test("valid filenames, duplicates and conditional update dates", () => {
  assert.match(
    validateRecords([
      record("events", event(), "content/events/2027/01/Wrong_name.json"),
    ]).join("\n"),
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
      await mkdir(path.join(root, "content", kind, "2027", "01"), {
        recursive: true,
      });
    await writeFile(
      path.join(root, "content/events/2027/01/event-test.json"),
      JSON.stringify(event()),
    );
    await writeFile(
      path.join(root, "content/announcements/2027/01/announcement-test.json"),
      JSON.stringify(announcement({ relatedEvent: "event-test" })),
    );
    const c = await loadContent(root, 123);
    assert.equal(c.builtAt, 123);
    assert.deepEqual(c.events, [event()]);
    await writeFile(
      path.join(root, "content/events/2027/01/event-bad.json"),
      "{ broken",
    );
    await writeFile(path.join(root, "content/events/2027/01/notes.txt"), "bad");
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

test("date-prefixed filenames need not equal stable identifiers", () => {
  assert.deepEqual(
    validateRecords([
      record(
        "events",
        event(),
        "content/events/2027/01/2027-01-19-fictional-event.json",
      ),
    ]),
    [],
  );
});
for (const folder of [
  "2027/1",
  "2027/00",
  "2027/13",
  "27/01",
  "2027/january",
  "2027/01/extra",
  "",
])
  test(`reject invalid content directory ${folder || "(flat)"}`, () => {
    assert.match(
      validateRecords([
        record(
          "events",
          event(),
          `content/events/${folder ? folder + "/" : ""}example.json`,
        ),
      ]).join("\n"),
      /directory: expected/,
    );
  });
test("directory follows event date or publication date, not announcement expiry", () => {
  assert.match(
    validateRecords([
      record("events", event(), "content/events/2027/02/example.json"),
    ]).join("\n"),
    /move this file to content\/events\/2027\/01/,
  );
  assert.deepEqual(
    validateRecords([
      record(
        "announcements",
        announcement({ expiryDate: "2027-03-01" }),
        "content/announcements/2027/01/2027-01-19-example.json",
      ),
    ]),
    [],
  );
  assert.match(
    validateRecords([
      record(
        "announcements",
        announcement(),
        "content/announcements/2027/03/example.json",
      ),
    ]).join("\n"),
    /match publicationDate/,
  );
});
test("duplicate ids are detected across years and months", () => {
  for (const kind of ["events", "announcements"]) {
    const a = kind === "events" ? event() : announcement();
    const b =
      kind === "events"
        ? event({ date: "2028-02-01" })
        : announcement({ publicationDate: "2028-02-01" });
    assert.match(
      validateRecords([
        record(kind, a, `content/${kind}/2027/01/first.json`),
        record(kind, b, `content/${kind}/2028/02/second.json`),
      ]).join("\n"),
      /duplicate identifier/,
    );
  }
});
test("recursive loading and rescheduling preserve ids, messages and references", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "510-organized-"));
  async function put(kind, relative, data) {
    const file = path.join(root, "content", kind, relative);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, JSON.stringify(data));
    return file;
  }
  try {
    const before = event();
    const source = await put(
      "events",
      "2027/01/2027-01-19-example.json",
      before,
    );
    const note = announcement({
      relatedEvent: before.id,
      expiryDate: "2027-02-28",
    });
    await put("announcements", "2027/01/2027-01-19-reminder.json", note);
    await put(
      "events",
      "2028/02/2028-02-29-leap.json",
      event({ id: "event-leap", date: "2028-02-29" }),
    );
    const loaded = await loadContent(root, 123);
    assert.equal(loaded.events.length, 2);
    assert.deepEqual(loaded.announcements, [note]);
    await rm(source);
    const after = {
      ...before,
      date: "2027-02-03",
      status: "updated",
      updatedDate: "2027-01-20",
    };
    await put("events", "2027/02/2027-02-03-example.json", after);
    const moved = await loadContent(root, 123);
    assert.deepEqual(
      moved.events.find((e) => e.id === before.id),
      after,
    );
    assert.equal(moved.announcements[0].relatedEvent, before.id);
    assert.equal(eventsOnDate(moved.events, "2027-01-19").length, 0);
    assert.equal(eventsOnDate(moved.events, "2027-02-03").length, 1);
    assert.equal(
      classify(moved, Date.parse("2027-03-01T15:00:00Z")).archive.length,
      1,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
test("loader reports invalid empty directories and legacy flat files", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "510-layout-invalid-"));
  try {
    await mkdir(path.join(root, "content/events/2027/1"), { recursive: true });
    await mkdir(path.join(root, "content/announcements/2027/01"), {
      recursive: true,
    });
    await writeFile(
      path.join(root, "content/events/event-test.json"),
      JSON.stringify(event()),
    );
    await assert.rejects(
      loadContent(root),
      (e) =>
        e.message.includes("expected a zero-padded month") &&
        e.message.includes("event-test.json: directory: expected"),
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
