import { ContentPage } from "../../../../components/Squadron";
import {
  ParentsResourceLayout,
  SscListing,
  useSsc,
} from "../../../../components/SupportCommittee";

export default function Meetings() {
  const { meetings } = useSsc();
  const years = [
    ...new Set(meetings.map((meeting) => meeting.date.slice(0, 4))),
  ];
  return (
    <ContentPage
      title="Meetings & Decisions"
      description="Approved public summaries of Squadron Support Committee meetings."
    >
      <ParentsResourceLayout>
        {years.length ? (
          years.map((year) => (
            <section key={year} aria-labelledby={`meetings-${year}`}>
              <h2 id={`meetings-${year}`}>{year}</h2>
              <SscListing
                articles={meetings.filter((meeting) =>
                  meeting.date.startsWith(year),
                )}
              />
            </section>
          ))
        ) : (
          <p className="updates-empty">
            No public meeting summaries have been published yet.
          </p>
        )}
      </ParentsResourceLayout>
    </ContentPage>
  );
}
