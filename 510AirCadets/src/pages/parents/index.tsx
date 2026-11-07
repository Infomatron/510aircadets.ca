import Link from "@docusaurus/Link";
import { Action, ContentPage, officialProgram } from "../../components/Squadron";

export default function Parents() {
  return (
    <ContentPage
      title="Parents"
      description="A starting point for parents and guardians looking for squadron updates and reliable program information."
    >
      <h2>Public events and announcements</h2>
      <p>
        Browse <Link to="/calendar">Calendar &amp; Announcements</Link> for
        approved public updates.
      </p>

      <h2>Meeting updates and joining instructions</h2>
      <p>
        Confirm schedules, required equipment and joining instructions through
        the communication channels provided directly by the squadron.
      </p>
      <p>
        This public website does not provide a private cadet portal or publish
        private schedules.
      </p>
      <Action to="/contact" secondary>
        Find squadron contact links
      </Action>

      <h2>Program resources</h2>
      <ul>
        <li>
          <a href={officialProgram}>Cadets Canada</a> for authoritative program
          information and official resources.
        </li>
        <li>
          <Link to="/cadets/">Cadet resources and uniform references</Link>
        </li>
      </ul>
    </ContentPage>
  );
}
