import type { CSSProperties, ReactNode } from "react"

type Props = {
  registryTokenStyle: CSSProperties
  renderHeader: () => ReactNode
  renderSystemFooter: () => ReactNode
}

const LEGAL_NAME = "C3 COMMUNITY PARTNERS DAO LLC"
const EFFECTIVE_DATE = "June 26, 2026"
const CONTACT_EMAIL = "connect@measuresregistry.com"

export default function RegisteredPrivacy({ registryTokenStyle, renderHeader, renderSystemFooter }: Props) {
  return (
    <main
      className="measures-registry-runtime"
      data-surface="privacy"
      data-material-family="obsidian"
      data-layout-contract="legal_document"
      data-release-standing="public"
      style={registryTokenStyle}
    >
      {renderHeader()}
      <section className="registry-legal-document" aria-label="Privacy Policy">
        <div className="registry-legal-document-body">
          <h1>Privacy Policy</h1>
          <p className="registry-legal-effective">Effective {EFFECTIVE_DATE}</p>

          <h2>Who We Are</h2>
          <p>
            Measures Registry is operated by {LEGAL_NAME}, a member-managed decentralized organization legally formed
            and operating in the State of Tennessee as a Nonprofit Limited Liability Company and designated as a
            Decentralized Organization. Measures Registry is a registered branch of {LEGAL_NAME} and is not a separate
            legal entity.
          </p>
          <p>
            Contact: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>

          <h2>Information We Collect</h2>
          <p>
            When you complete an AI Operations Assessment, we collect: organization name, contact name, role title,
            email address, website, AI deployment status, and your assessment responses.
          </p>
          <p>
            When you submit a contact or connection form, we collect: name, organization name, email address, and any
            message you provide.
          </p>
          <p>
            We collect email communication consent preferences when you indicate whether you consent to receiving
            communications.
          </p>

          <h2>How We Use Assessment Information</h2>
          <p>
            Assessment information is used to generate and deliver your AI operations assessment result. Contact
            information provided during an assessment is used to deliver your result when consent is given and to
            communicate about Measures Registry when communications consent is given.
          </p>

          <h2>How We Use Contact Form Information</h2>
          <p>
            Contact form submissions are used to respond to your connection request and to communicate about Measures
            Registry when consent is given.
          </p>

          <h2>Email Communications</h2>
          <p>
            Email communications are sent only when you have given explicit consent. To request removal from
            communications, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>

          <h2>Third-Party Services</h2>
          <p>Measures Registry uses the following third-party services to operate the platform:</p>
          <ul>
            <li>
              <strong>Supabase</strong> — Data storage and infrastructure (United States)
            </li>
            <li>
              <strong>Paragraph</strong> — Publication platform
            </li>
            <li>
              <strong>Buffer</strong> — Social content distribution
            </li>
          </ul>

          <h2>Analytics and Cookies</h2>
          <p>
            Measures Registry does not use tracking cookies or analytics services that collect personally identifiable
            information at this time.
          </p>

          <h2>Data Retention</h2>
          <p>
            Assessment and contact data are retained as long as necessary to deliver services and fulfill operational
            obligations. You may request deletion at any time.
          </p>

          <h2>Your Rights</h2>
          <p>
            You have the right to request access to, correction of, or deletion of your data. To exercise these rights,
            email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>

          <h2>Legal Standing</h2>
          <p>
            References to nonprofit status describe the Company's state-organized legal structure and public-benefit
            mission and should not be construed as a representation of federal tax-exempt status under Section
            501(c)(3) of the Internal Revenue Code unless expressly stated otherwise.
          </p>
          <p>
            {LEGAL_NAME} may accept voluntary contributions and support for its public-benefit mission. Unless
            expressly stated otherwise, contributions to the organization are not represented as tax-deductible
            charitable contributions for federal income tax purposes. Contributions are intended to support the mission,
            activities, and operations of the organization and should not be construed as investments or expectations
            of financial return.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            This policy may be updated. Continued use of Measures Registry constitutes acceptance of the current
            policy. The effective date above reflects the most recent revision.
          </p>

          <h2>Contact</h2>
          <p>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </div>
      </section>
      {renderSystemFooter()}
    </main>
  )
}
