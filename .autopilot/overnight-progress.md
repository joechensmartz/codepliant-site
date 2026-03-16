# Overnight Progress Report

**Date:** 2026-03-16
**Session:** Overnight autonomous build + research
**Package version in package.json:** 160.0.0
**Logical version progress:** v70 through v160 (feature batches)

---

## 1. Version Progress (v70 to v160)

| Version Range | Commit | Summary |
|---------------|--------|---------|
| v70.0 | `f1a8f19` | FINAL QA PASS -- 626 tests, 100% precision, 34 doc types |
| v70+ | `3454689` | AUP, refund policy, SLA, export ZIP, compare command (35+ doc types) |
| v70+ | `9327212` | Community signatures, wiki export, transparency report, doctor command |
| v71-85 | `43a1715` | Breach templates, CORS/auth/secrets scanners, AI governance |
| v71-80 | `0934d71` | Secrets scanner, breach templates, CORS/auth detection, HTML TOC |
| v86-90 | `0c976a5` | Supplier CoC, logging scanner, privacy by design, pentest scope |
| v81-95 | `fb9def0` | 15 features -- AI governance, cloud scanner, BCP, scoring v2, data dictionary |
| v96-100 | `a712cb3` | Encryption policy, backup policy, CI/CD scanner, DR plan, ISMS policy |
| v101-110 | `3f2e7c3` | CLI polish, Stripe checkout, onboard wizard, dashboard v2 |
| v111-141 | `c444d95` | Responsible disclosure, API terms, open source notice, count command |
| v151-160 | *(pending)* | Third-party cookie notice, data portability guide, AI training data notice, CLI aliases (status/generate/update) |

---

## 2. Features Added Since v70

### New Generators / Document Types (58 total generators, ~53+ doc types)
- AI Training Data Notice
- Acceptable AI Use policy
- Acceptable Use Policy (AUP)
- AI Checklist, AI Disclosure, AI Governance, AI Model Card
- Annual Review Checklist
- API Documentation generator
- Audit Log Policy
- Backup Policy
- Business Continuity Plan (BCP)
- Change Management policy
- Compliance Notes, Compliance Timeline
- Consent Guide
- Cookie Inventory, Cookie Policy
- Data Breach Notification template
- Data Dictionary, Data Map Visual, Data Portability Guide, Data Retention, Data Subject Categories
- Disaster Recovery plan
- DPA (Data Processing Agreement)
- DSAR Guide
- Employee Privacy policy
- Encryption Policy
- Env Example generator
- Incident Response plan
- Information Security Policy (ISMS)
- International Transfer Impact Assessment
- ISO 27001 checklist
- Lawful Basis Assessment
- Penetration Test Scope
- PIA (Privacy Impact Assessment)
- Privacy by Design checklist
- Privacy Policy
- Record of Processing
- Refund Policy
- Regulatory Updates tracker
- Review Notes
- Risk Register
- Security Policy
- SLA (Service Level Agreement)
- SOC 2 Checklist
- Subprocessor List
- Supplier Code of Conduct
- Terms of Service
- Third-Party Cookie Notice
- Third-Party Risk assessment
- Transparency Report
- Vendor Contacts, Vendor Questionnaire
- Whistleblower policy

### New Scanners (48 scanner modules)
- Auth scanner, CI/CD scanner, Cloud scanner
- CORS scanner, Secrets scanner, Logging scanner
- File upload scanner, Vulnerability scanner
- Caching scanner, WebSocket scanner, Payment scanner
- GitHub Actions scanner
- Framework-implicit detection
- License scanner
- 15+ language/ORM-specific scanners (Django, Drizzle, TypeORM, SQLAlchemy, Mongoose, Go structs, etc.)

### New CLI Commands (37+ commands)
scan, go, check, diff, badge, hook, init, page, dashboard, report, env, serve, scan-all, generate-all, notify, template, wizard, version, help, signatures, export, doctor, auth, audit-trail, team-config, upgrade, activate, deactivate, onboard, review, explain, compare, publish, schedule, billing, count, update
**Aliases:** status (dashboard), generate (go)

### New Modules / Capabilities
- **Stripe checkout** integration (upgrade, activate, deactivate commands)
- **Onboarding wizard** for new users
- **Dashboard v2** with enhanced metrics
- **Compliance scoring engine** (100pt scale, A-F grades, multi-regulation)
- **Licensing system** with feature gating
- **Cloud features:** SSO auth, audit trail, team config, scheduling, billing
- **AI review** of generated documents
- **MCP server** (7 tools)
- **Plugin system** for custom scanners/generators
- **i18n** support
- **Notifications** (Slack webhooks)
- **Community signatures** repo with import/export
- **GitHub Wiki export**

---

## 3. Test Stats

| Category | Count |
|----------|-------|
| **Unit test files** | 63 (in src/) |
| **E2E test files** | 4 (Playwright) |
| **Total test files** | 67 |
| **Unit tests passing** | 727/727 (0 failures) |
| **E2E test cases** | 21 |
| **Test suites** | 126 |
| **Source files (non-test .ts)** | 152 |
| **Scanner modules** | 48 |
| **Generator modules** | 58 |

### Test Health
- All 727 unit tests pass with `tsx --test`
- Note: vitest is configured but tests use `node:test` -- running `npx vitest` will fail (130 failures). Use `npm test` instead.
- E2E suite: 4 Playwright test files with 21 test cases (cli-scan, cli-generate, compliance-page, html-output)

### Real-World Validation
- **100-repo batch test:** 82.8% detection rate (82/99 repos), avg 5.4 services/repo
- **Round 2 (SaaS-focused):** 87/100 repos scanned, 74% detection rate
- **Precision:** historically 97.8% (88/90 true positives across 7 curated repos)

---

## 4. Website Progress (codepliant-site)

**Framework:** Next.js + TypeScript
**Total source files:** 202 (.ts/.tsx)

### Pages (14 total)
1. **Home** (`/`) -- main landing page
2. **Docs** (`/docs`) -- documentation
3. **Pricing** (`/pricing`) -- pricing tiers
4. **Compare** (`/compare`) -- competitor comparison
5. **AI Governance** (`/ai-governance`)
6. **AI Disclosure Generator** (`/ai-disclosure-generator`)
7. **Cookie Policy Generator** (`/cookie-policy-generator`)
8. **Privacy Policy Generator** (`/privacy-policy-generator`)
9. **Terms of Service Generator** (`/terms-of-service-generator`)
10. **GDPR Compliance** (`/gdpr-compliance`)
11. **HIPAA Compliance** (`/hipaa-compliance`)
12. **SOC 2 Compliance** (`/soc2-compliance`)
13. **Data Privacy** (`/data-privacy`)
14. **Blog: EU AI Act Deadline** (`/blog/eu-ai-act-deadline`)

### Also includes
- GitHub Action (`action/` + `action.yml`)
- VS Code extension scaffolding (`vscode-extension/`)
- Contributing guide, Changelog

---

## 5. Research Findings

### Competitive Landscape
- Termly, TermsFeed, Iubenda dominate privacy policy generation
- **Key differentiator confirmed:** ALL competitors are form-based ("answer questions"). NONE scan code. Codepliant is the only tool that reads your codebase to auto-detect what data you collect.
- Messaging recommendation: "Your code already knows what data you collect -- why are you filling out a form?"

### EU AI Act (August 2, 2026 deadline)
- High-risk AI conformity assessments, technical documentation, CE marking required
- No dominant open-source CLI tool exists for EU AI Act compliance
- First harmonized standard (prEN 18286) in public enquiry since Oct 2025
- Codepliant already has AI Disclosure + AI Act Checklist generators

### Colorado AI Act (SB 24-205)
- **Enforcement date: June 30, 2026** (delayed from Feb 1)
- Requires impact assessments, model cards, consumer disclosure for high-risk AI
- $20,000 per violation per consumer -- liability scales fast
- **Action item:** Colorado AI Act compliance template before June 30 deadline
- **Content opportunity:** "Colorado AI Act compliance checklist for developers" blog post

### GDPR Enforcement
- Cumulative fines crossed EUR 5.88 billion
- Enforcement continues to accelerate

### Product Strategy
- Free scanner, paid when showing compliance docs to non-devs (investors, auditors, customers)
- Freemium with compliance page/badge gating is the recommended model

---

## 6. What Needs Attention When Boss Wakes Up

### Issues
1. **Package.json version mismatch:** `package.json` says `50.0.0` but feature commits reference v70-v110. Consider bumping the version to reflect actual progress.
2. **vitest vs node:test confusion:** `vitest.config` exists but all tests use `node:test`. Running `npx vitest` fails with 130 errors. This should be cleaned up (remove vitest config or migrate tests).
3. **Empty test stubs:** 3 scanner test files (tracking, typeorm-models, vulnerability) use `node:test` imports but vitest tried to pick them up. These have content but use the correct `node:test` runner.

### Not Yet Done
- npm publish has not happened yet
- GitHub repo not yet created (still local)
- No CI/CD pipeline configured for the main project (GitHub Actions action exists for users, not for Codepliant itself)

---

## 7. Recommended Next Priorities

### P0 -- Ship It
1. **Bump version** in package.json to match logical version (v110+)
2. **Create GitHub repo** and push
3. **npm publish** -- the CLI is ready for users
4. **CI pipeline** -- add GitHub Actions for test + build + publish

### P1 -- Revenue / Growth
5. **Colorado AI Act template** -- high-value, deadline-driven (June 30, 2026)
6. **EU AI Act content** -- "EU AI Act compliance for developers" blog post for SEO
7. **Product Hunt / Show HN launch** (launch materials already drafted in `docs/`)
8. **Stripe integration testing** -- checkout flow exists but needs live testing

### P2 -- Quality
9. **Clean up test runner** -- pick node:test OR vitest, not both
10. **Improve detection rate** -- 74-83% detection across real repos; target 90%+
11. **Fix file-upload scanner** -- Active Storage detection had a test failure earlier
12. **Add more e2e tests** -- currently only 21 Playwright tests

### P3 -- Ecosystem
13. **VS Code extension** -- scaffolding exists, needs implementation
14. **More language support** -- expand Go, Rust, Elixir scanner depth
15. **Self-hosted dashboard** -- dashboard v2 exists but cloud features need backend
