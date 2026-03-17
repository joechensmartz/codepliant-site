import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy Generator from Code",
  description:
    "Generate a cookie policy by scanning your codebase. Codepliant detects cookies, tracking scripts, analytics SDKs, and session storage to produce an accurate cookie policy.",
  alternates: {
    canonical: "https://codepliant.dev/cookie-policy-generator",
  },
  openGraph: {
    title: "Cookie Policy Generator from Code",
    description:
      "Generate cookie policies from your actual codebase. Detect tracking, analytics, and cookies automatically.",
    url: "https://codepliant.dev/cookie-policy-generator",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function CookiePolicyGenerator() {
  return (
    <article className="py-20 px-6">
      <div className="max-w-[680px] mx-auto">
        <p className="text-sm font-medium text-brand mb-4 tracking-wide uppercase">
          Document Generator
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Cookie Policy Generator from Your Code
        </h1>
        <p className="text-lg text-ink-secondary mb-12">
          The ePrivacy Directive and GDPR require you to inform users about
          cookies and tracking technologies. Codepliant scans your codebase to
          detect cookie usage, analytics SDKs, tracking scripts, and session
          storage — then generates an accurate cookie policy.
        </p>

        <section className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            What Codepliant detects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Google Analytics / GA4",
              "Segment / Mixpanel / Amplitude",
              "Facebook Pixel / Meta SDK",
              "Session cookies",
              "Authentication tokens",
              "Local storage usage",
              "Third-party tracking scripts",
              "Consent management platforms",
            ].map((item) => (
              <div key={item} className="bg-surface-secondary rounded-xl px-4 py-3 text-sm">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface-secondary rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold mb-3">
            Generate your cookie policy
          </h2>
          <p className="text-ink-secondary text-sm mb-6">
            Free, open source, no account required.
          </p>
          <div className="bg-code-bg text-code-fg px-6 py-3 rounded-xl font-mono text-sm inline-block">
            npx codepliant go
          </div>
        </section>
      </div>
    </article>
  );
}
