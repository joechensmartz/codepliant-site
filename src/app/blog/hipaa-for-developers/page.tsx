import type { Metadata } from "next";
import { CodeBlock } from "../components";

export const metadata: Metadata = {
  title: "HIPAA for SaaS Developers: What You Actually Need to Know",
  description:
    "Practical HIPAA guide for developers. The 18 PHI identifiers, encryption and audit log requirements, BAAs, and how to automate compliance from your code.",
  alternates: {
    canonical: "https://www.codepliant.site/blog/hipaa-for-developers",
  },
  keywords: [
    "HIPAA for developers",
    "HIPAA compliance",
    "HIPAA SaaS",
    "protected health information",
    "PHI",
    "HIPAA technical safeguards",
    "HIPAA encryption",
    "HIPAA audit logs",
    "HIPAA access controls",
    "Business Associate Agreement",
    "BAA",
    "HIPAA identifiers",
    "HIPAA developer guide",
    "health data compliance",
    "codepliant",
    "HIPAA automation",
  ],
  openGraph: {
    title: "HIPAA for SaaS Developers: What You Actually Need to Know",
    description:
      "Practical HIPAA guide for developers. PHI identifiers, technical safeguards, BAAs, and how to automate compliance from your code.",
    url: "https://www.codepliant.site/blog/hipaa-for-developers",
    type: "article",
    publishedTime: "2026-03-17T00:00:00Z",
    modifiedTime: "2026-03-17T00:00:00Z",
    authors: ["Codepliant"],
    tags: [
      "HIPAA",
      "Compliance",
      "Healthcare",
      "Developer Guide",
      "Security",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HIPAA for SaaS Developers: What You Actually Need to Know",
    description:
      "What counts as PHI, the 18 HIPAA identifiers, encryption and audit log requirements, BAAs, and how to automate HIPAA compliance from your codebase.",
  },
};

function articleJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "HIPAA for SaaS Developers: What You Actually Need to Know",
    description:
      "Practical HIPAA guide for developers. Learn what counts as PHI, the 18 HIPAA identifiers, technical safeguards, BAAs, and how to automate HIPAA compliance from your code.",
    datePublished: "2026-03-17",
    dateModified: "2026-03-17",
    author: {
      "@type": "Organization",
      name: "Codepliant",
      url: "https://www.codepliant.site",
    },
    publisher: {
      "@type": "Organization",
      name: "Codepliant",
      url: "https://www.codepliant.site",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.codepliant.site/blog/hipaa-for-developers",
    },
  };
}

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do I need HIPAA compliance if I'm not a healthcare company?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, if your app handles Protected Health Information (PHI). HIPAA applies to covered entities (hospitals, insurers, providers) and their business associates — any company that creates, receives, maintains, or transmits PHI on their behalf. If your SaaS stores patient data, processes health records, or integrates with EHR systems, you are likely a business associate and HIPAA applies to you.",
        },
      },
      {
        "@type": "Question",
        name: "What are the 18 HIPAA identifiers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The 18 HIPAA identifiers are: names, geographic data smaller than a state, dates (except year) related to an individual, phone numbers, fax numbers, email addresses, Social Security numbers, medical record numbers, health plan beneficiary numbers, account numbers, certificate/license numbers, vehicle identifiers and serial numbers, device identifiers and serial numbers, web URLs, IP addresses, biometric identifiers, full-face photographs, and any other unique identifying number or code.",
        },
      },
      {
        "@type": "Question",
        name: "What encryption does HIPAA require?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "HIPAA requires encryption of PHI at rest and in transit as an addressable safeguard under the Security Rule. In practice, this means AES-256 for data at rest and TLS 1.2+ for data in transit. While technically 'addressable' rather than 'required,' failing to encrypt PHI without a documented equivalent alternative is considered a violation by HHS enforcement.",
        },
      },
    ],
  };
}

function breadcrumbJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.codepliant.site",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.codepliant.site/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "HIPAA for Developers",
        item: "https://www.codepliant.site/blog/hipaa-for-developers",
      },
    ],
  };
}

export default function HipaaForDevelopers() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd()),
        }}
      />

      <article className="py-[var(--space-16)] px-[var(--space-6)]">
        <div className="max-w-[680px] mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-ink-tertiary mb-6" aria-label="Breadcrumb">
            <a href="/" className="hover:text-ink transition-colors">
              Home
            </a>
            <span className="mx-2">/</span>
            <a href="/blog" className="hover:text-ink transition-colors">
              Blog
            </a>
            <span className="mx-2">/</span>
            <span className="text-ink-secondary">HIPAA for Developers</span>
          </nav>

          <p className="text-sm font-medium text-brand mb-4 tracking-wide uppercase">
            <a href="/blog" className="hover:underline">
              Blog
            </a>
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            HIPAA for SaaS Developers: What You Actually Need to Know
          </h1>
          <p className="text-sm text-ink-secondary mb-12">
            Published March 17, 2026 &middot; 11 min read
          </p>

          {/* Table of Contents */}
          <nav className="bg-surface-secondary rounded-lg p-6 mb-12">
            <p className="text-sm font-semibold mb-3">In this article</p>
            <ul className="space-y-2 text-sm text-ink-secondary">
              <li>
                <a href="#who-needs-hipaa" className="hover:text-ink transition-colors">
                  1. Who actually needs HIPAA compliance
                </a>
              </li>
              <li>
                <a href="#what-is-phi" className="hover:text-ink transition-colors">
                  2. What counts as PHI (the 18 identifiers)
                </a>
              </li>
              <li>
                <a href="#technical-safeguards" className="hover:text-ink transition-colors">
                  3. Technical safeguards: encryption, audit logs, access controls
                </a>
              </li>
              <li>
                <a href="#baa" className="hover:text-ink transition-colors">
                  4. Business Associate Agreements (BAAs)
                </a>
              </li>
              <li>
                <a href="#codepliant-hipaa" className="hover:text-ink transition-colors">
                  5. How Codepliant detects health-related services
                </a>
              </li>
              <li>
                <a href="#get-started" className="hover:text-ink transition-colors">
                  6. Get started now
                </a>
              </li>
            </ul>
          </nav>

          {/* Intro */}
          <p className="text-[length:var(--text-lg)] text-ink-secondary leading-relaxed mb-6">
            You built a SaaS product. Maybe it is a scheduling tool for clinics.
            Maybe it is an analytics dashboard that happens to process patient
            survey data. Maybe your CRM just added a healthcare vertical. Then
            someone asks: <strong>&ldquo;Are you HIPAA compliant?&rdquo;</strong>
          </p>
          <p className="text-[length:var(--text-lg)] text-ink-secondary leading-relaxed mb-12">
            HIPAA is not just for hospitals. Any application that handles Protected
            Health Information (PHI) on behalf of a healthcare entity falls under
            HIPAA. That includes your SaaS if it touches health data in any way.
            This guide breaks down what HIPAA actually requires from a developer
            perspective &mdash; no legal jargon, just the technical reality.
          </p>

          {/* Section 1 */}
          <h2
            id="who-needs-hipaa"
            className="text-2xl font-bold tracking-tight mt-16 mb-6"
          >
            1. Who actually needs HIPAA compliance
          </h2>

          <p className="text-ink-secondary leading-relaxed mb-4">
            HIPAA (Health Insurance Portability and Accountability Act) applies to
            two categories of organizations:
          </p>

          <div className="space-y-4 mb-8">
            <div className="bg-surface-secondary rounded-lg p-6">
              <p className="font-semibold mb-2">Covered Entities</p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Healthcare providers (hospitals, clinics, doctors), health plans
                (insurers, HMOs), and healthcare clearinghouses. These are the
                organizations that directly handle patient care or health insurance.
              </p>
            </div>

            <div className="bg-surface-secondary rounded-lg p-6">
              <p className="font-semibold mb-2">Business Associates</p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Any person or company that creates, receives, maintains, or transmits
                PHI on behalf of a covered entity. <strong>This is where most SaaS
                companies fall.</strong> If a hospital uses your scheduling app, or a
                therapist stores notes in your platform, or a health insurer sends
                claims data through your API &mdash; you are a business associate.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-8 mb-4">
            SaaS products that often need HIPAA
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-ink-secondary mb-6">
            <li>
              <strong>Telehealth and appointment scheduling.</strong> Any app
              connecting patients with providers.
            </li>
            <li>
              <strong>EHR integrations.</strong> If your API pulls or pushes data
              to Epic, Cerner, or any electronic health record system.
            </li>
            <li>
              <strong>Patient messaging and communication.</strong> Secure
              messaging, email, or notification services handling health information.
            </li>
            <li>
              <strong>Health analytics and reporting.</strong> Dashboards,
              population health tools, or clinical trial platforms.
            </li>
            <li>
              <strong>Billing and claims processing.</strong> Any system handling
              insurance claims, medical billing codes, or payment data tied to health
              services.
            </li>
            <li>
              <strong>Cloud hosting and infrastructure.</strong> If you host or
              store PHI on behalf of a healthcare client, even as an infrastructure
              provider.
            </li>
          </ul>

          <div className="bg-surface-secondary rounded-lg p-6 mb-8 border-l-4 border-brand">
            <p className="text-sm text-ink-secondary leading-relaxed">
              <strong>Key point:</strong> You do not need to be a healthcare
              company to need HIPAA compliance. If any of your customers are
              healthcare organizations and they store, transmit, or process
              health-related data through your product, HIPAA likely applies to you.
            </p>
          </div>

          {/* Section 2 */}
          <h2
            id="what-is-phi"
            className="text-2xl font-bold tracking-tight mt-16 mb-6"
          >
            2. What counts as PHI (the 18 identifiers)
          </h2>

          <p className="text-ink-secondary leading-relaxed mb-4">
            Protected Health Information (PHI) is any individually identifiable
            health information that is created, received, maintained, or transmitted
            by a covered entity or business associate. The key word is
            &ldquo;individually identifiable&rdquo; &mdash; health data that cannot
            be linked back to a specific person is not PHI.
          </p>

          <p className="text-ink-secondary leading-relaxed mb-6">
            HIPAA defines 18 types of identifiers. If any of these appear alongside
            health information, the data is PHI:
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-3 pr-4 font-semibold">#</th>
                  <th className="text-left py-3 pr-4 font-semibold">Identifier</th>
                  <th className="text-left py-3 font-semibold">Developer notes</th>
                </tr>
              </thead>
              <tbody className="text-ink-secondary">
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4">1</td>
                  <td className="py-3 pr-4 font-medium">Names</td>
                  <td className="py-3">Full name, first + last, maiden names</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4">2</td>
                  <td className="py-3 pr-4 font-medium">Geographic data</td>
                  <td className="py-3">Anything more specific than state (street address, city, zip code)</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4">3</td>
                  <td className="py-3 pr-4 font-medium">Dates</td>
                  <td className="py-3">Birth date, admission/discharge dates, date of death (year alone is OK)</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4">4</td>
                  <td className="py-3 pr-4 font-medium">Phone numbers</td>
                  <td className="py-3">Including mobile, home, work</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4">5</td>
                  <td className="py-3 pr-4 font-medium">Fax numbers</td>
                  <td className="py-3">Still common in healthcare</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4">6</td>
                  <td className="py-3 pr-4 font-medium">Email addresses</td>
                  <td className="py-3">Personal and work email</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4">7</td>
                  <td className="py-3 pr-4 font-medium">Social Security numbers</td>
                  <td className="py-3">Never store these in plaintext</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4">8</td>
                  <td className="py-3 pr-4 font-medium">Medical record numbers</td>
                  <td className="py-3">Assigned by healthcare providers</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4">9</td>
                  <td className="py-3 pr-4 font-medium">Health plan beneficiary numbers</td>
                  <td className="py-3">Insurance member IDs</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4">10</td>
                  <td className="py-3 pr-4 font-medium">Account numbers</td>
                  <td className="py-3">Financial account numbers tied to health services</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4">11</td>
                  <td className="py-3 pr-4 font-medium">Certificate/license numbers</td>
                  <td className="py-3">Professional licenses, driver&apos;s licenses</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4">12</td>
                  <td className="py-3 pr-4 font-medium">Vehicle identifiers</td>
                  <td className="py-3">VINs, license plate numbers</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4">13</td>
                  <td className="py-3 pr-4 font-medium">Device identifiers</td>
                  <td className="py-3">Serial numbers for medical devices, UDIs</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4">14</td>
                  <td className="py-3 pr-4 font-medium">Web URLs</td>
                  <td className="py-3">Personal URLs that could identify a patient</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4">15</td>
                  <td className="py-3 pr-4 font-medium">IP addresses</td>
                  <td className="py-3">Logged in access logs, analytics, error tracking</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4">16</td>
                  <td className="py-3 pr-4 font-medium">Biometric identifiers</td>
                  <td className="py-3">Fingerprints, voiceprints, retinal scans</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4">17</td>
                  <td className="py-3 pr-4 font-medium">Full-face photographs</td>
                  <td className="py-3">Profile photos, ID photos, medical images showing face</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">18</td>
                  <td className="py-3 pr-4 font-medium">Any other unique identifier</td>
                  <td className="py-3">Internal user IDs, patient IDs, MRN-like codes</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-surface-secondary rounded-lg p-6 mb-8 border-l-4 border-brand">
            <p className="text-sm text-ink-secondary leading-relaxed">
              <strong>Developer trap:</strong> IP addresses and email addresses are
              HIPAA identifiers. If your application logs IP addresses alongside any
              health-related activity (appointment bookings, prescription views,
              health assessment results), those logs contain PHI. This catches many
              SaaS teams off guard because standard logging and error-tracking
              libraries capture IP addresses by default.
            </p>
          </div>

          <h3 className="text-lg font-semibold mt-8 mb-4">
            ePHI: the digital version
          </h3>
          <p className="text-ink-secondary leading-relaxed mb-6">
            Electronic Protected Health Information (ePHI) is PHI in electronic
            form &mdash; stored in a database, transmitted over an API, logged in an
            error tracker, or cached in a browser. As a developer, virtually all PHI
            you encounter is ePHI, and the HIPAA Security Rule applies specifically
            to ePHI.
          </p>

          {/* Section 3 */}
          <h2
            id="technical-safeguards"
            className="text-2xl font-bold tracking-tight mt-16 mb-6"
          >
            3. Technical safeguards: encryption, audit logs, access controls
          </h2>

          <p className="text-ink-secondary leading-relaxed mb-6">
            The HIPAA Security Rule defines three categories of safeguards:
            administrative (policies and procedures), physical (facility access),
            and technical (the technology controls developers implement). Here is
            what the technical safeguards actually mean for your code.
          </p>

          <h3 className="text-lg font-semibold mt-8 mb-4">
            Encryption
          </h3>
          <p className="text-ink-secondary leading-relaxed mb-4">
            HIPAA classifies encryption as &ldquo;addressable&rdquo; rather than
            &ldquo;required.&rdquo; In practice, this distinction is meaningless.
            HHS has made clear that failing to encrypt ePHI without implementing an
            equivalent alternative measure is a violation. Treat encryption as
            mandatory.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-ink-secondary mb-6">
            <li>
              <strong>At rest:</strong> AES-256 encryption for databases, file
              storage, and backups. Use managed encryption (AWS RDS encryption, GCP
              Cloud SQL encryption) or application-level encryption for sensitive
              fields.
            </li>
            <li>
              <strong>In transit:</strong> TLS 1.2 or higher for all connections.
              This includes API calls, database connections, internal service
              communication, and any data transfer between systems.
            </li>
            <li>
              <strong>Key management:</strong> Use a dedicated KMS (AWS KMS, GCP
              Cloud KMS, Azure Key Vault). Never store encryption keys alongside the
              data they protect. Rotate keys on a documented schedule.
            </li>
          </ul>

          <CodeBlock filename="Example: Verifying encryption configuration">
            {`# Check RDS encryption at rest
aws rds describe-db-instances \\
  --query 'DBInstances[*].[DBInstanceIdentifier,StorageEncrypted]'

# Check S3 bucket encryption
aws s3api get-bucket-encryption \\
  --bucket my-phi-bucket

# Verify TLS version on your endpoint
openssl s_client -connect api.yourapp.com:443 \\
  -tls1_2 < /dev/null 2>&1 | grep "Protocol"`}
          </CodeBlock>

          <h3 className="text-lg font-semibold mt-8 mb-4">
            Audit logs
          </h3>
          <p className="text-ink-secondary leading-relaxed mb-4">
            HIPAA requires audit controls that record and examine activity in
            systems containing ePHI. Your audit logs must capture:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-ink-secondary mb-6">
            <li>
              <strong>Who</strong> accessed the data (authenticated user identity)
            </li>
            <li>
              <strong>What</strong> data was accessed, created, modified, or deleted
            </li>
            <li>
              <strong>When</strong> the access occurred (timestamp)
            </li>
            <li>
              <strong>Where</strong> the access originated (IP address, system)
            </li>
            <li>
              <strong>Outcome</strong> of the access attempt (success or failure)
            </li>
          </ul>

          <p className="text-ink-secondary leading-relaxed mb-6">
            Audit logs must be tamper-proof (write-once storage or append-only),
            retained for a minimum of six years, and regularly reviewed. Failed
            login attempts, privilege escalations, and PHI exports should trigger
            alerts.
          </p>

          <h3 className="text-lg font-semibold mt-8 mb-4">
            Access controls
          </h3>
          <p className="text-ink-secondary leading-relaxed mb-4">
            The HIPAA Security Rule requires four access control mechanisms:
          </p>
          <div className="space-y-4 mb-8">
            <div className="bg-surface-secondary rounded-lg p-6">
              <p className="font-semibold mb-2">Unique user identification</p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Every user must have a unique identifier. No shared accounts, no
                generic &ldquo;admin&rdquo; logins. This is necessary for
                meaningful audit trails.
              </p>
            </div>

            <div className="bg-surface-secondary rounded-lg p-6">
              <p className="font-semibold mb-2">Emergency access procedure</p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                A documented process for accessing ePHI during an emergency. Break-glass
                procedures that bypass normal access controls but log everything.
              </p>
            </div>

            <div className="bg-surface-secondary rounded-lg p-6">
              <p className="font-semibold mb-2">Automatic logoff</p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Sessions must time out after a period of inactivity. Implement
                idle session expiration and require re-authentication. The timeout
                period should reflect the sensitivity of the data.
              </p>
            </div>

            <div className="bg-surface-secondary rounded-lg p-6">
              <p className="font-semibold mb-2">Encryption and decryption</p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Mechanisms to encrypt ePHI whenever it is stored or transmitted, and
                to decrypt it only when accessed by authorized users or processes.
              </p>
            </div>
          </div>

          <p className="text-ink-secondary leading-relaxed mb-6">
            Beyond these four requirements, implement role-based access control
            (RBAC) with the principle of least privilege. Users should only access
            the minimum PHI necessary to perform their function. MFA should be
            enforced for any system that stores or accesses ePHI.
          </p>

          {/* Section 4 */}
          <h2
            id="baa"
            className="text-2xl font-bold tracking-tight mt-16 mb-6"
          >
            4. Business Associate Agreements (BAAs)
          </h2>

          <p className="text-ink-secondary leading-relaxed mb-4">
            A Business Associate Agreement (BAA) is a legally binding contract
            between a covered entity and a business associate (you). It is not
            optional. HIPAA requires a BAA to be in place before any PHI is shared.
          </p>

          <h3 className="text-lg font-semibold mt-8 mb-4">
            When you need a BAA
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-ink-secondary mb-6">
            <li>
              <strong>With your healthcare customers.</strong> If a hospital or
              clinic uses your SaaS and any PHI flows through it, you need a BAA
              with that customer.
            </li>
            <li>
              <strong>With your sub-processors.</strong> If you use AWS, GCP,
              or Azure to store ePHI, you need a BAA with that cloud provider.
              If you use a third-party email service to send appointment
              reminders containing PHI, you need a BAA with them too.
            </li>
            <li>
              <strong>With any vendor that touches PHI.</strong> Database hosting,
              error tracking (if it captures PHI), backup services, analytics
              providers &mdash; any vendor that could access ePHI needs a BAA.
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-8 mb-4">
            What a BAA must include
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-ink-secondary mb-6">
            <li>
              Permitted and required uses of PHI
            </li>
            <li>
              Agreement not to use or disclose PHI beyond what the contract allows
            </li>
            <li>
              Requirement to implement appropriate safeguards
            </li>
            <li>
              Obligation to report breaches and security incidents
            </li>
            <li>
              Terms for returning or destroying PHI when the contract ends
            </li>
            <li>
              Right for the covered entity to terminate the contract if the
              business associate violates HIPAA
            </li>
          </ul>

          <div className="bg-surface-secondary rounded-lg p-6 mb-8 border-l-4 border-brand">
            <p className="text-sm text-ink-secondary leading-relaxed">
              <strong>Cloud provider BAAs:</strong> AWS, GCP, and Azure all offer
              BAAs, but you must explicitly sign them. AWS requires you to
              designate specific HIPAA-eligible services in your account
              configuration. GCP provides a BAA through its Cloud Identity
              agreement. Azure offers a HIPAA BAA as part of its Online Services
              Terms. Do not assume your cloud provider is HIPAA-covered by default
              &mdash; you must actively execute the agreement.
            </p>
          </div>

          {/* Section 5 */}
          <h2
            id="codepliant-hipaa"
            className="text-2xl font-bold tracking-tight mt-16 mb-6"
          >
            5. How Codepliant detects health-related services
          </h2>

          <p className="text-ink-secondary leading-relaxed mb-4">
            Codepliant scans your codebase to detect services, integrations, and
            configurations that indicate health data handling. It identifies
            patterns that are relevant to HIPAA compliance and generates
            documentation grounded in your actual implementation.
          </p>

          <CodeBlock filename="Terminal">
            {`npx codepliant go

Scanning project...
  Detected: Node.js + TypeScript
  Detected: AWS S3 (encrypted at rest), RDS (encrypted)
  Detected: Auth0 (MFA configured)
  Detected: FHIR API integration (health data)
  Detected: Twilio (patient notifications)
  Detected: Winston logging (structured audit logs)
  Detected: Redis session store (auto-expiry configured)

Generating documents...
  [+] HIPAA Compliance Checklist
  [+] Privacy Policy (HIPAA-aware)
  [+] Data Processing Inventory
  [+] Access Control Policy
  [+] Encryption Policy
  [+] Audit Log Policy
  [+] Breach Notification Plan
  [+] Business Associate Agreement Template

8 documents generated in compliance-docs/`}
          </CodeBlock>

          <p className="text-ink-secondary leading-relaxed mb-6">
            Here is what Codepliant looks for when assessing HIPAA relevance:
          </p>

          <div className="space-y-4 mb-8">
            <div className="bg-surface-secondary rounded-lg p-6">
              <p className="font-semibold mb-2">Health data integrations</p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Scans for FHIR/HL7 libraries, EHR API clients (Epic, Cerner,
                Allscripts), health-specific SDKs, and medical coding libraries
                (ICD-10, CPT, SNOMED). The presence of these signals that your
                application handles health data and HIPAA likely applies.
              </p>
            </div>

            <div className="bg-surface-secondary rounded-lg p-6">
              <p className="font-semibold mb-2">Encryption posture</p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Detects database encryption settings, TLS configuration, KMS
                integrations, and field-level encryption patterns. Flags gaps where
                ePHI storage or transmission may lack encryption.
              </p>
            </div>

            <div className="bg-surface-secondary rounded-lg p-6">
              <p className="font-semibold mb-2">Audit trail implementation</p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Identifies logging libraries, structured log formats, and audit-specific
                patterns. Checks for the who/what/when/where/outcome fields that
                HIPAA audit controls require.
              </p>
            </div>

            <div className="bg-surface-secondary rounded-lg p-6">
              <p className="font-semibold mb-2">Access control patterns</p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Scans for authentication providers (Auth0, Okta, Cognito), RBAC
                implementations, session timeout configuration, and MFA setup.
                Maps findings to HIPAA access control requirements.
              </p>
            </div>

            <div className="bg-surface-secondary rounded-lg p-6">
              <p className="font-semibold mb-2">Third-party services needing BAAs</p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Identifies cloud providers (AWS, GCP, Azure), communication services
                (Twilio, SendGrid), analytics tools, and other vendors that may
                process ePHI. Flags each one as requiring a BAA if PHI flows through
                it.
              </p>
            </div>
          </div>

          <p className="text-ink-secondary leading-relaxed mb-4">
            Every generated document reflects what Codepliant actually found in your
            code. If it detects Auth0 with MFA configured, your Access Control
            Policy references that specific setup. If it finds unencrypted S3
            buckets, the HIPAA Compliance Checklist flags it as a gap requiring
            remediation.
          </p>

          <p className="text-ink-secondary leading-relaxed mb-6">
            The goal is not to replace legal counsel &mdash; it is to give you an
            accurate starting point so your compliance effort is grounded in
            technical reality rather than guesswork.
          </p>

          {/* Section 6: CTA */}
          <h2
            id="get-started"
            className="text-2xl font-bold tracking-tight mt-16 mb-6"
          >
            6. Get started now
          </h2>

          <p className="text-ink-secondary leading-relaxed mb-6">
            HIPAA compliance starts with understanding what your application
            actually does with health data. Scan your codebase, identify gaps, and
            generate the documentation your compliance program needs. One command:
          </p>

          <section className="bg-surface-secondary rounded-lg p-8 text-center mb-12">
            <h3 className="text-xl font-bold mb-3">
              Check your HIPAA readiness from your code
            </h3>
            <p className="text-ink-secondary text-sm mb-6">
              Codepliant scans your codebase for health data integrations,
              encryption gaps, audit log coverage, and access control patterns.
              Free, open source, runs locally. No PHI ever leaves your machine.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-lg font-mono text-sm inline-block">
              npx codepliant go
            </div>
            <p className="text-xs text-ink-tertiary mt-4">
              No account required. No data leaves your machine.
            </p>
          </section>

          {/* Related links */}
          <div className="border-t border-border-subtle pt-8">
            <h3 className="text-lg font-semibold mb-4">Related reading</h3>
            <ul className="space-y-2 text-sm text-ink-secondary">
              <li>
                <a
                  href="/hipaa-compliance"
                  className="text-brand hover:underline"
                >
                  HIPAA Compliance Tool &mdash; Full Feature Overview
                </a>
              </li>
              <li>
                <a
                  href="/blog/soc2-for-startups"
                  className="text-brand hover:underline"
                >
                  SOC 2 for Startups: A Developer&apos;s Survival Guide
                </a>
              </li>
              <li>
                <a
                  href="/blog/gdpr-for-developers"
                  className="text-brand hover:underline"
                >
                  GDPR Compliance for Developers: A Practical Guide
                </a>
              </li>
              <li>
                <a
                  href="/blog/privacy-policy-for-saas"
                  className="text-brand hover:underline"
                >
                  How to Write a Privacy Policy for Your SaaS App
                </a>
              </li>
              <li>
                <a
                  href="/blog/generate-privacy-policy-from-code"
                  className="text-brand hover:underline"
                >
                  Generate a Privacy Policy from Your Code in 30 Seconds
                </a>
              </li>
            </ul>
          </div>
        </div>
      </article>
    </>
  );
}
