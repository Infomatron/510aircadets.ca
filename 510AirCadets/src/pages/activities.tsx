import { ContentPage, ActivityCards } from "../components/Squadron";
export default function Page() {
  return (
    <ContentPage
      title={"Activities"}
      description={"Explore the activities offered by 510 Squadron."}
    >
      <h2>Skills, challenges and shared experiences</h2>
      <p>
        From aviation and outdoor skills to music and leadership, 510 Squadron
        offers opportunities to learn, work together and grow.
      </p>
      <ActivityCards />
      <p className="section-action">
        Activities and participation opportunities vary throughout the training
        year. <a href="/contact">Ask the squadron</a> about its current program.
      </p>
    </ContentPage>
  );
}
