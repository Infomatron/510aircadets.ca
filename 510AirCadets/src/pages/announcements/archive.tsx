import { ContentPage } from "../../components/Squadron";
import { AnnouncementsContent } from "../../components/Updates";
export default function Archive() {
  return (
    <ContentPage
      title="Announcement archive"
      description="Past public announcements for reference."
    >
      <AnnouncementsContent archive />
    </ContentPage>
  );
}
