# Codepliant

**Scan your code. Generate compliance documents.**

One command. Zero questionnaires. Everything runs locally.

```bash
npx codepliant go
```

<br>

## What it does

Codepliant reads your actual code — `package.json`, source imports, `.env` files, database schemas — and generates the compliance documents your project needs.

No forms to fill out. No accounts to create. No data leaves your machine.

```
$ npx codepliant go

Detected 8 services:
  ✓ openai (AI Service)
  ✓ stripe (Payment)
  ✓ @supabase/supabase-js (Authentication)
  ✓ posthog (Analytics)
  ✓ @sentry/nextjs (Monitoring)
  ✓ resend (Email)
  ...

Generated 25 documents in legal/
  ✓ PRIVACY_POLICY.md
  ✓ TERMS_OF_SERVICE.md
  ✓ AI_DISCLOSURE.md
  ✓ COOKIE_POLICY.md
  ✓ DATA_PROCESSING_AGREEMENT.md
  ✓ SECURITY.md
  ... and 19 more

Compliance score: 100% (A)
```

<br>

## Why Codepliant?

|  | Codepliant | Termly | Iubenda |
|--|-----------|--------|---------|
| Scans your actual code | Yes | No | No |
| Questionnaire required | No | Yes | Yes |
| Runs locally (no data leaves) | Yes | No | No |
| AI Act compliance | Yes | No | No |
| Open source | Yes | No | No |
| Documents generated | 25+ | 5 | 6 |
| Price | Free | $10-15/mo | $7-120/mo |

<br>

## Quick start

```bash
# Scan and generate
npx codepliant go

# Interactive setup (company name, DPO, jurisdictions)
npx codepliant init

# Just scan, don't generate
npx codepliant scan

# Generate HTML compliance page
npx codepliant go --format html
```

<br>

## What it generates

**Legal Documents** — Privacy Policy, Terms of Service, Cookie Policy, Data Processing Agreement, AI Disclosure, Security Policy

**Compliance Guides** — DSAR Handling Guide, Consent Management Guide, Incident Response Plan, Data Retention Policy, SOC 2 Checklist, Privacy Impact Assessment

**Technical Reports** — Data Flow Map, Data Classification, Vulnerability Scan, Env Audit, Sub-Processor List, Vendor Contacts, Compliance Notes, AI Model Card

**Output Formats** — Markdown, HTML, PDF, JSON, Notion, Confluence, compliance page, cookie consent banner, embeddable widget, SVG badges

<br>

## Supported ecosystems

JavaScript/TypeScript, Python, Go, Ruby, Elixir, PHP, Rust, Java, .NET, Django

Scans: package.json, requirements.txt, go.mod, Gemfile, Cargo.toml, composer.json, pom.xml, mix.exs, *.csproj, Prisma/Drizzle/Mongoose/TypeORM/Sequelize/Django/SQLAlchemy schemas, GraphQL schemas, API routes, OpenAPI specs, Docker/K8s configs

<br>

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
  "dpoEmail": "dpo@company.com",
  "outputFormat": "all"
}
```

<br>

## EU AI Act

The EU AI Act takes full effect **August 2, 2026**. Codepliant generates AI Disclosure documents and compliance checklists mapped to Article 50 transparency requirements — no other tool does this from code scanning.

<br>

## CI/CD

```yaml
# .github/workflows/compliance.yml
- uses: codepliant/codepliant@v50
  with:
    fail-on-missing: true
```

<br>

## MCP Server

```json
{
  "mcpServers": {
    "codepliant": {
      "command": "npx",
      "args": ["codepliant-mcp"]
    }
  }
}
```

<br>

## Sample output

See what Codepliant generates for a real SaaS project (OpenAI + Stripe + Supabase + PostHog + Sentry):

**[Browse 25 example documents →](./examples/sample-output/)**

<br>

## Links

- [Sample Output](./examples/sample-output/) — see the generated documents
- [Examples](./examples/) — test projects you can scan
- [Contributing](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)

<br>

## License

MIT

---

*Zero network calls. Everything runs locally. [Verify it yourself](./src/scanner/no-network.test.ts).*
