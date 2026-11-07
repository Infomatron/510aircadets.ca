import {
  CategoryBadge,
  CategoryKey,
  CalendarCategoryLabels,
} from "./EventCategories";
import { CATEGORY_BY_ID } from "../../../plugins/squadron-content/categories.mjs";
import { useEffect, useState, useRef } from "react";
import { usePluginData } from "@docusaurus/useGlobalData";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import Head from "@docusaurus/Head";
import Heading from "@theme/Heading";
import {
  classify,
  localParts,
  validDate,
  shiftMonth,
  monthCells,
  moveDate,
  eventsOnDate,
  TIME_ZONE,
  type Content,
  type Event,
  type Announcement,
} from "../../../plugins/squadron-content/model.mjs";

function useContent() {
  const content = usePluginData("squadron-content") as Content;
  const [now, setNow] = useState(content.builtAt);
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const visible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    refresh();
    document.addEventListener("visibilitychange", visible);
    return () => document.removeEventListener("visibilitychange", visible);
  }, []);
  return { content, today: localParts(now).date, ...classify(content, now) };
}
export function dateLabel(date: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T12:00:00Z`));
}
function StaticNote({ builtAt }: { builtAt: number }) {
  return (
    <noscript>
      <p className="updates-note">
        JavaScript is disabled. This calendar and these lists reflect the build
        on {dateLabel(localParts(builtAt).date)}. Interactive date selection
        requires JavaScript; the public event list below remains available.
        Check the explicit dates.
      </p>
    </noscript>
  );
}
export function EventList({
  events,
  preview = false,
  archive = false,
}: {
  events: Event[];
  preview?: boolean;
  archive?: boolean;
}) {
  if (!events.length)
    return (
      <p className="updates-empty">
        {archive
          ? "No public events are listed for this date."
          : "No upcoming public events are listed. Check back for updates."}
      </p>
    );
  return (
    <ul className="updates-list">
      {events.map((e) => (
        <li key={e.id}>
          <article className={`update-card update-card--${e.status}`}>
            <p className="update-label">
              {e.status === "cancelled"
                ? "Cancelled"
                : e.status === "updated"
                  ? "Updated"
                  : "Scheduled"}
            </p>
            <Heading as={preview ? "h4" : "h3"}>{e.title}</Heading>
            <CategoryBadge category={e.category} />
            <p>
              <time dateTime={e.date}>{dateLabel(e.date)}</time>
            </p>
            {e.status === "cancelled" && (
              <p>
                <strong>This event has been cancelled.</strong>
              </p>
            )}
            {e.description && <p className="update-message">{e.description}</p>}
            {e.updatedDate && (
              <p className="update-meta">
                Updated{" "}
                <time dateTime={e.updatedDate}>{dateLabel(e.updatedDate)}</time>
              </p>
            )}
          </article>
        </li>
      ))}
    </ul>
  );
}
const categories: Record<string, string> = {
  general: "General",
  reminder: "Reminder",
  "schedule-change": "Schedule change",
  cancellation: "Cancellation",
};
export function AnnouncementList({
  items,
  events,
  archived = false,
  preview = false,
}: {
  items: Announcement[];
  events: Event[];
  archived?: boolean;
  preview?: boolean;
}) {
  if (!items.length)
    return (
      <p className="updates-empty">
        {archived
          ? "No archived announcements yet."
          : "No active public announcements. Check back for updates."}
      </p>
    );
  return (
    <ul className="updates-list">
      {items.map((a) => {
        const event = events.find((e) => e.id === a.relatedEvent);
        return (
          <li key={a.id}>
            <article
              id={a.id}
              className={`update-card update-card--${a.category || "general"}`}
            >
              <p className="update-label">
                {archived ? "Archived · " : ""}
                {categories[a.category || "general"]}
              </p>
              <Heading as={preview ? "h4" : "h3"}>{a.title}</Heading>
              <p className="update-meta">
                Published{" "}
                <time dateTime={a.publicationDate}>
                  {dateLabel(a.publicationDate)}
                </time>
                {a.updatedDate && (
                  <>
                    {" "}
                    · Updated{" "}
                    <time dateTime={a.updatedDate}>
                      {dateLabel(a.updatedDate)}
                    </time>
                  </>
                )}
              </p>
              <p className="update-message">{a.message}</p>
              {event && (
                <p>
                  <Link to={`/calendar?date=${event.date}#selected-events`}>
                    Related event: {event.title}
                  </Link>
                </p>
              )}
              {a.expiryDate && (
                <p className="update-meta">
                  {archived ? "Expired after" : "Active through"}{" "}
                  <time dateTime={a.expiryDate}>{dateLabel(a.expiryDate)}</time>
                </p>
              )}
            </article>
          </li>
        );
      })}
    </ul>
  );
}
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
function MonthlyCalendar({
  events,
  today,
}: {
  events: Event[];
  today: string;
}) {
  const [selected, setSelected] = useState(today);
  const [view, setView] = useState({
    year: Number(today.slice(0, 4)),
    month: Number(today.slice(5, 7)) - 1,
  });
  const [focused, setFocused] = useState(today);
  const touched = useRef(false);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const { search, hash } = useLocation();
  function select(date: string, focus = false) {
    touched.current = true;
    setSelected(date);
    setFocused(date);
    setView({
      year: Number(date.slice(0, 4)),
      month: Number(date.slice(5, 7)) - 1,
    });
    if (focus) requestAnimationFrame(() => buttons.current.get(date)?.focus());
  }
  useEffect(() => {
    if (!touched.current) {
      setSelected(today);
      setFocused(today);
      setView({
        year: Number(today.slice(0, 4)),
        month: Number(today.slice(5, 7)) - 1,
      });
    }
  }, [today]);
  useEffect(() => {
    const requested = new URLSearchParams(search).get("date");
    const legacy = events.find((e) => `#${e.id}` === hash);
    const date = requested && validDate(requested) ? requested : legacy?.date;
    if (date) {
      select(date);
      if (hash)
        requestAnimationFrame(() =>
          document.getElementById("selected-events")?.scrollIntoView(),
        );
    }
  }, [search, hash, events]);
  function navigate(year: number, month: number) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    select(date);
  }
  function shift(delta: number) {
    const next = shiftMonth(view.year, view.month, delta);
    navigate(next.year, next.month);
  }
  function keyboard(e: React.KeyboardEvent<HTMLButtonElement>, date: string) {
    let next: string | undefined;
    const offset = new Date(`${date}T12:00:00Z`).getUTCDay();
    if (e.key === "ArrowLeft") next = moveDate(date, -1);
    if (e.key === "ArrowRight") next = moveDate(date, 1);
    if (e.key === "ArrowUp") next = moveDate(date, -7);
    if (e.key === "ArrowDown") next = moveDate(date, 7);
    if (e.key === "Home") next = moveDate(date, -offset);
    if (e.key === "End") next = moveDate(date, 6 - offset);
    if (e.key === "PageUp" || e.key === "PageDown") {
      const n = shiftMonth(
        view.year,
        view.month,
        (e.key === "PageUp" ? -1 : 1) * (e.shiftKey ? 12 : 1),
      );
      const day = Math.min(
        Number(date.slice(8)),
        new Date(Date.UTC(n.year, n.month + 1, 0)).getUTCDate(),
      );
      next = `${n.year}-${String(n.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
    if (next) {
      e.preventDefault();
      setFocused(next);
      setView({
        year: Number(next.slice(0, 4)),
        month: Number(next.slice(5, 7)) - 1,
      });
      touched.current = true;
      requestAnimationFrame(() => buttons.current.get(next!)?.focus());
    }
  }
  const cells = monthCells(view.year, view.month);
  const count = events.filter((e) =>
    e.date.startsWith(
      `${view.year}-${String(view.month + 1).padStart(2, "0")}`,
    ),
  ).length;
  return (
    <section aria-labelledby="month-heading" className="calendar-panel">
      <div className="calendar-toolbar">
        <button
          type="button"
          onClick={() => shift(-1)}
          disabled={view.year === 2000 && view.month === 0}
          aria-label="Previous month"
        >
          ← Previous
        </button>
        <Heading as="h2" id="month-heading">
          <span aria-live="polite">
            {months[view.month]} {view.year}
          </span>
        </Heading>
        <button
          type="button"
          onClick={() => shift(1)}
          disabled={view.year === 2099 && view.month === 11}
          aria-label="Next month"
        >
          Next →
        </button>
      </div>
      <div className="calendar-selectors">
        <label>
          Month{" "}
          <select
            aria-label="Month"
            value={view.month}
            onChange={(e) => navigate(view.year, Number(e.target.value))}
          >
            {months.map((m, i) => (
              <option value={i} key={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label>
          Year{" "}
          <select
            aria-label="Year"
            value={view.year}
            onChange={(e) => navigate(Number(e.target.value), view.month)}
          >
            {Array.from({ length: 100 }, (_, i) => 2000 + i).map((y) => (
              <option value={y} key={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <button
          className="calendar-today"
          type="button"
          onClick={() => select(today)}
        >
          Today
        </button>
      </div>
      <p className="calendar-count" aria-live="polite">
        {count
          ? `${count} public ${count === 1 ? "event" : "events"} this month.`
          : "No public events listed this month."}
      </p>
      <table
        className="month-calendar"
        aria-labelledby="month-heading"
        aria-describedby="calendar-help"
      >
        <thead>
          <tr>
            {weekdays.map((day) => (
              <th scope="col" key={day}>
                <abbr title={day}>{day.slice(0, 3)}</abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: cells.length / 7 }, (_, week) => (
            <tr key={week}>
              {cells.slice(week * 7, week * 7 + 7).map((date, i) => {
                if (!date)
                  return <td key={`blank-${i}`} className="calendar-blank" />;
                const entries = eventsOnDate(events, date);
                const statuses = [
                  ...new Set(
                    entries
                      .filter((e) => e.status !== "scheduled")
                      .map((e) => e.status),
                  ),
                ];
                return (
                  <td key={date}>
                    <button
                      type="button"
                      ref={(el) => {
                        if (el) buttons.current.set(date, el);
                        else buttons.current.delete(date);
                      }}
                      tabIndex={date === focused ? 0 : -1}
                      aria-pressed={date === selected}
                      aria-current={date === today ? "date" : undefined}
                      aria-label={`${dateLabel(date)}; ${entries.length} ${entries.length === 1 ? "event" : "events"}${statuses.length ? `; ${statuses.join(", ")}` : ""}; ${entries.map((e) => `${CATEGORY_BY_ID[e.category].label}: ${e.title} (${e.status})`).join("; ")}`}
                      onClick={() => select(date)}
                      onKeyDown={(e) => keyboard(e, date)}
                      className={`calendar-day ${entries.length ? "calendar-day--events" : ""}`}
                    >
                      <span className="calendar-number">
                        {Number(date.slice(8))}
                      </span>
                      <CalendarCategoryLabels events={entries} />
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p id="calendar-help" className="updates-note">
        Select a date to view every event. Labels show event categories; +N more
        counts additional events, including repeated categories. Keyboard: arrow
        keys move between dates; Home/End move within a week; Page Up/Down
        change month (with Shift, year); Enter selects.
      </p>
      <section className="calendar-selection" aria-labelledby="selected-events">
        <Heading as="h2" id="selected-events">
          Events for {dateLabel(selected)}
        </Heading>
        <p className="visually-hidden" role="status">
          {eventsOnDate(events, selected).length} events on{" "}
          {dateLabel(selected)}
        </p>
        <EventList events={eventsOnDate(events, selected)} archive />
      </section>
      <CategoryKey />
    </section>
  );
}
export function CalendarContent() {
  const { content, today, active } = useContent();
  return (
    <>
      <StaticNote builtAt={content.builtAt} />
      <section
        className="calendar-announcements"
        aria-labelledby="announcements"
      >
        <Heading as="h2" id="announcements">
          Announcements
        </Heading>
        <p>
          Public notices and reminders, newest first. Publication and expiry
          dates use Newfoundland local dates.
        </p>
        <AnnouncementList items={active} events={content.events} />
        <Link to="/calendar/archive">View announcement archive</Link>
      </section>
      <MonthlyCalendar events={content.events} today={today} />
      <noscript>
        <section>
          <h2>Public event list</h2>
          <EventList
            events={[...content.events].sort(
              (a, b) =>
                a.date.localeCompare(b.date) || a.id.localeCompare(b.id),
            )}
            archive
          />
        </section>
      </noscript>
    </>
  );
}
export function AnnouncementsContent() {
  const { content, archive } = useContent();
  const years = [...new Set(archive.map((a) => a.publicationDate.slice(0, 4)))];
  return (
    <>
      <p>
        Expired notices are retained for reference and are not current
        instructions.
      </p>
      <Link to="/calendar#announcements">Back to Calendar & Announcements</Link>
      <StaticNote builtAt={content.builtAt} />
      {years.length ? (
        years.map((y) => (
          <section key={y}>
            <Heading as="h2">{y}</Heading>
            <AnnouncementList
              items={archive.filter((a) => a.publicationDate.startsWith(y))}
              events={content.events}
              archived
            />
          </section>
        ))
      ) : (
        <AnnouncementList items={[]} events={content.events} archived />
      )}
    </>
  );
}
export function HomeUpdates() {
  const { content, events, active } = useContent();
  return (
    <section className="section container">
      <Heading as="h2">Calendar & Announcements</Heading>
      <StaticNote builtAt={content.builtAt} />
      <div className="updates-columns">
        <div>
          <Heading as="h3">Upcoming events</Heading>
          <EventList events={events.slice(0, 3)} preview />
          <Link to="/calendar">View calendar</Link>
        </div>
        <div>
          <Heading as="h3">Recent announcements</Heading>
          <AnnouncementList
            items={active.slice(0, 3)}
            events={content.events}
            preview
          />
          <Link to="/calendar#announcements">View all announcements</Link>
        </div>
      </div>
    </section>
  );
}
export function CompatibilityRoute({
  target,
  label = "Calendar & Announcements",
}: {
  target: string;
  label?: string;
}) {
  useEffect(() => {
    window.location.replace(
      target + window.location.search + window.location.hash,
    );
  }, [target]);
  return (
    <>
      <Head>
        <meta httpEquiv="refresh" content={`0;url=${target}`} />
        <link rel="canonical" href={`https://510aircadets.ca${target}`} />
      </Head>
      <p>
        This page has moved.{" "}
        <Link to={target}>Continue to {label}</Link>.
      </p>
    </>
  );
}
