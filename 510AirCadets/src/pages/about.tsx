import { ContentPage, officialProgram } from "../components/Squadron";
export default function Page() {
  return (
    <ContentPage
      title={"About 510"}
      description={
        "A local connection to the Air Cadet Program in St. John's, Newfoundland and Labrador."
      }
    >
      <h2>510 St. John's Lions</h2>
      <p>
        510 St. John's Lions Royal Canadian Air Cadet Squadron brings a local
        identity to a national youth program. This website helps families
        explore the program and connect with the squadron.
      </p>
      <h2>Discover the Cadet Program</h2>
      <p>
        The program gives young people opportunities to develop leadership,
        teamwork and confidence. Visit the official program website for
        authoritative information about eligibility and opportunities.
      </p>
      <p>
        <a href={officialProgram}>Explore Cadets Canada</a>
      </p>
      <h2>About this independent website</h2>
      <p>
        This website is independently developed and maintained by a parent
        volunteer in support of 510 St. John's Lions Royal Canadian Air Cadet
        Squadron.
      </p>
      <p>
        It is not an official website of the Canadian Armed Forces, the
        Department of National Defence, or the Government of Canada. Information
        provided here is for general reference and may not reflect the latest
        official policies, schedules, or announcements.
      </p>
      <p>
        For authoritative information about the Cadet Program, please visit{" "}
        <a href={officialProgram}>Canada.ca</a>.
      </p>
    </ContentPage>
  );
}
