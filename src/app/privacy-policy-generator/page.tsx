import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy Generator from Code",
  description:
    "Generate a privacy policy by scanning your codebase. Codepliant detects data collection, third-party services, and storage practices to produce accurate privacy policies automatically.",
  alternates: {
    canonical: "https://codepliant.dev/privacy-policy-generator",
  },
  openGraph: {
    title: "Privacy Policy Generator from Code",
    description:
      "Generate privacy policies from your actual codebase. Accurate, automated, free.",
    url: "https://codepliant.dev/privacy-policy-generator",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function PrivacyPolicyGenerator() {
  return (
    <article className="py-20 px-6">
      <div className="max-w-[680px] mx-auto">
        <p className="text-sm font-medium text-brand mb-4 tracking-wide uppercase">
          Document Generator
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Privacy Policy Generator from Your Code
        </h1>
        <p className="text-lg text-ink-secondary mb-12">
          Most privacy policy generators ask you to fill out a questionnaire.
          Codepliant takes a different approach — it scans your actual codebase
          to understand what data you collect, how you process it, and who you
          share it with. The result is an accurate privacy policy based on
          evidence, not guesswork.
        </p>

        <section className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            What Codepliant detects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Database schemas & ORM models",
              "Authentication flows",
              "Analytics & tracking SDKs",
              "Payment processors",
              "Email service providers",
              "Cloud storage services",
              "Third-party API integrations",
              "Cookie & session usage",
            ].map((item) => (
              <div key={item} className="bg-surface-secondary rounded-xl px-4 py-3 text-sm">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface-secondary rounded-2xl p-8 text-center mb-16">
          <h2 className="text-xl font-bold mb-3">
            Generate your privacy policy
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
