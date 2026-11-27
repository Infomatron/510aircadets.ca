import { ContentPage } from "../../../../components/Squadron";
import {
  ParentsResourceLayout,
  SscListing,
  useSsc,
} from "../../../../components/SupportCommittee";

export default function Updates() {
  const { updates } = useSsc();
  return (
    <ContentPage
      title="Updates & Announcements"
      description="Public Squadron Support Committee articles, newest first."
    >
      <ParentsResourceLayout>
        <h2>Published updates</h2>
        <SscListing
          articles={updates}
          empty="No public SSC updates have been published yet."
        />
      </ParentsResourceLayout>
    </ContentPage>
  );
}
