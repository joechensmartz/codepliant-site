import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Terms of Service Generator for SaaS | Generate from Code",
  description:
    "Terms of service generator for SaaS apps. Scans your code to detect payments, auth, and AI, then generates ToS with liability and IP clauses. Free CLI.",
  keywords: [
    "terms of service generator",
    "terms of service generator for SaaS",
    "generate terms of service from code",
    "terms of service for SaaS",
    "SaaS terms of service",
    "limitation of liability clause",
    "arbitration clause generator",
    "intellectual property terms",
    "termination clause",
    "automated terms of service",
    "developer terms of service",
    "open source terms of service generator",
  ],
  alternates: {
    canonical: "https://codepliant.dev/terms-of-service-generator",
  },
  openGraph: {
    title: "Terms of Service Generator for SaaS",
    description:
      "Terms of service generator for SaaS apps. Scans your code to detect payments, auth, and AI, then generates ToS with liability and IP clauses. Free CLI.",
    url: "https://codepliant.dev/terms-of-service-generator",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Codepliant — Compliance Documents from Your Code" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service Generator for SaaS",
    description:
      "Scan your code, generate accurate terms of service. No questionnaires, no legal fees.",
    images: ["/opengraph-image"],
  },
};

const faqs = [
  {
    question:
      "What makes this different from other terms of service generators?",
    answer:
      "Most terms of service generators use a questionnaire to ask about your product. Codepliant scans your actual source code — dependencies, imports, environment variables, and configuration files — to detect what your application does. If you process payments via Stripe, it generates payment terms referencing Stripe. If you use OpenAI, it generates AI-specific clauses. The result is a terms of service based on what your code actually does, not what you remember to tell a form.",
  },
  {
    question: "What must a SaaS terms of service contain?",
    answer:
      "A SaaS terms of service should include: a clear service description, account registration and eligibility requirements, acceptable use policy, payment and billing terms (if applicable), intellectual property ownership and license grants, user-generated content rights, limitation of liability and warranty disclaimers, indemnification, dispute resolution (arbitration or litigation), termination and suspension rights, data handling references (linking to your privacy policy), modification and notice procedures, and governing law. Missing any of these exposes you to legal risk.",
  },
  {
    question: "Does Codepliant generate enforceable terms of service?",
    answer:
      "Codepliant generates terms of service that include the clauses courts and regulators expect to see — limitation of liability, arbitration, IP ownership, termination rights, and service-specific disclosures. However, enforceability depends on your jurisdiction, how you present the terms (clickwrap vs browsewrap), and your specific business model. You should have a lawyer review the output before publishing.",
  },
  {
    question: "What languages and frameworks does Codepliant support?",
    answer:
      "Codepliant scans codebases in TypeScript, JavaScript, Python, Go, Ruby, Rust, Java, PHP, Swift, Kotlin, and Terraform. It detects services across all major ecosystems including npm, pip, Go modules, Cargo, Composer, CocoaPods, and more.",
  },
  {
    question: "Is this free to use?",
    answer:
      "Yes. The CLI is open source (MIT licensed) and free. Run npx codepliant go in your project directory and the terms of service is generated locally — no account, no API key, no network calls.",
  },
  {
    question: "How does Codepliant know which clauses to include?",
    answer:
      "Codepliant maps detected services to clause requirements. If it finds Stripe in your dependencies, it adds payment terms and refund policy sections. If it detects authentication (Clerk, Auth0, Firebase Auth), it adds account registration terms. If it finds AI APIs (OpenAI, Anthropic), it adds AI-specific usage disclaimers and output ownership clauses. Each service category triggers the relevant legal clauses.",
  },
  {
    question: "Can I customize the generated terms?",
    answer:
      "Yes. You can configure Codepliant with a .codepliantrc.json file to set your company name, jurisdiction, contact email, and other details. The generated Markdown file can be edited further before publishing. You can also run codepliant diff to see what changed when you regenerate after adding new services.",
  },
  {
    question: "How often should I update my terms of service?",
    answer:
      "Update your terms of service whenever you add new features that change the user relationship — payment processing, AI features, user-generated content, new third-party integrations. Run codepliant diff to see what changed. Many teams add Codepliant to their CI pipeline to catch when new dependencies require terms updates.",
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
    name: "Codepliant Terms of Service Generator",
    version: "1.1.0",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows",
    description:
      "Terms of service generator for SaaS that scans your codebase to detect payment processing, user accounts, AI features, and third-party integrations. Generates accurate, clause-specific terms of service.",
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
        item: "https://codepliant.dev",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Terms of Service Generator",
        item: "https://codepliant.dev/terms-of-service-generator",
      },
    ],
  };
}

export default function TermsOfServiceGenerator() {
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
                Terms of Service Generator
              </li>
            </ol>
          </nav>

          <p className="text-sm font-medium text-brand mb-4 tracking-wide uppercase">
            Document Generator
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            Terms of Service Generator for SaaS
          </h1>
          <p className="text-lg text-ink-secondary mb-12">
            Most terms of service generators hand you a generic template full of
            placeholder language. Codepliant takes a different approach — it
            scans your actual codebase to understand what your SaaS product
            does, which services it integrates, and how users interact with it.
            The result is terms of service with clauses tailored to your
            application, not a one-size-fits-all document.
          </p>

          {/* What a SaaS ToS must contain */}
          <section className="mb-16" id="what-tos-must-contain">
            <h2 className="text-2xl font-bold tracking-tight mb-4 scroll-mt-24">
              What a SaaS terms of service must contain
            </h2>
            <p className="text-ink-secondary mb-6">
              A terms of service agreement is the legal contract between you and
              your users. For SaaS products, it must address concerns that
              static software licenses do not — uptime, data access,
              subscription billing, and service modifications. Courts have
              increasingly scrutinized SaaS terms, and missing clauses can make
              your entire agreement unenforceable.
            </p>
            <div className="space-y-4">
              {[
                {
                  title: "Service description and scope",
                  desc: "Define exactly what your service provides, what it does not, and any usage limits. Vague descriptions lead to user disputes and make limitation of liability clauses harder to enforce.",
                },
                {
                  title: "Account registration and eligibility",
                  desc: "Age requirements, account responsibility, credential security, and what happens when accounts are shared. Required if your app uses any authentication service.",
                },
                {
                  title: "Payment and billing terms",
                  desc: "Subscription pricing, billing cycles, refund policies, free trial conversions, and what happens when payments fail. Required if you process payments through Stripe, PayPal, or any payment gateway.",
                },
                {
                  title: "Acceptable use policy",
                  desc: "What users can and cannot do with your service — prohibited content, rate limits, API abuse, reverse engineering restrictions. Essential for any SaaS with user-facing features.",
                },
                {
                  title: "Intellectual property rights",
                  desc: "Who owns the service, who owns user content, license grants in both directions, and restrictions on derivative works. One of the most litigated areas of SaaS agreements.",
                },
                {
                  title: "Limitation of liability",
                  desc: "Caps on damages, disclaimer of consequential damages, warranty disclaimers. Without this clause, you face unlimited liability for service failures.",
                },
                {
                  title: "Dispute resolution",
                  desc: "Arbitration vs. litigation, class action waiver, governing law, jurisdiction. Arbitration clauses must comply with the Federal Arbitration Act and state-specific requirements.",
                },
                {
                  title: "Termination and suspension",
                  desc: "When you can terminate accounts, what happens to user data after termination, notice requirements, and data export rights. GDPR and CCPA impose specific post-termination data obligations.",
                },
                {
                  title: "Data handling reference",
                  desc: "Link to your privacy policy, explain how the ToS and privacy policy interact, and address data processing addenda for enterprise customers.",
                },
                {
                  title: "Modification and notice",
                  desc: "How you will notify users of ToS changes, how much advance notice you provide, and whether continued use constitutes acceptance. Courts have struck down ToS that changed without adequate notice.",
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
              The specific clauses your terms need depend on what your
              application actually does. A SaaS product that processes payments
              needs different terms than one that only provides free API access.
              This is why scanning your code matters — it determines which
              clauses are required for your specific product.
            </p>
          </section>

          {/* Key clauses deep dive */}
          <section className="mb-16" id="key-clauses">
            <h2 className="text-2xl font-bold tracking-tight mb-4 scroll-mt-24">
              Key clauses Codepliant generates
            </h2>
            <p className="text-ink-secondary mb-6">
              These four clauses are where generic templates fail most often.
              Each requires specificity to be enforceable, and each depends on
              what your application actually does.
            </p>
            <div className="space-y-6">
              {[
                {
                  title: "Limitation of liability",
                  detail:
                    "Generic templates use blanket disclaimers that courts routinely strike down. Codepliant generates limitation of liability clauses scoped to your actual service — if you process payments, the liability cap references transaction amounts. If you provide AI outputs, the disclaimer addresses accuracy limitations specific to AI-generated content. The clause distinguishes between direct and consequential damages and includes the warranty disclaimers your jurisdiction requires.",
                },
                {
                  title: "Arbitration and dispute resolution",
                  detail:
                    "An enforceable arbitration clause requires specificity: which arbitration body (AAA, JAMS), what rules apply, where arbitration occurs, who pays filing fees, and whether class arbitration is permitted. Codepliant generates these details based on your configured jurisdiction and includes the opt-out notice period that courts require to make arbitration clauses enforceable in consumer-facing SaaS.",
                },
                {
                  title: "Intellectual property",
                  detail:
                    "IP clauses must address two directions: your ownership of the service and the license users grant you over their content. If Codepliant detects user-generated content features (file uploads, text inputs stored in databases), it generates content license clauses. If it detects AI APIs, it addresses ownership of AI-generated outputs — a rapidly evolving legal area where silence in your ToS creates ambiguity.",
                },
                {
                  title: "Termination and data handling",
                  detail:
                    "Termination clauses must specify what happens to user data after account closure. If Codepliant detects databases and cloud storage, it generates data retention and export provisions. If it detects payment processing, it addresses refund obligations on termination. GDPR Article 17 (right to erasure) and CCPA Section 1798.105 impose specific deletion requirements that generic templates rarely address.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border border-border-subtle rounded-lg px-5 py-4"
                >
                  <h3 className="font-semibold text-sm mb-2 text-brand">
                    {item.title}
                  </h3>
                  <p className="text-ink-secondary text-sm">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How Codepliant generates it */}
          <section className="mb-16" id="how-it-works">
            <h2 className="text-2xl font-bold tracking-tight mb-4 scroll-mt-24">
              How Codepliant generates terms of service from code
            </h2>
            <p className="text-ink-secondary mb-6">
              Instead of asking you questions about your product, Codepliant
              reads your project and figures out the answers itself. Here is
              what happens when you run the CLI:
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
                  title: "Detect services and capabilities",
                  desc: "Each detected package is matched against a database of service signatures. Stripe triggers payment terms. Clerk or Auth0 trigger account registration clauses. OpenAI triggers AI usage disclaimers. S3 or Cloudinary trigger content storage terms. Every service maps to specific ToS clauses.",
                },
                {
                  step: "3",
                  title: "Map clauses to detected features",
                  desc: "Codepliant assembles the required clauses based on what it found. Payment processing means billing terms, refund policy, and payment failure handling. User authentication means account terms, credential responsibilities, and eligibility. AI features mean output disclaimers and IP ownership clauses for generated content.",
                },
                {
                  step: "4",
                  title: "Generate the document",
                  desc: "The terms of service is assembled with clauses tailored to your actual stack. It references your specific services, includes the correct limitation of liability scope, and covers the termination and data handling obligations your integrations require. No generic placeholders.",
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
          <section className="mb-16" id="detections">
            <h2 className="text-2xl font-bold tracking-tight mb-4 scroll-mt-24">
              Services that trigger ToS clauses
            </h2>
            <p className="text-ink-secondary mb-6">
              Each detected service maps to specific terms of service
              requirements. Here is what Codepliant looks for and which
              clauses each detection triggers:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  service: "Payment processors (Stripe, PayPal)",
                  clause: "Billing terms, refund policy, payment failure handling",
                },
                {
                  service: "Auth providers (Clerk, Auth0, Firebase Auth)",
                  clause: "Account registration, eligibility, credential security",
                },
                {
                  service: "AI APIs (OpenAI, Anthropic, Google AI)",
                  clause: "AI output disclaimers, accuracy limitations, IP ownership",
                },
                {
                  service: "Cloud storage (S3, Cloudinary, UploadThing)",
                  clause: "Content ownership, storage limits, data retention",
                },
                {
                  service: "Databases & ORMs (Prisma, Drizzle, Mongoose)",
                  clause: "Data handling, export rights, deletion obligations",
                },
                {
                  service: "Email services (SendGrid, Resend, Postmark)",
                  clause: "Communication consent, notification preferences",
                },
                {
                  service: "Analytics (PostHog, Mixpanel, Amplitude)",
                  clause: "Tracking disclosures, opt-out mechanisms",
                },
                {
                  service: "Error monitoring (Sentry, Datadog, LogRocket)",
                  clause: "Diagnostic data collection, session recording notice",
                },
                {
                  service: "CRM & support (Intercom, HubSpot)",
                  clause: "Support data processing, chat data retention",
                },
                {
                  service: "Feature flags (LaunchDarkly, Statsig)",
                  clause: "Service modification rights, beta feature disclaimers",
                },
              ].map((item) => (
                <div
                  key={item.service}
                  className="bg-surface-secondary rounded-lg px-4 py-3"
                >
                  <p className="text-sm font-semibold mb-1">{item.service}</p>
                  <p className="text-xs text-ink-secondary">{item.clause}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Before/After comparison */}
          <section className="mb-16" id="before-after">
            <h2 className="text-2xl font-bold tracking-tight mb-4 scroll-mt-24">
              Generic template vs. Codepliant-generated
            </h2>
            <p className="text-ink-secondary mb-6">
              Here is the difference between a typical terms of service template
              and what Codepliant produces for the same codebase — a Next.js
              SaaS app using Stripe, Clerk, OpenAI, and Sentry.
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
                      Payment Terms
                    </span>
                  </p>
                  <p>
                    You agree to pay all fees associated with your use of the
                    Service. All payments are non-refundable unless otherwise
                    required by law.
                  </p>
                  <p>
                    <span className="text-ink-primary font-semibold">
                      Limitation of Liability
                    </span>
                  </p>
                  <p>
                    To the maximum extent permitted by law, the Company shall
                    not be liable for any indirect, incidental, special, or
                    consequential damages arising from your use of the Service.
                  </p>
                  <p>
                    <span className="text-ink-primary font-semibold">
                      Intellectual Property
                    </span>
                  </p>
                  <p>
                    All content, features, and functionality of the Service are
                    owned by the Company and are protected by intellectual
                    property laws.
                  </p>
                  <p>
                    <span className="text-ink-primary font-semibold">
                      Termination
                    </span>
                  </p>
                  <p>
                    We may terminate your access to the Service at any time, for
                    any reason, with or without notice.
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
                      Payment Terms
                    </span>
                  </p>
                  <p>
                    <strong className="text-ink-primary">
                      Payment processing (via Stripe):
                    </strong>{" "}
                    Subscription fees are billed in advance on a monthly basis.
                    Payment is processed by Stripe, Inc. — we do not store your
                    credit card number. Failed payments are retried per
                    Stripe&apos;s retry schedule. You may cancel your subscription
                    at any time; access continues until the end of your current
                    billing period. Refunds are available within 14 days of
                    initial purchase.
                  </p>
                  <p>
                    <span className="text-ink-primary font-semibold">
                      Limitation of Liability
                    </span>
                  </p>
                  <p>
                    <strong className="text-ink-primary">
                      Service liability cap:
                    </strong>{" "}
                    Our total liability for any claims arising from your use of
                    the Service is limited to the amounts you paid us in the 12
                    months preceding the claim.{" "}
                    <strong className="text-ink-primary">
                      AI output disclaimer (OpenAI integration detected):
                    </strong>{" "}
                    AI-generated content is provided &quot;as is&quot; without
                    warranty of accuracy, completeness, or fitness for any
                    purpose. You are solely responsible for reviewing and
                    validating any AI-generated outputs before reliance.
                  </p>
                  <p>
                    <span className="text-ink-primary font-semibold">
                      Intellectual Property
                    </span>
                  </p>
                  <p>
                    <strong className="text-ink-primary">
                      Service ownership:
                    </strong>{" "}
                    The Service, including all source code, algorithms, and
                    documentation, is owned by the Company.{" "}
                    <strong className="text-ink-primary">
                      User content license:
                    </strong>{" "}
                    You retain ownership of content you upload. You grant us a
                    limited license to process, store, and display your content
                    as necessary to provide the Service.{" "}
                    <strong className="text-ink-primary">
                      AI-generated output:
                    </strong>{" "}
                    Ownership of AI-generated content is subject to evolving
                    intellectual property law. We make no claim of ownership
                    over outputs generated using your inputs.
                  </p>
                  <p>
                    <span className="text-ink-primary font-semibold">
                      Termination
                    </span>
                  </p>
                  <p>
                    <strong className="text-ink-primary">
                      Account termination (Clerk integration detected):
                    </strong>{" "}
                    We may suspend or terminate your account for violation of
                    these terms with 30 days written notice (immediate for
                    security violations).{" "}
                    <strong className="text-ink-primary">
                      Post-termination data:
                    </strong>{" "}
                    Upon termination, you may export your data within 30 days.
                    After this period, your data is permanently deleted per our
                    data retention policy and applicable GDPR/CCPA obligations.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-surface-secondary rounded-lg px-5 py-4">
              <p className="text-sm text-ink-secondary">
                <strong className="text-ink-primary">The difference:</strong>{" "}
                The generic template says &quot;we may terminate your access at
                any time, for any reason.&quot; Codepliant generates specific
                notice periods, data export windows, and post-termination
                deletion obligations — because it detected Clerk for
                authentication, Stripe for payments, and databases that store
                user data. It also adds AI output disclaimers because it found
                OpenAI in your dependencies, something a generic template would
                never include.
              </p>
            </div>
          </section>

          {/* Why generic templates fail */}
          <section className="mb-16" id="why-templates-fail">
            <h2 className="text-2xl font-bold tracking-tight mb-4 scroll-mt-24">
              Why generic terms of service templates fail for SaaS
            </h2>
            <div className="space-y-4">
              {[
                {
                  problem: "They do not reflect your actual product",
                  detail:
                    "A SaaS product that processes payments, uses AI, and stores user files has fundamentally different legal obligations than a static website. Generic templates treat them identically.",
                },
                {
                  problem: "Limitation of liability is too vague",
                  detail:
                    "Courts have struck down limitation of liability clauses that are overly broad or unconscionable. Effective clauses must be proportionate to the service provided and reference specific liability caps tied to fees paid.",
                },
                {
                  problem: "They miss AI-specific clauses entirely",
                  detail:
                    "If your product uses AI APIs, your terms need output accuracy disclaimers, IP ownership clauses for generated content, and usage restrictions. No template written before 2023 includes these, and most current ones are inadequate.",
                },
                {
                  problem: "Termination rights are one-sided",
                  detail:
                    "\"We can terminate at any time for any reason\" is increasingly challenged in court, especially in consumer-facing SaaS. Modern terms need notice periods, data export windows, and compliance with data deletion regulations.",
                },
                {
                  problem: "They go stale when your stack changes",
                  detail:
                    "You add Stripe to handle payments, but your terms still say nothing about billing. You integrate OpenAI, but your terms do not mention AI. Every new dependency can create a gap between your terms and your product.",
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

          {/* CTA */}
          <section className="bg-surface-secondary rounded-lg p-8 text-center mb-16">
            <h2 className="text-xl font-bold mb-3">
              Generate your terms of service in seconds
            </h2>
            <p className="text-ink-secondary text-sm mb-2 max-w-md mx-auto">
              Scan your codebase. Get terms of service with clauses tailored to
              your actual services — payment terms for Stripe, AI disclaimers
              for OpenAI, account terms for Clerk.
            </p>
            <p className="text-ink-secondary text-xs mb-6">
              Free, open source, no account required. Works offline.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-lg font-mono text-sm inline-block">
              npx codepliant go
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-ink-secondary">
              <a
                href="https://github.com/joechensmartz/codepliant"
                className="hover:text-brand transition-colors"
              >
                GitHub
              </a>
              <span aria-hidden="true">|</span>
              <a
                href="https://www.npmjs.com/package/codepliant"
                className="hover:text-brand transition-colors"
              >
                npm
              </a>
              <span aria-hidden="true">|</span>
              <a
                href="/docs"
                className="hover:text-brand transition-colors"
              >
                Docs
              </a>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16" id="faq">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
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
                  title: "Privacy Policy Generator",
                  href: "/privacy-policy-generator",
                  desc: "Generate privacy policies from detected data practices and third-party services.",
                },
                {
                  title: "Cookie Policy Generator",
                  href: "/cookie-policy-generator",
                  desc: "Generate cookie policies from detected tracking SDKs and analytics.",
                },
                {
                  title: "GDPR Compliance Tool",
                  href: "/gdpr-compliance",
                  desc: "Full GDPR documentation suite from code scanning.",
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
