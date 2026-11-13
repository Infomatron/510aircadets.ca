import type { EventCategory } from "./categories.mjs";
export interface Event {
  id: string;
  title: string;
  date: string;
  category: EventCategory;
  description?: string;
  status: "scheduled" | "updated" | "cancelled";
  updatedDate?: string;
}
export interface Announcement {
  articleUrl?: string;
  id: string;
  title: string;
  publicationDate: string;
  message: string;
  expiryDate?: string;
  relatedEvent?: string;
  category?: string;
  updatedDate?: string;
}
export interface PsgArticle {
  title: string;
  date: string;
  summary: string;
  slug: string;
  url: string;
  topic?: string;
  updatedDate?: string;
  supersedes?: string;
}
export interface Content {
  psg: { updates: PsgArticle[]; meetings: PsgArticle[] };
  builtAt: number;
  events: Event[];
  announcements: Announcement[];
}
export const TIME_ZONE: string;
export function classify(
  content: Content,
  now: number,
): { events: Event[]; active: Announcement[]; archive: Announcement[] };
export function previews(
  content: Content,
  now: number,
): { events: Event[]; announcements: Announcement[] };

export function localParts(now: number): { date: string };
export function validDate(value: unknown): boolean;
export function shiftMonth(
  year: number,
  month: number,
  delta: number,
): { year: number; month: number };
export function monthCells(year: number, month: number): (string | null)[];
export function moveDate(date: string, delta: number): string;
export function eventsOnDate(events: Event[], date: string): Event[];
