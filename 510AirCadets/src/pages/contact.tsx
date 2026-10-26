import { ContentPage, registration } from "../components/Squadron";
export default function Page() {
  return (
    <ContentPage
      title={"Contact"}
      description={
        "Connect with 510 St. John\u2019s Lions through its public channels."
      }
    >
      <h2>Get in touch</h2>
      <p>
        The squadron's Linktree provides its published contact and registration
        links. You can also find its public social accounts below.
      </p>
      <ul>
        <li>
          <a href="https://linktr.ee/510stjohnslionsaircadets">
            Squadron Linktree and contact links
          </a>
        </li>
        <li>
          <a href="https://www.facebook.com/510Lions/">510 Lions on Facebook</a>
        </li>
        <li>
          <a href="https://www.instagram.com/510lions/">
            510 Lions on Instagram
          </a>
        </li>
      </ul>
      <h2>Planning to visit?</h2>
      <p>
        The squadron is based in St. John's, Newfoundland and Labrador. Confirm
        the current meeting location, parade times and visitor arrangements
        directly before attending.
      </p>
      <h2>Registration questions</h2>
      <p>
        Contact the squadron to confirm availability. Use the{" "}
        <a href={registration}>official registration service</a> for the
        registration process.
      </p>
    </ContentPage>
  );
}
