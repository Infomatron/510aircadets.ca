import { ContentPage } from "../components/Squadron";
import { CalendarContent } from "../components/Updates";
export default function Calendar() {
  return (
    <ContentPage
      title="Calendar & Announcements"
      description="Read current announcements first, then browse public squadron dates and select a day for event details."
    >
      <CalendarContent />
    </ContentPage>
  );
}
