import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  validateRecords,
  validDate,
  validTime,
  localInstant,
  localParts,
  classify,
  previews,
} from "../plugins/squadron-content/model.mjs";
import { loadContent } from "../plugins/squadron-content/load.mjs";
const event = (extra = {}) => ({
  id: "event-test",
  title: "Fictional fixture",
  date: "2027-01-19",
  startTime: "18:30",
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
const normalized = (e) => ({
  ...e,
  startsAt: localInstant(e.date, e.startTime),
  ...(e.endTime ? { endsAt: localInstant(e.date, e.endTime) } : {}),
});
const at = (date, time) => localInstant(date, time);

test("valid fields, references and length boundaries", () => {
  const e = event({ title: "x".repeat(120), description: "x".repeat(1000) });
  assert.deepEqual(
    validateRecords([
      record("events", e),
      record("announcements", announcement({ relatedEvent: e.id })),
    ]),
    [],
  );
});
for (const [field, value, match] of [
  ["title", "", /non-empty/],
  ["title", "x".repeat(121), /120/],
  ["date", "2027-02-30", /real date/],
  ["startTime", "25:00", /HH:mm/],
  ["status", "pending", /scheduled/],
  ["description", "<script>alert(1)</script>", /HTML/],
  ["unknown", "value", /unsupported/],
  ["id", "Not valid", /lowercase/],
])
  test(`reject event ${field}`, () =>
    assert.match(
      validateRecords([record("events", event({ [field]: value }))]).join("\n"),
      match,
    ));
test("required fields and non-object records fail helpfully", () => {
  const e = event();
  delete e.title;
  assert.match(
    validateRecords([record("events", e)]).join("\n"),
    /title: required/,
  );
  assert.match(
    validateRecords([{ kind: "events", file: "bad.json", data: [] }]).join(
      "\n",
    ),
    /bad.json.*JSON object/,
  );
});
test("filenames, duplicate identifiers and update dates", () => {
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
  for (const status of ["updated", "cancelled"])
    assert.match(
      validateRecords([record("events", event({ status }))]).join("\n"),
      /updatedDate: required/,
    );
});
test("time formats, real leap dates, same-day bounds", () => {
  assert.equal(validDate("2028-02-29"), true);
  assert.equal(validDate("2027-02-29"), false);
  assert.equal(validDate("2027-1-02"), false);
  assert.equal(validTime("9:30"), false);
  for (const endTime of ["18:30", "17:00"])
    assert.match(
      validateRecords([record("events", event({ endTime }))]).join("\n"),
      /later than/,
    );
});
test("announcement types, category, ordering and references", () => {
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
test("Newfoundland half-hour offsets and DST invalid/ambiguous times", () => {
  assert.equal(
    new Date(at("2027-01-19", "18:30")).toISOString(),
    "2027-01-19T22:00:00.000Z",
  );
  assert.equal(
    new Date(at("2027-07-19", "18:30")).toISOString(),
    "2027-07-19T21:00:00.000Z",
  );
  assert.throws(() => at("2027-03-14", "02:30"), /daylight-saving/);
  assert.throws(() => at("2027-11-07", "01:30"), /daylight-saving/);
  assert.match(
    validateRecords([
      record("events", event({ date: "2027-03-14", startTime: "02:30" })),
    ]).join("\n"),
    /startTime.*daylight-saving/,
  );
});
test("expiry is inclusive, future publications hidden and archive retained", () => {
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
  assert.equal(classify(c, at("2027-01-19", "23:59")).active.length, 1);
  const next = classify(c, at("2027-01-20", "00:00"));
  assert.deepEqual(
    next.active.map((x) => x.id),
    ["announcement-future"],
  );
  assert.equal(next.archive.length, 1);
});
test("events expire at end time or following local midnight, including cancellations", () => {
  for (const status of ["scheduled", "updated", "cancelled"]) {
    const c = {
      events: [
        normalized(event({ status, endTime: "20:00" })),
        normalized(event({ id: "event-no-end", status })),
      ],
      announcements: [],
    };
    assert.equal(classify(c, at("2027-01-19", "19:59")).events.length, 2);
    assert.equal(classify(c, at("2027-01-19", "20:00")).events.length, 1);
    assert.equal(classify(c, at("2027-01-20", "00:00")).events.length, 0);
    assert.equal(c.events.length, 2);
  }
});
test("chronology, newest notices and three-item previews", () => {
  const c = {
    events: [23, 21, 22, 20].map((day) =>
      normalized(event({ id: `event-${day}`, date: `2027-01-${day}` })),
    ),
    announcements: [15, 18, 16, 17].map((day) =>
      announcement({
        id: `announcement-${day}`,
        publicationDate: `2027-01-${day}`,
      }),
    ),
  };
  const p = previews(c, at("2027-01-19", "12:00"));
  assert.deepEqual(
    p.events.map((e) => e.id),
    ["event-20", "event-21", "event-22"],
  );
  assert.deepEqual(
    p.announcements.map((a) => a.id),
    ["announcement-18", "announcement-17", "announcement-16"],
  );
  assert.equal(
    localParts(Date.parse("2027-01-20T03:29:00Z")).date,
    "2027-01-19",
  );
});
test("empty content produces useful empty selections", () =>
  assert.deepEqual(
    classify({ events: [], announcements: [] }, at("2027-01-19", "12:00")),
    { events: [], active: [], archive: [] },
  ));
test("filesystem loader validates JSON, extension and cross-file references", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "510-content-"));
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
    assert.equal(c.events.length, 1);
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
