# Research Log

## 2026-03-15 — Initial research (pre-build)

### Competitive landscape
- Termly (2M+ users, $10-15/mo) — questionnaire-based, acquired by group.one
- Iubenda (113K users, ~$15M ARR) — questionnaire-based, acquired by team.blue
- Termageddon ($12/mo) — template-based, attorney oversight
- OneTrust ($800+/mo) — enterprise only
- iTerms.ai (free) — claims AI but very early
- None scan actual code. All use questionnaires.

### Key gap: EU AI Act (Aug 2026)
- Zero tools generate AI disclosure documents from code analysis
- Codepliant is first to do this

### Market size
- Privacy policy generator market: $260M-$500M (2025), growing 10-15% CAGR
- Projected: $590M-$1.2B by 2033

---

## 2026-03-15 — Deep research round (5 topics)

---

### 1. EU AI Act — Specific Requirements for SaaS Applications (2026)

**Date:** 2026-03-15
**Key deadline:** 2 August 2026 — full transparency obligations take effect

#### What must a SaaS app disclose about AI usage?

- **User interaction transparency:** Must inform users when they are interacting with an AI system (unless obvious). Disclosure must be visible and easy to understand.
- **AI-generated content labeling:** Generative AI output must be identifiable. Deep fakes and text published to inform the public must be clearly and visibly labeled.
- **Emotion recognition / biometric systems:** Must inform exposed individuals of system operation.
- **General Purpose AI (GPAI) models:** Must provide technical documentation, usage instructions, comply with Copyright Directive, and publish a summary of training data content.
- **High-risk AI systems:** Must inform users of AI interaction and provide detailed instructions on operation, limitations, and risks.

#### Transparency requirements for "limited risk" AI systems

- Chatbots must clearly inform users they are interacting with AI, not humans.
- Deepfakes and synthetic media require labeling to prevent deception.
- AI-generated content must be disclosed; summaries of copyrighted training data must be published.
- "Transparency means AI systems are developed and used in a way that allows appropriate traceability and explainability, while making humans aware that they communicate or interact with an AI system."

#### Penalties for non-compliance (tiered)

| Tier | Violation | Fine |
|------|-----------|------|
| 1 | Prohibited AI practices (Article 5) | Up to EUR 35M or 7% global annual turnover |
| 2 | High-risk AI / GPAI / notified body violations | Up to EUR 15M or 3% global annual turnover |
| 3 | Supplying incorrect info to authorities | Up to EUR 7.5M or 1.5% global annual turnover |

Enforcement by: national authorities, European Data Protection Supervisor, or European Commission.

**Sources:**
- [EU AI Act Article 50 — Transparency Obligations](https://artificialintelligenceact.eu/article/50/)
- [EU AI Act 2026 Updates — LegalNodes](https://www.legalnodes.com/article/eu-ai-act-2026-updates-compliance-requirements-and-business-risks)
- [EU AI Act Penalties — Holistic AI](https://www.holisticai.com/blog/penalties-of-the-eu-ai-act)
- [EU AI Act Compliance Playbook for SaaS Founders](https://scalevise.com/resources/eu-ai-act-compliance-saas/)
- [Article 99 — Penalties](https://artificialintelligenceact.eu/article/99/)
- [SecurePrivacy — EU AI Act 2026 Compliance Guide](https://secureprivacy.ai/blog/eu-ai-act-2026-compliance)

**Actionable for Codepliant:**
- AI Disclosure generator must cover: user interaction disclosure, content labeling, training data summary, system limitations
- Add EU AI Act risk-tier classification to scan output (detect if app uses prohibited practices, high-risk features, or limited-risk AI)
- Consider generating an "AI Act Compliance Checklist" document alongside AI Disclosure
- Penalties exceed GDPR — this is a strong selling point for urgency messaging

---

### 2. GDPR Compliance Document Requirements

**Date:** 2026-03-15

#### Required privacy policy clauses under GDPR

1. **Categories of personal data collected** (names, emails, IPs, etc.)
2. **Data collection methods** (cookies, tracking pixels, forms, etc.)
3. **Purposes of processing** (service provision, analytics, advertising, etc.)
4. **Lawful basis for processing** (consent, contract, legal obligation, vital interests, public task, legitimate interests)
5. **Consent mechanisms** (opt-in/opt-out methods, withdrawal instructions)
6. **Data retention and storage duration** (per category, with justification)
7. **Third-party data sharing** (list of third parties, data types, purposes, links to their policies)
8. **User rights** (access, rectification, erasure, portability, restriction, objection)
9. **Data protection measures** (technical and organizational security measures)
10. **Cookie information** (types, purposes, duration, collected data, preference management)
11. **Automated decision-making** (profiling, credit scoring, etc.)
12. **Data controller information** (identity and role)
13. **Data Protection Officer (DPO) contact** (name and contact info)
14. **Contact information** (2+ designated contact points for privacy inquiries)
15. **Policy update information** (effective date, last update date)

#### Data Processing Agreement (DPA) — when needed and what it must contain

**When required:** Whenever a data controller outsources personal data to a data processor (Article 28 GDPR). Any SaaS that processes user data on behalf of another business needs a DPA.

**Essential DPA elements:**
- Clear identification of controller and processor with key term definitions
- Comprehensive description of processing scope, data types, purposes, authorized activities
- Detailed processing instructions with clear boundaries
- Specific technical and organizational security measures with measurable standards
- Staff training and confidentiality agreement requirements
- Sub-processor management framework
- Procedures for data subject rights requests
- Data breach notification with prompt timelines
- Audit rights for controllers to verify processor compliance
- Data return/deletion processes upon relationship termination

**Template available:** EU Standard Contractual Clauses can serve as DPA template basis.

#### Cookie consent requirements (ePrivacy Directive)

- **Core rule (Article 5(3)):** Prior opt-in consent required before storing or accessing information on user devices, unless strictly necessary for service delivery.
- **Consent standard:** Must be freely given, specific, informed, and unambiguous.
- **Granular control:** Users must be able to accept analytics while rejecting marketing cookies (unbundled consent).
- **Equal access:** Users must be able to access the service even if they refuse non-essential cookies.
- **Easy withdrawal:** Withdrawing consent must be as easy as giving it.
- **Documentation:** Organizations must document and store consent received from users.
- **2026 enforcement reality:** EUR 150M fine issued to SHEIN by France's CNIL; UK ICO systematically reviewing top 1,000 websites. Regulators now have technical capabilities to verify compliance at scale.
- **Consent signaling:** 2026 requires complete consent signaling architecture — user preferences must flow from banner through CMP into every analytics tool, advertising platform, and tracking technology in real-time.

**Sources:**
- [CookieYes — Privacy Policy Checklist 2026](https://www.cookieyes.com/blog/privacy-policy-checklist/)
- [SecurePrivacy — GDPR Compliance 2026](https://secureprivacy.ai/blog/gdpr-compliance-2026)
- [GDPR.eu — Data Processing Agreement Template](https://gdpr.eu/data-processing-agreement/)
- [GDPR.eu — Cookies, GDPR, and ePrivacy Directive](https://gdpr.eu/cookies/)
- [SecurePrivacy — Cookie Consent Implementation 2026](https://secureprivacy.ai/blog/cookie-consent-implementation)
- [Termly — ePrivacy Directive Explained](https://termly.io/resources/articles/eprivacy-directive/)

**Actionable for Codepliant:**
- Privacy Policy generator must include all 15 required clauses — cross-reference scanner output to populate data categories, third parties, collection methods
- Consider adding DPA generation as a new document type (especially for B2B SaaS)
- Cookie Policy generator should include granular consent categories detected from code scanning (analytics SDKs, marketing pixels, etc.)
- Add consent signaling architecture recommendations to Cookie Policy output

---

### 3. US State Privacy Laws Landscape (2026)

**Date:** 2026-03-15

#### States with active comprehensive privacy laws (20 states as of 2026)

| State | Law | Key Effective Date |
|-------|-----|--------------------|
| California | CCPA/CPRA | Already active |
| Virginia | VCDPA | Already active |
| Colorado | CPA | Already active |
| Connecticut | CTDPA | Already active |
| Utah | UCPA | Already active |
| Iowa | ICDPA | Already active |
| Delaware | DPDPA | Already active |
| Florida | FDBR | Already active |
| Maryland | MODPA | Already active |
| Minnesota | MCDPA | Already active |
| Montana | MCDPA | Already active |
| Nebraska | NDPA | Already active |
| New Hampshire | NHPA | Already active |
| New Jersey | NJDPA | Already active |
| Oregon | OCPA | Already active |
| Tennessee | TIPA | Already active |
| Texas | TDPSA | Already active |
| Indiana | IDPA | Jan 1, 2026 |
| Kentucky | KCDPA | Jan 1, 2026 |
| Rhode Island | RIDPA | Jan 1, 2026 |

Additional effective dates in 2026: Connecticut amendments (Jul 1), Arkansas (Jul 1), Utah amendments (Jul 1), California data broker registration (Aug 1).

#### Common requirements across all state laws

- **Consumer rights:** Access, correct, delete, obtain copies of personal data
- **Opt-out rights:** Targeted advertising, sale of personal data, certain profiling
- **Sensitive data:** Opt-in consent required before processing sensitive data
- **Privacy notices:** Must provide clear, accessible privacy notices
- **Data protection assessments:** Required for high-risk processing activities
- **Universal opt-out mechanisms:** By 2026, 11+ states require recognition of universal opt-out signals (California, Colorado, Connecticut, Delaware, Maryland, Minnesota, Montana, New Hampshire, New Jersey, Oregon, Texas)
- **Enforcement:** Primarily through state Attorneys General; penalties range from $7,500/violation (Indiana, Kentucky) to $10,000/violation (Rhode Island)

**Notable:** Rhode Island has the lowest applicability threshold — covers entities processing data of 35,000+ consumers (or 10,000+ if >20% revenue from data sales).

**Sources:**
- [MultiState — 20 Comprehensive Privacy Laws in 2026](https://www.multistate.us/insider/2026/2/4/all-of-the-comprehensive-privacy-laws-that-take-effect-in-2026)
- [IAPP — US State Privacy Legislation Tracker](https://iapp.org/resources/article/us-state-privacy-legislation-tracker)
- [Baker Donelson — State Privacy Laws 2026](https://www.bakerdonelson.com/privacy-laws-ring-in-the-new-year-state-requirements-expand-across-the-us-in-2026)
- [Osano — US Data Privacy Laws 2026 Guide](https://www.osano.com/us-data-privacy-laws)
- [IAPP — New Year New Rules 2026](https://iapp.org/news/a/new-year-new-rules-us-state-privacy-requirements-coming-online-as-2026-begins)

**Actionable for Codepliant:**
- Privacy Policy generator should support state-specific clauses (especially CCPA "Do Not Sell" language)
- Add universal opt-out mechanism detection and recommendation
- Consider a "multi-state compliance matrix" output showing which states' laws apply based on detected data handling
- Rhode Island's low threshold means most SaaS apps will be covered — highlight this in marketing

---

### 4. Codepliant Competitor Check

**Date:** 2026-03-15

#### Direct competitors (code-scanning for compliance docs)

**Privado AI** — CLOSEST COMPETITOR
- Open-source privacy code scanning tool (https://www.privado.ai/open-source)
- Scans code to identify data flows and privacy risks
- Generates Play Store Data Safety, Apple Privacy Manifest, and Privacy Nutrition Label reports
- CLI runs locally (no code leaves machine) — similar approach to Codepliant
- Does NOT generate legal documents (privacy policies, ToS, etc.) — focuses on data mapping
- Has raised significant VC funding

**PrivacyGen** (https://privacygen.tech/)
- Scans codebases to detect privacy-related features, permissions, third-party SDKs, data collection points
- Generates compliant privacy policies from scan results
- Supports GDPR, CCPA, platform requirements
- THIS IS THE MOST DIRECT COMPETITOR — does what Codepliant does

**Zendata Code Scanner** (https://www.zendata.dev/code-scanner)
- AI-powered PII tracking through source code and development pipelines
- Focused on data vulnerability detection, not document generation

**TrustWorks** (https://www.trustworks.io/solutions/privacy-by-design-code-scanner)
- Code scanning for visibility on personal data in engineering products
- Enterprise-focused, not a CLI tool

**AIVory Guard** (Product Hunt)
- Embeds OWASP and regulatory checks in IDEs
- Flags AI-generated risks with one-click remediation and audit-ready reports
- More security-focused than compliance document generation

#### Compliance automation platforms (NOT code-scanning based)

- **Drata** — SOC 2/ISO continuous monitoring, evidence collection, Trust Centers
- **Vanta** — AI-powered compliance automation for security frameworks
- **CoAuditor** — AI-assisted internal audit control testing
- **Probo** — Open-source, expert-guided compliance path for startups

#### Codepliant differentiation assessment

| Feature | Codepliant | Privado AI | PrivacyGen | Termly/Iubenda |
|---------|-----------|------------|------------|----------------|
| Code scanning | Yes | Yes | Yes | No |
| Privacy Policy generation | Yes | No | Yes | Yes |
| ToS generation | Yes | No | No | Yes |
| AI Disclosure (EU AI Act) | Yes | No | No | No |
| Cookie Policy | Yes | No | No | Yes |
| Open source | Yes | Partially | Unknown | No |
| Runs locally (no data leaves) | Yes | Yes | Unknown | N/A |
| No runtime dependencies | Yes | No | Unknown | N/A |

**Sources:**
- [Privado AI — Privacy Code Scanning](https://www.privado.ai/solutions/privacy-code-scanning)
- [PrivacyGen](https://privacygen.tech/)
- [Zendata Code Scanner](https://www.zendata.dev/code-scanner)
- [Product Hunt — Compliance Software](https://www.producthunt.com/categories/compliance-software)
- [Panto AI — Code Compliance Platforms 2026](https://www.getpanto.ai/blog/ai-powered-code-compliance-platforms)

**Actionable for Codepliant:**
- **ALERT: PrivacyGen is a direct competitor** — investigate its capabilities, limitations, and community traction immediately
- Privado AI is adjacent but focused on data mapping, not legal document generation — still worth monitoring
- Codepliant's unique advantage remains: combined code scanning + multi-document generation (Privacy Policy + ToS + AI Disclosure + Cookie Policy) in a single CLI
- EU AI Act disclosure generation is still a unique feature — no competitor does this
- Emphasize "zero runtime dependencies" and "fully local" as differentiators vs PrivacyGen

---

### 5. Open Source Compliance Tools

**Date:** 2026-03-15

#### Privacy policy generators (open source)

**app-privacy-policy-generator** (https://github.com/nisrulz/app-privacy-policy-generator)
- Web app for generating generic or GDPR-compliant privacy policies for mobile apps
- Firebase-hosted, questionnaire-based (not code-scanning)
- Popular but limited in scope

**privacy-policy-generator by Tempest Solutions** (https://github.com/Tempest-Solutions-Company/privacy-policy-generator)
- Generates comprehensive policies based on business type, jurisdiction, data handling
- Supports GDPR, CCPA jurisdictions
- Client-side processing (no data leaves browser)
- Output in HTML or Markdown
- Questionnaire-based, not code-scanning

**privacy-policy-template** (https://github.com/ArthurGareginyan/privacy-policy-template)
- Markdown/TXT template with fill-in-the-blank placeholders
- Not automated, purely a template

**PrivacyGen** (https://privacygen.github.io/)
- GitHub Pages-hosted generator
- Free, open source

#### GDPR compliance / analysis tools (open source)

**gdpr-analyzer** (https://github.com/dev4privacy/gdpr-analyzer)
- Analyzes websites (not codebases) for GDPR compliance
- Checks source code and behavior of webpages
- Provides compliance scoring and reporting

**OpenSource Toolkit Privacy Policy Generator** (https://opensourcetoolkit.com/privacy-policy-generator)
- GDPR & CCPA compliant policy generation
- Web-based tool

#### Notable observations

- Most open-source tools are questionnaire-based or template-based
- No open-source tool combines code scanning with document generation the way Codepliant does
- gdpr-analyzer scans websites (external behavior) not codebases (source code) — different approach
- The open-source landscape is fragmented with many small, unmaintained projects

**Sources:**
- [GitHub — app-privacy-policy-generator](https://github.com/nisrulz/app-privacy-policy-generator)
- [GitHub — Tempest Solutions privacy-policy-generator](https://github.com/Tempest-Solutions-Company/privacy-policy-generator)
- [GitHub — gdpr-analyzer](https://github.com/dev4privacy/gdpr-analyzer)
- [GitHub — privacy-policy-template](https://github.com/ArthurGareginyan/privacy-policy-template)
- [GitHub Topics — privacy-policy-generator](https://github.com/topics/privacy-policy-generator)

**Actionable for Codepliant:**
- Codepliant remains unique in the open-source space for code-scanning-based document generation
- Could incorporate ideas from Tempest Solutions' jurisdiction-aware approach
- Consider contributing to or referencing gdpr-analyzer for website-side compliance (complementary tool)
- The fragmentation of existing tools validates demand — consolidation opportunity

---

### Research Round Summary — Key Takeaways

1. **EU AI Act is 5 months away (Aug 2, 2026)** — penalties up to EUR 35M / 7% turnover. Codepliant's AI Disclosure generator is a unique, timely feature. No competitor generates this.

2. **GDPR privacy policies need 15 specific clauses** — Codepliant should ensure all are covered in generated output. DPA generation is a potential new document type for B2B SaaS.

3. **20 US states now have privacy laws** — universal opt-out mechanism support is becoming table stakes. Multi-state compliance is a growing pain point.

4. **PrivacyGen is a new direct competitor** — needs immediate investigation. However, Codepliant's multi-document generation and EU AI Act coverage remain unique.

5. **Open source landscape is fragmented** — no tool matches Codepliant's approach. Good positioning for community adoption.

---

_Next research: Deep-dive into PrivacyGen capabilities, EU AI Act Article 50 implementation specifics, and DPA generation feasibility._
