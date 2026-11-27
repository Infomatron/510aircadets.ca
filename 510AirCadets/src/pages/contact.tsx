import { contactLinks } from "../contactLinks";
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
      <h2>Official Squadron Enquiries</h2>
      <p>
        For questions about cadet enrolment, training, attendance, uniforms or
        official squadron activities, please contact the squadron directly.
      </p>
      <p>
        The squadron's Linktree provides its published contact and registration
        links.
      </p>
      <ul>
        <li>
          <a href="https://linktr.ee/510stjohnslionsaircadets">
            Squadron Linktree and contact links
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/510lions/">
            510 Lions on Instagram
          </a>
        </li>
      </ul>
      <h2>Squadron Support Committee</h2>
      <p>
        For questions about volunteering, fundraising, committee activities or
        supporting the squadron, use our contact form.
      </p>
      <Action to={contactLinks.committee} secondary>
        Contact the Squadron Support Committee (Google Form)
      </Action>
      <h2>Website Enquiries</h2>
      <p>
        For corrections, technical issues or suggestions for this website, use
        our contact form.
      </p>
      <Action to={contactLinks.website} secondary>
        Contact the Website Team (Google Form)
      </Action>
      <p>
        The form is hosted by Google. Please avoid sensitive personal
        information and confidential cadet records. For emergencies or official
        incident reports, use the appropriate official channels.
      </p>
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
