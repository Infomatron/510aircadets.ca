import CadetResourceLayout from "../../../components/CadetResourceLayout";
import { ContentPage } from "../../../components/Squadron";

export default function Uniforms() {
  return (
    <ContentPage
      title="Uniforms"
      description="Find official uniform guidance and see which squadron guides are planned."
    >
      <CadetResourceLayout>
        <h2>Planned uniform guides</h2>
        <p>These squadron guides are planned and have not been published yet.</p>
        <ul>
          <li>Uniform dress standards</li>
          <li>Badge and patch placement</li>
          <li>How to tie a C1 tie</li>
          <li>How to lace boots</li>
        </ul>

        <h2>Official uniform guidance</h2>
        <p>
          Follow official dress guidance and ask squadron staff which current
          instructions apply to your uniform.
        </p>
        <ul>
          <li>
            <a href="https://www.canada.ca/en/department-national-defence/services/cadets-junior-canadian-rangers/cjcr-policy/cjcr-dress-instructions/chapter-3/annex-h.html">
              Official badge placement reference
            </a>
          </li>
        </ul>
      </CadetResourceLayout>
    </ContentPage>
  );
}
