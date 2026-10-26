import {
  ContentPage,
  Action,
  RecruitmentInformation,
  officialProgram,
  registration,
} from "../components/Squadron";
export default function Page() {
  return (
    <ContentPage
      title="Interested in Joining 510 Air Cadets?"
      description="The squadron is currently at capacity. Prospective cadets can register their interest through the official Cadet Program registration service."
    >
      <RecruitmentInformation />
      <Action to={registration}>Register Your Interest</Action>
      <h2>Learn about the program</h2>
      <p>
        Read the{" "}
        <a href={officialProgram}>official Cadet Program information</a> with
        your parent or guardian for eligibility requirements and program
        details.
      </p>
      <h2>Before your first visit</h2>
      <p>
        <a href="/contact">Contact the squadron</a> about visitor arrangements
        and joining instructions before attending.
      </p>
      <h2>Frequently asked questions</h2>
      <details>
        <summary>Does this website collect registration information?</summary>
        <p>
          No. Registration takes place through the official Cadet Program
          registration service.
        </p>
      </details>
      <details>
        <summary>Does submitting the form guarantee a place?</summary>
        <p>
          No. Registration does not guarantee immediate enrollment. Applications
          and availability are managed by the squadron.
        </p>
      </details>
      <details>
        <summary>Can I attend a meeting before joining?</summary>
        <p>
          Contact the squadron to ask about visiting arrangements before
          attending.
        </p>
      </details>
    </ContentPage>
  );
}
