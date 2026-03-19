import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy Generator for Developers",
  description:
    "Privacy policy generator that scans your codebase to detect data collection, third-party services, and analytics. Accurate, GDPR-ready output. Free CLI.",
  keywords: [
    "privacy policy generator",
    "privacy policy generator for developers",
    "generate privacy policy from code",
    "privacy policy for SaaS",
    "privacy policy for apps",
    "GDPR privacy policy",
    "CCPA privacy policy",
    "automated privacy policy",
    "developer privacy policy",
    "code-based privacy policy",
    "privacy policy CLI",
    "open source privacy policy generator",
  ],
  alternates: {
    canonical: "https://www.codepliant.site/privacy-policy-generator",
  },
  openGraph: {
    title: "Privacy Policy Generator for Developers",
    description:
      "Privacy policy generator that scans your codebase to detect data collection, third-party services, and analytics. Accurate, GDPR-ready output. Free CLI.",
    url: "https://www.codepliant.site/privacy-policy-generator",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Codepliant — Compliance Documents from Your Code" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy Generator for Developers",
    description:
      "Scan your code, generate an accurate privacy policy. No questionnaires, no guesswork.",
    images: ["/opengraph-image"],
  },
};

const faqs = [
  {
    question: "What makes this different from other privacy policy generators?",
    answer:
      "Most privacy policy generators ask you to fill out a questionnaire about your data practices. Codepliant scans your actual source code — dependencies, imports, environment variables, database schemas — to detect what data you collect and which services you use. The result is a privacy policy based on evidence, not self-reported answers.",
  },
  {
    question: "What does a privacy policy need to contain?",
    answer:
      "A legally compliant privacy policy must disclose: what personal data you collect, why you collect it (legal basis), how you process and store it, who you share it with (third parties), how long you retain data, what rights users have (access, deletion, portability), how users can exercise those rights, cookie and tracking disclosures, and contact information for your data controller. GDPR, CCPA, and other regulations each have specific requirements.",
  },
  {
    question: "Does Codepliant generate GDPR-compliant privacy policies?",
    answer:
      "Codepliant generates privacy policies that include GDPR-required sections: legal basis for processing (mapped per service category), data subject rights (Articles 15-22), international transfer disclosures, data retention information, and DPO contact details. You should still have a lawyer review the output for your specific jurisdiction.",
  },
  {
    question: "What languages and frameworks does Codepliant support?",
    answer:
      "Codepliant scans codebases in TypeScript, JavaScript, Python, Go, Ruby, Rust, Java, PHP, Swift, Kotlin, and Terraform. It detects services across all major ecosystems including npm, pip, Go modules, Cargo, Composer, CocoaPods, and more.",
  },
  {
    question: "Is this free to use?",
    answer:
      "Yes. The CLI is open source (MIT licensed) and free. Run npx codepliant go in your project directory and the privacy policy is generated locally — no account, no API key, no network calls.",
  },
  {
    question: "How does Codepliant detect third-party services?",
    answer:
      "Codepliant scans your package.json (or equivalent), source code imports, environment variables, and configuration files. It matches against a database of service signatures — for example, detecting @stripe/stripe-js in your dependencies triggers disclosures about payment data processing via Stripe.",
  },
  {
    question: "Can I customize the generated privacy policy?",
    answer:
      "Yes. You can configure Codepliant with a .codepliantrc.json file to set your company name, contact email, DPO details, data retention periods, and more. The generated Markdown file can be edited further before publishing.",
  },
  {
    question: "How often should I regenerate my privacy policy?",
    answer:
      "Regenerate your privacy policy whenever you add or remove third-party services, change data collection practices, or update your tech stack. You can use codepliant diff to see what changed since the last generation. Many teams add Codepliant to their CI pipeline to catch changes automatically.",
  },
];

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function softwareJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Codepliant Privacy Policy Generator",
    version: "1.1.1",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows",
    description:
      "Privacy policy generator for developers that scans your codebase to detect data collection, third-party services, and storage practices. Generates accurate, regulation-aware privacy policies.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
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
        name: "Privacy Policy Generator",
        item: "https://www.codepliant.site/privacy-policy-generator",
      },
    ],
  };
}

export default function PrivacyPolicyGenerator() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd()),
        }}
      />

      <article className="py-[var(--space-16)] px-[var(--space-6)]">
        <div className="max-w-[680px] mx-auto">
          {/* Breadcrumb navigation */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-ink-secondary">
              <li>
                <a
                  href="/"
                  className="hover:text-brand transition-colors"
                >
                  Home
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-ink-primary font-medium">
                Privacy Policy Generator
              </li>
            </ol>
          </nav>

          <p className="text-sm font-medium text-brand mb-4 tracking-wide uppercase">
            Document Generator
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            Privacy Policy Generator for Developers
          </h1>
          <p className="text-lg text-ink-secondary mb-12">
            Most privacy policy generators ask you to fill out a questionnaire.
            Codepliant takes a different approach — it scans your actual codebase
            to understand what data you collect, how you process it, and who you
            share it with. The result is an accurate privacy policy based on
            evidence, not guesswork.
          </p>

          {/* What a privacy policy must contain */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              What a privacy policy must contain
            </h2>
            <p className="text-ink-secondary mb-6">
              Privacy regulations like GDPR, CCPA, and LGPD each have specific
              requirements, but every compliant privacy policy must address these
              core elements:
            </p>
            <div className="space-y-4">
              {[
                {
                  title: "Data you collect",
                  desc: "Personal information, device data, usage data, cookies — every category of data your application touches.",
                },
                {
                  title: "Why you collect it",
                  desc: "The legal basis for processing: contract fulfillment, consent, legitimate interest, or legal obligation (GDPR Articles 6 and 9).",
                },
                {
                  title: "Third-party services",
                  desc: "Every service that receives user data — analytics providers, payment processors, email services, cloud storage, AI APIs.",
                },
                {
                  title: "Data retention periods",
                  desc: "How long each category of data is stored and when it is deleted.",
                },
                {
                  title: "User rights",
                  desc: "Right to access, correct, delete, port, and restrict processing of personal data. GDPR Articles 15-22, CCPA Section 1798.100-135.",
                },
                {
                  title: "International transfers",
                  desc: "If data crosses borders — especially from the EU to the US — you must disclose the transfer mechanisms (SCCs, adequacy decisions).",
                },
                {
                  title: "Cookie disclosures",
                  desc: "What cookies and tracking technologies are used, their purpose, and how users can control them.",
                },
                {
                  title: "Contact information",
                  desc: "How users reach your data controller or DPO to exercise their rights or file complaints.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border border-border-subtle rounded-lg px-5 py-4"
                >
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-ink-secondary text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-ink-secondary text-sm mt-4">
              Getting even one of these wrong — or omitting a section entirely —
              can mean non-compliance. The challenge is that most developers do
              not know which services in their codebase trigger which
              disclosures.
            </p>
          </section>

          {/* How Codepliant generates it */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              How Codepliant generates your privacy policy from code
            </h2>
            <p className="text-ink-secondary mb-6">
              Instead of asking you questions, Codepliant reads your project and
              figures out the answers itself. Here is what happens when you run
              the CLI:
            </p>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Scan dependencies and imports",
                  desc: "Codepliant reads your package.json, requirements.txt, go.mod, Cargo.toml, Podfile, or equivalent. It also scans source code imports to catch services that are not listed as direct dependencies.",
                },
                {
                  step: "2",
                  title: "Detect services and data flows",
                  desc: "Each detected package is matched against a database of service signatures. Stripe triggers payment data disclosures. PostHog triggers analytics disclosures. Sentry triggers error monitoring disclosures. Every service maps to specific data categories.",
                },
                {
                  step: "3",
                  title: "Map legal obligations",
                  desc: "Codepliant assigns a GDPR legal basis to each service category — consent for analytics, contract for payments, legitimate interest for error monitoring. It detects US-based providers that require international transfer disclosures.",
                },
                {
                  step: "4",
                  title: "Generate the document",
                  desc: "The privacy policy is assembled with sections tailored to your actual stack. It names your specific services, lists the data they collect, and includes the correct legal basis for each. No generic placeholders.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-surface-primary flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">
                      {item.title}
                    </h3>
                    <p className="text-ink-secondary text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* What Codepliant detects */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              What Codepliant detects in your code
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Database schemas & ORM models",
                "Authentication flows (Clerk, Auth0, Firebase Auth)",
                "Analytics SDKs (PostHog, Mixpanel, Amplitude)",
                "Payment processors (Stripe, PayPal)",
                "Email services (SendGrid, Resend, Postmark)",
                "Cloud storage (AWS S3, Cloudinary, UploadThing)",
                "AI APIs (OpenAI, Anthropic, Google AI)",
                "Error monitoring (Sentry, Datadog, LogRocket)",
                "Cookie & session usage",
                "Feature flags (LaunchDarkly, Statsig)",
                "CRM & support (Intercom, HubSpot)",
                "Push notifications (OneSignal, Firebase)",
              ].map((item) => (
                <div
                  key={item}
                  className="bg-surface-secondary rounded-lg px-4 py-3 text-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Before/After comparison */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Generic template vs. Codepliant-generated
            </h2>
            <p className="text-ink-secondary mb-6">
              Here is the difference between a typical privacy policy template
              and what Codepliant produces for the same codebase — a Next.js SaaS
              app using Stripe, PostHog, Clerk, and Sentry.
            </p>

            <div className="space-y-6">
              {/* Before: Generic template */}
              <div className="border border-border-subtle rounded-lg overflow-hidden">
                <div className="bg-surface-secondary px-5 py-3 border-b border-border-subtle flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-sm font-medium text-ink-secondary">
                    Generic template
                  </span>
                </div>
                <div className="px-5 py-4 text-sm space-y-3 font-mono text-ink-secondary leading-relaxed">
                  <p>
                    <span className="text-ink-primary font-semibold">
                      Information We Collect
                    </span>
                  </p>
                  <p>
                    We may collect personal information that you provide to us,
                    such as your name, email address, and payment information. We
                    may also collect information automatically, including usage
                    data and cookies.
                  </p>
                  <p>
                    <span className="text-ink-primary font-semibold">
                      Third-Party Services
                    </span>
                  </p>
                  <p>
                    We may use third-party service providers to facilitate our
                    service. These third parties have access to your personal
                    information only to perform tasks on our behalf.
                  </p>
                  <p>
                    <span className="text-ink-primary font-semibold">
                      Data Retention
                    </span>
                  </p>
                  <p>
                    We will retain your personal information for as long as
                    necessary to fulfill the purposes outlined in this policy.
                  </p>
                </div>
              </div>

              {/* After: Codepliant-generated */}
              <div className="border-2 border-brand rounded-lg overflow-hidden">
                <div className="bg-brand/5 px-5 py-3 border-b border-brand/20 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-brand" />
                  <span className="text-sm font-medium text-brand">
                    Codepliant-generated
                  </span>
                </div>
                <div className="px-5 py-4 text-sm space-y-3 font-mono text-ink-secondary leading-relaxed">
                  <p>
                    <span className="text-ink-primary font-semibold">
                      Information We Collect
                    </span>
                  </p>
                  <p>
                    <strong className="text-ink-primary">
                      Account data (via Clerk):
                    </strong>{" "}
                    Name, email address, profile photo, OAuth tokens.{" "}
                    <em>Legal basis: Contract (Art. 6(1)(b)).</em>
                  </p>
                  <p>
                    <strong className="text-ink-primary">
                      Payment data (via Stripe):
                    </strong>{" "}
                    Card details (processed by Stripe — we do not store card
                    numbers), billing address, transaction history.{" "}
                    <em>Legal basis: Contract (Art. 6(1)(b)).</em>
                  </p>
                  <p>
                    <strong className="text-ink-primary">
                      Analytics data (via PostHog):
                    </strong>{" "}
                    Page views, feature usage, session duration, device type, IP
                    address (anonymized).{" "}
                    <em>Legal basis: Consent (Art. 6(1)(a)).</em>
                  </p>
                  <p>
                    <strong className="text-ink-primary">
                      Error reports (via Sentry):
                    </strong>{" "}
                    Stack traces, browser metadata, request URLs.{" "}
                    <em>Legal basis: Legitimate Interest (Art. 6(1)(f)).</em>
                  </p>
                  <p>
                    <span className="text-ink-primary font-semibold">
                      International Data Transfers
                    </span>
                  </p>
                  <p>
                    Your data is transferred to the United States via the
                    following processors: Stripe, Inc. (San Francisco, CA),
                    PostHog, Inc. (San Francisco, CA), Clerk, Inc. (San
                    Francisco, CA), Sentry (San Francisco, CA). Transfers are
                    governed by Standard Contractual Clauses (SCCs).
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-surface-secondary rounded-lg px-5 py-4">
              <p className="text-sm text-ink-secondary">
                <strong className="text-ink-primary">The difference:</strong> The
                generic template says &quot;we may use third-party service
                providers.&quot; Codepliant names Stripe, PostHog, Clerk, and
                Sentry — because it found them in your code. It lists the exact
                data each service collects and the GDPR legal basis for each
                processing activity. No &quot;may&quot; or &quot;might&quot; —
                just what your code actually does.
              </p>
            </div>
          </section>

          {/* Why questionnaires fail */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Why questionnaire-based generators fall short
            </h2>
            <div className="space-y-4">
              {[
                {
                  problem: "They rely on self-reporting",
                  detail:
                    "You have to know every service that touches user data. Miss one analytics SDK or monitoring tool and your policy has a gap.",
                },
                {
                  problem: "They go stale immediately",
                  detail:
                    "The moment a developer adds a new dependency — say, Sentry for error tracking — the privacy policy is out of date. Nobody remembers to update the questionnaire.",
                },
                {
                  problem: "They use generic language",
                  detail:
                    "\"We may use third-party analytics\" is not compliant under GDPR. Regulators expect you to name specific processors and describe specific data flows.",
                },
                {
                  problem: "They do not map legal bases",
                  detail:
                    "GDPR requires a legal basis for each processing activity (Article 6). Generic generators lump everything together or skip this entirely.",
                },
              ].map((item) => (
                <div
                  key={item.problem}
                  className="border border-border-subtle rounded-lg px-5 py-4"
                >
                  <h3 className="font-semibold text-sm mb-1">
                    {item.problem}
                  </h3>
                  <p className="text-ink-secondary text-sm">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Regulation coverage */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Regulation-aware output
            </h2>
            <p className="text-ink-secondary mb-6">
              Codepliant generates privacy policies that address requirements
              from multiple regulations simultaneously:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  reg: "GDPR (EU)",
                  items:
                    "Legal basis per processing activity, data subject rights (Articles 15-22), DPO contact, international transfer disclosures, data retention periods",
                },
                {
                  reg: "CCPA / CPRA (California)",
                  items:
                    "Right to know, right to delete, right to opt-out of sale, \"Do Not Sell\" disclosures, financial incentive disclosures",
                },
                {
                  reg: "LGPD (Brazil)",
                  items:
                    "Legal basis mapping, data subject rights, international transfer disclosures, DPO equivalent (encarregado) contact",
                },
                {
                  reg: "PIPEDA (Canada)",
                  items:
                    "Consent requirements, purpose limitation, data retention, individual access rights",
                },
              ].map((item) => (
                <div
                  key={item.reg}
                  className="bg-surface-secondary rounded-lg px-5 py-4"
                >
                  <h3 className="font-semibold text-sm mb-2 text-brand">
                    {item.reg}
                  </h3>
                  <p className="text-ink-secondary text-sm">{item.items}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-surface-secondary rounded-lg p-8 text-center mb-16">
            <h2 className="text-xl font-bold mb-3">
              Generate your privacy policy in seconds
            </h2>
            <p className="text-ink-secondary text-sm mb-2 max-w-md mx-auto">
              Scan your codebase. Get a privacy policy that names your actual
              services, maps legal bases, and covers GDPR, CCPA, and LGPD
              requirements.
            </p>
            <p className="text-ink-secondary text-xs mb-6">
              Free, open source, no account required. Works offline.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-lg font-mono text-sm inline-block">
              npx codepliant go
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-semibold text-sm mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-ink-secondary text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related pages */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Related resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "GDPR Compliance Tool",
                  href: "/gdpr-compliance",
                  desc: "Full GDPR documentation suite from code scanning.",
                },
                {
                  title: "Cookie Policy Generator",
                  href: "/cookie-policy-generator",
                  desc: "Generate cookie policies from detected tracking SDKs.",
                },
                {
                  title: "Data Privacy Hub",
                  href: "/data-privacy",
                  desc: "Overview of global privacy regulations and compliance.",
                },
                {
                  title: "Privacy Policy for SaaS (Blog)",
                  href: "/blog/privacy-policy-for-saas",
                  desc: "Guide to writing a privacy policy for SaaS products.",
                },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block border border-border-subtle rounded-lg px-5 py-4 hover:border-brand transition-colors"
                >
                  <h3 className="font-semibold text-sm mb-1">{link.title}</h3>
                  <p className="text-ink-secondary text-sm">{link.desc}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
