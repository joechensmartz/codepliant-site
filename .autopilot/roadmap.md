# Codepliant Roadmap — 10 Major Versions

Each version = 15 minute iteration with research + development + testing + review.

## v1.0 — Quality Audit & Foundation Fix
- Audit all existing code for bugs, bad patterns, missing edge cases
- Review all generated document templates against actual legal requirements
- Fix import scanner false positives/negatives
- Ensure all 100 tests actually test meaningful behavior (not just "returns something")
- Clean up dead code, unused imports, inconsistent patterns

## v2.0 — GDPR-Compliant Privacy Policy
- Research: what do real GDPR-compliant privacy policies look like? (compare with Stripe, Vercel, Linear's policies)
- Rewrite privacy policy template to include all 15 GDPR-required clauses
- Add lawful basis detection (consent vs contract vs legitimate interest)
- Add data retention period recommendations per service type
- Add DPO contact section
- Test: generate policy, compare with real company policies

## v3.0 — EU AI Act Compliance (Production-Ready)
- Research: Article 50 transparency obligations in detail
- Research: how are real companies disclosing AI usage? (check OpenAI, Anthropic, Notion, Canva)
- Rewrite AI Disclosure to be actually useful (not generic boilerplate)
- Add risk classification logic (minimal/limited/high based on detected usage)
- Add AI Act compliance checklist output
- Test: verify disclosure covers all Article 50 requirements

## v4.0 — Multi-Jurisdiction Privacy Support
- Research: CCPA vs GDPR vs UK GDPR vs 20 US state laws — what's different?
- Add jurisdiction detection/config
- Privacy policy adapts sections based on jurisdiction
- Add "Do Not Sell" section for CCPA
- Add universal opt-out mechanism recommendation
- Generate jurisdiction-specific compliance notes
- Test: generate for US, EU, UK, compare differences

## v5.0 — Smart Scanning (Beyond Package Detection)
- Scan database schemas (Prisma schema.prisma, Drizzle schema, Django models.py)
- Detect what user data fields are stored (email, phone, address, etc.)
- Scan API routes to detect data intake endpoints
- Scan for hardcoded tracking pixels / analytics scripts in HTML
- Map data flows: collection → storage → third-party sharing
- Test with real open-source projects on GitHub

## v6.0 — Document Quality & Customization
- Add section-level customization (user can override any section)
- Add legal language quality review (compare with lawyer-written docs)
- Support multiple output formats (Markdown, HTML, plain text)
- Add document diffing — show what changed between generations
- Add "last reviewed" tracking
- Test: generate, modify, regenerate — verify custom sections preserved

## v7.0 — MCP Server Production-Ready
- Add all 5 document types to MCP tools
- Add incremental scan (only re-scan changed files)
- Add compliance status resource (MCP resource, not just tool)
- Integration test with Claude Code
- Integration test with Cursor
- Error handling, edge cases, timeout handling
- Test: full MCP workflow end-to-end

## v8.0 — CI/CD & GitHub Integration
- Production-ready GitHub Action with proper error handling
- PR comment bot — auto-comment when new services detected in a PR
- Compliance badge generation (like coverage badges)
- Pre-commit hook support
- Test: run action on real GitHub repo, verify PR comments

## v9.0 — Developer Experience & Onboarding
- Polished CLI output with progress indicators
- Interactive mode for first-time users
- Example project with all document types
- Comprehensive --help for each command
- Error messages with actionable suggestions
- Performance optimization (scan large projects <3s)
- Test: onboard a fresh user, measure time-to-value

## v10.0 — Launch Preparation
- npm package ready to publish
- GitHub repo with proper README, CONTRIBUTING, LICENSE
- Product Hunt launch page content
- HN "Show HN" post draft
- Demo video script
- Changelog from all versions
- Final full regression test
