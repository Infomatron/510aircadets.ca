import { ContentPage } from "../components/Squadron";
import { CalendarContent } from "../components/Updates";
export default function Calendar() {
  return (
    <ContentPage
      title="Calendar & Announcements"
      description="Public squadron dates and announcements. Select a date to see its events, then find current notices below the calendar."
    >
      <CalendarContent />
    </ContentPage>
  );
}
