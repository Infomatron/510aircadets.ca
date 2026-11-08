import CadetResourceLayout from "../../components/CadetResourceLayout";
import Link from "@docusaurus/Link";
import { ContentPage, officialProgram } from "../../components/Squadron";

export default function Cadets() {
  return (
    <ContentPage
      title="Cadets"
      description="Find squadron resources and official references for cadets."
    >
      <CadetResourceLayout>
        <h2>Cadet resources</h2>
        <ul>
          <li>
            <Link to="/cadets/uniforms/">Uniforms</Link> — planned guides and
            official uniform references.
          </li>
        </ul>

        <h2>Official program and training references</h2>
        <p>
          Ask squadron staff for the current references and instructions that
          apply to your training. Follow official sources for program policies.
        </p>
        <ul>
          <li>
            <a href={officialProgram}>Cadets Canada</a>
          </li>
          <li>
            <a href="https://www.canada.ca/en/department-national-defence/services/cadets-junior-canadian-rangers/cjcr-policy/cjcr-dress-instructions/chapter-3/annex-b.html">
              Cadet ranks and insignia
            </a>
          </li>
          <li>
            <a href="https://www.canada.ca/en/department-national-defence/services/cadets-junior-canadian-rangers/cadets/resources-for-cadets.html">
              Official cadet resources and policies
            </a>
          </li>
        </ul>
        <p>
          <Link to="/parents/">Resources for parents and guardians</Link>
        </p>
      </CadetResourceLayout>
    </ContentPage>
  );
}
