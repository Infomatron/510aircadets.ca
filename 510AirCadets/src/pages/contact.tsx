import {
  ContentPage,
  ParadeInformation,
  Action,
  registration,
} from "../components/Squadron";
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
      <h2>Parade Nights</h2>
      <ParadeInformation />
      <p>
        Please contact the squadron about visitor arrangements before attending
        for the first time.
      </p>
      <h2>Interested in joining?</h2>
      <p>
        The squadron is currently at capacity. Prospective cadets can register
        their interest through the official registration service. Registration
        does not guarantee immediate enrollment. Applications and availability
        are managed by the squadron.
      </p>
      <Action to={registration}>Register Your Interest</Action>
    </ContentPage>
  );
}
