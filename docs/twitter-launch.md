# Twitter/X Launch Thread

## Tweet 1 (Hook)

I got tired of filling out compliance questionnaires that ask what my code already knows.

So I built Codepliant -- an open-source CLI that scans your actual codebase and generates Privacy Policy, Terms of Service, AI Disclosure, and 13 more compliance documents.

One command: `npx codepliant go`

## Tweet 2 (The Problem)

Every compliance tool works like this:
- Fill out a 50-question form
- Update your code
- Form is stale
- You're technically non-compliant
- Repeat

Codepliant reads your dependencies, imports, env vars, DB schemas, and API routes. It knows what services you use because it can see them.

## Tweet 3 (The Differentiator)

What makes it different from Termly/Iubenda:

- Scans code, not questionnaires
- 16 document types (not just privacy policy)
- 10 ecosystems (JS, Python, Go, Ruby, Rust, etc.)
- Runs locally -- your code never leaves your machine
- Open source, MIT licensed, free forever
- EU AI Act ready (zero competitors here)

## Tweet 4 (AI Act Angle)

The EU AI Act general-purpose AI provisions take effect August 2, 2026.

If your app uses OpenAI, Anthropic, HuggingFace, or any ML framework, you'll need an AI Disclosure document.

Codepliant detects AI/ML usage in your code and generates the disclosure + an AI Act compliance checklist.

Nobody else does this from code analysis.

## Tweet 5 (CTA)

Try it right now:

```
npx codepliant go
```

No install. No account. No API key. 10 seconds.

GitHub: https://github.com/codepliant/codepliant

It also ships as an MCP server for AI coding assistants, and integrates with GitHub Actions for automated compliance in CI/CD.

Star it if this saves you time. Feedback welcome.
