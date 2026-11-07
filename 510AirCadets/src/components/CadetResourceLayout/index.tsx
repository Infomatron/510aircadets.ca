import type { ReactNode } from "react";
import Link from "@docusaurus/Link";

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
          </li>
        </ul>
      </nav>
      <div className="cadet-resource-content">{children}</div>
    </div>
  );
}
