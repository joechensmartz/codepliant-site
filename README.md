# Codepliant

**Your app collects user data. Do you have the legal documents to prove it?**

If your code uses Stripe, OpenAI, Supabase, or any third-party service — you're legally required to have a privacy policy, terms of service, and (starting August 2026) an AI disclosure statement. Most developers either skip this, copy-paste a generic template, or pay $200/hr for a lawyer.

Codepliant reads your actual source code and generates every compliance document you need. No questionnaires. No lawyer. One command.

```bash
npx codepliant go
```

---

## Who is this for?

- **SaaS founders** who need compliance docs before launch but don't have a legal budget
- **Developers** who added Stripe/OpenAI/analytics and now need to update the privacy policy
- **CTOs** preparing for SOC 2, investor due diligence, or EU AI Act compliance
- **Agencies** managing compliance across multiple client projects
- **Open source maintainers** who want a SECURITY.md and privacy policy

## What problem does it solve?

**Existing tools ask you 50 questions about what data you collect.** The problem: most developers don't know exactly what their app collects — especially when AI tools generate half the code.

**Codepliant reads your code instead.** It finds `import Stripe from "stripe"` in your source, `OPENAI_API_KEY` in your .env, `email: String @unique` in your Prisma schema — and knows exactly what data flows through your app.

| | Codepliant | Termly | Iubenda | Lawyer |
|--|-----------|--------|---------|--------|
| Knows what your code actually does | Yes | No | No | No |
| Time to first document | 30 seconds | 30 minutes | 30 minutes | 2 weeks |
| Questionnaire required | No | Yes (50+ questions) | Yes | Yes (intake call) |
| Updates when code changes | Yes (`--watch`) | Manual | Manual | Another invoice |
| AI Act compliance | Yes | No | No | Maybe |
| Price | Free | $10-15/mo | $7-120/mo | $2,000+ |

---

## How it works

```bash
npx codepliant go
```

**Step 1: Scan** — reads package.json, source imports, .env files, database schemas, API routes

**Step 2: Detect** — identifies every third-party service, what data it processes, and what regulations apply

**Step 3: Generate** — creates all required compliance documents, customized to your exact tech stack

```
Detected 8 services:
  ✓ openai        → AI Disclosure required (EU AI Act)
  ✓ stripe        → Payment data, PCI DSS consideration
  ✓ supabase      → User auth data (email, sessions)
  ✓ posthog       → Analytics cookies, consent required
  ✓ sentry        → Error data, IP addresses
  ...

Generated 25 documents in legal/
  ✓ PRIVACY_POLICY.md       — GDPR Art. 13 compliant
  ✓ TERMS_OF_SERVICE.md     — SaaS terms with arbitration
  ✓ AI_DISCLOSURE.md        — EU AI Act Art. 50
  ✓ COOKIE_POLICY.md        — ePrivacy + consent
  ✓ SECURITY.md             — Vulnerability disclosure
  ... and 20 more

Compliance score: 100% (A)
Done in 24ms.
```

Everything runs locally. Zero network calls. No account needed.

---

## What it generates

**25+ documents** — not generic templates, but documents customized to your actual code:

| Category | Documents |
|----------|-----------|
| **Legal** | Privacy Policy, Terms of Service, Cookie Policy, DPA |
| **AI Compliance** | AI Disclosure (EU AI Act), AI Model Card, AI Act Checklist |
| **Security** | Security Policy, Incident Response Plan, Vulnerability Scan |
| **Operations** | DSAR Guide, Consent Guide, Data Retention Policy, Data Flow Map |
| **Audit** | SOC 2 Checklist, Privacy Impact Assessment, Third-Party Risk Assessment |
| **Reference** | Sub-Processor List, Vendor Contacts, Regulatory Updates, Compliance Timeline |

**10+ output formats** — Markdown, HTML, PDF, JSON, Notion, Confluence, embeddable widget, cookie consent banner, compliance badges

[Browse example output →](./examples/sample-output/)

---

## EU AI Act — August 2, 2026

If your app uses OpenAI, Claude, Gemini, or any AI service, the EU AI Act requires you to:

- Disclose AI usage to your users
- Mark AI-generated content as synthetic
- Document your AI risk classification
- Maintain AI model cards

**No other tool generates these documents from your code.** Codepliant detects your AI services and generates Article 50-compliant disclosures automatically.

Fines for non-compliance: up to **EUR 35 million or 7% of global turnover**.

---

## Quick start

```bash
# Generate all compliance documents
npx codepliant go

# Interactive setup (company name, DPO, jurisdictions)
npx codepliant init

# See what services are detected (no files generated)
npx codepliant scan

# Generate HTML compliance page for your website
npx codepliant go --format html

# Check if your compliance docs are up to date
npx codepliant check
```

## Configuration

```bash
npx codepliant init
```

Or create `.codepliantrc.json`:

```json
{
  "companyName": "Your Company",
  "contactEmail": "privacy@company.com",
  "jurisdictions": ["gdpr", "ccpa", "uk-gdpr"],
  "dpoEmail": "dpo@company.com"
}
```

## Supported ecosystems

JavaScript/TypeScript, Python, Go, Ruby, Elixir, PHP, Rust, Java, .NET, Django — plus framework-implicit detection for Rails, Laravel, Express, and FastAPI.

Scans: package.json, requirements.txt, go.mod, Gemfile, Cargo.toml, composer.json, pom.xml, Prisma/Drizzle/Mongoose/TypeORM schemas, GraphQL schemas, API routes, OpenAPI specs, Docker/K8s configs.

## CI/CD & Integrations

```yaml
# GitHub Action
- uses: codepliant/codepliant@v50
  with:
    fail-on-missing: true
```

```json
// MCP Server (Claude Code, Cursor, Windsurf)
{ "mcpServers": { "codepliant": { "command": "npx", "args": ["codepliant-mcp"] } } }
```

```bash
# Pre-commit hook
npx codepliant hook install
```

---

## Real-world results

Tested against 100 open-source projects:

- **97.8% precision** — when we detect something, it's real
- **24ms average scan time**
- **0 crashes** across all test repos
- **564 automated tests**, 0 failures

[See scan results for real projects →](./examples/real-projects/)

---

## Links

- [Sample Output](./examples/sample-output/) — see generated documents
- [Real Project Scans](./examples/real-projects/) — results from 10 OSS projects
- [Contributing](./CONTRIBUTING.md) — add signatures, scanners, generators
- [Changelog](./CHANGELOG.md)

## License

MIT — free forever, for any use.

---

*Zero network calls. Everything runs locally. Your code never leaves your machine. [Verify it yourself.](./src/scanner/no-network.test.ts)*
