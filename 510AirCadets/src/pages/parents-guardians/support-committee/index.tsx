import { EventList, useContent } from "../../../components/Updates";
import { contactLinks } from "../../../contactLinks";
import Link from "@docusaurus/Link";
import { Action, ContentPage } from "../../../components/Squadron";
import {
  ParentsResourceLayout,
  SscListing,
  supportCommitteePath,
  useSsc,
} from "../../../components/SupportCommittee";

export default function SupportCommittee() {
  const { updates } = useSsc();
  const { events } = useContent();
  const committeeEvents = events.filter(
    (event) => event.category === "squadron-support-committee",
  );
  return (
    <ContentPage
      title="Squadron Support Committee"
      description="Public updates, meeting summaries and ways to support squadron activities."
    >
      <ParentsResourceLayout>
        <h2>About the Squadron Support Committee</h2>
        <p>
          This section brings together information cleared for public release
          about support from parents, guardians and volunteers for 510 Squadron
          activities.
        </p>
        <h2>Latest updates</h2>
        <SscListing
          articles={updates.slice(0, 3)}
          empty="No public SSC updates have been published yet."
        />
        <p>
          <Link to={supportCommitteePath + "updates/"}>
            Browse all SSC updates
          </Link>
        </p>
        <h2>Meetings and decisions</h2>
        <p>
          <Link to={supportCommitteePath + "meetings/"}>
            Browse public meeting summaries and decisions
          </Link>
        </p>
        <h2>Volunteer opportunities</h2>
        <p>
          Look for events labelled Squadron Support Committee in the squadron
          calendar.
        </p>
        {committeeEvents.length ? (
          <EventList events={committeeEvents.slice(0, 3)} preview />
        ) : (
          <p>No upcoming public SSC events are listed.</p>
        )}
        <Action to="/calendar" secondary>
          Open Calendar &amp; Announcements
        </Action>
        <h2>Get involved</h2>
        <p>
          Parents, guardians and other supporters can ask about participating
          through the committee contact form.
        </p>
        <Action to={contactLinks.committee} secondary>
          Contact the Squadron Support Committee (Google Form)
        </Action>
        <p>
          Please avoid sensitive personal information and confidential cadet
          records in this externally hosted form.
        </p>
      </ParentsResourceLayout>
    </ContentPage>
  );
}
