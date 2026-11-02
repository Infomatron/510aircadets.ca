export type EventCategory =
  | "training"
  | "marksmanship"
  | "band"
  | "choir"
  | "ground-school"
  | "ceremony"
  | "parade"
  | "field-training-exercise"
  | "special-event"
  | "biathlon";
export interface Category {
  id: EventCategory;
  label: string;
  short: string;
  symbol: string;
  color: string;
  background: string;
  paths: string[];
}
export const EVENT_CATEGORIES: Category[];
export const CATEGORY_BY_ID: Record<EventCategory, Category>;
export function calendarEntries<
  T extends { id: string; category: EventCategory },
>(entries: T[], limit?: number): { visible: T[]; more: number };
