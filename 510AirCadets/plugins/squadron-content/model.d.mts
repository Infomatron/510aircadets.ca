export interface Event {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  description?: string;
  status: "scheduled" | "updated" | "cancelled";
  updatedDate?: string;
  startsAt: number;
  endsAt?: number;
}
export interface Announcement {
  id: string;
  title: string;
  publicationDate: string;
  message: string;
  expiryDate?: string;
  relatedEvent?: string;
  category?: string;
  updatedDate?: string;
}
export interface Content {
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
