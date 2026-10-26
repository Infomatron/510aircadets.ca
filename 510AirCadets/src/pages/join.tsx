import {
  ContentPage,
  officialProgram,
  registration,
} from "../components/Squadron";
export default function Page() {
  return (
    <ContentPage
      title={"Learn How to Join"}
      description={
        "Start with the program, confirm local availability, then use the official registration service."
      }
    >
      <h2>Who is the program for?</h2>
      <p>
        The Cadet Program is free for eligible youth aged 12–18. The official
        registration service explains the requirements and information needed to
        apply.
      </p>
      <h2>Your first steps</h2>
      <ol>
        <li>
          Read the{" "}
          <a href={officialProgram}>official Cadet Program information</a> with
          your parent or guardian.
        </li>
        <li>
          <a href="/contact">Contact the squadron</a> to confirm recruitment
          availability and visiting arrangements.
        </li>
        <li>
          Follow the{" "}
          <a href={registration}>official registration process for 510</a>.
        </li>
      </ol>
      <p>
        Contact the squadron about current availability before beginning
        registration.
      </p>
      <h2>Before your first visit</h2>
      <p>
        Confirm the meeting location, time and any joining instructions directly
        with the squadron.
      </p>
      <h2>Frequently asked questions</h2>
      <details>
        <summary>Does this website collect registration information?</summary>
        <p>
          No. Registration takes place through the official Cadets registration
          service.
        </p>
      </details>
      <details>
        <summary>Can I attend a meeting before joining?</summary>
        <p>
          Contact the squadron to ask about visiting arrangements before
          attending.
        </p>
      </details>
      <details>
        <summary>Where can I confirm eligibility?</summary>
        <p>
          Use the official program and registration links above for current
          requirements.
        </p>
      </details>
    </ContentPage>
  );
}
