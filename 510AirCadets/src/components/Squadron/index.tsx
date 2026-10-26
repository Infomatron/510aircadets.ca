import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

export const officialProgram =
  "https://www.canada.ca/en/department-national-defence/services/cadets-junior-canadian-rangers/cadets.html";
export const registration =
  "https://registration.cadets.gc.ca/get-started.html?unitId=441";
export function Action({
  to,
  children,
  secondary = false,
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      className={`squadron-action${secondary ? " squadron-action--secondary" : ""}`}
      to={to}
    >
      {children}
    </Link>
  );
}
export function ContentPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Layout title={title} description={description}>
      <main id="main-content" className="content-page container">
        <p className="eyebrow">510 St. John's Lions</p>
        <Heading as="h1">{title}</Heading>
        <p className="page-intro">{description}</p>
        <div className="prose">{children}</div>
      </main>
    </Layout>
  );
}
export const activities = [
  {
    title: "Band",
    scope: "Publicly listed for 510",
    text: "Make music together and build confidence through practice and teamwork.",
  },
  {
    title: "Biathlon",
    scope: "Publicly listed for 510",
    text: "Discover a sport that combines endurance and precision.",
  },
  {
    title: "Marksmanship",
    scope: "Publicly listed for 510",
    text: "Develop concentration, discipline and precision in a supervised setting.",
  },
  {
    title: "Aviation",
    scope: "Air Cadet Program opportunity",
    text: "Explore the world of flight and learn more about aviation.",
  },
  {
    title: "Leadership",
    scope: "Cadet Program opportunity",
    text: "Build communication skills, take responsibility and help others succeed.",
  },
  {
    title: "Field training",
    scope: "Cadet Program opportunity",
    text: "Practise teamwork and outdoor skills through new challenges.",
  },
];
export function ActivityCards({
  limit = activities.length,
}: {
  limit?: number;
}) {
  return (
    <div className="card-grid">
      {activities.slice(0, limit).map((activity) => (
        <article className="activity-card" key={activity.title}>
          <p className="card-label">{activity.scope}</p>
          <Heading as="h3">{activity.title}</Heading>
          <p>{activity.text}</p>
        </article>
      ))}
    </div>
  );
}
