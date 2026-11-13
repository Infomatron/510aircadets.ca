import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import { usePluginData } from "@docusaurus/useGlobalData";
import ResourceLayout from "../ResourceLayout";
import { dateLabel } from "../Updates";
import type {
  Content,
  PsgArticle,
} from "../../../plugins/squadron-content/model.mjs";

export const supportGroupPath = "/parents/support-group/";

export function ParentsResourceLayout({ children }: { children: ReactNode }) {
  return (
    <ResourceLayout
      label="Parents resources"
      navigation={
        <ul>
          <li>
            <Link to="/parents/" isNavLink exact>
              Parents
            </Link>
          </li>
          <li>
            <Link to={supportGroupPath} isNavLink exact>
              Parents Support Group
            </Link>
            <ul className="cadet-resource-subnav">
              <li>
                <Link to={supportGroupPath + "updates/"} isNavLink>
                  Updates &amp; Announcements
                </Link>
              </li>
              <li>
                <Link to={supportGroupPath + "meetings/"} isNavLink>
                  Meetings &amp; Decisions
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      }
    >
      {children}
    </ResourceLayout>
  );
}

export function usePsg() {
  return (usePluginData("squadron-content") as Content).psg;
}

export function PsgListing({
  articles,
  empty,
}: {
  articles: PsgArticle[];
  empty?: string;
}) {
  if (!articles.length)
    return empty ? <p className="updates-empty">{empty}</p> : null;
  return (
    <ul className="updates-list">
      {articles.map((article) => (
        <li key={article.url} className="update-card">
          <h3>
            <Link to={article.url}>{article.title}</Link>
          </h3>
          <p className="update-meta">
            <time dateTime={article.date}>{dateLabel(article.date)}</time>
            {article.topic && <> · {article.topic}</>}
          </p>
          <p>{article.summary}</p>
        </li>
      ))}
    </ul>
  );
}

export function PsgArticleLayout({ children }: { children: ReactNode }) {
  const psg = usePsg();
  const { pathname } = useLocation();
  const route = pathname.replace(/\/?$/, "/");
  const articles = route.startsWith(supportGroupPath + "meetings/")
    ? psg.meetings
    : psg.updates;
  const article = articles.find((item) => item.url === route);
  if (!article) throw new Error(`Missing PSG metadata for ${pathname}`);
  const previous = articles.find((item) => item.slug === article.supersedes);
  const replacements = articles.filter(
    (item) => item.supersedes === article.slug,
  );
  return (
    <ParentsResourceLayout>
      <h1>{article.title}</h1>
      <p className="update-meta">
        <time dateTime={article.date}>{dateLabel(article.date)}</time>
        {article.topic && <> · {article.topic}</>}
        {article.updatedDate && (
          <>
            {" "}
            · Updated{" "}
            <time dateTime={article.updatedDate}>
              {dateLabel(article.updatedDate)}
            </time>
          </>
        )}
      </p>
      <p>{article.summary}</p>
      {previous && (
        <p>
          Supersedes <Link to={previous.url}>{previous.title}</Link>.
        </p>
      )}
      {replacements.map((replacement) => (
        <p key={replacement.url}>
          Superseded by <Link to={replacement.url}>{replacement.title}</Link>.
        </p>
      ))}
      {children}
    </ParentsResourceLayout>
  );
}
