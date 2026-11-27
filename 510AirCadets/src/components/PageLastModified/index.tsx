import { usePluginData } from "@docusaurus/useGlobalData";
import { useLocation } from "@docusaurus/router";

export default function PageLastModified() {
  const dates = usePluginData("page-modified") as Record<string, string | null>;
  const { pathname } = useLocation();
  const route = pathname === "/" ? "/" : pathname.replace(/\/$/, "") + "/";
  if (!(route in dates)) return null;
  return (
    <p className="page-last-modified container">
      Date Modified:{" "}
      {dates[route] ? (
        <time dateTime={dates[route]!}>{dates[route]}</time>
      ) : (
        "Awaiting first commit"
      )}
    </p>
  );
}
