import { ContentPage, ActivityCards } from "../components/Squadron";
export default function Page() {
  return (
    <ContentPage
      title={"Activities"}
      description={
        "Discover local activities and broader opportunities within the Cadet Program."
      }
    >
      <h2>Skills, challenges and shared experiences</h2>
      <p>
        Band, biathlon and marksmanship appear in the public squadron listing.
        Aviation, leadership and field training below describe broader program
        opportunities; they are not a promise of current local availability.
      </p>
      <ActivityCards />
      <p className="section-action">
        Activities and participation opportunities vary.{" "}
        <a href="/contact">Ask the squadron</a> about its current program.
      </p>
    </ContentPage>
  );
}
