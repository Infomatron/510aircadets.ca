import { ContentPage } from "../components/Squadron";
import { EventsContent } from "../components/Updates";
export default function Events() {
  return (
    <ContentPage
      title="Events"
      description="Upcoming public events for 510 St. John's Lions Air Cadets."
    >
      <EventsContent />
    </ContentPage>
  );
}
