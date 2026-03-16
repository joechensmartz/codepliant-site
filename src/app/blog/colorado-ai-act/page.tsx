import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Colorado AI Act: What SaaS Companies Need to Know",
  description:
    "Guide to the Colorado AI Act (SB 24-205) for SaaS companies. Covers the February 1, 2026 effective date, high-risk AI system requirements, algorithmic discrimination prevention, impact assessments, and compliance steps.",
  alternates: {
    canonical: "https://codepliant.dev/blog/colorado-ai-act",
  },
  openGraph: {
    title: "Colorado AI Act: What SaaS Companies Need to Know",
    description:
      "The Colorado AI Act takes effect February 1, 2026 with a compliance deadline of June 30, 2026. Learn what SaaS companies must do to comply with SB 24-205.",
    url: "https://codepliant.dev/blog/colorado-ai-act",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Colorado AI Act: What SaaS Companies Need to Know",
    description:
      "SB 24-205 compliance guide for SaaS companies. Deadlines, requirements, impact assessments, and practical steps.",
    images: ["/og-image.png"],
  },
};

function articleJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Colorado AI Act: What SaaS Companies Need to Know",
    description:
      "Guide to the Colorado AI Act (SB 24-205) for SaaS companies. Covers high-risk AI system requirements, algorithmic discrimination prevention, impact assessments, and compliance steps.",
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
      "@id": "https://codepliant.dev/blog/colorado-ai-act",
    },
  };
}

export default function ColoradoAiAct() {
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
            Colorado AI Act: What SaaS Companies Need to Know
          </h1>
          <p className="text-sm text-muted mb-12">
            Published March 16, 2026 &middot; 14 min read
          </p>

          <div className="prose-custom space-y-6 text-base text-muted leading-relaxed">
            {/* Introduction */}
            <p>
              Colorado Senate Bill 24-205, known as the Colorado AI Act, is the
              first comprehensive state-level AI regulation in the United
              States. Signed into law in May 2024, it takes effect on February
              1, 2026, with a compliance deadline of June 30, 2026 for
              companies to complete their initial impact assessments. If your
              SaaS application uses AI to make or substantially influence
              decisions that affect Colorado residents, this law applies to you.
            </p>
            <p>
              While the EU AI Act gets most of the attention, the Colorado AI
              Act is more immediately relevant for US-based SaaS companies. It
              creates concrete obligations around algorithmic discrimination
              prevention, impact assessments, transparency disclosures, and
              governance practices. And unlike federal AI guidance, it has
              enforcement teeth: the Colorado Attorney General can bring actions
              against non-compliant companies.
            </p>
            <p>
              This guide covers what the Colorado AI Act requires, who it
              applies to, what the deadlines are, and what your engineering and
              product teams need to do to comply.
            </p>

            {/* What is the Colorado AI Act */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              What is the Colorado AI Act (SB 24-205)?
            </h2>
            <p>
              The Colorado AI Act regulates &quot;high-risk artificial
              intelligence systems&quot; &mdash; AI systems that make or are a
              substantial factor in making consequential decisions about
              Colorado residents. It applies to both developers (companies that
              build AI systems) and deployers (companies that use AI systems in
              their products or operations).
            </p>
            <p>
              The Act focuses specifically on preventing algorithmic
              discrimination &mdash; the use of AI in ways that result in
              unlawful differential treatment based on protected
              characteristics including age, race, sex, disability, religion,
              sexual orientation, gender identity, and veteran status.
            </p>
            <p>
              Unlike broader AI regulations, the Colorado AI Act is narrow in
              scope but deep in requirements. It does not attempt to regulate
              all AI &mdash; only high-risk systems that affect consequential
              decisions. But for those systems, the obligations are substantial.
            </p>

            {/* Who it applies to */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              Who does the Colorado AI Act apply to?
            </h2>
            <p>
              The Act applies to two categories of entities:
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              Developers
            </h3>
            <p>
              A developer is any entity that creates, codes, or substantially
              modifies an AI system. If you build AI features into your SaaS
              product, you are likely a developer under the Act. This includes
              companies that fine-tune foundation models, build custom ML
              models, or create AI-powered features that influence decisions.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              Deployers
            </h3>
            <p>
              A deployer is any entity that uses a high-risk AI system to make
              consequential decisions. If your SaaS product is used by
              businesses in Colorado to make decisions about their customers or
              employees, both you and your customers may be deployers. This is
              critical for B2B SaaS: even if your company is not based in
              Colorado, if your customers use your AI features to make decisions
              about Colorado residents, the Act applies.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              What counts as a consequential decision?
            </h3>
            <p>
              The Act defines consequential decisions as those with material
              legal or similarly significant effects on individuals in these
              areas:
            </p>
            <div className="space-y-4">
              {[
                {
                  area: "Employment",
                  examples:
                    "Hiring, termination, promotion, compensation, performance evaluation, disciplinary actions. AI-powered resume screening, candidate ranking, and performance analytics all qualify.",
                },
                {
                  area: "Education",
                  examples:
                    "Admissions, financial aid, grading, disciplinary decisions, academic opportunity allocation. AI-driven tutoring systems that determine curriculum paths may qualify.",
                },
                {
                  area: "Financial services",
                  examples:
                    "Lending, credit, insurance underwriting, investment advice. AI-powered credit scoring, fraud detection that blocks transactions, and insurance pricing all qualify.",
                },
                {
                  area: "Housing",
                  examples:
                    "Tenant screening, rental pricing, mortgage qualification, property insurance. AI-powered tenant scoring tools and dynamic pricing algorithms qualify.",
                },
                {
                  area: "Healthcare",
                  examples:
                    "Treatment recommendations, insurance coverage decisions, resource allocation. AI diagnostic tools and triage systems qualify.",
                },
                {
                  area: "Legal services",
                  examples:
                    "Bail determinations, sentencing recommendations, case outcome predictions used to advise clients.",
                },
                {
                  area: "Government services",
                  examples:
                    "Benefits eligibility, licensing, permit approvals. AI systems used by government agencies to process applications.",
                },
              ].map((item) => (
                <div
                  key={item.area}
                  className="bg-surface rounded-xl p-5"
                >
                  <h3 className="font-semibold mb-1">{item.area}</h3>
                  <p className="text-sm text-muted">{item.examples}</p>
                </div>
              ))}
            </div>

            {/* Key deadlines */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              Key deadlines for SB 24-205 compliance
            </h2>
            <div className="space-y-4">
              {[
                {
                  date: "February 1, 2026",
                  event: "Act takes effect",
                  detail:
                    "The Colorado AI Act becomes law. All obligations begin to apply. Companies should already have compliance programs in progress.",
                },
                {
                  date: "June 30, 2026",
                  event: "Initial impact assessments due",
                  detail:
                    "Deployers must complete their first impact assessments for all high-risk AI systems in use. This is the hard compliance deadline most companies need to plan for.",
                },
                {
                  date: "Ongoing",
                  event: "Annual updates",
                  detail:
                    "Impact assessments must be updated at least annually, or whenever significant modifications are made to a high-risk AI system.",
                },
              ].map((milestone) => (
                <div
                  key={milestone.date}
                  className="bg-surface rounded-xl p-5"
                >
                  <h3 className="font-semibold mb-1">
                    {milestone.date} &mdash; {milestone.event}
                  </h3>
                  <p className="text-sm text-muted">{milestone.detail}</p>
                </div>
              ))}
            </div>

            {/* Developer obligations */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              Obligations for AI developers
            </h2>
            <p>
              If you build AI systems (including AI features in your SaaS
              product), the Colorado AI Act requires:
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              1. Reasonable care to protect against algorithmic discrimination
            </h3>
            <p>
              This is the Act&apos;s core requirement. You must use reasonable
              care to protect consumers from known or foreseeable risks of
              algorithmic discrimination. &quot;Reasonable care&quot; is
              assessed based on the totality of circumstances, including the
              size and complexity of the AI system, the nature and severity of
              potential harms, and the feasibility and cost of mitigation
              measures.
            </p>
            <p>
              Practically, this means testing your AI systems for bias across
              protected characteristics, documenting the training data and its
              known limitations, implementing safeguards against discriminatory
              outputs, and monitoring system behavior in production.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              2. Documentation and disclosure
            </h3>
            <p>
              Developers must make available to deployers and other developers:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                A general description of the AI system, including its intended
                uses and known limitations
              </li>
              <li>
                Documentation of the training data, including known biases or
                gaps
              </li>
              <li>
                The types of data the system processes and outputs it generates
              </li>
              <li>
                Known risks of algorithmic discrimination and mitigation
                measures
              </li>
              <li>
                How the system should be used, monitored, and maintained
              </li>
            </ul>
            <p>
              This documentation enables deployers to conduct their own impact
              assessments and implement appropriate safeguards.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              3. Public disclosure on your website
            </h3>
            <p>
              Developers must publish a statement on their website that
              describes the types of high-risk AI systems they develop, how
              they manage known or foreseeable risks of algorithmic
              discrimination, and the nature of the high-risk AI systems they
              have developed.
            </p>

            {/* Deployer obligations */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              Obligations for AI deployers
            </h2>
            <p>
              If your company uses high-risk AI systems (including AI features
              in SaaS products you subscribe to), you have deployer obligations:
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              1. Risk management policy
            </h3>
            <p>
              Deployers must implement a risk management policy and governance
              framework for high-risk AI systems. This includes designating
              personnel responsible for AI governance, establishing processes
              for identifying and mitigating discrimination risks, and training
              employees who interact with high-risk AI systems.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              2. Impact assessments
            </h3>
            <p>
              This is the most substantial deployer obligation. Before
              deploying a high-risk AI system &mdash; and at least annually
              thereafter &mdash; you must complete an impact assessment that
              includes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                The purpose, intended use cases, and deployment context of the
                AI system
              </li>
              <li>
                An analysis of whether the system poses risks of algorithmic
                discrimination
              </li>
              <li>
                The categories of data processed by the system
              </li>
              <li>
                Metrics used to evaluate system performance and fairness
              </li>
              <li>
                A description of the transparency measures provided to
                consumers
              </li>
              <li>
                Post-deployment monitoring plans
              </li>
            </ul>
            <p>
              Impact assessments must be retained for at least three years and
              provided to the Colorado Attorney General upon request.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              3. Consumer transparency
            </h3>
            <p>
              Deployers must notify consumers before a high-risk AI system
              makes a consequential decision about them. The notice must
              include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                That a high-risk AI system is being used to make or
                substantially assist in making a consequential decision
              </li>
              <li>
                A description of the system and how it is used in the decision
              </li>
              <li>
                Contact information for the deployer
              </li>
              <li>
                A description of the consumer&apos;s right to opt out (where
                applicable) and appeal
              </li>
            </ul>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              4. Consumer rights
            </h3>
            <p>
              When a high-risk AI system makes an adverse consequential
              decision, consumers have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                Receive an explanation of the decision, including the principal
                factors and logic that led to the outcome
              </li>
              <li>
                Appeal the decision and request human review
              </li>
              <li>
                Correct inaccurate data that was used in the decision
              </li>
            </ul>

            {/* Affirmative defense */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              The affirmative defense: NIST AI RMF alignment
            </h2>
            <p>
              The Colorado AI Act provides an important affirmative defense.
              Developers and deployers that comply with a recognized AI risk
              management framework &mdash; specifically the NIST AI Risk
              Management Framework (AI RMF) or a substantially equivalent
              framework &mdash; can use that compliance as a defense against
              enforcement actions.
            </p>
            <p>
              This is significant because it gives companies a clear path to
              compliance. If you implement the NIST AI RMF and can demonstrate
              adherence, you have a strong defense even if an algorithmic
              discrimination issue arises. Codepliant generates AI governance
              documentation aligned with the NIST AI RMF, giving you a starting
              point for this defense.
            </p>

            {/* How it differs from the EU AI Act */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              Colorado AI Act vs. EU AI Act: key differences
            </h2>
            <div className="space-y-4">
              {[
                {
                  dimension: "Scope",
                  comparison:
                    "The EU AI Act covers all AI systems with a risk-based classification. The Colorado Act focuses exclusively on high-risk AI systems that make consequential decisions.",
                },
                {
                  dimension: "Primary concern",
                  comparison:
                    "The EU AI Act addresses safety, transparency, and fundamental rights broadly. The Colorado Act focuses specifically on algorithmic discrimination.",
                },
                {
                  dimension: "Impact assessments",
                  comparison:
                    "Both require impact assessments for high-risk systems. The Colorado Act requires annual updates and three-year retention. The EU Act has more detailed conformity assessment procedures.",
                },
                {
                  dimension: "Enforcement",
                  comparison:
                    "The EU AI Act is enforced by national authorities with fines up to 7% of global turnover. The Colorado Act is enforced by the state Attorney General under existing consumer protection authority.",
                },
                {
                  dimension: "Affirmative defense",
                  comparison:
                    "The Colorado Act provides an explicit affirmative defense for NIST AI RMF compliance. The EU AI Act has no equivalent safe harbor.",
                },
              ].map((item) => (
                <div
                  key={item.dimension}
                  className="bg-surface rounded-xl p-5"
                >
                  <h3 className="font-semibold mb-1">{item.dimension}</h3>
                  <p className="text-sm text-muted">{item.comparison}</p>
                </div>
              ))}
            </div>

            {/* Compliance steps */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              Compliance action plan for SaaS companies
            </h2>
            <p>
              With the June 30, 2026 impact assessment deadline approaching,
              here is what your team should do now:
            </p>
            <ol className="list-decimal list-inside space-y-3 ml-2">
              <li>
                <strong>Identify your high-risk AI systems.</strong> Review
                every AI feature in your product. Does it make or substantially
                influence decisions about employment, education, finance,
                housing, healthcare, or other consequential areas? If yes, it
                is a high-risk system under the Act. Run Codepliant to generate
                an AI inventory from your codebase.
              </li>
              <li>
                <strong>Determine your role.</strong> Are you a developer
                (building the AI), a deployer (using the AI), or both? Most
                SaaS companies that build AI features into their products are
                both.
              </li>
              <li>
                <strong>Conduct impact assessments.</strong> For each high-risk
                AI system, document its purpose, data inputs, decision outputs,
                discrimination risks, fairness metrics, and mitigation
                measures. This assessment must be completed by June 30, 2026.
              </li>
              <li>
                <strong>Test for bias.</strong> Evaluate your AI systems for
                differential treatment across protected characteristics. Use
                statistical fairness metrics appropriate to your use case
                (demographic parity, equalized odds, calibration).
              </li>
              <li>
                <strong>Implement transparency notices.</strong> Build consumer-
                facing disclosures that inform users when high-risk AI is used
                in decisions affecting them. Include appeal and opt-out
                mechanisms.
              </li>
              <li>
                <strong>Establish governance.</strong> Designate AI governance
                responsibility, create risk management policies, and train
                relevant staff. Use the NIST AI RMF as your framework to take
                advantage of the affirmative defense.
              </li>
              <li>
                <strong>Generate documentation.</strong> Use Codepliant to
                generate AI governance documentation aligned with NIST AI RMF.
                This documentation supports both compliance and the affirmative
                defense.
              </li>
              <li>
                <strong>Plan for ongoing compliance.</strong> Impact assessments
                must be updated annually and whenever significant system changes
                occur. Integrate Codepliant into your CI/CD pipeline to keep
                documentation current.
              </li>
            </ol>

            {/* Other state AI laws */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              Beyond Colorado: the US state AI regulation landscape
            </h2>
            <p>
              Colorado is the first state to enact comprehensive AI regulation,
              but it will not be the last. Several other states have introduced
              or are considering similar legislation:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Illinois:</strong> The Illinois AI Video Interview Act
                already regulates AI in hiring. Broader AI legislation is under
                consideration.
              </li>
              <li>
                <strong>California:</strong> Multiple AI bills were introduced
                in 2024-2025, including proposals for algorithmic impact
                assessments and AI transparency requirements.
              </li>
              <li>
                <strong>New York City:</strong> Local Law 144 regulates
                automated employment decision tools, requiring annual bias
                audits.
              </li>
              <li>
                <strong>Connecticut:</strong> Enacted an AI governance
                framework in 2024 with disclosure and assessment requirements
                for state agencies.
              </li>
            </ul>
            <p>
              The trend is clear: AI regulation is expanding across the United
              States. Building compliance infrastructure now &mdash; impact
              assessment frameworks, transparency systems, governance processes
              &mdash; prepares you for the regulations that follow Colorado.
            </p>
          </div>

          {/* CTA */}
          <section className="bg-surface rounded-2xl p-8 text-center mt-16 mb-16">
            <h2 className="text-xl font-bold mb-3">
              Prepare for the Colorado AI Act deadline
            </h2>
            <p className="text-muted text-sm mb-6">
              Scan your codebase to generate AI governance documentation aligned
              with NIST AI RMF. Free, open source, no account required.
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
                  title: "AI Governance Framework Generator",
                  href: "/ai-governance",
                  desc: "Generate NIST AI RMF aligned governance documentation for your application.",
                },
                {
                  title: "EU AI Act: What Developers Need to Know",
                  href: "/blog/eu-ai-act-deadline",
                  desc: "Comprehensive guide to the EU AI Act deadline on August 2, 2026.",
                },
                {
                  title: "AI Disclosure Generator",
                  href: "/ai-disclosure-generator",
                  desc: "Generate AI transparency disclosures for your SaaS product.",
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
