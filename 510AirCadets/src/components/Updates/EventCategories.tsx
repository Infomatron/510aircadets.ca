import {
  CATEGORY_BY_ID,
  EVENT_CATEGORIES,
  calendarEntries,
  type EventCategory,
} from "../../../plugins/squadron-content/categories.mjs";
import type { Event } from "../../../plugins/squadron-content/model.mjs";

export function CategoryBadge({
  category,
  cell = false,
  status,
}: {
  category: EventCategory;
  cell?: boolean;
  status?: Event["status"];
}) {
  const c = CATEGORY_BY_ID[category];
  return (
    <span
      className={`event-category${cell ? " event-category--cell" : ""}`}
      style={{
        color: c.color,
        backgroundColor: c.background,
        borderColor: c.color,
      }}
    >
      <svg
        className="category-symbol"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        {c.paths.map((d, i) => (
          <path d={d} key={i} />
        ))}
      </svg>
      <span className="category-full-label">{c.label}</span>
      <span className="category-short-label">{c.short}</span>
      {cell && status && status !== "scheduled" && (
        <span className="category-cell-status">
          <span className="category-full-label">
            {status === "cancelled" ? "Cancelled" : "Updated"}
          </span>
          <span className="category-short-label">
            {status === "cancelled" ? "Cxl" : "Upd"}
          </span>
        </span>
      )}
    </span>
  );
}
export function CategoryKey() {
  return (
    <details className="category-key">
      <summary>Event category key</summary>
      <ul className="category-legend">
        {EVENT_CATEGORIES.map((c) => (
          <li key={c.id}>
            <CategoryBadge category={c.id} />
            <span className="category-key-short"> ({c.short})</span>
          </li>
        ))}
      </ul>
      <p>
        On narrow screens, category abbreviations appear in date cells. Cxl
        means Cancelled; Upd means Updated. Select a date for every event's full
        details.
      </p>
    </details>
  );
}
export function CalendarCategoryLabels({ events }: { events: Event[] }) {
  return (
    <>
      {[Infinity, 2].map((limit, i) => {
        const { visible, more } = calendarEntries(events, limit);
        return (
          <span
            key={i}
            className={`calendar-category-list calendar-category-list--${i === 0 ? "all" : "compact"}`}
            aria-hidden="true"
          >
            {visible.map((e) => (
              <CategoryBadge
                key={e.id}
                category={e.category}
                status={e.status}
                cell
              />
            ))}
            {more > 0 && (
              <span className="calendar-more">
                +{more}
                <span className="calendar-more-word"> more</span>
              </span>
            )}
          </span>
        );
      })}
    </>
  );
}
