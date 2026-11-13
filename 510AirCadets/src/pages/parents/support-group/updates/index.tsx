import { ContentPage } from "../../../../components/Squadron";
import {
  ParentsResourceLayout,
  PsgListing,
  usePsg,
} from "../../../../components/ParentsSupportGroup";

export default function Updates() {
  const { updates } = usePsg();
  return (
    <ContentPage
      title="Updates & Announcements"
      description="Public Parents Support Group articles, newest first."
    >
      <ParentsResourceLayout>
        <h2>Published updates</h2>
        <PsgListing
          articles={updates}
          empty="No public PSG updates have been published yet."
        />
      </ParentsResourceLayout>
    </ContentPage>
  );
}
