import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { Action, ActivityCards } from "../components/Squadron";

export default function Home() {
  const crest = useBaseUrl("/img/squadron-crest.png");
  return (
    <Layout
      title="Welcome"
      description="Discover 510 St. John's Lions Air Cadets in Newfoundland and Labrador. Explore the program, activities and information for families."
    >
      <main id="main-content">
        <section className="home-hero">
          <div className="container hero-grid">
            <div>
              <p className="eyebrow">St. John's, Newfoundland & Labrador</p>
              <Heading as="h1">
                Your next adventure
                <br />
                starts here.
              </Heading>
              <p className="hero-identity">510 St. John's Lions Air Cadets</p>
              <p className="hero-copy">
                New experiences. Lasting friendships. Room to grow. Discover a
                youth program built around teamwork, leadership and a curiosity
                for flight.
              </p>
              <div className="actions">
                <Action to="/join">Learn How to Join</Action>
                <Action to="/activities" secondary>
                  Explore Activities
                </Action>
              </div>
            </div>
            <div className="hero-emblem">
              <img
                src={crest}
                alt="510 St. John's Lions squadron crest"
                width="220"
                height="220"
              />
              <p>510 ST. JOHN'S LIONS</p>
              <span>Royal Canadian Air Cadet Squadron</span>
            </div>
          </div>
        </section>
        <section className="section container">
          <p className="eyebrow">More than a weekly activity</p>
          <Heading as="h2">Why join Air Cadets?</Heading>
          <p className="section-intro">
            Find your strengths, try something new and be part of a team.
          </p>
          <div className="benefit-grid">
            <div>
              <Heading as="h3">Grow your confidence</Heading>
              <p>
                Practise leadership, communicate with others and learn by taking
                on new challenges.
              </p>
            </div>
            <div>
              <Heading as="h3">Find your people</Heading>
              <p>
                Build friendships through shared experiences and a sense of
                belonging.
              </p>
            </div>
            <div>
              <Heading as="h3">Broaden your horizons</Heading>
              <p>
                Explore aviation, develop useful skills and discover interests
                you can carry forward.
              </p>
            </div>
          </div>
        </section>
        <section className="section section-tinted">
          <div className="container">
            <p className="eyebrow">Learn by doing</p>
            <Heading as="h2">Explore the possibilities</Heading>
            <p className="section-intro">
              Band, biathlon and marksmanship are publicly listed for 510.
              Current activity availability should be confirmed with the
              squadron.
            </p>
            <ActivityCards limit={3} />
            <div className="section-action">
              <Action to="/activities" secondary>
                See program activities
              </Action>
            </div>
          </div>
        </section>
        <section className="section container">
          <div className="join-panel">
            <div>
              <p className="eyebrow">A place to begin</p>
              <Heading as="h2">Join 510 Squadron</Heading>
              <p>
                The Cadet Program is free for eligible youth aged 12–18. Learn
                about the process and use the official registration service.
              </p>
              <p>
                Contact the squadron to confirm current availability before
                making plans to attend.
              </p>
            </div>
            <Action to="/join">Learn How to Join</Action>
          </div>
        </section>
        <section className="section container information-grid">
          <div>
            <p className="eyebrow">Plan your first visit</p>
            <Heading as="h2">Meet your local squadron</Heading>
            <p>
              Based in St. John's, Newfoundland and Labrador. Please confirm
              meeting times, location and visitor arrangements directly with the
              squadron before attending.
            </p>
            <Action to="/contact" secondary>
              Contact & social links
            </Action>
          </div>
          <div className="resource-panel">
            <p className="eyebrow">Already a cadet?</p>
            <Heading as="h2">Your next useful link</Heading>
            <p>
              Find official program information and a starting point for cadets,
              parents and guardians.
            </p>
            <Action to="/parents-cadets" secondary>
              Parents & Cadets resources
            </Action>
          </div>
        </section>
      </main>
    </Layout>
  );
}
