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
export const directions =
  "https://www.google.com/maps/search/?api=1&query=196%20Pennywell%20Road%2C%20St.%20John%27s%2C%20NL%20A1C%202L6";

export function ParadeInformation() {
  return (
    <>
      <p>
        510 St. John's Lions Royal Canadian Air Cadet Squadron meets Tuesdays
        from 18:30 to 21:30 at 196 Pennywell Road, St. John's, NL A1C 2L6.
      </p>
      <p>
        <strong>Parent Pickup:</strong> Parents and guardians should arrive by
        21:15 for pickup.
      </p>
      <p>
        Regular parade nights may be affected by holidays, special events or
        other schedule changes. Check squadron communications for updates.
      </p>
      <p>
        <a href={directions}>View Directions on Google Maps</a>
      </p>
    </>
  );
}

export function RecruitmentInformation() {
  return (
    <>
      <p>
        510 St. John's Lions Royal Canadian Air Cadet Squadron is currently at
        capacity. Prospective cadets can still register their interest in
        joining when a space becomes available.
      </p>
      <p>
        The Air Cadet Program is free and open to eligible youth aged 12–18.
      </p>
      <p>
        Complete the official Cadet Program registration form to begin the
        registration process.
      </p>
      <p>
        <strong>Please note:</strong> Registration does not guarantee immediate
        enrollment. Applications and availability are managed by the squadron.
      </p>
    </>
  );
}

export const activities = [
  {
    title: "Aviation",
    text: "Build aviation knowledge and explore opportunities to participate in aviation-related experiences.",
  },
  {
    title: "Outdoor & Field Training",
    text: "Develop outdoor skills, navigation and teamwork through field exercises.",
  },
  {
    title: "Marksmanship",
    text: "Practise safety, discipline and concentration through marksmanship training.",
  },
  { title: "Biathlon", text: "Combine physical endurance and marksmanship." },
  {
    title: "Band",
    text: "Make music together and develop teamwork through ceremonial participation.",
  },
  {
    title: "Leadership & Personal Development",
    text: "Develop leadership, citizenship and physical fitness while building confidence and growing as a person.",
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
          <p className="card-label">510 Squadron</p>
          <Heading as="h3">{activity.title}</Heading>
          <p>{activity.text}</p>
        </article>
      ))}
    </div>
  );
}
