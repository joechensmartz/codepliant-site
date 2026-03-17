import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service Generator from Code",
  description:
    "Generate terms of service by scanning your codebase. Codepliant creates accurate ToS documents based on your application's actual features and data practices.",
  alternates: {
    canonical: "https://codepliant.dev/terms-of-service-generator",
  },
  openGraph: {
    title: "Terms of Service Generator from Code",
    description:
      "Generate terms of service from your actual codebase. Accurate, automated, free.",
    url: "https://codepliant.dev/terms-of-service-generator",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function TermsOfServiceGenerator() {
  return (
    <article className="py-20 px-6">
      <div className="max-w-[680px] mx-auto">
        <p className="text-sm font-medium text-brand mb-4 tracking-wide uppercase">
          Document Generator
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Terms of Service Generator from Your Code
        </h1>
        <p className="text-lg text-ink-secondary mb-12">
          Your terms of service should reflect what your application actually
          does. Codepliant scans your codebase to understand your product's
          features, data practices, and third-party integrations, then generates
          accurate terms of service tailored to your application.
        </p>

        <section className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Sections Codepliant generates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Service description",
              "Acceptable use policy",
              "Account terms",
              "Payment terms",
              "Intellectual property",
              "Data handling",
              "Limitation of liability",
              "Termination clauses",
            ].map((item) => (
              <div key={item} className="bg-surface-secondary rounded-xl px-4 py-3 text-sm">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface-secondary rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold mb-3">
            Generate your terms of service
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
