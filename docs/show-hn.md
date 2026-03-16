# Show HN: Codepliant -- Scan your code, generate compliance docs (Privacy Policy, ToS, AI Disclosure, and 13 more)

Hi HN, I built Codepliant because I was tired of filling out compliance questionnaires that ask me what data I collect -- when the answer is right there in my code.

**The problem:** Every compliance tool (Termly, Iubenda, etc.) makes you answer a 50-question form about your data practices. Then you update your code, the form is stale, and you're technically non-compliant. It's a manual process bolted onto an automated codebase.

**What Codepliant does:** It's a CLI that scans your actual source code -- dependencies, imports, env vars, database schemas, API routes, GraphQL schemas, ORM models -- and generates the compliance documents from what it finds. No questionnaires. No accounts. No API keys. Everything runs locally; your code never leaves your machine.

One command: `npx codepliant go`

**What it detects:**
- Third-party services (Stripe, Google Analytics, Auth0, OpenAI, Sentry, etc.) from package manifests, imports, and env vars
- Data collection patterns from ORM models (Mongoose, TypeORM, Drizzle, SQLAlchemy, Django models, Go structs)
- API routes and data flows
- Tracking pixels, cookie usage, analytics SDKs
- AI/ML framework usage for EU AI Act compliance

**What it generates (16 document types):**
Privacy Policy, Terms of Service, Cookie Policy, AI Disclosure, AI Act Checklist, DPA, Security Policy, Data Retention Policy, Compliance Notes, Consent Guide, DSAR Guide, Privacy Impact Assessment, SOC 2 Checklist, Subprocessor List, Incident Response Plan, Third-Party Risk Assessment

**10 ecosystems:** Node.js/TypeScript, Python, Go, Ruby, Elixir, PHP, Java, Rust, .NET, Django

**7 output formats:** Markdown, HTML, PDF, JSON, compliance page, badge, widget

**Why the EU AI Act matters here:** The general-purpose AI provisions kick in August 2, 2026. If your product touches AI (and most of ours do now), you need an AI Disclosure and an AI Act compliance checklist. No existing compliance tool generates these from code analysis. Codepliant scans for OpenAI, Anthropic, HuggingFace, LangChain, etc. and maps findings to the regulation's requirements.

**Technical details HN might appreciate:**
- Zero runtime dependencies (only devDependencies for build)
- Zero network calls -- deterministic, reproducible output
- Ships as an MCP server too, so AI coding assistants can generate compliance docs in-context
- GitHub Actions integration for CI/CD compliance checks
- Diff output to see what changed between scans
- Plugin system for custom scanners
- Written in TypeScript, ~36 test files, MIT licensed

**What it's not:** This is not a substitute for a lawyer. Generated documents include a disclaimer recommending legal review. But it gets you 90% of the way there in 2 minutes instead of 2 hours, and it stays in sync with your code.

GitHub: https://github.com/codepliant/codepliant

`npm install -g codepliant` or just `npx codepliant go`

Would love feedback. What document types or ecosystems should I prioritize next?
