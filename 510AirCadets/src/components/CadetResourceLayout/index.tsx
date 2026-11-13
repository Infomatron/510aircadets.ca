import type { ReactNode } from "react";
import Link from "@docusaurus/Link";

export const uniformGuides = [
  { slug: "dress-standards", title: "Uniform dress standards" },
  { slug: "badge-placement", title: "Badge and patch placement" },
  { slug: "tie", title: "How to tie your C1 tie" },
  { slug: "boot-lacing", title: "How to lace your boots" },
];

export default function CadetResourceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="cadet-resource-layout">
      <nav className="cadet-resource-nav" aria-label="Cadet resources">
        <p>In this section</p>
        <ul>
          <li>
            <Link to="/cadets/" isNavLink exact>
              Cadets
            </Link>
          </li>
          <li>
            <Link to="/cadets/uniforms/" isNavLink exact>
              Uniforms
            </Link>
            <ul className="cadet-resource-subnav">
              {uniformGuides.map(({ slug, title }) => (
                <li key={slug}>
                  <Link to={`/cadets/uniforms/${slug}/`} isNavLink exact>
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
      <div className="cadet-resource-content">{children}</div>
    </div>
  );
}
