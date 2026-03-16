import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GDPR Compliance for Developers: A Practical Guide",
  description:
    "A practical GDPR guide for developers building SaaS applications. Covers data processing, consent, user rights, sub-processors, DPAs, and actionable steps your engineering team can take today.",
  alternates: {
    canonical: "https://codepliant.dev/blog/gdpr-for-developers",
  },
  openGraph: {
    title: "GDPR Compliance for Developers: A Practical Guide",
    description:
      "Everything developers need to know about GDPR compliance. Practical, code-focused guidance for SaaS engineering teams.",
    url: "https://codepliant.dev/blog/gdpr-for-developers",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GDPR Compliance for Developers: A Practical Guide",
    description:
      "Developer GDPR guide covering data processing, consent, user rights, and practical compliance steps for SaaS teams.",
    images: ["/og-image.png"],
  },
};

function articleJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "GDPR Compliance for Developers: A Practical Guide",
    description:
      "A practical GDPR guide for developers building SaaS applications. Covers data processing, consent, user rights, sub-processors, DPAs, and actionable steps.",
    datePublished: "2026-03-16",
    dateModified: "2026-03-16",
    author: {
      "@type": "Organization",
      name: "Codepliant",
      url: "https://codepliant.dev",
    },
    publisher: {
      "@type": "Organization",
      name: "Codepliant",
      url: "https://codepliant.dev",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://codepliant.dev/blog/gdpr-for-developers",
    },
  };
}

export default function GdprForDevelopers() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd()) }}
      />

      <article className="py-20 px-6">
        <div className="max-w-[680px] mx-auto">
          <p className="text-sm font-medium text-accent mb-4 tracking-wide uppercase">
            Blog
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            GDPR Compliance for Developers: A Practical Guide
          </h1>
          <p className="text-sm text-muted mb-12">
            Published March 16, 2026 &middot; 15 min read
          </p>

          <div className="prose-custom space-y-6 text-base text-muted leading-relaxed">
            {/* Introduction */}
            <p>
              GDPR has been in effect since May 2018, yet most developers still
              treat it as a legal problem rather than an engineering one. That
              is a mistake. The majority of GDPR obligations &mdash; consent
              management, data minimization, right to erasure, breach
              notification &mdash; are implemented in code. Your legal team
              writes the policies. Your engineering team makes them real.
            </p>
            <p>
              This guide is written for developers who build SaaS applications.
              It skips the legal theory and focuses on what you need to
              understand, what you need to build, and what you can automate.
              Whether you are retrofitting GDPR compliance into an existing
              product or building a new application from scratch, this article
              covers the practical engineering decisions you will face.
            </p>

            {/* Core concepts */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              GDPR core concepts developers need to understand
            </h2>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              Controller vs. processor
            </h3>
            <p>
              This distinction determines your obligations. A data controller
              decides why and how personal data is processed. A data processor
              processes data on behalf of a controller. As a SaaS provider, you
              are typically both: a controller for data you collect about your
              users (analytics, billing), and a processor for data your
              customers store in your application (customer content).
            </p>
            <p>
              This dual role has practical implications. For data you control,
              you must determine legal bases, set retention periods, and respond
              to user rights requests directly. For data you process on behalf
              of customers, your customers (the controllers) handle user rights,
              and you provide the technical mechanisms for them to do so &mdash;
              data export APIs, deletion endpoints, and access controls.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              Personal data is broader than you think
            </h3>
            <p>
              Under GDPR, personal data means any information relating to an
              identifiable person. This includes obvious identifiers like names
              and email addresses, but also IP addresses, cookie identifiers,
              device fingerprints, location data, and even pseudonymous data if
              it can be re-identified. In practice, almost all data your
              application collects about users qualifies as personal data.
            </p>
            <p>
              Developers often underestimate this scope. Server logs containing
              IP addresses are personal data. Error tracking payloads that
              include user IDs are personal data. Analytics events tied to
              session identifiers are personal data. When in doubt, treat it as
              personal data.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              Legal bases for processing
            </h3>
            <p>
              GDPR requires a legal basis for every data processing activity.
              The six legal bases are: consent, contractual necessity, legal
              obligation, vital interests, public task, and legitimate interest.
              For SaaS applications, you will primarily use three:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Contractual necessity:</strong> Processing needed to
                fulfill your service agreement. Storing user content, processing
                payments, sending transactional emails &mdash; all contractual
                necessity.
              </li>
              <li>
                <strong>Legitimate interest:</strong> Processing that serves a
                legitimate business purpose where the impact on the individual
                is minimal. Product analytics, security monitoring, fraud
                prevention &mdash; typically legitimate interest, but you must
                document a Legitimate Interest Assessment (LIA).
              </li>
              <li>
                <strong>Consent:</strong> The individual explicitly agrees to
                processing. Marketing emails, non-essential cookies, and
                optional data sharing require consent. Consent must be freely
                given, specific, informed, and unambiguous.
              </li>
            </ul>

            {/* What you need to build */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              What you need to build: the GDPR engineering checklist
            </h2>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              1. Consent management
            </h3>
            <p>
              If you rely on consent for any processing activity, you need a
              system that records when consent was given, what the user
              consented to, how consent was obtained, and allows withdrawal at
              any time. For cookies, this means a cookie consent banner that
              blocks non-essential cookies until the user opts in. Do not use
              pre-checked boxes. Do not use &quot;by continuing to use this site
              you consent&quot; banners &mdash; these are not valid GDPR
              consent.
            </p>
            <p>
              Technically, implement consent as a database record linked to the
              user: timestamp, consent scope, version of the privacy policy
              shown, and the user&apos;s choice. When consent is withdrawn,
              stop the associated processing immediately and record the
              withdrawal.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              2. Data subject rights endpoints
            </h3>
            <p>
              GDPR grants individuals several rights that your application must
              support. From an engineering perspective, these translate to API
              endpoints or admin tools:
            </p>
            <div className="space-y-4">
              {[
                {
                  right: "Right of access (Article 15)",
                  implementation:
                    "Build a data export endpoint that compiles all personal data you hold about a user into a machine-readable format (JSON or CSV). This includes account data, usage logs, support tickets, and any derived data.",
                },
                {
                  right: "Right to rectification (Article 16)",
                  implementation:
                    "Allow users to update their personal data through your UI. Most SaaS apps already have profile editing, but verify it covers all personal data, not just name and email.",
                },
                {
                  right: "Right to erasure (Article 17)",
                  implementation:
                    "Build a deletion flow that removes personal data from your primary database, removes it from backups within a reasonable timeframe, propagates deletion to sub-processors, and maintains an audit log of the deletion itself (without the deleted data).",
                },
                {
                  right: "Right to data portability (Article 20)",
                  implementation:
                    "Export user data in a structured, commonly used, machine-readable format. JSON is the standard choice. The export should include data the user provided directly (not derived analytics data).",
                },
                {
                  right: "Right to object (Article 21)",
                  implementation:
                    "Allow users to opt out of processing based on legitimate interest. This typically means opt-out controls for analytics, marketing, and profiling.",
                },
              ].map((item) => (
                <div
                  key={item.right}
                  className="bg-surface rounded-xl p-5"
                >
                  <h3 className="font-semibold mb-1">{item.right}</h3>
                  <p className="text-sm text-muted">{item.implementation}</p>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              3. Data minimization
            </h3>
            <p>
              GDPR requires you to collect only the data you actually need.
              This is an engineering principle as much as a legal one. Audit
              every form field, every analytics event, and every API payload.
              Ask: do we need this data to provide the service? If not, do not
              collect it.
            </p>
            <p>
              Common violations include collecting full names when only an
              email is needed for login, tracking granular user behavior when
              aggregate metrics would suffice, storing IP addresses
              indefinitely in server logs, and requesting broad OAuth scopes
              when narrow ones would work. Each unnecessary data point
              increases your compliance burden and your attack surface.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              4. Breach notification system
            </h3>
            <p>
              GDPR requires you to notify your supervisory authority within 72
              hours of becoming aware of a personal data breach. If the breach
              poses a high risk to individuals, you must also notify affected
              users without undue delay. This means you need:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                Monitoring and alerting for unauthorized data access
              </li>
              <li>
                An incident response plan with clear ownership and procedures
              </li>
              <li>
                Templates for authority and user notifications
              </li>
              <li>
                Logging sufficient to determine the scope of a breach
              </li>
            </ul>
            <p>
              The 72-hour clock starts when you become &quot;aware&quot; of the
              breach, not when you discover the root cause. Having a documented
              incident response process is essential to meeting this deadline.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              5. Data Processing Agreements (DPAs)
            </h3>
            <p>
              Every sub-processor that handles personal data on your behalf
              needs a Data Processing Agreement. This is a legal contract, but
              developers need to be aware of it because adding a new third-party
              service means a new DPA is needed. Major services like AWS,
              Stripe, Vercel, and Sentry have standardized DPAs you can sign
              online. Smaller services may require negotiation.
            </p>
            <p>
              Maintain a sub-processor register that lists every third-party
              service, what data it processes, where it is hosted, and the DPA
              status. Codepliant automatically detects your third-party services
              by scanning your codebase, giving you a starting point for this
              register.
            </p>

            {/* Common technical patterns */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              Common GDPR implementation patterns for SaaS
            </h2>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              Soft delete with scheduled purge
            </h3>
            <p>
              When a user requests deletion, soft-delete their account
              immediately (marking it as deleted and removing it from the
              application) but schedule the hard delete for 30 days later. This
              gives you a recovery window for accidental deletions while still
              honoring the erasure request promptly. After 30 days, a background
              job permanently removes all personal data and propagates deletion
              to sub-processors.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              Anonymization for analytics
            </h3>
            <p>
              If you need historical analytics but not individual-level data,
              anonymize records after a defined retention period. Replace user
              identifiers with random tokens, aggregate event data, and remove
              any fields that could enable re-identification. Truly anonymous
              data is outside GDPR scope entirely.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              Encryption at rest and in transit
            </h3>
            <p>
              While GDPR does not mandate specific security measures, it
              requires &quot;appropriate technical and organizational
              measures.&quot; Encryption at rest (AES-256 for databases and
              file storage) and in transit (TLS 1.2+ for all connections) are
              considered baseline. Most cloud providers handle this by default,
              but verify your configuration. Also consider field-level
              encryption for sensitive data like government IDs or health
              information.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              Audit logging
            </h3>
            <p>
              Maintain immutable audit logs for all access to personal data,
              data modifications, consent changes, and deletion operations. These
              logs serve as evidence of compliance during regulatory inquiries.
              Log the actor, action, timestamp, and affected data categories
              &mdash; but do not log the personal data itself.
            </p>

            {/* International data transfers */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              International data transfers
            </h2>
            <p>
              If you transfer personal data outside the EU/EEA (which most SaaS
              applications do if they use US-based cloud services), you need a
              legal mechanism for the transfer:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>EU-US Data Privacy Framework:</strong> If your
                sub-processor is certified under the DPF, transfers to that
                processor are covered. Major providers like AWS, Google Cloud,
                and Microsoft are certified.
              </li>
              <li>
                <strong>Standard Contractual Clauses (SCCs):</strong> The
                fallback mechanism for transfers to countries without adequacy
                decisions. Most DPAs from major providers include SCCs.
              </li>
              <li>
                <strong>Adequacy decisions:</strong> Transfers to countries the
                European Commission deems adequate (UK, Canada, Japan, South
                Korea, and others) require no additional safeguards.
              </li>
            </ul>
            <p>
              For each sub-processor, verify which transfer mechanism applies
              and document it. Your privacy policy must disclose international
              transfers and the safeguards in place.
            </p>

            {/* GDPR and AI */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              GDPR and AI: additional obligations for AI-powered SaaS
            </h2>
            <p>
              If your SaaS uses AI, GDPR adds specific obligations on top of
              the standard requirements:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Article 22 &mdash; Automated decision-making:</strong>
                {" "}Users have the right not to be subject to decisions based
                solely on automated processing that significantly affect them.
                If your AI makes decisions about access, pricing, content
                moderation, or eligibility, you must offer human review.
              </li>
              <li>
                <strong>Transparency about AI processing:</strong> Your privacy
                policy must disclose the existence of automated decision-making,
                provide meaningful information about the logic involved, and
                explain the significance and consequences for the user.
              </li>
              <li>
                <strong>Data sent to AI providers:</strong> If you send user
                data to OpenAI, Anthropic, or other AI APIs, this is a data
                transfer to a sub-processor. You need a DPA with the AI
                provider, and the transfer must be disclosed in your privacy
                policy.
              </li>
              <li>
                <strong>Training data:</strong> If user data could be used to
                train AI models (either by you or your AI provider), this
                requires a separate legal basis &mdash; typically consent. Most
                major AI providers now offer options to opt out of training data
                usage.
              </li>
            </ul>

            {/* Enforcement reality */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              GDPR enforcement: the numbers developers should know
            </h2>
            <p>
              GDPR enforcement is real and increasing. As of 2026, regulators
              have issued over 2,000 fines totaling more than 4.5 billion EUR.
              While headline fines target large companies (Meta: 2.5 billion
              EUR, Amazon: 746 million EUR, TikTok: 345 million EUR), small and
              mid-size companies are fined regularly too. The median fine is
              around 50,000 EUR &mdash; significant for a startup.
            </p>
            <p>
              Common violations that result in fines include:
            </p>
            <div className="space-y-4">
              {[
                {
                  violation: "Insufficient legal basis for processing",
                  detail:
                    "The most common violation. Typically results from relying on legitimate interest when consent is required, or processing data without any documented legal basis.",
                },
                {
                  violation: "Inadequate privacy notices",
                  detail:
                    "Vague, incomplete, or inaccessible privacy policies. Regulators check whether your privacy policy accurately reflects your data practices.",
                },
                {
                  violation: "Non-compliant consent mechanisms",
                  detail:
                    "Pre-checked consent boxes, consent bundled with terms of service, cookie banners that track before consent is given.",
                },
                {
                  violation: "Failure to honor data subject rights",
                  detail:
                    "Not responding to access or deletion requests within the required one-month timeframe, or providing incomplete responses.",
                },
                {
                  violation: "Insufficient security measures",
                  detail:
                    "Data breaches caused by inadequate security, especially where basic measures like encryption or access controls were missing.",
                },
              ].map((item) => (
                <div
                  key={item.violation}
                  className="bg-surface rounded-xl p-5"
                >
                  <h3 className="font-semibold mb-1">{item.violation}</h3>
                  <p className="text-sm text-muted">{item.detail}</p>
                </div>
              ))}
            </div>

            {/* Practical steps */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              Action plan: GDPR compliance for your engineering team
            </h2>
            <ol className="list-decimal list-inside space-y-3 ml-2">
              <li>
                <strong>Scan your codebase.</strong> Run Codepliant to generate
                an inventory of all data collection, third-party integrations,
                and AI usage in your application. This gives you the factual
                foundation for compliance.
              </li>
              <li>
                <strong>Document your data processing.</strong> For each data
                category, record the legal basis, retention period, and
                sub-processors involved. This is your Record of Processing
                Activities (ROPA), required by Article 30.
              </li>
              <li>
                <strong>Implement user rights.</strong> Build or verify data
                export, deletion, and consent management flows. Test them
                end-to-end, including propagation to sub-processors.
              </li>
              <li>
                <strong>Review your privacy policy.</strong> Ensure it
                accurately reflects your data practices, names your
                sub-processors, specifies retention periods, and covers AI
                processing if applicable.
              </li>
              <li>
                <strong>Set up consent management.</strong> Implement a GDPR-
                compliant cookie consent banner. Ensure non-essential cookies
                are blocked until opt-in.
              </li>
              <li>
                <strong>Prepare for breaches.</strong> Document an incident
                response plan. Test it with a tabletop exercise. Ensure you can
                identify, assess, and report a breach within 72 hours.
              </li>
              <li>
                <strong>Integrate into CI/CD.</strong> Add Codepliant to your
                deployment pipeline to regenerate compliance documentation on
                every deploy. This keeps your privacy policy synchronized with
                your code.
              </li>
            </ol>
          </div>

          {/* CTA */}
          <section className="bg-surface rounded-2xl p-8 text-center mt-16 mb-16">
            <h2 className="text-xl font-bold mb-3">
              Automate GDPR compliance documentation
            </h2>
            <p className="text-muted text-sm mb-6">
              Scan your codebase to generate privacy policies, data inventories,
              and compliance documentation. Free, open source, no account
              required.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-xl font-mono text-sm inline-block">
              npx codepliant go
            </div>
          </section>

          {/* Related pages */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Related resources
            </h2>
            <div className="space-y-3">
              {[
                {
                  title: "GDPR Compliance Hub",
                  href: "/gdpr-compliance",
                  desc: "Everything you need to know about GDPR compliance for your application.",
                },
                {
                  title: "How to Write a Privacy Policy for Your SaaS App",
                  href: "/blog/privacy-policy-for-saas",
                  desc: "Step-by-step guide to creating a legally compliant SaaS privacy policy.",
                },
                {
                  title: "Privacy Policy Generator",
                  href: "/privacy-policy-generator",
                  desc: "Generate a privacy policy from your codebase in seconds.",
                },
                {
                  title: "Data Privacy Compliance Hub",
                  href: "/data-privacy",
                  desc: "Overview of all compliance frameworks Codepliant supports.",
                },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block bg-surface rounded-xl p-4 hover:ring-1 hover:ring-border-strong transition-shadow"
                >
                  <h3 className="font-semibold mb-1 text-sm">{link.title}</h3>
                  <p className="text-xs text-muted">{link.desc}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
