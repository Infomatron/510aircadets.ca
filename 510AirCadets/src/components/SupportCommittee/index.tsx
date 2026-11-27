import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import { usePluginData } from "@docusaurus/useGlobalData";
import ResourceLayout from "../ResourceLayout";
import { dateLabel } from "../Updates";
import type {
  Content,
  SscArticle,
} from "../../../plugins/squadron-content/model.mjs";

export const supportCommitteePath = "/parents-guardians/support-committee/";

export function ParentsResourceLayout({ children }: { children: ReactNode }) {
  return (
    <ResourceLayout
      label="Parent & Guardian Resources"
      navigation={
        <ul>
          <li>
            <Link to="/parents-guardians/" isNavLink exact>
              Parents &amp; Guardians
            </Link>
          </li>
          <li>
            <Link to={supportCommitteePath} isNavLink exact>
              Squadron Support Committee
            </Link>
            <ul className="cadet-resource-subnav">
              <li>
                <Link to={supportCommitteePath + "updates/"} isNavLink>
                  Updates &amp; Announcements
                </Link>
              </li>
              <li>
                <Link to={supportCommitteePath + "meetings/"} isNavLink>
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

export function useSsc() {
  return (usePluginData("squadron-content") as Content).ssc;
}

export function SscListing({
  articles,
  empty,
}: {
  articles: SscArticle[];
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
            {article.publicationDate && (
              <>
                {" "}
                · Published{" "}
                <time dateTime={article.publicationDate}>
                  {dateLabel(article.publicationDate)}
                </time>
              </>
            )}
            {article.topic && <> · {article.topic}</>}
          </p>
          <p>{article.summary}</p>
        </li>
      ))}
    </ul>
  );
}

export function SscArticleLayout({ children }: { children: ReactNode }) {
  const ssc = useSsc();
  const { pathname } = useLocation();
  const route = pathname.replace(/\/?$/, "/");
  const articles = route.startsWith(supportCommitteePath + "meetings/")
    ? ssc.meetings
    : ssc.updates;
  const article = articles.find((item) => item.url === route);
  if (!article) throw new Error(`Missing SSC metadata for ${pathname}`);
  const previous = articles.find((item) => item.slug === article.supersedes);
  const replacements = articles.filter(
    (item) => item.supersedes === article.slug,
  );
  return (
    <ParentsResourceLayout>
      <h1>{article.title}</h1>
      <p className="update-meta">
        <time dateTime={article.date}>{dateLabel(article.date)}</time>
        {article.publicationDate && (
          <>
            {" "}
            · Published{" "}
            <time dateTime={article.publicationDate}>
              {dateLabel(article.publicationDate)}
            </time>
          </>
        )}
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
