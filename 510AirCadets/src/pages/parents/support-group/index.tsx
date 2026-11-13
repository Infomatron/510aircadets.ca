import Link from "@docusaurus/Link";
import { Action, ContentPage } from "../../../components/Squadron";
import {
  ParentsResourceLayout,
  PsgListing,
  supportGroupPath,
  usePsg,
} from "../../../components/ParentsSupportGroup";

export default function SupportGroup() {
  const { updates } = usePsg();
  return (
    <ContentPage
      title="Parents Support Group"
      description="Public updates, meeting summaries and ways to support squadron activities."
    >
      <ParentsResourceLayout>
        <h2>About the Parents Support Group</h2>
        <p>
          This section brings together information cleared for public release
          about parent support for 510 Squadron activities.
        </p>
        <h2>Latest updates</h2>
        <PsgListing
          articles={updates.slice(0, 3)}
          empty="No public PSG updates have been published yet."
        />
        <p>
          <Link to={supportGroupPath + "updates/"}>Browse all PSG updates</Link>
        </p>
        <h2>Meetings and decisions</h2>
        <p>
          <Link to={supportGroupPath + "meetings/"}>
            Browse public meeting summaries and decisions
          </Link>
        </p>
        <h2>Volunteer opportunities</h2>
        <p>
          Look for events labelled Parents Support Group in the squadron
          calendar.
        </p>
        <Action to="/calendar" secondary>
          Open Calendar &amp; Announcements
        </Action>
        <h2>Get involved</h2>
        <p>
          Use the <Link to="/contact">published squadron contact links</Link> to
          ask about getting involved.
        </p>
      </ParentsResourceLayout>
    </ContentPage>
  );
}
