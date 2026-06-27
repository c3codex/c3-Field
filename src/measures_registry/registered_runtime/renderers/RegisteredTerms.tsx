import type { CSSProperties, ReactNode } from "react"

type Props = {
  registryTokenStyle: CSSProperties
  renderHeader: () => ReactNode
  renderSystemFooter: () => ReactNode
}

const LEGAL_NAME = "C3 COMMUNITY PARTNERS DAO LLC"
const EFFECTIVE_DATE = "June 26, 2026"
const CONTACT_EMAIL = "connect@measuresregistry.com"

export default function RegisteredTerms({ registryTokenStyle, renderHeader, renderSystemFooter }: Props) {
  return (
    <main
      className="measures-registry-runtime"
      data-surface="terms"
      data-material-family="obsidian"
      data-layout-contract="legal_document"
      data-release-standing="public"
      style={registryTokenStyle}
    >
      {renderHeader()}
      <section className="registry-legal-document" aria-label="Terms of Use">
        <div className="registry-legal-document-body">
          <h1>Terms of Use</h1>
          <p className="registry-legal-effective">Effective {EFFECTIVE_DATE}</p>

          <h2>Legal Identity</h2>
          <p>
            Measures Registry is a registered branch of {LEGAL_NAME}, a member-managed decentralized organization
            legally formed and operating in the State of Tennessee as a Nonprofit Limited Liability Company and
            designated as a Decentralized Organization. Measures Registry is not a separate legal entity.
          </p>

          <h2>Informational Purpose</h2>
          <p>
            Measures Registry provides information, assessment tools, and publications related to AI operations and
            structural governance. Content on this platform is informational in nature and does not constitute
            professional legal, technical, financial, or compliance advice.
          </p>

          <h2>Assessment Results</h2>
          <p>
            Completion of an AI Operations Assessment returns an informational standing report based on your
            responses. Assessment results do not constitute a certification, credential, official standing, or
            professional opinion unless expressly confirmed in a separate written agreement.
          </p>

          <h2>No Professional Advice</h2>
          <p>
            Nothing on Measures Registry constitutes a professional endorsement, recommendation, or guarantee.
            Engagement with platform content, assessments, or publications does not create a professional relationship.
          </p>

          <h2>Payment Boundaries</h2>
          <p>
            MAP integrity governance engagement payments are for structured review and advisory services. Payments made
            through this platform are not contributions, investments, tax-deductible charitable contributions, or
            securities transactions unless expressly stated otherwise in a separate written agreement.
          </p>

          <h2>Contribution and DAO Participation</h2>
          <p>
            {LEGAL_NAME} may accept voluntary contributions and support for its public-benefit mission. Unless
            expressly stated otherwise, contributions to the organization are not represented as tax-deductible
            charitable contributions for federal income tax purposes. Contributions are intended to support the mission,
            activities, and operations of the organization and should not be construed as investments or expectations
            of financial return.
          </p>
          <p>
            Participation in {LEGAL_NAME} may differ materially from participation in other limited liability
            companies. The Articles of Organization, Operating Agreement, governance processes, and any applicable
            smart contracts may restrict withdrawal or resignation from the organization, the transfer of ownership
            interests, the return of capital contributions, or other rights associated with participation. No member,
            contributor, or participant should assume a right to the return of contributions, redemption of interests,
            or financial recovery except as expressly provided by applicable law or the governing documents of the
            organization.
          </p>
          <p>
            Participation in the organization should not be construed as an investment contract, security offering, or
            guarantee of financial return unless expressly stated in a separate written agreement approved under the
            governing documents of the organization.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            Content, structure, and materials on Measures Registry are the property of {LEGAL_NAME}. Reproduction,
            redistribution, or commercial use of platform content requires written permission.
          </p>

          <h2>Prohibited Use</h2>
          <p>
            You may not scrape, reverse engineer, reproduce, or redistribute Measures Registry content without
            permission. You may not use Measures Registry in a manner that implies affiliation, certification, or
            endorsement not expressly granted.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            Measures Registry and {LEGAL_NAME} are not liable for decisions made based on assessment results,
            publications, or platform content. Use of this platform is at your own discretion.
          </p>

          <h2>Changes to These Terms</h2>
          <p>
            These terms may be updated. Continued use of Measures Registry constitutes acceptance of the current
            terms. The effective date above reflects the most recent revision.
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
