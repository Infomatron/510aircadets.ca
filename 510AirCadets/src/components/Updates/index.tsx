import { useEffect, useState } from "react";
import { usePluginData } from "@docusaurus/useGlobalData";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import Heading from "@theme/Heading";
import {
  classify,
  TIME_ZONE,
  type Content,
  type Event,
  type Announcement,
} from "../../../plugins/squadron-content/model.mjs";

function useContent() {
  const content = usePluginData("squadron-content") as Content;
  // Match generated HTML on first render, then classify with the visitor's clock.
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
  return { content, ...classify(content, now) };
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
        JavaScript is disabled. These lists reflect the site build on{" "}
        {dateLabel(
          new Intl.DateTimeFormat("en-CA", {
            timeZone: TIME_ZONE,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(new Date(builtAt)),
        )}
        . Check the dates below; active and expired lists update automatically
        when JavaScript is available.
      </p>
    </noscript>
  );
}
export function EventList({
  events,
  preview = false,
}: {
  events: Event[];
  preview?: boolean;
}) {
  if (!events.length)
    return (
      <p className="updates-empty">
        No upcoming public events are listed. Check back for updates.
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
            <Heading id={preview ? undefined : e.id} as={preview ? "h4" : "h2"}>
              {e.title}
            </Heading>
            <p>
              <time dateTime={new Date(e.startsAt).toISOString()}>
                {dateLabel(e.date)} · {e.startTime}
              </time>
              {e.endTime && (
                <>
                  –
                  <time dateTime={new Date(e.endsAt!).toISOString()}>
                    {e.endTime}
                  </time>
                </>
              )}{" "}
              <span>(Newfoundland time)</span>
            </p>
            {e.status === "cancelled" && (
              <p>
                <strong>This event has been cancelled.</strong>
              </p>
            )}
            {e.location && (
              <p>
                <strong>Location:</strong> {e.location}
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
        // A related past event stays accessible below the Events page's disclosure.
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
              <Heading as={preview ? "h4" : archived ? "h3" : "h2"}>
                {a.title}
              </Heading>
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
                  <Link to={`/events#${event.id}`}>
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
export function EventsContent() {
  const { content, events } = useContent();
  const { hash } = useLocation();
  const [pastExpanded, setPastExpanded] = useState(false);
  const past = content.events
    .filter((e) => !events.some((up) => up.id === e.id))
    .sort((a, b) => b.startsAt - a.startsAt);
  const targetIsPast = past.some((e) => `#${e.id}` === hash);
  useEffect(() => {
    if (targetIsPast) setPastExpanded(true);
  }, [hash, targetIsPast]);
  useEffect(() => {
    if (pastExpanded && targetIsPast) {
      const frame = requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView(),
      );
      return () => cancelAnimationFrame(frame);
    }
  }, [pastExpanded, targetIsPast, hash]);
  return (
    <>
      <p>
        All times are Newfoundland local time (America/St_Johns). Only
        information approved for public release is listed here.
      </p>
      <StaticNote builtAt={content.builtAt} />
      <EventList events={events} />
      {past.length > 0 && (
        <details
          open={pastExpanded}
          onToggle={(e) => setPastExpanded(e.currentTarget.open)}
        >
          <summary>Past public events</summary>
          <EventList events={past} />
        </details>
      )}
    </>
  );
}
export function AnnouncementsContent({
  archive = false,
}: {
  archive?: boolean;
}) {
  const { content, active, archive: expired } = useContent();
  const items = archive ? expired : active;
  const years = [...new Set(items.map((a) => a.publicationDate.slice(0, 4)))];
  return (
    <>
      <p>
        {archive
          ? "Expired notices are retained as a public record; they are not current instructions."
          : "Public notices and reminders. Publication and expiry dates use Newfoundland local time."}
      </p>
      <p>
        <Link to={archive ? "/announcements" : "/announcements/archive"}>
          {archive ? "View active announcements" : "View announcement archive"}
        </Link>
      </p>
      <StaticNote builtAt={content.builtAt} />
      {archive && items.length ? (
        years.map((year) => (
          <section key={year}>
            <Heading as="h2">{year}</Heading>
            <AnnouncementList
              items={items.filter((a) => a.publicationDate.startsWith(year))}
              events={content.events}
              archived
            />
          </section>
        ))
      ) : (
        <AnnouncementList
          items={items}
          events={content.events}
          archived={archive}
        />
      )}
    </>
  );
}
export function HomeUpdates() {
  const { content, events, active } = useContent();
  return (
    <section className="section container">
      <Heading as="h2">Squadron updates</Heading>
      <StaticNote builtAt={content.builtAt} />
      <div className="updates-columns">
        <div>
          <Heading as="h3">Upcoming events</Heading>
          <EventList events={events.slice(0, 3)} preview />
          <Link to="/events">View all public events</Link>
        </div>
        <div>
          <Heading as="h3">Recent announcements</Heading>
          <AnnouncementList
            items={active.slice(0, 3)}
            events={content.events}
            preview
          />
          <Link to="/announcements">View all announcements</Link>
        </div>
      </div>
    </section>
  );
}
