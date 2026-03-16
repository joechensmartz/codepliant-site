# Product Hunt Launch Copy

## Tagline (60 chars max)
Scan your code. Generate compliance docs. No questionnaires.

## Description (260 chars max)
Open-source CLI that reads your actual codebase -- dependencies, env vars, DB schemas, API routes -- and generates Privacy Policy, ToS, AI Disclosure, and 13 more document types. 10 ecosystems. Runs locally. Free forever. EU AI Act ready.

## Maker Comment

Hey Product Hunt! I'm the maker of Codepliant.

Every compliance tool I tried made me fill out a questionnaire: "What data do you collect? What third-party services do you use?" My code already knows the answers. So I built a CLI that reads the code instead of asking me.

Run `npx codepliant go` in your project root. It scans your dependencies, imports, environment variables, database schemas, and API routes. Then it generates 16 types of compliance documents -- from Privacy Policy and Terms of Service to AI Act Checklists and Data Processing Agreements.

A few things that make it different:

1. **Zero questionnaires.** It detects Stripe, Google Analytics, Auth0, OpenAI, Sentry, and dozens more from your actual code.

2. **EU AI Act ready.** The general-purpose AI provisions take effect Aug 2, 2026. If your app uses any AI/ML, you'll need an AI Disclosure. Codepliant is the only tool that generates this from code analysis.

3. **Runs locally.** Your source code never leaves your machine. Zero network calls. Zero accounts. Zero API keys.

4. **Stays in sync.** Run it in CI/CD. When your code changes, your compliance docs update automatically.

It's MIT licensed, free forever, and I'd love your feedback on what to build next.

## First Comment Strategy

**First comment (post immediately after launch):**

"Quick start for anyone who wants to try it right now:

```
npx codepliant go
```

That's it. Run it in any project directory. It takes about 10 seconds and outputs compliance docs to `./compliance/`.

Works with: Node.js, Python, Go, Ruby, Elixir, PHP, Java, Rust, .NET, and Django projects.

Generates: Privacy Policy, Terms of Service, Cookie Policy, AI Disclosure, AI Act Checklist, DPA, Security Policy, Data Retention Policy, and 8 more.

GitHub: https://github.com/codepliant/codepliant

Happy to answer any questions about the architecture, detection accuracy, or which regulations are covered!"

**Second comment (1-2 hours after launch):**

Reply to any question about accuracy or legal validity with:
"Codepliant gets you ~90% of the way there. It includes a disclaimer recommending legal review. Think of it like a linter for compliance -- it catches what's in your code, but a lawyer should review the final docs. The big win is that it stays in sync with your code automatically, so your docs don't go stale the moment you add a new dependency."

**Third comment (if traction is building):**

"For anyone using AI in their product: the EU AI Act general-purpose AI provisions kick in August 2, 2026. That's [X] days away. If you're using OpenAI, Anthropic, HuggingFace, LangChain, or any ML framework, you'll need an AI Disclosure document. `npx codepliant go` generates one based on what it finds in your code. Zero competitors are doing code-scan-based AI Act compliance right now."
