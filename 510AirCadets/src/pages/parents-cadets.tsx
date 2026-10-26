import { ContentPage, Action, officialProgram } from "../components/Squadron";
export default function Page() {
  return (
    <ContentPage
      title={"Parents & Cadets"}
      description={
        "A starting point for families looking for reliable program information."
      }
    >
      <h2>Official information</h2>
      <p>
        Use <a href={officialProgram}>Cadets Canada</a> for authoritative
        program information and links to official resources.
      </p>
      <h2>Useful official resources</h2>
      <ul>
        <li>
          <a href="https://www.canada.ca/en/department-national-defence/services/cadets-junior-canadian-rangers/cjcr-policy/cjcr-dress-instructions/chapter-3/annex-b.html">
            Cadet ranks and insignia
          </a>
        </li>
        <li>
          <a href="https://www.canada.ca/en/department-national-defence/services/cadets-junior-canadian-rangers/cjcr-policy/cjcr-dress-instructions/chapter-3/annex-h.html">
            Badge placement
          </a>
        </li>
        <li>
          <a href="https://www.canada.ca/en/department-national-defence/services/cadets-junior-canadian-rangers/cadets/resources-for-cadets.html">
            Official cadet resources and policies
          </a>
        </li>
      </ul>
      <h2>Uniforms, ranks and training</h2>
      <p>
        Ask squadron staff for the current official references and instructions
        that apply to your cadet. Follow official sources for dress guidance,
        training material and program policies.
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
    </ContentPage>
  );
}
