import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Cookie Policy Generator for Developers | Generate from Code | Codepliant",
  description:
    "Generate a cookie policy by scanning your codebase. Codepliant detects cookies, tracking scripts, analytics SDKs, and session storage to produce an accurate cookie policy compliant with the ePrivacy Directive and GDPR.",
  keywords: [
    "cookie policy generator",
    "cookie policy generator for developers",
    "generate cookie policy from code",
    "cookie policy for websites",
    "cookie policy for SaaS",
    "GDPR cookie policy",
    "ePrivacy Directive cookie policy",
    "automated cookie policy",
    "cookie consent compliance",
    "cookie types explained",
    "essential cookies",
    "analytics cookies",
    "marketing cookies",
    "open source cookie policy generator",
  ],
  alternates: {
    canonical: "https://codepliant.dev/cookie-policy-generator",
  },
  openGraph: {
    title: "Cookie Policy Generator for Developers",
    description:
      "Generate cookie policies from your actual codebase. Detect tracking, analytics, session cookies, and third-party scripts automatically. Free, open source.",
    url: "https://codepliant.dev/cookie-policy-generator",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy Generator for Developers",
    description:
      "Scan your code, generate an accurate cookie policy. No questionnaires, no guesswork.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "What is the ePrivacy Directive and how does it affect cookies?",
    answer:
      "The ePrivacy Directive (2002/58/EC, amended by 2009/136/EC) — often called the \"Cookie Law\" — requires websites to obtain informed consent before placing non-essential cookies on a user's device. It works alongside GDPR: the ePrivacy Directive governs the act of storing or accessing cookies, while GDPR governs the processing of any personal data those cookies collect. Codepliant detects cookie-setting services in your code so your policy accurately reflects what cookies are placed and why.",
  },
  {
    question: "What is the difference between a cookie policy and a privacy policy?",
    answer:
      "A privacy policy covers all personal data processing — collection, storage, sharing, retention, and user rights. A cookie policy is specifically about cookies and similar tracking technologies: what cookies your site sets, their purpose, their duration, and how users can manage them. Many regulators expect both documents. Codepliant generates each one separately, tailored to your actual codebase.",
  },
  {
    question: "Does Codepliant detect all four types of cookies?",
    answer:
      "Yes. Codepliant categorizes detected cookies into four types: essential (session management, authentication, CSRF tokens), analytics (Google Analytics, PostHog, Mixpanel), marketing (Facebook Pixel, Google Ads, LinkedIn Insight Tag), and preferences (language settings, theme choices, feature flags). Each category is listed in the generated policy with the correct consent requirements.",
  },
  {
    question: "How does Codepliant detect cookie-setting services?",
    answer:
      "Codepliant scans your package.json (or equivalent), source code imports, and environment variables. It matches against a database of service signatures — for example, detecting @google-analytics/data or gtag.js in your code triggers analytics cookie disclosures. It also detects session middleware, authentication libraries, and consent management platforms.",
  },
  {
    question: "Do essential cookies require consent?",
    answer:
      "No. Under the ePrivacy Directive, strictly necessary cookies — those required for the service the user explicitly requested — are exempt from consent requirements. This includes session cookies, authentication tokens, CSRF protection, and shopping cart cookies. However, you must still disclose them in your cookie policy. Codepliant marks these as essential so users understand no consent is needed.",
  },
  {
    question: "How often should I regenerate my cookie policy?",
    answer:
      "Regenerate whenever you add or remove analytics, marketing, or tracking services. Adding Google Analytics, switching from Mixpanel to PostHog, or integrating a new consent management platform all change your cookie footprint. Use codepliant diff to see what changed since the last generation. Many teams add Codepliant to their CI pipeline to catch changes automatically.",
  },
  {
    question: "Is this free to use?",
    answer:
      "Yes. The CLI is open source (MIT licensed) and free. Run npx codepliant go in your project directory and the cookie policy is generated locally — no account, no API key, no network calls.",
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
    name: "Codepliant Cookie Policy Generator",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows",
    description:
      "Cookie policy generator for developers that scans your codebase to detect cookies, tracking scripts, analytics SDKs, and session storage. Generates accurate, ePrivacy-compliant cookie policies.",
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
        name: "Cookie Policy Generator",
        item: "https://codepliant.dev/cookie-policy-generator",
      },
    ],
  };
}

export default function CookiePolicyGenerator() {
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

      <article className="py-20 px-6">
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
                Cookie Policy Generator
              </li>
            </ol>
          </nav>

          <p className="text-sm font-medium text-brand mb-4 tracking-wide uppercase">
            Document Generator
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            Cookie Policy Generator from Your Code
          </h1>
          <p className="text-lg text-ink-secondary mb-12">
            The ePrivacy Directive and GDPR require you to inform users about
            every cookie and tracking technology your site uses. Most cookie
            policy generators ask you to list them manually. Codepliant scans
            your codebase to detect cookie-setting services, analytics SDKs,
            tracking scripts, and session storage — then generates an accurate
            cookie policy based on what your code actually does.
          </p>

          {/* What a cookie policy must contain */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              What a cookie policy must contain
            </h2>
            <p className="text-ink-secondary mb-6">
              The ePrivacy Directive (2002/58/EC) and GDPR set specific
              requirements for cookie disclosures. Every compliant cookie policy
              must address these elements:
            </p>
            <div className="space-y-4">
              {[
                {
                  title: "What cookies you set",
                  desc: "A complete list of cookies placed on user devices — first-party and third-party — including their names, domains, and expiration periods.",
                },
                {
                  title: "Purpose of each cookie",
                  desc: "Why each cookie exists: authentication, analytics, advertising, preferences, or security. The ePrivacy Directive requires this disclosure before consent is obtained.",
                },
                {
                  title: "Cookie categories",
                  desc: "Cookies grouped by type: strictly necessary (exempt from consent), analytics and performance, functional/preferences, and targeting/marketing.",
                },
                {
                  title: "Third-party cookies",
                  desc: "Every third party that sets cookies through your site — Google Analytics, Facebook Pixel, ad networks — with links to their own cookie policies.",
                },
                {
                  title: "How users can manage cookies",
                  desc: "Clear instructions for accepting, rejecting, or withdrawing consent. Browser-level controls alone are not sufficient under GDPR — you need a consent mechanism.",
                },
                {
                  title: "Consent mechanism",
                  desc: "How consent is collected (cookie banner, preference center) and how users can change their choices at any time. Pre-ticked checkboxes are not valid consent under GDPR.",
                },
                {
                  title: "Data transfers",
                  desc: "If third-party cookies send data to servers outside the EU/EEA, you must disclose the transfer mechanisms (SCCs, adequacy decisions).",
                },
                {
                  title: "Policy updates",
                  desc: "How and when the cookie policy is updated, and how users are notified of material changes.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border border-border rounded-xl px-5 py-4"
                >
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-ink-secondary text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-ink-secondary text-sm mt-4">
              Missing even one cookie from your policy can constitute
              non-compliance. The challenge is that developers often do not know
              which dependencies set cookies — a single analytics SDK can place
              multiple tracking cookies silently.
            </p>
          </section>

          {/* Types of cookies */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              The four types of cookies
            </h2>
            <p className="text-ink-secondary mb-6">
              Regulators and consent management platforms categorize cookies into
              four types. Each has different consent requirements under the
              ePrivacy Directive:
            </p>
            <div className="space-y-4">
              {[
                {
                  type: "Essential / Strictly Necessary",
                  consent: "No consent required",
                  desc: "Cookies that are strictly necessary for the service the user explicitly requested. Includes session IDs, authentication tokens, CSRF protection, shopping cart state, and load balancer affinity. These are exempt from consent under Article 5(3) of the ePrivacy Directive.",
                  examples:
                    "express-session, next-auth session tokens, connect.sid, CSRF tokens, Clerk session cookies",
                },
                {
                  type: "Analytics / Performance",
                  consent: "Consent required",
                  desc: "Cookies that measure how users interact with your site — page views, session duration, bounce rate, feature usage. Even when data is anonymized, most EU DPAs require consent for analytics cookies.",
                  examples:
                    "Google Analytics (_ga, _gid), PostHog, Mixpanel, Amplitude, Plausible, Fathom",
                },
                {
                  type: "Marketing / Targeting",
                  consent: "Consent required",
                  desc: "Cookies used to track users across websites, build advertising profiles, and serve targeted ads. These always require explicit consent and are the primary enforcement target for regulators.",
                  examples:
                    "Facebook Pixel (_fbp), Google Ads (IDE, _gcl_au), LinkedIn Insight Tag, TikTok Pixel, Twitter conversion tracking",
                },
                {
                  type: "Preferences / Functional",
                  consent: "Consent required",
                  desc: "Cookies that remember user choices like language, theme, layout, or region. Not strictly necessary for the service to function, so consent is required — though enforcement is less aggressive than for marketing cookies.",
                  examples:
                    "Language preferences, dark mode settings, LaunchDarkly feature flags, Statsig, dismissed banners",
                },
              ].map((item) => (
                <div
                  key={item.type}
                  className="border border-border rounded-xl px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-semibold text-sm">{item.type}</h3>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                        item.consent === "No consent required"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.consent}
                    </span>
                  </div>
                  <p className="text-ink-secondary text-sm mb-2">{item.desc}</p>
                  <p className="text-ink-secondary text-xs">
                    <span className="font-medium text-ink-primary">
                      Detected by Codepliant:
                    </span>{" "}
                    {item.examples}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* How Codepliant detects cookie-setting services */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              How Codepliant detects cookie-setting services
            </h2>
            <p className="text-ink-secondary mb-6">
              Instead of asking you to list your cookies, Codepliant reads your
              project and identifies cookie-setting services automatically. Here
              is what happens when you run the CLI:
            </p>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Scan dependencies",
                  desc: "Codepliant reads your package.json, requirements.txt, go.mod, Cargo.toml, Podfile, or equivalent manifest. It identifies packages known to set cookies — analytics SDKs, authentication libraries, advertising pixels, and session middleware.",
                },
                {
                  step: "2",
                  title: "Scan source code imports",
                  desc: "Dependencies alone miss inline scripts and CDN-loaded libraries. Codepliant scans your source files for import statements, require calls, and script tags that reference cookie-setting services like Google Tag Manager, Facebook SDK, or custom tracking code.",
                },
                {
                  step: "3",
                  title: "Scan environment variables",
                  desc: "API keys and tracking IDs in your .env files reveal which services are active. NEXT_PUBLIC_GA_MEASUREMENT_ID means Google Analytics is in use. FACEBOOK_PIXEL_ID means the Meta pixel is loaded. Codepliant maps each env pattern to the correct service.",
                },
                {
                  step: "4",
                  title: "Categorize and map cookies",
                  desc: "Each detected service is mapped to a cookie category (essential, analytics, marketing, preferences) and tagged with the specific cookies it sets. Google Analytics triggers _ga, _gid, and _gat disclosures. Stripe triggers __stripe_mid and __stripe_sid disclosures.",
                },
                {
                  step: "5",
                  title: "Generate the cookie policy",
                  desc: "The policy is assembled with a table of cookies grouped by category, each with its name, purpose, provider, and expiration. It includes the correct consent requirements per category and instructions for managing cookie preferences.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold">
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
              Cookie-setting services Codepliant detects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Google Analytics / GA4 (_ga, _gid)",
                "Google Tag Manager",
                "Facebook Pixel / Meta SDK (_fbp)",
                "Google Ads / AdSense (IDE, _gcl_au)",
                "Segment / Mixpanel / Amplitude",
                "PostHog / Plausible / Fathom",
                "LinkedIn Insight Tag",
                "TikTok Pixel / Twitter Pixel",
                "Stripe (__stripe_mid, __stripe_sid)",
                "Session middleware (express-session, cookie-session)",
                "Authentication (Clerk, Auth0, NextAuth, Firebase Auth)",
                "Consent management platforms (OneTrust, CookieBot, Osano)",
                "Hotjar / FullStory / LogRocket",
                "Intercom / HubSpot / Drift",
                "LaunchDarkly / Statsig feature flags",
                "Sentry error monitoring",
              ].map((item) => (
                <div
                  key={item}
                  className="bg-surface-secondary rounded-xl px-4 py-3 text-sm"
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
              Here is the difference between a typical cookie policy template
              and what Codepliant produces for the same codebase — a Next.js
              SaaS app using Google Analytics, Stripe, Clerk, and Facebook
              Pixel.
            </p>

            <div className="space-y-6">
              {/* Before: Generic template */}
              <div className="border border-border rounded-2xl overflow-hidden">
                <div className="bg-surface-secondary px-5 py-3 border-b border-border flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-sm font-medium text-ink-secondary">
                    Generic template
                  </span>
                </div>
                <div className="px-5 py-4 text-sm space-y-3 font-mono text-ink-secondary leading-relaxed">
                  <p>
                    <span className="text-ink-primary font-semibold">
                      Cookies We Use
                    </span>
                  </p>
                  <p>
                    Our website uses cookies and similar tracking technologies to
                    enhance your browsing experience. We use essential cookies to
                    make the site work, and we may also use analytics and
                    advertising cookies.
                  </p>
                  <p>
                    <span className="text-ink-primary font-semibold">
                      Third-Party Cookies
                    </span>
                  </p>
                  <p>
                    We may use third-party cookies from our advertising and
                    analytics partners. These cookies help us understand how
                    visitors use our website.
                  </p>
                  <p>
                    <span className="text-ink-primary font-semibold">
                      Managing Cookies
                    </span>
                  </p>
                  <p>
                    You can control cookies through your browser settings. Note
                    that disabling cookies may affect site functionality.
                  </p>
                </div>
              </div>

              {/* After: Codepliant-generated */}
              <div className="border-2 border-brand rounded-2xl overflow-hidden">
                <div className="bg-brand/5 px-5 py-3 border-b border-brand/20 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-brand" />
                  <span className="text-sm font-medium text-brand">
                    Codepliant-generated
                  </span>
                </div>
                <div className="px-5 py-4 text-sm space-y-3 font-mono text-ink-secondary leading-relaxed">
                  <p>
                    <span className="text-ink-primary font-semibold">
                      Essential Cookies
                    </span>
                  </p>
                  <p>
                    <strong className="text-ink-primary">
                      __clerk_session (Clerk, Inc.):
                    </strong>{" "}
                    Maintains user authentication state. Duration: session.{" "}
                    <em>No consent required — strictly necessary.</em>
                  </p>
                  <p>
                    <strong className="text-ink-primary">
                      __stripe_mid, __stripe_sid (Stripe, Inc.):
                    </strong>{" "}
                    Fraud prevention for payment processing. Duration: 1 year /
                    session. <em>No consent required — strictly necessary.</em>
                  </p>
                  <p>
                    <span className="text-ink-primary font-semibold">
                      Analytics Cookies
                    </span>
                  </p>
                  <p>
                    <strong className="text-ink-primary">
                      _ga, _gid (Google LLC):
                    </strong>{" "}
                    Distinguishes unique users and tracks session data. Duration:
                    2 years / 24 hours.{" "}
                    <em>Consent required — Article 5(3) ePrivacy Directive.</em>
                  </p>
                  <p>
                    <span className="text-ink-primary font-semibold">
                      Marketing Cookies
                    </span>
                  </p>
                  <p>
                    <strong className="text-ink-primary">
                      _fbp (Meta Platforms, Inc.):
                    </strong>{" "}
                    Tracks users across websites for targeted advertising.
                    Duration: 90 days.{" "}
                    <em>Consent required — Article 5(3) ePrivacy Directive.</em>
                  </p>
                  <p>
                    <span className="text-ink-primary font-semibold">
                      International Data Transfers
                    </span>
                  </p>
                  <p>
                    Cookie data is transferred to the United States via: Google
                    LLC (Mountain View, CA), Meta Platforms, Inc. (Menlo Park,
                    CA), Stripe, Inc. (San Francisco, CA), Clerk, Inc. (San
                    Francisco, CA). Transfers governed by Standard Contractual
                    Clauses.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-surface-secondary rounded-xl px-5 py-4">
              <p className="text-sm text-ink-secondary">
                <strong className="text-ink-primary">The difference:</strong>{" "}
                The generic template says &quot;we may use analytics and
                advertising cookies.&quot; Codepliant names Google Analytics and
                Facebook Pixel — because it found them in your code. It lists
                the specific cookies each service sets, their durations, the
                provider company, and whether consent is required under the
                ePrivacy Directive. No &quot;may&quot; — just what your code
                actually does.
              </p>
            </div>
          </section>

          {/* ePrivacy Directive requirements */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              ePrivacy Directive requirements for cookies
            </h2>
            <p className="text-ink-secondary mb-6">
              Article 5(3) of the ePrivacy Directive sets the rules for storing
              information on user devices. Here is what it requires and how
              Codepliant helps you comply:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  req: "Prior informed consent",
                  detail:
                    "Users must consent before non-essential cookies are set. Codepliant separates essential from non-essential cookies so you know which require consent.",
                },
                {
                  req: "Clear, comprehensive information",
                  detail:
                    "Users must be told what cookies do, who sets them, and how long they last. Codepliant generates this information per cookie from its service signature database.",
                },
                {
                  req: "Freely given consent",
                  detail:
                    "Cookie walls (blocking access unless cookies are accepted) are generally not permitted. Your cookie policy must describe a genuine choice mechanism.",
                },
                {
                  req: "Easy withdrawal",
                  detail:
                    "Withdrawing consent must be as easy as giving it. Codepliant includes instructions for managing preferences through your consent mechanism.",
                },
              ].map((item) => (
                <div
                  key={item.req}
                  className="bg-surface-secondary rounded-xl px-5 py-4"
                >
                  <h3 className="font-semibold text-sm mb-2 text-brand">
                    {item.req}
                  </h3>
                  <p className="text-ink-secondary text-sm">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-surface-secondary rounded-2xl p-8 text-center mb-16">
            <h2 className="text-xl font-bold mb-3">
              Generate your cookie policy in seconds
            </h2>
            <p className="text-ink-secondary text-sm mb-2 max-w-md mx-auto">
              Scan your codebase. Get a cookie policy that names your actual
              tracking services, lists every cookie they set, and categorizes
              them for ePrivacy Directive compliance.
            </p>
            <p className="text-ink-secondary text-xs mb-6">
              Free, open source, no account required. Works offline.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-xl font-mono text-sm inline-block">
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
                  title: "Privacy Policy Generator",
                  href: "/privacy-policy-generator",
                  desc: "Generate privacy policies from detected services and data flows.",
                },
                {
                  title: "GDPR Compliance Tool",
                  href: "/gdpr-compliance",
                  desc: "Full GDPR documentation suite from code scanning.",
                },
                {
                  title: "Data Privacy Hub",
                  href: "/data-privacy",
                  desc: "Overview of global privacy regulations and compliance.",
                },
                {
                  title: "Terms of Service Generator",
                  href: "/terms-of-service-generator",
                  desc: "Generate terms of service based on your actual tech stack.",
                },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block border border-border rounded-xl px-5 py-4 hover:border-brand transition-colors"
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
