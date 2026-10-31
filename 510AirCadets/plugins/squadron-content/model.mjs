export const TIME_ZONE = "America/St_Johns";
const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
export function localParts(now) {
  const p = Object.fromEntries(
    formatter.formatToParts(new Date(now)).map((x) => [x.type, x.value]),
  );
  return {
    date: `${p.year}-${p.month}-${p.day}`,
    time: `${p.hour}:${p.minute}`,
  };
}
export function validDate(s) {
  return (
    typeof s === "string" &&
    /^20\d{2}-\d{2}-\d{2}$/.test(s) &&
    !Number.isNaN(Date.parse(s)) &&
    new Date(`${s}T00:00:00Z`).toISOString().slice(0, 10) === s
  );
}
export function validTime(s) {
  return typeof s === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(s);
}
const cache = new Map();
export function localInstant(date, time) {
  const key = `${date}T${time}`;
  if (cache.has(key)) return cache.get(key);
  const nominal = Date.parse(`${key}:00Z`);
  const matches = [150, 210]
    .map((offset) => nominal + offset * 60000)
    .filter((ms) => {
      const p = localParts(ms);
      return p.date === date && p.time === time;
    });
  if (matches.length !== 1)
    throw new Error(
      "use an unambiguous, existing Newfoundland local time (daylight-saving transition)",
    );
  cache.set(key, matches[0]);
  return matches[0];
}
export function validateRecords(records) {
  const errors = [],
    ids = new Set();
  for (const { kind, file, data: d } of records) {
    const fail = (field, text) => errors.push(`${file}: ${field}: ${text}`);
    if (!d || typeof d !== "object" || Array.isArray(d)) {
      fail("record", "expected a JSON object");
      continue;
    }
    const event = kind === "events";
    const required = event
      ? ["id", "title", "date", "startTime", "status"]
      : ["id", "title", "publicationDate", "message"];
    const allowed = new Set([
      ...required,
      ...(event
        ? ["endTime", "location", "description", "updatedDate"]
        : ["expiryDate", "relatedEvent", "category", "updatedDate"]),
    ]);
    for (const key of Object.keys(d))
      if (!allowed.has(key)) fail(key, "unsupported field; remove it");
    for (const key of required)
      if (!(key in d)) fail(key, "required field is missing");
    for (const [key, value] of Object.entries(d)) {
      if (typeof value !== "string" || !value.trim()) {
        fail(key, "expected a non-empty string; omit unused optional fields");
        continue;
      }
      const max = ["message", "description"].includes(key)
        ? 1000
        : key === "title"
          ? 120
          : key === "location"
            ? 200
            : 100;
      if (value.length > max) fail(key, `must be at most ${max} characters`);
      if (/<\/?[a-z!][^>]*>/i.test(value))
        fail(key, "raw HTML is not supported; use plain text");
    }
    if (typeof d.id === "string") {
      if (
        !new RegExp(
          `^${event ? "event" : "announcement"}-[a-z0-9]+(?:-[a-z0-9]+)*$`,
        ).test(d.id)
      )
        fail(
          "id",
          `use ${event ? "event" : "announcement"}- followed by lowercase words separated by hyphens`,
        );
      if (file.split("/").pop() !== `${d.id}.json`)
        fail("id", "must match the filename without .json");
      if (ids.has(d.id)) fail("id", "duplicate identifier");
      ids.add(d.id);
    }
    for (const field of event
      ? ["date", "updatedDate"]
      : ["publicationDate", "expiryDate", "updatedDate"])
      if (field in d && !validDate(d[field]))
        fail(
          field,
          "expected a real date in YYYY-MM-DD format, years 2000–2099",
        );
    if (event) {
      if (!["scheduled", "updated", "cancelled"].includes(d.status))
        fail("status", "expected scheduled, updated or cancelled");
      if (["updated", "cancelled"].includes(d.status) && !d.updatedDate)
        fail("updatedDate", "required for updated or cancelled events");
      for (const field of ["startTime", "endTime"])
        if (field in d) {
          if (!validTime(d[field]))
            fail(field, "expected HH:mm in 24-hour time");
          else if (validDate(d.date))
            try {
              localInstant(d.date, d[field]);
            } catch (e) {
              fail(field, e.message);
            }
        }
      if (
        validTime(d.startTime) &&
        validTime(d.endTime) &&
        d.endTime <= d.startTime
      )
        fail("endTime", "must be later than startTime on the same date");
    } else {
      if (
        "category" in d &&
        !["general", "reminder", "schedule-change", "cancellation"].includes(
          d.category,
        )
      )
        fail(
          "category",
          "expected general, reminder, schedule-change or cancellation",
        );
      if (
        validDate(d.expiryDate) &&
        validDate(d.publicationDate) &&
        d.expiryDate < d.publicationDate
      )
        fail("expiryDate", "must be on or after publicationDate");
      if (
        validDate(d.updatedDate) &&
        validDate(d.publicationDate) &&
        d.updatedDate < d.publicationDate
      )
        fail("updatedDate", "must be on or after publicationDate");
    }
  }
  const events = new Set(
    records.filter((r) => r.kind === "events").map((r) => r.data?.id),
  );
  for (const r of records)
    if (
      r.kind === "announcements" &&
      r.data?.relatedEvent &&
      !events.has(r.data.relatedEvent)
    )
      errors.push(
        `${r.file}: relatedEvent: must reference an existing event id`,
      );
  return errors;
}
export function classify(content, now) {
  const today = localParts(now).date;
  const events = content.events
    .filter((e) => (e.endTime ? now < e.endsAt : e.date >= today))
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        a.startTime.localeCompare(b.startTime) ||
        a.id.localeCompare(b.id),
    );
  const published = content.announcements
    .filter((a) => a.publicationDate <= today)
    .sort(
      (a, b) =>
        b.publicationDate.localeCompare(a.publicationDate) ||
        a.id.localeCompare(b.id),
    );
  return {
    events,
    active: published.filter((a) => !a.expiryDate || a.expiryDate >= today),
    archive: published.filter((a) => a.expiryDate && a.expiryDate < today),
  };
}
export function previews(content, now) {
  const c = classify(content, now);
  return { events: c.events.slice(0, 3), announcements: c.active.slice(0, 3) };
}
