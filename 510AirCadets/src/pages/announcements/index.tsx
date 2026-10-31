import { ContentPage } from "../../components/Squadron";
import { AnnouncementsContent } from "../../components/Updates";
export default function Announcements() {
  return (
    <ContentPage
      title="Announcements"
      description="Public notices, reminders and schedule changes."
    >
      <AnnouncementsContent />
    </ContentPage>
  );
}
