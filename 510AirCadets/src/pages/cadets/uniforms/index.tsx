import Link from "@docusaurus/Link";
import CadetResourceLayout, {
  uniformGuides,
} from "../../../components/CadetResourceLayout";
import { ContentPage } from "../../../components/Squadron";

export default function Uniforms() {
  return (
    <ContentPage
      title="Uniforms"
      description="Find official uniform guidance and draft squadron guides."
    >
      <CadetResourceLayout>
        <h2>Draft uniform guides</h2>
        <p>These guides are awaiting Commanding Officer review.</p>
        <ul>
          {uniformGuides.map(({ slug, title }) => (
            <li key={slug}>
              <Link to={`/cadets/uniforms/${slug}/`}>{title}</Link>
            </li>
          ))}
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
