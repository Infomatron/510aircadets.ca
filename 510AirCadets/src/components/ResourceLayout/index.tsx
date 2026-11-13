import type { ReactNode } from "react";

export default function ResourceLayout({
  label,
  navigation,
  children,
}: {
  label: string;
  navigation: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="cadet-resource-layout">
      <nav className="cadet-resource-nav" aria-label={label}>
        <p>In this section</p>
        {navigation}
      </nav>
      <div className="cadet-resource-content">{children}</div>
    </div>
  );
}
