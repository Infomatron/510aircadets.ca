import { ContentPage } from "../../../../components/Squadron";
import {
  ParentsResourceLayout,
  PsgListing,
  usePsg,
} from "../../../../components/ParentsSupportGroup";

export default function Meetings() {
  const { meetings } = usePsg();
  const years = [
    ...new Set(meetings.map((meeting) => meeting.date.slice(0, 4))),
  ];
  return (
    <ContentPage
      title="Meetings & Decisions"
      description="Approved public summaries of Parents Support Group meetings."
    >
      <ParentsResourceLayout>
        {years.length ? (
          years.map((year) => (
            <section key={year} aria-labelledby={`meetings-${year}`}>
              <h2 id={`meetings-${year}`}>{year}</h2>
              <PsgListing
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
