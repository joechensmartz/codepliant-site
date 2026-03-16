import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Codepliant documentation. Learn how to install, configure, and use Codepliant to generate compliance documents from your codebase.",
  alternates: {
    canonical: "https://codepliant.dev/docs",
  },
};

export default function Docs() {
  return (
    <article className="py-20 px-6">
      <div className="max-w-[680px] mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Documentation
        </h1>
        <p className="text-lg text-muted mb-12">
          Get started with Codepliant in under a minute.
        </p>

        <section className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Quick start
          </h2>
          <div className="space-y-6 text-base text-muted leading-relaxed">
            <div className="bg-code-bg text-code-fg px-6 py-4 rounded-xl font-mono text-sm">
              <p># Install globally</p>
              <p>npm install -g codepliant</p>
              <p className="mt-4"># Or run directly with npx</p>
              <p>npx codepliant go</p>
            </div>
            <p>
              Run <code className="font-mono text-brand">codepliant go</code> in
              your project directory. Codepliant will scan your codebase and
              generate all applicable compliance documents in a{" "}
              <code className="font-mono text-brand">codepliant-output/</code>{" "}
              directory.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Commands</h2>
          <div className="space-y-4">
            {[
              {
                cmd: "codepliant go",
                desc: "Scan your codebase and generate all compliance documents.",
              },
              {
                cmd: "codepliant scan",
                desc: "Scan only. Output detected services and data practices as JSON.",
              },
              {
                cmd: "codepliant generate",
                desc: "Generate documents from a previous scan result.",
              },
            ].map((c) => (
              <div key={c.cmd} className="bg-surface rounded-xl p-5">
                <code className="font-mono text-brand text-sm">{c.cmd}</code>
                <p className="text-sm text-muted mt-1">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Supported ecosystems
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              "Node.js / TypeScript",
              "Python / Django",
              "Ruby on Rails",
              "Go",
              "Java / Spring",
              "PHP / Laravel",
              "Rust",
              ".NET / C#",
              "React / Next.js",
            ].map((eco) => (
              <div
                key={eco}
                className="bg-surface rounded-xl px-4 py-3 text-sm"
              >
                {eco}
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
